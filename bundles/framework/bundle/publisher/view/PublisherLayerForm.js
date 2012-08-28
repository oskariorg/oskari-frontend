/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayerForm
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm',

/**
 * @method create called automatically on construction
 * @static
 */
function(localization) {
	this.loc = localization;
}, {
	init : function() {
	},
	getPanel : function() {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.domain.title);
        var contentPanel = panel.getContainer();
        
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

