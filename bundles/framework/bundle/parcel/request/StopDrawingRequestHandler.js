Oskari.clazz.define(
        'Oskari.mapframework.bundle.parcel.request.StopDrawingRequestPluginHandler',
        
        function(sandbox, drawPlugin) {
            this.sandbox = sandbox;
            this.drawPlugin = drawPlugin;
        },
        {
            handleRequest: function(core,request) {
                this.sandbox.printDebug("[Oskari.mapframework.bundle.parcel.request.StopDrawingRequestPluginHandler] Stop drawing");
                if(request.isCancel()) {
                    // we wish to clear the drawing without sending further events
                    this.drawPlugin.stopDrawing();
                }
                else {
                    // pressed finished drawing, act like dblclick
                    this.drawPlugin.forceFinishDraw();
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });