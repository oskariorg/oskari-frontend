/**
 * @class Oskari.userinterface.extension.DefaultExtension
 *
 *
 */
Oskari.clazz.define("Oskari.userinterface.extension.DefaultExtension",

    /**
     * @method create called automatically on construction
     * @static
     * @param name {String} bundle name to be used for communication with sandbox
     * @param tileClazz {String} an optional class name for
     *
     */

    function (name, flyoutClazz, tileClazz, viewClazz,locale) {
        this.sandbox = null;
        this.plugins = {};
        this._localization = locale;
        this.conf = {
            "name": name,
            "tileClazz": tileClazz || 'Oskari.userinterface.extension.DefaultTile',
            "flyoutClazz": flyoutClazz || 'Oskari.userinterface.extension.DefaultFlyout',
            "viewClazz": viewClazz
        };
    }, {
        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {
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
            var me = this,
                conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;


            me.sandbox = sandbox;
            sandbox.register(this);

            /* stateful */
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

            sandbox.request(this, request);

        },
        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            var sandbox = this.sandbox,
                /* sandbox cleanup */
                request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.sandbox = null;
            this.started = false;
        },
        /**
         * @method startExtension
         * Extension protocol method
         */
        startExtension: function () {
            var me = this,
                sandbox = me.sandbox,
                p,
                locFlyout,
                locTile,
                locView;
            
            me.startPlugin();

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

            locFlyout = me.getLocalization('flyout');
            if (locFlyout && me.conf.flyoutClazz) {
                me.plugins['Oskari.userinterface.Flyout'] =
                    Oskari.clazz.create(me.conf.flyoutClazz, me, locFlyout);
            }

            locTile = me.getLocalization('tile');
            if (locTile && me.conf.tileClazz) {
                me.plugins['Oskari.userinterface.Tile'] =
                    Oskari.clazz.create(me.conf.tileClazz, me, locTile);
            }

            locView = me.getLocalization('view');
            if (locView && me.conf.viewClazz) {
                me.plugins['Oskari.userinterface.View'] =
                    Oskari.clazz.create(me.conf.viewClazz, me, locView);
            }
        },
        
        /* hook */
        startPlugin: function () {
            
        },

        /* hook */
        stopPlugin: function () {
            
        },
        
        /**
         * @method stopExtension
         * Extension protocol method
         */
        stopExtension: function () {
            var me = this,
                sandbox = me.sandbox,
                p,
                pluginType;
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
            for (pluginType in me.plugins) {
                if (me.plugins.hasOwnProperty(pluginType)) {
                    if (pluginType) {
                        me.plugins[pluginType] = null;
                    }
                }
            }
            
            me.stopPlugin();
        },
        /**
         * @method getPlugins
         * Extension protocol method
         */
        getPlugins: function () {
            return this.plugins;
        },
        "init": function () {
            return null;
        },
        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.conf.name;
        },
        /**
         * @method getConfiguration
         */
        getConfiguration: function () {
            return this.conf;
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
        
        /* O2 helpers */

        getTile: function () {
            return this.plugins['Oskari.userinterface.Tile'];
        },
        setTile: function (t) {
            this.plugins['Oskari.userinterface.Tile'] = t;
        },
        setDefaultTile: function (txt) {
            var tileCls = Oskari.cls().extend('Oskari.userinterface.extension.DefaultTile');
            var tile = tileCls.create(this, {
                title: txt || ''
            });
            this.plugins['Oskari.userinterface.Tile'] = tile;
            return tile;
        },
        getFlyout: function () {
            return this.plugins['Oskari.userinterface.Flyout'];
        },
        setFlyout: function (f) {
            this.plugins['Oskari.userinterface.Flyout'] = f;
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
            return this.getSandbox().request(this.getExtension(), request);
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
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
