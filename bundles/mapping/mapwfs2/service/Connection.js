/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Connection
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.Connection',
    /**
     * @static @method create called automatically on construction
     * For debugging you can add:
     * - this.cometd.addListener('/service/**', console.log); // debug
     * - this.cometd.addListener('/meta/**', console.log); // debug
     * @param {Object} config
     * @param {Object} plugin
     *
     */
    function (config, plugin) {
        var me = this;

        me.config = config || {};
        me.plugin = plugin;
        me.cometd = jQuery.cometd;

        me._connected = false;
        me._handshakeInProcess = false;
        me._errorSub = null;

        me._connectionProblemWaitTime = 5000; // wait before say that we have disconnected (retry change)

        // config defaults
        if (typeof me.config.lazy === 'undefined') {
            me.config.lazy = true;
        }
        me._lazy = me.config.lazy;
        me._DISCONNECT_CHECK_FREQUENCY = me.config.disconnectTime || 30000;

        me.browser = {};
        me.getBrowser();

        me.cometURL = location.protocol + '//' +
            me.config.hostname + me.config.port +
            me.config.contextPath + '/cometd';

        me.cometd.configure({
            url: me.cometURL,
            //logLevel : "debug",
            // if connection can't be established add this time to waiting time before trying again (ms)
            backoffIncrement: me.config.backoffIncrement || 1000,
            // maximum time of backoff (not incremented after reaching) (ms)
            maxBackoff: me.config.maxBackoff || 60000,
            // max request time before considering that the request failed (ms)
            maxNetworkDelay: me.config.maxNetworkDelay || 10000
        });

        me.cometd.addListener(
            '/meta/handshake',
            function () {
                me._handshakeInProcess = false;
                me._metaHandshake.apply(me, arguments);
            }
        );
        me.cometd.addListener(
            '/meta/connect',
            function () {
                me._metaConnect.apply(me, arguments);
            }
        );

        if (!me._lazy) {
            // init conn
            me.connect();
        }

        // Disconnect when the page unloads
        jQuery(window).unload(function () {
            me.disconnect(); });
    }, {
        /**
         * @method connect
         */
        connect: function () {
            if(!this._connected && !this._handshakeInProcess) {
                this._handshakeInProcess = true;
                this.cometd.handshake();
            }
        },

        /**
         * @method disconnect
         */
        disconnect: function () {
            this.cometd.disconnect(true);
        },

        /**
         * @method isConnected
         */
        isConnected: function () {
            return this._connected;
        },

        /**
         * @method isLazy
         */
        isLazy: function () {
            return this._lazy;
        },

        /**
         * @method get
         */
        get: function () {
            return this.cometd;
        },

        /**
         * @method getBrowser
         *
         * Get browser information
         */
        getBrowser: function () {
            this.browser = {
                name: 'unknown',
                versionNum: 0
            };
        },

        updateLazyDisconnect: function (isWFSOpen) {
            var me = this;

            if (me.isLazy()) {
                if (!isWFSOpen) {
                    me._disconnectTimer = setTimeout(
                        function () {
                            me.disconnect();
                        },
                        me._DISCONNECT_CHECK_FREQUENCY
                    );
                } else {
                    if (me._disconnectTimer) {
                        clearTimeout(me._disconnectTimer);
                        me._disconnectTimer = null;
                    }
                }
            }
        },

        /**
         * @method _metaConnect
         * @param {Object} message
         */
        _metaConnect: function (message) {
            var me = this;

            if (me.cometd.isDisconnected()) {
                me._connected = false;
                return;
            }

            var wasConnected = me._connected;
            me._connected = message.successful === true;
            if (!wasConnected && me._connected) {
                // clear errors
                if (me._brokenConnectionTimer) {
                    clearTimeout(me._brokenConnectionTimer);
                    me._brokenConnectionTimer = null;
                }
                me.plugin.clearConnectionErrorTriggers();
            } else if (wasConnected && !me._connected) {
                me._brokenConnectionTimer = setTimeout(
                    function () {
                        me.plugin.showErrorPopup(
                            'connection_broken',
                            null,
                            true
                        );
                    },
                    me._connectionProblemWaitTime
                );
            }
        },

        /**
         * @method _metaHandshake
         * @param {Object} handshake
         */
        _metaHandshake: function (handshake) {
            var me = this;
            if (handshake.successful === true) {
                // clear errors
                if (me._connectionNotAvailableTimer) {
                    clearTimeout(me._connectionNotAvailableTimer);
                    me._connectionNotAvailableTimer = null;
                }

                me.cometd.batch(function () {
                    me._errorSub = me.cometd.subscribe(
                        '/error',
                        me.getError
                    );
                    me.plugin.getIO().subscribe();
                    me.plugin.getIO().startup({
                        clientId: handshake.clientId,
                        browser: me.browser.name,
                        browserVersion: me.browser.versionNum
                    });
                });
            } else {
                me._connectionNotAvailableTimer = setTimeout(
                    function () {
                        me.plugin.showErrorPopup(
                            'connection_not_available',
                            null,
                            true
                        );
                    },
                    me._connectionProblemWaitTime
                );
            }
        },

        /**
         * @method getError
         * @param {Object} data
         */
        getError: function (data) {
            var message = data.data.message,
                plugin = this.plugin,
                layer = plugin.getSandbox().findMapLayerFromSelectedMapLayers(
                    data.data.layerId
                ),
                once = data.data.once;

            plugin.showErrorPopup(message, layer, once);
        }
    });
