/**
 * @class Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance
 *
 * This bundle shows the name, area, and length information about the selected feature of
 * registered layers on the map.
 *
 * Does not require any configurations in application config.json.
 *
 * This bundle does not send any events. This bundel listens for events with the following name:
 * 'ParcelInfo.ParcelLayerRegisterEvent' and 'ParcelInfo.ParcelLayerUnregisterEvent'.
 *
 * Registers and starts the
 * {Oskari.mapframework.bundle.parcelinfo.plugin.ParcelInfoPlugin} plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelinfo.ParcelInfoInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this._plugin = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'parcelinfo';
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox} Oskari sandbox
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {},
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

            // Should this not come as a param?
            var sandbox = Oskari.$('sandbox');
            me.setSandbox(sandbox);

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var conf = {};
            var locale = this.getLocalization('display');
            var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.parcelinfo.plugin.ParcelInfoPlugin', conf, locale);
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);
            this._plugin = plugin;
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
        protocol: ['Oskari.bundle.BundleInstance']
    });