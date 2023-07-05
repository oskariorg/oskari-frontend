import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { renderMetadataSearchContainer } from './view/MetadataSearchContainer';
import { MetadataOptionService } from './service/MetadataOptionService';
import { MetadataSearchService } from './service/MetadataSearchService';

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
    constructor (optionsAjaxUrl, searchAjaxUrl) {
        super();
        this.optionsService = new MetadataOptionService(optionsAjaxUrl);
        this.searchService = new MetadataSearchService(searchAjaxUrl);
        this.setState({
            query: '',
            advancedSearchExpanded: false,
            advancedSearchOptions: null,
            advancedSearchValues: {
                resourceType: []
            }
        });
        this.addStateListener(() => this.updateMetadataSearch());
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

        this.searchService.doSearch(formdata);
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

    async fetchOptions () {
        await this.optionsService.getOptions((options) => {
            this.updateState({ advancedSearchOptions: options });
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
    'updateQuery',
    'renderMetadataSearch',
    'toggleAdvancedSearch',
    'advancedSearchResourceTypeChanged',
    'advancedSearchResourceNameChanged',
    'advancedSearchResponsiblePartyChanged',
    'advancedSearchKeywordChanged',
    'advancedSearchTopicCategoryChanged',
    'advancedSearchMetadataLanguageChanged',
    'advancedSearchResourceLanguageChanged'
]);

export { wrapped as MetadataStateHandler };
