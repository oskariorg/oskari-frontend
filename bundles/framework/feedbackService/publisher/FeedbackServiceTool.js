import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { FeedbackServiceForm } from './FeedbackServiceForm';
import { FeedbackServiceToolHandler } from './FeedbackServiceToolHandler';

const BUNDLE_ID = 'feedbackService';
class FeedbackServiceTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 9;
        this.group = 'rpc';
    }
    getTool () {
        return {
            id: 'feedbackService.FeedbackServiceRPCTool',
            title: Oskari.getMsg(BUNDLE_ID, 'display.publisher.label'),
            config: {},
            hasNoPlugin: true
        };
    }
    getComponent () {
        return {
            component: FeedbackServiceForm,
            handler: this.handler
        };
    }
    init (data) {
        this.handler = new FeedbackServiceToolHandler(data?.metadata?.feedbackService);
        this.setEnabled(!!data?.configuration?.feedbackService);
    }
    getValues () {
        if (!this.isEnabled()) {
            return null;
        }

        const state = this.handler.getState() || {};
        return {
            configuration: {
                [BUNDLE_ID]: {
                    conf: {}
                }
            },
            metadata: {
                [BUNDLE_ID]: {
                    url: state.feedbackBaseUrl && state.feedbackBaseUrl !== '' ? state.feedbackBaseUrl : null,
                    key: state.feedbackApiKey && state.feedbackApiKey !== '' ? state.feedbackApiKey : null,
                    extensions: state.feedbackExtensions && state.feedbackExtensions !== '' ? state.feedbackExtensions : null
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.FeedbackServiceTool',
    FeedbackServiceTool,
    {
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
