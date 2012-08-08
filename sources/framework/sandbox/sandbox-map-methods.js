
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
