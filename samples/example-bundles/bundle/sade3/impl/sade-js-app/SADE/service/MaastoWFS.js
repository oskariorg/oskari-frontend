Oskari.clazz.define('Oskari.poc.sade3.service.MaastoWFS', function(mapplet, url) {
	this.mapplet = mapplet;
	this.url = url;

}, {
	/**
	 * 
	 */
	MaastotietokannanOsoitepiste : function(layerName) {

		/*
		 * 
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * 
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 * 
		 */

		var mapplet = this.mapplet;

		var featureOpts = {

			featureType : "Osoitepiste",

			geometryName : "sijainti",

			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",

			featurePrefix : "oso",

			otherFeatureTypes : [ {

				typeName : 'Osoite'

			} ]

		};

		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,

		"Osoitepiste (Rakennustiedot)", false, true, featureOpts,

		ktjkiiWfsUrl);

		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',

		'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',

		'kuntatunnus', 'osoite' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;

	},

	/**
	 * 
	 */
	MaastotietokannanOsoitenimi : function(layerName) {

		/*
		 * 
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * 
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
		 * 
		 */

		var mapplet = this.mapplet;

		var featureOpts = {

			featureType : "Osoitenimi",

			geometryName : "sijainti",

			featureNS : "http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02",

			featurePrefix : "oso",

			otherFeatureTypes : [ {

				typeName : 'Osoite'

			} ]

		};

		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,

		"Osoitenimi (Rakennustiedot)", false, true, featureOpts,

		ktjkiiWfsUrl);

		wfsLwq.worker.featurePropertyNames = [

		'sijainti', 'rakennustunnus',

		'katunimi', 'katunumero',

		'kieli',

		'postinumero',

		'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',

		'kuntatunnus' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;

	}

});
