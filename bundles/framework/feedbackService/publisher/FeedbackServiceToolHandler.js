import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (metadata) {
        super();
        this.setState({
            feedbackBaseUrl: metadata?.url || '',
            feedbackApiKey: metadata?.key || '',
            feedbackExtensions: metadata?.extensions || ''
        });
    };

    getName () {
        return 'FeedbackServiceToolHandler';
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

export { wrapped as FeedbackServiceToolHandler };
