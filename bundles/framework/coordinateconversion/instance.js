/*
* Oskari.app.playBundle(
    {
    bundlename : 'coordinateconversion',
        metadata : {
            "Import-Bundle" : {
                "coordinateconversion" : {
                    bundlePath : '/Oskari/packages/framework/bundle/'
                }
            }
        }
});
            var l = appSetup.startupSequence.length;
            appSetup.startupSequence[l] = {
                "bundleinstancename":"coordinateconversion",
                "bundlename":"coordinateconversion" ,
                "fi":"",
                "sv":"",
                "en":"",
                "title":"coordinateconversion" 
            }
            appSetup.startupSequence[l].metadata= { "Import-Bundle": { "coordinateconversion": { "bundlePath": "/Oskari/packages/framework/bundle/" } } };
*/
Oskari.clazz.define("Oskari.mapframework.bundle.coordinateconversion.CoordinateConversionBundleInstance",
function () {
        this.sandbox = null;
        this._localization = null;
        this.plugins = {};
        this._mapmodule = null;
}, {
    __name: 'coordinateconversion',
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
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     * Creates a flyout and a tile:
     * Oskari.mapframework.bundle.maplegend.Flyout
     * Oskari.mapframework.bundle.maplegend.Tile
     */
    startExtension: function () {
        this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.Flyout', this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.Tile', this);
    },
    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     * Clears references to flyout and tile
     */
    stopExtension: function () {
        // this.plugins['Oskari.userinterface.Flyout'] = null;
        this.plugins['Oskari.userinterface.Tile'] = null;
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
    isEmbedded: function() {
        return jQuery('#contentMap').hasClass('published');
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
        me._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var locale = this.getLocalization();
        sandbox.register(me);
        if( !me.isEmbedded() ) {
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);
            me.createUi();
        } else {
             me.createPlugin();
        }
    },
    stop: function () {
        this.sandbox = null;
        this.started = false;
    },
    createPlugin: function() {
        var conf = this.conf || {};

        var plugin = Oskari.clazz.create('Oskari.mapframework.bundle.coordinateconversion.plugin.ConversionPlugin', conf, this.plugins);

        this._mapmodule.registerPlugin(plugin);
        this._mapmodule.startPlugin(plugin);
        this.plugin = plugin;
    },
    getPlugins: function() {
        return this.plugins;
    },
    /**
     * @method createUi
     * (re)creates the UI for "all layers" functionality
     */
    createUi: function () {
        this.plugins['Oskari.userinterface.Flyout'].createUi();
        this.plugins['Oskari.userinterface.Tile'].refresh();
    },

}, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
