/**
 * @class Oskari.userinterface.request.AddExtensionRequest
 */
Oskari.clazz.define('Oskari.userinterface.request.AddExtensionRequest', function(extension) {
	this._extension = extension;
}, {
	__name : "userinterface.AddExtensionRequest",
	getName : function() {
		return this.__name;
	},
	getExtension : function() {
		return this._extension;
	}
}, {
	'protocol' : ['Oskari.mapframework.request.Request']
});
