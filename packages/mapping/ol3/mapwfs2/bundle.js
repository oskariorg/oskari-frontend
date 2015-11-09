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
            "src" : "../../../../libraries/cometd/comp.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../libraries/jquery/plugins/jquery.cookie.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/service/Connection.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/service/Mediator.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/service/StatusHandler.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/service/WFSLayerService.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSStatusChangedEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/plugin/QueuedTilesGrid.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/plugin/QueuedTilesStrategy.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/plugin/TileCache.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/plugin/WfsLayerPlugin.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSFeatureEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSFeaturesSelectedEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSFeatureGeometriesEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSImageEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/event/WFSPropertiesEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/request/ShowOwnStyleRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/request/ShowOwnStyleRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/request/ActivateHighlightRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/request/ActivateHighlightRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/domain/QueuedTile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/domain/TileQueue.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/domain/WFSLayer.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/domain/WfsLayerModelBuilder.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/VisualizationForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/visualization-form/DotForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/visualization-form/LineForm.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/visualization-form/AreaForm.js"
        }],
        "locales" : [{
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/en.js"
        }, {
            "lang" : "es",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/es.js"
        }, {
            "lang" : "et",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/et.js"
        }, {
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/fi.js"
        }, {
            "lang" : "fr",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/fr.js"
        }, {
            "lang" : "is",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/is.js"
        }, {
            "lang" : "it",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/it.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/sv.js"
        }, {
            "lang" : "nb",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/nb.js"
        }, {
            "lang" : "nl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/nl.js"
        }, {
            "lang" : "nn",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/nn.js"
        }, {
            "lang" : "sl",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/sl.js"
        }, {
            "lang" : "de",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/de.js"
        }, {
            "lang" : "cs",
            "type" : "text/javascript",
            "src" : "../../../../bundles/mapping/mapwfs2_ol3/resources/locale/cs.js"
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
