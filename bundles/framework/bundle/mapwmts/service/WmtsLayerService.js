/**
 * 
 * A service to act as a WMTS Layer Source
 * 
 * Requires services from MapLayerService (addLayer,removeLayer) (Will create
 * own domain objects, though)
 * 
 * This implements temporarily WMTS Caps parsing. WMTS Caps will be parsed in
 * backend.
 * 
 * 
 */

Oskari.clazz
		.define(
				'Oskari.mapframework.wmts.service.WMTSLayerService',
				function(mapLayerService) {
					this.mapLayerService = mapLayerService;
					this.capabilities = {};
					this.capabilitiesClazz = Oskari.clazz
							.create("Oskari.openlayers.Patch.WMTSCapabilities_v1_0_0");
				},
				{
					/**
					 * TEmp
					 */
					setCapabilities : function(name, caps) {
						this.capabilities[name] = caps;

					},

					/**
					 * Temp
					 */
					getCapabilities : function(name) {
						return this.capabilities[name];
					},

					/**
					 * This is a temporary solution actual capabilities to be
					 * read in backend
					 * 
					 */
					readWMTSCapabilites : function(wmtsName, capsPath,
							matrixSet) {

						var me = this;
						var formatClazz = this.capabilitiesClazz.getPatch();
						// Oskari.$("WMTSCapabilities_v1_0_0");
						var format = new formatClazz();// OpenLayers.Format.WMTSCapabilities();

						OpenLayers.Request.GET( {
							url : capsPath,
							params : {
								SERVICE : "WMTS",
								VERSION : "1.0.0",
								REQUEST : "GetCapabilities"
							},
							success : function(request) {
								var doc = request.responseXML;
								if (!doc || !doc.documentElement) {
									doc = request.responseText;
								}
								var caps = format.read(doc);

								me.setCapabilities(wmtsName, caps);
								me.parseCapabilitiesToLayers(wmtsName, caps,
										matrixSet);

							},
							failure : function() {
								alert("Trouble getting capabilities doc");
								OpenLayers.Console.error.apply(
										OpenLayers.Console, arguments);
							}
						});

					},

					/**
					 * This is a temporary solution actual capabilities to be
					 * read in backend
					 * 
					 */
					parseCapabilitiesToLayers : function(wmtsName, caps,
							matrixSet) {

						var me = this;
						var mapLayerService = this.mapLayerService;
						var getTileUrl = null;
						if( caps.operationsMetadata.GetTile.dcp.http.getArray ) {
							getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
						} else {
							getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
						}
						var capsLayers = caps.contents.layers;
						var contents = caps.contents;
						var matrixSet = contents.tileMatrixSets[matrixSet];

						for ( var n = 0; n < capsLayers.length; n++) {

							var spec = capsLayers[n];
							var mapLayerId = spec.identifier;
							var mapLayerName = spec.identifier;
							/*
							 * hack
							 */
							var mapLayerJson = {
								name : mapLayerId,
								minScale : 10000000,
								maxScale : 1,
								opacity : 100,
								wmtsName : mapLayerId,
								descriptionLink : "",
								orgName : "WMTS",
								type : "wmtslayer",
								legendImage : "",
								formats : {
									value : "text/html"
								},
								isQueryable : true,
								minScale : 4 * 4 * 4 * 4 * 40000,
								style : "",
								dataUrl : "",

								name : mapLayerId,
								opacity : 100,
								inspire : "WMTS",
								maxScale : 1
							};

							var layer = Oskari.clazz
									.create('Oskari.mapframework.wmts.domain.WmtsLayer');

							layer.setAsNormalLayer();
							layer.setId(mapLayerId);
							layer.setName(mapLayerJson.name);
							layer.setWmtsName(mapLayerJson.wmtsName);
							layer.setOpacity(mapLayerJson.opacity);
							layer.setMaxScale(mapLayerJson.maxScale);
							layer.setMinScale(mapLayerJson.minScale);
							layer.setDescription(mapLayerJson.info);
							layer.setDataUrl(mapLayerJson.dataUrl);
							layer.setOrganizationName(mapLayerJson.orgName);
							layer.setInspireName(mapLayerJson.inspire);
							layer.setWmtsMatrixSet(matrixSet)
							layer.setWmtsLayerDef(spec);

							layer.addWmtsUrl(getTileUrl);

							var styleBuilder = Oskari.clazz
									.builder('Oskari.mapframework.domain.Style');

							var styleSpec;

							for ( var i = 0, ii = spec.styles.length; i < ii; ++i) {
								styleSpec = spec.styles[i];
								var style = styleBuilder();
								style.setName(styleSpec.identifier);
								style.setTitle(styleSpec.identifier);

								layer.addStyle(style);
								if (styleSpec.isDefault) {
									layer.selectStyle(styleSpec.identifier);
									break;
								}
							}

							mapLayerService.addLayer(layer, false);

						}

					}
				});
