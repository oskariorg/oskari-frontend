Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StartDrawingRequestPluginHandler', function(sandbox, drawPlugin) {

    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
    this._log = Oskari.log('StartDrawingRequestPluginHandler');
}, {
    handleRequest : function(core, request) {
        var drawMode = request.getDrawMode();
        this._log.debug('Start Drawing: ' + drawMode);
        this.drawPlugin.startDrawing({
            drawMode : request.getDrawMode(),
            geometry : request.getGeometry(),
            isModify : request.isModify(),
            style : ''
        });
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
