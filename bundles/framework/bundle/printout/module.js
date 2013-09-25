define(["oskari","jquery","./jquery.imagesLoaded","./instance","./Flyout","./Tile","./plugin/LegendPlugin","./service/PrintService","./view/StartView","./view/BasicPrintout","./request/PrintMapRequest","./request/PrintMapRequestHandler","./event/PrintableContentEvent","css!resources/framework/bundle/printout/css/style.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("printout").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.printout.PrintoutBundleInstance");

        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});