/**
 * @class Oskari.mapframework.core.Core.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-layer-methods', {

    /**
     * @method isLayerAlreadySelected
     * Checks if the layer matching the id is added to map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is added to map
     */
    isLayerAlreadySelected : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._selectedLayers);
        //var layer = this.findMapLayer(id, this._selectedLayers);
        return (layer != null);
    },

    /**
     * @method findMapLayerFromSelectedMapLayers
     * Returns the layer domain object matching the id if it is added to map
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromSelectedMapLayers : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._selectedLayers);
        return layer;
    },
    /**
     * @method isMapLayerAlreadyHighlighted
     * Checks if the layer matching the id is "highlighted". Highlighted wfslayer responds to map
     * clicks by highlighting a clicked feature.
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerAlreadyHighlighted : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._mapLayersHighlighted);
        if (layer == null) {
            this.printDebug("[core-map-layer-methods] " + id + " is not yet highlighted.");
        }
        return (layer != null);
    },
    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable : function(id) {

        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id);
        if (layer == null) {
            this.printDebug("Cannot find map layer with id '" + id + "' from all available. " + 
                "Check that current user has VIEW permissions to that layer.");
        }
        return layer;
    },
    /**
     * @method getAllSelectedLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllSelectedLayers : function() {
        return this._selectedLayers;
    },
    /**
     * @method getAllHighlightedMapLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllHighlightedMapLayers : function() {
        return this._mapLayersHighlighted;
    },
    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers : function(allow) {
        this._allowMultipleHighlightLayers = allow;
    },
    /**
     * @method handleAddMapLayerRequest
     * Handles AddMapLayerRequests, adds the map layer to selected layers and sends out
     * an AfterMapLayerAddEvent to signal that a map layer has been selected.
     *
     * @param {Oskari.mapframework.request.common.AddMapLayerRequest} request
     * @private
     */
    _handleAddMapLayerRequest : function(request) {
		var me = this;

        var id = request.getMapLayerId();
		// TODO we need to pass this as false from layerselector...
        var keepLayersOrder = request.getKeepLayersOrder();
        var isBaseMap = request.isBasemap();

        me.printDebug("Trying to add map layer with id '" + id + "' AS " + ( isBaseMap ? " BASE " : " NORMAL " ));
        if (me.isLayerAlreadySelected(id)) {
            me.printDebug("Attempt to select already selected layer '" + id + "'");
            return;
        }

        var mapLayer = me.findMapLayerFromAllAvailable(id);
        if (!mapLayer) {
            // not found, ignore
            me.printDebug("Attempt to select layer that is not available '" + id + "'");
            return;
        }

        if (isBaseMap == true) {
            mapLayer.setType("BASE_LAYER");
        }

        // if we need keep layers order, i.e. when map is accessed by link
        if (keepLayersOrder != null && keepLayersOrder) {
            me._selectedLayers.push(mapLayer);
        }
        // else we not need keep layers order (basemaps come
        // first in array, other maps come last)
		// TODO seems like isBaseLayer doesn't work?
		// TODO insert new baselayer _after_ old baselayers (from the bottom up)
        else {
            if (mapLayer.isBaseLayer() || isBaseMap == true) {
                var oldSelectedLayers = me._selectedLayers;
                var newSelectedLayers = new Array();
				var newLayerInserted = false;
                //newSelectedLayers.push(mapLayer);
                for (var i = 0; i < oldSelectedLayers.length; i++) {
					if (!newLayerInserted && !oldSelectedLayers[i].isBaseLayer()) {
						newSelectedLayers.push(mapLayer);
						newLayerInserted = true;
					}
                    newSelectedLayers.push(oldSelectedLayers[i]);
                }
				
                delete me._selectedLayers;
                me._selectedLayers = newSelectedLayers;
            } else {
                me._selectedLayers.push(mapLayer);
            }
        }

        var event = me.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap);
        me.copyObjectCreatorToFrom(event, request);
        me.dispatch(event);
    },
    /**
     * @method _handleRemoveMapLayerRequest
     * Handles RemoveMapLayerRequests, removes the map layer from selected layers and sends out
     * an AfterMapLayerRemoveEvent to signal that a map layer has been removed from selected.
     *
     * @param {Oskari.mapframework.request.common.RemoveMapLayerRequest} request
     * @private
     */
    _handleRemoveMapLayerRequest : function(request) {
		var me = this;
        var id = request.getMapLayerId();
        me.printDebug("Trying to remove map layer with id '" + id + "'");
        if (!me.isLayerAlreadySelected(id)) {
            me.printDebug("Attempt to remove layer '" + id + "' that is not selected.");
            return;
        }

        var mapLayer = me.findMapLayerFromAllAvailable(id);
        var index = -1;
        for (var n = 0; n < me._selectedLayers.length; n++) {
            if (me._selectedLayers[n] === mapLayer) {
                index = n;
                break;
            }
        }
        me._selectedLayers.splice(index, 1);

        if (me.isMapLayerAlreadyHighlighted(id)) {
            // remove it from highlighted list
            me.printDebug("Maplayer is also highlighted, removing it from highlight list.");
            me._handleDimMapLayerRequest(id);
        }

        // finally notify sandbox
        var event = me.getEventBuilder('AfterMapLayerRemoveEvent')(mapLayer);
        me.copyObjectCreatorToFrom(event, request);
        me.dispatch(event);
    },
    
    
    /**
     * @method _handleShowMapLayerInfoRequest
     * Handles ShowMapLayerInfoRequest, sends out an AfterShowMapLayerInfoEvent
     *
     * @param {Oskari.mapframework.request.common.ShowMapLayerInfoRequest} request
     * @private
     */
    _handleShowMapLayerInfoRequest : function(request) {
        var mapLayer = this.findMapLayerFromAllAvailable(request.getMapLayerId());
        var event = this.getEventBuilder('AfterShowMapLayerInfoEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleShowMapLayerInfoRequest
     * Handles ShowMapLayerInfoRequest, sorts selected layers array so
     * that layer with given id is positioned into given index
     * and all the rest are pushed one step further. Sends out an AfterRearrangeSelectedMapLayerEvent
     *
     * @param {Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest} request
     * @private
     */
    _handleRearrangeSelectedMapLayerRequest : function(request) {
        var requestToPosition = request.getToPosition();
        var requestMapLayerId = request.getMapLayerId();
        var modifiedLayer = null;
        var oldPosition = 0;
        if (requestMapLayerId != null && requestToPosition != null) {
            modifiedLayer = this.findMapLayerFromSelectedMapLayers(requestMapLayerId);

            var newSelectedLayers = new Array();
            var itemsAdded = 0;
            var lastHandledIndex = 0;

            // loop through layers so that we have enough elements before new position
            for (var i = 0; itemsAdded < requestToPosition; i++) {
                lastHandledIndex++;

                var layer = this._selectedLayers[i];

                if (layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }

                newSelectedLayers.push(layer);
                itemsAdded++;
            }

            // now we got start of the array ready. Next add modified one.
            newSelectedLayers.push(modifiedLayer);

            // Finally add rest to array
            for (var i = lastHandledIndex; i < this._selectedLayers.length; i++) {
                var layer = this._selectedLayers[i];

                if (layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }
                newSelectedLayers.push(layer);
            }

            // clear carbage
            delete this._selectedLayers;
            this._selectedLayers = newSelectedLayers;
        }

        // notify listeners
        var event = this.getEventBuilder('AfterRearrangeSelectedMapLayerEvent')(modifiedLayer, oldPosition, requestToPosition);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    
    /**
     * @method _handleChangeMapLayerOpacityRequest
     * Handles ChangeMapLayerOpacityRequest, sends out an AfterChangeMapLayerOpacityEvent
     *
     * @param {Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest} request
     * @private
     */
    _handleChangeMapLayerOpacityRequest : function(request) {
        var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
        if (!layer) {
            return;
        }
        layer.setOpacity(request.getOpacity());

        var event = this.getEventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleChangeMapLayerStyleRequest
     * Handles ChangeMapLayerStyleRequest, sends out an AfterChangeMapLayerStyleEvent
     *
     * @param {Oskari.mapframework.request.common.ChangeMapLayerStyleRequest} request
     * @private
     */
    _handleChangeMapLayerStyleRequest : function(request) {
        var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
        if (!layer) {
            return;
        }
        // Check for magic string
        if (request.getStyle() != "!default!") {
            layer.selectStyle(request.getStyle());
            var event = this.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        }
    },
    /**
     * @method _removeHighLightedMapLayer
     * Removes layer with given id from highlighted layers. 
     * If id is not given -> removes all layers from highlighted layers
     * @param {String} id of the layer to remove or leave undefined to remove all
     * @private
     */
    _removeHighLightedMapLayer : function(id) {
        var highlightedMapLayers = this.getAllHighlightedMapLayers();
        for (var i = 0; i < highlightedMapLayers.length; i++) {
            var mapLayer = highlightedMapLayers[i];
            if (!id || mapLayer.getId() == id) {
                highlightedMapLayers.splice(i);
                // Notify that dim has occured
                var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
                this.dispatch(event);
                return;
            }
        }
    },
    /**
     * @method _handleHighlightMapLayerRequest
     * Handles HighlightMapLayerRequest, sends out an AfterHighlightMapLayerEvent.
     * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
     *
     * @param {Oskari.mapframework.request.common.HighlightMapLayerRequest} request
     * @private
     */
    _handleHighlightMapLayerRequest : function(request) {
        var creator = this.getObjectCreator(request);

        var id = request.getMapLayerId();
        this.printDebug("[core-map-layer-methods] Trying to highlight map " + "layer with id '" + id + "'");
        if (this.isMapLayerAlreadyHighlighted(id)) {
            this.printWarn("[core-map-layer-methods] Attempt to highlight " + "already highlighted wms feature info " + "map layer '" + id + "'");
            return;
        }

        if (this._allowMultipleHighlightLayers == true) {
            this._removeHighLightedMapLayer(id);
        } else {
            this._removeHighLightedMapLayer();
        }

        var mapLayer = this.findMapLayerFromSelectedMapLayers(id);
        if (!mapLayer) {
            return;
        }
        this._mapLayersHighlighted.push(mapLayer);
        this.printDebug("[core-map-layer-methods] Adding " + mapLayer + " (" + mapLayer.getId() + ") to highlighted list.");

        // finally notify sandbox
        var event = this.getEventBuilder('AfterHighlightMapLayerEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleDimMapLayerRequest
     * Handles DimMapLayerRequest, sends out an AfterDimMapLayerEvent.
     * Highlighted wfslayer responds to map clicks by highlighting a clicked feature. 
     * This removes the layer from highlighted list
     *
     * @param {Oskari.mapframework.request.common.DimMapLayerRequest} request
     * @private
     */
    _handleDimMapLayerRequest : function(layerId) {

        if (this._allowMultipleHighlightLayers == true) {
            this._removeHighLightedMapLayer(layerId);
        } else {
            this._removeHighLightedMapLayer();
        }

        var mapLayer = this.findMapLayerFromAllAvailable(layerId);
        if (!mapLayer) {
            return;
        }

        var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
        this.dispatch(event);
    }
});
