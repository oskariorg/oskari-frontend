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
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
     *       publisher reference for language change
     */

    function (localization, publisher) {
        this.loc = localization;
        this._publisher = publisher;

        //user's own layers (not id's)
        this.myplaces = [];


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
                "toolbarId" : "PublisherToolbar"
            }
        }, {
            "id": "Oskari.mapframework.mapmodule.ControlsPlugin",
            "selected": true
        }, {
            "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
            "selected": true,
            "config": {
                "ignoredLayerTypes" : ["WFS"],
                "infoBox": false
            }
        }];
/*
        // map tool indices so we don't have to go through the list every time...
        me.toolIndices = {};
        var i;
        for (i = me.tools.length - 1; i > -1; i -= 1) {
            me.toolIndices[this.tools[i].id] = i;
        }
*/
        this.templates = {
            'help' :        '<div class="help icon-info"></div>',
            'tool' :        '<div class="tool ">' + '<input type="checkbox"/>' + '<span></span></div>',
            'toolOptions':  '<div class="tool-options"></div>',
            'toolOption' :  '<div class="tool-option"><input type="checkbox" /><span></span></div>',            
            'layerSelect':      '<select class="publisher-select-layer"></select>',
            'layerSelectOption':'<option></option>'
        }
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
                selectedLayers = sandbox.findAllSelectedMapLayers();

            for (var i = 0; i < selectedLayers.length; i += 1) {
                var layer = selectedLayers[i];
                if (layer.getLayerType() === "myplaces") {
                    me.myplaces.push(layer);
                }
            }

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
        getPanel: function () {


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
                data,
                mylayers = me.myplaces;

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

            for (i = 0; i < this.tools.length; i += 1) {
                toolContainer = jQuery(this.templates.tool).clone();
                var tool = this.tools[i];
                pluginKey = tool.id;
                pluginKey = pluginKey.substring(pluginKey.lastIndexOf('.') + 1);
                toolname = this.loc.tools[pluginKey];
                toolContainer.find('span').append(toolname);
                if (tool.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                tool.publisherPluginContainer = toolContainer;
                contentPanel.append(toolContainer);
                toolContainer.find('input').change(closureMagic(tool));
            }

            return panel;


/*            var layerSelect = jQuery(me.templates.layerSelect).clone();
            var layerSelectOption = jQuery(me.templates.layerSelectOption).clone();
            layerSelectOption.attr('value', 'nolayer').append(mylayers[i].getName());
            layerSelect.append(layerSelectOption);

            for(var i = 0; i < mylayers.length; i++) {
                var layerSelectOption = jQuery(me.templates.layerSelectOption).clone();
                layerSelectOption.attr('value', mylayers[i].getId()).append(mylayers[i].getName());
                layerSelect.append(layerSelectOption);
            }
            contentPanel.append(layerSelect);

            return panel;
*/            
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     domain : <domain field value>,
         *     name : <name field value>,
         *     language : <language user selected>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var values = {},
                fkey,
                data;
            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    values[fkey] = data.field.getValue();
                }
            }
            values.language = this.langField.field.find('select[name=language]').val();
            return values;
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
                sandbox = me._publisher.instance.getSandbox();
            if (!tool.plugin && enabled) {
                var mapModule = me._publisher.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
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
                tool.plugin.startPlugin(me._publisher.instance.sandbox);
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {
                        'toolbarId' : 'PublisherToolbar',
                        'defaultToolbarContainer' : '.publishedToolbarContent',
                        'hasContentContainer': true,
                        'classes' : {}
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
                                    toolButton.selectTool.find('span').append(this.loc.toolbarToolNames[toolName]);
                                    if (toolButton.selected) {
                                        toolButton.selectTool.find('input').attr('checked', 'checked');
                                    }
                                    //toggle toolbar tool. i.e. send requests
                                    toolButton.selectTool.find('input').change(_toggleToolOption(toolName, buttonGroup.name, toolButton));
                                    options.append(toolButton.selectTool);
                                }
                            }
                        }
                    }
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
                    tool.plugin.stopPlugin(me._publisher.instance.sandbox);
                }
            }
        }

    });