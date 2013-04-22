/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelPlot
 *
 * Plot extra graphics for parcel map (area, Id, new and old boundary monuments).
 *
 *

 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelPlot',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
 */
function(instance) {
	this.instance = instance;
	this.parcelLayer = null;
	this.boundaryLayer = null;
	this.pointLayer = null;
	this._map = null;

	var smPolygon = new OpenLayers.StyleMap({
		'default' : {
			strokeColor : "#00FF00",
			strokeOpacity : 1,
			strokeWidth : 0,
			fillColor : "red",
			fillOpacity : 0.2,
			labelAlign : "bm",
			label : "${nimi}\n${area} ha",
			fontColor : "black",
			fontSize : "18px",
			fontFamily : "Courier New, monospace",
			fontWeight : "bold"
		}
	});

	this.parcelLayer = new OpenLayers.Layer.Vector("NewParcel", {
		styleMap : smPolygon
	});

	var smLine = new OpenLayers.StyleMap({
		'default' : {
			strokeColor : "red",
			strokeOpacity : 1,
			strokeWidth : 2,
			strokeDashstyle : "dash",
			fillColor : "red",
			fillOpacity : 1.0,
			label : "- ${length} -",
			labelAlign : "cm",
			labelXOffset : "${deltax}",
			labelYOffset : "${deltay}"
		}
	});

	this.boundaryLayer = new OpenLayers.Layer.Vector("NewBoundary", {
		styleMap : smLine
	});

	var smPoint = new OpenLayers.StyleMap({
		'default' : {
			strokeColor : "red",
			strokeOpacity : 1,
			strokeWidth : 1,
			fillColor : "red",
			fillOpacity : 0.5,
			pointRadius : 6,
			label : "${pnro}",
			graphicName : "triangle",
			labelXOffset : 10,
			labelYOffset : 10
		}
	});
	this.pointLayer = new OpenLayers.Layer.Vector("NewPoints", {
		styleMap : smPoint
	});

}, {
	/**
	 * @method plotParcel
	 * Plot feature to temp layer
	 * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
	 * @param {String} placeName Name of the place.
	 * @param {String} placeDescription Description of the place.
	 * @param {Function} cb Requires information about the success as boolean parameter.
	 */
	plotParcel : function(feature, placeName, placeDescription, cb) {
		this._plotNewParcel(feature, placeName, placeDescription, cb);
		this._plotNewBoundary(feature, cb);
		cb(true);
        this._createGeoJSON();
        $('.tool-print').trigger('click');
	},

	/**
	 * @method plotParcel
	 * Create and save GeoJSON from parcel plot
     */
    _createGeoJSON : function() {

        var geojson_format = new OpenLayers.Format.GeoJSON();
        var geojs = {
            "name" : "Parcel Print",
            "type" : "FeatureCollection",
            "crs" :  {
                "type" : "EPSG",
                "properties" : {
                    "code" : 3067
                }
            },
            "features" : []
        };

        var parcel = geojson_format.write(this.parcelLayer.features);
        var jsonParcel = JSON.parse(parcel);
        var featureJSONParcel = {
            "type" : "Feature",
            "geometry" : jsonParcel,
            "properties" : {
                "geom_type" : "polygon",
                "buffer_radius" : "0"
            }
        };
        geojs.features.push(featureJSONParcel);

        var boundary = geojson_format.write(this.parcelLayer.features);
        var jsonBoundary = JSON.parse(parcel);
        var featureJSONBoundary = {
            "type" : "Feature",
            "geometry" : jsonParcel,
            "properties" : {
                "geom_type" : "line",
                "buffer_radius" : "0"
            }
        };
        geojs.features.push(featureJSONBoundary);

        var point = geojson_format.write(this.parcelLayer.features);
        var jsonPoint = JSON.parse(parcel);
        var featureJSONPoint = {
            "type" : "Feature",
            "geometry" : jsonParcel,
            "properties" : {
                "geom_type" : "point",
                "buffer_radius" : "0"
            }
        };
        geojs.features.push(featureJSONPoint);

        var drawPlugin = this.instance.getDrawPlugin();
        var printMap = drawPlugin.getSandbox().getMap();
        printMap.GeoJSON = geojs;

debugger;
    },

	/**
	 * @method clearParcelMap
	 * Clear  temp layers of Parcel Map
	 *
	 */
	clearParcelMap : function() {
		if (this.parcelLayer)
			this.parcelLayer.removeAllFeatures();
		if (this.boundaryLayer)
			this.boundaryLayer.removeAllFeatures();
		if (this.pointLayer)
			this.pointLayer.removeAllFeatures();
	},
	/**
	 * @method _plotNewParcel
	 * Plot features to OL temp layer.
	 * @param {OpenLayers.Feature.Vector} feature to be plotted as  new Parcel.
	 * @param {String} placeName Name of the place.
	 * @param {String} placeDescription Description of the place.
	 * @param {Fuction} cb Requires information about the success as boolean parameter.
	 */
	_plotNewParcel : function(featurein, placeName, placeDescription, cb) {
		var me = this;
		var feature = new OpenLayers.Feature.Vector(featurein.geometry, null, this.parcelLayer.style);
		// Set the place and description for the feature if they are given.
		// If they are not given, then do not set them.
		if (feature.attributes) {
			if (placeName) {
				// Here we suppose that server uses "nimi" property for the place name.
				feature.attributes.nimi = placeName;
			}
			if (placeDescription || typeof placeDescription === "string") {
				// Set the place description also if an empty string is given.
				// Here we suppose that server uses "kuvaus" property for the place description.
				feature.attributes.kuvaus = placeDescription;
			}
		}
		if (feature) {
			// Plot extra graphics for Parcel map
			var drawplug = this.instance.getDrawPlugin();
			if (drawplug._map.getLayerIndex(this.parcelLayer) == -1) {
				drawplug._map.addLayer(this.parcelLayer);
				drawplug._map.setLayerIndex(this.parcelLayer, 1001);
			}

			// remove possible old drawing
			this.parcelLayer.removeAllFeatures();

			// Add area to feature properties
			var harea = feature.geometry.getArea() / 10000.0;
			// ha unit
			feature.attributes.area = harea.toFixed(2);
			// add parcel feature to plot
			// Assign style - use default style
			feature.style = this.parcelLayer.style;

			var features = [feature];
			this.parcelLayer.addFeatures(features);
			// Remove orig graphics
			drawplug.drawLayer.removeAllFeatures();
			this.parcelLayer.redraw();

		}

	},
	/**
	 * @method _plotNewBoundary
	 * Plot features to OL temp layer.
	 * @param {OpenLayers.Feature.Vector} feature to be plotted as  new Parcel.
	 * @param {Fuction} cb Requires information about the success as boolean parameter.
	 */
	_plotNewBoundary : function(feature, cb) {
		var me = this;
		var features = [];
		var pointfeatures = [];
		// Get new boundaries
		var drawplug = this.instance.getDrawPlugin();
		if (drawplug._map.getLayerIndex(this.boundaryLayer) == -1) {
			drawplug._map.addLayer(this.boundaryLayer);
			drawplug._map.setLayerIndex(this.boundaryLayer, 1002);
		}
		if (drawplug._map.getLayerIndex(this.pointLayer == -1)) {
			drawplug._map.addLayer(this.pointLayer);
			drawplug._map.setLayerIndex(this.pointLayer, 1003);
		}

		// remove possible old drawing
		this.boundaryLayer.removeAllFeatures();
		this.pointLayer.removeAllFeatures();

		//running pno for new boundary points
		var pno = 1;

		//for ( i = 0; i < drawplug.drawLayer.features.length; i++) {
		var f = drawplug.editLayer.features[0];
		if (f !== null && f !== undefined) {

			// Loop components
			for (var k = 0; k < f.geometry.components.length; k++) {
				// loop segments
				var geometry = f.geometry.components[k];
				var nodes = geometry.getVertices();

				for (var j = 0; j < nodes.length - 1; j++) {
					var lon = nodes[j].x;
					var lat = nodes[j].y;
					var lon2 = nodes[j + 1].x;
					var lat2 = nodes[j + 1].y;

					var center_lonlat1 = new OpenLayers.LonLat(lon, lat);
					var center_px1 = drawplug._map.getPixelFromLonLat(center_lonlat1);
					var center_lonlat2 = new OpenLayers.LonLat(lon2, lat2);
					var center_px2 = drawplug._map.getPixelFromLonLat(center_lonlat2);
					var deltax = (center_px2.x + center_px1.x) / 2. - center_px1.x;
					var deltay = (center_px2.y + center_px1.y) / 2. - center_px1.y;
					var points = new Array(new OpenLayers.Geometry.Point(lon, lat), new OpenLayers.Geometry.Point(lon2, lat2));
					var line = new OpenLayers.Geometry.LineString(points);
					//line.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
					var lineFeature = new OpenLayers.Feature.Vector(line, null, this.boundaryLayer.style);
					lineFeature.attributes.length = lineFeature.geometry.getLength().toFixed(2);
					lineFeature.attributes.deltax = deltax;
					lineFeature.attributes.deltay = -deltay;
					features.push(lineFeature);
					var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat), null, this.pointLayer.style);
					pointFeature.attributes.pnro = pno++;
					pointfeatures.push(pointFeature);
					if (j == nodes.length - 2) {
						var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon2, lat2), null, this.pointLayer.style);
						pointFeature.attributes.pnro = pno++;
						pointfeatures.push(pointFeature);
					}
				}
				// if polygon --> make 1st and last point segemnt
				if (geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon" || geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
					var lon = nodes[nodes.length - 1].x;
					var lat = nodes[nodes.length - 1].y;
					var lon2 = nodes[0].x;
					var lat2 = nodes[0].y;

					var center_lonlat1 = new OpenLayers.LonLat(lon, lat);
					var center_px1 = drawplug._map.getPixelFromLonLat(center_lonlat1);
					var center_lonlat2 = new OpenLayers.LonLat(lon2, lat2);
					var center_px2 = drawplug._map.getPixelFromLonLat(center_lonlat2);
					var deltax = (center_px2.x + center_px1.x) / 2. - center_px1.x;
					var deltay = (center_px2.y + center_px1.y) / 2. - center_px1.y;
					var points = new Array(new OpenLayers.Geometry.Point(lon, lat), new OpenLayers.Geometry.Point(lon2, lat2));
					var line = new OpenLayers.Geometry.LineString(points);
					//line.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
					var lineFeature = new OpenLayers.Feature.Vector(line, null, this.boundaryLayer.style);
					lineFeature.attributes.length = lineFeature.geometry.getLength().toFixed(2);
					lineFeature.attributes.deltax = deltax;
					lineFeature.attributes.deltay = -deltay;
					features.push(lineFeature);
				}
			}

			//}
			if (pointfeatures.length > 0) {
				// Plot extra graphics for Parcel map

				this.pointLayer.addFeatures(pointfeatures);
				this.pointLayer.redraw();

			}
			if (features.length > 0) {
				// Plot extra graphics for Parcel map
				this.boundaryLayer.addFeatures(features);
				this.boundaryLayer.redraw();

			}
		}
		// Remove orig graphics
		drawplug.getEditLayer().removeAllFeatures();
		drawplug.getMarkerLayer().clearMarkers();
	}
});
