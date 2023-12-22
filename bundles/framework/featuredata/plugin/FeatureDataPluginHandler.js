import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showFeatureDataFlyout } from '../view/FeatureDataFlyout';
import { showSelectByPropertiesPopup } from '../view/SelectByProperties';
import { COLUMN_SELECTION, FILETYPES, SEPARATORS, showExportDataPopup } from '../view/ExportData';
import { FEATUREDATA_BUNDLE_ID } from '../view/FeatureDataContainer';
import { filterFeaturesByPropertyFilter } from '../../../mapping/mapmodule/oskariStyle/filter';
import { cleanFilter } from 'oskari-ui/components/FeatureFilter';

export const ID_FIELD = '__fid';
export const ID_FIELD_LABEL = 'ID';

export const SELECTION_SERVICE_CLASSNAME = 'Oskari.mapframework.service.VectorFeatureSelectionService';
const EXPORT_FEATUREDATA_ROUTE = 'ExportTableFile';
const EXPORT_FEATUREDATA_EXCEL_MAX_LENGTH = 120000;

class FeatureDataPluginUIHandler extends StateHandler {
    constructor (mapModule) {
        super();
        this.mapModule = mapModule;
        this.setState(this.initState());
        this.selectionService = mapModule.getSandbox().getService(SELECTION_SERVICE_CLASSNAME);
        this.flyoutController = null;
        this.selectByPropertiespopupController = null;
        this.addStateListener(() => this.updateFlyout());
    }

    initState () {
        const featureDataLayers = this.getFeatureDataLayers() || [];
        const activeLayerId = this.determineActiveLayerId(featureDataLayers);
        return {
            activeLayerId,
            layers: featureDataLayers,
            flyoutOpen: false,
            activeLayerFeatures: null,
            showSelectedFirst: false,
            showCompressed: true,
            loadingStatus: {},
            visibleColumnsSettings: {
                allColumns: [],
                visibleColumns: []
            },
            selectByPropertiesFilter: {},
            selectByPropertiesFeatureTypes: {}
        };
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
        // when clicking on a tab directly, layerId will be a number.
        // When clicked in the "show more" menu of the tablist, it will be a String and no features are found.
        // so we gotta make a conversion for a numeric layerid just in case. :(
        if (Oskari.util.isNumber(layerId)) {
            layerId = +layerId;
        }
        const features = layerId ? this.getFeaturesByLayerId(layerId) : null;
        const selectedFeatureIds = layerId ? this.getSelectedFeatureIdsByLayerId(layerId) : null;
        const visibleColumnsSettings = features && features.length ? this.createVisibleColumnsSettings(layerId) : null;
        this.updateState({
            activeLayerId: layerId,
            activeLayerFeatures: features,
            selectedFeatureIds,
            visibleColumnsSettings,
            selectByPropertiesFilter: {},
            selectByPropertiesFeatureTypes: this.createSelectByPropertiesFeatureTypes(visibleColumnsSettings),
            sorting: this.determineSortingColumn(layerId)
        });
    }

    toggleShowSelectedFirst () {
        const { activeLayerId, sorting } = this.getState();
        const newState = { showSelectedFirst: !this.getState().showSelectedFirst };
        if (newState.showSelectedFirst && !sorting?.order) {
            newState.sorting = this.determineSortingColumn(activeLayerId);
        }
        this.updateState(newState);
    }

    toggleShowCompressed () {
        const { showCompressed } = this.getState();
        this.updateState({ showCompressed: !showCompressed });
    }

    updateStateAfterMapEvent () {
        this.updateState(this.prepareFeaturesAndColumnSettingsForState());
    }

    prepareFeaturesAndColumnSettingsForState () {
        const featureDataLayers = this.getFeatureDataLayers() || [];
        if (!featureDataLayers || !featureDataLayers.length) {
            this.closeFlyout(true);
            return this.initState();
        }

        const newActiveLayerId = this.determineActiveLayerId(featureDataLayers);
        let activeLayerFeatures = null;
        let selectedFeatureIds = null;
        let visibleColumnsSettings = null;

        if (newActiveLayerId && this.getState().flyoutOpen) {
            activeLayerFeatures = this.getFeaturesByLayerId(newActiveLayerId);
            selectedFeatureIds = activeLayerFeatures && activeLayerFeatures.length ? this.getSelectedFeatureIdsByLayerId(newActiveLayerId) : null;
            visibleColumnsSettings = this.createVisibleColumnsSettings(newActiveLayerId);
        };

        const sorting = this.determineSortingColumn(newActiveLayerId);
        return {
            activeLayerId: newActiveLayerId,
            layers: featureDataLayers,
            activeLayerFeatures,
            selectedFeatureIds,
            visibleColumnsSettings,
            sorting
        };
    }

