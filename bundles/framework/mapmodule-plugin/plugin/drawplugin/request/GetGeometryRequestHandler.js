Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.GetGeometryRequestPluginHandler', function (sandbox, drawPlugin) {
    this.sandbox = sandbox;
    this.drawPlugin = drawPlugin;
    this._log = Oskari.log('GetGeometryRequestPluginHandler');
}, {
    handleRequest: function (core, request) {
        var callBack = request.getCallBack();
        this._log.debug('geometry requested');
        var drawing = this.drawPlugin.getDrawing();
        callBack(drawing.geometry);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
