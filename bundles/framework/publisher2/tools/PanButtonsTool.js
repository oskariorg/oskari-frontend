Oskari.clazz.define('Oskari.mapframework.publisher.tool.PanButtonsTool',
    function () {
    }, {
        index: 2,
        lefthanded: 'top left',
        righthanded: 'top right',
        _templates: {
            extraOptions: jQuery(`
                <div class="publisher2 panbutton-options tool-options">
                    <div class="arrows-selection">
                        <label><input type="checkbox"/><span></span></label>
                    </div>
                </div>
            `)
        },
        extraOptions: null,

        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            const plugin = this._getToolPluginMapfullConf();
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
                title: 'PanButtons',
                config: plugin?.config || {}
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
            var me = this;

            if (me.state.enabled) {
                return {
                    configuration: {
                        mapfull: {
                            conf: {
                                plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                            }
                        }
                    }
                };
            } else {
                return null;
            }
        },
        /**
         * Get extra options.
         * @method getExtraOptions
         * @public
         *
         * @returns {Object} jQuery element
         */
        getExtraOptions: function () {
            var me = this;
            if (!me._extraOptions) {
                const initialConf = me._getToolPluginMapfullConf();
                const showArrows = initialConf && initialConf.config && initialConf.config.showArrows;
                const extraOptions = me._templates.extraOptions.clone();
                extraOptions.find('.arrows-selection label span').append(me.__loc.panButtonsOptions.showArrows);
                const arrowsCheckbox = extraOptions.find('.arrows-selection label input')
                    .on('change', function () {
                        const isChecked = jQuery(this).is(':checked');
                        me.__plugin.setShowArrows(isChecked);
                    });
                if (showArrows) {
                    arrowsCheckbox.prop('checked', true).change();
                    me.__plugin.setShowArrows(true);
                }
                me._extraOptions = extraOptions;
            }
            return me._extraOptions;
        },
        /**
         * @private @method _getToolPluginMapfullConf
         * Get map view cofiguration (from mapfull) for this tool
         * @return {Object / null} config or null if not found
         */
        _getToolPluginMapfullConf: function () {
            const { configuration } = this.data || {};
            if (!configuration) {
                return null;
            }
            const { mapfull = {} } = configuration;
            const { conf = {} } = mapfull;
            const { plugins = [] } = conf;
            // data.configuration.mapfull.conf.plugins
            return plugins.find(plug => plug.id === 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons');
        },
        init: function (data) {
            var me = this;
            me.data = data;

            if (me._getToolPluginMapfullConf()) {
                me.setEnabled(true);
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
