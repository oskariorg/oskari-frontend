Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RegisterStyleRequestHandler', function (sandbox, mapmodule) {
    this.sandbox = sandbox;
    this.mapModule = mapmodule;
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.RegisterStyleRequestHandler] Register style "'+ request.getKey() +'" for styles: ', request.getStyles());

        if(request.getKey() && request.getStyles()) {
            this.mapModule.registerWellknownStyle(request.getKey(), request.getStyles());
        }
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
