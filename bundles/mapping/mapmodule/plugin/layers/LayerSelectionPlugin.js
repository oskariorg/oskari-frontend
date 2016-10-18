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
        me._index = 70;
        me._name = 'LayerSelectionPlugin';

        me.initialSetup = true;
        me.templates = {};
        me._mobileDefs = {
            buttons:  {
                'mobile-layerselection': {
                    iconCls: 'mobile-layers',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function () {
                        if (me.popup && me.popup.isVisible()) {
                            var sandbox = me.getSandbox();
                            sandbox.postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
                            me.popup.close(true);
                            me.popup = null;
                        } else {
                            me.openSelection(true);
                        }
                    },
                    toggleChangeIcon: true
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

            me.templates.contentHeader = jQuery(
                '<div class="content-header">' +
                '  <div class="content-header-title"></div>' +
                '  <div class="content-close icon-close-white"></div>' +
                '</div>'
            );
            this.setupLayers();
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
                },
                MapSizeChangedEvent: function (evt) {
                    this._handleMapSizeChanged({width:evt.getWidth(), height:evt.getHeight()});
                }
            };
        },
        _handleMapSizeChanged: function(size, isMobile){
            var me = this,
                mobile = isMobile || Oskari.util.isMobile();
            if(!mobile &&  me.layerContent) {
                me.layerContent.find('div.layers-content').css('max-height', (0.75 * size.height) + 'px');
            }
        },
        _setLayerToolsEditModeImpl: function () {
            if(!this.getElement()) {
                return;
            }
            var header = this.getElement().find('div.header');
            header.unbind('click');
            if (this.inLayerToolsEditMode() && me.popup.isVisible()) {
                me.popup.getJqueryContent().detach();
                me.popup.close(true);
                me.popup = null;
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
            if(!this.layerContent) {
                return;
            }
            var baseLayersDiv = this.layerContent.find(
                    'div.baselayers'
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
                // already added
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
            me.sortLayers();
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
            if (!div) {
                return;
            }
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
        _rebindCheckboxes: function(){
            var me = this,
                sandbox = this.getSandbox();

            var reBind = function(el){
                var layerId = el.attr('value');
                var layer = sandbox.findMapLayerFromAllAvailable(layerId);
                if(layer) {
                    el.unbind('change');
                    me._bindCheckbox(el,layer);
                }
            };
            me.layerContent.find('input[type=radio]').each(function(){
                var input = jQuery(this);
                input.unbind('change');
                input.bind('change', function (evt) {
                    me._changedBaseLayer();
                });
            });
            me.layerContent.find('input[type=checkbox]').each(function(){
                reBind(jQuery(this));
            });
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
            if (!layer || !layer.getId) {
                return;
            }
            var div = me.layerRefs[layer.getId()];
            if (!div) {
                return;
            }
            if (div.parent().hasClass('baselayers')) {
                return;
            }
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
        sortLayers: function (forced) {
            if(!this.layerContent) {
                // not on screen yet
                return;
            }
            var me = this;
            if(!forced) {
                // this is called multiple times in sequence.
                // just do it once after calls have stopped for a while
                clearTimeout(this._sortTimer);
                this._sortTimer = setTimeout(function() {
                    me.sortLayers(true);
                }, 500);
                return;
            }
            var selectedLayers = this.getSandbox().findAllSelectedMapLayers(),
                selectedBaseLayers = [],
                layersDiv = this.layerContent.find('div.layers'),
                layers = layersDiv.find('div.layer').detach(),
                baseLayersDiv = this.layerContent.find(
                    'div.baselayers'
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
        openSelection: function (isMobile) {
            var me = this,
                conf = me.getConfig(),
                mapmodule = me.getMapModule(),
                div = this.getElement(),
                popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');

            if (isMobile || div.hasClass('published-styled-layerselector')) {
                var popupTitle = me._loc.title,
                    el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-layerselection'),
                    topOffsetElement = jQuery('div.mobileToolbarDiv'),
                    themeColours = mapmodule.getThemeColours();

                me.popup = popupService.createPopup();
                popupService.closeAllPopups(true);
                me.popup.createCloseIcon();

                me.popup.show(popupTitle, me.layerContent);
                me.popup.addClass('mapplugin layerselectionpopup');
                if (isMobile && el.length) {
                    me.popup.moveTo(el, 'bottom', true, topOffsetElement);
                    me.popup.onClose(function() {
                        me._resetMobileIcon(el, me._mobileDefs.buttons['mobile-layerselection'].iconCls);
                    });
                    var popupCloseIcon = (Oskari.util.isDarkColor(themeColours.activeColour)) ? 'icon-close-white' : undefined;
                    me.popup.setColourScheme({
                        'bgColour': themeColours.activeColour,
                        'titleColour': themeColours.activeTextColour,
                        'iconCls': popupCloseIcon
                    });

                    me.popup.addClass('mobile-popup');
                } else {
                    me.popup.moveTo(me.getElement(), 'bottom', true);
                    var popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
                    me.popup.setColourScheme({
                        'bgColour': themeColours.backgroundColour,
                        'titleColour': themeColours.textColour,
                        'iconCls': popupCloseIcon
                    });
                }
                me.changeFont(conf.font || this.getToolFontFromMapModule(), me.popup.getJqueryContent().parent().parent());
            } else {
                var icon = div.find('div.header div.header-icon'),
                    header = div.find('div.header'),
                    mapmodule = me.getMapModule(),
                    size = mapmodule.getSize();

                icon.removeClass('icon-arrow-white-right');
                icon.addClass('icon-arrow-white-down');
                div.append(me.layerContent);

                // fix layers content height
                me._handleMapSizeChanged(size, false);

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

            me._rebindCheckboxes();
        },
        /**
         * @method getBaseLayers
         * Returns list of the current base layers and which one is selected
         * @return {Object} returning object has property baseLayers as a {String[]} list of base layer ids and
         * {String} defaultBase as the selected base layers id
         */
        getBaseLayers: function () {
            var inputs = this.layerContent.find(
                    'div.baselayers div.layer input'
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
                if (me.popup && me.popup.isVisible()) {
                    me.popup.getJqueryContent().detach();
                    me.popup.close(true);
                    me.popup = null;
                    return;
                } else if (me.getElement().find('.content')[0]) {
                    me.closeSelection();
                } else {
                    me.openSelection();
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

            if (!me.layerContent) {
                me.layerContent = me.templates.layerContent.clone();
                me.setupLayers(undefined, el);
            }

            return el;
        },

        teardownUI : function() {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
            if (this.popup) {
                this.popup.close(true);
            }
        },

        /**
         * @method closeSelection
         * Programmatically closes the plugins interface as if user had clicked it close
         */
        closeSelection: function (el) {
            var element = el || this.getElement();
            if(!element) {
                return;
            }
            var icon = element.find('div.header div.header-icon');
            var header = element.find('div.header');

            icon.removeClass('icon-arrow-white-down');
            icon.addClass('icon-arrow-white-right');
            if (element.find('.content')[0]) {
                element.find('.content').detach();
            }
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            if(!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();
            me._element = me._createControlElement();
            if (!toolbarNotReady && mapInMobileMode) {
                me.changeToolStyle(null, me._element);
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                // TODO: redrawUI is basically refresh, move stuff here from refresh if needed
                me.refresh();
                this.addToPluginContainer(me._element);
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
                contentHeader = this.templates.contentHeader.clone(),
                resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/mapping/mapmodule/resources/images/',
                bgImg = imgPath + 'map-layer-button-' + styleName + '.png';

            header.empty();
            if (styleName !== null) {
                div.addClass('published-styled-layerselector');

                header.addClass('published-styled-layerselector-header');

                // Set the styling of the header as well since the border rounding affects them
                this.changeCssClasses(
                    'oskari-publisher-layers-header-' + styleName,
                    /oskari-publisher-layers-header-/, [contentHeader]
                );

                header.css({
                    'background-image': 'url("' + bgImg + '")'
                });

            } else {
                header.append(me.templates.defaultArrow.clone());
                header.append(me._loc.title);

                div.removeClass('published-styled-layerselector');

                header.removeClass('published-styled-layerselector-header');

                // Set the styling of the header as well since the border rounding affects them
                this.changeCssClasses(
                    '',
                    /oskari-publisher-layers-header-/, [contentHeader]
                );

                header.css({
                    'background-image': ''
                });
            }

            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
            );
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
