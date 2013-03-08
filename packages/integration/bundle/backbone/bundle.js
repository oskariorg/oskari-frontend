/**
 * @class Oskari.integration.bundle.backbone.BackBoneBundle
 *
 * BackboneBundle provides glue to add BackboneJS (with UnderscoreJS and RequireJS)
 * parts to Oskari framework.

 *
 *
 */
Oskari.clazz.define("Oskari.integration.bundle.backbone.BackBoneBundle", function() {

    /**
     * @property conf
     * injected configuration for this singleton bundle instance
     */
    this.conf = null;
}, {
    "create" : function() {

        return this;

    },
    "start" : function() {
    },
    "stop" : function() {
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {
        "requirements" : {
            "config" : {
                shim : {
                    'backbone': {
                        deps: ['underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    'underscore': {
                        exports: '_'
                    }
                }
            },
            "require" : [
                "text", 
                "underscore", 
                "backbone"
            ]
        },

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/integration/bundle/backbone/Flyout.js"

        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/integration/bundle/backbone/Tile.js"

        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/integration/bundle/backbone/View.js"

        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/integration/bundle/backbone/Adapter.js"

        }],
        "resources" : []
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "backbone",
            "Bundle-Name" : "integration.bundle.backbone",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2013",
                    "End" : "2013"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Scope" : "implementation",
                        "License-Name" : "MIT",
                        "License-Online-Resource" : "https://github.com/documentcloud/backbone/blob/master/LICENSE"
                    },
                    "License" : {
                        "License-Scope" : "package",
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});

Oskari.bundle_manager.installBundleClass("backbone", "Oskari.integration.bundle.backbone.BackBoneBundle");
