/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance
 *
 * Main component and starting point for the "selected layers" functionality. 
 * Lists all the layers available in Oskari.mapframework.sandbox.Sandbox.findAllSelectedMapLayers()
 * and updates UI if maplayer related events (#eventHandlers) are received.
 * 
 * See Oskari.mapframework.bundle.layerselection2.LayerSelectionBundle for bundle definition. 
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance", 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this.localization = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'LayerSelection',
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
    	if(!this._localization) {
    		this._localization = Oskari.getLocalization(this.getName());
    	}
    	if(key) {
    		return this._localization[key];
    	}
        return this._localization;
    },
	/**
	 * @method start
	 * implements BundleInstance protocol start methdod
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		this.localization = Oskari.getLocalization(this.getName());
		
		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		//Let's extend UI
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
		sandbox.request(this, request);

        //sandbox.registerAsStateful(this.mediator.bundleId, this);
		// draw ui
		me.createUi();
	},
	/**
	 * @method init
	 * implements Module protocol init method - does nothing atm
	 */
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 * implements BundleInstance protocol update method - does nothing atm
	 */
	"update" : function() {

	},
	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		/**
		 * @method AfterMapLayerRemoveEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
		 * 
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			this.plugins['Oskari.userinterface.Tile'].refresh();
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), false);
		},
		/**
		 * @method AfterMapLayerAddEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
		 * 
		 * Calls flyouts handleLayerSelectionChanged() method
		 */
		'AfterMapLayerAddEvent' : function(event) {
			this.plugins['Oskari.userinterface.Tile'].refresh();
			this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged(event.getMapLayer(), true, event.getKeepLayersOrder());
		},
		/**
		 * @method MapLayerEvent
		 * @param {Oskari.mapframework.event.common.MapLayerEvent} event
		 */
		'MapLayerEvent' : function(event) {
			
        	var mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        	var layerId = event.getLayerId();
        	
        	if(event.getOperation() === 'update') {
        		var layer = mapLayerService.findMapLayer(layerId);
				this.plugins['Oskari.userinterface.Flyout'].handleLayerModified(layer);
			}
		},		
		/**
		 * @method MapLayerVisibilityChangedEvent
		 */
		'MapLayerVisibilityChangedEvent' : function(event) {
			this.plugins['Oskari.userinterface.Flyout'].handleLayerVisibilityChanged(event.getMapLayer(), event.isInScale(), event.isGeometryMatch());
		},        
        /**
         * @method AfterChangeMapLayerOpacityEvent
         */
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            if(event._creator != this.getName()) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerOpacityChanged(event.getMapLayer());
            }
        },   
        /**
         * @method AfterChangeMapLayerStyleEvent
         */
        'AfterChangeMapLayerStyleEvent' : function(event) {
            if(event._creator != this.getName()) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerStyleChanged(event.getMapLayer());
            }
        }
	},

	/**
	 * @method stop
	 * implements BundleInstance protocol stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

        //this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	/**
	 * @method startExtension
	 * implements Oskari.userinterface.Extension protocol startExtension method
	 * Creates a flyout and a tile:
	 * Oskari.mapframework.bundle.layerselection2.Flyout
	 * Oskari.mapframework.bundle.layerselection2.Tile
	 */
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselection2.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.layerselection2.Tile', this);
	},
	/**
	 * @method stopExtension
	 * implements Oskari.userinterface.Extension protocol stopExtension method
	 * Clears references to flyout and tile
	 */
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	/**
	 * @method getPlugins
	 * implements Oskari.userinterface.Extension protocol getPlugins method
	 * @return {Object} references to flyout and tile
	 */
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the component 
	 */
	getTitle : function() {
		return this.getLocalization('title');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the component 
	 */
	getDescription : function() {
		return this.getLocalization('desc');
	},
	/**
	 * @method createUi
	 * (re)creates the UI for "selected layers" functionality
	 */
	createUi : function() {
		var me = this;
		this.plugins['Oskari.userinterface.Flyout'].createUi();
		this.plugins['Oskari.userinterface.Tile'].refresh();
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.mapframework.bundle.layerselection2.Flyout
 *
 * Renders the "selected layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselection2.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance} instance
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
        if(!jQuery(this.container).hasClass('layerselection2')) {
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

        this.templateLayer = jQuery('<li class="layer selected">' + '<div class="layer-info">' + '<div class="layer-icon"></div>' + '<div class="layer-tool-remove"></div>' + '<div class="layer-title"><h4></h4></div>' + '</div>' + '<div class="stylesel">' + '<label for="style">' + loc['style'] + '</label>' + '<select name="style"></select></div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');
        // footers are changed based on layer state
        this.templateLayerFooterTools = jQuery('<div class="left-tools">' + '<div class="layer-visibility">' + '<a href="JavaScript:void(0);">' + loc['hide'] + '</a>' + '&nbsp;' + '<span class="temphidden" style="display: none;">' + loc['hidden'] + '</span>' + '</div>' + '<div class="layer-opacity">' + '<div class="layout-slider" id="layout-slider">' + '</div> ' + '<div class="opacity-slider" style="display:inline-block"><input type="text" name="opacity-slider" class="opacity-slider opacity" id="opacity-slider" />%</div>' +
            '</div>' + '</div>' + '<div class="right-tools">' + '<div class="layer-description"><div class="wrapper">' + '</div>' + '</div>' + '<div class="layer-rights"></div>' + '<a href="JavaScript:void(0);"><div class="icon-info"></div></a></div>');

        this.templateLayerFooterHidden = jQuery('<p class="layer-msg"><a href="JavaScript:void(0);">' + loc['show'] + '</a> ' + loc['hidden'] + '</p>');

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
        console.log("Flyout.setState", this, state);
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

        for(var n = layers.length - 1; n >= 0; --n) {
            var layer = layers[n];
            var layerContainer = this._createLayerContainer(layer);
            listContainer.append(layerContainer);

            // footer tools
            this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);
        }

        // RIGHTJS sortable event handling
        //TODO: get rid of sortableBinded and UNBIND?
        if(!this.sortableBinded) {
            this.sortableBinded = true;
            ".selectedLayersList".on('finish', function(event) {
                /*  event.list;  // reference to the target list
                 event.item;  // reference to the handled item
                 event.index; // the index of the related item
                 event.event; // original dom-event object*/
                me._layerOrderChanged(event.index);
            });
        }
    },
    _appendLayerFooter : function(layerDiv, layer, isInScale, isGeometryMatch) {
        var footer = layerDiv.find('div.layer-tools');

        if(!layer.isVisible()) {
            layerDiv.addClass('hidden');
            footer.append(this._createLayerFooterHidden(layer));
        } else if(!isInScale) {
            layerDiv.addClass('out-of-scale');
            footer.append(this._createLayerFooterOutOfScale(layer));
        } else if(!isGeometryMatch) {
            layerDiv.addClass('out-of-content');
            footer.append(this._createLayerFooterOutOfContentArea(layer));
        } else {
            footer.append(this._createLayerFooter(layer, layerDiv));
            this._addSlider(layer);
        }

    },
    _addSlider : function(layer) {

        var me = this;
        var slider = me._sliders[layer.getId()] 
        if(!slider) {
            var slider = new Slider({
                min : 0,
                max : 100
            });
    
            slider.setStyle({
                'background-color' : 'transparent',
                'background-image' : 'url("../../resources/framework/bundle/layerselection2/images/opacity_slider.png")',
                'height' : '5px',
                'width' : '150px',
                'border' : '0',
                'margin' : 0
            });
    
            slider.level.hide();
    
            slider.handle.setStyle({
                'background-color' : 'transparent',
                'background-image' : 'url("../../resources/framework/bundle/layerselection2/images/opacity_index.png")',
                'width' : '15px',
                'height' : '15px',
                'border' : '0',
                'margin-left' : 0
            });
    
            slider.on('change', function(event) {
                me._layerOpacityChanged(layer, event.value);
            });
            me._sliders[layer.getId()] = slider;
        }
        slider.setValue(layer.getOpacity());
        // only render if visible on screen
        if(jQuery('#layout-slider-' + layer.getId()).length > 0) {
            slider.insertTo('layout-slider-' + layer.getId());
            slider.assignTo('opacity-slider-' + layer.getId());
        }
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
        if(newIndex > -1) {
            // the layer order is reversed in presentation
            // the lowest layer has the highest index
            newIndex = (allNodes.length - 1) - newIndex;
            var sandbox = this.instance.getSandbox();
            var builder = sandbox.getRequestBuilder('RearrangeSelectedMapLayerRequest');
            var request = builder(movedId, newIndex);
            sandbox.request(this.instance.getName(), request);
        }
    },
    /**
     * @method _createLayerContainer
     * @private
     * Creates the layer containers
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
     * @return {jQuery} reference to the created layer container
     */
    _createLayerContainer : function(layer) {

        var me = this;
        var sandbox = me.instance.getSandbox();
        var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');

        var layerId = layer.getId();
        var value = layer.getOpacity();

        var layerDiv = this.templateLayer.clone();

        // setup id
        layerDiv.attr('layer_id', layerId);
        layerDiv.find('div.layer-title h4').append(layer.getName());
        layerDiv.find('div.layer-title').append(layer.getDescription());

        var stylesel = layerDiv.find('div.stylesel');
        stylesel.hide();

        if(layer.getStyles && layer.getStyles().size > 1) {
            var hasOpts = false;
            var styles = layer.getStyles();
            var sel = stylesel.find('select');
            for(var i = 0; i < styles.size(); i++) {
                if(styles[i].getName()) {
                    var opt = jQuery('<option value="' + styles[i].getName() + '">' + styles[i].getTitle() + '</option>');
                    sel.append(opt);
                    hasOpts = true;
                }
            }
            sel.change(function(e) {
                var val = sel.find('option:selected').val();
                layer.selectStyle(val);
                var builder = sandbox.getRequestBuilder('ChangeMapLayerStyleRequest');
                var req = builder(layer.getId(), val);
                sandbox.request(me.instance.getName(), req);
            });
            if(hasOpts) {

                sel.val(layer.getCurrentStyle().getName());
                stylesel.show();
            }
        }

        // setup icon
        var tooltips = this.instance.getLocalization('layer').tooltip;
        var icon = layerDiv.find('div.layer-icon');
        if(layer.isBaseLayer()) {
            icon.addClass('layer-base');
            icon.attr('title', tooltips['type-base']);
            // tooltip = mapservice_basemap_image_tooltip
        } else if(layer.isLayerOfType('WMS')) {
            if(layer.isGroupLayer()) {
                icon.addClass('layer-group');
            } else {
                icon.addClass('layer-wms');
            }
            icon.attr('title', tooltips['type-wms']);
            // tooltip = mapservice_maplayer_image_tooltip
        }
        // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
        // but since it would require some refactoring to make this general
        // I'll just leave this like it was on old implementation
        else if(layer.isLayerOfType('WMTS')) {
            icon.addClass('layer-wmts');
            icon.attr('title', tooltips['type-wms']);
            //icon.attr('title', 'mapservice_maplayer_image_tooltip');
        } else if(layer.isLayerOfType('WFS')) {
            icon.addClass('layer-wfs');
            icon.attr('title', tooltips['type-wfs']);
            // tooltip = selected_layers_module_wfs_icon_tooltip
        } else if(layer.isLayerOfType('VECTOR')) {
            icon.addClass('layer-vector');
            icon.attr('title', tooltips['type-wms']);
            // tooltip = mapservice_maplayer_image_tooltip
        }

        // remove layer from selected tool
        layerDiv.find('div.layer-tool-remove').addClass('icon-close');
        layerDiv.find('div.layer-tool-remove').bind('click', function() {
            var builder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
            var request = builder(layer.getId());
            sandbox.request(me.instance.getName(), request);
        });
        return layerDiv;
    },
    /**
     * @method handleLayerVisibilityChanged
     * Changes the container representing the layer by f.ex "dimming" it and changing the footer to match current layer status
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to modify
     * @param {Boolean} isInScale true if map is in layers scale range
     * @param {Boolean} isGeometryMatch true if layers geometry is in map viewport
     */
    handleLayerVisibilityChanged : function(layer, isInScale, isGeometryMatch) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var layerDiv = jQuery(this.container).find('li.layer.selected[layer_id=' + layer.getId() + ']');
        var loc = this.instance.getLocalization('layer');

        // teardown previous footer & layer state classes
        var footer = layerDiv.find('div.layer-tools');
        footer.empty();
        layerDiv.removeClass('hidden');
        layerDiv.removeClass('out-of-scale');
        layerDiv.removeClass('out-of-content');

        this._appendLayerFooter(layerDiv, layer, isInScale, isGeometryMatch);

    },
    /**
     * @method _layerOpacityChanged
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer that had its opacity changed
     * @param {Number} newOpacity layer that had its opacity changed
     *
     * Handles slider/input field for opacity on this flyout/internally
     */
    _layerOpacityChanged : function(layer, newOpacity) {
        var sandbox = this.instance.getSandbox();
        var requestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
        var request = requestBuilder(layer.getId(), newOpacity);
        sandbox.request(this.instance.getName(), request);

        var layerDiv = jQuery(this.container).find('li.layer.selected[layer_id=' + layer.getId() + ']');
        layerDiv.find('div.layer-opacity input.opacity').attr('value', layer.getOpacity());
    },
    /**
     * @method handleLayerOpacityChanged
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer that had its opacity changed
     *
     * Handles slider/input field for opacity value change when it is changed externally
     */
    handleLayerOpacityChanged : function(layer) {
        this._addSlider(layer);
        //this._sliders[layer.getId()].setValue(layer.getOpacity());
    },
    /**
     * @method handleLayerStyleChanged
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer that had its style changed
     *
     * Handles style dropdown change when it is changed externally
     */
    handleLayerStyleChanged : function(layer) {

        var layerDiv = jQuery(this.container).find('li.layer.selected[layer_id=' + layer.getId() + ']');
        var styleDropdown = layerDiv.find('div.stylesel select');
        styleDropdown.val(layer.getCurrentStyle().getName());
    },
    /**
     * @method _createLayerFooterOutOfScale
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     * @return {jQuery} reference to the created footer
     *
     * Creates an out-of-scale footer for the given layer
     */
    _createLayerFooterOutOfScale : function(layer) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var msg = this.templateLayerFooterOutOfScale.clone();
        var requestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapMoveByLayerContentRequest');
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = requestBuilder(layer.getId());
            sandbox.request(me.instance.getName(), request);
        });
        return msg;
    },
    /**
     * @method _createLayerFooterHidden
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     * @return {jQuery} reference to the created footer
     *
     * Creates footer for the given invisible layer
     */
    _createLayerFooterHidden : function(layer) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var msg = this.templateLayerFooterHidden.clone();
        var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = visibilityRequestBuilder(layer.getId(), true);
            sandbox.request(me.instance.getName(), request);
        });
        return msg;
    },
    /**
     * @method _createLayerFooterOutOfContentArea
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     * @return {jQuery} reference to the created footer
     *
     * Creates an out-of-contentarea footer for the given layer
     */
    _createLayerFooterOutOfContentArea : function(layer) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var msg = this.templateLayerFooterOutOfContentArea.clone();
        var requestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapMoveByLayerContentRequest');
        msg.find('a').bind('click', function() {
            // send request to show map layer
            var request = requestBuilder(layer.getId());
            sandbox.request(me.instance.getName(), request);
        });
        return msg;
    },
    /**
     * @method _createLayerFooter
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
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

        var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');

        tools.find('div.layer-visibility a').bind('click', function() {
            // send request to hide map layer
            var request = visibilityRequestBuilder(layer.getId(), false);
            sandbox.request(me.instance.getName(), request);
        });
        // publish permissions
        var publishPermission = layer.getPermission('publish');
        //alert(layer.getName() + " " +publishPermission);
        /*
        var publishPermLocKey = null;
        if(publishPermission === -1) {
            publishPermLocKey = 'notavailable';
        } else if(publishPermission === 0) {
            publishPermLocKey = 'guest';
        } else if(publishPermission === 1) {
            publishPermLocKey = 'loggedin';
        } else if(publishPermission === 2) {
            publishPermLocKey = 'official';
        }
        if(publishPermLocKey) {
            tools.find('div.layer-rights').html(loc.rights[publishPermLocKey]);
        }

		alert(sandbox.getUser().isLoggedIn());
		*/
		//alert(sandbox.getUser().isLoggedIn());
		
		if (!sandbox.getUser().isLoggedIn()) {
			if (publishPermission == 'can_be_published') {
				tools.find('div.layer-rights').html(loc.rights['login-url']);
				tools.find('div.layer-rights').attr("title",loc.rights['need-login']);
			} else {
				tools.find('div.layer-rights').html(loc.rights['no_publication_permission'].label);
				tools.find('div.layer-rights').attr("title",loc.rights['no_publication_permission'].tooltip);
			}
		}else {
			tools.find('div.layer-rights').html(loc.rights[publishPermission].label);
			tools.find('div.layer-rights').attr("title",loc.rights[publishPermission].tooltip);
		}
		//tools.find('div.layer-rights').html(publishPermission);
        // data url link
        if(!layer.getDataUrl()) {
            // no functionality -> hide
            tools.find('div.layer-description').hide();
        } else {
            //tools.find('div.layer-description a').html(loc.description);
            tools.find('div.layer-description a').attr('href', layer.getDataUrl());
            tools.find('div.layer-description a').attr('target', '_blank');
        }

        // slider
        var opacitySlider = tools.find('div.layout-slider');
        opacitySlider.attr('id', 'layout-slider-' + layer.getId());

        var opacityInput = tools.find('input.opacity-slider');
        opacityInput.attr('id', 'opacity-slider-' + layer.getId());

        return tools;
    },
    /**
     * @method handleLayerSelectionChanged
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was changed
     * @param {Boolean} isSelected
     *           true if layer is selected, false if removed from selection
     * @param {Boolean} keepLayersOrder
     *           true to ignore baselayer placement
     * If isSelected is false, removes the matching layer container from the UI.
     * If isSelected is true, constructs a matching layer container and adds it to the UI.
     */
    handleLayerSelectionChanged : function(layer, isSelected, keepLayersOrder) {
        // add layer
        if(isSelected == true) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var scale = sandbox.getMap().getScale();

            var listContainer = jQuery('ul.selectedLayersList');
            var layerContainer = this._createLayerContainer(layer);
            // footer tools
            var footer = layerContainer.find('div.layer-tools');
            if(!layer.isVisible()) {
                layerContainer.addClass('hidden');
                footer.append(this._createLayerFooterHidden(layer));
            } else if(!layer.isInScale(scale)) {
                layerContainer.addClass('out-of-scale');
                footer.append(this._createLayerFooterOutOfScale(layer));
            } else {
                footer.append(this._createLayerFooter(layer, layerContainer));
            }
            var previousLayers = [];
            // insert to top
            if(layer.isBaseLayer() && keepLayersOrder != true) {
                // find all baselayers == layers whose id starts with 'base_'
                previousLayers = listContainer.find('li[layer_id^=base_]');
            } else {
                previousLayers = listContainer.find('.layer.selected');
            }

            if(previousLayers.length > 0) {
                // without first(), adds before each layer
                previousLayers.first().before(layerContainer);
            } else {
                listContainer.append(layerContainer);
            }
        }
        // remove layer
        else {
            var layerDiv = jQuery(this.container).find('li[layer_id=' + layer.getId() + ']');
            if(layerDiv) {
                layerDiv.remove();
            }
        }
    },
    /**
     * @method handleLayerModified
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
     *           layer that was modified
     * Updates the name for the given layer in the UI
     */
    handleLayerModified : function(layer) {
        var me = this;
        var layerDiv = jQuery(this.container).find('li[layer_id=' + layer.getId() + ']');
        jQuery(layerDiv).find('.layer-title h4').html(layer.getName());
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.mapframework.bundle.layerselection2.Tile
 * 
 * Renders the "selected layers" tile.
 */
Oskari.clazz
  .define('Oskari.mapframework.bundle.layerselection2.Tile',

	  /**
	   * @method create called automatically on construction
	   * @static
	   * @param {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance} instance
	   * 		reference to component that created the tile
	   */
	  function(instance) {
	    this.instance = instance;
	    this.container = null;
	    this.template = null;
	    this.badge = Oskari.clazz.create('Oskari.userinterface.component.Badge');
	    this.shownLayerCount = null;
	  }, {
	    /**
	     * @method getName
	     * @return {String} the name for the component 
	     */
	    getName : function() {
	      return 'Oskari.mapframework.bundle.layerselection2.Tile';
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
	      this.container = jQuery(el);
	      var status = this.container.children('.oskari-tile-status');
	      this.badge.insertTo(status);
	    },
	    /**
	     * @method startPlugin
	     * Interface method implementation, calls #refresh() 
	     */
	    startPlugin : function() {
	      this.refresh();
	    },
	    /**
	     * @method stopPlugin 
	     * Interface method implementation, clears the container 
	     */
	    stopPlugin : function() {
	      this.container.empty();
	    },
	    /**
	     * @method getTitle 
	     * @return {String} localized text for the title of the tile 
	     */
	    getTitle : function() {
	      return this.instance.getLocalization('title');
	    },
	    /**
	     * @method getDescription 
	     * @return {String} localized text for the description of the tile 
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
	      console.log("Tile.setState", this, state);
	    },
	    /**
	     * @method refresh
	     * Creates the UI for a fresh start
	     */
	    refresh : function() {
	      var me = this;
	      var instance = me.instance;
	      var cel = this.container;
	      var tpl = this.template;
	      var sandbox = instance.getSandbox();
	      var layers = sandbox.findAllSelectedMapLayers();
		  var layerCount = layers.length; 
		  if( this.shownLayerCount && this.shownLayerCount ) {
		  	this.badge.setContent(''+layerCount,'important');
		  } else { 
	      	this.badge.setContent(''+layerCount);
	      }
	      this.shownLayerCount = layerCount;

	    }
	  }, {
	    /**
	     * @property {String[]} protocol
	     * @static 
	     */
	    'protocol' : ['Oskari.userinterface.Tile']
	  });
