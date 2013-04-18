/**
 * @class Oskari.mapframework.bundle.myplaces2.view.PlaceForm
 * 
 * Shows a form for my place
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.PlaceForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.placeId = undefined;
    this.initialValues = undefined;
    
    var loc = instance.getLocalization('placeform');

    this.template = jQuery('<div class="myplacesform">' +
            '<div class="field">' + 
                '<div class="help icon-info" ' + 
                'title="' + loc.tooltip + '"></div>' +
                '<label for="placedyntype">' + loc.placedyntype.label + '</label><br/>' +
                '<select name="placedyntype"></select>' +
            '</div>' +
            '<div class="field">' +  
                '<input type="text" name="placedynvalue" placeholder="' + loc.placedynvalue.placeholder + '"/>' +
            '</div>' +
        '</div>');

    this.templateOption = jQuery('<option></option>');
    this.dynTypeOptions = loc.placedyntype.values;
}, {
    /**
     * @method getForm
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function(categories) {
        var ui = this.template.clone();
        var loc = this.instance.getLocalization('placeform');

        // Populating data types into the selection.
        var selection = ui.find('select[name=placedyntype]');
        for(var key in this.dynTypeOptions) {
            var option = this.templateOption.clone();
            option.append(key);
            option.attr('value', this.dynTypeOptions[key]);
            if(this.initialValues && this.initialValues.place.dyntype == this.dynTypeOptions[key]) {
                option.attr('selected', 'selected');
            }
            selection.append(option);
        }
        
        if(this.initialValues) {
            ui.find('select[name=placedyntype]').attr("value", this.initialValues.place.dyntype);
            ui.find('input[name=placedynvalue]').attr("value", this.initialValues.place.dynvalue);
        }
        return ui;
    },
    /**
     * @method getValues
     * Returns form values as an object
     * @return {Object} 
     */
    getValues : function() {
        var values = {};
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            var dynType = onScreenForm.find('select[name=placedyntype]').val();
            var dynValue = onScreenForm.find('input[name=placedynvalue]').val();
            values.place = {
                dyntype : dynType,
                dynvalue : dynValue
            };
            if(this.placeId) {
                values.place.id = this.placeId;
            }
        }
        return values;
    },
    /**
     * @method setValues
     * Sets form values from object.
     * @param {Object} data place data as formatted in #getValues() 
     */
    setValues : function(data) {
        this.placeId = data.place.id;
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();

        if(onScreenForm.length > 0) {
            // found form on screen
            onScreenForm.find('select[name=placedyntype]').val(data.place.dyntype);
            onScreenForm.find('input[name=placedynvalue]').val(data.place.dynvalue);
        }
        
        this.initialValues = data;
    },

    /**
     * @method destroy
     * Removes eventlisteners 
     */
    destroy : function() {
        // unbind live bindings
        var onScreenForm = this._getOnScreenForm();
        onScreenForm.find('select[name=category]').die();
        if (this.categoryForm) {
            this.categoryForm.destroy();
            this.categoryForm = undefined;
        }
    },
    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers 
     * @private
     */
    _getOnScreenForm : function() {
        // unbind live so 
        return jQuery('div.myplacesform');
    }
});
