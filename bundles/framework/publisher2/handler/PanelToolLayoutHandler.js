import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { mergeValues } from '../util/util';

class UIHandler extends StateHandler {
    constructor (tools) {
        super();
        this.tools = tools;
        this.sandbox = Oskari.getSandbox();
        this.eventHandlers = {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                if (!this.toolLayoutEditMode) {
                    return;
                }
                this.enableToolDraggable(event.getTool());
            }
        };

        this.addedDraggables = [];
        this.state = {
            toolLayoutEditmode: false
        };
    }

    getName () {
        return 'Oskari.mapframework.bundle.publisher2.view.PanelToolLayout';
    }

    /**
     * @method init
     * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered
     */
    init (data) {
        // Listens to tools being enabled while dragging is active
        Object.keys(this.eventHandlers)
            .forEach(eventName => this.sandbox.registerForEventByName(this, eventName));
    }

    /**
     * Returns the selections the user has done with the form inputs.
     * @method getValues
     * @return {Object}
     */
    getValues () {
        let values = {};

        this.tools.forEach(tool => {
            values = mergeValues(values, tool.getValues());
        });
        return values;
    }

    switchControlSides () {
        // bookkeeping for unique plugins, so we don't switch more than once in case there are multiple tools using the same plugin (case statsgrid)
        const uniquePlugins = {};

        // toggle left <> right
        this.tools
            .filter(tool => tool.isEnabled())
            .forEach(tool => {
                const plugin = tool.getPlugin();
                if (!plugin || typeof plugin.getLocation !== 'function') {
                    // for example center cross on map does not have a plugin
                    return;
                }

                if (uniquePlugins && uniquePlugins[plugin.getClazz()]) {
                    return;
                }
                uniquePlugins[plugin.getClazz()] = true;

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
    }

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    getToolLayoutEditMode () {
        const { toolLayoutEditMode } = this.getState();
        return toolLayoutEditMode;
    }

    /**
     * @private @method _editToolLayoutOn
     *
     */
    editToolLayoutOn () {
        const me = this;
        const { toolLayoutEditMode } = this.getState();
        if (toolLayoutEditMode) {
            return;
        }
        jQuery('.mapplugins').show();
        this.initDraggables();
        // TODO create droppables on _showDroppable, destroy them on _hideDroppable
        jQuery('.mappluginsContent').droppable({
            // TODO see if this can be done in hover? Would it even be wanted behaviour?
            drop: function (event, ui) {
                const pluginClazz = ui.draggable.attr('data-clazz');
                if (!pluginClazz) {
                    // we might have dropped a non-plugin element on this like the layerlist flyout
                    return;
                }
                const tool = me.getToolById(pluginClazz);
                if (!tool) {
                    // just in case if no tool matches this
                    // we might have dropped a non-plugin element on this like the layerlist flyout
                    return;
                }
                const plugin = tool.getPlugin();

                const source = ui.draggable.parents('.mapplugins');
                const target = jQuery(this);

                me.moveSiblings(pluginClazz, source, target);
                if (plugin && plugin.setLocation) {
                    plugin.setLocation(jQuery(this).parents('.mapplugins').attr('data-location'));
                    // Reset draggable's inline css... couldn't find a cleaner way to do this.
                    // Can't be removed as that breaks draggable, has to be zeroed because we're changing containers
                    // draggable assigns these while dragging:
                    plugin.getElement().css({
                        'top': '0px',
                        'left': '0px'
                    });
                }
                // draggable.stop doesn't fire if dropped to a droppable so we have to do this here as well...
                me.hideDroppable();
            },
            hoverClass: 'ui-state-highlight',
            tolerance: 'pointer' // bit of a compromise, we'd need a combination of pointer and intersect
        });

        var event = Oskari.eventBuilder('LayerToolsEditModeEvent')(true);
        this.sandbox.notifyAll(event);

        this.updateState({
            toolLayoutEditMode: true
        });
    }

    /**
     * @private @method _editToolLayoutOff
     */
    editToolLayoutOff () {
        const { toolLayoutEditMode } = this.getState();
        if (!toolLayoutEditMode) {
            return;
        }
        jQuery('.mappluginsContent.ui-droppable').droppable('destroy');
        this.removeDraggables();

        const event = Oskari.eventBuilder('LayerToolsEditModeEvent')(false);
        this.sandbox.notifyAll(event);
        this.updateState({
            toolLayoutEditMode: false
        });
    }

    enableToolDraggable (tool) {
        const elem = this.getPluginElement(tool);
        if (!elem || this.addedDraggables.includes(elem)) {
            return;
        }
        if (tool.isEnabled()) {
            this.makeDraggable(elem);
            this.addedDraggables.push(elem);
        } else if (elem.hasClass('ui-draggable')) {
            elem.draggable('destroy');
            elem.css('position', '');
        }
    }

    getPluginElement (tool) {
        if (!tool || typeof tool.getPlugin !== 'function') {
            return;
        }
        const plugin = tool.getPlugin();
        if (!plugin || typeof plugin.getElement !== 'function') {
            return;
        }
        return plugin.getElement();
    }

    initDraggables () {
        const tools = this.tools.filter(tool => tool.isEnabled());
        tools.forEach(tool => this.enableToolDraggable(tool));
    }

    removeDraggables () {
        this.addedDraggables.forEach(elem => {
            elem.removeClass('toollayoutedit');
            if (elem.hasClass('ui-draggable')) {
                elem.draggable('destroy');
                elem.css('position', '');
            }
        });
        this.addedDraggables = [];
    }

    /**
     * @private @method _makeDraggable
     *
     * @param {jQuery} elem
     *
     */
    makeDraggable (elem) {
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
                me.showDroppable(
                    ui.helper.attr('data-clazz'),
                    ui.helper.parents('.mapplugins')
                );
            },
            stop: me.hideDroppable,
            revert: 'invalid'
        });
    }

    /**
     * @method _showDroppable       Shows dropzones where the given plugin can be dropped in green
     * @param  {string} pluginClazz Plugin class
     * @param  {Object} source      jQuery object for source dropzone
     * @private
     */
    showDroppable (pluginClazz, source) {
        const me = this;
        const tool = me.getToolById(pluginClazz);

        if (!pluginClazz || !tool) {
            return;
        }
        jQuery('div.mapplugins').each(function () {
            const target = jQuery(this);
            let allowedLocation = me.locationAllowed(tool.allowedLocations, target);
            if (allowedLocation) {
                allowedLocation = me.siblingsAllowed(pluginClazz, source, target);
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
    }

    /**
     * @private @method _hideDroppable
     * Hides dropzones
     *
     *
     */
    hideDroppable () {
        jQuery(
            'div.mapplugins .mappluginsContent'
        ).removeClass('allowed').removeClass('disallowed');
    }

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
    locationAllowed (allowedLocations, dropzone) {
        if (!allowedLocations || !dropzone) {
            return false;
        }
        if (allowedLocations.includes('*')) {
            return true;
        }
        return allowedLocations.find(loc => {
            const cssClasses = loc.split(' ').join('.');
            return dropzone.is('.' + cssClasses);
        });
    }

    getToolById (id) {
        return this.tools.find(tool => tool.getTool().id === id);
    }

    /**
    * Stop panel.
    * @method stop
    * @public
    **/
    stop () {
        this.editToolLayoutOff();
        Object.keys(this.eventHandlers)
            .forEach(eventName => this.sandbox.unregisterFromEventByName(this, eventName));
    }

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
    siblingsAllowed (pluginClazz, source, target, excludedSibling) {
        // Series controls doesn't have publisher tools and requires lot of space
        if (!pluginClazz ||
            pluginClazz === 'Oskari.statistics.statsgrid.SeriesControlPlugin' ||
            pluginClazz === 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin') {
            return 2;
            // no tool matching the plugin class -> drop probably allowed (case wfslayerplugin)
        }
        const tool = this.getToolById(pluginClazz);
        if (!tool) {
            return 2;
        } else if (tool.allowedSiblings.indexOf('*') > -1) {
            return 2;
        }

        const siblings = this.getDropzonePlugins(target);
        let ret = 2;
        siblings.forEach(sibling => {
            if (ret !== 2) {
                // we have already detected the proper return code
                return;
            }
            if (excludedSibling && sibling === excludedSibling) {
                return;
            }
            // sibling is not ignored, see if it's an allowed sibling
            // sibling can't be moved to source
            if (tool.allowedSiblings.includes(sibling) || pluginClazz === sibling) {
                // allowed sibling or self
                return;
            }
            if (!source) {
                // if we haven't left the loop yet and we don't have source -> set value to 0/can't be moved
                ret = 0;
                return;
            }
            // not an allowed sibling, see if we can move it out of the way (don't pass a source, it'd cause an infinite loop)
            // only accept 2/yes as a result, moving source plugins out of the way would get too weird
            // TODO: why would source NOT be in tool.allowedLocations, that's where the tool was when user started moving it?
            if (this.locationAllowed(tool.allowedLocations, source) && this.siblingsAllowed(sibling, null, source, pluginClazz) === 2) {
                // sibling can be moved to source
                ret = 1;
            } else {
                ret = 0;
            }
        });
        return ret;
    }

    /**
     * @private @method _getDropzonePlugins
     * Returns all active plugins in given dropzone
     *
     * @param  {jQuery} dropzone
     * jQuery object of the dropzone
     * @return {string[]}
     * Array of plugin classes
     */
    getDropzonePlugins (dropzone) {
        const ret = [];
        dropzone.find('.mapplugin').each(function () {
            // ignore undefined...
            const clazz = jQuery(this).attr('data-clazz');
            if (clazz) {
                ret.push(clazz);
            }
        });
        return ret;
    }

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
    moveSiblings (pluginClazz, source, target) {
        const siblings = this.getDropzonePlugins(target);
        const tool = this.getToolById(pluginClazz);
        if (tool.allowedSiblings.includes('*')) {
            // allows everything -> no need to move anything
            return;
        }
        const toolPreviousContainer = source.attr('data-location');
        siblings.forEach(siblingClazz => {
            if (tool.allowedSiblings.includes(siblingClazz)) {
                return;
            }
            const otherTool = this.getToolById(siblingClazz);
            if (!otherTool) {
                return;
            }
            const otherToolsPlugin = otherTool.getPlugin();
            if (otherToolsPlugin) {
                otherToolsPlugin.setLocation(toolPreviousContainer);
            } else {
                Oskari.log('BasicPublisher').warn(`_moveSiblings(): Couldn't find sibling`, siblingClazz);
            }
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'validate',
    'getValues',
    'getToolLayoutEditMode',
    'editToolLayoutOn',
    'editToolLayoutOff',
    'switchControlSides'
]);

export { wrapped as PanelToolLayoutHandler };
