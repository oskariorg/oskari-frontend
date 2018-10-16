import Tiles3DModelBuilder from './Tiles3DModelBuilder';
import * as olProj from 'ol/proj';

/**
 * @class Oskari.map3dtiles.bundle.tiles3d.plugin.Tiles3DLayerPlugin
 * Provides functionality to draw 3D tiles on the map
 */
Oskari.clazz.define('Oskari.map3dtiles.bundle.tiles3d.plugin.Tiles3DLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.loc = Oskari.getMsg.bind(null, 'MapModule');
    }, {
        __name: 'Tiles3DLayerPlugin',
        _clazz: 'Oskari.map3dtiles.bundle.tiles3d.plugin.Tiles3DLayerPlugin',
        layertype: 'tiles3d',

        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported: function (layer) {
            if (!layer) {
                return false;
            }
            return layer.isLayerOfType(this.layertype);
        },
        /**
         * Applies currently selected Oskari style to tileset.
         * 
         * @method  _applyOskariStyle
         * @param  {Cesium.Cesium3DTileset}  tileset
         */
        _applyOskariStyle: function (tileset, layer) {
            if (!tileset || !layer) {
                return;
            }
            tileset.style = this.getMapModule().get3DStyle(layer.getCurrentStyleDef(), layer.getOpacity());
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    this.layertype + 'layer',
                    'Oskari.map3dtiles.bundle.tiles3d.domain.Tiles3DLayer'
                );
                mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', new Tiles3DModelBuilder());
            }
            this._initTilesetClickHandler();
        },
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            const layer = event.getMapLayer();
            const tilesets = this.getOLMapLayers(layer);

            if (!tilesets || tilesets.length === 0) {
                return;
            }
            tilesets.forEach(tileset => this._applyOskariStyle(tileset, layer));
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent} event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            const layer = event.getMapLayer();
            const tilesets = this.getOLMapLayers(layer);

            if (!tilesets || tilesets.length === 0) {
                return;
            }
            tilesets.forEach(tileset => this._applyOskariStyle(tileset, layer));
        },

        /**
         * Handle 3D tile feature clicks
         * @private
         */
        _initTilesetClickHandler: function () {
            const me = this;
            const scene = me.getMapModule().getCesiumScene();
            const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(movement => {
                const feature = scene.pick(movement.position);
                if (!(feature instanceof Cesium.Cesium3DTileFeature)) {
                    return;
                }
                let tableContent = '';
                feature.getPropertyNames().forEach(name => {
                    tableContent += `<tr><td>${name}</td><td>${feature.getProperty(name)}</td></tr>`;
                });
                if (tableContent.length === 0) {
                    return;
                }
                let content = [{html: `<table>${tableContent}</table>`}];
                const location = me.getMapModule().getMouseLocation(movement.position);
                // Request info box
                const infoRequestBuilder = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest');
                const title = me.loc('plugin.GetInfoPlugin.title');
                this._sandbox.request(me, infoRequestBuilder('tilesetFeatureAttributes', title, content, location));
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },

        /**
         * Adds a single 3d tileset to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.map3dtiles.bundle.tiles3d.domain.Tiles3DLayer} layer
         */
        addMapLayerToMap: function (layer) {
            // Common settings for the dynamicScreenSpaceError optimization
            // copied from Cesium.Cesium3DTileset api doc.
            var tileset = new Cesium.Cesium3DTileset({
                url: layer.getLayerUrls()[0],
                dynamicScreenSpaceError: true,
                dynamicScreenSpaceErrorDensity: 0.00278,
                dynamicScreenSpaceErrorFactor: 4.0,
                dynamicScreenSpaceErrorHeightFalloff: 0.25
            });

            this.getMapModule().addLayer(tileset);
            layer.setQueryable(false);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), tileset);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
