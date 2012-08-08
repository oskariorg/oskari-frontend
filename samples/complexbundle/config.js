/**
 * @class Oskari.mapframework.complexbundle.Config
 *
 * Bundles for this Config
 *
 */
Oskari.clazz.define('Oskari.mapframework.complexbundle.Config', function() {

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
		return ["layerhandler", "layerselection", "mapoverlaypopup", "trains", "wikipedia", "solsol", "positioninfo", "twitter", "clazzbrowser"];
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
			"solsol" : {
				bundlePath : appBundlePath
			},

			"sample" : {
				bundlePath : appBundlePath
			},
			"wikipedia" : {
				bundlePath : appBundlePath
			},
			"trains" : {
				bundlePath : appBundlePath
			},
			"positioninfo" : {
				bundlePath : appBundlePath
			},
			"twitter" : {
				bundlePath : appBundlePath
			},
			"clazzbrowser" : {
				bundlePath : appBundlePath
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
		var corePath = this.bundlePaths['core'];
		var coreBundlePath = this.bundlePaths['core-bundle'];

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
			bundlename : 'mapmodule-plugin',
			bundleinstancename : 'mapmodule-plugin',
			metadata : {
				"Import-Bundle" : bundleDefinitions,

				/**
				 * A list of bundles to be started
				 */
				"Require-Bundle-Instance" : bundleInstanceRequirements

			},
			instanceProps : {
				regionSelector : 'Center'
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

					/**
					 * These are loaded from default bundle
					 * directory
					 */
					"mapster" : {
						bundlePath : coreBundlePath
					},

					"common" : {
						bundlePath : coreBundlePath
					},

					"mapfull" : {
						bundlePath : coreBundlePath
					},

					"mapmodule-plugin" : {
						bundlePath : coreBundlePath
					},

					"layerselection" : {
						bundlePath : appBundlePath
					},

					"layerhandler" : {
						bundlePath : coreBundlePath
					},
					"mapoverlaypopup" : {
						bundlePath : coreBundlePath
					},

					/*
					 * this is loaded from app directory
					 */
					"mapportal" : {
						bundlePath : this.bundlePaths['portal']
					},
					"mapcontrols" : {
						bundlePath : coreBundlePath
					},
					"yui" : {
						bundlePath : '../../packages/tools/bundle/'
					}

				}

			}
		};

		return def;
	}
});
