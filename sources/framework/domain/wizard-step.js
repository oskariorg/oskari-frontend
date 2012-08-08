/**
 * @class Oskari.mapframework.domain.WizardStep
 *
 * Used in map publish wizard? TODO: check docs
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.WizardStep',

/**
 * @method create called automatically on construction
 * @static
 */
function(title, contentTitle, contentPage, contentType, actionKeys, beforeNextStep, beforePreviousStep) {
    /* Content types */
    this.CONTENT_TYPE_HTML = "html";
    this.CONTENT_TYPE_URL = "url";
    this.CONTENT_TYPE_PANEL = "panel";
    this.CONTENT_TYPE_DYNAMIC_PANEL = "dynpanel";

    this._stepTitle = title;
    this._contentTitle = contentTitle;
    this._contentPage = contentPage;
    this._contentType = contentType;
    this._beforeNextStepFunction = beforeNextStep;
    this._beforePreviousStepFunction = beforePreviousStep;
    this._actionKeys = actionKeys;

    /** Step functions */
    if(this._beforeNextStepFunction == null || typeof this._beforeNextStepFunction != 'function') {
        this._beforeNextStepFunction = function() {
            return true;
        }
    }

    if(this._beforePreviousStepFunction == null || typeof this._beforePreviousStepFunction != 'function') {
        this._beforePreviousStepFunction = function() {
            return true;
        }
    }
}, {

    getActionKeys : function() {
        return this._actionKeys;
    },
    getStepTitle : function() {
        return this._stepTitle;
    },
    getContentTitle : function() {
        return this._contentTitle;
    },
    getContentPage : function() {
        return this._contentPage;
    },
    getContentType : function() {
        return this._contentType;
    },
    getBeforeNextStepFunction : function() {
        return this._beforeNextStepFunction;
    },
    getBeforePreviousStepFunction : function() {
        return this._beforePreviousStepFunction;
    },
    setStepTitle : function(stepTitle) {
        this._stepTitle = stepTitle;
    },
    setContentTitle : function(contentTitle) {
        this._contentTitle = contentTitle;
    },
    setContentPage : function(contentPage) {
        this._contentPage = contentPage;
    },
    setContentType : function(contentType) {
        this._contentType = contentType;
    },
    setBeforeNextStepFunction : function(beforeNextStepFunction) {
        this._beforeNextStepFunction = beforeNextStepFunction;
    },
    setBeforePreviousStepFunction : function(beforePreviousStepFunction) {
        this._beforePreviousStepFunction = beforePreviousStepFunction;
    }
});
