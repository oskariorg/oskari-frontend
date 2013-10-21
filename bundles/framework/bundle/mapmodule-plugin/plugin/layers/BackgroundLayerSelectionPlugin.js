/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a background maplayer selection "dropdown" on top of the map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginBackgroundLayerSelectionPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        var i;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.element = undefined;
        this.conf = config;
        this.error = !(this.conf && this.conf.baseLayers && this.conf.baseLayers.length);
        // Make sure baseLayers aren't Numbers
        if (!this.error) {
            for (i = 0; i < this.conf.baseLayers.length; i += 1) {
                if (typeof this.conf.baseLayers[i] === 'number') {
                    this.conf.baseLayers[i] = this.conf.baseLayers[i].toString();
                }
            }
        }
        this.initialSetup = true;
    }, {
        /** @static @property __name module name */
        __name: 'BackgroundLayerSelectionPlugin',

        /**
         * @method getName
         * @return {String} module name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * Returns reference to map module this plugin is registered to
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean}
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method getMap
         * @return {OpenLayers.Map} reference to map implementation
         */
        getMap: function () {
            return this._map;
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},
        /**
         * @method init
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *         reference to application sandbox
         */
        init: function (sandbox) {
            // selected layer's li is marked by selected-class
            // if dropdown is open, li with selected-class will be hidden
            // currentSelection stores the current selection so we don't have to reorder the list elements
            this.template = jQuery(
                '<div class="backgroundLayerSelectionPlugin oskariui mapplugin">' +
                    '<div class="bg"></div>' +
                    '<div class="content">' +
                    '    <ul></ul>' +
                    '    <div class="currentSelection"></div>' +
                    '</div></div>'
            );
            // header-icon is used to show the open/close arrow
            this.dropdownArrowTemplate = jQuery('<div class="header-icon icon-arrow-white-right"></div>');
            // this is inserted in the ul
            this.layerSelectionTemplate = jQuery('<li></li>');
            // used in case the module config is faulty
            this.errorTemplate = jQuery(
                '<div class="backgroundLayerSelectionPlugin oskariui mapplugin">' +
                    '<div class="bg"></div>' +
                    '<div class="error">No baseLayers defined in configuration</div>' +
                    '</div>'
            );
        },
        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Registers requesthandlers and
         * eventlisteners. Creates the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *         reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var p,
                me = this;
            me._sandbox = sandbox;
            me._map = me.getMapModule().getMap();
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            this._createUI();
        },

        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Unregisters requesthandlers and
         * eventlisteners. Removes the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *         reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p,
                me = this;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }

            sandbox.unregister(me);

            // remove ui
            if (me.element) {
                me.element.remove();
                me.element = undefined;
                delete me.element;
            }
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *         reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *         reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * [description]
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Rearanges layers
             */
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                // Update selection, bottom baselayer might've changed
                this._updateUISelection();
            },
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Removes the layer from selection
             */
            'AfterMapLayerRemoveEvent': function (event) {
                // Redo ui, one of our layers might've been deleted
                // TODO Check if event.getMapLayer() id is in our layers first...
                // if not, still do this._updateUISelection() as the selected
                // layer might still have changed
                this._createLayerSelectionElements();
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Adds the layer to selection
             */
            'AfterMapLayerAddEvent': function (event) {
                // Redo ui, we might've gotten a previously missing layer
                // TODO Check if event.getMapLayer() id is in our layers first...
                // if not, still do this._updateUISelection() as the selected
                // layer might still have changed
                this._createLayerSelectionElements();
            },

            /**
             * @method AfterMapMoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
             *
             * Adds the layer to selection
             */
            'MapLayerEvent': function (event) {
                // TODO add check for event.getMapLayer().getId() here?
                this._createLayerSelectionElements();
            }
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method toggleSelection
         * Programmatically opens/closes the plugins interface as if user had clicked it open
         * @private
         */
        _toggleSelection: function () {
            var icon = this.element.find('div.header-icon'),
                content = this.element.find('div.content');

            if (content.hasClass('open')) {
                icon.addClass('icon-arrow-white-right');
                icon.removeClass('icon-arrow-white-down');
                content.removeClass('open');
            } else {
                icon.removeClass('icon-arrow-white-right');
                icon.addClass('icon-arrow-white-down');
                content.addClass('open');
            }
        },
        /**
         * @method _getBottomLayer
         * Returns the bottom-most selected layer if any
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         * @private
         */
        _getBottomLayer: function () {
            var bottomIdx = 0,
                allSelectedLayers = this._sandbox.findAllSelectedMapLayers();
            if (allSelectedLayers && allSelectedLayers.length) {
                return allSelectedLayers[bottomIdx];
            }
            return null;
        },
        /**
         * @method _arrayContains
         * @param  {Array} arr Array
         * @param  {String} val Value
         * @return {Boolean} True if arr contains val
         */
        _arrayContains: function (arr, val) {
            var i;
            if (arr.indexOf) {
                return arr.indexOf(val) > -1;
            }
            for (i = arr.length; i > -1; i -= 1) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Does the actual layer selection update
         * @param  {Number} newSelectionId Id of the new base layer
         * @private
         */
        _updateSelection: function (newSelectionId) {
            if (this.error) {
                return;
            }
            var me = this,
                currentBottom = me._getBottomLayer(),
                currentBottomId = "",
                currentSelection = me.element.find('div.currentSelection'),
                newSelection = me._sandbox.findMapLayerFromSelectedMapLayers(newSelectionId),
                i;
            // switch bg layer (no need to call update on ui, we should catch the event)
            // - check if current bottom layer exists & is in our list (if so, remove)
            if (currentBottom) {
                currentBottomId += currentBottom.getId();
                if (me._arrayContains(me.conf.baseLayers, currentBottomId)) {
                    me._sandbox.postRequestByName('RemoveMapLayerRequest', [currentBottomId]);
                }
            }
            // - check if new selection is already selected, remove if so as rearrange doesn't seem to work
            if (newSelection) {
                me._sandbox.postRequestByName('RemoveMapLayerRequest', [newSelectionId]);
            }

            me._sandbox.postRequestByName('AddMapLayerRequest', [newSelectionId, false, true]);
            // - move new selection to bottom (see layerselection._layerOrderChanged(item))
            me._sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [newSelectionId, 0]);
            // toggle dropdown open/closed.
            // won't bother with dropdown being on or off here
            me._toggleSelection();
        },
        /**
         * @method  _updateUISelection
         * Updates UI selection:
         * - Fetches new bottom baselayer
         * - LI element of the selected layer gets the 'selected'-class
         * - currentSelection gets filled with the new selection's information
         *  @private
         */
        _updateUISelection: function (force) {
            // TODO:
            // - check what the new selection is (dig up bottom layer...)
            var me = this,
                newSelection = me._getBottomLayer(),
                newSelectionId = "",
                newSelectionName = "",
                listElement,
                currentSelection = me.element.find('div.currentSelection'),
                icon;

            // find bottom-most bg layer
            if (newSelection) {
                newSelectionId += newSelection.getId();
                newSelectionName = newSelection.getName();
            }
            // use attr(data-foo) instead of data(foo) so old jquery works...
            if (!force && newSelectionId === currentSelection.attr("data-layerId")) {
                // Update isn't forced and selection hasn't changed
                return;
            }
            // - go through LIs, toggle selected class
            me.element.find('li').each(function (index) {
                listElement = jQuery(this);
                listElement.toggleClass('selected', listElement.attr("data-layerId") === newSelectionId);
            });
            // - update currentSelection with the new selection's information if it's in baseLayers
            currentSelection.empty();
            if (me._arrayContains(me.conf.baseLayers, newSelectionId)) {
                currentSelection.attr("data-layerId", newSelectionId);
                currentSelection.attr("title", newSelectionName);
                currentSelection.html(newSelectionName);
            }
            icon = me.dropdownArrowTemplate.clone();
            if (me.element.find('div.content').hasClass('open')) {
                icon.removeClass('icon-arrow-white-right').addClass('icon-arrow-white-down');
            }
            currentSelection.prepend(icon);
            if (me.conf) {
                /* TODO is there any tool style to be configured?
                if (me.conf.toolStyle) {
                    me.changeToolStyle(me.conf.toolStyle, me.element);
                }
                */
                if (me.conf.font) {
                    me.changeFont(me.conf.font, me.element);
                }
                if (me.conf.colorScheme) {
                    // TODO this'll be fun to implement with all the dynamic elements...
                    me.changeColorScheme(me.conf.colorScheme, me.element);
                }
            }
        },
        /**
         * @method  _createLayerSelectionElements
         * Creates LI elements for the bg layers.
         * These are used in both dropdown and list mode.
         * @private
         */
        _createLayerSelectionElements: function () {
            if (this.error) {
                return;
            }
            var me = this,
                layer,
                layerIds = me.conf.baseLayers,
                list = me.element.find('ul'),
                listItem,
                i,
                selectionUpdateHandler = function () {
                    me._updateSelection(jQuery(this).attr('data-layerId'));
                };
            // remove children, this function is called on update
            list.empty();
            for (i = 0; i < layerIds.length; i += 1) {
                // TODO get layer from somewhere to see if it exists and to get its name...
                layer = me._sandbox.findMapLayerFromAllAvailable(layerIds[i]);
                if (layer) {
                    listItem = me.layerSelectionTemplate.clone();
                    listItem.attr("data-layerId", layerIds[i]).attr("title", layer.getName()).html(layer.getName());
                    list.append(listItem);
                    listItem.bind('click', selectionUpdateHandler);
                }
            }
            // force update selection
            me._updateUISelection(true);
        },
        /**
         * @method  _createUI
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
         * If it exists, checks if there are other bundles and writes itself as the first one.
         * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
         * @private
         */
        _createUI: function () {
            var me = this;

            if (!me.element) {
                if (me.error) {
                    // No baseLayers in config, show error.
                    me.element = me.errorTemplate.clone();
                } else {
                    me.element = me.template.clone();
                    me.element.find('div.currentSelection').bind('click', function () {
                        me._toggleSelection();
                    });

                    me.element.find('div.content').toggleClass('dropdown', me.conf && me.conf.showAsDropdown);

                    // create entries
                    me._createLayerSelectionElements();
                }
            }

            // make sure we're in before logo etc.
            jQuery(me._map.div).prepend(me.element);
        },
        /**
         * Changes the color scheme of the plugin
         *
         * @method changeColorScheme
         * @param {Object} colorScheme object containing the color settings for the plugin
         *      {
         *          buttonColor: <Text color for buttons>,
         *          buttonBackgroundColor: <Background color for buttons>,
         *          buttonSelectedColor: <Text color for selected buttons>,
         *          buttonSelectedBackgroundColor: <Background color for selected buttons>
         *          buttonBorderColor: <Border color for dropdown buttons>
         *      }
         * @param {jQuery} div
         */
        changeColorScheme: function (colorScheme, div) {
            div = div || this.element;

            if (!div || !colorScheme) {
                return;
            }

            // Change the color of the list items
            div.find('li').css({
                'background-color' : colorScheme.buttonBackgroundColor,
                'color': colorScheme.buttonColor
            }).filter('.selected').css({
                'background-color' : colorScheme.buttonSelectedBackgroundColor,
                'color': colorScheme.buttonSelectedColor
            });
            div.find('.dropdown li').css({
                'background-color' : colorScheme.buttonSelectedBackgroundColor,
                'color': colorScheme.buttonSelectedColor,
                'border-color': colorScheme.buttonBorderColor
            });

            // Change the color of the current selection
            div.find('div.currentSelection').css({
                'background-color' : colorScheme.buttonBackgroundColor,
                'color': colorScheme.buttonColor
            });
        },
        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @method changeFont
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            div = div || this.element;

            if (!div || !fontId) {
                return;
            }

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, [div]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });