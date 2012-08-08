/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * 
 * Class: KTJkiiWFS.Mapplet
 * 
 * T�nne on koottu joukko metodeja, joilla lis�t��n kartalle
 * OpenLayers.Layer.Vectoreihin aineistoja ja alustetaan aineistojen hakua
 * varten NLSFI.Worker.Worker pohjaiset hakutoiminnot.
 * 
 * Sana koottu sen jo kertoo... Pit�� toteuttaa siten, ett� riippuvuudet
 * muodostuvat hallitusti. Nyt pit�� ladata kaikki Workerit vaikkei haluaisi
 * mit��n!
 * 
 */

Oskari.clazz.define("Oskari.poc.sade3.SADEMapplet",
/**
 * Method: initialize
 * 
 * Alustaa Mappletin perusasetukset: layersAndWorkers ja projXXX luokkamuuttujat
 * .createMapplet() metodi vasta oikeasti rakentaa Mappletin toimintakuntoon
 * 
 */

function(options) {

	this.mapControls = null;
	this.map = null;
	this.layersAndWorkers = null;
	this.mapProj = null;
	this.dataProj = null;
	this.googleProj = null;
	this.vlayer = null,

	this.layersAndWorkers = {};
	this.dataProj = new OpenLayers.Projection("EPSG:3067");
	this.googleProj = new OpenLayers.Projection("EPSG:4326");

	this.urls = options.urls;

	return this;
}, {

	setMap : function(map) {
		this.map = map;
	},

	setLayerManager : function(lm) {
		this.layerManager = lm;
	},

	/**
	 * Method: createWfsLWQ
	 * 
	 * T�m� luo OpenLayers.Layerin ja sille NLSFI.Worker menettelyn mukaisen
	 * operaattorin, joka hakee tietoja Layeriin
	 * 
	 * lwqId tason tunniste name tason otsikko isStrategy p�ivitet��nk�
	 * dataa Strategyn mukaisesti visibility laitetaanko n�kyv�ksi
	 * featureOpts on oikeasti layerOptions rakenne WFSInspectorilta url on
	 * palvelun WFS palvelun URL pstyles valinnainen StyleMap
	 * 
	 */

	createLayerImpl : function(name, visibility, styles) {

		return this.layerManager.createLayer(name, visibility, styles);

	},

	/* Generic */
	createWfsResponseLWQ : function(lwqId, name, isStrategy, visibility,
			featureOpts, url, pstyles) {

		var lwq = {
			layer : null,
			worker : null,
			queue : null,
			strategy : null,
			lwqId : lwqId,
			layerOptions : featureOpts

		};

		var styles = pstyles ? pstyles : new OpenLayers.StyleMap( {
			"default" : new OpenLayers.Style( {
				pointRadius : 3,
				strokeColor : "red",
				strokeWidth : 2,
				fillColor : '#800000'
			}),
			"tile" : new OpenLayers.Style( {
				strokeColor : "#008080",
				strokeWidth : 5,
				fillColor : "#ffcc66",
				fillOpacity : 0.5
			}),
			"select" : new OpenLayers.Style( {
				fillColor : "#66ccff",
				strokeColor : "#3399ff"
			})
		});

		var tileQueue = Oskari.clazz
				.create('Oskari.NLSFI.OpenLayers.Strategy.TileQueue');

		var strategy = {
			tileQueue : tileQueue
		};
		var layerStrategies = [];

		lwq.queue = tileQueue;

		lwq.strategy = strategy;
		lwq.layer = this.createLayerImpl(lwqId, visibility, styles);

		lwq.worker = Oskari.clazz.create('Oskari.NLSFI.Worker.WFSWorker', {
			strategy : strategy,
			featureType : featureOpts.featureType,
			geometryName : featureOpts.geometryName,
			featureNS : featureOpts.featureNS,
			featurePrefix : featureOpts.featurePrefix,
			responseFormat : featureOpts.responseFormat,
			featureTypeSchema : featureOpts.featureTypeSchema,
			otherFeatureTypes : featureOpts.otherFeatureTypes,
			responseFormat : new (Oskari
					.$('Oskari.NLSFI.OpenLayers.Format.GML.WFSResponse'))( {
				featureNS : featureOpts.featureNS,
				featureType : featureOpts.featureType,
				geometryName : featureOpts.geometryName, // "sijainti",
				featurePrefix : featureOpts.featurePrefix,
				externalProjection : this.dataProj, // NOT SET!!!
				internalProjection : this.mapProj,
				featureTypeSchema : featureOpts.featureTypeSchema,
				otherFeatureTypes : featureOpts.otherFeatureTypes,
				extractAttributes : true
			})
		});

		lwq.worker.description = name;
		lwq.worker
				.create(lwq.layer, this.map, this.mapProj, this.dataProj, url);

		this.layersAndWorkers[lwqId] = lwq;

		return lwq;
	},

	CLASS_NAME : "SADEMapplet"

});