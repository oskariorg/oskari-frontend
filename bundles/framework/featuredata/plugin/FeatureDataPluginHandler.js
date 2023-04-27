import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { createFeaturedataGrid, showFeatureDataFlyout } from './FeatureDataFlyout';
import { getSorterFor } from '../../../../src/react/components/Table';

const FEATUREDATA_DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];

class FeatureDataPluginUIHandler extends StateHandler {
    constructor (plugin, mapModule, config) {
        super();
        this.setState({
            activeTab: null
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

    createColumnSettingsFromFeatures (features) {
        return Object.keys(features[0].properties)
            .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key))
            .map(key => {
                return {
                    align: 'left',
                    title: key,
                    dataIndex: key,
                    sorter: getSorterFor(key)
                };
            });
    }

    createDatasourceFromFeatures (features) {
        return features.map(feature => {
            return {
                key: feature.properties.__fid,
                ...feature.properties
            };
        });
    }

    createLayerTabs (layerId, layers, features) {
        const tabs = layers.map(layer => {
            return {
                key: layer.getId(),
                label: layer.getName(),
                children: layer.getId() === layerId
                    ? createFeaturedataGrid(this.createColumnSettingsFromFeatures(features), this.createDatasourceFromFeatures(features))
                    : null
            };
        });
        return tabs;
    }

    setActiveTab (layerId) {
        const featureDataLayers = this.getFeatureDataLayers() || null;
        const features = layerId ? this.getFeaturesByLayerId(layerId) : null;
        const tabs = this.createLayerTabs(layerId, featureDataLayers, features);
        this.updateState({
            activeTab: layerId,
            tabs
        });
    }

    openFlyout () {
        if (this.flyoutController) {
            this.closeFlyout();
            return;
        }
        const featureDataLayers = this.getFeatureDataLayers() || null;
        const layerId = featureDataLayers && featureDataLayers.length ? featureDataLayers[0].getId() : null;
        const features = layerId ? this.getFeaturesByLayerId(layerId) : null;
        const tabs = this.createLayerTabs(layerId, featureDataLayers, features);
        this.state = { tabs, controller: this.getController(), activeTab: layerId, onClose: () => this.getController().closeFlyout() };
        this.flyoutController = showFeatureDataFlyout(this.state);
    }

    closeFlyout () {
        if (this.flyoutController) {
            this.flyoutController.close();
            this.flyoutController = null;
        }
    }

    updateFlyout () {
        if (this.flyoutController) {
            this.flyoutController.update(this.state);
        }
    }
}

const wrapped = controllerMixin(FeatureDataPluginUIHandler, ['openFlyout', 'setActiveTab', 'closeFlyout']);

export { wrapped as FeatureDataPluginHandler };
