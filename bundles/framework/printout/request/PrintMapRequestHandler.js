Oskari.clazz.define('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', function (sandbox, handlerFunc) {
    this.sandbox = sandbox;
    this.cb = handlerFunc;
    this._log = Oskari.log('PrintMapRequestHandler');
}, {
    handleRequest: function (core, request) {
        var selections = request.getSelections();
        this._log.debug('printout requested');
        this.cb(selections);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
