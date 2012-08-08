/*
 * 
 * OsoitePiste
 * 
 * <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" 
 * xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
 *  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> 
 *  <wfs:Query typeName="oso:Osoitepiste" srsName="EPSG:3067" 
 *  xmlns:oso="http://xml.nls.fi/Osoitteet/Osoitepiste/2011/02">
 *   <wfs:PropertyName>oso:rakennustunnus </wfs:PropertyName> 
 *   <wfs:PropertyName>oso:kiinteistotunnus </wfs:PropertyName>
 *    <wfs:PropertyName>oso:kuntanimiFin </wfs:PropertyName>
 *     <wfs:PropertyName>oso:kuntanimiSwe </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:kuntatunnus </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:sijainti </wfs:PropertyName> 
 *     <wfs:PropertyName>oso:osoite </wfs:PropertyName> 
 *     <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
 *      <ogc:Within> <ogc:PropertyName>oso:sijainti </ogc:PropertyName>
 *       <gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:3067">
 *        <gml:exterior> <gml:LinearRing> <gml:posList>359805.5156968306 6700903.887125473 359357.49944485445 6700755.88175822 359117.49073846114 6700527.873489743 358909.48319296294 6700187.861159462 358833.480436035 6699863.8494093735 358885.48232260917 6699471.835193364 359001.48653095367 6699031.819236449 359245.49538265826 6698783.810242622 359569.5071364563 6698583.80298949 359973.5217922854 6698519.800668449 360361.53586756054 6698583.80298941 360737.5495073708 6698843.812418378 360937.55676250154 6699127.822717762 361077.5618410299 6699491.835918447 361085.5621310739 6699911.851149949 360941.5569071728 6700271.86420556 360741.54965178936 6700599.876100678 360349.5354313571 6700803.883498819 359873.51816364296 6700903.887125467 358885.4823225632 6699579.8391099665 359149.49189973436 6699571.83881984 359777.51468126953 6700431.870008174 359781.5148267149 6699599.839835168 359945.52077609545 6699603.839980254 359949.5209212811 6699403.832727152 360625.5454441989 6699419.83330729 359937.52048623154 6698751.809082054 359937.52048631426 6698547.801683853 359933.5203412146 6698535.801248652 361077.56184097624 6699631.840995542 359953.52106630965 6699615.840415455 359897.5190342881 6700911.887415561 359805.5156968306 6700903.887125473 </gml:posList> </gml:LinearRing> </gml:exterior> </gml:Polygon> </ogc:Within>
 *         </ogc:Filter> </wfs:Query> </wfs:GetFeature>
 * 
 * Rakennuksen huoneistotiedot
 * <wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 *  <wfs:Query typeName="rhr:RakennuksenHuoneistotiedot" srsName="EPSG:3067" xmlns:rhr="http://xml.nls.fi/Rakennustiedot/VTJRaHu/2009/02">
 *   <wfs:PropertyName>rhr:rakennustunnus </wfs:PropertyName>
 *    <wfs:PropertyName>rhr:kiinteistotunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:tarkistusmerkki </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:rakennusnumero </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:tilanNimi </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:kiinteistoyksikonMaaraalatunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:syntymahetkenRakennustunnus </wfs:PropertyName> 
 *    <wfs:PropertyName>rhr:postinumero </wfs:PropertyName>
 *     <wfs:PropertyName>rhr:rakennustunnuksenVoimassaolo </wfs:PropertyName> 
 *     <wfs:PropertyName>rhr:valmistumispaiva </wfs:PropertyName>
 *      <wfs:PropertyName>rhr:rakennuspaikanHallintaperuste </wfs:PropertyName>
 *       <wfs:PropertyName>rhr:kayttotarkoitus </wfs:PropertyName>
 *        <wfs:PropertyName>rhr:kaytossaolotilanne </wfs:PropertyName>
 *         <wfs:PropertyName>rhr:julkisivumateriaali </wfs:PropertyName> 
 *         <wfs:PropertyName>rhr:kerrosala </wfs:PropertyName>
 *          <wfs:PropertyName>rhr:kerrosluku </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:kokonaisala </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:tilavuus </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:lammitystapa </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:lammonlahde </wfs:PropertyName> 
 *          <wfs:PropertyName>rhr:rakennusmateriaali </wfs:PropertyName>
 *           <wfs:PropertyName>rhr:rakennustapa </wfs:PropertyName>
 *            <wfs:PropertyName>rhr:sahko </wfs:PropertyName>
 *             <wfs:PropertyName>rhr:kaasu </wfs:PropertyName>
 *              <wfs:PropertyName>rhr:viemari </wfs:PropertyName>
 *               <wfs:PropertyName>rhr:vesijohto </wfs:PropertyName>
 *                <wfs:PropertyName>rhr:lamminvesi </wfs:PropertyName>
 *                 <wfs:PropertyName>rhr:aurinkopaneeli </wfs:PropertyName> 
 *                 <wfs:PropertyName>rhr:hissi </wfs:PropertyName>
 *                  <wfs:PropertyName>rhr:ilmastointi </wfs:PropertyName> 
 *                  <wfs:PropertyName>rhr:saunojenLukumaara </wfs:PropertyName>
 *                   <wfs:PropertyName>rhr:uimaaltaidenLukumaara </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:vaestosuojanKoko </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:viemariliittyma </wfs:PropertyName> 
 *                   <wfs:PropertyName>rhr:vesijohtoliittyma </wfs:PropertyName>
 *                    <wfs:PropertyName>rhr:sahkoliittyma </wfs:PropertyName> 
 *                    <wfs:PropertyName>rhr:kaasuliittyma </wfs:PropertyName>
 *                     <wfs:PropertyName>rhr:kaapeliliittyma </wfs:PropertyName> 
 *                     <wfs:PropertyName>rhr:poikkeuslupa </wfs:PropertyName>
 *                      <wfs:PropertyName>rhr:perusparannus </wfs:PropertyName>
 *                       <wfs:PropertyName>rhr:perusparannuspaiva </wfs:PropertyName>
 *                        <wfs:PropertyName>rhr:sijainti </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:sijaintiepavarmuus </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:luontiAika </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:muutosAika </wfs:PropertyName> 
 *                        <wfs:PropertyName>rhr:osoite </wfs:PropertyName>
 *                         <wfs:PropertyName>rhr:huoneisto </wfs:PropertyName>
 *                          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
 *                           <ogc:Within> <ogc:PropertyName>rhr:sijainti </ogc:PropertyName>
 *                            <gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:3067"> 
 *                            <gml:exterior> <gml:LinearRing>
 *                             <gml:posList>360117.5212843064 6701293.84404207 359481.52128079697 6700985.844042104 359797.521282709 6700373.844042087 360421.52128616703 6700353.844042055 360369.5212857458 6701041.844042056 360117.5212843064 6701293.84404207 </gml:posList> </gml:LinearRing> </gml:exterior> </gml:Polygon>
 *                              </ogc:Within> </ogc:Filter>
 *                               </wfs:Query> </wfs:GetFeature>
 */
