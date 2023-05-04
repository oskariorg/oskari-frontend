import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showFeatureDataFlyout } from './FeatureDataFlyout';

class FeatureDataPluginUIHandler extends StateHandler {
    constructor (mapModule) {
        super();
        const featureDataLayers = this.getFeatureDataLayers() || [];
        const activeLayerId = this.determineActiveLayerId(featureDataLayers);
        this.setState({
            activeLayerId,
            layers: featureDataLayers,
            flyoutOpen: false,
            activeLayerFeatures: null
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

        const activeLayerId = this.determineActiveLayerId(featureDataLayers);
        let activeLayerFeatures = null;
        if (activeLayerId && this.state.flyoutOpen) {
            activeLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
        };
        this.updateState({
            activeLayerId,
            layers: featureDataLayers,
            activeLayerFeatures
        });
    }

    openFlyout () {
        if (this.flyoutController) {
            this.closeFlyout();
            return;
        }

        const { activeLayerId, activeLayerFeatures } = this.getState();
        const newState = {
            flyoutOpen: true,
            activeLayerFeatures
        };

        if (!activeLayerFeatures) {
            // not empty features, but missing completely
            // empty should mean there is no features on viewport to list
            newState.activeLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
        }

        this.updateState(newState);
        this.flyoutController = showFeatureDataFlyout(this.getState(), this.getController());
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

    determineActiveLayerId (featureDataLayers) {
        let currentLayer = featureDataLayers?.find(layer => layer.getId() === this.state.activeLayerId);
        if (!currentLayer && featureDataLayers?.length) {
            currentLayer = featureDataLayers[0];
        }
        return currentLayer ? currentLayer.getId() : null;
    }
}

const wrapped = controllerMixin(FeatureDataPluginUIHandler, ['openFlyout', 'closeFlyout', 'setActiveTab', 'updateStateAfterMapEvent']);

export { wrapped as FeatureDataPluginHandler };
