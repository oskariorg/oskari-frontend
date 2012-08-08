/**
 * @class Oskari.mapframework.complexbundle.NlsFiLayerConfig
 *
 * Map configuration
 */
Oskari.clazz.define('Oskari.karttatiili.bundle.layers.KarttatiiliFiLayerConfig', function(popts) {

	var conf = popts || {};

	conf.userInterfaceLanguage = conf.userInterfaceLanguage || "fi";

	this.conf = conf;

}, {

	/**
	 * @method create
	 *
	 * some nls.fi layers
	 */
	create : function() {

		var startup = this.conf;

		startup.layers = this.sampleLayers;

		// predefined set of layers
		startup.preSelectedLayers = {
			preSelectedLayers : [{
				id : "base_35"
			}]
		};

		// app config
		startup.userInterfaceLanguage = "fi";

		startup.globalMapAjaxUrl = "ajax.js?";
		startup.globalPortletNameSpace = "";

		startup.imageLocation = "../../resources";
		startup.indexMapUrl = '../resource/images/suomi25m_tm35fin.png';
		startup.instructionsText = "Ohjeet";
		startup.instructionsUrl = "http://www.google.fi";
		startup.printUrl = "../print/print.html";
		startup.printWindowHeight = 21 * 32;
		startup.printWindowWidth = 20 * 32;

		startup.mapConfigurations = {
			footer : true,
			scale : 3,
			index_map : true,
			height : 600,
			width : 1000,
			plane_list : true,
			map_function : true,
			zoom_bar : true,
			north : "7204000",
			east : "552000",
			scala_bar : true,
			pan : true
		};

		return startup;
	},
	sampleLayers : {
		layers : [ {
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_50k'&",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?",
			name : "maastokartta_50k (7...7) geowebcache_change_set",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 401,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'peruskartta'&",
			name : "peruskartta (8...12) geowebcache_change_set",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		}, {
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_50k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 4000,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_50k'",
			name : "maastokartta 50k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'yleiskartta_1m'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 4001,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'yleiskartta_1m'",
			name : "yleiskartta_1m (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_500k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400500,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_500k'",
			name : "maastokartta_500k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_250k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400250,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_250k'",
			name : "maastokartta_250k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'yleiskartta_8m'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 4004,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'yleiskartta_8m'",
			name : "yleiskartta_8m (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_100k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400100,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_100k'",
			name : "maastokartta_100k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_100k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500100,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'maastokartta_100k'",
			name : "maastokartta_100k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_160k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400160,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_160k'",
			name : "taustakartta_160k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_160k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500160,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_160k'",
			name : "taustakartta_160k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_80k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400080,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_80k'",
			name : "taustakartta_80k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_80k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500080,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_80k'",
			name : "taustakartta_80k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_20k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400020,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_20k'",
			name : "taustakartta_20k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_20k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500020,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_20k'",
			name : "taustakartta_20k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_10k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400010,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_10k'",
			name : "taustakartta_10k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
						descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_10k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500010,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_10k'",
			name : "taustakartta_10k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_5k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 400005,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_5k'",
			name : "taustakartta_5k (geowebcache_change_set)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_5k'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 500005,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'taustakartta_5k'",
			name : "taustakartta_5k (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		{
			wmsName : "geowebcachecider:geowebcache_change_set",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'ortokuva'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : "4ortokuva",
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'ortokuva'",
			name : "ortokuva (geowebcache_change)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "geowebcachecider:geowebcache_change_set_entry",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'ortokuva'",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : "5ortokuva",
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?CQL_FILTER=layername%20like%20'ortokuva'",
			name : "ortokuva (geowebcache_change_set_entry)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		
		/**
		 * layers in a supporting role
		 */
		{
			wmsName : "jansson:taajama",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 501,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?",
			name : "taajaan asutut alueet",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "jansson:taajama_yleistys",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 5402,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?",
			name : "taajaan asutut alueet (bbox yleistys)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "jansson:taajamatopbox",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 502,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?",
			name : "taajaan asutut alueet (top N bbox)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		{
			wmsName : "jansson:taajamatop",
			descriptionLink : "",
			orgName : "karttatiili.fi",
			type : "wmslayer",
			
			legendImage : "http://jkorhonen.nls.fi/geoserver/wms?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 503,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://jkorhonen.nls.fi/geoserver/wms?",
			name : "taajaan asutut alueet (top N)",
			opacity : 50,
			inspire : "Karttatiilipuskuri",
			maxScale : 1
		},
		
		
		/**
		 * 
		 */
		
		 {
			wmsName : "rinnevalovarjostus",
			descriptionLink : "",
			orgName : "Geodeettinen laitos",
			type : "wmslayer",
			baseLayerId : 11,
			legendImage : "http://217.152.180.24/cgi-bin/wms_rinnevalo?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 40,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo?&az=315&alt=45&z=100",
			name : "Rinnevalovarjostus",
			opacity : 50,
			inspire : "Korkeus",
			maxScale : 1
		}, {
			styles : {},
			orgName : "Taustakartat",
			type : "base",
			baseLayerId : 35,
			formats : {},
			isQueryable : false,
			id : "base_35",
			minScale : 15000000,
			dataUrl : "",
			name : "Taustakartta",
			subLayer : [{
				wmsName : "taustakartta_5k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 125,
				minScale : 5000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:5000",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 1
			}, {
				wmsName : "taustakartta_10k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 127,
				minScale : 20000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:10k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 5001
			}, {
				wmsName : "taustakartta_20k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 128,
				minScale : 54000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:20k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 21000
			}, {
				wmsName : "taustakartta_40k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 129,
				minScale : 133000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:40k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 55000
			}, {
				wmsName : "taustakartta_80k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 130,
				minScale : 200000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:80k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 133000
			}, {
				wmsName : "taustakartta_160k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 131,
				minScale : 250000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:160k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 201000
			}, {
				wmsName : "taustakartta_320k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 132,
				minScale : 350000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:320k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 251000
			}, {
				wmsName : "taustakartta_800k",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 133,
				minScale : 800000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:800k",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 351000
			}, {
				wmsName : "taustakartta_2m",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 134,
				minScale : 2000000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:2milj",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 801000
			}, {
				wmsName : "taustakartta_4m",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 135,
				minScale : 4000000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:4milj",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 2000001
			}, {
				wmsName : "taustakartta_8m",
				styles : [{
					title : "Normaali v�ri",
					name : "normal"
				}, {
					title : "Vaalennettu v�ri",
					name : "light"
				}],
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Taustakartta",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "application/vnd.ogc.gml"
				},
				isQueryable : false,
				id : 136,
				minScale : 15000000,
				style : "",
				dataUrl : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Taustakartta 1:8milj",
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 4000001
			}],
			inspire : "Taustakartta",
			maxScale : 1
		}]
	},

	/**
	 * @getMapConfiguration
	 *
	 */
	getMapConfiguration : function() {
		return this.conf;
	}
});
