/**
/**
 * @class Oskari.userinterface.extension.DefaultModule
 *
 *
 */
Oskari.clazz.define("Oskari.userinterface.extension.DefaultModule",

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function () {
    }, {
        name : 'Oskari.userinterface.extension.DefaultModule',
        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Convenience method to call from Tile and Flyout
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            var conf = this.getConfiguration();
                
            var me = this,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request,
                p;


            me.sandbox = sandbox;
            sandbox.register(this);

            for (p in me.requestHandlers) {
                if (me.requestHandlers.hasOwnProperty(p)) {
                    sandbox.addRequestHandler(p, this);
                }
            }
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            /* stateful */
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            this.afterStart(sandbox);
        },
        /**
         * Hook for bundle specific start functionality. 
         * Override this in extending bundle to hook in your own startup functionality.
         * @param  {Oskari.mapframework.sandbox.Sandbox} sandbox 
         */
        afterStart: function (sandbox) {},
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
            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.sandbox = null;
        },

        "init": function () {
            return null;
        },
        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.name;
        },
        /**
         * @method getConfiguration
         */
        getConfiguration: function () {
            return this.conf || {};
        },
        getState : function() {
            return this.state || {};
        },

        /**
         * @property eventHandlers
         * may be overridden in derived classes to get some events
         */
        "eventHandlers": {

        },
        "requestHandlers": {

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

        /* o2 support for handling requests with less code... */
        handleRequest: function (core, request) {
            return this.onRequest(request);
        },

        onRequest: function (request) {
            var me = this;
            var handler = me.requestHandlers[request.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [request]);
        },


        /**
         * @method getLang
         * helper to get current language from Oskari
         *
         */
        "getLang": function () {
            return Oskari.getLang();
        },


        /* o2 helpers for notifications and requetss */
        slicer: Array.prototype.slice,

        notify: function (evt, retainEvent) {
            return this.getSandbox().notifyAll(evt, retainEvent);
        },

        request: function (request) {
            return this.getSandbox().request(this, request);
        },

        /**
         * @method issue issues a request to sandbox and returns value from *the* registered requesthandler if any
         *
         */
        issue: function () {
            var requestName = arguments[0];
            var args = this.slicer.apply(arguments, [1]);
            var builder = this.getSandbox().getRequestBuilder(requestName);
            var request = builder.apply(builder, args);
            return this.getSandbox().request(this.getName(), request);
        },

        /**
         *@method notify sends notification to any registered listeners
         */
        notify: function () {
            var eventName = arguments[0];
            var args = this.slicer.apply(arguments, [1]);
            var builder = this.getSandbox().getEventBuilder(eventName);
            var evt = builder.apply(builder, args);
            return this.getSandbox().notifyAll(evt);
        }
    }, {
        protocol: ['Oskari.mapframework.module.Module']
    });
