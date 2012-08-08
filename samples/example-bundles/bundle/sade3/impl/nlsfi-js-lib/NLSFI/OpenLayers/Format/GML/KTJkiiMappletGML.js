/*
	2009-09 janne.korhonen<at>maanmittauslaitos.fi
	
	\LICENSE
	
	Class:  NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML
	
	Sovellettiin GML2 aikalaisformaatti MappletGML varten oma formaatti,
	jotta sis‰kk‰iset GML rakenteet ja Java Mappletin kannalta 
		'turhina' poisj‰tetyt featureMember
	sun muut elementit/elementtien puuttumiset siedet‰‰n.
	
 */
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/GML/Base.js
 */

/**
 * Class: NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML Parses Mapplet GML
 * version 2.
 * 
 * 
 * T‰n vois opettaa k‰sittelee Featuret '@name' attribuutin perusteella tai
 * FeatureCollectionin
 * 
 * @typen perusteella
 * 
 * Inherits from: - <OpenLayers.Format.GML.Base>
 */
Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML',
				OpenLayers
						.Class(
								OpenLayers.Format.GML.Base,
								{

									alerted : 0,

									/**
									 * Property: schemaLocation {String} Schema
									 * location for a particular minor version.
									 */
									schemaLocation : "http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",

									/**
									 * Constructor: OpenLayers.Format.GML.v2
									 * Create a parser for GML v2.
									 * 
									 * Parameters: options - {Object} An
									 * optional object whose properties will be
									 * set on this instance.
									 * 
									 * Valid options properties: featureType -
									 * {String} Local (without prefix) feature
									 * typeName (required). featureNS - {String}
									 * Feature namespace (required).
									 * geometryName - {String} Geometry element
									 * name.
									 */
									initialize : function(options) {
										OpenLayers.Format.GML.Base.prototype.initialize
												.apply(this, [ options ]);
										return this;
									},

									/**
									 * Property: readers Contains public
									 * functions, grouped by namespace prefix,
									 * that will be applied when a namespaced
									 * node is found matching the function name.
									 * The function will be applied in the scope
									 * of this parser with two arguments: the
									 * node being read and a context object
									 * passed from the parent.
									 */
									readers : {

										/**
										 * pit‰‰ selvit‰‰ miksi pit‰‰ kopsia
										 * koko setti feature ns:n jotta toimii.
										 * 'VOI' seota siit‰, ett‰ gml ==
										 * feature ns eli ei ole omaa featureNS.
										 */
										"feature" : OpenLayers.Util
												.applyDefaults(
														{
															"*" : function(
																	node, obj) {
																// The node can
																// either be
																// named like
																// the
																// featureType,
																// or it
																// can be a
																// child of the
																// feature:featureType.
																// Children can
																// be
																// geometry or
																// attributes.
																var name;
																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																if (!this.singleFeatureType
																		&& (OpenLayers.Util
																				.indexOf(
																						this.featureType,
																						local) != -1)) {
																	name = "_typeName";
																} else if (local == this.featureType) {
																	name = "_typeName";
																} else {
																	// Assume
																	// attribute
																	// elements
																	// have one
																	// child
																	// node and
																	// that the
																	// child
																	// is a text
																	// node.
																	// Otherwise
																	// assume it
																	// is a
																	// geometry
																	// node.
																	if (node.childNodes.length == 0
																			|| (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
																		if (this.extractAttributes) {
																			name = "_attribute";
																		}
																	} else {
																		name = "_geometry";
																	}
																}
																if (name) {
																	this.readers.feature[name]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);
																}
															},
															"_typeName" : function(
																	node, obj) {

																// feature:
																// obj.features
																// lis‰ttiin,
																// jotta
																// ymm‰rt‰‰
																// kiinteistˆn
																// palstat eli
																// palstat.xml

																var container = {
																	components : [],
																	attributes : {},
																	features : obj.features
																};
																this
																		.readChildNodes(
																				node,
																				container);
																// look for
																// common gml
																// namespaced
																// elements
																if (container.name) {
																	container.attributes.name = container.name;
																}

																// lis‰ys, jotta
																// saadaan
																// tyyppi
																// tietoon
																var featType = node
																		.getAttribute("name");
																if (featType)
																	container.attributes.featureClassName = featType;

																var feature = new OpenLayers.Feature.Vector(
																		container.components[0],
																		container.attributes);
																if (!this.singleFeatureType) {
																	feature.type = node.nodeName
																			.split(
																					":")
																			.pop();
																	feature.namespace = node.namespaceURI;
																}
																var fid = node
																		.getAttribute("fid")
																		|| this
																				.getAttributeNS(
																						node,
																						this.namespaces["gml"],
																						"id");
																if (fid) {
																	feature.fid = fid;
																}

																if (this.internalProjection
																		&& this.externalProjection
																		&& feature.geometry) {
																	feature.geometry
																			.transform(
																					this.externalProjection,
																					this.internalProjection);
																}
																if (container.bounds) {
																	feature.geometry.bounds = container.bounds;
																}

																if (feature.geometry != null) // skipataan
																								// sijainnittomat
																								// featuret
																	obj.features
																			.push(feature);
															},
															"_geometry" : function(
																	node, obj) {

																this
																		.readChildNodes(
																				node,
																				obj);
															},
															"_attribute" : function(
																	node, obj) {
																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																var value = this
																		.getChildValue(node);

																if (obj != null
																		&& obj.attributes) {
																	obj.attributes[local] = value;
																}

															},
															"LineString" : function(
																	node,
																	container) {

																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																if (!container.components) {
																	container.components = [];
																}
																container.components
																		.push(new OpenLayers.Geometry.LineString(
																				obj.points));
															},
															"coordinates" : function(
																	node, obj) {

																var str = this
																		.getChildValue(
																				node)
																		.replace(
																				this.regExes.trimSpace,
																				"");

																str = str
																		.replace(
																				this.regExes.trimComma,
																				",");
																var pointList = str
																		.split(this.regExes.splitSpace);
																var coords;
																var numPoints = pointList.length;
																var points = new Array(
																		numPoints);
																for ( var i = 0; i < numPoints; ++i) {
																	coords = pointList[i]
																			.split(",");
																	if (this.xy) {
																		points[i] = new OpenLayers.Geometry.Point(
																				coords[0],
																				coords[1],
																				coords[2]);
																	} else {
																		points[i] = new OpenLayers.Geometry.Point(
																				coords[1],
																				coords[0],
																				coords[2]);
																	}
																}

																obj.points = points;
															},

															"outerBoundaryIs" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																container.outer = obj.components[0];
															},
															"innerBoundaryIs" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																container.inner
																		.push(obj.components[0]);
															},
															"Box" : function(
																	node,
																	container) {
																var obj = {};
																this
																		.readChildNodes(
																				node,
																				obj);
																if (!container.components) {
																	container.components = [];
																}
																var min = obj.points[0];
																var max = obj.points[1];
																container.components
																		.push(new OpenLayers.Bounds(
																				min.x,
																				min.y,
																				max.x,
																				max.y));
															}
														},
														OpenLayers.Format.GML.Base.prototype.readers["gml"]),
										"wfs" : OpenLayers.Format.GML.Base.prototype.readers["wfs"]

									},

									CLASS_NAME : "NLSFI.OpenLayers.Format.GML.KTJkiiMappletGML"

								}));
