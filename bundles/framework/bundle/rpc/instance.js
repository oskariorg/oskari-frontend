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
        var me = this,
            allowedEvents,
            allowedRequests;

        if (!me.conf) {
            me.conf = {};
        }

        allowedEvents = me.conf.allowedEvents;
        allowedRequests = me.conf.allowedRequests;

        if (allowedEvents === null || allowedEvents === undefined) {
            allowedEvents = {
                AfterMapMoveEvent: true,
                MapClickedEvent: true
            };
        }

        if (allowedRequests === null || allowedRequests === undefined) {
            allowedRequests = {
                MapMoveRequest: true,
                'MapModulePlugin.MapLayerVisibilityRequest': true,
                'MapModulePlugin.AddMarkerRequest': true
            };
        }

        me._allowedEvents = allowedEvents;
        me._allowedRequests = allowedRequests;
        me._channel = null;
        me._localization = {};
        me.eventHandlers = {};
        me.requestHandlers = {};
    }, {
        /**
         * @public @method getName
         *
         *
         * @return {string} the name for the component
         */
        getName: function () {
            return 'RPC';
        },

        /**
         * @public @method start
         * BundleInstance protocol method
         */
        start: function () {
            var me = this,
                conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                domain = me.conf.domain,
                channel;

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

            channel = Channel.build({
                window: window.parent,
                origin: '*',
                scope: 'Oskari'
            });

            // Makes it possible to listen to events
            // channel.call({method: 'handleEvent', params: ['MapClickedEvent', true]});
            // TODO OskariRPC.handleEvent
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
            // TODO OskariRPC.postRequest
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

            // bind getSupportedEvents
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
            // bind getSupportedRequests
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

            // bind get all layers (returns only IDs as the layers might contain private data)
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

            // bind get map position
            channel.bind(
                'getMapPosition',
                function (trans) {
                    var map = me.sandbox.getMap();
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    return {
                        centerX: map.getX(),
                        centerY: map.getY(),
                        zoom: map.getZoom(),
                        scale: map.getScale(),
                        srsName: map.getSrsName()
                    };
                }
            );

            // bind get zoom range
            channel.bind(
                'getZoomRange',
                function (trans) {
                    var map = me.sandbox.getMap();
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    var ret = {
                        min: 0;
                    };
                    ret.max = map.getNumZoomLevels() - 1;
                    return ret;
                }
            );

            channel.bind(
                'zoomTo',
                function (trans, zoomLevel) {
                    var map = me.sandbox.getMap();
                    if (!me._domainMatch(trans.origin)) {
                        throw {
                            error: 'invalid_origin',
                            message: 'Invalid origin: ' + trans.origin
                        };
                    }
                    map.zoomTo(zoomLevel);
                }
            );

            me._channel = channel;
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
         * @public @method init
         *
         *
         */
        init: function () {
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
         * TODO see if this could be done with some library...
         *
         * @param  {Object} event Event
         *
         * @return {Object}       Event params
         */
        _getParams: function (event) {
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
        update: function () {},

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
    }, {
        /**
         * @static @property {string[]} protocol
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
