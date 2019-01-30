import {normalStyle, selectedStyle} from './components/defaultStyle';
import VectorTileLayerPlugin from '../../mapmodule/plugin/vectortilelayer/VectorTileLayerPlugin';
import {WFS_ID_KEY, getFieldsAndPropsArrays} from './components/propertyArrayUtils';
import ReqEventHandler from './components/ReqEventHandler';
import TileState from 'ol/TileState';
import FeatureExposingMVTSource from './components/FeatureExposingMVTSource';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');

Oskari.clazz.defineES('Oskari.wfsmvt.WfsMvtLayerPlugin',
    class WfsMvtLayerPlugin extends VectorTileLayerPlugin {
        constructor (config) {
            super(config);
            this.__name = 'WfsMvtLayerPlugin';
            this._clazz = 'Oskari.wfsmvt.WfsMvtLayerPlugin';
            this._log = Oskari.log('WfsMvtLayerPlugin');
            this.layertype = 'wfs';
            // mvt only support numeric IDs and WFS-layers often have other characters in ID as well
            // fixes highlight on features spread to multiple tiles by using a generated _oid for "combining" features
            this.hoverState.property = '_oid';
        }
        _initImpl () {
            super._initImpl();
            const sandbox = this.getSandbox();
            this.WFSLayerService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);

            sandbox.registerService(this.WFSLayerService);
            this.reqEventHandler = new ReqEventHandler(sandbox);
        }
        _createPluginEventHandlers () {
            return Object.assign(super._createPluginEventHandlers(), this.reqEventHandler.createEventHandlers(this));
        }
        _createRequestHandlers () {
            return this.reqEventHandler.createRequestHandlers(this);
        }
        /**
         * @method findLayerByOLLayer
         * @param {ol/layer/Layer} olLayer OpenLayers layer impl
         * @return {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer}
         */
        findLayerByOLLayer (olLayer) {
            const layerId = Object.keys(this._layerImplRefs).find(layerId => olLayer === this._layerImplRefs[layerId]);
            return this.getSandbox().getMap().getSelectedLayer(layerId);
        }
        /**
         * @method getAllLayerIds
         * @return {String[]} All layer ids handled by plugin and selected on map
         */
        getAllLayerIds () {
            return Object.keys(this._layerImplRefs);
        }
        /**
         * Override, see superclass
         */
        _getLayerCurrentStyleFunction (layer) {
            const selectedIds = new Set(this.WFSLayerService.getSelectedFeatureIds(layer.getId()));
            const superStyle = super._getLayerCurrentStyleFunction(layer);
            if (!selectedIds.size) {
                return superStyle;
            }
            // Duplicated code for optimization. Check typeof once instead of on every feature.
            if (typeof superStyle === 'function') {
                return (feature, resolution) => {
                    if (selectedIds.has(feature.get(WFS_ID_KEY))) {
                        return selectedStyle(feature, resolution);
                    }
                    return superStyle(feature, resolution);
                };
            } else {
                return (feature, resolution) => {
                    if (selectedIds.has(feature.get(WFS_ID_KEY))) {
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
            return new WfsLayerModelBuilder(this.getSandbox());
        }
        /**
         * Override, see superclass
         */
        createSource (layer, options) {
            const source = new FeatureExposingMVTSource(options);

            const update = Oskari.util.throttle(() => {
                this.updateLayerProperties(layer, source);
            }, 300, {leading: false});
            source.on('tileloadend', ({tile}) => {
                if (tile.getState() === TileState.ERROR) {
                    return;
                }
                update();
            });
            return source;
        }
        /**
         * @method updateLayerProperties
         * Notify about changed features in view
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         * @param {ol/source/VectorTile} source
         */
        updateLayerProperties (layer, source = this._sourceFromLayer(layer)) {
            const {left, bottom, right, top} = this.getSandbox().getMap().getBbox();
            const propsList = source.getFeaturePropsInExtent([left, bottom, right, top]);
            const {fields, properties} = getFieldsAndPropsArrays(propsList);
            layer.setActiveFeatures(properties);
            // Update fields and locales only if fields is not empty and it has changed
            if (fields && fields.length > 0 && !Oskari.util.arraysEqual(layer.getFields(), fields)) {
                layer.setFields(fields);
                this.setLayerLocales(layer);
            }
            this.reqEventHandler.notify('WFSPropertiesEvent', layer, layer.getLocales(), fields);
            this.reqEventHandler.notify('WFSFeatureEvent', layer, properties.length ? properties[properties.length - 1] : []);
        }
        /**
         * @method setLayerLocales
         * Requests and sets locales for layer's fields.
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer wfs layer
         */
        setLayerLocales (layer) {
            if (!layer || layer.getLocales().length === layer.getFields().length) {
                return;
            }
            const onSuccess = localized => {
                if (!localized) {
                    return;
                }
                const locales = [];
                // Set locales in the same order as fields
                layer.getFields().forEach(field => locales.push(localized[field] ? localized[field] : field));
                layer.setLocales(locales);
                this.reqEventHandler.notify('WFSPropertiesEvent', layer, locales, layer.getFields());
            };
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    id: layer.getId(),
                    lang: Oskari.getLang()
                },
                url: Oskari.urls.getRoute('GetLocalizedPropertyNames'),
                success: onSuccess,
                error: () => {
                    this._log.warn('Error getting localized property names for wfs layer ' + layer.getId());
                }
            });
        }
        /**
         * Returns source corresponding to given layer
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         * @return {ol/source/VectorTile}
         */
        _sourceFromLayer (layer) {
            return this.getOLMapLayers(layer.getId())[0].getSource();
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
