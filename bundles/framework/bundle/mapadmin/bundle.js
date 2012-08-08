/**
 * @to-do refactor html embedding issues
 * 
 * 
 * var core = Oskari.$("sandbox")._core;
 * var url = core.generateHtmlLinkParameters(
                                               core._map,
                                               core._selectedLayers, null)
 * 
 */

/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultMapAdminBundleInstance",
				function(b) {
					this.name = 'mapadmin';
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

						var conf = Oskari.$('startup');
						this.facade = Oskari.$('UI.facade');
						
						this.impl = Oskari.clazz
								.create('Oskari.mapframework.ui.module.mapfull.DefaultMapAdminModule',conf);

						var def = this.facade.appendExtensionModule(this.impl,
								this.name, this.eventHandlers, this, 'E', {
									'fi' : {
										title : 'Yll\u00E4pito'
									},
									'sv' : {
										title : ''
									},
									'en' : {
										title : 'Admin Bundle'
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

						this.impl.stop(this.facade.getSandbox());

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
					__name : "Oskari.mapframework.bundle.DefaultMapAdminBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

/**
 * Bundle
 */
Oskari.clazz
		.define(

				"Oskari.mapframework.bundle.DefaultMapAdminBundle",

				function() {
				},

				{
					/*
					 * implementation for protocol 'Oskari.bundle.Bundle'
					 */
					"create" : function() {

						return Oskari.clazz
								.create("Oskari.mapframework.bundle.DefaultMapAdminBundleInstance");
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

						"scripts" : [ /* temp */
								{
									"type" : "text/javascript",
									"src" : "../../../../lib/ext-4.0.2a/examples/ux/CheckColumn.js"
								},/* temp */
								{
									"type" : "text/css",
									"src" : "../../../../lib/ext-4.0.2a/examples/ux/css/CheckHeader.css"
								}, {
									"type" : "text/javascript",
									"src" : "ui/module/map-admin-module.js"
								} ],
						"resources" : []
					},
					"bundle" : {
						"manifest" : {
							"Bundle-Identifier" : "mapadmin",
							"Bundle-Name" : "mapadmin",
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
									"Name" : "Tilarivi",
									"Title" : "Tilarivi"
								},
								"en" : {}
							},
							"Bundle-Version" : "1.0.0",
							"Import-Namespace" : [ "Oskari", "Ext" ],
							"Import-Bundle" : {
								"mapoverlaypopup" : {}
							}
						}
					}
				});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("mapadmin",
		"Oskari.mapframework.bundle.DefaultMapAdminBundle");
