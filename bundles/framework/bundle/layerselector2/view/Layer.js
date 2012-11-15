/**
 * @class Oskari.framework.bundle.layerselector2.view.Layer
 * 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.view.Layer",

/**
 * @method create called automatically on construction
 * @static
 */
function(layer, sandbox, localization) {
    this.sandbox = sandbox;
    this.localization = localization;
    this.layer = layer;
    this.backendStatus = null;
    this.ui = this._createLayerContainer(layer);
}, {
	__template : '<div class="layer"><input type="checkbox" /> ' +
                '<div class="layer-tools"><div class="layer-backendstatus-icon"></div>' +
                '<div class="layer-icon"></div><div class="layer-info"></div></div>' + 
                '<div class="layer-title"></div>' + 
                //'<div class="layer-keywords"></div>' + 
            '</div>',
    /**
     * @method getId
     * @return {String} layer id
     */
    getId : function() {
        return this.layer.getId();
    },
    setVisible : function(bln) {
        // checking since we dont assume param is boolean
        if(bln == true) {
            this.ui.show();
        }
        else {
            this.ui.hide();
        }
    },
    setSelected : function(isSelected) {
        // checking since we dont assume param is boolean
        this.ui.find('input').attr('checked', (isSelected == true));
    },
    
    /**
     * @method updateLayerContent
     */
    updateLayerContent : function(layer) {
    	
    	/* set title */
    	var newName = layer.getName();
        this.ui.find('.layer-title').html(newName);
        
        /* set/clear alert if required */
        var prevBackendStatus = this.backendStatus; 
       	var currBackendStatus = layer.getBackendStatus();
       	var loc = this.localization['backendStatus'] ;
       	var locForPrevBackendStatus = prevBackendStatus ? loc[prevBackendStatus] : null;
       	var locForCurrBackendStatus = currBackendStatus ? loc[currBackendStatus] : null;
       	var clsForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.iconClass : null;
       	var clsForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.iconClass : null;
       	var tipForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.tooltip : null;
       	var tipForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.tooltip : null;
		var elBackendStatus = this.ui.find('.layer-backendstatus-icon');
		if( clsForPrevBackendStatus ) {
			/* update or clear */
			if( clsForPrevBackendStatus != clsForCurrBackendStatus  ) {
				elBackendStatus.removeClass(clsForPrevBackendStatus);	
			}
		}
		if( clsForCurrBackendStatus ) {
			/* update or set */
			if( clsForPrevBackendStatus != clsForCurrBackendStatus  ) {
				elBackendStatus.addClass(clsForCurrBackendStatus);	
			}
		}
		if( tipForCurrBackendStatus ) {
			if( tipForPrevBackendStatus != tipForCurrBackendStatus  ) {
				elBackendStatus.attr('title',tipForCurrBackendStatus);	
			}	
		} else if( tipForPrevBackendStatus ) {
			elBackendStatus.attr('title','');
		}
		this.backendStatus = currBackendStatus;
       
    },
    getContainer : function() {
        return this.ui;
    },
    /**
     * @method _createLayerContainer
     * @private
     * Creates the layer containers
     * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
     */
    _createLayerContainer : function(layer) {
        var me = this;
        var sandbox = this.sandbox;
        
        // create from layer template 
        // (was clone-from-template but template was only used once so there was some overhead)  
        var layerDiv = jQuery(this.__template);
        
        var tooltips = this.localization['tooltip'];
        var tools = jQuery(layerDiv).find('div.layer-tools');
        var icon = tools.find('div.layer-icon'); 
        if(layer.isBaseLayer()) {
            icon.addClass('layer-base');
            icon.attr('title', tooltips['type-base']);
        }
        else if(layer.isLayerOfType('WMS')) {
            if(layer.isGroupLayer()) {
                icon.addClass('layer-group');
            }
            else {
                icon.addClass('layer-wms');
            }
            icon.attr('title', tooltips['type-wms']);
        }
        // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
        // but since it would require some refactoring to make this general
        // I'll just leave this like it was on old implementation
        else if(layer.isLayerOfType('WMTS')) {
            icon.addClass('layer-wmts');
            icon.attr('title', tooltips['type-wms']);
        }
        else if(layer.isLayerOfType('WFS')) {
            icon.addClass('layer-wfs');
            icon.attr('title', tooltips['type-wfs']);
        }
        else if(layer.isLayerOfType('VECTOR')) {
            icon.addClass('layer-vector');
            icon.attr('title', tooltips['type-wms']);
        }
        
        
        if(layer.getMetadataIdentifier()) {
            tools.find('div.layer-info').addClass('icon-info');
            tools.find('div.layer-info').click(function() {
                  var rn = 'catalogue.ShowMetadataRequest';
                  var uuid = layer.getMetadataIdentifier();              
                  sandbox.postRequestByName(rn, [
                      { uuid : uuid }
                  ]);
            });
        }
        
        // setup id
        jQuery(layerDiv).attr('layer_id', layer.getId());
        jQuery(layerDiv).find('.layer-title').append(layer.getName());
        jQuery(layerDiv).find('input').change(function() {
            var checkbox = jQuery(this);
            var request = null;
            if(checkbox.is(':checked')) {
                sandbox.postRequestByName('AddMapLayerRequest', [layer.getId(), true]);
            }
            else {
                sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
            }
        });
        
        /*
         * backend status
         */
        var elBackendStatus = tools.find('.layer-backendstatus-icon');
        elBackendStatus.click(function() {
            var mapLayerId = layer.getId();              
            sandbox.postRequestByName('ShowMapLayerInfoRequest', [
                      mapLayerId
            ]);
        });
        
        return layerDiv;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
