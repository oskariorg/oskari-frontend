/**
	
	class: 
		NLSFI.OpenLayers.Factory		
	
	description:		 
	
		NLS.fi OpenLayers Map and WMS Layer factory

	usage:
		
		see /index.js
				
	author:		
		janne.korhonen <at> maanmittauslaitos.fi
		
		contains some open source code by logica.fi in 
			methods calculateLayerScales and mapScales .

	requirements:
		OpenLayers 2.8 
		Proj4js
	
	license:

		BSD-style OpenLayers compatible license 
		
		Copyright (c) 2010- NLS.fi		

		OpenLayers.org license info:		
		http://svn.openlayers.org/trunk/openlayers/license.txt
		
	
**/

NLSFI.OpenLayers.Factory = OpenLayers.Class({
	
	/* nls.fi: default projection EPSG:3067 */
	mapProj: null,
	
	/* logica.fi: open source for www.paikkatietoikkuna.fi 
	   nls.fi: recalculated as float values
	*/
	mapScales: [
		5669294.4, 2834647.2, 1417323.6, 566929.44, 283464.72, 141732.36,
		56692.944, 28346.472, 11338.5888, 5669.2944, 2834.6472, 1417.3236, 708.6618
	],

	/* nls.fi: default set of wms layers and scales and formats */
	wmsLayerSpecs: {
		'ortokuva': { minScale: 1999.0,maxScale: 1.0,format:"image/jpeg" },
		'peruskartta': { minScale: 25000.0,maxScale:2000.0,format:"image/png" },
		'maastokartta_50k': { minScale: 54000.0,maxScale: 26000.0,format:"image/gif" },
		'maastokartta_100k': { minScale: 130000.0,maxScale: 55000.0,format:"image/gif" },
		'maastokartta_250k': { minScale: 245000.0,maxScale: 135000.0,format:"image/gif" },
		'maastokartta_500k': { minScale: 550000.0,maxScale: 280000.0,format:"image/gif" },
		'yleiskartta_1m': { minScale: 1350000.0,maxScale: 560000.0,format:"image/gif" },
		'yleiskartta_2m': { minScale: 2500000.0,maxScale: 1380000.0,format:"image/gif" },
		'yleiskartta_4m': { minScale: 5000000.0,maxScale: 2600000.0,format:"image/gif" },
		'yleiskartta_8m': { minScale: 1.0E7,maxScale: 5100000.0,format:"image/gif"}
		
	},
	
	/* nls.fi: calls createProjs for projection EPSG:3067 */
	initialize: function(popts) {
		var opts = popts || {};	
		
		this.createProjs();
		

	},

	/* nls.fi: creates default nls.fi raster layers */
	createLayers: function(popts) {
		var opts = popts || {};
		var wmsUrl = opts.url;
		var opacity = opts.opacity || 0.5;
		var layers = [];
		var wmsLayerSpecs = this.wmsLayerSpecs;
		for( name in wmsLayerSpecs  ) {
			var spec = wmsLayerSpecs[name];
			
			var layer = this.createLayer(name,spec,wmsUrl);
			layer.opacity = opacity;
			
			layers.push(layer);			
		}
	
		return layers;
	},
	
	/* nls.fi: creates a invisible base layer (optional) */	
	createBaseLayer: function() {

		var base = 
			new OpenLayers.Layer("BaseLayer",
				{	
					layerId:0, 
					isBaseLayer: true, 
					displayInLayerSwitcher: false
				});

		return base;	
	},
	
	/* nls.fi: creates a wms layer per spec and url, layer name == wms layer name */		
	createLayer: function(name,spec,wmsUrl,ptransparent) {

		var layerScales = 
			this.calculateLayerScales(spec.maxScale,spec.minScale);			

	
		var layer = new OpenLayers.Layer.WMS( 
			name,
			wmsUrl,{
				layers: name,
				transparent: ptransparent ? ptransparent : false,
				format: spec.format
			}, {
				layerId: name, 
				scales: layerScales, 
				isBaseLayer: false,
				displayInLayerSwitcher: true,
				visibility:true,
				buffer:0
			}
		);

		layer.previewTile = name;
	          
		return layer;
	},



	/* nls.fi create A map (id == null render later ) */				
	createMap: function(id,popts) {
		var opts = popts || {};
		var mapScales = this.mapScales;
		var proj = this.mapProj;
		var controls = opts.controls;
		
		var map = new OpenLayers.Map(id,{
				allOverlays: opts.allOverlays,
				maxExtent: new OpenLayers.Bounds(0,0,10000000,10000000),
				units: 'm',
				scales: mapScales,
				projection: proj,
				controls: controls
			},{
				buffer:0
			}
		);          

		return map;
	},
	
	/* nls.fi (spatialreference.org) (initialise projs without httpying spatialreference.org) */					
	createProjs: function() {
	
		if( !Proj4js )
			throw "Proj4js not found";
			
		Proj4js.defs["EPSG:3067"] = "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs";			
		
		this.mapProj = new OpenLayers.Projection("EPSG:3067");
		
	},
	
	/* logica.fi: open source for www.paikkatietoikkuna.fi */
	calculateLayerScales: function(maxScale, minScale) {
	
		var layerScales ;
		var mapScales = this.mapScales;
		if (minScale && maxScale) {
			layerScales = [];
			for (var i = 0; i < mapScales.length; i++) {
				if (minScale >= mapScales[i] && maxScale <= mapScales[i])
					layerScales.push(mapScales[i]);
			}
		}
	
		return layerScales; 
	},
	
		
	/* nls.fi (openlayers.org): create default set of controls */				
	createControls: function() {

		var controls = [
			new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher({'ascending':false}),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.MousePosition(),
//            new OpenLayers.Control.OverviewMap(),
            new OpenLayers.Control.KeyboardDefaults()
		];

		return controls;

	}
		
	
});
