import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { MetadataOptionService } from './service/MetadataOptionService';
import { MetadataSearchService } from './service/MetadataSearchService';
import { METADATA_BUNDLE_LOCALIZATION_ID } from './instance';

class MetadataStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.optionsService = new MetadataOptionService(this.instance.optionAjaxUrl);
        this.searchService = new MetadataSearchService(this.instance.searchAjaxUrl);
        this.mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.setState({
            query: '',
            advancedSearchExpanded: false,
            advancedSearchOptions: null,
            advancedSearchValues: {
            },
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

    doSearch () {
        this.updateState({
            loading: true,
            searchResultsVisible: false,
            searchResultsFilter: null
        });
        const { query, advancedSearchValues } = this.getState();
        const formdata = {};
        if (query) {
            formdata.search = query;
        }

        Object.keys(advancedSearchValues).forEach(key => {
            if (advancedSearchValues[key] instanceof Array) {
                formdata[key] = advancedSearchValues[key].join(',');
            } else {
                // eliminate nulls
                if (advancedSearchValues[key]) {
                    formdata[key] = advancedSearchValues[key];
                }
            }
        });

        this.searchService.doSearch(formdata, (results) => this.updateSearchResults(results));
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
        this.instance.removeFeaturesFromMap();
        const { displayedCoverageId } = this.getState();
        if (displayedCoverageId && displayedCoverageId === result.id) {
            this.updateState({
                displayedCoverageId: null
            });
            return;
        }

        this.updateState({
            displayedCoverageId: result.id
        });
        this.instance.addCoverageFeatureToMap(result.geom);
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

    /**
     * Advanced search
     */
    toggleAdvancedSearch () {
        const { advancedSearchExpanded, advancedSearchOptions } = this.getState();
        // toggling open and haven't fetched options yet -> fetch.
        this.updateState({
            advancedSearchExpanded: !advancedSearchExpanded
        });

        if (!advancedSearchExpanded && !advancedSearchOptions) {
            this.fetchOptions();
        }
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

    async fetchOptions () {
        await this.optionsService.getOptions((options) => {
            const sortedOptions = { fields: [] };
            const emptyOption = Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.emptyOption');
            options?.fields?.forEach((field) => {
                const newField = Object.assign({}, field);
                let sortedValues = field.values.sort((a, b) => Oskari.util.naturalSort(a.val, b.val));
                sortedValues.forEach((value) => { value.value = value.val; });
                if (!newField.multi) {
                    sortedValues = [{ val: emptyOption, value: '' }].concat(sortedValues);
                }
                newField.values = sortedValues;
                sortedOptions.fields.push(newField);
            });
            this.updateState({ advancedSearchOptions: sortedOptions });
        });
    }

    updateAdvancedSearchValues (newValues) {
        this.updateState({
            advancedSearchValues: newValues
        });
    }

    advancedSearchParamsChanged (key, value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues[key] = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchParamsChangedMulti (key, value) {
        if (!value || !value.target) {
            return;
        }
        const { advancedSearchValues } = this.getState();
        const checked = !!value.target.checked;

        const newMultiValue = advancedSearchValues[key]?.filter(item => item !== value.target.value) || [];
        if (checked) {
            newMultiValue.push(value.target.value);
        }
        advancedSearchValues[key] = newMultiValue;
        this.updateAdvancedSearchValues(advancedSearchValues);
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
    'advancedSearchParamsChangedMulti',
    'advancedSearchCoverageStartDrawing',
    'advancedSearchCoverageCancelDrawing',
    'updateCoverageFeature',
    'toggleLayerVisibility',
    'updateSelectedLayers',
    'updateSearchResults'
]);

export { wrapped as MetadataStateHandler };
