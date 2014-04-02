define(["oskari","jquery","bundles/catalogue/bundle/metadatacatalogue/service/MetadataOptionService","bundles/catalogue/bundle/metadatacatalogue/service/MetadataSearchService","bundles/catalogue/bundle/metadatacatalogue/instance","css!resources/catalogue/bundle/metadatacatalogue/css/style.css","bundles/catalogue/bundle/metadatacatalogue/locale/fi","bundles/catalogue/bundle/metadatacatalogue/locale/en","bundles/catalogue/bundle/metadatacatalogue/locale/sv"], function(Oskari,jQuery) {
    return Oskari.bundleCls("metadatacatalogue").category({create: function () {

		return Oskari.clazz.create("Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance");

	},start: function () {
	},stop: function () {
	},update: function (manager, bundle, bi, info) {

	}})
});