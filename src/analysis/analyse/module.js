define(["oskari","jquery","bundles/analysis/bundle/analyse/instance","bundles/analysis/bundle/analyse/Flyout","bundles/analysis/bundle/analyse/Tile","bundles/analysis/bundle/analyse/view/StartView","bundles/analysis/bundle/analyse/view/StartAnalyse","bundles/analysis/bundle/analyse/view/AnalyseValidations","bundles/analysis/bundle/analyse/view/AnalyseFilterMethods","bundles/analysis/bundle/analyse/view/ContentPanel","bundles/analysis/bundle/analyse/view/PersonalDataTab","bundles/analysis/bundle/analyse/request/AnalyseRequest","bundles/analysis/bundle/analyse/request/AnalyseRequestHandler","bundles/analysis/bundle/analyse/service/AnalyseService","css!resources/analysis/bundle/analyse/css/style.css","bundles/analysis/bundle/analyse/locale/fi","bundles/analysis/bundle/analyse/locale/sv","bundles/analysis/bundle/analyse/locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("analyse").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.analysis.bundle.analyse.AnalyseBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});