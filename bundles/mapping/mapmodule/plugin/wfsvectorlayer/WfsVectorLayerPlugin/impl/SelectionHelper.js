import { WFS_ID_KEY } from '../../../../domain/constants';

/**
 * Share style for selected features
 */
const SELECTED_STYLE = {
    inherit: true,
    effect: 'auto major',
    stroke: {
        area: {
            effect: 'none',
            color: '#000000',
            width: 4
        },
        width: 3
    }
};

export class SelectionHelper {
    constructor (layerPlugin) {
        this._layerPlugin = layerPlugin;
        // layerId: { fid: olFeature }
        this._styledFeatures = {};
    }

    getMapModule () {
        return this._layerPlugin.getMapModule();
    }

    updateSelection (oskariLayer, featureIds = []) {
        const layerId = oskariLayer.getId();
        const currentSelection = this._getStyledFeaturesByLayer(layerId);
        Object.keys(currentSelection)
            .filter(fid => !featureIds.includes(fid))
            .forEach(fid => this._removeStyleFromFeature(layerId, fid));

        const newSelection = this.getFeaturesByIds(layerId, featureIds);
        if (!newSelection.length) {
            return;
        }
        const style = this.getMapModule().getStyleForLayer(oskariLayer, SELECTED_STYLE);
        newSelection.forEach(feature => this._setStyleForFeature(layerId, feature, style));
    }

    // recalculate styles for currently selected features on layer
    updateSelectionStyles (oskariLayer) {
        const layerId = oskariLayer.getId();
        const style = this.getMapModule().getStyleForLayer(oskariLayer, SELECTED_STYLE);
        const styledFeatures = this._getStyledFeaturesByLayer(layerId);
        Object.keys(styledFeatures).forEach(fid => this._setStyleForFeature(layerId, styledFeatures[fid], style));
    }

    getFeaturesByIds (layerId, featureIds) {
        const olLayers = this.getMapModule().getOLMapLayers(layerId);
        if (!olLayers || !olLayers.length || typeof olLayers[0].getSource !== 'function') {
            return [];
        }
        const source = olLayers[0].getSource();
        return featureIds
            .map(fid => source.getFeatureById(fid))
            .filter(f => !!f); // remove null values if feature isn't found
    }

    _saveFeatureRef (layerId, olFeature) {
        let features = this._styledFeatures[layerId];
        if (!features) {
            features = {};
            this._styledFeatures[layerId] = features;
        }
        features[olFeature.get(WFS_ID_KEY)] = olFeature;
    }

    _getStyledFeaturesByLayer (layerId) {
        return this._styledFeatures[layerId] || {};
    }

    _setStyleForFeature (layerId, olFeature, style) {
        olFeature.setStyle(style);
        this._saveFeatureRef(layerId, olFeature);
    }

    _removeStyleFromFeature (layerId, featureId) {
        const styledFeatures = this._getStyledFeaturesByLayer(layerId);
        const feature = styledFeatures[featureId];
        if (!feature) {
            return;
        }
        feature.setStyle();
        delete styledFeatures[featureId];
    }
};
