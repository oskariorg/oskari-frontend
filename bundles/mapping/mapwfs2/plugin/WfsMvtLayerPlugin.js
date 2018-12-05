import {normalStyle, selectedStyle} from './defaultStyle';
import VectorTileLayerPlugin from '../../mapmodule/plugin/vectortilelayer/VectorTileLayerPlugin';
import {FeatureService, propertiesFromFeature, oskariIdKey} from '../service/FeatureService';
import olLayerVectorTile from 'ol/layer/VectorTile';
import {loadFeaturesXhr} from 'ol/featureloader';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');

Oskari.clazz.defineES('Oskari.wfsmvt.WfsMvtLayerPlugin',
    class WfsMvtLayerPlugin extends VectorTileLayerPlugin {
        constructor (config) {
            super(config);
            this.__name = 'WfsMvtLayerPlugin';
            this._clazz = 'Oskari.wfsmvt.WfsMvtLayerPlugin';
            this.layertype = 'wfs';
            this.featureService = new FeatureService();
            this.isClickResponsive = true;
        }
        _initImpl () {
            super._initImpl();
            const sandbox = this.getSandbox();
            this.WFSLayerService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);

            sandbox.registerService(this.WFSLayerService);
        }
        _createPluginEventHandlers () {
            return Object.assign(super._createPluginEventHandlers(), {
                'WFSFeaturesSelectedEvent': (event) => {
                    this._updateLayerStyle(event.getMapLayer());
                },
                'MapClickedEvent': (event) => {
                    if (!this.isClickResponsive) {
                        return;
                    }
                    const ftrAndLyr = this.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], (feature, layer) => ({feature, layer}));
                    if (!ftrAndLyr || !(ftrAndLyr.layer instanceof olLayerVectorTile)) {
                        return;
                    }
                    const layerId = this._findOlLayerId(ftrAndLyr.layer);
                    if (!layerId) {
                        return;
                    }
                    const sandbox = this.getSandbox();
                    const layer = sandbox.getMap().getSelectedLayer(layerId);
                    if (event.getParams().ctrlKeyDown) {
                        this.WFSLayerService.setWFSFeaturesSelections(layer.getId(), [ftrAndLyr.feature.get(oskariIdKey)], false);
                        const featuresSelectedEvent = Oskari.eventBuilder('WFSFeaturesSelectedEvent')(this.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, false);
                        sandbox.notifyAll(featuresSelectedEvent);
                    } else {
                        var infoEvent = Oskari.eventBuilder('GetInfoResultEvent')({
                            layerId,
                            features: [propertiesFromFeature(ftrAndLyr.feature)],
                            lonlat: event.getLonLat()
                        });
                        sandbox.notifyAll(infoEvent);
                    }
                }
            });
        }
        _createRequestHandlers () {
            return {
                'WfsLayerPlugin.ActivateHighlightRequest': this
            };
        }
        // handle WfsLayerPlugin.ActivateHighlightRequest
        handleRequest (oskariCore, request) {
            this.isClickResponsive = request.isEnabled();
        }
        _findOlLayerId (olLayer) {
            return Object.keys(this._layerImplRefs).find(layerId => olLayer === this._layerImplRefs[layerId]);
        }
        _getLayerCurrentStyleFunction (layer) {
            const selectedIds = new Set(this.WFSLayerService.getSelectedFeatureIds(layer.getId()));
            const superStyle = super._getLayerCurrentStyleFunction(layer);
            if (!selectedIds.size) {
                return superStyle;
            }
            // Duplicated code for optimization. Check typeof once instead of on every feature.
            if (typeof superStyle === 'function') {
                return (feature, resolution) => {
                    if (selectedIds.has(feature.get(oskariIdKey))) {
                        return selectedStyle(feature, resolution);
                    }
                    return superStyle(feature, resolution);
                };
            } else {
                return (feature, resolution) => {
                    if (selectedIds.has(feature.get(oskariIdKey))) {
                        return selectedStyle(feature, resolution);
                    }
                    return superStyle;
                };
            }
        }
        /**
         * Override, see superclass
         */
        _getLayerModelClass () {
            return 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer';
        }
        /**
         * Override, see superclass
         */
        _getModelBuilder () {
            return new WfsLayerModelBuilder();
        }
        /**
         * Override, see superclass
         */
        _getTileUrlFunction (layer) {
            return function ([z, x, y], resolution, projection) {
                return Oskari.urls.getRoute('GetWFSVectorTile') + `&id=${layer.getId()}&srs=${projection.getCode()}&z=${z}&x=${x}&y=${(-y - 1)}`;
            };
        }
        /**
         * Override, see superclass
         */
        _getTileLoadFunction (layer) {
            const featureService = this.featureService;
            const sandbox = this.getSandbox();
            return function (tile, url) {
                const loader = loadFeaturesXhr(url, tile.getFormat(), function (features, projection, extent) {
                    featureService.addFeatures(layer.getId(), features);
                    const {fields, properties} = featureService.getFieldsAndProperties(layer.getId());
                    layer.setFields(fields);
                    layer.setActiveFeatures(properties);
                    var event = Oskari.eventBuilder('WFSFeatureEvent')(
                        layer,
                        []
                    );
                    sandbox.notifyAll(event);

                    tile.onLoad(features, projection, extent);
                }, tile.onError.bind(tile));
                tile.setLoader(loader);
            };
        }
        /**
         * Override, see superclass
         */
        _createDefaultStyle () {
            return normalStyle;
        }
    }
    , {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
