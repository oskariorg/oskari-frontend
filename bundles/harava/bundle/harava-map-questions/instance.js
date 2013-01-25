/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.MapQuestionsBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.coordinatedisplay.MapQuestions bundle
 */
Oskari.clazz.define("Oskari.harava.bundle.MapQuestionsBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.requestHandlers = {};
	this.modules = null;
	this._lastfeature = null;
	this.drawLayerSubfix = 'Map Questions Layer - ';
}, {
	_currentPopupHtml: null,
	_currentControls: {
		modify: null,
		draw: null
	},
	_currentStep: '',
	_currentStepAndQuestion: '',
	/**
	 * @static
	 * @property __name
	 */
	__name : 'HaravaMapQuestions',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method start
     * BundleInstance protocol method
     */
    "start" : function() {
    	var me = this;
    	if(me.started){
    		return;
    	}
    	
    	me.started = true;
    	
    	var sandbox = Oskari.$("sandbox");
        me.sandbox = sandbox;
        
        var conf = me.conf;
        
        if(conf!=null && conf.modules!=null){
        	me.modules = conf.modules;
        	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        	var opMap = mapModule.getMap();
        	var id = opMap.div.id;
        	
        	jQuery('#'+id).append('<div id="harava-map-questions"></div>');
        	
        	/* Add all configured Question modules */
        	$.each(me.modules, function(k, module){
        		var html = '';
        		var t = '';
        		if(module.questionTitle!=''){
        			t = '<p>'+module.questionTitle+'</p>';
        		}
        		jQuery(module.appendTo).append('<div class="harava-map-question-title">'+t+'</div>');
    	        jQuery(module.appendTo).append('<div id="harava-map-questions-content"></div>');
    	        
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
    		               	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    		            	var opMap = mapModule.getMap();
    		            	map = opMap;
    		            	
    		            	var features = me.getAllModuleFeatures();

		               		for (var i = 0; i < features.length; i++) {
		               			var hiddenfeature = features[i];
		               			if (hiddenfeature.popup) {
		               				hiddenfeature.popup.hide();
		               			}
		               		}
    		               	
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
    				                    me.onPopupClose
    			                	);
    				                feature.popup = popup;
    				                map.addPopup(feature.popup); 
    		                	}
    		                	else {
    				            	feature.popup.toggle();
    		                	}
    		                }  

    		                // Check feature position (if need pan a map at popup show well)
    		                var pos = new OpenLayers.LonLat(feature.geometry.getCentroid().x, feature.geometry.getCentroid().y);
    		                
    		                // Check viewport min lon and max lon
    		                var left = map.getExtent().left;
    		                var right = map.getExtent().right;
    		                var leftquarter = left + ((right - left) / 4);
    		                
    		                // If drawed geometry is located in the left quarter of the map. Map is moved to the left
    		                if (pos.lon < leftquarter) {
    		                	var centerlon = pos.lon + ((right - left) / 4);	                	
    		                	var centerlat =  map.getCenter().lat;
    		                
    		                	// If drawed geometry is located in the left one-fifth, but not bottom one-six. Move map there.
    		                	var leftfifth = left + ((right - left) / 5);
    		                	if (pos.lon < leftfifth) {
    			                	var top = map.getExtent().top;
    			                	var bottom = map.getExtent().bottom;    			                	
    			                	var bottomquarter = bottom + ((top - bottom) / 8);    			                	
    			                	if (pos.lat > bottomquarter) {
    			                		centerlat = pos.lat + ((top - bottom) * 3 / 8);
    			                	}    		                		
    		                	}
    			            	map.panTo(new OpenLayers.LonLat(centerlon, centerlat));	 
    		                }
    		                me._lastfeature = feature;		            	

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
	            opMap.addLayers([module.layer]);
	            
	            // Add module controls to map
	            for(var key in module.drawControls) {
	            	opMap.addControl(module.drawControls[key]);
	            }
	            for(var key in module.modifyControls) {
	            	opMap.addControl(module.modifyControls[key]);
	            }
	            
	            // Set module layer not visible
	            module.layer.setVisibility(false);
    	        
	            // Create questions
    	        $.each(module.questions, function(k, question){
    	        	var text = question.title;
    	        	var onClikFunc = 'Oskari.$(\'sandbox\').findRegisteredModuleInstance(\'HaravaMapQuestions\').activateControl(\''+module.questionId+'\',\''+question.id+'\')';
    	        	html += '<div class="harava-question"><div class="harava-question-title">'+text+'</div><div id="harava-question-tool_'
    	        		+module.questionId+'_'+question.id +'" class="harava-question-tool harava-question-tool-'+module.questionId
    	        		+' harava-question-tool-'+question.type+'" qId="1" onclick="'+onClikFunc+'" title="'+text+'"></div></div>';
    	        });  
    	        jQuery(module.appendTo).append(html);
        	});        	
        }
        
        sandbox.register(me);
    	
    	// request
    	this.requestHandlers = {
    			showQuestionStepRequest : Oskari.clazz.create('Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequestHandler', sandbox, me)
    	};
        sandbox.addRequestHandler('ShowQuestionStepRequest', this.requestHandlers.showQuestionStepRequest);
    },
    /**
     * @method getCurrentModuleFeatures
     * Get current module all features
     * @returns {Array} features
     */
    "getCurrentModuleFeatures" :function(){
    	var me = this;
    	var features = [];
    	if(me._currentStep!=null){
    		var module = me.getModuleById(me._currentStep);
    		if(module != null && module.layer!=null){
        		features = module.layer.features;
	        }
    	}
    	return features;
    },
    /**
     * @method getAllModuleFeatures
     * Get all modules all features
     * @returns {Array} features
     */
    "getAllModuleFeatures": function(){
    	var me = this;
    	var features = []; 
    	$.each(me.modules, function(k, module){
	        if(module.layer!=null){
	        	$.each(module.layer.features, function(k, feature){
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
     */
    "onPopupClose" : function(evt){
    	var sandbox = Oskari.$("sandbox");
    	var me = sandbox.findRegisteredModuleInstance('HaravaMapQuestions');
    	if(me._currentControls.modify!=null){
    		me._currentControls.modify.selectControl.unselectAll();
    	}
    	
    	$.each(me.modules, function(k, module){
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
     * @method deActivateAll
     * Deactivate all module controls and tools
     */
    "deActivateAll" : function(){
    	var me = this;
    	me._currentPopupHtml = null;
    	me._currentControls.modify = null;
    	me._currentControls.draw = null;
    	
    	$('.harava-question-tool').removeClass('active');
    	jQuery('.harava-question-tool').css({
			"background-color": "transparent"
		});
    	
    	$.each(me.modules, function(k, module){
    		for(var key in module.drawControls) {
            	module.drawControls[key].deactivate();
            }
            for(var key in module.modifyControls) {
            	module.modifyControls[key].deactivate();
            }            
            module.layer.setVisibility(false);            
    	});
    	
    	var mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');
    	var opMap = mapModule.getMap();
    	
    	var popups = opMap.popups;
	    for (var i = 0; i < popups.length; i++) {
        	var popup = popups[i];
        	popup.hide();	                	
	    }    	
    },
    /**
     * @method showStep
     * Move questions to defined step
     * @param {String} moduleId
     */
    "showStep" : function(moduleId){
    	var me = this;
    	me.deActivateAll();
    	var module = me.getModuleById(moduleId);
    	if(module!=null){
    		module.layer.setVisibility(true);
    		me._currentControls.modify = module.modifyControls.modify;
    		module.modifyControls.modify.activate();
    		
    		var mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');
        	var olMap = mapModule.getMap();
        	
        	var needUpdateMapDomain = false;
        	
        	if(module.defaultScale!=null && module.defaultScale!=''){
        		olMap.zoomToScale(module.defaultScale,false);
        		needUpdateMapDomain = true;
        	}
        	
        	if(module.centerLon!=null && module.centerLon!='' && module.centerLat!=null && module.centerLat!=''){
        		var centerPoint = new OpenLayers.LonLat(module.centerLon, module.centerLat);
        		olMap.panTo(centerPoint);
        		needUpdateMapDomain = true;
        	}
        	
        	if(needUpdateMapDomain){
        		Oskari.clazz.globals.sandbox.postRequestByName('UpdateMapRequest');
        	}
    	}
    	me._currentStep=moduleId;
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
    	
    	/* Safety check */
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
     * @method activateControl
     * Activate selected tool
     * @param {String} moduleId selected moduleid
     * @param {String} questionId selected qustion id
     */
    "activateControl" : function(moduleId, questionId){
    	var me = this;    	
    	var module = me.getModuleById(moduleId);    	
    	var isSelected = jQuery('#harava-question-tool_' + moduleId + '_' + questionId).hasClass('active');    	
    	
    	me.deActivateAll();
    	
    	if(isSelected){
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).removeClass('active');
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).css({
    			"background-color": "transparent"
    		});
    	} else {
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).addClass('active');
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).css({
    			"background-color": "#A3D4C7"
    		});
    		me._currentStepAndQuestion = '';
    	}
    	
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
     * @method getModuleById
     * Get module by id
     * @param {String} moduleId
     * @returns founded module if exists. If not return null.
     */
    "getModuleById" : function(moduleId){
    	var me = this;
    	var retModule = null;
    	$.each(me.modules, function(k, module){
    		if(module.questionId==moduleId){
    			retModule = module;
    		}
    	});
    	return retModule;
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
    	$.each(questions, function(k, question){
    		if(question.id==questionId){
    			retQuestion = question;
    		}
    	});
    	return retQuestion;
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
    },
    /**
     * @method stop
     * BundleInstance protocol method
     */
    "stop" : function() {
    	var sandbox = this.sandbox();
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        // request handler cleanup 
        sandbox.removeRequestHandler('ShowQuestionStepRequest', this.requestHandlers['howQuestionStepRequest']);
        
        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	"init" : function() {
		
	},
    /**
     * @method update
     * BundleInstance protocol method
     */
    "update" : function() {
    }
}, {
	/**
     * @property {String[]} protocol
     * @static 
     */
    "protocol" : ['Oskari.bundle.BundleInstance']
});