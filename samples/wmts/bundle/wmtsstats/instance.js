Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WmtsStatsBundleInstance",
				function() {
					this.map = null;
					this.mapster = null;
					this.mapmodule = null;

					this.ui = null;
					this._uimodules = [];
					this._uimodulesByName = {};

					this.sprites = {};
					this.plotter = {};
				},
				{

					/**
					 * @method createModels
					 * 
					 * create (Ext) data models if not already done
					 * 
					 */
					createModels : function() {
						var xt = Ext;
						var me = this;

						if (!xt.ClassManager.get('QoSStats')) {
							xt.define('QoSStats', {
								extend : 'Ext.data.Model',
								fields : [ "clientAddr", "created", "reason",
										"referenceCount", "state", "updated",
										"stats" ]
							});
						}
					},

					url : 'http://jkorhonen.nls.fi/non-free/mml-rasteriaineistot/__action__/action/select/client/12312313/',

					/**
					 * @method createStores
					 * 
					 * create (Ext) Stores for the UI
					 */
					createStores : function() {
						var xt = Ext;
						var me = this;

						var me = this;
						var remoteStore = xt.create('Ext.data.Store', {
							model : 'QoSStats',
							autoLoad : false,
							proxy : {
								type : 'jsonp',
								url : me.url,
								startParam : 'start',
								limitParam : 'count',
								reader : {
									type : 'json',
									model : 'QoSStats',
									root : 'results'
								}
							}
						});
						me.remoteStore = remoteStore;
					},

					/**
					 * @method createUI
					 */
					createUI : function() {
						var me = this;

						var drawComponent = Ext
								.create(
										'Ext.draw.Component',
										{
											viewBox : false,
											items : [ {
												type : 'path',
												path : [
														'M0,109.718c0-43.13,24.815-80.463,60.955-98.499L82.914,0C68.122,7.85,58.046,23.406,58.046,41.316',
														'c0,9.64,2.916,18.597,7.915,26.039c-7.44,18.621-11.77,37.728-13.228,56.742c-9.408,4.755-20.023,7.423-31.203,7.424',
														'c-1.074,0-2.151-0.025-3.235-0.075c-5.778-0.263-11.359-1.229-16.665-2.804L0,109.718z M157.473,285.498c0-0.015,0-0.031,0-0.047',
														'C157.473,285.467,157.473,285.482,157.473,285.498 M157.473,285.55c0-0.014,0-0.027,0-0.04',
														'C157.473,285.523,157.473,285.536,157.473,285.55 M157.472,285.604c0-0.015,0.001-0.031,0.001-0.046',
														'C157.473,285.574,157.472,285.588,157.472,285.604 M157.472,285.653c0-0.012,0-0.024,0-0.037',
														'C157.472,285.628,157.472,285.641,157.472,285.653 M157.472,285.708c0-0.015,0-0.028,0-0.045',
														'C157.472,285.68,157.472,285.694,157.472,285.708 M157.472,285.756c0-0.012,0-0.023,0-0.034',
														'C157.472,285.733,157.472,285.745,157.472,285.756 M157.471,285.814c0-0.014,0-0.028,0.001-0.042',
														'C157.471,285.785,157.471,285.8,157.471,285.814 M157.471,285.858c0-0.008,0-0.017,0-0.026',
														'C157.471,285.841,157.471,285.85,157.471,285.858 M157.47,285.907c0.001-0.008,0.001-0.018,0.001-0.026',
														'C157.471,285.889,157.471,285.898,157.47,285.907 M157.47,285.964c0-0.009,0-0.017,0-0.023',
														'C157.47,285.949,157.47,285.955,157.47,285.964 M157.469,286.01c0-0.008,0.001-0.016,0.001-0.022',
														'C157.47,285.995,157.469,286.002,157.469,286.01 M157.469,286.069c0-0.008,0-0.016,0-0.022',
														'C157.469,286.053,157.469,286.062,157.469,286.069 M157.468,286.112c0-0.005,0-0.011,0-0.017',
														'C157.468,286.101,157.468,286.107,157.468,286.112 M157.467,286.214c0-0.003,0-0.006,0-0.008',
														'C157.467,286.208,157.467,286.212,157.467,286.214' ]
														.join(''),
												fill : '#C5D83E'
											} /*
												 * , { type : 'circle', fill :
												 * '#fafafa', radius : 250, x :
												 * 300, y : 300, width : 770,
												 * height : 520 }
												 */]
										});

						me.win = Ext.create('Ext.Window', {
							width : 800,
							height : 600,
							minWidth : 650,
							minHeight : 225,
							title : 'Tile Service Load',
							/*
							 * layout : { type : 'hbox', align : 'stretch' },
							 */
							layout : 'fit',
							items : [ /*
										 * { xtype : 'chart', style :
										 * 'background:#fff', animate : { easing :
										 * 'elasticIn', duration : 1000 }, store :
										 * me.store, insetPadding : 25, flex :
										 * 1, axes : [ { type : 'gauge',
										 * position : 'gauge', minimum : 0,
										 * maximum : 100, steps : 10, margin :
										 * -10 } ], series : [ { type : 'gauge',
										 * field : 'data1', donut : false,
										 * colorSet : [ '#F49D10', '#ddd' ] } ] }
										 */drawComponent ]
						}).show();

						me.drawComponent = drawComponent;

					},

					/**
					 * @method implements BundleInstance start methdod
					 * 
					 */
					"start" : function() {
						var me = this;
						if (me.started)
							return;
						me.started = true;

						me.createModels();
						me.createStores();
						me.createUI();

						/*
						 * window.setInterval(function() {
						 * me.remoteStore.loadData(me.generateData(1)); }, 500);
						 */
						me.schedule();

					},

					schedule : function() {
						var me = this;
						window.setTimeout(function() {
						var store = me.remoteStore;
						store.load( {
							callback : function(records, operation, success) {

								me.updateChart(records);

								me.schedule();
							}
						});
						}, 3200);
					},

					updateChart : function(records) {
						var me = this;
						window.me = me;
						var pi2 = Math.PI * 2;
						var cos = Math.cos;
						var sin = Math.sin;

						Ext.Array.forEach(records, function(r) {
							var stats = r.get('stats');
							var l = stats.stats.length;

							var s = me.getSprites(r.get('clientAddr'), l,
									stats.stats);
							/*
							 * for ( var n = 0; n < stats.stats.length; n++) {
							 * 
							 * s[n].setAttributes( { height : n * 20, rotate : {
							 * x : 300, y: 300, deegrees : Math.floor(((n / 4) %
							 * 12) * 30 + (n % 4) * 10) } }); s[n].redraw();
							 *  }
							 */
							for ( var n = 0; n < l; n++) {
								var val = stats.stats[n];
								var h = val/3;
								if( val ) { 
									s[n].setAttributes( {
										stroke:'#f00',
										fill:'#800'
									});
								} 	else {
									s[n].setAttributes( {
										stroke: '#d0d0d0',fill:'#d0d0d0'
									});
									h = 150;
								}
								s[n].setAttributes( {
									height : h,
									rotate : {
										x : 300,
										y : 300,
										degrees : 180+((Math.floor(((n / 4)) % 12)
												* 30 + (n % 4) * 7.5))
									}
								}, true);
								/*s[n].animate({
									height: h
								});*/
								
							}

						});

					},

					getSprites : function(id, l, stats) {
						var drawComponent = this.drawComponent;
						var s = this.sprites[id];
						if (s)
							return s;

						var s = {};
						for ( var n = 0; n < l; n++) {
							var f = n < 6 || n > 18 ? '#c0c0c0' : '#ffffff';

							var sp = Ext.create('Ext.draw.Sprite', {
								type : 'rect',// circle',
								stroke : '#000',
								fill : '#fa0000',
								x : 300,
								y : 300,
								opacity: 0.5,
								width : 10,
								height : n * 20,
								surface : drawComponent.surface
							});
							s[n] = sp;

						}

						this.sprites[id] = s;
						return s;
					},
					getPlotter : function(id) {
						var drawComponent = this.drawComponent;
						var s = this.plotter[id];
						if (s)
							return s;

						var s = Ext.create('Ext.draw.Sprite', {
							type : 'circle',
							stroke : '#f00',
							fill : '#c0d0e0',
							radius : 10,
							x : 0,
							y : 0,
							surface : drawComponent.surface
						});

						this.plotter[id] = s;
						return s;
					},

					/**
					 * @method update
					 * 
					 * implements bundle instance update method
					 */
					"update" : function() {

					},

					/**
					 * @method stop
					 * 
					 * implements bundle instance stop method
					 */
					"stop" : function() {

					}
				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance" ]
				});