    updateSelectedFeatures (layerId, selectedFeatureIds) {
        if (layerId === this.getState().activeLayerId) {
            this.updateState({ selectedFeatureIds });
        }
    }

    updateSorting (sorting) {
        // if show selected first - is checked but sorting is cancelled we need to set default sorting to keep the selected items first.
        const newState = { sorting };
        const { showSelectedFirst, activeLayerId } = this.getState();
        if (showSelectedFirst && !sorting.order) {
            newState.sorting = this.determineSortingColumn(activeLayerId);
        }
        this.updateState(newState);
    }

    updateLoadingStatus (loadingStatus, updateFeaturesAndColumns) {
        if (!updateFeaturesAndColumns) {
            this.updateState({ loadingStatus });
            return;
        }

        const featuresAndColumnSettings = this.prepareFeaturesAndColumnSettingsForState();
        this.updateState({ loadingStatus, ...featuresAndColumnSettings });
    }

    updateVisibleColumns (value) {
        const { visibleColumnsSettings, activeLayerId, sorting } = this.getState();

        // Always have to have at least one column selected - don't allow setting this empty.
        if (value && value.length) {
            visibleColumnsSettings.visibleColumns = value;
        }
        const newState = {
            visibleColumnsSettings,
            sorting
        };

        if (!value.includes(sorting?.columnKey)) {
            newState.sorting = this.determineSortingColumn(activeLayerId);
        }

        this.updateState(newState);
    }

    toggleFeature (featureId) {
        this.selectionService.toggleFeatureSelection(this.getState().activeLayerId, featureId);
    }

    isFlyoutOpen () {
        return this.getState().flyoutOpen;
    }

