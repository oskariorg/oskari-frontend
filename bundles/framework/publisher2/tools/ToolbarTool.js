Oskari.clazz.define('Oskari.mapframework.publisher.tool.ToolbarTool',
    function () {
    }, {
        index: 3,
        allowedLocations: ['top left', 'top center', 'top right'],
        lefthanded: 'top right',
        righthanded: 'top left',
        allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
        ],


        groupedSiblings: false,
        //user's own layers (not id's)
        myplaces: [],

        // defaultStateConfigs stores the default state values, which is used when reset configs
        defaultStateConfigs: {
            'publishedmyplaces2Config': {
                'toolbarId': 'PublisherToolbar',
                'layer': null,
                'myplaces': {
                    'point': false,
                    'line': true,
                    'area': false
                }
            }
        },
        // toolbarConfig stores the current state
        toolbarConfig: {},
        // publishedmyplaces2Config stores the current state
        publishedmyplaces2Config: undefined,



        drawButtons: {
            'point': {
                iconCls: 'myplaces-draw-point',
                disabled: true,
                sticky: true,
                callback: function () {
                }
            },
            'line': {
                iconCls: 'myplaces-draw-line',
                disabled: true,
                sticky: true,
                callback: function () {
                }
            },
            'area': {
                iconCls: 'myplaces-draw-area',
                disabled: true,
                sticky: true,
                callback: function () {
                }
            }

        },

        templates: {
            'toolOptions': '<div class="tool-options"></div>',
            'toolOption': '<div class="tool-option"><label><input type="checkbox" /></label></div>',
            'toolOptionSettings': '<div class="tool-option-settings"></div>',
            'toolOptionSetting': '<div class="tool-option-setting"></div>',
            'toolOptionSettingInput': '<label><input type="checkbox" /></label>',
            'layerSelect': '<select class="publisher-select-layer"></select>',
            'layerSelectOption': '<option></option>'
        },

        /**
         * Initialise tool
         * @method init
         */
        init: function(data) {
            var me = this;
            me.selectedTools = {};
            me._storedData = {};
            if (!data || !data.configuration) {
                return;
            }
            var conf = data.configuration;
            var pluginConf = null || {};

            if (conf.mapfull.conf && conf.mapfull.conf.plugins) {
                _.each(conf.mapfull.conf.plugins, function(plugin) {
                    if (me.getTool().id === plugin.id) {
                        me.setEnabled(true);
                        pluginConf = plugin.config || {};
                    }
                });
            }

            //checkboxes in ui
            me.selectedOptionsUi = {
                history: true,
                measureline : true,
                measurearea : true
            };

            //tools on map
            me.selectedTools = {
                history_back : true,
                history_forward : true,
                measureline : true,
                measurearea : true
            };

            if(pluginConf.buttons) {
                //if there are no selected tools in configuration, select them all when tools are selected
                for (toolName in me.selectedTools) {
                    if (me.selectedTools.hasOwnProperty(toolName) && pluginConf.buttons.indexOf(toolName) === -1) {
                        me.selectedTools[toolName] = false;
                        if (me.selectedOptionsUi[toolName]) {
                            me.selectedOptionsUi[toolName] = false;
                        }
                    }
                }
            }

            // unselect history tools only if both are unselected
            if (!me.selectedTools["history_back"] && !me.selectedTools["history_forward"]) {
                me.selectedOptionsUi["history"] = false;
            } else {
                // if one of history tools is selected, select the other one too
                me.selectedTools["history_forward"] = true;
                me.selectedTools["history_back"] = true;
            }

            me.drawOptions = {
                point: true,
                line: true,
                area: true
            };


            if (data.configuration.publishedmyplaces2) {
                me._storedData.publishedmyplaces2Config = _.cloneDeep(conf.publishedmyplaces2.conf);
                var drawToolsConfig = me._storedData.publishedmyplaces2Config.myplaces;
                for (toolName in drawToolsConfig) {
                    if (drawToolsConfig.hasOwnProperty(toolName) && !drawToolsConfig[toolName]) {
                        me.drawOptions[toolName] = false;
                    }
                }
                if (me._hasSelectedDrawTool()) {
                    me.setEnabled(true);
                }
            }

            if (pluginConf.id) {
                me._storedData.toolbarConfig = _.cloneDeep(conf.toolbar.conf);
                if (me._hasActiveTools()) {
                    me.setEnabled(true);
                }
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
                config: {'toolbarId': 'PublisherToolbar', buttons : []}
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
            if(!me.state.enabled) {
                return null;
            }

            for (toolName in me.selectedTools) {
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
            retValue.configuration.toolbar = { conf : {"history": false,"basictools": false,"viewtools": false } };

            //PublishedMyPlaces is not supported with ol3

            /*
            if (me.publishedmyplaces2Config && me.publishedmyplaces2Config.layer && selectedDrawTools) {
                me.publishedmyplaces2Config.myplaces = me.drawOptions;
                retValue.configuration.publishedmyplaces2 = { conf : me.publishedmyplaces2Config };
            }
            */
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
                    //(un)creates and (un)registers the plugin
                    //the first time around the plugin has not yet been created and thus this has to be called "manually" for the activatePreviewPlugin to work correctly
                    if (isChecked) {
                        tool.setEnabled(isChecked);
                        me.activatePreviewPlugin(tool, isChecked);
                    } else {
                        //toggled off? need to toggle off the previewplugin first, so the toolbar gets notified of removing the buttons
                        me.activatePreviewPlugin(tool, isChecked);
                        tool.setEnabled(isChecked);
                    }
                };
            };

            this._loadDataConfig();
            this.toolContainer = toolContainer;

            toolContainer.find('input').change(closureMagic(this));

            //modifying an existing and this was already checked?
            var checkbox = toolContainer.find('input:checked');
            if (checkbox) {
                checkbox.change();
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
            var me = this,
                sandbox = me.__sandbox;

            if (!tool || !tool.__plugin) {
                // no tool or plugin not created -> nothing to do
                return;
            }

            var _toggleToolOption = function (toolName) {
                return function () {
                    //check if tool was selected or unselected
                    var toolState = me.selectedOptionsUi[toolName];

                    // if tool was selected, unselect tool and send removeToolButtonRequest
                    if (toolState) {
                        me.selectedOptionsUi[toolName] = false;
                        if (toolName === "history") {
                            tool.__plugin.removeToolButton("history_back");
                            me.selectedTools["history_back"] = false;
                            tool.__plugin.removeToolButton("history_forward");
                            me.selectedTools["history_forward"] = false;
                        } else {
                            tool.__plugin.removeToolButton(toolName);
                            me.selectedTools[toolName] = false;
                        }
                    } else {
                        me.selectedOptionsUi[toolName] = true;
                        if (toolName === "history") {
                            tool.__plugin.addToolButton("history_back");
                            me.selectedTools["history_back"] = true;
                            tool.__plugin.addToolButton("history_forward");
                            me.selectedTools["history_forward"] = true;
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

                        //set selected values checked
                        if (me.selectedOptionsUi[toolName]) {
                            selectTool.find('input').attr('checked', 'checked');
                            if (toolName === "history") {
                                tool.__plugin.addToolButton("history_back");
                                tool.__plugin.addToolButton("history_forward");
                            } else {
                                tool.__plugin.addToolButton(toolName);
                            }
                        }

                        //add button to div
                        options.append(selectTool);

                        //toggle tool
                        selectTool.find('input').attr('id', 'tool-opt-' + toolName).change(_toggleToolOption(toolName));
                    }
                }


                // show drawing controls for admin users
                me._checkAdminDrawControls();
                tool.toolContainer.find(".extraOptions").append(options);
            } else {
                // remove buttons, handlers and toolbar toolbar tools
                for (toolName in me.selectedTools) {
                    if (me.selectedTools.hasOwnProperty(toolName)) {
                        tool.__plugin.removeToolButton(toolName);
                    }
                }

                if (!localeChange) {
                    me.toolbarConfig = {};
                    me.publishedmyplaces2Config = {};
                }


                if (tool._isPluginStarted) {
                    //remove eventlisteners
                    var _removeOptions = function (className, handler) {
                        var optionContainer = tool.toolContainer.find(".extraOptions").find(className),
                            toolOptionCheckboxes = optionContainer.find('input').off('change', handler);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    };
                    _removeOptions('.tool-options', me._toggleToolOption);
                    _removeOptions('.tool-option-setting', me._toggleToolOption);

                    tool._isPluginStarted = false;
                }
            }

        },
        _checkAdminDrawControls: function(){
            var me = this;
            // show drawing controls for admin users
            //TODO: PublishedMyPlaces is not supported with ol3!
        },
        /**
         *  Manages drawlayer options in checked and unchecked cases
         *
         * @param element
         * @param toolName
         * @param groupName
         * @param toolOption
         * @param toggleToolHandler
         * @private
         */
        _toggleDrawTools: function (element, toolName, groupName, toolOption) {
            var me = this,
                toolButton,
                toolElement,
                addLayerButton,
                addSelectLayerButton,
                layerSelect,
                optionSettings,
                optionSetting,
                checkbox = jQuery(element),
                isChecked = checkbox.is(':checked');

            if (isChecked) {
                layerSelect = me._updateDrawLayerSelection();

                optionSettings = jQuery(me.templates.toolOptionSettings).clone();
                optionSetting = jQuery(me.templates.toolOptionSetting).clone();

                addLayerButton = me._getAddLayerButton();
                addSelectLayerButton = me._getAddSelectLayerButton();

                //add select for drawlayer
                optionSetting.append('<span>' + me.__loc.selectDrawLayer + '</span><br/>');
                optionSetting.append(layerSelect);
                addLayerButton.insertTo(optionSetting);
                addSelectLayerButton.insertTo(optionSetting);
                optionSettings.append(optionSetting);


                // build DOM based on button configs
                _.forEach(me.drawOptions, function (isToolChecked, toolName) {
                    toolButton = me.drawButtons[toolName];
                    toolButton.toolbarid = toolOption.toolbarId;

                    // create checkbox
                    toolButton.toolOption = jQuery(me.templates.toolOptionSetting).clone();
                    toolButton.toolOption.append(jQuery(me.templates.toolOptionSettingInput).clone());
                    toolButton.toolOption.find('label')
                        .attr('for', 'option-' + toolName).append(me.__loc.toolbarToolNames[toolName]);

                    //toggle toolbar tool. i.e. send requests
                    toolElement = toolButton.toolOption.find('input')
                        .attr('id', 'option-' + toolName)
                        .attr('checked', isToolChecked)
                        .change(function () {
                            var toolState = me.drawOptions[toolName];
                            isToolChecked = (toolState !== true);
                            me._toggleDrawToolButton(isToolChecked, toolName, groupName, toolButton);
                        });

                    optionSettings.append(toolButton.toolOption);

                    // execute toolElement change function when checked
                    me._toggleDrawToolButton(isToolChecked, toolName, groupName, toolButton);
                });
                //add different settings
                checkbox.parent().parent()
                    .append(optionSettings);
            } else {
                toolElement = checkbox.parent().parent();

                for (toolName in me.drawOptions) {
                    if (me.drawOptions.hasOwnProperty(toolName)) {
                        toolButton = me.drawButtons[toolName];
                        toolButton.toolbarid = toolOption.toolbarId;
                        var request = me.__sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, groupName, toolButton.toolbarid);
                        me.__sandbox.request(me.__instance, request);
                    }
                }

                toolElement.find('.tool-option-settings').remove();
                toolElement = null;
            }
        },

        /**
        * Toggle tool button.
        * @method _toggleToolButton
        * @private
        *
        * @param  {Boolean} isToolChecked is tool checked
        * @param  {String}  toolName the tool name
        * @param  {Object}  buttonGroup the button group
        * @param  {Object}  toolButton the tool button
        */

        _toggleDrawToolButton: function(isToolChecked, toolName, buttonGroupName, toolButton) {
            var me = this;

            if (isToolChecked) {
                var request = me.__sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest')(toolName, buttonGroupName, toolButton);
                me.__sandbox.request(me.__instance, request);
                me.drawOptions[toolName] = true;
            } else {
                var request = me.__sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, buttonGroupName, toolButton.toolbarid);
                me.__sandbox.request(me.__instance, request);
                me.drawOptions[toolName] = false;
            }
        },

        _updateDrawLayerSelection: function () {
            var me = this,
                i,
                layerSelect = jQuery(me.templates.layerSelect).clone(),
                layerSelectOption,
                mapLayerService = me.__sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                myplaces = mapLayerService.getLayersOfType('myplaces');

            for (i = 0; i < myplaces.length; i++) {
                layerSelectOption = jQuery(me.templates.layerSelectOption).clone();
                layerSelectOption.attr('value', myplaces[i].getId()).append(myplaces[i].getName());
                // select correct layer
                if (me.publishedmyplaces2Config.layer !== null && me.publishedmyplaces2Config.layer !== undefined &&
                    myplaces[i].getId() === me.publishedmyplaces2Config.layer) {
                    layerSelectOption.prop('selected', true);
                }
                layerSelect.append(layerSelectOption);
            }
            // select default
            if (me.publishedmyplaces2Config.layer === null || me.publishedmyplaces2Config.layer === undefined) {
                me.publishedmyplaces2Config.layer = myplaces[0].getId();
            }
            layerSelect.change(function (e) {
                var target = jQuery(e.target),
                    value = target.val();

                me.publishedmyplaces2Config.layer = value;
            });
            return layerSelect;
        },
        /**
         * Manages drawlayer change in drawlayerselection
         * @param addedDrawLayerId   drawlayer id
         */
        handleDrawLayerSelectionChanged: function (addedDrawLayerId) {
            this.publishedmyplaces2Config.layer = addedDrawLayerId;
            var layerSelect = this._updateDrawLayerSelection();
            jQuery('.publisher-select-layer').replaceWith(layerSelect);
        },
        /**
         * Add new draw layer button and its handler
         * @returns {Oskari.userinterface.component.Button}
         * @private
         */
        _getAddLayerButton: function () {
            var me = this,
                addLayerButton;

            addLayerButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addLayerButton.setTitle(me.__loc.layers.add);
            addLayerButton.setHandler(function () {
                // send OpenAddLayerDialogEvent
                var request = me.__sandbox.getRequestBuilder('MyPlaces.OpenAddLayerDialogRequest')('.publisher-select-layer', 'right');
                me.__sandbox.request(me.__instance, request);
            });
            return addLayerButton;
        },
        /**
         * Add select-draw-layer-to-mapselection button and its handler
         * @returns {Oskari.userinterface.component.Button}
         * @private
         */
        _getAddSelectLayerButton: function () {
            var me = this,
                addSelectLayerButton;

            addSelectLayerButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addSelectLayerButton.setTitle(this.__loc.layers.addselect);
            addSelectLayerButton.setHandler(function () {
                var request = me.__sandbox.getRequestBuilder('AddMapLayerRequest')(me.publishedmyplaces2Config.layer);
                me.__sandbox.request(me.__instance, request);
                // this intentionally refers to the current DOM element
                this.blur();
            });
            return addSelectLayerButton;
        },

        /**
         * Resets the local toolbarConfig and publishedmyplaces2Config to use the values from storedData,
         * which was passed in as a variable in getPanel.
         * All known configs are reset, unless specified as parameter.
         * Only the specified config is reset.
         *
         * @method _loadDataConfig
         * @param {String} configToLoad string identifying config to reset
         */
        _loadDataConfig: function (configToLoad) {
            var configName,
                me = this;

            // if editing a published view, then use the stored settings
            if (me._storedData) {
                configName = 'toolbarConfig';
                if (me._storedData.toolbarConfig &&
                    (!configToLoad || (configToLoad === configName))) {
                    me.toolbarConfig = _.cloneDeep(me._storedData.toolbarConfig);
                }

                configName = 'publishedmyplaces2Config';
                if (me._storedData.publishedmyplaces2Config &&
                    (!configToLoad || (configToLoad === configName))) {
                    me.publishedmyplaces2Config = _.cloneDeep(me._storedData.publishedmyplaces2Config);
                }
            }
        },
        _hasActiveTools: function () {
            var me = this;

            for (toolName in me.selectedTools) {
                if (me.selectedTools.hasOwnProperty(toolName) && me.selectedTools[toolName]) {
                    return true;
                }
            }

            return false;
        },

        _hasSelectedDrawTool: function () {
            var me = this;

            for (toolName in me.drawOptions) {
                if (me.drawOptions.hasOwnProperty(toolName) && me.drawOptions[toolName]) {
                    return true;
                }
            }

            return false;
        },

        stop: function() {
            var me = this,
                sandbox = me.__sandbox;

            if(me.__plugin) {
                //send remove request per active button
                for (toolName in me.selectedTools) {
                    if (me.selectedTools.hasOwnProperty(toolName) && toolName) {
                        me.__plugin.removeToolButton(toolName);
                    }
                }
                if(me.__sandbox){
                    me.__plugin.stopPlugin(me.__sandbox);
                }
                me.__mapmodule.unregisterPlugin(me.__plugin);
            }
        }

    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });