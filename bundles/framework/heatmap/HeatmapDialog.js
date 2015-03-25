/**
 * This bundle attaches heatmap tool for layers
 *
 * @class Oskari.mapframework.bundle.heatmap.HeatmapDialog
 */
Oskari.clazz.define('Oskari.mapframework.bundle.heatmap.HeatmapDialog',
    /**
     * @method create called automatically on construction
     * @static
     */
    function(localization) {
    	this.loc = localization;
    }, {
        __templates : {
            'main' : _.template('<div>' + 
            	'</div>'),
            'propertySelect' : _.template('<div><span>${label}</span></div>'),
            'propertySingle' : _.template('<div><span>${label}</span>: ${value}</div>'),
            'select' : _.template('<select name="properties">' + 
            			'<% _.forEach(props, function(value) {  %>' +
            				'<option>${value}</option>'+
        				'<% }); %>' +
            		'</select>')
        },
    	showDialog : function(layer, callback) {
    		if(this.dialog) {
    			this.dialog.close(true);
    			delete this.dialog;
    		}
    		var me = this,
    			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

    		var content = jQuery(this.__templates.main());
			// TODO: maybe replace radius field with a slider?
			var radiusInput = Oskari.clazz.create('Oskari.userinterface.component.NumberInput');
			radiusInput.setTitle('Radius');
			radiusInput.setValue(layer.getRadius() || 10);
			radiusInput.setMin(1);
			radiusInput.setMax(300);
			content.append(radiusInput.getElement());
			// TODO: color selection

    		var propertyElement = null;
    		var propertySelector = null;
    		// only show select if there is something to select?
    		if(layer.getHeatmapProperties().length > 1) {
    			propertyElement =  jQuery(this.__templates.propertySelect({
	    			label : this.loc.propertyLabel
	    		}));
    			propertySelector = jQuery(this.__templates.select({
	    			props : layer.getHeatmapProperties()
	    		}));
	    		propertySelector.val(layer.getSelectedHeatmapProperty())
	    		propertyElement.append(propertySelector);
	    		content.append(propertyElement);
    		}
    		else {
    			propertyElement =  jQuery(this.__templates.propertySingle({
	    			label : this.loc.propertyLabel,
	    			value : layer.getSelectedHeatmapProperty()
	    		}));
	    		content.append(propertyElement);
    		}
    		var buttons = [];

			var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
			okBtn.setHandler(function() {
				// TODO: validate
				var values = {
					radius : radiusInput.getValue()
				};
				if(propertySelector) {
					values.property = propertySelector.val();
				}
				else {
					values.property = layer.getHeatmapProperties()[0]
				}
				dialog.close();
				delete me.dialog;
				callback(values);
			});
			buttons.push(dialog.createCloseButton());

			buttons.push(okBtn);
    		dialog.show(this.loc.title, content, buttons);
    		dialog.makeDraggable();
			this.dialog = dialog;
    	}
    });