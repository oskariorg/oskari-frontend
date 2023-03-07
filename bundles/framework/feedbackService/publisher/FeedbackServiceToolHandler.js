import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (data) {
        super();
        this.setState({
            allowFeedback: data?.configuration?.feedbackService?.conf?.publish ? true : false,
            feedbackBaseUrl: data?.metadata?.feedbackService?.url || '',
            feedbackApiKey: data?.metadata?.feedbackService?.key || '',
            feedbackExtensions: data?.metadata?.feedbackService?.extensions || ''
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
