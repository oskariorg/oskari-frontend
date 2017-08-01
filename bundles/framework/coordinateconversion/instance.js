Oskari.clazz.define("Oskari.mapframework.bundle.coordinateconversion.CoordinateConversionBundleInstance",
function () {
        this.sandbox = null;
        this._localization = null;
}, {
    __name: 'coordinateconverter',
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

        var conf = me.conf || {},
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName);
        me.setSandbox(sandbox);
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var locale = this.getLocalization('display');
        this.plugin = plugin;
        sandbox.register(me);
    },
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
