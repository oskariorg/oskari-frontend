/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultMapControlsBundleInstance",
				function(b) {
					this.name = 'mapcontrols';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					this.ui = null;
				},
				/*
				 * prototype
				 */
				{

					/**
					 * start bundle instance
					 * 
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						this.libs = {
							ext : Oskari.$("Ext")
						};

						this.facade = Oskari.$('UI.facade');
						this.impl = Oskari.clazz
								.create('Oskari.mapframework.ui.module.common.MapControlsModule');

						var def = this.facade.appendExtensionModule(this.impl,
								this.name, {}, this, 'Mapster', {
									'fi' : {
										title : ''
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ''
									}

								});

						def.cmp
								.addListener(
										'close',
										function() {
											def.bundleInstance.stop();
											var manager = def.bundleInstance.mediator.manager;
											var instanceid = def.bundleInstance.mediator.instanceid;
											manager.destroyInstance(instanceid);
											def.bundleInstance = null;
										});

						this.def = def;

						this.impl.start(this.facade.getSandbox());

						this.mediator.setState("started");
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
								this.impl.eventHandlers, this, this.def);
						this.def = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultMapControlsBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.DefaultMapControlsBundle",

				function() {
					this.singleton = null;
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						if (!this.singleton) {
							this.singleton = Oskari.clazz
									.create("Oskari.mapframework.bundle.DefaultMapControlsBundleInstance");
						}

						return this.singleton;
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
							"src" : "ui/module/map-controls-module.js"
						}, {
							"type" : "text/javascript",
							"src" : "action/GeoAction.js"
						}, {
							"type" : "text/css",
							"src" : "../../../../resource/css/maptools.css" 
						}],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "mapcontrols",
							"Bundle-Name" : "mapcontrols",
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
Oskari.bundle_manager.installBundleClass("mapcontrols",
		"Oskari.mapframework.bundle.DefaultMapControlsBundle");
