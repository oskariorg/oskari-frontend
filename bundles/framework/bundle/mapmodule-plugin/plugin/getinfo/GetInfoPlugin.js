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

        /**
         * @private @method _initImpl
         *
         * Interface method for the module protocol
         *
         *
         */
        _initImpl: function () {
            var me = this;
            me.getSandbox().printDebug('[GetInfoPlugin] init');
        },

        _destroyControlElement: function () {
            // Slight misuse of the function, but I don't want to override
            // _stopPluginImpl.

            // hide infobox if open
            this._closeGfiInfo();
            this.clickLocation = null;
        },

        _createEventHandlers: function () {
            return {
                EscPressedEvent: function (evt) {
                    this._closeGfiInfo();
                },
                MapClickedEvent: function (evt) {
                    if (!this.isEnabled()) {
                        // disabled, do nothing
                        return;
                    }
                    this.clickLocation = {
                        lonlat: evt.getLonLat()
                    };
                    this.handleGetInfo(this.clickLocation.lonlat);
                },
                AfterMapMoveEvent: function (evt) {
                    this._cancelAjaxRequest();
                },
                AfterMapLayerRemoveEvent: function (evt) {
                    this._refreshGfiInfo('remove', evt.getMapLayer().getId());
                },
                AfterMapLayerAddEvent: function (evt) {
                    this._refreshGfiInfo();
                },
                'InfoBox.InfoBoxEvent': function (evt) {
                    this._handleInfoBoxEvent(evt);
                },
                GetInfoResultEvent: function (evt) {
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
                'MapModulePlugin.GetFeatureInfoActivationRequest': handler
            };
        },

        _toggleUIControls: function (enabled) {
            if (!enabled) {
                this._closeGfiInfo();
            }
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
            this.getSandbox().printDebug(
                '[GetInfoPlugin] Abort jqhr ajax request'
            );
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
         * @return
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _buildLayerIdList: function (layers) {
            var me = this,
                selected = layers || me.getSandbox().findAllSelectedMapLayers(),
                layerIds = _.chain(selected)
                .filter(function (layer) {
                    return me._isQualified(layer);
                })
                .map(function (layer) {
                    return layer.getId();
                })
                .value()
                .join(',');

            return layerIds || null;
        },

        _isQualified: function (layer) {
            return (!this._isIgnoredLayerType(layer) &&
                layer.getQueryable &&
                layer.getQueryable() &&
                layer.isInScale(this.getSandbox().getMap().getScale()) &&
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
            return _.any((this.config || {}).ignoredLayerTypes, function (type) {
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
            this.getSandbox().printDebug(
                '[GetInfoPlugin] finished jqhr ajax request'
            );
        },

        /**
         * @method _notifyAjaxFailure
         * @private
         * Prints debug about ajax call failure.
         */
        _notifyAjaxFailure: function () {
            this.getSandbox().printDebug(
                '[GetInfoPlugin] GetFeatureInfo AJAX failed'
            );
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
        handleGetInfo: function (lonlat, layers) {
            var me = this,
                dteMs = (new Date()).getTime(),
                layerIds = me._buildLayerIdList(layers),
                ajaxUrl = this.getSandbox().getAjaxUrl(),
                mapVO = me.getSandbox().getMap(),
                olMap = me.getMapModule().getMap(),
                px = olMap.getViewPortPxFromLonLat(lonlat);

            if (!layerIds) {
                return;
            }
            if (me._pendingAjaxQuery.busy &&
                me._pendingAjaxQuery.timestamp &&
                dteMs - me._pendingAjaxQuery.timestamp < 500) {
                me.getSandbox().printDebug(
                    '[GetInfoPlugin] GetFeatureInfo NOT SENT ' +
                    '(time difference < 500ms)'
                );
                return;
            }

            me._cancelAjaxRequest();
            me._startAjaxRequest(dteMs);

            jQuery.ajax({
                beforeSend: function (x) {
                    me._pendingAjaxQuery.jqhr = x;
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (resp) {
                    if (me._isAjaxRequestBusy()) {
                        _.each(resp.data, function (datum) {
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
                    projection: me.getMapModule().getProjection(),
                    x: Math.round(px.x),
                    y: Math.round(px.y),
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
        _handleInfoResult: function (data) {
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
            var reqBuilder = this.getSandbox().getRequestBuilder(
                    'InfoBox.HideInfoBoxRequest'
                ),
                request;

            if (reqBuilder) {
                request = reqBuilder(this.infoboxId);
                this.getSandbox().request(this, request);
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
            var reqBuilder = this.getSandbox().getRequestBuilder(
                    'InfoBox.ShowInfoBoxRequest'
                ),
                request,
                colourScheme,
                font;

            if (_.isObject(this.config)) {
                colourScheme = this.config.colourScheme;
                font = this.config.font;
            }

            if (reqBuilder) {
                request = reqBuilder(
                    this.infoboxId,
                    this._loc.title,
                    content,
                    lonlat,
                    true,
                    colourScheme,
                    font
                );
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

            if (this.clickLocation) {
                reqB = this.getSandbox().getRequestBuilder(
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
                clickLoc = this.clickLocation,
                contentId = evt.getContentId(),
                contentLayer,
                clickEventB,
                clickEvent;

            if (evt.getId() === this.infoboxId &&
                evt.isOpen() &&
                _.isObject(clickLoc)) {
                if (contentId) {
                    // If there's a specific layer id and it's selected
                    // we can directly get info for that
                    contentLayer = sandbox.findMapLayerFromSelectedMapLayers(
                        contentId
                    );
                    if (contentLayer) {
                        this.handleGetInfo(clickLoc.lonlat, [contentLayer]);
                    }
                } else {
                    // Otherwise, we need to actually send `MapClickedEvent`
                    // and not just call `handleGetInfo` since then
                    // we'd only get the WMS feature info.
                    clickEventB = sandbox.getEventBuilder('MapClickedEvent');
                    clickEvent = clickEventB(clickLoc.lonlat);
                    // Timeout needed since the layer plugins haven't
                    // necessarily done their job of adding the layer yet.
                    setTimeout(function () {
                        sandbox.notifyAll(clickEvent);
                    }, 0);
                }
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
