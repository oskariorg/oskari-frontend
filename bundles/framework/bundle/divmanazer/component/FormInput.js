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
    this.templateTooltip = jQuery('<div class="icon-info"></div>');
    this._field = this.template.clone();
    
	var label = this._field.find('label');
	label.attr('for', name);
	
	var input = this._field.find('input');
	input.attr('name', name);
    this._name = name;
    this._validator = null;
    this._required = false;
    this._requiredMsg = 'required';
}, {
	setLabel : function(pLabel) {
		var label = this._field.find('label');
		label.html(pLabel);
	},
	setTooltip : function(pTooltip, pDataTags) {
		// TODO: check existing tooltip
		var tooltip = this.templateTooltip.clone();
		tooltip.attr('title', pTooltip);
		if(pDataTags) {
			tooltip.addClass('help');
			tooltip.attr('helptags', pDataTags);
		}
		var label = this._field.find('label');
		label.before(tooltip);
	},
	setPlaceholder : function(pLabel) {
		var input = this._field.find('input');
		input.attr('placeholder', pLabel);
	},
	setRequired : function(blnParam, reqMsg) {
		this._required = (blnParam == true);
		if(reqMsg) {
			this._requiredMsg = reqMsg;	
		}
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
    setValue : function(value) {
    	return this._field.find('input').attr('value', value);
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
		var value = this.getValue();
    	if(this._required) {
    		if(!this.checkLength(value, 1)) {
            	errors.push({
        			"field": this.getName(), 
        			"error" : this._requiredMsg
    			});
    		}    		
    	}
    	/*
        if (value.indexOf('<') >= 0) {
        	errors.push({
    			"field": this.getName(), 
    			"error" : 'illegalchars'
			});
        } */
    	return errors;
    },
    
    /**
     * @method checkLength
     * @param {String} pStr string to validate
     * @param {Number} min min length (optional)
     * @param {Number} max max length (optional)
     * Validates string length
     * @return true if in range
     */
    checkLength : function(pStr, min, max) {
        if (pStr) {
            var str = jQuery.trim(pStr.toString());
            if (min && str.length < min) {
                return false;
            }
            if (max && str.length > max) {
                return false;
            }
            return true;
        }
        return false;
    },
    /**
     * @method validateNumberRange
     * @param {Object} value number to validate
     * @param {Number} min min value
     * @param {Number} max max value
     * Validates number range
     */
    validateNumberRange : function(value, min, max) {
        if (isNaN(parseInt(value))) {
            return false;
        }
        if (!isFinite(value)) {
            return false;
        }
        if (value < min || value > max) {
            return false;
        }
        return true;
    }
});
