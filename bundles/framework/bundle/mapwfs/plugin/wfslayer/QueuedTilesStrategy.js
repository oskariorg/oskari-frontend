/* 
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. 
 */
/**
 * Class: OpenLayers.Strategy.QueuedTilesStrategy A simple strategy that reads
 * new features when the viewport invalidates some bounds.
 * 
 * We'll split requested area into a NUMBER of subrequests which we'll ask the
 * protocol to fulfill sequentially. Subrequests are processed 'in background'
 * 
 * Inherits from: - <OpenLayers.Strategy>
 */

Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTilesStrategy",
		function(options) {

			this.debugGridFeatures = true;
	
			this.options = options;

			this.tileQueue = options.tileQueue;
			this.autoActivate = true;
			this.autoDestroy = false;

			// grid implementation that calculates tile bounds
			this.grid = null;

			// current data bounds
			this.bounds = null;

			for (p in options)
				this[p] = options[p];

			this.active = false;

		}, {

			setLayer : function(layer) {
				this.layer = layer;
			},

			/** unload job requests and optional tile visualisations */
			flushTileQueue : function() {
				var q = this.tileQueue.queue;

				var tileFeatures = [];
				for ( var n = 0; n < q.length; n++) {
					if (q[n].tileFeature != null) {
						tileFeatures.push(q[n].tileFeature);
						q[n].tileFeature = null;
					}
				}
				if (tileFeatures.length > 0) {
					this.layer.destroyFeatures(tileFeatures);
				}
				this.tileQueue.flushQueue();

			},

			/**
			 * unload out of view features to save(?) some memory however
			 * intersects operation for this DID kill browser so let's not
			 */
			unloadOutOfViewFeatures : function() {

			},

			/**
			 * Property: ratio {Float} The ratio of the data bounds to the
			 * viewport bounds (in each dimension).
			 */
			ratio : 1,

			/**
			 * Method: activate Set up strategy with regard to reading new
			 * batches of remote data.
			 * 
			 * Returns: {Boolean} The strategy was successfully activated.
			 */
			activate : function() {
				if (this.active) {
					return false;
				}
				this.active = true;

				this.grid = Oskari.clazz.create(
						"Oskari.mapframework.gridcalc.QueuedTilesGrid", {
							map : this.layer.map,
							layer : this.layer,
							maxExtent : this.layer.map.getMaxExtent(),
							tileSize : this.layer.map.getTileSize()

						});
				/*this.layer.events.on( {
					"moveend" : this.updateMoveEnd,
					scope : this
				});*/
				this.layer.events.on( {
					"refresh" : this.updateRefresh,
					scope : this
				});

				return true;
			},

			/**
			 * Method: deactivate Tear down strategy with regard to reading new
			 * batches of remote data.
			 * 
			 * Returns: {Boolean} The strategy was successfully deactivated.
			 */
			deactivate : function() {
				if (!this.active) {
					return false;
				}

				/*this.layer.events.un( {
					"moveend" : this.update,
					scope : this
				});*/
				this.layer.events.un( {
					"refresh" : this.update,
					scope : this
				});
				this.grid.destroy();
				this.grid = null;
				return true;
			},

			updateRefresh : function(options) {
				this.update();
			},
			updateMoveEnd : function(options) {
				this.update();
			},

			/**
			 * Method: update Callback function called on "moveend" or "refresh"
			 * layer events.
			 * 
			 * Parameters: options - {Object} An object with a property named
			 * "force", this property references a boolean value indicating if
			 * new data must be incondtionally read.
			 */
			update : function(options) {
				var mapBounds = this.layer.map.getExtent();
				this.grid.moveTo(mapBounds, true);
				this.flushTileQueue();

				var mapZoom = this.layer.map.getZoom();

				if (mapZoom < this.minZoom) {
					return;
				}
				this.triggerRead();

			},

			/**
			 * Method: invalidBounds
			 * 
			 * Parameters: mapBounds - {<OpenLayers.Bounds>} the current map
			 * extent, will be retrieved from the map object if not provided
			 * 
			 * Returns: {Boolean}
			 */
			invalidBounds : function(mapBounds) {
				if (!mapBounds) {
					mapBounds = this.layer.map.getExtent();
				}
				return !this.bounds || !this.bounds.containsBounds(mapBounds);
			},

			/**
			 * unload of out of view features killed browser - so destruction is
			 * the right thing to do
			 */
			triggerUnload : function(bounds) {

				this.layer.destroyFeatures();

			},

			/**
			 * Method: triggerRead
			 * 
			 * Returns: {<OpenLayers.Protocol.Response>} The protocol response
			 * object returned by the layer protocol.
			 */
			triggerRead : function() {

				var gridGrid = this.grid.grid;
				var gridFeatures = [];
				var debugGridFeatures = this.debugGridFeatures;

				for ( var r = 0; r < gridGrid.length; r++) {
					for ( var c = 0; c < gridGrid[r].length; c++) {
						var bs = gridGrid[r][c].bounds.clone();
						var tileBounds = {
								left: bs.left,
								top: bs.top,
								right: bs.right,
								bottom: bs.bottom
						};

						
						  // just for debugging
							//	gridcalc bundle supports this as well
						var boundsFeature = null;
						if( debugGridFeatures) {
						var ptFromA = new
						  OpenLayers.Geometry.Point(bs.left, bs.bottom); 
						var
						  ptToA = new OpenLayers.Geometry.Point(bs.right,
						  bs.top); 
						
						var ptFromB = new
						  OpenLayers.Geometry.Point(bs.left, bs.top); 
						var ptToB =
						  new OpenLayers.Geometry.Point(bs.right, bs.bottom);
						var boundGeomArea = new
						  OpenLayers.Geometry.LineString( [ ptFromA, ptToB,
						  ptToA, ptFromB, ptFromA ]); 
						var boundsFeature = new
						  OpenLayers.Feature.Vector(boundGeomArea, {
						  featureClassName : this.CLASS_NAME, 
						  description : "" }); 
						boundsFeature.renderIntent =
						  "tile"; 
						gridFeatures.push(boundsFeature);
						}
						var qObj = Oskari.clazz.create(
								"Oskari.mapframework.gridcalc.QueuedTile", {
									bounds : tileBounds,
									tileFeature: boundsFeature
								});
						this.tileQueue.pushJob(qObj);

					}
				}

				if( debugGridFeatures ) {
					this.layer.addFeatures(gridFeatures);
				}
					

			},

			/**
			 * Method: merge Given a list of features, determine which ones to
			 * add to the layer.
			 * 
			 * Parameters: resp - {<OpenLayers.Protocol.Response>} The response
			 * object passed by the protocol.
			 */
			merge : function(resp) {
				// this will NOT destroy ANY features
			// we'll just trigger a unload job
			// this.layer.destroyFeatures();
			var features = resp.features;
			if (features && features.length > 0) {
				this.layer.addFeatures(features);
			}
		},

		CLASS_NAME : "NLSFI.OpenLayers.Strategy.QueuedTilesStrategy"
		});
