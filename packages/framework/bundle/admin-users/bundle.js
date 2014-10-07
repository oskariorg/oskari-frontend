/**
 * @class Oskari.framework.bundle.admin-users.AdminUsersBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.admin-users.AdminUsersBundle",
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {

    }, {
        "create": function () {
            return Oskari.clazz.create("Oskari.mapframework.bundle.admin-users.AdminUsersBundleInstance",
                'admin-users',
                "Oskari.framework.bundle.admin-users.AdminUsersFlyout"
            );
        },
        "update": function (manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/instance.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/Flyout.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/AdminUsers.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/AdminRoles.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/event/RoleChangedEvent.js"
            },{
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/Tile.js"
            }, {
                "type": "text/css",
                "src": "../../../../resources/framework/bundle/admin-users/css/style.css"
            }, {
                "src": "../../../../libraries/chosen/chosen.jquery.js",
                "type": "text/javascript"
            }, {
                "src": "../../../../libraries/chosen/chosen.css",
                "type": "text/css"
            }],

            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/admin-users/locale/en.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "admin-users",
                "Bundle-Name": "admin-users",
                "Bundle-Author": [{
                    "Name": "tm",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2014",
                        "End": "2014"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}

            }
        },

        /**
         * @static
         * @property dependencies
         */
        "dependencies": ["jquery"]

    });

Oskari.bundle_manager.installBundleClass("admin-users", "Oskari.framework.bundle.admin-users.AdminUsersBundle");
