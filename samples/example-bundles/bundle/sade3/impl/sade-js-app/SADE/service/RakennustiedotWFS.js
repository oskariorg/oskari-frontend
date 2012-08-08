Oskari.clazz.define('Oskari.poc.sade3.service.RakennustiedotWFS', function(
		mapplet, url) {
	this.mapplet = mapplet;
	this.url = url;

}, {
	/**
	 * 
	 */
	RakennuksenOminaisuustiedot : function(layerName) {
		var mapplet = this.mapplet;
		var featureOpts = {
			featureType : "RakennuksenOminaisuustiedot",
			geometryName : "sijainti",
			featureNS : "http://xml.nls.fi/Rakennustiedot/VTJRaHu/2009/02",
			featurePrefix : "rhr"
		};
		var ktjkiiWfsUrl = this.url;

		var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
				"RakennuksenOminaisuustiedot (Rakennustiedot)", false, true,
				featureOpts, ktjkiiWfsUrl);
		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',
				'kiinteistotunnus', 'postinumero', 'osoite', 'tarkistusmerkki',
				'rakennusnumero', 'tilanNimi',
				'kiinteistoyksikonMaaraalatunnus',
				'syntymahetkenRakennustunnus', 'rakennustunnuksenVoimassaolo',
				'valmistumispaiva', 'rakennuspaikanHallintaperuste',
				'kayttotarkoitus', 'kaytossaolotilanne', 'julkisivumateriaali',
				'kerrosala', 'kerrosluku', 'kokonaisala', 'tilavuus',
				'lammitystapa', 'lammonlahde', 'rakennusmateriaali',
				'rakennustapa', 'sahko', 'kaasu', 'viemari', 'vesijohto',
				'lamminvesi', 'aurinkopaneeli', 'hissi', 'ilmastointi',
				'saunojenLukumaara', 'uimaaltaidenLukumaara',
				'vaestosuojanKoko', 'viemariliittyma', 'vesijohtoliittyma',
				'sahkoliittyma', 'kaasuliittyma', 'kaapeliliittyma',
				'poikkeuslupa', 'perusparannus', 'perusparannuspaiva',
				'sijaintiepavarmuus', 'luontiAika', 'muutosAika'

		];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;
	},
	
	/**
	 * 
	 */
	RakennuksenOsoitepiste : function(layerName) {
		/*
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
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
	RakennuksenOsoitenimi : function(layerName) {
		/*
		 * typeName="oso:Osoitepiste" srsName="EPSG:3067"
		 * xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
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
		wfsLwq.worker.featurePropertyNames = [ 'sijainti', 'rakennustunnus',
				'katunimi', 'katunumero', 'kieli', 'postinumero',
				'kiinteistotunnus', 'kuntanimiFin', 'kuntanimiSwe',
				'kuntatunnus' ];

		wfsLwq.layer.previewTile = 'oso';

		return wfsLwq;
	}

});