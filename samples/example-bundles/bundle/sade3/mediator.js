Oskari.clazz.define('Oskari.poc.sade3.Mediator', function() {

	if (!Ext.ClassManager.get('RakennuksenOminaisuustiedot')) {
		Ext.define('RakennuksenOminaisuustiedot', {
			extend : 'Ext.data.Model',
			fields : [ {
				name : 'rakennustunnus'
			}, {
				name : 'kiinteistotunnus'
			}, {
				name : 'tarkistusmerkki'
			}, {
				name : 'rakennusnumero'
			}, {
				name : 'tilanNimi'
			}, {
				name : 'kiinteistoyksikonMaaraalatunnus'
			}, {
				name : 'syntymahetkenRakennustunnus'
			}, {
				name : 'postinumero'
			}, {
				name : 'rakennustunnuksenVoimassaolo'
			}, {
				name : 'valmistumispaiva'
			}, {
				name : 'rakennuspaikanHallintaperuste'
			}, {
				name : 'kayttotarkoitus'
			}, {
				name : 'kaytossaolotilanne'
			}, {
				name : 'julkisivumateriaali'
			}, {
				name : 'kerrosala'
			}, {
				name : 'kerrosluku'
			}, {
				name : 'kokonaisala'
			}, {
				name : 'tilavuus'
			}, {
				name : 'lammitystapa'
			}, {
				name : 'lammonlahde'
			}, {
				name : 'rakennusmateriaali'
			}, {
				name : 'rakennustapa'
			}, {
				name : 'sahko'
			}, {
				name : 'kaasu'
			}, {
				name : 'viemari'
			}, {
				name : 'vesijohto'
			}, {
				name : 'lamminvesi'
			}, {
				name : 'aurinkopaneeli'
			}, {
				name : 'hissi'
			}, {
				name : 'ilmastointi'
			}, {
				name : 'saunojenLukumaara'
			}, {
				name : 'uimaaltaidenLukumaara'
			}, {
				name : 'vaestosuojanKoko'
			}, {
				name : 'viemariliittyma'
			}, {
				name : 'vesijohtoliittyma'
			}, {
				name : 'sahkoliittyma'
			}, {
				name : 'kaasuliittyma'
			}, {
				name : 'kaapeliliittyma'
			}, {
				name : 'poikkeuslupa'
			}, {
				name : 'perusparannus'
			}, {
				name : 'perusparannuspaiva'
			}, {
				name : 'sijaintiepavarmuus'
			}, {
				name : 'luontiAika'
			}, {
				name : 'muutosAika'
			}

			]
		});
	}

	var store = Ext.create('Ext.data.Store', {
		model : 'RakennuksenOminaisuustiedot',
		autoLoad : false,

		proxy : {
			type : 'memory',
			reader : {

				type : 'json',
				model : 'RakennuksenOminaisuustiedot',
				totalProperty : 'total',
				successProperty : 'success',
				idProperty : 'id',
				root : 'data',
				messageProperty : 'message'

			}
		}
	});

	// Typical Store collecting the Proxy, Reader and Writer together.
		this['RakennuksenOminaisuustiedot'] = store;
	}, {

		getStore : function(n) {
			return this[n];
		},
		reset : function() {
			this.getStore('RakennuksenOminaisuustiedot').removeAll();
		}
	});