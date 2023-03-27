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
                // and provide a cleaner selector for selenium testing
                id: 'metadatacatalogue.MetadataSearchRPCTool',
                title: Oskari.getMsg('catalogue.bundle.metadatacatalogue', 'tool.label'),
                config: {},
                hasNoPlugin: true
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
            this.setEnabled(!!conf.noUI);
        },

        getComponent: function () {
            return {};
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
            return {
                configuration: {
                    metadatacatalogue: {
                        conf: {
                            noUI: true
                        }
                    }
                }
            };
        }
    }, {

        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        protocol: ['Oskari.mapframework.publisher.Tool']
    });
