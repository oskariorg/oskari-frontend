define(["oskari","jquery","./comp","libraries/jquery/plugins/jquery.cookie","./service/Connection","./service/Mediator","./plugin/QueuedTilesGrid","./plugin/QueuedTilesStrategy","./plugin/TileCache","./plugin/WfsLayerPlugin","./event/WFSFeatureEvent","./event/WFSFeaturesSelectedEvent","./event/WFSImageEvent","./event/WFSPropertiesEvent","./domain/QueuedTile","./domain/TileQueue","./domain/WFSLayer","./domain/WfsLayerModelBuilder","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("mapwfs2").category({create: function () {
        return this;
    },update: function (manager, bundle, bi, info) {

    }})
});