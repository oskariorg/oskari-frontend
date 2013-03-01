/**
 * @class Oskari.harava.bundle.mapquestions.plugin.HaravaQuestionsMapPlugin
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.plugin.HaravaQuestionsMapPlugin',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config, configuration can be:
 * Config:
 * "harava-map-questions": {
 *	"conf": {
 *		"maxAnswersExceededMessage": "Max answers exceeded!", // Max answer exceeded message 
 *		"modules":	// 0 to n question modules 
 *		[{
 *			"appendTo": "#step-2>.kartta-tyokalut",	// where question toolbar are appended
 *			"questionId": "step-2",	// question identifier id
 *			"questionTitle": "Question 1", // question title
 *			"questions":	// 0 to n questions 
 *			[{
 *				"imageHeight": 48,	// if type point and defined image symbol, you can define (not required, 20 default) image height
 *				"imageWidth": 48,	// if type point and defined image symbol, you can define (not required, 20 default) image width
 *				"imageYOffset": -48,	// if type point and defined image symbol, you can define (not required, 20 default) image y offset
 *				"imageXOffset": -24,	// if type point and defined image symbol, you can define (not required, 20 default) image x offset
 *				"maxAnswers": 2, 	// max answers, id not defined then there is not max count of answers  
 *				"imageUrl": "http://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/48/Map-Marker-Marker-Outside-Pink.png",	// if type point, you can define image pointer url (not required), if not defined usin default pointer symbol with defined color and opacity (color and opacity are not required)
 *				"popupHtml": "", // showed popup html when finishing drawing
 *				"type": "point",	// draw tool type, can be point, line or area
 *				"id": "question-1", // question identifier
 *				"title": "Test 1", // Question title
 *				"color": "#ee00ee", // Drawing color
 *				"opacity": "0.7", // Drawing fill opacity
 *				"tooltip": "Test tooltip" // Question tool tooltip
 *			}
 *			]
 *		}]
 *	}
 * }
 *  
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
	_currentQuestion: '',
	_currentStepAndQuestion: '',
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
     * @method getCurrentModuleFeatures
     * Get current module all features
     * @returns {OpenLayers.Feature[]} features
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
     * @returns {OpenLayers.Feature[]} features
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
    	me.showTools();
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
        	var id = me._map.div.id;
        	
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
    	                fillOpacity: 0.5,
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
    		                	
    		                	me.hideTools();
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
    "scaleAndCenterMap": function(scale,centerLon,centerLat)
    {
    	var me = this;
    	var mapModule = me.getMapModule();
    	
    	if(scale!=null && scale!=''){
    		mapModule.zoomToScale(scale,false);
    	}
    	
    	if(centerLon!=null && centerLon!='' && centerLat!=null && centerLat!=''){
    		var centerPoint = new OpenLayers.LonLat(centerLon, centerLat);
    		mapModule.panMapToLonLat(centerPoint);
    	}
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
    	var maxAnswersExceeded = false;
		if (me._currentPopupHtml) {   
    		currentFeature.attributes = {
					"toolHtml": me._currentPopupHtml,
					"stepAndQuestionId":me._currentStepAndQuestion
			};
    		
    		if (me._currentQuestion.maxAnswers !== null && me._currentQuestion.maxAnswers>0) {
    			var addedFeatures = 0;
    	        for(var i=0;i<layer.features.length;i++){
    	        	var feat = layer.features[i];
    	        	if(feat.attributes.stepAndQuestionId == me._currentStepAndQuestion){
    	        		addedFeatures++;
    	        	}
    	        }
    		
    			if(addedFeatures>this._currentQuestion.maxAnswers){
    				if(me._conf.maxAnswersExceededMessage!==null){
    					alert(me._conf.maxAnswersExceededMessage);
    				}
    				maxAnswersExceeded = true;
    				currentFeature.destroy();
    			}    			
    		}
    	}
		
		if(!maxAnswersExceeded){
			if(this._currentQuestion.type=='point'){
				if(me._currentQuestion.imageUrl!=null){
					var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
					
					// Check at if defined image size
					if(me._currentQuestion.imageWidth!=null){
						style.graphicWidth = me._currentQuestion.imageWidth;
					}else{					
						style.graphicWidth = 20;
					}					
					if(me._currentQuestion.imageHeight!=null){
						style.graphicHeight = me._currentQuestion.imageHeight;
					}else{					
						style.graphicHeight = 20;
					}
					
					// Check at if defined offset
					if(me._currentQuestion.imageXOffset!=null){
						style.graphicXOffset = me._currentQuestion.imageXOffset;
					} else{					
						style.graphicXOffset = -10;
					}					
					if(me._currentQuestion.imageYOffset!=null){
						style.graphicYOffset = me._currentQuestion.imageYOffset;
					} else{					
						style.graphicYOffset = -10;
					}					
					
					
					style.externalGraphic = me._currentQuestion.imageUrl;
					style.graphicOpacity = 1;
				
					style.cursor = 'pointer';
					currentFeature.style = style;
					layer.redraw();
				} else {
					var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
					
					if(me._currentQuestion.color!=null){
						style.strokeColor=me._currentQuestion.color;
						style.fillColor=me._currentQuestion.color;
					} 
					else {					
						style.strokeColor='#000000';
						style.fillColor='#000000';		
					}
					
					if(me._currentQuestion.opacity!=null){
						style.fillOpacity=me._currentQuestion.opacity;
					} else {
						style.fillOpacity=0.4;
					}					
					
					style.strokeOpacity=1;					
					style.strokeWidth=2;
					style.cursor = 'pointer';
					currentFeature.style = style;
					layer.redraw();
				}
			}
			else if(this._currentQuestion.type=='line'){
				var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
				if(me._currentQuestion.color!=null){
					style.strokeColor=me._currentQuestion.color;
				} else {
					style.strokeColor='#000000';
				}
				if(me._currentQuestion.opacity!=null){
					style.strokeOpacity=me._currentQuestion.opacity;
				} else {
					style.fillOpacity=1;
					style.strokeOpacity=1;
				}
				style.strokeWidth=2;	             
				
				style.cursor = 'pointer';
				currentFeature.style = style;
				layer.redraw();
			}
			else if(this._currentQuestion.type=='area'){
				if(me._currentQuestion.color!=null && me._currentQuestion.imageUrl!=null){
					var sldStyle = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>';
					sldStyle += '<sld:StyledLayerDescriptor version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld ./Sld/StyledLayerDescriptor.xsd">';
					sldStyle += '<sld:NamedLayer>';
					sldStyle += '<sld:Name>Polygon</sld:Name>';
					sldStyle += '<sld:UserStyle>';
					sldStyle += '<sld:Name>Polygon</sld:Name>';
					sldStyle += '<sld:FeatureTypeStyle>';
					sldStyle += '<sld:FeatureTypeName>Polygon</sld:FeatureTypeName>';
					sldStyle += '<sld:Rule>';
					sldStyle += '<sld:Name>Polygon</sld:Name>';
					sldStyle += '<sld:Title>Polygon</sld:Title>';
					sldStyle += '<sld:PolygonSymbolizer>';
					sldStyle += '<sld:Fill>';
					sldStyle += '<sld:GraphicFill>';
					sldStyle += '<sld:Graphic>';
					sldStyle += '<sld:ExternalGraphic>';
					sldStyle += '<sld:OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="'+me._currentQuestion.imageUrl+'"/>';
					sldStyle += '<sld:Format>image/png</sld:Format>';
					sldStyle += '</sld:ExternalGraphic>';
					sldStyle += '<sld:Size>20</sld:Size>';
					sldStyle += '</sld:Graphic>';
					sldStyle += '</sld:GraphicFill>';
					sldStyle += '</sld:Fill>';
					sldStyle += '<sld:Stroke>';
					sldStyle += '<sld:CssParameter name="stroke">'+me._currentQuestion.color+'</sld:CssParameter>';
					sldStyle += '<sld:CssParameter name="stroke-width">1</sld:CssParameter>';
					sldStyle += '<sld:CssParameter name="stroke-opacity">1</sld:CssParameter>';
					sldStyle += '</sld:Stroke>';
					sldStyle += '</sld:PolygonSymbolizer>';
					sldStyle += '</sld:Rule>';
					sldStyle += '</sld:FeatureTypeStyle>';
					sldStyle += '</sld:UserStyle>';
					sldStyle += '</sld:NamedLayer>';
					sldStyle += '</sld:StyledLayerDescriptor>';
					var format = new OpenLayers.Format.SLD();
					var obj = format.read(sldStyle);
					currentFeature.style = obj.namedLayers['Polygon'].userStyles[0];
					layer.redraw();					
				} else {
					var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
					if(me._currentQuestion.color!=null){
						style.strokeColor=me._currentQuestion.color;
						style.fillColor=me._currentQuestion.color;
					} else {
						style.strokeColor='#000000';
						style.fillColor='#000000';
					}
					if(me._currentQuestion.opacity!=null){
						style.fillOpacity=me._currentQuestion.opacity;
						style.strokeOpacity=1;
					} else {
						style.fillOpacity=0.4;
						style.strokeOpacity=1;
					}
					style.strokeWidth=2;	             
					
					style.cursor = 'pointer';
					currentFeature.style = style;
					layer.redraw();
				}
			}
			me._currentControls.modify.selectControl.select(currentFeature);
		}
    },
    /**
     * @method showStep
     * Move questions to defined step
     * @param {String} moduleId
     */
    "showStep": function(moduleId){
    	var me = this;
    	me.deActivateAll();
    	
    	jQuery.each(me.modules, function(k, module){
    		module.layer.setVisibility(false);
    	});
    	
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
     * @returns {Object} founded module if exists. If not return null.
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
    	me._currentStepAndQuestion = null;
    	
    	jQuery.each(me.modules, function(k, module){
    		for(var key in module.drawControls) {
            	module.drawControls[key].deactivate();
            }
            for(var key in module.modifyControls) {
            	module.modifyControls[key].deactivate();
            }
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
     * @param {String[]} questions
     * @returns {Object} founded question if exists. If not return null.
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
    	if(module!=null){
    		var question = me.getQuestionById(questionId, module.questions);
    		if(question!=null){
    			me._currentPopupHtml = question.popupHtml; 
		    	module.layer.setVisibility(true);
		    	if(me._currentStepAndQuestion != moduleId + '_' +questionId){
		    		module.drawControls[question.type].activate();
		    		me._currentStepAndQuestion = moduleId + '_' +questionId;
		    		me._currentControls.draw = module.drawControls[question.type];
		    	} else {
		    		me._currentStepAndQuestion = null;
		    	}
		        me._currentControls.modify = module.modifyControls.modify;
		        me._currentQuestion = question;
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
    	me.showTools();
    },
    /**
     * @method hideSelectedFeature
     * Hide selected feature
     * @param {Boolean} notCloseTools
     */
    "hideSelectedFeature" : function (notCloseTools) {    	
    	var me = this;
    	var feature = me._lastfeature;
    	if (feature) {
    		me._currentControls.modify.selectControl.unselectAll();
    		if (feature.popup) {
        		feature.popup.hide();
        	}
    	}
    	if(notCloseTools==null || notCloseTools==true){
    		me.hideTools();
    	}
    },
    /**
	 * @method toggleTools
	 * Toggle map question tools 
	 */
	toggleTools: function(){
		var me = this;
		me._sandbox.postRequestByName('ToggleQuestionToolsRequest');
	},
	/**
	 * @method hideTools
	 * Hide map questions tools
	 */
	hideTools: function(){
		var me = this;
		me._sandbox.postRequestByName('HideQuestionToolsRequest');
	},
	/**
	 * @method showTools
	 * Show map question tools
	 * @param fast need fast drawing
	 */
	showTools: function(fast){
		var me = this;
		me._sandbox.postRequestByName('ShowQuestionToolsRequest');
	}
}, {
    /**
     * @property {Object} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
