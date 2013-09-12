define(["oskari","jquery","./instance","./service/MetadataLoader","./view/MetadataPage","./Flyout","./Tile","./request/ShowMetadataRequest","./request/ShowMetadataRequestHandler","./plugin/MetadataLayerPlugin","css!_resources_/catalogue/bundle/metadataflyout/css/style.css","./locale/fi","./locale/en","./locale/sv"], function(Oskari,jQuery) {
    return Oskari.bundleCls("metadataflyout").category({create: function () {

		return Oskari.clazz.create("Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance");

	},start: function () {
	},stop: function () {
	},update: function (manager, bundle, bi, info) {

	}})
});