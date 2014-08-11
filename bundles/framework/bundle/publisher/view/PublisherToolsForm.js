/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLocationForm
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherToolsForm',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
     *       publisher reference for language change
     * @param {Object} enabledPlugins
     *       map of enabled plugins, pass a null or undefined to use defaults
     */

    function(publisher, enabledPlugins) {
        this.instance = publisher.instance;
        this.loc = publisher.loc;
        this._publisher = publisher;
        this._sandbox = null;

        //user's own layers (not id's)
        this.myplaces = [];

        // defaultStateConfigs stores the default state values, which is used when reset configs
        this.defaultStateConfigs = {
            'toolbarConfig' : {},
            'publishedmyplaces2Config' : {
                'toolbarId': 'PublisherToolbar',
                'layer': null,
                'myplaces' : {
                    'point': false, 
                    'line': false, 
                    'area': false
                }
            }
        };

        // presetStateConfigs stores the preselected values which are different from the default values
        this.presetStateConfigs = {
            'toolbarConfig' : {
                'toolbarId': 'PublisherToolbar',
                'defaultToolbarContainer': '.publishedToolbarContent',
                'hasContentContainer': true,
                'classes': {}
            },
            'publishedmyplaces2Config' : {
                'toolbarId': 'PublisherToolbar',
                'layer': null, // cannot be selected in advance, so it is selected in _updateDrawLayerSelection
                'myplaces' : {
                    'point': true, 
                    'line': true, 
                    'area': true
                }
            }
        };
        // toolbarConfig stores the current state
        this.toolbarConfig = {};
        // publishedmyplaces2Config stores the current state
        this.publishedmyplaces2Config = undefined;

        // config to plugin tool mapping
        this.configPlugin = {
            'toolbarConfig': "Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin"
        };

        /**
         * @property tools
         */
        this.tools = this.instance.conf.tools || [{
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin",
            "selected": false,
            "lefthanded": "bottom left",
            "righthanded": "bottom right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "bottom left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin",
            "selected": false,
            "lefthanded": "bottom right",
            "righthanded": "bottom left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "bottom right"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons",
            "selected": false,
            "lefthanded": "top left",
            "righthanded": "top right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar",
            "selected": true,
            "lefthanded": "top left",
            "righthanded": "top right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin",
            "selected": false,
            "lefthanded": "top right",
            "righthanded": "top left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top right"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin",
            "selected": false,
            "lefthanded": "top right",
            "righthanded": "top left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top right"
                },
                "toolbarId": "PublisherToolbar"
            }
        }, {
            "id": "Oskari.mapframework.mapmodule.ControlsPlugin",
            "selected": true
        }, {
            "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
            "selected": true,
            "config": {
                "ignoredLayerTypes": ["WFS"],
                "infoBox": false
            }
        }];
        // set enabled plugins if available
        if (enabledPlugins) {
            var i,
                len,
                tool;
            for (i = 0, len = this.tools.length; i < len; i++) {
                tool = this.tools[i];
                tool.selected = !! enabledPlugins[tool.id];
            }
        }

        this.buttonGroups = [{
            'name': 'history',
            'buttons': {
                'history_back': {
                    iconCls: 'tool-history-back-dark',
                    prepend: true,
                    disabled: true,
                    callback: function() {}
                },
                'history_forward': {
                    iconCls: 'tool-history-forward-dark',
                    disabled: true,
                    callback: function() {}
                }
            }
        }, {
            'name': 'basictools',
            'buttons': {
                'measureline': {
                    iconCls: 'tool-measure-line-dark',
                    disabled: true,
                    sticky: true,
                    callback: function() {}
                },
                'measurearea': {
                    iconCls: 'tool-measure-area-dark',
                    disabled: true,
                    sticky: true,
                    callback: function() {}
                }
            }
        }, {
            'name': 'myplaces',
            'buttons': {
                'point': {
                    iconCls: 'myplaces-draw-point',
                    disabled: true,
                    sticky: true,
                    callback: function() {}
                },
                'line': {
                    iconCls: 'myplaces-draw-line',
                    disabled: true,
                    sticky: true,
                    callback: function() {}
                },
                'area': {
                    iconCls: 'myplaces-draw-area',
                    disabled: true,
                    sticky: true,
                    callback: function() {}
                }

            }
        }];

        this.templates = {
            'help': '<div class="help icon-info"></div>',
            'tool': '<div class="tool "><label>' + '<input type="checkbox"/>' + '</label></div>',
            'toolOptions': '<div class="tool-options"></div>',
            'toolOption': '<div class="tool-option"><label><input type="checkbox" /></label></div>',
            'toolOptionSettings': '<div class="tool-option-settings"></div>',
            'toolOptionSetting': '<div class="tool-option-setting"></div>',
            'toolOptionSettingInput': '<label><input type="checkbox" /></label>',
            'layerSelect': '<select class="publisher-select-layer"></select>',
            'layerSelectOption': '<option></option>'
        };
    }, {
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc.
         *
         * @method init
         */
        init: function() {
            var me = this,
                sandbox = me._publisher.instance.getSandbox();
            me._sandbox = sandbox;
        },
        getTools: function() {
            return this.tools;
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function(data) {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.tools.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = jQuery(me.templates.help).clone(),
                i,
                toolContainer,
                pluginKey,
                toolname,
                classes;

            tooltipCont.attr('title', this.loc.tools.tooltip);
            contentPanel.append(tooltipCont);

            // content
            var closureMagic = function(tool) {
                return function() {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked');
                    tool.selected = isChecked;
                    me.activatePreviewPlugin(tool, isChecked);
                };
            };

            // helper map so we can get tool by id...
            me._toolIndices = {};
            me._storedData = data;
            me._loadDataConfig();

            for (i = 0; i < this.tools.length; i += 1) {
                toolContainer = jQuery(this.templates.tool).clone();
                var tool = this.tools[i];
                pluginKey = tool.id;
                me._toolIndices[pluginKey] = i;
                pluginKey = pluginKey.substring(pluginKey.lastIndexOf('.') + 1);
                toolname = this.loc.tools[pluginKey];
                toolContainer.find('label').attr('for', 'tool-' + pluginKey).append(toolname);
                if (tool.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                tool.publisherPluginContainer = toolContainer;
                contentPanel.append(toolContainer);

                if (me._storedData) {
                    classes = this._publisher._getInitialPluginLocation(me._storedData, this.tools[i].id);
                    if (classes) {
                        this.tools[i].config.location.classes = classes;
                    }
                }

                toolContainer.find('input').attr('id', 'tool-' + pluginKey).change(closureMagic(tool));
            }

            // Check if selected layers include wfs layers
            var wfs = false,
                layers = this._sandbox.findAllSelectedMapLayers(),
                j;
            for (j = 0; j < layers.length; ++j) {
                if (layers[j].hasFeatureData()) {
                    wfs = true;
                    break;
                }
            }
            if (wfs) {
                var featureData = this._sandbox.findRegisteredModuleInstance("FeatureData2");
                if (typeof featureData !== "undefined") {
                    var featureDataSelected = false;
                    if (me._storedData && me._storedData.state && me._storedData.state.featuredata2) {
                        featureDataSelected = true;
                    }
                    var featuredataBundle =  {
                        "id": "Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin",
                        "selected": featureDataSelected,
                        "config": {
                            "instance": featureData
                        }
                    };
                    this.featuredataBundle = featuredataBundle;
                    toolContainer = jQuery(this.templates.tool).clone();
                    pluginKey = featuredataBundle.id;
                    me._toolIndices[pluginKey] = i;
                    pluginKey = pluginKey.substring(pluginKey.lastIndexOf('.') + 1);
                    toolname = this.loc.tools[pluginKey];
                    toolContainer.find('label').attr('for', 'tool-' + pluginKey).append(toolname);
                    if (featuredataBundle.selected) {
                        toolContainer.find('input').attr('checked', 'checked');
                    }
                    featuredataBundle.publisherPluginContainer = toolContainer;
                    contentPanel.append(toolContainer);

                    if (me._storedData) {
                        classes = this._publisher._getInitialPluginLocation(me._storedData, featuredataBundle.id);
                        if (classes) {
                            featuredataBundle.config.location.classes = classes;
                        }
                    }
                    toolContainer
                        .find('input').attr('id', 'tool-' + pluginKey)
                        .change(closureMagic(featuredataBundle));
                }
            }
            return panel;
        },

        getFeatureDataPlugin: function() {
            return this.featuredataBundle;
        },

        getToolById: function(id) {
            var idx = this._toolIndices[id],
                ret = null;
            if (idx !== null && idx !== undefined) {
                ret = this.tools[idx];
            }
            return ret;
        },

        /**
         * Adds the selections the user has done with the form inputs.
         * @method addValues
         * @param selections object in which additions are made
         * @return {Object}
         */
        addValues: function(selections) {
            var me = this,
                toolbarConfig = me.toolbarConfig,
                selectedLayers = me._sandbox.findAllSelectedMapLayers(),
                i,
                j,
                tmpTool;

            // get toolbar config
            // inactive buttons don't have to be sent
            // if there's no active buttons, don't send toolbar config at all
            if (toolbarConfig) {
                if (me._hasActiveTools()) {
                    selections.toolbar = toolbarConfig;
                }

                if (me._hasSelectedDrawTool()) {
                    selections.publishedmyplaces2 = me.publishedmyplaces2Config;
                    selections.toolbar = toolbarConfig;
                    selections.toolbar.myplaces = _.cloneDeep(me.publishedmyplaces2Config.myplaces);
                }
            }

            for (i = 0; i < me.tools.length; i += 1) {
                if (me.tools[i].selected) {
                    tmpTool = {
                        id: me.tools[i].id
                    };
                    if (me.tools[i].config) {
                        tmpTool.config = me.tools[i].config;
                        if (tmpTool.config.location) {
                            if (tmpTool.config.location.classes) {
                                var classes = tmpTool.config.location.classes;
                                tmpTool.config.location = {
                                    "classes": classes
                                };
                            } else {
                                tmpTool.config.location = {};
                            }
                        }
                    }
                    selections.plugins.push(tmpTool);
                }
            }
            return selections;
        },

        /**
         * Returns any errors found in validation or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function() {
            var errors = [];
            return errors;
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
        _loadDataConfig: function(configToLoad) {
            var configName,
                me = this;

            me._resetDataConfig();
            // if editing a published view, then use the stored settings
            if (me._storedData && me._storedData.state) {

                configName = 'toolbarConfig';
                if (me._storedData.state.toolbar &&
                    me._storedData.state.toolbar.config &&
                    (!configToLoad || (configToLoad === configName))) {
                    me.toolbarConfig = _.cloneDeep(me._storedData.state.toolbar.config);
                }

                configName = 'publishedmyplaces2Config';
                if (me._storedData.state.publishedmyplaces2 &&
                    me._storedData.state.publishedmyplaces2.config &&
                    (!configToLoad || (configToLoad === configName))) {
                    me.publishedmyplaces2Config = _.cloneDeep(me._storedData.state.publishedmyplaces2.config);
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
        _resetDataConfig: function(configToReset) {
            var me = this,
                config;

            if (me.defaultStateConfigs[configToReset]) {
                me[configToReset] = _.cloneDeep(me.defaultStateConfigs[configToReset]);
            } else {
                for (config in me.defaultStateConfigs) {
                    me[config] = _.cloneDeep(me.defaultStateConfigs[config]);
                }
            }
        },

        /**
         * Preselects the local publishedmyplaces2Config to use the values from presetStateConfigs.
         * All known configs are preselected, unless specified as parameter.
         * Only the specified config is preselected.
         *
         * @method _presetDataConfig
         * @param {String} configToPreselect string identifying config to preselect
         */
        _presetDataConfig: function(configToPreselect) {
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
         * @method activatePreviewPlugin
         * @private
         * Enables or disables a plugin on map
         * @param {Object} tool tool definition as in #tools property
         * @param {Boolean} enabled, true to enable plugin, false to disable
         */
        activatePreviewPlugin: function(tool, enabled) {
            var me = this,
                sandbox = me._sandbox;

            if (tool && !tool.plugin && enabled) {
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                tool.plugin = Oskari.clazz.create(tool.id, tool.config);
                mapModule.registerPlugin(tool.plugin);
            }
            if (!tool || !tool.plugin) {
                // no tool or plugin not created -> nothing to do
                return;
            }
            if (tool.config && tool.config.location) {
                tool.plugin.setLocation(this._publisher._getPreferredPluginLocation(tool.plugin, tool.config.location.classes));
            }

            var _toggleToolOption = function(toolName, groupName, toolOption, configName, cbox) {
                return function() {
                    var checkbox = cbox ? cbox : jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;

                    if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                        // toolbarplugin is selected when active tools or has selected draw tools
                        if (me._hasActiveTools() || me._hasSelectedDrawTool()) {
                            tool.selected = true;
                        } else {
                            tool.selected = false;
                        }
                    } else {
                        // tool refers to the plugin in the me.tools array
                        tool.selected = isChecked;
                    }

                    var requester = tool.plugin;
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
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption.toolbarid));
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
                j,
                jlen,
                configName,
                groupName,
                buttonGroup,
                toolName,
                toolButton,
                reqBuilder,
                isChecked;

            if (enabled) {
                tool.plugin.startPlugin(sandbox);
                if (me._publisher.toolLayoutEditMode && tool.plugin.element) {
                    me._publisher._makeDraggable(tool.plugin.element);
                }
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {

                    if (_.isEmpty(me.toolbarConfig)) {
                        me._presetDataConfig('toolbarConfig');
                    }

                    tool.plugin.setToolbarContainer();
                    me.toolbarConfig.classes = tool.plugin.getToolConfs();
                    var _addToolGroup = function(groupName, options, toolOption, toggleToolHandler) {
                        var i,
                            ilen,
                            buttonGroup,
                            toolName,
                            toolButton,
                            toolElement,
                            reqBuilder;

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
                                    .attr('for', 'tool-opt-' + toolName).append(me.loc.toolbarToolNames[toolName]);
                                if (me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName]) {
                                    toolButton.selectTool.find('input').attr('checked', 'checked');
                                }
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
                    tool.publisherPluginContainer.append(options);

                    // show for admin users
                    if (me._sandbox.getUser().hasRole(me.instance.conf.drawRoleIds)) {
                        // create option for adding drawing tools
                        options = jQuery(me.templates.toolOptions).clone();
                        tool.publisherPluginContainer.append(options);

                        isChecked = me._hasSelectedDrawTool();

                        var selectTool = jQuery(me.templates.toolOption).clone();
                        selectTool.find('label').attr('for', 'tool-opt-drawing').append(this.loc.toolbarToolNames.drawTools);
                        //toggle toolbar tool. i.e. send requests
                        toolElement = selectTool.find('input')
                            .attr('id', 'tool-opt-drawing')
                            .attr('checked', isChecked)
                            .change(function() {
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
                }
            } else {
                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {};
                    // remove buttons, handlers and toolbar toolbar tools
                    for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                        buttonGroup = me.buttonGroups[i];
                        for (toolName in buttonGroup.buttons) {
                            configName = (buttonGroup.name === "myplaces" ? 'publishedmyplaces2Config' : 'toolbarConfig');
                            if (me[configName] && me[configName][buttonGroup.name] && me[configName][buttonGroup.name][toolName] === true) {
                                // toolbar tool exists and needs to be removed
                                toolButton = buttonGroup.buttons[toolName];
                                reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                                sandbox.request(me.instance, reqBuilder(toolName, buttonGroup.name, toolButton.toolbarid));
                            }
                        }
                    }
                }
                if (tool._isPluginStarted) {
                    //remove eventlisteners
                    var _removeOptions = function (className, handler) {
                        var optionContainer = tool.publisherPluginContainer.find(className),
                            toolOptionCheckboxes = optionContainer.find('input').off("change", handler);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    };
                    _removeOptions('.tool-options', me._toggleToolOption);
                    _removeOptions('.tool-option-setting', me._toggleToolOption);

                    tool._isPluginStarted = false;
                    tool.plugin.stopPlugin(sandbox);
                }
            }
        },

        _toggleDrawTools: function(element, toolName, groupName, toolOption, toggleToolHandler) {
            var me = this,
                button,
                buttonGroup,
                i,
                ilen,
                options,
                toolElement,
                addLayerButton,
                addSelectLayerButton,
                layerSelect,
                optionSettings,
                optionSetting,
                checkbox = jQuery(element),
                isChecked = checkbox.is(':checked'),
                isToolChecked,
                reqBuilder,
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
                optionSetting.append('<span>' + me.loc.tools.selectDrawLayer + '</span><br/>');
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
                            .attr('for', 'option-' + toolName).append(this.loc.toolbarToolNames[toolName]);

                        //toggle toolbar tool. i.e. send requests
                        toolElement = toolButton.toolOption.find('input')
                            .attr('id', 'option-' + toolName)
                            .attr('checked', isToolChecked)
                            .change(toggleToolHandler(toolName, buttonGroup.name, toolButton, 'publishedmyplaces2Config'));
                        optionSettings.append(toolButton.toolOption);

                        // execute toolElement change function when checked
                        if (isToolChecked) {
                            request = me._sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest')(toolName, buttonGroup.name, toolButton);
                            me._sandbox.request(me.instance, request);
                        } else {
                            request = me._sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, buttonGroup.name, toolButton.toolbarid);
                            me._sandbox.request(me.instance, request);
                        }

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
                        request = me._sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest')(toolName, buttonGroup.name, toolButton.toolbarid);
                        me._sandbox.request(me.instance, request);
                    }
                }

                toolElement.find('.tool-option-settings').remove();
                toolElement = null;
            }
        },

        handleDrawLayerSelectionChanged: function (addedDrawLayerId) {
            this.publishedmyplaces2Config.layer = addedDrawLayerId;
            var layerSelect = this._updateDrawLayerSelection();
            jQuery(".publisher-select-layer").replaceWith(layerSelect);
        },

        _updateDrawLayerSelection: function () {
            var me = this,
                layerSelect = jQuery(me.templates.layerSelect).clone(),
                layerSelectOption,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService'),
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
            layerSelect.change(function(e) {
                var target = jQuery(e.target),
                    value = target.val(),
                    i;
                me.publishedmyplaces2Config.layer = value;
            });
            return layerSelect;
        },

        _getAddLayerButton: function () {
            var me = this,
                addLayerButton;

            addLayerButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            // TODO I18N
            addLayerButton.setTitle(this.loc.layers.add);
            addLayerButton.setHandler(function () {
                // send OpenAddLayerDialogEvent
                var request = me._sandbox.getRequestBuilder('MyPlaces.OpenAddLayerDialogRequest')('.publisher-select-layer', 'right');
                me._sandbox.request(me.instance, request);
            });
            return addLayerButton;
        },

        _getAddSelectLayerButton: function () {
            var me = this,
                addSelectLayerButton;

            addSelectLayerButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            // TODO I18N
            addSelectLayerButton.setTitle(this.loc.layers.addselect);
            addSelectLayerButton.setHandler(function (event) {
                var request = me._sandbox.getRequestBuilder('AddMapLayerRequest')(me.publishedmyplaces2Config.layer, false);
                me._sandbox.request(me.instance, request);
                // this intentionally refers to the current DOM element
                this.blur();
            });
            return addSelectLayerButton;
        },

        _hasActiveTools: function() {
            var i,
                ilen,
                buttonGroup,
                toolName,
                me = this;

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

        _hasSelectedDrawTool: function() {
            var buttons = this.publishedmyplaces2Config.myplaces;
            for (var tool in buttons) {
                if (buttons[tool] === true) {
                    return true;
                }
            }
            return false;
        },

        activateFeatureDataPlugin: function(activate) {
            if (this.hasFeatureDataBundle()) {
                var featureData = this.getFeatureDataPlugin();

                this.activatePreviewPlugin(featureData, activate);

                if (!activate && featureData.plugin) {
                    featureData.plugin = undefined;
                    delete featureData.plugin;
                }
            }
        },

        hasFeatureDataBundle: function() {
            if (this.featuredataBundle) {
                return this.featuredataBundle.selected;
            }
            return false;
        }
    });
