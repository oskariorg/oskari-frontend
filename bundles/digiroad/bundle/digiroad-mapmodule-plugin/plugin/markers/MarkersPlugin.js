/**
 * 
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.mapmodule.MarkersPlugin',
                function() {
                	this.mapModule = null;
                	this.pluginName = null;
                	this._sandbox = null;
                	this._map = null;
                },

                {
                	__name: 'MarkersPlugin',
                	
                    getName : function() {
                        return this.pluginName;
                    },
                    
                    getMapModule : function(){
                    	return this.mapModule;
                    },
                    setMapModule : function(mapModule) {
                    	this.mapModule = mapModule;
                    	this.pluginName = mapModule.getName()+this.__name;
                    },

                    init: function(sandbox) {
                    },

                    register : function() {
                        
                    },
                    unregister : function() {
                        
                    },

                    startPlugin : function(sandbox) {
                    	this._sandbox = sandbox;
                        this._map = this.getMapModule().getMap();
                        
                        this.createMapMarkersLayer();
                        
                        sandbox.register(this);
                       	for( p in this.eventHandlers ) {
   							sandbox.registerForEventByName(this,p);
   						}
                    },
                    stopPlugin : function(sandbox) {
                      
                        for( p in this.eventHandlers ) {
                        	sandbox.unregisterFromEventByName(this,p);
                        }
                    	
                        sandbox.unregister(this);
                    	this._map = null;
                    	this._sandbox = null;
                    },

                    /* @method start 
                     * called from sandbox
                     */
                    start: function(sandbox) {
                    },
                    /**
                     * @method stop
                     * called from sandbox
                     * 
                     */
                    stop: function(sandbox) {
                    },
                    
                    eventHandlers : {'AfterHideMapMarkerEvent' : function(event) {
						this.afterHideMapMarkerEvent(event);
					}},

                    onEvent : function(event) {
                        return this.eventHandlers[event.getName()].apply(this,
                                [ event ]);
                    },
                    
					/**
					 * 
					 */
					createMapMarkersLayer: function() {
						var sandbox = this._sandbox;
						var layerMarkers = new OpenLayers.Layer.Markers(
						"Markers");
						this._map.addLayer(layerMarkers);

					},

					/***********************************************************
					 * Handle HideMapMarkerEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					afterHideMapMarkerEvent : function(event) {
						var markerLayer = this._map.getLayersByName("Markers");
						if (markerLayer != null && markerLayer[0] != null) {
							markerLayer[0].setVisibility(false);
						}
					}


                },{
					'protocol' : [ "Oskari.mapframework.module.Module",
					               "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
				});
