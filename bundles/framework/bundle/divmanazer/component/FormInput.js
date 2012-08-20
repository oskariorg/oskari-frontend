/**
 * @class Oskari.userinterface.component.FormInput
 * Form field to be used with Oskari.userinterface.component.Form 
 */
Oskari.clazz.define('Oskari.userinterface.component.FormInput',

/**
 * @method create called automatically on construction
 * @static
 */
function(name) {
    this.template = jQuery('<div class="oskarifield"><label></label><input type="text" /></div>');
    this.templateErrors = jQuery('<div class="error"></div>');
    this._field = this.template.clone();
    
	var label = this._field.find('label');
	label.attr('for', name);
	
	var input = this._field.find('input');
	input.attr('name', name);
    this._name = name;
    this._validator = null;
}, {
	setLabel : function(pLabel) {
		var label = this._field.find('label');
		label.html(pLabel);
	},
	setPlaceholder : function(pLabel) {
		var input = this._field.find('input');
		input.attr('placeholder', pLabel);
	},
	showErrors : function(errors) {
		this.clearErrors();
	    var errorDiv = this.templateErrors.clone();
	    // TODO: check spacing for multiple errors
		for(var i = 0 ; i < errors.length; ++i) {
			errorDiv.append(errors[i]['error'] + '<br/>');
		}
		this._field.append(errorDiv);
	},
	clearErrors : function() {
		var errors = this._field.find('div.error');
		errors.remove();
	},
    /**
     * @method getField
     * Returns reference to the field DOM
     * @return {jQuery}
     */
    getField : function() {
    	return this._field;
    },
    getValue : function() {
    	return this._field.find('input').val();
    },
    getName : function() {
    	return this._name;
    },
	
    /**
     * @method validate
     * Returns errors array or empty array if no errors
     * @return {Object[]}
     */
    setValidator : function(pValidator) {
    	this._validator = pValidator;
    },
    /**
     * @method validate
     * Returns errors array or empty array if no errors
     * @return {Object[]}
     */
    validate : function() {
    	var errors = [];
    	if(this._validator) {
    		errors = this._validator(this);
    	}
    	return errors;
    }
});
