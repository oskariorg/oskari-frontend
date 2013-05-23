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
        var cookieName = 'JSESSIONID';
        var cookieValue = jQuery.cookie(cookieName);

        var cometURL = location.protocol + "//" +
            location.hostname + ":" + config.port  +
            config.contextPath + "/cometd";

        var cometd = jQuery.cometd;

        cometd.configure({
            url : cometURL
            //, logLevel: 'debug'
        });

        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener('/meta/connect', _metaConnect);
        //cometd.addListener('/service/**', getData); // debug
        //cometd.addListener('/meta/**', getData); // debug
        cometd.handshake();

        // get browser information
        function getBrowser() {
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
        }
        getBrowser();

        var _connected = false;

        // connect
        function _metaConnect(message) {
            if(cometd.isDisconnected()) {
                _connected = false;
                mediator.setConnection(null);
                //console.log("CometD Connection Closed");
                return;
            }

            var wasConnected = _connected;
            _connected = message.successful === true;
            if(!wasConnected && _connected) {
                mediator.setConnection(cometd);
                //console.log("CometD Connection Established");
            } else if(wasConnected && !_connected) {
                mediator.setConnection(null);
                //console.log("CometD Connection Broken");
            }
        }

        // handshake
        function _metaHandshake(handshake) {
            if(handshake.successful === true) {
                cometd.batch(function() {
                    mediator.setConnection(cometd);
                    _errorSub = cometd.subscribe('/error', getError);
                    mediator.subscribe();

                    mediator.startup({
                        "clientId" : handshake.clientId,
                        "session" : cookieValue,
                        "browser" : jQuery.browser.name,
                        "browserVersion" : jQuery.browser.versionNum
                    });
                });
            }
        }

        // Disconnect when the page unloads
        jQuery(window).unload(function() {
            cometd.disconnect(true);
        });

        // error handling
        function getError(data)
        {
//            console.log("error,", data.data);
        }

        // debug
        function getData(data) {
//            console.log("getData:", data);
        }

}, {

});
