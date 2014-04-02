/**
 * @class Oskari.io.bundle.cometd.CometdBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.MapWfsBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
    "create" : function() {
        return this;
    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/comp.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/jquery.cookie.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/service/Connection.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/service/Mediator.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/plugin/QueuedTilesGrid.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/plugin/QueuedTilesStrategy.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/plugin/TileCache.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/plugin/WfsLayerPlugin.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/event/WFSFeatureEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/event/WFSFeaturesSelectedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/event/WFSImageEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/event/WFSPropertiesEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/request/ShowOwnStyleRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/request/ShowOwnStyleRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/domain/QueuedTile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/domain/TileQueue.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/domain/WFSLayer.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/domain/WfsLayerModelBuilder.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/divmanazer/component/VisualizationForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/divmanazer/component/visualization-form/DotForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/divmanazer/component/visualization-form/LineForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/divmanazer/component/visualization-form/AreaForm.js"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/en.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/es.js"
        }, {
            "lang" : "de",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/de.js"
        }, {
            "lang" : "cs",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/mapwfs2/locale/cs.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "mapwfs2",
            "Bundle-Name" : "mapwfs2",
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2013",
                    "End" : "2013"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery", "cometd"]

});

Oskari.bundle_manager.installBundleClass("mapwfs2", "Oskari.mapframework.bundle.mapwfs2.MapWfsBundle");
