/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function (extension, state, extensionName, extensionTop, extensionLeft) {
    "use strict";
    this._extension = extension;
    this._state = state;
    this._extensionName = extensionName;
    this._location = {};
    this._location.top = extensionTop;
    this._location.left = extensionLeft;
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
    },
    getExtensionLocation: function() {
        return this._location;
    }

}, {
    'protocol': ['Oskari.mapframework.request.Request']
});
