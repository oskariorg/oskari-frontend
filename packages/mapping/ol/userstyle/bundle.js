/**
 * @class Oskari.mapframework.userstyle.UserStyleBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.userstyle.UserStyleBundle", function () {

}, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.userstyle.UserStyleBundleInstance");
        },
        "update": function (manager, bundle, bi, info) { }
    },
    {
        "protocol": ["Oskari.bundle.Bundle"],
        "source": {
            "scripts": [
                {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/userstyle/request/ShowUserStylesRequest.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/userstyle/request/ShowUserStylesRequestHandler.js"
                }, {
                    "type": "text/javascript",
                    "src": "../../../../bundles/mapping/userstyle/UserStylesFlyout.js"
                }, {
                    "type" : "text/javascript",
                    "src" : "../../../../bundles/mapping/userstyle/instance.js"
                }
            ],
            "locales" : [{
                "lang" : "en",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/en.js"
            }, {
                "lang" : "fi",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/fi.js"
            }, {
                "lang" : "fr",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/fr.js"
            }, {
                "lang" : "is",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/is.js"
            }, {
                "lang" : "sv",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/sv.js"
            }, {
                "lang" : "ru",
                "type" : "text/javascript",
                "src" : "../../../../bundles/mapping/userstyle/resources/locale/ru.js"
            }]
        }
    });
Oskari.bundle_manager.installBundleClass("userstyle", "Oskari.mapframework.userstyle.UserStyleBundle");
