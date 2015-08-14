define(["oskari","jquery","bundles/framework/bundle/parcelselector/instance","bundles/framework/bundle/parcelselector/Flyout","bundles/framework/bundle/parcelselector/Tile","bundles/framework/bundle/parcelselector/event/ParcelSelectedEvent","bundles/framework/bundle/parcelselector/event/RegisterUnitSelectedEvent","css!resources/framework/bundle/parcelselector/css/parcelselector.css","bundles/framework/bundle/parcelselector/locale/fi"], function(Oskari,jQuery) {
    return Oskari.bundleCls("parcelselector").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance");
        return inst;
    },update: function (manager, bundle, bi, info) {
    }})
});