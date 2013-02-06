/**
 * @class Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequest
 * Requests a hide question tools
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequest', 

function() {
}, {
	/** @static @property __name request name */
    __name : "ToggleQuestionToolsRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});