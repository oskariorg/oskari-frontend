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
            'toolbarConfig': {},
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
            'toolbarConfig': {
                'toolbarId': 'PublisherToolbar',
                'defaultToolbarContainer': '.publishedToolbarContent',
                'hasContentContainer': true,
                'classes': {}
            },
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
        init: function() {
            var me = this;
            me._storedData = {};//me.__instance.publisher.data || null;
            if (me.__instance.publisher.data) {
                var data = me.__instance.publisher.data;
                if (data && data.configuration && data.configuration.toolbar) {
                    me._storedData.toolbarConfig = _.cloneDeep(data.configuration.toolbar.conf);
                    if (me._hasActiveTools()) {
                        me.setEnabled(true);
                    }
                }
                if (data && data.configuration && data.configuration.publishedmyplaces2) {
                    me._storedData.publishedmyplaces2Config = _.cloneDeep(data.configuration.publishedmyplaces2.conf);
                    if (me._hasSelectedDrawTool()) {
                        me.setEnabled(true);
                    }
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
                config: {'toolbarId': 'PublisherToolbar'}
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
            if(me.state.enabled) {

                var retValue = {
                    configuration: {
                        mapfull: {
                            conf: {
                                plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                            }
                        }
                    }
                };
                if (me.toolbarConfig && !_.isEmpty(me.toolbarConfig)) {
                    retValue.configuration.toolbar = { conf : me.toolbarConfig };
                }
                if (me.publishedmyplaces2Config && me.publishedmyplaces2Config.layer) {
                    retValue.configuration.publishedmyplaces2 = { conf : me.publishedmyplaces2Config };
                }

                return retValue;
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

            var _toggleToolOption = function (toolName, groupName, toolOption, configName, cbox) {
                return function () {
                    var checkbox = cbox ? cbox : jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;

                    if (me._hasActiveTools() || me._hasSelectedDrawTool()) {
                        tool.selected = true;
                    } else {
                        tool.selected = false;
                    }

                    var requester = tool.__plugin;
                    if (isChecked) {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption));
                        if (!me[configName][groupName]) {
                            me[configName][groupName] = {};
                        }
                        me[configName][groupName][toolName] = true;

                        if (me.toolbarConfig[groupName] === null || me.toolbarConfig[groupName] === undefined) {
                            me.toolbarConfig[groupName] = {};
                        }
                        me.toolbarConfig[groupName][toolName] = true;
                    } else {
                        sandbox.postRequestByName(
                            'Toolbar.RemoveToolButtonRequest', [toolName, groupName, toolOption.toolbarid]);
                        if (me[configName][groupName]) {
                            me[configName][groupName][toolName] = false;
                        }
                        if (me.toolbarConfig[groupName] === null || me.toolbarConfig[groupName] === undefined) {
                            me.toolbarConfig[groupName] = {};
                        }
                        me.toolbarConfig[groupName][toolName] = false;
                    }
                };
            };

            var options,
                i,
                ilen,
                configName,
                buttonGroup,
                toolName,
                toolButton,
                isChecked;
            if (enabled) {
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (_.isEmpty(me.toolbarConfig)) {
                    me._presetDataConfig('toolbarConfig');
                }
                tool.__plugin.setToolbarContainer();
                me.toolbarConfig.classes = tool.__plugin.getToolConfs();

                var _addToolGroup = function (groupName, options, toolOption) {
                    var i,
                        ilen,
                        buttonGroup,
                        toolName,
                        toolButton,
                        toolElement;

                    // retrieve groupName button configs
                    for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                        if (groupName === me.buttonGroups[i].name) {
                            buttonGroup = me.buttonGroups[i];
                            break;
                        }
                    }

                    for (toolName in buttonGroup.buttons) {
                        if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                            toolButton = buttonGroup.buttons[toolName];
                            toolButton.toolbarid = toolOption.toolbarId;

                            // create checkbox
                            toolButton.selectTool = jQuery(me.templates.toolOption).clone();
                            toolButton.selectTool.find('label')
                                .attr('for', 'tool-opt-' + toolName).append(me.__loc.toolbarToolNames[toolName]);

                            if (!me.toolbarConfig[groupName]) {
                                toolButton.selectTool.find('input').attr('checked', 'checked');
                            } else if (me.toolbarConfig[groupName] && me.toolbarConfig[groupName][toolName] === undefined) {
                                toolButton.selectTool.find('input').attr('checked', 'checked');
                            } else if (me.toolbarConfig[groupName][toolName]) {
                                toolButton.selectTool.find('input').attr('checked', 'checked');
                            }

                            _toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig', toolButton.selectTool.find('input'))();

                            //toggle toolbar tool. i.e. send requests
                            toolElement = toolButton.selectTool.find('input')
                                .attr('id', 'tool-opt-' + toolName)
                                .change(_toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig'));
                            options.append(toolButton.selectTool);
                            // trigger click & change to send events
                            if (me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName]) {
                                // FIXME use _toggleToolOption.apply or .call instead of passing the checkbox as an extra arg...
                                _toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig', toolButton.selectTool.find('input'))();
                            }
                        }
                    }

                    return options;
                };

                // append after all buttons have been added
                options = jQuery(me.templates.toolOptions).clone();
                options = _addToolGroup('history', options, me.toolbarConfig, _toggleToolOption);
                options = _addToolGroup('basictools', options, me.toolbarConfig, _toggleToolOption);
                tool.toolContainer.find(".extraOptions").append(options);

                // show for admin users
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

            } else {
                // toolbar (bundle) needs to be notified

                //the following block probably has never worked properly if toolbarconfig has been reset here...?
//                if (!localeChange) {
//                    me.toolbarConfig = {};
//                }

                // remove buttons, handlers and toolbar toolbar tools
                for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                    buttonGroup = me.buttonGroups[i];
                    for (toolName in buttonGroup.buttons) {
                        if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                            configName = (buttonGroup.name === 'myplaces' ? 'publishedmyplaces2Config' : 'toolbarConfig');
                            if (me[configName] && me[configName][buttonGroup.name] && me[configName][buttonGroup.name][toolName] === true) {
                                // toolbar tool exists and needs to be removed
                                toolButton = buttonGroup.buttons[toolName];
                                sandbox.postRequestByName(
                                    'Toolbar.RemoveToolButtonRequest', [toolName, buttonGroup.name, toolButton.toolbarid]);
                            }
                        }
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
            var i,
                ilen,
                buttonGroup,
                toolName,
                me = this;

            if (!me.toolbarConfig.toolbarId) {
                me.toolbarConfig = _.cloneDeep(me._storedData.toolbarConfig);
            }

            for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                buttonGroup = me.buttonGroups[i];
                for (toolName in buttonGroup.buttons) {
                    if (me.toolbarConfig && me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName] === true) {
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
        }

    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });