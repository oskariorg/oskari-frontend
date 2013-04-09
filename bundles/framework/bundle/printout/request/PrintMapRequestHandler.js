Oskari.clazz.define('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', function(sandbox, handlerFunc) {

    this.sandbox = sandbox;
    this.cb = handlerFunc;
}, {
    handleRequest : function(core, request) {
debugger;
        var selections = request.getSelections();
        this.sandbox.printDebug("[Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler] printout requested");
        this.cb(selections);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
