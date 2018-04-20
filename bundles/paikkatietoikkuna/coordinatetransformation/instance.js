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
                "Import-Bundle": { "coordinatetransformation": { "bundlePath": "/Oskari/packages/paikkatietoikkuna/bundle/" } }
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
        //this._mapmodule = null;
        this.transformationService = null;
        this.dataHandler = null;
        this.views = null;
        this.helper = null;
        this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        this.isMapSelection = false;
        this.sandbox = Oskari.getSandbox();
        this.coordSystemOptions = null;
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
        for ( var p in this.eventHandlers ) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                this.sandbox.registerForEventByName(this, p);
            }
        }
        this.transformationService = Oskari.clazz.create( 'Oskari.coordinatetransformation.TransformationService', this );
        //this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.helper = Oskari.clazz.create( 'Oskari.coordinatetransformation.helper', this);
        this.dataHandler = Oskari.clazz.create( 'Oskari.coordinatetransformation.CoordinateDataHandler' );
        this.coordSystemOptions = this.helper.getOptionsJSON();
        this.helper.createCls(this.coordSystemOptions);
        this.instantiateViews();
        this.createUi();
    },
    getcoordSystemOptions: function () {
        return this.coordSystemOptions;
    },
    getEpsgValues: function (srs) {
        return this.coordSystemOptions["geodetic-coordinate"][srs];
    },
    getPlugins: function() {
        return this.plugins;
    },
    getDataHandler: function() {
        return this.dataHandler;
    },
    getHelper: function () {
        return this.helper;
    },
    hasInputCoords: function () {
        return this.dataHandler.getData().inputCoords.length !== 0;
    },
    instantiateViews: function () {
        this.views = {
            transformation: Oskari.clazz.create('Oskari.coordinatetransformation.view.transformation', this, this.getcoordSystemOptions()),
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
    mapSelectionMode: function () {
        return this.isMapSelection;
    },
    setMapSelectionMode: function (isSelect){
        this.isMapSelection = !!isSelect;
        if (isSelect === true){
            this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false]);
        } else {
            this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true]);
        }
    },
    addMapCoordsToInput: function (addBln){
        this.getDataHandler().addMapCoordsToInput(addBln);
        if (addBln === true){
            this.views.transformation.refreshTableData();
        }
    },
    /**
     * Creates the coordinatetransformation service and registers it to the sandbox.
     * @method createService
     * @param  {Oskari.Sandbox} sandbox
     * @return {Oskari.coordinatetransformation.TransformationService}
     *
    createService: function(sandbox) {
        var transformationService = Oskari.clazz.create( 'Oskari.coordinatetransformation.TransformationService', this );
        sandbox.registerService(transformationService);
        return transformationService;
    },*/
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler){
            return;
        }
        return handler.apply(this, [event]);
    },
    eventHandlers: {
        'MapClickedEvent': function ( event ) {
            if (!this.mapSelectionMode()) {
                return;
            }
            var lonlat = event._lonlat;
            var coordArray = this.dataHandler.lonLatCoordToArray(lonlat, true);

            //add coords to map coords
            this.dataHandler.addMapCoord(lonlat);
            this.helper.addMarkerForCoords(coordArray, true, true);
        }
    }
}, {
        /**
         * @property {String[]} protocol
         * @static
         */
        extend : ["Oskari.userinterface.extension.DefaultExtension"],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
