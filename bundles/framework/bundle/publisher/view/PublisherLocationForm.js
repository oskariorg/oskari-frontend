/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLocationForm
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLocationForm',

/**
 * @method create called automatically on construction
 * @static
 */
function(localization) {
	this.loc = localization;
	this.fields = {
		'domain' : {
			"label" : localization.domain.label,
			"placeholder" : localization.domain.placeholder,
			"helptags" : 'portti,help,publisher,domain',
			"tooltip" : localization.domain.tooltip
		},
		'name' : {
			"label" : localization.name.label,
			"placeholder" : localization.name.placeholder,
			"helptags" : 'portti,help,publisher,name',
			"tooltip" : localization.name.tooltip
		}
	};
	this.langField = {
		template : jQuery('<div class="field">' + 
    			'<div class="help icon-info" title="' + localization.language.tooltip + '" helptags="portti,help,publisher,language"></div>' + 
    			'<label for="language">' + localization.language.label + '</label><br clear="all" />' + 
    			'<select name="language"></select>' + 
			'</div>'),
		optionTemplate : jQuery('<option></option>')
	}
}, {
	init : function() {
		var me = this;
		for(var fkey in this.fields) {
			var data = this.fields[fkey];
			var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput', fkey);
			field.setLabel(data.label);
			field.setTooltip(data.tooltip, data.helptags);
			field.setPlaceholder(data.placeholder);
			data.field = field;
		}
		
		this.fields['domain'].field.setRequired(true, this.loc['error'].domain);
        this.fields['domain'].field.setContentCheck(true, this.loc['error'].domainIllegalCharacters);
		this.fields['domain'].field.setValidator(function(inputField) {
			
    		var value = inputField.getValue();
    		var name = inputField.getName();
    		var errors = [];
            if (value.startsWith('http') || value.startsWith('www')) {
            	errors.push({
        			"field": name, 
        			"error" :  me.loc['error'].domainStart
    			});
            	return errors;
           	}
            return errors;
		});
		this.fields['name'].field.setRequired(true, this.loc['error'].name);
        this.fields['name'].field.setContentCheck(true, this.loc['error'].nameIllegalCharacters);
		
        // language options are rendered based on localization
    	var langField = this.langField.template.clone();
        var languageSelection = langField.find('select[name=language]');
        var langOpts = this.loc.language.options;
        for (var opt in langOpts) {
        	var option = this.langField.optionTemplate.clone();
        	option.attr('value', opt);
        	option.append(langOpts[opt]);
            languageSelection.append(option);
        }
        this.langField.field = langField;
	},
	getPanel : function() {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.domain.title);
        var contentPanel = panel.getContainer();
		for(var fkey in this.fields) {
			var data = this.fields[fkey];
			contentPanel.append(data.field.getField());
	    }
		contentPanel.append(this.langField.field);
		return panel;
	},
	getValues : function() {
		var values = {};
		for(var fkey in this.fields) {
			var data = this.fields[fkey];
			values[fkey] = data.field.getValue();
		}
		values.language = this.langField.field.find('select[name=language]').val();
		return values;
    },
	validate : function() {
		var errors = [];
		for(var fkey in this.fields) {
			var data = this.fields[fkey];
    		errors = errors.concat(data.field.validate());
		}
		return errors;
    }
});

