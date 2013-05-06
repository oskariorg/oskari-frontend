/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.Connection
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.service.Connection', function(mediator) {
    var me = this;

    (function($) {

        var config = {
            contextPath : '/transport-0.0.1',
            port : ':6060'
        };
        var cometURL = location.protocol + "//" +
            location.hostname + config.port  +
            config.contextPath + "/cometd";

        var cometd = $.cometd;
        cookieName = 'JSESSIONID';
        var cookieValue = $.cookie(cookieName);

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
        function _metaConnect(message) {
            if(cometd.isDisconnected()) {
                _connected = false;
                mediator.setConnection(null);
                console.log("CometD Connection Closed");
                return;
            }

            var wasConnected = _connected;
            _connected = message.successful === true;
            if(!wasConnected && _connected) {
                mediator.setConnection(cometd);
                console.log("CometD Connection Established");
            } else if(wasConnected && !_connected) {
                mediator.setConnection(null);
                console.log("CometD Connection Broken");
            }
        }

        function _metaHandshake(handshake) {
            if(handshake.successful === true) {
                cometd.batch(function() {
                    mediator.setConnection(cometd);
                    _errorSub = cometd.subscribe('/error', getError);
                    mediator.subscribe();

                    mediator.startup({
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

        cometd.configure({
            url : cometURL
            //, logLevel: 'debug'
        });

        // error handling
        function getError(data)
        {
            console.log("error,", data.data);
        }

        // TODO: remove debug
        function getData(data) {
            console.log("getData:", data);
        }

        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener('/meta/connect', _metaConnect);
        //cometd.addListener('/service/**', getData); // TODO: remove debug
        //cometd.addListener('/meta/**', getData); // TODO: remove debug
        cometd.handshake();

    })(jQuery);

}, {

});
