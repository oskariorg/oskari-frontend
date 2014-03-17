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
Oskari.clazz.define('Oskari.mapframework.mapmodule.GetInfoPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config, locale) {
        var me = this;
        me.config = config;
        me._locale = locale;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me.enabled = true;
        me.infoboxId = 'getinforesult';
        me._pendingAjaxQuery = {
            busy: false,
            jqhr: null,
            timestamp: null
        };
        me.clickLocation = null;

        /* templates */
        me.template = {};
        var p;
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }
    }, {
        /** @static @property __name plugin name */
        __name: 'GetInfoPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         * reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule}
         * reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this;

            me._sandbox = sandbox;
            me._sandbox.printDebug("[GetInfoPlugin] init");
            me.getGFIHandler = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.getinfo.GetFeatureInfoHandler', me);
        },
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            if (sandbox && sandbox.register) {
                me._sandbox = sandbox;
            }
            me._map = me.getMapModule().getMap();

            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }
            me._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoRequest', me.getGFIHandler);
            me._sandbox.addRequestHandler('MapModulePlugin.GetFeatureInfoActivationRequest', me.getGFIHandler);
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            // hide infobox if open
            me._closeGfiInfo();

            if (sandbox && sandbox.register) {
                me._sandbox = sandbox;
            }
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }
            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
            me.clickLocation = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @method setEnabled
         * Enables or disables gfi functionality
         * @param {Boolean} blnEnabled
         *          true to enable, false to disable
         */
        setEnabled: function (blnEnabled) {
            this.enabled = (blnEnabled === true);
            // close existing if disabled
            if (!this.enabled) {
                this._closeGfiInfo();
            }
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'EscPressedEvent': function (evt) {
                this._closeGfiInfo();
            },
            'MapClickedEvent': function (evt) {
                if (!this.enabled) {
                    // disabled, do nothing
                    return;
                }
                this.clickLocation = {
                    lonlat: evt.getLonLat()
                };
                this.handleGetInfo(this.clickLocation.lonlat);
            },
            'AfterMapMoveEvent': function (evt) {
                this._cancelAjaxRequest();
            },
            'AfterMapLayerRemoveEvent': function(evt) {
                this._refreshGfiInfo('remove', evt.getMapLayer().getId());
            },
            'AfterMapLayerAddEvent': function(evt) {
                this._refreshGfiInfo();
            },
            'InfoBox.InfoBoxEvent': function(evt) {
                this._handleInfoBoxEvent(evt);
            },
            'GetInfoResultEvent': function(evt) {
                this._handleInfoResult(evt.getData());
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var me = this;
            return this.eventHandlers[event.getName()].apply(this, [event]);
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
            this._sandbox.printDebug("[GetInfoPlugin] Abort jqhr ajax request");
            jqhr.abort();
            jqhr = null;
            me._pendingAjaxQuery.busy = false;
        },

        /**
         * Constructs a layer list for valid layers for info queries
         * 
         * @method _buildLayerIdList
         * @private
         * @return
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _buildLayerIdList: function () {
            var me = this,
                selected = me._sandbox.findAllSelectedMapLayers(),
                layerIds;

            layerIds = _.chain(selected)
                .filter(function(layer) {
                    return me._isQualified(layer);
                })
                .map(function(layer) {
                    return layer.getId();
                })
                .value()
                .join(',');

            return layerIds || null;
        },
        _isQualified: function(layer) {
            return (!this._isIgnoredLayerType(layer) &&
                    layer.getQueryable &&
                    layer.getQueryable() &&
                    layer.isInScale(this._sandbox.getMap().getScale()) &&
                    layer.isVisible());
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
            return _.any((this.config || {}).ignoredLayerTypes, function(type) {
                return layer.isLayerOfType(type);
            });
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
            this._sandbox.printDebug("[GetInfoPlugin] finished jqhr ajax request");
        },
        /**
         * @method _notifyAjaxFailure
         * @private
         * Prints debug about ajax call failure.
         */
        _notifyAjaxFailure: function () {
            this._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo AJAX failed");
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
         * @method handleGetInfo
         * Send ajax request to get feature info for given location for any
         * visible/valid/queryable layers.
         * Backend processes given layer (ids) as WMS GetFeatureInfo or WFS requests
         * (or in the future WMTS GetFeatureInfo). Aborts any pending ajax query.
         *
         * @param {OpenLayers.LonLat}
         *            lonlat coordinates
         */
        handleGetInfo: function (lonlat) {
            var me = this,
                dteMs = (new Date()).getTime(),
                layerIds = me._buildLayerIdList(),
                ajaxUrl = this._sandbox.getAjaxUrl(),
                mapVO = me._sandbox.getMap(),
                olMap = me.mapModule.getMap(),
                px = olMap.getViewPortPxFromLonLat(lonlat);

            if (!layerIds) return;
            if (me._pendingAjaxQuery.busy &&
                me._pendingAjaxQuery.timestamp &&
                dteMs - me._pendingAjaxQuery.timestamp < 500) {
                me._sandbox.printDebug("[GetInfoPlugin] GetFeatureInfo NOT SENT (time difference < 500ms)");
                return;
            }

            me._cancelAjaxRequest();
            me._startAjaxRequest(dteMs);

            jQuery.ajax({
                beforeSend: function (x) {
                    me._pendingAjaxQuery.jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (resp) {
                    if (me._isAjaxRequestBusy()) {
                        _.each(resp.data, function(datum) {                            
                            me._handleInfoResult({
                                features: [datum],
                                lonlat: lonlat,
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
                    layerIds: layerIds,
                    projection: me.mapModule.getProjection(),
                    x: px.x,
                    y: px.y,
                    lon: lonlat.lon,
                    lat: lonlat.lat,
                    width: mapVO.getWidth(),
                    height: mapVO.getHeight(),
                    bbox: mapVO.getBbox().toBBOX(),
                    zoom: mapVO.getZoom(),
                    srs: mapVO.getSrsName()
                },
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureInfoWMS'
            });
        },
        /**
         * Formats the given data and sends a request to show infobox.
         * 
         * @method _handleInfoResult
         * @private
         * @param  {Object} data
         */
        _handleInfoResult: function(data) {
            var content = [],
                contentData = {},
                fragments = [],
                colourScheme,
                font;

            if (data.via === 'ajax') {
                fragments = this._parseGfiResponse(data);
            } else {
                fragments = this._formatWFSFeaturesForInfoBox(data);
            }

            if (fragments.length) {
                contentData.actions = {};
                contentData.html = this._renderFragments(fragments);
                contentData.layerId = fragments[0].layerId;
                content.push(contentData);
            }

            this._showGfiInfo(content, data.lonlat);
        },
        /**
         * Closes the infobox with GFI data
         * 
         * @method _closeGfiInfo
         * @private
         */
        _closeGfiInfo: function () {
            var reqBuilder = this._sandbox.getRequestBuilder("InfoBox.HideInfoBoxRequest"),
                request;

            if (reqBuilder) {
                request = reqBuilder(this.infoboxId);
                this._sandbox.request(this, request);
            }
        },
        /**
         * Shows given content in given location using infobox bundle
         * 
         * @method _showGfiInfo
         * @private
         * @param {Object[]} content infobox content array
         * @param {OpenLayers.LonLat} lonlat location for the GFI data
         */
        _showGfiInfo: function (content, lonlat) {
            var pluginLoc = this.getMapModule().getLocalization('plugin', true),
                infoboxLoc = pluginLoc[this.__name],
                reqBuilder = this._sandbox.getRequestBuilder("InfoBox.ShowInfoBoxRequest"),
                request, colourScheme, font;

            if (_.isObject(this.config)) {
                colourScheme = this.config.colourScheme;
                font = this.config.font;
            }

            if (reqBuilder) {
                request = reqBuilder(
                    this.infoboxId,
                    infoboxLoc.title,
                    content,
                    lonlat,
                    true,
                    colourScheme,
                    font
                );
                this._sandbox.request(this, request);
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
        _refreshGfiInfo: function(operation, contentId) {
            if (this.clickLocation) {
                var reqB = this._sandbox.getRequestBuilder('InfoBox.RefreshInfoBoxRequest'),
                    req;

                if (reqB) {
                    req = reqB(this.infoboxId, operation, contentId);
                    this._sandbox.request(this, req);
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
        _handleInfoBoxEvent: function(evt) {
            var me = this,
                clickLoc = this.clickLocation,
                clickEventB, clickEvent;

            if (evt.getId() === this.infoboxId &&
                evt.isOpen() &&
                _.isObject(clickLoc)) {
                clickEventB = this._sandbox.getEventBuilder('MapClickedEvent');
                clickEvent = clickEventB(clickLoc.lonlat);
                // Timeout needed since the layer plugins haven't
                // necessarily done their job of adding the layer yet.
                setTimeout(function() {
                    me._sandbox.notifyAll(clickEvent);
                }, 0);
            }
        }
    }, {
        /**
         * @property {Object} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
