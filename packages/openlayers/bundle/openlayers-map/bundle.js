/**
 * @class Oskari.mapframework.bundle.SampleBundleInstance
 */

/**
 * @class Oskari.mapframework.bundle.SampleBundle
 * 
 */

(function() {

	var srcs = [];

	Oskari.clazz
			.define(
					"Oskari.mapframework.openlayers.map.Bundle",
					/**
					 * @constructor
					 * 
					 * Bundle's constructor is called when bundle is created. At
					 * this stage bundle sources have been loaded, if bundle is
					 * loaded dynamically.
					 * 
					 */
					function() {

						/*
						 * Any bundle specific classes may be declared within
						 * constructor to enable stealth mode
						 * 
						 * When running within map application framework -
						 * Bundle may refer classes declared with
						 * Oskari.clazz.define() - Bundle may refer classes
						 * declared with Ext.define - Bundle may refer classes
						 * declared within OpenLayers libary
						 * 
						 * 
						 */
					},

					{
						/*
						 * @method create
						 * 
						 * called when a bundle instance will be created
						 * 
						 */
						"create" : function() {
							return this;
						},

						/**
						 * @method update
						 * 
						 * Called by Bundle Manager to provide state information
						 * to bundle
						 * 
						 */
						"update" : function(manager, bundle, bi, info) {

						},
						"start" : function() {
						},
						"stop" : function() {
							// delete OpenLayers...just joking
						}

					},

					/**
					 * metadata
					 */
					{

						"protocol" : [ "Oskari.bundle.Bundle","Oskari.bundle.BundleInstance" ],
						"source" : {

							"scripts" : srcs,
							"resources" : [],

							"proj4jsFiles" : [
									"proj4js-1.0.1/lib/proj4js-compressed.js" ],

							"openlayersFiles" : [
									"OpenLayers/BaseTypes/Class.js",
									"OpenLayers/Util.js",
									"OpenLayers/BaseTypes.js",
									"OpenLayers/BaseTypes/Bounds.js",
									"OpenLayers/BaseTypes/Date.js",
									"OpenLayers/BaseTypes/Element.js",
									"OpenLayers/BaseTypes/LonLat.js",
									"OpenLayers/BaseTypes/Pixel.js",
									"OpenLayers/BaseTypes/Size.js",
									"OpenLayers/Console.js",
									"OpenLayers/Tween.js",
									"OpenLayers/Kinetic.js",
									"Rico/Corner.js",
									"Rico/Color.js",
									"OpenLayers/Ajax.js",
									"OpenLayers/Events.js",
									"OpenLayers/Request.js",
									"OpenLayers/Request/XMLHttpRequest.js",
									"OpenLayers/Projection.js",
									"OpenLayers/Map.js",
									"OpenLayers/Layer.js",
									"OpenLayers/Icon.js",
									"OpenLayers/Marker.js",
									"OpenLayers/Marker/Box.js",
									"OpenLayers/Popup.js",
									"OpenLayers/Tile.js",
									"OpenLayers/Tile/Image.js",
									"OpenLayers/Tile/Image/IFrame.js",
									// "OpenLayers/Tile/WFS.js",
									"OpenLayers/Layer/Image.js",
									// "OpenLayers/Layer/SphericalMercator.js",
									"OpenLayers/Layer/EventPane.js",
									"OpenLayers/Layer/FixedZoomLevels.js",
									// "OpenLayers/Layer/Google.js",
									// "OpenLayers/Layer/Google/v3.js",
									// "OpenLayers/Layer/VirtualEarth.js",
									// "OpenLayers/Layer/Yahoo.js",
									"OpenLayers/Layer/HTTPRequest.js",
									"OpenLayers/Layer/Grid.js",
									// "OpenLayers/Layer/MapGuide.js",
									// "OpenLayers/Layer/MapServer.js",
									// "OpenLayers/Layer/MapServer/Untiled.js",
									// "OpenLayers/Layer/KaMap.js",
									// "OpenLayers/Layer/KaMapCache.js",
									// "OpenLayers/Layer/MultiMap.js",
									"OpenLayers/Layer/Markers.js",
									"OpenLayers/Layer/Text.js",
									// "OpenLayers/Layer/WorldWind.js",
									// "OpenLayers/Layer/ArcGIS93Rest.js",
									"OpenLayers/Layer/WMS.js",
									"OpenLayers/Layer/WMS/Untiled.js",
									"OpenLayers/Layer/WMS/Post.js",
									"OpenLayers/Layer/WMTS.js",
									// "OpenLayers/Layer/ArcIMS.js",
									// "OpenLayers/Layer/GeoRSS.js",
									// "OpenLayers/Layer/Boxes.js",
									// "OpenLayers/Layer/XYZ.js",
									// "OpenLayers/Layer/Bing.js",
									// "OpenLayers/Layer/TMS.js",
									// "OpenLayers/Layer/TileCache.js",
									// "OpenLayers/Layer/Zoomify.js",
									// "penLayers/Layer/ArcGISCache.js",
									"OpenLayers/Popup/Anchored.js",
									"OpenLayers/Popup/AnchoredBubble.js",
									"OpenLayers/Popup/Framed.js",
									"OpenLayers/Popup/FramedCloud.js",
									"OpenLayers/Feature.js",
									"OpenLayers/Feature/Vector.js",
									"OpenLayers/Feature/WFS.js",
									"OpenLayers/Handler.js",
									"OpenLayers/Handler/Click.js",
									"OpenLayers/Handler/Hover.js",
									"OpenLayers/Handler/Point.js",
									"OpenLayers/Handler/Path.js",
									"OpenLayers/Handler/Polygon.js",
									"OpenLayers/Handler/Feature.js",
									"OpenLayers/Handler/Drag.js",
									"OpenLayers/Handler/Pinch.js",
									"OpenLayers/Handler/RegularPolygon.js",
									"OpenLayers/Handler/Box.js",
									"OpenLayers/Handler/MouseWheel.js",
									"OpenLayers/Handler/Keyboard.js",
									"OpenLayers/Control.js",
									"OpenLayers/Control/Attribution.js",
									"OpenLayers/Control/Button.js",
									"OpenLayers/Control/ZoomBox.js",
									"OpenLayers/Control/ZoomToMaxExtent.js",
									"OpenLayers/Control/DragPan.js",
									"OpenLayers/Control/Navigation.js",
									"OpenLayers/Control/PinchZoom.js",
									"OpenLayers/Control/TouchNavigation.js",
									"OpenLayers/Control/MouseDefaults.js",
									"OpenLayers/Control/MousePosition.js",
									"OpenLayers/Control/OverviewMap.js",
									"OpenLayers/Control/KeyboardDefaults.js",
									"OpenLayers/Control/PanZoom.js",
									"OpenLayers/Control/PanZoomBar.js",
									"OpenLayers/Control/ArgParser.js",
									"OpenLayers/Control/Permalink.js",
									"OpenLayers/Control/Scale.js",
									"OpenLayers/Control/ScaleLine.js",
									"OpenLayers/Control/Snapping.js",
									"OpenLayers/Control/Split.js",
									"OpenLayers/Control/LayerSwitcher.js",
									"OpenLayers/Control/DrawFeature.js",
									"OpenLayers/Control/DragFeature.js",
									"OpenLayers/Control/ModifyFeature.js",
									"OpenLayers/Control/Panel.js",
									"OpenLayers/Control/SelectFeature.js",
									"OpenLayers/Control/NavigationHistory.js",
									"OpenLayers/Control/Measure.js",
									"OpenLayers/Control/WMSGetFeatureInfo.js",
									"OpenLayers/Control/WMTSGetFeatureInfo.js",
									// "OpenLayers/Control/Graticule.js",
									"OpenLayers/Control/TransformFeature.js",
									// "OpenLayers/Control/SLDSelect.js",
									"OpenLayers/Geometry.js",
									"OpenLayers/Geometry/Rectangle.js",
									"OpenLayers/Geometry/Collection.js",
									"OpenLayers/Geometry/Point.js",
									"OpenLayers/Geometry/MultiPoint.js",
									"OpenLayers/Geometry/Curve.js",
									"OpenLayers/Geometry/LineString.js",
									"OpenLayers/Geometry/LinearRing.js",
									"OpenLayers/Geometry/Polygon.js",
									"OpenLayers/Geometry/MultiLineString.js",
									"OpenLayers/Geometry/MultiPolygon.js",
									"OpenLayers/Geometry/Surface.js",
									"OpenLayers/Renderer.js",
									"OpenLayers/Renderer/Elements.js",
									"OpenLayers/Renderer/NG.js",
									"OpenLayers/Renderer/SVG.js",
									"OpenLayers/Renderer/SVG2.js",
									"OpenLayers/Renderer/Canvas.js",
									"OpenLayers/Renderer/VML.js",
									"OpenLayers/Layer/Vector.js",
									// "OpenLayers/Layer/PointGrid.js",
									"OpenLayers/Layer/Vector/RootContainer.js",
									"OpenLayers/Strategy.js",
									"OpenLayers/Strategy/Filter.js",
									"OpenLayers/Strategy/Fixed.js",
									"OpenLayers/Strategy/Cluster.js",
									// "OpenLayers/Strategy/Paging.js",
									"OpenLayers/Strategy/BBOX.js",
									// "OpenLayers/Strategy/Save.js",
									// "OpenLayers/Strategy/Refresh.js",
									 "OpenLayers/Filter.js",
									 "OpenLayers/Filter/FeatureId.js",
									 "OpenLayers/Filter/Logical.js",
									 "OpenLayers/Filter/Comparison.js",
									 "OpenLayers/Filter/Spatial.js",
									 "OpenLayers/Filter/Function.js",
									"OpenLayers/Protocol.js",
									"OpenLayers/Protocol/HTTP.js",
									// "OpenLayers/Protocol/SQL.js",
									// "OpenLayers/Protocol/SQL/Gears.js",
									// "OpenLayers/Protocol/WFS.js",
									// "OpenLayers/Protocol/WFS/v1.js",
									// "OpenLayers/Protocol/WFS/v1_0_0.js",
									// "OpenLayers/Protocol/WFS/v1_1_0.js",
									// "OpenLayers/Protocol/Script.js",
									// "OpenLayers/Protocol/SOS.js",
									// "OpenLayers/Protocol/SOS/v1_0_0.js",
									// "OpenLayers/Layer/PointTrack.js",
									// "OpenLayers/Layer/GML.js",
									"OpenLayers/Style.js",
									"OpenLayers/Style2.js",
									"OpenLayers/StyleMap.js",
									"OpenLayers/Rule.js",
									"OpenLayers/Format.js",
									//"OpenLayers/Format/QueryStringFilter.js",
									 "OpenLayers/Format/XML.js",
									 "OpenLayers/Format/XML/VersionedOGC.js",
									 /*
									 * "OpenLayers/Format/Context.js",
									 * "OpenLayers/Format/ArcXML.js",
									 * "OpenLayers/Format/ArcXML/Features.js",
									 * "OpenLayers/Format/GML.js",
									 * "OpenLayers/Format/GML/Base.js",
									 * "OpenLayers/Format/GML/v2.js",
									 * "OpenLayers/Format/GML/v3.js",
									 * "OpenLayers/Format/Atom.js",
									 * "OpenLayers/Format/KML.js",
									 * "OpenLayers/Format/GeoRSS.js",
									 * "OpenLayers/Format/WFS.js",
									 * "OpenLayers/Format/WFSCapabilities.js",
									 * "OpenLayers/Format/WFSCapabilities/v1.js",
									 * "OpenLayers/Format/WFSCapabilities/v1_0_0.js",
									 * "OpenLayers/Format/WFSCapabilities/v1_1_0.js",
									 * "OpenLayers/Format/WFSDescribeFeatureType.js",
									 * "OpenLayers/Format/WMSDescribeLayer.js",
									 * "OpenLayers/Format/WMSDescribeLayer/v1_1.js",
									 * "OpenLayers/Format/WKT.js",
									 * "OpenLayers/Format/CQL.js",
									 * "OpenLayers/Format/OSM.js",
									 * "OpenLayers/Format/GPX.js",
									 * "OpenLayers/Format/Filter.js",
									 * "OpenLayers/Format/Filter/v1.js",
									 * "OpenLayers/Format/Filter/v1_0_0.js",
									 * "OpenLayers/Format/Filter/v1_1_0.js",
									 */
									/*"OpenLayers/Format/SLD.js",
									"OpenLayers/Format/SLD/v1.js",
									"OpenLayers/Format/SLD/v1_0_0.js",*/
									/**/
									  "OpenLayers/Format/OWSCommon.js",
									  "OpenLayers/Format/OWSCommon/v1.js",
									  "OpenLayers/Format/OWSCommon/v1_0_0.js",
									  "OpenLayers/Format/OWSCommon/v1_1_0.js",
									 /** "OpenLayers/Format/CSWGetDomain.js",
									 * "OpenLayers/Format/CSWGetDomain/v2_0_2.js",
									 * "OpenLayers/Format/CSWGetRecords.js",
									 * "OpenLayers/Format/CSWGetRecords/v2_0_2.js",
									 * "OpenLayers/Format/WFST.js",
									 * "OpenLayers/Format/WFST/v1.js",
									 * "OpenLayers/Format/WFST/v1_0_0.js",
									 * "OpenLayers/Format/WFST/v1_1_0.js",
									 * "OpenLayers/Format/Text.js",
									 * "OpenLayers/Format/JSON.js",
									 * "OpenLayers/Format/GeoJSON.js",
									 * "OpenLayers/Format/WMC.js",
									 * "OpenLayers/Format/WMC/v1.js",
									 * "OpenLayers/Format/WMC/v1_0_0.js",
									 * "OpenLayers/Format/WMC/v1_1_0.js",
									 * "OpenLayers/Format/WCSGetCoverage.js",
									 * "OpenLayers/Format/WMSCapabilities.js",
									 * "OpenLayers/Format/WMSCapabilities/v1.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_1.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_1_0.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_1_1.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_3.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_3_0.js",
									 * "OpenLayers/Format/WMSCapabilities/v1_1_1_WMSC.js",
									 * "OpenLayers/Format/WMSGetFeatureInfo.js",
									 * "OpenLayers/Format/SOSCapabilities.js",
									 * "OpenLayers/Format/SOSCapabilities/v1_0_0.js",
									 * "OpenLayers/Format/SOSGetFeatureOfInterest.js",
									 * "OpenLayers/Format/SOSGetObservation.js",
									 * "OpenLayers/Format/OWSContext.js",
									 * "OpenLayers/Format/OWSContext/v0_3_1.js",
									 * "OpenLayers/Format/WMTSCapabilities.js",
									 * "OpenLayers/Format/WMTSCapabilities/v1_0_0.js",
									 * "OpenLayers/Format/WPSCapabilities.js",
									 * "OpenLayers/Format/WPSCapabilities/v1_0_0.js",
									 * "OpenLayers/Format/WPSDescribeProcess.js",
									 * "OpenLayers/Format/WPSExecute.js",
									 * "OpenLayers/Format/XLS.js",
									 * "OpenLayers/Format/XLS/v1.js",
									 * "OpenLayers/Format/XLS/v1_1_0.js",
									 * "OpenLayers/Format/OGCExceptionReport.js",
									 * "OpenLayers/Layer/WFS.js",
									 */
									"OpenLayers/Control/GetFeature.js",
									"OpenLayers/Control/MouseToolbar.js",
									"OpenLayers/Control/NavToolbar.js",
									"OpenLayers/Control/PanPanel.js",
									"OpenLayers/Control/Pan.js",
									"OpenLayers/Control/ZoomIn.js",
									"OpenLayers/Control/ZoomOut.js",
									"OpenLayers/Control/ZoomPanel.js",
									"OpenLayers/Control/EditingToolbar.js",
									"OpenLayers/Control/Geolocate.js",
									"OpenLayers/Symbolizer.js",
									"OpenLayers/Symbolizer/Point.js",
									"OpenLayers/Symbolizer/Line.js",
									"OpenLayers/Symbolizer/Polygon.js",
									"OpenLayers/Symbolizer/Text.js",
									"OpenLayers/Symbolizer/Raster.js",
									"OpenLayers/Lang.js",
									"OpenLayers/Lang/en.js" ]
						},
						"bundle" : {
							"manifest" : {
								"Bundle-Identifier" : "openlayers-map",
								"Bundle-Name" : "mapframework.openlayers-map.Bundle",
								"Bundle-Tag" : {
									"mapframework" : true
								},
								"Bundle-Author" : [ {
									"Name" : "jjk",
									"Organisation" : "nls.fi",
									"Temporal" : {
										"Start" : "2009",
										"End" : "2011"
									},
									"Copyleft" : {
										"License" : {
											"Part" : "OpenLayers",
											"License-Name" : "BSD",
											"License-Online-Resource" : "http://svn.openlayers.org/trunk/openlayers/license.txt"
										},
										"License" : {
											"Part" : "Proj4JS",
											"License-Name" : "LGPL/BSD",
											"License-Online-Resource" : ""
										}
									}
								} ],
								"Bundle-Name-Locale" : {
									"fi" : {
										"Name" : " mapframework.core.Bundle",
										"Title" : " mapframework.core.Bundle"
									},
									"en" : {}
								},
								"Bundle-Version" : "1.0.0",
								"Import-Namespace" : [ "Oskari" ],
								"Import-Bundle" : {}
							}
						}
					});

	var metas = Oskari.clazz
			.metadata('Oskari.mapframework.openlayers.map.Bundle');

	var libpath = "../../../../map-application-framework/lib/";

	/**
	 * proj4js
	 */
	 
	var projfiles = metas.meta.source.proj4jsFiles;

	for ( var n = 0, len = projfiles.length; n < len; n++) {
		srcs.push( {
			"type" : "text/javascript",
			"src" : libpath + projfiles[n]
		});
	}
	
	srcs.push( {
		"type" : "text/javascript",
		"src" : "defs.js"
	});
	
	/**
	 * openlayers
	 */
	var openlayersFiles = metas.meta.source.openlayersFiles;
	var openlayerspath = libpath + "OpenLayers-2.11/lib/";

	for ( var n = 0, len = openlayersFiles.length; n < len; n++) {
		srcs.push( {
			"type" : "text/javascript",
			"src" : openlayerspath + openlayersFiles[n]
		});
	}

	/**
	 * Install this bundle by instantating the Bundle Class
	 * 
	 */
	Oskari.bundle_manager.installBundleClass("openlayers-map",
			"Oskari.mapframework.openlayers.map.Bundle");

})();
