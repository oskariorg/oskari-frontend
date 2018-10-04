Oskari.clazz.define('Oskari.analysis.bundle.analyse.request.AnalyseRequestHandler', function (sandbox, handlerFunc) {

    this.sandbox = sandbox;
    this.cb = handlerFunc;
    this._log = Oskari.log('AnalyseRequestHandler');
}, {
    handleRequest: function (core, request) {
        var selections = request.getSelections();
        this._log.debug('Analyse requested');
        this.cb(selections);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});