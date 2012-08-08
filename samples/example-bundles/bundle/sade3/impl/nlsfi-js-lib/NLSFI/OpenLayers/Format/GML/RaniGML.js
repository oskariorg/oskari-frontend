/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/*
 TILAPÄINEN KIERTÄÄ OPENLAYERS BUGIA

 */

/**
 * @requires OpenLayers/Format/GML/Base.js
 */

/**
 * Class: OpenLayers.Format.GML.v3 Parses GML version 3.
 * 
 * Inherits from: - <OpenLayers.Format.GML.Base>
 */
Oskari.$('Oskari.NLSFI.OpenLayers.Format.GML.RaniGML', OpenLayers.Class(
		OpenLayers.Format.GML.v3, {

			/**
			 * Constructor: OpenLayers.Format.GML.v3 Create a parser for GML v3.
			 * 
			 * Parameters: options - {Object} An optional object whose
			 * properties will be set on this instance.
			 * 
			 * Valid options properties: featureType - {String} Local (without
			 * prefix) feature typeName (required). featureNS - {String} Feature
			 * namespace (required). geometryName - {String} Geometry element
			 * name.
			 */
			initialize : function(options) {
				OpenLayers.Format.GML.v3.prototype.initialize.apply(this,
						[ options ]);
			},

			/**
			 * Property: readers Contains public functions, grouped by namespace
			 * prefix, that will be applied when a namespaced node is found
			 * matching the function name. The function will be applied in the
			 * scope of this parser with two arguments: the node being read and
			 * a context object passed from the parent.
			 */
			readers : {
				"gml" : OpenLayers.Util.applyDefaults( {

				}, OpenLayers.Format.GML.v3.prototype.readers["gml"]),
				"feature" : OpenLayers.Util.applyDefaults( {
					"_typeName" : function(node, obj) {
						var container = {
							components : [],
							attributes : {}
						};
						this.readChildNodes(node, container);
						// look for common gml namespaced elements
						if (container.name) {
							container.attributes.name = container.name;
						}

						var feature = new OpenLayers.Feature.Vector(
								container.components[0], container.attributes);
						if (!this.singleFeatureType) {
							feature.type = node.nodeName.split(":").pop();
							feature.namespace = node.namespaceURI;
						}
						var fid = node.getAttribute("fid")
								|| this.getAttributeNS(node,
										this.namespaces["gml"], "id");
						if (fid) {
							feature.fid = fid;
						}

						if (container.bounds) {
							feature.geometry.bounds = container.bounds;
						}

						if (this.internalProjection && this.externalProjection
								&& feature.geometry) {
							feature.geometry.transform(this.externalProjection,
									this.internalProjection);
						}
						// window.alert("JIHUU "+fid+" "+feature.geometry+"
						// "+feature.geometry.bounds);
						obj.features.push(feature);
					}
				}, OpenLayers.Format.GML.v3.prototype.readers["feature"]),
				"wfs" : OpenLayers.Util.applyDefaults( {},
						OpenLayers.Format.GML.v3.prototype.readers["wfs"])
			},

			CLASS_NAME : "NLSFI.OpenLayers.Format.GML.RaniGML"

		}));
