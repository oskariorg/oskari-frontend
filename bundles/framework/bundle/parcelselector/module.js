define(["oskari","jquery","./instance","./Flyout","./Tile","./view/ParcelsTab","./event/ParcelSelectedEvent","./event/RegisterUnitSelectedEvent","css!_resources_/framework/bundle/parcelselector/css/parcelselector.css","./locale/fi"], function(Oskari,jQuery) {
    return Oskari.bundleCls("parcelselector").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance");
        return inst;
    },update: function (manager, bundle, bi, info) {
    }})
});