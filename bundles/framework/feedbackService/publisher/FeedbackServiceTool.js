import { FeedbackServiceForm } from './FeedbackServiceForm';
import { FeedbackServiceToolHandler } from './FeedbackServiceToolHandler';

Oskari.clazz.define('Oskari.mapframework.publisher.tool.FeedbackServiceTool',
    function () {
        this.handler = null;
    }, {
        index: 9,
        group: 'rpc',
        getName: function () {
            return 'Oskari.mapframework.publisher.tool.FeedbackServiceTool';
        },
        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function () {
            return {
                // doesn't actually map to anything real, just need this in order to not break stuff in publisher
                // and provide a cleaner selector for selenium testing
                id: 'feedbackService.FeedbackServiceRPCTool',
                title: Oskari.getMsg('feedbackService', 'display.publisher.label'),
                config: {},
                hasNoPlugin: true
            };
        },

        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'feedbackService',

        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            this.handler = new FeedbackServiceToolHandler(data?.metadata?.feedbackService);
            this.setEnabled(!!data?.configuration?.feedbackService);
        },
        getComponent: function () {
            return {
                component: FeedbackServiceForm,
                handler: this.handler
            };
        },
        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            if (!this.isEnabled()) {
                return null;
            }

            const state = this.handler.getState() || {};
            return {
                configuration: {
                    feedbackService: {
                        conf: {}
                    }
                },
                metadata: {
                    feedbackService: {
                        url: state.feedbackBaseUrl && state.feedbackBaseUrl !== '' ? state.feedbackBaseUrl : null,
                        key: state.feedbackApiKey && state.feedbackApiKey !== '' ? state.feedbackApiKey : null,
                        extensions: state.feedbackExtensions && state.feedbackExtensions !== '' ? state.feedbackExtensions : null
                    }
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
