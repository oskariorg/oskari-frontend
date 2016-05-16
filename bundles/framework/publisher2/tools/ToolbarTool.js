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
                    'line': false,
                    'area': false
                }
            }
        },

        // presetStateConfigs stores the preselected values which are different from the default values
        presetStateConfigs: {
            'publishedmyplaces2Config': {
                'toolbarId': 'PublisherToolbar',
                'layer': null, // cannot be selected in advance, so it is selected in _updateDrawLayerSelection
                'myplaces': {
                    'point': true,
                    'line': true,
                    'area': true
                }
            }
        },
        // toolbarConfig stores the current state
        toolbarConfig: {},
        // publishedmyplaces2Config stores the current state
        publishedmyplaces2Config: undefined,

        /*

        buttonGroups: [{
            'name': 'history',
            'buttons': {
                'history_back': {
                    iconCls: 'tool-history-back-dark',
                    prepend: true,
                    disabled: true,
                    callback: function () {
                    }
                },
                'history_forward': {
                    iconCls: 'tool-history-forward-dark',
                    disabled: true,
                    callback: function () {
                    }
                }
            }
        }, {
            'name': 'basictools',
            'buttons': {
                'measureline': {
                    iconCls: 'tool-measure-line-dark',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                },
                'measurearea': {
                    iconCls: 'tool-measure-area-dark',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                }
            }
        }, {
            'name': 'myplaces',
            'buttons': {
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

            }
        }],
        */
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
            me.selectedOptions = {};
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
            me.selectedOptions = {
                history_back : true,
                history_forward : true,
                measureline : true,
                measurearea : true
            };

            if(pluginConf.buttons) {
                //if there are no selected tools in configuration, select them all when tools are selected
                for (toolName in me.selectedOptions) {
                    if (me.selectedOptions.hasOwnProperty(toolName)) {
                        if (pluginConf.buttons.indexOf(toolName) === -1) {
                            me.selectedOptions[toolName] = false;
                        }
                    }
                }
            }

            // TODO: myplaces stuff
            var configurableOptions = {

            };
            // previous myplaces
            if (data.configuration.publishedmyplaces2) {
                me._storedData.publishedmyplaces2Config = _.cloneDeep(conf.publishedmyplaces2.conf);
                if (me._hasSelectedDrawTool()) {
                    me.setEnabled(true);
                }
            }
            //TODO: there shouldn't be a toolbar in the config at all when there wasn't one when we were saving.
            //this is what screws up toggling on the default buttons on the toolbar, when modifying a published map that didn't have
            //toolbar in the first place
            
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

            for (toolName in me.selectedOptions) {
                if (me.selectedOptions.hasOwnProperty(toolName)) {
                    if (me.selectedOptions[toolName]) {
                        buttons.push(toolName);
                    }
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
            if (me.publishedmyplaces2Config && me.publishedmyplaces2Config.layer) {
                retValue.configuration.publishedmyplaces2 = { conf : me.publishedmyplaces2Config };
            }
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
                    var toolState = me.selectedOptions[toolName];

                    // if tool was selected, unselect tool and send removeToolButtonRequest
                    if (toolState) {
                        me.selectedOptions[toolName] = false;
                        tool.__plugin.removeToolButton(toolName);
                    } else {
                        me.selectedOptions[toolName] = true;
                        tool.__plugin.addToolButton(toolName);
                    }
                };
            };

            var options,
                i,
                ilen,
                toolName,
                isChecked;
            if (enabled) {
                //it might be that a light scheme has been selected prior to adding this tool on the map.
                //And since no event gets sent in that occasion, we gotta sniff it out manually when enabling the tool to get the toolbar buttons' styling correct
                me.updateToolbarButtonStyles();

                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (_.isEmpty(me.toolbarConfig)) {
                    me._presetDataConfig('toolbarConfig');
                }

                options = jQuery(me.templates.toolOptions).clone();

                for (toolName in me.selectedOptions) {
                    if (me.selectedOptions.hasOwnProperty(toolName)) {
                        //toolButton = me.selectedOptions[toolName];
                        // create checkbox
                        var selectTool = jQuery(me.templates.toolOption).clone();
                        selectTool.find('label')
                            .attr('for', 'tool-opt-' + toolName).append(me.__loc.toolbarToolNames[toolName]);

                        //set selected values checked
                        if (me.selectedOptions[toolName]) {
                            selectTool.find('input').attr('checked', 'checked');
                            tool.__plugin.addToolButton(toolName);
                        }

                        //add button to div
                        options.append(selectTool);

                        //toggle tool
                        selectTool.find('input').attr('id', 'tool-opt-' + toolName).change(_toggleToolOption(toolName));
                    }
                }

                tool.toolContainer.find(".extraOptions").append(options);


                // show for admin users
                //TODO: drawTools handling is not yet ready
                /*
                if (sandbox.getUser().hasRole(me.__instance.conf.drawRoleIds)) {
                    // create option for adding drawing tools
                    options = jQuery(me.templates.toolOptions).clone();
                    tool.toolContainer.find(".extraOptions").append(options);

                    isChecked = me._hasSelectedDrawTool();

                    var selectTool = jQuery(me.templates.toolOption).clone(),
                        toolElement;
                    selectTool.find('label').attr('for', 'tool-opt-drawing').append(this.__loc.toolbarToolNames.drawTools);
                    //toggle toolbar tool. i.e. send requests
                    toolElement = selectTool.find('input')
                        .attr('id', 'tool-opt-drawing')
                        .attr('checked', isChecked)
                        .change(function () {
                            // update local config according to ui config change
                            if (this.checked) {
                                me._presetDataConfig('publishedmyplaces2Config');
                            } else {
                                me._resetDataConfig('publishedmyplaces2Config');
                            }
                            // Note! "this" refers to the checkbox element that has been changed
                            me._toggleDrawTools(this, 'drawTools', 'myplaces', me.publishedmyplaces2Config, _toggleToolOption);
                        });

                    // execute toolElement change function when checked
                    if (isChecked) {
                        me._toggleDrawTools(toolElement, 'drawTools', 'myplaces', me.publishedmyplaces2Config, _toggleToolOption);
                    }
                    options.append(selectTool);
                }
                */

            } else {
                // remove buttons, handlers and toolbar toolbar tools
                for (toolName in me.selectedOptions) {
                    if (me.selectedOptions.hasOwnProperty(toolName)) {
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
        /**
         * Make sure that the toolbar buttons have the correct dark/light - setting as their iconCls...
         */
        updateToolbarButtonStyles: function() {
            var me = this,
                style = me.__mapmodule.getToolStyle(),
                suffix = (style && style.length > 0 && style.indexOf('light') > -1) ? 'light' : 'dark';
            if (!style || !style.length) {
                return;
            }

            for (var i = 0; i < me.buttonGroups.length; i++) {
                for (var buttonKey in me.buttonGroups[i].buttons) {
                    var button = me.buttonGroups[i].buttons[buttonKey];
                    button.iconCls = button.iconCls.replace('dark','');
                    button.iconCls = button.iconCls.replace('light','');
                    button.iconCls += suffix;
                }
            }

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
        _toggleDrawTools: function (element, toolName, groupName, toolOption, toggleToolHandler) {
            var me = this,
                buttonGroup,
                toolButton,
                i,
                ilen,
                toolElement,
                addLayerButton,
                addSelectLayerButton,
                layerSelect,
                optionSettings,
                optionSetting,
                checkbox = jQuery(element),
                isChecked = checkbox.is(':checked'),
                isToolChecked,
                request;

            // retrieve myplaces button configs
            for (i = 0, ilen = this.buttonGroups.length; i < ilen; i++) {
                if (groupName === this.buttonGroups[i].name) {
                    buttonGroup = this.buttonGroups[i];
                    break;
                }
            }

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
                for (toolName in buttonGroup.buttons) {
                    if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                        toolButton = buttonGroup.buttons[toolName];
                        toolButton.toolbarid = toolOption.toolbarId;

                        isToolChecked = me.publishedmyplaces2Config[buttonGroup.name] && me.publishedmyplaces2Config[buttonGroup.name][toolName];

                        // create checkbox
                        toolButton.toolOption = jQuery(me.templates.toolOptionSetting).clone();
                        toolButton.toolOption.append(jQuery(me.templates.toolOptionSettingInput).clone());
                        toolButton.toolOption.find('label')
                            .attr('for', 'option-' + toolName).append(this.__loc.toolbarToolNames[toolName]);

                        //toggle toolbar tool. i.e. send requests
                        toolElement = toolButton.toolOption.find('input')
                            .attr('id', 'option-' + toolName)
                            .attr('checked', isToolChecked)
                            .change(toggleToolHandler(toolName, buttonGroup.name, toolButton, 'publishedmyplaces2Config'));
                        optionSettings.append(toolButton.toolOption);

                        // execute toolElement change function when checked
                        me._toggleToolButton(isToolChecked, toolName, buttonGroup, toolButton);
                    }
                }
                //add different settings
                checkbox.parent().parent()
                    .append(optionSettings);
            } else {
                toolElement = checkbox.parent().parent();

                for (toolName in buttonGroup.buttons) {
                    if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                        toolButton = buttonGroup.buttons[toolName];
                        toolButton.toolbarid = toolOption.toolbarId;

                        // remove toolbutton from toolbar
                        request = me.__sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, buttonGroup.name, toolButton.toolbarid);
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
        _toggleToolButton: function(isToolChecked, toolName, buttonGroup, toolButton){
            var me = this;
            if (isToolChecked) {
                request = me.__sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest')(toolName, buttonGroup.name, toolButton);
                me.__sandbox.request(me.__instance, request);
            } else {
                request = me.__sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, buttonGroup.name, toolButton.toolbarid);
                me.__sandbox.request(me.__instance, request);
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
            addSelectLayerButton.setHandler(function (event) {
                var request = me.__sandbox.getRequestBuilder('AddMapLayerRequest')(me.publishedmyplaces2Config.layer, false);
                me.__sandbox.request(me.__instance, request);
                // this intentionally refers to the current DOM element
                this.blur();
            });
            return addSelectLayerButton;
        },

        /**
         * Preselects the local publishedmyplaces2Config to use the values from presetStateConfigs.
         * All known configs are preselected, unless specified as parameter.
         * Only the specified config is preselected.
         *
         * @method _presetDataConfig
         * @param {String} configToPreselect string identifying config to preselect
         */
        _presetDataConfig: function (configToPreselect) {
            var me = this,
                config;

            if (me.presetStateConfigs[configToPreselect]) {
                me[configToPreselect] = _.cloneDeep(me.presetStateConfigs[configToPreselect]);
            } else {
                for (config in me.presetStateConfigs) {
                    me[config] = _.cloneDeep(me.presetStateConfigs[config]);
                }
            }
        },
        /**
         * Resets the local toolbarConfig and publishedmyplaces2Config to use the values from defaultStateConfigs and replaced by storedData,
         * which was passed in as a variable in getPanel.
         * All known configs are reset, unless specified as parameter.
         * Only the specified config is reset.
         *
         * @method _resetDataConfig
         * @param {String} configToReset string identifying config to reset
         */
        _resetDataConfig: function (configToReset) {
            var me = this,
                config;

            if (me.defaultStateConfigs[configToReset]) {
                me[configToReset] = _.cloneDeep(me.defaultStateConfigs[configToReset]);
            } else {
                for (config in me.defaultStateConfigs) {
                    if(me.defaultStateConfigs.hasOwnProperty(config)) {
                        me[config] = _.cloneDeep(me.defaultStateConfigs[config]);
                    }
                }
            }
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

            me._resetDataConfig();
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

            for (toolName in me.selectedOptions) {
                if (me.selectedOptions.hasOwnProperty(toolName)) {
                    if (me.selectedOptions[toolName]) {
                        return true;
                    }
                }
            }

            return false;
        },

        _hasSelectedDrawTool: function () {
            var me = this,
                buttons = me.publishedmyplaces2Config.myplaces;
            for (var tool in buttons) {
                if (buttons[tool] === true) {
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
                for (toolName in me.selectedOptions) {
                    if (me.selectedOptions.hasOwnProperty(toolName)) {
                        if (toolName) {
                            me.__plugin.removeToolButton(toolName);
                        }
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