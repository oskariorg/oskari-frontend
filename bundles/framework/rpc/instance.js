/**
 * @class Oskari.mapframework.bundle.rpc.RemoteProcedureCallInstance
 *
 * Main component and starting point for the RPC functionality.
 *
 * See Oskari.mapframework.bundle.rpc.RemoteProcedureCall for bundle definition.
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.rpc.RemoteProcedureCallInstance',
    function () {
        this._channel = null;
        this.eventHandlers = {};
        this.requestHandlers = {};
        this.log = Oskari.log('RPC');
    },
    {
        /**
         * @public @method getName
         *
         *
         * @return {string} the name for the component
         */
        getName: function () {
            return 'RPC';
        },
        getSandbox: function () {
            return this.sandbox;
        },
        isClientSupported : function(clientVer) {
            if(!clientVer) {
                return false;
            }
            return clientVer.indexOf("2.0.") === 0;
        },
        /**
         * @public @method start
         * BundleInstance protocol method
         */
        start: function () {
            
            var me = this,
                channel,
                conf = this.conf || {},
                domain = me.conf.domain,
                sandboxName = conf.sandbox ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
            sandbox.register(this);

            if (!Channel) {
                me.log.warn('RemoteProcedureCallInstance.startPlugin(): JSChannel not found.');
                return;
            }

            if (domain === null || domain === undefined || !domain.length) {
                me.log.warn('RemoteProcedureCallInstance.startPlugin(): missing domain.');
                return;
            }

            if (domain === '*') {
                me.log.warn('RemoteProcedureCallInstance.startPlugin(): * is not an allowed domain.');
                return;
            }

            if (window === window.parent) {
                me.log.warn('RemoteProcedureCallInstance.startPlugin(): Target window is same as present window - not allowed.');
                return;
            }

            // Domain is set to * as we want to allow subdomains and such...
            channel = Channel.build({
                window: window.parent,
                origin: '*',
                scope: 'Oskari'
            });

            // Makes it possible to listen to events
            // channel.call({method: 'handleEvent', params: ['MapClickedEvent', true]});
            channel.bind(
                'handleEvent',
                function (trans, params) {
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid domain for parent page/origin. Published domain does not match: ' + trans.origin
                        };
                    }
                    if (me._allowedEvents[params[0]]) {
                        if (params[1]) {
                            me._registerEventHandler(params[0]);
                        } else {
                            me._unregisterEventHandler(params[0]);
                        }
                    } else {
                        throw {
                            error: 'event_not_available',
                            message: 'Event not available: ' + params[0]
                        };
                    }
                }
            );

            // Makes it possible to post requests
            // channel.call({method: 'postRequest', params: ['MapMoveRequest', [centerX, centerY, zoom]]})
            channel.bind(
                'postRequest',
                function (trans, params) {
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    var builder = me.sandbox.getRequestBuilder(params[0]);
                    if (!me._allowedRequests[params[0]] || !builder) {
                        throw {
                            error: 'request_not_available',
                            message: 'Request not available: ' + params[0]
                        };
                    }
                    me.sandbox.request(me, builder.apply(me, params[1]));
                }
            );

            me._bindFunctions(channel);
            me._channel = channel;
        },
        /**
         * Initialize allowed requests/events/functions based on config
         * Triggered by sandbox.register(this)
         * @param  {Object} conf bundle configuration
         */
        init: function () {
          var me = this;
          // sanitize conf to prevent unnecessary errors
          var conf = this.conf || {};
          var allowedEvents = conf.allowedEvents;
          var allowedFunctions = conf.allowedfunctions;
          var allowedRequests = conf.allowedRequests;

          if (allowedEvents === null || allowedEvents === undefined) {
              allowedEvents = ['AfterMapMoveEvent', 'MapClickedEvent', 'AfterAddMarkerEvent', 'MarkerClickEvent',
              'RouteResultEvent','FeedbackResultEvent','SearchResultEvent', 'UserLocationEvent', 'DrawingEvent', "FeatureEvent", 'InfoboxActionEvent', 'InfoBox.InfoBoxEvent',
              'RPCUIEvent', 'map.rotated'];
          }

          if (allowedFunctions === null || allowedFunctions === undefined) {
              allowedFunctions = [];
              // allow all available functions by default
              var funcs = this._availableFunctions;

              // Special handling for getScreenshot() since it's not always present
              var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
              if(typeof mapModule.getScreenshot === 'function') {
                  // this is only available in Openlayers3 implementation of mapmodule
                  funcs['getScreenshot'] = function(transaction) {
                    mapModule.getScreenshot(function(image){
                      transaction.complete(image);
                    });
                }
              }

              for(var name in funcs) {
                  if(funcs.hasOwnProperty(name)) {
                      allowedFunctions.push(name);
                  }
              }
          }
          if (allowedRequests === null || allowedRequests === undefined) {
              allowedRequests = ['InfoBox.ShowInfoBoxRequest',
                  'InfoBox.HideInfoBoxRequest',
                  'MapModulePlugin.AddMarkerRequest',
                  'MapModulePlugin.AddFeaturesToMapRequest',
                  'MapModulePlugin.RemoveFeaturesFromMapRequest',
                  'MapModulePlugin.GetFeatureInfoRequest',
                  'MapModulePlugin.MapLayerVisibilityRequest',
                  'MapModulePlugin.RemoveMarkersRequest',
                  'MapModulePlugin.MarkerVisibilityRequest',
                  'MapMoveRequest',
                  'ShowProgressSpinnerRequest',
                  'GetRouteRequest',
                  'GetFeedbackServiceRequest',
                  'GetFeedbackServiceDefinitionRequest',
                  'GetFeedbackRequest',
                  'PostFeedbackRequest',
                  'SearchRequest',
                  'ChangeMapLayerOpacityRequest',
                  'MyLocationPlugin.GetUserLocationRequest',
                  'DrawTools.StartDrawingRequest',
                  'DrawTools.StopDrawingRequest',
                  'MapModulePlugin.ZoomToFeaturesRequest',
                  'MapModulePlugin.MapLayerUpdateRequest',
                  'rotate.map'];
          }
          me._allowedFunctions = this.__arrayToObject(allowedFunctions);
          // try to get event/request builder for each of these to see that they really are supported!!
          me.__setupAvailableEvents(allowedEvents);
          me.__setupAvailableRequests(allowedRequests);
        },
        __setupAvailableEvents : function(allowedEvents) {
            var available = [];
            var sb = this.getSandbox();
            for(var i=0; i < allowedEvents.length; ++i) {
                if(typeof sb.getEventBuilder(allowedEvents[i]) === 'function') {
                    available.push(allowedEvents[i]);
                }
            }
            this._allowedEvents = this.__arrayToObject(available);
        },
        __setupAvailableRequests : function(allowedRequests) {
            var available = [];
            var sb = this.getSandbox();
            for(var i=0; i < allowedRequests.length; ++i) {
                if(typeof sb.getRequestBuilder(allowedRequests[i]) === 'function') {
                    available.push(allowedRequests[i]);
                }
            }
            this._allowedRequests = this.__arrayToObject(available);
        },
        /**
         * Maps a given array to a dictionary format for easier access
         * @private
         * @param  {String[]} list will be used as keys in the result object. Values are boolean 'true' for each
         * @return {Object}   object with list items as keys and bln true as values
         */
        __arrayToObject: function(list) {
            var result = {};
            for(var i=0; i < list.length; ++i) {
                result[list[i]] = true;
            }
            return result;
        },
        _availableFunctions : {
            // format "supportedXYZ" to an object for easier checking for specific name
            getSupportedEvents : function() {
                return this._allowedEvents;
            },
            getSupportedFunctions : function() {
                return this._allowedFunctions;
            },
            getSupportedRequests : function() {
                return this._allowedRequests;
            },
            getInfo : function(transaction, clientVersion) {
                var sbMap = this.sandbox.getMap();
                return {
                    version : Oskari.VERSION,
                    clientSupported : this.isClientSupported(clientVersion),
                    srs  : sbMap.getSrsName()
                };
            },
            getAllLayers : function() {
                var me = this;
                var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var layers = mapLayerService.getAllLayers();
                mapModule = me.sandbox.findRegisteredModuleInstance("MainMapModule");
                mapResolutions = mapModule.getResolutionArray();
                return layers.map(function (layer) {
                    if (layer.getMaxScale() && layer.getMinScale()) {
                        var layerResolutions = mapModule.calculateLayerResolutions(layer.getMaxScale(), layer.getMinScale());
                        var minZoomLevel = mapResolutions.indexOf(layerResolutions[0]);
                        var maxZoomLevel = mapResolutions.indexOf(layerResolutions[layerResolutions.length - 1]);
                        return {
                            id: layer.getId(),
                            opacity: layer.getOpacity(),
                            visible: layer.isVisible(),
                            name : layer.getName(),
                            minZoom: minZoomLevel,
                            maxZoom: maxZoomLevel
                        };
                    } else {
                        return {
                            id: layer.getId(),
                            opacity: layer.getOpacity(),
                            visible: layer.isVisible(),
                            name : layer.getName()
                        };
                    }
                });
            },
            getMapBbox : function() {
                var bbox = this.sandbox.getMap().getBbox();
                return {
                    bottom: bbox.bottom,
                    left: bbox.left,
                    right: bbox.right,
                    top: bbox.top
                };
            },
            getMapPosition : function() {
                var sbMap = this.sandbox.getMap();
                return {
                    centerX: sbMap.getX(),
                    centerY: sbMap.getY(),
                    zoom: sbMap.getZoom(),
                    scale: sbMap.getScale(),
                    srsName: sbMap.getSrsName()
                };
            },
            getZoomRange : function() {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
                return {
                    min: 0,
                    max: mapModule.getMaxZoomLevel(),
                    current: mapModule.getMapZoom()
                };
            },
            zoomIn : function() {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
                var newZoom = mapModule.getNewZoomLevel(1);
                mapModule.setZoomLevel(newZoom);
                return newZoom;
            },
            zoomOut : function() {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
                var newZoom = mapModule.getNewZoomLevel(-1);
                mapModule.setZoomLevel(newZoom);
                return newZoom;
            },
            zoomTo : function(transaction, newZoom) {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
                mapModule.setZoomLevel(newZoom);
                return mapModule.getMapZoom();
            },
            getPixelMeasuresInScale : function(transaction, mmMeasures, scale) {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule'),
                    scalein = scale,
                    pixelMeasures = [],
                    zoomLevel = 0,
                    nextScale;

                if(mmMeasures && mmMeasures.constructor === Array){
                    if(!scalein){
                        scalein = mapModule.calculateFitScale4Measures(mmMeasures);
                    }
                    pixelMeasures = mapModule.calculatePixelsInScale(mmMeasures, scalein);
                }

                var scales = mapModule.getScaleArray();
                scales.forEach(function(sc, index) {
                    if ((!nextScale || nextScale > sc) && sc > scalein) {
                        nextScale = sc;
                        zoomLevel = index;
                    }
                });

                return {
                    pixelMeasures: pixelMeasures,
                    scale: scalein,
                    zoomLevel: zoomLevel
                };
            },
            resetState : function() {
                this.sandbox.resetState();
                return true;
            },
            getCurrentState : function() {
                return this.sandbox.getCurrentState();
            },
            useState : function(transaction,state) {
                this.sandbox.useState(state);
                return true;
            },
            getFeatures: function(transaction,includeFeatures) {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule'),
                    plugin = mapModule.getLayerPlugins(['vectorlayer']),
                    features = {};
                if(!plugin) {
                    return features;
                }
                var layers = plugin.getLayerIds();
                layers.forEach(function(id) {
                    if(includeFeatures === true) {
                        features[id] = plugin.getLayerFeatures(id);
                    }
                    else {
                        features[id] = [];
                    }
                });
                return features;
            },
            setCursorStyle: function(transaction, cursorStyle) {
                var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
                return mapModule.setCursorStyle(cursorStyle);
            },
            sendUIEvent: function(transaction, bundleId, payload) {
                var me = this,
                    event = me.sandbox.getEventBuilder('RPCUIEvent')(bundleId, payload);
                me.sandbox.notifyAll(event);
                return true;
            }
        },

        /**
         * @private @method _bindFunctions
         * Binds functions to the channel
         *
         * @param  {Object} channel Channel
         *
         *
         */
        _bindFunctions: function (channel) {
            
            var me = this,
                funcs = this._allowedFunctions;
            var bindFunction = function(name) {
                channel.bind(name, function (trans, params) {
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    params = params || [];
                    params.unshift(trans);

                    var value =  me._availableFunctions[name].apply(me, params);
                    if(typeof value === 'undefined') {
                      trans.delayReturn(true);
                      return;
                    }
                    return value;
                });
            }

            for(var name in funcs) {
                if(!funcs.hasOwnProperty(name) || !this._availableFunctions[name]) {
                    continue;
                }
                bindFunction(name);
            }
        },

        /**
         * @private @method _domainMatch
         * Used to check message origin, JSChannel only checks for an exact
         * match where we need subdomain matches as well.
         *
         * @param  {string} origin Origin domain
         *
         * @return {Boolean} Does origin match config domain
         */
        _domainMatch: function (origin) {
            
            var sb = this.sandbox;
            if(!origin) {
                this.log.warn('No origin in RPC message');
                // no origin, always deny
                return false;
            }
            // Allow subdomains and different ports
            var domain = this.conf.domain

            var url = document.createElement('a');
            url.href = origin;
            var originDomain = url.hostname;

            var allowed = originDomain.endsWith(domain);
            if(!allowed) {
                // always allow from localhost
                if(originDomain === 'localhost') {
                    this.log.warn('Origin mismatch, but allowing localhost. Published to: ' + domain);
                    return true;
                }
                this.log.warn('Origin not allowed for RPC: ' + origin);
            }
            return allowed;
        },

        /**
         * @private @method _registerEventHandler
         *
         * @param {string} eventName Event name
         *
         */
        _registerEventHandler: function (eventName) {
            
            var me = this;
            if (me.eventHandlers[eventName]) {
                // Event handler already in place
                return;
            }
            me.eventHandlers[eventName] = function (event) {
                if (me._channel) {
                    me._channel.notify({
                        method: eventName,
                        params: me._getParams(event)
                    });
                }
            };
            me.sandbox.registerForEventByName(me, eventName);
        },

        /**
         * @public @method stop
         * BundleInstance protocol method
         *
         *
         */
        stop: function () {
            
            var me = this,
                sandbox = this.sandbox,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }
            for (p in me.requestHandlers) {
                if (me.requestHandlers.hasOwnProperty(p)) {
                    sandbox.removeRequestHandler(p, this);
                }
            }
            sandbox.unregister(this);
            this.sandbox = null;
        },

        /**
         * @public @method onEvent
         *
         * @param {Oskari.mapframework.event.Event} event an Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
         *
         */
        onEvent: function (event) {
            
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

        /**
         * @private @method _getParams
         * Returns event's simple variables as params.
         * This should suffice for simple events.
         *
         * @param  {Object} event Event
         *
         * @return {Object}       Event params
         */
        _getParams: function (event) {
            
            var ret = {},
                key,
                allowedTypes = ['string', 'number', 'boolean'];

            if (event.getParams) {
                ret = event.getParams();
            } else {
                for (key in event) {
                    // Skip __name and such
                    if (!event.hasOwnProperty(key) || key.indexOf('__') === 0) {
                        continue;
                    }
                    // check that value is one of allowed types
                    if(this.__isInList(typeof event[key], allowedTypes)) {
                        ret[key] = event[key];
                    }
                }
            }

            return ret;
        },
        /**
         * @private @method __isInList
         * Returns true if first parameter is found in the list given as second parameter.
         *
         * @param  {String} value to check
         * @param  {String[]} list to check against
         *
         * @return {Boolean}  true if value is part of the list
         */
        __isInList : function(value, list) {
            var i = 0,
                len = list.length;
            for(;i < len; ++i) {
                if(value === list[i]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @public @method update
         * BundleInstance protocol method
         *
         *
         */
        update: function () {
            
            return undefined;
        },

        /**
         * @private @method _unregisterEventHandler
         *
         * @param {string} eventName
         *
         */
        _unregisterEventHandler: function (eventName) {
            
            delete this.eventHandlers[eventName];
            this.sandbox.unregisterFromEventByName(this, eventName);
        }
    },
    {
        /**
         * @static @property {string[]} protocol
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
