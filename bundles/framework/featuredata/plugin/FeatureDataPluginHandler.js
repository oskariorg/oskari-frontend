import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showFeatureDataFlyout } from './FeatureDataFlyout';

export const FEATUREDATA_DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];

const SELECTION_SERVICE_CLASSNAME = 'Oskari.mapframework.service.VectorFeatureSelectionService';
class FeatureDataPluginUIHandler extends StateHandler {
    constructor (mapModule) {
        super();
        const featureDataLayers = this.getFeatureDataLayers() || [];
        const activeLayerId = this.determineActiveLayerId(featureDataLayers);
        this.setState({
            activeLayerId,
            layers: featureDataLayers,
            flyoutOpen: false,
            activeLayerFeatures: null,
            showSelectedFirst: false,
            loadingStatus: {},
            visibleColumnsSettings: {
                allColumns: [],
                visibleColumns: []
            }
        });
        this.mapModule = mapModule;
        this.selectionService = mapModule.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
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

    getSelectedFeatureIdsByLayerId (layerId) {
        if (!this.selectionService) {
            return [];
        }
        return this.selectionService.getSelectedFeatureIdsByLayer(layerId);
    }

    setActiveTab (layerId) {
        const features = layerId ? this.getFeaturesByLayerId(layerId) : null;
        const selectedFeatureIds = layerId ? this.getSelectedFeatureIdsByLayerId(layerId) : null;
        this.updateState({
            activeLayerId: layerId,
            activeLayerFeatures: features,
            selectedFeatureIds,
            visibleColumnsSettings: this.createVisibleColumnsSettings(features),
            sorting: this.determineSortingColumn(features)
        });
    }

    toggleShowSelectedFirst () {
        const { activeLayerFeatures, sorting } = this.getState();
        const newState = { showSelectedFirst: !this.getState().showSelectedFirst };
        if (newState.showSelectedFirst && !sorting?.order) {
            newState.sorting = this.determineSortingColumn(activeLayerFeatures);
        }
        this.updateState(newState);
    }

    updateStateAfterMapEvent () {
        const featureDataLayers = this.getFeatureDataLayers() || [];
        if (!featureDataLayers || !featureDataLayers.length) {
            this.closeFlyout(true);
            return;
        }

        const activeLayerId = this.determineActiveLayerId(featureDataLayers);
        let activeLayerFeatures = null;
        let selectedFeatureIds = null;
        if (activeLayerId && this.getState().flyoutOpen) {
            activeLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
            selectedFeatureIds = activeLayerFeatures && activeLayerFeatures.length ? this.getSelectedFeatureIdsByLayerId(activeLayerId) : null;
        };

        this.updateState({
            activeLayerId,
            layers: featureDataLayers,
            activeLayerFeatures,
            selectedFeatureIds
        });
    }

    updateSelectedFeatures (layerId, selectedFeatureIds) {
        if (layerId === this.getState().activeLayerId) {
            this.updateState({ selectedFeatureIds });
        }
    }

    updateSorting (sorting) {
        // if show selected first - is checked but sorting is cancelled we need to set default sorting to keep the selected items first.
        const newState = { sorting };
        const { showSelectedFirst, activeLayerFeatures } = this.getState();
        if (showSelectedFirst && !sorting.order) {
            newState.sorting = this.determineSortingColumn(activeLayerFeatures);
        }
        this.updateState(newState);
    }

    updateLoadingStatus (loadingStatus) {
        this.updateState({ loadingStatus });
    }

    updateVisibleColumns (value) {
        const { visibleColumnsSettings, activeLayerFeatures, sorting } = this.getState();

        // Always have to have at least one column selected - don't allow setting this empty.
        if (value && value.length) {
            visibleColumnsSettings.visibleColumns = value;
        }
        const newState = {
            visibleColumnsSettings,
            sorting
        };

        if (!value.includes(sorting?.columnKey)) {
            newState.sorting = this.determineSortingColumn(activeLayerFeatures);
        }

        this.updateState(newState);
    }

    toggleFeature (featureId) {
        this.selectionService.toggleFeatureSelection(this.getState().activeLayerId, featureId);
    }

    openFlyout () {
        if (this.flyoutController) {
            this.closeFlyout();
            return;
        }

        const { activeLayerId, activeLayerFeatures, visibleColumnsSettings } = this.getState();
        const newState = {
            flyoutOpen: true,
            activeLayerFeatures,
            visibleColumnsSettings
        };

        if (!activeLayerFeatures) {
            // not empty features, but missing completely
            // empty should mean there is no features on viewport to list
            const newActiveLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
            newState.activeLayerFeatures = newActiveLayerFeatures;
            newState.sorting = newActiveLayerFeatures && newActiveLayerFeatures.length ? this.determineSortingColumn(newActiveLayerFeatures) : null;
            newState.selectedFeatureIds = newActiveLayerFeatures && newActiveLayerFeatures.length ? this.getSelectedFeatureIdsByLayerId(activeLayerId) : null;
            newState.visibleColumnsSettings = this.createVisibleColumnsSettings(newActiveLayerFeatures);
        }

        this.updateState(newState);
        this.flyoutController = showFeatureDataFlyout(this.getState(), this.getController());
    }

    createVisibleColumnsSettings (features) {
        if (!features || !features.length) {
            return null;
        }
        const allColumns = Object.keys(features[0].properties).filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key));
        const visibleColumns = [].concat(allColumns);
        return {
            allColumns,
            visibleColumns
        };
    }

    closeFlyout (resetLayers) {
        if (this.flyoutController) {
            this.flyoutController.close();
            this.flyoutController = null;
        }
        this.updateState({ flyoutOpen: false, layers: resetLayers ? null : this.getState().layers });
    }

    updateFlyout () {
        if (this.flyoutController) {
            this.flyoutController.update(this.getState());
        }
    }

    determineActiveLayerId (featureDataLayers) {
        let currentLayer = featureDataLayers?.find(layer => layer.getId() === this.getState().activeLayerId);
        if (!currentLayer && featureDataLayers?.length) {
            currentLayer = featureDataLayers[0];
        }
        return currentLayer ? currentLayer.getId() : null;
    }

    determineSortingColumn (features) {
        if (!features || !features.length) {
            return null;
        }

        // get the first property that isn't in the default hidden fields and use that as default.
        const defaultSortingColumn = Object.keys(features[0]?.properties).find((key) => this.columnShouldBeVisible(key));
        const sortedInfo = { order: 'ascend', columnKey: defaultSortingColumn };
        return sortedInfo;
    }

    columnShouldBeVisible (key) {
        const { visibleColumnsSettings } = this.getState();
        if (!visibleColumnsSettings) {
            return null;
        }
        const { visibleColumns } = visibleColumnsSettings;
        return !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key) && visibleColumns?.includes(key);
    }
}

const wrapped = controllerMixin(FeatureDataPluginUIHandler, [
    'openFlyout',
    'closeFlyout',
    'setActiveTab',
    'toggleShowSelectedFirst',
    'updateStateAfterMapEvent',
    'updateSelectedFeatures',
    'updateSorting',
    'updateLoadingStatus',
    'updateVisibleColumns',
    'toggleFeature'
]);

export { wrapped as FeatureDataPluginHandler };
