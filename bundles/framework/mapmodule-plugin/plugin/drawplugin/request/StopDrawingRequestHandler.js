Oskari.clazz.define(
    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StopDrawingRequestPluginHandler',

    function (sandbox, drawPlugin) {
        this.sandbox = sandbox;
        this.drawPlugin = drawPlugin;
        this._log = Oskari.log('StopDrawingRequestPluginHandler');
    }, {
        handleRequest: function (core, request) {
            this._log.debug('Stop drawing');
            if (request.isCancel()) {
                // we wish to clear the drawing without sending further events
                this.drawPlugin.stopDrawing();
            } else {
                // pressed finished drawing, act like dblclick
                this.drawPlugin.forceFinishDraw();
            }
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
