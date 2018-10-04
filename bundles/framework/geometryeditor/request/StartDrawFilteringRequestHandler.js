Oskari.clazz.define('Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StartDrawFilteringRequestPluginHandler', function(sandbox, drawFilterPlugin) {

    this.sandbox = sandbox;
    this.drawFilterPlugin = drawFilterPlugin;
    this._log = Oskari.log('StartDrawFilteringRequestPluginHandler');
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getMode();
        this._log.debug('Start Drawing: ' + drawMode);
        this.drawFilterPlugin.startDrawFiltering({
            drawMode : request.getMode(),
            geometry : request.getGeometry(),
            sourceGeometry : request.getSourceGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
