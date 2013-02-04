/**
 * @class Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest
 * Requests a hide question tools
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest', 

function() {
}, {
	/** @static @property __name request name */
    __name : "HideQuestionToolsRequest",
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