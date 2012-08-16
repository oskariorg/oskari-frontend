/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultLayerSelectionBundleInstance",
				function(b) {
					this.name = 'layerselection';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					this.ui = null;
				},
				/*
				 * prototype
				 */
				{

					createPanel : function() {
						var me = this;
						var xt = me.libs.ext;
						var pnl = xt.create('Ext.Panel', {
							region : 'center',
							layout : 'fit',
							height : 512,
							border: false,
							items : []
						});

						return pnl;
					},
					
					/**
					 * start bundle instance
					 * 
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						var me = this;
						
						me.libs = {
							ext : Oskari.$("Ext")
						};
						me.facade = Oskari.$('UI.facade');

						me.impl = Oskari.clazz
								.create('Oskari.mapframework.ui.module.layerselector.SelectedLayersModule');

						var pnl = me.createPanel();
						/**
						 * 
						 * register to framework and eventHandlers
						 */
						var def = me.facade.appendExtensionModule(me.impl, me.name,
						/* this.impl.eventHandlers */{}, me, 'NW', {
							'fi' : {
								title : 'Valitut karttatasot'
							},
							'sv' : {
								title : '?'
							},
							'en' : {
								title : 'Map Layers'
							}
							
						},pnl);

						me.def = def;

						pnl.add(def.initialisedComponent);
						
						me.impl.start(me.facade.getSandbox());

						me.mediator.setState("started");
						return this;
					},

					/**
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * stop bundle instance
					 */
					"stop" : function() {

						this.impl.stop();

						this.facade.removeExtensionModule(this.impl, this.name,
								this.impl.eventHandlers, this);

						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultLayerSelectionBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.DefaultLayerSelectionBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.DefaultLayerSelectionBundleInstance");
					},

					"update" : function(manager, bundle, bi, info) {
						manager.alert("RECEIVED update notification " + info);
					}

				},

				/**
				 * metadata
				 */
				{

					"protocol" : [ "Oskari.bundle.Bundle",
							"Oskari.mapframework.bundle.extension.ExtensionBundle" ],
					"source" : {

						"scripts" : [ {
							"type" : "text/javascript",
							"src" : "ui/module/selected-layers-module.js"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "layerselection",
							"Bundle-Name" : "layerselection",
							"Bundle-Icon" : {
								"href" : "icon.png"
							},
							"Bundle-Author" : [ {
								"Name" : "jjk",
								"Organisation" : "nls.fi",
								"Temporal" : {
									"Start" : "2009",
									"End" : "2011"
								},
								"Copyleft" : {
									"License" : {
										"License-Name" : "EUPL",
										"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
									}
								}
							} ],
							"Bundle-Name-Locale" : {
								"fi" : {
									"Name" : "Haku",
									"Title" : "Haku"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext" ]
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("layerselection",
		"Oskari.mapframework.bundle.DefaultLayerSelectionBundle");
