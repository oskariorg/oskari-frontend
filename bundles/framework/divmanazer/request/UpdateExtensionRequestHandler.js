/*
 * @class  Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler', function (ui) {
    this.ui = ui;
}, {
    handleRequest: function (core, request) {
        var extension = request.getExtension(),
            extensionName = request.getExtensionName(),
            extensionInfo;
        if (!extension && extensionName && extensionName != '*') {
            extensionInfo = this.ui.getExtensionByName(extensionName);
            if (!extensionInfo) {
                return;
            }
            extension = extensionInfo.extension;
        }

        this.ui.updateExtension(extension, request);

    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
