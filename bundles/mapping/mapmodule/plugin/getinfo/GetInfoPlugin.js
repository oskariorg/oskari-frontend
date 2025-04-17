import '../BasicMapModulePlugin';
import './event/DataForMapLocationEvent';

import './formatter/GetFeatureInfoFormatter';
import './request/GetFeatureInfoHandler';
import './request/GetFeatureInfoRequest';
import './request/GetFeatureInfoActivationRequest';
import './request/ResultHandlerRequest';
import './request/ResultHandlerRequestHandler';
import './request/SwipeStatusRequest';
import './request/SwipeStatusRequestHandler';

import { getGfiContent, getGfiResponseType, hasGfiData } from './GfiHelper';

const GFI_TYPE_APPLICATION_JSON = 'application/json';
/**
 * @class Oskari.mapframework.mapmodule.GetInfoPlugin
 *
 * Listens to map clicks and requests server for information about the map
 * location for all
 * the layers that have the flag queryable set to true and layer scales matching
 * the current zoom level.
 * Handles MapModulePlugin.GetFeatureInfoRequest and
 * MapModulePlugin.GetFeatureInfoActivationRequest.
 *
 * See
 * http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginGetInfoPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.GetInfoPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.mapmodule.GetInfoPlugin';
        me._name = 'GetInfoPlugin';

        me.infoboxId = 'getinforesult';
        me._pendingAjaxQuery = {
            busy: false,
            jqhr: null,
            timestamp: null
        };
        me._location = null;

        /* templates (from formatter/GetFeatureInfoFormatter.js) */
        me.template = {};
        var p;
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }
        this._requestedDisabled = new Set(); // ids that requested plugin to be disabled
        this._swipeStatus = {
            cropX: null,
            layerId: null
        };
    }, {

        /**
         * @private @method _initImpl
         *
         * Interface method for the module protocol
         *
         *
         */
        _initImpl: function () {
            Oskari.log('GetInfoPlugin').debug('init');
            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            if (wfsPlugin && !!wfsPlugin.isRenderModeSupported) {
                // Using wfs vector plugin
                this._ignoreUserLayers();
            }
        },

        _ignoreUserLayers: function () {
            this._config = this._config || {};
            const ignoredLayerTypes = new Set(this._config.ignoredLayerTypes || []);
            ignoredLayerTypes.add('WFS');
            ignoredLayerTypes.add('MYPLACES');
            ignoredLayerTypes.add('USERLAYER');
            this._config.ignoredLayerTypes = Array.from(ignoredLayerTypes);
        },
        // @override
        setEnabled: function (enabled, id) {
            const ids = this._requestedDisabled;
            // if request has id, store/remove it
            if (id) {
                if (enabled) {
                    ids.delete(id);
                } else {
                    ids.add(id);
                }
            }
            if (enabled && ids.size > 0) {
                Oskari.log('GetInfoPlugin').debug('Skipping enable plugin!! Plugin is disabled by: ' + Array.from(ids).join());
                return;
            }
            // toggle controls
            if (!enabled) {
                this._closeGfiInfo();
            }
            this._enabled = enabled;
        },

        _stopPluginImpl: function () {
            // hide infobox if open
            this._closeGfiInfo();
        },
        setLocation: function (lonlat) {
            this._location = lonlat;
        },
        getLocation: function () {
            return this._location;
        },
        resetLocation: function () {
            this._location = null;
        },

        _createEventHandlers: function () {
            return {
                'EscPressedEvent': function (evt) {
                    this._closeGfiInfo();
                },
                'MapClickedEvent': function (evt) {
                    if (!this.isEnabled()) {
                        // disabled, do nothing
                        return;
                    }
                    const click = evt.getLonLat();
                    const lonlat = this.getLocation();
                    // remove old popup
                    if (!lonlat || lonlat.lon !== click.lon || lonlat.lat !== click.lat) {
                        this._closeGfiInfo();
                    }
                    this.handleGetInfo(click);
                },
                'AfterMapLayerRemoveEvent': function (evt) {
                    this._refreshGfiInfo('remove', evt.getMapLayer().getId());
                },
                'AfterMapLayerAddEvent': function (evt) {
                    this._refreshGfiInfo();
                },
                'InfoBox.InfoBoxEvent': function (evt) {
                    this._handleInfoBoxEvent(evt);
                },
                'GetInfoResultEvent': function (evt) {
                    if (this.isEnabled()) {
                        this._handleInfoResult(evt.getData());
                    }
                },
                'Realtime.RefreshLayerEvent': function (evt) {
                    this._refreshGfiInfo('update', evt.getMapLayer().getId());
                }
            };
        },

        _createRequestHandlers: function () {
            var handler =
                Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler',
                    this
                );
            return {
                'MapModulePlugin.GetFeatureInfoRequest': handler,
                'MapModulePlugin.GetFeatureInfoActivationRequest': handler,
                'GetInfoPlugin.ResultHandlerRequest': Oskari.clazz.create(
                    'Oskari.mapframework.mapmodule.getinfoplugin.request.ResultHandlerRequestHandler',
                    this
                ),
                'GetInfoPlugin.SwipeStatusRequest': Oskari.clazz.create(
                    'Oskari.mapframework.mapmodule.getinfoplugin.request.SwipeStatusRequestHandler',
                    this
                )
            };
        },

        resetUI: function () {
            this._closeGfiInfo();
        },

        /**
         * @method _cancelAjaxRequest
         * @private
         * Cancels any GetInfo ajax request that might be executing.
         */
        _cancelAjaxRequest: function () {
            var me = this;
            if (!me._pendingAjaxQuery.busy) {
                return;
            }
            var jqhr = me._pendingAjaxQuery.jqhr;
            me._pendingAjaxQuery.jqhr = null;
            if (!jqhr) {
                return;
            }
            Oskari.log('GetInfoPlugin').debug('Abort jqhr ajax request');
            jqhr.abort();
            jqhr = null;
            me._pendingAjaxQuery.busy = false;
        },

        /**
         * Constructs a layer list for valid layers for info queries
         *
         * @method _buildLayerIdList
         * @private
         * @param {Oskari.Layer[]} layers to build the list from (optional)
         * @return {Number[] | String[]} array of qualified layer ids.
         */
        _buildLayerIdList: function (layers = []) {
            var me = this;
            var layerIds = layers
                .filter(layer => me._isQualified(layer))
                .map(layer => layer.getId());

            return layerIds || [];
        },

        _isQualified: function (layer) {
            return (!this._isIgnoredLayerType(layer) &&
                layer.getQueryable &&
                layer.getQueryable() &&
                layer.isInScale(this.getSandbox().getMap().getScale()) &&
                layer.isVisible() &&
                layer.getOpacity() !== 0);
        },

        /**
         * Checks if layer's type is ignored
         *
         * @method _isIgnoredLayerType
         * @private
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         * @return {Boolean} true if layer's type is ignored
         */
        _isIgnoredLayerType: function (layer) {
            const ignored = (this._config || {}).ignoredLayerTypes;
            if (!Array.isArray(ignored)) {
                return false;
            }
            return ignored.some(type => layer.isLayerOfType(type));
        },

        /**
         * @method _startAjaxRequest
         * @private
         * Sets internal flags to show that an ajax request is executing currently.
         * @param {Number} dteMs current time in milliseconds
         */
        _startAjaxRequest: function (dteMs) {
            this._pendingAjaxQuery.busy = true;
            this._pendingAjaxQuery.timestamp = dteMs;
        },

        /**
         * @method _finishAjaxRequest
         * @private
         * Clears internal flags of executing ajax requests so we are clear to start
         * another.
         */
        _finishAjaxRequest: function () {
            this._pendingAjaxQuery.busy = false;
            this._pendingAjaxQuery.jqhr = null;
            Oskari.log('GetInfoPlugin').debug('Finished jqhr ajax request');
        },

        /**
         * @method _notifyAjaxFailure
         * @private
         * Prints debug about ajax call failure.
         */
        _notifyAjaxFailure: function () {
            Oskari.log('GetInfoPlugin').debug('GetFeatureInfo AJAX failed');
        },

        /**
         * @method _isAjaxRequestBusy
         * @private
         * Checks internal flags if and ajax requests is currently executing.
         * @return {Boolean} true if an ajax request is executing currently
         */
        _isAjaxRequestBusy: function () {
            return this._pendingAjaxQuery.busy;
        },

        /**
         * @method getFeatureInfoUrl
         * Get URL using openlayers getFeatureInfoUrl
         * This handles x and y correctly when the map is rotated etc
         * @param {Object} coordinates to query
         * @returns {String} url for GFI queries
         */
        _getFeatureInfoUrl: function (coordinate) {
            const projection = this.getMapModule().getProjection();
            const resolution = this.getMapModule().getResolution();
            for (const layer of this.getSandbox().getMap().getLayers()) {
                for (const olLayer of this.getMapModule().getOLMapLayers(layer.getId())) {
                    if (olLayer.getSource()['getFeatureInfoUrl'] !== undefined) {
                        return olLayer.getSource().getFeatureInfoUrl([coordinate.lon, coordinate.lat], resolution, projection);
                    }
                }
            }
        },

        /**
         * @method handleGetInfo
         * Send ajax request to get feature info for given location for any
         * visible/valid/queryable layers.
         * Backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
         * (or in the future WMTS GetFeatureInfo). Aborts any pending ajax query.
         *
         * @param {OpenLayers.LonLat}
         *            lonlat coordinates
         */
        handleGetInfo: function (lonlat, layers) {
            const me = this;
            const dteMs = (new Date()).getTime();
            const requestedLayers = layers || me.getSandbox().findAllSelectedMapLayers();
            let layerIds = me._buildLayerIdList(requestedLayers);
            const mapVO = me.getSandbox().getMap();
            const px = me.getMapModule().getPixelFromCoordinate(lonlat);
            if (this._swipeStatus.layerId && px.x > this._swipeStatus.cropX) {
                layerIds = layerIds.filter(l => l !== this._swipeStatus.layerId);
            }

            if (layerIds.length === 0) {
                return;
            }

            const additionalParams = requestedLayers
                .filter((layer) => layerIds.includes(layer.getId()))
                .reduce((result, layer) => {
                    const params = layer.getParams();
                    if (typeof params !== 'object') {
                        return result;
                    }

                    result[layer.getId()] = {
                        ...params,
                        STYLES: layer.getCurrentStyle().getName()
                    };
                    return result;
                }, {});

            if (me._pendingAjaxQuery.busy &&
                me._pendingAjaxQuery.timestamp &&
                dteMs - me._pendingAjaxQuery.timestamp < 500) {
                Oskari.log('GetInfoPlugin').debug(
                    'GetFeatureInfo NOT SENT (time difference < 500ms)'
                );
                return;
            }

            me._cancelAjaxRequest();
            me._startAjaxRequest(dteMs);
            let featureInfoUrl = this._getFeatureInfoUrl(lonlat);
            let x = Math.round(px.x);
            let y = Math.round(px.y);
            let width = mapVO.getWidth();
            let height = mapVO.getHeight();
            let bbox = mapVO.getBboxAsString();
            if (featureInfoUrl) {
                if (featureInfoUrl.startsWith('/')) {
                    // fixes urls starting with /action or one without protocol in general //somedomain.com
                    // we don't really care about the domain, we are only interested in getting parts of the querystring
                    featureInfoUrl = 'https://' + window.location.hostname + featureInfoUrl;
                }
                const url = new URL(featureInfoUrl);
                if (url.searchParams.get('I')) {
                    x = Number.parseInt(url.searchParams.get('I'), 10);
                } else if (url.searchParams.get('X')) {
                    x = Number.parseInt(url.searchParams.get('X'), 10);
                }
                if (url.searchParams.get('J')) {
                    y = Number.parseInt(url.searchParams.get('J'), 10);
                } else if (url.searchParams.get('Y')) {
                    y = Number.parseInt(url.searchParams.get('Y'), 10);
                }
                width = Number.parseInt(url.searchParams.get('WIDTH'), 10);
                height = Number.parseInt(url.searchParams.get('HEIGHT'), 10);
                bbox = url.searchParams.get('BBOX');
            }

            const payload = {
                layerIds: layerIds.join(','),
                projection: me.getMapModule().getProjection(),
                x,
                y,
                lon: lonlat.lon,
                lat: lonlat.lat,
                width,
                height,
                bbox,
                zoom: mapVO.getZoom(),
                srs: mapVO.getSrsName(),
                params: JSON.stringify(additionalParams)
            };

            jQuery.ajax({
                beforeSend: function (x) {
                    // save ref to pending request
                    me._pendingAjaxQuery.jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/json;charset=UTF-8');
                    }
                },
                success: function (resp) {
                    if (me._isAjaxRequestBusy()) {
                        const data = resp.data || [];
                        data.forEach((datum) => {
                            const gfiType = datum?.gfiType || null;
                            let features = [datum];
                            if (gfiType === GFI_TYPE_APPLICATION_JSON && !me.hasCustomFormatter(datum)) {
                                const geoJSON = JSON.parse(datum?.content);
                                features = geoJSON?.features?.map(feature => feature.properties) || null;
                            }
                            me._handleInfoResult({
                                layerId: datum.layerId,
                                features,
                                lonlat,
                                gfiType,
                                via: 'ajax'
                            });
                        });
                    }

                    me._finishAjaxRequest();
                },
                error: function () {
                    me._finishAjaxRequest();
                    me._notifyAjaxFailure();
                },
                always: function () {
                    me._finishAjaxRequest();
                },
                complete: function () {
                    me._finishAjaxRequest();
                },
                data: {
                    ...payload
                },
                type: 'POST',
                dataType: 'json',
                url: Oskari.urls.getRoute('GetFeatureInfoWMS')
            });
        },

        addInfoResultHandler: function (callback) {
            this._showGfiInfo = callback;
        },

        setSwipeStatus: function (layerId, cropX) {
            this._swipeStatus = {
                layerId,
                cropX
            };
        },

        /**
         * Sends DataForMapLocationEvent.
         *
         * @method _sendDataForMapLocationEvent
         * @private
         * @param  {Object} data
         */
        _sendDataForMapLocationEvent: function (data) {
            const me = this;
            // Loop all GFI response data and send GFIResultEvent for all features
            data.features.forEach(feature => {
                const content = getGfiContent(feature);
                const type = getGfiResponseType(feature);
                if (hasGfiData(content, type)) {
                    // send event if layer get gfi for selected coordinates
                    // WFS layer layerId come from data object other layers layerId come from feature object
                    const dataForMapLocationEvent = Oskari.eventBuilder(
                        'DataForMapLocationEvent'
                    )(data.lonlat.lon, data.lonlat.lat, content, data.layerId || feature.layerId, type);
                    me.getSandbox().notifyAll(dataForMapLocationEvent);
                }
            });
        },

        /**
         * Toggle GFI popup visibility when selected/unselected "Hide user interface (Use RPC interface)" in publisher
         * @method publisherHideUI
         * @param {Boolean} hide hide UI
         */
        publisherHideUI: function (hide) {
            this._config.noUI = hide;
            if (hide === true && this.getSandbox().hasHandler('InfoBox.HideInfoBoxRequest')) {
                const reqBuilder = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest');
                this.getSandbox().request(this, reqBuilder(this.infoboxId));
            }
        },
        /**
         * Formats the given data and sends a request to show infobox.
         *
         * @method _handleInfoResult
         * @private
         * @param  {Object} data
         */
        _handleInfoResult: function (data) {
            const content = [];
            const contentData = {};
            let fragments = [];

            if (data.via === 'ajax' && (data?.gfiType !== GFI_TYPE_APPLICATION_JSON || this.hasCustomFormatter(data))) {
                fragments = this._parseGfiResponse(data);
            } else {
                fragments = this._formatWFSFeaturesForInfoBox(data);
            }

            this._sendDataForMapLocationEvent(data);

            if (fragments?.length) {
                contentData.html = this._renderFragments(fragments);
                contentData.layerId = fragments[0].layerId;
                content.push(contentData);
            }
            const { colourScheme, font, noUI } = this._config || {};

            // GFIPlugin.config.noUI: true means the infobox for GFI content shouldn't be shown
            // DataForMapLocationEvent is still triggered allowing RPC apps to customize and format the data that is shown.
            if (noUI === true) {
                return;
            }

            this._showGfiInfo(content, data, this.formatters, {
                colourScheme,
                font,
                title: this._loc.title,
                infoboxId: this.infoboxId,
                hidePrevious: false
            });
        },

        /**
         * Closes the infobox with GFI data
         *
         * @method _closeGfiInfo
         * @private
         */
        _closeGfiInfo: function () {
            if (this.getSandbox().hasHandler('InfoBox.HideInfoBoxRequest')) {
                var reqBuilder = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest');
                this.getSandbox().request(this, reqBuilder(this.infoboxId));
            }
            this.resetLocation();
        },
        /**
         * Shows given content in given location using infobox bundle
         *
         * @method _showGfiInfo
         * @private
         * @param {Object[]} content infobox content array
         * @param {data} data.lonlat location for the GFI data
         * @param {formatters} formatter functions
         * @param {params} params for request
         */
        _showGfiInfo: function (content, data, formatters, params) {
            var reqBuilder = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest');
            var options = {
                hidePrevious: params.hidePrevious === undefined ? true : params.hidePrevious,
                colourScheme: params.colourScheme,
                font: params.font,
                showCoordinates: this._config?.showCoordinates,
                keepOnScreen: true
            };
            if (reqBuilder) {
                var request = reqBuilder(
                    params.infoboxId,
                    params.title,
                    content,
                    data.lonlat,
                    options
                );
                this.setLocation(data.lonlat);
                this.getSandbox().request(this, request);
            }
        },

        /**
         * Sends a request to refresh infobox content.
         *
         * @method _refreshGfiInfo
         * @private
         * @param  {String} operation currently only 'remove' supported (optional)
         * @param  {String} contentId (optional)
         */
        _refreshGfiInfo: function (operation, contentId) {
            var reqB,
                req;

            if (this.getLocation()) {
                reqB = Oskari.requestBuilder(
                    'InfoBox.RefreshInfoBoxRequest'
                );

                if (reqB) {
                    req = reqB(this.infoboxId, operation, contentId);
                    this.getSandbox().request(this, req);
                }
            }
        },

        /**
         * Sends a 'MapClickEvent' if there's an infobox opened by this plugin.
         * Effectively refreshes all the content of the infobox with added layers.
         *
         * @method _handleInfoBoxEvent
         * @private
         * @param  {Object} evt
         */
        _handleInfoBoxEvent: function (evt) {
            var sandbox = this.getSandbox(),
                lonlat = this.getLocation(),
                contentId = evt.getContentId(),
                contentLayer,
                clickEventB,
                clickEvent;
            if (evt.getId() === this.infoboxId &&
                evt.isOpen() && lonlat) {
                if (contentId) {
                    // If there's a specific layer id and it's selected
                    // we can directly get info for that
                    contentLayer = sandbox.findMapLayerFromSelectedMapLayers(
                        contentId
                    );
                    if (contentLayer) {
                        this.handleGetInfo(lonlat, [contentLayer]);
                    }
                } else {
                    // Otherwise, we need to actually send `MapClickedEvent`
                    // and not just call `handleGetInfo` since then
                    // we'd only get the WMS feature info.
                    clickEventB = Oskari.eventBuilder('MapClickedEvent');
                    clickEvent = clickEventB(lonlat);
                    // Timeout needed since the layer plugins haven't
                    // necessarily done their job of adding the layer yet.
                    setTimeout(function () {
                        sandbox.notifyAll(clickEvent);
                    }, 0);
                }
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
