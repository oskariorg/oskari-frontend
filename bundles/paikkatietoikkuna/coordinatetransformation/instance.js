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
Oskari.clazz.define('Oskari.coordinatetransformation.instance',
    function () {
        var conf = this.getConfiguration();
        conf.name = 'coordinatetransformation';
        conf.flyoutClazz = 'Oskari.coordinatetransformation.Flyout';
        this.plugins = {};
        // this._mapmodule = null;
        this.transformationService = null;
        this.dataHandler = null;
        this.views = null;
        this.helper = null;
        this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        this.isMapSelection = false;
        this.isRemoveMarkers = false;
        this.sandbox = Oskari.getSandbox();
        // TODO should dimensions be handled by dataHandler
        this.dimensions = {
            input: 2,
            output: 2
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
        setDimension: function (type, srs, elevation) {
            this.dimensions[type] = this.helper.getDimension(srs, elevation);
        },
        getDimension: function (type) {
            return this.dimensions[type];
        },
        getDimensions: function () {
            return this.dimensions;
        },
        /**
     * @method afterStart
     */
        afterStart: function () {
            this.helper = Oskari.clazz.create('Oskari.coordinatetransformation.helper');
            this.transformationService = Oskari.clazz.create('Oskari.coordinatetransformation.TransformationService', this);
            this.dataHandler = Oskari.clazz.create('Oskari.coordinatetransformation.CoordinateDataHandler', this.helper);
            this.instantiateViews();
            this.createUi();
            this.bindListeners();
        },
        bindListeners: function () {
            var me = this;
            var dimensions = this.getDimensions();
            this.dataHandler.on('InputCoordAdded', function (coords) {
                me.views.transformation.inputTable.render(coords, dimensions.input);
            });
            this.dataHandler.on('InputCoordsChanged', function (coords) {
                me.views.transformation.inputTable.render(coords, dimensions.input);
            });
            this.dataHandler.on('ResultCoordsChanged', function (coords) {
                me.views.transformation.outputTable.render(coords, dimensions.output);
            });
        },
        getPlugins: function () {
            return this.plugins;
        },
        getDataHandler: function () {
            return this.dataHandler;
        },
        getHelper: function () {
            return this.helper;
        },
        instantiateViews: function () {
            this.views = {
                transformation: Oskari.clazz.create('Oskari.coordinatetransformation.view.transformation', this, this.helper, this.dataHandler),
                MapSelection: Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateMapSelection', this),
                mapmarkers: Oskari.clazz.create('Oskari.coordinatetransformation.view.mapmarkers', this)
            };
        },
        toggleViews: function (view) {
            var views = this.getViews();
            if (!views[view]) {
                return;
            }
            Object.keys(views).forEach(function (view) {
                views[view].setVisible(false);
            });
            views[view].setVisible(true);
        },
        createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createUi();
        },
        setMapSelectionMode: function (isSelect) {
            this.isMapSelection = !!isSelect;
            if (isSelect === true) {
                this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false]);
            } else {
                this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true]);
            }
        },
        setRemoveMarkers: function (isRemove) {
            this.isRemoveMarkers = isRemove;
        },
        addMapCoordsToInput: function (addBln) { // event??
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
    }, */
        eventHandlers: {
            'MapClickedEvent': function (event) {
                if (!this.isMapSelection || this.isRemoveMarkers) {
                    return;
                }
                var lonlat = event.getLonLat();
                var label;
                var markerId;
                var roundedLonLat = {
                    lon: parseInt(lonlat.lon),
                    lat: parseInt(lonlat.lat)
                };
                // add coords to map coords
                markerId = this.dataHandler.addMapCoord(roundedLonLat);
                label = this.helper.getLabelForMarker(roundedLonLat);
                this.helper.addMarkerForCoords(markerId, roundedLonLat, label);
            },
            'MarkerClickEvent': function (event) {
                if (!this.isMapSelection) {
                    return;
                }
                var markerId = event.getID();
                if (this.isRemoveMarkers === true) {
                    this.dataHandler.removeMapCoord(markerId);
                    this.sandbox.postRequestByName('MapModulePlugin.RemoveMarkersRequest', [markerId]);
                }
            },
            'userinterface.ExtensionUpdatedEvent': function (event) {
                if (event.getExtension().getName() !== this.getName()) {
                    return;
                }
                var state = event.getViewState();
                if (state === 'attach' || state === 'restore') {
                    this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
                } else if (state === 'close' || state === 'minimize') {
                    this.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                }
            },
            'MapSizeChangedEvent': function (event) {
                this.plugins['Oskari.userinterface.Flyout'].setContainerMaxHeight(event.getHeight());
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        extend: ['Oskari.userinterface.extension.DefaultExtension'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });
