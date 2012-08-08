Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-layer-methods',
//
{
    /**
     * Tries to find maplayer with given id from given map layer
     * array. Uses recursion to loop through all layers and its
     * sublayers
     *
     * @param {Object}
     *            id
     * @param {Object}
     *            layerList
     */
    findMapLayer : function(id, layerList) {
        // TODO: deprecated start using map-layer-service.findMapLayer() instead
        if(!layerList) {
            return null;
        }
        for(var i = 0; i < layerList.length; i++) {
            var layer = layerList[i];
            if(layer.getId() == id) {
                return layer;
            }                

            /* recurse to sublayers */
            var subLayers = layer.getSubLayers();
            var subLayer = this.findMapLayer(id, subLayers);
            if(subLayer != null) {
                return subLayer;
            }
        }
        return null;
    },
    /**
     * Returns boolean true if layer with given id is already selected
     *
     * @param {Object}
     *            id
     */
    isLayerAlreadySelected : function(id) {
        var layer = this.findMapLayer(id, this._selectedLayers);
        return (layer != null);
    },
    /**
     * Returns layer if layer with given id is already selected
     *
     * @param {Object}
     *            id
     */
    findMapLayerFromSelectedMapLayers : function(id) {
        return this.findMapLayer(id, this._selectedLayers);
    },
    /**
     * Returns layer if layer with given id is already
     * Highlighted
     *
     * @param {Object}
     *            id
     */
    isMapLayerAlreadyHighlighted : function(id) {
        var layer = this.findMapLayer(id, this._mapLayersHighlighted);
        if (layer == null) {
            this.printDebug("[core-map-layer-methods] " + id + " is not yet highlighted.");
        }
        return (layer != null);
    },
    /**
     * Handles map layer add
     *
     * @param {Object}
     *            request
     */
    handleAddMapLayerRequest : function(request) {

        var id = request.getMapLayerId();
        var keepLayersOrder = request.getKeepLayersOrder();
        var isBaseMap = request.isBasemap();

        this.printDebug("Trying to add map layer with id '" + id + "' AS " + ( isBaseMap ? " BASE " : " NORMAL " ));
        if(this.isLayerAlreadySelected(id)) {
            this.printDebug("Attempt to select already selected layer '" + id + "'");
            return;
        }

        var mapLayer = this.findMapLayerFromAllAvailable(id);
        if(!mapLayer) {
        	// not found, ignore
        	return;
        }

        this.printDebug("MAPLAYER isBaseLayer WAS " + mapLayer.isBaseLayer());

        if(isBaseMap == true) {
            mapLayer.setType("BASE_LAYER");
        }

        this.printDebug("MAPLAYER isBaseLayer IS " + mapLayer.isBaseLayer());

        // if we need keep layers order, i.e. when come map to
        // link or mappublisher
        // wizard
        if(keepLayersOrder != null && keepLayersOrder) {
            this._selectedLayers.push(mapLayer);
        }
        // else we not need keep layers order (basemaps come
        // first in array, other
        // maps come last)
        else {
            if(mapLayer.isBaseLayer() || isBaseMap == true) {
                var oldSelectedLayers = this._selectedLayers;
                var newSelectedLayers = new Array();
                newSelectedLayers.push(mapLayer);
                for(var i = 0; i < oldSelectedLayers.length; i++) {
                    newSelectedLayers.push(oldSelectedLayers[i]);
                }
                delete this._selectedLayers;
                this._selectedLayers = newSelectedLayers;
            } else {
                this._selectedLayers.push(mapLayer);
            }
        }

        /* Check if this is WFS layer. */
       /*
        if(mapLayer.isLayerOfType('WFS')) {
             // It is, we will trigger server side requests that
             // will fetch some data
            var creator = this.getObjectCreator(request);
            this.doWfsLayerRelatedQueries(creator, mapLayer);
        }
        */

        var event = this.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);

        /* Do sniffing */
        var selectedLayerArray = new Array();
        selectedLayerArray.push(mapLayer);
        this.doSniffing(selectedLayerArray);
    },
    /**
     * Handles map layer remove
     *
     * @param {Object}
     *            request
     */
    handleRemoveMapLayerRequest : function(request) {
        var id = request.getMapLayerId();
        this.printDebug("Trying to remove map layer with id '" + id + "'");
        if(!this.isLayerAlreadySelected(id)) {
            this.printDebug("Attempt to remove layer '" + id + "' that is not selected.");
            return;
        }

        var mapLayer = this.findMapLayerFromAllAvailable(id);
        // IE9 don't support indexOf or jQuery not there?
        var index = -1;
        for(var n = 0; n < this._selectedLayers.length; n++) {
            if(this._selectedLayers[n] === mapLayer)
                index = n;
        }
        this._selectedLayers.splice(index, 1);

        if(this.isMapLayerAlreadyHighlighted(id)) {
            /* remove it from highlighted list */
            this.printDebug("Maplayer is also highlighted, removing it from highlight list.");

            if(this._allowMultipleHighlightLayers == true) {
                this.destroyOneHighLightedMapLayers(id);
            } else {
                this.destroyAllHighLightedMapLayers();
            }

        }

        /* finally notify sandbox */
        var event = this.getEventBuilder('AfterMapLayerRemoveEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * Finds map layer from all available
     *
     * @param {Object}
     *            id
     */
    findMapLayerFromAllAvailable : function(id) {

        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id);
        if(layer == null) {
            this.printDebug("Cannot find map layer with id '" + id + "' from all available. " + 
            	"Check that current user has VIEW permissions to that layer.");
        }
        return layer;
    },
    findBaselayerBySublayerIdFromAllAvailable : function(sublayerid) {
        var layer = null;
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var mapLayers = mapLayerService.getAllLayers();
        for(var i = 0; i < mapLayers.length; i++) {
            if(mapLayers[i].isBaseLayer()) {
                for(var j = 0; j < mapLayers[i].getSubLayers().length; j++) {
                    var sublayer = mapLayers[i].getSubLayers()[j];
                    if(sublayer.getId() == sublayerid) {
                        layer = mapLayers[i];
                        break;
                    }
                }
            }
            if(layer != null) {
                break;
            }
        }
        return layer;
    },
    /**
     * Finds map layer from selected
     *
     * @param {Object}
     *            id
     */
    findMapLayerFromSelected : function(id) {
        var layer = this.findMapLayer(id, this._selectedLayers);
        if(layer == null) {
            this.printDebug("Cannot find map layer with id '" + id + "' from selected layers");
        }
        return layer;
    },
    /**
     * Handles show info request
     *
     * @param {Object}
     *            request
     */
    handleShowMapLayerInfoRequest : function(request) {
        var mapLayer = this.findMapLayerFromAllAvailable(request.getMapLayerId());
        var event = this.getEventBuilder('AfterShowMapLayerInfoEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * Handles rearrange request. Sorts selected layers array so
     * that layer with given id is positioned into given index
     * and all the rest are pushed one step further
     *
     * @param {Object}
     *            request
     */
    handleRearrangeSelectedMapLayerRequest : function(request) {
        var requestToPosition = request.getToPosition();
        var requestMapLayerId = request.getMapLayerId();
        var modifiedLayer = null;
        var oldPosition = 0;
        if(requestMapLayerId != null && requestToPosition != null) {
            modifiedLayer = this.findMapLayerFromSelected(requestMapLayerId);

            var newSelectedLayers = new Array();
            var itemsAdded = 0;
            var lastHandledIndex = 0;

            /*
             * loop through layers so that we have enough
             * elements before new position
             */
            for(var i = 0; itemsAdded < requestToPosition; i++) {
                lastHandledIndex++;

                var layer = this._selectedLayers[i];

                if(layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }

                newSelectedLayers.push(layer);
                itemsAdded++;
            }

            /*
             * now we got start of the array ready. Next add
             * modified one.
             */
            newSelectedLayers.push(modifiedLayer);

            /* Finally add rest to array */
            for(var i = lastHandledIndex; i < this._selectedLayers.length; i++) {
                var layer = this._selectedLayers[i];

                if(layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }

                newSelectedLayers.push(layer);
            }

            /* clear carbage */
            delete this._selectedLayers;
            this._selectedLayers = newSelectedLayers;
        }

        /* notify listeners */
        var event = this.getEventBuilder('AfterRearrangeSelectedMapLayerEvent')(modifiedLayer, oldPosition, requestToPosition);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * Handles opacity change request
     *
     * @param {Object}
     *            request
     */
    handleChangeMapLayerOpacityRequest : function(request) {
        var layer = this.findMapLayerFromSelected(request.getMapLayerId());
        if(!layer) {
        	return;
        }
        layer.setOpacity(request.getOpacity());

        var event = this.getEventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * Handles style change request
     *
     * @param {Object}
     *            request
     */
    handleChangeMapLayerStyleRequest : function(request) {
        var layer = this.findMapLayerFromSelected(request.getMapLayerId());
        if(!layer) {
        	return;
        }
        /* Check for magic string */
        if(request.getStyle() != "!default!") {
            layer.selectStyle(request.getStyle());
            var event = this.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        }
    },
    /**
     * Returns all selected layers
     */
    getAllSelectedLayers : function() {
        return this._selectedLayers;
    },
    /**
     * Returns all selected layers (from selected layers module)
     */
    getAllSelectedWfsLayers : function() {
        var wfsLayers = [];
        if(this._selectedLayers != null) {
            for(var i = 0; i < this._selectedLayers.length; i++) {
                if(this._selectedLayers[i].isLayerOfType('WFS')) {
                    wfsLayers.push(this._selectedLayers[i]);
                }
            }
        }
        return wfsLayers;
    },
    /***********************************************************
     * Check at if there is highlighted wfs layers
     */
    isWfsLayersSelected : function() {
        var selectedWfsLayers = this.getAllSelectedWfsLayers();
        return selectedWfsLayers.length > 0;
    },
    /**
     * Returns all highlighted layers
     */
    getAllHighlightedMapLayers : function() {
        return this._mapLayersHighlighted;
    },
    /**
     * Destroy all Highlighted layers
     */
    destroyAllHighLightedMapLayers : function() {
        var highlightedMapLayers = this.getAllHighlightedMapLayers();
        for(var i = 0; i < highlightedMapLayers.length; i++) {
            var mapLayer = highlightedMapLayers[i];
            /* Notify that dim has occured */
            var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
            this.dispatch(event);
        }

        this._mapLayersHighlighted = [];

    },
    /**
     * Destroy One Highlighted layers
     */
    destroyOneHighLightedMapLayers : function(id) {
        var highlightedMapLayers = this.getAllHighlightedMapLayers();
        for(var i = 0; i < highlightedMapLayers.length; i++) {
            var mapLayer = highlightedMapLayers[i];
            /* Notify that dim has occured */
            if(mapLayer.getId() == id) {
                highlightedMapLayers.splice(i);
                return;
            }

        }
    },
    /**
     * Handles add wms feature info request
     *
     * @param {Object}
     *            request
     */
    handleHighlightMapLayerRequest : function(request) {
        var creator = this.getObjectCreator(request);
       // Request select tool selection
        var b = this.getRequestBuilder('ToolSelectionRequest');
        var r = b('map_control_select_tool');
        this._sandbox.request(creator, r);

        var id = request.getMapLayerId();
        this.printDebug("[core-map-layer-methods] Trying to highlight map " + 
                        "layer with id '" + id + "'");
        if(this.isMapLayerAlreadyHighlighted(id)) {
            this.printWarn("[core-map-layer-methods] Attempt to highlight " + 
                           "already highlighted wms feature info " + 
                           "map layer '" + id + "'");
            return;
        }

        if(this._allowMultipleHighlightLayers == true) {
            this.destroyOneHighLightedMapLayers(id);
        } else {
            this.destroyAllHighLightedMapLayers();
        }

        var mapLayer = this.findMapLayerFromSelected(id);
        if(!mapLayer) {
        	return;
        }
        this._mapLayersHighlighted.push(mapLayer);
        this.printDebug("[core-map-layer-methods] Adding " + mapLayer +
                        " (" + mapLayer.getId() + ") to highlighted list.");
                     
       
        // Activate select tool
        // var toolEvent = this.getEventBuilder('AfterActivateOpenlayersMapControlEvent')();
        // var event = this.getEventBuilder('AfterActivateOpenlayersMapControlEvent')(toolEvent.CONTROL_NAME_SELECT);
        // this.copyObjectCreatorToFrom(event, request);
        // this.dispatch(event);


        // finally notify sandbox
        var event = this.getEventBuilder('AfterHighlightMapLayerEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleDimMapLayerRequest : function(request) {

        var layerId = request.getMapLayerId();

        if(this._allowMultipleHighlightLayers == true) {
            this.destroyOneHighLightedMapLayers(layerId);
        } else {
            this.destroyAllHighLightedMapLayers();
        }

        var mapLayer = this.findMapLayerFromAllAvailable(layerId);
        if(!mapLayer) {
        	return;
        }

        var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    allowMultipleHighlightLayers : function(allow) {
        this._allowMultipleHighlightLayers = allow;
    }
});
