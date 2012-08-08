/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:31:34 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.mapframework.complexbundle.NlsFiLayerConfig
 *
 * Map configuration
 */
Oskari.clazz.define('Oskari.mapframework.complexbundle.NlsFiLayerConfig', function(popts) {

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

		startup.layers = Oskari.$("allLayers");
			/*this.sampleLayers;*/

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
		layers : [{

			wmsName : "ows:my_places_categories",
			descriptionLink : "",
			orgName : "XXX",
			type : "wmslayer",
			baseLayerId : 11,
			legendImage : "http://tiuhti.nls.fi/geoserver/ows?",
			formats : {
				value : "text/plain"
			},
			isQueryable : false,
			id : 33340,
			minScale : 10000000,
			style : "",
			dataUrl : "",
			wmsUrl : "http://tiuhti.nls.fi/geoserver/ows?",
			name : "XXX",
			opacity : 50,
			inspire : "Korkeus",
			maxScale : 1
		}, {
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
Oskari.$("allLayers", {
	layers : [{
		styles : {},
		type : "base",
		orgName : "Taustakartat",
		baseLayerId : 35,
		formats : {},
		isQueryable : false,
		id : "base_35",
		minScale : 15000000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
		name : "Taustakartta",
		subLayer : [{
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_5k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 184,
			minScale : 5000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 21,
			name : "Taustakartta 1:5000",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 1
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_10k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 185,
			minScale : 20000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 22,
			name : "Taustakartta 1:10k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 5001
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_20k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 186,
			minScale : 54000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 23,
			name : "Taustakartta 1:20k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 21000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_40k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 187,
			minScale : 133000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 24,
			name : "Taustakartta 1:40k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 55000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_80k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 188,
			minScale : 180000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 25,
			name : "Taustakartta 1:80k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 180000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_160k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 189,
			minScale : 250000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 26,
			name : "Taustakartta 1:160k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 133000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_320k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 190,
			minScale : 350000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 27,
			name : "Taustakartta 1:320k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 250000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_800k",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 191,
			minScale : 800000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 28,
			name : "Taustakartta 1:800k",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 351000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_2m",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 192,
			minScale : 2000000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 29,
			name : "Taustakartta 1:2milj",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 801000
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_4m",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 193,
			minScale : 4000000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 30,
			name : "Taustakartta 1:4milj",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 2000001
		}, {
			dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
			wmsName : "taustakartta_8m",
			descriptionLink : "",
			orgName : "Taustakartta",
			type : "wmslayer",
			baseLayerId : 35,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 194,
			minScale : 15000000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 31,
			name : "Taustakartta 1:8milj",
			permissions : {
				publish : -1
			},
			opacity : 100,
			inspire : "Opaskartat",
			maxScale : 4000001
		}],
		inspire : "Taustakartat",
		maxScale : 1
	}, {
		dataUrl_uuid : "b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
		wmsName : "ortokuva",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/ortokuvat",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 24,
		minScale : 50000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
		orderNumber : 8,
		name : "Ortoilmakuva",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Ortoilmakuvat",
		maxScale : 1
	}, {
		dataUrl_uuid : "b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
		wmsName : "ortokuva_vaaravari",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/ortokuvat",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 25,
		minScale : 50000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
		orderNumber : 9,
		name : "Väärävärikuva",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Ortoilmakuvat",
		maxScale : 1
	}, {
		dataUrl_uuid : "eec8a276-a406-4b0a-8896-741cd716ade6",
		wmsName : "mtk_nimet",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 43,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=eec8a276-a406-4b0a-8896-741cd716ade6",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 45,
		name : "Paikannimet",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Paikannimet",
		maxScale : 1
	}, {
		dataUrl_uuid : "c1890eb1-e25e-4652-9596-ce72f6d7fcf0",
		wmsName : "mtk_tienimet",
		descriptionLink : "",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 91,
		minScale : 20000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=c1890eb1-e25e-4652-9596-ce72f6d7fcf0",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 50,
		name : "Tienimet",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Osoitteet",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_liikenneverkko",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 41,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 305,
		name : "Liikenneverkko",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Liikenneverkot",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_vesistot",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 35,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1000,
		name : "Vesi",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Hydrografia",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_korkeuskayrat",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 36,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1001,
		name : "Korkeuskäyrät",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Korkeus",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_hallintorajat",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 37,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1002,
		name : "Hallintorajat",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Hallinnolliset yksiköt",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_rakennukset",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 39,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1003,
		name : "Rakennukset",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Rakennukset",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_kalliot_ja_hietikot",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 42,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1005,
		name : "Kalliot ja hietikot",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Geologia",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_pellot",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 61,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1006,
		name : "Pellot",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Maanpeite",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_avoimet_metsamaat",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 44,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1007,
		name : "Avoimet metsämaat",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Maanpeite",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_suot",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 58,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1008,
		name : "Suot",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Maanpeite",
		maxScale : 1
	}, {
		dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
		wmsName : "mtk_pohjakuviot",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 59,
		minScale : 250000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1009,
		name : "Pohjakuviot",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Taustakartat",
		maxScale : 1
	}, {
		dataUrl_uuid : "",
		wmsName : "ows:ruudut",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 60,
		minScale : 250000,
		dataUrl : "",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1010,
		name : "Karttalehtijaot",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Paikannusruudustot",
		maxScale : 1
	}, {
		dataUrl_uuid : "",
		wmsName : "ows:mml_toimipiste",
		descriptionLink : "",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 85,
		minScale : 15000000,
		dataUrl : "",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1012,
		name : "MML toimipisteet",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Yleishyödylliset ja muut julkiset palvelut",
		maxScale : 1
	}, {
		dataUrl_uuid : "",
		wmsName : "ows:mml_toimialue",
		descriptionLink : "",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 86,
		minScale : 15000000,
		dataUrl : "",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1013,
		name : "MML toimialueet",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Yleishyödylliset ja muut julkiset palvelut",
		maxScale : 1
	}, {
		dataUrl_uuid : "",
		wmsName : "ows:UTM-lehtijako 1_25000",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_25000",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 63,
		minScale : 10000000,
		dataUrl : "",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1501,
		name : "TM35-lehtijako 1:25000",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Paikannusruudustot",
		maxScale : 1
	}, {
		dataUrl_uuid : "",
		wmsName : "ows:UTM-lehtijako 1_50000",
		descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
		orgName : "Maanmittauslaitos",
		type : "wmslayer",
		baseLayerId : 15,
		legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_50000",
		formats : {
			value : "text/html"
		},
		isQueryable : false,
		id : 62,
		minScale : 10000000,
		dataUrl : "",
		style : "",
		wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
		orderNumber : 1502,
		name : "TM35-lehtijako 1:50000",
		permissions : {
			publish : 2
		},
		opacity : 100,
		inspire : "Paikannusruudustot",
		maxScale : 1
	}, {
		styles : {},
		orgName : "Maanmittauslaitos",
		type : "groupMap",
		baseLayerId : 36,
		formats : {},
		isQueryable : false,
		id : "base_36",
		minScale : 15000000,
		dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
		name : "Kuntajako",
		subLayer : [{
			dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
			wmsName : "kuntarajat_10k",
			descriptionLink : "",
			orgName : "Kuntajako",
			type : "wmslayer",
			baseLayerId : 36,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 195,
			minScale : 15000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 61,
			name : "Kuntajako 1:10 000",
			permissions : {
				publish : 2
			},
			opacity : 100,
			inspire : "Hallinnolliset yksiköt",
			maxScale : 1
		}, {
			dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
			wmsName : "kuntarajat_100k",
			descriptionLink : "",
			orgName : "Kuntajako",
			type : "wmslayer",
			baseLayerId : 36,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 196,
			minScale : 80000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 62,
			name : "Kuntajako 1:100 000",
			permissions : {
				publish : 2
			},
			opacity : 100,
			inspire : "Hallinnolliset yksiköt",
			maxScale : 15001
		}, {
			dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
			wmsName : "kuntarajat_250k",
			descriptionLink : "",
			orgName : "Kuntajako",
			type : "wmslayer",
			baseLayerId : 36,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 197,
			minScale : 230000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 63,
			name : "Kuntajako 1:250 000",
			permissions : {
				publish : 2
			},
			opacity : 100,
			inspire : "Hallinnolliset yksiköt",
			maxScale : 80000
		}, {
			dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
			wmsName : "kuntarajat_1000k",
			descriptionLink : "",
			orgName : "Kuntajako",
			type : "wmslayer",
			baseLayerId : 36,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 198,
			minScale : 800000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 64,
			name : "Kuntajako 1:1milj",
			permissions : {
				publish : 2
			},
			opacity : 100,
			inspire : "Hallinnolliset yksiköt",
			maxScale : 231000
		}, {
			dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
			wmsName : "kuntarajat_4500k",
			descriptionLink : "",
			orgName : "Kuntajako",
			type : "wmslayer",
			baseLayerId : 36,
			legendImage : "",
			formats : {
				value : "text/html"
			},
			isQueryable : false,
			id : 199,
			minScale : 15000000,
			dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
			style : "",
			wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
			orderNumber : 65,
			name : "Kuntajako 1:4,5milj",
			permissions : {
				publish : 2
			},
			opacity : 100,
			inspire : "Hallinnolliset yksiköt",
			maxScale : 850000
		}],
		inspire : "Hallinnolliset yksiköt",
		maxScale : 1
	}]
});
/*
 startup.mapConfigurations = {
 scale : 0,
 index_map : true,
 plane_list : true,
 width : 1000,
 north : "7204000",
 zoom_bar : true,
 pan : true,
 footer : true,
 height : 430,
 map_function : true,
 east : "470000",
 portletId : "108545_LAYOUT_MapFull2_WAR_map2portlet",
 scala_bar : true
 };
 startup.preSelectedLayers = {
 preSelectedLayers : [ {
 id : "base_35",
 isBase : true,
 name : "Taustakartta"
 } ]
 };
 startup.globalMapAjaxUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=ajax.jsp";
 startup.globalMapPngUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=png.jsp";
 startup.globalPortletNameSpace = "_MapFull2_WAR_map2portlet_";
 startup.userInterfaceLanguage = "fi";
 startup.imageLocation = "/map-application-framework";
 startup.indexMapUrl = "/map-application-framework/resource/images/suomi25m_tm35fin.png";
 startup.instructionsUrl = "http://www.paikkatietoikkuna.fi/web/fi/karttaikkunan-pikaopas";
 startup.instructionsText = "Ohjeet";
 startup.ogcSearchServiceEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=json.jsp";
 startup.netServiceCenterEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=ajax.jsp";
 startup.ogcXmlServiceEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=xml.jsp";
 startup.secureViewUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=secureView";
 startup.bundles = [];
 startup.disableDevelopmentMode = "true";
 startup.useGetFeatureInfoProxy = "true";
 startup.printUrl = "/widget/web/fi/kartta-tulostus/-/MapPrint2_WAR_map2portlet";
 startup.printWindowWidth = "880";
 startup.printWindowHeight = "800";

 */