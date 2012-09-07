/**
 * 
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.WfsLayerPlugin', function() {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this._supportedFormats = {};
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
	init : function(sandbox) {
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

		sandbox.register(this);
		for (p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
//		this.updateWfsImages(this.getName());
//		this.redrawWfsLayers();
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
			this.afterAfterMapMoveEvent(event);
		},
		'AfterMapLayerAddEvent' : function(event) {
			this.afterMapLayerAddEvent(event);
		},
		'AfterMapLayerRemoveEvent' : function(event) {
			this.afterMapLayerRemoveEvent(event);
		},
		'AfterWfsGetFeaturesPngImageForMapEvent' : function(event) {
			this.afterWfsGetFeaturesPngImageForMapEvent(event);
		},
		'AfterHighlightWFSFeatureRowEvent' : function(event) {
			this.handleAfterHighlightWFSFeatureRowEvent(event);
		},
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			this.afterChangeMapLayerOpacityEvent(event);
		},
		'AfterDimMapLayerEvent' : function(event) {
			this.handleAfterDimMapLayerEvent(event);
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
		this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(),
				event.isBasemap());
//		this.updateWfsImages(this.getName());
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

		this.removeMapLayerFromMap(layer);
	},
	removeMapLayerFromMap : function(layer) {

		if (!layer.isLayerOfType('WFS')) {
			return;
		}

		//var wfsReqExp = new RegExp('wfs_layer_' + layer.getId() + '_*', 'i');
		var removeLayers = this.getOLMapLayers(layer); //_map.getLayersByName(wfsReqExp);
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
	/***************************************************************************
	 * Handle AfterWfsGetFeaturesPngImageForMapEvent
	 * 
	 * @param {Oskari.mapframework.event.common.AfterWfsGetFeaturesPngImageForMapEvent}
	 *            event
	 */
	afterWfsGetFeaturesPngImageForMapEvent : function(event) {
		var imageUrl = event.getImageUrl();
		var imageBbox = event.getBbox();
		var layer = event.getMapLayer();
		
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
		var removeLayers = this._map.getLayersByName(event
				.getRequestedLayerName());
		for ( var i = 0; i < removeLayers.length; i++) {
			layerIndex = this._map.getLayerIndex(removeLayers[0]);
			removeLayers[0].destroy();
		}

		/** Here checks at layer is selected */
		if (this._sandbox.isLayerAlreadySelected(layer.getId())) {

			var layerName = event.getRequestedLayerName();

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

			// var mapModule = this.getMapModule();

			wfsMapImageLayer.opacity = layer.getOpacity() / 100;

			this._map.addLayer(wfsMapImageLayer);
			wfsMapImageLayer.setVisibility(true);
			wfsMapImageLayer.redraw(true);

		}

		var layers = Oskari.$().sandbox.findAllSelectedMapLayers();
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

			var changeLayer2 = this._map.getLayersByName('wfs_layer_' + layer
					.getId() + '_HIGHLIGHTED_FEATURE');
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
		// var moduleName = this.getName();
	if (selectedFeatureIds.length == 0) {
		if (!this._sandbox.isCtrlKeyDown()) {
			var layer = event.getMapLayer();
			if (layer.isLayerOfType('WFS')) {
				/** remove higlighed wfs layer from map */
				var wfsReqExp = new RegExp(
						'wfs_layer_' + layer.getId() + '_HIGHLIGHTED_FEATURE*',
						'i');
				var layers = this._map.getLayersByName(wfsReqExp);
				for ( var i = 0; i < layers.length; i++) {
					layers[i].destroy();
				}
			}
		}
	}
},
/* ******************************************************************************
 * Handle AfterRemoveHighlightMapLayerEvent
 * 
 * @param {Object}
 *            event
 */

removeHighlightOnMapLayer : function() {
	var wfsReqExp = new RegExp('_HIGHLIGHTED_FEATURE*', 'i');
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
            this.doWfsLayerRelatedQueries(/*creator,*/ layers[i]);
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
        var ogcSearchService = this._sandbox.getService('Oskari.mapframework.service.OgcSearchService');

        var mapWidth = map.getWidth();
        var mapHeight = map.getHeight();
        
        ogcSearchService.scheduleWFSMapLayerUpdate(mapLayer, bbox, mapWidth, mapHeight, this.getName());
        ogcSearchService.startPollers();
    },
/*redrawWfsLayers : function() {
		var wfsLayers = this.getOLMapLayers();
		for ( var i = 0; i < wfsLayers.length; i++) {
			wfsLayers[i].redraw(true);
		}
},*/
afterAfterMapMoveEvent : function(event) {
	this.updateWfsImages(this.getName());
	
	this.removeHighlightOnMapLayer();
}
}, {
	'protocol' : [ "Oskari.mapframework.module.Module",
			"Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