    openFlyout () {
        if (this.flyoutController) {
            this.closeFlyout();
            return;
        }

        const { activeLayerId, activeLayerFeatures, visibleColumnsSettings, selectByPropertiesFilter, selectByPropertiesFeatureTypes } = this.getState();
        const newState = {
            flyoutOpen: true,
            activeLayerFeatures,
            visibleColumnsSettings,
            selectByPropertiesFilter,
            selectByPropertiesFeatureTypes,
            sorting: this.determineSortingColumn(activeLayerId)
        };

        if (!activeLayerFeatures) {
            // not empty features, but missing completely
            // empty should mean there is no features on viewport to list
            const newActiveLayerFeatures = this.getFeaturesByLayerId(activeLayerId);
            newState.activeLayerFeatures = newActiveLayerFeatures;
            newState.selectedFeatureIds = newActiveLayerFeatures && newActiveLayerFeatures.length ? this.getSelectedFeatureIdsByLayerId(activeLayerId) : null;
            newState.visibleColumnsSettings = this.createVisibleColumnsSettings(activeLayerId);
            newState.selectByPropertiesFilter = {};
            newState.selectByPropertiesFeatureTypes = this.createSelectByPropertiesFeatureTypes(newState.visibleColumnsSettings);
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

    createVisibleColumnsSettings (newActiveLayerId) {
        const { activeLayerId, visibleColumnsSettings } = this.getState();
        const activeLayerChanged = activeLayerId && newActiveLayerId && activeLayerId !== newActiveLayerId;

        if (!activeLayerChanged && visibleColumnsSettings) {
            return visibleColumnsSettings;
        }

        const activeLayer = this.mapModule.getSandbox().findMapLayerFromSelectedMapLayers(newActiveLayerId) || null;
        const activeLayerProperties = activeLayer?.getProperties() || null;
        let allColumns = activeLayerProperties?.map((property) => property.name);

        // for some reason no properties for layer -> resort to features as last fallback.
        if (!allColumns?.length) {
            const features = this.getFeaturesByLayerId(newActiveLayerId);
            if (features?.length) {
                allColumns = Object.keys(features[0]?.properties) || [];
            }
        }

        const activeLayerPropertyLabels = activeLayer?.getPropertyLabels() || null;
        const activeLayerPropertyTypes = activeLayer?.getPropertyTypes() || null;
        const newVisibleColumns = activeLayerChanged ? [].concat(allColumns) : visibleColumnsSettings?.visibleColumns ? visibleColumnsSettings.visibleColumns : [].concat(allColumns);
        if (!allColumns.includes(ID_FIELD)) {
            allColumns = [ID_FIELD].concat(allColumns);
        }

        if (activeLayerPropertyLabels && !activeLayerPropertyLabels[ID_FIELD]) {
            activeLayerPropertyLabels[ID_FIELD] = ID_FIELD_LABEL;
        }

        return {
            allColumns,
            visibleColumns: newVisibleColumns,
            activeLayerPropertyLabels,
            activeLayerPropertyTypes
        };
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

    updateFilter (selectByPropertiesFilter) {
        this.updateState({ selectByPropertiesFilter });
    }

    resetFilter () {
        this.updateState({ selectByPropertiesFilter: {} });
    }

    applyFilter () {
        const { selectByPropertiesFilter, selectByPropertiesFeatureTypes, activeLayerFeatures, activeLayerId } = this.getState();
        const cleaned = cleanFilter(selectByPropertiesFilter, selectByPropertiesFeatureTypes);
        const selectedFeatures = filterFeaturesByPropertyFilter(cleaned, activeLayerFeatures);
        const selectedFeatureIds = selectedFeatures?.map(feature => feature.id) || null;
        if (selectedFeatureIds) {
            this.selectionService.setSelectedFeatureIds(activeLayerId, selectedFeatureIds);
        }
    }

    createSelectByPropertiesFeatureTypes (visibleColumnsSettings) {
        if (!visibleColumnsSettings) {
            return {};
        }

        const { activeLayerPropertyTypes } = visibleColumnsSettings;
        if (!activeLayerPropertyTypes) {
            return null;
        };

        const featureProperties = Object.keys(activeLayerPropertyTypes).map(key => {
            return {
                name: key,
                type: activeLayerPropertyTypes[key]
            };
        });

        return featureProperties;
    };

    determineActiveLayerId (featureDataLayers) {
        let currentLayer = featureDataLayers?.find(layer => layer.getId() === this.getState().activeLayerId);
        if (!currentLayer && featureDataLayers?.length) {
            currentLayer = featureDataLayers[0];
        }
        return currentLayer ? currentLayer.getId() : null;
    }

    determineSortingColumn (newActiveLayerId) {
        const { activeLayerId, visibleColumnsSettings, sorting } = this.getState();
        const activeLayerChanged = newActiveLayerId !== activeLayerId;

        // Same layer and the previous sorting field is still visible -> use the old
        if (!activeLayerChanged && sorting?.columnKey && visibleColumnsSettings?.visibleColumns?.includes(sorting?.columnKey)) {
            return sorting;
        }

        // otherwise this needs to be recreated.
        return this.resetSortingColumn(newActiveLayerId);
    }

    resetSortingColumn (newActiveLayerId) {
        const newVisibleColumnsSettings = this.createVisibleColumnsSettings(newActiveLayerId);
        const defaultSortingColumn = newVisibleColumnsSettings?.visibleColumns[0] || null;
        const sortedInfo = { order: 'ascend', columnKey: defaultSortingColumn };
        return sortedInfo;
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
        params.data = this.gatherExportData(exportOnlySelected, columns === COLUMN_SELECTION.opened);
        params.additionalData = this.gatherAdditionalInfo(
            exportDataSource,
            exportMetadataLink,
            layer
        );

        if (format === FILETYPES.excel) {
            this.exportAsExcel(params);
            return;
        }

        this.exportAsCsv(params);
    }

    exportAsExcel (params) {
        params.data = JSON.stringify(params.data);
        params.additionalData = JSON.stringify(params.additionalData);
        let contentLength = 0;
        Object.keys(params).forEach((key) => {
            if (params[key]?.length) {
                contentLength += params[key].length;
            }
        });

        if (contentLength >= EXPORT_FEATUREDATA_EXCEL_MAX_LENGTH) {
            Messaging.error(Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'exportDataPopup.datasetTooLargeForExcel'));
            return;
        }

        const payload = new URLSearchParams();
        Object.keys(params).forEach(key => payload.append(key, params[key]));
        const extension = '.xlsx';
        this.sendData(payload, params.filename + extension);
    }

    exportAsCsv (params) {
        if (params?.delimiter === SEPARATORS.tabulator) {
            params.delimiter = '\t';
        }
        const replacer = (value) => !value ? '' : value;
        const headers = params.data.splice(0, 1)[0];
        const headerRow = headers.join(params.delimiter);
        const dataRows = params.data
            .map((values) => values.map((value) => replacer(value)).join(params.delimiter))
            .join('\r\n');

        const additionalDataRows = params.additionalData.map((value) => {
            // TODO: case metadata - we should dig up the metadata service url from someplace
            // not currently available in fe
            return [value.name, value.value].join(params.delimiter);
        }).join('\r\n');
        const emptyRow = null;
        const csv = [headerRow, dataRows, emptyRow, additionalDataRows].join('\r\n');

        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv));
        link.setAttribute('download', params.filename + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    'isFlyoutOpen',
    'openFlyout',
    'closeFlyout',
    'setActiveTab',
    'toggleShowSelectedFirst',
    'toggleShowCompressed',
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
    'updateFilter',
    'resetFilter',
    'applyFilter'
]);

export { wrapped as FeatureDataPluginHandler };
