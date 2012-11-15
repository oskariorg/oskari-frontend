/**
 * @class Oskari.framework.domain.WizardOptions
 *
 * Used in map publish wizard? TODO: check docs
 * @deprecated
 */
Oskari.clazz.define('Oskari.mapframework.domain.WizardOptions',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._wizardName = null;
    this._wizardId = null;
    this._wizardHeight = 600;
    this._wizardWidth = 800;
    this._wizardSteps = new Array();
    this._wizardTooltips = new Array();
    this._wizardShowProgressBar = true;
    this._wizardShowCloseConfirm = true;
    this._wizardCloseConfirmTitleKey = 'wizard_service_module_confirm_message_title';
    this._wizardCloseConfirmMessageKey = 'wizard_service_module_confirm_message';
}, {

    getWizardName : function() {
        return this._wizardName;
    },
    getWizardId : function() {
        return this._wizardId;
    },
    getWizardHeight : function() {
        return this._wizardHeight;
    },
    getWizardWidth : function() {
        return this._wizardWidth;
    },
    getWizardSteps : function() {
        return this._wizardSteps;
    },
    getWizardStep : function(id) {
        return this._wizardSteps[id];
    },
    getWizardStepsAmount : function() {
        return this._wizardSteps.length;
    },
    getWizardTooltips : function() {
        return this._wizardTooltips;
    },
    getWizardShowProgressBar : function() {
        return this._wizardShowProgressBar;
    },
    getWizardShowCloseConfirm : function() {
        return this._wizardShowCloseConfirm;
    },
    getWizardCloseConfirmMessageKey : function() {
        return this._wizardCloseConfirmMessageKey;
    },
    getWizardCloseConfirmTitleKey : function() {
        return this._wizardCloseConfirmTitleKey;
    },
    setWizardName : function(name) {
        this._wizardName = name;
    },
    setWizardId : function(id) {
        this._wizardId = id;
    },
    setWizardHeight : function(height) {
        this._wizardHeight = height;
    },
    setWizardWidth : function(width) {
        this._wizardWidth = width;
    },
    setWizardSteps : function(steps) {
        this._wizardSteps = steps;
    },
    addWizardStep : function(step) {
        this._wizardSteps.push(step);
    },
    setWizardTooltips : function(tooltips) {
        this._wizardTooltips = tooltips;
    },
    setWizardShowProgressBar : function(showProgressbar) {
        this._wizardShowProgressBar = showProgressbar;
    },
    setWizardShowCloseConfirm : function(showCloseConfirm) {
        this._wizardShowCloseConfirm = showCloseConfirm;
    },
    setWizardCloseConfirmTitleKey : function(closeConfirmTitleKey) {
        this._wizardCloseConfirmTitleKey = closeConfirmTitleKey;
    },
    setWizardCloseConfirmMessageKey : function(closeConfirmMessageKey) {
        this._wizardCloseConfirmMessageKey = closeConfirmMessageKey;
    }
});
