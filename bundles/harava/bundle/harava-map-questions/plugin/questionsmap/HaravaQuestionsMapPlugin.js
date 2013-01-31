/**
 * @class Oskari.harava.bundle.mapquestions.plugin.HaravaQuestionsMapPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.plugin.HaravaQuestionsMapPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
	this._conf = config;
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.enabled = true;
}, {
	_currentPopupHtml: null,
	_currentControls: {
		modify: null,
		draw: null
	},
	_currentStep: '',
    /** @static @property __name plugin name */
    __name : 'HaravaQuestionsMapPlugin',

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
        this._sandbox.printDebug("[HaravaQuestionsMapPlugin] init");
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
     * @method getAllModuleFeatures
     * Get all modules all features
     * @returns {Array} features
     */
    "getAllModuleFeatures": function(){
    	var me = this;
    	var features = []; 
    	jQuery.each(me.modules, function(k, module){
	        if(module.layer!=null){
	        	jQuery.each(module.layer.features, function(k, feature){
	        		features.push(feature);
	        	});
	        }
    	});    	
    	return features;
    },
    /**
     * @method onPopupClose
     * Close all popus and unselect all features
     * @param {OpenLayers.Event} evt
     * @param {Object} me
     */
    "onPopupClose" : function(evt, me){
    	if(me._currentControls!= null && me._currentControls.modify!=null){
    		me._currentControls.modify.selectControl.unselectAll();
    	}
    	
    	jQuery.each(me.modules, function(k, module){
	        if(module.layer!=null && module.layer.features!=null){
	        	for (var i = 0; i < module.layer.features.length; i++) {
	       			var feature = module.layer.features[i];
	       			if (feature.popup) {
	       				feature.popup.hide();
	       			}
	       		}
        	}
        });
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
        
        
        var conf = me._conf;
        
        if(conf!=null && conf.modules!=null){
        	me.modules = conf.modules;
        	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        	var olMap = mapModule.getMap();
        	var id = olMap.div.id;
        	
        	jQuery('#'+id).append('<div id="harava-map-questions"></div>');
        	
        	/* Add all configured Question modules */
        	jQuery.each(me.modules, function(k, module){
        		var t = '';
        		
    	        // Create module own OpenLayers layer    	        
    	        module.layer = new OpenLayers.Layer.Vector(me.drawLayerSubfix + module.questionId, {
    	        	style: {                    
    	            	pointRadius: "6", 
    	                fillColor: "#ffcc66",
    	                strokeColor: "#ff9933",
    	                strokeWidth: 2,
    	                graphicZIndex: 1,
    	                cursor: 'pointer'
    	             },
    	            eventListeners : {
    	                "featuresadded" : function(layer) {
    	                	// send an event that the drawing has been completed
    	                    me.finishedDrawing();
    	                },
    	                'featureselected':function(evt){
    	                	// handle feature selection
    		               	var feature = evt.feature;
    		            	
    		            	var features = me.getAllModuleFeatures();

		               		for (var i = 0; i < features.length; i++) {
		               			var hiddenfeature = features[i];
		               			if (hiddenfeature.popup) {
		               				hiddenfeature.popup.hide();
		               			}
		               		}
    		               	

    		                // Check feature position (if need pan a map at popup show well)
    		                var pos = new OpenLayers.LonLat(feature.geometry.getCentroid().x, feature.geometry.getCentroid().y);
    		                
    		                // Check viewport min lon and max lon
    		                var left = me._map.getExtent().left;
    		                var right = me._map.getExtent().right;
    		                
    		                var top = me._map.getExtent().top;
    		                var bottom = me._map.getExtent().bottom;

		                	var centerlon = me._map.lon - ((right - left) * 7 / 16);	                	
		                	var centerlat = me._map.lat + ((top - bottom) * 3 / 8);	 
		                	
		                	me._map.moveTo(new OpenLayers.LonLat(centerlon, centerlat));	 
		                	
    		                if (feature.attributes.toolHtml) {
    			            	modifyControls = me._modifyControls;
    			                drawControls = me.drawControls;
    			                
    		                	if (feature.popup === null) {
    		                		popup = new OpenLayers.Popup.FramedCloud(
    	                				feature.id + ".popup",
    				                    OpenLayers.LonLat.fromString(feature.geometry.getCentroid().toShortString()),
    				                    null,
    				                    feature.attributes.toolHtml,
    				                    null,
    				                    true,
    				                    function(evt){
    	                					me.onPopupClose(evt,me);
    	                				}
    			                	);
    				                feature.popup = popup;
    				                me._map.addPopup(feature.popup); 
    		                	}
    		                	else {
    				            	feature.popup.toggle();
    		                	}
    		                }  

    		                me._lastfeature = feature;		            	
    		                mapModule._updateDomain();
    		            },
    		            'featuremodified':function(evt) {
    		            	// handle feature modification
    		            	var feature = evt.feature;
    		            	if (feature.popup !== null) {
    		            		popup = feature.popup;    			            	
    			                popup.lonlat.lon = feature.geometry.getCentroid().x;
    			                popup.lonlat.lat = feature.geometry.getCentroid().y;
    			                popup.updatePosition();
    			            	feature.popup = popup;
    		            	}	            	
    		            }
    	            }
    	        });
    	        
    	        // Add module draw controls
	        	module.drawControls = {
	                point : new OpenLayers.Control.DrawFeature(module.layer, OpenLayers.Handler.Point),
	                line : new OpenLayers.Control.DrawFeature(module.layer, OpenLayers.Handler.Path),
	                area : new OpenLayers.Control.DrawFeature(module.layer, OpenLayers.Handler.Polygon)
	            };            

	        	// Add module modify controls
	            module.modifyControls = {
	            	modify : new OpenLayers.Control.ModifyFeature(module.layer, {
	                autoActivate:true
	                })
	            };
	            
	            // Add module layer to map
	            me._map.addLayers([module.layer]);
	            
	            // Add module controls to map
	            for(var key in module.drawControls) {
	            	me._map.addControl(module.drawControls[key]);
	            }
	            for(var key in module.modifyControls) {
	            	me._map.addControl(module.modifyControls[key]);
	            }
	            
	            // Set module layer not visible
	            module.layer.setVisibility(false);
        	});
        	
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

        for (p in this.eventHandlers ) {
            this._sandbox.unregisterFromEventByName(this, p);
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
     * @method setEnabled
     * Enables or disables gfi functionality
     * @param {Boolean} blnEnabled
     *          true to enable, false to disable
     */
    setEnabled : function(blnEnabled) {
        this.enabled = (blnEnabled === true);
        // close existing if disabled
        if(!this.enabled) {
            this._closeGfiInfo();
        }
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
        var me = this;
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method getOpenLayersDivId get openlayers map div
     * @returns map div id
     */
    getOpenLayersDivId: function(){
    	var me = this;
    	return me._map.div.id;
    },
    /**
     * @method scaleAndCenterMap
     * Zoom and center map to defined scale and zoom
     * @param scale scale
     * @param centerLon center lon coordinate
     * @param centerLat center lat coordinate
     */
    scaleAndCenterMap: function(scale,centerLon,centerLat)
    {
    	var me = this;
    	var mapModule = me.getMapModule();
    	
    	if(scale!=null && scale!=''){
    		mapModule.zoomToScale(scale,false);
    	}
    	
    	if(centerLon!=null && centerLon!='' && centerLat!=null && centerLat!=''){
    		var centerPoint = new OpenLayers.LonLat(centerLon, centerLat);
    		mapModule.panMapToLanLot(centerPoint);
    	}
    	
    	me._map.updateSize();
    },
    /**
     * @method finishedDrawing
     * Finish drawing
     */
    "finishedDrawing" : function(){
    	var me = this;    	

    	// programmatically select the drawn feature ("not really supported by openlayers")       	
   		me._currentControls.modify.selectControl.unselectAll();   		
   		var module = me.getModuleById(me._currentStep);
 
   		var layer = null;
    	if(module!=null){
    		layer = module.layer; 
    	}
   
    	if(layer == null){
    		return;
    	}
   		
       	for (var i = 0; i < layer.features.length; i++) {
   			var feature = layer.features[i];
   			if (feature.popup) {
   				feature.popup.hide();
   			}
       	}    	
       	
    	var currentFeature = layer.features[layer.features.length - 1];

		if (me._currentPopupHtml) {   
    		currentFeature.attributes = {
					"toolHtml": me._currentPopupHtml
			};
    		
    		if (this._toolMaxCount !== null) {
    	        currentCount = 0;

                for(var i = layer.features.length; i > 0; i--) {
                	var feature = layer.features[i - 1];

                	if (feature.attributes.toolTip == this._toolTip) {
                		currentCount += 1;

            	        if (currentCount > this._toolMaxCount) {
	                		feature.destroy();
                		}
                	}
                }       
        	}
    	}
		me._currentControls.modify.selectControl.select(currentFeature);
    },
    /**
     * @method showStep
     * Move questions to defined step
     * @param {String} moduleId
     */
    "showStep": function(moduleId){
    	var me = this;
    	me.deActivateAll();
    	var module = me.getModuleById(moduleId);
    	if(module!=null){        
    		module.layer.setVisibility(true);
    		me._currentControls.modify = module.modifyControls.modify;
    		module.modifyControls.modify.activate();
    		me.scaleAndCenterMap(module.defaultScale,module.centerLon,module.centerLat);
    	}
    	me._currentStep=moduleId;
    },
    /**
     * @method getModuleById
     * Get module by id
     * @param {String} moduleId
     * @returns founded module if exists. If not return null.
     */
    "getModuleById" : function(moduleId){
    	var me = this;
    	var retModule = null;
    	jQuery.each(me.modules, function(k, module){
    		if(module.questionId==moduleId){
    			retModule = module;
    		}
    	});
    	return retModule;
    },
    /**
     * @method deActivateAll
     * Deactivate all module controls and tools
     */
    "deActivateAll" : function(){
    	var me = this;    	
    	me._currentPopupHtml = null;
    	me._currentControls.modify = null;
    	me._currentControls.draw = null;
    	jQuery.each(me.modules, function(k, module){
    		for(var key in module.drawControls) {
            	module.drawControls[key].deactivate();
            }
            for(var key in module.modifyControls) {
            	module.modifyControls[key].deactivate();
            }            
            module.layer.setVisibility(false);            
    	});
    	
    	var popups = me._map.popups;
	    for (var i = 0; i < popups.length; i++) {
        	var popup = popups[i];
        	popup.hide();	                	
	    }
    },
    /**
     * @method getQuestionById
     * Get question by id
     * @param {String} questionId
     * @param {Array} questions
     * @returns founded question if exists. If not return null.
     */
    "getQuestionById" : function(questionId, questions){
    	var me = this;
    	var retQuestion = null;
    	jQuery.each(questions, function(k, question){
    		if(question.id==questionId){
    			retQuestion = question;
    		}
    	});
    	return retQuestion;
    },
    /**
     * @method activateControl
     * Activate selected tool
     * @param {String} moduleId selected moduleid
     * @param {String} questionId selected qustion id
     */
    "activateControl" : function(moduleId, questionId){
    	var me = this;
    	var module = me.getModuleById(moduleId);
    	me.deActivateAll();
    	if(module!=null){
    		var question = me.getQuestionById(questionId, module.questions);
    		if(question!=null){
    			me._currentPopupHtml = question.popupHtml; 
		    	module.layer.setVisibility(true);
		    	if(me._currentStepAndQuestion != moduleId + '_' +questionId){
		    		module.drawControls[question.type].activate();
		    	}
	    		module.modifyControls.modify.activate();
		        me._currentControls.modify = module.modifyControls.modify;
		        me._currentControls.draw = module.drawControls[question.type];
		        me._currentStepAndQuestion = moduleId + '_' +questionId;
    		}
    	}
    },
    /**
     * @method destroySelectedFeature
     * Destroy selected feature
     */
    "destroySelectedFeature" : function () {
    	var me = this;
    	var feature = me._lastfeature;
    	if (feature) {
    		me._currentControls.modify.selectControl.unselectAll();
    		if (feature.popup) {
        		feature.popup.destroy();
        	}
    		feature.destroy();
    	}
    },
    /**
     * @method hideSelectedFeature
     * Hide selected feature
     */
    "hideSelectedFeature" : function () {    	
    	var me = this;
    	var feature = me._lastfeature;
    	if (feature) {
    		me._currentControls.modify.selectControl.unselectAll();
    		if (feature.popup) {
        		feature.popup.hide();
        	}
    	}
    }
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
