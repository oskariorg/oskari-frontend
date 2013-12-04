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
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me.element = undefined;
        me.conf = config;
        me.initialSetup = true;
        me.templates = {};
    }, {
        /** @static @property __name module name */
        __name: 'LayerSelectionPlugin',

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
            var me = this;
            me.templates.main = jQuery("<div class='mapplugin layerselection'>" +
                '<div class="header"><div class="header-icon icon-arrow-white-right"></div></div>' +
                '<div class="content"><div class="layers"></div><div class="baselayers"></div></div>' +
                "</div>");
            me.templates.layer = jQuery("<div class='layer'><label><span></span></label></div>");
            me.templates.checkbox = jQuery("<input type='checkbox' />");
            me.templates.radiobutton = jQuery("<input type='radio' name='defaultBaselayer'/>");
            me.templates.baseLayerHeader = jQuery('<div class="baseLayerHeader"></div>');

            me.templates.headerArrow = jQuery('<div class="styled-header-arrow"></div>');
            me.templates.contentHeader = jQuery('<div class="content-header"><div class="content-header-title"></div><div class="content-close icon-close-white"></div></div>');
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
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();
            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }

            me._createUI();
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
            var me = this,
                p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p) && me._sandbox) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);

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
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Removes the layer from selection
             */
            'AfterMapLayerRemoveEvent': function (event) {
                this.removeLayer(event.getMapLayer());
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Adds the layer to selection
             */
            'AfterMapLayerAddEvent': function (event) {
                this.addLayer(event.getMapLayer());
            },

            /**
             * @method MapModulePlugin_MapLayerVisibilityRequest
             * refreshes checkbox state based on visibility
             */
            'MapLayerVisibilityChangedEvent': function (event) {
                this.updateLayer(event.getMapLayer());
            },

            /**
             * @method AfterMapMoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
             *
             * Adds the layer to selection
             */
            'AfterMapMoveEvent': function (event) {
                var i,
                    layer;
                // setup initial state here since we are using selected layers to create ui
                // and plugin is started before any layers have been added
                if (this.initialSetup) {
                    this.initialSetup = false;

                    // reacting to conf
                    if (this.conf && this.conf.baseLayers) {
                        for (i = 0; i < this.conf.baseLayers.length; i += 1) {
                            layer = this._sandbox.findMapLayerFromSelectedMapLayers(this.conf.baseLayers[i]);
                            this.addBaseLayer(layer);
                        }
                        if (this.conf.defaultBaseLayer) {
                            this.selectBaseLayer(this.conf.defaultBaseLayer);
                        }
                    }
                }
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
            var baseLayersDiv = this.element.find('div.content div.baselayers'),
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
        addLayer: function (layer) {
            var me = this,
                content = this.element.find('div.content'),
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
                input = div.find('input'),
                blnVisible = layer.isVisible();
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
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
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
            var sandbox = this._sandbox,
                visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest'),
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
            div.remove();
            delete this.layerRefs[layer.getId()];
        },
        /**
         * @method addBaseLayer
         * Assumes that the layer is already added as normal layer and moves it to being a base layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        addBaseLayer: function (layer) {
            if (!layer || !layer.getId) {
                return;
            }
            var div = this.layerRefs[layer.getId()];
            div.remove();

            var input = div.find('input');
            input.remove();
            input = this.templates.radiobutton.clone();
            input.attr('value', layer.getId());

            var me = this;
            input.bind('change', function (evt) {
                me._changedBaseLayer();
            });

            div.find('span').before(input);


            var baseLayersDiv = this.element.find('div.content div.baselayers');
            // add text if first selection available
            if (baseLayersDiv.find('div.layer').length === 0) {
                var pluginLoc = this.getMapModule().getLocalization('plugin'),
                    myLoc = pluginLoc[this.__name],
                    header = this.templates.baseLayerHeader.clone();
                header.append(myLoc.chooseDefaultBaseLayer);
                baseLayersDiv.parent().find(".baseLayerHeader").remove();
                baseLayersDiv.before(header);
                input.attr('checked', 'checked');
            }
            baseLayersDiv.append(div);
            me._changedBaseLayer();
        },
        /**
         * @method removeBaseLayer
         * Assumes that the layer is already added as base layer and moves it to being a normal layer
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer} layer layer to move
         */
        removeBaseLayer: function (layer) {
            var div = this.layerRefs[layer.getId()];
            div.remove();

            var input = div.find('input');
            var isActive = input.is(':checked');
            input.remove();
            input = this.templates.checkbox.clone();
            input.attr('value', layer.getId());
            if (isActive) {
                input.attr('checked', 'checked');
            }
            this._bindCheckbox(input, layer);
            div.find('span').before(input);

            // default back as visible when returning from baselayers
            var layersDiv = this.element.find('div.content div.layers');
            layersDiv.append(div);
            this._setLayerVisible(layer, true);

            // remove text if nothing to select 
            var baseLayersDiv = this.element.find('div.content div.baselayers'),
                baseLayers = baseLayersDiv.find('div.layer');
            if (baseLayers.length === 0) {
                var baselayerHeader = this.element.find('div.content div.baseLayerHeader');
                baselayerHeader.remove();
            } else {
                var checked = baseLayers.find('input:checked');
                if (checked.length === 0) {
                    // if the selected one was removed -> default to first
                    jQuery(baseLayers.find('input').get(0)).attr('checked', 'checked');
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
                sandbox = me._sandbox,
                values = me.getBaseLayers(),
                i,
                layerId,
                layer;
            for (i = 0; i < values.baseLayers.length; i += 1) {
                layerId = values.baseLayers[i];
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
                if (layer !== null && layer !== undefined) {
                    // Numeric layer IDs are Numbers for some reason...
                    me._setLayerVisible(layer, (values.defaultBaseLayer + '' === layerId + ''));
                }
            }
            // send Request to rearrange layers
            var reqName = 'RearrangeSelectedMapLayerRequest',
                builder = sandbox.getRequestBuilder(reqName),
                request = builder(values.defaultBaseLayer, 0);
            sandbox.request(me, request);
        },
        /**
         * @method setupLayers
         * Adds all the maps selected layers to the plugins selection menu.
         */
        setupLayers: function () {
            var me = this;
            delete this.layerRefs;
            this.layerRefs = {};

            var layers = this._sandbox.findAllSelectedMapLayers(),
                i;
            for (i = 0; i < layers.length; i += 1) {
                me.addLayer(layers[i]);
            }
        },
        /**
         * @method openSelection
         * Programmatically opens the plugins interface as if user had clicked it open
         */
        openSelection: function () {
            var icon = this.element.find('div.header div.header-icon'),
                content;
            icon.removeClass('icon-arrow-white-right');
            icon.addClass('icon-arrow-white-down');
            content = this.element.find('div.content').show();
        },
        /**
         * @method closeSelection
         * Programmatically closes the plugins interface as if user had clicked it close
         */
        closeSelection: function () {
            var icon = this.element.find('div.header div.header-icon'),
                content;
            icon.removeClass('icon-arrow-white-down');
            icon.addClass('icon-arrow-white-right');
            content = this.element.find('div.content').hide();
        },
        /**
         * @method getBaseLayers
         * Returns list of the current base layers and which one is selected
         * @return {Object} returning object has property baseLayers as a {String[]} list of base layer ids and
         * {String} defaultBase as the selected base layers id
         */
        getBaseLayers: function () {
            var inputs = this.element.find('div.content div.baselayers div.layer input'),
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

        /**
         * Sets the location of the layerselectio.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location = location;

            // reset plugin if active
            if (me.element) {
                me.stopPlugin();
                me.startPlugin();
            }
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
            var me = this,
                containerClasses = 'top right',
                position = 3;

            if (!me.element) {
                me.element = me.templates.main.clone();
            }
            var pluginLoc = me.getMapModule().getLocalization('plugin', true),
                myLoc = pluginLoc[me.__name],
                header = me.element.find('div.header');
            header.append(myLoc.title);

            header.bind('click', function () {
                var content = me.element.find('div.content');
                if (content.is(':hidden')) {
                    me.openSelection();
                } else {
                    me.closeSelection();
                }
            });
            me.closeSelection();

            me.setupLayers();

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            //parentContainer.append(me.element);
            me.getMapModule().setMapControlPlugin(me.element, containerClasses, position);

            if (me.conf && me.conf.toolStyle) {
                me.changeToolStyle(me.conf.toolStyle, me.element);
            }

            if (me.conf && me.conf.font) {
                me.changeFont(me.conf.font, me.element);
            }

            if (me.conf && me.conf.colourScheme) {
                me.changeColourScheme(me.conf.colourScheme, me.element);
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
            div = div || this.element;

            if (!div || !styleName) {
                return;
            }

            var self = this,
                pluginLoc = this.getMapModule().getLocalization('plugin', true),
                header = div.find('div.header'),
                headerArrow = this.templates.headerArrow.clone(),
                content = div.find('div.content'),
                contentHeader = this.templates.contentHeader.clone(),
                resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/layers/images/',
                bgImg = imgPath + 'map-layer-button-' + styleName + '.png';

            div.addClass('published-styled-layerselector');
            content.addClass('published-styled-layerselector-content');
            header.addClass('published-styled-layerselector-header');

            content.find('div.content-header').remove();
            content.find('div.styled-header-arrow').remove();
            contentHeader.find('div.content-header-title').append(pluginLoc[this.__name].title);
            content.prepend(contentHeader);
            content.prepend(headerArrow);

            contentHeader.find('div.content-close').on('click', function () {
                self.closeSelection();
            });

            content.addClass('layerselection-styled-content');

            // Set the styling to the content div based on the tool style.
            this.getMapModule().changeCssClasses(
                'oskari-publisher-layers-' + styleName,
                /oskari-publisher-layers-/,
                [content]
            );
            // Set the styling of the header as well since the border rounding affects them
            this.getMapModule().changeCssClasses(
                'oskari-publisher-layers-header-' + styleName,
                /oskari-publisher-layers-header-/,
                [contentHeader]
            );

            header.empty();
            header.css({
                'background-image': 'url("' + bgImg + '")'
            });

            // Pretty fugly, but needed here since we're modifying the DOM and
            // all the style changes disappear like Clint Eastwood rides into the sunset.
            if (this.conf && this.conf.colourScheme) {
                this.changeColourScheme(this.conf.colourScheme, this.element);
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
            div = div || this.element;

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