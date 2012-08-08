/* This is a unpacked Oskari bundle (bundle script version Tue Feb 14 2012 08:27:46 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.mapframework.complexbundle.NlsFiLayerConfig
 * 
 * Map configuration
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.complexbundle.NlsFiLayerConfig',
				function(popts) {

					var conf = popts || {};

					conf.userInterfaceLanguage = conf.userInterfaceLanguage
							|| "fi";

					this.conf = conf;

				},
				{

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
							preSelectedLayers : [ {
								id : "base_27"
							} ]
						};

						// app config
						startup.userInterfaceLanguage = "fi";

						startup.globalMapAjaxUrl = "ajax.js?";
						startup.globalPortletNameSpace = "";

						startup.imageLocation = "../../map-application-framework";
						startup.indexMapUrl = '../resource/images/suomi25m_tm35fin.png';
						startup.instructionsText = "Ohjeet";
						startup.instructionsUrl = "http://www.google.fi";
						startup.printUrl = "../print/print.html";
						startup.printWindowHeight =  21*32;
						startup.printWindowWidth = 20*32;

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
						layers : [
						          {
						        	
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
						          },

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
								},

								{
									styles : {},
									orgName : "Taustakartat",
									type : "base",
									baseLayerId : 27,
									formats : {},
									isQueryable : false,
									id : "base_27",
									minScale : 15000000,
									dataUrl : "",
									name : "Taustakartta",
									subLayer : [
											{
												wmsName : "taustakartta_5k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_10k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_20k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_40k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_80k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_160k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_320k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_800k",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_2m",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_4m",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											},
											{
												wmsName : "taustakartta_8m",
												styles : [ {
													title : "Normaali väri",
													name : "normal"
												}, {
													title : "Vaalennettu väri",
													name : "light"
												} ],
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
											} ],
									inspire : "Taustakartta",
									maxScale : 1
								} ]
					},

					/**
					 * @getMapConfiguration
					 * 
					 */
					getMapConfiguration : function() {
						return this.conf;
					}

				});
