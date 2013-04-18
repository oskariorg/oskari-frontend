Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplaces2.request.FinishRestrictionRequestPluginHandler',
    function(sandbox, restrictionPlugin) {
        this.sandbox = sandbox;
        this.restrictionPlugin = restrictionPlugin;
    }, {
        handleRequest: function(core, request) {
            if(request.isCancel()) {
                this.restrictionPlugin.cleanup();
            }
            else {
                this.restrictionPlugin.finishRestriction(request.getData(), request.getCallback());
            }
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);