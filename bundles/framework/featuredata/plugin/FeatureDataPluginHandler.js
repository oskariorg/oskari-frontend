import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showFeatureDataFlyout } from '../view/FeatureDataFlyout';
import { FilterTypes, LogicalOperators, showSelectByPropertiesPopup } from '../view/SelectByProperties';
import { filterFeaturesByAttribute, getFilterAlternativesAsArray } from '../../../mapping/mapmodule/util/vectorfeatures/filter';

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
            },
            selectByPropertiesSettings: {
                allColumns: [],
                filters: []
            }
        });
        this.mapModule = mapModule;
        this.selectionService = mapModule.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        this.flyoutController = null;
        this.selectByPropertiespopupController = null;
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
            selectByPropertiesSettings: this.createSelectByPropertiesSettings(features),
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

        const { activeLayerId, activeLayerFeatures, visibleColumnsSettings, selectByPropertiesSettings } = this.getState();
        const newState = {
            flyoutOpen: true,
            activeLayerFeatures,
            visibleColumnsSettings,
            selectByPropertiesSettings
        };

        if (!activeLayerFeatures) {
            // not empty features, but missing completely
            // empty should mean there is no features on viewport to list
            const newActiveLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
            newState.activeLayerFeatures = newActiveLayerFeatures;
            newState.sorting = newActiveLayerFeatures && newActiveLayerFeatures.length ? this.determineSortingColumn(newActiveLayerFeatures) : null;
            newState.selectedFeatureIds = newActiveLayerFeatures && newActiveLayerFeatures.length ? this.getSelectedFeatureIdsByLayerId(activeLayerId) : null;
            newState.visibleColumnsSettings = this.createVisibleColumnsSettings(newActiveLayerFeatures);
            newState.selectByPropertiesSettings = this.createSelectByPropertiesSettings(newActiveLayerFeatures);
        }

        this.updateState(newState);
        this.flyoutController = showFeatureDataFlyout(this.getState(), this.getController());
    }

    openSelectByPropertiesPopup () {
        if (this.selectByPropertiespopupController) {
            this.closeSelectByPropertiesPopup();
            return;
        }
        this.selectByPropertiespopupController = showSelectByPropertiesPopup(this.getState(), this.getController());
    }

    closeSelectByPropertiesPopup () {
        if (this.selectByPropertiespopupController) {
            this.selectByPropertiespopupController.close();
            this.selectByPropertiespopupController = null;
        }
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

    createSelectByPropertiesSettings (features) {
        const settings = this.createVisibleColumnsSettings(features);
        let filters;
        if (settings?.allColumns && settings?.allColumns.length) {
            filters = [this.initEmptyFilter(settings.allColumns[0])];
        }
        return settings?.allColumns ? { allColumns: settings.allColumns, filters, errors: null } : null;
    }

    closeFlyout (resetLayers) {
        if (this.flyoutController) {
            this.flyoutController.close();
            this.flyoutController = null;
        }

        this.closeSelectByPropertiesPopup();

        this.updateState({
            flyoutOpen: false,
            layers: resetLayers ? null : this.getState().layers
        });
    }

    updateFlyout () {
        if (this.flyoutController) {
            this.flyoutController.update(this.getState());
        }

        if (this.selectByPropertiespopupController) {
            this.selectByPropertiespopupController.update(this.getState());
        }
    }

    updateFilters (index, filter) {
        const { selectByPropertiesSettings } = this.getState();
        selectByPropertiesSettings.filters[index] = filter;
        filter.error = null;
        this.updateState({ selectByPropertiesSettings });
    }

    applyFilters () {
        const { selectByPropertiesSettings } = this.getState();
        const { filters } = selectByPropertiesSettings;

        let hasErrors = false;
        filters.forEach((filter) => {
            if (!filter?.value?.length) {
                hasErrors = true;
                filter.error = true;
            }
        });

        if (hasErrors) {
            this.updateState({ selectByPropertiesSettings });
            return;
        }

        this.selectFeaturesByProperties();
    }

    selectFeaturesByProperties () {
        const { selectByPropertiesSettings, activeLayerId, activeLayerFeatures } = this.getState();
        const filters = selectByPropertiesSettings.filters;

        // separate the logical operators from the original filter and form a single array
        const filterArray = [];
        filters.forEach((filter) => {
            filterArray.push(filter);
            if (filters.length > 1) {
                filterArray.push({ boolean: filter.logicalOperator });
            }
        });

        const filteredIds = new Set();
        const alternatives = getFilterAlternativesAsArray(filterArray);
        alternatives.forEach(attributeFilters => {
            let filteredList = activeLayerFeatures;
            attributeFilters.forEach(filter => {
                filteredList = filterFeaturesByAttribute(filteredList, filter);
            });
            filteredList
                .map((feature) => feature.id)
                .filter(id => !!id)
                .forEach(id => filteredIds.add(id));
        });

        this.selectionService.setSelectedFeatureIds(activeLayerId, [...filteredIds]);
    }

    initEmptyFilter (columnName) {
        return {
            attribute: columnName,
            operator: FilterTypes.equals,
            value: '',
            error: null,
            logicalOperator: LogicalOperators.AND,
            caseSensitive: false
        };
    }

    addFilter () {
        const { selectByPropertiesSettings } = this.getState();
        if (selectByPropertiesSettings && selectByPropertiesSettings.filters && selectByPropertiesSettings.allColumns) {
            selectByPropertiesSettings.filters.push(this.initEmptyFilter(selectByPropertiesSettings.allColumns[0]));
        }
        this.updateState({
            selectByPropertiesSettings
        });
    }

    /**
     *
     * @param {*} index Index of a single filter to remove
     * @param {*} clearAll When true and no index is provided, clear all filters.
     * @returns void
     */
    removeFilter (index, clearAll) {
        if (index) {
            return this.removeFilterByIndex(index);
        }

        if (clearAll) {
            const { selectByPropertiesSettings } = this.getState();
            selectByPropertiesSettings.filters = [this.initEmptyFilter(selectByPropertiesSettings.allColumns[0])];
            this.updateState({
                selectByPropertiesSettings
            });
        }
    }

    removeFilterByIndex (index) {
        const { selectByPropertiesSettings } = this.getState();
        if (selectByPropertiesSettings && selectByPropertiesSettings.filters && selectByPropertiesSettings.allColumns) {
            selectByPropertiesSettings.filters.splice(index, 1);
        }
        this.updateState({
            selectByPropertiesSettings
        });
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
    'toggleFeature',
    'openSelectByPropertiesPopup',
    'closeSelectByPropertiesPopup',
    'updateFilters',
    'addFilter',
    'removeFilter',
    'applyFilters'

]);

export { wrapped as FeatureDataPluginHandler };
