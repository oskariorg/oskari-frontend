
Oskari.clazz.define('Oskari.poc.sade3.Layer',
		function(lm,layerId,spec) {
					this.layerId = layerId;
					this.layer = null;
					this.spec = spec;
					this.layerImpl = null;
					this.lm = lm;
				},{
						getLayerId: function() {
							return this.layerId;
						},
						setOpacity: function(o) {
							this.opacity = o;
						},
						getVisibility : function() {
							return true;
						},
						addFeatures: function(feats) {
							var event = this.lm.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
									feats,
									"application/nlsfi-x-openlayers-feature",
									"EPSG:3067", 
									null);// "replace");
						
							this.lm.sandbox.notifyAll(event);

						},
						destroyFeatures : function() {
							var event = this.lm.sandbox.getEventBuilder("FeaturesAvailableEvent")(this.layer,
									[],
									"application/nlsfi-x-openlayers-feature",
									"EPSG:3067",
									"replace");
						
							this.lm.sandbox.notifyAll(event);
						}
				});

Oskari.clazz.define('Oskari.poc.sade3.LayerManager',
				function(sandbox,layersAndWorkers,defaults,shared,name) {
					this.layersAndWorkers = layersAndWorkers;
					this.layers = {};
					this.defaults = defaults;
					this.sandbox = sandbox;
					this.shared = shared;
					this.name = name;
				},
				{
					getName: function() {
						return this.name;
					},
					styledLayerDescriptors: {
						'default' : '<StyledLayerDescriptor version="1.0.0" '+
						'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" '+ 
					    '    xmlns="http://www.opengis.net/sld" '+
					    '    xmlns:ogc="http://www.opengis.net/ogc" '+ 
					    '    xmlns:xlink="http://www.w3.org/1999/xlink" '+ 
					    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> '+
					    '  <NamedLayer> '+
					    '    <Name>Simple point with stroke</Name> '+
					     '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> '+
					      '    <FeatureTypeStyle><Rule>'+
					      '<PointSymbolizer>'						+
					      ' <Graphic><Mark><WellKnownName>circle</WellKnownName><Fill>'+
					              '        <CssParameter name="fill">#00A000</CssParameter>'+
					             '       </Fill><Stroke>'+
					            '          <CssParameter name="stroke">#000000</CssParameter>'+
					           '           <CssParameter name="stroke-width">2</CssParameter>'+
					          '          </Stroke></Mark><Size>12</Size></Graphic>'+
					         '     </PointSymbolizer>'+
					         '<LineSymbolizer>'						+
					         	'<Stroke>'+
						            '          <CssParameter name="stroke">#a00000</CssParameter>'+
						           '           <CssParameter name="stroke-width">4</CssParameter>'+
						          '          </Stroke>'+
						         '     </LineSymbolizer>'+
					         '<PolygonSymbolizer>'						+
						      ' <Fill>'+
						              '        <CssParameter name="fill">#c0d0e0</CssParameter>'+
						             '       </Fill><Stroke>'+
						            '          <CssParameter name="stroke">#0000a0</CssParameter>'+
						           '           <CssParameter name="stroke-width">2</CssParameter>'+
						          '          </Stroke>'+
						         '     </PolygonSymbolizer>'+
					         
					         '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>'+
					         '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>'+
					         '</Rule></FeatureTypeStyle>'+
					        '</UserStyle></NamedLayer></StyledLayerDescriptor>'
					},
					
					createLayer : function(name, visibility, styles) {
						if( this.shared && this.sharedLayer )
							return this.sharedLayer;
						
						var mapLayerId = name, keepLayersOrder = true, isBasemap = false;
						var defaultSLD = this.styledLayerDescriptors['default'];
						var spec = {
							"name" : name,
							"wmsName" : "1",
							"orgName" : "SADE",
							"type" : "vectorlayer", 
							"styles" : {
								"title" : "Default",
								"legend" : "",
								"name" : "1"
							},
							"descriptionLink" : "http://en.wikipedia.org/",
							"leaf" : "true",
							"legendImage" : "",
							"info" : "",
							"isQueryable" : true,
							"formats" : {
								"value" : "text/html"
							},
							"id" : mapLayerId,
							"minScale" : this.defaults.minScale,
							"maxScale" : this.defaults.maxScale,
							"style" : "",
							"dataUrl" : "",
							"wmsUrl" : "x",
							"opacity" : 70,
							"checked" : "false",
							"styledLayerDescriptor" : 
								defaultSLD
						};
					
						
					var layer = Oskari.clazz.create('Oskari.poc.sade3.Layer',this,name,spec);
					this.layers[name] = layer;
					if( this.shared && !this.sharedLayer )
						this.sharedLayer = layer;
				
					try {
					
						
					var request = this.sandbox.getRequestBuilder(
					"AddExternalMapLayerRequest")( mapLayerId, spec );
					this.sandbox.request(this.getName(), request);
					
					} catch(err){
					}					
					/*
					 * Note: AfterAddExternalMapLayerEvent sets this.layer
					 */
					
					
					/*
					 * 
					 */
					var requestAddToMap = this.sandbox.getRequestBuilder(
							"AddMapLayerRequest")( mapLayerId,
							keepLayersOrder);

					this.sandbox.request(this.getName(), requestAddToMap);
					

					
					
					
					
					return layer;
					
					},

					
					registerLayerImpl: function(layer) {
						
						console.log("### registerLayerImpl",layer);
						if( this.shared) 
							this.sharedLayer.layer = layer;
						else 
							this.layers[layer.getId()].layer = layer; 
					},
					
					destroyLayers: function() {
						 for( p in this.layers ) {
							 this.destroyLayer(p); 
						 }
						
					},
					
					destroyLayer: function(layerId) {
						
						var requestRemovalFromMap = this.sandbox.getRequestBuilder(
								"RemoveMapLayerRequest")( layerId);

						this.sandbox.request(this.getName(), requestRemovalFromMap);
						

						
						/**
						 * remove map layer spec
						 */
						var request = this.sandbox.getRequestBuilder(
						"RemoveExternalMapLayerRequest")( layerId);

						this.sandbox.request(this.getName(), request);
						
						

					},
					
					/** mapadapter * */
					
					zoomTo: function(lon,lat,scale) {
						var zoom  = this.sandbox.getMap().getZoom();
						var req = this.sandbox.getRequestBuilder("MapMoveRequest")(lon,lat,zoom,false,20000);
						this.sandbox.request(this.name,req);
						
					},
					clearFeatures: function() {
						if( this.shared) 
							this.sharedLayer.destroyFeatures();
					},
					
					highlightMapLayer: function(){
						var mapLayerId =  this.sharedLayer.getLayerId();
				        this.sandbox.request(/** "SelectedLayersModule", */
				        		this.name,
				        		this.sandbox.getRequestBuilder('HighlightMapLayerRequest')(mapLayerId));
					},
					dimMapLayer: function(){
						var mapLayerId =  this.sharedLayer.getLayerId();
				        this.sandbox.request(/** "SelectedLayersModule", */
				        		this.name,
				        		this.sandbox.getRequestBuilder('DimMapLayerRequest')(mapLayerId));
					}

				});
