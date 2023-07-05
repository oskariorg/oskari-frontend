import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { renderMetadataSearchContainer } from './view/MetadataSearchContainer';
import { MetadataOptionService } from './service/MetadataOptionService';

class MetadataStateHandler extends StateHandler {
    constructor (optionsAjaxUrl) {
        super();
        this.optionsService = new MetadataOptionService(optionsAjaxUrl);
        this.setState({
            query: '',
            advancedSearchExpanded: false,
            advancedSearchOptions: null,
            advancedSearchValues: {
                resourceTypes: []
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

        const newResourceTypes = advancedSearchValues?.resourceTypes?.filter(item => item !== value.target.value);
        if (checked) {
            newResourceTypes.push(value.target.value);
        }
        advancedSearchValues.resourceTypes = newResourceTypes;
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
