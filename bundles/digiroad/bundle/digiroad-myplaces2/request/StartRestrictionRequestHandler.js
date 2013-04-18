Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.request.StartRestrictionRequestPluginHandler', function(sandbox, restrictionPlugin) {
    this.sandbox = sandbox;
    this.restrictionPlugin = restrictionPlugin;
}, {
    handleRequest : function(core, request) {
        this.restrictionPlugin.startRestriction();
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
