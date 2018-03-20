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

        me.toolLayouts = ['lefthanded', 'righthanded', 'userlayout'];
        me.data = me.instance.publisher.data;
        me.activeToolLayout = me.instance.publisher.data && me.instance.publisher.data.metadata && me.instance.publisher.data.metadata.toolLayout ?
                                me.instance.publisher.data.metadata.toolLayout : 'lefthanded';
        me.toolLayoutEditMode = false;
    }, {
        eventHandlers: {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                var me = this;
                //we're in layout edit mode and a new tool was added -> recreate the draggables / droppables
                if (me.toolLayoutEditMode && event.getTool().state.enabled === true) {
                    me._editToolLayoutOff();
                    me._editToolLayoutOn();
                } else {
                    //just update the plugins' locationdata
                    me._changeToolLayout(me.activeToolLayout, null);
                }
            }
        },
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            var me = this;
            me.toolLayoutEditMode = false;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }
            if (!me.panel) {
                me.panel = me._populateToolLayoutPanel(data);
            }

            me._toggleAdditionalTools();
            //init the tools' plugins location infos
            if (me.data && me.activeToolLayout === 'userlayout' ) {
                me._initUserLayout();
            } else {
                me._changeToolLayout(me.activeToolLayout, null);
            }
        },
        getName: function() {
            return "Oskari.mapframework.bundle.publisher2.view.PanelToolLayout";
        },

        /**
        * Extends object recursive for keeping defaults array.
        * @method _extendRecursive
        * @private
        *
        * @param {Object} defaults the default extendable object
        * @param {Object} extend extend object
        *
        * @return {Object} extended object
        */
        _extendRecursive: function(defaults, extend){
            var me = this;
            if (extend === null || extend === undefined || jQuery.isEmptyObject(extend)) {
                return defaults;
            } else if (jQuery.isEmptyObject(defaults)) {
                return jQuery.extend(true, defaults, extend);
            } else if (jQuery.isArray(defaults)) {
                if(jQuery.isArray(extend)){
                    jQuery.each(extend, function(key, value) {
                        defaults.push(value);
                    });
                }
                return defaults;
            } else if (extend.constructor && extend.constructor === Object) {
                jQuery.each(extend, function(key, value){
                    //not an array or an object -> just use the plain value
                    if( defaults[key] === null || defaults[key] === undefined || !(defaults[key] instanceof Array || defaults[key] instanceof Object)) {
                        defaults[key] = value;
                    } else {
                        defaults[key] = me._extendRecursive(defaults[key], value);
                    }

                });
                return defaults;
            }
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var me = this,
                values = {};

            _.each(me.tools, function(tool){

                if (tool.isDisplayed(me.data)) {
                    var value = tool.getValues();
                    if (value !== undefined && value !== null) {
                        me._extendRecursive(values, value);
                    }
                }
            });

            var toolLayout = {
                metadata: {
                    toolLayout: me.activeToolLayout
                }
            };
            me._extendRecursive(values, toolLayout);
            return values;
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @method _toggleAdditionalTools
         *   sets on the tools that are displayed but aren't showing in the tools panel (LogoPlugin etc.)
         */
        _toggleAdditionalTools: function() {
            var me = this;
            _.each(me.tools, function(tool) {
                //don't call for tools that already have been set enabled (=plugin has already been created.)
                if (tool.isDisplayed(me.data) && !tool.isShownInToolsPanel() && !tool.state.enabled) {
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
         * @private @method _populateToolLayoutPanel
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
         * Initialises the plugins' location info when restoring a published map that has a user defined layout
         * @method _initToolLayout
         */
        _initUserLayout: function() {
            var me = this,
                tools = this.tools,
                pluginConfigs;
            //gotta figure out some nicer way to check the existence of (deep) nested properties in an object...
            try {
                pluginConfigs = me.data.configuration.mapfull.conf.plugins;
            } catch(e) {
                pluginConfigs = null;
            }
            if (pluginConfigs && pluginConfigs.length) {
                var pluginConfig = null;
                _.each(tools, function(tool) {
                    for (var i = 0; i < pluginConfigs.length; i++) {
                        pluginConfig = pluginConfigs[i];
                        if (tool.getTool().id === pluginConfig.id) {
                            if (pluginConfig.config && pluginConfig.config.location && pluginConfig.config.location.classes) {
                                tool.getTool().config.location = pluginConfig.config.location;
                                if (tool.getPlugin() && tool.getPlugin().setLocation) {
                                    tool.getPlugin().setLocation(pluginConfig.config.location.classes);
                                }
                            }
                        }
                    }
                });
            }
        },
        /**
         * @private @method _editToolLayoutOn
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
        },

        /**
         * @private @method _editToolLayoutOff
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
                //just call stop for the tools that haven't already been shut down by the tool panel
                if (tool.isStarted() && tool.getPlugin() && tool.getPlugin().getSandbox()) {
                    tool.stop();
                    tool.setEnabled(false);
                }
            });

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.unregisterFromEventByName(me, p);
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

            //no tool matching the plugin class -> drop probably allowed (case wfslayerplugin)
            if (!tool) {
                return 2;
            } else if (!pluginClazz) {
                return;
            }

            for (i = 0; i < siblings.length; i += 1) {
                if (!excludedSibling || siblings[i] !== excludedSibling) {
                    // sibling is not ignored, see if it's an allowed sibling
                    // sibling can't be moved to source
                    if (jQuery.inArray(siblings[i], tool.allowedSiblings) < 0 && pluginClazz !== siblings[i]) {
                        // not an allowed sibling, see if we can move it out of the way (don't pass a source, it'd cause an infinite loop)
                        // only accept 2/yes as a result, moving source plugins out of the way would get too weird
                        if (source && me._locationAllowed(tool.allowedLocations, source) && me._siblingsAllowed(siblings[i], null, source, pluginClazz) === 2) {
                            // sibling can be moved to source
                            ret = 1;
                        } else {
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
                if (jQuery.inArray(siblings[i], tool.allowedSiblings) < 0) {
                    // Unallowed sibling, move to source
                    sibling = me.getToolById(siblings[i]) && me.getToolById(siblings[i]).getPlugin() ? me.getToolById(siblings[i]).getPlugin() : null;
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
         * Restarts all active plugins in case of i.e. changing the language.
         * @method _restartActivePlugins
         *
         */
        _restartActivePlugins: function () {
            var me = this,
                tools = me.tools;

            _.each(me.tools, function(tool) {
                if (tool.isDisplayed(me.data) && tool.isStarted()) {
                    //reset
                    tool.setEnabled(false);
                    tool.setEnabled(true);
                }
            });
        }
    }
);