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
        'use strict';
        var me = this,
            allowedEvents,
            allowedFunctions,
            allowedRequests;

        if (!me.conf) {
            me.conf = {};
        }

        allowedEvents = me.conf.allowedEvents;
        allowedFunctions = me.conf.allowedfunctions;
        allowedRequests = me.conf.allowedRequests;

        if (allowedEvents === null || allowedEvents === undefined) {
            allowedEvents = {
                AfterMapMoveEvent: true,
                MapClickedEvent: true
            };
        }

        if (allowedFunctions === null || allowedFunctions === undefined) {
            allowedFunctions = {
                getAllLayers: true,
                getMapPosition: true,
                getSupportedEvents: true,
                getSupportedFunctions: true,
                getSupportedRequests: true,
                getZoomRange: true
            };
        }

        if (allowedRequests === null || allowedRequests === undefined) {
            allowedRequests = {
                'MapModulePlugin.AddMarkerRequest': true,
                'MapModulePlugin.MapLayerVisibilityRequest': true,
                'MapModulePlugin.RemoveMarkersRequest': true,
                MapMoveRequest: true
            };
        }

        me._allowedEvents = allowedEvents;
        me._allowedFunctions = allowedFunctions;
        me._allowedRequests = allowedRequests;
        me._channel = null;
        me._localization = {};
        me.eventHandlers = {};
        me.requestHandlers = {};
    },
    {
        /**
         * @public @method getName
         *
         *
         * @return {string} the name for the component
         */
        getName: function () {
            'use strict';
            return 'RPC';
        },

        /**
         * @public @method start
         * BundleInstance protocol method
         */
        start: function () {
            'use strict';
            var me = this,
                channel,
                conf = this.conf,
                domain = me.conf.domain,
                sandboxName = conf && conf.sandbox ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
            sandbox.register(this);

            if (!Channel) {
                me.sandbox.printWarn('RemoteProcedureCallInstance.startPlugin(): JSChannel not found.');
                return;
            }

            if (domain === null || domain === undefined || !domain.length) {
                me.sandbox.printWarn('RemoteProcedureCallInstance.startPlugin(): missing domain.');
                return;
            }

            if (domain === '*') {
                me.sandbox.printWarn('RemoteProcedureCallInstance.startPlugin(): * is not an allowed domain.');
                return;
            }

            if (window === window.parent) {
                me.sandbox.printWarn('RemoteProcedureCallInstance.startPlugin(): Target window is same as present window - not allowed.');
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
                            message: 'Invalid origin: ' + trans.origin
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
                            error: 'event_not_allowed',
                            message: 'Event not allowed: ' + params[0]
                        };
                    }
                }
            );

            // Makes it possible to post requests
            // channel.call({method: 'postRequest', params: ['MapMoveRequest', [centerX, centerY, zoom, marker, srsName]]})
            channel.bind(
                'postRequest',
                function (trans, params) {
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    if (me._allowedRequests[params[0]]) {
                        var builder = me.sandbox.getRequestBuilder(params[0]),
                            request;
                        if (builder) {
                            request = builder.apply(me, params[1]);
                            me.sandbox.request(me, request);
                        } else {
                            throw {
                                error: 'builder_not_found',
                                message: 'No builder found for: ' + params[0]
                            };
                        }
                    } else {
                        throw {
                            error: 'request_not_allowed',
                            message: 'Request not allowed: ' + params[0]
                        };
                    }
                }
            );

            me._bindFunctions(channel);
            me._channel = channel;
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
            'use strict';
            var me = this,
                mapModule = me.sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                ),
                map = mapModule.getMap(),
                sbMap = me.sandbox.getMap();
            // bind getSupportedEvents
            if (me._allowedFunctions.getSupportedEvents) {
                channel.bind(
                    'getSupportedEvents',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        return me._allowedEvents;
                    }
                );
            }

            // bind getSupportedfunctions
            if (me._allowedFunctions.getSupportedFunctions) {
                channel.bind(
                    'getSupportedFunctions',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        return me._allowedFunctions;
                    }
                );
            }

            // bind getSupportedRequests
            if (me._allowedFunctions.getSupportedRequests) {
                channel.bind(
                    'getSupportedRequests',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        return me._allowedRequests;
                    }
                );
            }

            // bind get all layers (returns only IDs as the layers might contain private data)
            if (me._allowedFunctions.getAllLayers) {
                channel.bind(
                    'getAllLayers',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        var mapLayerService = me.sandbox.getService(
                                'Oskari.mapframework.service.MapLayerService'
                            ),
                            layers;

                        layers = mapLayerService.getAllLayers();
                        return layers.map(function (layer) {
                            return {
                                id: layer.getId(),
                                opacity: layer.getOpacity(),
                                visible: layer.isVisible()
                            };
                        });
                    }
                );
            }

            // bind get map position
            if (me._allowedFunctions.getMapPosition) {
                channel.bind(
                    'getMapPosition',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        return {
                            centerX: sbMap.getX(),
                            centerY: sbMap.getY(),
                            zoom: sbMap.getZoom(),
                            scale: sbMap.getScale(),
                            srsName: sbMap.getSrsName()
                        };
                    }
                );
            }

            // bind get zoom range
            if (me._allowedFunctions.getZoomRange) {
                channel.bind(
                    'getZoomRange',
                    function (trans) {
                        if (!me._domainMatch(trans.origin)) {
                            throw {
                                error: 'invalid_origin',
                                message: 'Invalid origin: ' + trans.origin
                            };
                        }
                        return {
                            min: 0,
                            max: map.getNumZoomLevels() - 1,
                            current: map.getZoom()
                        };
                    }
                );
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
            'use strict';
            // Allow subdomains and different ports
            var domain = this.conf.domain,
                ret = origin.indexOf(domain) !== -1,
                parts;

            if (ret) {
                parts = origin.split(domain);
                if (parts) {
                    ret = /^https?:\/\/([a-zA-Z0-9]+[.])*$/.test(parts[0]);
                    if (ret && parts.length > 1) {
                        ret = /^(:\d+)?$/.test(parts[1]);
                    }
                } else {
                    // origin must have a protocol
                    ret = false;
                }
            }

            return ret;
        },

        /**
         * @private @method _registerEventHandler
         *
         * @param {string} eventName Event name
         *
         */
        _registerEventHandler: function (eventName) {
            'use strict';
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
            'use strict';
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
         * @public @method init
         *
         *
         */
        init: function () {
            'use strict';
            return null;
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
            'use strict';
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
            'use strict';
            var ret = {},
                key,
                //strippedKey,
                value;

            if (event.getParams) {
                ret = event.getParams();
            } else {
                for (key in event) {
                    if (event.hasOwnProperty(key)) {
                        // Skip __name and such
                        if (key.indexOf('__') !== 0) {
                            value = event[key];
                            if (typeof value === 'string' ||
                                    typeof value === 'number' ||
                                    typeof value === 'boolean') {
                                /* try to make the key a tad cleaner?
                                strippedKey = key;
                                if (key.indexOf('_') === 0) {
                                    strippedKey = key.substring(1);
                                    if (event[strippedKey] === undefined) {
                                        key = strippedKey;
                                    }
                                }*/
                                ret[key] = value;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        /**
         * @public @method update
         * BundleInstance protocol method
         *
         *
         */
        update: function () {
            'use strict';
            return undefined;
        },

        /**
         * @private @method _unregisterEventHandler
         *
         * @param {string} eventName
         *
         */
        _unregisterEventHandler: function (eventName) {
            'use strict';
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
