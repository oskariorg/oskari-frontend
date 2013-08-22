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

    function (name, flyoutClazz, tileClazz, viewClazz) {
        "use strict";
        this.sandbox = null;
        this.plugins = {};
        this._localization = null;
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
            "use strict";
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            "use strict";
            return this.getLocalization('desc');
        },
        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            "use strict";
            return this.sandbox;
        },
        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {
            "use strict";
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
            "use strict";
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
            "use strict";
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
            "use strict";
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
            "use strict";
            var me = this,
                sandbox = me.sandbox,
                p,
                locFlyout,
                locTile,
                locView;

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
        /**
         * @method stopExtension
         * Extension protocol method
         */
        stopExtension: function () {
            "use strict";
            var me = this,
                sandbox = me.sandbox,
                p,
                pluginType;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }
            for (pluginType in me.plugins) {
                if (me.plugins.hasOwnProperty(pluginType)) {
                    if (pluginType) {
                        me.plugins[pluginType] = null;
                    }
                }
            }
        },
        /**
         * @method getPlugins
         * Extension protocol method
         */
        getPlugins: function () {
            "use strict";
            return this.plugins;
        },
        "init": function () {
            "use strict";
            return null;
        },
        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            "use strict";
            return this.conf.name;
        },
        /**
         * @method getConfiguration
         */
        getConfiguration: function () {
            "use strict";
            return this.conf;
        },

        /**
         * @property eventHandlers
         * may be overridden in derived classes to get some events
         */
        "eventHandlers": {

        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            "use strict";
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @method getLang
         * helper to get current language from Oskari
         *
         */
        "getLang": function () {
            "use strict";
            return Oskari.getLang();
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
