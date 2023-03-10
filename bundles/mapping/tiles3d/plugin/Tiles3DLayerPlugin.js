import { Tiles3DModelBuilder } from './Tiles3DModelBuilder';
import { applyCustomMaterialSettings } from '../util/overrideCesiumMaterial'; // for side effects only

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

/**
 * @class Oskari.mapframework.mapmodule.Tiles3DLayerPlugin
 * Provides functionality to draw 3D tiles on the map
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.Tiles3DLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.loc = Oskari.getMsg.bind(null, 'MapModule');
    }, {
        __name: 'Tiles3DLayerPlugin',
        _clazz: 'Oskari.mapframework.mapmodule.Tiles3DLayerPlugin',
        layertype: 'tiles3d',
        _layerFilterId: '3d',

        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean} true if this plugin handles the type of layers
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
            tileset.style = this.getMapModule().get3DStyle(layer.getCurrentStyle(), layer.getOpacity());
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                const registerType = this.layertype + 'layer';
                const clazz = 'Oskari.mapframework.mapmodule.Tiles3DLayer';
                const composingModel = new LayerComposingModel([
                    LayerComposingModel.CESIUM_ION,
                    LayerComposingModel.SRS,
                    LayerComposingModel.VECTOR_STYLES,
                    LayerComposingModel.EXTERNAL_VECTOR_STYLES,
                    LayerComposingModel.URL
                ]);
                mapLayerService.registerLayerModel(registerType, clazz, composingModel);
                mapLayerService.registerLayerModelBuilder(registerType, new Tiles3DModelBuilder());
                // register layerlist filter for 3D layers
                mapLayerService.registerLayerFilter(this._layerFilterId, (layer) => {
                    return layer.isLayerOfType(this.layertype);
                });
            }
            this._registerForLayerFiltering();
            if (!this.getMapModule().getSupports3D()) {
                return;
            }
            this._initTilesetClickHandler();
            applyCustomMaterialSettings();
        },
        _registerForLayerFiltering: function () {
            // Add layerlist filter button for 3D layers after app is started
            Oskari.on('app.start', () => {
                const layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
                if (layerlistService) {
                    const id = this._layerFilterId;
                    layerlistService.registerLayerlistFilterButton(
                        Oskari.getMsg('MapModule', 'plugin.Tiles3DLayerPlugin.layerFilter.text'),
                        Oskari.getMsg('MapModule', 'plugin.Tiles3DLayerPlugin.layerFilter.tooltip'),
                        {
                            active: 'layer-' + id,
                            deactive: 'layer-' + id + '-disabled'
                        },
                        id);
                }
            });
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
                let content = [{ html: `<table>${tableContent}</table>` }];
                const location = me.getMapModule().getMouseLocation(movement.position);
                // Request info box
                const infoRequestBuilder = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest');
                const title = me.loc('plugin.GetInfoPlugin.title');
                this._sandbox.request(me, infoRequestBuilder('tilesetFeatureAttributes', title, content, location));
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        },

        /**
         * Disable shadows for tilesets containing point cloud tiles.
         * Improves rendering performance.
         * @private
         *
         * @method disablePointCloudShadows
         * @param {Cesium.Cesium3DTileset} tileset
         */
        _disablePointCloudShadows: function (tileset) {
            const tileTypeCheck = tile => {
                if (tile.content.pointsLength > 0) {
                    tileset.shadows = Cesium.ShadowMode.DISABLED;
                    tileset.tileLoad.removeEventListener(tileTypeCheck);
                }
            };
            tileset.tileLoad.addEventListener(tileTypeCheck);
        },
        /**
         * Adds a single 3d tileset to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.map3dtiles.bundle.tiles3d.domain.Tiles3DLayer} layer
         */
        addMapLayerToMap: function (layer) {
            if (!this.getMapModule().getSupports3D()) {
                return;
            }
            const options = layer.getOptions() || {};
            const { ionAssetId, ionAssetServer, ionAccessToken } = options;

            const url = ionAssetId
                ? Cesium.IonResource.fromAssetId(ionAssetId, { server: ionAssetServer, accessToken: ionAccessToken })
                : layer.getLayerUrl();
            // Common settings for the dynamicScreenSpaceError optimization
            // copied from Cesium.Cesium3DTileset api doc:
            // https://cesium.com/docs/cesiumjs-ref-doc/Cesium3DTileset.html
            var tileset = new Cesium.Cesium3DTileset({
                url,
                dynamicScreenSpaceError: true,
                dynamicScreenSpaceErrorDensity: 0.00278,
                dynamicScreenSpaceErrorFactor: 4.0,
                dynamicScreenSpaceErrorHeightFalloff: 0.25,
                ...options
            });

            this._disablePointCloudShadows(tileset);
            this._applyOskariStyle(tileset, layer);
            this.getMapModule().addLayer(tileset);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), tileset);
        },
        /**
         * Called when layer details are updated (for example by the admin functionality)
         * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
         */
        _updateLayer: function (layer) {
            // no-op - 3DTiles scale limits or runtime changes to config not supported at this time
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
