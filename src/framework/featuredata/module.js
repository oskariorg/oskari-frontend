define(["oskari","jquery","bundles/framework/bundle/featuredata/instance","bundles/framework/bundle/featuredata/PopupHandler","bundles/framework/bundle/featuredata/plugin/MapSelectionPlugin","bundles/framework/bundle/featuredata/event/FinishedDrawingEvent","bundles/framework/bundle/featuredata/event/AddedFeatureEvent","bundles/framework/bundle/featuredata/Flyout","bundles/framework/bundle/featuredata/plugin/FeaturedataPlugin","bundles/framework/bundle/featuredata/service/GridJsonService","bundles/framework/bundle/featuredata/service/GridModelManager","bundles/framework/bundle/featuredata/domain/WfsGridUpdateParams","bundles/framework/bundle/featuredata/request/ShowFeatureDataRequest","bundles/framework/bundle/featuredata/request/ShowFeatureDataRequestHandler","css!resources/framework/bundle/featuredata/css/style.css","bundles/framework/bundle/featuredata/locale/fi","bundles/framework/bundle/featuredata/locale/sv","bundles/framework/bundle/featuredata/locale/en","bundles/framework/bundle/featuredata/locale/cs","bundles/framework/bundle/featuredata/locale/de","bundles/framework/bundle/featuredata/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("featuredata").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});