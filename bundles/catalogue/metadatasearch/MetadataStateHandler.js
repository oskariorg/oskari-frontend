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
            advancedSearchOptions: null
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
}

const wrapped = controllerMixin(MetadataStateHandler, [
    'updateQuery',
    'renderMetadataSearch',
    'toggleAdvancedSearch'
]);

export { wrapped as MetadataStateHandler };
