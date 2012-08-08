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
