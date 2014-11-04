/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides a maplayer selection "dropdown" on top of the map.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginLayerSelectionPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
        me._defaultLocation = 'top left';
        me._index = 3;
        me._name = 'LayerSelectionPlugin';

        me.initialSetup = true;
        me.templates = {};
    }, {
        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         *
         */
        _initImpl: function () {
            var me = this;
            me.templates.main = jQuery(
                '<div class="mapplugin layerselection">' +
                '  <div class="header">' +
                '    <div class="header-icon icon-arrow-white-right"></div>' +
                '  </div>' +
                '  <div class="content">' +
                '    <div class="layers"></div>' +
                '    <div class="baselayers"></div>' +
                '  </div>' +
                '</div>');
            me.templates.layer = jQuery(
                '<div class="layer"><label><span></span></label></div>'
            );
            me.templates.checkbox = jQuery('<input type="checkbox" />');
            me.templates.radiobutton = jQuery(
                '<input type="radio" name="defaultBaselayer"/>'
            );
            me.templates.baseLayerHeader = jQuery(
                '<div class="baseLayerHeader"></div>'
            );

            me.templates.headerArrow = jQuery(
                '<div class="styled-header-arrow"></div>'
            );
            me.templates.contentHeader = jQuery(
                '<div class="content-header">' +
                '  <div class="content-header-title"></div>' +
                '  <div class="content-close icon-close-white"></div>' +
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
                 * @method AfterMapLayerRemoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
                 *
                 * Removes the layer from selection
                 */
                AfterMapLayerRemoveEvent: function (event) {
                    this.removeLayer(event.getMapLayer());
                },
                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapLayerAddEvent: function (event) {
                    this.addLayer(event.getMapLayer());
                    this._checkBaseLayers(event.getMapLayer());
                },

                /**
                 * @method MapModulePlugin_MapLayerVisibilityRequest
                 * refreshes checkbox state based on visibility
                 */
                MapLayerVisibilityChangedEvent: function (event) {
                    this.updateLayer(event.getMapLayer());
                },

                /**
                 * @method AfterMapMoveEvent
                 * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
                 *
                 * Adds the layer to selection
                 */
                AfterMapMoveEvent: function (event) {
                    this._checkBaseLayers();
                },
                /**
                 * @method AfterRearrangeSelectedMapLayerEvent
                 * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
                 *
                 * Rearranges layers
                 */
                AfterRearrangeSelectedMapLayerEvent: function (event) {
                    // Layer order has been changed by someone, resort layers
                    if (event._creator !== this.getName()) {
                        this.sortLayers();
                    }
                }
            };
        },

        _setLayerToolsEditModeImpl: function () {
            var header = this.getElement().find('div.header');
            header.unbind('click');
            if (this.inLayerToolsEditMode()) {
                this.closeSelection();
            } else {
                this._bindHeader(header);
            }
        },

        /**
         * @method preselectLayers
         * Does nothing, protocol method for mapmodule-plugin
         */
        preselectLayers: function () {},

        /**
         * @method selectBaseLayer
         * Tries to find given layer from baselayers and select it programmatically
         * @param {String} layerId id for layer to select
         */
        selectBaseLayer: function (layerId) {
            var baseLayersDiv = this.getElement().find(
                    'div.content div.baselayers'
                ),
                input;

            if (!baseLayersDiv || baseLayersDiv.length === 0) {
                return;
            }
            input = baseLayersDiv.find('input[value=' + layerId + ']');
            input.attr('checked', 'checked');
            this._changedBaseLayer();
        },

        /**
         * @method addLayer
         * Adds given layer to the selection
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to add
         */
        addLayer: function (layer, el) {
            if (this.layerRefs[layer.getId()]) {
                return;
            }
            var me = this,
                element = el || this.getElement(),
                content = element.find('div.content'),
                layersDiv = content.find('div.layers'),
                div = this.templates.layer.clone(),
                input = this.templates.checkbox.clone();

            div.find('span').append(layer.getName());

            input.attr('value', layer.getId());

            if (layer.isVisible()) {
                input.attr('checked', true);
            } else {
                input.attr('checked', false);
            }
            this._bindCheckbox(input, layer);

            div.find('span').before(input);
            this.layerRefs[layer.getId()] = div;
            layersDiv.append(div);
        },

        /**
         * @method updateLayer
         * Updates input state (checked or not) for the layer according to layer visibility
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to add
         */
        updateLayer: function (layer) {
            var div = this.layerRefs[layer.getId()],
                blnVisible = layer.isVisible(),
                input;
            /*if (!div) {
                return;
            }*/
            input = div.find('input');
            if (blnVisible) {
                if (!input.is(':checked')) {
                    input.attr('checked', 'checked');
                }
            } else {
                if (input.is(':checked')) {
                    input.removeAttr('checked');
                }
            }
        },

        /**
         * @method _bindCheckbox
         * Binds given checkbox to control given layers visibility
         * @param {jQuery} input input to bind
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to control
         * @private
         */
        _bindCheckbox: function (input, layer) {
            var me = this;

            input.change(function () {
                var checkbox = jQuery(this),
                    isChecked = checkbox.is(':checked');
                if (isChecked) {
                    // send request to show map layer
                    me._setLayerVisible(layer, true);
                } else {
                    // send request to hide map layer
                    me._setLayerVisible(layer, false);
                }
            });
        },
        /**
         * @method _setLayerVisible
         * Makes given layer visible or hides it
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to control
         * @param {Boolean} blnVisible true to show, false to hide
         * @private
         */
        _setLayerVisible: function (layer, blnVisible) {
            var sandbox = this.getSandbox(),
                visibilityRequestBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.MapLayerVisibilityRequest'
                ),
                request = visibilityRequestBuilder(layer.getId(), blnVisible);

            sandbox.request(this, request);
        },
        /**
         * @method removeLayer
         * Removes given layer from the selection
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to remove
         */
        removeLayer: function (layer) {
            var div = this.layerRefs[layer.getId()];
            if (div) {
                div.remove();
            }
            delete this.layerRefs[layer.getId()];
        },
        /**
         * @method addBaseLayer
         * Assumes that the layer is already added as normal layer and moves it to being a base layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        addBaseLayer: function (layer) {
            var me = this;
            if (!layer || !layer.getId || !me.getElement()) {
                return;
            }
            var div = me.layerRefs[layer.getId()];
            if (div.parent().hasClass('baselayers')) {
                return;
            }
            /*if (!div) {
                return;
            }*/
            div.remove();

            var input = div.find('input');
            input.remove();
            input = me.templates.radiobutton.clone();
            input.attr('value', layer.getId());
            input.bind('change', function (evt) {
                me._changedBaseLayer();
            });

            div.find('span').before(input);

            var baseLayersDiv = me.getElement().find(
                'div.content div.baselayers'
            );
            // add text if first selection available
            if (baseLayersDiv.find('div.layer').length === 0) {
                var pluginLoc = me.getMapModule().getLocalization('plugin'),
                    myLoc = pluginLoc[me._name],
                    header = me.templates.baseLayerHeader.clone();

                header.append(myLoc.chooseDefaultBaseLayer);
                baseLayersDiv.parent().find('.baseLayerHeader').remove();
                baseLayersDiv.before(header);
                input.attr('checked', 'checked');
            }
            baseLayersDiv.append(div);
            me.layerRefs[layer.getId()] = div;
            me._changedBaseLayer();
            me.sortLayers();
        },
        /**
         * @method removeBaseLayer
         * Assumes that the layer is already added as base layer and moves it to being a normal layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        removeBaseLayer: function (layer) {
            var div = this.layerRefs[layer.getId()];
            div.remove();

            var input = div.find('input'),
                isActive = input.is(':checked');
            input.remove();
            input = this.templates.checkbox.clone();
            input.attr('value', layer.getId());
            if (isActive) {
                input.attr('checked', 'checked');
            }
            this._bindCheckbox(input, layer);
            div.find('span').before(input);

            // default back as visible when returning from baselayers
            var layersDiv = this.getElement().find('div.content div.layers');
            layersDiv.append(div);
            this._setLayerVisible(layer, true);

            // remove text if nothing to select 
            var baseLayersDiv = this.getElement().find(
                    'div.content div.baselayers'
                ),
                baseLayers = baseLayersDiv.find('div.layer');
            if (baseLayers.length === 0) {
                var baselayerHeader = this.getElement().find(
                    'div.content div.baseLayerHeader'
                );
                baselayerHeader.remove();
            } else {
                this.sortLayers();
                var checked = baseLayers.find('input:checked');
                if (checked.length === 0) {
                    // if the selected one was removed -> default to first
                    jQuery(baseLayers.find('input').get(0)).attr(
                        'checked',
                        'checked'
                    );
                    // notify baselayer change
                    this._changedBaseLayer();
                }
            }
        },
        /**
         * @method _changedBaseLayer
         * Checks which layer is currently the selected base layer, shows it and hides the rest
         * @private
         */
        _changedBaseLayer: function () {
            var me = this,
                sandbox = me.getSandbox(),
                values = me.getBaseLayers(),
                i,
                layerId,
                layer;

            for (i = 0; i < values.baseLayers.length; i += 1) {
                layerId = values.baseLayers[i];
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
                if (layer !== null && layer !== undefined) {
                    // Numeric layer IDs are Numbers for some reason...
                    me._setLayerVisible(
                        layer,
                        ((values.defaultBaseLayer + '') === (layerId + ''))
                    );
                }
            }
            // FIXME values.defaultBaseLayer is sometimes empty...
            // send Request to rearrange layers
            var reqName = 'RearrangeSelectedMapLayerRequest',
                builder = sandbox.getRequestBuilder(reqName),
                request = builder(values.defaultBaseLayer, 0);

            sandbox.request(me, request);
        },
        /**
         * @method sortLayers
         * Sort the plugins selection menu layers according to their actual order...
         * Note that baselayers are in alphabetical order as their order is
         * changed every time the active one is changed.
         */
        sortLayers: function () {
            var selectedLayers = this.getSandbox().findAllSelectedMapLayers(),
                selectedBaseLayers = [],
                layersDiv = this.getElement().find('div.content div.layers'),
                layers = layersDiv.find('div.layer').detach(),
                baseLayersDiv = this.getElement().find(
                    'div.content div.baselayers'
                ),
                baseLayers = baseLayersDiv.find('div.layer').detach(),
                i,
                layerId,
                inserted,
                insertLayer = function (index, element) {
                    var el = jQuery(element),
                        input = el.find('input');
                    if (input.val() === layerId) {
                        layersDiv.append(el);
                        inserted = true;
                        return false;
                    }
                },
                insertBaseLayer = function (index, element) {
                    var el = jQuery(element),
                        input = el.find('input');
                    if (input.val() === layerId) {
                        baseLayersDiv.append(el);
                        inserted = true;
                        return false;
                    }
                },
                sortBaseLayers = function (a, b) {
                    var ret = 0;
                    if (a.getName() < b.getName()) {
                        ret = -1;
                    } else if (a.getName() > b.getName()) {
                        ret = 1;
                    }
                    return ret;
                };

            // FIXME this is slow...
            for (i = selectedLayers.length - 1; i > -1; i -= 1) {
                layerId = selectedLayers[i].getId() + '';
                inserted = false;
                layers.each(insertLayer);
                if (!inserted) {
                    selectedBaseLayers.push(selectedLayers[i]);
                }
            }
            selectedBaseLayers.sort(sortBaseLayers);
            for (i = 0; i < selectedBaseLayers.length; i += 1) {
                layerId = selectedBaseLayers[i].getId() + '';
                baseLayers.each(insertBaseLayer);
            }

        },

        /**
         * @method setupLayers
         * Adds all the maps selected layers to the plugins selection menu.
         */
        setupLayers: function (baseLayers, el) {
            var me = this,
                element = el || me.getElement(),
                i;

            delete this.layerRefs;
            this.layerRefs = {};

            var layers = this.getSandbox().findAllSelectedMapLayers();

            for (i = layers.length - 1; i > -1; i -= 1) {
                me.addLayer(layers[i], element);
                if (baseLayers && jQuery.inArray(layers[i].getId() + '', baseLayers) > -1) {
                    me.addBaseLayer(layers[i]);
                }
            }
        },

        /**
         * @method openSelection
         * Programmatically opens the plugins interface as if user had clicked it open
         */
        openSelection: function () {
            var icon = this.getElement().find('div.header div.header-icon'),
                content;

            icon.removeClass('icon-arrow-white-right');
            icon.addClass('icon-arrow-white-down');
            this.getElement().find('div.content').show();
        },

        /**
         * @method closeSelection
         * Programmatically closes the plugins interface as if user had clicked it close
         */
        closeSelection: function (el) {
            var element = el || this.getElement(),
                icon = element.find('div.header div.header-icon'),
                content;

            icon.removeClass('icon-arrow-white-down');
            icon.addClass('icon-arrow-white-right');
            element.find('div.content').hide();
        },

        /**
         * @method getBaseLayers
         * Returns list of the current base layers and which one is selected
         * @return {Object} returning object has property baseLayers as a {String[]} list of base layer ids and
         * {String} defaultBase as the selected base layers id
         */
        getBaseLayers: function () {
            var inputs = this.getElement().find(
                    'div.content div.baselayers div.layer input'
                ),
                layers = [],
                checkedLayer = null,
                i,
                input;

            for (i = 0; i < inputs.length; i += 1) {
                input = jQuery(inputs[i]);
                layers.push(input.val());
                if (input.is(':checked')) {
                    checkedLayer = input.val();
                }
            }
            return {
                baseLayers: layers,
                defaultBaseLayer: checkedLayer
            };
        },

        _bindHeader: function (header) {
            var me = this;
            header.bind('click', function () {
                var content = me.getElement().find('div.content');
                if (content.is(':hidden')) {
                    me.openSelection();
                } else {
                    me.closeSelection();
                }
            });
        },

        /**
         * @private @method  _createControlElement
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
         * If it exists, checks if there are other bundles and writes itself as the first one.
         * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
         *
         *
         */
        _createControlElement: function () {
            var me = this,
                el  = me.templates.main.clone(),
                header = el.find('div.header');

            header.append(this._loc.title);

            me._bindHeader(header);

            me.closeSelection(el);

            me.setupLayers(undefined, el);

            return el;
        },

        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                element = me.getElement();

            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, element);
                }

                if (conf.font) {
                    me.changeFont(conf.font, element);
                }

                if (conf.colourScheme) {
                    me.changeColourScheme(conf.colourScheme, element);
                }
            }
        },

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {String} styleName
         * @param {jQuery} div
         */
        changeToolStyle: function (styleName, div) {
            div = div || this.getElement();

            if (!div) {
                return;
            }

            if (styleName === null) {
                // reset plugin if active
                if (this.getElement()) {
                    delete this._config.toolStyle;
                    this.stopPlugin();
                    this.startPlugin();
                }
                return;
            }

            var self = this,
                header = div.find('div.header'),
                headerArrow = this.templates.headerArrow.clone(),
                content = div.find('div.content'),
                contentHeader = this.templates.contentHeader.clone(),
                resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/layers/images/',
                bgImg = imgPath + 'map-layer-button-' + styleName + '.png';

            header.empty();
            if (styleName !== null) {
                div.addClass('published-styled-layerselector');
                content.addClass('published-styled-layerselector-content');
                content.addClass('layerselection-styled-content');
                header.addClass('published-styled-layerselector-header');
                // Set the styling to the content div based on the tool style.
                this.getMapModule().changeCssClasses(
                    'oskari-publisher-layers-' + styleName,
                    /oskari-publisher-layers-/, [content]
                );
                // Set the styling of the header as well since the border rounding affects them
                this.getMapModule().changeCssClasses(
                    'oskari-publisher-layers-header-' + styleName,
                    /oskari-publisher-layers-header-/, [contentHeader]
                );
                header.css({
                    'background-image': 'url("' + bgImg + '")'
                });
            } else {
                div.removeClass('published-styled-layerselector');
                content.removeClass('published-styled-layerselector-content');
                content.removeClass('layerselection-styled-content');
                header.removeClass('published-styled-layerselector-header');
                // Set the styling to the content div based on the tool style.
                this.getMapModule().changeCssClasses(
                    '',
                    /oskari-publisher-layers-/, [content]
                );
                // Set the styling of the header as well since the border rounding affects them
                this.getMapModule().changeCssClasses(
                    '',
                    /oskari-publisher-layers-header-/, [contentHeader]
                );

                header.css({
                    'background-image': ''
                });
            }

            content.find('div.content-header').remove();
            content.find('div.styled-header-arrow').remove();
            contentHeader.find('div.content-header-title').append(
                this._loc.title
            );
            content.prepend(contentHeader);
            content.prepend(headerArrow);

            contentHeader.find('div.content-close').on('click', function () {
                self.closeSelection();
            });

            // Pretty fugly, but needed here since we're modifying the DOM and
            // all the style changes disappear like Clint Eastwood rides into the sunset.
            var conf = this.getConfig();
            if (conf && conf.colourScheme) {
                this.changeColourScheme(conf.colourScheme, this.getElement());
            }
        },

        /**
         * Changes the colour scheme of the plugin
         *
         * @method changeColourScheme
         * @param {Object} colourScheme object containing the colour settings for the plugin
         *      {
         *          bgColour: <the background color of the gfi header>,
         *          titleColour: <the colour of the gfi title>,
         *          headerColour: <the colour of the feature name>,
         *          iconCls: <the icon class of the gfi close icon>
         *      }
         * @param {jQuery} div
         */
        changeColourScheme: function (colourScheme, div) {
            div = div || this.getElement();

            if (!div || !colourScheme) {
                return;
            }

            // Change the colour of the header background
            div.find('div.content-header').css({
                'background-color': colourScheme.bgColour
            });

            // Change the colour of the arrow
            div.find('div.styled-header-arrow').css({
                'border-bottom-color': colourScheme.bgColour
            });

            // Change the icon class
            var closeIcon = div.find('div.content-header div.content-close');
            closeIcon.removeClass('icon-close').removeClass('icon-close-white');
            closeIcon.addClass(colourScheme.iconCls);

            // Change the colour of the header font
            div.find('div.content-header div.content-header-title').css({
                'color': colourScheme.titleColour
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
            div = div || this.getElement();

            if (!div || !fontId) {
                return;
            }

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, [div]);
        },
        /**
         * @method _checkBaseLayers
         * Adds baseLayer(s) and selects one if it's the default base layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to handle (optional)
         */
        _checkBaseLayers: function (layer) {
            var i,
                me = this,
                conf = me.getConfig();
            // reacting to conf
            if (conf && conf.baseLayers) {
                // setup initial state here since we are using selected layers to create ui
                // and plugin is started before any layers have been added
                if (me.initialSetup && (layer === null || layer === undefined)) {
                    me.initialSetup = false;

                    for (i = 0; i < conf.baseLayers.length; i += 1) {
                        layer = me.getSandbox().findMapLayerFromSelectedMapLayers(
                            conf.baseLayers[i]
                        );
                        me.addBaseLayer(layer);
                    }
                    if (conf.defaultBaseLayer) {
                        me.selectBaseLayer(conf.defaultBaseLayer);
                    }
                } else if (layer !== null && layer !== undefined) {
                    for (i = 0; i < conf.baseLayers.length; i += 1) {
                        if (conf.baseLayers[i] == layer.getId()) {
                            me.addBaseLayer(layer);
                        }
                    }
                    if (conf.defaultBaseLayer == layer.getId()) {
                        me.selectBaseLayer(conf.defaultBaseLayer);
                    }
                }
            }
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
    });
