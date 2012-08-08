Oskari.clazz.define('Oskari.mapframework.transitional.Sample', function() {
	this._core = null;
	this.baseBundleDefinition = null;
	this.appBundleDefinition = null;

	this.mapConfiguration = null;
	this.ui = null;
}, {

	/**
	 * @method setBundleConfiguration
	 *
	 * stores configurator object sets up paths and bundle
	 * configurations
	 *
	 */
	setBundleConfiguration : function(baseBundleDefinition, appBundleDefinition) {
		/**
		 * Let's setup some startup bundles
		 */
		this.baseBundleDefinition = baseBundleDefinition;
		this.appBundleDefinition = appBundleDefinition;

	},
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
	 * kick start
	 */
	startFramework : function() {

		var conf = this.getMapConfiguration();

		var core = Oskari.clazz.create('Oskari.mapframework.core.Core');
		this._core = core;

		var services = this.createServices(conf);
		var enhancements = this.createEnhancements(conf);

		var ui = this.createUserInterface(conf);
		this.ui = ui;

		this.createDefaultExtensionModules(conf, ui);

		this.createExtensionBundles(conf, ui);

		this.createCoreQuirks(conf, core);

		core.init(ui, services, enhancements, conf.layers, conf.userInterfaceLanguage, conf.mapPublisherWizardUrl);

	},
	/**
	 * @method getUserInterface
	 */
	getUserInterface : function() {
		return this.ui;
	},
	/**
	 * @method startStartupBundles
	 *
	 * starts any bundles defined in bundledefinition
	 *
	 */
	createBaseBundles : function(cb) {
		var baseBundleDefinition = this.baseBundleDefinition;

		Oskari.bundle_facade.loadBundleDeps(baseBundleDefinition['metadata'], cb);

	},
	/**
	 * @method startStartupBundles
	 *
	 * starts any bundles defined in bundledefinition
	 *
	 */
	startApplicationBundles : function(cb) {
		var appBundleDefinition = this.appBundleDefinition;

		Oskari.bundle_facade.playBundle(appBundleDefinition, cb);

	},
	/**
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
		if(conf.disableDevelopmentMode == 'true') {
			var disableDevelopmentModeEnhancement = Oskari.clazz.create('Oskari.mapframework.enhancement.common.DisableDevelopmentModeEnhancement', true);
			disableDevelopmentModeEnhancement.enhance(core);
		}

		/*
		 * Openlayers image position must be set before core is
		 * initialized
		 */
	},
	/**
	 * setup services for this application
	 */
	createServices : function(conf) {

		/*
		 * create services that are available in this
		 * application
		 */
		var services = [];

		services.push(Oskari.clazz.create('Oskari.mapframework.service.SearchService', conf.globalMapAjaxUrl, conf.globalPortletNameSpace));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', conf.globalMapAjaxUrl));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.GetFeatureInfoService', conf.globalMapAjaxUrl));
		services.push(Oskari.clazz.create('Oskari.mapframework.service.LanguageService', conf.userInterfaceLanguage));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.OgcSearchService', conf.ogcSearchServiceEndpoint, this._core));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.NetServiceCenterService', conf.globalMapAjaxUrl));

		services.push(Oskari.clazz.create('Oskari.mapframework.service.UsageSnifferService', 2, "/log/"));

		return services;
	},
	/**
	 * setup enhancements for this application
	 */
	createEnhancements : function(conf) {

		/*
		 * create enhancements that will initialize, fix or
		 * modify some behaviour
		 */
		var enhancements = [];
		// enhancements.push(new
		// mapframework.enhancement.mapfull.ExtBlankImageEnhancement());

		/* Check which buttons are available */
		// var enableMapPublisher = (conf.mapPublisherWizardUrl
		// != null);

		var enableMapPublisher = false;
		var enableNetServiceCenter = (conf.netServiceCenterAvailable == true);

		enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement', conf.preSelectedLayers, conf.mapConfigurations));
		//

		enhancements.push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement'));
		/*
		 * enhancements.push( Oskari.clazz.create(
		 * 'Oskari.mapframework.enhancement.common.EnableOpenLayersZoombarTitlesEnhancement', //
		 * "#_OpenLayers_ViewPort" // "#panzoombar"
		 * "#OpenLayers_Control_PanZoomBar_ZoombarOpenLayers.Map_3"
		 * ));
		 */
		/*enhancements
		 .push(Oskari.clazz.create('Oskari.mapframework.enhancement.mapfull.KeyListenerEnhancement'));*/

		return enhancements;
	},
	/**
	 * build ui for this application
	 */
	createUserInterface : function(conf) {

		/* Create ui manager */
		return Oskari.clazz.create('Oskari.mapframework.ui.manager.transitional.MapFullUiManager', conf);

	},
	/**
	 * build extension modules for this application
	 */
	createDefaultExtensionModules : function(conf, uimanager) {
		/* Create any ui modules */
		/* All layers module */

		var allLayersModule = Oskari.clazz.create('Oskari.mapframework.ui.module.layerselector.AllLayersModule');
		//
		uimanager.addExtensionModule(allLayersModule, 'allLayersModule', 'NW');

		var selectedLayersModule = Oskari.clazz.create('Oskari.mapframework.ui.module.layerselector.SelectedLayersModule');
		uimanager.addExtensionModule(selectedLayersModule, 'selectedLayersModule', 'W');

		var searchModule = Oskari.clazz.create('Oskari.mapframework.ui.module.searchservice.SearchModule');
		uimanager.addExtensionModule(searchModule, 'searchModule', 'E');

		var metadataModule = Oskari.clazz.create('Oskari.mapframework.ui.module.searchservice.MetadataModule');
		uimanager.addExtensionModule(metadataModule, 'metadataModule', 'E');
		if(conf.bundles) {
			for(bundleIndex in conf.bundles ) {
				var bundle = conf.bundles[bundleIndex];
				uimanager.addExtensionModule(Oskari.clazz.create(bundle.type, bundle.config), bundle.ident, bundle.location);
			}
		}

		var wfsModule = Oskari.clazz.create('Oskari.mapframework.ui.module.mapasker.GridModule');
		uimanager.addExtensionModule(wfsModule, 'wfsModule', 'S');

		return uimanager;
	},
	/**
	 * This will load bundle manifests and launch any 1st party
	 * or 3rd party extension bundles to the application using
	 * bundle_manager (if IE>=9 native... anything goes) (if IE<=9
	 * quirks... only specifically crafted extension modules)
	 */
	createExtensionBundles : function(conf, uimanager) {
	}
});
