/**
 *
 * @class Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler', function (ui) {
    "use strict";
    this.ui = ui;

}, {
    handleRequest: function (core, request) {
        "use strict";
        var extension = request.getExtension();

        this.ui.addExtension(extension);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
