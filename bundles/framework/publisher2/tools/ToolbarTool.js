Oskari.clazz.define('Oskari.mapframework.publisher.tool.ToolbarTool',
    function () {
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

            // checkboxes in ui
            this.selectedOptionsUi = {
                history: true,
                measureline: true,
                measurearea: true
            };

            // tools on map
            this.selectedTools = {
                history_back: true,
                history_forward: true,
                measureline: true,
                measurearea: true
            };
            const buttons = plugin.config?.buttons;
            if (buttons) {
                // if there are no selected tools in configuration, select them all when tools are selected
                Object.keys(this.selectedTools).forEach(toolName => {
                    if (!buttons.includes(toolName)) {
                        this.selectedTools[toolName] = false;
                        if (this.selectedOptionsUi[toolName]) {
                            this.selectedOptionsUi[toolName] = false;
                        }
                    }
                });
            }

            // unselect history tools only if both are unselected
            if (!this.selectedTools['history_back'] && !this.selectedTools['history_forward']) {
                this.selectedOptionsUi['history'] = false;
            } else {
                // if one of history tools is selected, select the other one too
                this.selectedTools['history_forward'] = true;
                this.selectedTools['history_back'] = true;
            }

            this.setEnabled(this._hasActiveTools());
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
                config: { 'toolbarId': 'PublisherToolbar', buttons: [] }
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
            if (!me.state.enabled) {
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
            var me = this;
            // content
            var closureMagic = function (tool) {
                return function () {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked');
                    tool.selected = isChecked;
                    // (un)creates and (un)registers the plugin
                    // the first time around the plugin has not yet been created and thus this has to be called "manually" for the activatePreviewPlugin to work correctly
                    if (isChecked) {
                        tool.setEnabled(isChecked);
                        me.activatePreviewPlugin(tool, isChecked);
                    } else {
                        // toggled off? need to toggle off the previewplugin first, so the toolbar gets notified of removing the buttons
                        me.activatePreviewPlugin(tool, isChecked);
                        tool.setEnabled(isChecked);
                    }
                };
            };

            this.toolContainer = toolContainer;

            toolContainer.find('input').on('change', closureMagic(this));

            // modifying an existing and this was already checked?
            var checkbox = toolContainer.find('input:checked');
            if (checkbox) {
                checkbox.trigger('change');
            }
        },

        /**
         * @method activatePreviewPlugin
         * @private
         * Enables or disables a plugin on map
         * @param {Object} tool tool definition as in #tools property
         * @param {Boolean} enabled, true to enable plugin, false to disable
         * @param {Boolean} localeChange, true to not reset config when disabling plugin, false to reset config
         */
        activatePreviewPlugin: function (tool, enabled, localeChange) {
            var me = this;

            if (!tool || !tool.__plugin) {
                // no tool or plugin not created -> nothing to do
                return;
            }

            var _toggleToolOption = function (toolName) {
                return function () {
                    // check if tool was selected or unselected
                    var toolState = me.selectedOptionsUi[toolName];

                    // if tool was selected, unselect tool and send removeToolButtonRequest
                    if (toolState) {
                        me.selectedOptionsUi[toolName] = false;
                        if (toolName === 'history') {
                            tool.__plugin.removeToolButton('history_back');
                            me.selectedTools['history_back'] = false;
                            tool.__plugin.removeToolButton('history_forward');
                            me.selectedTools['history_forward'] = false;
                        } else {
                            tool.__plugin.removeToolButton(toolName);
                            me.selectedTools[toolName] = false;
                        }
                    } else {
                        me.selectedOptionsUi[toolName] = true;
                        if (toolName === 'history') {
                            tool.__plugin.addToolButton('history_back');
                            me.selectedTools['history_back'] = true;
                            tool.__plugin.addToolButton('history_forward');
                            me.selectedTools['history_forward'] = true;
                        } else {
                            tool.__plugin.addToolButton(toolName);
                            me.selectedTools[toolName] = true;
                        }
                    }
                };
            };

            var options,
                toolName;

            if (enabled) {
                tool._isPluginStarted = true;

                options = jQuery(me.templates.toolOptions).clone();

                for (toolName in me.selectedOptionsUi) {
                    if (me.selectedOptionsUi.hasOwnProperty(toolName)) {
                        // create checkbox
                        var selectTool = jQuery(me.templates.toolOption).clone();
                        selectTool.find('label')
                            .attr('for', 'tool-opt-' + toolName).append(me.__loc.toolbarToolNames[toolName]);

                        // set selected values checked
                        if (me.selectedOptionsUi[toolName]) {
                            selectTool.find('input').prop('checked', true);
                            if (toolName === 'history') {
                                tool.__plugin.addToolButton('history_back');
                                tool.__plugin.addToolButton('history_forward');
                            } else {
                                tool.__plugin.addToolButton(toolName);
                            }
                        }

                        // add button to div
                        options.append(selectTool);

                        // toggle tool
                        selectTool.find('input').attr('id', 'tool-opt-' + toolName).on('change', _toggleToolOption(toolName));
                    }
                }

                tool.toolContainer.find('.extraOptions').append(options);
            } else {
                // remove buttons, handlers and toolbar toolbar tools
                for (toolName in me.selectedTools) {
                    if (me.selectedTools.hasOwnProperty(toolName)) {
                        tool.__plugin.removeToolButton(toolName);
                    }
                }
                if (tool._isPluginStarted) {
                    // remove eventlisteners
                    var _removeOptions = function (className, handler) {
                        var optionContainer = tool.toolContainer.find('.extraOptions').find(className),
                            toolOptionCheckboxes = optionContainer.find('input').off('change', handler);
                        // remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    };
                    _removeOptions('.tool-options', me._toggleToolOption);
                    _removeOptions('.tool-option-setting', me._toggleToolOption);

                    tool._isPluginStarted = false;
                }
            }
        },

        _hasActiveTools: function () {
            return Object.keys(this.selectedTools)
                .some(toolName => this.selectedTools[toolName] === true);
        },

        /**
        * Stop _stopImpl.
        * @method _stopImpl
        */
        _stopImpl: function () {
            // send remove request per active button
            for (var toolName in this.selectedTools) {
                if (this.selectedTools.hasOwnProperty(toolName) && toolName) {
                    this.__plugin.removeToolButton(toolName);
                }
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
