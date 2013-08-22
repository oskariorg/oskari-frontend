/**
 * @class Oskari.userinterface.request.RemoveExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.RemoveExtensionRequest', function (extension) {
    "use strict";
    this._extension = extension;
}, {
    __name: "userinterface.RemoveExtensionRequest",
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
