/**
 * @class Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin', 

/** 
 * @method create called automatically on construction
 * @static
 */
function(config) {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this._supportedFormats = {};
	this.service = null;
    this.config = config;
}, {
	__name : 'WfsLayerPlugin',

	getName : function() {
		return this.pluginName;
	},
	getMapModule : function() {
		return this.mapModule;
	},
	setMapModule : function(mapModule) {
		this.mapModule = mapModule;
		this.pluginName = mapModule.getName() + this.__name;
	},
	init : function() {
        var sandboxName = ( this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        
        // register domain model
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('wfslayer', 'Oskari.mapframework.domain.WfsLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('wfslayer', layerModelBuilder);
        }
	},
	register : function() {
		this.getMapModule().setLayerPlugin('wfslayer', this);
	},
	unregister : function() {
		this.getMapModule().setLayerPlugin('wfslayer', null);
	},
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		this._map = this.getMapModule().getMap();
        
        this.createTilesGrid();
        this.service = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs.service.WfsTileService', this);

		sandbox.register(this);
		for (p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
	},
	stopPlugin : function(sandbox) {

		for (p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);

		this._map = null;
		this._sandbox = null;
	},
	/*
	 * @method start called from sandbox
	 */
	start : function(sandbox) {
	},
	/**
	 * @method stop called from sandbox
	 * 
	 */
	stop : function(sandbox) {
	},
	eventHandlers : {
		'AfterMapMoveEvent' : function(event) {
			var creator = this._sandbox.getObjectCreator(event);
			this._sandbox
					.printDebug("[WfsLayerPlugin] got AfterMapMoveEvent from "
							+ creator);
			this.afterAfterMapMoveEvent();
		},
		'AfterMapLayerAddEvent' : function(event) {
			this.afterMapLayerAddEvent(event);
		},
		'AfterMapLayerRemoveEvent' : function(event) {
            var layer = event.getMapLayer();
            if (layer.isLayerOfType('WFS')) {
                this.afterMapLayerRemoveEvent(event);
            }
		},
		/*'AfterWfsGetFeaturesPngImageForMapEvent' : function(event) {
			this.afterWfsGetFeaturesPngImageForMapEvent(event);
		},*/
		'AfterHighlightWFSFeatureRowEvent' : function(event) {
			this.handleAfterHighlightWFSFeatureRowEvent(event);
		},
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			this.afterChangeMapLayerOpacityEvent(event);
		},
		'AfterDimMapLayerEvent' : function(event) {
			this.handleAfterDimMapLayerEvent(event);
		},
        'MapClickedEvent' : function(evt) {
            
            // don't process while moving
            if(this._sandbox.getMap().isMoving()) {
                return;
            }
            var lonlat = evt.getLonLat();
            var mouseX = evt.getMouseX();
            var mouseY = evt.getMouseY();
            this._getFeatureIds(lonlat, mouseX, mouseY);
        },
        'WFSFeaturesSelectedEvent' : function(event) {
            this.service.scheduleWFSMapHighlightUpdate(event);
        } 
	},

	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [ event ]);
	},
	/**
	 * 
	 */
	preselectLayers : function(layers) {

		var sandbox = this._sandbox;

		for ( var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var layerId = layer.getId();

			if (!layer.isLayerOfType('WFS')) {
				continue;
			}

			sandbox.printDebug("[WfsLayerPlugin] preselecting " + layerId);
			this.addMapLayerToMap(layer, true, layer.isBaseLayer());
		}
	},

	afterChangeMapLayerOpacityEvent : function(event) {
		var layer = event.getMapLayer();
		
		if (!layer.isLayerOfType('WFS')) {
			return;
		}
		//var wfsReqExp = new RegExp('wfs_layer_' + layer.getId() + '_*', 'i');
		var layers = this.getOLMapLayers(layer); //_map.getLayersByName(wfsReqExp);
		for ( var i = 0; i < layers.length; i++) {
			layers[i].setOpacity(layer.getOpacity() / 100);
		
		}
	},
	
	/***************************************************************************
	 * Handle AfterDimMapLayerEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	handleAfterDimMapLayerEvent : function(event) {
		var layer = event.getMapLayer();

		if (layer.isLayerOfType('WFS')) {
			/** remove higlighed wfs layer from map */
			var wfsReqExp = new RegExp('wfs_layer_' + layer
					.getId() + '_HIGHLIGHTED_FEATURE*', 'i');
			var layers = this._map.getLayersByName(wfsReqExp);
			for ( var i = 0; i < layers.length; i++) {
				layers[i].destroy();
			}
		}
	},

	/***************************************************************************
	 * Handle AfterMapLaeyrAddEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	afterMapLayerAddEvent : function(event) {
		this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
        this.afterAfterMapMoveEvent();
	},
	/**
	 * primitive for adding layer to this map
	 */
	addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
	},
	/***************************************************************************
	 * Handle AfterMapLayerRemoveEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	afterMapLayerRemoveEvent : function(event) {
		var layer = event.getMapLayer();
        this.service.removeWFsLayerRequests(layer);
		this.removeMapLayerFromMap(layer);
	},
	removeMapLayerFromMap : function(layer) {

		var removeLayers = this.getOLMapLayers(layer);
		for ( var i = 0; i < removeLayers.length; i++) {
			removeLayers[i].destroy();
		}
	},
	getOLMapLayers : function(layer) {

		if (layer && !layer.isLayerOfType('WFS')) {
			return;
		}
		var layerPart = '';
		if(layer) {
			layerPart = '_' + layer.getId();
		}

		var wfsReqExp = new RegExp('wfs_layer' + layerPart + '_*', 'i');
		return this._map.getLayersByName(wfsReqExp);
	},
	
	/**
	 * @method drawImageTile
	 * 
	 * Adds a tile to the Openlayers map
	 * 
     * @param {Oskari.mapframework.domain.WfsLayer} layer
     *           WFS layer that we want to update
     * @param {String} imageUrl
     *           url that will be used to download the tile image
     * @param {OpenLayers.Bounds} imageBbox
     *           bounds for the tile
     * @param {String} layerPostFix
     *           postfix so we can identify the tile as highlight/normal
     * @param {Boolean} keepPrevious
     *           true to not delete existing tile
	 */
	drawImageTile : function(layer, imageUrl, imageBbox, layerPostFix, keepPrevious) {
		var layerName = "wfs_layer_" + layer.getId() + "_" + layerPostFix;
		var boundsObj = null;
		if (imageBbox.bounds && imageBbox.bounds.left && imageBbox.bounds.right
				&& imageBbox.bounds.top && imageBbox.bounds.bottom) {
			boundsObj = new OpenLayers.Bounds(imageBbox.bounds.left,
					imageBbox.bounds.bottom, imageBbox.bounds.right,
					imageBbox.bounds.top);
		} else if (imageBbox.left && imageBbox.right && imageBbox.top
				&& imageBbox.bottom) {
			boundsObj = new OpenLayers.Bounds(imageBbox.left, imageBbox.bottom,
					imageBbox.right, imageBbox.top);
		}

		/** Safety checks */
		if (!(imageUrl && layer && boundsObj)) {
			// alert("no bounds");
			// console.dir(event);
			return;
		}

		var layerScales = this.mapModule.calculateLayerScales(layer
				.getMaxScale(), layer.getMinScale());

		var layerIndex = null;

		/** remove old wfs layers from map */
		if(!keepPrevious) {
            // TODO: make remove layer methods better so we can use them here 
            var removeLayers = this._map.getLayersByName(layerName);
            for ( var i = 0; i < removeLayers.length; i++) {
                layerIndex = this._map.getLayerIndex(removeLayers[i]);
                removeLayers[i].destroy();
            }
		}


		var ols = new OpenLayers.Size(256, 256);

		var wfsMapImageLayer = new OpenLayers.Layer.Image(layerName,
				imageUrl, boundsObj, ols, {
					scales : layerScales,
					transparent : true,
					format : "image/png",
					isBaseLayer : false,
					displayInLayerSwitcher : true,
					visibility : true,
					buffer : 0
				});

		wfsMapImageLayer.opacity = layer.getOpacity() / 100;

		this._map.addLayer(wfsMapImageLayer);
		wfsMapImageLayer.setVisibility(true);
		wfsMapImageLayer.redraw(true);

		var opLayersLength = this._map.layers.length;

		var changeLayer = this._map.getLayersByName('Markers');
		if (changeLayer.length > 0) {
			this._map.setLayerIndex(changeLayer[0], opLayersLength);
			opLayersLength--;
		}

		if (layerIndex !== null && wfsMapImageLayer !== null) {
			this._map.setLayerIndex(wfsMapImageLayer, layerIndex);
		}

		var wfsReqExp2 = new RegExp(
				'wfs_layer_' + layer.getId() + '_WFS_LAYER_IMAGE*', 'i');
		var lastWfsLayer = this._map.getLayersByName(wfsReqExp2);
		if (lastWfsLayer.length > 0) {
			var lastWfsLayerIndex = this._map
					.getLayerIndex(lastWfsLayer[lastWfsLayer.length - 1]);

			var changeLayer2 = this._map.getLayersByName(layerName);
			if (changeLayer2.length > 0) {
				this._map.setLayerIndex(changeLayer2[0], lastWfsLayerIndex);
			}
		}

	},
	/***************************************************************************
	 * Handle AfterHighlightWFSFeatureRowEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	handleAfterHighlightWFSFeatureRowEvent : function(event) {
		var selectedFeatureIds = event.getWfsFeatureIds();
    	if (selectedFeatureIds.length == 0 && !event.isKeepSelection()) {
    		var layer = event.getMapLayer();
    		this.removeHighlightOnMapLayer(layer.getId());
    	}
},
/* ******************************************************************************
 * Handle AfterRemoveHighlightMapLayerEvent
 * 
 * @param {Object}
 *            event
 */

