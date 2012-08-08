/**
 * @class Oskari.userinterface.request.RemoveExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.RemoveExtensionRequest', function(extension) {
	this._extension = extension;
}, {
	__name : "userinterface.RemoveExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
