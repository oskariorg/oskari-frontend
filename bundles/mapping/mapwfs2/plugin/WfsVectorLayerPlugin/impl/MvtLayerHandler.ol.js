/* eslint-disable new-cap */
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import olTileGrid from 'ol/tilegrid/TileGrid';
import olTileState from 'ol/TileState';
import { FeatureExposingMVTSource } from './MvtLayerHandler/FeatureExposingMVTSource';
import { WFS_ID_KEY, getFieldsAndPropsArrays } from '../util/props';
import { AbstractLayerHandler } from './AbstractLayerHandler.ol';

export class MvtLayerHandler extends AbstractLayerHandler {
    constructor (layerPlugin) {
        super(layerPlugin);
        this._log = Oskari.log('WfsMvtLayerPlugin');
        this.localization = Oskari.getMsg.bind(null, 'MapWfs2');
    }
    createEventHandlers () {
        return {
            AfterChangeMapLayerStyleEvent: event => this._updateLayerStyle(event.getMapLayer()),
            AfterChangeMapLayerOpacityEvent: event => this._updateLayerOpacity(event.getMapLayer())
        };
    }
    getStyleFunction (layer, styleFunction, selectedIds) {
        if (!selectedIds.size) {
            return styleFunction;
        }
        return (feature, resolution) => {
            const isSelected = selectedIds.has(feature.get(WFS_ID_KEY));
            return styleFunction(feature, resolution, isSelected);
        };
    }
    /**
     * @method updateLayerProperties
     * Notify about changed features in view
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {ol/source/VectorTile} source
     */
    updateLayerProperties (layer, source = this._sourceFromLayer(layer)) {
        const {left, bottom, right, top} = this.plugin.getSandbox().getMap().getBbox();
        const propsList = source.getFeaturePropsInExtent([left, bottom, right, top]);
        const {fields, properties} = getFieldsAndPropsArrays(propsList);
        layer.setActiveFeatures(properties);
        // Update fields and locales only if fields is not empty and it has changed
        if (fields && fields.length > 0 && !Oskari.util.arraysEqual(layer.getFields(), fields)) {
            layer.setFields(fields);
            this.plugin.setLayerLocales(layer);
        }
        this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), fields);
    }
    /**
     * Returns source corresponding to given layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/source/VectorTile}
     */
    _sourceFromLayer (layer) {
        return this.plugin.getOLMapLayers(layer.getId())[0].getSource();
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
            if (tile.getState() === olTileState.ERROR) {
                return;
            }
            update();
        });
        return source;
    }
    /**
     * @method addMapLayerToMap
     * @private
     * Adds a single vector tile layer to this map
     * @param {Oskari.mapframework.domain.VectorTileLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        super.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        const sourceOpts = {
            format: new olFormatMVT(),
            url: layer.getLayerUrl().replace('{epsg}', this.plugin.getMapModule().getProjection()), // projection code
            projection: this.plugin.getMap().getView().getProjection()
        };
        const tileGrid = layer.getTileGrid();
        if (tileGrid) {
            sourceOpts.tileGrid = new olTileGrid(tileGrid);
        }
        // Properties id, type and hover are being used in VectorFeatureService.
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            renderMode: 'hybrid',
            source: this.createSource(layer, sourceOpts)
        });
        this.plugin.getMapModule().addLayer(vectorTileLayer, !keepLayerOnTop);
        this.plugin.setOLMapLayers(layer.getId(), vectorTileLayer);
        return vectorTileLayer;
    }
}