removeHighlightOnMapLayer : function(layerId) {
    var prefix = '';
    if(layerId) {
        prefix = 'wfs_layer_' + layerId;
    }
	var wfsReqExp = new RegExp(prefix + '_HIGHLIGHTED_FEATURE*', 'i');
	var layers = this._map.getLayersByName(wfsReqExp);
	for ( var i = 0; i < layers.length; i++) {
		layers[i].destroy();
	}
},
updateWfsImages : function(creator) {

	var layers = Oskari.$().sandbox.findAllSelectedMapLayers();
	// request updates for map tiles
	for ( var i = 0; i < layers.length; i++) {
        if(layers[i].isInScale() && layers[i].isLayerOfType('WFS')) {
            this.doWfsLayerRelatedQueries(layers[i]);
        }
	}
},

    /**
     * Generates all WFS related queries
     *
     * @param {Object}
     *            mapLayer
     */
    doWfsLayerRelatedQueries : function(mapLayer) {

        if(!mapLayer.isInScale()) {
            return;
        }
        var map = this._sandbox.getMap();
        var bbox = map.getBbox();

        var mapWidth = map.getWidth();
        var mapHeight = map.getHeight();
        this.service.scheduleWFSMapLayerUpdate(mapLayer, bbox, mapWidth, mapHeight, this.getName());
        this.service.startPollers();
    },
    afterAfterMapMoveEvent : function() {
        this.tileStrategy.update();
        this._tilesLayer.redraw();
    	this.updateWfsImages(this.getName());
    	this.service.processHighlightQueue();
    },
    
    
