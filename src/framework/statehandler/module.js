define(["oskari","jquery","bundles/framework/bundle/statehandler/instance","libraries/jquery/plugins/jquery.cookie","bundles/framework/bundle/statehandler/state-methods","bundles/framework/bundle/statehandler/plugin/Plugin","bundles/framework/bundle/statehandler/plugin/SaveViewPlugin","bundles/framework/bundle/statehandler/request/SetStateRequest","bundles/framework/bundle/statehandler/request/SetStateRequestHandler","bundles/framework/bundle/statehandler/event/StateSavedEvent","bundles/framework/bundle/statehandler/request/SaveStateRequest","bundles/framework/bundle/statehandler/request/SaveStateRequestHandler"], function(Oskari,jQuery) {
    return Oskari.bundleCls("statehandler").category({create: function () {

        return Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance");
    },update: function (manager, bundle, bi, info) {

    }})
});