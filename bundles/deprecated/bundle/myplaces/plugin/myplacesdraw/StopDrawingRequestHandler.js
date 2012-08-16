Oskari.clazz.define(
        'Oskari.mapframework.myplaces.request.StopDrawingRequestPluginHandler',
        
        function(sandbox, drawPlugin) {
            
            this.sandbox = sandbox;
            this.drawPlugin = drawPlugin;
        },
        {
            handleRequest: function(core,request) {
                this.sandbox.printDebug("[Oskari.mapframework.myplaces.request.StopDrawingRequestPluginHandler] Stop drawing");
                if(request.isPropagate()) {
                	// pressed finished drawing, act like dblclick
                	this.drawPlugin.forceFinishDraw();
                }
                else {
                	// we wish to clear the drawing without sending further events
                	this.drawPlugin.stopDrawing();
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });