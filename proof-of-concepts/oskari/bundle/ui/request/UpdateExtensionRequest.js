/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function(extension, state) {
	this._extension = extension;
	this._state = state;
}, {
	__name : "userinterface.UpdateExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	},
	getState : function() {
		return this._state;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
