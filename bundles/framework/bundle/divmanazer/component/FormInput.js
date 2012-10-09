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
    this.templateClearButton = jQuery('<div class="icon-close" style="margin-left: 0px; position: relative; display: inline-block; left: -20px; top: 3px;"></div>');
    this._field = this.template.clone();
    
	var label = this._field.find('label');
	label.attr('for', name);
	
	var input = this._field.find('input');
	
	input.attr('name', name);
    this._name = name;
    this._validator = null;
    this._required = false;
    this._requiredMsg = 'required';
    this._contentCheck = false;
    this._contentCheckMsg = 'illegal characters';
    
    this._bindFocusAndBlur();
    // word characters, digits, whitespace and '-' allowed
    this._regExp = /[\s\w\d\.\-äöåÄÖÅ]*/;
    this._colorRegExp = /^([A-Fa-f0-9]{6})$/;
}, {
    /**
     * @method setLabel
     * Sets the fields label
     * @param {String} pLabel
     */
	setLabel : function(pLabel) {
		var label = this._field.find('label');
		label.html(pLabel);
	},
    /**
     * @method setTooltip
     * Sets the fields tooltip and possible help tags
     * @param {String} pTooltip tooltip text
     * @param {String} pDataTags comma separated list of article tags identifying the help article for this field
     */
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
    /**
     * @method setPlaceholder
     * Sets the fields placeholder text
     * @param {String} pLabel
     */
	setPlaceholder : function(pLabel) {
		var input = this._field.find('input');
		input.attr('placeholder', pLabel);
	},
    /**
     * @method setRequired
     * Adds a validator to the field requiring content on the field
     * @param {Boolean} blnParam true to require content on the field
     * @param {String} reqMsg error message to show when validation fails (field is empty)
     */
	setRequired : function(blnParam, reqMsg) {
		this._required = (blnParam == true);
		if(reqMsg) {
			this._requiredMsg = reqMsg;	
		}
	},
    /**
     * @method setCharacterCheck
     * Adds a validator to the field requiring content to match certain rules.
     * @param {Boolean} blnParam true to require content validation on the field
     * @param {String} errorMsg error message to show when validation fails
     * @param {Pattern} regexp pattern to check content with (optional)
     */
    setContentCheck : function(blnParam, errorMsg, regexp) {
        this._contentCheck = (blnParam == true);
        if(regexp) {
            this._regExp = regexp;
        }
        if(errorMsg) {
            this._contentCheckMsg = errorMsg; 
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
    /**
     * @method getValue
     * Returns fields value. 
     * @param {Boolean} blnFilteredValue true to filter contents to include only safe characters (optional)
     * @return {String}
     */
    getValue : function(blnFilteredValue) {
        var value = this._field.find('input').val();
        if(blnFilteredValue) {
            value = value.match(this._regExp);
        }
    	return value;
    },
    /**
     * @method setValue
     * Sets the fields value
     * @param {String} value
     */
    setValue : function(value) {
    	this._field.find('input').attr('value', value);
    },
    /**
     * @method getName
     * Returns fields name
     * @return {String}
     */
    getName : function() {
    	return this._name;
    },
    /**
     * @method setEnabled
     * Enables/Disables the button
     * @param {Boolean} blnEnabled true to enable, false to disable
     */
    setEnabled : function(blnEnabled) {
        if(blnEnabled === true) {
            this._field.find('input').removeAttr('disabled');
        }
        else {
            this._field.find('input').attr('disabled', 'disabled');
        }
    },
	
    /**
     * @method setValidator
     * The given validator function should returns an errors array or empty array if no errors.
     * The array consists of objects like this:
     * {
     *   "field": this.getName(), 
     *   "error" : 'error message'
     * }
     * @param {Function} pValidator validator function
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
        if(this._contentCheck) {
            if(!this.checkValue()) {
                errors.push({
                    "field": this.getName(), 
                    "error" : this._contentCheckMsg
                });
            }           
        }
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
     * @method checkValue
     * Checks the field contents against a regexp pattern and returns true if contents match
     * @return {Boolean}
     */
    checkValue : function() {
        var value = this.getValue();
        var filtered = this.getValue(true);
        // if values match, everything ok
        return (value == filtered);
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
    },
    /**
     * @method validateHexColor
     * Validates a color hex-string with out the starting #-character
     * @param {String} value hex-string to validate
     */
    validateHexColor : function(value) {
        return this._colorRegExp.test(value);
    },
    
    /**
     * @method bindEnterKey
     * Binds <enter> keypress to trigger given function 
     * @param {Function} callback method that is called if enter is pressed on the input 
     */
    bindEnterKey : function(callback) {
        var me = this;
        var input = this._field.find('input');
        input.keypress(function(event){
            if(me._isEnterPress(event)) {
                callback();
            }
        });
    },
    /**
     * @method bindChange
     * Bind function to fields change event
     * @param {Function} callback method that is called if enter is pressed on the input 
     * @param {Boolean} blnImmediate true to bind to keyup event, false to bind to change event 
     */
    bindChange : function(callback, blnImmediate) {
        var me = this;
        var input = this._field.find('input');
        
        if(!blnImmediate) {
            input.on('change', callback);
        }
        else {
            input.keyup(callback); 
        }
    },
    /**
     * @method addClearButton
     * Adds a clear button to the field 
     */
    addClearButton : function() {

        var clearButton =  this.templateClearButton.clone();
        var input = this._field.find('input');
        clearButton.bind('click', function() {
            input.val('');
            input.trigger('change');
            input.trigger('keyup');
        });
        input.after(clearButton);
    },
    /**
     * @method _bindFocusAndBlur
     * Enables/Disables map movement with keyboard to fields focus/blur 
     * @private 
     */
    _bindFocusAndBlur : function() {
        
        var sandbox = Oskari.$('sandbox');
        if(!sandbox) {
            return;
        }
        var enabler = sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest');
        var disabler = sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest');
        if(!enabler || !disabler) {
            return;
        }
        // all set, ready to bind requests
        var input = this._field.find('input');
        input.focus(function(){
            sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        });
        input.blur(function(){
            sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
        });
    },
    /**
     * @method _isEnterPress
     * Detects if <enter> key was pressed and calls #_doSearch if it was
     * @private
     * @param {Object} event
     *      keypress event object from browser
     */
    _isEnterPress : function(event) {
        var keycode;
        if (window.event) {
            keycode = window.event.keyCode;
        } else if (event) {
            keycode = event.which;
        } 
        // true if <enter>
        return (event.keyCode == 13);
    }
});
