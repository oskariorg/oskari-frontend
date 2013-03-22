Oskari.clazz.category('Oskari.statistics.bundle.patiopoc.View', 'sample-map-ops', {

	
	/**
	 * @method _updateDomain
	 * @private
	 * Updates the map domain object so GFI and other functionalities depending on it works
	 * even after size changes.
	 */
	_updateMapDomain : function() {

		var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');

		var mapVO = this.instance.sandbox.getMap();
		mapVO.setExtent(mapModule.getMap().getExtent());
		mapVO.setMaxExtent(mapModule.getMap().getMaxExtent());
		mapVO.setBbox(mapModule.getMap().calculateBounds());

		var mapElement = jQuery(mapModule.getMap().div);
		mapVO.setWidth(mapElement.width());
		mapVO.setHeight(mapElement.height());
	},
	/**
	 * @method _addLayers
	 * Adds temporarily removed layers to map
	 * @private
	 */
	_setMapNormalMode : function() {
	    if( !this.mapState ) {
	        return;
	    }
		var me = this;
		var sandbox = this.instance.getSandbox();
		var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
		var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');

		sandbox.request(me.instance, removeRequestBuilder('999'));

		sandbox.requestByName(me.instance, 'MapMoveRequest', [this.mapState.e, this.mapState.n, this.mapState.z, false]);
		this._updateMapDomain();
	},
	/**
	 * @method _removeLayers
	 * Removes temporarily layers from map that the user cant publish
	 * @private
	 */
	_setMapStatsMode : function() {
		var me = this;
		var sandbox = this.instance.getSandbox();
		this.disabledLayers = sandbox.findAllSelectedMapLayers();
		var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
		var removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
	
		this.mapState = {
			e : sandbox.getMap().getX(),
			n : sandbox.getMap().getY(),
			z : sandbox.getMap().getZoom()
		};
		sandbox.requestByName(me.instance, 'MapMoveRequest', [449620, 7172042, 0, false]);

		sandbox.request(me.instance, addRequestBuilder('999', true));
		this._updateMapDomain();
	}
});
