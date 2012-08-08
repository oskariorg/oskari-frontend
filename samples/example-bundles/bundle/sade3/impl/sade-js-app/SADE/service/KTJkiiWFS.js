Oskari.clazz.define('Oskari.poc.sade3.service.KTJkiiWFS',
		function(mapplet, url) {
			this.mapplet = mapplet;
			this.url = url;

		}, {

			/**
			 * 
			 */
			KiinteistorajanSijaintitiedot : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "KiinteistorajanSijaintitiedot",
					geometryName : "sijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"Kiinteistörajat (KTJkii-WFS) Live", true, false,
						featureOpts, ktjkiiWfsUrl);
				wfsLwq.worker.featurePropertyNames = [ 'sijainti' ];
				wfsLwq.layer.previewTile = 'kiinra';

				return wfsLwq;
			},

			/**
			 * 
			 */
			PalstanTunnuspisteenSijaintitiedot : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "PalstanTunnuspisteenSijaintitiedot",
					geometryName : "tunnuspisteSijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#800000',
						label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
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
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"Palstan tunnuspisteet (KTJkii-WFS) Live", true, false,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.strategy.minZoom = 10;
				wfsLwq.layer.previewTile = 'pts';

				return wfsLwq;
			},

			/**
			 * 
			 */
			PalstanTietoja : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "PalstanTietoja",
					geometryName : "sijainti",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#800000',
						label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
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
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"Palstan Tietoja (KTJkii-WFS) ", false, true,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.strategy.minZoom = 10;
				wfsLwq.layer.previewTile = 'pt';
				wfsLwq.layer.setOpacity(0.7);

				return wfsLwq;
			},

			/**
			 * 
			 */
			RekisteriyksikonTietoja : function(layerName) {
				var mapplet = this.mapplet;
				var featureOpts = {
					featureType : "RekisteriyksikonTietoja",
					featureNS : "http://xml.nls.fi/ktjkiiwfs/2010/02",
					featurePrefix : "ktjkiiwfs"
				};
				var ktjkiiWfsUrl = this.url;

				var pstyles = new OpenLayers.StyleMap( {
					"default" : new OpenLayers.Style( {
						pointRadius : 3,
						strokeColor : "red",
						strokeWidth : 2,
						fillColor : '#0000A0',
						// label : "${tekstiKartalla}",
						fontColor : "navy",
						fontSize : "8pt",
						fontFamily : "Sans Serif",
						fontWeight : "normal",
						labelAlign : "rt"
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
				var wfsLwq = mapplet.createWfsResponseLWQ(layerName,
						"RekisteriyksikonTietoja (KTJkii-WFS)", false, true,
						featureOpts, ktjkiiWfsUrl, pstyles);
				wfsLwq.worker.featurePropertyNames = [ 'kiinteistotunnus',
						'olotila', 'rekisteriyksikkolaji', 'rekisterointipvm',
						'lakkaamispvm', 'nimi', 'maapintaala', 'vesipintaala',
						'rekisteriyksikonPalstanTietoja'

				];

				wfsLwq.strategy.minZoom = 5;
				wfsLwq.layer.previewTile = 'rt';
				wfsLwq.layer.setOpacity(0.7);

				return wfsLwq;
			}

		});