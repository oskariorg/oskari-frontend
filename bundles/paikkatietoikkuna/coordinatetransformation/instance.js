/*
Ways to start the bundle in console:
* Oskari.app.playBundle(
    {
    bundlename : 'coordinateconversion',
        metadata : {
            "Import-Bundle" : {
                "coordinateconversion" : {
                    bundlePath : '/Oskari/packages/paikkatietoikkuna/bundle/'
                }
            }
        }
});
            var l = appSetup.startupSequence.length;
            appSetup.startupSequence[l] = {
                "bundlename":"coordinateconversion" ,
            }
            appSetup.startupSequence[l].metadata= { "Import-Bundle": { "coordinateconversion": { "bundlePath": "/Oskari/packages/paikkatietoikkuna/bundle/" } } };
*/
Oskari.clazz.define("Oskari.coordinatetransformation.instance",
function () {
        var conf = this.getConfiguration();
        conf.name = 'coordinatetransformation';
        conf.flyoutClazz = 'Oskari.coordinateconversion.Flyout'
        this.sandbox = null;
        this._localization = null;
        this.plugins = {};
        this._mapmodule = null;
        this.conversionservice = null;
        this.views = null;
        this.helper = null;
}, {
    __name: 'coordinatetransformation',
    getName: function () {
            return this.__name;
    },
    getViews: function () {
        return this.views;
    },
    getService: function () {
        return this.conversionservice;
    },
    /**
     * @method afterStart
     */
    afterStart: function () {
        var me = this;
        var sandbox = this.getSandbox();

        this.conversionservice = this.createService(sandbox);
        me._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var locale = this.getLocalization();
        this.helper = Oskari.clazz.create('Oskari.coordinateconversion.helper', this, this._localization);
        
        me.instantiateViews();
        me.createUi();

    },
    stop: function () {
        this.sandbox = null;
        this.started = false;
    },
    getPlugins: function() {
        return this.plugins;
    },
    instantiateViews: function () {
        this.views = {
            conversion: Oskari.clazz.create('Oskari.coordinateconversion.view.conversion', this),
            mapselect: Oskari.clazz.create('Oskari.coordinateconversion.view.mapselect', this),
            mapmarkers: Oskari.clazz.create('Oskari.coordinateconversion.view.mapmarkers', this)
        }
    },
    toggleViews: function (view) {
        var views = this.getViews();
        if( !views[view] ) {
           return;
        }
        Object.keys( views ).forEach( function ( view ) {
            views[view].setVisible(false);
        });
        views[view].setVisible(true);
    },
    /**
     * @method createUi
     * (re)creates the UI for "all layers" functionality
     */
    createUi: function () {
        this.plugins['Oskari.userinterface.Flyout'].createUi();
    },
            /**
         * Creates the coordinateconversion service and registers it to the sandbox.
         *
         * @method createService
         * @param  {Oskari.Sandbox} sandbox
         * @param  {}  configuration   conf.reverseGeocodingIds is in use
         * @return {Oskari.mapframework.bundle.coordinatetool.CoordinateToolService}
         */
        createService: function(sandbox) {
            var coordinateToolService = Oskari.clazz.create( 'Oskari.coordinateconversion.ConversionService', this );
            sandbox.registerService(coordinateToolService);
            return coordinateToolService;
        },

}, {
        /**
         * @property {String[]} protocol
         * @static
         */
        extend : ["Oskari.userinterface.extension.DefaultExtension"],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
