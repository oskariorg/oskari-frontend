import { WFS_ID_KEY } from '../domain/constants';
import { getOlStyleForLayer } from '../oskariStyle/generator.ol';
const getSelectedLayer = layerId => Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);

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

export class SelectedFeatureHandler {
    constructor (mapmodule) {
        this._mapmodule = mapmodule;
        // this._styleCache = {};
        this._featureIds = {}; // layerId: [fid]
        this._styledFeatures = {}; // fid: olFeature
    }

    /**
     * @method setFeaturesSelections
     * @param {OskariLayer} layer; Layer whose feature selections are changed
     * @param {Array} features; features that are selected or removed from selection
     * @param {Boolean} keepPrevious; true if user makes selections with selection tool with Ctrl
     *
     * Handles status of selected features
     */
    setFeaturesSelections (layer, features, keepPrevious) {
        const layerId = layer.getId();
        let selectedFeatureIds = features.map(ftr => ftr.get(WFS_ID_KEY));
        const previousSelectedFeatureIds = this.getSelectedFeatureIds(layerId);
        let featureIdsToRemove;
        let featuresToAdd = features;
        if (keepPrevious) {
            // Either add all featureIds or remove all feature Ids from selection. Don't mix.
            featureIdsToRemove = previousSelectedFeatureIds.filter(selected => selectedFeatureIds.includes(selected));
            if (featureIdsToRemove.length) {
                selectedFeatureIds = previousSelectedFeatureIds.filter(id => !selectedFeatureIds.includes(id));
                featuresToAdd = [];
            } else {
                selectedFeatureIds = [...previousSelectedFeatureIds, ...selectedFeatureIds];
            }
        } else {
            featureIdsToRemove = previousSelectedFeatureIds;
        }
        // update features styles
        featureIdsToRemove.forEach(fid => this._removeStyleFromFeature(fid));
        const style = getOlStyleForLayer(this._mapmodule, layer, SELECTED_STYLE);
        featuresToAdd.forEach(ftr => this._setStyleForFeature(style, ftr));
        // update id selection
        this._featureIds[layerId] = selectedFeatureIds;
        this.notify(layer, keepPrevious);
    }

    /**
     * @method setFeatureSelectionsByIds
     * @param {Number|String} layeId; Layer id whose feature selections are chenged
     * @param {Array} featureIds; feature ids that are selected or removed from selection
     * @param {Boolean} keepPrevious; true if user makes selections with selection tool with Ctrl
     *
     * Handles status of selected features
     */
    setFeatureSelectionsByIds (layerId, featureIds, keepPrevious) {
        const olLayers = this._mapmodule.getOLMapLayers(layerId);
        let features = [];
        if (olLayers.length && olLayers[0].getSource) {
            const source = olLayers[0].getSource();
            features = featureIds.map(fid => source.getFeatureById(fid))
                .filter(f => f); // remove null values if feature isn't found
        }
        const layer = getSelectedLayer(layerId);
        this.setFeaturesSelections(layer, features, keepPrevious);
    }

    updateLayerStyle (layer) {
        const fids = this.getSelectedFeatureIds(layer.getId());
        if (!fids.length) {
            return;
        }
        const style = getOlStyleForLayer(this._mapmodule, layer, SELECTED_STYLE);
        fids.forEach(fid => {
            const feature = this._styledFeatures[fid];
            if (feature) {
                this._setStyleForFeature(style, feature);
            }
        });
    }

    notify (layer, keepPrevious = false) {
        const fids = this.getSelectedFeatureIds(layer.getId());
        const evt = Oskari.eventBuilder('WFSFeaturesSelectedEvent')(fids, layer, keepPrevious);
        Oskari.getSandbox().notifyAll(evt);
    }

    _setStyleForFeature (style, feature) {
        feature.setStyle(style);
        this._styledFeatures[feature.get(WFS_ID_KEY)] = feature;
    }

    _removeStyleFromFeature (featureId) {
        const feature = this._styledFeatures[featureId];
        if (feature) {
            feature.setStyle();
        }
        delete this._styledFeatures[featureId];
    }

    /**
     * @method getSelections
     *
     * @return {array} this.getSelections
     *
     * Returns array of objects including slected layers id and selected features of layers.
    */
    getSelections () {
        return Object.keys(this._featureIds)
            .map(layerId => {
                return {
                    layerId,
                    features: this._featureIds[layerId]
                };
            });
    }

    /**
     * @method getSelectedFeatureIds
     * @param {Number} layerID; ID of layer whose selected featureIds are wanted
     *
     * @return {array} featureIds
     *
     * Returns selected featureIds of the given layer ID.
     */
    getSelectedFeatureIds (layerId) {
        return this._featureIds[layerId] || [];
    }

    /**
     * @method removeLayerSelections
     * @param {Object} layer; layer whose selected features are going to be removed
     */
    removeLayerSelections (layer) {
        if (!layer) {
            return;
        }
        const layerId = layer.getId();
        const ids = this.getSelectedFeatureIds(layerId);
        if (!ids.length) {
            return;
        }
        ids.forEach(id => this._removeStyleFromFeature(id));
        delete this._featureIds[layerId];
        this.notify(layer);
    }

    /*
    * @method removeAllSelections
    *
    * Convenience function to clear selections from all WFS layers
    */
    removeAllSelections () {
        const layerIds = Object.keys(this._featureIds);
        // remove and notify for selected layers
        layerIds.forEach(layerId => {
            const layer = getSelectedLayer(layerId);
            this.removeLayerSelections(layer);
        });
        // clear to be sure that everything is cleared (no need to notify non-selected layers)
        this._featureIds = {};
        Object.keys(this._styledFeatures).forEach(fid => this._removeStyleFromFeature(fid));
        this._styledFeatures = {};
    }
}
