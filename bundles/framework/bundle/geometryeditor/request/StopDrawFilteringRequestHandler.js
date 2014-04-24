Oskari.clazz.define(
        'Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StopDrawFilteringRequestPluginHandler',
        
        function(sandbox, drawFilterPlugin) {
            this.sandbox = sandbox;
            this.drawFilterPlugin = drawFilterPlugin;
        },
        {
            handleRequest: function(core,request) {
                this.sandbox.printDebug("[Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StopDrawFilteringRequestPluginHandler] Stop draw filtering");
                if(request.isCancel()) {
                    // we wish to clear the drawing without sending further events
                    this.drawFilterPlugin.stopDrawFilter();
                }
                else {
                    // pressed finished drawing, act like dblclick
                    this.drawFilterPlugin.finishDrawFilter();
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });