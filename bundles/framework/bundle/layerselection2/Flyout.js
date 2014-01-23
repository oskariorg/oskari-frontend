/**
 * @class Oskari.mapframework.bundle.layerselection2.Flyout
 *
 * Renders the "selected layers" flyout.
 *
 * To-do: (critical) replace create/destroy div to show/hide div when modifiying tools
 * for shown layers
 * To-do: fix some method naming issues  (f.ex. layer footer is in a dual role)
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselection2.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
 * instance
 *      reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;

    this.template = null;
    this.templateLayer = null;
    this.templateLayerTools = null;
    this.templateLayerOutOfScale = null;
    this.templateLayerOutOfContentArea = null;
    this.sortableBinded = false;
    this._sliders = {};
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.layerselection2.Flyout';
    },
    /**
     * @method setEl
     * @param {Object} el
     *      reference to the container in browser
     * @param {Number} width
     *      container size(?) - not used
     * @param {Number} height
     *      container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if (!jQuery(this.container).hasClass('layerselection2')) {
            jQuery(this.container).addClass('layerselection2');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        var loc = this.instance.getLocalization('layer');
        // sortable class/data-sortable are configs for rightJS
        // sortable component
        this.template = jQuery('<ul class="selectedLayersList sortable" ' + 'data-sortable=\'{' + 'itemCss: "li.layer.selected", ' + 'handleCss: "div.layer-title" ' + '}\'></ul>');

        this.templateLayer = jQuery('<li class="layerselection2 layer selected">' + '<div class="layer-info">' + '<div class="layer-icon"></div>' + '<div class="layer-tool-remove"></div>' + '<div class="layer-title"><h4></h4></div>' + '</div>' + '<div class="stylesel">' + '<label for="style">' + loc.style + '</label>' + '<select name="style"></select></div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');

        // footers are changed based on layer state
        this.templateLayerFooterTools = jQuery('<div class="right-tools">' + '<div class="layer-rights"></div>' + '<div class="object-data"></div>' + '<div class="layer-description">' + '<div class="icon-info"></div>' + '</div></div>' + '<div class="left-tools">' + '<div class="layer-visibility">' + '<a href="JavaScript:void(0);">' + loc.hide + '</a>' + '&nbsp;' + '<span class="temphidden" ' + 'style="display: none;">' + loc.hidden + '</span>' + '</div>' + '<div class="oskariui layer-opacity">' + '<div class="layout-slider" id="layout-slider">' + '</div> ' + '<div class="opacity-slider" style="display:inline-block">' + '<input type="text" name="opacity-slider" class="opacity-slider opacity" id="opacity-slider" />%</div>' + '</div>' + '</div>');

        this.templateLayerFooterHidden = jQuery('<p class="layer-msg">' + '<a href="JavaScript:void(0);">' + loc.show + '</a> ' + loc.hidden + '</p>');

        this.templateLayerFooterOutOfScale = jQuery('<p class="layer-msg">' + loc["out-of-scale"] + ' <a href="JavaScript:void(0);">' + loc["move-to-scale"] + '</a></p>');

        this.templateLayerFooterOutOfContentArea = jQuery('<p class="layer-msg">' + loc["out-of-content-area"] + ' <a href="JavaScript:void(0);">' + loc["move-to-content-area"] + '</a></p>');
    },
    /**
     * @method stopPlugin
     *
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {

    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('title');
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the
     * flyout
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
    },
    /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
    getOptions : function() {

    },
    /**
     * @method setState
     * @param {Object} state
     *     state that this component should use
     * Interface method implementation, does nothing atm
     */
    setState : function(state) {
        this.state = state;

    },
    /**
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi : function() {
        var me = this,
            celOriginal = jQuery(this.container);
        celOriginal.empty();
        var listContainer = this.template.clone();
        celOriginal.append(listContainer);

        var sandbox = me.instance.getSandbox(),
            layers = sandbox.findAllSelectedMapLayers(),
            scale = sandbox.getMap().getScale(),
            n,
            layer,
            layerContainer;

        for (n = layers.length - 1; n >= 0; --n) {
            layer = layers[n];
            layerContainer = this._createLayerContainer(layer);
            listContainer.append(layerContainer);

            // footer tools
            this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);
        }

        listContainer.sortable({
            /*change: function(event,ui) {
             var item = ui.item ;
             me._layerOrderChanged(item)
             },*/
            stop : function(event, ui) {
                var item = ui.item;
                me._layerOrderChanged(item);
            }
        });

        //this blocks user inputs/selections in FF and Opera
        /*listContainer.disableSelection();*/

        // RIGHTJS sortable event handling
        //TODO: get rid of sortableBinded and UNBIND?
        if (!this.sortableBinded) {
            this.sortableBinded = true;
            /*RightJS('.selectedLayersList').on('finish', function(event) {
             me._layerOrderChanged(event.index);
             });*/

        }
    },
    _appendLayerFooter : function(layerDiv, layer, isInScale, isGeometryMatch) {
        var toolsDiv = layerDiv.find('div.layer-tools');

        /* fix: we need this at anytime for slider to work */
        var footer = this._createLayerFooter(layer, layerDiv);

        if (!layer.isVisible()) {
            toolsDiv.addClass('hidden-layer');
            footer.css("display", "none");
            toolsDiv.append(this._createLayerFooterHidden(layer));
        } else if (!isInScale) {
            var oosFtr = this._createLayerFooterOutOfScale(layer);
            toolsDiv.addClass('out-of-scale');
            footer.css("display", "none");
            toolsDiv.append(oosFtr);
        } else if (!isGeometryMatch) {
            var oocaFtr = this._createLayerFooterOutOfContentArea(layer);
            toolsDiv.addClass('out-of-content');
            footer.css("display", "none");
            toolsDiv.append(oocaFtr);
        } else {
            footer.css("display", "");
        }

        toolsDiv.append(footer);

        var opa = layerDiv.find('div.layer-opacity input.opacity'),
            slider = this._addSlider(layer, layerDiv, opa);
    },

    _addSlider : function(layer, layerDiv, input) {
        var me = this,
            lyrId = layer.getId(),
            opa = layer.getOpacity(),
            sliderEl = layerDiv.find('.layout-slider'),
            slider = sliderEl.slider({
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

        if (input) {
            input.attr('value', layer.getOpacity());
            input.on('change paste keyup', function () {
                        //sliderEl.slider('value', jQuery(this).val());
                        me._layerOpacityChanged(layer, jQuery(this).val());
                    });
        }

        return slider;
    },
    /**
     * @method _layerOrderChanged
     * @private
     * Notify Oskari that layer order should be changed
     * @param {Number} newIndex index where the moved layer is now
     */
    _layerOrderChanged : function(item) {
        var allNodes = jQuery(this.container).find('.selectedLayersList li.layerselection2'),
            movedId = item.attr('layer_id'),
            newIndex = -1;

        allNodes.each(function(index, el) {
            if ($(this).attr('layer_id') == movedId) {
                newIndex = index;
                return false;
            }
            return true;
        });
        if (newIndex > -1) {
            // the layer order is reversed in presentation
            // the lowest layer has the highest index
            newIndex = (allNodes.length - 1) - newIndex;
            var sandbox = this.instance.getSandbox(),
                reqName = 'RearrangeSelectedMapLayerRequest',
                builder = sandbox.getRequestBuilder(reqName),
                request = builder(movedId, newIndex);
            sandbox.request(this.instance.getName(), request);
        }
    },

    /**
     * @method _createLayerContainer
     * @private
     * Creates the layer containers
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer to render
     * @return {jQuery} reference to the created layer container
     */
    _updateStyles : function(layer, layerDiv) {
        var me = this,
            sandbox = me.instance.getSandbox(),
            stylesel = layerDiv.find('div.stylesel');

        stylesel.hide();

        if (layer.getStyles && layer.getStyles().length > 1) {
            var hasOpts = false,
                styles = layer.getStyles(),
                sel = stylesel.find('select'),
                i,
                opt;
            sel.empty();
            for (i = 0; i < styles.length; i++) {
                if (styles[i].getName()) {
                    opt = jQuery('<option value="' + styles[i].getName() + '">' + styles[i].getTitle() + '</option>');
                    sel.append(opt);
                    hasOpts = true;
                }
            }
            if(!sel.hasClass("binded")) {
                sel.change(function(e) {
                    var val = sel.find('option:selected').val();
                    layer.selectStyle(val);
                    var builder = sandbox.getRequestBuilder("ChangeMapLayerStyleRequest"),
                        req = builder(layer.getId(), val);
                    sandbox.request(me.instance.getName(), req);
                });
                sel.addClass("binded");
            }
            if (hasOpts) {
                if(layer.getCurrentStyle()) sel.val(layer.getCurrentStyle().getName());
                sel.trigger("change");
                stylesel.show();
            }
        }
    },

    /**
     * @method _createLayerContainer
     * @private
     * Creates the layer containers
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer to render
     * @return {jQuery} reference to the created layer container
     */
    _createLayerContainer : function(layer) {

        var me = this,
            sandbox = me.instance.getSandbox(),
            reqName = 'ChangeMapLayerOpacityRequest',
            opacityRequestBuilder = sandbox.getRequestBuilder(reqName),
            layerId = layer.getId(),
            value = layer.getOpacity(),
            layerDiv = this.templateLayer.clone();

        // setup id
        layerDiv.attr('layer_id', layerId);
        layerDiv.find('div.layer-title h4').append(layer.getName());
        layerDiv.find('div.layer-title').append(layer.getDescription());

        this._updateStyles(layer, layerDiv);

        // setup icon
        var tooltips = this.instance.getLocalization('layer').tooltip,
            icon = layerDiv.find('div.layer-icon');
        icon.addClass(layer.getIconClassname());

        if (layer.isBaseLayer()) {
            icon.attr('title', tooltips['type-base']);
            // tooltip = mapservice_basemap_image_tooltip
        } else if (layer.isLayerOfType('WMS')) {
            icon.attr('title', tooltips['type-wms']);
            // tooltip = mapservice_maplayer_image_tooltip
        }
        // FIXME: WMTS is an addition done by an outside bundle
        // so this shouldn't
        // be here
        // but since it would require some refactoring to make
        // this general
        // I'll just leave this like it was on old implementation
        else if (layer.isLayerOfType('WMTS')) {
            icon.attr('title', tooltips['type-wms']);
            // icon.attr('title',
            //           'mapservice_maplayer_image_tooltip');
        } else if (layer.isLayerOfType('WFS')) {
            icon.attr('title', tooltips['type-wfs']);
            // tooltip = selected_layers_module_wfs_icon_tooltip
        } else if (layer.isLayerOfType('VECTOR')) {
            icon.attr('title', tooltips['type-wms']);
            // tooltip = mapservice_maplayer_image_tooltip
        }

        // remove layer from selected tool
        if (!layer.isSticky()) {
            layerDiv.find('div.layer-tool-remove').addClass('icon-close');

            layerDiv.find('div.layer-tool-remove').bind('click', function() {
                var reqName = 'RemoveMapLayerRequest',
                    builder = sandbox.getRequestBuilder(reqName),
                    request = builder(layer.getId());
                sandbox.request(me.instance.getName(), request);

            });

        }

        return layerDiv;
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
        var me = this,
            sandbox = me.instance.getSandbox(),
            lyrSel = 'li.layerselection2.layer.selected[layer_id=' + layer.getId() + ']',
            layerDiv = jQuery(this.container).find(lyrSel),
            loc = this.instance.getLocalization('layer'),
            footer = layerDiv.find('div.layer-tools'); // teardown previous footer & layer state classes
        footer.empty();

        layerDiv.removeClass('hidden-layer');
        layerDiv.removeClass('out-of-scale');
        layerDiv.removeClass('out-of-content');

        this._sliders[layer.getId()] = null;

        this._appendLayerFooter(layerDiv, layer, isInScale, isGeometryMatch);
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
        var sandbox = this.instance.getSandbox(),
            reqName = 'ChangeMapLayerOpacityRequest',
            requestBuilder = sandbox.getRequestBuilder(reqName),
            request = requestBuilder(layer.getId(), newOpacity);
        sandbox.request(this.instance.getName(), request);

        this._changeOpacityInput(layer);
    },
    /**
     * Changes the opacity input field's value.
     *
     * @method _changeOpacityInput
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     *  layer under the opacity change
     */
    _changeOpacityInput: function(layer) {
        var lyrSel = 'li.layerselection2.layer.selected[layer_id=' + layer.getId() + ']',
            layerDiv = jQuery(this.container).find(lyrSel),
            opa = layerDiv.find('div.layer-opacity input.opacity'),
            slider = layerDiv.find('.layout-slider');

        opa.attr('value', layer.getOpacity());
        slider.slider('value', layer.getOpacity());
    },
    /**
     * @method handleLayerOpacityChanged
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer that had its opacity changed
     *
     * Handles slider/input field for opacity value change when it is changed
     * externally
     */
    handleLayerOpacityChanged : function(layer) {
        if (this._sliders[layer.getId()]) {
            this._sliders[layer.getId()].slider('value', layer.getOpacity());
            this._changeOpacityInput(layer);
        }

    },
    /**
     * @method handleLayerStyleChanged
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer that had its style changed
     *
     * Handles style dropdown change when it is changed externally
     */
    handleLayerStyleChanged : function(layer) {
        var lyrSel = 'li.layer.selected[layer_id=' + layer.getId() + ']',
            layerDiv = jQuery(this.container).find(lyrSel),
            styleDropdown = layerDiv.find('div.stylesel select');
        styleDropdown.val(layer.getCurrentStyle().getName());
    },
    /**
     * @method _createLayerFooterOutOfScale
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer
     * @return {jQuery} reference to the created footer
     *
     * Creates an out-of-scale footer for the given layer
     */
    _createLayerFooterOutOfScale : function(layer) {
        var me = this,
            sandbox = me.instance.getSandbox(),
            msg = this.templateLayerFooterOutOfScale.clone();
        msg.addClass("layer-msg-for-outofscale");
        var reqName = 'MapModulePlugin.MapMoveByLayerContentRequest',
            requestBuilder = sandbox.getRequestBuilder(reqName);
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = requestBuilder(layer.getId());
            sandbox.request(me.instance.getName(), request);
            return false;
        });
        return msg;
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
        var me = this,
            sandbox = me.instance.getSandbox(),
            msg = this.templateLayerFooterHidden.clone();
        msg.addClass("layer-msg-for-hidden");
        var reqName = 'MapModulePlugin.MapLayerVisibilityRequest',
            visibilityRequestBuilder = sandbox.getRequestBuilder(reqName);
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = visibilityRequestBuilder(layer.getId(), true);
            sandbox.request(me.instance.getName(), request);
            return false;
        });
        return msg;
    },
    /**
     * @method _createLayerFooterOutOfContentArea
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer
     * @return {jQuery} reference to the created footer
     *
     * Creates an out-of-contentarea footer for the given layer
     */
    _createLayerFooterOutOfContentArea : function(layer) {
        var me = this,
            sandbox = me.instance.getSandbox(),
            msg = this.templateLayerFooterOutOfContentArea.clone();
        msg.addClass("layer-msg-for-outofcontentarea");
        var reqName = 'MapModulePlugin.MapMoveByLayerContentRequest',
            requestBuilder = sandbox.getRequestBuilder(reqName);
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = requestBuilder(layer.getId());
            sandbox.request(me.instance.getName(), request);
            return false;
        });
        return msg;
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
    _createLayerFooter : function(layer, layerDiv) {
        var me = this,
            sandbox = me.instance.getSandbox(),
            tools = this.templateLayerFooterTools.clone(), // layer footer
            loc = this.instance.getLocalization('layer'),
            visReqName = 'MapModulePlugin.MapLayerVisibilityRequest',
            visibilityRequestBuilder = sandbox.getRequestBuilder(visReqName);

        tools.find('div.layer-visibility a').bind('click', function() {
            // send request to hide map layer
            var request = visibilityRequestBuilder(layer.getId(), false);
            sandbox.request(me.instance.getName(), request);
            return false;
        });

        // data url link
         subLmeta = false;
        if (!layer.getMetadataIdentifier()) {
            //Check if sublayers have metadata info     
             subLayers = layer.getSubLayers();
               
                if (subLayers && subLayers.length > 0) {
                    subLmeta = true;
                    for (s = 0; s < subLayers.length; s += 1) {

                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (!subUuid || subUuid === "" ) {
                          subLmeta = false;      
                          break;
                        }
                    }  
                }
            if (!subLmeta) {
                // no functionality -> hide
                tools.find('div.layer-description').hide();
            }
        } 
        if (layer.getMetadataIdentifier() || subLmeta) {
            tools.find('div.icon-info').bind('click', function() {
                var rn = 'catalogue.ShowMetadataRequest',
                    uuid = layer.getMetadataIdentifier(),
                    additionalUuids = [],
                    additionalUuidsCheck = {};
                additionalUuidsCheck[uuid] = true;

                var subLayers = layer.getSubLayers(),
                    s,
                    subUuid;
                if (subLayers && subLayers.length > 0) {
                    for (s = 0; s < subLayers.length; s++) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                            additionalUuidsCheck[subUuid] = true;
                            additionalUuids.push({
                                uuid : subUuid
                            });
                        }
                    }

                }

                sandbox.postRequestByName(rn, [{
                    uuid : uuid
                }, additionalUuids]);
            });
        }

        var closureMagic = function(tool) {
            return function() {
                tool.getCallback()();
                return false;
            };
        };

        // Footer functions
        var laytools = layer.getTools(),
            s,
            laytool,
            toolContainer;
        for (s = 0; s < laytools.length; s++) {
            laytool = laytools[s];
            if (laytool) {
                // Icon or text link
                if (laytool.getIconCls()) {
                    toolContainer = jQuery('<div></div>');  
                    toolContainer.addClass(laytool.getIconCls());
                    toolContainer.attr('title', laytool.getTooltip());
                    tools.find('div.object-data').append(toolContainer);
                    toolContainer.bind('click', closureMagic(laytool));
                } else {
                    toolContainer = jQuery('<a href="JavaScript:void(0);"></a>');
                    toolContainer.append(laytool.getTitle());
                    tools.find('div.object-data').append(toolContainer);
                    toolContainer.bind('click', closureMagic(laytool));
                }
            }
        }

        // publish permissions
        this._updatePublishPermissionText(layer, tools);

        return tools;
    },
    _updatePublishPermissionText : function(layer, footer) {
        var sandbox = this.instance.getSandbox(),
            loc = this.instance.getLocalization('layer'),
            publishPermission = layer.getPermission('publish');

        if (publishPermission == 'publication_permission_ok' && sandbox.getUser().isLoggedIn()) {

            footer.find('div.layer-rights').html(loc.rights.can_be_published_map_user.label);
            footer.find('div.layer-rights').attr("title", loc.rights.can_be_published_map_user.tooltip);
        }
    },

    /**
     * @method handleLayerSelectionChanged
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer
     *           layer that was changed
     * @param {Boolean} isSelected
     *           true if layer is selected, false if removed from selection
     * @param {Boolean} keepLayersOrder
     *           true to ignore baselayer placement
     * If isSelected is false, removes the matching layer container from the UI.
     * If isSelected is true, constructs a matching layer container and adds it
     * to the UI.
     */
    handleLayerSelectionChanged : function(layer, isSelected, keepLayersOrder) {
        // add layer
        if (isSelected) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                scale = sandbox.getMap().getScale(),
                listContainer = jQuery('ul.selectedLayersList'),
                layerContainer = this._createLayerContainer(layer),
                footer = layerContainer.find('div.layer-tools'), // footer tools
                previousLayers = [];
            // insert to top
            if (layer.isBaseLayer() && !keepLayersOrder) {
                // find all baselayers == layers whose id starts with 'base_'
                previousLayers = listContainer.find('li.layerselection2[layer_id^=base_]');
            } else {
                previousLayers = listContainer.find('.layerselection2.layer.selected');
            }

            if (previousLayers.length > 0) {
                // without first(), adds before each layer
                if (layer.isBaseLayer() && !keepLayersOrder) {
                    previousLayers.last().after(layerContainer);
                } else {
                    previousLayers.first().before(layerContainer);
                }
            } else {
                listContainer.append(layerContainer);
            }

            this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);

        }
        // remove layer
        else {
            var layerDiv = jQuery(this.container).find('li.layerselection2[layer_id=' + layer.getId() + ']');
            if (layerDiv) {
                this._sliders[layer.getId()] = null;
                layerDiv.remove();

            }
        }
    },
    /**
     * @method handleLayerModified
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer
     *           layer that was modified
     * Updates the name for the given layer in the UI
     */
    handleLayerModified : function(layer) {
        var me = this,
            layerDiv = jQuery(me.container).find('li.layerselection2[layer_id=' + layer.getId() + ']');
        jQuery(layerDiv).find('.layer-title h4').html(layer.getName());
        me._updateStyles(layer, layerDiv);
        var footer = layerDiv.find('div.layer-tools');
        me._updatePublishPermissionText(layer, footer);
    },
    /**
     * @method handleLayerSticky
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     *layer whichs switch off enable/disable is changed
     * Updates the name for the given layer in the UI
     */
    handleLayerSticky : function(layer) {
        var me = this,
            layerDiv = jQuery(me.container).find('li.layerselection2[layer_id=' + layer.getId() + ']');
        layerDiv.find('div.layer-tool-remove').removeClass('icon-close');

    },
    /**
     * @method refresh
     * utitity to temporarily support rightjs sliders (again)
     */
    refresh : function() {
        var me = this,
            sandbox = me.instance.getSandbox(),
            layers = sandbox.findAllSelectedMapLayers(),
            n,
            layer;

        for (n = layers.length - 1; n >= 0; --n) {
            layer = layers[n];
            this.handleLayerOpacityChanged(layer);

        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
