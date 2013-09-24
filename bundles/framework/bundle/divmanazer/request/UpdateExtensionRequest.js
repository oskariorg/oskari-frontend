/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function (extension, state, extensionName) {
    "use strict";
    this._extension = extension;
    this._state = state;
    this._extensionName = extensionName;
}, {
    __name: "userinterface.UpdateExtensionRequest",
    getName: function () {
        "use strict";
        return this.__name;
    },
    getExtension: function () {
        "use strict";
        return this._extension;
    },
    getState: function () {
        "use strict";
        return this._state;
    },
    getExtensionName: function () {
        "use strict";
        return this._extensionName;
    }

}, {
    'protocol': ['Oskari.mapframework.request.Request']
});
