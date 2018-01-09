/**
 * @class Oskari.mapframework.bundle.system_message.SystemBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapping.maprotator.MapRotatorBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapping.maprotator.MapRotatorBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
},
{
  "protocol": ["Oskari.bundle.Bundle", "Oskari.framework.bundle.extension.ExtensionBundle"],
  "source" : {
      "scripts" : [
      /*
       * Abstract base
       */
      {
          "type": "text/javascript",
          "src": "../../../../bundles/mapping/mapmodule/plugin/AbstractMapModulePlugin.js"
      }, {
          "type": "text/javascript",
          "src": "../../../../bundles/mapping/mapmodule/plugin/BasicMapModulePlugin.js"
      },
      /*
       * MapRotator
       */
      {
          "type" : "text/javascript",
          "src" : "../../../../bundles/mapping/maprotator/instance.js"
      }, {
          "type" : "text/javascript",
          "src" : "../../../../bundles/mapping/maprotator/plugin/MapRotatorPlugin.js"
      }, {
          "type" : "text/javascript",
          "src" : "../../../../bundles/mapping/maprotator/publisher/MapRotator.js"
      }, {
          "type" : "text/javascript",
          "src" : "../../../../bundles/mapping/maprotator/event/map.rotated.js"
      }, {
         "type" : "text/javascript",
         "src" : "../../../../bundles/mapping/maprotator/request/rotate.map.js"
      }, {
          "type": "text/css",
          "src": "../../../../bundles/mapping/maprotator/resources/css/maprotator.css"
      }],
      "locales" : [{
          "lang": "en",
          "type": "text/javascript",
          "src": "../../../../bundles/mapping/maprotator/resources/locale/en.js"
      },{
          "lang": "fi",
          "type": "text/javascript",
          "src": "../../../../bundles/mapping/maprotator/resources/locale/fi.js"
      },{
        "lang": "sv",
        "type": "text/javascript",
        "src": "../../../../bundles/mapping/maprotator/resources/locale/sv.js"
    }]
  },
  "bundle": {
      "manifest": {
          "Bundle-Identifier": "maprotator",
          "Bundle-Name": "maprotator",
          "Bundle-Author": [{
              "Name": "x",
              "Organisation": "nls.fi",
              "Temporal": {
                  "Start": "2017",
              },
              "Copyleft": {
                  "License": {
                      "License-Name": "EUPL",
                      "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                  }
              }
          }],
          "Bundle-Version": "1.0.0",
          "Import-Namespace": ["Oskari", "jquery"],
          "Import-Bundle": {}
      }
  },
  /**
   * @static
   * @property dependencies
   */
  "dependencies" : ["jquery"]

});
Oskari.bundle_manager.installBundleClass("maprotator", "Oskari.mapping.maprotator.MapRotatorBundle");
