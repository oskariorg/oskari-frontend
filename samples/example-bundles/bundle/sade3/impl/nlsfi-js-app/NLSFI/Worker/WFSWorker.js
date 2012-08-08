/**
 * 
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * Class: NLSFI.Worker.WFSWorker
 * 
 * T�m� muodostaa WFS GetFeature pyynn�n ja tulkitsee vastauksen
 * responseFormat mukaisesti.
 * 
 * K�sittelee jonoon laitettuja palvelupyynt�j� Schedulerin tahdittamana
 * ja hakee aineistoa layer luokkamuuttujan OpenLayers.Layeriin
 * 
 * L�hett�� WFS pyynn�n POST menettelyll�. KVP pyynt�� ei ole
 * toteutettu loppuun.
 * 
 * Sis�lt�� 'jonkin verran' WFS protokollan toiminnallisuutta, mutta
 * toisaalta on yhteensopiva jonoutumisk�sittelyn kanssa.
 * 
 * featureType = kohde joita haetaan (ja siihen liittyvi�) ns ja nsPrefix on
 * kohteen nimiavaruuden m��ritykset geometryName on sijaintikohde, johon
 * sijaintirajaus kohdistuu
 * 
 * job.propertyNames tai featurePropertyNames voi rajata mit� haetaan
 * 
 * create() metodi varsinaisesti luo t�m�n. initialize() alustaa
 * vajavaisesti.
 * 
 * T�SS� ON BUGI, jos dataProj ei ole sama kuin mapProj. Kiertotien�:
 * asetetaan responseFormat.externalProjection ja
 * responseFormat.internalProjection create() kutsun j�lkeen viel�
 * kohdalleen
 * 
 */

