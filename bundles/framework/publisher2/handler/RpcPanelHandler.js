import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (data, consumer) {
        super();
        this.state = {
            allowMetadata: data?.configuration['metadatacatalogue']?.conf?.noUI ? true : false,
            allowFeedback: data?.configuration['feedbackService']?.conf?.publish ? true : false,
            feedbackBaseUrl: data?.metadata['feedbackService']?.url || '',
            feedbackApiKey: data?.metadata['feedbackService']?.key || '',
            feedbackExtensions: data?.metadata['feedbackService']?.extensions || ''
        };
        this.addStateListener(consumer);
    }

    getName () {
        return 'RpcPanelHandler';
    }

    updateField (field, value) {
        this.updateState({
            [field]: value
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateField'
]);

export { wrapped as RpcPanelHandler };
