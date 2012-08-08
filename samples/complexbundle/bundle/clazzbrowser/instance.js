
/**
 * @class Oskari.mapframework.bundle.ClazzBrowserBundleInstance
 * 
 * ClazzBrowser Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.ClazzBrowserBundleInstance",
				function(b) {

					this.name = 'ClazzBrowserModule';

					this.mediator = null;
					this.sandbox = null;

					this.ui = null;

					this.clazzinfo = null;
				},

				/*
				 * prototype
				 */
				{
					/**
					 * @method getStore returns (Ext) store
					 */
					getStore : function() {
						return this.store;
					},

					/**
					 * @method clear
					 * 
					 * clears store
					 * 
					 */
					clear : function() {
						this.store.clearData();
						this.store.destroyStore();
						this.store = null;
					},

					/**
					 * @method start
					 * 
					 * start bundle instance
					 * 
					 */
					"start" : function() {
						var me = this;

						if (this.mediator.getState() == "started")
							return;

						/**
						 * These should be SET BY Manifest begin
						 */
						this.libs = {
							ext : Oskari.$("Ext")
						};
						this.facade = Oskari.$('UI.facade');
						/**
						 * These should be SET BY Manifest end
						 */

						/**
						 * data model
						 */

						this.createModels();
						this.createStores();

						/**
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this,
								this.name, this.eventHandlers, this, 'E', {
									'fi' : {
										title : ' ClazzBrowser'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ' ClazzBrowser'
									}

								});
						this.def = def;

						this.loadData();

						this.mediator.setState("started");
						return this;
					},

					/**
					 * @method loadData
					 * 
					 * prepare JSON from Oskari.clazz infos
					 * 
					 */
					loadData : function() {

						var manager = Oskari.bundle_manager;

						var clazz = Oskari.clazz;

						var ns = clazz.ns;

						var data = [];

						/**
						 * bundles and sources
						 */
						for (bndlid in manager.sources) {
							var bndl = manager.sources[bndlid];

							// var scripts = bndl.scripts;

							var stateForBundleSrcs = manager.stateForBundleSources[bndlid];
							var scripts = stateForBundleSrcs.loader.files;
							for (s in scripts) {
								var srcdef = scripts[s];

								var rc = srcdef.src;

								data.push( {
									bundle : bndlid,
									resource : srcdef.src,
									state : srcdef.state,
									type : srcdef.type
								});

							}
						}

						/**
						 * clazzes
						 */

						var clazzarr = [];
						var clazzn = 0;
						
						for (nsname in ns) {

							var adapter = ns[nsname];
							var impl = adapter.impl;
							if (!impl)
								continue;

							for (bpname in impl.packages) {
								var bp = impl.packages[bpname];

								for (spname in bp) {
									var sp = bp[spname];

									var clazzname = bpname + '.' + spname;

									var prot = sp._class.prototype;

									for (p in prot) {

										var func = prot[p];

										clazzarr.push(func);
										
										data.push( {
											bp : bpname,
											sp : spname,
											clazz : clazzname,
											method : p,
											type : 'text/javascript',
											clazzSrc : clazzn
											
											// source : '' + func
										});
										
										clazzn++;
									}
								}
							}
						}
						
						this.clazzarr = clazzarr; 
						
						this.getStore().loadData(data);

					},
					
					getClazzArr: function() {
						return this.clazzarr;
					},

					/**
					 * @method createModels
					 * 
					 * creates any (Ext) data models required by this bundle
					 */
					createModels : function() {
						var xt = this.libs.ext;
						var me = this;

						if (!xt.ClassManager.get('ClazzInfo')) {
							xt.define('ClazzInfo', {
								extend : 'Ext.data.Model',
								fields : [ "bundle", "adapter", "bp", "sp",
										"clazz", "method", "signature",
										"source", "resource", "state", "type","clazzSrc" ]
							});
						}
					},

					/**
					 * @method createStores
					 * 
					 * creates any (Ext) stores required by this bundle
					 */
					createStores : function() {
						var xt = this.libs.ext;
						var me = this;
						var store = xt.create('Ext.data.Store', {
							model : 'ClazzInfo',
							autoLoad : false,
							pageSize : 32,
							proxy : {
								// load using script tags for cross domain, if
								// the data
								// in on the same domain as
								// this page, an HttpProxy would be better
								type : 'pagingmemory',
								reader : {
									type : 'json',
									model : 'ClazzInfo'
								}
							},
							groupField : 'bundle'
						});
						this.store = store;
					},

					/**
					 * @method init
					 * 
					 * init UI module called after start
					 * 
					 * This will be called by the framework
					 * 
					 */
					init : function(sandbox) {
						this.sandbox = sandbox;
						/*
						 * build UI
						 */

						var ui = Oskari.clazz
								.create(
										'Oskari.mapframework.bundle.ClazzBrowserBundleUI',
										this.libs, this);
						this.ui = ui;
						ui.setLibs(this.libs);
						ui.setStore(this.getStore());
						ui.create();

						return ui.get();
					},

					/**
					 * @method update notifications from the bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * @method stop
					 * 
					 * stop bundle instance
					 * 
					 */
					"stop" : function() {

						this.stopped = true;

						var xt = this.libs.ext;

						this.facade.removeExtensionModule(this, this.name,
								this.eventHandlers, this, this.def);
						this.def = null;
						this.sandbox.printDebug("Clearing STORE etc");

						this.ui.clear();
						this.ui = null;
						this.clear();

						this.mediator.setState("stopped");

						return this;
					},

					/*
					 * @method onEvent
					 * 
					 * event handler that dispatches events to handlers
					 * registered in eventHandlers props
					 * 
					 */
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/*
					 * 
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {

					},

					/**
					 * @method getName
					 * 
					 * required method for Oskari.mapframework.module.Module
					 * protocol
					 * 
					 */
					getName : function() {
						return this.__name;
					},

					/**
					 * @property __name
					 * 
					 * this BundleInstance's name
					 * 
					 */
					__name : "Oskari.mapframework.bundle.ClazzBrowserBundleInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
