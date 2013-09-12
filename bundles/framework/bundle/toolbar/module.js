define(["oskari","jquery","./instance","./button-methods","./default-buttons","./request/AddToolButtonRequest","./request/RemoveToolButtonRequest","./request/ToolButtonStateRequest","./request/SelectToolButtonRequest","./request/ToolButtonRequestHandler","./request/ShowMapMeasurementRequestHandler","./event/ToolSelectedEvent","./request/ToolbarRequest","./request/ToolbarRequestHandler","css!_resources_/framework/bundle/toolbar/css/toolbar.css","./locale/fi","./locale/sv","./locale/en"], function(Oskari,jQuery) {
    return Oskari.bundleCls("toolbar").category({create: function () {
    var inst =  Oskari.clazz.create("Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance");
		return inst;
	},update: function (manager, bundle, bi, info) {
	}})
});