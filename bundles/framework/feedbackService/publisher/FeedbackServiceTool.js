import { FeedbackServicePublisherTool } from './FeedbackServicePublisherTool';
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
                id: 'Oskari.mapframework.publisher.tool.FeedbackServiceTool',
                title: 'FeedbackServiceTool',
                config: {}
            };
        },

        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'feedbackService',

        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            this.handler = new FeedbackServiceToolHandler(data);
        },
        getComponent: function () {
            return {
                component: FeedbackServicePublisherTool,
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
            if (this.handler?.getState()?.allowFeedback) {
                const state = this.handler.getState();
                return {
                    configuration: {
                        feedbackService: {
                            conf: {
                                publish: true
                            },
                            state: {}
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
            } else {
                return null;
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
