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
            "src" : "../../../../bundles/analysis/analyse/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/AggregateAnalyseFilter.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/Tile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/StartView.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/NotLoggedIn.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/StartAnalyse.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/AnalyseValidations.js"
        },  {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/ContentPanel.ol3.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/DrawControls.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/view/PersonalDataTab.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/request/AnalyseRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/request/AnalyseRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/service/AnalyseService.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/service/AnalyseHelper.js"
        },{
            "type" : "text/css",
            "src" : "../../../../bundles/analysis/analyse/resources/css/style.css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/resources/locale/sv.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/resources/locale/it.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/analysis/analyse/resources/locale/en.js"
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
