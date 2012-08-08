/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.DefaultLayerSelectorBundleInstance",
				function(b) {
					this.name = 'layerselector';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					this.ui = null;
				},
				/*
				 * prototype
				 */
				{
					
					createPanel: function() {
						var me = this;
						var xt = me.libs.ext;
						var pnl = xt.create('Ext.Panel', {
							region : 'center',
							layout : 'fit',
							height: 384,
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
								.create('Oskari.mapframework.ui.module.layerselector.AllLayersModule');

						var pnl = this.createPanel();
						
						/**
						 * 
						 * register to framework and eventHandlers
						 */
						var def = me.facade.appendExtensionModule(me.impl,
								me.name, {}/* this.impl.eventHandlers */,
								me, 'E', {
									'fi' : {
										title : 'Kaikki tasot'
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
						
						me.impl.start(this.facade.getSandbox());
						
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
								this.impl.eventHandlers, this, this.def);

						this.def = null;
						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.DefaultLayerSelectorBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
