Oskari.clazz.define(
    'Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StopDrawFilteringRequestPluginHandler',

    function(sandbox, drawFilterPlugin) {
        this.sandbox = sandbox;
        this.drawFilterPlugin = drawFilterPlugin;
        this._log = Oskari.log('StopDrawFilteringRequestPluginHandler');
    },
    {
        handleRequest: function(core,request) {
            this._log.debug('Stop draw filtering');
            if(request.isCancel()) {
                // we wish to clear the drawing without sending further events
                this.drawFilterPlugin.stopDrawFiltering();
            }
            else {
                // pressed finished drawing
                this.drawFilterPlugin.finishDrawFiltering();
            }
        }
    },{
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });