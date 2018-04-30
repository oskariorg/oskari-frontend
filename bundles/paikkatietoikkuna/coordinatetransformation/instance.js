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
        this.dimensions = {
            input: 2,
            result: 2
        };
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
    setDimension: function (type, srs, elevation){
        var srsValues = this.getEpsgValues(srs),
            dimension;
        if (srsValues && (srsValues.coord === "COORD_PROJ_3D" || srsValues.coord === "COORD_GEOG_3D")){
            dimension = 3;
        } else if (elevation !== ""){
            dimension = 3;
        } else {
            dimension = 2;
        }
        this.dimensions[type] = dimension;
    },
    getDimension: function (type){
        return this.dimensions[type];
    },
    /**
     * @method afterStart
     */
    afterStart: function () {
        this.transformationService = Oskari.clazz.create( 'Oskari.coordinatetransformation.TransformationService', this );
        //this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.helper = Oskari.clazz.create( 'Oskari.coordinatetransformation.helper', this);
        this.dataHandler = Oskari.clazz.create( 'Oskari.coordinatetransformation.CoordinateDataHandler' );
        this.coordSystemOptions = this.helper.getOptionsJSON();
        this.helper.createCls(this.coordSystemOptions);
        this.instantiateViews();
        this.createUi();
        this.bindListeners();
    },
    bindListeners: function (){
        var me = this;
        this.dataHandler.on('InputCoordAdded', function (coords) {
            me.views.transformation.inputTable.render(coords);
        });
        this.dataHandler.on('InputCoordsChanged', function (coords) {
            me.views.transformation.inputTable.render(coords);
        });
        this.dataHandler.on('ResultCoordsChanged', function (coords) {
            me.views.transformation.outputTable.render(coords);
        });
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
    hasInputCoords: function () { //TODO to handler
        return this.dataHandler.getInputCoords().length !== 0;
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
    setMapSelectionMode: function (isSelect){
        this.isMapSelection = !!isSelect;
        if (isSelect === true){
            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false]);
        } else {
            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true]);
        }
    },
    addMapCoordsToInput: function (addBln){ //event??
        this.getDataHandler().addMapCoordsToInput(addBln);
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
    eventHandlers: {
        'MapClickedEvent': function ( event ) {
            if (!this.isMapSelection) {
                return;
            }
            var lonlat = event._lonlat;
            var coordArray = this.dataHandler.lonLatCoordToArray(lonlat, true); //TODO check mapSrs lonFirst

            //add coords to map coords
            this.dataHandler.addMapCoord(lonlat);
            this.helper.addMarkerForCoords(coordArray, true, true); //TODO check mapSrs lonFirst
        },
        'userinterface.ExtensionUpdatedEvent': function (event) {
            if(event.getExtension().getName() !==this.getName()){
                return;
            }
            var state = event.getViewState();
            if (state === "attach" || state === "restore"){
                this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            } else if (state === "close" || state === "minimize"){
                this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            }
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
