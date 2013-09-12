define(["oskari","jquery",
            "./instance",
            "./button-methods",
            "./default-buttons",
            "./request/AddToolButtonRequest",
            "./request/RemoveToolButtonRequest",
            "./request/ToolButtonStateRequest",
            "./request/SelectToolButtonRequest",
            "./request/ToolButtonRequestHandler",
            "./request/ShowMapMeasurementRequestHandler",
            "./event/ToolSelectedEvent",
            "./request/ToolbarRequest",
            "./request/ToolbarRequestHandler",
            "css!_resources_/framework/bundle/toolbar/css/toolbar.css",
            "./locale/en",
            "./locale/fi",
            "./locale/sv"
], function(Oskari,jQuery) {
    return Oskari.bundleCls('toolbar').category({
        create: function() {
    // Old way       var inst = Oskari.clazz.create("Oskari.mapframework.bundle.promote.PromoteBundleInstance");
            var inst = Oskari.cls("Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance").create();
            return inst;
        }
    })
});