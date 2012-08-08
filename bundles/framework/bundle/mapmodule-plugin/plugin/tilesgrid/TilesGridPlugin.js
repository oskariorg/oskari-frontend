/**
 * Resolves bounding boxes for WFS layer image tiles
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.mapmodule.TilesGridPlugin',
                function() {
                	this.mapModule = null;
                	this.pluginName = null;
                	this._sandbox = null;
                	this._map = null;
                },

                {
                	__name: 'TilesGridPlugin',
                	
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
                        
                        
                        this.createTilesGrid();
                        
                        sandbox.register(this);
                        
                       	for( p in this.eventHandlers ) {
   							sandbox.registerForEventByName(this,p);
   						}
   						this.afterMapMoveEvent();
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
                    

                    
                    /**
					 * @method createTilesGrid
					 * 
					 * Creates an invisible layer to support Grid operations
					 * This manages sandbox Map's TileQueue  
					 * 
					 */
					createTilesGrid: function() {
						var me = this;
						var sandbox = me._sandbox;
						
						var tileQueue = 
						    Oskari.clazz.create("Oskari.mapframework.gridcalc.TileQueue");
						                        
						sandbox.getMap().setTileQueue(tileQueue);
						
				        var strategy = Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTilesStrategy",{
				                tileQueue: tileQueue
				        });
				        strategy.debugGridFeatures = false;
				        this.tileQueue = tileQueue;
				        this.tileStrategy = strategy;
				        
				        var styles = new OpenLayers.StyleMap({
				            "default": new OpenLayers.Style({
				                pointRadius: 3,
				                strokeColor: "red",
				                strokeWidth: 2,
				                fillColor: '#800000'
				            }),
				            "tile": new OpenLayers.Style({
				                strokeColor: "#008080",
				                strokeWidth: 5,
				                fillColor: "#ffcc66",
				                fillOpacity: 0.5
				            }),
				            "select": new OpenLayers.Style({
				                fillColor: "#66ccff",
				                strokeColor: "#3399ff"
				            })
				        });
				        
				        this._tilesLayer = new OpenLayers.Layer.Vector(
								"Tiles Layer", {
									strategies: [strategy],
									styleMap: styles,
									visibility: true
								});
				        this._map.addLayer(this._tilesLayer);
				        this._tilesLayer.setOpacity(0.3);
						
					},
					getTileQueue: function() {
						return this.tileQueue;
					},

					afterMapMoveEvent: function(event) {
						this.tileStrategy.update();
						this._tilesLayer.redraw();
					},
					
					eventHandlers : {
						'AfterMapMoveEvent' : function(event) {
			            this.afterMapMoveEvent(event);
			        	}					
						
					},

					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this, [ event ]);
					}





                },{
					'protocol' : [ "Oskari.mapframework.module.Module",
					               "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
				});
