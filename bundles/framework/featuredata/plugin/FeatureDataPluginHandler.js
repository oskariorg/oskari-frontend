import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showFeatureDataFlyout } from './FeatureDataFlyout';

class FeatureDataPluginUIHandler extends StateHandler {
    constructor (mapModule) {
        super();
        this.setState({
            activeTab: null,
            flyoutOpen: false
        });
        this.mapModule = mapModule;
        this.addStateListener(() => this.updateFlyout());
    }

    getFeatureDataLayers () {
        return Oskari.getSandbox()
            .findAllSelectedMapLayers()
            .filter(layer => layer.isVisibleOnMap() && layer.hasFeatureData && layer.hasFeatureData());
    }

    getFeaturesByLayerId (layerId) {
        const featuresMap = this.mapModule.getVectorFeatures(null, { layers: [layerId] });
        return featuresMap && featuresMap[layerId] ? featuresMap[layerId].features : null;
    }

    setActiveTab (layerId) {
        const features = layerId ? this.getFeaturesByLayerId(layerId) : null;
        this.updateState({
            activeLayerId: layerId,
            activeLayerFeatures: features
        });
    }

    updateStateAfterMapEvent () {
        const featureDataLayers = this.getFeatureDataLayers() || [];
        if (!featureDataLayers || !featureDataLayers.length) {
            this.closeFlyout();
            return;
        }

        let currentLayer = featureDataLayers?.find(layer => layer.getId() === this.state.activeLayerId);
        if (!currentLayer && featureDataLayers?.length) {
            currentLayer = featureDataLayers[0];
        }
        const layerId = currentLayer ? currentLayer.getId() : null;
        const features = layerId ? this.getFeaturesByLayerId(layerId) : [];
        this.updateState({
            activeLayerId: layerId,
            layers: featureDataLayers,
            activeLayerFeatures: features
        });
    }

    openFlyout () {
        if (this.flyoutController) {
            this.closeFlyout();
            return;
        }
        const layers = this.getFeatureDataLayers() || null;
        const activeLayerId = layers && layers.length ? layers[0].getId() : null;
        const activeLayerFeatures = activeLayerId ? this.getFeaturesByLayerId(activeLayerId) : null;
        this.updateState({ layers, activeLayerId, activeLayerFeatures, flyoutOpen: true });
        this.flyoutController = showFeatureDataFlyout(this.state, this.getController());
    }

    closeFlyout () {
        if (this.flyoutController) {
            this.flyoutController.close();
            this.updateState({ flyoutOpen: false });
            this.flyoutController = null;
        }
    }

    updateFlyout () {
        if (this.flyoutController) {
            this.flyoutController.update(this.state);
        }
    }
}

const wrapped = controllerMixin(FeatureDataPluginUIHandler, ['openFlyout', 'closeFlyout', 'setActiveTab', 'updateStateAfterMapEvent']);

export { wrapped as FeatureDataPluginHandler };
