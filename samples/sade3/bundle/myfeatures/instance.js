/**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.MyFeaturesBundleInstance",
				function(b) {
					this.name = 'myplaces';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					/**
					 * These should be SET BY Manifest end
					 */

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

						/**
						 * These should be SET BY Manifest begin
						 */
						this.libs = {
							ext : Oskari.$("Ext")
						};
						this.facade = Oskari.$('UI.facade');

						this.impl = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.myplaces.MyFeaturesModule',
										this.conf);

						/**
						 * 
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this.impl,
								this.name, {}, this, 'E', {
									'fi' : {
										title : 'Omat kohteet'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : 'My Places'
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
								this.impl.eventHandlers, this, this.def);
						this.def = null;
						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.MyPlacesBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
