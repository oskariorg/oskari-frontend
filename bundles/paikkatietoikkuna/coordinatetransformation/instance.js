/*
Ways to start the bundle in console:
* Oskari.app.playBundle(
    {
    bundlename : 'coordinatetransformation',
        metadata : {
            "Import-Bundle" : {
                "coordinatetransformation" : {
                    bundlePath : '/Oskari/packages/paikkatietoikkuna/bundle/'
                }
            }
        }
});
       var obj = {
            "bundlename":"coordinatetransformation" ,
            "metadata": {
                "Import-Bundle": { "coordinatetransformation": { "bundlePath": "/Oskari/packages/paikkatietikkuna/bundle/" } }
            }
        }
        appSetup.startupSequence.push(obj);
*/
Oskari.clazz.define("Oskari.coordinatetransformation.instance",
function () {
        var conf = this.getConfiguration();
        conf.name = 'coordinatetransformation';
        conf.flyoutClazz = 'Oskari.coordinatetransformation.Flyout'
        this.plugins = {};
        this._mapmodule = null;
        this.transformationService = null;
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
        return this.transformationService;
    },
    /**
     * @method afterStart
     */
    afterStart: function () {
        var sandbox = this.getSandbox();
        this.transformationService = this.createService(sandbox);
        this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var locale = this.getLocalization();
        this.helper = Oskari.clazz.create( 'Oskari.coordinatetransformation.helper', this, locale );

        this.instantiateViews();
        this.createUi();
    },
    getPlugins: function() {
        return this.plugins;
    },
    instantiateViews: function () {
        this.views = {
            transformation: Oskari.clazz.create('Oskari.coordinatetransformation.view.transformation', this),
            MapSelection: Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateMapSelection', this),
            mapmarkers: Oskari.clazz.create('Oskari.coordinatetransformation.view.mapmarkers', this)
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
    createUi: function () {
        this.plugins['Oskari.userinterface.Flyout'].createUi();
    },
    isMapSelectionMode: function () {
        return this.views["transformation"].isMapSelection;
    },
    /**
     * Creates the coordinatetransformation service and registers it to the sandbox.
     * @method createService
     * @param  {Oskari.Sandbox} sandbox
     * @return {Oskari.coordinatetransformation.TransformationService}
     */
    createService: function(sandbox) {
        var TransformationService = Oskari.clazz.create( 'Oskari.coordinatetransformation.TransformationService', this );
        sandbox.registerService(TransformationService);
        return TransformationService;
    }
}, {
        /**
         * @property {String[]} protocol
         * @static
         */
        extend : ["Oskari.userinterface.extension.DefaultExtension"],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
