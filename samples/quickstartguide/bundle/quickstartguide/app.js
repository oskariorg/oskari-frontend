/**
 * @class Oskari.mapframework.basicbundle.Sample
 * 
 */

Oskari.clazz
		.define(
				'Oskari.mapframework.quickstartguide.Sample',

				/**
				 * @constructor
				 */
				function() {

					this._core = null;
			

					this.mapConfiguration = null;

					this.ui = null;
				},
				{

					

					/**
					 * @method setMapConfiguration
					 * 
					 */
					setMapConfiguration : function(mc) {
						this.mapConfiguration = mc;
					},

					/**
					 * @method getMapConfiguration
					 */
					getMapConfiguration : function() {
						return this.mapConfiguration;
					},

					/**
					 * @method start
					 * 
					 * kick start this app
					 */
					startFramework : function() {

						var conf = this.getMapConfiguration();

						/* first check that we should start whole thing */
						if (conf.cancelStartup == true) {
							return;
						}

						var me = this;

						/* this will orchestrate application */
						var core = Oskari.clazz
								.create('Oskari.mapframework.core.Core');
						this._core = core;

						/* assets for this application */
						var services = this.createServices(conf);
						var enhancements = this.createEnhancements(conf);

						/* user interface */
						var ui = this.createUserInterface(conf);
						this.ui = ui;

						/* some quirks */
						this.createCoreQuirks(conf, core);

						/* finally init core */
						core.init(ui, services, enhancements, conf.layers,
								conf.organizationsTreeLayout,
								conf.userInterfaceLanguage,
								conf.mapPublisherWizardUrl);

					},

					/**
					 * @method getUserInterface
					 */
					getUserInterface : function() {
						return this.ui;
					},

					
					/**
					 * @method createCoreQuirks
					 * 
					 * some fiddling
					 */
					createCoreQuirks : function(conf, core) {
						/*
						 * If we want to turn development mode off, we will have
						 * to run that enhancement manually before initing core.
						 * Core runs enhancements after modules are initialized,
						 * so by attaching disablement to normal enhancements it
						 * is run too late. This is why we must run it here.
						 */
						if (conf.disableDevelopmentMode == 'true') {
							var disableDevelopmentModeEnhancement = Oskari.clazz
									.create(
											'Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement',
											true);
							disableDevelopmentModeEnhancement.enhance(core);
						}

					},

					/**
					 * @method createServices setup services for this
					 *         application
					 */
					createServices : function(conf) {

						/*
						 * create services that are available in this
						 * application
						 */
						var services = [];

						services
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.service.GetFeatureInfoService',
												conf.globalMapAjaxUrl));
						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.LanguageService',
								conf.userInterfaceLanguage));

						/* create sniffer with 2 second interval and '/log' -url */
						services
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.service.UsageSnifferService',
												2, "/log/"));

						services.push(Oskari.clazz.create(
								'Oskari.mapframework.service.MapLayerService',
								conf.globalMapAjaxUrl));

						return services;
					},

					/**
					 * @method createEnhancements
					 * 
					 * setup enhancements for this application enhancements is a
					 * map framework concept to fine tune application startup
					 * 
					 */
					createEnhancements : function(conf) {

						var enhancements = [];

						enhancements
								.push(Oskari.clazz
										.create(
												'Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',
												conf.preSelectedLayers,
												conf.mapConfigurations));
						enhancements
								.push(Oskari.clazz
										.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));
						
									  
						return enhancements;
					},

					/**
					 * @method createUserInterface build ui for this application
					 * 
					 * User Interface Manager creates the (Ext) user interface
					 * 
					 * We'll use default Portal sample manager which is capable
					 * of dynamically loading new parts to UI
					 * 
					 */
					createUserInterface : function(conf) {
						/* Create ui manager */
						return Oskari.clazz
								.create(
										'Oskari.mapframework.ui.manager.mapportal.MapPortalUiManager',
										conf);

					}

				});
