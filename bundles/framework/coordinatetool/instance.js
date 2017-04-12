/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.coordinatetool.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this.coordinateToolService = undefined;
    }, {
        __name: 'coordinatetool',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * Needed by sandbox.register()
         */
        init : function() {},

        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
            var me = this;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
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
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var conf = me.conf || {},
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.setSandbox(sandbox);
            this.coordinateToolService = this.createService(sandbox, conf);
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var locale = this.getLocalization('display');
            var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin', this, conf, locale, mapModule, sandbox);
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);
            this.plugin = plugin;
            sandbox.register(me);


            //get the plugin order straight in mobile toolbar even for the tools coming in late
            if (Oskari.util.isMobile() && this.plugin.hasUI()) {
                mapModule.redrawPluginUIs(true);
            }
        },
        /**
         * @method  @public isOpen
         * @return {Boolean} is popup open
         */
        isOpen: function(){
            var me = this;
            return (me.plugin) ? me.plugin.isOpen() : false;
        },
        /**
         * Creates the coordinate tool service and registers it to the sandbox.
         *
         * @method createService
         * @param  {Oskari.Sandbox} sandbox
         * @param  {}  configuration   conf.reverseGeocodingIds is in use
         * @return {Oskari.mapframework.bundle.coordinatetool.CoordinateToolService}
         */
        createService: function(sandbox, conf) {
            var coordinateToolService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.coordinatetool.CoordinateToolService',
                this, conf || {}
            );
            sandbox.registerService(coordinateToolService);
            return coordinateToolService;
        },
        /**
         * Returns the coordinate tool service.
         *
         * @method getService
         * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
         */
        getService: function() {
            return this.coordinateToolService;
        },
        /**
         * @public @method showMessage
         * Shows user a message with ok button
         *
         * @param {String} title popup title
         * @param {String} message popup message
         *
         */
        showMessage: function (title, message) {
            var dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            dialog.show(title, message);
            dialog.fadeout(5000);
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
            this.started = false;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });