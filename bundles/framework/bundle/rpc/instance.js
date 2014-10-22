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

        allowedEvents = me.conf.allowedEvents || {
            AfterMapMoveEvent: true,
            MapClickedEvent: true
        };

        allowedRequests = me.conf.allowedRequests || {
            MapMoveRequest: true
        };

        me._allowedEvents = allowedEvents;
        me._allowedRequests = allowedRequests;
        me._channel = null;
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
         * @public @method startPlugin
         */
        startPlugin: function () {
            if (!Channel) {
                throw new Error('JSChannel not found.');
            }
            // FIXME get published map 'parent' domain from somewhere
            var domain = '*',
                me = this,
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
         * @param {string} eventName
         *
         */
        _registerEventHandler: function (eventName) {
            var me = this;
            if (me.eventHandlers[eventName]) {
                // Event handler already in place
                return;
            }
            me.eventHandlers[eventName] = function (event) {
                me._channel.notify({
                    method: eventName,
                    params: event.getParams ? event.getParams() : me._getParams(event)
                });
            };
            me.sandbox.registerForEventByName(me, eventName);
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
         * @static @property {String[]} extend
         */
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
