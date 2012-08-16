/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 

/**
 * @TBD get rid of this one
 * 
 * IMPLEMENT GETFEATUREINFO in AN EXTENSION BUNDLE
 * 
 */
Oskari.clazz
    .category(
        //
        'Oskari.mapframework.core.Core', 'feature-info-methods',
        //
        {
            handleGetFeatureInfoRequest : function(request) {
            	this.printDebug("Handling OF getFeatureInfo TB refactored...");
            	
            	if (this.getMap().isMoving()) {
            		// dont send queries when dragging
            		return;
            	}
            
                // check at if one layer selected and it is not wfs
                var wfsSelected = false;
                if (request.getMapLayers().length == 1) {
                	if (request.getMapLayers()[0].isLayerOfType('WFS')) {
                		wfsSelected = true;
                	}
                }				
				
				if (request.getMapLayers().length > 0 && !wfsSelected) {
					/* notify sandbox */
					var event = this.getEventBuilder('AfterGetFeatureInfoEvent')(
							true, false);
					this.copyObjectCreatorToFrom(event, request);
					this.dispatch(event);

					for ( var i = 0; i < request.getMapLayers().length; i++) {
						this.actionInProgressGetFeatureInfo();
						var layer = request.getMapLayers()[i];
						var layerName = layer.getName();
						var format = layer.getQueryFormat();
                        
						if (layer.getQueryable() == true
								&& format != ""
								&& format != null
								&& !(layer.isLayerOfType('WFS'))) {
						    
						    
						    var url = layer.getWmsUrls()[0];
						    if(url.indexOf('?') < 0) {
						        url = url + '?';
						    }

						    var wmsBoundingBox = request.getBoundingBox().left
						        + ',' + request.getBoundingBox().bottom
                                + ',' + request.getBoundingBox().right
                                + ',' + request.getBoundingBox().top;
                                
                            //console.log(layer.getCurrentStyle().getName());    
							//console.dir(layer.getCurrentStyle());
						    // TODO: is this really the way we want to do this?
						    url = url 
						        + 'REQUEST=GetFeatureInfo'
						        + '&EXCEPTIONS=application/vnd.ogc.se_xml'
						        + '&SRS=' + request.getSRS()
                                + '&VERSION=1.1.1'
                                + '&BBOX=' + wmsBoundingBox
                                + '&X=' + request.getX()
                                + '&Y=' + request.getY()
                                + '&INFO_FORMAT=' + format 
                                + '&QUERY_LAYERS=' + layer.getWmsName()
                                + '&WIDTH=' + request.getMapWidth()
                                + '&HEIGHT=' + request.getMapHeight()
                                + '&FEATURE_COUNT=1'
                                + '&FORMAT=image/png'
                                + '&SERVICE=WMS'
                                + '&STYLES=' + layer.getCurrentStyle().getName()
                                + '&LAYERS='+layer.getWmsName();
/* example url:
 *  http://wms.w.paikkatietoikkuna.fi/wms/services.ecc.no/wms/wms?
 *  LAYERS=cells&
 *  TRANSPARENT=true&
 *  ID=27&
 *  STYLES=style-id-262&
 *  FORMAT=image/png&
 *  SERVICE=WMS&
 *  VERSION=1.1.1&
 *  REQUEST=GetFeatureInfo&
 *  EXCEPTIONS=application/vnd.ogc.se_xml&
 *  SRS=EPSG:3067&
 *  BBOX=383830,6662490,389270,6668110&
 *  X=365&
 *  Y=331&
 *  INFO_FORMAT=text/html&
 *  QUERY_LAYERS=cells&
 *  WIDTH=544&
 *  HEIGHT=562&
 *  FEATURE_COUNT=1
 */
						    
                            //var mapLayer = openLayersMap.getLayersByName('layer_' + layer.getId());
                            //var activeLayer = mapLayer[0];
						    
							// Build GetFeatureInfo url
							/*
							var url = activeLayer.getFullRequestString( {
								REQUEST : "GetFeatureInfo",
								EXCEPTIONS : "application/vnd.ogc.se_xml",
								BBOX : request.getBoundingBox(), //activeLayer.map.getExtent().toBBOX(),
								X : request.getLon(),
								Y : request.getLat(),
								INFO_FORMAT : format,
								QUERY_LAYERS : activeLayer.params.LAYERS,
								WIDTH : request.getMapWidth(), //activeLayer.map.size.w,
								HEIGHT : request.getMapHeight(), //activeLayer.map.size.h,
								FEATURE_COUNT : 1
							});
							*/

						
							var useProxy = Oskari.$().startup.useGetFeatureInfoProxy;
							if (useProxy != null && useProxy == 'true') {
								url = '/cgi-bin/proxy.cgi?url=' + encodeURIComponent(url);
								
							}
							var callbackTemplate = function(name, format) {
								this._name = name;
								this._format = format;

								this.parseOkMessage = function(response) {
									var parsedMessage = this.parseInfoResponse(
											response, this._format);

								
									var event =this.getEventBuilder('AfterAppendFeatureInfoEvent')(
											name, parsedMessage);
									this
											.copyObjectCreatorToFrom(event,
													request);
									this.dispatch(event);
								};

								this.parseFailedMessage = function(response) {
								
									var event = this.getEventBuilder('AfterAppendFeatureInfoEvent')(
											name, response.responseText);
									this
											.copyObjectCreatorToFrom(event,
													request);
									this.dispatch(event);
								};
							};

							var callback = new callbackTemplate(layerName,
									format);
							
							// Finally make the call
							Ext.Ajax.request({
							        url : url,
							        scope : this,
									success : callback.parseOkMessage,
									failure : callback.parseFailedMessage
							    });
						} else {
							
							var errorMessage = "";
							errorMessage = this
									.getText("rightpanel_wms_getfeatureinfo_not_supported_txt")
									+ ": " + layerName + ".";
							var event = this.getEventBuilder('AfterAppendFeatureInfoEvent')(
									layerName, errorMessage);
							this.copyObjectCreatorToFrom(event, request);
							this.dispatch(event);
						}

					}

				
					this.parseInfoResponse = function(response, format) {
					
						var parsedResp;
						if (format == 'application/vnd.ogc.gml'
								|| format == 'application/vnd.ogc.se_xml') {
							parsedResp = this.renderInfoGML(response);
						} else if (format == 'application/vnd.ogc.wms_xml'
								|| format == 'text/xml') {
							parsedResp = this.renderInfoXML(response);
						} else {
							parsedResp = '<div style="font: 11px Tahoma, Arial, Helvetica, sans-serif;">' + response.responseText + '</div>';
							if (response.responseText == '') {
								parsedResp = this
										.getText('mapcontrolsservice_not_found_wms_feature_info');
							}
						}

						if (parsedResp == '' || parsedResp == '<table></table>') {
							parsedResp = this
									.getText('mapcontrolsservice_not_found_wms_feature_info');
						}

						return parsedResp;
					};

					
					this.renderInfoGML = function(response) {
						return response.responseText.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;');
					};

				
					this.renderInfoXML = function(response) {
						return response.responseText.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;');
					};
					
				} else {
					
					var event = this.getEventBuilder('AfterGetFeatureInfoEvent')(
							false, wfsSelected);
					this.copyObjectCreatorToFrom(event, request);
					this.dispatch(event);
				}
			}
	}
);
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

        /* Check if this is WFS layer. */
        if(mapLayer.isLayerOfType('WFS')) {
            /* If it is remove current layer requests from tiler */
            var ogcSearchService = this.getService('Oskari.mapframework.service.OgcSearchService');
            ogcSearchService.removeWFsLayerRequests(mapLayer);
            ogcSearchService.removeWFSLayerGridRequests(mapLayer);
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
/**
 * @class Oskari.mapframework.core.Core
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-methods', {

    /**
     * @method updateMousePositionOnMap
     * 
     * Updates the mouse position in map domain
     * @param {Integer} x mouseposition x coordinate
     * @param {Integer} y mouseposition y coordinate
     * @deprecated
     */
    updateMousePositionOnMap : function(x, y) {
        var map = this._map;
        map.updateMousePosition(x, y);
    },
    handleEnableMapKeyboardMovementRequest : function(request) {
        var map = this._map;
        map.setMapKeyboardMovementsEnabled(true);

        var event = this.getEventBuilder(
        'AfterEnableMapKeyboardMovementEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleDisableMapKeyboardMovementRequest : function(request) {
        var map = this._map;
        map.setMapKeyboardMovementsEnabled(false);

        var event = this.getEventBuilder(
        'AfterDisableMapKeyboardMovementEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    doSniffing : function(layersArray) {
        /* Check if map movements should be logged */
        if(this._doSniffing) {
            var sniffer = this.getService('Oskari.mapframework.service.UsageSnifferService');
            var visibleLayers = new Array();
            var scale = this._map.getScale();

            /* Loop layers and their sublayers */
            for(var i = 0; i < layersArray.length; i++) {
                var layer = layersArray[i];

                /* first check sublayers */
                for(var j = 0; j < layer.getSubLayers().length; j++) {
                    var subLayer = layer.getSubLayers()[j];
                    if(subLayer.isVisible() && subLayer.getMinScale() >= scale && subLayer.getMaxScale() <= scale) {
                        visibleLayers.push(subLayer);
                    }
                }

                /* then layer it self if it is not a base layer */
                if(!layer.isBaseLayer() && layer.isVisible() && layer.getMinScale() >= scale && layer.getMaxScale() <= scale) {
                    visibleLayers.push(layer);
                }
            }
            if(visibleLayers.length > 0) {
                sniffer.registerMapMovement(visibleLayers, this._map.getX(), this._map.getY(), this._map.getZoom(), this._map.getBbox().toBBOX(), this._mapIdFromUrl);
            }
        }
    },

    handleStartMapPublisherRequest : function(request) {
        if(this._mapPublisherWizardUrl == null) {
            throw "User cannot move to wizard!";
        }

        var event = this.getEventBuilder(
        'AfterStartMapPublisherEvent')(this._mapPublisherWizardUrl);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleGenerateHtmlLinkToMapRequest : function(request) {

        var event = this.getEventBuilder(
        'AfterGenerateHtmlLinkToMapEvent')(this.generateUrlToCurrentPage() + this.generateHtmlLinkParameters(this._map, this._selectedLayers, null));
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleGenerateHtmlPrintToMapRequest : function(request) {
        var event = this.getEventBuilder(
        'AfterGenerateHtmlPrintToMapEvent')(this.generateUrlToPrintPage() + this.generateHtmlLinkParameters(this._map, this._selectedLayers, 'print=true'));
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    generateUrlToPrintPage : function() {
        var printUrl = Oskari.$().startup.printUrl;
        if(printUrl == null) {
            throw "Print url is not set. Cannot print.";
        }
        return printUrl;
    },
    generateUrlToCurrentPage : function() {

        var locationPath = window.location.pathname;

        /* This will remove sessionId, if such exits */
        if(locationPath.match(";")) {
            locationPath = locationPath.substring(0, locationPath.indexOf(";"));
        }

        var baseUrl = window.location.protocol + "//" + window.location.host + locationPath;
        return baseUrl;
    },
    generatePublishedMapLinkToFinnishGeoportalPage : function() {
        /* Reorder selected layers array */
        var reOrdered = new Array();
        /* Add first baselayers */
        for(var i = 0; i < this._selectedLayers.length; i++) {
            if(this._selectedLayers[i].isBaseLayer()) {
                reOrdered.push(this._selectedLayers[i]);
            }
        }
        /* And then second normal layers */
        for(var i = 0; i < this._selectedLayers.length; i++) {
            if(!this._selectedLayers[i].isBaseLayer()) {
                reOrdered.push(this._selectedLayers[i]);
            }
        }

        return Oskari.$().startup.finnishGeoportalMapUrl + this.generateHtmlLinkParameters(this._map, reOrdered, "keepLayersOrder=false");
    },
    generateHtmlLinkParameters : function(map, selectedLayers, additionalParams) {

        /* url encoded comma */
        var LAYER_SEPARATOR = ",";
        var ATTRIBUTE_SEPARATOR = "+";

        var zoom = map.getZoom();
        var lat = map.getX();
        var lon = map.getY();

        /* layers */
        var layerString = "";
        for(var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];

            if(layerString.length > 0) {
                layerString += LAYER_SEPARATOR;
            }

            var opacity = layer.getOpacity();
            var style;

            if(layer.isBaseLayer() || typeof layer.getCurrentStyle != "function" || layer.getCurrentStyle() == null || layer.getCurrentStyle().getName() == null) {
                style = "!default!";
            } else {
                style = layer.getCurrentStyle().getName();
            }
            layerString += layer.getId() + ATTRIBUTE_SEPARATOR + opacity + ATTRIBUTE_SEPARATOR + style;
        }

        /* marker visible or not? */
        var markerVisibleString = "false";
        if(map.isMarkerVisible()) {
            markerVisibleString = "true";
        }

        if(additionalParams != null) {
            additionalParams = "&" + additionalParams;
        } else {
            additionalParams = "";
        }
        var html = "?zoomLevel=" + zoom + "&coord=" + lat + "_" + lon + "&mapLayers=" + layerString + "&showMarker=" + markerVisibleString + "&forceCache=true" + additionalParams;

        return html;
    },
    handleDrawPolygonRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterDrawPolygonEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleDrawSelectedPolygonRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterDrawSelectedPolygonEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleSelectPolygonRequest : function(request) {
        var id = request.getId();
        var groupId = request.getGroupId();
        var event = this.getEventBuilder(
        'AfterSelectPolygonEvent')(id, groupId);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleUpdateHiddenValueRequest : function(request) {
        var polygon = request.getPolygon();
        var event = this.getEventBuilder(
        'AfterUpdateHiddenValueEvent')(polygon);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleErasePolygonRequest : function(request) {
        var id = request.getId();
        var event = this.getEventBuilder(
        'AfterErasePolygonEvent')(id);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleRemovePolygonRequest : function(request) {
        var id = request.getId();
        var groupId = request.getGroupId();
        var showPol = request.getShowPol();
        var event = this.getEventBuilder(
        'AfterRemovePolygonEvent')(id, groupId, showPol);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    handleHideMapMarkerRequest : function(request) {
        /* Set marker state to domain */
        this._map.setMarkerVisible(false);

        var event = this.getEventBuilder(
        'AfterHideMapMarkerEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    }
});
Oskari.clazz
		.category('Oskari.mapframework.core.Core',
				'status-methods',{	handleActionReadyRequest : function(request) {
		var id = request.getId();
		this._ongoingActions[id] = null;
		this.notifyModulesThatActionsHaveChanged(request);

		/* If this is a WFS PNG end request decrease counter */
		if (request.isWfsPngAction()) {
			this._currentlyFetchingWfsTiles--;
		}
	},

	handleActionStartRequest : function(request) {
		var id = request.getId();
		this._ongoingActions[id] = request.getActionDescription();
		this.notifyModulesThatActionsHaveChanged(request);

		/* If this is a WFS PNG start request increase counter */
		if (request.isWfsPngAction()) {
			this._currentlyFetchingWfsTiles++;
		}
	},

	notifyModulesThatActionsHaveChanged : function(request) {
		var currentlyRunningActionsDescriptions = {};
		for ( var key in this._ongoingActions) {
			var value = this._ongoingActions[key];
			if (value != null) {
				currentlyRunningActionsDescriptions[value] = value;
			}
		}

		/* Only show texts once */
		var texts = new Array();
		for ( var s in currentlyRunningActionsDescriptions) {
			if (s != null && s != undefined) {
				texts.push(s);
			}
		}

		var event = this.getEventBuilder('ActionStatusesChangedEvent')(
				texts);
		this.copyObjectCreatorToFrom(event, request);
		this.dispatch(event);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressWfsGrid : function() {
		var text = this.getText("status_wfs_update_grid");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"WFS_GRID", text, false);
		this.handleActionStartRequest(request);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressSearch : function() {
		var text = this.getText("status_search");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"SEARCH", text, false);
		this.handleActionStartRequest(request);
	},

	/**
	 * Shortcut method
	 */
	actionInProgressGetFeatureInfo : function() {
		var text = this.getText("status_get_feature_info");
		var request = this.getRequestBuilder('ActionStartRequest')(
				"GET_FEATURE_INFO", text, false);
		this.handleActionStartRequest(request);
	}
});