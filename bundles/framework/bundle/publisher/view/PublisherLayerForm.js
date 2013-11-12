/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayerForm
 *
 * Represents a layer listing view for the publisher as an Oskari.userinterface.component.AccordionPanel
 * and control for the published map layer selection plugin. Has functionality to promote layers
 * to users and let the user select base layers for the published map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} localization
     *      localization data in JSON format
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *      reference to component that created this view
     */

    function (localization, instance, pluginConfig) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.panel = null;
        me.plugin = null;
        me.isDataVisible = false;

        me.templateHelp     = jQuery('<div class="help icon-info"></div>');
        me.templateTool     = jQuery('<div class="tool"><input type="checkbox"/><label></label></div>');
        me.templateList     = jQuery('<ul class="selectedLayersList sortable" ' + 'data-sortable=\'{' + 'itemCss: "li.layer.selected", ' + 'handleCss: "div.layer-title" ' + '}\'></ul>');
        //me.templateLayer    = jQuery('<li class="tool"><input type="checkbox"/><label></label></li>');
        me.templateLayer    = jQuery('<li class="layer selected">' + '<div class="layer-info">' + '<div class="layer-tool-remove icon-close"></div>' + '<div class="layer-title"><h4></h4></div>' + '</div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');
        // footers are changed based on layer state
        var layerLoc = me.instance.getLocalization('layer');
        me.templateLayerFooterTools = 
            jQuery('<div class="left-tools">' + '<div class="layer-visibility">' + 
            '<a href="JavaScript:void(0);">' + layerLoc['hide'] + '</a>' + 
            '&nbsp;' + '<span class="temphidden" ' + 'style="display: none;">' + layerLoc['hidden'] + '</span>' + 
            '</div>' + '<div class="oskariui layer-opacity">' + 
            '<div class="layout-slider" id="layout-slider">' + '</div> ' + 
            '<div class="opacity-slider" style="display:inline-block">' + 
            '<input type="text" name="opacity-slider" class="opacity-slider opacity" id="opacity-slider" />%</div>' + 
            '</div> <br/><input class="baselayer" type="checkbox"/><label>'+layerLoc['selectAsBaselayer']+'</label>' + '</div>' + 
            '<div class="right-tools">' + '<div class="layer-rights"></div>' + 
            '<div class="object-data"></div>' + '<div class="layer-description">' + '</div></div>');
        me.templateLayerFooterHidden = jQuery('<p class="layer-msg">' + '<a href="JavaScript:void(0);">' + layerLoc['show'] + '</a> ' + layerLoc['hidden'] + '</p>');
        me.templateButtonsDiv = jQuery('<div class="buttons"></div>');

        me.config = {
            layers: {
                promote: [{
                    text: me.loc.layerselection.promote,
                    id: [24] // , 203
                }],
                preselect: ['base_35']
            }
        };
        me.pluginConfig = pluginConfig;
        if (!me.pluginConfig) {
            me.pluginConfig = {};
        }
        me.showLayerSelection = false;
        me._sliders = {};
    }, {
        /**
         * @method init
         * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered and
         * the Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
         */
        init: function () {
            if (!this.panel) {
                this.panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                this.panel.setTitle(this.loc.layers.label);
            }
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin', this.pluginConfig);
        },

        /**
         * Prepopulates the form/plugin with given data
         *
         * @method useConfig
         * @param {Object} pConfig data to prepopulate the form and plugin
         */
        useConfig: function (pConfig) {
            if (pConfig) {
                if (Object.prototype.toString.call(pConfig.baseLayers) === '[object Array]' &&
                        pConfig.baseLayers.length > 0) {

                    this.config.layers.preselect = pConfig.baseLayers;
                } else {
                    this.config.layers.preselect = [];
                }
                this.showLayerSelection = true;
                this.enablePlugin(true);
                this._populateMapLayerPanel();
            }
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            this._populateMapLayerPanel();
            return this.panel;
        },
        /**
         * Controls the LayerSelectionPlugin by calling start/stop.
         *
         * @method enablePlugin
         * @param {Boolean} true to start the plugin, false to stop it
         */
        enablePlugin: function (blnEnabled) {
            if (blnEnabled) {
                this.plugin.startPlugin(this.instance.sandbox);
                this.plugin.setLocation(this.plugin.conf.location.classes);
            } else {
                this.plugin.stopPlugin(this.instance.sandbox);
            }
        },
        /**
         * Returns the state of the plugin.
         *
         * @method isEnabled
         * @return {Boolean} true if the plugin is visible on screen.
         */
        isEnabled: function () {
            return this.showLayerSelection;
        },
        /**
         * Registers the plugin to MainMapModule
         *
         * @method start
         */
        start: function () {
            this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin', this.pluginConfig);
            var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.registerPlugin(this.plugin);
            if (this.showLayerSelection) {
                this.enablePlugin(true);
            }
        },
        /**
         * Unregisters the plugin from MainMapModule
         *
         * @method stop
         */
        stop: function () {
            this.enablePlugin(false);
            var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.unregisterPlugin(this.plugin);
        },

        /**
         * Returns the selections the user has done with the layer selection as an object.
         * If the plugin is enabled, the values will contain a property 'layerSelection':
         * {
         *     id : 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
         *     config : {
         *          baseLayers : [<array of layer ids that the user has selected as base layers>],
         *          defaultBaseLayer : <id of a base layer that should be selected by default>
         *     }
         * }
         * If the plugin is disabled, will return an empty object. Note that the user can select
         * any layer as a base layer for published map. It is not restricted to usual base layers.
         * Also base layer in published maps mean that it is the bottom layer and only one base layer
         * is visible at any time.
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var values = {};
            if (this.showLayerSelection) {
                values.layerSelection = {
                    id: 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                    config: this.pluginConfig
                };
                var pluginValues = this.plugin.getBaseLayers();
                if (pluginValues.defaultBaseLayer) {
                    values.layerSelection.config.baseLayers = pluginValues.baseLayers;
                    values.layerSelection.config.defaultBaseLayer = pluginValues.defaultBaseLayer;
                }
            }
            return values;
        },
        /**
         * Returns any errors found in validation (currently doesn't check anything) or an empty
         * array if valid. Error object format is defined in Oskari.userinterface.component.FormInput
         * validate() function.
         *
         * @method validate
         * @return {Object[]}
         */
        validate: function () {
            var errors = [];
            return errors;
        },

        /**
         * Returns the published map layer selection
         *
         * @method _getLayersList
         * @private
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         */
        _getLayersList: function () {
            var layers = [],
                selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
            return selectedLayers;
        },
        /**
         * Populates the map layers panel in publisher
         *
         * @method _populateMapLayerPanel
         * @private
         */
        _populateMapLayerPanel: function () {

            var me = this,
                sandbox = this.instance.getSandbox(),
                contentPanel = this.panel.getContainer();
            contentPanel.empty();
            me.container = contentPanel;

            // tooltip
            var tooltipCont = this.templateHelp.clone();
            tooltipCont.attr('title', this.loc.layerselection.tooltip);
            contentPanel.append(tooltipCont);

            // tool selection
            var toolContainer = this.templateTool.clone();
            toolContainer.find('label').attr('for', 'show-map-layers-checkbox').append(this.loc.layerselection.label);
            if (this.showLayerSelection) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            contentPanel.append(this.loc.layerselection.info);
            toolContainer.find('input').attr('id', 'show-map-layers-checkbox').change(function () {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                me.showLayerSelection = isChecked;
                me.enablePlugin(isChecked);
                contentPanel.empty();
                me._populateMapLayerPanel();
            });
            if (!this.showLayerSelection) {
                return;
            }

            var layers = this._getLayersList(),
                i,
                listContainer = this.templateList.clone(),
                layer,
                input;

            for (i = 0; i < layers.length; i++) {

                layer = layers[i];
                var layerContainer = this.templateLayer.clone();
                layerContainer.attr('data-id', layer.getId());

                // setup id
                layerContainer.find('div.layer-title h4').append(layer.getName());
                layerContainer.find('div.layer-title').append(layer.getDescription());

                // remove layer from selected tool
                if (!layer.isSticky()) {
                    layerContainer.find('div.layer-tool-remove').addClass('icon-close');

                    layerContainer.find('div.layer-tool-remove').bind('click', function(e) {
                        var reqName = 'RemoveMapLayerRequest';
                        var builder = sandbox.getRequestBuilder(reqName);
                        var request = builder(jQuery(e.currentTarget).parents('.layer').attr('data-id'));

                        var checkbox = jQuery(e.currentTarget).parents('.layer').find('.baselayer');
                        var isChecked = checkbox.is(':checked');
                        layer.selected = isChecked;
                        if (isChecked) {
                            me.plugin.removeBaseLayer(layer);
                        }
                        sandbox.request(me.instance.getName(), request);

                    });

                }

                // footer tools
                me._appendLayerFooter(layerContainer, layer, layer.selected);

                var shouldPreselectLayer = function (layerId) {
                    var isFound = jQuery.inArray('' + layerId, me.config.layers.preselect);
                    return isFound !== -1;
                };

                input = layerContainer.find('input.baselayer');
                input.attr('id', 'checkbox' + layer.getId());

                if (shouldPreselectLayer(layer.getId())) {
                    input.attr('checked', 'checked');
                    layer.selected = true;
                    this.plugin.addBaseLayer(layer);
                }


                listContainer.prepend(layerContainer);
            }
            contentPanel.append(listContainer);
            listContainer.sortable({
                stop : function(event, ui) {
                    var item = ui.item;
                    me._layerOrderChanged(item)
                }
            });

            var buttonCont = me.templateButtonsDiv.clone();
            var addBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addBtn.setTitle(me.loc.buttons.add);
            addBtn.addClass('block');
            addBtn.insertTo(buttonCont);

            var add = function () {
                me._openExtension('LayerSelector');
            };
            addBtn.setHandler(function () {
                add();
            });


            contentPanel.append(buttonCont);
            // There will be a button for adding more layers
            //            if (this.config.layers.promote && this.config.layers.promote.length > 0) {
            //                this._populateLayerPromotion(contentPanel);
            //            }
        },

        /**
         * Populates the layer promotion part of the map layers panel in publisher
         *
         * @method _populateLayerPromotion
         * @private
         */
        _populateLayerPromotion: function (contentPanel) {
            var me = this,
                sandbox = this.instance.getSandbox(),
                addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest'),
                removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                closureMagic = function (layer) {
                    return function () {
                        var checkbox = jQuery(this),
                            isChecked = checkbox.is(':checked');
                        if (isChecked) {
                            sandbox.request(me.instance, addRequestBuilder(layer.getId(), true));
                            // promoted layers go directly to baselayers
                            me.plugin.addBaseLayer(layer);
                        } else {
                            sandbox.request(me.instance, removeRequestBuilder(layer.getId()));
                        }
                    };
                },
                i,
                promotion,
                promoLayerList,
                j,
                layer,
                layerContainer,
                input;

            for (i = 0; i < this.config.layers.promote.length; i += 1) {
                promotion = this.config.layers.promote[i];
                promoLayerList = this._getActualPromotionLayers(promotion.id);

                if (promoLayerList.length > 0) {
                    contentPanel.append(promotion.text);
                    for (j = 0; j < promoLayerList.length; j += 1) {
                        layer = promoLayerList[j];
                        layerContainer = this.templateTool.clone();
                        layerContainer.attr('data-id', layer.getId());
                        layerContainer.find('label').attr('for', 'checkbox' + layer.getId()).append(layer.getName());
                        input = layerContainer.find('input');
                        input.attr('id', 'checkbox' + layer.getId());
                        input.change(closureMagic(layer));
                        contentPanel.append(layerContainer);
                    }
                }
            }
        },
        /**
         * Checks given layer list and returns any layer that is found on the system but not yet selected.
         * The returned list contains the list that we should promote.
         *
         * @method _getActualPromotionLayers
         * @param {String[]} list - list of layer ids that we want to promote
         * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]} filtered list of promoted layers
         * @private
         */
        _getActualPromotionLayers: function (list) {
            var sandbox = this.instance.getSandbox(),
                layersToPromote = [],
                j,
                layer;
            for (j = 0; j < list.length; j += 1) {
                if (!sandbox.isLayerAlreadySelected(list[j])) {
                    layer = sandbox.findMapLayerFromAllAvailable(list[j]);
                    // promo layer found in system
                    if (layer) {
                        layersToPromote.push(layer);
                    }
                }
            }
            return layersToPromote;
        },
        /**
         * Clears previous layer listing and renders a new one to the view.
         * 
         * @method handleLayerSelectionChanged
         */
        handleLayerSelectionChanged : function() {
            this._populateMapLayerPanel();
        },
        /**
         * @method _layerOrderChanged
         * @private
         * Notify Oskari that layer order should be changed
         * @param {Number} newIndex index where the moved layer is now
         */
        _layerOrderChanged : function(item) {
            var allNodes = jQuery(this.container).find('.selectedLayersList li');
            var movedId = item.attr('data-id');
            var newIndex = -1;
            allNodes.each(function(index, el) {
                if ($(this).attr('data-id') == movedId) {
                    newIndex = index;
                    return false;
                }
                return true;
            });
            if (newIndex > -1) {
                // the layer order is reversed in presentation
                // the lowest layer has the highest index
                newIndex = (allNodes.length - 1) - newIndex;
                var sandbox = this.instance.getSandbox();
                var reqName = 'RearrangeSelectedMapLayerRequest';
                var builder = sandbox.getRequestBuilder(reqName);
                var request = builder(movedId, newIndex);
                sandbox.request(this.instance.getName(), request);
            }
        },
        /**
         * @method _layerOpacityChanged
         * @private
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer that had its opacity changed
         * @param {Number} newOpacity layer that had its opacity changed
         *
         * Handles slider/input field for opacity on this flyout/internally
         */
        _layerOpacityChanged : function(layer, newOpacity) {
            var sandbox = this.instance.getSandbox();
            var reqName = 'ChangeMapLayerOpacityRequest';
            var requestBuilder = sandbox.getRequestBuilder(reqName);
            var request = requestBuilder(layer.getId(), newOpacity);
            sandbox.request(this.instance.getName(), request);

            var lyrSel = 'li.layer.selected[data-id=' + layer.getId() + ']';
            var layerDiv = jQuery(this.container).find(lyrSel);
            var opa = layerDiv.find('div.layer-opacity input.opacity');
            opa.attr('value', layer.getOpacity());
        },
        /**
         * @method handleLayerVisibilityChanged
         * Changes the container representing the layer by f.ex
         * "dimming" it and changing the footer to match current
         * layer status
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer to modify
         * @param {Boolean} isInScale true if map is in layers scale range
         * @param {Boolean} isGeometryMatch true if layers geometry is in map
         * viewport
         */
        handleLayerVisibilityChanged : function(layer, isInScale, isGeometryMatch) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var lyrSel = 'li.layer.selected[data-id=' + layer.getId() + ']';

            var layerDiv = jQuery(this.container).find(lyrSel);
            var loc = this.instance.getLocalization('layer');

            // teardown previous footer & layer state classes
            var footer = layerDiv.find('div.layer-tools');
            var isChecked = footer.find('.baselayer').is(':checked');
            footer.empty();

            layerDiv.removeClass('hidden-layer');

            this._sliders[layer.getId()] = null;

            this._appendLayerFooter(layerDiv, layer, isChecked);
        },
        /**
         * @method _createLayerFooter
         * @private
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer
         * @return {jQuery} reference to the created footer
         *
         * Creates a footer for the given layer with the usual tools (opacity etc)
         */
        _createLayerFooter : function(layer, layerDiv, isChecked) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            // layer footer
            var tools = this.templateLayerFooterTools.clone();
            var loc = this.instance.getLocalization('layer');
            var visReqName = 'MapModulePlugin.MapLayerVisibilityRequest';
            var visibilityRequestBuilder = sandbox.getRequestBuilder(visReqName);

            tools.find('div.layer-visibility a').bind('click', function() {
                // send request to hide map layer
                var request = visibilityRequestBuilder(layer.getId(), false);
                sandbox.request(me.instance.getName(), request);
                return false;
            });

            // if layer selection = ON -> show content
            var closureMagic = function (layer) {
                return function () {
                    var checkbox = jQuery(this);
                    var isChecked = checkbox.is(':checked');
                    layer.selected = isChecked;
                    if (isChecked) {
                        me.plugin.addBaseLayer(layer);
                    } else {
                        me.plugin.removeBaseLayer(layer);
                    }
                };
            };


            var input = tools.find('input.baselayer');
            input.attr('id', 'checkbox' + layer.getId());
            if(isChecked) {
                input.attr('checked', 'checked');
            }
            input.change(closureMagic(layer));


            return tools;
        },
        /**
         * @method _createLayerFooterHidden
         * @private
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer
         * @return {jQuery} reference to the created footer
         *
         * Creates footer for the given invisible layer
         */
        _createLayerFooterHidden : function(layer) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var msg = this.templateLayerFooterHidden.clone();
            msg.addClass("layer-msg-for-hidden");
            var reqName = 'MapModulePlugin.MapLayerVisibilityRequest';
            var visibilityRequestBuilder = sandbox.getRequestBuilder(reqName);
            msg.find('a').bind('click', function() {
                // send request to show map layer
                var request = visibilityRequestBuilder(layer.getId(), true);
                sandbox.request(me.instance.getName(), request);
                return false;
            });
            return msg;
        },
        /**
         * @method _appendLayerFooter
         * @private
         * @param {Object} container div
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer
         * @param {boolean} isChecked states if the layer is checked as possible base layer 
         * 
         * Appends layer footer to layer in publisher's manipulation panel
         */
        _appendLayerFooter : function(layerDiv, layer, isChecked) {
            var toolsDiv = layerDiv.find('div.layer-tools');

            /* fix: we need this at anytime for slider to work */
            var footer = this._createLayerFooter(layer, layerDiv, isChecked);

            if (!layer.isVisible()) {
                toolsDiv.addClass('hidden-layer');
                footer.find('.layer-visibility').css("display", "none");
                jQuery(jQuery(footer).get(0)).prepend(this._createLayerFooterHidden(layer));
            } else {
                footer.css("display", "");
            }
            // isInScale & isGeometryMatch etc. are found in layerselection
            // but there is no need to add those yet - hopefully never

            toolsDiv.append(footer);

            var slider = this._addSlider(layer, layerDiv);

            var opa = layerDiv.find('div.layer-opacity input.opacity');
            opa.attr('value', layer.getOpacity());

        },


        /**
         * @method _addSlider
         * @private
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer
         * @param {Object} container div
         * 
         * Adds slider to layer's footer to change layer opacity
         */
        _addSlider : function(layer, layerDiv) {
            var me = this;
            var lyrId = layer.getId();
            var opa = layer.getOpacity();

            var sliderEl = layerDiv.find('.layout-slider');
            var slider = sliderEl.slider({
                min : 0,
                max : 100,
                value : opa,
                /*change: function(event,ui) {
                 me._layerOpacityChanged(layer, ui.value);
                 },*/
                slide : function(event, ui) {
                    me._layerOpacityChanged(layer, ui.value);
                },
                stop : function(event, ui) {
                    me._layerOpacityChanged(layer, ui.value);
                }
            });

            me._sliders[lyrId] = slider;

            return slider;
        },
        _getFakeExtension: function (name) {
            return {
                getName: function () {
                    return name;
                }
            };
        },
        _openExtension: function (name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.instance.getSandbox().postRequestByName(rn, [extension, 'attach', rn, "10", "405"]);
        }

    });