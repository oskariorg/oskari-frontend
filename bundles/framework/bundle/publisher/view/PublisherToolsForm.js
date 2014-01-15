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

    function (publisher, enabledPlugins) {
        this.loc = publisher.loc;
        this._publisher = publisher;
        this._sandbox = null;

        //user's own layers (not id's)
        this.myplaces = [];
        this.selectedDrawingLayer = {
            'layer': null
        };
        this.toolbarConfig = {};


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
                tool.selected = !!enabledPlugins[tool.id];
            }
        }

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
        init: function (pData) {
            var me = this,
                sandbox = me._publisher.instance.getSandbox(),
                mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                myplaces = mapLayerService.getLayersOfType('myplaces');

            me.myplaces = myplaces;
            me._sandbox = sandbox;
        },
        getTools: function () {
            return this.tools;
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function (data) {


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
            var closureMagic = function (tool) {
                return function () {
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

            return panel;
        },

        getToolById: function (id) {
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
        addValues: function (selections) {
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

            if (me.selectedDrawingLayer.point === true ||
                    me.selectedDrawingLayer.line === true ||
                    me.selectedDrawingLayer.area === true) {

                var alreadySelected = false;
                for (i = 0; i < selectedLayers.length; i++) {
                    if (selectedLayers[i].getId() == me.selectedDrawingLayer.layer.getId()) {
                        alreadySelected = true;
                    }
                }
                if (!alreadySelected) {
                    me._sandbox.postRequestByName('AddMapLayerRequest', [me.selectedDrawingLayer.layer.getId(), false, me.selectedDrawingLayer.layer.isBaseLayer()]);
                }
                selections.publishedMyPlaces = me.selectedDrawingLayer;
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
        validate: function () {
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
        activatePreviewPlugin: function (tool, enabled) {
            var me = this,
                sandbox = me._sandbox;
            if (!tool.plugin && enabled) {
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                tool.plugin = Oskari.clazz.create(tool.id, tool.config);
                mapModule.registerPlugin(tool.plugin);
            }
            if (!tool.plugin) {
                // plugin not created -> nothing to do
                return;
            }

            var _toggleToolOption = function (toolName, groupName, toolOption) {
                return function () {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;
                    tool.selected = isChecked;
                    //TODO send toolbar request!
                    var requester = tool.plugin;
                    if (isChecked) {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption));
                        if (!me.toolbarConfig[groupName]) {
                            me.toolbarConfig[groupName] = {};
                        }
                        me.toolbarConfig[groupName][toolName] = true;
                    } else {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption.toolbarid));
                        if (me.toolbarConfig[groupName]) {
                            delete me.toolbarConfig[groupName][toolName];
                        }
                    }
                };
            };

            var toolOptions,
                i,
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

                    tool.plugin.setToolbarContainer();
                    me.toolbarConfig.classes = tool.plugin.getToolConfs();
                }

                toolOptions = tool.plugin.getToolOptions ? tool.plugin.getToolOptions() : null;

                //atm. this is using toolsplugin's button structure
                var options;
                if (toolOptions) {

                    options = jQuery(me.templates.toolOptions).clone();
                    tool.publisherPluginContainer.append(options);
                    //loop through button groups and buttons
                    for (i in toolOptions) {
                        if (toolOptions.hasOwnProperty(i)) {
                            buttonGroup = toolOptions[i];
                            for (toolName in buttonGroup.buttons) {
                                if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                                    toolButton = buttonGroup.buttons[toolName];
                                    // create checkbox
                                    toolButton.selectTool = jQuery(me.templates.toolOption).clone();
                                    toolButton.selectTool.find('label')
                                        .attr('for', 'tool-opt-' + toolName).append(this.loc.toolbarToolNames[toolName]);
                                    if (toolButton.selected) {
                                        toolButton.selectTool.find('input').attr('checked', 'checked');
                                    }
                                    //toggle toolbar tool. i.e. send requests
                                    toolButton.selectTool.find('input')
                                        .attr('id', 'tool-opt-' + toolName)
                                        .change(_toggleToolOption(toolName, buttonGroup.name, toolButton));
                                    options.append(toolButton.selectTool);
                                }
                            }
                        }
                    }

                    //FIXME when myplaces works on published maps
                    //////////////////////////////////////////////////////////////////////////////
                    /*
                    // create option for adding drawing tools
                    options = jQuery(me.templates.toolOptions).clone();
                    tool.publisherPluginContainer.append(options);

                    var selectTool = jQuery(me.templates.toolOption).clone();
                    selectTool.find('label')
                        .attr('for', 'tool-opt-drawing').append(this.loc.toolbarToolNames['drawTools']);
                    //toggle toolbar tool. i.e. send requests
                    selectTool.find('input')
                        .attr('id', 'tool-opt-drawing')
                        .change(function(e) {
                            me._toggleDrawTools(e, 'drawTools', 'myplaces', {})
                        });
                options.append(selectTool);
*/
                    ///////////////////////////////////////////////////////////////////////////////

                }

            } else {
                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {};
                }
                if (tool._isPluginStarted) {
                    //remove buttons
                    toolOptions = tool.plugin.getToolOptions ? tool.plugin.getToolOptions() : null;
                    if (toolOptions) {
                        //remove toolbar tools
                        for (i in toolOptions) {
                            if (toolOptions.hasOwnProperty(i)) {
                                buttonGroup = toolOptions[i];
                                for (toolName in buttonGroup.buttons) {
                                    if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                                        toolButton = buttonGroup.buttons[toolName];
                                        reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                                        sandbox.request(tool.plugin, reqBuilder(toolName, buttonGroup.name, toolButton.toolbarid));
                                    }
                                }
                            }
                        }
                        //remove eventlisteners
                        var optionContainer = tool.publisherPluginContainer.find('.tool-options'),
                            toolOptionCheckboxes = optionContainer.find('input').off("change", me._toggleToolOption);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    }

                    tool._isPluginStarted = false;
                    tool.plugin.stopPlugin(sandbox);
                }
            }
        },
        _toggleDrawTools: function (event, toolName, groupName, toolOption) {
            var me = this,
                checkbox = jQuery(event.target),
                isChecked = checkbox.is(':checked'),
                mylayers = me.myplaces;
            if (isChecked) {
                var layerSelect = jQuery(me.templates.layerSelect).clone(),
                    layerSelectOption,
                    i;
                for (i = 0; i < mylayers.length; i++) {
                    layerSelectOption = jQuery(me.templates.layerSelectOption).clone();
                    layerSelectOption.attr('value', mylayers[i].getId()).append(mylayers[i].getName());
                    // select correct layer
                    if (me.selectedDrawingLayer.layer != null &&
                            mylayers[i].getId() === me.selectedDrawingLayer.layer.getId()) {
                        layerSelectOption.prop('selected', true);
                    }
                    layerSelect.append(layerSelectOption);
                }
                // select default
                if (me.selectedDrawingLayer.layer == null) {
                    me.selectedDrawingLayer.layer = mylayers[0];
                }
                layerSelect.change(function (e) {
                    var target = jQuery(e.target),
                        value = target.val(),
                        i;
                    for (i = 0; i < mylayers.length; i++) {
                        if (mylayers[i].getId() === value) {
                            me.selectedDrawingLayer.layer = mylayers[i];
                        }
                    }
                });

                var optionSettings = jQuery(me.templates.toolOptionSettings).clone(),
                    optionSetting = jQuery(me.templates.toolOptionSetting).clone(),
                    osPoint = jQuery(me.templates.toolOptionSetting).clone(),
                    osLine = jQuery(me.templates.toolOptionSetting).clone(),
                    osArea = jQuery(me.templates.toolOptionSetting).clone(),
                    osPointInput = jQuery(me.templates.toolOptionSettingInput).clone(),
                    osLineInput = jQuery(me.templates.toolOptionSettingInput).clone(),
                    osAreaInput = jQuery(me.templates.toolOptionSettingInput).clone();

                //add select for drawlayer
                optionSetting.append('<span>' + me.loc.tools.selectDrawLayer + '</span><br/>');
                optionSetting.append(layerSelect);
                //add different settings
                checkbox.parent()
                    .append(optionSettings
                        .append(optionSetting)
                        .append(osPoint.append(osPointInput))
                        .append(osLine.append(osLineInput))
                        .append(osArea.append(osAreaInput))
                        );

                osPoint.find('label').attr('for', 'option-point').append(me.loc.tools.drawPoints);
                osPoint.find('input')
                    .attr('id', 'option-point')
                    .change(function (e) {
                        var cbPoint = jQuery(e.target);
                        me.selectedDrawingLayer.point = cbPoint.is(':checked');
                    });

                osLine.find('label').attr('for', 'option-line').append(me.loc.tools.drawLines);
                osLine.find('input')
                    .attr('id', 'option-line')
                    .change(function (e) {
                        var cbLine = jQuery(e.target);
                        me.selectedDrawingLayer.line = cbLine.is(':checked');
                    });

                osArea.find('label').attr('for', 'option-area').append(me.loc.tools.drawAreas);
                osArea.find('input')
                    .attr('id', 'option-area')
                    .change(function (e) {
                        var cbArea = jQuery(e.target);
                        me.selectedDrawingLayer.area = cbArea.is(':checked');
                    });

            } else {
                checkbox.parent().find('.tool-option-settings').remove();
            }
        }
    });