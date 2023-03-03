import { MetadataSearchForm } from './MetaDataSearchForm';
import { MetadataSearchToolHandler } from './MetadataSearchToolHandler';

Oskari.clazz.define('Oskari.mapframework.publisher.tool.MetadataSearchTool',
    function () {
        this.handler = null;
    }, {
        index: 9,
        templates: {},
        noUI: null,
        noUiIsCheckedInModifyMode: false,
        group: 'rpc',
        getName: function () {
            return 'Oskari.mapframework.publisher.tool.MetadataSearchTool';
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
                id: 'Oskari.mapframework.publisher.tool.MetadataSearchTool',
                title: 'MetadataSearchTool',
                config: {}
            };
        },

        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'metadatacatalogue',

        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            const conf = data?.configuration[this.bundleName]?.conf || {};
            let initialValue = false;
            if (conf.noUI) {
                initialValue = true;
            }
            this.handler = new MetadataSearchToolHandler(initialValue);
        },

        getComponent: function () {
            return {
                component: MetadataSearchForm,
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
            if (this.handler?.getState()?.allowMetadata) {
                const json = {
                    configuration: {}
                };
                json.configuration[this.bundleName] = {
                    conf: {
                        noUI: true
                    },
                    state: {}
                };
                return json;
            } else {
                return null;
            }
        }
    }, {

        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        protocol: ['Oskari.mapframework.publisher.Tool']
    });
