/**
 * @class Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequest
 * Requests a show question tools
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequest', 

function(fast) {
    this._fast = fast;
}, {
	/** @static @property __name request name */
    __name : "ShowQuestionToolsRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFast
     * @return {Boolean} show fast
     */
    getFast : function() {
        return this._fast;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});