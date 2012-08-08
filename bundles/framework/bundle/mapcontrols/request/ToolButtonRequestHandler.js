Oskari.clazz.define(
        'Oskari.mapframework.mapcontrols.request.ToolButtonRequestHandler',
        
        function(sandbox, plugin) {
            
            this.sandbox = sandbox;
            this.plugin = plugin;
        },
        {
            handleRequest: function(core,request) {
            	var reqType = request.getType();
                this.sandbox.printDebug("[Oskari.mapframework.mapcontrols.request.ToolButtonRequestHandler] got requesttype " + reqType);
                
                if('add' === reqType) {
                	this.plugin.addToolButton(request.getConfig());
                }
                else if('remove' === reqType) {
                	this.plugin.removeToolButton(request.getConfig());
                }
                else if('enable' === reqType) {
                	this.plugin.setButtonDisabled(request.getConfig(), false);
                }
                else if('disable' === reqType) {
                	this.plugin.setButtonDisabled(request.getConfig(), true);
                }
                else if('toggle' === reqType) {
                	//this.plugin.toggleToolButton(request.getConfig());
                }
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });