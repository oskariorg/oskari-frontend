/**
 * @class Oskari.userinterface.request.UpdateExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.UpdateExtensionRequest', function(extension, state,extensionName) {
	this._extension = extension;
	this._state = state;
	this._extensionName = extensionName; 
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
	},
	getExtensionName: function() {
		return this._extensionName;
	} 
	
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
