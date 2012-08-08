/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
Oskari.clazz.category(
//
		'Oskari.mapframework.sandbox.Sandbox', 'map-layer-methods',
		//
		{
			/**
			 * Finds map layer with given id
			 * 
			 * @param {Object}
			 *            id
			 */
			findMapLayerFromAllAvailable : function(id) {
				var layer = this._core.findMapLayerFromAllAvailable(id);
				return layer;
			},

			/*******************************************************************
			 * Finds basemap layer by sublayer id.
			 * 
			 * @param {Object}
			 *            sublayerid
			 */
			findBaselayerBySublayerIdFromAllAvailable : function(sublayerid) {
				var layer = this._core
						.findBaselayerBySublayerIdFromAllAvailable(sublayerid);
				return layer;
			},

			/**
			 * @method findAllSelectedMapLayers
			 * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
		 	 * 		
		 	 * Returns all currently selected map layers
			 */
			findAllSelectedMapLayers : function() {
				var layersList = this._core.getAllSelectedLayers();
				// copy the array so changing it wont change the core data
				return layersList.slice(0);
			},
			
			/**
			 * Find layer from currently selected map layers
			 */
			findMapLayerFromSelectedMapLayers : function(layerId) {
				var layer = this._core.findMapLayerFromSelectedMapLayers(layerId);
				return layer;
			},

			/**
			 * Returns layer boolean if layer with given id is already selected
			 * 
			 * @param {Object}
			 *            id
			 */
			isLayerAlreadySelected : function(id) {
				return this._core.isLayerAlreadySelected(id);
			},

			/**
			 * Returs is wfs layers selected
			 */
			isWfsLayersSelected : function() {
				return this._core.isWfsLayersSelected();
			},

			/**
			 * Returns all currently selected wfs map layers
			 */
			findAllSelectedWFSMapLayers : function() {
				var layers = this._core.getAllSelectedWfsLayers();
				return layers;
			},

			/**
			 * Returns all currently highlighted map layers
			 */
			findAllHighlightedLayers : function() {
				var layer = this._core.getAllHighlightedMapLayers();
				return layer;
			},

			isMapLayerHighLighted : function(id) {
				var highlighted = this.findAllHighlightedLayers();
				for ( var i = 0; i < highlighted.length; i++) {
					if (highlighted[i].getId() == id) {
						return true;
					}
				}
				return false;
			},

			allowMultipleHighlightLayers : function(allow) {
				this._core.allowMultipleHighlightLayers(allow);
			}
		});

Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox','map-methods',
		//
		{			/**
					 * Returns map domain object
					 */
			getMap : function() {
				return this._core.getMap();
			},
			
			/** @method syncMapState
			 *  convenience method to send out a map move request with the values on 
			 *  {Oskari.mapframework.domain.Map} domain object (see #getMap()).
			 * 
			 * (refactored from requestMapMove()) 
			 * 
			 * @param {Boolean} blnInitialMove (optional)
			 * 			If true, will clear the map history after moving. Defaults to false.
			 * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule (optional)
			 * 			Refreshes the map state so that the added layers are shown correctly 
			 */
			syncMapState : function(blnInitialMove, mapModule) {
				var mapDomain = this._core.getMap();
				var zoom = mapDomain.getZoom();
				var marker = mapDomain.isMarkerVisible();
				// updateCurrentState updates the maplayers from selectedlayers list, if they are already in map, they will be added twice
		        //if(mapModule) {
		        	// need to do this before map move 
		        	// otherwise WFS layerimages are at bottom (behind other layers)
	        	//	mapModule.updateCurrentState();
		        //}
				if(blnInitialMove === true && zoom == 12) {
					// workaround, openlayers needs to be nudged a bit to actually draw the map images if we enter at zoomlevel 12
					// so if zoom == 12 -> send a dummy request to get openlayers working correctly
					// TODO: find out why OL needs this 
		        	this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), 0, false));
				}
				
		        this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), zoom, marker));
		        if(blnInitialMove === true) {
		        	// clear history
		        	this._core.processRequest(this._core.getRequestBuilder('ClearHistoryRequest')());
		        }
			},

			/**
			 * Method for registering OpenLayers map component. We cannot handle
			 * all events by using normal request-event cycle due to the fact
			 * that some things happen way too often (e.g. mouse move)
			 * 
			 * this is why, we have to register some components directly and
			 * bypass eventhandling
			 * 
			 * @param {Object}
			 *            map
			 */
			/*registerOpenLayersMapComponent : function(map) {
				this._core.registerOpenLayersMapComponent(map);
			},*/

			/**
			 * Method for registering mouse movement on openlayers map. These
			 * operations can occur very often so we must optimize this.
			 * 
			 * @param {Object}
			 *            event
			 */
			/*registerMouseMovementForOpenlayersMap : function(x, y) {
				this._core.registerMouseMovementForOpenlayersMap(x, y);
			},*/

			isMapFullScreenMode : function() {
				return this._core.isMapFullScreenMode();
			},

			generatePublishedMapLinkToFinnishGeoportalPage : function() {
				return this._core
						.generatePublishedMapLinkToFinnishGeoportalPage();
			},
			
    		doSniffing : function(layersArray) {
    			if(!layersArray) {
    				layersArray = this._core.getAllSelectedLayers();
    			}
				this._core.doSniffing(layersArray);
    		}
		});
