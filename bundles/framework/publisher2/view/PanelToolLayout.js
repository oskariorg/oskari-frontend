import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { ToolLayout } from './form/ToolLayout';
import { mergeValues } from '../util/util';
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
        // This is publisher.sidebar.data
        me.data = me.instance.publisher.data;
        me.activeToolLayout = 'userlayout';
        me.toolLayoutEditMode = false;
        me._addedDraggables = [];
    }, {
        eventHandlers: {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                if (!this.toolLayoutEditMode) {
                    return;
                }
                this._enableToolDraggable(event.getTool());
            }
        },
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
         */
        init: function (data) {
            this.toolLayoutEditMode = false;
            // Listens to tools being enabled while dragging is active
            Object.keys(this.eventHandlers)
                .forEach(eventName => this.sandbox.registerForEventByName(this, eventName));
            if (!this.panel) {
                this.panel = this._populateToolLayoutPanel(data);
            }
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelToolLayout';
        },

        /**
         * Returns the selections the user has done with the form inputs.
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            let values = {};

            this.tools.forEach(tool => {
                values = mergeValues(values, tool.getValues());
            });
            return mergeValues(values, {
                metadata: {
                    toolLayout: this.activeToolLayout
                }
            });
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
            const me = this;
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            this.panel = panel;
            const tooltipCont = this.templateHelp.clone(); // tooltip
            panel.setTitle(me.loc.toollayout.label);

            tooltipCont.attr('title', me.loc.toollayout.tooltip);
            panel.getHeader().append(tooltipCont);
            this._renderPanel();

            return panel;
        },
        _renderPanel: function () {
            const panel = this.getPanel();
            const contentPanel = panel.getContainer();

            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
                    <ToolLayout
                        onSwitch={() => this._switchControlsInSides()}
                        isEdit={this.toolLayoutEditMode}
                        onEditMode={(isEdit) => {
                            if (isEdit) {
                                this._editToolLayoutOn();
                            } else {
                                // remove edit mode
                                this._editToolLayoutOff();
                            }
                        }}
                    />
                </LocaleProvider>,
                contentPanel[0]
            );
        },
        _switchControlsInSides: function () {
            // toggle left <> right
            this.tools
                .filter(tool => tool.isEnabled())
                .forEach(tool => {
                    const plugin = tool.getPlugin();
                    if (typeof plugin.getLocation !== 'function') {
                        return;
                    }
                    const currentLoc = plugin.getLocation();
                    if (!currentLoc) {
                        // some plugins like GetInfo have the method but no location
                        return;
                    }
                    if (currentLoc.includes('left')) {
                        plugin.setLocation(currentLoc.replace('left', 'right'));
                    } else if (currentLoc.includes('right')) {
                        plugin.setLocation(currentLoc.replace('right', 'left'));
                    }
                });
        },

        /**
         * @private @method _editToolLayoutOn
         *
         */
        _editToolLayoutOn: function () {
            const me = this;
            if (this.toolLayoutEditMode) {
                return;
            }
            this.toolLayoutEditMode = true;
            jQuery('.mapplugins').show();
            this._initDraggables();
            // TODO create droppables on _showDroppable, destroy them on _hideDroppable
            jQuery('.mappluginsContent').droppable({
                // TODO see if this can be done in hover? Would it even be wanted behaviour?
                drop: function (event, ui) {
                    const pluginClazz = ui.draggable.attr('data-clazz');
                    const plugin = me.getToolById(pluginClazz).getPlugin();
                    const source = ui.draggable.parents('.mapplugins');
                    const target = jQuery(this);

                    me._moveSiblings(pluginClazz, source, target);
                    if (plugin && plugin.setLocation) {
                        plugin.setLocation(jQuery(this).parents('.mapplugins').attr('data-location'));
                        // Reset draggable's inline css... couldn't find a cleaner way to do this.
                        // Can't be removed as that breaks draggable, has to be zeroed because we're changing containers
                        /*
                        plugin.getElement().css({
                            'top': '0px',
                            'left': '0px'
                        });
                        */
                    }
                    // draggable.stop doesn't fire if dropped to a droppable so we have to do this here as well...
                    me._hideDroppable();
                },
                hoverClass: 'ui-state-highlight',
                tolerance: 'pointer' // bit of a compromise, we'd need a combination of pointer and intersect
            });

            var event = Oskari.eventBuilder('LayerToolsEditModeEvent')(true);
            this.sandbox.notifyAll(event);
            this._renderPanel();
        },

        /**
         * @private @method _editToolLayoutOff
         */
        _editToolLayoutOff: function () {
            if (!this.toolLayoutEditMode) {
                return;
            }
            this.toolLayoutEditMode = false;
            jQuery('.mappluginsContent.ui-droppable').droppable('destroy');
            this._removeDraggables();

            var event = Oskari.eventBuilder('LayerToolsEditModeEvent')(false);
            this.sandbox.notifyAll(event);
            this._renderPanel();
        },
        _enableToolDraggable: function (tool) {
            const elem = this.__getPluginElement(tool);
            if (!elem || this._addedDraggables.includes(elem)) {
                return;
            }
            if (tool.isEnabled()) {
                this._makeDraggable(elem);
                this._addedDraggables.push(elem);
            } else if (elem.hasClass('ui-draggable')) {
                elem.draggable('destroy');
                elem.css('position', '');
            }
        },
        __getPluginElement: function (tool) {
            if (!tool || typeof tool.getPlugin !== 'function') {
                return;
            }
            const plugin = tool.getPlugin();
            if (!plugin || typeof plugin.getElement !== 'function') {
                return;
            }
            return plugin.getElement();
        },
        _initDraggables: function () {
            const tools = this.tools.filter(tool => tool.isEnabled());
            tools.forEach(tool => this._enableToolDraggable(tool));
        },
        _removeDraggables: function () {
            this._addedDraggables.forEach(elem => {
                elem.removeClass('toollayoutedit');
                if (elem.hasClass('ui-draggable')) {
                    elem.draggable('destroy');
                    elem.css('position', '');
                }
            });
            this._addedDraggables = [];
        },
        /**
         * @private @method _makeDraggable
         *
         * @param {jQuery} elem
         *
         */
        _makeDraggable: function (elem) {
            var me = this;
            elem.addClass('toollayoutedit');
            elem.draggable({
                appendTo: '.mappluginsContent',
                // containment: "#mapdiv", nosiree, this doesn't play well with droppable's tolerance: 'pointer'
                drag: function (event, ui) {
                    // return false;
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
            if (allowedLocations.indexOf('*') > -1) return true;
            for (i = 0; i < allowedLocations.length; i += 1) {
                isAllowedLocation = dropzone.is('.' + allowedLocations[i].split(' ').join('.'));
                if (isAllowedLocation) {
                    return allowedLocations[i];
                }
            }
            return null;
        },

        getToolById: function (id) {
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
        stop: function () {
            this._editToolLayoutOff();
            Object.keys(this.eventHandlers)
                .forEach(eventName => this.sandbox.unregisterFromEventByName(this, eventName));
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
            // Series controls doesn't have publisher tools and requires lot of space
            if (pluginClazz === 'Oskari.statistics.statsgrid.SeriesControlPlugin' ||
                pluginClazz === 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin') {
                return;
            // no tool matching the plugin class -> drop probably allowed (case wfslayerplugin)
            } else if (!tool) {
                return 2;
            } else if (tool.allowedSiblings.indexOf('*') > -1) {
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
                if (tool.allowedSiblings.indexOf('*') < 0 && jQuery.inArray(siblings[i], tool.allowedSiblings) < 0) {
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
            this.tools.forEach(tool => {
                if (tool.isDisplayed(this.data) && tool.isEnabled()) {
                    // reset
                    tool.setEnabled(false);
                    tool.setEnabled(true);
                }
            });
        }
    }
);
