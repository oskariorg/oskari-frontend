import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showFeatureDataFlyout } from '../view/FeatureDataFlyout';
import { FilterTypes, LogicalOperators, showSelectByPropertiesPopup } from '../view/SelectByProperties';
import { COLUMN_SELECTION, FILETYPES, showExportDataPopup } from '../view/ExportData';
import { FEATUREDATA_BUNDLE_ID } from '../view/FeatureDataContainer';
import { WFS_ID_KEY, WFS_FTR_ID_KEY } from '../../../mapping/mapmodule/domain/constants';
import { FilterSelector } from '../FilterSelector';

export const FEATUREDATA_DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];

export const SELECTION_SERVICE_CLASSNAME = 'Oskari.mapframework.service.VectorFeatureSelectionService';
const EXPORT_FEATUREDATA_ROUTE = 'ExportTableFile';

class FeatureDataPluginUIHandler extends StateHandler {
    constructor (mapModule) {
        super();
        this.mapModule = mapModule;
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
        this.selectionService = mapModule.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        this.flyoutController = null;
        this.selectByPropertiespopupController = null;
        const featureQueryFn = (geojson, opts) => this.mapModule.getVectorFeatures(geojson, opts);
        this.filterSelector = new FilterSelector(featureQueryFn, this.selectionService);
        this.addStateListener(() => this.updateFlyout());
    }

    getFeatureDataLayers () {
        return this.mapModule.getSandbox()
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
            selectByPropertiesSettings,
            sorting: activeLayerFeatures ? this.determineSortingColumn(activeLayerFeatures) : null
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

    openExportDataPopup () {
        if (this.exportDataPopupController) {
            this.closeSelectByPropertiesPopupPopup();
            return;
        }
        this.exportDataPopupController = showExportDataPopup(this.getState(), this.getController());
    }

    closeExportDataPopup () {
        if (this.exportDataPopupController) {
            this.exportDataPopupController.close();
            this.exportDataPopupController = null;
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

        this.closeExportDataPopup();

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

        if (this.exportDataPopupController) {
            this.exportDataPopupController.update(this.getState());
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
        const { selectByPropertiesSettings, activeLayerId } = this.getState();
        const filters = selectByPropertiesSettings.filters;

        // separate the logical operators from the original filter and form a single array
        const filterArray = [];
        filters.forEach((filter) => {
            filterArray.push(filter);
            if (filters.length > 1) {
                filterArray.push({ boolean: filter.logicalOperator });
            }
        });
        this.filterSelector.selectWithProperties(filters, activeLayerId);
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
        // this might not be set to state yet, if this is the first time flyout is opened
        // so we're (re)creating this each time
        const visibleColumnsSettings = this.createVisibleColumnsSettings(features);

        // get the first property that isn't in the default hidden fields and use that as default.
        const defaultSortingColumn = Object.keys(features[0]?.properties).find((key) => this.columnShouldBeVisible(key, visibleColumnsSettings));
        const sortedInfo = { order: 'ascend', columnKey: defaultSortingColumn };
        return sortedInfo;
    }

    columnShouldBeVisible (key, visibleColumnsSettings) {
        const { visibleColumns } = visibleColumnsSettings;
        return !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key) && visibleColumns?.includes(key);
    }

    sendExportDataForm (data) {
        const { format, columns, delimiter, exportOnlySelected, exportDataSource, exportMetadataLink } = data;
        const params = {
            format,
            columns,
            delimiter
        };

        const { layers, activeLayerId } = this.getState();
        const layer = layers?.find(layer => layer.getId() === activeLayerId);

        params.filename = layer.getName();
        params.data = JSON.stringify(this.gatherExportData(exportOnlySelected, columns === COLUMN_SELECTION.opened));
        params.additionalData = JSON.stringify(
            this.gatherAdditionalInfo(
                exportDataSource,
                exportMetadataLink,
                layer));

        const payload = new URLSearchParams();
        Object.keys(params).forEach(key => payload.append(key, params[key]));
        const extension = format === FILETYPES.csv ? '.csv' : '.xlsx';
        this.sendData(payload, params.filename + extension);
    }

    sendData (payload, filename) {
        try {
            fetch(Oskari.urls.getRoute(EXPORT_FEATUREDATA_ROUTE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: payload
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.blob();
            }).then(blob => {
                if (blob != null) {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'featureData.exportDataPopup.exportFailed'));
        }
    }

    getDataSourceFromActiveLayer (layer) {
        return layer && layer.getSource && typeof layer.getSource === 'function' && layer.getSource() ? layer.getSource() : layer.getOrganizationName();
    }

    gatherExportData (onlySelectedFeatures, onlySelectedColumns) {
        const { visibleColumnsSettings, activeLayerFeatures, selectedFeatureIds } = this.getState();
        const columns = onlySelectedColumns ? visibleColumnsSettings.visibleColumns : visibleColumnsSettings.allColumns;
        const featureValues = activeLayerFeatures
            .filter(feature => onlySelectedFeatures ? selectedFeatureIds.includes(feature.id) : true)
            .map(feature => {
                return columns.map(column => { return feature?.properties[column]; });
            });
        return [].concat([columns]).concat(featureValues);
    }

    gatherAdditionalInfo (exportDataSource, exportMetadaLink, layer) {
        const additionalInfo = [];

        if (exportDataSource) {
            additionalInfo.push({
                type: 'datasource',
                name: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'exportDataPopup.additionalSettings.dataSource'),
                value: this.getDataSourceFromActiveLayer(layer)
            });
        }

        additionalInfo.push({
            type: 'layerName',
            name: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'exportDataPopup.additionalSettings.layerName'),
            value: layer.getName()
        });

        if (exportMetadaLink) {
            additionalInfo.push({
                type: 'metadata',
                name: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'exportDataPopup.additionalSettings.metadataLink'),
                value: layer.getMetadataIdentifier()
            });
        }
        return additionalInfo;
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
    'openExportDataPopup',
    'closeExportDataPopup',
    'sendExportDataForm',
    'updateFilters',
    'addFilter',
    'removeFilter',
    'applyFilters'

]);

export { wrapped as FeatureDataPluginHandler };
