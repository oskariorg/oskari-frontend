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
        this.selectedDrawingLayer = {
            'layer': null,
            'myplaces' : {
                'point': false, 
                'line': false, 
                'area': false
            }
        };

        /**
         * @property tools
         */
        this.tools = [{
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
                tool;
            for (i = 0; i < this.tools.length; i++) {
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
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function(pData) {
            var me = this,
                sandbox = me._publisher.instance.getSandbox(),
                mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                myplaces = mapLayerService.getLayersOfType('myplaces');

            me.myplaces = myplaces;
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
                toolname;

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

                if (data) {
                    var classes = this._publisher._getInitialPluginLocation(data, this.tools[i].id);
                    if (classes) {
                        this.tools[i].config.location.classes = classes;
                    }
                }

                toolContainer.find('input').attr('id', 'tool-' + pluginKey).change(closureMagic(tool));
            }

            // Feature data
            var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');

            // Check if selected layers include wfs layers
            var wfs = false;
            var layers = this._sandbox.findAllSelectedMapLayers();
            for (var j = 0; j < layers.length; ++j) {
                if (layers[j].hasFeatureData()) {
                    wfs = true;
                    break;
                }
            }
            if (wfs) {
                var featureData = this._sandbox.findRegisteredModuleInstance("FeatureData2");
                if (typeof featureData !== "undefined") {
                    var featureDataSelected = false;
                    if (data && data.state && data.state.featuredata2) {
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

                    if (data) {
                        var classes = this._publisher._getInitialPluginLocation(data, featuredataBundle.id);
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
                var hasActiveTools = false;
                for (i in toolbarConfig) {
                    if (toolbarConfig.hasOwnProperty(i)) {
                        for (j in toolbarConfig[i]) {
                            if (toolbarConfig[i].hasOwnProperty(j) && toolbarConfig[i][j]) {
                                hasActiveTools = true;
                                break;
                            }
                        }
                        if (hasActiveTools) {
                            break;
                        }
                    }
                }
                if (hasActiveTools) {
                    selections.toolbar = toolbarConfig;
                }

                if (me._hasSelectedDrawTool()) {

                    var alreadySelected = false;
                    for (i = 0; i < selectedLayers.length; i++) {
                        if (selectedLayers[i].getId() === me.selectedDrawingLayer.layer) {
                            alreadySelected = true;
                        }
                    }
                    if (!alreadySelected) {
                        me._sandbox.postRequestByName('AddMapLayerRequest', [me.selectedDrawingLayer.layer, false]);
                    }
                    selections.publishedmyplaces2 = me.selectedDrawingLayer;
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
            //sandbox.postRequestByName('AddMapLayerRequest', [layer.getId(), false, layer.isBaseLayer()]);
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
         * @method activatePreviewPlugin
         * @private
         * Enables or disables a plugin on map
         * @param {Object} tool tool definition as in #tools property
         * @param {Boolean} enabled, true to enable plugin, false to disable
         */
        activatePreviewPlugin: function(tool, enabled) {
            var me = this,
                sandbox = me._sandbox;

            if (!tool) return;

            if (!tool.plugin && enabled) {
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                tool.plugin = Oskari.clazz.create(tool.id, tool.config);
                mapModule.registerPlugin(tool.plugin);
            }
            if (!tool.plugin) {
                // plugin not created -> nothing to do
                return;
            }
            if (tool.config && tool.config.location) {
                tool.plugin.setLocation(this._publisher._getPreferredPluginLocation(tool.plugin, tool.config.location.classes));
            }

            var _toggleToolOption = function(toolName, groupName, toolOption, configName) {
                return function() {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;
                    tool.selected = isChecked;

                    var requester = tool.plugin;
                    if (isChecked) {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption));
                        if (!me[configName][groupName]) {
                            me[configName][groupName] = {};
                        }
                        me[configName][groupName][toolName] = true;
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
                i,ilen,
                j,jlen,
                storedConfigs = [],
                configName,
                groupName,
                buttonGroup,
                toolName,
                toolButton,
                reqBuilder;

            if (enabled) {
                tool.plugin.startPlugin(sandbox);
                if (me._publisher.toolLayoutEditMode && tool.plugin.element) {
                    me._publisher._makeDraggable(tool.plugin.element);
                }
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {
                        'toolbarId': 'PublisherToolbar',
                        'defaultToolbarContainer': '.publishedToolbarContent',
                        'hasContentContainer': true,
                        'classes': {}
                    };

                    // if editing a published view, then use the stored settings
                    if (me._publisher.data && me._publisher.data.state) {
                        if (me._publisher.data.state.toolbar && me._publisher.data.state.toolbar.config) {
                            storedConfigs.push(me._publisher.data.state.toolbar.config);
                        }
                        if (me._publisher.data.state.publishedmyplaces2 && me._publisher.data.state.publishedmyplaces2.config) {
                            storedConfigs.push(me._publisher.data.state.publishedmyplaces2.config);
                        }
                        jlen = storedConfigs.length;

                        if (jlen > 0) {
                            for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                                buttonGroup = me.buttonGroups[i];
                                for (toolName in buttonGroup.buttons) {
                                    // only store truthy values as falsy are ignored by default
                                    for (j = 0; j < jlen; j++) {
                                        if (storedConfigs[j][buttonGroup.name] && storedConfigs[j][buttonGroup.name][toolName] === true) {
                                            configName = (buttonGroup.name === "myplaces" ? 'selectedDrawingLayer' : 'toolbarConfig');
                                            if (!me[configName][buttonGroup.name]) {
                                                me[configName][buttonGroup.name] = {};
                                            }
                                            me[configName][buttonGroup.name][toolName] = true;
                                            // AH-1241 tool selections were lost when a published map was edited
                                            buttonGroup.buttons[toolName].selected = true;
                                        }
                                    }
                                }
                            }
                        }
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
                                if (toolButton.selected) {
                                    toolButton.selectTool.find('input').attr('checked', 'checked');
                                }
                                //toggle toolbar tool. i.e. send requests
                                toolElement = toolButton.selectTool.find('input')
                                    .attr('id', 'tool-opt-' + toolName)
                                    .change(_toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig'));
                                options.append(toolButton.selectTool);
                                // trigger click & change to send events
                                if (me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName]) {
                                    toolElement
                                        .trigger('click')
                                        .trigger('change');
                                    toolElement = null; // ensure we release the dom element
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
                        // get toolbarId
                        me.selectedDrawingLayer.toolbarId = me.toolbarConfig.toolbarId;

                        // create option for adding drawing tools
                        options = jQuery(me.templates.toolOptions).clone();
                        tool.publisherPluginContainer.append(options);

                        var selectTool = jQuery(me.templates.toolOption).clone();
                        selectTool.find('label').attr('for', 'tool-opt-drawing').append(this.loc.toolbarToolNames.drawTools);
                        //toggle toolbar tool. i.e. send requests
                        toolElement = selectTool.find('input')
                            .attr('id', 'tool-opt-drawing')
                            .change(function(e) {
                                me._toggleDrawTools(e, 'drawTools', 'myplaces', me.selectedDrawingLayer, _toggleToolOption);
                            });

                        // trigger click & change to send events
                        if (me._hasSelectedDrawTool()) {
                            toolElement
                                .trigger('click')
                                .trigger('change');
                            toolElement = null; // ensure we release the dom element
                        }
                        options.append(selectTool);
                    }
                }
            } else {
                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {};
                }
                if (tool._isPluginStarted) {
                    // remove buttons, handlers and toolbar toolbar tools
                    for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                        buttonGroup = me.buttonGroups[i];
                        for (toolName in buttonGroup.buttons) {
                            configName = (buttonGroup.name === "myplaces" ? 'selectedDrawingLayer' : 'toolbarConfig');
                            if (me[configName] && me[configName][buttonGroup.name] && me[configName][buttonGroup.name][toolName] === true) {
                                // toolbar tool exists and needs to be removed
                                toolButton = buttonGroup.buttons[toolName];
                                reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                                sandbox.request(tool.plugin, reqBuilder(toolName, buttonGroup.name, toolButton.toolbarid));
                            }
                        }
                    }

                    //remove eventlisteners
                    var _removeOptions = function (className, handler) {
                        var optionContainer = tool.publisherPluginContainer.find(className),
                            toolOptionCheckboxes = optionContainer.find('input').off("change", handler);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    }
                    _removeOptions('.tool-options', me._toggleToolOption);
                    _removeOptions('.tool-option-setting', me._toggleToolOption);

                    tool._isPluginStarted = false;
                    tool.plugin.stopPlugin(sandbox);
                }
            }
        },
        _toggleDrawTools: function(event, toolName, groupName, toolOption, toggleToolHandler) {
            var me = this,
                button, buttonGroup, i, ilen, options, toolElement,
                checkbox = jQuery(event.target),
                isChecked = checkbox.is(':checked'),
                mylayers = me.myplaces;
            if (isChecked) {
                var layerSelect = jQuery(me.templates.layerSelect).clone(),
                    layerSelectOption,
                    addLayerButton;

                for (i = 0; i < mylayers.length; i++) {
                    layerSelectOption = jQuery(me.templates.layerSelectOption).clone();
                    layerSelectOption.attr('value', mylayers[i].getId()).append(mylayers[i].getName());
                    // select correct layer
                    if (me.selectedDrawingLayer.layer !== null && me.selectedDrawingLayer.layer !== undefined &&
                        mylayers[i].getId() === me.selectedDrawingLayer.layer) {
                        layerSelectOption.prop('selected', true);
                    }
                    layerSelect.append(layerSelectOption);
                }
                // select default
                if (me.selectedDrawingLayer.layer === null || me.selectedDrawingLayer.layer === undefined) {
                    me.selectedDrawingLayer.layer = mylayers[0].getId();
                }
                layerSelect.change(function(e) {
                    var target = jQuery(e.target),
                        value = target.val(),
                        i;
                    me.selectedDrawingLayer.layer = value;
                });

                var optionSettings = jQuery(me.templates.toolOptionSettings).clone(),
                    optionSetting = jQuery(me.templates.toolOptionSetting).clone();

                addLayerButton = me._getAddLayerButton();

                //add select for drawlayer
                optionSetting.append('<span>' + me.loc.tools.selectDrawLayer + '</span><br/>');
                optionSetting.append(layerSelect);
                addLayerButton.insertTo(optionSetting);
                optionSettings.append(optionSetting);

                // retrieve myplaces button configs
                for (i = 0, ilen = this.buttonGroups.length; i < ilen; i++) {
                    if (groupName === this.buttonGroups[i].name) {
                        buttonGroup = this.buttonGroups[i];
                        break;
                    }
                }

                // build DOM based on button configs
                for (toolName in buttonGroup.buttons) {
                    if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                        toolButton = buttonGroup.buttons[toolName];
                        toolButton.toolbarid = toolOption.toolbarId;

                        // create checkbox
                        toolButton.toolOption = jQuery(me.templates.toolOptionSetting).clone();
                        toolButton.toolOption.append(jQuery(me.templates.toolOptionSettingInput).clone());
                        toolButton.toolOption.find('label')
                            .attr('for', 'option-' + toolName).append(this.loc.toolbarToolNames[toolName]);

                        //toggle toolbar tool. i.e. send requests
                        toolElement = toolButton.toolOption.find('input')
                            .attr('id', 'option-' + toolName)
                            .change(toggleToolHandler(toolName, buttonGroup.name, toolButton, 'selectedDrawingLayer'));
                        optionSettings.append(toolButton.toolOption);

                        // trigger click & change to send events
                        if (me.selectedDrawingLayer[buttonGroup.name] && me.selectedDrawingLayer[buttonGroup.name][toolName]) {
                            toolElement
                                .trigger('click')
                                .trigger('change');
                            toolElement = null; // ensure we release the dom element
                        }                        
                    }
                }
                //add different settings
                checkbox.parent().parent()
                    .append(optionSettings);
            } else {
                toolElement = checkbox.parent().parent();

                for (toolName in me.selectedDrawingLayer.myplaces) {
                    if (me.selectedDrawingLayer.myplaces[toolName] === true) {
                        toolElement.find('#option-' + toolName).trigger('click');
                    }
                }

                toolElement.find('.tool-option-settings').remove();
                toolElement = null;
            }
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

        _hasSelectedDrawTool: function() {
            var buttons = this.selectedDrawingLayer.myplaces;
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
