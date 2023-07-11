import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { renderMetadataSearchContainer } from './view/MetadataSearchContainer';
import { MetadataOptionService } from './service/MetadataOptionService';
import { MetadataSearchService } from './service/MetadataSearchService';
import { METADATA_BUNDLE_LOCALIZATION_ID } from './instance';

class MetadataStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.optionsService = new MetadataOptionService(this.instance.optionAjaxUrl);
        this.searchService = new MetadataSearchService(this.instance.searchAjaxUrl);
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
            coverageFeature: null
        });
        this.addStateListener(() => this.updateMetadataSearch());
    }

    getSandbox () {
        return this.instance.getSandbox();
    }

    getVectorLayerId () {
        return this.instance.getVectorLayerId();
    }

    renderMetadataSearch (element) {
        this.contentController = renderMetadataSearchContainer(this.getState(), this.getController(), element);
    }

    updateMetadataSearch () {
        if (!this.contentController) {
            this.contentController = renderMetadataSearchContainer(this.getState(), this.getController(), document.createElement('div'));
        }

        this.contentController.update(this.getState(), this.getController());
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
                formdata[key] = advancedSearchValues[key];
            }
        });

        this.searchService.doSearch(formdata, (results) => this.updateSearchResults(results));
    }

    updateSearchResults (json) {
        this.updateState({ loading: false, searchResults: json?.results || null, searchResultsVisible: true });
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
    'updateCoverageFeature'
]);

export { wrapped as MetadataStateHandler };
