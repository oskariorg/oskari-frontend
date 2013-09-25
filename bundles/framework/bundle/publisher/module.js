define(["oskari","jquery","./instance","./Flyout","./Tile","./event/MapPublishedEvent","./view/NotLoggedIn","./view/StartView","./view/BasicPublisher","./view/PublisherLocationForm","./view/PublisherLayerForm","css!resources/framework/bundle/publisher/css/style.css","./request/PublishMapEditorRequest","./request/PublishMapEditorRequestHandler","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("publisher").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.publisher.PublisherBundleInstance");

		return inst;

	},update: function (manager, bundle, bi, info) {

	}})
});