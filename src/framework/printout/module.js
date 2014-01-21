define(["oskari","jquery","bundles/framework/bundle/printout/jquery.imagesLoaded","bundles/framework/bundle/printout/instance","bundles/framework/bundle/printout/Flyout","bundles/framework/bundle/printout/Tile","bundles/framework/bundle/printout/plugin/LegendPlugin","bundles/framework/bundle/printout/service/PrintService","bundles/framework/bundle/printout/view/StartView","bundles/framework/bundle/printout/view/BasicPrintout","bundles/framework/bundle/printout/request/PrintMapRequest","bundles/framework/bundle/printout/request/PrintMapRequestHandler","bundles/framework/bundle/printout/event/PrintableContentEvent","css!resources/framework/bundle/printout/css/style.css","bundles/framework/bundle/printout/locale/fi","bundles/framework/bundle/printout/locale/sv","bundles/framework/bundle/printout/locale/en","bundles/framework/bundle/printout/locale/cs","bundles/framework/bundle/printout/locale/de","bundles/framework/bundle/printout/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("printout").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.printout.PrintoutBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});