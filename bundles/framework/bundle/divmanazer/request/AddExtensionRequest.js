/**
 * @class Oskari.userinterface.request.AddExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.AddExtensionRequest', function (extension) {
    "use strict";
    this._extension = extension;
}, {
    __name: "userinterface.AddExtensionRequest",
    getName: function () {
        "use strict";
        return this.__name;
    },
    getExtension: function () {
        "use strict";
        return this._extension;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});
