/**
 * @class Oskari.mapframework.bundle.routingService.RoutingServiceBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.routingService.RoutingServiceBundle",
    function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.routingService.RoutingServiceBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {}
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingService/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingService/event/RouteResultEvent.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingService/request/GetRouteRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/routingService/request/GetRouteRequestHandler.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "routingService",
            "Bundle-Name": "routingService",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "nls.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2014"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
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
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("routingService", "Oskari.mapframework.bundle.routingService.RoutingServiceBundle");