// from tilesgridplugin
    
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
                                                
                        //sandbox.getMap().setTileQueue(tileQueue);
                        
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
    /***********************************************************
     * WFS FeatureInfo request
     *
     * @param {Object}
     *            e
     */
    _getFeatureIds : function(lonlat, mouseX, mouseY) {
        var me = this;
        var sandbox = this._sandbox;
        var allHighlightedLayers = sandbox.findAllHighlightedLayers();
        // Safety check
        // This case highlighted layer is the first one as there should not be more than one selected
        if(allHighlightedLayers.length == 0 || !allHighlightedLayers[0] || !allHighlightedLayers[0].isLayerOfType('WFS')) {
            // nothing to do, not wfs or nothing highlighted
            return;
        }
        if(allHighlightedLayers.length != 1) {
           sandbox.printDebug("Trying to highlight WFS feature but there is either too many or none selected WFS layers. Size: " + allHighlightedLayers.length);
            return;
        }

        var layer = allHighlightedLayers[0];
        // Safety check at layer is in scale
        if(!layer.isInScale()) {
            sandbox.printDebug('Trying to hightlight WFS feature from wfs layer that is not in scale!');
            return;
        }

        var map = sandbox.getMap();
        var imageBbox = this._map.getExtent();
        var parameters = "&flow_pm_wfsLayerId=" + layer.getId() + 
                         "&flow_pm_point_x="    + lonlat.lon + 
                         "&flow_pm_point_y="    + lonlat.lat + 
                         "&flow_pm_bbox_min_x=" + imageBbox.left + 
                         "&flow_pm_bbox_min_y=" + imageBbox.bottom + 
                         "&flow_pm_bbox_max_x=" + imageBbox.right + 
                         "&flow_pm_bbox_max_y=" + imageBbox.top + 
                         "&flow_pm_zoom_level=" + map.getZoom() +
                         "&flow_pm_map_width="  + map.getWidth() + 
                         "&flow_pm_map_height=" + map.getHeight() + 
                         "&srs=" + map.getSrsName() +
                         "&action_route=GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT";

        var keepCollection = sandbox.isCtrlKeyDown();
        
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
                if(x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            url : sandbox.getAjaxUrl() + parameters,
            data : parameters,
            success : function(response) {
                me._handleGetFeatureIdsResponse(response, layer, keepCollection);
            }
        });
    },
    // Send out event so components can highlight selected features
    _handleGetFeatureIdsResponse : function(response, layer, keepCollection) {
        var sandbox = this._sandbox;
        if(!response || response.error == "true") {
            sandbox.printWarn("Couldn't get feature id for selected map point.");
            return;
        }
        // TODO: check if we want to do it with eval
        var selectedFeatures = eval("(" + response.selectedFeatures + ")");
        var featureIds = [];
        if(selectedFeatures != null && selectedFeatures.id != null) {
            featureIds.push(selectedFeatures.id);
        }
        var builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
        var event = builder(featureIds, layer, keepCollection);
        sandbox.notifyAll(event);
    }
}, {
	'protocol' : [ "Oskari.mapframework.module.Module",
			"Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
