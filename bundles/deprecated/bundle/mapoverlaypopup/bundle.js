/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance",
				function(b) {
					this.name = 'mapoverlaypopup';
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
								.create('Oskari.mapframework.ui.module.common.OverlayPopupModule');

						var def = this.facade.appendExtensionModule(this.impl,
								this.name, this.eventHandlers, this,
								'StatusRegion', {
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
								this.eventHandlers, this, this.def);
						this.def = null;
						
						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.DefaultOverlayPopupBundle",

				function() {
					this.singleton = null;
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						if( !this.singleton ) {
						this.singleton = Oskari.clazz
								.create("Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance");
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
							"src" : "ui/module/overlay-popup-module.js"
						},
						{
							"type" : "text/javascript",
							"src" : "request/ShowOverlayPopupRequest.js"
						},
						{
							"type" : "text/javascript",
							"src" : "request/ShowOverlayPopupRequestHandler.js"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "mapoverlaypopup",
							"Bundle-Name" : "mapoverlaypopup",
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
Oskari.bundle_manager.installBundleClass("mapoverlaypopup",
		"Oskari.mapframework.bundle.DefaultOverlayPopupBundle");
