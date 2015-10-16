Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequestHandler', function (sandbox) {
    this.sandbox = sandbox;
    this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
    if (!this.mapModule._progressSpinner) {
        this.mapModule._progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner'
        );
        this.mapModule._progressSpinner.insertTo(this.mapModule.getMapEl());
    }
}, {
    handleRequest: function (core, request) {
        this.sandbox.printDebug('[Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequestHandler] Show progress spinner');
        if (request.getShow()) {
            this.mapModule._progressSpinner.start();
        } else {
            this.mapModule._progressSpinner.stop();
        }
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
