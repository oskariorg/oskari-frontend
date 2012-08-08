
/*
 * @class Oskari.mapplet.Adapter
 */
Oskari.clazz
		.define(
				'Oskari.mapplet.Adapter',
				function(applet) {
					this.applet = applet;
					this.mapplet = null;
				},
				{
					getMapplet : function(m) {
						if (this.mapplet)
							return this.mapplet;
						this.mapplet = document.applets[this.applet];
						return this.mapplet;
					},
					setCenter : function(n, e, zoom) {
						var me = this;
						window.setTimeout(function() {
							me.getMapplet().receiveMappletMsg("overview",
									"doRecenter?" + e + "&" + n);
							if (zoom) {
								me.setZoom(zoom);
							}
						}, 100);
					},
					scales : [ 8000000, 4000000, 2000000, 800000, 400000,
							200000, 80000, 40000, 16000, 8000, 4000, 2000, 1000 ],
					setScale : function(scale) {
						/*
						 * [1] "doSetScale?8000000" String
						 */
						this.getMapplet().receiveMappletMsg("overview",
								"doSetScale?" + scale);
					},
					getCenter: function() {
						var x = this.getMapplet().kysy("cx");
						var y = this.getMapplet().kysy("cy");
						
						return { x: x, y: y };
					},
					getScale: function() {
						return this.getMapplet().kysy("scale");
					},
					setZoom : function(zoom) {
						var scale = this.scales[zoom];
						var mapplet = this.getMapplet();
						mapplet.receiveMappletMsg("overview", "doSetScale?"
								+ scale);
					},
					getZoom: function() {
						var scale = this.getMapplet().kysy("scale");
						for( var n = 0 ; n < this.scales.length;n++) 
							if( scale == this.scales[n])
								return n;
						
						return null;
					},

					mappletTagTemplate : {
						tag : 'applet',
						mayscript : "true",
						align : "middle",
						width : "100%",
						height : "100%",
						name : "map",
						archive : "ktjkii-mapplet_20101109_o.zip",
						codebase : "bundle/mapplet",
						code : "fi.nls.kapa.applet.Karttasovelma",
						alt : "Selaimesi ei tue Java-sovelmia tai Javan k&auml;ytt&ouml; on kytketty pois p&auml;&auml;lt&auml; selaimen asetuksista. Jos Java-tukea ei ole asennettu, voit asentaa sen osoitteesta http://www.java.com.",
						children : [
								{
									tag : 'param',
									value : "map",
									name : "mapplet"
								},
								{
									tag : 'param',
									value : "overview_xxx",
									name : "ohjain"
								},
								{
									tag : 'param',
									value : "kiinteistojaotus_raja,kiinteistojaotus_tunnus,karttalehti,kaava,rakennuskielto,kiinteisto,maaraala,khr,rakennus,kiintopiste,kayttooikeus,osoite,nimi,merkinta",
									name : "layers"
								},
								{
									tag : 'param',
									value : "lbl.x,lbl.y,odota,mittakaava,copyright,kopiointi,kokonaismatka,siirtyma,pinta_ala,virheellinen_rajauspiste,virheellinen_rajaus,puutteellinen_rajaus,liian_iso_rajaus,sijaintihaku_epaonnistui,taustahaku_epaonnistui,taustakartta_puuttuu,tulostus_epaonnistui,yksikko_palstalkm_ehto,yksikko_pinta_ala_ehto,palsta_pinta_ala_ehto,aluetta_ei_voi_laskea,lahestymiskartta,maastokartta,kantakartta,ortokuva,vaaravariortokuva",
									name : "hints"
								},
								{
									tag : 'param',
									value : "0.00025",
									name : "pixsize"
								},
								{
									tag : 'param',
									value : "1600",
									name : "map.max.width"
								},
								{
									tag : 'param',
									value : "1200",
									name : "map.max.height"
								},
								{
									tag : 'param',
									value : "http://jkorhonen.nls.fi/rae/kartta/Rae/image?request=GetMap&amp;version=1.1&amp;format=jpeg&amp;srs=EPSG:3067",
									name : "tausta.url"
								},
								{
									tag : 'param',
									value : "maastokartta",
									name : "taustakartta.mode"
								},
								{
									tag : 'param',
									value : "1E3,2E3,4E3,8E3,16E3,4E4,8E4,2E5,4E5,8E5,2E6,4E6,8E6",
									name : "scales"
								},
								{
									tag : 'param',
									value : "normal",
									name : "tausta.style"
								},
								{
									tag : 'param',
									value : "80",
									name : "ori.movement"
								},
								{
									tag : 'param',
									value : "8E6",
									name : "map.scale"
								},
								{
									tag : 'param',
									value : "445171",
									name : "map.x"
								},
								{
									tag : 'param',
									value : "7196225",
									name : "map.y"
								},
								{
									tag : 'param',
									value : "FFFFFF",
									name : "border.col"
								},
								{
									tag : 'param',
									value : "0",
									name : "border.size"
								},
								{
									tag : 'param',
									value : "20",
									name : "frame.size"
								},
								{
									tag : 'param',
									value : "13",
									name : "arrow.size"
								},
								{
									tag : 'param',
									value : "FFFFFF",
									name : "map.top.bg.col"
								},
								{
									tag : 'param',
									value : "196455",
									name : "map.top.fg.col"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-11",
									name : "map.top.font"
								},
								{
									tag : 'param',
									value : "2",
									name : "layout.gap"
								},
								{
									tag : 'param',
									value : "000000",
									name : "info.fg.col"
								},
								{
									tag : 'param',
									value : "EE0000",
									name : "info.fg.alert.col"
								},
								{
									tag : 'param',
									value : "SansSerif-normal-11",
									name : "info.font"
								},
								{
									tag : 'param',
									value : "FAFCFE",
									name : "info.bg.col"
								},
								{
									tag : 'param',
									value : "0",
									name : "info.border.size"
								},
								{
									tag : 'param',
									value : "6CC3EB",
									name : "bg.col"
								},
								{
									tag : 'param',
									value : "79AD9D",
									name : "button.fg.col"
								},
								{
									tag : 'param',
									value : "FAFCFE",
									name : "button.bg.col"
								},
								{
									tag : 'param',
									value : "kiinteistojaotus.raja,kiinteistojaotus.tunnus,kiinteisto,palsta,kiinteiston_raja,palsta.tunnus,rajamerkki,kayttooikeus,kaavoitettu_alue,rakennuskielto,yksikko_maaraala,maaraala,osoite,suoritusvastaus,yljlehti,utmlehti,pepalehti",
									name : "gml.features"
								},
								{
									tag : 'param',
									value : "palsta,kiinteiston_raja,rajamerkki",
									name : "kiinteisto.uniqueness"
								},
								{
									tag : 'param',
									value : "true",
									name : "yljlehti.uniqueness"
								},
								{
									tag : 'param',
									value : "true",
									name : "utmlehti.uniqueness"
								},
								{
									tag : 'param',
									value : "true",
									name : "pepalehti.uniqueness"
								},
								{
									tag : 'param',
									value : "2000",
									name : "map.minFitScale"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/rekisteriyksikko/gml/palstat.xml?projection=NLSFI:euref&amp;yksikko.palsta_lkm.max=40&amp;yksikko.pinta_ala.max=50000&amp;tuotetunnus=9001",
									name : "gml.kiinteisto.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/rekisteriyksikko/gml/palstat.xml?projection=NLSFI:euref&amp;tuotetunnus=9001",
									name : "gml.kiinteisto.osuvat.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/rekisteriyksikko/gml/maaraalat.xml?projection=NLSFI:euref",
									name : "gml.yksikko_maaraala.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/rekisteriyksikko/gml/maaraalat.xml?projection=NLSFI:euref",
									name : "gml.yksikko_maaraala.osuvat.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/kiinteistojaotus/gml/kiinteistojaotus_sijaintikohteet.xml?projection=NLSFI:euref",
									name : "gml.kiinteistojaotus.raja.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/sivusto/poiminta/karttalehti.gml.xml?karttalehtityyppi=yljlehti&amp;projection=NLSFI:euref",
									name : "gml.yljlehti.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/sivusto/poiminta/karttalehti.gml.xml?karttalehtityyppi=utmlehti&amp;projection=NLSFI:euref",
									name : "gml.utmlehti.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/sivusto/poiminta/karttalehti.gml.xml?karttalehtityyppi=pepalehti&amp;projection=NLSFI:euref",
									name : "gml.pepalehti.url"
								},
								{
									tag : 'param',
									value : "/karttapaikka/tietovarasto/selaintietopalvelu/source/xml/fi/nls/ktjkii/selaintietopalvelu/palvelu/palsta/gml/palstat_tunnuspisteet.xml?projection=NLSFI:euref",
									name : "gml.kiinteistojaotus.tunnus.url"
								},
								{
									tag : 'param',
									value : "00365B",
									name : "nimi.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "nimi.style"
								},
								{
									tag : 'param',
									value : "005E5D",
									name : "osoite.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "osoite.style"
								},
								{
									tag : 'param',
									value : "BB0000",
									name : "kiinteistojaotus_raja.col"
								},
								{
									tag : 'param',
									value : "880000",
									name : "kiinteistojaotus_tunnus.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "kiinteistojaotus_tunnus.style"
								},
								{
									tag : 'param',
									value : "Sans-Serif-9",
									name : "kiinteistojaotus_tunnus.font"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "kiinteistojaotus_tunnus.highlight.col"
								},
								{
									tag : 'param',
									value : "EE0000",
									name : "kiinteisto.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "kiinteisto.highlight.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "kiinteisto.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-12",
									name : "kiinteisto.font"
								},
								{
									tag : 'param',
									value : "BF811F",
									name : "maaraala.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "maaraala.highlight.col"
								},
								{
									tag : 'param',
									value : "signal",
									name : "maaraala.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-12",
									name : "maaraala.font"
								},
								{
									tag : 'param',
									value : "009200",
									name : "kayttooikeus.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "kayttooikeus.highlight.col"
								},
								{
									tag : 'param',
									value : "ball",
									name : "kayttooikeus.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-12",
									name : "kayttooikeus.font"
								},
								{
									tag : 'param',
									value : "713C22",
									name : "rakennuskielto.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "rakennuskielto.highlight.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "rakennuskielto.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-12",
									name : "rakennuskielto.font"
								},
								{
									tag : 'param',
									value : "DF5F65",
									name : "kaava.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "kaava.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-11",
									name : "kaava.font"
								},
								{
									tag : 'param',
									value : "BB5500",
									name : "khr.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "khr.highlight.col"
								},
								{
									tag : 'param',
									value : "square",
									name : "khr.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-11",
									name : "khr.font"
								},
								{
									tag : 'param',
									value : "887A00",
									name : "rakennus.col"
								},
								{
									tag : 'param',
									value : "AB15CB",
									name : "rakennus.highlight.col"
								},
								{
									tag : 'param',
									value : "square",
									name : "rakennus.style"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-11",
									name : "rakennus.font"
								},
								{
									tag : 'param',
									value : "pyramid",
									name : "kiintopiste.style"
								},
								{
									tag : 'param',
									value : "55248C",
									name : "kiintopiste.col"
								},
								{
									tag : 'param',
									value : "SansSerif-bold-11",
									name : "kiintopiste.font"
								},
								{
									tag : 'param',
									value : "FF6666",
									name : "karttalehti.col"
								},
								{
									tag : 'param',
									value : "normal",
									name : "karttalehti.style"
								},
								{
									tag : 'param',
									value : "6600EE",
									name : "merkinta.col"
								},
								{
									tag : 'param',
									value : "round",
									name : "merkinta.style"
								},
								{
									tag : 'param',
									value : "2255FF",
									name : "rajaus.col"
								},
								{
									tag : 'param',
									value : "CC0033",
									name : "nimi.col"
								},
								{
									tag : 'param',
									value : "palsta,palsta.tunnus,kiinteiston_raja,rajamerkki,maaraalan_osa,kayttooikeusyksikon_osa,kayttooikeusyksikon_osa.tunnus,kaavoitettu_alue,rakennuskiellon_osa",
									name : "style.features"
								},
								{
									tag : 'param',
									value : "6F0343,8B0733,BC0427,D7410D,DB9705,888D05,53A90D,1A7800,22AE7E,026058,00FF00,A86D46,E9696F,F6F564",
									name : "area.fill.palette"
								},
								{
									tag : 'param',
									value : "0,1,2,3,4,5,6,7,8,9",
									name : "area.fill.palsta.colors"
								},
								{
									tag : 'param',
									value : "13",
									name : "area.fill.maaraalan_osa.colors"
								},
								{
									tag : 'param',
									value : "10",
									name : "area.fill.kayttooikeusyksikon_osa.colors"
								},
								{
									tag : 'param',
									value : "12",
									name : "area.fill.kaavoitettu_alue.colors"
								},
								{
									tag : 'param',
									value : "11",
									name : "area.fill.rakennuskiellon_osa.colors"
								},
								{
									tag : 'param',
									value : "circle",
									name : "point.rajamerkki.style"
								},
								{
									tag : 'param',
									value : "normal",
									name : "point.kayttooikeusyksikon_osa.tunnus.style"
								},
								{
									tag : 'param',
									value : "2",
									name : "line.kiinteiston_raja.thickness"
								},
								{
									tag : 'param',
									value : "3",
									name : "line.kayttooikeusyksikon_osa.thickness"
								},
								{
									tag : 'param',
									value : "true",
									name : "palsta.tunnus.visible"
								},
								{
									tag : 'param',
									value : "true",
									name : "palsta.visible"
								},
								{
									tag : 'param',
									value : "true",
									name : "kiinteiston_raja.visible"
								},
								{
									tag : 'param',
									value : "true",
									name : "rajamerkki.visible"
								},
								{
									tag : 'param',
									value : "/mapplet/tilannetuloste/muodosta_tilannetuloste.gml.xml?format=png",
									name : "mapplet-data.output.url"
								},
								{
									tag : 'param',
									value : "png",
									name : "mapplet-data.image.format"
								},
								{
									tag : 'param',
									value : "15000000",
									name : "mapplet-data.max.size"
								},
								{
									tag : 'param',
									value : "true",
									name : "mapplet-data.zip"
								},
								{
									tag : 'param',
									value : "tulosteikkuna",
									name : "karttatuloste.frame"
								},
								{
									tag : 'param',
									value : "osoite",
									name : "lahin_kohde.layer"
								},
								{
									tag : 'param',
									value : "osoite",
									name : "lahin_kohde.feature"
								},
								{
									tag : 'param',
									value : "1",
									name : "lahin_kohde.maxresults"
								},
								{
									tag : 'param',
									value : "tulosteikkuna",
									name : "sivusto.frame"
								},
								{
									tag : 'param',
									value : "4",
									name : "kysely.tolpix"
								},
								{
									tag : 'param',
									value : "maaraala,kayttooikeus,kiinteisto,rakennuskielto",
									name : "kysely.avattavat"
								},
								{
									tag : 'param',
									value : "rakennus,khr,kiintopiste,kiinteistojaotus_tunnus,kiinteisto/palsta",
									name : "kysely.valittavat"
								},
								{
									tag : 'param',
									name : "gml.osoite.url",
									value : "/karttapaikka/sivusto/poiminta/lahinosoite.gml.xml?projection=NLSFI:euref&amp;lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.feature.rajamerkki.url",
									value : "/karttapaikka/sivusto/tuloste/kysely_rajamerkki.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.feature.kiinteiston_raja.url",
									value : "/karttapaikka/sivusto/tuloste/kysely_raja.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.feature.palsta.url",
									value : "/karttapaikka/sivusto/tuloste/rajamerkkiluettelo.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.feature.palsta.tunnus.url",
									value : "/karttapaikka/sivusto/tuloste/rajamerkkiluettelo.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.maaraala.url",
									value : "/karttapaikka/sivusto/tuloste/kysely_maaraala.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.kayttooikeus.url",
									value : "/karttapaikka/sivusto/tuloste/kysely_kayttooikeus.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "kysely.rakennuskielto.url",
									value : "/karttapaikka/sivusto/tuloste/kysely_rakennuskielto.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "karttatuloste.url",
									value : "/karttapaikka/sivusto/tuloste/karttatuloste.html?lang=FI&amp;selain=ie6"
								},
								{
									tag : 'param',
									name : "h.virheellinen_rajauspiste",
									value : "Pistett&auml; ei voida hyv&auml;ksy&auml;, koska sen hyv&auml;ksyminen aiheuttaisi rajauksen riste&auml;misen itsens&auml; kanssa."
								},
								{
									tag : 'param',
									name : "h.virheellinen_rajaus",
									value : "Rajausta ei voida hyv&auml;ksy&auml;, koska se riste&auml;isi itsens&auml; kanssa. Muuta rajausta tai pienenn&auml; hakuet&auml;isyytt&auml;."
								},
								{
									tag : 'param',
									name : "h.puutteellinen_rajaus",
									value : "Rajausta ei voida hyv&auml;ksy&auml;, koska et ole antanut riitt&auml;v&auml;sti rajauspisteit&auml;."
								},
								{
									tag : 'param',
									name : "h.liian_iso_rajaus",
									value : "Rajausta ei voida hyv&auml;ksy&auml;, koska rajaamasi alue on liian suuri. Muuta rajausta tai tee uusi rajaus."
								},
								{
									tag : 'param',
									name : "h.yksikko_palstalkm_ehto",
									value : "Kartalla ei esitet&auml; kiinteist&ouml;rajoja vaan ainoastaan palstojen tunnuspisteet, koska palstoja on paljon taikka rekisteriyksikk&ouml; tai joku palstoista on hyvin suuri. Maksuton."
								},
								{
									tag : 'param',
									name : "h.yksikko_pinta_ala_ehto",
									value : "Kartalla ei esitet&auml; kiinteist&ouml;rajoja vaan ainoastaan palstojen tunnuspisteet, koska palstoja on paljon taikka rekisteriyksikk&ouml; tai joku palstoista on hyvin suuri. Maksuton."
								},
								{
									tag : 'param',
									name : "h.palsta_pinta_ala_ehto",
									value : "Kartalla ei esitet&auml; kiinteist&ouml;rajoja vaan ainoastaan palstojen tunnuspisteet, koska palstoja on paljon taikka rekisteriyksikk&ouml; tai joku palstoista on hyvin suuri. Maksuton."
								},
								{
									tag : 'param',
									name : "h.aluetta_ei_voi_laskea",
									value : "Muodostamaasi kuvioa ei voida sulkea alueeksi (Alueen reunaviiva ei saa menn&auml; ristiin itsens&auml; kanssa ja nurkkapisteit&auml; on oltava v&auml;hint&auml;&auml;n 3 kpl)."
								},
								{
									tag : 'param',
									name : "h.sijaintihaku_epaonnistui",
									value : "Joidenkin tietojen haku kartalle ep&auml;onnistui."
								},
								{
									tag : 'param',
									name : "h.taustahaku_epaonnistui",
									value : "Taustakartan haku ep&auml;onnistui"
								},
								{
									tag : 'param',
									name : "h.taustakartta_puuttuu",
									value : "Pyyt&auml;m&auml;&auml;si kartta-aineistoa ei ole saatavilla t&auml;lt&auml; alueelta."
								},
								{
									tag : 'param',
									name : "h.tulostus_epaonnistui",
									value : "Tulostussivun muodostaminen ep&auml;onnistui."
								},
								{
									tag : 'param',
									name : "h.lbl.y",
									value : "N"
								},
								{
									tag : 'param',
									name : "h.lbl.x",
									value : "E"
								},
								{
									tag : 'param',
									name : "h.odota",
									value : "Haetaan tietoja..."
								},
								{
									tag : 'param',
									name : "h.mittakaava",
									value : "Mittakaavataso"
								},
								{
									tag : 'param',
									name : "h.lahestymiskartta",
									value : "L&auml;hestymiskartta"
								},
								{
									tag : 'param',
									name : "h.maastokartta",
									value : "Maastokartta"
								},
								{
									tag : 'param',
									name : "h.kantakartta",
									value : "Kantakartta"
								},
								{
									tag : 'param',
									name : "h.ortokuva",
									value : "Ilmakuva "
								},
								{
									tag : 'param',
									name : "h.vaaravariortokuva",
									value : "V&auml;&auml;r&auml;v&auml;ri-ilmakuva "
								},
								{
									tag : 'param',
									name : "h.copyright",
									value : "&copy;  Maanmittauslaitos"
								},
								{
									tag : 'param',
									name : "h.kopiointi",
									value : ""
								},
								{
									tag : 'param',
									name : "h.kokonaismatka",
									value : "Kokonaismatka"
								},
								{
									tag : 'param',
									name : "h.siirtyma",
									value : "Siirtym&auml;"
								},
								{
									tag : 'param',
									name : "h.pinta_ala",
									value : "Pinta-ala"
								},
								{
									tag : 'param',
									name : "info.text",
									value : "Karttapaikka &copy; 2003 Maanmittauslaitos"
								},
								{
									tag : 'param',
									value : "",
									name : "mapplet.id"
								},
								{
									tag : 'param',
									name : "karttatuloste.tunnus",
									value : "Ei kopiointilupaa#&copy; Maanmittauslaitos"
								} ]
					},
					orientTagTemplate : {
						tag : 'applet',
						style : "margin: 0px 0px 0px 2px; padding: 0px;",
						mayscript : "true",
						align : "left",
						width : "148",
						height : "220",
						name : "overview",
						archive : "ktjkii-mapplet_20101109_o.zip",
						codebase : "bundle/mapplet",
						code : "fi.nls.kapa.applet.OrientointiKartta",
						alt : "Selaimesi ei tue Java-sovelmia tai Javan k&auml;ytt&ouml; on kytketty pois p&auml;&auml;lt&auml; selaimen asetuksista. Jos Java-tukea ei ole asennettu, voit asentaa sen osoitteesta http://www.java.com.",
						children : [
								{
									tag : 'param',
									value : "overview",
									name : "mapplet"
								},
								{
									tag : 'param',
									value : "map",
									name : "mainview"
								},
								{
									tag : 'param',
									value : "lbl.x,lbl.y,lbl.mittakaava,lbl.projection",
									name : "hints"
								},
								{
									tag : 'param',
									value : "1E3,2E3,4E3,8E3,16E3,4E4,8E4,2E5,4E5,8E5,2E6,4E6,8E6",
									name : "scales"
								},
								{
									tag : 'param',
									value : "8E6",
									name : "map.scale"
								},
								{
									tag : 'param',
									value : "445171",
									name : "map.x"
								},
								{
									tag : 'param',
									value : "7196225",
									name : "map.y"
								},
								{
									tag : 'param',
									value : "FFFFFF",
									name : "bg.col"
								},
								{
									tag : 'param',
									value : "126",
									name : "imap.width"
								},
								{
									tag : 'param',
									value : "172",
									name : "imap.height"
								},
								{
									tag : 'param',
									value : "14",
									name : "slider.width"
								},
								{
									tag : 'param',
									value : "171",
									name : "slider.height"
								},
								{
									tag : 'param',
									value : "AFD3C5,318370",
									name : "slider.col"
								},
								{
									tag : 'param',
									value : "SansSerif-9",
									name : "coord.font"
								},
								{
									tag : 'param',
									value : "SansSerif-9",
									name : "info.font"
								},
								{
									tag : 'param',
									value : "C14000",
									name : "info.hint.fg.col"
								},
								{
									tag : 'param',
									value : "http://jkorhonen.nls.fi/orientointikartta.gif",
									name : "imap.url"
								}, {
									tag : 'param',
									value : "11026,6580233,894672,7806743",
									name : "imap.bbox"
								}, {
									tag : 'param',
									name : "h.lbl.input",
									value : ""
								}, {
									tag : 'param',
									name : "h.lbl.y",
									value : "N"
								}, {
									tag : 'param',
									name : "h.lbl.x",
									value : "E"
								}, {
									tag : 'param',
									name : "h.lbl.mittakaava",
									value : "Mittakaava"
								}, {
									tag : 'param',
									name : "h.lbl.projection",
									value : "ETRS-TM35FIN"
								} ]
					}

				});