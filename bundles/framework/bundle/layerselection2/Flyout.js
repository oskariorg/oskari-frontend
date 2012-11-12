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
 * 		reference to component that created the tile
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
     * 		reference to the container in browser
     * @param {Number} width
     * 		container size(?) - not used
     * @param {Number} height
     * 		container size(?) - not used
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

        this.templateLayer = jQuery('<li class="layer selected">' + 
        '<div class="layer-info">' + '<div class="layer-icon"></div>' + 
        	'<div class="layer-tool-remove"></div>' + '<div class="layer-title"><h4></h4></div>' + '</div>' + 
        	'<div class="stylesel">' + '<label for="style">' + loc['style'] + '</label>' + 
        	'<select name="style"></select></div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');

        // footers are changed based on layer state
        this.templateLayerFooterTools = jQuery('<div class="left-tools">' + 
            '<div class="layer-visibility">' + '<a href="JavaScript:void(0);">' + loc['hide'] + '</a>' + '&nbsp;' + 
                '<span class="temphidden" ' + 'style="display: none;">' + loc['hidden'] + '</span>' + '</div>' + 
            '<div class="layer-opacity">' + '<div class="layout-slider" id="layout-slider">' + '</div> ' + 
            '<div class="opacity-slider" style="display:inline-block">' + 
            '<input type="text" name="opacity-slider" class="opacity-slider opacity" id="opacity-slider" />%</div>' + 
            '</div>' + '</div>' + '<div class="right-tools">' +
        '<div class="layer-rights"></div>' + '<div class="layer-description">' + '<div class="icon-info"></div>' + '</div></div>');

        this.templateLayerFooterHidden = jQuery('<p class="layer-msg">' + '<a href="JavaScript:void(0);">' + loc['show'] + '</a> ' + loc['hidden'] + '</p>');

        this.templateLayerFooterOutOfScale = jQuery('<p class="layer-msg">' + loc['out-of-scale'] + ' <a href="JavaScript:void(0);">' + loc['move-to-scale'] + '</a></p>');

        this.templateLayerFooterOutOfContentArea = jQuery('<p class="layer-msg">' + loc['out-of-content-area'] + ' <a href="JavaScript:void(0);">' + loc['move-to-content-area'] + '</a></p>');
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
     * 		state that this component should use
     * Interface method implementation, does nothing atm
     */
    setState : function(state) {
        this.state = state;
        /*console.log("Flyout.setState", this, state);*/
    },
    /**
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi : function() {
        var me = this;

        var celOriginal = jQuery(this.container);
        celOriginal.empty();
        var listContainer = this.template.clone();
        celOriginal.append(listContainer);

        var sandbox = me.instance.getSandbox();
        var layers = sandbox.findAllSelectedMapLayers();

        var scale = sandbox.getMap().getScale();

        for (var n = layers.length - 1; n >= 0; --n) {
            var layer = layers[n];
            var layerContainer = this._createLayerContainer(layer);
            listContainer.append(layerContainer);

            // footer tools
            this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);
        }

        // RIGHTJS sortable event handling
        //TODO: get rid of sortableBinded and UNBIND?
        if (!this.sortableBinded) {
            this.sortableBinded = true;
            RightJS('.selectedLayersList').on('finish', function(event) {
                me._layerOrderChanged(event.index);
            });

        }
    },
    _appendLayerFooter : function(layerDiv, layer, isInScale, isGeometryMatch) {
        var toolsDiv = layerDiv.find('div.layer-tools');
		
		/* fix: we need this at anytime for slider to work */ 
        var footer = this._createLayerFooter(layer, layerDiv);
        
        /*console.log("IS VISIBLE AT APPENDLAYERFOOTER "+layer.isVisible());*/
        
        if (!layer.isVisible()) {
            toolsDiv.addClass('hidden');
            footer.css("display","none");
            toolsDiv.append(this._createLayerFooterHidden(layer));
        } else if (!isInScale) {
            var oosFtr = this._createLayerFooterOutOfScale(layer);
            toolsDiv.addClass('out-of-scale');
            footer.css("display","none");            
            toolsDiv.append(oosFtr);
        } else if (!isGeometryMatch) {
            var oocaFtr = this._createLayerFooterOutOfContentArea(layer);
            toolsDiv.addClass('out-of-content');
            footer.css("display","none");
            toolsDiv.append(oocaFtr);
        } else {
        	footer.css("display","");
        }
         
     	toolsDiv.append(footer);
        
 	    var slider = this._addSlider(layer,layerDiv);
         
    },
    
    _addSlider : function(layer,layerDiv) {
        var me = this;
        var lyrId = layer.getId();
        var opa = layer.getOpacity();
        /*var slider = me._sliders[lyrId];
        if (!slider || !slider.setStyle || !slider.handle || !slider.handle.setStyle) {*/
            slider = new Slider({
                min : 0,
                max : 100,
                value: opa
            });

            slider.setStyle({
                'background-color' : 'transparent',
                'background-image' : 'url("/Oskari' + '/resources/framework/bundle' + '/layerselection2/images' + '/opacity_slider.png")',
                'height' : '5px',
                'width' : '150px',
                'border' : '0',
                'margin' : 0
            });

            /*slider.level.hide();*/

            slider.handle.setStyle({
                'background-color' : 'transparent',
                'background-image' : 'url("/Oskari' + '/resources/framework/bundle' + '/layerselection2/images' + '/opacity_index.png")',
                'width' : '15px',
                'height' : '15px',
                'border' : '0',
                'margin-left' : 0
            });

            slider.on('change', function(event) {
                me._layerOpacityChanged(layer, event.value);
            });
            me._sliders[lyrId] = slider;
        /*}*/
        // only render if visible on screen
        var lS = 'layout-slider-' + lyrId;
        var oS = 'opacity-slider-' + lyrId;
        
         // slider
        var tools = layerDiv.find('.left-tools');
        var opacitySlider = tools.find('div.layout-slider');
        opacitySlider.attr('id', 'layout-slider-' + layer.getId());

        var opacityInput = tools.find('input.opacity-slider');
        opacityInput.attr('id', 'opacity-slider-' + layer.getId());
        
        slider.insertTo(lS);
        slider.assignTo(oS);
        
        return slider;
    },
    /**
     * @method _layerOrderChanged
     * @private
     * Notify Oskari that layer order should be changed
     * @param {Number} newIndex index where the moved layer is now
     */
    _layerOrderChanged : function(newIndex) {
        var allNodes = jQuery(this.container).find('.selectedLayersList li');
        var movedId = jQuery(allNodes[newIndex]).attr('layer_id');
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
     * @method _createLayerContainer
     * @private
     * Creates the layer containers
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     * layer to render
     * @return {jQuery} reference to the created layer container
     */
    _createLayerContainer : function(layer) {

        var me = this;
        var sandbox = me.instance.getSandbox();
        var reqName = 'ChangeMapLayerOpacityRequest';
        var opacityRequestBuilder = sandbox.getRequestBuilder(reqName);
        var layerId = layer.getId();
        var value = layer.getOpacity();

        var layerDiv = this.templateLayer.clone();

        // setup id
        layerDiv.attr('layer_id', layerId);
        layerDiv.find('div.layer-title h4').append(layer.getName());
        layerDiv.find('div.layer-title').append(layer.getDescription());

        var stylesel = layerDiv.find('div.stylesel');
        stylesel.hide();

        if (layer.getStyles && layer.getStyles().length > 1) {
            var hasOpts = false;
            var styles = layer.getStyles();
            var sel = stylesel.find('select');
            for (var i = 0; i < styles.length; i++) {
                if (styles[i].getName()) {
                    var opt = jQuery('<option value="' + styles[i].getName() + '">' + styles[i].getTitle() + '</option>');
                    sel.append(opt);
                    hasOpts = true;
                }
            }
            sel.change(function(e) {
                var val = sel.find('option:selected').val();
                layer.selectStyle(val);
                var reqName = 'ChangeMapLayerStyleRequest';
                var builder = sandbox.getRequestBuilder(reqName);
                var req = builder(layer.getId(), val);
                sandbox.request(me.instance.getName(), req);
            });
            if (hasOpts) {
                sel.val(layer.getCurrentStyle().getName());
                stylesel.show();
            }
        }

        // setup icon
        var tooltips = this.instance.getLocalization('layer').tooltip;
        var icon = layerDiv.find('div.layer-icon');
        if (layer.isBaseLayer()) {
            icon.addClass('layer-base');
            icon.attr('title', tooltips['type-base']);
            // tooltip = mapservice_basemap_image_tooltip
        } else if (layer.isLayerOfType('WMS')) {
            if (layer.isGroupLayer()) {
                icon.addClass('layer-group');
            } else {
                icon.addClass('layer-wms');
            }
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
            icon.addClass('layer-wmts');
            icon.attr('title', tooltips['type-wms']);
            // icon.attr('title',
            //           'mapservice_maplayer_image_tooltip');
        } else if (layer.isLayerOfType('WFS')) {
            icon.addClass('layer-wfs');
            icon.attr('title', tooltips['type-wfs']);
            // tooltip = selected_layers_module_wfs_icon_tooltip
        } else if (layer.isLayerOfType('VECTOR')) {
            icon.addClass('layer-vector');
            icon.attr('title', tooltips['type-wms']);
            // tooltip = mapservice_maplayer_image_tooltip
        }

        // remove layer from selected tool
        layerDiv.find('div.layer-tool-remove').addClass('icon-close');
        layerDiv.find('div.layer-tool-remove').bind('click', function() {
            var reqName = 'RemoveMapLayerRequest';
            var builder = sandbox.getRequestBuilder(reqName);
            var request = builder(layer.getId());
            sandbox.request(me.instance.getName(), request);
        });
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
        var me = this;
        var sandbox = me.instance.getSandbox();
        var lyrSel = 'li.layer.selected[layer_id=' + layer.getId() + ']';

        var layerDiv = jQuery(this.container).find(lyrSel);
        var loc = this.instance.getLocalization('layer');

        // teardown previous footer & layer state classes
        var footer = layerDiv.find('div.layer-tools');
        footer.empty(); 
       	
        layerDiv.removeClass('hidden');
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
        var sandbox = this.instance.getSandbox();
        var reqName = 'ChangeMapLayerOpacityRequest';
        var requestBuilder = sandbox.getRequestBuilder(reqName);
        var request = requestBuilder(layer.getId(), newOpacity);
        sandbox.request(this.instance.getName(), request);

        var lyrSel = 'li.layer.selected[layer_id=' + layer.getId() + ']';
        var layerDiv = jQuery(this.container).find(lyrSel);
        var opa = layerDiv.find('div.layer-opacity input.opacity');
        opa.attr('value', layer.getOpacity());
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
        /*this._addSlider(layer);*/
        if( this._sliders[layer.getId()] ) {  
        	this._sliders[layer.getId()].setValue(layer.getOpacity());
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
        var lyrSel = 'li.layer.selected[layer_id=' + layer.getId() + ']';
        var layerDiv = jQuery(this.container).find(lyrSel);
        var styleDropdown = layerDiv.find('div.stylesel select');
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
        var me = this;
        var sandbox = me.instance.getSandbox();
        var msg = this.templateLayerFooterOutOfScale.clone();
        msg.addClass("layer-msg-for-outofscale");
        var reqName = 'MapModulePlugin.MapMoveByLayerContentRequest';
        var requestBuilder = sandbox.getRequestBuilder(reqName);
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
        var me = this;
        var sandbox = me.instance.getSandbox();
        var msg = this.templateLayerFooterOutOfContentArea.clone();
        msg.addClass("layer-msg-for-outofcontentarea");
        var reqName = 'MapModulePlugin.MapMoveByLayerContentRequest';
        var requestBuilder = sandbox.getRequestBuilder(reqName);
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

        // data url link
        if (!layer.getMetadataIdentifier()) {
            // no functionality -> hide
            tools.find('div.layer-description').hide();
        } else {
            tools.find('div.icon-info').bind('click', function() {
                var rn = 'catalogue.ShowMetadataRequest';
                var uuid = layer.getMetadataIdentifier();
                sandbox.postRequestByName(rn, [{
                    uuid : uuid
                }]);
            });
        }

        // publish permissions
        this._updatePublishPermissionText(layer, tools);

        return tools;
    },
    _updatePublishPermissionText : function(layer, footer) {
        var sandbox = this.instance.getSandbox();
        var loc = this.instance.getLocalization('layer');
        
        var publishPermission = layer.getPermission('publish');

        if (publishPermission == 'publication_permission_ok' && 
            sandbox.getUser().isLoggedIn()) {
                
            footer.find('div.layer-rights').html(loc.rights['can_be_published_map_user'].label);
            footer.find('div.layer-rights').attr("title", loc.rights['can_be_published_map_user'].tooltip);
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
        if (isSelected == true) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var scale = sandbox.getMap().getScale();

            var listContainer = jQuery('ul.selectedLayersList');
            var layerContainer = this._createLayerContainer(layer);
            // footer tools
            var footer = layerContainer.find('div.layer-tools');


            var previousLayers = [];
            // insert to top
            if (layer.isBaseLayer() && keepLayersOrder != true) {
                // find all baselayers == layers whose id starts with 'base_'
                previousLayers = listContainer.find('li[layer_id^=base_]');
            } else {
                previousLayers = listContainer.find('.layer.selected');
            }

            if (previousLayers.length > 0) {
                // without first(), adds before each layer
                previousLayers.first().before(layerContainer);
            } else {
                listContainer.append(layerContainer);
            }
            
            this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);

        }
        // remove layer
        else {
            var layerDiv = jQuery(this.container).find('li[layer_id=' + layer.getId() + ']');
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
        var me = this;
        var layerDiv = jQuery(this.container).find('li[layer_id=' + layer.getId() + ']');
        jQuery(layerDiv).find('.layer-title h4').html(layer.getName());
        
        var footer = layerDiv.find('div.layer-tools');
        this._updatePublishPermissionText(layer, footer);
    },
    
    /** 
     * @method refresh 
     * utitity to temporarily support rightjs sliders (again)
     */
    refresh: function() {
    	var me = this;
    	var sandbox = me.instance.getSandbox();
        var layers = sandbox.findAllSelectedMapLayers();
        
        for (var n = layers.length - 1; n >= 0; --n) {
            var layer = layers[n];
            
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
