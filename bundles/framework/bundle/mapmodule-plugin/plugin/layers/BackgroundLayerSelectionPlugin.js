/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a background maplayer selection "dropdown" on top of the map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginBackgroundLayerSelectionPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var i;
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin';
        this._defaultLocation = 'bottom center';
        this._index = 0;
        this._name = 'BackgroundLayerSelectionPlugin';
        this.error = !(this._config && this._config.baseLayers && this._config.baseLayers.length);
        // Hackhack, make sure baseLayers aren't numbers.
        if (!this.error) {
            for (i = 0; i < this._config.baseLayers.length; i += 1) {
                if (typeof this._config.baseLayers[i] === 'number') {
                    this._config.baseLayers[i] =
                        this._config.baseLayers[i].toString();
                }
            }
        }
    }, {
        /** @static @property __name module name */
        __name: 'BackgroundLayerSelectionPlugin',

        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         *
         */
        _initImpl: function () {
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
            this.dropdownArrowTemplate = jQuery(
                '<div class="header-icon icon-arrow-white-right"></div>'
            );
            // used in case the module config is faulty
            this.errorTemplate = jQuery(
                '<div class="backgroundLayerSelectionPlugin oskariui mapplugin">' +
                '  <div class="bg"></div>' +
                '  <div class="error">No baseLayers defined in configuration</div>' +
                '</div>'
            );
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method AfterRearrangeSelectedMapLayerEvent
                 * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
                 *
                 * Rearranges layers
                 */
                AfterRearrangeSelectedMapLayerEvent: function (event) {
                    // Update selection, bottom baselayer might've changed
                    //this._updateUISelection();
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerRemoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
                 *
                 * Removes the layer from selection
                 */
                AfterMapLayerRemoveEvent: function (event) {
                    // Redo ui, one of our layers might've been deleted
                    // TODO Check if event.getMapLayer() id is in our layers first...
                    // if not, still do this._updateUISelection() as the selected
                    // layer might still have changed
                    //this._createLayerSelectionElements();
                    this.refresh();
                },

                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapLayerAddEvent: function (event) {
                    // Redo ui, we might've gotten a previously missing layer
                    // TODO Check if event.getMapLayer() id is in our layers first...
                    // if not, still do this._updateUISelection() as the selected
                    // layer might still have changed
                    //this._createLayerSelectionElements();
                    this.refresh();
                },

                /**
                 * @method AfterMapMoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
                 *
                 * Adds the layer to selection
                 */
                MapLayerEvent: function (event) {
                    // TODO add check for event.getMapLayer().getId() here?
                    //this._createLayerSelectionElements();
                    this.refresh();
                },

                /**
                 * @method userinterface.ExtensionUpdatedEvent
                 */
                'userinterface.ExtensionUpdatedEvent': function (event) {
                    // Hide layer selection if a mode was activated
                    if (jQuery.inArray(event.getExtension().getName(), ['Analyse', 'Publisher', 'StatsGrid', 'Printout']) > -1) {
                        var me = this,
                            isShown = event.getViewState() !== 'close';
                        if (isShown) {
                            // Mode opened, hide plugin
                            if (!me.hiddenByMode) {
                                me.hiddenByMode = true;
                                me.setVisible(false);
                            }
                        } else if (me.hiddenByMode) {
                            me.hiddenByMode = null;
                            delete me.hiddenByMode;
                            me.setVisible(true);
                        }
                    }
                }
            };
        },

        /**
         * @private @method toggleSelection
         * Programmatically opens/closes the plugins interface as if user had clicked it open
         *
         *
         */
        _toggleSelection: function () {
            var icon = this.getElement().find('div.header-icon'),
                content = this.getElement().find('div.content');

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
         * @private @method _getBottomLayer
         * Returns the bottom-most selected layer if any
         *
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _getBottomLayer: function () {
            var bottomIdx = 0,
                allSelectedLayers =
                    this.getSandbox().findAllSelectedMapLayers();

            if (allSelectedLayers && allSelectedLayers.length) {
                return allSelectedLayers[bottomIdx];
            }
            return null;
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
                conf = me.getConfig(),
                currentBottom = me._getBottomLayer(),
                currentBottomId = '',
                currentSelection = me.getElement().find('div.currentSelection'),
                newSelection =
                    me.getSandbox().findMapLayerFromSelectedMapLayers(
                        newSelectionId
                    ),
                isBaseLayer = true;

            if (newSelectionId === currentSelection.attr('data-layerId')) {
                // user clicked already selected option, do nothing
                return;
            }
            // switch bg layer (no need to call update on ui, we should catch the event)
            // - check if current bottom layer exists & is in our list (if so, remove)
            if (currentBottom) {
                currentBottomId += currentBottom.getId();
                if (jQuery.inArray(currentBottomId, conf.baseLayers) > -1) {
                    me.getSandbox().postRequestByName(
                        'RemoveMapLayerRequest',
                        [currentBottomId]
                    );
                }
            }
            // - check if new selection is already selected, remove if so as rearrange doesn't seem to work
            if (newSelection) {
                me.getSandbox().postRequestByName(
                    'RemoveMapLayerRequest',
                    [newSelectionId]
                );
            } else {
                newSelection =
                    me.getSandbox().findMapLayerFromAllAvailable(
                        newSelectionId
                    );
                isBaseLayer = (newSelection ? newSelection.isBaseLayer() : true);
            }

            me.getSandbox().postRequestByName(
                'AddMapLayerRequest',
                [newSelectionId, false, isBaseLayer]
            );
            // - move new selection to bottom (see layerselection._layerOrderChanged(item))
            me.getSandbox().postRequestByName(
                'RearrangeSelectedMapLayerRequest',
                [newSelectionId, 0]
            );
            // toggle dropdown open/closed.
            // won't bother with dropdown being on or off here
            me._toggleSelection();
        },

        /**
         * @private @method  _updateUISelection
         * Updates UI selection:
         * - Fetches new bottom baselayer
         * - LI element of the selected layer gets the 'selected'-class
         * - currentSelection gets filled with the new selection's information
         *
         */
        _updateUISelection: function (force) {
            // TODO:
            // - check what the new selection is (dig up bottom layer...)
            var me = this,
                conf = me.getConfig(),
                newSelection = me._getBottomLayer(),
                newSelectionId = '',
                newSelectionName = '',
                listElement,
                currentSelection = me.getElement().find('div.currentSelection'),
                icon;

            // find bottom-most bg layer
            if (newSelection) {
                newSelectionId += newSelection.getId();
                newSelectionName = newSelection.getName();
            }
            // use attr(data-foo) instead of data(foo) so old jquery works...
            if (!force && newSelectionId === currentSelection.attr('data-layerId')) {
                // Update isn't forced and selection hasn't changed
                return;
            }
            // - go through LIs, toggle selected class
            me.getElement().find('li').each(function (index) {
                listElement = jQuery(this);
                listElement.toggleClass(
                    'selected',
                    listElement.attr('data-layerId') === newSelectionId
                );
            });
            // - update currentSelection with the new selection's information if it's in baseLayers
            // clean up current selection
            currentSelection.attr('data-layerId', '');
            currentSelection.attr('title', '');
            currentSelection.empty();
            if (jQuery.inArray(newSelectionId, conf.baseLayers) > -1) {
                currentSelection.attr('data-layerId', newSelectionId);
                currentSelection.attr('title', newSelectionName);
                currentSelection.html(newSelectionName);
            }
            icon = me.dropdownArrowTemplate.clone();
            if (me.getElement().find('div.content').hasClass('open')) {
                icon.removeClass(
                    'icon-arrow-white-right'
                ).addClass(
                    'icon-arrow-white-down'
                );
            }
            currentSelection.prepend(icon);
            if (conf) {
                /* TODO is there any tool style to be configured?
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, me.getElement());
                }
                */
                if (conf.font) {
                    me.changeFont(conf.font, me.getElement());
                }
                if (conf.colorScheme) {
                    // TODO this'll be fun to implement with all the dynamic elements...
                    me.changeColorScheme(conf.colorScheme, me.getElement());
                }
            }
        },

        /**
         * @private @method  _createLayerSelectionElements
         * Creates LI elements for the bg layers.
         * These are used in both dropdown and list mode.
         *
         */
        _createLayerSelectionElements: function () {
            if (this.error) {
                return;
            }
            var me = this,
                element = me.getElement(),
                layer,
                layerIds = me.getConfig().baseLayers,
                list = element.find('ul'),
                listItem,
                i,
                selectionUpdateHandler = function () {
                    me._updateSelection(jQuery(this).attr('data-layerId'));
                };
            // remove children, this function is called on update
            list.empty();
            for (i = 0; i < layerIds.length; i += 1) {
                layer = me.getSandbox().findMapLayerFromAllAvailable(
                    layerIds[i]
                );
                if (layer) {
                    listItem = jQuery('<li></li>');
                    listItem.attr(
                        'data-layerId',
                        layerIds[i]
                    ).attr(
                        'title',
                        layer.getName()
                    ).html(
                        layer.getName()
                    );
                    list.append(listItem);
                    listItem.bind('click', selectionUpdateHandler);
                }
            }
            // force update selection
            me._updateUISelection(true);
        },

        /**
         * @private @method  _createControlElement
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left'
         * selector. If it exists, checks if there are other bundles and writes
         * itself as the first one. If the placeholder doesn't exist the plugin
         * is written to the mapmodules div element.
         *
         *
         */
        _createControlElement: function () {
            var me = this,
                conf = me.getConfig(),
                el,
                containerClasses = 'bottom center',
                position = 0;

            if (me.error) {
                // No baseLayers in config, show error.
                el = me.errorTemplate.clone();
            } else {
                el = me.template.clone();
                el.find('div.currentSelection').bind(
                    'click',
                    function () {
                        me._toggleSelection();
                    }
                );

                el.find('div.content').toggleClass(
                    'dropdown',
                    conf && conf.showAsDropdown
                );
            }

            return el;
        },

        refresh: function () {
            this._createLayerSelectionElements();
        },

        /**
         * @public @method changeColorScheme
         * Changes the color scheme of the plugin
         *
         * @param {Object} colorScheme object containing the color settings for the plugin
         *      {
         *          buttonColor: <Text color for buttons>,
         *          buttonBackgroundColor: <Background color for buttons>,
         *          buttonSelectedColor: <Text color for selected buttons>,
         *          buttonSelectedBackgroundColor: <Background color for selected buttons>
         *          buttonBorderColor: <Border color for dropdown buttons>
         *      }
         * @param {jQuery} div
         *
         */
        changeColorScheme: function (colorScheme, div) {
            div = div || this.getElement();

            if (!div || !colorScheme) {
                return;
            }

            // Change the color of the list items
            div.find('li').css({
                'background-color': colorScheme.buttonBackgroundColor,
                'color': colorScheme.buttonColor
            }).filter('.selected').css({
                'background-color': colorScheme.buttonSelectedBackgroundColor,
                'color': colorScheme.buttonSelectedColor
            });
            div.find('.dropdown li').css({
                'background-color': colorScheme.buttonSelectedBackgroundColor,
                'color': colorScheme.buttonSelectedColor,
                'border-color': colorScheme.buttonBorderColor
            });

            // Change the color of the current selection
            div.find('div.currentSelection').css({
                'background-color': colorScheme.buttonBackgroundColor,
                'color': colorScheme.buttonColor
            });
        },

        /**
         * @method changeFont
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @param {String} fontId
         * @param {jQuery} div
         *
         */
        changeFont: function (fontId, div) {
            div = div || this.getElement();

            if (!div || !fontId) {
                return;
            }

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, [div]);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
