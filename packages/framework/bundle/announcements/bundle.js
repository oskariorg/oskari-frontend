/**
 * @class Oskari.framework.bundle.announcements.AnnouncementsBundle
 *
 *
 */

Oskari.clazz.define("Oskari.framework.bundle.announcements.AnnouncementsBundle", function () {

}, {
    /**
     * @method create creates an Oskari DIV Manager instance
     * @return {Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance}
     */
    "create": function () {

        return Oskari.clazz.create("Oskari.framework.bundle.announcements.AnnouncementsBundleInstance");
    },
    /**
     * @method update called by the bundle manager to inform on changes in bundlage
     */
    "update": function (manager, bundle, bi, info) {

    }
}, {
    /**
     * @static
     * @property protocol protocols implemented by this bundle
     */
    "protocol": ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance"],
    "source": {
        /**
         * @static
         * @property source.scripts
         *
         */
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/Flyout.js"
        }, 
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/event/AnnouncementsChangedEvent.js"
        },
        {
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/tool/AnnouncementsTool.js"
        }],
        "locales": [
        {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/resources/locale/fi.js"
        },{
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/framework/announcements/resources/locale/sv.js"
        }]
    },
    "bundle": {
        /**
         * @static
         * @property bundle.manifest
         */
        "manifest": {
            "Bundle-Identifier": "announcements",
            "Bundle-Name": "announcements",
            "Bundle-Tag": {
                "mapframework": true
            },

            "Bundle-Author": [{
                "Name": "Oskari Rintamäki",
                "Organisation": "Sitowise Oy",
                "Temporal": {
                    "Start": "2020",
                    "End": "2020"
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
                    "Name": "announcements",
                    "Title": "announcements"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari"],
            "Import-Bundle": {}
        }
    }
});

Oskari.bundle_manager.installBundleClass("announcements", "Oskari.framework.bundle.announcements.AnnouncementsBundle");
