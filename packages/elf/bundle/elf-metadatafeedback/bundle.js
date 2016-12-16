/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundle
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundle",

/**
 * @contructor
 * @static
 */
function() {

}, {
    /*
     * called when a bundle instance will be created
     *
     * @method create
     */
    "create" : function() {
        return Oskari.clazz.create("Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundleInstance");
    },
    /**
     * Called by Bundle Manager to provide state information to
     *
     * @method update
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {
    }
},
/**
 * metadata
 */
{
    "protocol": [
        "Oskari.bundle.Bundle",
        "Oskari.bundle.BundleInstance",
        "Oskari.mapframework.bundle.extension.ExtensionBundle"
    ],
    "source" : {
        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/instance.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/Flyout.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/request/ShowFeedbackRequest.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/request/ShowFeedbackRequestHandler.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/service/FeedbackService.js"
        },
        {
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/jquery-raty/jquery.raty.min.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/css/style.css"
        }
        ],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/en.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/et.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/is.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/it.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/nl.js"
        }, {
            "lang" : "sk",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/sk.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/sl.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/nb.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/fr.js"
          }, {
              "lang" : "nn",
              "type" : "text/javascript",
              "src" : "../../../../bundles/elf/elf-metadatafeedback/resources/locale/nn.js"
          }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "metadatafeedback",
            "Bundle-Name" : "catalogue.bundle.metadatafeedback",
            "Bundle-Author" : [{
                "Name" : "ev",
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
                    "Name" : " style-1",
                    "Title" : " style-1"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : []
});

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("elf-metadatafeedback", "Oskari.catalogue.bundle.metadatafeedback.MetadataFeedbackBundle");
