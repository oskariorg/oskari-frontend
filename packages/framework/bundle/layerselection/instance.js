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
						//var xt = me.libs.ext;
						var pnl = Ext.create('Ext.Panel', {
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
						
					/*	me.libs = {
							ext : Oskari.$("Ext")
						};*/
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
