/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Connection
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Connection',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object} config
 * @param {Object} mediator
 */
function(config, mediator) {
    this.config = config;
    this.mediator = mediator;
    this.cometd = jQuery.cometd;

    this.cookieName = 'JSESSIONID';
    this.cookieValue = jQuery.cookie(this.cookieName);

    this._connected = false;
    this._errorSub = null;

    this.cometURL = location.protocol + "//" +
        this.config.hostname + ":" + this.config.port  +
        this.config.contextPath + "/cometd";

    this.cometd.configure({
        url : this.cometURL
        //, logLevel: 'debug'
    });

    this.getBrowser();

    var self = this;
    this.cometd.addListener('/meta/handshake', function () { self._metaHandshake.apply(self, arguments) });
    this.cometd.addListener('/meta/connect', function () { self._metaConnect.apply(self, arguments) });
    //this.cometd.addListener('/service/**', this.getData); // debug
    //this.cometd.addListener('/meta/**', this.getData); // debug
    this.cometd.handshake();

    // Disconnect when the page unloads
    jQuery(window).unload(function() {
        this.cometd.disconnect(true);
    });
}, {

    // get browser information
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

    // connect
    _metaConnect : function(message) {
        if(this.cometd.isDisconnected()) {
            this._connected = false;
            this.mediator.setConnection(null);
            return;
        }

        var wasConnected = this._connected;
        this._connected = message.successful === true;
        if(!wasConnected && this._connected) {
            console.log("connected");
            this.mediator.setConnection(this.cometd);
            this.mediator.getPlugin().clearConnectionErrorTriggers(); // clear errors
        } else if(wasConnected && !this._connected) {
            this.mediator.setConnection(null);
            this.mediator.getPlugin().showErrorPopup("connection_broken", null, true);
        }
    },

    // handshake
    _metaHandshake : function(handshake) {
        if(handshake.successful === true) {
            var self = this;
            this.mediator.setConnection(self.cometd);
            this.cometd.batch(function() {
                console.log("handshake");
                self._errorSub = self.cometd.subscribe('/error', self.getError);
                self.mediator.subscribe();
                self.mediator.startup({
                    "clientId" : handshake.clientId,
                    "session" : self.cookieValue,
                    "browser" : jQuery.browser.name,
                    "browserVersion" : jQuery.browser.versionNum
                });
            });
        } else {
            this.mediator.getPlugin().showErrorPopup("connection_not_available", null, true);
        }
    },

    // error handling
    getError : function(data) {
        var message = data.data.message;
        var layer = mediator.getPlugin().getSandbox().findMapLayerFromSelectedMapLayers(data.data.layerId);
        var once = data.data.once;
        this.mediator.getPlugin().showErrorPopup(message, layer, once);
    },

    // debug
    getData : function(data) {
        console.log("getData:", data);
    }
});
