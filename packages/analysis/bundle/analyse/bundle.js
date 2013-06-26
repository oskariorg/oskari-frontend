/**
 * @class Oskari.analysis.bundle.analyse.AnalyseBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.analysis.bundle.analyse.AnalyseBundle", function() {

}, {
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.analysis.bundle.analyse.AnalyseBundleInstance");

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [ {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/Tile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/view/StartView.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/view/StartAnalyse.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/view/AnalyseValidations.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/view/AnalyseFilterMethods.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/request/AnalyseRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/request/AnalyseRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/service/AnalyseService.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../resources/analysis/bundle/analyse/css/style.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/bundle/analyse/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "analyse",
            "Bundle-Name" : "analyse",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : " Analyse",
                    "Title" : " Analyse"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("analyse", "Oskari.analysis.bundle.analyse.AnalyseBundle");
