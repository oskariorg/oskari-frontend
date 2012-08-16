/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.FinishedDrawingEvent',
        function(config) {
            this._creator = null;
            if(config) {
            	if(config.geometry) {
            		this._drawing = config.geometry;
            	}
            	if(config.modification) {
            		this._modification = config.modification;
            	}
            }
        }, {
            __name : "MyPlaces.FinishedDrawingEvent",
            getName : function() {
                return this.__name;
            },
            getDrawing : function() {
                return this._drawing;
            },
            isModification : function() {
                return this._modification;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.MyPlaceHoverEvent',
        function(pLonlat, pEvent, zoomLevel) {
            this._creator = null;
            this._lonlat = pLonlat;
            this._hoverEvent = pEvent;
            this._zoom = zoomLevel; // 0-12
        }, {
            __name : "MyPlaces.MyPlaceHoverEvent",
            getName : function() {
                return this.__name;
            },
            getHoverEvent : function() {
                return this._hoverEvent;
            },
            getLonLat : function() {
                return this._lonlat;
            },
            getZoomLevel : function() {
                return this._zoom;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

/**
 * Tell components to reload data
 */
Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.MyPlacesChangedEvent',
        function(config) {
            this._creator = null;
        }, {
            __name : "MyPlaces.MyPlacesChangedEvent",
            getName : function() {
                return this.__name;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.MyPlaceSelectedEvent',
        function(pMyPlace, dblClick) {
            this._creator = null;
            this._myPlace = pMyPlace;
            this._dblClick = dblClick;
        }, {
            __name : "MyPlaces.MyPlaceSelectedEvent",
            getName : function() {
                return this.__name;
            },
            getPlace : function() {
                return this._myPlace;
            },
            isDblClick : function() {
                return this._dblClick;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

Ext.define(
        'Oskari.mapframework.bundle.myplaces.model.MyPlace', 
{
    extend : 'Ext.data.Model',
    fields : [ 
               'id', 
               'name', 
               'description',
               'categoryID',
               'geometry',
               'createDate',
               'updateDate'
             ]
}
);Ext.define(
        'Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', 
{
    extend : 'Ext.data.Model',
    fields : [ 
               'id', 
               'name',
               'isDefault',
               'lineWidth',
               'lineColor',
               'fillColor',
               'dotSize',
               'dotColor'
             ]
}
);/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.myplaces.mapmodule.DrawPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editMode = false;
    this.currentDrawMode = null;
}, {
    __name : 'MyPlaces.DrawPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * Enables the draw control for given params.drawMode.
     * Clears the layer of any previously drawn features.
     * TODO: draws the given params.geometry with params.style
     * @param params includes drawMode, geometry and style
     * @method
     */
    startDrawing : function(params) {
        if(params.isModify) {
            // preselect it for modification
            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        else {
	        // remove possible old drawing
	        this.drawLayer.removeAllFeatures();
        	
	        if(params.geometry) {
	            // sent existing geometry == edit mode
	            this.editMode = true;
	            // add feature to draw layer
	            var features = [new OpenLayers.Feature.Vector(params.geometry)];
	            this.drawLayer.addFeatures(features);
	            // preselect it for modification
	            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
	        } else {
	            // otherwise activate requested draw control for new geometry
	            this.editMode = false;
	            this.toggleControl(params.drawMode);
	        }
        }
    

    },
    /**
     * Disables all draw controls and
     * clears the layer of any drawn features
     * @method
     */
    stopDrawing : function() {
        // disable all draw controls
        this.toggleControl();
        // clear drawing
        this.drawLayer.removeAllFeatures();
    },
    
    forceFinishDraw : function() {
    	try {
    		this.drawControls[this.currentDrawMode].finishSketch();
    	}
    	catch(error) {
    		// happens when the sketch isn't even started -> reset state
        	this.stopDrawing();
	        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
	        this._sandbox.notifyAll(event);
    	}
    },
    
    /**
     * Called when drawing is finished.
     * Disables all draw controls and
     * sends a MyPlaces.FinishedDrawingEvent with the drawn the geometry.
     * @method
     */
    finishedDrawing : function() {
        this.toggleControl();
        var drawing = this.getDrawing();
        if(this.editMode) {
        	drawing.modification = this.editMode;
        }
        else {
	        // programmatically select the drawn feature ("not really supported by openlayers")
	        // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
        	this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        var event = this._sandbox.getEventBuilder('MyPlaces.FinishedDrawingEvent')(drawing);
        this._sandbox.notifyAll(event);
    },
    /**
     * Enables the given draw control
     * Disables all the other draw controls
     * @param drawMode draw control to activate (if undefined, disables all
     * controls)
     * @method
     */
    toggleControl : function(drawMode) {
    	this.currentDrawMode = drawMode;
    	
        for(var key in this.drawControls) {
            var control = this.drawControls[key];
            if(drawMode == key) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    },
    /**
     * Initializes the plugin:
     * - layer that is used for drawing
     * - drawControls
     * - registers for listening to requests
     * @param sandbox reference to Oskari sandbox
     * @method
     */
    init : function(sandbox) {
        var me = this;
        this.requestHandlers = {
            startDrawingHandler : Oskari.clazz.create('Oskari.mapframework.myplaces.request.StartDrawingRequestPluginHandler', sandbox, me),
            stopDrawingHandler : Oskari.clazz.create('Oskari.mapframework.myplaces.request.StopDrawingRequestPluginHandler', sandbox, me),
            getGeometryHandler : Oskari.clazz.create('Oskari.mapframework.myplaces.request.GetGeometryRequestPluginHandler', sandbox, me)
        };

        this.drawLayer = new OpenLayers.Layer.Vector("MyPlaces Draw Layer", {
            /*style: {
             strokeColor: "#ff00ff",
             strokeWidth: 3,
             fillOpacity: 0,
             cursor: "pointer"
             },*/
            eventListeners : {
                "featuresadded" : function(layer) {
                	// send an event that the drawing has been completed
                    me.finishedDrawing();
                }
            }
        });
        
        this.drawControls = {
            point : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                       OpenLayers.Handler.Point),
            line : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                      OpenLayers.Handler.Path),
            area : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                      OpenLayers.Handler.Polygon)
        };
        
        // doesn't really need to be in array, but lets keep it for future development
        this.modifyControls = {
        	//select : new OpenLayers.Control.SelectFeature(me.drawLayer),
        	modify : new OpenLayers.Control.ModifyFeature(me.drawLayer)
        };
        this._map.addLayers([me.drawLayer]);
        for(var key in this.drawControls) {
            this._map.addControl(this.drawControls[key]);
        }
        for(var key in this.modifyControls) {
            this._map.addControl(this.modifyControls[key]);
        }
        // no harm in activating straight away
        this.modifyControls.modify.activate();
    },
    /**
     * Returns the drawn geometry from the draw layer
     * @method
     */
    getDrawing : function(params) {
        return {
            geometry : this.drawLayer.features[0].geometry
        };
    },
    register : function() {

    },
    unregister : function() {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);
        sandbox.addRequestHandler('MyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('MyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('MyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);

    },
    stopPlugin : function(sandbox) {

        sandbox.removeRequestHandler('MyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('MyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('MyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);
        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
Oskari.clazz.define('Oskari.mapframework.myplaces.request.GetGeometryRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var callBack = request.getCallBack();
        this.sandbox.printDebug("[Oskari.mapframework.myplaces.request.GetGeometryRequestPluginHandler] geometry requested");
        var drawing = this.drawPlugin.getDrawing();
        callBack(drawing.geometry);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
Oskari.clazz.define('Oskari.mapframework.myplaces.request.StartDrawingRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this.sandbox.printDebug("[Oskari.mapframework.myplaces.request.StartDrawingRequestPluginHandler] Start Drawing: " + drawMode);
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode(),
            geometry : request.getGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
Oskari.clazz.define(
        'Oskari.mapframework.myplaces.request.StopDrawingRequestPluginHandler',
        
        function(sandbox, drawPlugin) {
            
            this.sandbox = sandbox;
            this.drawPlugin = drawPlugin;
        },
        {
            handleRequest: function(core,request) {
                this.sandbox.printDebug("[Oskari.mapframework.myplaces.request.StopDrawingRequestPluginHandler] Stop drawing");
                if(request.isPropagate()) {
                	// pressed finished drawing, act like dblclick
                	this.drawPlugin.forceFinishDraw();
                }
                else {
                	// we wish to clear the drawing without sending further events
                	this.drawPlugin.stopDrawing();
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.myplaces.mapmodule.HoverPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    __name : 'MyPlaces.HoverPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * Initializes the plugin:
     * - openlayers hover control
     * @param sandbox reference to Oskari sandbox
     * @method
     */
    init : function(sandbox) {
        var me = this;
			
			
        OpenLayers.Control.Hover = OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'delay': 500,
                'pixelTolerance': null,
                'stopMove': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Hover(
                    this,
                    {'pause': this.onPause, 'move': this.onMove},
                    this.handlerOptions
                );
            }, 

            onPause: function(evt) {
            },

            onMove: function(evt) {
                // if this control sent an Ajax request (e.g. GetFeatureInfo) when
                // the mouse pauses the onMove callback could be used to abort that
                // request.
            }
        });
        
        this.hoverControl = new OpenLayers.Control.Hover({
            handlerOptions: {
                'delay': 500,
                'pixelTolerance': 6
            },
            
            onPause: function(evt) {
            	var lonlat = me._map.getLonLatFromPixel(evt.xy);
		        var event = sandbox.getEventBuilder('MyPlaces.MyPlaceHoverEvent')(lonlat, evt, me._map.getZoom());
		        sandbox.notifyAll(event);
            }
        });
        this._map.addControl(this.hoverControl);

    },
    // should activate when omat paikat layer is shown
    activate : function() {
        this.hoverControl.activate();

    },
    // should activate when omat paikat layer is not shown
    deactivate : function() {
        this.hoverControl.deactivate();
    },
    
    register : function() {

    },
    unregister : function() {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);

    },
    stopPlugin : function(sandbox) {

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.StopDrawingRequest',
                function(propagateFinished) {
                    this._creator = null;
                    if(propagateFinished === true) {
                    	this._propagateFinished = propagateFinished;
                    }
                }, {
                    __name : "MyPlaces.StopDrawingRequest",
                    getName : function() {
                        return this.__name;
                    },
                    isPropagate : function() {
                        return (this._propagateFinished === true);
                    }
                },
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.StartDrawingRequest',
                function(config) {
                    this._creator = null;
                    
                    // TODO: do we pass selected category colors here?
                    
                    if(config.geometry) {
                        // editing existing 
                        this._geometry = config.geometry;
                    }
                    else if(config.continueCurrent) {
                        // editing new
                        this._continueCurrent = config.continueCurrent;
                    }
                    else {
                    	// start drawing new
		                if(!this.drawModes[config.drawMode]) {
		                    throw "Unknown draw mode '" + config.drawMode + "'";
		                }
		                this._drawMode = config.drawMode;
                    }
                    
                }, {
                    __name : "MyPlaces.StartDrawingRequest",
                    getName : function() {
                        return this.__name;
                    },

                    isModify : function() {
                        if(this._continueCurrent) {
                            return true;
                        }
                        return false;
                    },
                    
                    drawModes :  {
                        point: 'point',
                        line: 'line',
                        area: 'area'
                    },
                    
                    getDrawMode : function() {
                        return this._drawMode;
                    },
                    
                    getGeometry : function() {
                        return this._geometry;
                    }
                },
                
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.GetGeometryRequest',
                function(callbackMethod) {
                    this._creator = null;
                    this._callbackMethod = callbackMethod;
                }, {
                    __name : "MyPlaces.GetGeometryRequest",
                    getName : function() {
                        return this.__name;
                    },
                    getCallBack : function() {
                        return this._callbackMethod;
                    }
                },
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
Oskari.clazz.define(
        'Oskari.mapframework.service.MyPlacesService', 
        
    /*
     * @constructor 
        ...
    */
    function(config) {

        /** config json */
        this._config = config;
        
        // list of categories & myplaces
        this._categoryList = new Array();
        this._placesList = new Array();

		this.wfstStore = Oskari.clazz.create(
			'Oskari.mapframework.service.MyPlacesWFSTStore',
			config.url, config.user);
		this.wfstStore.connect();

        this._sandbox = config.sandbox;
        
        this.defaults = config.defaults;
        
        // preload stuff
        var me = this;
        var defaultCategoryCreationCallback = function() {
        	// called if new user -> just created a default category for user
        	
        	if(me.getAllCategories().length === 0) {
        		// something went wrong and we should propably just show error message instead of my places functionality
        	}
        	else {
    			me._notifyDataChanged();
        	}
        };
        var loadedCategories = false;
        var loadedPlaces = false;
        var initialLoadCallBackCategories = function() {
    		loadedCategories = true;
        	
        	if(me.getAllCategories().length === 0 && config.defaults) {
        		// user has no categories, propably a new user
        		// create a default category
        		var defaultCategory = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', {
					name: config.defaults.categoryName, 
 	                lineWidth: config.defaults.lineWidth,
	                lineColor: config.defaults.lineColor,
	                fillColor: config.defaults.fillColor,
	                dotColor: config.defaults.dotColor,
	                dotSize: config.defaults.dotSize,
					isDefault: true 
				});
				me.saveCategory(defaultCategory, defaultCategoryCreationCallback);
        	}
        	else if(loadedPlaces) {
        		me._notifyDataChanged();
        	}
        };
        
        var initialLoadCallBackPlaces = function() {
    		loadedPlaces = true;
        	if(loadedCategories) {
        		me._notifyDataChanged();
        	}
    		loadedPlaces = true;
        };
        
        this.wfstStore.getCategories(this,initialLoadCallBackCategories);
		this.wfstStore.getMyPlaces(this,initialLoadCallBackPlaces);
}, {
    __qname: "Oskari.mapframework.service.MyPlacesService",
    getQName: function() {
        return this.__qname;
    },

    __name : "MyPlacesService",
    getName : function() {
        return this.__name;
    },
    
    /** Internal usage */
    _addCategory : function(categoryModel) {
        this._categoryList.push(categoryModel);
    },
    
    /** Internal usage */
    _movePlacesToCategory : function(oldCategoryId, newCategoryId, callback) {
		var me = this;
    	var placesInDeleteCategory = this.getPlacesInCategory(oldCategoryId);
		if(placesInDeleteCategory.length == 0) {
			// no places to move -> callback right away
			callback(true);
			return;
		}
		for ( var i = 0; i < placesInDeleteCategory.length; i++) {
			placesInDeleteCategory[i].set('categoryID',newCategoryId);
		}
        var callBackWrapper = function(success, list) {
        	// update models updateDate in store
        	//var myplace = me.findMyPlace(list[0].get('id'));
        	//myplace.set('updateDate', list[0].get('updateDate'));
			me._notifyDataChanged();
            callback(success,list[0]);
        };
		// need to wrap callback and call changes notify if ever called directly
        this.wfstStore.commitMyPlaces(placesInDeleteCategory, callBackWrapper);
    },
    
    /** Internal usage */
    _deletePlacesInCategory : function(categoryId, callback) {
    	var placesInDeleteCategory = this.getPlacesInCategory(categoryId);
    	var idList = [];
		for ( var i = 0; i < placesInDeleteCategory.length; i++) {
			idList.push(placesInDeleteCategory[i].get('id'));
		}
		if(idList.length == 0) {
			// no places to delete -> callback right away
			callback(true);
			return;
		}
        var me = this;
        var callBackWrapper = function(success, list) {
            if(success) {
				for ( var i = 0; i < placesInDeleteCategory.length; i++) {
                	me._removeMyPlace(list[i]);
				}
				me._notifyDataChanged();
            }
            callback(success);
        };
        this.wfstStore.deleteMyPlaces(idList, callBackWrapper);
    },
/**
 * @method parseDate 
 * 
 * parses date for my places
 * 
 * @param dateStr format 2011-11-02T15:27:48.981+02:00 (time part is optional)
 * @return array with date part in first index, time (optional) in second, empty array if param is undefined or less than 10 characters
 */
    parseDate : function(dateStr) {
		
    	if(!dateStr && dateStr.length < 10) {
    		return [];
    	}
    	var year = dateStr.substring(0,4);
    	var month = dateStr.substring(5,7);
    	var day = dateStr.substring(8,10);
		var returnValue = [day + '.' + month + '.' + year];
		
		var time = '';
		// TODO: error handling
    	if(dateStr.length == 29) {
    		time = dateStr.substring(11);
    		var splitted = time.split('+');
    		time = splitted[0];
    		// take out milliseconds
    		time = time.split('.')[0];
    		var timeComps = time.split(':');
    		var hour = timeComps[0];
    		var min = timeComps[1];
    		var sec = timeComps[2];
    		/*
    		var timezone = splitted[1];
    		timezone = timezone.split(':')[0];
    		hour = parseInt(hour) + parseInt(timezone);
    		*/
    		time = hour + ':' + min + ':' + sec
    		returnValue.push(time);
    	}
		
		return returnValue;
    },
    
    getPlacesInCategory : function(categoryId) {
    	var placesInCategory = [];
		for ( var i = 0; i < this._placesList.length; i++) {
			if (this._placesList[i].get('categoryID') === categoryId) {
				placesInCategory.push(this._placesList[i]);
			}
		}
		return placesInCategory;
    },

    deleteCategory : function(categoryId, movePlacesToDefault,callback) {
        var me = this;
        
        // call actual category delete once category has been cleared of places successfully
        var callBackWrapper = function(success, list) {
            if(success) {
                me._deleteEmptyCategory(categoryId, callback);
            }
            else {
            	// only callback on fail here
            	callback(success);
            }
        };
        // move places handling
        if(movePlacesToDefault === true) {
        	var defaultCategory = me.getDefaultCategory();
        	me._movePlacesToCategory(categoryId, defaultCategory.get('id'), callBackWrapper);
        }
    	// delete places to clear category if places will not be moved
        else {
        	me._deletePlacesInCategory(categoryId, callBackWrapper);
        }
    },
    
    /** Internal handling only */
    _deleteEmptyCategory : function(categoryId,callback) {
    	
        var me = this; 
        var callBackWrapper = function(success, list) {
            if(success) {
                me._removeCategory(list[0]);
            }
            callback(success);
    		me._notifyDataChanged();
        };

        this.wfstStore.deleteCategories([categoryId], callBackWrapper);
    },
    
    /** Internal list handling only */
    _removeCategory : function(categoryId) {
        for(var i = 0; i < this._categoryList.length; i++) {
            if(this._categoryList[i].get('id') == categoryId){
                this._categoryList.splice(i,1);
                break;
            }
        }
    },
    
    saveCategory : function(categoryModel, callback) {
        var me = this;
        var isNew = !(categoryModel.get('id'));
        
        var callBackWrapper = function(success, list) {
            if(isNew && success) {
                me._addCategory(list[0]);
            }
            else {
            	// TODO: update model in store maybe?
            }
			me._notifyDataChanged();
            callback(success,list[0],isNew);
        };

        this.wfstStore.commitCategories([categoryModel], callBackWrapper);
    },

    getAllCategories : function() {
        return this._categoryList;
    },
    
    getDefaultCategory : function() {
    	
		var index = this.findBy(this._categoryList, 'isDefault', true);
		if(index !== -1) {
			return this._categoryList[index];
		}
		throw 'Should not happen';
    },

    /** Internal usage */
    _addMyPlace : function(myplaceModel) {
        this._placesList.push(myplaceModel);
    },
    /** Internal list handling only */
    _removeMyPlace : function(placeId) {
		var index = this.findBy(this._placesList, 'id', placeId);
		if(index !== -1) {
            this._placesList.splice(index,1);
		}
    },
    /** Internal usage */
    _notifyDataChanged : function() {
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlacesChangedEvent')();
        this._sandbox.notifyAll(event);
    },
    
    deleteMyPlace : function(placeId, callback) {
        var me = this;
        var callBackWrapper = function(success, list) {
            if(success) {
                me._removeMyPlace(list[0]);
				me._notifyDataChanged();
            }
            callback(success,list[0]);
        };

        this.wfstStore.deleteMyPlaces([placeId], callBackWrapper);
        
    },
    
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findMyPlaceByLonLat : function(lonlat, zoom) {
    	var places = [];
        var myPlacesList = this.getAllMyPlaces();
    	
        for(var i = 0; i < myPlacesList.length; ++i) {
        	var olGeometry = myPlacesList[i].get('geometry');
        	var hoverOnPlace = false;
    		// point geometry needs too exact hover to be usable without some tolerance
        	if('OpenLayers.Geometry.Point' === olGeometry.CLASS_NAME) {
				// TODO: figure out some Perfect(tm) math for scale
        		var tolerance = 720 - (zoom * zoom * 5);
        		if(zoom > 10) {
        			tolerance = 5;
        		}
        		else if(zoom > 8) {
        			tolerance = 20;
        		}
        		else if(zoom > 5) {
        			tolerance = 50;
        		}
        		//console.log(tolerance);
        		hoverOnPlace = olGeometry.atPoint(lonlat, tolerance, tolerance);
        	}
        	else {
        		hoverOnPlace = olGeometry.atPoint(lonlat);
        	}
        	if(hoverOnPlace) {
        		places.push(myPlacesList[i]);
        	}
        }
        return places;
	},
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findMyPlace : function(id) {
		var index = this.findBy(this._placesList, 'id', id);
		if(index !== -1) {
			return this._placesList[index];
		}
		return null;
	},
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findCategory : function(id) {
		var index = this.findBy(this._categoryList, 'id', id);
		if(index !== -1) {
			return this._categoryList[index];
		}
		return null;
	},
	
	/**
	 * Tries to find object from the given list
	 *  
	 * 
	 * @param list list to loop through
	 * @param attrName attribute to compare against
	 * @param attrValue value we want to find
	 * 
	 * @return index on the list where the object was found or -1 if not found
	 */
	findBy : function(list, attrName, attrValue) {
		for ( var i = 0; i < list.length; i++) {
			// TODO: maybe some error checking?
			if (list[i].get(attrName) === attrValue) {
				return i;
			}
		}
		return -1;
	},
    saveMyPlace : function(myplaceModel, callback) {
        var me = this;
        var isNew = !(myplaceModel.get('id'));
        
        var callBackWrapper = function(success, list) {
            if(isNew && success) {
            	me._addMyPlace(list[0]);
            }
            else {
            	// update models updateDate in store
            	var myplace = me.findMyPlace(list[0].get('id'));
            	if(myplace) {
            		myplace.set('updateDate', list[0].get('updateDate'));
            	}
            	else {
            		// couldn't load it -> failed to save it
            		success = false;
            	}
            } 
			me._notifyDataChanged();
            callback(success,list[0],isNew);
        };

        this.wfstStore.commitMyPlaces([myplaceModel], callBackWrapper);
    },
    
    getAllMyPlaces : function() {
        return this._placesList;
    }
},
{
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */
/**
 * @class Oskari.mapframework.service.MyPlacesWFSTStore
 * 
 * Transforms Ext Model & OpenLayers geometry to WFS Transactions
 * 
 * 
 * NEEDS: URL to WFS service UUID for storing to some speficic user
 * 
 * 
 * Sample Usage:
 * 
 * service = Oskari.bundle_manager.instances[12].impl.myPlacesService; // TEMP
 * 
 * storE =
 * Oskari.clazz.create('Oskari.mapframework.service.MyPlacesWFSTStore','http://tiuhti.nls.fi/geoserver/wfs','1234');
 * storE.connect(); storE.getCategories(service); storE.getMyPlaces(service);
 * 
 * 
 * @TODO DELETE
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.service.MyPlacesWFSTStore',
				function(url, uuid) {
					this.uuid = uuid;
					this.protocols = {};
					this.url = url;
				},
				{

					/**
					 * @method connect
					 * 
					 * 'connects' to store (does not but might)
					 */
					connect : function() {
						var url = this.url;
						this.protocols['categories'] = new OpenLayers.Protocol.WFS(
								{
									version : '1.1.0',
									srsName : 'EPSG:3067',
									featureType : 'categories',
									featureNS : 'http://www.paikkatietoikkuna.fi',
									url : url
								});
						this.protocols['my_places'] = new OpenLayers.Protocol.WFS(
								{
									version : '1.1.0',
									srsName : 'EPSG:3067',
									geometryName : 'geometry',
									featureType : 'my_places',
									featureNS : 'http://www.paikkatietoikkuna.fi',
									url : url
								});
					},

					/**
					 * @method getCategories
					 * 
					 * loads categories from backend to given service filters by
					 * initialised user uuid
					 */
					getCategories : function(service, cb) {
						var uuid = this.uuid;
						var uuidFilter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : "uuid",
							value : uuid
						});
						var p = this.protocols['categories'];

						var me = this;
						
						p.read( {
							filter : uuidFilter,
							callback : function(response) {
								me._handleCategoriesResponse(response, service,
										cb);
							}
						})

					},

					/**
					 * @method _handleCategoriesResponse
					 * 
					 * processes ajax response from backend adds categories to
					 * given service
					 */
					_handleCategoriesResponse : function(response, service, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						// if nothing found, stop here and make the callback
						if (feats == null || feats.length == 0) {
							if (cb) {
								cb();
							}
							return;
						}
						
						// found categories, proceed normally 
						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							// convert string to boolean
							var blnDefault = false;
							if("true" === featAtts['default']) {
								blnDefault = true;
							}
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['category_name'],
								'isDefault' : blnDefault,
								'lineWidth' : featAtts['stroke_width'],
								'lineColor' : featAtts['stroke_color'],
								'fillColor' : featAtts['fill_color'],
								'dotColor' : featAtts['dot_color'],
								'dotSize' : featAtts['dot_size'],
								'uuid' : uuid
							};

							service._addCategory(
								Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory',m_atts));
						}

						if (cb) {
							cb();
						}

					},

					/**
					 * @method commitCategories
					 * 
					 * handles insert & update (NO delete here see next moethd)
					 */
					commitCategories : function(list, callback) {
						var uuid = this.uuid;
						var p = this.protocols['categories'];
						var me = this;

						var features = [];
						for ( var l = 0; l < list.length; l++) {
							var m = list[l];
							var m_id = m.get('id');
							
							// geoserver needs a value so set false if no value specified
							var isDefault = m.get('isDefault');
							if(!isDefault) {
								isDefault = false;
							}

							/** s to e map! */
							var featAtts = {
								'category_name' : m.get('name'),
								'default' : isDefault,
								'stroke_width' : m.get('lineWidth'),
								'stroke_color' : m.get('lineColor'),
								'fill_color' : m.get('fillColor'),
								'dot_color' : m.get('dotColor'),
								'dot_size' : m.get('dotSize'),
								'uuid' : uuid
							};
							var feat = new OpenLayers.Feature.Vector(null, featAtts);
							
							// console.log('saving category - id: ' + m_id);
							if (!m_id) {
								feat.toState(OpenLayers.State.INSERT);
							} else {
								feat.fid = p.featureType + '.' + m_id;
								// toState handles some workflow stuff and doesn't work here
								feat.state = OpenLayers.State.UPDATE;
							}
							features.push(feat);
						}
						p.commit(features, {
							callback : function(response) {

								me._handleCommitCategoriesResponse(response,
										list, callback);
							}
						});

					},

					/**
					 * @method _handleCommitCategoriesResponse
					 * 
					 */
					_handleCommitCategoriesResponse : function(response, list,
							cb) {

						if (response.success()) {

							var features = response.reqFeatures;
							// deal with inserts, updates, and deletes
							var state, feature;
							var destroys = [];
							var insertIds = response.insertIds || [];
							
							for ( var i = 0, len = features.length; i < len; ++i) {
								feature = features[i];
								state = feature.state;
								if (state) {
									if (state == OpenLayers.State.INSERT) {
										feature.fid = insertIds[i];
										feature.attributes.id = feature.fid;
										var id = this._parseNumericId(feature.fid);
										list[i].set('id', id);
									}
									feature.state = null;
								}
							}

							cb(true, list);

						} else {

							cb(false, list);
						}

					},

					
					/*
					 * @method deleteCategories
					 * 
					 * delete a list of categories from backend
					 */
					deleteCategories : function(list, callback) {
						var p = this.protocols['categories'];
						var uuid = this.uuid;
						var features = [];
						for ( var l = 0; l < list.length; l++) {
							var m_id = list[l];
							
							if (!m_id) {
								continue;
							}
							
							var featAtts = {
								'uuid' : uuid
							};

							var feat = new OpenLayers.Feature.Vector(null, featAtts);
								
							feat.fid = p.featureType + '.' + m_id;

							feat.state = OpenLayers.State.DELETE; 
							features.push(feat);
						}
						
						var me = this;
						p.commit(features, {
							callback : function(response) {
								me._handleDeleteCategoriesResponse(response, list,
										callback);
							}
						});
					},
					
					/**
					 * @method handleDeleteCategoriesResponse
					 * 
					 */
					_handleDeleteCategoriesResponse: function(response,list,cb) {
						
						/**
						 * Let's call service
						 */
						if (response.success()) {
							cb(true, list);

						} else {
							cb(false, list);
						}
						
					},
					
					/**
					 * @method _parseNumericId
					 * @param geoserverFid id prefixed with featureType
					 * @return id without featureType
					 * 
					 */
					_parseNumericId : function(geoserverFid) {
						// TODO: maybe some error handling here?
						// feature id is '<featureType>.<id>'
						var id = geoserverFid.split('.')[1];
						return id;
					},

					/**
					 * @method getPlaces
					 * 
					 * loads places from backend to given service filters by
					 * initialised user uuid
					 * 
					 */
					getMyPlaces : function(service, cb) {
						var uuid = this.uuid;

						var uuidFilter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : "uuid",
							value : uuid
						});

						var p = this.protocols['my_places'];

						var me = this;
						p.read( {
							filter : uuidFilter,
							callback : function(response) {
								me._handleMyPlacesResponse(response,
												service, cb);
							}
						})

					},
					
					/**
					 * @method handleMyPlacesResponse
					 * 
					 * processes ajax response from backend adds myplaces to
					 * given service
					 * 
					 */
					_handleMyPlacesResponse : function(response, service, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						if (feats == null)
							return;
						if (feats.length == 0)
							return;

						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['name'],
								'description' : featAtts['place_desc'],
								'categoryID' : featAtts['category_id'],
								'createDate' : featAtts['created'],
								'updateDate' : featAtts['updated'],
								'uuid' : uuid,
								'geometry' : f.geometry
							};

							service._addMyPlace(
								Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', m_atts));
						}

						if (cb) {
							cb();
						}

					},
					
		            /**
					 * @method getMyPlacesByIdList
					 * @param idList array of my place ids to be loaded
					 * @param cb callback that will receive a list of loaded models as param
					 * 
					 * load places with an id list
		             */
					getMyPlacesByIdList : function(idList, cb) {
						var uuid = this.uuid;
						var p = this.protocols['my_places'];
						var geoserverId = p.featureType + '.' +id;

						var filter = new OpenLayers.Filter.Logical({
		                    type: OpenLayers.Filter.Logical.AND,
		                    filters: [
		                        new OpenLayers.Filter.Comparison({
									type : OpenLayers.Filter.Comparison.EQUAL_TO,
									property : "uuid",
									value : uuid
		                        }),
		                        new OpenLayers.Filter.FeatureId({
		                            fids: idList
		                        })
		                    ]
		                });
		                

						var me = this;
						p.read( {
							filter : filter,
							callback : function(response) {
								me._handleMyPlaceByIdResponse(response, cb);
							}
						})
		            },
		            /**
					 * @method handleMyPlaceByIdResponse
					 * @param response server response
					 * @param cb callback to call with the model list as param
					 * callback for loading places with an id list
		             */
					_handleMyPlaceByIdResponse : function(response, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						if (feats == null || feats.length == 0) {
							return;
						}
						var modelList = [];

						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['name'],
								'description' : featAtts['place_desc'],
								'categoryID' : featAtts['category_id'],
								'createDate' : featAtts['created'],
								'updateDate' : featAtts['updated'],
								'uuid' : uuid,
								'geometry' : f.geometry
							};

							modelList.push(Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', m_atts));
						}

						if (cb) {
							cb(modelList);
						}

					},

					/**
					 * @method commitPlaces
					 * 
					 * handles insert & update (NO delete here see next moethd)
					 */
					commitMyPlaces : function(list, callback) {
						var p = this.protocols['my_places'];
						var uuid = this.uuid;
						var features = [];
						for ( var l = 0; l < list.length; l++) {
							var m = list[l];
							var m_id = m.get('id');
							var geom = m.get('geometry');
														
							/** s to e map! */
							var featAtts = {
								'name' : m.get('name'),
								'place_desc' : m.get('description'),
								'category_id' : m.get('categoryID'),
								'uuid' : uuid
							};

							var feat = new OpenLayers.Feature.Vector(geom, featAtts);
									
							// console.log('saving place - id: ' + m_id);
							if (!m_id) {
								feat.toState(OpenLayers.State.INSERT);
							} else {
								feat.fid = p.featureType + '.' + m_id;
								// toState handles some workflow stuff and doesn't work here
								feat.state = OpenLayers.State.UPDATE; 
							}
							features.push(feat);
						}
						var me = this;
						p.commit(features, {
							callback : function(response) {
								me._handleCommitMyPlacesResponse(response, list,
										callback);
							}
						});
					},

					/**
					 * @method handleCommitMyPlacesResponse
					 * 
					 * fix ids to model in this response handler 
					 */
					_handleCommitMyPlacesResponse : function(response, list, cb) {
						if (response.success()) {

							var features = response.reqFeatures;
							// deal with inserts, updates, and deletes
							var state, feature;
							var destroys = [];
							var insertIds = response.insertIds || [];
							var formattedIdList = [];
							
							for ( var i = 0, len = features.length; i < len; ++i) {
								feature = features[i];
								state = feature.state;
								if (state) {
									if (state == OpenLayers.State.INSERT) {
										feature.fid = insertIds[i];
										feature.attributes.id = feature.fid;
										var id = this._parseNumericId(feature.fid);
										list[i].set('id', id);
										formattedIdList.push(id);
									}
									else {
										formattedIdList.push(list[i].get('id'));
									}
									feature.state = null;
								}
							}
							// make another roundtrip to get the updated models from server
							// to get the create/update date
							var modelUpdateCb = function(pList) {
								cb(true, pList);
							};
							this.getMyPlacesByIdList(formattedIdList, modelUpdateCb);
							

						} else {

							cb(false, list);
						}
					},
					

					/*
					 * @method deleteMyPlaces
					 * 
					 * delete a list of my places from backend
					 */
					deleteMyPlaces : function(list, callback) {
						var p = this.protocols['my_places'];
						var uuid = this.uuid;
						var features = [];
						for ( var l = 0; l < list.length; l++) {
							var m_id = list[l];
							
							if (!m_id) {
								continue;
							}
							
							var featAtts = {
								'uuid' : uuid
							};

							var feat = new OpenLayers.Feature.Vector(null, featAtts);
									
							// console.log('Deleting place - id: ' + m_id);
								
							feat.fid = p.featureType + '.' + m_id;

							feat.state = OpenLayers.State.DELETE; 
							features.push(feat);
						}
						
						var me = this;
						p.commit(features, {
							callback : function(response) {
								me._handleDeleteMyPlacesResponse(response, list,
										callback);
							}
						});
					},
					
					/**
					 * @method handleDeleteMyPlacesResponse
					 * 
					 * update state to local models
					 */
					_handleDeleteMyPlacesResponse: function(response,list,cb) {
						
						/**
						 * Let's call service
						 */
						if (response.success()) {
							cb(true, list);

						} else {
							cb(false, list);
						}
						
					},

					/*
					 * @method disconnect
					 * 
					 * 'disconnects' from store (does not but might)
					 */
					disconnect : function() {

					}

				},
				{
					'protocol' : [ 'Oskari.mapframework.myplaces.service.Store' ]
				});
/**
 * @class Oskari.mapframework.ui.module.myplaces.MyPlacesModule
 * 
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents  
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.myplaces.MyPlacesModule',

/** 
 * @method constructor
 * @static
 * @param {Object} config
 * 					JSON model with initial values
 */ 
function(config) {
    this._sandbox = null;
    this.uiItems = {};
    this._config = config;
    this.myPlacesService = null;
    // used to disable handling hover and click events from map while editing
    this.disableMapEvents = false;
    // init layers from link (for printing) on initial load
    this.initialLoad = true;
    // actual id is set from layer json
    this.selectedMyPlace = null;
    this.localization = {};
    this.defaults = {};
    this.idPrefix = 'myplaces';
    this.defaults.dotColor = '993300';
    this.defaults.lineColor = '993300';
    this.defaults.fillColor = '993300';
    this.defaults.lineWidth = "1";
    this.defaults.dotSize = "4";
    this.defaults.categoryName = "Omat paikat"; // localization done in this._populateLanguageSet()


}, {
    __name : "MyPlacesModule",
    getName : function() {
        return this.__name;
    },
    /**
     * @method setDisableMapEvents
     * Click events for place selection cannot be handled correctly while editing a geometry.
     * We must disable handling while editing using this method.
     * @param boolean true if clicks and hover is not handled
     */
    setDisableMapEvents : function(blnParam) {
    	// safety check to keep it boolean
		this.disableMapEvents = (blnParam === true);
    },
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("Initializing my places module...");
        
        this._populateLanguageSet(sandbox);

        var user = sandbox.getUser();
        if(user.isLoggedIn()) {
        	// override userkey
        	me._config.userKey = user.getUuid(); 
        	// update default category name to have the users name in it 
        	this.defaults.categoryName = this.defaults.categoryName + ' - ' + user.getName();
        }

        // register plugin for map (drawing for my places)
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.DrawPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        // register plugin for map (hover tooltip for my places)
        var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;

        // create MyPlacesService
        this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.service.MyPlacesService', {
            sandbox : sandbox,
            user : me._config.userKey,
            url : me._config.actionUrl,
            defaults : me.defaults
        });
        
        // register for listening events
        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        // create UI
        // grid panel for listing places, added in start
        var gridPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGridPanel', {
        	id: 'myplaces-gridpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                service : me.myPlacesService,
                localizationSet : me.localization
            }
        });
        this.uiItems.gridPanel = gridPanel;

		// accordion panel 
        var mainPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesMainPanel', {
        	id: 'myplaces-mainpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                localizationSet : me.localization
            }
        });
        this.uiItems.mainPanel = mainPanel;

        // my places dialog
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        
        return mainPanel;
    },
    /**
     * @method _populateLanguageSet
     * Internal method to se localization strings
     */
    _populateLanguageSet : function(sandbox) {
        
		var lang =  sandbox.getLanguage();
		var locale = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces.ui.module.Locale',lang); // Create this once during startup
        this.localization = locale.getCurrentLocale();
		
		// special handling for defaults localization
		if('en' === lang) {
			this.defaults.categoryName = "My places";
		}
		else if('sv' === lang) {
			this.defaults.categoryName = "Mina platser";
		}
		
		if(!this.localization) {
			// default to fin if unknown localization
			this.localization = locale.getLocale('fi');
		}
    },
    
    /**
     * @method saveMyPlaceGeometry
     * Gets the geometry from drawplugin -> updates geometry on currently selected place.
     * Saves the currently selected place. If no place is selected, does nothing.
     */
    saveMyPlaceGeometry : function() {
        if(!this.selectedMyPlace) {
        	return;
        }
        var me = this;
            
    	// get current geometry from plugin and save
    	var getGeometryCallbackWrapper = function(pGeometry) {
        	me.uiItems.mainPanel.setLoading(me.localization.savemask);
        	me.selectedMyPlace.set('geometry', pGeometry);
        	
            var saveCallBackWrapper = function(success) {
                me._saveMyPlaceGeometryCallback(success);
            };
	        me.myPlacesService.saveMyPlace(me.selectedMyPlace, saveCallBackWrapper);
    		//me.myPlaceFinished(me.selectedMyPlace);
    	};
    	
        var request = this._sandbox.getRequestBuilder('MyPlaces.GetGeometryRequest')(getGeometryCallbackWrapper);
        this._sandbox.request(this.getName(), request);
        
    },
    /**
     * @method _saveMyPlaceGeometryCallback
     * Internal method to handle server response from save geometry.
     */
    _saveMyPlaceGeometryCallback : function(success) {
        var me = this;
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        
	        var layerId = this.getMapLayerId();
	        // send update request
	        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
	        this._sandbox.request(this.getName(), request);
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
   
    /**
     * @method myPlaceFinished
     * Saves the place given as parameter
     * @param myPlace model to be saved
     */
    myPlaceFinished : function(myPlaceModel, oldCategoryId) {
        var me = this;
        // saving
        if(myPlaceModel) {
            // add load mask
            if(this.wizardPanel) {
            	this.wizardPanel.setLoading(this.localization.savemask);
            }
			
            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success, pMyPlaceModel, isNew) {
                me._commitMyPlaceCallback(success, myPlaceModel, isNew, oldCategoryId);
            };
            this.myPlacesService.saveMyPlace(myPlaceModel, callBackWrapper);
        } else {
            // canceled
            this.cleanupAfterMyPlaceOperation();
        }
    },

    /**
     * @method _commitMyPlaceCallback
     * Internal method to handle server response from save my place model.
     * alerts on error and resets the functionality to start state on success
     */
    _commitMyPlaceCallback : function(success, myPlaceModel, isNew, oldCategoryId) {
        var me = this;
    	// remove load masks
    	if(this.wizardPanel) {
    		this.wizardPanel.setLoading(false);
    	}
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
	        
        	var newCategoryId = myPlaceModel.get('categoryID');
        	// change tab in grid
			this.uiItems.gridPanel.showCategory(newCategoryId);
	        // send update request for places category maplayer
	        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(newCategoryId), true);
	        this._sandbox.request(this.getName(), request);
        	if(oldCategoryId !== newCategoryId) {
        		// category changed -> update old layer also
		        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(oldCategoryId), true);
		        this._sandbox.request(this.getName(), request);
        	}
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
    /**
     * @method cleanupAfterMyPlaceOperation
     * Clean up after save or cancel/resets the functionality to start state
     */
    cleanupAfterMyPlaceOperation : function() {
        // tell everything to reset selected place
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this._sandbox.notifyAll(event);
        // tell plugin to disable draw
        this.uiItems.mainPanel.sendStopDrawRequest();
    	this.closeWizard();
    },
    /**
     * @method startWizard
     * Starts the my place dialog.
     * Populates dialog if a place is selected.
     */
    startWizard : function() {
        var me = this;
        if(this.wizardPanel && this.wizardPanel.isVisible()) {
        	this.closeWizard();
        }
        // extjs seems to explode if we try to reuse the dialog so just create a new one and be happy
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        var selCategory = this.uiItems.gridPanel.getSelectedCategory();
        if(selCategory) {
        	this.wizardPanel.setSelectedCategory(selCategory.get('id'))
        }
        this.wizardPanel.show();
        if(this.selectedMyPlace) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
    },
    /**
     * @method closeWizard
     * Closes the my place dialog.
     */
    closeWizard : function() {
    	if(this.wizardPanel) {
	    	this.wizardPanel.hide();
	    	this.wizardPanel.removeAll(true);
	    	this.wizardPanel.destroy();
    		this.wizardPanel = null;
	    }
    },
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
        // add gridPanel to the south panel
        Oskari.$("UI.facade").addUIComponent(this.getName() + '_grid', this.uiItems.gridPanel, 'S');
    },
    stop : function(sandbox) {
        // remove gridPanel that was added on start
        Oskari.$("UI.facade").removeUIComponent(this.getName() + '_grid');
    },
    
    processStartupLinkLayers: function(sandbox) {
        var mapLayers = sandbox.getRequestParameter('mapLayers');
        
        if(mapLayers === null || mapLayers === "") {
        	// no linked layers
        	return;
        }
        var layerStrings = mapLayers.split(",");
        var keepLayersOrder = true;

        for(var i = 0; i < layerStrings.length; i++) {
            var splitted = layerStrings[i].split("+");
            var layerId = splitted[0];
            var opacity = splitted[1];
            //var style = splitted[2];
            if(layerId !== null && layerId.indexOf(this.idPrefix) !== -1) {
                var rb = null;
                var r = null;
                rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                r = rb(layerId, keepLayersOrder);
                sandbox.request(this.getName(), r);
                rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                r = rb(layerId, opacity);
                sandbox.request(this.getName(), r);
            } 
        }
    },
    
    /**
     * @method getDrawModeFromGeometry
     * Returns a matching drawmode string-key for the geometry
     * @param geometry openlayers geometry from my place model
     */
    getDrawModeFromGeometry : function(geometry) {
        var olClass = geometry.CLASS_NAME;
        if('OpenLayers.Geometry.Point' === olClass) {
        	return 'point';
        } 
        else if('OpenLayers.Geometry.LineString' === olClass) {
        	return 'line';
        }
        else if('OpenLayers.Geometry.Polygon' === olClass){
        	return 'area';
        }
        return null;
    },
	/**
	 * Formats given message with the given params array values
	 * FIXME: copypasted from language service
	 * @param msg message to be formatter
	 * @param params array of params that has values for {arrayIndex} in param msg
	 */
    formatMessage : function(msg, params) {
        var formatted = msg;
        for(var index in params) {
            formatted = formatted.replace("{" + index + "}", params[index]);
        }
        return formatted;
    },
    /**
     * @method deleteMyPlace
     * Calls service to delete the currently selected my place
     */
    deleteMyPlace : function() {
        
        var me = this;
        if(this.selectedMyPlace) {
            // add load mask
            this.uiItems.mainPanel.setLoading(this.localization.deletemask);

            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success) {
                me._deleteMyPlaceCallback(success);
            };
            this.myPlacesService.deleteMyPlace(this.selectedMyPlace.get('id'), callBackWrapper);
        }
    },
    /**
     * @method _deleteMyPlaceCallback
     * Internal method to handle server response from delete my place model.
     */
    _deleteMyPlaceCallback : function(success) {
        var me = this;
        var catID = this.selectedMyPlace.get('categoryID');
        var layerId = this.getMapLayerId();
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            //this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorDelete);
        }
        // send update request
        var request = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
        this._sandbox.request(this.getName(), request);
    },
    /**
     * @method handleFinishedDrawingEvent
     * Handles FinishedDrawingEvent (sent from drawplugin)
     * Starts the wizard if the place is new
     */
    handleFinishedDrawingEvent : function(event) {
    	// TODO: pref just check if a place is selected?
        if(!event.isModification()) {
            // new place, start wizard
            this.startWizard();
        }
    },
    /**
     * @method getSelectedPlace
     * @return the currently selected my place or null if no selected
     */
    getSelectedPlace : function() {
    	return this.selectedMyPlace;
    },
    
    /**
     * @method _handlePlacesChanged
     * Called when a place or category is added, updated or deleted (and on initial load)
     */
    _handlePlacesChanged : function() {
    	
    	// notify grid that data is ready/changed
        //this.uiItems.gridPanel.placesChanged();
        if(this.wizardPanel) {
        	this.wizardPanel.refreshCategories();
        }
        
        
        // check map layers for categorychanges
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var categories = this.myPlacesService.getAllCategories();
        
        var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        
        // check for removal
        for(var i = 0; i < mapLayers.length; ++i) {
        	var layer = mapLayers[i];
        	var found = false;
        	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
        		var cat = categories[catIdx];
	    		if(this.getMapLayerId(cat.get('id')) === layer.getId()) {
        			found = true;
        		}
        	}
        	// remove map layer if the category is no longer available
        	if(!found) {
        		// remove maplayer from selected
        		// TODO: do we need to check if the layer is selected or just send this out every time?
                this._sandbox.requestByName(this.getName(), "RemoveMapLayerRequest", [layer.getId()]);
                // remove maplayer from all layers
	            mapLayerService.removeLayer(layer.getId());
	            
                // remove grid tab for category
                var catID = layer.getId().substring(this.idPrefix.length + 1);
                this.uiItems.gridPanel.removeCategory(catID);
        	}
        }
        
        
        
        
        // check for update or add
    	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
    		var cat = categories[catIdx];
        	var found = false;
        	for(var i = 0; i < mapLayers.length; ++i) {
	    		if(this.getMapLayerId(cat.get('id')) === mapLayers[i].getId()) {
	    			// found matching maplayer
        			found = true;
	    			// check name change
		    		if(cat.get('name') !== mapLayers[i].getName()) {
		    			var layerConf = {
		    				name: cat.get('name')
		    			};
		    			// update maplayer name if category name has changed
		    			mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
		    		}
	    		}
	    	}
        	if(!found) {
        		// add maplayer
        		var json = this.getMapLayerJson(cat);
	            var myplacesLayer = mapLayerService.createMapLayer(json);
	            mapLayerService.addLayer(myplacesLayer);
        	}
            this.uiItems.gridPanel.addOrUpdateCategory(cat);
    	}
        
    	if(this.initialLoad) {
	        // add the myplaces layers programmatically since enhancements 
	        // cant do this (run before the bundle adds the layers)
	        this.processStartupLinkLayers(this._sandbox);
	        // done here because layers aren't added to the service before this
    		this.initialLoad = false;
        
			// preselect the first category
			this.uiItems.gridPanel.showCategory();
    	}
    },
    
    /**
     * @method handleMyPlaceSelected
     * Sets the currently selected place
     * @param the new selected place model
     */
    handleMyPlaceSelected : function(pSelectedMyPlace) {
    	
        // keep a reference to the place so we know what to delete/edit
        this.selectedMyPlace = pSelectedMyPlace;

        if(this.wizardPanel && this.wizardPanel.isVisible()) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
	    this.uiItems.mainPanel.placeSelected(pSelectedMyPlace);
    },
    eventHandlers : {
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            this.handleFinishedDrawingEvent(event);
        },
        'MyPlaces.MyPlaceSelectedEvent' : function(event) {
            Oskari.$('UI.facade').expandPart('E');
        	this.uiItems.mainPanel.expand(true);
            this.handleMyPlaceSelected(event.getPlace());
            if(event.isDblClick()) {
            	this.startWizard();
            };
        },
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
        	this._handlePlacesChanged();
        },
        'MyPlaces.MyPlaceHoverEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
            	this.uiItems.gridPanel.handleHover(event);
           	}
        },
		'AfterMapLayerRemoveEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
        		// check if there is any myplaces layers left
        		var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        		var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        		if(mapLayers.length === 0) {
	                // deactivate hover plugin
	                this.hoverPlugin.deactivate();
        		}
            }
		},
		'MapClickedEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
				this.uiItems.gridPanel.handleMapClick(event);
			}
		},
        'AfterMapLayerAddEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
                
                // find the main panel (accordion panel in this case) and expand
                Oskari.$('UI.facade').expandPart('E');
            	this.uiItems.mainPanel.expand(true);
            	
                // do same for grid component 
                Oskari.$('UI.facade').showUIComponent(this.getName() + '_grid');
                
                // change tab to added category
                var catID = layer.getId().substring(this.idPrefix.length + 1);
				this.uiItems.gridPanel.showCategory(catID);
                
                // TODO: hover should not trigger on layers that are not selected
                // activate hover plugin
                this.hoverPlugin.activate();
            }
        }
    },

    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    
    /**
     * @method addLayerToMap
     * Adds the my places map layer to selected if it is not there already
     */
    addLayerToMap : function(categoryId) {
    	var layerId = this.getMapLayerId(categoryId);
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
	        var request = this._sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
	        this._sandbox.request(this.getName(), request);
        }
    },
    getMapLayerId : function(categoryId) {
    	if(!categoryId) {
    		if(this.selectedMyPlace) {
    			// default to selected place id
    			categoryId = this.selectedMyPlace.get('categoryID');
    		}
    		else {
    			// default to default category id(?)
    			var defCat = this.myPlacesService.getDefaultCategory();
    			if(defCat) {
    				
    				categoryId = defCat.get('id');
    			}
    			else {
    				categoryId = '-99';
    			}
    		}
    	}
    	return this.idPrefix + '_' + categoryId;
    },
    /**
     * @method getMapLayerJson
     * Populates the category based data to the base maplayer json 
     * @return maplayer json for the category
     */
    getMapLayerJson : function(categoryModel) {
    	var baseJson = this._getMapLayerJsonBase();
    	// wmsurl = "/karttatiili/myplaces?myCat="
    	baseJson.wmsUrl = this._config.wmsUrl + categoryModel.get('id') + "&";
    	baseJson.name = categoryModel.get('name');
    	baseJson.id = this.getMapLayerId(categoryModel.get('id'));
    	return baseJson;
    },
    
    /**
     * @method _getMapLayerJsonBase
     * Returns a base maplayer json for my places map layer
     */
    _getMapLayerJsonBase : function() {
		var json = {
			wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            orgName: this.localization.title,
            type: "wmslayer",
            metaType: this.idPrefix,
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity:75,
            inspire: this.localization.title,
            maxScale:1
		};
        return json;
    }
}, {
	/**
	 * @property protocol
	 * @static 
	 */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance *//**
 * @class Oskari.mapframework.bundle.myplaces.ui.module.Locale
 * Localization data for My Places bundle
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces.ui.module.Locale',

/**
 * @method create called automatically on construction
 * @static
 * @param lang 
 * 		current language ['fi'|'sv'|'en']
 */
function(lang) {
 this.lang = lang;
 this.loc = this.__locale[lang];
},{
  __locale: {
     'fi': {
        	// generic localization
        	title : 'Omat paikat <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Tallenna',
       		deleteConfirmTitle : 'Poistetaanko?',
        	loadmask : 'Ladataan...',
        	savemask : 'Tallennetaan...',
        	deletemask : 'Poistetaan...',
        	errorSave : 'Virhe tallennuksessa!',
        	errorDelete : 'Virhe poistossa!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'Toiminnolla voit tallentaa kohteita kartalle. Kohteet löytyvät Omat paikat -karttatasoilta. Aloita valitsemalla kohteen tyyppi:',
		        btnPoint : 'Lisää piste',
		        btnLine : 'Lisää reitti',
		        btnArea : 'Lisää alue',
        		drawHelp : {
        			point : 'Lisää piste klikkaamalla kartalla.',
        			line : 'Lisää viivan taitepiste klikkaamalla kartalla. Lopeta piirto tuplaklikkauksella tai painamalla "Lopeta piirto".',
        			area : 'Lisää alueen taitepiste klikkaamalla kartalla. Lopeta piirto tuplaklikkauksella tai painamalla "Lopeta piirto".'
        		},
        		btnCancelDraw : 'Keskeytä piirto',
        		btnFinishDraw : 'Lopeta piirto',
        		selectionHelp : 'Kohteen saat valittua muokattavaksi klikkaamalla sitä kartalla tai taulukossa.',
        		editHelp : {
			        point : 'Siirrä pistettä raahaamalla sitä kartalla.',
			        line : 'Muokkaa viivaa raahaamalla viivan taitepisteitä kartalla.',
			        area : 'Muokkaa muotoa raahaamalla reunaviivan taitepisteitä kartalla.',
			        desc : 'Muokkaa kohteen tietoja painamalla "Muokkaa" nappia.'
        		},
        		editSaveBtn : {
			        point : 'Tallenna sijainti',
			        line : 'Tallenna muoto',
			        area : 'Tallenna muoto'
        		},
        		btnEdit : 'Muokkaa',
        		deleteHelp : 'Valitun kohteen saat poistettua painamalla "Poista" nappia.',
        		btnDelete : 'Poista',
        		deleteConfirm : 'Paikan nimi: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Kohteen tiedot',
		        categoryLabel : 'Karttataso'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Lisää uusi karttataso',
		        editTip : 'Muokkaa karttatasoa',
		        cancelBtn : 'Sulje tallentamatta',
		        placeName : 'Nimi',
		        placeDesc : 'Kuvaus',
		        placeCreateDate : 'Kohde luotu',
		        placeUpdateDate : 'Kohde päivitetty',
		        errorNoName : 'Anna paikalle nimi',
		        errorCategoryNotSelected : 'Valitse karttataso tai anna uudelle karttatasolle nimi'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Poista karttataso',
		        lineColorLabel : 'Viivan tai reunaviivan väri',
		        fillColorLabel : 'Alueen täyttöväri',
		        lineWidthLabel : 'Viivan tai reunaviivan leveys',
		        dotSizeLabel : 'Pisteen koko',
		        dotColorLabel : 'Pisteen väri',
		        backBtn : 'Takaisin',
		        errorNoName : 'Anna karttatasolle nimi',
		        errorDeleteDefault : 'Oletuskarttatasoa ei voi poistaa'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Karttataso: "{0}". Sisältää paikkoja: {1} kpl.',
		        deleteConfirmMoveText : 'Haluatko siirtää paikat oletuskarttatasolle "{0}"?',
		        btnMove : 'Siirrä paikat ja poista karttataso',
		        btnDelete : 'Poista karttataso',
		        btnDeleteAll : 'Poista karttataso paikkoineen',
		        btnCancel : 'Peruuta'
        	},
        	
        	// grid panel
        	grid : {
        		title : 'Omat paikat <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Nimi',
		        placeDesc : 'Kuvaus',
		        linkHeader: 'Kohdistus',
		        linkValue: 'Näytä kohde',
		        type : {
		        	label :'Tyyppi',
		        	point : 'Piste',
		        	line : 'Viiva',
		        	area : 'Alue' 
		        },
		        createDate : 'Kohde luotu',
		        updateDate : 'Kohde päivitetty'
        	}
       },
     'sv' : {
        	// generic localization
        	title : 'Mina platser <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Spara',
       		deleteConfirmTitle : 'Radera?',
        	loadmask : 'Laddar...',
        	savemask : 'Lagrar...',
        	deletemask : 'Raderar...',
        	errorSave : 'Fel vid lagring!',
        	errorDelete : 'Fel vid radering!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'Du kan lagra objekt på kartan med funktionen "Mina platser". Objekten finns på kartlagren Mina platser. Börja genom att välja typen av objekt:',
		        btnPoint : 'Tillsätt punkt',
		        btnLine : 'Tillsätt rutt',
		        btnArea : 'Tillsätt område',
        		drawHelp : {
        			point : 'Tillägg en punkt genom att klicka på kartan.',
        			line : 'Tillägg en brytningspunkt på linjen genom att klicka på kartan. Sluta rita genom att dubbelklicka, eller klicka på knappen "Avsluta ritandet".',
        			area : 'Tillägg en brytningspunkt på området genom att klicka på kartan. Sluta rita genom att dubbelklicka, eller klicka på knappen "Avsluta ritandet".'
        		},
        		btnCancelDraw : 'Avbryt ritandet',
        		btnFinishDraw : 'Avsluta ritandet',
        		selectionHelp : 'Du kan bearbeta objektet genom att klicka det på kartan eller i tabellen.',
        		editHelp : {
			        point : 'Flytta på punkten genom att klicka och släpa det på kartan.',
			        line : 'Bearbeta rutten genom att klicka och släpa dess brytningspunkt på kartan.',
			        area : 'Bearbeta figuren genom att klicka och släpa kantlinjens brytningspunkter på kartan.',
			        desc : 'Bearbeta informationen om objektet genom att klicka på "Bearbeta".'
        		},
        		editSaveBtn : {
			        point : 'Spara läge',
			        line : 'Spara figur',
			        area : 'Spara figur'
        		},
        		btnEdit : 'Bearbeta',
        		deleteHelp : 'Radera det valda objektet genom att klicka på "Radera".',
        		btnDelete : 'Radera',
        		deleteConfirm : 'Platsens namn: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Information om objektet',
		        categoryLabel : 'Kartlager'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Tillägg ett kartlager',
		        editTip : 'Bearbeta kartlagret',
		        cancelBtn : 'Stäng utan att lagra',
		        placeName : 'Namn',
		        placeDesc : 'Beskrivning',
		        placeCreateDate : 'Objektet skapades',
		        placeUpdateDate : 'Objektet uppdaterades',
		        errorNoName : 'Namnge platsen',
		        errorCategoryNotSelected : 'Välj kartlager eller namnge ett nytt kartlager'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Radera kartlagret',
		        lineColorLabel : 'Linjens eller kantlinjens färg',
		        fillColorLabel : 'Områdets ifyllnadsfärg',
		        lineWidthLabel : 'Linjens eller kantlinjens bredd',
		        dotSizeLabel : 'Punktens storlek',
		        dotColorLabel : 'Punktens färg',
		        backBtn : 'Tillbaka',
		        errorNoName : 'Namnge kartlagret',
		        errorDeleteDefault : 'Det förvalda kartlagret kan inte raderas'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Kartlager: "{0}". Antal platser: {1}',
		        deleteConfirmMoveText : 'Vill du flytta platserna till det förvalda kartlagret "{0}"?',
		        btnMove : 'Flytta platserna och radera kartlagret',
		        btnDelete : 'Radera kartlagret',
		        btnDeleteAll : 'Radera kartlagret inkl. platserna',
		        btnCancel : 'Tillbaka'
        	},
        	
        	// grid panel
        	grid : {
        		title : 'Mina platser <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Namn',
		        placeDesc : 'Beskrivning',
		        linkHeader: 'Fokusering',
		        linkValue: 'Vis objekt',
		        type : {
		        	label :'Typ',
		        	point : 'Punkt',
		        	line : 'Linje',
		        	area : 'Område' 
		        },
		        createDate : 'Objektet skapades',
		        updateDate : 'Objektet uppdaterades'
        	}
      },
     'en' : {
        	// generic localization
        	title : 'My places <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Save',
       		deleteConfirmTitle : 'Delete?',
        	loadmask : 'Loading...',
        	savemask : 'Saving...',
        	deletemask : 'Deleting...',
        	errorSave : 'Error while saving!',
        	errorDelete : 'Error while deleting!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'The function My places allows you to save objects on the map. ' +
		        			'Saved objects are stored in map layer group "My places". '+
		        			'Please start by selecting type of object:',
		        btnPoint : 'Add point',
		        btnLine : 'Add route',
		        btnArea : 'Add area',
        		drawHelp : {
        			point : 'Add a point by clicking on the map.',
        			line : 'Add a handle on the line by clicking on the map. ' + 
    					'Stop drawing by double-clicking or by clicking the button "Stop drawing".',
        			area : 'Add a handle on the boundary line of the area by clicking on the map. ' +
        				'Stop drawing by double-clicking or by clicking the button "Stop drawing".'
        		},
        		btnCancelDraw : 'Cancel drawing',
        		btnFinishDraw : 'Stop drawing',
        		selectionHelp : 'Start editing an object by clicking it on the map or in the table.',
        		editHelp : {
			        point : 'Move a point object by clicking and dragging it on the map.',
			        line : 'Move and edit a route object by clicking and dragging the line handles on the map.',
			        area : 'Move and edit an area object by clicking and dragging the boundary line handles on the map.',
			        desc : 'Edit object information by clicking the "Edit"-button.'
        		},
        		editSaveBtn : {
			        point : 'Save location',
			        line : 'Save shape',
			        area : 'Save shape'
        		},
        		btnEdit : 'Edit',
        		deleteHelp : 'Delete selected object by clicking the "Remove"-button.',
        		btnDelete : 'Delete',
        		deleteConfirm : 'Object name: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Object information',
		        categoryLabel : 'Map layer'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Add a new map layer',
		        editTip : 'Edit map layer',
		        cancelBtn : 'Close without saving',
		        placeName : 'Name',
		        placeDesc : 'Description',
		        placeCreateDate : 'Object created',
		        placeUpdateDate : 'Object updated',
		        errorNoName : 'Type object name',
		        errorCategoryNotSelected : 'Select a map layer or type the name of a new map layer'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Delete map layer',
		        lineColorLabel : 'Colour of line or area boundary',
		        fillColorLabel : 'Fill colour of area',
		        lineWidthLabel : 'Width of line or area boundary',
		        dotSizeLabel : 'Point size',
		        dotColorLabel : 'Point colour',
		        backBtn : 'Back',
		        errorNoName : 'Type map layer name',
		        errorDeleteDefault : 'The default map layer cannot be deleted'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Map layer: "{0}". Number of places: {1}.',
		        deleteConfirmMoveText : 'Do you want to move places to the default map layer "{0}"?',
		        btnMove : 'Move places and delete map layer',
		        btnDelete : 'Delete map layer',
		        btnDeleteAll : 'Delete map layer and its places',
		        btnCancel : 'Cancel'
        	},
        	
        	// grid panel
        	grid : {
		        title : 'My places <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Name',
		        placeDesc : 'Description',
		        linkHeader: 'Focus',
		        linkValue: 'Show object',
		        type : {
		        	label :'Type',
		        	point : 'Point',
		        	line : 'Line',
		        	area : 'Area' 
		        },
		        createDate : 'Object created',
		        updateDate : 'Object updated'
        	}
      }
  },
    /**
     * @method getCurrentLocale
     * Returns the localization data for current language
	 * @return {Object} JSON presentation of localization key/value pairs
     */
  getCurrentLocale: function()  {
     return this.loc;
  },
    /**
     * @method getLocale
     * Returns the localization data for requested language
	 * @param lang
	 * 		current language ['fi'|'sv'|'en']
	 * @return {Object} JSON presentation of localization key/value pairs   
     */
  getLocale: function(lang) {
     return this.__locale[lang];
  },
    /**
     * @method getLocale
     * Returns a single localized text matching the given key for current language
	 * @param {String} key
	 * 		localization key
	 * @return {String} localized text matching the key  
     */
  getText: function(key) {
     return this.loc[key];
}});Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.CategoryPanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border: false,
    frame: false, 

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};
        config.category = null;
        config.defaults = this.oskariConfig.defaults;

        config.loc = {};
        config.loc.deleteTip = this.oskariConfig.localizationSet.category.deleteTip;
        config.loc.categoryLabel = this.oskariConfig.localizationSet.wizard.categoryLabel;
        config.loc.lineColorLabel = this.oskariConfig.localizationSet.category.lineColorLabel;
        config.loc.fillColorLabel = this.oskariConfig.localizationSet.category.fillColorLabel;
        config.loc.lineWidthLabel = this.oskariConfig.localizationSet.category.lineWidthLabel;
        config.loc.dotColorLabel = this.oskariConfig.localizationSet.category.dotColorLabel;
        config.loc.dotSizeLabel = this.oskariConfig.localizationSet.category.dotSizeLabel;
        config.loc.backBtn = this.oskariConfig.localizationSet.category.backBtn;
        config.loc.saveBtn = this.oskariConfig.localizationSet.saveBtn;
        config.loc.deleteConfirmTitle = this.oskariConfig.localizationSet.deleteConfirmTitle;
        config.loc.deleteConfirm = this.oskariConfig.localizationSet.category.deleteConfirm;
        config.loc.errorNoName = this.oskariConfig.localizationSet.category.errorNoName;
        config.loc.errorDeleteDefault = this.oskariConfig.localizationSet.category.errorDeleteDefault;

        // build panel
        this._buildItems(config);
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method setParams
     * Set the category to be edited or dummy model for new category
     */
    setParams : function(params) {
        var me = this;

        if(params.isNew || params.categoryModel.get('isDefault')) {
            // disable delete for new and default category
            me.uiItems.deleteCategoryButton.disable();
        } else {
            me.uiItems.deleteCategoryButton.enable();
        }

        me.uiItems.categoryName.setValue(params.categoryModel.get('name'));

        var lineWidth = params.categoryModel.get('lineWidth');
        if(!lineWidth) {
            lineWidth = me.defaults.lineWidth;
        }
        me.uiItems.lineWidthCombo.select(lineWidth);
        
        var dotSize = params.categoryModel.get('dotSize');
        if(!dotSize) {
            dotSize = me.defaults.dotSize;
        }
        me.uiItems.dotSizeCombo.select(dotSize);

        var fillColor = params.categoryModel.get('fillColor');
        if(!fillColor) {
            fillColor = me.defaults.fillColor;
        }
        me.uiItems.fillColorPicker.select(fillColor);

        var lineColor = params.categoryModel.get('lineColor');
        if(!lineColor) {
            lineColor = me.defaults.lineColor;
        }
        me.uiItems.lineColorPicker.select(lineColor);
        
        var dotColor = params.categoryModel.get('dotColor');
        if(!dotColor) {
            dotColor = me.defaults.dotColor;
        }
        me.uiItems.dotColorPicker.select(dotColor);

        me.category = params.categoryModel;
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        //        var me = this;

        var dotColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.dotColor, // initial selected color
            fieldLabel : config.loc.dotColorLabel
        });
        config.uiItems.dotColorPicker = dotColorPicker;
        
        var lineColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.lineColor, // initial selected color
            fieldLabel : config.loc.lineColorLabel
        });
        config.uiItems.lineColorPicker = lineColorPicker;

        var fillColorPicker = Ext.create('Ext.picker.Color', {
            value : config.defaults.fillColor, // initial selected color
            fieldLabel : config.loc.fillColorLabel
        });
        config.uiItems.fillColorPicker = fillColorPicker;

        // The data store containing the list of states
        var lineWidthStore = Ext.create('Ext.data.Store', {
            fields : ['lineWidth'],
            data : [{
                lineWidth : "1"
            }, {
                lineWidth : "2"
            }, {
                lineWidth : "4"
            }, {
                lineWidth : "8"
            }, {
                lineWidth : "16"
            }]
        });
        
        // The data store containing the list of states
        var dotSizeStore = Ext.create('Ext.data.Store', {
            fields : ['dotSize'],
            data : [{
                dotSize : "1"
            }, {
                dotSize : "2"
            }, {
                dotSize : "4"
            }, {
                dotSize : "8"
            }, {
                dotSize : "16"
            }]
        });

        var dotSizeCombo = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.dotSizeLabel,
            border : true,
            frame : true,
            editable : false,
            forceSelection : true,
            value : config.defaults.dotSize,
            store : dotSizeStore,
            displayField : 'dotSize',
            valueField : 'dotSize',
            queryMode : 'local'
        });
        config.uiItems.dotSizeCombo = dotSizeCombo;
        
        // Create the combo box, attached to the states data store
        var lineWidthCombo = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.lineWidthLabel,
            border : true,
            frame : true,
            editable : false,
            forceSelection : true,
            value : config.defaults.lineWidth,
            store : lineWidthStore,
            displayField : 'lineWidth',
            valueField : 'lineWidth',
            queryMode : 'local'
        });
        config.uiItems.lineWidthCombo = lineWidthCombo;

        var dotColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'dotColorPicker',
                text : config.loc.dotColorLabel
            }, dotColorPicker]
        });
        var lineColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'lineColorPicker',
                text : config.loc.lineColorLabel
            }, lineColorPicker]
        });

        var fillColorField = Ext.create('Ext.panel.Panel', {
            bodyPadding : 10,
            layout : 'fit',
            items : [{
                xtype : 'label',
                forId : 'fillColorPicker',
                text : config.loc.fillColorLabel
            }, fillColorPicker]
        });

        var colorPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            layout : 'hbox',
            items : [dotColorField, lineColorField, fillColorField]
        });
        
        var sizePanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            layout : 'hbox',
            items : [dotSizeCombo, lineWidthCombo]
        });

        var mainPanel = Ext.create('Ext.form.Panel', {
            border : false,
            frame : false,
            bodyPadding : 10,
            items : [colorPanel, sizePanel]
        });

        config.uiItems.mainPanel = mainPanel;
        config.items = [mainPanel];
    },
    /**
     * @method _cancelCategoryEdit
     * Internal method to handle cancel button
     */
    _cancelCategoryEdit : function() {
        this.cancelAction();
    },
    /**
     * @method _commitCategoryEdit
     * Internal method to handle save button
     */
    _commitCategoryEdit : function() {
        var me = this;
        var categoryName = me.uiItems.categoryName.getValue().trim();
        // check empty name
        if(!categoryName) {
            alert(me.loc.errorNoName);
        } else {
            me.category.set('name', me.uiItems.categoryName.getValue());
            me.category.set('lineWidth', me.uiItems.lineWidthCombo.getValue());
            me.category.set('fillColor', me.uiItems.fillColorPicker.getValue());
            me.category.set('lineColor', me.uiItems.lineColorPicker.getValue());
            
            me.category.set('dotSize', me.uiItems.dotSizeCombo.getValue());
            me.category.set('dotColor', me.uiItems.dotColorPicker.getValue());
            
            this.finishedAction(me.category);
        }
    },
    /**
     * @method _buildDockedButtons
     * Internal method to build top toolbar (category name/delete) and bottom toolbar (save/cancel)
     */
    _buildDockedButtons : function(config) {
        var me = this;

        // TOP TOOLBAR

        var categoryName = Ext.create('Ext.form.TextField', {
            fieldLabel : config.loc.categoryLabel,
            emptyText: config.loc.errorNoName,
            flex : 1
        });
        config.uiItems.categoryName = categoryName;

        var deleteCategoryButton = Ext.create('Ext.button.Button', {
            //text: 'X',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_delete_category',
            tooltip : config.loc.deleteTip,
            handler : function() {
            	// don't allow default category delete
            	// button should be disabled but just to be sure
		        if(me.category.get('isDefault')) {
		            alert(me.loc.errorDeleteDefault);
		            return;
		        }
		        // deleteCategoryAction is given as callback param from wizard
		        me.deleteCategoryAction(me.category);
            }
        });
        config.uiItems.deleteCategoryButton = deleteCategoryButton;

        // BOTTOM TOOLBAR
        var saveButton = Ext.create('Ext.Button', {
            text : config.loc.saveBtn,
            handler : function() {
                me._commitCategoryEdit();
            }
        });
        config.uiItems.saveButton = saveButton;

        var backButton = Ext.create('Ext.Button', {
            text : config.loc.backBtn,
            handler : function() {
                me._cancelCategoryEdit();
            }
        });
        config.uiItems.backButton = backButton;

        config.dockedItems = [{
            xtype : 'toolbar',
            dock : 'top',
            items : [categoryName, deleteCategoryButton]
        }, {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [{xtype:'tbfill'}, backButton, saveButton]
        }];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.ConfirmWindow', {
    extend : 'Ext.window.Window',
//    height : 200,
    modal: true,
    // 400 should be enough for large buttons
    width : 400,
    layout : 'fit',
    cls: Ext.baseCSSPrefix + 'message-box',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        //config.html = this.message;

        // build panel confs
        this._buildItems(config);
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _createButton
     * Internal method create toolbar button
     */
    _createButton : function(btnConf) {
		var me = this;
        var btn = Ext.create('Ext.Button', {
            text : btnConf.text,
            handler : function() {
            	me.destroy();
            	if(btnConf.handler) {
            		btnConf.handler();
            	}
            }
        });
        return btn;
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        // pretty much copypasted from Ext.MessageBox
        me.topContainer = Ext.create('Ext.container.Container', {
            anchor: '100%',
            style: {
                padding: '10px',
                overflow: 'hidden'
            },
            items: [
                me.iconComponent = Ext.create('Ext.Component', {
                    cls: 'ext-mb-icon ' + Ext.Msg.QUESTION, 
                    width: 50,
                    height: 35,
                    style: {
                        'float': 'left'
                    }
                }),
                me.promptContainer = Ext.create('Ext.container.Container', {
                    layout: {
                        type: 'anchor'
                    },
                    items: [
                        me.msg = Ext.create('Ext.Component', {
                            autoEl: { tag: 'span' },
                            cls: 'ext-mb-text',
                            html: me.message
                        })
                    ]
                })
            ]
        });
        config.items = [me.topContainer];
       
    },
    /**
     * @method _buildDockedButtons
     * Internal method to build bottom toolbar
     */
    _buildDockedButtons : function(config) {
        var me = this;

		var buttonItems = [];
		for(var index in this.dialogButtons) {
			var btnConf = this.dialogButtons[index];
			if(btnConf == 'break') {
        		 buttonItems.push({xtype : 'tbfill'});
			}
			else {
				var btn = this._createButton(btnConf);
				buttonItems.push(btn);
			}
		}
        // BOTTOM TOOLBAR
        config.dockedItems = [
        {
            xtype : 'toolbar',
            ui: 'footer',
            dock : 'bottom',
            items : buttonItems
        }];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacePanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        
        config.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });

        config.loc = {};
        config.loc.categoryLabel = this.oskariConfig.localizationSet.wizard.categoryLabel;
        config.loc.cancelBtn = this.oskariConfig.localizationSet.myplace.cancelBtn;
        config.loc.finishBtn = this.oskariConfig.localizationSet.saveBtn;
        config.loc.placeName = this.oskariConfig.localizationSet.myplace.placeName;
        config.loc.placeDesc = this.oskariConfig.localizationSet.myplace.placeDesc;
        config.loc.placeCreateDate = this.oskariConfig.localizationSet.myplace.placeCreateDate;
        config.loc.placeUpdateDate = this.oskariConfig.localizationSet.myplace.placeUpdateDate;
        config.loc.errorNoName = this.oskariConfig.localizationSet.myplace.errorNoName;
        config.loc.errorCategoryNotSelected = this.oskariConfig.localizationSet.myplace.errorCategoryNotSelected;

        config.loc.addTip = this.oskariConfig.localizationSet.myplace.addTip;
        config.loc.editTip = this.oskariConfig.localizationSet.myplace.editTip;
        config.category = {};

        // build panel
        config.items = [this._buildItems(config)];
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var panelItems = this._createFormFields(config);

        var mainPanel = Ext.create('Ext.form.Panel', {
        	id: 'myplace-popup-placepanel',
            border : false,
            frame : false,
            padding : 10,
            hideMode : 'offsets',
            style : 'text-align: left;',
            fieldDefaults : {
                labelAlign : 'top',
                msgTarget : 'top'
            },
            defaults : {
                anchor : '100%'
            },
            items : panelItems
        });

        config.uiItems.mainPanel = mainPanel;
        return mainPanel;
    },
    /**
     * @method _createFormFields
     * Internal method to build the panels form fields
     */
    _createFormFields : function(config) {
        var me = this;
        
        if(!config.myPlace) {
        	config.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });
        }
        var panelItems = [];
        var nameField = Ext.create('Ext.form.Text', {
            xtype : 'textfield',
            name : 'name',
            emptyText: config.loc.errorNoName,
            fieldLabel : config.loc.placeName,
            value : config.myPlace.get('name'),
            allowBlank : false
        });
        panelItems.push(nameField);
        
        /*
         * // WYSIWYG is bugged in IE atm so using textArea instead
        var descField = Ext.create('Ext.form.HtmlEditor', {
            name : 'description',
            value : config.myPlace.get('description'),
            fieldLabel : config.loc.placeDesc
        });
        */
       
        var descField = Ext.create('Ext.form.TextArea', {
            name : 'description',
        	grow      : false,
            value : config.myPlace.get('description'),
            fieldLabel : config.loc.placeDesc
        });
       
        panelItems.push(descField);
        
        if(config.myPlace.get('createDate')) {
        	var formattedDate = me._formatDate(config.myPlace.get('createDate'));
            panelItems.push({
                xtype : 'displayfield',
                labelAlign : 'left',
                fieldLabel : config.loc.placeCreateDate,
                name : 'createDate',
                value : formattedDate
            });
        	formattedDate = me._formatDate(config.myPlace.get('updateDate'));
            panelItems.push({
                xtype : 'displayfield',
                labelAlign : 'left',
                fieldLabel : config.loc.placeUpdateDate,
                name : 'updateDate',
                value : formattedDate
            });
        }
        return panelItems;
    },
    /**
     * @method _formatDate
     * Internal method to parse the given date and formats it for the panel
     * @param dateStr string date as returned from geoserver 
     */
    _formatDate : function(dateStr) {
		var dateArray = this.oskariConfig.service.parseDate(dateStr);
		
		var time = '';
		if(dateArray.length == 0) {
    		// return empty if no date
    		return '';
    	}
    	else if(dateArray.length > 1) {
    		var iconSrc = Oskari.$().startup.imageLocation + '/resource/silk-icons/clock.png';
    		time = '<img src="' + iconSrc + '" /> ' + dateArray[1];
    	} 
    	
		var dateIconSrc = Oskari.$().startup.imageLocation + '/resource/silk-icons/calendar.png';
		return '<img src="' + dateIconSrc + '" /> ' + dateArray[0] + ' ' + time;
    },
    /**
     * @method setPlace
     * Sets a backing my place model for the form
     * @param myPlaceModel model to populate the form with 
     */
    setPlace : function(myPlaceModel) {
		if(myPlaceModel) {
			this.myPlace = myPlaceModel;
        	this.setSelectedCategory(myPlaceModel.get('categoryID'));
        }
        else {
        	this.myPlace = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', {
                name : '',
                description : ''
            });
        }
    },
    /**
     * @method saveValues
     * Saves the current form values to the backing my place model
     */
    saveValues : function() {
    	var values = this.uiItems.mainPanel.getValues();
    	this.myPlace.set('name', values.name);
    	this.myPlace.set('description', values.description);
    	
        try {
            var categoryIndex = this._getCategorySelectionIndex();
            var categoryModel = this.categoryStore.getAt(categoryIndex);
            this.myPlace.set('categoryID', categoryModel.get('id'));
        } catch(ignored) {
            // (empty category name)
        }
    },
    
    /**
     * @method recreatePanel
     * This method is used to recreate the form field
     * The WYSIWYG editor breaks if its panel is hidden and shown again
     * This is the only reason why this is done
     * 
     * FIXME: wysiwyg isn't used anymore so deprecated?
     */
    recreatePanel : function() {
        this.uiItems.mainPanel.removeAll();
        var panelItems = this._createFormFields(this);
        this.uiItems.mainPanel.add(panelItems);
    },
    /**
     * @method _myPlaceFinished
     * Internal method to handle save button
     */
    _myPlaceFinished : function() {
        var me = this;

        try {
        	var oldCategoryId = me.myPlace.get('categoryID');
            this.saveValues();
            if(!me.myPlace.get('name')) {
                alert(me.loc.errorNoName);
                return;
            }
            // check that category is selected
            var categoryIndex = this._getCategorySelectionIndex();
            
            this.finishedAction(me.myPlace, oldCategoryId);
        } catch(error) {
            // show possible error (=empty category name)
            alert(error);
        }
    },
    /**
     * @method _myPlaceCanceled
     * Internal method to handle cancel button
     */
    _myPlaceCanceled : function() {
        this.finishedAction();
    },
    /**
     * @method _getCategorySelectionIndex
     * Internal method to determine category selection
     * @return the store index for the current selected category
     * in drop down or -1 if not in store
     */
    _getCategorySelectionIndex : function() {
        var me = this;

        var categoryName = me.uiItems.categoryDropdown.getValue();

        if(!categoryName) {
            throw me.loc.errorCategoryNotSelected;
        }
        // try to find it in store
        var index = me.categoryStore.findBy(function(record, id) {
            // dropdown gives id if found in store
            // and written value if not
            if(isNaN(categoryName)) {
                return record.get('name') == categoryName;
            }
            return record.get('id') == categoryName;
        });
        return index;
    },
    /**
     * @method _handleCategoryControls
     * Internal method to handle dropdown selections and ENTER keypresses after user typing
     * on category drop down
     *
     * @param isAddButton is used to detect if we should be adding a
     * category even when existing category is selected on dropdown
     */
    _handleCategoryControls : function(isAddButton) {
        var me = this;
        var index = -1;
        try {
            index = me._getCategorySelectionIndex();
        } catch(error) {
            // show possible error (=empty category name)
            // dont show if pressed addbutton
            if(!isAddButton) {
                alert(error);
                return;
            }
        }
        var model = null;
        var notFoundInStore = (index == -1);
        // not found in store == new category

        var isNew = (notFoundInStore || isAddButton);

        if(isNew) {
            var categoryName = '';
            if(notFoundInStore) {
                categoryName = me.uiItems.categoryDropdown.getValue();
            }
            // create new model for category form
            model = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', {
                name : categoryName
            });
        } else {
            // categoryName == store index if not new
            // load the category for editing
            model = me.categoryStore.getAt(index);
        }
        var params = {
            isNew : isNew,
            categoryModel : model
        };

        // categoryOperation is passed by wizard as callback method
        me.categoryOperation(params);

    },
    /**
     * @method setCategories
     * Updates the categories offered to user
     * @param array of myplace category models
     */
    setCategories : function(categoryList) {
        var me = this;
        me.categoryStore.loadData(categoryList);
    },
    /**
     * @method setSelectedCategory
     * Sets the current category programmatically
     * @param categoryId to select (selects default category)
     */
    setSelectedCategory : function(categoryId) {
        var me = this;
        if(!categoryId) {
            //default to first
        	var defaultCategory = this.oskariConfig.service.getDefaultCategory();
        	categoryId = defaultCategory.get('id');
        		/*
            if(me.categoryStore.count() > 0) {
	            categoryId = me.categoryStore.getAt(0).get('id');
            }*/
        } 
        me.uiItems.categoryDropdown.setValue(categoryId);
    },
    /**
     * @method _handleCategoryButtons
     * Internal method to handle button states while typing etc "changehandler"
     */
    _handleCategoryButtons : function() {
        var me = this;

        try {
            var index = me._getCategorySelectionIndex();

            if(index == -1) {
                // new category
                this.uiItems.editCategoryButton.disable();
            } else {
                // existing category
                this.uiItems.editCategoryButton.enable();
            }
        } catch(ignored) {
            // no need to bother with errors here
        }

    },
    /**
     * @method _buildDockedButtons
     * Internal method to build top toolbar (category tools) and bottom toolbar (save/cancel)
     */
    _buildDockedButtons : function(config) {
        var me = this;

        // TOP TOOLBAR

        // Create the combo box
        // categoryStore is passed by MyPlacesWizard when creating this panel
        var categoryDropdown = Ext.create('Ext.form.ComboBox', {
            fieldLabel : config.loc.categoryLabel,
            store : me.categoryStore,
            id: 'myplace-category-dropdown',
            //autoSelect: true,
            typeAhead : true,
            typeAheadDelay : 1000, // wait a second before autocomplete
            flex : 1,
            queryMode : 'local',
            displayField : 'name',
            valueField : 'id',
            listeners : {
                specialKey : function(field, e) {
                    if(e.getKey() == e.ENTER) {
                        me._handleCategoryControls(false);
                    }
                }
            }

        });
        config.uiItems.categoryDropdown = categoryDropdown;
        categoryDropdown.setValue(me.categoryStore.getAt(0));

        // bind changelistener after default value is set
        categoryDropdown.on('change', function() {
            me._handleCategoryButtons();
        });
        var addCategoryButton = Ext.create('Ext.button.Button', {
            //text: '+',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_add_category',
            tooltip : config.loc.addTip,
            handler : function() {
                me._handleCategoryControls(true);
            }
        });
        config.uiItems.addCategoryButton = addCategoryButton;

        var editCategoryButton = Ext.create('Ext.button.Button', {
            //text: 'E',
            cls : 'x-btn-icon',
            scale : 'small',
            iconCls : 'myplaces_edit_category',
            tooltip : config.loc.editTip,
            handler : function() {
                me._handleCategoryControls(false);
            }
        });
        config.uiItems.editCategoryButton = editCategoryButton;

        // BOTTOM TOOLBAR
        var finishedButton = Ext.create('Ext.Button', {
            text : config.loc.finishBtn,
            handler : function() {
                me._myPlaceFinished();
            }
        });
        config.uiItems.finishedButton = finishedButton;

        var cancelButton = Ext.create('Ext.Button', {
            text : config.loc.cancelBtn,
            handler : function() {
                me._myPlaceCanceled();
            }
        });
        config.uiItems.cancelButton = cancelButton;

        config.dockedItems = [{
            xtype : 'toolbar',
            dock : 'top',
            items : [categoryDropdown, editCategoryButton, addCategoryButton]
        }, {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [{xtype:'tbfill'}, cancelButton, finishedButton]
        }];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesBasicControls', {
    extend : 'Ext.panel.Panel',
    layout : 'anchor',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};

        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var myPlacesDesc = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.myPlacesDesc
        });

        var btnPoint = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnPoint,
            cls : 'x-btn-icon',
            //flex : 1,
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_point',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'point'
                });
            }
        });
        var btnLine = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnLine,
            cls : 'x-btn-icon',
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_line',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'line'
                });
            }
        });
        var btnArea = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnArea,
            cls : 'x-btn-icon',
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_area',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'area'
                });
            }
        });
        config.uiItems.btnPoint = btnPoint;
        config.uiItems.btnLine = btnLine;
        config.uiItems.btnArea = btnArea;

        var drawButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            layout: 'anchor',
            bodyPadding : '5 25',
            items : [btnPoint, btnLine, btnArea]
        });
        
        var selectionHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.selectionHelp
        });
        
        config.items = [myPlacesDesc, drawButtonsPanel, selectionHelp];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesDrawControls', {
    extend : 'Ext.panel.Panel',
    layout : 'anchor',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};
        config.category = null;

        config.module = this.oskariConfig.module;
        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method setDrawMode
     * Modifies the ui texts and functionality to match the current draw mode
     * @param mode as in StartDrawRequest
     */
    setDrawMode : function(mode) {
		this.uiItems.drawHelp.update(this.oskariConfig.localizationSet.mainpanel.drawHelp[mode]);
		if('point' === mode) {
			this.uiItems.btnFinishDraw.hide();
		} 
		else {
			// only relevant if doing line or area
			this.uiItems.btnFinishDraw.show();
		}
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;


        var drawHelp = Ext.create('Ext.form.Label');
        config.uiItems.drawHelp = drawHelp;

        var btnCancelDraw = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnCancelDraw,
            //disabled : true,
            scale : 'medium',
            iconCls : 'myplaces_draw_cancel',
            handler : function() {
                me.module.closeWizard();
                me.mainPanel.sendStopDrawRequest();
            }
        });
        var cancelButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnCancelDraw]
        });
        
        var btnFinishDraw = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnFinishDraw,
            //disabled : true,
            scale : 'medium',
            //iconCls : 'myplaces_draw_cancel',
            handler : function() {
                me.mainPanel.sendStopDrawRequest(true);
            }
        });
        config.uiItems.btnFinishDraw = btnFinishDraw;
        
        var finishButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnFinishDraw]
        });
        
        config.items = [drawHelp, finishButtonsPanel, cancelButtonsPanel];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGrid', {
    extend : 'Ext.grid.Panel',
    layout : 'fit',
    category : null,
    service : null,
    places : null,
    placesHandler : null,
    module : null,
    

    /**
     * Initialize the component
     */
    initComponent : function() {

		// define a common myplace grid model
        if(!Ext.ClassManager.get('MyPlaceGridModel')) {
            var modelFields = ['id', 'name', 'desc', 'type', 'createDate', 'updateDate'];

            Ext.define('MyPlaceGridModel', {
                extend : 'Ext.data.Model',
                fields : modelFields
            });
        }
        // create config object
        var config = {};
        
        var myPlacesStore = Ext.create('Ext.data.Store', {
            model : 'MyPlaceGridModel'
        });
        config.store = myPlacesStore;
        
        // set the panel title
        config.title = this.category.get('name');

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
        
        if(this.places) {
        	this.populateGrid(this.places);
        }
    },
    
    /**
     * @method _formatDate
     * Internal methdo to parse the given date and formats it for the grid
     * @param dateStr string date as returned from geoserver 
     */
    _formatDate : function(dateStr) {
		var dateArray = this.service.parseDate(dateStr);
		
		var time = '';
		if(dateArray.length == 0) {
    		// return empty if no date
    		return '';
    	}
    	else if(dateArray.length > 1) {
    		time = dateArray[1];
    	} 
    	
		return dateArray[0] + ' ' + time;
    },
    
    updateGrid : function(pCategory, myPlacesList) {
        var me = this;
        this.category = pCategory;
        this.setTitle(pCategory.get('name'));
        this.populateGrid(myPlacesList);
	},
    populateGrid : function(myPlacesList) {
        var me = this;
    	    	
    	// populate it with
        var gridModelList = [];
        for(var i = 0; i < myPlacesList.length; ++i) {
        	var type = me.module.getDrawModeFromGeometry(myPlacesList[i].get('geometry'));
            var gridModel = Ext.create('MyPlaceGridModel', {
                id : myPlacesList[i].get('id'),
                name : myPlacesList[i].get('name'),
                description : myPlacesList[i].get('description'),
            	linkText : '<a href="#" onClick="return false;">' + me.localizationSet.grid.linkValue + '</a>',
                createDate : me._formatDate(myPlacesList[i].get('createDate')),
                updateDate : me._formatDate(myPlacesList[i].get('updateDate')),
                type : me.localizationSet.grid.type[type]
            });
            gridModelList.push(gridModel);
        }

        this.getStore().loadData(gridModelList);
    },
    /**
     * @method selectPlace
     * Selects the place in grid
     * @param myPlace place to select 
     */
    getCategory : function() {
    	return this.category;
    },
    /**
     * @method selectPlace
     * Selects the place in grid
     * @param myPlace place to select 
     */
    selectPlace : function(myPlace) {
    	
	    if(myPlace) {
        	// found matching place, now convert it to grid model for selection
	    	var modelToSelect = null;
		    this.getStore().findBy(function(record, id) {
		    	var featureId = record.get('id');
		    	if(featureId == myPlace.get('id')) {
		    		modelToSelect = record;
		    	} 
		    });
		    if(modelToSelect) {
    			this.getSelectionModel().select([modelToSelect]);
    			this._placeSelected(modelToSelect, false);
		    }
	    }
    },
    /**
     * @method placeSelected
     * Internal method that notifies the rest of the module that a place has been selected
     * @param myGridPlace model used by this grid
     * @param wasDblClicked true if double clicked
     */
    _placeSelected : function(myGridPlace, wasDblClicked) {
    	var myPlace = this.service.findMyPlace(myGridPlace.get('id'));
    	this.placesHandler.placeSelected(myPlace, wasDblClicked);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var gridColumns = [{
            header : this.localizationSet.grid.placeName,
            dataIndex : 'name'
        }, {
            header : this.localizationSet.grid.placeDesc,
            flex : 1,
            dataIndex : 'description'
        }, {
            header : this.localizationSet.grid.type.label,
            dataIndex : 'type'
        },{
            header : this.localizationSet.grid.linkHeader,
            width: 120,
            dataIndex : 'linkText'
        }, {
            header : this.localizationSet.grid.createDate,
            width: 120,
            dataIndex : 'createDate'
        }, {
            header : this.localizationSet.grid.updateDate,
            width: 120,
            dataIndex : 'updateDate'
        }];

        
        config.listeners = {
		        itemdblclick: function(dv, record, item, index, e) {            
			    	me._placeSelected(record, true);
		        },
			    itemclick: function(dv, record, item, index, e) {
			    	me._placeSelected(record, false);
			    },
			    cellClick: function (grid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners){
			    	me._cellClicked(grid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners);
			    }
			};
        config.columns = gridColumns;
    },
    
    
    
    
    _cellClicked : function(pGrid, cellEl, colIndex, record, rowEl, rowIndex, event,listeners) {
    	// need to get the column name from grid
    	// model has initially same field order, but user might have changed column order in ui
    	var key = pGrid.getGridColumns()[colIndex].dataIndex;
    	if(key === 'linkText') {
    		var myPlace = this.service.findMyPlace(record.get('id'));
    		this.placesHandler.moveMapTo(myPlace);
    	}
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGridPanel', {
    extend : 'Ext.tab.Panel',
    layout : 'fit',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        
        config.service = this.oskariConfig.service;
        
        // set the panel title
        config.title = this.oskariConfig.localizationSet.grid.title;

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
        
		this.customTooltip = Ext.create('Ext.tip.ToolTip', {
		    autoHide: true
		});
    },
    /**
     * @method placeSelected
     * Internal method that notifies the rest of the module that a place has been selected
     * @param myPlace model that was selected
     * @param wasDblClicked true if double clicked
     */
    placeSelected : function(myPlace, wasDblClicked) {
    	
        var event = this.oskariConfig.sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')(myPlace, wasDblClicked);
        this.oskariConfig.sandbox.notifyAll(event);
        
    },
    /**
     * @method moveMapTo
     * @param myPlace model to show in map
     */
    moveMapTo : function(myPlace) {
        // center map on selected place
    	var center = myPlace.get('geometry').getCentroid();
    	var mapmoveRequest = this.oskariConfig.sandbox.getRequestBuilder('MapMoveRequest')
                    	(center.x, center.y, myPlace.get('geometry').getBounds(), false); 
        this.oskariConfig.sandbox.request(this.oskariConfig.module.getName(), mapmoveRequest);
    },
    
    /**
     * @method showCategory
     * Changes tab to show category
     */
    showCategory : function(categoryId) {
    	if(!categoryId) {
	    	this.setActiveTab(0);
	    	return this.getActiveTab();
    	}
    	else {
	    	var grid = this.child('#myplaceCat_' + categoryId);
	    	this.setActiveTab(grid.tab);
			grid.show();
	    	return grid;
    	}
    },
    removeCategory : function(categoryId) {
    	var grid = this.child('#myplaceCat_' + categoryId);
    	if(grid) {
	    	this.remove(grid.tab);
	    	grid.destroy();
	    	grid = null;
    	}
    },
    addOrUpdateCategory : function(category) {
    	var me = this;
    	var categoryId = category.get('id');
    	var grid = this.child('#myplaceCat_' + categoryId);
        var myPlacesList = this.service.getPlacesInCategory(categoryId);
    	if(grid) {
    		grid.updateGrid(category, myPlacesList);
    	}
    	else {
	        var tab = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGrid', {
	        	category : category,
	    		itemId: 'myplaceCat_' + categoryId,
	        	service : me.service,
	        	places : myPlacesList,
	        	localizationSet : me.oskariConfig.localizationSet,
	        	placesHandler : me,
	        	module : me.oskariConfig.module
	        });
	        this.add(tab);
    	}
    },
    getSelectedCategory : function() {
    	var selectedTab = this.getActiveTab(); 
    	if(selectedTab) {
    		return selectedTab.getCategory();
    	}
    	return null;
    },
    
    /**
     * @method handleMapClick
     * Tries to map grid items to a click event sent from map
     * @param event from click 
     */
    handleMapClick : function(event) {
    	var zoom = this.oskariConfig.sandbox.getMap().getZoom();
        var places = this.service.findMyPlaceByLonLat(event.getLonLat(), zoom);
        if(places.length > 0) {
        	var grid = this.showCategory(places[0].get('categoryID'));
        	grid.selectPlace(places[0]);
        }
    },
    
    /**
     * @method handleHover
     * Tries to map grid items to a hover event sent from map
     * TODO: maybe modify the common MouseHoverEvent or find another way to show tooltip at mouse location?
     * @param event from hover 
     */
    handleHover : function(event) {
    	var zoom = this.oskariConfig.sandbox.getMap().getZoom();
        var places = this.service.findMyPlaceByLonLat(event.getLonLat(), zoom);
        
        // create the tooltip text
        var str = '';
        for(var i = 0; i < places.length; ++i) {
    		if(str) {
    			str = str + '<hr/>';
    		}
    		// create the html for tooltip
    		// add any places that are under the mouse (might be more than one)
    		str = str + '<b>' + places[i].get('name') + '</b>';
    		var desc = places[i].get('description');
    		if(desc && desc.trim().length > 0) {
				str = str + '<br/>' + desc;
    		}
        }
        // show popup if anything to show
        if(str) {
			this.customTooltip.update(str);
			// need to show before setting position
			this.customTooltip.show();
			//this.customTooltip.alignTo(cellEl);
			this.customTooltip.setPagePosition(event.getHoverEvent().pageX, event.getHoverEvent().pageY);
        }
        else {
			this.customTooltip.hide();
        }
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesMainPanel', {
    extend : 'Ext.panel.Panel',
    layout : 'fit',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};
        config.category = null;

        // set the panel title
        config.title = this.oskariConfig.localizationSet.title;

        config.module = this.oskariConfig.module;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    
    /**
     * @method startNewDrawing
     * Resets currently selected place and sends a draw request to plugin with given config
     * @param config params for StartDrawRequest
     */
    startNewDrawing : function(config) {
        // notify components to reset any saved "selected place" data
        var event = this.oskariConfig.sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this.oskariConfig.sandbox.notifyAll(event);

        // notify plugin to start drawing new geometry
        this.sendDrawRequest(config);
    },
    /**
     * @method startNewDrawing
     * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
     * @param config params for StartDrawRequest
     */
    sendDrawRequest : function(config) {
        var me = this;
        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.StartDrawingRequest')(config);

        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);

        // show only relevant tools
        this.module.setDisableMapEvents(true);
        me.uiItems.basicControls.hide();
        if(!config.geometry) {
        	// show only when not editing?
	        me.uiItems.drawControls.setDrawMode(config.drawMode, false);
	        me.uiItems.drawControls.show();
        }

        // add my places maplayer to selected layers
        me.oskariConfig.module.addLayerToMap();
        /* 
        // set map control to selection tool (so we dont zoom while drawing etc)
        var req = me.oskariConfig.sandbox.getRequestBuilder('ToolSelectionRequest')('map_control_navigate_tool');
        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), req);
        */
    },
    /**
     * @method sendStopDrawRequest
     * Sends a StopDrawingRequest. 
     * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
     * @param propagateEvent boolean param for StopDrawingRequest
     */
    sendStopDrawRequest : function(propagateEvent) {
        var me = this;
        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.StopDrawingRequest')(propagateEvent);

        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);

		// true if pressed finish drawing button
        if(propagateEvent !== true) {
            this.module.setDisableMapEvents(false);

            // show only relevant tools
            me.uiItems.basicControls.show();
            me.uiItems.drawControls.hide();
        }
    },
    /**
     * @method placeSelected
     * Changes the panel controls to match the application state (new/edit)
     * @param myPlace selected place or null if nothing selected
     */
    placeSelected : function(myPlace) {
        var me = this;
        me.uiItems.drawControls.hide();
        if(myPlace) {
            me.uiItems.basicControls.hide();
            me.uiItems.placeSelectedControls.show();
            me.uiItems.placeSelectedControls.placeSelected(myPlace);
        } else {
            me.uiItems.placeSelectedControls.hide();
            me.uiItems.basicControls.show();
        }
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var basicControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesBasicControls', {
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            }
        });
        config.uiItems.basicControls = basicControls;

        var drawControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesDrawControls', {
            oskariConfig : {
                module : me.oskariConfig.module,
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            },
            hidden : true
        });
        config.uiItems.drawControls = drawControls;

        var placeSelectedControls = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesPlaceSelectedControls', {
            oskariConfig : {
                module : me.oskariConfig.module,
                localizationSet : me.oskariConfig.localizationSet,
                mainPanel : me
            },
            hidden : true
        });
        config.uiItems.placeSelectedControls = placeSelectedControls;

        var mainPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            autoScroll : true,
            layout : 'anchor',
            bodyPadding : 10,
            items : [basicControls, drawControls, placeSelectedControls]
        });

        config.uiItems.mainPanel = mainPanel;
        config.items = [mainPanel];
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
    extend : 'Ext.window.Window',
    height : 400,
    width : 600,
    layout : 'fit',
    closable : false,
	id: 'myplaces-popup',
