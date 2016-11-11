/**
 * @class Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance",
    function () {}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance");
    },
    "update": function (manager, bundle, bi, info) {}
}, {
    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/event/FeedbackResultEvent.js"
        },{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/request/GetFeedbackServiceRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/request/GetFeedbackRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/request/PostFeedbackRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/publisher/FeedbackServiceTool.js"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/resources/locale/fi.js"
        }, {
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/feedbackService/resources/locale/sv.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "feedbackService",
            "Bundle-Name": "feedbackService",
            "Bundle-Author": [{
                "Name": "oskari-team",
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

Oskari.bundle_manager.installBundleClass("feedbackService", "Oskari.mapframework.bundle.feedbackService.FeedbackServiceBundleInstance");