Oskari.clazz.define('Oskari.NLSFI.Worker.WFSWorker',function(popts)  {

	var options = popts||{};
	
	var baseProps= {
			description : null,
			stats : null,

			/**
			 * Property: workerCount
			 * 
			 * k�ytet��n hakujen toiston hidastamiseen JavaScript ajastus
			 * toistaa intervallia vakioidulla frekvenssill� ja t�ll�
			 * hidastetaan hakujen suoritusta
			 */

			workerCount : 0,

			/**
			 * Property: processedRequests et. al.
			 * 
			 * K�ytet��n tilastojen ker��miseen ja visualisointiin
			 * Nollataan v�lill�
			 */

			processedRequests : 0,
			cancelledRequests : 0,
			cancelledPending : 0,
			cancelledOutOfView : 0,
			cancelledExists : 0,
			loadedSnapshot : 0,
			unloadedSnapshot : 0,
			errorsEncountered : 0,
			hasGaugeChanged : true,

			/**
			 * tilastoja varten muutamat perustiedot t�h�n talteen
			 */
			statsDataFeatureCount : 0,
			statsDataErrorCount : 0,
			statsDataProcessTime : 0,

			/**
			 * Property: request
			 * 
			 * HTTP Request, joka on JUST menossa. Vain yksi kerrallaan.
			 * 
			 */
			request : null,

			/**
			 * 
			 * Property: layer
			 * 
			 * Layer, johon t�m� Worker hakee aineistoa. PIT�ISI olla TILE
			 * 
			 */
			layer : null,

			/**
			 * Property: statsFuncs
			 * 
			 */
			statsFuncs : null,

			/**
			 * Property: responseStats
			 * 
			 * Rakenne, johon tallennetaan aikaleimoja
			 */
			responseStats : null,

			/**
			 * Property: requestFormat
			 * 
			 * OpenLayers.Format pohjainen formaatti, jonka mukaisia
			 * pyynt�j� l�hetet��n
			 * 
			 */

			requestFormat : null,

			/**
			 * Property: responseFormat
			 * 
			 * OpenLayers.Format pohjainen formaatti, jonka mukaisia vastauksia
			 * tulkitaan
			 * 
			 */
			responseFormat : null,

			/**
			 * Property: map
			 * 
			 * OpenLayers.Map, joka esitt�� aineistoa, mutta miksi
			 * t��ll� ?
			 * 
			 */
			map : null,

			/**
			 * Property: mapProj
			 * 
			 * Projektio, jossa aineisto esitet��n (asetetaan Mappletissa)
			 * 
			 */
			mapProj : null,

			/**
			 * Property: dataProj
			 * 
			 * Projektio, jossa t�m� LayerWorker hakee aineistoa
			 * 
			 */
			dataProj : null,

			/**
			 * Property: url
			 * 
			 * Palvelun URL osoite
			 * 
			 */
			url : null,

			/**
			 * Property: strategy
			 * 
			 * K�yt�nn�ss� aina
			 * NLSFI.OpenLayers.Strategy.QueuedTilesStrategy, joka osaa kasata
			 * TILETYT palvelupyynn�t jonoon
			 */
			strategy : null,

			/**
			 * Property: tileQueue
			 * 
			 * NLSFI.OpenLayers.Strategy.TileQueue, johon ker�t��n
			 * palvelupyynt�j� varten tietoja
			 * NLSFI.OpenLayers.Strategy.QueuedTile -olioina
			 */
			tileQueue : null
	};
	
	var props = {
			/**
			 * 
			 * K�sitelt�v�n nimiavaruuden tiedot
			 * 
			 */

			ns : null,
			nsPrefix : null,

			/**
			 * Property: featureType,
			 * 
			 * mit� haetaan
			 * 
			 */
			featureType : null,

			/**
			 * Property: geometryName
			 * 
			 * Hakuihin k�ytett�v�n sijaintikent�n nimi
			 * 
			 */
			geometryName : null,

			/**
			 * Property: featurePropertyNames
			 * 
			 * T�ll� voi rajata haettavia kohteita ILMAN featurePrefix!!
			 * 
			 */

			featurePropertyNames : null

			/**
			 * Method: initialize
			 * 
			 * Alustaa luokan ja kutsuu superclassin constructoria
			 * 
			 */
	};
	
	for( p in baseProps ) this[p] = baseProps[p];
	for( p in props ) this[p] = props[p];
	
	this.stats = {
			queued : 0,
			processed : 0,
			totalt : 0
		};

		this.statsFuncs = {
			queueStatus : function(qv, pv, cancelledRequests, cancelledPending,
					cancelledOutOfView, unloadedSnapshot, loadedSnapshot,
					errorsEncountered, totalt) {
			},
			requestStatus : function(req, requestStr, bbox, geom) {
			},
			responseStatus : function(doc, feats, stats) {
			}
		};

		this.strategy = options.strategy;
		this.tileQueue = this.strategy.tileQueue;


	this.featureType = options.featureType;
	this.description = options.description || options.featureType;

	this.geometryName = options.geometryName;
	this.ns = options.featureNS;
	this.nsPrefix = options.featurePrefix;
	this.responseFormat = options.responseFormat;
	
},{

			

			/**
			 * Method: create
			 * 
			 * create( Layer, Map, mapProj, dataProj, URL )
			 * 
			 * T�m� alustaa luokkamuuttujat ja luo requestFormatin sek�
			 * responseFormatin, joilla palvelupyynt� luodaan ja vastaus
			 * tulkitaan.
			 * 
			 */
			create : function(k, m, mp, dp, wu) {
				this.layer = k;
				this.map = m;
				this.mapProj = mp;
				this.dataProj = dp;
				this.url = wu;

				this.responseStats = {
					requestTS : null,
					responseTS : null,
					processedTS : null
				};

				this.requestFormat = OpenLayers.Format.WFST( {
					version : "1.1.0",
					featureType : this.featureType,
					geometryName : this.nsPrefix + ":" + this.geometryName,
					featurePrefix : this.nsPrefix,
					featureNS : this.ns,
					srsName : this.dataProj.getCode()
				});

				// this.responseFormat = null; // PIT�� LAITTAA PERITYSS�

			},

			/**
			 * Method: processResponse
			 * 
			 * T�m� k�sittelee WFS Responsen Formatin mukaisesti ja
			 * lis�� Featuret Layeriin.
			 * 
			 * T�t� kutsutaan OpenLayers.Request oliosta 'callback'
			 * menettelyll�
			 * 
			 */

			processResponse : function(request,opts) {

				this.responseStats.responseTS = new Date();

				var doc = request.responseXML;
				if (!doc || !doc.documentElement) {
					doc = request.responseText;
				}

				var feats = this.responseFormat.read(doc);

				this.layer.addFeatures(feats);

				this.responseStats.processedTS = new Date();

				if (feats && feats.length)
					this.statsDataFeatureCount += feats.length;
				var stats = this.responseFormat.stats;
				if (stats) {
					var errs = stats['ERROR_COUNT'] ? stats['ERROR_COUNT'] : 0;
					this.statsDataErrorCount += errs;
				}

				this.statsFuncs.responseStatus(doc, feats, this.responseStats,
						stats); // extension...
				if( opts.callback && opts.scope ) {
					window.console.log("Worker Callback");
					
					OpenLayers.Function.bind(opts.callback,opts.scope)(opts.args,feats,request,opts.request);
					
				} 
				

				
				// let's release request
				this.request = null;
				this.loadedSnapshot++;

				doc = null;
				feats = null;
				
				
				
				
				

			},

			/**
			 * Method: processJob
			 * 
			 * T�m� muodostaa palvelupyynn�n ja l�hett�� WFS
			 * GetFeature pyynn�n POST menettelyll�.
			 * 
			 */

			processJob : function(job) {

				if (job == null)
					return;

				var feat = job.feature;
				var bbox = job.bounds;

				var wfsFilter = job.filter;

				var reqProps = job.propertyNames || this.featurePropertyNames;

				var wfsProps = null;

				if (bbox == null && feat == null && wfsFilter == null)
					return;
				window.console.log("processJob...BBOX/FEAT/FILTER "+bbox);
				if (bbox != null
						&& (isNaN(bbox.left) || isNaN(bbox.top)
								|| isNaN(bbox.right) || isNaN(bbox.bottom)))
					return;

				var getFeatureObj = null;
				var filterObj = null;

				if (reqProps != null && reqProps.length > 0) {
					wfsProps = [];
					var nsPrefixed = this.nsPrefix + ':';

					var msg = "";

					for ( var n = 0; n < reqProps.length; n++) {
						var propName = nsPrefixed + reqProps[n];
						wfsProps.push(propName);

						msg += propName + "\n";
					}
				}

				var epsgExt = null;
				var epsgFeatGeom = null;

				if (bbox != null) {
					epsgExt = bbox.clone().transform(this.mapProj,
							this.dataProj);

					wfsFilter = new OpenLayers.Filter.Spatial( {
						type : OpenLayers.Filter.Spatial.BBOX,
						value : epsgExt,
						projection : this.dataProj.getCode()
					});

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};

					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);

				} else if (feat != null && feat.geometry != null) {

					var epsgFeatGeom = feat.geometry.clone().transform(
							this.mapProj, this.dataProj);

					var filterType = job.filterType ? job.filterType
							: OpenLayers.Filter.Spatial.INTERSECTS;

					if (filterType == OpenLayers.Filter.Spatial.BBOX)
						epsgFeatGeom = epsgFeatGeom.getBounds();

					wfsFilter = new OpenLayers.Filter.Spatial( {
						type : filterType,
						value : epsgFeatGeom,
						projection : this.dataProj.getCode()
					});

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};
					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);
				} else if (wfsFilter != null) {

					var options = {
						filter : wfsFilter,
						propertyNames : wfsProps
					};
					getFeatureObj = OpenLayers.Format.XML.prototype.write
							.apply(this.requestFormat, [ this.requestFormat
									.writeNode("wfs:GetFeature", options) ]);

				} else {
					return;
				}

				if (getFeatureObj != null) {
					// document.getElementById('log_request').innerText =
					// getFeatureObj;
				} else {
					window.console.log("getFeatureObj == null");

					return;
				}

				this.statsFuncs.requestStatus(wfsFilter, getFeatureObj,
						epsgExt, epsgFeatGeom);

				// jos ed. pyynt� menossa perutaan
				if (this.request != null) {
					this.request.abort();
					this.request = null;
					this.cancelledRequests++;
				}

				// aikaleimoja
				this.responseStats.requestTS = new Date();
				this.responseStats.responseTS = null;
				this.responseStats.processedTS = null;

				// l�hetet��n pyynt�
				// window.console.log("OpenLayers.Request.POST...");
				
				var url = this.url;
				
				// window.console.log(""+url);

				var mediator = this;
				
				this.request = OpenLayers.Request.POST( {
					url : this.url,
					success : function(r) {
						mediator.processResponse(r,{
							callback: job.callback,
							scope: job.scope,
							args: job.args,
							request: getFeatureObj
						});
					},
					failure : this.processFailure,
					scope : this,
					data : getFeatureObj
				});

				// ja jatketaan processResponsessa tai SUPER.processFailuressa
			},

			CLASS_NAME : "NLSFI.Worker.WFSWorker",
			
			/**
			 * Method: setQueueSpeed
			 * 
			 * Asetetaan jonon purkamisen hidastus
			 */

			setQueueSpeed : function(val) {
				this.queueSpeed = val;
			},

			/**
			 * Method: step
			 * 
			 * T�t� Scheduler kutsuu ajaakseen Workeria hakemaan aineistoa
			 * palvelusta
			 * 
			 */

			step : function() {

				if (this.layer.getVisibility() == false) {
					this.stats.queued = 0;
					this.stats.processed = 0;
					this.stats.totalt = 0;

					return;
				}

				
				if (this.queueSpeed == 0)
					return;

				
				this.workerCount += this.queueInterval;
				if (this.workerCount < this.queueSpeed) {
					return;
				}
				this.workerCount = 0;

				
				if (this.request != null)
					return;

				
				var qv = this.tileQueue.getLength();
				var pv = this.processedRequests;
				
				
				var totalt = qv + pv;

				this.stats.queued = qv;
				this.stats.processed = pv;
				this.stats.totalt = totalt;

				this.statsFuncs.queueStatus(qv, pv, this.cancelledRequests,
						this.cancelledPending, this.cancelledOutOfView,
						this.unloadedSnapshot, this.loadedSnapshot,
						this.errorsEncountered, totalt);

				// Tarkistetaanko onko jonoumaa
				var localQLength = qv;
				if (localQLength == 0) {
					this.processedRequests = 0;
					this.cancelledRequests = 0;
					this.cancelledPending = 0;
					this.cancelledOutOfView = 0;
					this.cancelledExists = 0;
					this.unloadedSnapshot = 0;
					this.loadedSnapshot = 0;
					return;
				}
		        window.console.log("Step..."+qv);
				this.popJob();

			},

			errorHandler : function(err) {
				window.alert(this.CLASS_NAME + ":" + err);
			},

			popJob : function() {
				
				var nextJob = this.tileQueue.popJob();
				if (nextJob == null)
					return false;
				var feat = nextJob.tileFeature;
				if (feat != null) {
					this.layer.destroyFeatures( [ feat ]);
					nextJob.tileFeature = null;
				}
				try {
					this.processJob(nextJob);
				} catch (err) {
					window.alert(err);
					this.errorsEncountered++;
				}
				nextJob.bounds = null;
				nextJob = null;

				this.processedRequests++;
				this.hasGaugeChanged = true;

				return true;
			},
			
			processFailure : function(request) {

				this.request = null;

				this.responseStats.requestTS = new Date();
				this.responseStats.processedTS = this.responseStats.requestTS;

				this.errorsEncountered++;

				var errMsg = 'PROTOCOL FAILURE';
				var errJSON = {
					errorText : errMsg
				};
				this.errorHandler(errJSON);
			}

			

		});
 