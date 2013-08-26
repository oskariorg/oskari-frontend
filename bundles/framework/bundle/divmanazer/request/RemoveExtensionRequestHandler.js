/**
 * @class Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler', function (ui) {
    "use strict";
    this.ui = ui;
}, {
    handleRequest: function (core, request) {
        "use strict";
        var extension = request.getExtension();
        this.ui.removeExtension(extension);

    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
