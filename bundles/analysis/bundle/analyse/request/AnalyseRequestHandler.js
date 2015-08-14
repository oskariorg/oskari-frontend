Oskari.clazz.define('Oskari.analysis.bundle.analyse.request.AnalyseRequestHandler', function (sandbox, handlerFunc) {

    this.sandbox = sandbox;
    this.cb = handlerFunc;
}, {
    handleRequest: function (core, request) {
        var selections = request.getSelections();
        this.sandbox.printDebug("[Oskari.analysis.bundle.analyse.request.AnalyseRequestHandler] analyse requested");
        this.cb(selections);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});