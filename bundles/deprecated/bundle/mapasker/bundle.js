/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultWFSBundleInstance",
				function(b) {
					this.name = 'mapasker';
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
								.create('Oskari.mapframework.ui.module.mapasker.GridModule');

						var def = this.facade.appendExtensionModule(this.impl,
								this.name, this.eventHandlers, this, 'S', {
									'fi' : {
										title : 'WFS'
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

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultWFSBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.DefaultWFSBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.DefaultWFSBundleInstance");
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
							"src" : "ui/module/grid-module.js"
						} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "mapasker",
							"Bundle-Name" : "mapasker",
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
Oskari.bundle_manager.installBundleClass("mapasker",
		"Oskari.mapframework.bundle.DefaultWFSBundle");
