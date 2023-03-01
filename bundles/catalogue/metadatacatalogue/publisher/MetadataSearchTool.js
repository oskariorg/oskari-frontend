Oskari.clazz.define('Oskari.mapframework.publisher.tool.MetadataSearchTool',
    function () {
    }, {
        index: 9,
        templates: {},
        noUI: null,
        noUiIsCheckedInModifyMode: false,
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
            var me = this;
            if (!data || !data.configuration[me.bundleName]) {
                return;
            }

            var conf = data.configuration[me.bundleName].conf || {};
            if (conf.noUI) {
                me.setEnabled(true);
            }
        },

        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            const me = this;

            if (me.state.enabled) {
                var json = {
                    configuration: {}
                };
                json.configuration[me.bundleName] = {
                    conf: {
                        noUI: true
                    },
                    state: {}
                };
                return json;
            } else {
                return null;
            }
        },
        setEnabled: function (enabled) {
            var me = this;
            me.state.enabled = (enabled === true);
        }
    }, {

        extend: ['Oskari.mapframework.publisher.tool.AbstractPluginTool']
    });
