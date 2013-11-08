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
 *			"questions":	// 0 to n questions object, 
 *			[
 *				<QUESTION MODULE JSON>
 *			]
 *		}]
 *	}
 * }
 * 
 * Replace <QUESTION MODULE JSON> for 0 to n following JSONs:
 * Point JSON (without external png symbol):
 * {
 * 		type: 'point',									// define at tool is point drawing (required)
 * 		id: 'question-1', 								// question identifier (required)
 * 		popupHtml: 'Test popup', 						// shows popup html when finishing drawing (not required)
 *		title: 'Test 1', 								// define question title (not required)
 * 		maxAnswers: 2, 									// define max answers (not required, if not defined then there is not max count of answers) 
 *		tooltip: "Test tooltip" 						// define question tool tooltip (not required)
 * 		color: '#00ff00', 								// define fill color (not required, if not defined using color #000000)
 * 		strokeColor: '#000000', 						// define stroke color (not required, if not defined using color value)
 * 		opacity: '0.7', 								// define fill opacity (not required, if not defined using 0.4 value)
 * 		strokeOpacity: '0.8'							// define stroke opacity (not required, if not defined using 1 value)
 * } 
 * 
 * Point JSON (with external png symbol):
 * {
 * 		type: 'point',									// define at tool is point drawing (required)
 * 		id: 'question-1', 								// question identifier (required)
 * 		popupHtml: 'Test popup', 						// shows popup html when finishing drawing (not required)
 *		title: 'Test 1', 								// define question title (not required)
 * 		maxAnswers: 2, 									// define max answers (not required, if not defined then there is not max count of answers) 
 *		tooltip: 'Test tooltip', 						// define question tool tooltip (not required)
 * 		imageUrl: 'http://localhost:8080/marker.png',	// define marker png image (required)
 * 		imageSize: 48,									// define marker image size (not required, if not defined using 32 value)
 * 		graphicXOffset: -24,							// define marker image x offset (not required, if not defined using -16 value)
 * 		graphicYOffset: -48,							// define marker image y offset (not required, if not defined using -16 value)
 * 		opacity: '0.7' 									// define marker image opacity (not required, if not defined using 1 value)
 * }
 * 
 * Line JSON:
 * {
 * 		type: 'line',									// define at tool is line drawing (required)
 * 		id: 'question-1', 								// question identifier (required)
 * 		popupHtml: 'Test popup', 						// shows popup html when finishing drawing (not required)
 *		title: 'Test 1', 								// define question title (not required)
 * 		maxAnswers: 2, 									// define max answers (not required, if not defined then there is not max count of answers)
 * 		color: '#00ff00',								// define line color (not required, if not defined using #000000 value)
 * 		opacity: '0.7', 								// define line opacity (not required, if not defined using 1 value)
 * 		strokeWidth: 2									// define line stroke width (not required, if not defined using 2 value)
 * }
 * 
 * Area JSON (without graphic fill):
 * {
 * 		type: 'area',									// define at tool is area drawing (required)
 * 		id: 'question-1', 								// question identifier (required)
 * 		popupHtml: 'Test popup', 						// shows popup html when finishing drawing (not required)
 *		title: 'Test 1', 								// define question title (not required)
 * 		maxAnswers: 2, 									// define max answers (not required, if not defined then there is not max count of answers)
 * 		color: '#00ff00',								// define area fill color (not required, if not defined using #000000 value)
 * 		strokeColor: '#ff0000',							// define area stroke color (not required, if not defined using color value)
 * 		opacity: '0.7', 								// define area fill opacity (not required, if not defined using 1 value)
 * 		strokeOpacity: '0.7',							// define area stroke opacity (not required, if not required using 1 value)
 * 		strokeWidth: 2									// define area stroke width (not required, if not defined using 2 value)
 * }
 * 
 * Area JSON (with graphic fill):
 * {
 * 		type: 'area',									// define at tool is area drawing (required)
 * 		id: 'question-1', 								// question identifier (required)
 * 		popupHtml: 'Test popup', 						// shows popup html when finishing drawing (not required)
 *		title: 'Test 1', 								// define question title (not required)
 * 		maxAnswers: 2, 									// define max answers (not required, if not defined then there is not max count of answers)
 * 		imageUrl: 'http://localhost:8080/fill.png',		// define fill png image (required)
 * 		imageSize: 48,									// define fill image size (not required, if not defined using 32 value) * 
 * 		color: '#00ff00',								// define stroke color (not required, if not defined using #000000 value)
 * 		opacity: '0.7', 								// define area fill opacity (not required, if not defined using 1 value)
 * 		strokeOpacity: '0.7',							// define area stroke opacity (not required, if not required using 1 value)
 * 		strokeWidth: 2									// define area stroke width (not required, if not defined using 2 value)
 * } 
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
    	if(me._currentControls!= null && me._currentControls.select!=null){
    		me._currentControls.select.unselectAll();
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
    	
    	me.reActivateModify();
    },
    /**
     * @method reActivateModify
     * Reactivates modify control.
     */
    "reActivateModify" :function(){
    	var me = this;
    	var module = me.getModuleById(me._currentStep);
    	if(module!=null){
    		me._currentControls.modify = module.modifyControls.modify;
            me._currentControls.select = module.modifyControls.select;
    		module.modifyControls.modify.deactivate();
    		module.modifyControls.modify.activate();
    	}
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
    	        // Create module own OpenLayers layer    	        
    	        module.layer = new OpenLayers.Layer.Vector(me.drawLayerSubfix + module.questionId, {
    	        	
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
	                    autoActivate:true,
                        standalone:true
	                }),
                    select : new OpenLayers.Control.SelectFeature(module.layer)
	            };
	            
	            // Add module layer to map
	            me._map.addLayers([module.layer]);
	            
	            // create SLD's with attribute QUESTION
	            var sld = me.createSld(module);
	            var format = new OpenLayers.Format.SLD();
	            var obj = format.read(sld);
	            if (obj && obj.namedLayers) {
	                for (var p in obj.namedLayers) {
	                	var style = obj.namedLayers[p].userStyles[0];
	                	
	                	for(var k=0;k<style.rules.length;k++){
	                		var rule = style.rules[k];
	                		for(var s in rule.symbolizer){
	                			rule.symbolizer[s].cursor = 'pointer';
	                		}
	                	}
	                	
	                	// set offsets (used only point)
	                	var finalStyle = me.setExternalGraphicStyles(style,module);
	                	
	                	module.layer.styleMap.styles["default"] = finalStyle;	                	
	                	module.layer.styleMap.styles["select"] = finalStyle;
	                    break;
	                }
	            }
	            
	            
	            // Add module controls to map
	            for(var key in module.drawControls) {
	            	me._map.addControl(module.drawControls[key]);
	            }
	            for(var key in module.modifyControls) {
	            	me._map.addControl(module.modifyControls[key]);
	            }
	            
	            module.layer.redraw();
	            
	            // Set module layer not visible
	            module.layer.setVisibility(false);
        	});
        	
        }
    },
    /**
     * @method setExternalGraphicStyles
     * Set external graphic styles to points
     * @param {OpenLayers.Style} style defined style
     * @param {Object} module module array
     * @returns {OpenLayers.Style} style
     */
    setExternalGraphicStyles: function(style, module){
    	jQuery.each(module.questions, function(q, question){
    		if(question.type=='point' && question.imageUrl!=null){
    			jQuery.each(style.rules, function(r, rule){
    				if(rule.filter.value==module.questionId+question.id){
    					var graphicXOffset = -16;
    					if(question.imageXOffset!=null){
    						graphicXOffset = question.imageXOffset;
    					}
    					var graphicYOffset = -16;
    					if(question.imageYOffset!=null){
    						graphicYOffset = question.imageYOffset;
    					}
    					var opacity = 1;
    					if(question.opacity!=null){
    						opacity=question.opacity;
    					}
    					
    					rule.symbolizer.Point.graphicXOffset=graphicXOffset;
    					rule.symbolizer.Point.graphicYOffset=graphicYOffset;
    					rule.symbolizer.Point.graphicOpacity=opacity;
    				}
    			});
    		}
    	});
    	return style;
    },
    /**
     * @method createSld
     * Create layer defined sld style for drawing
     * @param {Object} module array
     * @returns {String} generated sld
     */
    createSld: function(module){
    	var sld = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>\
    		<sld:StyledLayerDescriptor version="1.0.0" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld ./Sld/StyledLayerDescriptor.xsd">\
    			<sld:NamedLayer>\
				<sld:Name>Polygon</sld:Name>\
				<sld:UserStyle>\
					<sld:Name>Polygon</sld:Name>\
					<sld:FeatureTypeStyle>\
						<sld:FeatureTypeName>Polygon</sld:FeatureTypeName>';
			
    	jQuery.each(module.questions, function(q, question){
    		/* If point type */
    		if(question.type=='point'){    			
    			/* If defined imageUrl */
    			if(question.imageUrl!=null){
    				var imgSize = '32';
					if(question.imageSize!=null){
						imgSize=question.imageSize;
					}
					
    				sld += '<sld:Rule>';
	    			sld += '<sld:Name>Polygon</sld:Name>';
					sld += '<sld:Title>Polygon</sld:Title>';
					sld += '<ogc:Filter>';
					sld += '<ogc:PropertyIsEqualTo>';
					sld += '<ogc:PropertyName>QUESTION</ogc:PropertyName>';
					sld += '<ogc:Literal>'+module.questionId+question.id+'</ogc:Literal>';
					sld += '</ogc:PropertyIsEqualTo>';
					sld += '</ogc:Filter>';
					sld += '<PointSymbolizer>';
					sld += '<Graphic>';
					sld += '<ExternalGraphic>';
					sld += '<OnlineResource xlink:type="simple" xlink:href="'+question.imageUrl+'" />';
					sld += '<Format>image/png</Format>';
					sld += '</ExternalGraphic>';
					sld += '<sld:Size>'+imgSize+'</sld:Size>';
					sld += '</Graphic>';
					sld += '</PointSymbolizer>';
					sld += '</sld:Rule>';
    			}
    			/* Else if not defined imageUrl*/ 
    			else {
    				var color = '#000000';
    				if(question.color!=null){
						color = question.color;
					} 
					
    				var strokeColor = color;
    				if(question.strokeColor!=null){
    					strokeColor = question.strokeColor;
					} 
    				var opacity = 0.4;
					if(question.opacity!=null){
						opacity=question.opacity;
					}
					
					var strokeOpacity = 1;
					if(question.strokeOpacity!=null){
						strokeOpacity = question.strokeOpacity;
					}
					
	    			sld += '<sld:Rule>';
	    			sld += '<sld:Name>Polygon</sld:Name>';
					sld += '<sld:Title>Polygon</sld:Title>';
					sld += '<ogc:Filter>';
					sld += '<ogc:PropertyIsEqualTo>';
					sld += '<ogc:PropertyName>QUESTION</ogc:PropertyName>';
					sld += '<ogc:Literal>'+module.questionId+question.id+'</ogc:Literal>';
					sld += '</ogc:PropertyIsEqualTo>';
					sld += '</ogc:Filter>';
					sld += '<sld:PointSymbolizer>';
					sld += '<sld:Graphic>';
					sld += '<sld:Mark>';
					sld += '<sld:WellKnownName>circle</sld:WellKnownName>';
					sld += '<sld:Fill>';
					sld += '<sld:CssParameter name="fill">'+color+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="fill-opacity">'+opacity+'</sld:CssParameter>';
					sld += '</sld:Fill>';
					sld += '<sld:Stroke>';
					sld += '<sld:CssParameter name="stroke">'+strokeColor+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-width">2</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-opacity">1</sld:CssParameter>';
					sld += '</sld:Stroke>';
					sld += '</sld:Mark>';
					sld += '<sld:Size>14</sld:Size>';
					sld += '</sld:Graphic>';
					sld += '</sld:PointSymbolizer>';
					sld += '</sld:Rule>';
    			}
    		}
    		/* If line type */
    		else if(question.type=='line'){
    			var color = '#000000';
				if(question.color!=null){
					color = question.color;
				}
				var opacity =1;
				if(question.opacity!=null){
					opacity=question.opacity;
				}
				var strokeWidth = 2;
				if(question.strokeWidth!=null){
					strokeWidth = question.strokeWidth;
				}
				
				sld += '<sld:Rule>';
    			sld += '<sld:Name>Polygon</sld:Name>';
				sld += '<sld:Title>Polygon</sld:Title>';
				sld += '<ogc:Filter>';
				sld += '<ogc:PropertyIsEqualTo>';
				sld += '<ogc:PropertyName>QUESTION</ogc:PropertyName>';
				sld += '<ogc:Literal>'+module.questionId+question.id+'</ogc:Literal>';
				sld += '</ogc:PropertyIsEqualTo>';
				sld += '</ogc:Filter>';
				sld += '<LineSymbolizer>';
				sld += '<Stroke>';
				sld += '<CssParameter name="stroke">'+color+'</CssParameter>';
				sld += '<CssParameter name="stroke-width">'+strokeWidth+'</CssParameter>';
				sld += '<CssParameter name="stroke-opacity">'+opacity+'</CssParameter>';
				sld += '</Stroke>';
				sld += '</LineSymbolizer>';
				sld += '</sld:Rule>';
    			
    		}
    		/* If area type */
    		else if(question.type=='area'){
    			/* If selected graphic fill */
    			if(question.imageUrl!=null){
	    			var imgSize = '32';
					if(question.imageSize!=null){
						imgSize=question.imageSize;
					}
					var color = '#000000';
					if(question.color!=null){
						color = question.color;
					}
					
					var opacity =1;
					if(question.opacity!=null){
						opacity=question.opacity;
					}
					var strokeWidth = 2;
					if(question.strokeWidth!=null){
						strokeWidth = question.strokeWidth;
					}
					
					var strokeOpacity = 1;
					if(question.strokeOpacity!=null){
						strokeOpacity = question.strokeOpacity;
					}
					
	    			sld += '<sld:Rule>';
	    			sld += '<sld:Name>Polygon</sld:Name>';
	    			sld += '<sld:Title>Polygon</sld:Title>';
					sld += '<ogc:Filter>';
					sld += '<ogc:PropertyIsEqualTo>';
					sld += '<ogc:PropertyName>QUESTION</ogc:PropertyName>';
					sld += '<ogc:Literal>'+module.questionId+question.id+'</ogc:Literal>';
					sld += '</ogc:PropertyIsEqualTo>';
					sld += '</ogc:Filter>';					
					sld += '<sld:PolygonSymbolizer>';
					sld += '<sld:Fill>';
					sld += '<sld:GraphicFill>';
					sld += '<sld:Graphic>';
					sld += '<sld:ExternalGraphic>';
					sld += '<sld:OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="'+question.imageUrl+'"/>';
					sld += '<sld:Format>image/png</sld:Format>';
					sld += '</sld:ExternalGraphic>';
					sld += '<sld:Size>'+imgSize+'</sld:Size>';
					sld += '</sld:Graphic>';
					sld += '</sld:GraphicFill>';
					sld += '<sld:CssParameter name="fill-opacity">'+opacity+'</sld:CssParameter>';
					sld += '</sld:Fill>';
					sld += '<sld:Stroke>';
					sld += '<sld:CssParameter name="stroke">'+color+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-width">'+strokeWidth+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-opacity">'+strokeOpacity+'</sld:CssParameter>';
					sld += '</sld:Stroke>';
					sld += '</sld:PolygonSymbolizer>';
					sld += '</sld:Rule>';
	    		}
    			/* Else no selected graphic fill */ 
    			else {
    				var color = '#000000';
					if(question.color!=null){
						color = question.color;
					}
					
					var strokeColor = color;
    				if(question.strokeColor!=null){
    					strokeColor = question.strokeColor;
					} 
    				
					var opacity =1;
					if(question.opacity!=null){
						opacity=question.opacity;
					}
					var strokeWidth = 2;
					if(question.strokeWidth!=null){
						strokeWidth = question.strokeWidth;
					}
					
					var strokeOpacity = 1;
					if(question.strokeOpacity!=null){
						strokeOpacity = question.strokeOpacity;
					}
					
	    			sld += '<sld:Rule>';
	    			sld += '<sld:Name>Polygon</sld:Name>';
	    			sld += '<sld:Title>Polygon</sld:Title>';
					sld += '<ogc:Filter>';
					sld += '<ogc:PropertyIsEqualTo>';
					sld += '<ogc:PropertyName>QUESTION</ogc:PropertyName>';
					sld += '<ogc:Literal>'+module.questionId+question.id+'</ogc:Literal>';
					sld += '</ogc:PropertyIsEqualTo>';
					sld += '</ogc:Filter>';					
					sld += '<sld:PolygonSymbolizer>';
					sld += '<sld:Fill>';
					sld += '<sld:CssParameter name="fill">'+color+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="fill-opacity">'+opacity+'</sld:CssParameter>';
					sld += '</sld:Fill>';
					sld += '<sld:Stroke>';
					sld += '<sld:CssParameter name="stroke">'+strokeColor+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-width">'+strokeWidth+'</sld:CssParameter>';
					sld += '<sld:CssParameter name="stroke-opacity">'+strokeOpacity+'</sld:CssParameter>';
					sld += '</sld:Stroke>';
					sld += '</sld:PolygonSymbolizer>';
					sld += '</sld:Rule>';
	    			
	    		}
    		}
    	});
    	
    	sld+='</sld:FeatureTypeStyle>\
			</sld:UserStyle>\
			</sld:NamedLayer>\
			</sld:StyledLayerDescriptor>';
    	return sld;
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
   		me._currentControls.select.unselectAll();   		
   		var module = me.getModuleById(me._currentStep);
 
   		var layer = null;
    	if(module!=null){
    		layer = module.layer; 
    	}
   
    	if(layer == null){
    		return;
    	}
    	
    	var currentFeature = layer.features[layer.features.length - 1];
    	var isOk = true;
    	
    	if(currentFeature.geometry.getCentroid()==null || isNaN(currentFeature.geometry.getCentroid().x) ||  isNaN(currentFeature.geometry.getCentroid().y)){
   			currentFeature.destroy();
   			isOk = false;
    	}
   		
       	for (var i = 0; i < layer.features.length; i++) {
   			var feature = layer.features[i];
   			if (feature.popup) {
   				feature.popup.hide();
   			}
       	}
    	
    	var maxAnswersExceeded = false;
		if (me._currentPopupHtml && isOk) {   
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
		
		if(!maxAnswersExceeded && isOk){
			currentFeature.attributes.QUESTION = me._currentStep + me._currentQuestion.id;
			layer.redraw();
			me._currentControls.select.select(currentFeature);
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
            me._currentControls.select = module.modifyControls.select;
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
        me._currentControls.select = null;
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
	    
	    me.reActivateModify();
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

		    		jQuery.each(me.modules, function(k, module){
		        		for(var key in module.drawControls) {
		                	module.drawControls[key].deactivate();
		                }
		                for(var key in module.modifyControls) {
		                	module.modifyControls[key].deactivate();
		                }
		        	});
		    		module.drawControls[question.type].activate();
		    		me._currentStepAndQuestion = moduleId + '_' +questionId;
		    		me._currentControls.draw = module.drawControls[question.type];
		    	} else {
		    		me._currentStepAndQuestion = null;
		    	}
		        me._currentControls.modify = module.modifyControls.modify;
                me._currentControls.select = module.modifyControls.select;
		        me._currentQuestion = question;
		        
		        // activate all modify controls
		        me.reActivateModify();
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
    		me._currentControls.select.unselectAll();
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
    		me._currentControls.select.unselectAll();
    		if (feature.popup) {
        		feature.popup.hide();
        	}
    	}
    	if(notCloseTools==null || notCloseTools==true){
    		me.hideTools();
    	}
    	me.reActivateModify();
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
