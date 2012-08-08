/**
 * @class Oskari.mapframework.complexbundle.Config
 *
 * Bundles for this Config
 *
 */
Oskari.clazz.define('Oskari.mapframework.transitional.Config', function() {

}, {

	/*
	 * @method getStartListForBundleInstances
	 *
	 * creates a default selection of bundle instances to be
	 * started for this application
	 *
	 * add your own here and in getDefaultAppBundles
	 */
	getStartListForBundleInstances : function() {
		return ["layerhandler"// ,
		// "bundlemanager"
		/*
		 * , "layerselection","layerselector",
		 * "mapoverlaypopup", "trains", "wikipedia", "solsol",
		 * "positioninfo", "twitter", "clazzbrowser", "mapadmin"
		 */];
	},
	/**
	 * @method getDefaultAppBundles
	 *
	 * creates a base setup for this application add your own
	 * here and in getStartListForBundleInstances
	 *
	 */
	getDefaultAppBundles : function(appBundlePath) {
		var defaultBundleDefinitions = {
			/**
			 * These are loaded from appliation bundle directory
			 */

			/*"solsol" : { bundlePath : appBundlePath },

			 "sample" : { bundlePath : appBundlePath },
			 "wikipedia" : { bundlePath : appBundlePath },
			 "trains" : { bundlePath : appBundlePath },
			 "positioninfo" : { bundlePath : appBundlePath },
			 "twitter" : { bundlePath : appBundlePath },
			 "clazzbrowser" : { bundlePath : appBundlePath }
			 "mapadmin" : { }*/
			"bundlemanager" : {
				bundlePath : 'bundle/'
			}

		};
		return defaultBundleDefinitions;
	},
	/**
	 * @method getStartupBundleDefinition
	 *
	 * returns bundles for this app startup configuration
	 *
	 * (De)Selects bundles based on page request parameters
	 * (opts) Default is to include bundle.
	 *
	 * ?trains=off&wikipedia=off&solsol=off&pluginFeatureEditor=off&pluginGraticule=off
	 *
	 * Deselects some bundles AND plugins
	 *
	 *
	 */
	getStartupBundleDefinition : function(opts) {
		var appBundlePath = this.bundlePaths['application'];
		var coreBundlePath = this.bundlePaths['core'];

		/**
		 * Let's enable or disable based on page request args
		 */

		var defaultBundleDefinitions = this.getDefaultAppBundles(appBundlePath);

		var bundleDefinitions = {};

		for(p in defaultBundleDefinitions) {
			if(!opts[bndl] || opts[bndl] != 'off')
				bundleDefinitions[p] = defaultBundleDefinitions[p];
		}

		var bundleInstanceRequirements = [];
		var bundlesStartList = this.getStartListForBundleInstances();

		for(var n = 0; n < bundlesStartList.length; n++) {
			var bndl = bundlesStartList[n];
			if(!opts[bndl] || opts[bndl] != 'off')
				bundleInstanceRequirements.push(bndl);
		}

		var def = {
			title : 'Map',
			fi : 'Map',
			sv : '?',
			en : 'Map',
			bundlename : 'bundlemanager',
			bundleinstancename : 'bundlemanager',
			metadata : {
				"Import-Bundle" : bundleDefinitions,

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : bundleInstanceRequirements

			},
			instanceProps : {
				regionSelector : 'E'
			}
		};

		return def;
	},
	/**
	 * @method configure setup some paths
	 */
	setBundlePaths : function(popts) {

		var opts = popts || {};

		var defBundlePath = opts['default'] || "../../packages/framework/bundle/";

		Oskari.bundle_facade.setBundlePath(defBundlePath);

		this.bundlePaths = opts;
	},
	/**
	 * @method getBaseBundleDefinition
	 *
	 * returns class source bundles for this app
	 *
	 */
	getBaseBundleDefinition : function() {
		var appBundlePath = this.bundlePaths['application'];

		var coreBundlePath = this.bundlePaths['core-bundle'];

		var def = {
			title : 'Base',
			fi : 'Base',
			sv : '?',
			en : 'Base',
			metadata : {
				"Import-Bundle" : {
					/**
					 * These are loaded from framework directory
					 */

					"core-base" : {
						bundlePath : coreBundlePath
					},
					"core-map" : {
						bundlePath : coreBundlePath
					},
					"core-map-full" : {
						bundlePath : coreBundlePath
					},
					"domain" : {
						bundlePath : coreBundlePath
					},
					"event-base" : {
						bundlePath : coreBundlePath
					},
					"event-map" : {
						bundlePath : coreBundlePath
					},
					"event-map-layer" : {
						bundlePath : coreBundlePath
					},
					"event-map-full" : {
						bundlePath : coreBundlePath
					},
					"request-base" : {
						bundlePath : coreBundlePath
					},
					"request-map" : {
						bundlePath : coreBundlePath
					},
					"request-map-layer" : {
						bundlePath : coreBundlePath
					},
					"request-map-full" : {
						bundlePath : coreBundlePath
					},

					"service-base" : {
						bundlePath : coreBundlePath
					},
					"service-map" : {
						bundlePath : coreBundlePath
					},
					"service-map-full" : {
						bundlePath : coreBundlePath
					},

					"sandbox-base" : {
						bundlePath : coreBundlePath
					},
					"sandbox-map" : {
						bundlePath : coreBundlePath
					},

					"runtime" : {
						bundlePath : coreBundlePath
					},

					"mapster" : {
						bundlePath : coreBundlePath
					},

					"common" : {
						bundlePath : coreBundlePath
					},

					"mapmodule-plugin" : {
						bundlePath : coreBundlePath
					},

					"layerselector" : {
						bundlePath : coreBundlePath
					},

					"layerhandler" : {
						bundlePath : coreBundlePath
					},
					"mapoverlaypopup" : {
						bundlePath : coreBundlePath
					},

					"mapcontrols" : {
						bundlePath : coreBundlePath
					},

					"searchservice" : {
						bundlePath : coreBundlePath
					},

					"mapasker" : {
						bundlePath : coreBundlePath
					},

					"mapposition" : {
						bundlePath : coreBundlePath
					},

					/*
					 * this is loaded from app directory
					 */
					"mapfull" : {
						bundlePath : coreBundlePath
					},
					"layerselection" : {
						bundlePath : appBundlePath
					},

					"userinterface" : {
						bundlePath : appBundlePath
					},

					"bundlemanager" : {
						bundlePath : appBundlePath
					},
					"yui" : {
						bundlePath : '../tools/bundle/'
					}

				}

			}
		};

		return def;
	}
});