//    hideMode : 'offsets',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        config.uiItems.panels = {};
        config.wizard = {};
        config.service = this.oskariConfig.service;

        config.title = this.oskariConfig.localizationSet.wizard.title;
        var categoryStore = Ext.create('Ext.data.Store', {
            model : 'Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory',
            data : config.service.getAllCategories()
        });
        config.categoryStore = categoryStore;

        // place info stored here while category panel shown because of wysiwyg bug
        config.place = {};

        // build panel confs
        this._buildItems(config);

        // init to first step
        config.wizard.currentView = config.uiItems.panels.myPlacePanel;

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        var categoryPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.CategoryPanel', {
        	id: 'myplace-popup-categorypanel',
            categoryStore : config.categoryStore,
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                defaults: me.oskariConfig.module.defaults
            },
            finishedAction : function(categoryModel) {
                me._commitCategory(categoryModel);
            },
            deleteCategoryAction : function(categoryModel) {
                me._confirmDeleteCategory(categoryModel);
            },
            cancelAction : function() {
                me._showMyPlaceForm();
            }
        });
        config.uiItems.panels.categoryPanel = categoryPanel;
        
        var myPlacePanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacePanel', {
            categoryStore : config.categoryStore,
            //hideMode : 'offsets',
            oskariConfig : {
                localizationSet : me.oskariConfig.localizationSet,
                service : me.oskariConfig.service                
            },
            finishedAction : function(myPlaceModel, oldCategoryId) {
                me._wizardFinished(myPlaceModel, oldCategoryId);
            },
            categoryOperation : function(params) {
                me._showCategoryForm(params);
            }
        });
        config.uiItems.panels.myPlacePanel = myPlacePanel;

        // initially show myplace form
        config.items = [myPlacePanel];
    },
    /**
     * @method _showCategoryForm
     * Internal method to set category form as current view and show it with drawPanels()
     */
    _showCategoryForm : function(params) {
        var me = this;
        // get the myplace values so we can repopulate after category edit (WYSIWYG BUG))
        me.uiItems.panels.myPlacePanel.saveValues();
        me.uiItems.panels.categoryPanel.setParams(params);

        me.wizard.currentView = me.uiItems.panels.categoryPanel;
        me._drawPanels();
    },
    /**
     * @method _showMyPlaceForm
     * Internal method to set myplaces form as current view and show it with drawPanels()
     */
    _showMyPlaceForm : function() {
        var me = this;
        me.wizard.currentView = me.uiItems.panels.myPlacePanel;
        // form fields need to be recreated because of WYSIWYG bug
        me.uiItems.panels.myPlacePanel.recreatePanel();
        me._drawPanels();
    },
    /**
     * @method _confirmDeleteCategory
     * Internal method confirm category delete
     */
    _confirmDeleteCategory : function(categoryModel) {
    
        var me = this;
        var defaultCategory = me.service.getDefaultCategory();
        var places = me.service.getPlacesInCategory(categoryModel.get('id'));
                
        var buttons = [
        	{
        		text: me.oskariConfig.localizationSet.confirm.btnCancel
        	},
        	'break'
        ];
        var deleteBtnText = me.oskariConfig.localizationSet.confirm.btnDelete;
        var message = me.oskariConfig.module.formatMessage(
        	me.oskariConfig.localizationSet.confirm.deleteConfirm, 
        	[
        		categoryModel.get('name'),
        		places.length
        	]);
        if(places.length > 0) {
        	message = message + '<br/><br/>' +
	        	me.oskariConfig.module.formatMessage(
	        		me.oskariConfig.localizationSet.confirm.deleteConfirmMoveText, 
	        	[
	        		defaultCategory.get('name')
	        	]);
	        buttons.push({
	        		text: me.oskariConfig.localizationSet.confirm.btnMove, 
	        		handler: function () {
	        			 
                		// move the places in the category to default category
		                me._deleteCategory(categoryModel, true); 
	        		}
	        });
	        deleteBtnText = me.oskariConfig.localizationSet.confirm.btnDeleteAll; 
        }
        buttons.push({
    		text: deleteBtnText, 
    		handler: function () {
            	// delete category and each place in it
                me._deleteCategory(categoryModel, false);
			}
    	});
        
        Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.ConfirmWindow', {
        	title: me.oskariConfig.localizationSet.deleteConfirmTitle,
        	message: message,
        	dialogButtons: buttons
        }).show();
    },
    /**
     * @method _deleteCategory
     * Internal method start actual category delete after confirm
     */
    _deleteCategory : function(categoryModel, movePlaces) {
        var me = this;
        var catId = categoryModel.get('id');
        // add load mask
        this.setLoading(me.oskariConfig.localizationSet.deletemask);
        // wrap callback to get it into the scope we want
        var callBackWrapper = function(success) {
            me._deleteCategoryCallback(success, movePlaces, catId);
        };
		me.service.deleteCategory(catId, movePlaces, callBackWrapper);
    },
    /**
     * @method _deleteCategoryCallback
     * Internal method to handle server response for category delete
     */
    _deleteCategoryCallback : function(success, movePlaces, categoryId) {
    	
        var me = this;
    	// remove load mask
    	this.setLoading(false);
        if(success) {
	        this.refreshCategories();
        	if(movePlaces) {
	        	this._showMyPlaceForm();
        	}
        	else {
        		// place deleceted also, shut down edit dialog and any selection
        		me.oskariConfig.module.cleanupAfterMyPlaceOperation();
        	}
            if(movePlaces) {
            	// places moved to default category -> update it
    			var defCat = me.service.getDefaultCategory();
    			var layerId = this.oskariConfig.module.getMapLayerId(defCat.get('id'));
		        var request = this.oskariConfig.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
		        this.oskariConfig.sandbox.request(this.oskariConfig.module.getName(), request);
            }
        }
        else {
        	// TODO: error handling
        	alert(this.oskariConfig.localizationSet.errorDelete);
        	// console.dir(categoryModel);
        }
    },
    /**
     * @method refreshCategories
     * Refresh the category list content from service
     */
    refreshCategories : function() {
        var me = this;
        me.uiItems.panels.myPlacePanel.setCategories(me.service.getAllCategories());
        me.uiItems.panels.myPlacePanel.setSelectedCategory();
    },
    
    /**
     * @method _commitCategory
     * Internal method - request save for category data
     */
    _commitCategory : function(categoryModel) {
        var me = this;

        // add load mask
        this.setLoading(me.oskariConfig.localizationSet.savemask);
        
        // cleanup the model
        // ext uses the grouping fields value as id in html so it breaks if it has quotes
        // replace " -> '
        var re = /\"/g;
        var name = categoryModel.get('name');
        categoryModel.set('name', name.replace(re, '\''));
        
        // wrap callback to get it into the scope we want
        var callBackWrapper = function(success, pCategoryModel, isNew) {
            me._commitCategoryCallback(success, pCategoryModel, isNew);
        };
        this.service.saveCategory(categoryModel, callBackWrapper);
    },

    /**
     * @method _commitCategoryCallback
     * Internal method to handle server response for category save
     */
    _commitCategoryCallback : function(success, categoryModel, isNew) {
        var me = this;
    	// remove load mask
    	this.setLoading(false);
        if(success) {
	        if(isNew) {
	            // refresh dropdown when adding new category
	            me.uiItems.panels.myPlacePanel.setCategories(me.service.getAllCategories());
	            // id populated on save
	        	//me.uiItems.panels.myPlacePanel.setSelectedCategory(categoryModel.get('id'));
	        	
	        	// request add for new map layer 
	        	me.oskariConfig.module.addLayerToMap(categoryModel.get('id'));
	        }
	        else {
	        	// request update on existing map layer 
		        var request = me.oskariConfig.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(me.oskariConfig.module.getMapLayerId(categoryModel.get('id')), true);
		        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);
	        }
            // id populated on save
        	me.uiItems.panels.myPlacePanel.setSelectedCategory(categoryModel.get('id'));
	        me._showMyPlaceForm();
        }
        else {
        	// TODO: error handling
        	alert(this.oskariConfig.localizationSet.errorSave);
        	// console.dir(categoryModel);
        }
    },
    /**
     * @method setPlace
     * Sets a backing my place model for the form
     * @param myPlaceModel model to populate the form with 
     */
    setPlace : function(myPlaceModel) {
        this.uiItems.panels.myPlacePanel.setPlace(myPlaceModel);
        this.uiItems.panels.myPlacePanel.recreatePanel();
    },
    /**
     * @method setSelectedCategory
     * Sets a predefined category on the my place form
     * @param categoryId id of category to select 
     */
    setSelectedCategory : function(categoryId) {
        this.uiItems.panels.myPlacePanel.setSelectedCategory(categoryId);
    },

    /**
     * @method _wizardFinished
     * Internal method to handle wizard finished
     */
    _wizardFinished : function(myPlaceModel, oldCategoryId) {
        var me = this;
        // if model undefined -> user canceled
        if(myPlaceModel) {
        	// get current geometry from plugin and save
        	var callbackWrapper = function(pGeometry) {
            	myPlaceModel.set('geometry', pGeometry);
        		me.oskariConfig.module.myPlaceFinished(myPlaceModel, oldCategoryId);
        	};
        	
	        var request = me.oskariConfig.sandbox.getRequestBuilder('MyPlaces.GetGeometryRequest')(callbackWrapper);
	        me.oskariConfig.sandbox.request(me.oskariConfig.module.getName(), request);
        }
        else {
        	this.oskariConfig.module.myPlaceFinished(myPlaceModel);
        }
    },
    /**
     * @method _drawPanels
     * Internal method to draw the current view
     */
    _drawPanels : function() {
        var me = this;

        me.removeAll(false);
        // false to not destroy
        // for some reason removeall doesn't work too well
        // so we need to hide the panels also, hence the looping
        for(var panelIndex in me.uiItems.panels ) {
            me.uiItems.panels[panelIndex].hide();
        }

        // get the panel for current step, add it and show it
        me.add(me.wizard.currentView);
        me.wizard.currentView.show();
    }
});
Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesPlaceSelectedControls', {
    extend : 'Ext.panel.Panel',
    layout : 'anchor',
    border : false,
    frame : false,
    title : 'jee',
    closable : true,
    closeAction : 'hide',

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};

        config.module = this.oskariConfig.module;
        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

		this.on("beforeclose", function() {
	    	this.module.cleanupAfterMyPlaceOperation();
		});
		
        // call parent
        this.callParent(arguments);
    },
    
    /**
     * @method placeSelected
     * Modifies the ui texts and functionality to match the currently selected place
     * @param myPlace currently selected place
     */
    placeSelected : function(myPlace) {
        var me = this;
        if(myPlace) {
            // send request to activate edit controls on map
	        var request = {};
        	// clone the geometry so openlayers doesn't modify the original 
	        request.geometry = myPlace.get('geometry').clone();
            var mode = this.oskariConfig.module.getDrawModeFromGeometry(request.geometry);
        	request.drawMode = this.oskariConfig.module.getDrawModeFromGeometry(request.geometry);
	        this.mainPanel.sendDrawRequest(request);
	        
	        // update ui texts
	    	this.setTitle(myPlace.get('name')); 
	        this.uiItems.btnSave.setText(this.oskariConfig.localizationSet.mainpanel.editSaveBtn[request.drawMode]);
	        this.uiItems.editHelp.update(this.oskariConfig.localizationSet.mainpanel.editHelp[request.drawMode]);

			// update tooltips to show which place we are working with?
            this.uiItems.btnEdit.setTooltip(this.oskariConfig.localizationSet.mainpanel.btnEdit + ': ' + myPlace.get('name'));
            this.uiItems.btnDelete.selectedPlace = myPlace;
            this.uiItems.btnDelete.setTooltip(this.oskariConfig.localizationSet.mainpanel.btnDelete + ': ' + myPlace.get('name'));
        } else {
            this.uiItems.btnDelete.selectedPlace = null;
        }
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        
        var editHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.editHelp.point
        });
        config.uiItems.editHelp = editHelp;
        
        var btnSave = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.saveBtn,
            tooltip: this.oskariConfig.localizationSet.saveBtn,
            scale : 'medium',
            handler : function() {
        		me.oskariConfig.module.saveMyPlaceGeometry();
            }
        });
        var saveButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnSave]
        });
        config.uiItems.btnSave = btnSave;
        
        var editDescHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.editHelp.desc
        });
        
        var btnEdit = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnEdit,
            tooltip: this.oskariConfig.localizationSet.mainpanel.btnEdit,
            scale : 'medium',
            iconCls : 'myplaces_edit_place',
            handler : function() {
                config.module.startWizard();
            }
        });
        var editButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnEdit]
        });
        config.uiItems.btnEdit = btnEdit;

        var deleteHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.deleteHelp
        });
        var btnDelete = Ext.create('Ext.Button', {
            scale : 'medium',
            tooltip: this.oskariConfig.localizationSet.mainpanel.btnDelete,
            iconCls : 'myplaces_delete_place',
            text : this.oskariConfig.localizationSet.mainpanel.btnDelete,
            selectedPlace: null,
            handler : function() {
            	
		        Ext.Msg.show({
		            title : me.oskariConfig.localizationSet.deleteConfirmTitle,
		            modal : true,
		            msg : me.oskariConfig.localizationSet.mainpanel.deleteConfirm + this.selectedPlace.get('name'),
		            buttons : Ext.Msg.OKCANCEL,
		            icon : Ext.MessageBox.QUESTION,
		            fn : function(btn) {
		                if(btn === 'ok') {
                			me.oskariConfig.module.deleteMyPlace();
		                }
		            }
		        });
            }
        });
        
        var deleteButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnDelete]
        });
        config.uiItems.btnDelete = btnDelete;
        
        config.items = [editHelp, saveButtonsPanel, editDescHelp, editButtonsPanel, deleteHelp, deleteButtonsPanel];
    }
});
/**
 * @class Oskari.mapframework.bundle.MyPlacesBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.MyPlacesBundleInstance", function(b) {
	this.name = 'myplaces';
	this.mediator = null;
	this.sandbox = null;

	this.impl = null;

	/**
	 * These should be SET BY Manifest end
	 */

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		/**
		 * These should be SET BY Manifest begin
		 */
		this.libs = {
			ext : Oskari.$("Ext")
		};
		this.facade = Oskari.$('UI.facade');

		this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.myplaces.MyPlacesModule', this.conf);

		/**
		 *
		 * register to framework and eventHandlers
		 */
		var def = this.facade.appendExtensionModule(this.impl, this.name, {}, this, 'E', {
			'fi' : {
				title : 'Omat Paikat'
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : 'My Places'
			}

		});
		this.def = def;

		this.impl.start(this.facade.getSandbox());

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
		this.def = null;
		this.impl = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.MyPlacesBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
