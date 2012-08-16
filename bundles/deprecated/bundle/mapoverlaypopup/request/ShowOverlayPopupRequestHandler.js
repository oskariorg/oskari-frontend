Oskari.clazz.define(
        'Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler',
        
        function(sandbox, plugin) {
            
            this.sandbox = sandbox;
            this.plugin = plugin;
        },
        {
            handleRequest: function(core,request) {
            	var urlToShow = request.getAutoLoadUrl();
                this.sandbox.printDebug("[Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler] got dataurl " + urlToShow);
                this.plugin.showPopup(urlToShow, request.getButtonsConf());
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });