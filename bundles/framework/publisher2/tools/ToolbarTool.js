Oskari.clazz.define('Oskari.mapframework.publisher.tool.ToolbarTool',
    function () {
        // checkboxes in ui
        this.selectedOptionsUi = {
            history: true,
            measureline: true,
            measurearea: true
        };
    }, {
        index: 3,
        lefthanded: 'top right',
        righthanded: 'top left',

        templates: {
            'toolOptions': '<div class="tool-options"></div>',
            'toolOption': '<div class="tool-option"><label><input type="checkbox" /></label></div>'
        },

        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            this.selectedTools = {};
            const plugin = this.findPluginFromInitData(data);
            if (!plugin) {
                return;
            }
            this.storePluginConf(plugin.config);
            // tools on map
            this.selectedTools = {
                history_back: true,
                history_forward: true,
                measureline: true,
                measurearea: true
            };
            // preselect tools based on init data
            let buttons = plugin.config?.buttons;
            if (buttons?.length) {
                // restore saved settings... yes it's a messy state for the tool...
                Object.keys(this.selectedOptionsUi).forEach(toolName => {
                    this.selectedOptionsUi[toolName] = false;
                });
                Object.keys(this.selectedTools).forEach(toolName => {
                    this.selectedTools[toolName] = false;
                });
                buttons.forEach(toolName => {
                    if (toolName.startsWith('history')) {
                        this.selectedOptionsUi.history = true;
                        this.selectedTools.history_back = true;
                        this.selectedTools.history_forward = true;
                    } else {
                        this.selectedOptionsUi[toolName] = true;
                        this.selectedTools[toolName] = true
                    }
                });
            }

            this.setEnabled(this._hasActiveTools());
        },
        _setEnabledImpl: function (enabled) {
            if (enabled) {
                // if there are no selected tools in configuration, select them all when tools are selected
                Object.keys(this.selectedOptionsUi).forEach(toolName => {
                    this.__changeToolStatus(toolName, !!this.selectedOptionsUi[toolName]);
                });
            }
        },
        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                title: 'PublisherToolbarPlugin',
                config: {
                    'toolbarId': 'PublisherToolbar',
                    buttons: this.state.pluginConfig?.buttons || []
                }
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
            var me = this,
                buttons = [];
            if (!this.isEnabled()) {
                return null;
            }

            for (var toolName in me.selectedTools) {
                if (me.selectedTools.hasOwnProperty(toolName) && me.selectedTools[toolName]) {
                    buttons.push(toolName);
                }
            }

            var pluginConfig = me.getPlugin().getConfig();
            pluginConfig.buttons = buttons;

            var retValue = {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: pluginConfig }]
                        }
                    }
                }
            };

            // we want toolbar always with no default tools
            retValue.configuration.toolbar = { conf: { 'history': false, 'basictools': false, 'viewtools': false } };
            return retValue;
        },
        /**
         * Get extra options.
         * @method getExtraOptions
         * @public
         *
         * @returns {Object} jQuery element
         */
        getExtraOptions: function (toolContainer) {
            const localization = this.__loc;
            const optionsContainer = jQuery(this.templates.toolOptions).clone();
            
            Object.keys(this.selectedOptionsUi).forEach(toolName => {
                var selectTool = jQuery(this.templates.toolOption).clone();
                selectTool.find('label')
                    .attr('for', 'tool-opt-' + toolName)
                    .append(localization.toolbarToolNames[toolName]);
                optionsContainer.append(selectTool);
                // toggle tool
                selectTool.find('input')
                    .attr('id', 'tool-opt-' + toolName)
                    //.on('change', _toggleToolOption(toolName));
                    .prop('checked', !!this.selectedOptionsUi[toolName])
                    .on('change', () => {
                        var toolState = this.selectedOptionsUi[toolName];
                        this.__changeToolStatus(toolName, !toolState);
                    });
            });
            toolContainer.find('.extraOptions').append(optionsContainer);
            this.optionsContainer = optionsContainer;
        },
        __changeToolStatus: function (toolName, isActive) {
            if (typeof this.selectedOptionsUi[toolName] === 'boolean') {
                this.selectedOptionsUi[toolName] = isActive;
            }
            if (!this._hasActiveTools()) {
                // last tool removed -> enable last unselected
                this.__changeToolStatus(toolName, true);
                return;
            }
            if (this.optionsContainer) {
                this.optionsContainer
                    .find('input#tool-opt-' + toolName)
                    .prop('checked', isActive);
            }
            if (toolName === 'history') {
                this.__changeToolStatus('history_back', isActive);
                this.__changeToolStatus('history_forward', isActive);
                return;
            }
            // toggle checkbox in UI to reflect state
            this.selectedTools[toolName] = isActive;
            const plugin = this.getPlugin();
            if (isActive) {
                plugin.addToolButton(toolName);
            } else {
                plugin.removeToolButton(toolName);
            }
        },

        _hasActiveTools: function () {
            return Object.keys(this.selectedOptionsUi)
                .some(toolName => this.selectedOptionsUi[toolName] === true);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
