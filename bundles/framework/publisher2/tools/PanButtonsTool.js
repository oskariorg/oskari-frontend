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
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
                title: 'PanButtons',
                config: this.state.pluginConfig || {}
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
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                        }
                    }
                }
            };
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
                const initialConf = this.state.pluginConfig;
                const showArrows = initialConf && initialConf.showArrows;
                const extraOptions = this._templates.extraOptions.clone();
                extraOptions.find('.arrows-selection label span').append(this.__loc.panButtonsOptions.showArrows);
                const arrowsCheckbox = extraOptions.find('.arrows-selection label input')
                    .on('change', function () {
                        const isChecked = jQuery(this).is(':checked');
                        me.__plugin.setShowArrows(isChecked);
                    });
                if (showArrows) {
                    arrowsCheckbox.prop('checked', true).change();
                    this.__plugin.setShowArrows(true);
                }
                this._extraOptions = extraOptions;
            }
            return this._extraOptions;
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
