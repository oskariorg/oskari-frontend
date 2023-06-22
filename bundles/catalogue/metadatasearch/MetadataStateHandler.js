import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { renderMetadataSearchContainer } from './view/MetadataSearchContainer';

class MetadataStateHandler extends StateHandler {
    constructor () {
        super();
        this.setState({
            query: '',
            advancedSearchExpanded: false
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
        const { advancedSearchExpanded } = this.getState();
        this.updateState({
            advancedSearchExpanded: !advancedSearchExpanded
        });
    }
}

const wrapped = controllerMixin(MetadataStateHandler, [
    'updateQuery',
    'renderMetadataSearch',
    'toggleAdvancedSearch'
]);

export { wrapped as MetadataStateHandler };
