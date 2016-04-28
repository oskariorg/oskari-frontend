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
        me._index = 90;
        me._name = 'LayerSelectionPlugin';

        me.initialSetup = true;
        me.templates = {};
        me._mobileDefs = {
            buttons:  {
                'mobile-layerselection': {
                    iconCls: 'mobile-layers-light mobiletoolbar',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function () {
                        me.openSelection();
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
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
            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage(), true).plugin.LayerSelectionPlugin;
            me.templates.main = jQuery(
                '<div class="mapplugin layerselection">' +
                '  <div class="header">' +
                '    <div class="header-icon icon-arrow-white-right"></div>' +
                '  </div>' +
                '</div>');

            me.templates.layerContent = jQuery(
                '  <div class="content">' +
                '    <div class="layers-content">' +
                '        <div class="baselayers"></div>' +
                '        <div class="layers"></div>' +
                '    </div>' +
                '  </div>');
            //same as in main, only used when returning from some other layout to default (publisher)
            me.templates.defaultArrow = jQuery('<div class="header-icon icon-arrow-white-right"></div>');
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

            me.templates.layerHeader = jQuery(
                '<div class="layerHeader"></div>'
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

            var me = this;

            if (!me.layerContent) {
                me.layerContent = me.templates.layerContent.clone();
            }
            
            var layersDiv = me.layerContent.find('div.layers'),
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

            if (layersDiv.find('.layer').length > 0) {
                var pluginLoc = me.getMapModule().getLocalization('plugin'),
                    myLoc = pluginLoc[me._name],
                    header = me.templates.layerHeader.clone();

                header.append(myLoc.chooseOtherLayers);
                layersDiv.parent().find('.layerHeader').remove();
                layersDiv.before(header);
            }
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

            if (!me.layerContent) {
                me.layerContent = me.templates.layerContent.clone();
            }
            var baseLayersDiv = me.layerContent.find('.baselayers');

            // add text if first selection available
            if (baseLayersDiv.find('div.layer').length === 0) {
                var pluginLoc = me.getMapModule().getLocalization('plugin'),
                    myLoc = pluginLoc[me._name],
                    header = me.templates.baseLayerHeader.clone();

                header.append(myLoc.chooseDefaultBaseLayer);
                baseLayersDiv.parent().find('.baseLayerHeader').remove();
                baseLayersDiv.before(header);
                input.attr('checked', 'checked');
                baseLayersDiv.show();
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
            var me = this,
                conf = me.getConfig(),
                mapmodule = me.getMapModule(),
                div = this.getElement();

            if (me._uiMode === "mobile") {
                me.popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var popupTitle = me._loc.title;
                me.popup.addClass('mobile-popup');
                me.popup.setColourScheme({"headerColour": "#e6e6e6"});
                me.popup.show(popupTitle, me.layerContent);
                me.popup.createCloseIcon();
                var el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-layerselection');
                me.popup.moveTo(el, 'bottom', true);
            } else {
                var icon = div.find('div.header div.header-icon'),
                    header = div.find('div.header');
                
                icon.removeClass('icon-arrow-white-right');
                icon.addClass('icon-arrow-white-down');
                div.append(me.layerContent);

                var layersTitle = div.find('.content-header');
                var layersTitleHeight = 0;

                if(layersTitle.length==0){
                    layersTitle = div.find('.header');
                }

                // Get layers title height
                if(layersTitle.length>0){
                    layersTitleHeight = layersTitle.outerHeight() + layersTitle.position().top + layersTitle.offset().top;
                }
            }
        },

        /**
         * @method closeSelection
         * Programmatically closes the plugins interface as if user had clicked it close
         */
        closeSelection: function (el) {
            var element = el || this.getElement(),
                icon = element.find('div.header div.header-icon'),
                header = element.find('div.header');

            icon.removeClass('icon-arrow-white-down');
            icon.addClass('icon-arrow-white-right');
            if (element.find('.content')[0]) {
                element.find('.content').detach();
            }
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
                var content = me.getElement().find('.content');
                if (!content[0]) {
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

            if (!me.layerContent) {
                me.layerContent = me.templates.layerContent.clone();
                me.setupLayers(undefined, el);
            }

            return el;
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} modeChanged is the ui mode changed (mobile/desktop)
         */
        createPluginUI: function(mapInMobileMode, modeChanged) {
            var me = this,
                sandbox = me.getSandbox();

            //remove old element
            if (modeChanged && me._element) {
                me.closeSelection();

                me.getMapModule().removeMapControlPlugin(
                    me._element,
                    me.inLayerToolsEditMode(),
                    me._uiMode
                );

                if (me.popup) {
                    me.popup.close(true);
                }

            }

            var toolbar = me.getMapModule().getMobileToolbar();
            var reqBuilder = sandbox.getRequestBuilder(
                'Toolbar.RemoveToolButtonRequest'
            );
            if (reqBuilder) {
                for (var tool in me._mobileDefs.buttons) {
                    var buttonConf = me._mobileDefs.buttons[tool];
                    buttonConf.toolbarid = toolbar;
                    sandbox.request(me, reqBuilder(tool, me._mobileDefs.buttonGroup, toolbar));
                }
            }

            if (mapInMobileMode) {                
                var toolbar = me.getMapModule().getMobileToolbar();
                var reqBuilder = sandbox.getRequestBuilder(
                    'Toolbar.AddToolButtonRequest'
                );
                if (modeChanged) {
                    me._element = me._createControlElement();
                }
                me.changeToolStyle(null, me._element);

                if (reqBuilder) {
                    for (var tool in me._mobileDefs.buttons) {
                        var buttonConf = me._mobileDefs.buttons[tool];
                        buttonConf.toolbarid = toolbar;
                        sandbox.request(me, reqBuilder(tool, me._mobileDefs.buttonGroup, buttonConf));
                    }
                }
                
                me._uiMode = 'mobile';
            } else {
                if (modeChanged) {
                    me._element = me._createControlElement();
                }
                if(me._element && me.getLocation()) {
                    me.getMapModule().setMapControlPlugin(
                        me._element,
                        me.getLocation(),
                        me.getIndex()
                    );
                }

                me._uiMode = 'desktop';
                me.refresh();
            }
        },


        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                element = me.getElement(),
                mapModule = me.getMapModule();

            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, element);
                } else {
                    //not found -> use the style config obtained from the mapmodule.
                    var toolStyle = me.getToolStyleFromMapModule();
                    if (toolStyle !== null && toolStyle !== undefined) {
                        me.changeToolStyle(toolStyle, me.getElement());
                    }
                }

                if (conf.font) {
                    me.changeFont(conf.font, element);
                } else {
                    var font = me.getToolFontFromMapModule();
                    if (font !== null && font !== undefined) {
                        me.changeFont(font, element);
                    }
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
            var me = this;
            div = div || this.getElement();
            if (!div) {
                return;
            }

            var self = this,
                header = div.find('div.header'),
                headerArrow = this.templates.headerArrow.clone(),
                content = me.layerContent,
                contentHeader = this.templates.contentHeader.clone(),
                resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/mapping/mapmodule/resources/images/',
                bgImg = imgPath + 'map-layer-button-' + styleName + '.png';

            header.empty();
            if (styleName !== null) {
                div.addClass('published-styled-layerselector');
                content.addClass('published-styled-layerselector-content');
                content.addClass('layerselection-styled-content');
                header.addClass('published-styled-layerselector-header');

                // Set the styling to the content div based on the tool style.
                this.changeCssClasses(
                    'oskari-publisher-layers-' + styleName,
                    /oskari-publisher-layers-/, [content]
                );
                // Set the styling of the header as well since the border rounding affects them
                this.changeCssClasses(
                    'oskari-publisher-layers-header-' + styleName,
                    /oskari-publisher-layers-header-/, [contentHeader]
                );

                header.css({
                    'background-image': 'url("' + bgImg + '")'
                });

                content.find('div.content-header').remove();
                content.find('div.styled-header-arrow').remove();
                contentHeader.find('div.content-header-title').append(
                    this._loc.title
                );
                content.prepend(contentHeader);
                content.prepend(headerArrow);
            } else {
                header.append(me.templates.defaultArrow.clone());
                header.append(me._loc.title);

                div.removeClass('published-styled-layerselector');
                content.removeClass('published-styled-layerselector-content');
                content.removeClass('layerselection-styled-content');
                header.removeClass('published-styled-layerselector-header');

                content.find('div.content-header').remove();
                content.find('div.styled-header-arrow').remove();

                // Set the styling to the content div based on the tool style.
                this.changeCssClasses(
                    '',
                    /oskari-publisher-layers-/, [content]
                );
                // Set the styling of the header as well since the border rounding affects them
                this.changeCssClasses(
                    '',
                    /oskari-publisher-layers-header-/, [contentHeader]
                );

                header.css({
                    'background-image': ''
                });
            }
            contentHeader.find('div.content-close').on('click', function () {
                self.closeSelection();
            });
            // Pretty fugly, but needed here since we're modifying the DOM and
            // all the style changes disappear like Clint Eastwood rides into the sunset.
            var conf = this.getConfig();
            if (conf && conf.colourScheme) {
                this.changeColourScheme(conf.colourScheme, this.getElement());
            }

            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
            );
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

            this.changeCssClasses(classToAdd, testRegex, [div]);
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
