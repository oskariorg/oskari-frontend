/**
 *
 * class: NLSFI.OpenLayers.Factory
 *
 * description:
 *
 * NLS.fi OpenLayers Map and WMS Layer factory
 *
 * usage:
 *
 * see /index.js
 *
 * author: jjk <at> maanmittauslaitos.fi
 *
 * contains some open source code by logica.fi in methods calculateLayerScales
 * and mapScales .
 *
 * requirements: OpenLayers 2.8 or newer / Proj4js
 *
 * license:
 *
 * BSD-style OpenLayers compatible license
 *
 * Copyright (c) 2010- NLS.fi
 *
 * OpenLayers.org license info:
 * http://svn.openlayers.org/trunk/openlayers/license.txt
 *
 *
 */

function init() {

	/* projection */
	Proj4js.defs["EPSG:3067"] = "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs";
	
	/* map controls */
	var controls = [
        new OpenLayers.Control.Attribution(),
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.LayerSwitcher()
    ];

	/* the map */
	var map = new OpenLayers.Map('map', {
		units : "m",
		controls : controls,
		zoom : 8,
		center : new OpenLayers.LonLat(385576, 6675364),
		projection : new OpenLayers.Projection("EPSG:3067"),
		resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1],// 0.5, 0.25],
		maxExtent : new OpenLayers.Bounds(0, 0, 10000000, 10000000)
	});

	

	/* a default base layer */
	var base = new OpenLayers.Layer("BaseLayer", {
		layerId : 0,
		isBaseLayer : true,
		displayInLayerSwitcher : false
	});
	map.addLayers([base]);
	
	map.setCenter(map.getCenter(),8);

	/* let's read WMTS caps from sample file and use a predefined matrixSet */
	var format = new WMTSFormatWithLimits();

	var matrixSetId = 'EPSG_3067_MML';
	var capsPath = 'caps.xml';

	/** let's issue a XHR request */
	OpenLayers.Request.GET({
		url : capsPath,
		params : {
			SERVICE : "WMTS",
			VERSION : "1.0.0",
			REQUEST : "GetCapabilities"
		},
		success : function(request) {
			var doc = request.responseXML;
			if(!doc || !doc.documentElement) {
				doc = request.responseText;
			}
			
			/* Let's read WMTS capabilities with Limits support */
			var caps = format.read(doc);

			/* Let's figure out getTile URL */
			var getTileUrl = null;
			if(caps.operationsMetadata.GetTile.dcp.http.getArray) {
				getTileUrl = caps.operationsMetadata.GetTile.dcp.http.getArray;
			} else {
				getTileUrl = caps.operationsMetadata.GetTile.dcp.http.get;
			}
			
			/* Let's add layers to the map */
			var capsLayers = caps.contents.layers;
			var contents = caps.contents;
			var matrixSet = contents.tileMatrixSets[matrixSetId];

			for(var n = 0; n < capsLayers.length; n++) {

				var spec = capsLayers[n];
				var mapLayerId = spec.identifier;
				var mapLayerName = spec.identifier;

				/* Let's choose some style */
				var styleSpec;

				for(var i = 0, ii = spec.styles.length; i < ii; ++i) {
					styleSpec = spec.styles[i];

					if(styleSpec.isDefault) {
						break;
					}
				}

				/* Let's create the layer WITH LIMITS support */
				/* This fixed implementation does not send invalid request
				 * 	for out-of-limits layers
				 */
				var wmtsLayer = new WMTS_Layer({
					visibility : true,
					transparent : true,
					name : mapLayerName,
					// id : layerId, // this would break OpenLayers
					format : "image/png",
					url : getTileUrl,
					layer : mapLayerId,
					style : styleSpec.identifier,
					matrixIds : matrixSet.matrixIds,
					matrixSet : matrixSet.identifier,
					isBaseLayer : false,
					buffer : 0,
					layerDef : spec // MUST HAVE othewise sends out-of-limits requests
				});

				/* Let's add layer to map */
				map.addLayers([wmtsLayer]);

			}

		},
		failure : function() {
			alert("Trouble getting capabilities doc");
			OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
		}
	});

	window.map = map;
}