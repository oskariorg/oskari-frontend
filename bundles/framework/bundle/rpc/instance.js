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
                MapMoveRequest: true
            };
        }

        me._allowedEvents = allowedEvents;
        me._allowedRequests = allowedRequests;
        me._channel = null;
        me._localization = {};
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
                conf = this.conf ,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                domain = me.conf.domain,
                channel;

            me.sandbox = sandbox;
            sandbox.register(this);

            if (!Channel) {
                throw new Error('JSChannel not found.');
            }

            if (domain === null || domain === undefined) {
                throw new Error('RemoteProcedureCallInstance.startPlugin(): missing domain.');
            }

            if (domain === '*') {
                throw new Error('RemoteProcedureCallInstance.startPlugin(): * is not an allowed domain.');
            }

            if (window === window.parent) {
                //throw new Error('Target window is same as present window - not allowed.');
                me.sandbox.printError('RemoteProcedureCallInstance.startPlugin(): Target window is same as present window - not allowed.');
                return;
            }

            channel = Channel.build({
                window: window.parent,
                origin: domain,
                scope: 'Oskari'
            });

            // Makes it possible to listen to events
            // channel.call({method: 'handleEvent', params: ['MapClickedEvent', true]});
            // TODO OskariRPC.handleEvent
            channel.bind(
                'handleEvent',
                function (trans, name, register) {
                    me.sandbox.postWarn('Tried to ' + register ? 'register ' : 'unregister ' + name);
                    if (me._allowedEvents[name]) {
                        if (register) {
                            me._registerEventHandler(name);
                        } else {
                            me._unregisterEventHandler(name);
                        }
                    } else {
                        throw 'Event not allowed: ' + name;
                    }
                }
            );

            // Makes it possible to post requests
            // channel.call({method: 'postRequest', params: ['MapMoveRequest', [centerX, centerY, zoom, marker, srsName]]})
            // TODO OskariRPC.postRequest
            channel.bind(
                'postRequest',
                function (trans, name, params) {
                    if (me._allowedRequests[name]) {
                        var builder = me.sandbox.getRequestBuilder(name),
                            request;
                        if (builder) {
                            request = builder.apply(me, params);
                            me.sandbox.request(me, request);
                        } else {
                            throw 'No builder found for ' + name;
                        }
                    } else {
                        throw 'Request not allowed: ' + name;
                    }
                }
            );

            // bind getSupportedEvents
            channel.bind(
                'getSupportedEvents',
                function (trans) {
                    return me._allowedEvents;
                }
            );
            // bind getSupportedRequests
            channel.bind(
                'getSupportedRequests',
                function (trans) {
                    return me._allowedRequests;
                }
            );
            // bind get map position
            // TODO OskariRPC.getMapPosition
            channel.bind(
                'getMapPosition',
                function (trans) {
                    var map = me.sandbox.getMap();
                    return {
                        centerX: map.getY(),
                        centerY: map.getX(),
                        zoom: map.getZoom(),
                        srsName: map.getSrsName()
                    };
                }
            );

            me._channel = channel;
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
                        params: event.getParams ? event.getParams() : me._getParams(event)
                    });
                }
            };
            me.sandbox.registerForEventByName(me, eventName);
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            var sandbox = this.sandbox,
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
        "init": function () {
            return null;
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
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
            return ret;
        },

        /**
         * @method update
         * BundleInstance protocol method
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
         * @static @property {String[]} protocol
         */
        'protocol': ['Oskari.bundle.BundleInstance','Oskari.mapframework.module.Module']
    }
);
