/**
 * @class Oskari.mapframework.bundle.system_message.SystemBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.system-message.SystemBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.framework.bundle.system-message.SystemBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
},
{
  "protocol": ["Oskari.bundle.Bundle", "Oskari.framework.bundle.extension.ExtensionBundle"],
  "source" : {
      "scripts" : [{
          "type" : "text/javascript",
          "src" : "../../../../bundles/framework/system-message/instance.js"
      },{
          "type" : "text/javascript",
          "src" : "../../../../bundles/framework/system-message/service/SystemMessageService.js"
      },
      {
          "type" : "text/javascript",
          "src" : "../../../../bundles/framework/system-message/request/ShowMessageRequest.js"
      },
      {
          "type" : "text/javascript",
          "src" : "../../../../bundles/framework/system-message/request/ShowMessageRequestHandler.js"
      },{
          "type": "text/css",
          "src": "../../../../bundles/framework/system-message/resources/css/systemmessage.css"
      }],
      "locales" : [{
          "lang": "en",
          "type": "text/javascript",
          "src": "../../../../bundles/framework/system-message/resources/locale/en.js"
      },{
          "lang": "fi",
          "type": "text/javascript",
          "src": "../../../../bundles/framework/system-message/resources/locale/fi.js"
      }]
  },
  "bundle": {
      "manifest": {
          "Bundle-Identifier": "system-message",
          "Bundle-Name": "system-message",
          "Bundle-Author": [{
              "Name": "x",
              "Organisation": "nls.fi",
              "Temporal": {
                  "Start": "2016",
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
Oskari.bundle_manager.installBundleClass("system-message", "Oskari.framework.bundle.system-message.SystemBundle");
