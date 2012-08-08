/**
 * 
 * 2009-12 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.OpenLayers.Format.GML.WFSResponse
 * 
 * T�m� luokka k�sittelee WFS palvelun vastauksen. Ker�ilee jonkinmoisen
 * tilaston.
 * 
 * Jatkossa opetetaan k�sittelem��n my�s Exceptionit
 *  - Kiert�� OpenLayers boundedBy projektiomuunnottomuus bugin
 * 
 * 
 * 
 */

Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.WFSResponse',
				OpenLayers
						.Class(
								OpenLayers.Format.GML.v3,
								{
									arcInterPoints : null,
									alerted : true, // let's not

									stats : {},

									featureTypeSchema : null,
									otherFeatureTypes : null,
									knownFeatureTypes : {},

									namespaces : {
										gml : "http://www.opengis.net/gml",
										xlink : "http://www.w3.org/1999/xlink",
										xsi : "http://www.w3.org/2001/XMLSchema-instance",
										wfs : "http://www.opengis.net/wfs",
										ows : "http://www.opengis.net/ows"
									},

									initialize : function(options) {

										OpenLayers.Format.GML.v3.prototype.initialize
												.apply(this, [ options ]);

										this.singleFeatureType = false;

										this.namespaces[options.nsPrefix] = options.ns;
										this.namespaceAlias[options.ns] = options.nsPrefix;

										this
												.setNamespace("feature",
														options.ns)

										this.featureTypeSchema = options.featureTypeSchema;
										this.otherFeatureTypes = options.otherFeatureTypes;

										if (this.featureTypeSchema != null)
											this.knownFeatureTypes[this.featureTypeSchema.typeName] = this.featureTypeSchema;

										if (this.otherFeatureTypes != null) {
											for ( var n = 0; n < this.otherFeatureTypes.length; n++) {
												var ftSchema = this.otherFeatureTypes[n];
												this.knownFeatureTypes[ftSchema.typeName] = ftSchema;
											}
										}
									},

									readers : {
										// K�sitell��n ainakin
										// ExceptionReport
										// http://schemas.opengis.net/ows/1.1.0/owsExceptionReport.xsd
										"ows" : {
											"ExceptionReport" : function(node,
													obj) {

												var version = node
														.getAttribute("version");
												var exceptionsInfo = {
													version : version,
													exceptions : null
												};

												this.readChildNodes(node,
														exceptionsInfo);

												// laitetaan ihka oikea
												// JavaScript virhe
												// joskus
												if (exceptionsInfo.exceptions
														&& exceptionsInfo.exceptions.length > 0) {
													// throw exceptionsInfo;
													this.stats['ERROR_COUNT'] = exceptionsInfo.exceptions.length;
												}

											},
											"Exception" : function(node, obj) {

												var exceptionCode = node
														.getAttribute("exceptionCode");

												var exceptionInfo = {
													exceptionCode : exceptionCode,
													exceptionTexts : null
												};

												this.readChildNodes(node, obj);

												if (obj.exceptions == null)
													obj.exceptions = [];
												obj.exceptions
														.push(exceptionInfo);

											},
											"ExceptionText" : function(node,
													obj) {

												var exceptionText = this
														.getChildValue(node);
												// Viskotaan JavaScript
												// Exception

												if (obj.exceptionTexts == null)
													obj.exceptionTexts = [];
												obj.exceptionTexts
														.push(exceptionText ? exceptionText
																: "?");
												if (exceptionText)
													this.stats['ERROR_LAST'] = exceptionText;

											}
										},
										"gml" : OpenLayers.Util
												.applyDefaults(
														{
															"*" : function(
																	node, obj) {
																this
																		.readChildNodes(
																				node,
																				obj);
															}
														},
														OpenLayers.Format.GML.v3.prototype.readers["gml"]),

										"wfs" : OpenLayers.Util
												.applyDefaults(
														{},
														OpenLayers.Format.GML.v3.prototype.readers["wfs"]),

										"feature" : OpenLayers.Util
												.applyDefaults(
														{
															"_feature" : function(
																	node, obj) {
																var container = {
																	interpolate : "linear",
																	components : [],
																	attributes : {},
																	features : obj.features,
																	featSchema : obj.featSchema,
																	featType : obj.featType
																};
																// this.readKnownProperties(node,
																// container);
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

																// window.console.log("READING
																// at
																// "+obj.featType);

																container.attributes.featType = obj.featType;

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

																// siirretty
																// ennen
																// internal
																// external
																// transformia,
																// joka
																// tarvittaessa
																// poistaa
																// boundsin, jos
																// transformi
																// tehd��n
																// t�m�
																// aiheuttaa
																// hakujen
																// onnistumista,
																// mutta
																// mit��n ei
																// n�y
																// virheen,
																// jos
																// tehd��n
																// vasta
																// transformin
																// j�lkeen
																if (container.bounds
																		&& feature.geometry) {
																	feature.geometry.bounds = container.bounds;
																}

																if (this.internalProjection
																		&& this.externalProjection
																		&& feature.geometry) {
																	feature.geometry
																			.transform(
																					this.externalProjection,
																					this.internalProjection);
																}

																if (feature.geometry) {
																	var statsKey = "geometry";
																	if (this.stats[statsKey] == null)
																		this.stats[statsKey] = 1;
																	else
																		this.stats[statsKey] += 1;
																}

																obj.features
																		.push(feature);
															},

															"*" : function(
																	node, obj) {

																var local = node.localName
																		|| node.nodeName
																				.split(
																						":")
																				.pop();
																var ns = node.namespaceURI;

																if (ns == this.featureNS) {
																	if (this.stats[local] == null)
																		this.stats[local] = 1;
																	else
																		this.stats[local] += 1;
																}

																if (ns == this.featureNS
																		&& local == this.featureType) {
																	obj.featType = local;
																	obj.featSchema = this.knownFeatureTypes[local];
																	this.readers["feature"]["_feature"]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);

																} else if (ns == this.featureNS
																		&& this.knownFeatureTypes[local] != null) {

																	var statsKey = "HACK_"
																			+ local;
																	if (this.stats[statsKey] == null)
																		this.stats[statsKey] = 1;
																	else
																		this.stats[statsKey] += 1;

																	obj.featType = local;
																	obj.featSchema = this.knownFeatureTypes[local];
																	this.readers["feature"]["_feature"]
																			.apply(
																					this,
																					[
																							node,
																							obj ]);

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
																			var value = this
																					.getChildValue(node);

																			// !=
																			// null
																			// lis�tty
																			// muistaakseni
																			if (obj.attributes != null)
																				obj.attributes[local] = value;
																		}
																	}
																}

																this
																		.readChildNodes(
																				node,
																				obj);
															}

														},
														OpenLayers.Format.GML.Base.prototype.readers["feature"])
									},

									readNode : function(node, obj) {
										if (!obj) {
											obj = {};
										}

										var nsAlias = this.namespaceAlias[node.namespaceURI];
										var group = this.readers[nsAlias];

										var local = node.localName
												|| node.nodeName.split(":")
														.pop();
										if (group) {
											var reader = group[local]
													|| group["*"];
											if (reader) {
												reader.apply(this,
														[ node, obj ]);
											}
										}
										return obj;
									},

									read : function(data) {

										if (typeof data == "string") {
											data = OpenLayers.Format.XML.prototype.read
													.apply(this, [ data ]);
										}
										if (data && data.nodeType == 9) {
											data = data.documentElement;
										}

										this.stats = {};

										var features = [];
										this.readNode(data, {
											features : features
										});
										if (features.length == 0) {
											// look for gml:featureMember
											// elements
											var elements = this
													.getElementsByTagNameNS(
															data,
															this.namespaces.gml,
															"featureMember");
											if (elements.length) {
												for ( var i = 0, len = elements.length; i < len; ++i) {
													this
															.readNode(
																	elements[i],
																	{
																		features : features
																	});
												}
											} else {
												// look for gml:featureMembers
												// elements (this is v3, but
												// does no harm here)
												var elements = this
														.getElementsByTagNameNS(
																data,
																this.namespaces.gml,
																"featureMembers");
												if (elements.length) {
													// there can be only one
													this
															.readNode(
																	elements[0],
																	{
																		features : features
																	});
												}
											}
										}

										return features;
									},

									CLASS_NAME : "NLSFI.OpenLayers.Format.GML.WFSResponse"

								}));
