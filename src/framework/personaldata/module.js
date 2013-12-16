define(["oskari","jquery","bundles/framework/bundle/personaldata/instance","bundles/framework/bundle/personaldata/Flyout","bundles/framework/bundle/personaldata/Tile","bundles/framework/bundle/personaldata/MyViewsTab","bundles/framework/bundle/personaldata/service/ViewService","bundles/framework/bundle/personaldata/PublishedMapsTab","bundles/framework/bundle/personaldata/AccountTab","bundles/framework/bundle/personaldata/request/AddTabRequest","bundles/framework/bundle/personaldata/request/AddTabRequestHandler","css!resources/framework/bundle/personaldata/css/personaldata.css","bundles/framework/bundle/myplaces2/MyPlacesTab","bundles/framework/bundle/personaldata/locale/fi","bundles/framework/bundle/personaldata/locale/sv","bundles/framework/bundle/personaldata/locale/en","bundles/framework/bundle/personaldata/locale/cs","bundles/framework/bundle/personaldata/locale/de","bundles/framework/bundle/personaldata/locale/es"], function(Oskari,jQuery) {
    return Oskari.bundleCls("personaldata").category({create: function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance");
        return inst;

    },update: function (manager, bundle, bi, info) {

    }})
});