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
function(localization, instance) {
	this.loc = localization;
	this.instance = instance;
	this.panel = null;
	this.plugin = null;
    this.isDataVisible = false;
	
    this.templateHelp = jQuery('<div class="help icon-info"></div>');
    this.templateTool = jQuery('<div class="tool"><input type="checkbox"/><label></label></div>');
	
    this.config = {
        layers : {
            promote : [{
                text : this.loc.layerselection.promote,
                id : [24] // , 203
            }],
            preselect : ['base_35']
        }
    };
    this.pluginConfig = {};
    this.showLayerSelection = false;
}, {
    /**
     * @method init
     * Creates the Oskari.userinterface.component.AccordionPanel where the UI is rendered and 
     * the Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
     */
	init : function() {
		if(!this.panel) {
	        this.panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
	        this.panel.setTitle(this.loc.layers.label);
		}
        //this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin', this.pluginConfig);
	},

    /**
     * Prepopulates the form/plugin with given data
     * 
     * @method useConfig
     * @param {Object} pConfig data to prepopulate the form and plugin
     */
    useConfig : function(pConfig) {
        if(pConfig) {
            if( Object.prototype.toString.call( pConfig.baseLayers ) === '[object Array]' &&
                pConfig.baseLayers.length > 0) {

                this.config.layers.preselect = pConfig.baseLayers;
            }
            else {
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
	getPanel : function() {
        this._populateMapLayerPanel();
		return this.panel;
	},
    /**
     * Controls the LayerSelectionPlugin by calling start/stop.
     * 
     * @method enablePlugin
     * @param {Boolean} true to start the plugin, false to stop it
     */
	enablePlugin : function(blnEnabled) {
        if (blnEnabled) {
            this.plugin.startPlugin(this.instance.sandbox);
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
	isEnabled : function() {
	    return this.showLayerSelection; 
	},
    /**
     * Registers the plugin to MainMapModule
     * 
     * @method start
     */
	start : function() {
        this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin', this.pluginConfig);
        var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
        mapModule.registerPlugin(this.plugin);
        if(this.showLayerSelection) {
            this.enablePlugin(true);
        }
	},
    /**
     * Unregisters the plugin from MainMapModule
     * 
     * @method stop
     */
	stop : function() {
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
	getValues : function() {
		var values = {
		};
		if(this.showLayerSelection) {
			values.layerSelection = {
				id : 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
				config : {
				}
			}
			var pluginValues = this.plugin.getBaseLayers();
			if(pluginValues.defaultBaseLayer) {
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
	validate : function() {
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
    _getLayersList : function() {
        var layers = [];
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        return selectedLayers;
    },
    /**
     * Populates the map layers panel in publisher
     * 
     * @method _populateMapLayerPanel
     * @private
     */
    _populateMapLayerPanel : function() {

        var me = this;
        var contentPanel = this.panel.getContainer();
        contentPanel.empty();

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
        toolContainer.find('input').attr('id', 'show-map-layers-checkbox').change(function() {
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
        // if layer selection = ON -> show content
        var closureMagic = function(layer) {
            return function() {
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
        var shouldPreselectLayer = function(layerId) {
            var isFound = jQuery.inArray('' + layerId, me.config.layers.preselect);        
            return isFound != -1;
        };
        var layers = this._getLayersList();
        for (var i = 0; i < layers.length; ++i) {
        	
            var layer = layers[i];
            var layerContainer = this.templateTool.clone();
            layerContainer.attr('data-id', layer.getId());
            layerContainer.find('label').attr('for', 'checkbox'+layer.getId()).append(layer.getName());
            var input = layerContainer.find('input');
            input.attr('id', 'checkbox'+layer.getId());
            
            if (shouldPreselectLayer(layer.getId())) {
                input.attr('checked', 'checked');
                layer.selected = true;
                this.plugin.addBaseLayer(layer);
            }
            input.change(closureMagic(layer));
            contentPanel.append(layerContainer);
        }

        if (this.config.layers.promote && this.config.layers.promote.length > 0) {
            this._populateLayerPromotion(contentPanel);
        }
    },
    /**
     * Populates the layer promotion part of the map layers panel in publisher
     * 
     * @method _populateLayerPromotion
     * @private
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
                	// promoted layers go directly to baselayers
                    me.plugin.addBaseLayer(layer);
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
		            layerContainer.find('label').attr('for', 'checkbox'+layer.getId()).append(layer.getName());
		            var input = layerContainer.find('input');
                    input.attr('id', 'checkbox'+layer.getId())
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

