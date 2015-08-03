/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelToolLayout
 *
 * Represents a tool layout panel (lefthanded / righthanded / custom) for the publisher as an Oskari.userinterface.component.AccordionPanel.
 * Allows the user to change the positioning of the tools on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelToolLayout',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Array} tools
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.instance} instance the instance
     */
    function (tools, sandbox, mapmodule, localization, instance) {
        var me = this;
        me.tools = tools;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;

        me.templateHelp = jQuery('<div class="help icon-info"></div>');
        me.templateLayout = jQuery(
            '<div class="tool ">' +
            '  <label>' +
            '    <input type="radio" name="toolLayout" /><span></span>' +
            '  </label>' +
            '</div>'
        );

        // Not sure where this should be...
        me.layerSelectionClasses = {
            lefthanded: 'top right',
            righthanded: 'top left',
            classes: 'top right'
        };

        me.toolLayouts = ['lefthanded', 'righthanded', 'userlayout'];
        me.activeToolLayout = 'lefthanded';
    }, {
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered and
         * the Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
         */
        init: function () {
            var me = this;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }

            if (!me.panel) {
            	me.panel = me._populateToolLayoutPanel();
            }

            me._toggleAdditionalTools();
        },
        /**
         * @method _toggleAdditionalTools
         *   sets on the tools that are displayed but aren't showing in the tools panel (LogoPlugin etc.)
         */
        _toggleAdditionalTools: function() {      
            var me = this;
            _.each(me.tools, function(tool) {
                //don't call for tools that already have been set enabled (=plugin has already been created.)
                if (tool.isDisplayed() && !tool.isShownInToolsPanel() && !tool.state.enabled) {
                    tool.setEnabled(true);
                }
            });
            return null;
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (!this.panel) {
	            this._populateToolLayoutPanel();
            }
            return this.panel;
        },
        /**
         * @private @method _createToolLayoutPanel
         *
         *
         */
        _populateToolLayoutPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(), // tooltip
                i,
                input,
                layoutContainer,
                changeListener = function (e) {
                    if (this.checked) {
                        me._changeToolLayout(this.value, e);
                    }
                };
            panel.setTitle(me.loc.toollayout.label);


            tooltipCont.attr('title', me.loc.toollayout.tooltip);
            contentPanel.append(tooltipCont);

            // content
            for (i = 0; i < me.toolLayouts.length; i += 1) {
                layoutContainer = me.templateLayout.clone();
                input = layoutContainer.find('input');
                input.val(me.toolLayouts[i]).change(changeListener);
                // FIXME default to 0 index if activeToolLayout is not found
                // First choice is active unless we have an active layout
                if (me.activeToolLayout) {
                    if (me.toolLayouts[i] === me.activeToolLayout) {
                        input.attr('checked', 'checked');
                    }
                } else if (i === 0) {
                    input.attr('checked', 'checked');
                }
                layoutContainer.find('span').html(
                    me.loc.toollayout[me.toolLayouts[i]] || me.toolLayouts[i]
                );
                contentPanel.append(layoutContainer);
                if (me.toolLayouts[i] === 'userlayout') {
                    var editBtn = Oskari.clazz.create(
                        'Oskari.userinterface.component.Button'
                    );
                    editBtn.setTitle(me.loc.toollayout.usereditmode);
                    // FIXME create function outside loop
                    editBtn.setHandler(function () {
                        // user is in edit mode
                        if (jQuery(editBtn.getElement()).val() === me.loc.toollayout.usereditmodeoff) {
                            // remove edit mode
                            me._editToolLayoutOff();
                        } else {
                            me._editToolLayoutOn();
                        }
                    });
                    editBtn.setEnabled(me.activeToolLayout === 'userlayout');
                    jQuery(editBtn.getElement()).attr('id', 'editModeBtn');
                    editBtn.insertTo(layoutContainer);
                }
            }
            return panel;
        },
        /**
         * @private @method _changeToolLayout
         *
         * @param {string} layout
         * @param {Object} event
         *
         */
        _changeToolLayout: function (layout, event) {
            // iterate plugins
            var me = this,
                tools = me.tools,
                i,
                tool,
                target,
                button;
            // store location so we have easy access to it on save
            me.activeToolLayout = layout;
            if (layout !== 'userlayout') {
                // make sure we're not in edit mode
                if (me.toolLayoutEditMode) {
                    me._editToolLayoutOff();
                }
                // set location for all tools
                for (i = tools.length - 1; i > -1; i -= 1) {
                    tool = tools[i].getTool();
                    if (tools[i][layout]) {
                        if (!tool.config) {
                            tool.config = {};
                        }
                        if (!tool.config.location) {
                            tool.config.location = {};
                        }
                        tool.config.location.classes = tools[i][layout];
                        var plugin = tools[i].getPlugin();
                        if (plugin && plugin.setLocation) {
                            plugin.setLocation(tool.config.location.classes);
                        }
                    }
                }
                // Set logoplugin and layerselection as well
                //TODO: make this stuff work later.
                /*
                me.logoPluginClasses.classes = me.logoPluginClasses[layout];
                if (me.logoPlugin) {
                    me.logoPlugin.setLocation(me.logoPluginClasses.classes);
                }
                me.layerSelectionClasses.classes = me.layerSelectionClasses[layout];
                me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses.classes);
				*/

                if (event) {
                    target = jQuery(event.currentTarget);
                    button = target.parents('.content').find('input#editModeBtn');
                    button.prop('disabled', true);
                    button.addClass('disabled-button');
                    me._editToolLayoutOff();
                }
            } else {
                if (event) {
                    target = jQuery(event.currentTarget);
                    button = target.parents('.tool').find('input#editModeBtn');
                    button.prop('disabled', false);
                    button.removeClass('disabled-button');
                    me._editToolLayoutOn();
                }
            }
        },
        /**
         * @private @method _editToolLayoutOn
         * TODO: Should this function reside somewhere else, like in the publisher where the editToolLayoutOff is situated as well...?
         *
         *
         */
         
        _editToolLayoutOn: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            if (me.toolLayoutEditMode) {
                return;
            }

            me.toolLayoutEditMode = true;
            jQuery('#editModeBtn').val(me.loc.toollayout.usereditmodeoff);
            jQuery('.mapplugins').show();
            jQuery('.mapplugin').addClass('toollayoutedit');
            // TODO create droppables on _showDroppable, destroy them on _hideDroppable
            var draggables = me._makeDraggable(jQuery('.mapplugin')),
                droppables = jQuery('.mappluginsContent').droppable({
                    // TODO see if this can be done in hover? Would it even be wanted behaviour?
                    drop: function (event, ui) {
                        var pluginClazz = ui.draggable.attr('data-clazz'),
                            plugin = me.getToolById(pluginClazz).getPlugin(),
                            source = ui.draggable.parents('.mapplugins'),
                            target = jQuery(this);

                        me._moveSiblings(pluginClazz, source, target);
                        if (plugin && plugin.setLocation) {
                            plugin.setLocation(jQuery(this).parents('.mapplugins').attr('data-location'));
                            // Reset draggable's inline css... couldn't find a cleaner way to do this.
                            // Can't be removed as that breaks draggable, has to be zeroed because we're changing containers
                            plugin.getElement().css({
                                'top': '0px',
                                'left': '0px'
                            });
                        }
                        // draggable.stop doesn't fire if dropped to a droppable so we have to do this here as well...
                        me._hideDroppable();
                    },
                    hoverClass: 'ui-state-highlight',
                    tolerance: 'pointer' // bit of a compromise, we'd need a combination of pointer and intersect
                });

            var event = sandbox.getEventBuilder('LayerToolsEditModeEvent')(true);
            sandbox.notifyAll(event);

            // remove map controls when editing tool layout
            var controlsPluginTool = me.getToolById(
                'Oskari.mapframework.mapmodule.ControlsPlugin'
            );
            if (controlsPluginTool) {
                me.isMapControlActive = controlsPluginTool && controlsPluginTool.selected;
                me.activatePreviewPlugin(controlsPluginTool, false);
            }
        },
        
        /**
         * @private @method _editToolLayoutOff
         TODO: ALmost the same function is already present in the publisher. Except for the fact that this one doesn't stop the panels (which in any case screws things up)
         * Should we refactor that to make this work, or have two funcs...?
         *
         *
         */
         
        _editToolLayoutOff: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            if (!me.toolLayoutEditMode) {
                return;
            }

            me.toolLayoutEditMode = false;
            jQuery('#editModeBtn').val(me.loc.toollayout.usereditmode);
            jQuery('.mapplugin').removeClass('toollayoutedit');

            var draggables = jQuery('.mapplugin.ui-draggable');
            draggables.css('position', '');
            draggables.draggable('destroy');
            jQuery('.mappluginsContent.ui-droppable').droppable('destroy');

            var event = sandbox.getEventBuilder('LayerToolsEditModeEvent')(false);
            sandbox.notifyAll(event);

            // Set logoplugin and layerselection as well
            // FIXME get this from logoPlugin's config, no need to traverse the DOM
            //TODO: meh
            /*
            if (me.logoPlugin) {
                me.logoPluginClasses.classes = me.logoPlugin.getElement().parents('.mapplugins').attr('data-location');
                me.logoPlugin.getElement().css('position', '');
                //me.logoPlugin.setLocation(me.logoPluginClasses.classes);
            }
            if (me.maplayerPanel.plugin && me.maplayerPanel.plugin.getElement()) {
                me.layerSelectionClasses.classes = me.maplayerPanel.plugin.getElement().parents('.mapplugins').attr('data-location');
                //me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses.classes);
                me.maplayerPanel.plugin.getElement().css('position', '');
            }

            // set map controls back to original settings after editing tool layout
            var controlsPluginTool = me.toolsPanel.getToolById('Oskari.mapframework.mapmodule.ControlsPlugin');
            if (controlsPluginTool) {
                me.toolsPanel.activatePreviewPlugin(controlsPluginTool, me.isMapControlActive);
                delete me.isMapControlActive;
            }

            // Hide unneeded containers
            var container;
            jQuery('.mapplugins').each(function () {
                container = jQuery(this);
                if (container.find('.mappluginsContent').children().length === 0) {
                    container.css('display', 'none');
                }
            });
            */
        },
        
        /**
         * @private @method _makeDraggable
         *
         * @param {jQuery} draggables
         *
         */
        _makeDraggable: function (draggables) {
            var me = this;
            return draggables.draggable({
                appendTo: '.mappluginsContent',
                //containment: "#mapdiv", nosiree, this doesn't play well with droppable's tolerance: 'pointer'
                drag: function (event, ui) {
                    //return false;
                },
                snap: true,
                start: function (event, ui) {
                    // drag start, see which droppables are valid
                    me._showDroppable(
                        ui.helper.attr('data-clazz'),
                        ui.helper.parents('.mapplugins')
                    );
                },
                stop: me._hideDroppable,
                revert: 'invalid'
            });
        },
        /**
         * @method _showDroppable       Shows dropzones where the given plugin can be dropped in green
         * @param  {string} pluginClazz Plugin class
         * @param  {Object} source      jQuery object for source dropzone
         * @private
         */
        _showDroppable: function (pluginClazz, source) {
            var me = this,
                allowedLocation,
                target,
                tool = me.getToolById(pluginClazz);

            if (!pluginClazz || !tool) {
                return;
            }
            jQuery('div.mapplugins').each(function () {
                target = jQuery(this);
                allowedLocation = me._locationAllowed(tool.allowedLocations, target);
                if (allowedLocation) {
                    allowedLocation = me._siblingsAllowed(pluginClazz, source, target);

                    // show allowed-if-we-move-some-siblings-out-of-the-way as allowed for now
                    if (allowedLocation) {
                        // paint it green, plugin can be dropped here
                        target.find('.mappluginsContent').addClass('allowed').droppable('enable');
                    } else {
                        // paint it red, plugins already in the dropzone aren't allowed siblings for this plugin
                        // we could also try to move them somewhere?
                        target.find('.mappluginsContent').addClass('disallowed').droppable('disable');
                    }
                } else {
                    // paint it red, this isn't an allowed dropzone for the plugin
                    target.find('.mappluginsContent').addClass('disallowed').droppable('disable');
                }
            });
        },
        /**
         * @private @method _hideDroppable
         * Hides dropzones
         *
         *
         */
        _hideDroppable: function () {
            jQuery(
                'div.mapplugins .mappluginsContent'
            ).removeClass('allowed').removeClass('disallowed');
        },
        /**
         * @private @method _locationAllowed
         * Is the dropzone in the plugin's allowed locations
         *
         * @param  {string[]}   allowedLocations
         * Array of allowed locations for the plugin
         * @param  {jQuery}  dropzone
         * jQuery object of the dropzone
         *
         * @return {string}
         * Allowed location string if allowed, null if not.
         */
        _locationAllowed: function (allowedLocations, dropzone) {
            var isAllowedLocation,
                i;

            if (!allowedLocations || !dropzone) {
                return false;
            }
            for (i = 0; i < allowedLocations.length; i += 1) {
                isAllowedLocation = dropzone.is('.' + allowedLocations[i].split(' ').join('.'));
                if (isAllowedLocation) {
                    return allowedLocations[i];
                }
            }
            return null;
        },

        getToolById: function(id) {
            for (var i = 0; i < this.tools.length; i++) {
                if (this.tools[i].getTool().id === id) {
                    return this.tools[i];
                }
            }
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function(){
            var me = this;

            _.each(me.tools, function(tool){
                console.log("1 "+tool.getTool().id + " "+tool.__plugin);
            });
            _.each(me.tools, function(tool){
                tool.stop();
                tool.setEnabled(false);
            });
            _.each(me.tools, function(tool){
                console.log("2 "+tool.getTool().id + " "+tool.__plugin);
            });
        },

        /**
         * Section WTF
         */
        /**
         * @method activatePreviewPlugin
         * @private
         * Enables or disables a plugin on map
         * @param {Object} tool tool definition as in #tools property
         * @param {Boolean} enabled, true to enable plugin, false to disable
         * @param {Boolean} localeChange, true to not reset config when disabling plugin, false to reset config
         */
        activatePreviewPlugin: function(tool, enabled, localeChange) {
            var me = this,
                sandbox = me.sandbox,
                plugin = (tool && tool.getPlugin()) ? tool.getPlugin() : null,
                //the actual tool's "wrapper" instance
                toolInstance = (tool && tool.getTool()) ? tool.getTool() : null;
            if (tool && !plugin) {
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                plugin = Oskari.clazz.create(toolInstance.id, toolInstance.config);
                mapModule.registerPlugin(plugin);
            }
            if (!tool || !plugin) {
                // no tool or plugin not created -> nothing to do
                return;
            }
            if (toolInstance.config && toolInstance.config.location) {
                plugin.setLocation(this.instance.publisher._getPreferredPluginLocation(plugin, tool.config.location.classes));
            }

            var _toggleToolOption = function(toolName, groupName, toolOption, configName, cbox) {
                return function() {
                    var checkbox = cbox ? cbox : jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;

                    if (tool.id.indexOf('PublisherToolbarPlugin') >= 0) {
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
                configName,
                buttonGroup,
                toolName,
                toolButton,
                reqBuilder,
                isChecked;

            if (enabled) {
                plugin.startPlugin(sandbox);
                if (me._publisher.toolLayoutEditMode && plugin.element) {
                    me._publisher._makeDraggable(plugin.element);
                }
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (toolInstance.id.indexOf('PublisherToolbarPlugin') >= 0) {
                    if (_.isEmpty(me.toolbarConfig)) {
                        me._presetDataConfig('toolbarConfig');
                    }
                    plugin.setToolbarContainer();
                    me.toolbarConfig.classes = plugin.getToolConfs();

                    var _addToolGroup = function(groupName, options, toolOption, toggleToolHandler) {
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

                        var selectTool = jQuery(me.templates.toolOption).clone(),
                            toolElement;
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
//                } else if(tool.id.indexOf('SearchPlugin') >= 0 || tool.id.indexOf('MyLocationPlugin') >= 0 ) {
                } else if(toolInstance.id.indexOf('SearchPlugin') >= 0 || toolInstance.id.indexOf('MyLocationPlugin') >= 0 ) {

                }
            } else {
                // toolbar (bundle) needs to be notified

                // MyLocationPlugin
//                if (tool.id.indexOf('PublisherToolbarPlugin') >= 0) {
                if (toolInstance.id.indexOf('PublisherToolbarPlugin') >= 0) {
                    if (!localeChange) {
                       me.toolbarConfig = {};
                    }

                    // remove buttons, handlers and toolbar toolbar tools
                    for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                        buttonGroup = me.buttonGroups[i];
                        for (toolName in buttonGroup.buttons) {
                            configName = (buttonGroup.name === 'myplaces' ? 'publishedmyplaces2Config' : 'toolbarConfig');
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
                            toolOptionCheckboxes = optionContainer.find('input').off('change', handler);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    };
                    _removeOptions('.tool-options', me._toggleToolOption);
                    _removeOptions('.tool-option-setting', me._toggleToolOption);

                    tool._isPluginStarted = false;
//                    tool.plugin.stopPlugin(sandbox);
                    plugin.stopPlugin(sandbox);
                }
            }
        },
        /**
         * @private @method _siblingsAllowed
         * Checks if plugins in dropzone are allowed siblings for given plugin
         *
         * @param  {string} pluginClazz
         * Plugin clazz
         * @param  {jQuery} source
         * jQuery object for source dropzone (optional)
         * @param  {jQuery} target
         * jQuery object for target dropzone
         * @param  {string} excludedSibling
         * Clazz for plugin that should be ignored in sibling check (optional)
         *
         * @return {Number}
         * 0 = no, 1 = siblings can be moved out of the way, 2 = yes
         */
        _siblingsAllowed: function (pluginClazz, source, target, excludedSibling) {
            var me = this,
                siblings = this._getDropzonePlugins(target),
                i,
                ret = 2,
                tool = me.getToolById(pluginClazz);

            if (!pluginClazz || !tool) {
                return;
            }


            for (i = 0; i < siblings.length; i += 1) {
                if (!excludedSibling || siblings[i] !== excludedSibling) {
                    // sibling is not ignored, see if it's an allowed sibling
//                    if (jQuery.inArray(siblings[i], me.toolDropRules[pluginClazz].allowedSiblings) < 0 && pluginClazz !== siblings[i]) {
                    if (jQuery.inArray(siblings[i], tool.allowedSiblings) < 0 && pluginClazz !== siblings[i]) {
                        // not an allowed sibling, see if we can move it out of the way (don't pass a source, it'd cause an infinite loop)
                        // only accept 2/yes as a result, moving source plugins out of the way would get too weird
//                        if (source && me._locationAllowed(this.toolDropRules[siblings[i]].allowedLocations, source) && me._siblingsAllowed(siblings[i], null, source, pluginClazz) === 2) {
                        if (source && me._locationAllowed(tool.allowedLocations, source) && me._siblingsAllowed(siblings[i], null, source, pluginClazz) === 2) {
                            // sibling can be moved to source
                            ret = 1;
                        } else {
                            // sibling can't be moved to source
                            ret = 0;
                            break;
                        }
                    }
                }
            }
            return ret;
        },
        /**
         * @private @method _getDropzonePlugins
         * Returns all active plugins in given dropzone
         *
         * @param  {jQuery} dropzone
         * jQuery object of the dropzone
         * @return {string[]}
         * Array of plugin classes
         */
        _getDropzonePlugins: function (dropzone) {
            var ret = [],
                clazz;

            dropzone.find('.mapplugin').each(function () {
                // ignore undefined...
                clazz = jQuery(this).attr('data-clazz');
                if (clazz) {
                    ret.push(clazz);
                }
            });
            return ret;
        },
        /**
         * @private @method _moveSiblings
         * Moves unallowed siblings to source so plugin can be moved to target
         *
         * @param  {string} pluginClazz
         * Plugin clazz
         * @param  {jQuery} source
         * jQuery object for source dropzone (optional)
         * @param  {jQuery} target
         * jQuery object for target dropzone
         *
         **/
        _moveSiblings: function (pluginClazz, source, target) {
            var me = this,
                sibling,
                siblings = this._getDropzonePlugins(target),
                i,
                tool = me.getToolById(pluginClazz);

            for (i = 0; i < siblings.length; i += 1) {
//                if (jQuery.inArray(siblings[i], me.toolDropRules[pluginClazz].allowedSiblings) < 0) {
                if (jQuery.inArray(siblings[i], tool.allowedSiblings) < 0) {
                    // Unallowed sibling, move to source
//                    sibling = me._getPluginByClazz(siblings[i]);
                    sibling = me.getToolById(siblings[i]).getPlugin();
                    if (sibling) {
                        sibling.setLocation(source.attr('data-location'));
                    } else {
                        me.sandbox.printWarn(
                            'BasicPublisher._moveSiblings(): Couldn\'t find sibling',
                            siblings[i]
                        );
                    }
                }
            }
        },








         /**
          * Section WTF ends
          */

    }
);
