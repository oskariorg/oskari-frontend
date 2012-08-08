/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.OpenLayers.Format.GML.KTJkiiAtp
 * 
 * Aineistopalvelun datan esitt‰miseen tehtiin luokka, joka ymm‰rt‰‰
 * sijaintityypit, jotka PERIVƒT GML ComplexTypeist‰ eiv‰t‰ ole suoraan GML
 * Elementtej‰. N‰it‰ eiv‰t oletusclientit varmaan koskaan tule sulattamaan...
 *  // TEMP t‰n voi varmaan lopulta poistaa koko luokan // GML.v3 OLETUSTOTEUTUS
 * TEKEE OLETUKSIA, jotka est‰‰ ATP XML n‰kym‰st‰ // OpenLayersissa, joten t‰ss‰
 * pit‰‰ v‰h‰n fixaa // T‰m‰ EI ole valmis // TEMP muuttuja t‰m‰ voi laittaa
 * namespacesiin kohta
 */
var kmltp = "http://ktjkii.nls.fi/aineistopalvelu/aineistosiirto";

Oskari.$('Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiAtp', OpenLayers.Class(
		OpenLayers.Format.GML.v3, {
			alerted : 0,

			namespaces : {
				gml : "http://www.opengis.net/gml",
				xlink : "http://www.w3.org/1999/xlink",
				xsi : "http://www.w3.org/2001/XMLSchema-instance",

				wfs : "http://www.opengis.net/wfs"
			},

			initialize : function(options) {
				if (options == null)
					options = {};

				options = OpenLayers.Util.extend(options, {
					featurePrefix : "kmltp",
					featureNS : kmltp,
					featureType : [ "Kiinteistoraja", "Palsta", "Rajamerkki",
							"Kayttooikeusyksikko" ],
					geometryName : "sijainti"
				});

				OpenLayers.Format.GML.v3.prototype.initialize.apply(this,
						[ options ]);

				this.namespaces["kmltp"] = kmltp;
				this.namespaceAlias[kmltp] = "kmltp";

			},

			readers : {
				"gml" : OpenLayers.Util.applyDefaults( {},
						OpenLayers.Format.GML.v3.prototype.readers["gml"]),

				"kmltp" : OpenLayers.Util.applyDefaults( {
					"TietoaKiinteistorekisterista" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"palstat" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"rajamerkit" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"kiinteistorajat" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"rekisteriyksikot" : function(node, obj) {
						this.readChildNodes(node, obj);
					},
					"*" : function(node, obj) {
						// The node can either be named like the featureType, or
						// it
					// can be a child of the feature:featureType. Children can
					// be
					// geometry or attributes.
					var name;
					var local = node.localName
							|| node.nodeName.split(":").pop();

					if (!this.singleFeatureType
							&& (OpenLayers.Util
									.indexOf(this.featureType, local) != -1)) {
						name = "_typeName";
					} else if (local == this.featureType) {
						name = "_typeName";
					}

					if (name) {

						if (name == "_typeName")
							// window.alert("FEATURE "+local);

							this.readers["kmltp"][name].apply(this,
									[ node, obj ]);
					} else
						this.readChildNodes(node, obj);

				},
				"_typeName" : function(node, obj) {

					// window.alert("typeName");
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
					if (this.internalProjection && this.externalProjection
							&& feature.geometry) {
						feature.geometry.transform(this.externalProjection,
								this.internalProjection);
					}
					if (container.bounds) {
						feature.geometry.bounds = container.bounds;
					}
					obj.features.push(feature);
				},
				"sijainti" : function(node, obj) {
					this.readChildNodes(node, obj);
				},

				"Alue" : function(node, obj) {
					this.readers.gml["Polygon"].apply(this, [ node, obj ]);
				},
				"Murtoviiva" : function(node, obj) {
					this.readers.gml["LineString"].apply(this, [ node, obj ]);
				},
				"Piste" : function(node, obj) {
					this.readers.gml["Point"].apply(this, [ node, obj ]);
				}

				}, OpenLayers.Format.GML.Base.prototype.readers["feature"])

			},

			CLASS_NAME : "NLSFI.OpenLayers.Format.GML.KTJkiiAtp"

		}));
