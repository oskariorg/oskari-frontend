(function() {

  /**
   * @class Oskari.openlayers.bundle.openlayers-full-map.OpenLayersBundle
   *
   */
  Oskari.clazz.define("Oskari.openlayers.bundle.openlayers-full-map.OpenLayersBundle", function() {

  }, {
    "create": function() {
      return this;

    },
    "update": function(manager, bundle, bi, info) {},
    "start": function() {},
    "stop": function() {
      // delete OpenLayers...just joking
    }
  }, {


    "protocol": ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance"],
    "source": {

      "scripts": [{
        "type": "text/javascript",
        "src": "../../../../libraries/proj4js-1.0.1/proj4js-compressed.js"
      }, {
        "type": "text/javascript",
        "src": "../../../../libraries/OpenLayers/OpenLayers.2_13_1-full-map.js"
      }]
    },
    "bundle": {
      "manifest": {
        "Bundle-Identifier": "openlayers-map-full",
        "Bundle-Name": "mapframework.openlayers.mapfull.Bundle",
        "Bundle-Author": [{
          "Name": "ah",
          "Organisation": "nls.fi",
          "Temporal": {
            "Start": "2009",
            "End": "2011"
          },
          "Copyleft": {
            "License": [{
              "Part": "OpenLayers",
              "License-Name": "BSD",
              "License-Online-Resource": "http://svn.openlayers.org/trunk/openlayers/license.txt"
            }, {
              "Part": "Proj4JS",
              "License-Name": "LGPL/BSD",
              "License-Online-Resource": ""
            }]
          }
        }],
        "Bundle-Name-Locale": {
          "fi": {
            "Name": " style-1",
            "Title": " style-1"
          },
          "en": {}
        },
        "Bundle-Version": "1.0.0",
        "Import-Namespace": ["Oskari"],
        "Import-Bundle": {}

      }
    }

  });
  /**
   * Install this bundle by instantating the Bundle Class
   *
   */
  Oskari.bundle_manager.installBundleClass("openlayers-full-map",
    "Oskari.openlayers.bundle.openlayers-full-map.OpenLayersBundle");

})();