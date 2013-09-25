define(["oskari","jquery","./instance","./PopupHandler","./plugin/MapSelectionPlugin","./event/FinishedDrawingEvent","./event/WFSSetFilter","./event/AddedFeatureEvent","./Flyout","./plugin/FeaturedataPlugin","./request/ShowFeatureDataRequest","./request/ShowFeatureDataRequestHandler","css!resources/framework/bundle/featuredata2/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("featuredata2").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});