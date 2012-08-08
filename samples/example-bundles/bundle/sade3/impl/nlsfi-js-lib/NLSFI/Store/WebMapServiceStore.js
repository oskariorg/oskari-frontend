/**
	Provides INFORMATION on available WMS services.
	MIGHT use HTML5 local datastore if available.
	This loads WMS Get Caps and provides metadata
	to UI and Layer Selectors.
	
	availableLayers should NOT be hardcoded...

*/

NLSFI.Store.WebMapServiceStore = OpenLayers.Class({

	factory: null,

	initialize: function(fac) {
		this.factory = fac;
		
		this.defaultLayers = [];
		this.cloneNlsFiWmsLayerSpecs();
	},
	
	cloneNlsFiWmsLayerSpecs: function() {
		var fac =this.factory;
		var defLayers = this.defaultLayers;
		for( wmsSpec in fac.wmsLayerSpecs ) {
			var spec = fac.wmsLayerSpecs[wmsSpec];
			var c = {
				category: 'nls.fi',
				category_fi: 'Maanmittauslaitos',
				category_en: 'National Land Survey of Finland',
				name: wmsSpec,
				id: wmsSpec
			};
			for( p in spec ) c[p] = spec[p];

			defLayers.push(c);
		}
	},
	
	getFactory: function() {
		return this.factory;
	},

	/* nls.fi (openlayers.org) register tile loading events */ 
	registerEvents: function(layer,func) {
        layer.events.register("tileloaded", layer, function() {
            func(this.numLoadingTiles);
        });

	},
	
	/* get spec by spec id */
	getSpecById: function(specId) {
		for( var n = 0 ; n < this.availableLayers.length;n++) {
			var ldef = this.availableLayers[n] ;
			if( ldef.id == specId )
				return ldef;
		}
		return null;
	},
	
	/* create layer using spec and factory */
	createLayer: function( spec, transparent ) {
		var name = spec.wmsName;
		var wmsUrl = spec.wmsUrl;
		var layer = this.getFactory().createLayer(name,spec,wmsUrl,transparent) ;		
		
 		layer.specId = spec.id;
		layer.spec = spec;
		
		return layer;
	},
	
	/* get layers specified to be available for scale (sc)*/
	getLayersForScale: function(sc) {
		var lfs = {};
		for( var n = 0 ; n < this.availableLayers.length;n++) {
			var ldef = this.availableLayers[n] ;
			var specId = ldef.id;
			if( sc >= ldef.maxScale && sc <= ldef.minScale )
				lfs[specId] = ldef;
		}
		return lfs;
	},
	
	/* return list of distinct categories available */
	getDistinctCategories: function() {
		var cats = {};
		
		for( var n = 0 ; n < this.availableLayers.length;n++) {
			var ldef = this.availableLayers[n] ;
			var catsKey = ldef.category || "";
			if( !cats[catsKey ] )
				cats[catsKey ] = {};
			if( !cats[catsKey].fi )	
				cats[catsKey].fi = ldef.category_fi ;
			if( !cats[catsKey].se )	
				cats[catsKey].se = ldef.category_se ;
		}

		return cats;	
	},
	/* return layers grouped by predef category */
	getCategorizedLayersForScale: function(sc) {
		var cats = {};
		
		for( var n = 0 ; n < this.availableLayers.length;n++) {
			var ldef = this.availableLayers[n] ;
			if( !sc || ( sc >= ldef.maxScale && sc <= ldef.minScale ) ) {
				var catsKey = ldef.category || "";
				if( !cats[catsKey ] )
					cats[catsKey ] = [];
				
				cats[catsKey].push(ldef);
			}
		}

		return cats;	
	},
	
	defaultLayers: [],
	
	/* logica.fi layer specs FOR testing and dev only */
    availableLayers:[
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"101",name:"",name_fi:"Muinaisjäännökset",name_se:"Fornlämningar",name_en:"Relics",wmsName:"1",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:100,style:"",minScale:2000000.0,maxScale:1.0},
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"103",name:"",name_fi:"Maailmanperintökohteet",name_se:"Världsarvobjekt",name_en:"World Heritage",wmsName:"8",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:100,style:"",minScale:2000000.0,maxScale:1.0},
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"104",name:"",name_fi:"Maailmanperintöalueet",name_se:"Världsarvområden",name_en:"World Heritage Areas",wmsName:"9",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:80,style:"",minScale:2000000.0,maxScale:1.0},
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"102",name:"",name_fi:"Rakennusperintökohteet",name_se:"Byggnadsarvobjekt",name_en:"Built Heritage",wmsName:"5",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:100,style:"",minScale:150000.0,maxScale:1.0},
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"1101",name:"",name_fi:"Muinaisjäännösten alakohteet",name_se:"Fornlämningars underart",name_en:"Subdivision of Relics",wmsName:"2",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:100,style:"",minScale:35000.0,maxScale:1.0},
{category:"nba_fi",category_fi:"Museovirasto",category_se:"Museiverket",category_en:"National Board of Antiquities",id:"1102",name:"",name_fi:"Muinaisjäännösalueet",name_se:"Fornlämningsområden",name_en:"Relic areas",wmsName:"3",wmsUrl:"http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",opacity:100,style:"",minScale:150000.0,maxScale:1.0},
{category:"gtk_fi",category_fi:"Geologian tutkimuskeskus",category_se:"Geologisca forskningscentralen",category_en:"Geological Survey of Finland",id:"109",name:"",name_fi:"Maaperäkartta 1:20000",name_se:"Jordmånskarta 1:20000",name_en:"Map of Quaternary deposits 1:20000",wmsName:"3",wmsUrl:"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",opacity:75,style:"",minScale:50000.0,maxScale:1.0},
{category:"gtk_fi",category_fi:"Geologian tutkimuskeskus",category_se:"Geologisca forskningscentralen",category_en:"Geological Survey of Finland",id:"110",name:"",name_fi:"Maaperäkartta 1:1milj",name_se:"Jordmånskarta 1:1milj",name_en:"Map of Quaternary deposits 1:1mill",wmsName:"4",wmsUrl:"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",opacity:75,style:"",minScale:1.5E7,maxScale:50000.0},
{category:"gtk_fi",category_fi:"Geologian tutkimuskeskus",category_se:"Geologisca forskningscentralen",category_en:"Geological Survey of Finland",id:"113",name:"",name_fi:"Kallioperäkartta 1:100000",name_se:"Berggrundskarta 1:100000",name_en:"Bedrock map 1:100000",wmsName:"1",wmsUrl:"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",opacity:75,style:"",minScale:250000.0,maxScale:1.0},
{category:"gtk_fi",category_fi:"Geologian tutkimuskeskus",category_se:"Geologisca forskningscentralen",category_en:"Geological Survey of Finland",id:"114",name:"",name_fi:"Kallioperäkartta 1:1milj",name_se:"Berggrundskarta 1:1milj",name_en:"Bedrock map 1:1mill",wmsName:"2",wmsUrl:"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",opacity:75,style:"",minScale:1.5E7,maxScale:250000.0},
{category:"gtk_fi",category_fi:"Geologian tutkimuskeskus",category_se:"Geologisca forskningscentralen",category_en:"Geological Survey of Finland",id:"115",name:"",name_fi:"Magneettikenttäkartta",name_se:"Magnetfält",name_en:"Magnetic field",wmsName:"0",wmsUrl:"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",opacity:75,style:"",minScale:1.5E7,maxScale:1.0},
/*{category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"117",name:"",name_fi:"Maastorasteri 1:20k",name_se:"Terrängsraster 1:20k",name_en:"Topographic map 1:20k",wmsName:"u_rvk_100",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:25000.0,maxScale:1.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"118",name:"",name_fi:"Maastorasteri 1:50k",name_se:"Terrängsraster 1:50k",name_en:"Topographic map 1:50k",wmsName:"rasta50_u_rvk_500",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:54000.0,maxScale:26000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"119",name:"",name_fi:"Maastorasteri 1:100k",name_se:"Terrängsraster 1:100k",name_en:"Topographic map 1:100k",wmsName:"rasta100",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:130000.0,maxScale:55000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"120",name:"",name_fi:"Lähestymiskartta 1:250k",name_se:"Översiktskarta 1:250k",name_en:"Overview map 1:250k",wmsName:"mk250",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:245000.0,maxScale:135000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"1201",name:"",name_fi:"Lähestymiskartta 1:500k",name_se:"Översiktskarta 1:500k",name_en:"Overview map 1:500k",wmsName:"mk500",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:550000.0,maxScale:280000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"121",name:"",name_fi:"Lähestymiskartta 1:1milj",name_se:"Översiktskarta 1:1milj",name_en:"Overview map 1:1mill",wmsName:"mk1m",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:1350000.0,maxScale:560000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"122",name:"",name_fi:"Lähestymiskartta 1:2milj",name_se:"Översiktskarta 1:2milj",name_en:"Overview map 1:2mill",wmsName:"mk2m",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:2500000.0,maxScale:1380000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"123",name:"",name_fi:"Lähestymiskartta 1:4milj",name_se:"Översiktskarta 1:4milj",name_en:"Overview map 1:4mill",wmsName:"mk4m",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:5000000.0,maxScale:2600000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"124",name:"",name_fi:"Lähestymiskartta 1:8milj",name_se:"Översiktskarta 1:8milj",name_en:"Overview map 1:8mill",wmsName:"mk8m",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:40,style:"",minScale:1.0E7,maxScale:5100000.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"126",name:"",name_fi:"Ortokuvat, mustavalko",name_se:"Ortofoton, svartvit",name_en:"Ortophotos, grayscale",wmsName:"orto/kkj/mv",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:100,style:"",minScale:50000.0,maxScale:1.0},
{role: 'base',category:"nls_fi",category_fi:"Taustakartat MML",category_se:"Bakgrundskartor LMV",category_en:"Background Maps NLS",id:"127",name:"",name_fi:"Ortokuvat, vääräväri",name_se:"Ortofoton, falska färger",name_en:"Ortophotos, infrared",wmsName:"orto/kkj/vv",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://ws.nls.fi/rasteriaineistot/verkkopalvelu/wms/GetCapabilitiesRajapinta?",opacity:100,style:"",minScale:50000.0,maxScale:1.0},*/
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"702",name:"",name_fi:"Natura 2000 alueet",name_se:"Natura 2000 områden",name_en:"Natura 2000 Sites",wmsName:"Natura2000_rajaukset",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_luonnonsuojelu?",opacity:100,style:"",minScale:1.5E7,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"703",name:"",name_fi:"Luonnonsuojelualueet",name_se:"Reservater",name_en:"Protected sites",wmsName:"Luonnonsuojelualueet_03",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_luonnonsuojelu?",opacity:100,style:"",minScale:1.5E7,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"704",name:"",name_fi:"Suojellut joet",name_se:"Skyddade åarna",name_en:"Protected rivers",wmsName:"Luonnonsuojelualueet_02",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_luonnonsuojelu?",opacity:100,style:"",minScale:1.5E7,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"705",name:"",name_fi:"Suojellut kosket",name_se:"Skyddade forsen",name_en:"Protected rapids",wmsName:"Luonnonsuojelualueet_01",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_luonnonsuojelu?",opacity:100,style:"",minScale:1.5E7,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"404",name:"",name_fi:"CORINE",name_se:"CORINE",name_en:"CORINE",wmsName:"Corine clc_eu25ha",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_corine_wms?",opacity:75,style:"",minScale:500000.0,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"706",name:"",name_fi:"Valuma-alueet",name_se:"Avrinningsområden",name_en:"Drainage areas",wmsName:"valuma-viivat",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_valuma_alueet?",opacity:100,style:"",minScale:1000000.0,maxScale:1.0},
{category:"ymparisto_fi",category_fi:"Ympäristökeskus",category_se:"Miljöcentralet",category_en:"Environment Institute",id:"707",name:"",name_fi:"Valuma-alueiden purkauspisteet",name_se:"Avrinningsområdens utsläppspunkten",name_en:"Drainage area discharge points",wmsName:"purkukohdat",wmsUrl:"http://geox.fgi.fi/cgi-bin/4nls_syke_wms_valuma_alueet?",opacity:100,style:"",minScale:1000000.0,maxScale:1.0},
//{category:"mavi_fi",category_fi:"Maaseutuvirasto",category_se:"Landsbygdsvärket",category_en:"Agency for Rural Affairs",id:"501",name:"",name_fi:"Peltolohkorekisteri 2008",name_se:"Basskiftesregister 2008",name_en:"Land Parcel Register 2008",wmsName:"Peltolohkot2008",wmsUrl:"http://193.209.42.116/cgi-bin/MaviPortaalipilotti",opacity:100,style:"",minScale:2000000.0,maxScale:1.0},
//{category:"tiehallinto_fi",category_fi:"Tiehallinto",category_se:"Vägförvaltningen",category_en:"Finnish Road Administration",id:"202",name:"",name_fi:"Digiroad 2009/02",name_se:"Digiroad 2009/02",name_en:"Digiroad 2009/02",wmsName:"Digiroad",wmsUrl:"http://193.209.42.116/cgi-bin/mml_testi",opacity:100,style:"",minScale:300000.0,maxScale:1.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"207",name:"",name_fi:"Taajamakartta 1:20k",name_se:"Taajamakartta 1:20k",name_en:"Taajamakartta 1:20k",wmsName:"rs08_taajamakartta_20k_0.500000m",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_taajamakartta_20k/",opacity:100,style:"",minScale:15000.0,maxScale:1.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"210",name:"",name_fi:"Kuntakartta 1:50k",name_se:"Kuntakartta 1:50k",name_en:"Kuntakartta 1:50k",wmsName:"rs08_kuntakartta_50k_1.250000m",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_kuntakartta_50k/",opacity:100,style:"",minScale:30000.0,maxScale:15000.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"212",name:"",name_fi:"Seutukartta 1:100k",name_se:"Seutukartta 1:100k",name_en:"Seutukartta 1:100k",wmsName:"rs08_seutukartta_100k_2.500000m",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_seutukartta_100k/",opacity:100,style:"",minScale:50000.0,maxScale:31000.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"213",name:"",name_fi:"Yleiskartta 1:250k",name_se:"Yleiskartta 1:250k",name_en:"Yleiskartta 1:250k",wmsName:"rs08_yleiskartta_250k",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_yleiskartta_250k/",opacity:100,style:"",minScale:150000.0,maxScale:50000.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"214",name:"",name_fi:"Maakuntakartta 1:500k",name_se:"Maakuntakartta 1:500k",name_en:"Maakuntakartta 1:500k",wmsName:"rs08_maakuntakartta_500k",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_maakuntakartta_500k/",opacity:100,style:"",minScale:300000.0,maxScale:150000.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"215",name:"",name_fi:"Suomi 1:1milj",name_se:"Suomi 1:1milj",name_en:"Suomi 1:1milj",wmsName:"rs08_suomi_1m",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_suomi_1m/",opacity:100,style:"",minScale:600000.0,maxScale:300000.0},
{role: 'base',category:"logica_fi",category_fi:"Logica",category_se:"Logica",category_en:"Logica",id:"216",name:"",name_fi:"Suomi 1:5milj",name_se:"Suomi 1:5milj",name_en:"Suomi 1:5milj",wmsName:"rs08_suomi_5m",wmsUrl:"http://www.karttakone.fi/wms/a482f2cc97880131c5068182b9febb55/ykj/rs08_suomi_5m/",opacity:100,style:"",minScale:5000000.0,maxScale:600000.0},
{category:"fma_fi",category_fi:"Merenkulkulaitos",category_se:"Sjöfartsverket",category_en:"Finnish Maritime Administration",id:"203",name:"",name_fi:"Primar merikartat",name_se:"Primar sjökort",name_en:"Primar Web Charts",wmsName:"cells",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://services.ecc.no/wms/wms?",opacity:75,style:"style-id-262",minScale:2000000.0,maxScale:1.0},
{category:"fma_fi",category_fi:"Merenkulkulaitos",category_se:"Sjöfartsverket",category_en:"Finnish Maritime Administration",id:"402",name:"",name_fi:"Primar kattavuusalueet",name_se:"Primar täckningsområden",name_en:"Primar coverage areas",wmsName:"coverage",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=https://services.ecc.no/wms/wms?",opacity:50,style:"",minScale:1.5E7,maxScale:1.0},
{category:"fgi_fi",category_fi:"Geodeettinen laitos",category_se:"Geodetiska institutet",category_en:"Finnish Geodetic Institute",id:"605",name:"",name_fi:"Rinnevalovarjostus",name_se:"Skuggad relief",name_en:"Shaded relief",wmsName:"rinnevalovarjostus",wmsUrl:"http://geox.fgi.fi/cgi-bin/rinnevalo_wms?",opacity:50,style:"",minScale:1.0E7,maxScale:1.0},
{category:"paikkatietoikkuna_fi",category_fi:"Yhteistyöaineistot",category_se:"Samarbetsdata",category_en:"Data Cooperation",id:"403",name:"",name_fi:"SLICES",name_se:"SLICES",name_en:"SLICES",wmsName:"ows:slices",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:1.0E7,maxScale:1.0},
{category:"paikkatietoikkuna_fi",category_fi:"Yhteistyöaineistot",category_se:"Samarbetsdata",category_en:"Data Cooperation",id:"603",name:"",name_fi:"Kiinteistörajat",name_se:"Fastighetsgränser",name_en:"Cadastral parcels",wmsName:"ows:kiinteisto",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
//{category:"lounaispaikka_fi",category_fi:"Varsinais-Suomen liitto",category_se:"Egentliga Finlands förbund",category_en:"Regional Council of Southwest Finland",id:"708",name:"",name_fi:"Varsinais-Suomen vahvistetut maakuntakaavat",name_se:"Egentliga Finlands bekraftade landskapsplaner",name_en:"Reinforced regional plans of Southwest Finland",wmsName:"VS-Maakuntakaava",wmsUrl:"http://lounaispaikka.utu.fi:8000/cgi-bin/lounaispaikka.exe?map=/ms4w/map/mkaava_agg.map&",opacity:75,style:"",minScale:500000.0,maxScale:1.0},
//{category:"lounaispaikka_fi",category_fi:"Varsinais-Suomen liitto",category_se:"Egentliga Finlands förbund",category_en:"Regional Council of Southwest Finland",id:"709",name:"",name_fi:"Varsinais-Suomen maakuntakaavan alueidenkäyttö",name_se:"Egentliga Finlands landskapsplaner",name_en:"Regional plans of Southwest Finland",wmsName:"Aluevaraukset",wmsUrl:"http://lounaispaikka.utu.fi:8000/cgi-bin/lounaispaikka.exe?map=/ms4w/map/mkaava_agg.map&",opacity:75,style:"",minScale:500000.0,maxScale:1.0},
//{category:"os",category_fi:"Vapaat sisällöt",category_se:"Open Content",category_en:"Open Content",id:"710",name:"",name_fi:"Landsat-mosaiikki",name_se:"Landsat-mosaik",name_en:"Landsat Mosaic",wmsName:"Landsat742",wmsUrl:"http://193.209.42.116/cgi-bin/mml_testi",opacity:100,style:"",minScale:1.5E7,maxScale:1.0},
//{category:"os",category_fi:"Vapaat sisällöt",category_se:"Open Content",category_en:"Open Content",id:"711",name:"",name_fi:"OpenStreetMap",name_se:"OpenStreetMap",name_en:"OpenStreetMap",wmsName:"OSM_tiet",wmsUrl:"http://193.209.42.116/cgi-bin/mml_testi",opacity:100,style:"",minScale:1.0E7,maxScale:1.0},
//{category:"os",category_fi:"Vapaat sisällöt",category_se:"Open Content",category_en:"Open Content",id:"712",name:"",name_fi:"OpenStreetMap rakennukset",name_se:"OpenStreetMap byggnader",name_en:"OpenStreetMap Buildings",wmsName:"OSM_rakennukset",wmsUrl:"http://193.209.42.116/cgi-bin/mml_testi",opacity:100,style:"",minScale:1000000.0,maxScale:1.0},
{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"503",name:"",name_fi:"Vesi",name_se:"Vatten",name_en:"Water",wmsName:"ows:vesi",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"504",name:"",name_fi:"Korkeuskäyrät",name_se:"Höjdlinje",name_en:"Contour lines",wmsName:"ows:kk",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"606",name:"",name_fi:"Liikenneverkko",name_se:"Trafiknät",name_en:"Transport network",wmsName:"ows:tiesto",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},

{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"1001",name:"",name_fi:"Pellot",name_se:"Fälten",name_en:"Fields",wmsName:"ows:pellot",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"901",name:"",name_fi:"Suot",name_se:"Myr",name_en:"Swamps",wmsName:"ows:suot",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{role: 'base', category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"902",name:"",name_fi:"Pohjakuviot",name_se:"Grundelementer",name_en:"Map base",wmsName:"ows:pohjak",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},

{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"607",name:"",name_fi:"Kalliot ja kivenäismaat",name_se:"Berg och mineraljordar",name_en:"Bedrock and mineral land",wmsName:"ows:kalliot",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"nls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"701",name:"",name_fi:"Avoimet metsämaat",name_se:"Öppen skogsmark",name_en:"Open forested land",wmsName:"ows:aukeat",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},

{category:"xnls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"604",name:"",name_fi:"Rakennukset",name_se:"Byggnader",name_en:"Buildings",wmsName:"ows:rakennus",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"xnls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"602",name:"",name_fi:"Hallintorajat",name_se:"Administrativa gränser",name_en:"Administrative units",wmsName:"ows:hallinto",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"xnls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"608",name:"",name_fi:"Nimistörekisteri",name_se:"Namnregistret",name_en:"Geographical names",wmsName:"ows:nimisto",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},
{category:"xnls_fi",category_fi:"MML maastotietokanta",category_se:"LMV Terrängdatabasen",category_en:"NLS Topographic database",id:"904",name:"",name_fi:"Karttalehtijaot",name_se:"Kartblad",name_en:"Map sheets",wmsName:"ows:ruudut",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:250000.0,maxScale:1.0},

//{category:"espoo_fi",category_fi:"Espoon kaupunki",category_se:"Esbo stad",category_en:"City of Espoo",id:"304",name:"",name_fi:"Opaskartta",name_se:"Guidekarta",name_en:"Guide Map",wmsName:"Opaskartta",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=http://kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",opacity:75,style:"",minScale:100000.0,maxScale:4000.0},
//{category:"espoo_fi",category_fi:"Espoon kaupunki",category_se:"Esbo stad",category_en:"City of Espoo",id:"305",name:"",name_fi:"Osoitekartta",name_se:"Addreskarta",name_en:"Address Map",wmsName:"Osoitekartta",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=http://kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",opacity:75,style:"",minScale:100000.0,maxScale:1.0},
//{category:"espoo_fi",category_fi:"Espoon kaupunki",category_se:"Esbo stad",category_en:"City of Espoo",id:"306",name:"",name_fi:"Maankäyttökartta",name_se:"Markanvändningskarta",name_en:"Land Use Map",wmsName:"Maankayttokartta",wmsUrl:"http://www.paikkatietoikkuna.fi/cgi-bin/wms_proxy.cgi?url=http://kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",opacity:75,style:"",minScale:100000.0,maxScale:1.0},
{category:"paikkatietoikkuna_fi",category_fi:"Karttalehtijaot",category_se:"Kartblad",category_en:"Map grids",id:"1003",name:"",name_fi:"UTM-lehtijako 1:50000",name_se:"UTM-kartblad 1:50000",name_en:"UTM Map grid 1:50000",wmsName:"ows:UTM-lehtijako 1_50000",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:1.0E7,maxScale:1.0},
{category:"paikkatietoikkuna_fi",category_fi:"Karttalehtijaot",category_se:"Kartblad",category_en:"Map grids",id:"1004",name:"",name_fi:"UTM-lehtijako 1:25000",name_se:"UTM-kartblad 1:25000",name_en:"UTM Map grid 1:25000",wmsName:"ows:UTM-lehtijako 1_25000",wmsUrl:"http://www.paikkatietoikkuna.fi/geoserver/wms?",opacity:100,style:"",minScale:1.0E7,maxScale:1.0}
//{category:"turku_fi",category_fi:"Turun kaupunki",category_se:"Åbo stad",category_en:"Turku city",id:"801",name:"",name_fi:"Asemakaavayhdelmä",name_se:"Detaljplan",name_en:"City Plan",wmsName:"Asemakaava",wmsUrl:"http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",opacity:75,style:"",minScale:50000.0,maxScale:1.0},
//{category:"turku_fi",category_fi:"Turun kaupunki",category_se:"Åbo stad",category_en:"Turku city",id:"802",name:"",name_fi:"Pohjakartta",name_se:"Baskarta",name_en:"Base Map",wmsName:"Pohjakartta",wmsUrl:"http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",opacity:100,style:"",minScale:5000.0,maxScale:1.0}
],
	


	CLASS_NAME: "NLSFI.Store.WebMapServiceStore"
});
