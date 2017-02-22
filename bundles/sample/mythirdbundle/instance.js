/**
 * @class Oskari.sample.bundle.mythirdbundle.FlyoutHelloWorldBundleInstance
 *
 * Add this to startupsequence to get this bundle started
 {
            title : 'mythirdbundle',
            fi : 'mythirdbundle',
            sv : '?',
            en : '?',
            bundlename : 'mythirdbundle',
            bundleinstancename : 'mythirdbundle',
            metadata : {
                "Import-Bundle" : {
                    "mythirdbundle" : {
                        bundlePath : '/<path to>/packages/sample/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }
 */
Oskari.clazz.define("Oskari.sample.bundle.mythirdbundle.FlyoutHelloWorldBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {

        this.sandbox = null;
        this.plugins = {};
        this._localization = null;

        /**
         * @property mediator
         * Loader sets this
         */
        this.mediator = null;

    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'MyThirdBundle',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },
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
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},
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
         * @method startExtension
         * Extension protocol method
         */
        startExtension: function () {
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.sample.bundle.mythirdbundle.Flyout', me);
            me.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.sample.bundle.mythirdbundle.Tile', me);
        },

        /**
         * @method stopExtension
         * Extension protocol method
         */
        stopExtension: function () {
            var me = this;
            for (var pluginType in me.plugins) {
                if (pluginType) {
                    me.plugins[pluginType] = null;
                }
            }
        },

        /**
         * @method getPlugins
         * Extension protocol method
         */
        getPlugins: function () {
            return this.plugins;
        },


        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            var me = this;
            // Should this not come as a param?
            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            // register to sandbox as a module
            sandbox.register(me);
            // register to listening events
            for (var p in me.eventHandlers) {
                if (p) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            //Let's extend UI with Flyout and Tile
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // TODO: stateful to myfourthbundle?
            //sandbox.registerAsStateful(this.mediator.bundleId, this);

            // draw ui
            me._createUI();
        },

        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
            var me = this,
                handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },

        /**
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
            // not listening to any events
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            var me = this,
                sandbox = me.sandbox();
            // unregister from listening events
            for (var p in me.eventHandlers) {
                if (p) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }
            var request =
                sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(me);
            sandbox.request(me, request);
            // unregister module from sandbox
            me.sandbox.unregister(me);
        },

        /**
         * @method _createUI
         * @private
         *
         * Custom method, do what ever you like
         * Best practices: start internal/private methods with an underscore
         */
        _createUI: function () {
            var me = this;
            for (var pluginType in me.plugins) {
                if (pluginType) {
                    me.plugins[pluginType].createUI();
                }
            }
        }

    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    });
