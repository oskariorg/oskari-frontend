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
    (function($) {
        cookieName = 'JSESSIONID';
        var cookieValue = $.cookie(cookieName);

        var cometURL = location.protocol + "//" +
            location.hostname + config.port  +
            config.contextPath + "/cometd";

        var cometd = $.cometd;

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
            if($.browser.msie)
                $.browser.name = "msie";
            else if($.browser.chrome)
                $.browser.name = "chrome"
            else if($.browser.mozilla)
                $.browser.name = "mozilla"
            else if($.browser.safari)
                $.browser.name = "safari"
            else
                $.browser.name = "unknown"
            $.browser.versionNum = parseInt($.browser.version, 10)
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
                        "browser" : $.browser.name,
                        "browserVersion" : $.browser.versionNum
                    });
                });
            }
        }

        // Disconnect when the page unloads
        $(window).unload(function() {
            cometd.disconnect(true);
        });

        // error handling
        function getError(data)
        {
            console.log("error,", data.data);
        }

        // debug
        function getData(data) {
            console.log("getData:", data);
        }

    })(jQuery);

}, {

});
