define(["oskari","jquery","./instance","./PopupHandler","./plugin/MapSelectionPlugin","./event/FinishedDrawingEvent","./event/AddedFeatureEvent","./Flyout","./plugin/FeaturedataPlugin","./service/GridJsonService","./service/GridModelManager","./domain/WfsGridUpdateParams","./request/ShowFeatureDataRequest","./request/ShowFeatureDataRequestHandler","css!resources/framework/bundle/featuredata/css/style.css","./locale/fi","./locale/sv","./locale/en","./locale/cs","./locale/de","./locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("featuredata").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});