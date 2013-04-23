/**
 * @class Oskari.digiroad.bundle.featureselector.FeatureSelectorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.digiroad.bundle.featureselector.FeatureSelectorBundle",

/**
 * @contructor
 * Called automatically on construction. At this stage bundle sources have been
 * loaded, if bundle is loaded dynamically.
 * @static
 */
function() {

}, {
    /*
     * @method create
     * called when a bundle instance will be created
     */
    "create" : function() {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance");
        return inst;

    },
    /**
     * @method update
     * Called by Bundle Manager to provide state information to
     * bundle
     */
    "update" : function(manager, bundle, bi, info) {

    }
},

/**
 * metadata
 */
{

    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/Flyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/Tile.js"
        },

        // Events
        {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/event/FeatureEditedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/event/FeatureHighlightEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/event/FeaturesAddedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/event/FeaturesRemovedEvent.js"
        },

        // Models
        {
            "type": "text/javascript",
            "src": "../../../../bundles/digiroad/bundle/digiroad-featureselector/domain/VectorLayer.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/digiroad/bundle/digiroad-featureselector/domain/VectorLayerModelBuilder.js"
        },

        // Plugins
        {
            "type": "text/javascript",
            "src": "../../../../bundles/digiroad/bundle/digiroad-featureselector/plugin/VectorLayerPlugin.js"
        },

        // CSS
        {
            "type" : "text/css",
            "src" : "../../../../resources/digiroad/bundle/digiroad-featureselector/css/style.css"
        },

        // SlickGrid
        {
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/slick.grid.css"
        },{
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/municipality.css"
        }, {
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/slick-default-theme.css"
        }, {
            "src" : "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.core.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.formatters.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.editors.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangedecorator.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangeselector.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellselectionmodel.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.grid.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.groupitemmetadataprovider.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.dataview.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.pager.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.columnpicker.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.jquery.min.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.css",
            "type" : "text/css"
        }],
        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/digiroad/bundle/digiroad-featureselector/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "digiroad-featureselector",
            "Bundle-Name" : "digiroad-featureselector",
            "Bundle-Author" : [{
                "Name" : "aq",
                "Organisation" : "karttakeskus.fi",
                "Temporal" : {
                    "Start" : "2012",
                    "End" : "2012"
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

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass("digiroad-featureselector", "Oskari.digiroad.bundle.featureselector.FeatureSelectorBundle");