Oskari.clazz
		.define(
				'Oskari.poc.sade3.SadeWorker',
				function(opts) {
					this.opts = opts || {};
					this.urls = this.opts.urls;
					this.mapplet = Oskari.clazz.create('Oskari.poc.sade3.SADEMapplet',opts);
					this.scheduler = Oskari.clazz.create('Oskari.NLSFI.Worker.Scheduler');
					this.scheduler.queueInterval = 1000;
					this.scheduler.errorHandler = function(errJSON) {
						console.log(errJSON);
					};

					this.scheduler.statsFuncs = {
						queueStatus : function(qv, pv, cancelledRequests,
								cancelledPending, cancelledOutOfView,
								unloadedSnapshot, loadedSnapshot,
								errorsEncountered, totalt) {
							mediator.log("" + qv + "/" + pv);
						},
						requestStatus : function(req, requestStr, bbox, geom) {
							mediator.log("REQUEST " + requestStr);
						},
						responseStatus : function(doc, feats, stats) {
							mediator.log("RESPONSE ");
						}
					};

					this.scheduler.create( []);
					this.workerLayers = {};

					this.services = {};

					this.adapters = {};
				},
				{
					log : function(text) {

					},

					start : function() {
						this.scheduler.queueInterval = 500; // let's not break
															// IE
						this.scheduler.setQueueSpeed(2000);

						this.scheduler.startWorker();
					},

					stop : function() {
						this.scheduler.stopWorker();
					},

					setupMap : function(map) {
						this.mapplet.createAsPorttiKarttaikkuna(map);

						this.mapplet.createSijaintirajausLayer();

						/*
						 * this.mapplet.map.addControl(this.mapplet.createToolbar());
						 * this.mapplet.map.addControl(new
						 * OpenLayers.Control.LayerSwitcher( { 'ascending' :
						 * false }));
						 */
					},

					setAdapter : function(key, adapter) {
						this.adapters[key] = adapter;
					},

					setupWorkers : function() {

						var opts = this.opts;

						var app = this;
						var mapplet = this.mapplet;

						var workedOnlayers = [];

						var ktjkiiwfs = Oskari.clazz.create('Oskari.poc.sade3.service.KTJkiiWFS',mapplet,
								this.urls.KTJkiiWFS);

						this.services['KTJkiiWFS'] = ktjkiiwfs;

						workedOnlayers.push(ktjkiiwfs
								.PalstanTunnuspisteenSijaintitiedot('ktj_pts'));
						workedOnlayers.push(ktjkiiwfs
								.KiinteistorajanSijaintitiedot('ktj_ks'));
						workedOnlayers.push(ktjkiiwfs
								.RekisteriyksikonTietoja('ktj_rt'));
						workedOnlayers.push(ktjkiiwfs.PalstanTietoja('ktj_pt'));

						var rakennustiedotwfs = Oskari.clazz.create('Oskari.poc.sade3.service.RakennustiedotWFS',mapplet,
								this.urls.RakennustiedotWFS);

						this.services['RakennustiedotWFS'] = rakennustiedotwfs;

						workedOnlayers.push(rakennustiedotwfs
								.RakennuksenOsoitepiste('rhr_osoitepiste'));
						workedOnlayers
								.push(rakennustiedotwfs
										.RakennuksenOminaisuustiedot('rhr_rakennuksen_ominaisuustiedot'));
						workedOnlayers.push(rakennustiedotwfs
								.RakennuksenOsoitenimi('rhr_osoitenimi'));

						var maastowfs = Oskari.clazz.create('Oskari.poc.sade3.service.MaastoWFS',mapplet,
								this.urls.MaastoWFS);

						this.services['MaastoWFS'] = maastowfs;

						workedOnlayers
								.push(maastowfs
										.MaastotietokannanOsoitepiste('mtk_osoitepiste'));
						workedOnlayers.push(maastowfs
								.MaastotietokannanOsoitenimi('mtk_osoitenimi'));

						var s = this.scheduler;
						for ( var n = 0; n < workedOnlayers.length; n++) {
							var lwq = workedOnlayers[n];
							this.workerLayers[lwq.lwqId] = lwq;

							s.pushWorker(lwq.worker);
						}

					},

					searchCUByQualifiedIdentifier : function(kiinteistotunnus,
							popts) {
						var opts = popts || {};
						var lwqId = "ktj_rt";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'ktjkiiwfs:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					searchCUUnitByBounds : function(bbox, popts) {
						var opts = popts || {};

						var lwqId = "ktj_pt";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						lwq.queue.pushJob( {
							bounds : bbox,
							callback : this.bboxRequestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					searchCUAddressByQualifiedIdentifier : function(
							kiinteistotunnus, popts) {

						var opts = popts || {};
						var lwqId = "rhr_osoitepiste";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq
							}
						});
					},

					searchCUBuildingsByQualifiedIdentifier : function(
							kiinteistotunnus) {

						var lwqId = "rhr_rakennuksen_ominaisuustiedot";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'rhr:kiinteistotunnus',
							value : kiinteistotunnus
						});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq
							}
						});
					},

					searchAnyByLonLat : function(lonlat, scale, viewbbox,
							options) {
						var bounds = new OpenLayers.Bounds();
						bounds.extend(new OpenLayers.LonLat(lonlat.lon - 0.5,
								lonlat.lat - 0.5));
						bounds.extend(new OpenLayers.LonLat(lonlat.lon + 0.5,
								lonlat.lat + 0.5));

						// var geom = bounds.toGeometry();
						// alert(bounds.toBBOX());
						this.searchCUUnitByBounds(bounds, options);

					},

					searchAnyByCUQualifiedIdentifier : function(identifier,
							opts) {
						this.searchCUByQualifiedIdentifier(identifier, opts);

						this.searchCUAddressByQualifiedIdentifier(identifier,
								opts);

						this.searchCUBuildingsByQualifiedIdentifier(identifier,
								opts);
					},

					searchCUByBuildingAddress : function(addressRoad,
							addressNo, zip, popts) {

						var opts = popts || {};
						var lwqId = "mtk_osoitenimi";
						var lwq = this.workerLayers[lwqId];
						var layerOptions = lwq.layerOptions;

						var filterAddr = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:katunimi',
							value : addressRoad
						});
						var filterAddrNo = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : 'oso:katunumero',
							value : addressNo
						});
						/*
						 * var filterZip = new OpenLayers.Filter.Comparison( {
						 * type : OpenLayers.Filter.Comparison.EQUAL_TO,
						 * property : 'oso:postinumero', value : zip });
						 */

						var filter = new OpenLayers.Filter.Logical( {
							type : OpenLayers.Filter.Logical.AND,
							filters : [ filterAddr, filterAddrNo ]
						// ,filterZip]
								});

						lwq.queue.pushJob( {
							filter : filter,
							callback : this.requestProcessedCallback,
							scope : this,
							args : {
								lwq : lwq,
								zoomToExtent : opts.zoomToExtent
							}
						});
					},

					requestProcessedCallback : function(args, feats, request,
							requestXML) {
						var mapplet = this.mapplet;
						var lwq = args.lwq;

						/*
						 * var elReq = document.getElementById('log_request');
						 * if( Ext.isGecko ) { var xmlData = requestXML;
						 * elReq.textContent = xmlData; } else { var xmlData =
						 * requestXML; elReq.innerText = xmlData; } var elRsp =
						 * document.getElementById('log_response'); if(
						 * Ext.isGecko ) { var xmlData = request.responseText ;
						 * elRsp.textContent = xmlData; } else { var xmlData =
						 * request.responseText ; elRsp.innerText = xmlData; }
						 */
						// prettyPrint();
						var adapter = this.adapters[lwq.lwqId];
						if (adapter) {
							adapter(args, feats, request, requestXML);
						}

					},

					bboxRequestProcessedCallback : function(args, feats,
							request, requestXML) {
						var mapplet = this.mapplet;
						var lwq = args.lwq;

						/*
						 * var elReq = document.getElementById('log_request');
						 * if( Ext.isGecko ) { var xmlData = requestXML;
						 * elReq.textContent = xmlData; } else { var xmlData =
						 * requestXML; elReq.innerText = xmlData; } var elRsp =
						 * document.getElementById('log_response'); if(
						 * Ext.isGecko ) { var xmlData = request.responseText ;
						 * elRsp.textContent = xmlData; } else { var xmlData =
						 * request.responseText ; elRsp.innerText = xmlData; }
						 */
						// prettyPrint();
						var adapter = this.adapters[lwq.lwqId];
						if (adapter) {
							adapter(args, feats, request, requestXML);
						}

					},

					clearWorkerLayers : function() {
						for (p in this.workerLayers) {
							var lwq = this.workerLayers[p];

							lwq.layer.destroyFeatures(lwq.layer.features);
						}
					},

					reset : function() {
						this.clearWorkerLayers();
					}

				});