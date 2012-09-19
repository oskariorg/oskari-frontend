
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
