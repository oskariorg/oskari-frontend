import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (initialData) {
        super();
        this.setState({
            allowMetadata: initialData || false
        });
    };

    getName () {
        return 'MetadataSearchToolHandler';
    }

    setAllowMetadata (value) {
        this.updateState({
            allowMetadata: value
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setAllowMetadata'
]);

export { wrapped as MetadataSearchToolHandler };
