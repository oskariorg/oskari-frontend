
(function() {
	
  /**
   * @class Oskari.libraries.bundle.geostats.GeostatsBundle
   *
   */
  Oskari.clazz.define("Oskari.libraries.bundle.geostats.GeostatsBundle", function() {

  }, {
    "create" : function() {
          return this;

    },
    "update" : function(manager, bundle, bi, info) {
    },
    "start" : function() {
    },
    "stop" : function() {
    }
  }, {
   
    "protocol" : [ "Oskari.bundle.Bundle","Oskari.bundle.BundleInstance" ],
    "source" : {

      "scripts" : [
        {
          "type" : "text/javascript",
          "src" : "../../../../libraries/geostats/geostats.min.js"
        },

        {
          "type" : "text/javascript",
          "src" : "../../../../libraries/geostats/jenks.util.js"
        }
      ]
    }
  });
	/**
	 * Install this bundle by instantating the Bundle Class
	 * 
	 */
	Oskari.bundle_manager.installBundleClass("geostats",
			"Oskari.libraries.bundle.geostats.GeostatsBundle");

})();