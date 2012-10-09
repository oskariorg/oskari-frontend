/**
 * @class Oskari.userinterface.component.Form
 * Generic form component
 */
Oskari.clazz.define('Oskari.userinterface.component.Form',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.template = jQuery('<div class="oskariform"></div>');
    this._form = this.template.clone();
    this.fields = [];
}, {
	addField : function(field) {
		this.fields.push(field);
	},
    /**
     * @method getForm
     * Returns reference to the form DOM
     * @return {jQuery
     */
    getForm : function(elementSelector) {
    	this._form = this.template.clone();
    	for(var i = 0; i < this.fields.length; ++i) {
    		this._form.append(this.fields[i].getField());
    	}
    	return this._form;
    },
    /**
     * @method getForm
     * Returns reference to the form DOM
     * @return {jQuery
     */
    validate : function(elementSelector) {
    	var errors = [];
    	for(var i = 0; i < this.fields.length; ++i) {
    		errors = errors.concat(this.fields[i].validate());
    	}
    	return errors;
    },
	showErrors : function() {
		// TODO : maybe not validate again
    	for(var i = 0; i < this.fields.length; ++i) {
    		var errors = this.fields[i].validate();
    		this.fields[i].showErrors(errors);
    	}
	},
	clearErrors : function() {
    	for(var i = 0; i < this.fields.length; ++i) {
    		this.fields[i].clearErrors();
    	}
	}
});
