/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function (extension, state, extensionName, extensionTop, extensionLeft) {
    this._extension = extension;
    this._state = state;
    this._extensionName = extensionName;
    this._location = {};
    this._location.top = extensionTop;
    this._location.left = extensionLeft;
}, {
    __name: "userinterface.UpdateExtensionRequest",
    getName: function () {
        return this.__name;
    },
    getExtension: function () {
        return this._extension;
    },
    getState: function () {
        return this._state;
    },
    getExtensionName: function () {
        return this._extensionName;
    },
    getExtensionLocation: function() {
        return this._location;
    }

}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
