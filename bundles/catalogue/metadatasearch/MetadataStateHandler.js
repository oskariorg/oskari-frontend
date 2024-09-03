import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { MetadataOptionService } from './service/MetadataOptionService';
import { MetadataSearchService } from './service/MetadataSearchService';
import { METADATA_BUNDLE_LOCALIZATION_ID } from './instance';
import { CoverageHelper } from '../../mapping/mapmodule/plugin/layers/coveragetool/CoverageHelper';

class MetadataStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.optionsService = new MetadataOptionService(this.instance.optionAjaxUrl);
        this.searchService = new MetadataSearchService(this.instance.searchAjaxUrl);
        this.mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.coverageHelper = new CoverageHelper();
        this.coverageHelper.initCoverageToolPlugin();

        this.setState({
            query: '',
            advancedSearchExpanded: false,
            advancedSearchOptions: null,
            advancedSearchValues: {},
            loading: false,
            drawing: false,
            searchResultsVisible: false,
            searchResultsFilter: null,
            coverageFeature: null,
            selectedLayers: null
        });
    }

    getSandbox () {
        return this.instance.getSandbox();
    }

    getVectorLayerId () {
        return this.instance.getVectorLayerId();
    }

    updateQuery (query) {
        this.updateState({ query });
    }

    handleMetadataSearchRequest (formdata, successCallback) {
        return this.searchService.doSearch(formdata, successCallback);
    }

    doSearch () {
        const { query = '', advancedSearchValues } = this.getState();
        const search = query.trim();
        const params = search ? { search } : {};
        Object.keys(advancedSearchValues).forEach(key => {
            let value = advancedSearchValues[key];
            if (Array.isArray(value)) {
                value = value.join(',');
            }
            // eliminate nulls and empty values
            if (value) {
                params[key] = value;
            }
        });

        if (!Object.keys(params).length) {
            return;
        }

        this.updateState({
            loading: true,
            searchResultsVisible: false,
            searchResultsFilter: null
        });

        this.searchService.doSearch(params, (results) => this.updateSearchResults(results));
    }

    updateSearchResults (json) {
        const searchResults = json?.results?.map(result => this.updateLayerInfo(result));
        this.updateState({ loading: false, searchResults: searchResults || null, searchResultsVisible: true, selectedLayers: this.getSelectedLayers() });
    }

    getSelectedLayers () {
        return this.getSandbox().findAllSelectedMapLayers() || null;
    }

    updateLayerInfo (searchResult) {
        let layers = null;
        if (searchResult.id) {
            layers = this.mapLayerService.getLayersByMetadataId(searchResult.id);
        }

        if (searchResult?.uuid && searchResult?.uuid?.length) {
            searchResult.uuid.forEach((uuid) => {
                const newLayers = this.mapLayerService.getLayersByMetadataId(uuid).filter((newLayer) => !layers.find((oldLayer) => oldLayer.id === newLayer.id));
                layers = layers.concat(newLayers);
            });
        }

        searchResult.layers = layers;
        return searchResult;
    }

    showMetadata (uuid) {
        this.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [{
            uuid
        }]);
    }

    toggleCoverageArea (result) {
        const { displayedCoverageId } = this.getState();
        if (displayedCoverageId && displayedCoverageId === result.id) {
            this.coverageHelper.clearLayerCoverage();
            return;
        }

        this.coverageHelper.showMetadataCoverage(result.geom, result.id);
    }

    toggleLayerVisibility (checked, layerId) {
        const { selectedLayers } = this.getState();
        const layerSelected = !!selectedLayers.find((layer) => layer.getId() === layerId);
        if (layerSelected) {
            this.instance.removeMapLayer(layerId);
        } else {
            this.instance.addMapLayer(layerId);
        }
    }

    updateSelectedLayers () {
        this.updateState({
            selectedLayers: this.getSelectedLayers()
        });
    }

    updateDisplayedCoverageId (id) {
        this.updateState({
            displayedCoverageId: id
        });
    }

    /**
     * Advanced search
     */
    toggleAdvancedSearch () {
        const { advancedSearchExpanded } = this.getState();
        this.updateState({
            advancedSearchExpanded: !advancedSearchExpanded
        });
    }

    /**
     * Toggle from search results list back to search view
     */
    toggleSearch () {
        this.updateState({
            searchResultsVisible: false
        });
    }

    toggleSearchResultsFilter (value) {
        this.updateState({
            searchResultsFilter: value
        });
    }

    loadOptions () {
        const { advancedSearchOptions } = this.getState();
        if (!advancedSearchOptions) {
            this.fetchOptions();
        }
    }

    async fetchOptions () {
        this.updateState({ advancedSearchOptions: { loading: true } });
        const fields = [];
        const emptyOption = Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.emptyOption');
        await this.optionsService.getOptions((options) => {
            options?.fields?.forEach((field) => {
                const sortedValues = field.values.sort((a, b) => Oskari.util.naturalSort(a.val, b.val)).map(({ val }) => ({ label: val, value: val }));
                if (!sortedValues.length) {
                    // don't store field with no values
                    return;
                }
                if (!field.multi) {
                    sortedValues.unshift({ label: emptyOption, value: '' });
                }
                fields.push({ ...field, values: sortedValues });
            });
        });
        this.updateState({ advancedSearchOptions: { fields } });
    }

    advancedSearchParamsChanged (key, value) {
        this.updateState({
            advancedSearchValues: { ...this.getState().advancedSearchValues, [key]: value }
        });
    }

    advancedSearchCoverageStartDrawing (evt) {
        this.updateState({
            drawing: true,
            coverageFeature: null
        });
        this.instance.startDrawing();
    }

    advancedSearchCoverageCancelDrawing (evt) {
        this.updateCoverageFeature(null);
        this.instance.stopDrawing();
    }

    updateCoverageFeature (coverageFeature) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.coverage = coverageFeature;
        this.updateState({
            drawing: false,
            advancedSearchValues
        });
    }
}

const wrapped = controllerMixin(MetadataStateHandler, [
    'doSearch',
    'showMetadata',
    'toggleCoverageArea',
    'updateQuery',
    'renderMetadataSearch',
    'toggleSearch',
    'toggleAdvancedSearch',
    'toggleSearchResultsFilter',
    'advancedSearchParamsChanged',
    'advancedSearchCoverageStartDrawing',
    'advancedSearchCoverageCancelDrawing',
    'updateCoverageFeature',
    'toggleLayerVisibility',
    'updateSelectedLayers',
    'updateSearchResults',
    'updateDisplayedCoverageId',
    'handleMetadataSearchRequest'
]);

export { wrapped as MetadataStateHandler };
