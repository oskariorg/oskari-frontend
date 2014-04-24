Oskari.clazz.define('Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StartDrawFilteringRequestPluginHandler', function(sandbox, drawFilterPlugin) {

    this.sandbox = sandbox;
    this.drawFilterPlugin = drawFilterPlugin;
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getMode();
        this.sandbox.printDebug("[Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StartDrawFilteringRequestPluginHandler] Start Drawing: " + drawMode);
        this.drawFilterPlugin.startDrawFiltering({
            drawMode : request.getMode(),
            geometry : request.getGeometry(),
            selectedGeometry : request.getSelectedGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
