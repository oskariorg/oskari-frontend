Oskari.clazz.define(
    'Oskari.digiroad.bundle.myplaces2.request.StopDrawingRequestPluginHandler',

    function (sandbox, drawPlugin) {
        this.sandbox = sandbox;
        this.drawPlugin = drawPlugin;
    }, {
        handleRequest: function (core, request) {
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
