/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayerForm
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm',

/**
 * @method create called automatically on construction
 * @static
 */
function(localization, instance) {
	this.loc = localization;
	this.instance = instance;
	this.panel = null;
	this.plugin = null;
	
    this.templateHelp = jQuery('<div class="help icon-info"></div>');
    this.templateTool = jQuery('<div class="tool"><input type="checkbox"/><span></span></div>');
	
    this.config = {
        layers : {
            promote : [{
                text : this.loc.layerselection.promote,
                id : [24] // , 203
            }],
            preselect : 'base_35'
        }
    };
    this.defaultBaseLayer = null;
    if (this.config.layers.preselect) {
        this.defaultBaseLayer = this.config.layers.preselect;
    }
    this.showLayerSelection = false;
}, {
	init : function() {
		if(!this.panel) {
	        this.panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
	        this.panel.setTitle(this.loc.layers.label);
		}
		
		this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin');
	},
	getPanel : function() {
        this._populateMapLayerPanel();
		return this.panel;
	},
	_enablePlugin : function(blnEnabled) {
        if (blnEnabled) {
            this.plugin.startPlugin(this.instance.sandbox);
        } else {
            this.plugin.stopPlugin(this.instance.sandbox);
        }
	},
	start : function() {
        var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
        mapModule.registerPlugin(this.plugin);
	},
	stop : function() {
		this._enablePlugin(false);
        var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
        mapModule.unregisterPlugin(this.plugin);
	},
	getValues : function() {
		var values = {
		};
		if(this.showLayerSelection) {
			values.layerSelection = {
				id : 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
				conf : {
					defaultBaseLayer : this.defaultBaseLayer
				}
			}
		}
		
		return values;
    },
	validate : function() {
		var errors = [];
		return errors;
   },
    /**
     * @method getLayersList
     * Handles the published map layer selection
     * FIXME: this is completely under construction, rights aren't managed in any
     * way etc
     */
    getLayersList : function() {
        var layers = [];
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for (var i = 0; i < selectedLayers.length; ++i) {
            var layer = {
                id : selectedLayers[i].getId(),
                name : selectedLayers[i].getName(),
                opacity : selectedLayers[i].getOpacity()
            };
            layers.push(layer);
        }
        return layers;
    },
    /**
     * @method _populateMapLayerPanel
     * @private
     * Populates the map layers panel in publisher
     */
    _populateMapLayerPanel : function() {

        var me = this;
        var contentPanel = this.panel.getContainer();

        // tooltip
        var tooltipCont = this.templateHelp.clone();
        tooltipCont.attr('title', this.loc.layerselection.tooltip);
        contentPanel.append(tooltipCont);

        // tool selection
        var toolContainer = this.templateTool.clone();
        toolContainer.find('span').append(this.loc.layerselection.label);
        if (this.showLayerSelection) {
            toolContainer.find('input').attr('checked', 'checked');
        }
        contentPanel.append(toolContainer);
        contentPanel.append(this.loc.layerselection.info);
        toolContainer.find('input').change(function() {
            var checkbox = jQuery(this);
            var isChecked = checkbox.is(':checked');
            me.showLayerSelection = isChecked;
    		me._enablePlugin(isChecked);
            contentPanel.empty();
            me._populateMapLayerPanel();
        });
        if (!this.showLayerSelection) {
            return;
        }
        // if layer selection = ON -> show content
        var closureMagic = function(layer) {
            return function() {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                layer.selected = isChecked;
                if (isChecked) {
                    me.defaultBaseLayer = layer.id;
                } else if (me.defaultBaseLayer == layer.id) {
                    me.defaultBaseLayer = null;
                }
            };
        };
        var layers = this.getLayersList();
        for (var i = 0; i < layers.length; ++i) {
        	
            var layer = layers[i];
            var layerContainer = this.templateTool.clone();
            layerContainer.attr('data-id', layer.id);
            layerContainer.find('span').append(layer.name);
            var input = layerContainer.find('input');
            
            if (this.defaultBaseLayer && this.defaultBaseLayer == layer.id) {
                input.attr('checked', 'checked');
                layer.selected = true;
            }
            input.change(closureMagic(layer));
            contentPanel.append(layerContainer);
        }

        if (this.config.layers.promote && this.config.layers.promote.length > 0) {
            this._populateLayerPromotion(contentPanel);
        }
    },
    /**
     * @method _populateLayerPromotion
     * @private
     * Populates the layer promotion part of the map layers panel in publisher
     */
    _populateLayerPromotion : function(contentPanel) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
        var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
        var closureMagic = function(layer) {
            return function() {
                var checkbox = jQuery(this);
                var isChecked = checkbox.is(':checked');
                if (isChecked) {
                	sandbox.request(me.instance, addRequestBuilder(layer.getId(), true));
                } else {
                	sandbox.request(me.instance, removeRequestBuilder(layer.getId()));
                }
            };
        };
        
        for (var i = 0; i < this.config.layers.promote.length; ++i) {
            var promotion = this.config.layers.promote[i];
            var promoLayerList = this._getActualPromotionLayers(promotion.id);
		
            if (promoLayerList.length > 0) {
                contentPanel.append(promotion.text);
            	for (var j = 0; j < promoLayerList.length; ++j) {
            		var layer = promoLayerList[j];
                	var layerContainer = this.templateTool.clone();
		            layerContainer.attr('data-id', layer.getId());
		            layerContainer.find('span').append(layer.getName());
		            var input = layerContainer.find('input');
        			input.change(closureMagic(layer));
                	contentPanel.append(layerContainer);
                }
            }
        }
    },
    /**
     * @method _getActualPromotionLayers
     * Checks given layer list and returns any layer that is found on the system but not yet selected.
     * The returned list contains the list that we should promote.
     * @param {String[]} list - list of layer ids that we want to promote
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]} filtered list of promoted layers
     * @private
     */
    _getActualPromotionLayers : function(list) {
        var sandbox = this.instance.getSandbox();
        var layersToPromote = [];
        for (var j = 0; j < list.length; ++j) {
            if (!sandbox.isLayerAlreadySelected(list[j])) {
            	var layer = sandbox.findMapLayerFromAllAvailable(list[j]);
	            // promo layer found in system
                if (layer) {
                	layersToPromote.push(layer);
                }
            }
        }
        return layersToPromote;
    }
});

