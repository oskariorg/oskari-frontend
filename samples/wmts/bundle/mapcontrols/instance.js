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
