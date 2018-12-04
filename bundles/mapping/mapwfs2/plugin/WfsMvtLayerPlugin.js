import {normalStyle, selectedStyle} from './defaultStyle';
import VectorTileLayerPlugin from '../../mapmodule/plugin/vectortilelayer/VectorTileLayerPlugin';
import FeatureService, {oskariIdKey} from '../service/FeatureService';
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
        }
        _initImpl () {
            super._initImpl();
            const sandbox = this.getSandbox();
            this.WFSLayerService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);

            sandbox.registerService(this.WFSLayerService);
        }
        _createPluginEventHandlers () {
            const handlers = super._createPluginEventHandlers();
            handlers['WFSFeaturesSelectedEvent'] = (event) => {
                this._updateLayerStyle(event.getMapLayer());
            };
            return handlers;
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
