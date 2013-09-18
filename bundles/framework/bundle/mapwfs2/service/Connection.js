/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Connection
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Connection',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object} config
 * @param {Object} plugin
 */
function(config, plugin) {
    this.config = config;
    this.plugin = plugin;
    this.cometd = jQuery.cometd;

    this.cookieName = 'JSESSIONID';
    this.cookieValue = jQuery.cookie(this.cookieName);

    this._connected = false;
    this._errorSub = null;

    // config defaults
    this._lazy = this.config.lazy || true; // if lazy connection
    this._disconnectTime = this.config.disconnectTime || 30000;
    this._backoffIncrement = this.config.backoffIncrement || 1000;
    this._maxBackoff = this.config.maxBackoff || 60000;
    this._maxNetworkDelay = this.config.maxNetworkDelay || 10000;

    this.cometURL = location.protocol + "//" +
        this.config.hostname + this.config.port  +
        this.config.contextPath + "/cometd";

    this.cometd.configure({
        url : this.cometURL,
        //logLevel : "debug",
        backoffIncrement : this._backoffIncrement, // if connection can't be established add this time to waiting time before trying again (ms)
        maxBackoff : this._maxBackoff, // maximum time of backoff (not incremented after reaching) (ms)
        maxNetworkDelay : this._maxNetworkDelay // max request time before considering that the request failed (ms)
    });

    this.getBrowser();

    var self = this;
    this.cometd.addListener('/meta/handshake', function () { self._metaHandshake.apply(self, arguments) });
    this.cometd.addListener('/meta/connect', function () { self._metaConnect.apply(self, arguments) });
    //this.cometd.addListener('/service/**', this.getData); // debug
    //this.cometd.addListener('/meta/**', this.getData); // debug

    if(!this._lazy) {
        this.connect(); // init conn
    }

    // Disconnect when the page unloads
    jQuery(window).unload(function() {
        self.disconnect();
    });
}, {
    /**
     * @method connect
     */
    connect : function() {
        this.cometd.handshake();
    },

    /**
     * @method disconnect
     */
    disconnect : function() {
        this.cometd.disconnect(true);
    },

    /**
     * @method isConnected
     */
    isConnected : function() {
        return this._connected;
    },

    /**
     * @method isLazy
     */
    isLazy : function() {
        return this._lazy;
    },

    /**
     * @method get
     */
    get : function() {
        return this.cometd;
    },

    /**
     * @method getBrowser
     *
     * Get browser information
     */
    getBrowser : function() {
        if(jQuery.browser.msie)
            jQuery.browser.name = "msie";
        else if(jQuery.browser.chrome)
            jQuery.browser.name = "chrome"
        else if(jQuery.browser.mozilla)
            jQuery.browser.name = "mozilla"
        else if(jQuery.browser.safari)
            jQuery.browser.name = "safari"
        else
            jQuery.browser.name = "unknown"
        jQuery.browser.versionNum = parseInt(jQuery.browser.version, 10)
    },

    updateLazyDisconnect : function(isWFSOpen) {
        if(this.isLazy()) {
            if(!isWFSOpen) {
                var self = this;
                this._disconnectTimer = setTimeout(function() {
                    self.disconnect();
                }, this._disconnectTime);
            } else {
                if(this._disconnectTimer) {
                    clearTimeout(this._disconnectTimer);
                    this._disconnectTimer = null;
                }
            }
        }
    },

    /**
     * @method _metaConnect
     * @param {Object} message
     */
    _metaConnect : function(message) {
        if(this.cometd.isDisconnected()) {
            this._connected = false;
            return;
        }

        var wasConnected = this._connected;
        this._connected = message.successful === true;
        if(!wasConnected && this._connected) {
            this.plugin.clearConnectionErrorTriggers(); // clear errors
        } else if(wasConnected && !this._connected) {
            this.plugin.showErrorPopup("connection_broken", null, true);
        }
    },

    /**
     * @method _metaHandshake
     * @param {Object} handshake
     */
    _metaHandshake : function(handshake) {
        if(handshake.successful === true) {
            var self = this;
            this.cometd.batch(function() {
                self._errorSub = self.cometd.subscribe('/error', self.getError);
                self.plugin.getIO().subscribe();
                self.plugin.getIO().startup({
                    "clientId" : handshake.clientId,
                    "session" : self.cookieValue,
                    "browser" : jQuery.browser.name,
                    "browserVersion" : jQuery.browser.versionNum
                });
            });
        } else {
            this.plugin.showErrorPopup("connection_not_available", null, true);
        }
    },

    /**
     * @method getError
     * @param {Object} data
     */
    getError : function(data) {
        var message = data.data.message;
        var layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var once = data.data.once;
        this.plugin.showErrorPopup(message, layer, once);
    }//,

    /**
     * @method getData
     * @param {Object} data
     */
    /*
    getData : function(data) {
        console.log("getData:", data);
    }
    */
});
