define(["oskari","jquery","src/mapping/mapmodule/plugin/AbstractMapModulePlugin","src/mapping/mapmodule/plugin/BasicMapModulePlugin","bundles/framework/bundle/featuredata2/instance","bundles/framework/bundle/featuredata2/PopupHandler","bundles/framework/bundle/featuredata2/plugin/MapSelectionPlugin","bundles/framework/bundle/featuredata2/event/FinishedDrawingEvent","bundles/framework/bundle/featuredata2/event/WFSSetFilter","bundles/framework/bundle/featuredata2/event/WFSSetPropertyFilter","bundles/framework/bundle/featuredata2/event/AddedFeatureEvent","bundles/framework/bundle/featuredata2/Flyout","bundles/framework/bundle/featuredata2/plugin/FeaturedataPlugin","bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequest","bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequestHandler","css!resources/framework/bundle/featuredata2/css/style.css","bundles/framework/bundle/featuredata2/locale/cs","bundles/framework/bundle/featuredata2/locale/de","bundles/framework/bundle/featuredata2/locale/en","bundles/framework/bundle/featuredata2/locale/es","bundles/framework/bundle/featuredata2/locale/et","bundles/framework/bundle/featuredata2/locale/fi","bundles/framework/bundle/featuredata2/locale/el","bundles/framework/bundle/featuredata2/locale/hr","bundles/framework/bundle/featuredata2/locale/nl","bundles/framework/bundle/featuredata2/locale/pl","bundles/framework/bundle/featuredata2/locale/pt","bundles/framework/bundle/featuredata2/locale/sv"], function(Oskari,jQuery) {
    return Oskari.bundleCls("featuredata2").category({create: function () {
        var me = this,
            inst = Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});