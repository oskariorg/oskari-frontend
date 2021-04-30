/**
 * @class Oskari.framework.bundle.admin-announcements.AdminAnnouncementsBundle
 *
 *
 */

Oskari.clazz.define("Oskari.admin.bundle.admin-announcements.AdminAnnouncementsBundle", function () {

}, {
    /**
     * @method create creates an Oskari DIV Manager instance
     * @return {Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance}
     */
    "create": function () {

        return Oskari.clazz.create("Oskari.admin.bundle.admin-announcements.AdminAnnouncementsBundleInstance");
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
            "src": "../../../../bundles/admin/admin-announcements/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/admin/admin-announcements/Flyout.js"
        }],
        "locales": [
        {
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/admin/admin-announcements/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/admin/admin-announcements/resources/locale/fi.js"
        },{
            "lang": "sv",
            "type": "text/javascript",
            "src": "../../../../bundles/admin/admin-announcements/resources/locale/sv.js"
        }]
    },
    "bundle": {
        /**
         * @static
         * @property bundle.manifest
         */
        "manifest": {
            "Bundle-Identifier": "admin-announcements",
            "Bundle-Name": "admin-announcements",
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
                    "Name": "admin-announcements",
                    "Title": "admin-announcements"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari"],
            "Import-Bundle": {}
        }
    }
});

Oskari.bundle_manager.installBundleClass("admin-announcements", "Oskari.admin.bundle.admin-announcements.AdminAnnouncementsBundle");
