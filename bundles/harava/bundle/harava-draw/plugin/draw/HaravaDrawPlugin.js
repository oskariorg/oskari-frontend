/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaDrawPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaDrawPlugin',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} locale array
 * @param {Object} conf array 
 */
function(locale, conf) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._show = true;
    this._conf=conf;
    this.controls = null;
    this.modifyControl = null;
    this.currentMode = null;
    this._locale = locale;
    this._drawLayer = null;
    this._lastfeature = null;
    this.featureStyle = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(
            {
            	pointRadius: "6", 
                fillColor: "#ffcc66",
                strokeColor: "#ff9933",
                strokeWidth: 2,
                graphicZIndex: 1,
                fillOpacity: 0.5,
                cursor: 'pointer'
        })
    });
    
    this.templateAddGeometryTools = jQuery('<div id="harava-add-geometry-tools"></div>');
    this.templateAddGeometry = jQuery('<div id="harava-add-geometry"></div>');    
    this.templateAddPointGeometry = jQuery('<div id="harava-add-geometry-tool-point" class="harava-add-geometry-tool harava-add-geometry-tool-point harava-add-geometry-top-tooltopmargin"></div>');
    this.templateAddLineGeometry = jQuery('<div id="harava-add-geometry-tool-line" class="harava-add-geometry-tool harava-add-geometry-tool-line"></div>');
    this.templateAddPolygonGeometry = jQuery('<div id="harava-add-geometry-tool-area" class="harava-add-geometry-tool harava-add-geometry-tool-area"></div>');
    this.templateSelectGeometry = jQuery('<div id="harava-add-geometry-tool-select" class="harava-add-geometry-tool harava-add-geometry-tool-select"></div>');
    this.templateDeleteSelectedGeometry = jQuery('<div id="harava-add-geometry-tool-delete" class="harava-add-geometry-tool harava-add-geometry-tool-delete"></div>');

}, {
    /** @static @property __name plugin name */
    __name : 'HaravaDrawPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule}
     * reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * Toggle visibility of plugin
     * @param {Boolean} visible visibility
     * @param {Boolean} removeAllFeatures remove all features
     */
    toggleVisibility: function(visible, removeAllFeatures){
    	var me = this;
    	
    	jQuery('.harava-add-geometry-tool').removeClass('disabled');
    	
    	if(visible==true){
    		jQuery('#harava-add-geometry').show();
    		me._sandbox.postRequestByName('StartGeometrySearchRequest', ['pan']);

            // Do default tool selection
        	jQuery('#harava-add-geometry-tool-point').trigger('click');
    		me._show=true;
    	}else{
    		me.toggleControl('pan');
    		jQuery('#harava-add-geometry').hide();
    		me._show=false;
    	}
    	if(removeAllFeatures!=null && removeAllFeatures==true){
			me._drawLayer.removeAllFeatures();
		}
    },
    /**
     * Add WKT String to map
     * @param {Object} wkt
     * @param {String} type
     */
    addWKT: function(wktObject, type){
    	var me = this;
    	
    	
    	var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);    	
		style.pointRadius = 8;
		style.strokeColor='#000000';
		style.fillColor='#E9DA14';
		style.fillOpacity=0.6;
		style.strokeOpacity=1;
		style.strokeWidth=2;
		style.cursor = 'pointer';    	
    	
    	// check wkt type
    	if(typeof wktObject === "string"){
    		var wkt = new OpenLayers.Format.WKT();
    		var feature = wkt.read(wktObject);
    		feature.style = style;
    		me._drawLayer.addFeatures([feature]);
    		me._drawLayer.redraw(); 
    	} else {
    		window.setTimeout(function(){
    			var wkt = new OpenLayers.Format.WKT();
        		var feature = wkt.read(wktObject.geom);
        		feature.attributes = wktObject.attributes;
        		feature.style = style;
        		me._drawLayer.addFeatures([feature]);
        		me._drawLayer.redraw();
    			
    		},200); 
    	}
		  	
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        this._sandbox = sandbox;
        this._sandbox.printDebug("[HaravaDrawPlugin] init");

    	me._drawLayer = new OpenLayers.Layer.Vector("Harava geometry layer", {
    		eventListeners : {
                "featuresadded" : function(layer) {                	
                	// send an event that the drawing has been completed
                    me.finishedDrawing();
                },
                'featureselected':function(evt){
                	// handle feature selection
	               	var feature = evt.feature;
	               	me._lastfeature = feature;
	               	var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);    	
	        		style.pointRadius = 8;
	        		style.strokeColor='#0000ff';
	        		style.fillColor='#0000ff';
	        		style.fillOpacity=0.6;
	        		style.strokeOpacity=1;
	        		style.strokeWidth=2;
	        		style.cursor = 'pointer';
	        		me._lastfeature.style = style;
	        		me._drawLayer.redraw();
	               	
	                me._lastfeature = feature;
	                
	                var lonlat = new OpenLayers.LonLat(feature.geometry.getCentroid().x, feature.geometry.getCentroid().y);
	                me.showPopup(lonlat, feature);
	            },
	            'featureunselected':function(evt){
	            	var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);    	
	        		style.pointRadius = 8;
	        		style.strokeColor='#000000';
	        		style.fillColor='#E9DA14';
	        		style.fillOpacity=0.6;
	        		style.strokeOpacity=1;
	        		style.strokeWidth=2;
	        		style.cursor = 'pointer';
	        		me._lastfeature.style = style;
	        		
	        		if(me._conf.popupHtml!=null && jQuery('#kana').is(':visible')){
		        		me._lastfeature.attributes.name = jQuery('#harava-draw-popup-name').val();
		        		me._lastfeature.attributes.desc = jQuery('#harava-draw-popup-desc').val();
		        		me._lastfeature.attributes.value = jQuery('#harava-draw-popup-value').val();
		        		me._lastfeature.attributes.date = jQuery('#harava-draw-popup-date').val();
		        		me._lastfeature.attributes.additionalData = jQuery('#harava-draw-popup-additional-data').val();
	        		}
	        		me._drawLayer.redraw();
	        		me._lastfeature = null;
	        		
	        		me.hidePopup();
	            },
	            'featuremodified':function(evt) {
	            	// handle feature modification
	            	var feature = evt.feature;
	            	me._lastfeature = feature;
	            	var lonlat = new OpenLayers.LonLat(feature.geometry.getCentroid().x, feature.geometry.getCentroid().y);
	                me.showPopup(lonlat, feature);
	            }
            },
            styleMap: this.featureStyle
    	});
    	
    	me._map.addLayers([me._drawLayer]);
    	
    	this.controls = {
            point: new OpenLayers.Control.DrawFeature(me._drawLayer,
                        OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me._drawLayer,
                        OpenLayers.Handler.Path),
            polygon: new OpenLayers.Control.DrawFeature(me._drawLayer,
                        OpenLayers.Handler.Polygon,{handlerOptions: {holeModifier: "altKey"}})
        };
    	
    	// Add module modify controls
        this.modifyControl = new OpenLayers.Control.ModifyFeature(me._drawLayer, {
            autoActivate:true
            });
        
        var addGeometryToolsContainer = me.templateAddGeometryTools.clone();
        var addGeometryContainer = me.templateAddGeometry.clone();
        
        var addPointGeometryContainer = me.templateAddPointGeometry.clone();
        addPointGeometryContainer.attr('title',me._locale.tooltips.drawPoint);
        var addLineGeometryContainer = me.templateAddLineGeometry.clone();
        addLineGeometryContainer.attr('title',me._locale.tooltips.drawLine);
        var addPolygonGeometryContainer = me.templateAddPolygonGeometry.clone();
        addPolygonGeometryContainer.attr('title',me._locale.tooltips.drawPolygon);
        var selectGeometryContainer = me.templateSelectGeometry.clone();
        selectGeometryContainer.attr('title',me._locale.tooltips.selectGeometry);
        var deleteSelectedGeometryContainer = me.templateDeleteSelectedGeometry.clone();
        deleteSelectedGeometryContainer.attr('title',me._locale.tooltips.deleteSelectedDraw);
        
        jQuery('#harava-geom-tools').append(addGeometryContainer);
        jQuery(addGeometryContainer).append(addGeometryToolsContainer);                
        jQuery(addGeometryToolsContainer).append(addPointGeometryContainer);
        jQuery(addGeometryToolsContainer).append(addLineGeometryContainer);
        jQuery(addGeometryToolsContainer).append(addPolygonGeometryContainer);
        jQuery(addGeometryToolsContainer).append(selectGeometryContainer);
        jQuery(addGeometryToolsContainer).append(deleteSelectedGeometryContainer);
        
        jQuery('.harava-add-geometry-tool').live('click', function(){
    		var id = this.id;
        	
        	if(jQuery(this).hasClass('disabled') || (id=='harava-add-geometry-tool-delete' && me._lastfeature==null && me._conf.popupHtml!=null)){
        		return false;
        	}
        	
        	me._sandbox.postRequestByName('StartGeometrySearchRequest', ['pan']);
        	
    		
    		if(id!='harava-add-geometry-tool-delete'){
    			jQuery('.harava-add-geometry-tool').removeClass('active');
    			jQuery(this).addClass('active');
    		}
    		
    		switch(id){
				case 'harava-add-geometry-tool-point':
					me.toggleControl('point');
					break;
				case 'harava-add-geometry-tool-line':
					me.toggleControl('line'); 
					break;
				case 'harava-add-geometry-tool-area':
					me.toggleControl('polygon');
					break;
				case 'harava-add-geometry-tool-select':
					me.toggleControl('modify');
					break;
				case 'harava-add-geometry-tool-delete':
		    		jQuery('.harava-add-geometry-tool').removeClass('disabled');
					me.deleteSelectedFeature();
					jQuery('#harava-add-geometry-tool-delete').addClass('active');
			    	window.setTimeout(function(){
			    		jQuery('#harava-add-geometry-tool-delete').removeClass('active');
			    	},200);
					break;
    		}
    		
    	});
        
        for(var key in me.controls) {
    		me._map.addControl(me.controls[key]);
        }
       	me._map.addControl(me.modifyControl);
       	me.modifyControl.activate();
        
        if(me._conf!=null && me._conf.visibility!=null){
    		me.toggleVisibility(me._conf.visibility);
    	}
    },
    /**
     * Get all geometries
     * @return {OpenLayers.Feature[]} features
     */
    getAllFeatures: function(){
    	var me = this;
    	var features = [];
    	me.toggleControl(me.currentMode);
    	
    	jQuery.each(me._drawLayer.features, function(k, feature){
    		var geom = feature.geometry;
    		if(geom!=null && typeof geom.toString == 'function'){
    			var geomString = geom.toString();
    			
    			if(me._conf.popupHtml!=null){
    				features.push({
    					geom:geomString,
    					attributes: feature.attributes
					});
    			} else {
    				features.push(geomString);
    			}
    		}
    	});
    	
    	return features;
    },
    /**
     * Delete selected feature
     */
    deleteSelectedFeature: function(){
    	var me = this;
    	if(me._lastfeature!=null){
    		var answer = confirm(me._locale.confirmDelete);
    		if(answer){
    			me._lastfeature.destroy();
    			me.toggleControl(me.currentMode);
    			me._drawLayer.redraw();
    		}
    	} else {
    		alert(me._locale.notSelected);
    	}
    },
    /**
     * @method finishedDrawing
     * Finish drawing
     */
    finishedDrawing : function(){
    	var me = this;
    	
    	me.modifyControl.selectControl.unselectAll();
    	var currentFeature = me._drawLayer.features[me._drawLayer.features.length - 1];
    	
    	var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);    	
		style.pointRadius = 8;
		style.strokeColor='#000000';
		style.fillColor='#E9DA14';
		style.fillOpacity=0.6;
		style.strokeOpacity=1;
		style.strokeWidth=2;
		style.cursor = 'pointer';
		currentFeature.style = style;
		var lonlat = new OpenLayers.LonLat(currentFeature.geometry.getCentroid().x, currentFeature.geometry.getCentroid().y);
		
		me.showPopup(lonlat,currentFeature);
		
		me._drawLayer.redraw();
    },
    /**
     * @method hidePopup
     * @private
     * Closes the popup
     */
    hidePopup : function() {
    	var me = this;
    	if(me._conf.popupHtml!=null){
	        var rn = "HaravaInfoBox.HideInfoBoxRequest";
	        var rb = this._sandbox.getRequestBuilder(rn);
	        var r = rb(this.infoboxId);
	        this._sandbox.request(this, r);
    	}
    },
    /**
     * @method showPopup
     * @private
     * Shows the popup
     * @param {OpenLayers.LonLat} lonlat
     * @param {OpenLayers.Feature} feature
     */
    showPopup: function(lonlat, feature){
    	var me = this;
    	
    	if(me._conf.popupHtml!=null){
    		var oldMode = me.currentMode;
    		me.toggleControl(null);
    		
    		jQuery('.harava-add-geometry-tool').addClass('disabled');
    		jQuery('.harava-add-geometry-tool-delete').removeClass('disabled');
    		
    		if(feature.popupHtml==null){
    			feature.popupHtml = me._conf.popupHtml;
    		}
    		
	        var content = {};
	        content.html = feature.popupHtml;
	        var rn = "HaravaInfoBox.ShowInfoBoxRequest";
	        var rb = me._sandbox.getRequestBuilder(rn);
	        var r = rb('kana', "Info", [content], lonlat, true,null,null,true);
	        me._sandbox.request(me, r);
	        
	        jQuery('.olPopupCloseBox').hide();
	        
	        jQuery('#kana').unbind('click');
	        jQuery('#kana').bind('click',function(){return false;});        
	        
	        if(feature.attributes.name!=null){
	        	jQuery('#harava-draw-popup-name').val(feature.attributes.name);
	        }
	        if(feature.attributes.desc!=null){
	        	jQuery('#harava-draw-popup-desc').val(feature.attributes.desc);
	        }
	        if(feature.attributes.value!=null){
	        	jQuery('#harava-draw-popup-value').val(feature.attributes.value);
	        }
	        if(feature.attributes.date!=null){
	        	jQuery('#harava-draw-popup-date').val(feature.attributes.date);
	        }
	        if(feature.attributes.additionalData!=null){
	        	jQuery('#harava-draw-popup-additional-data').val(feature.attributes.additionalData);
	        }
	        	        
	        jQuery('#harava-draw-popup-save').unbind('click');
	        jQuery('#harava-draw-popup-save').bind('click',function(){
	        	if(me._conf.popupCheckFunc!=null){
	        		var func = me._conf.popupCheckFunc;
	        		var ret = eval(func)();
	        		if(ret==false){
	        			return false;
	        		}
	        	}
	        	
	        	feature.attributes.name = jQuery('#harava-draw-popup-name').val();
	        	feature.attributes.desc = jQuery('#harava-draw-popup-desc').val();
	        	feature.attributes.value = jQuery('#harava-draw-popup-value').val();
	        	feature.attributes.date = jQuery('#harava-draw-popup-date').val();
	        	feature.attributes.additionalData = jQuery('#harava-draw-popup-additional-data').val();
	        	me.toggleControl(oldMode);
	        	jQuery('.harava-add-geometry-tool').removeClass('disabled');
	        	
        		me.hidePopup();	        	
	        });
	        
	        
	        jQuery('#harava-draw-popup-cancel').unbind('click');
	        jQuery('#harava-draw-popup-cancel').bind('click',function(){
	        	var currentFeature = null;
	        	if(me._drawLayer!=null && me._drawLayer.features.length>0){
		        	currentFeature = me._drawLayer.features[me._drawLayer.features.length-1];
	    			currentFeature.destroy();
		    		me.hidePopup();
		    		me.toggleControl(oldMode);
	        	}
	        });
    	}
    },
    
    /**
     * @method deActivateAll
     * Deactivate all module controls and tools
     */
    "deActivateAll" : function(){
    	var me = this;    	
    	
		for(var key in me.drawControls) {
        	me.drawControls[key].deactivate();
        }
        
		me.modifyControl.deactivate();
    },
    /**
     * @method toggleControl
     * Enables the given control
     * Disables all the other controls
     * @param mode control to activate (if undefined, disables all
     * controls)
     */
    toggleControl : function(mode) {
    	this.currentMode = mode;
    	var me = this;
    	if(me.modifyControl!=null){
    		me.modifyControl.deactivate();
    	}
        for(var key in this.controls) {
            var control = this.controls[key];
            if(mode == key) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
        
        if(mode=='modify'){
        	me.modifyControl.activate();
        }
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        var me = this;
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        this._map = this.getMapModule().getMap();

        this._sandbox.register(this);
        for (p in this.eventHandlers ) {
            this._sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        var me = this;
                
        if (sandbox && sandbox.register) {
            this._sandbox = sandbox;
        }
        
        
        this._sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
    	
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        /*var me = this;
        return this.eventHandlers[event.getName()].apply(this, [event]);
        */
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
