/**
 * @class Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequest
 * Requests a show question step
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Boolean}
 *            moduleId showed question module id
 */
function(moduleId) {
	this._moduleId = moduleId;
}, {
	/** @static @property __name request name */
    __name : "ShowQuestionStepRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getModuleId
     * @return {String} module id
     */
     getModuleId : function() {
     	return this._moduleId;
 	}
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});