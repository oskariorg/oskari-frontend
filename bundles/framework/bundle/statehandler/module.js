define(["oskari","jquery","./instance","libraries/jquery/plugins/jquery.cookie","./state-methods","./plugin/Plugin","./plugin/SaveViewPlugin","./request/SetStateRequest","./request/SetStateRequestHandler","./event/StateSavedEvent","./request/SaveStateRequest","./request/SaveStateRequestHandler"], function(Oskari,jQuery) {
    return Oskari.bundleCls("statehandler").category({create: function () {

        return Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance");
    },update: function (manager, bundle, bi, info) {

    }})
});