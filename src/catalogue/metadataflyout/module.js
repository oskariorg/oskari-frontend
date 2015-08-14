define(["oskari","jquery",
	"bundles/catalogue/bundle/metadataflyout/instance",
	"bundles/catalogue/bundle/metadataflyout/service/MetadataLoader",
	"bundles/catalogue/bundle/metadataflyout/view/MetadataPage",
	"bundles/catalogue/bundle/metadataflyout/Flyout",
	"bundles/catalogue/bundle/metadataflyout/Tile",
	"bundles/catalogue/bundle/metadataflyout/request/ShowMetadataRequest",
	"bundles/catalogue/bundle/metadataflyout/request/ShowMetadataRequestHandler",
//	"bundles/catalogue/bundle/metadataflyout/plugin/MetadataLayerPlugin",
//	"./plugin/MetadataLayerPlugin",
	"css!resources/catalogue/bundle/metadataflyout/css/style.css",
	"bundles/catalogue/bundle/metadataflyout/locale/fi",
	"bundles/catalogue/bundle/metadataflyout/locale/en",
	"bundles/catalogue/bundle/metadataflyout/locale/sv"
], function(Oskari,jQuery) {
    return Oskari.bundleCls("metadataflyout").category({create: function () {

		return Oskari.clazz.create("Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance");

	},start: function () {
	},stop: function () {
	},update: function (manager, bundle, bi, info) {

	}})
});