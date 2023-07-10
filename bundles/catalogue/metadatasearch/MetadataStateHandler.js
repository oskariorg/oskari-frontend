import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { renderMetadataSearchContainer } from './view/MetadataSearchContainer';
import { MetadataOptionService } from './service/MetadataOptionService';
import { MetadataSearchService } from './service/MetadataSearchService';
import { METADATA_BUNDLE_LOCALIZATION_ID } from './instance';

export const ADVANCED_SEARCH_PARAMS = {
    resourceType: 'type',
    resourceName: 'Title',
    responsibleParty: 'OrganisationName',
    keyword: 'Subject',
    topicCategory: 'TopicCategory',
    metadataLanguage: 'Language',
    resourceLanguage: 'ResourceLanguage'
};

class MetadataStateHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.optionsService = new MetadataOptionService(this.instance.optionsAjaxUrl);
        this.searchService = new MetadataSearchService(this.instance.searchAjaxUrl);
        this.setState({
            query: '',
            advancedSearchExpanded: false,
            advancedSearchOptions: null,
            advancedSearchValues: {
                resourceType: []
            },
            loading: false,
            searchResultsVisible: false,
            searchResultsFilter: null
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

        Object.keys(ADVANCED_SEARCH_PARAMS).forEach(key => {
            if (advancedSearchValues[key]) {
                const keyInRequestParams = ADVANCED_SEARCH_PARAMS[key];

                if (advancedSearchValues[key] instanceof Array) {
                    formdata[keyInRequestParams] = advancedSearchValues[key].join(',');
                } else {
                    formdata[keyInRequestParams] = advancedSearchValues[key];
                }
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

    advancedSearchResourceTypeChanged (value) {
        if (!value || !value.target) {
            return;
        }
        const { advancedSearchValues } = this.getState();
        const checked = !!value.target.checked;

        const newResourceType = advancedSearchValues?.resourceType?.filter(item => item !== value.target.value);
        if (checked) {
            newResourceType.push(value.target.value);
        }
        advancedSearchValues.resourceType = newResourceType;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchResourceNameChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.resourceName = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchResponsiblePartyChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.responsibleParty = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchKeywordChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.keyword = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchTopicCategoryChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.topicCategory = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchMetadataLanguageChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.metadataLanguage = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
    }

    advancedSearchResourceLanguageChanged (value) {
        const { advancedSearchValues } = this.getState();
        advancedSearchValues.resourceLanguage = value;
        this.updateAdvancedSearchValues(advancedSearchValues);
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
    'advancedSearchResourceTypeChanged',
    'advancedSearchResourceNameChanged',
    'advancedSearchResponsiblePartyChanged',
    'advancedSearchKeywordChanged',
    'advancedSearchTopicCategoryChanged',
    'advancedSearchMetadataLanguageChanged',
    'advancedSearchResourceLanguageChanged'
]);

export { wrapped as MetadataStateHandler };
