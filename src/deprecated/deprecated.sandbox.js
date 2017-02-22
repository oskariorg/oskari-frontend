/**
 * ***********************************************************************************************
 * Deprecated sandbox functions
 * ***********************************************************************************************
 */
(function(o) {
	var log = o.log('Sandbox.deprecated');

    var extraInfo = {
    	addRequestHandler : "Use Sandbox.requestHandler(requestName, handlerInstance) instead.",
    	removeRequestHandler : "Use Sandbox.requestHandler(requestName, null) instead.",
    	isCtrlKeyDown : "It works on Openlayers 2 only.",
		getEventBuilder : "Use Oskari.eventBuilder() instead.",
		getRequestBuilder : "Use Oskari.requestBuilder() instead.",
		printDebug : "Use Oskari.log() instead.",
		printWarn : "Use Oskari.log() instead.",
		printError : "Use Oskari.log() instead.",
		setUser : "Use Oskari.user() instead.",
		getUser : "Use Oskari.user() instead"
    };
    // Warn 2 times before falling silent
    var warnMessagesSent = {};
    var warn = function(name) {
        if(!warnMessagesSent[name]) {
            warnMessagesSent[name] = 0;
        }
        warnMessagesSent[name]++;
        if(warnMessagesSent[name] < 3) {
			log.warn('Sandbox.' + name + '() will be removed in future release.', extraInfo[name] || 'Remove calls to it.');
        }
    };
    Oskari.clazz.category('Oskari.Sandbox', 'deprecated-sb-methods', {
        /**
         * @method addRequestHandler
         * Registers a request handler for requests with the given name
         * NOTE: only one request handler can be registered/request
         * @param {String} requestName - name of the request
         * @param {Oskari.mapframework.core.RequestHandler} handlerInstance request handler
         */
        addRequestHandler: function (requestName, handlerInstance) {
        	warn('addRequestHandler');
            this.requestHandler(requestName, handlerInstance);
        },

        /**
         * @method removeRequestHandler
         * Unregisters a request handler for requests with the given name
         * NOTE: only one request handler can be registered/request
         * @param {String} requestName - name of the request
         * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
         */
        removeRequestHandler: function (requestName, handlerInstance) {
        	warn('removeRequestHandler');
            this.requestHandler(requestName, null);
        },

        isCtrlKeyDown : function() {
        	warn('isCtrlKeyDown');
            return Oskari.ctrlKeyDown();
        },
        /**
         * @method getRequestBuilder
         *
         * Access to request builder that creates requests by name
         * rather than by class name
         * @param {String} name request name that we are creating
         * @return {Function} builder function for given request
         */
        getRequestBuilder: function (name) {
        	warn('getRequestBuilder');
            if(!this.hasHandler(name)) {
                log.warn('Request ' + name + ' defined, but handler not registered. Perhaps timing issue?');
                return undefined;
            }
            return Oskari.requestBuilder(name);
        },

        /**
         * @method getEventBuilder
         *
         * Access to event builder that creates events by name
         *
         * @param {String} name request name that we are creating
         * @return {Function} builder function for given event
         */
        getEventBuilder: function (name) {
        	warn('getEventBuilder');
            return Oskari.eventBuilder(name);
        },
        /**
         * @method printDebug
         * Utility method for printing debug messages to browser console
         */
        printDebug: function () {
        	warn('printDebug');
            log.debug.apply(log, arguments);
        },
        /**
         * @method printWarn
         * Utility method for printing warn messages to browser console
         */
        printWarn: function () {
        	warn('printWarn');
            log.warn.apply(log, arguments);
        },
        /**
         * @method printError
         * Utility method for printing error messages to browser console
         */
        printError: function () {
        	warn('printError');
            log.error.apply(log, arguments);
        },

        /**
         * @method setUser
         *
         * Creates Oskari.User from the given data as current
         * user
         * @param {Object} userData
         *     JSON presentation of user
         */
        setUser: function (userData) {
        	warn('setUser');
        	Oskari.user(userData);
        },

        /**
         * @method getUser
         * Returns current user. See #setUser
         *
         * @return {Oskari.User} user
         */
        getUser: function () {
        	warn('getUser');
        	return Oskari.user();
        }
    });

}(Oskari));