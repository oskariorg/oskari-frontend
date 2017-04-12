/**
 * @class Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequest
 * Requests a change visibility of question tool
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.harava.bundle.mapquestions.request.VisibilityQuestionRequest',

/**
 * @method create called automatically on construction
 * @static
 * @param {String} moduleId module identifier
 * @param {String} questionId question identifier
 * @param {Boolean} enabled is tool enabled
 */
function(moduleId, questionId, enabled) {
	this.moduleId = moduleId;
	this.questionId = questionId;
	this.enabled = enabled;
}, {
	/** @static @property __name request name */
    __name : "VisibilityQuestionRequest",
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
        return this.moduleId;
    },
    /**
     * @method getQuestionId
     * @return {String} question id
     */
    getQuestionId : function() {
        return this.questionId;
    },
    /**
     * @method getEnabled
     * @return {Boolean} enabled
     */
    getEnabled : function() {
        return this.enabled;
    }
}, {
	/**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});