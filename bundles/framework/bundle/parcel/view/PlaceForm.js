/**
 * @class Oskari.mapframework.bundle.parcel.view.PlaceForm
 * 
 * Shows a form for my place
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.view.PlaceForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.initialValues = undefined;
    
    var loc = instance.getLocalization('placeform');
    
    this.template = jQuery('<div class="parcelform">' +
            '<div class="field">' + 
                '<div class="help icon-info" ' + 
                'title="' + loc.tooltip + '"></div>' + 
                '<input type="text" name="placename" placeholder="' + loc.placename.placeholder + '"/>' +
            '</div>' +
            '<div class="field">' +  
                '<textarea name="placedesc" placeholder="' + loc.placedesc.placeholder + '">' +
                '</textarea>' +
            '</div>' +
        '</div>');
}, {
    /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function() {
        var ui = this.template.clone();
        var loc = this.instance.getLocalization('placeform');
        // TODO: if a place is given for editing -> populate fields here
        if(this.initialValues) {
            ui.find('input[name=placename]').attr('value', this.initialValues.place.name);
            ui.find('textarea[name=placedesc]').append(this.initialValues.place.desc);
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
            var placeName = onScreenForm.find('input[name=placename]').val();
            var placeDesc = onScreenForm.find('textarea[name=placedesc]').val();
            values.place = {
                name : placeName,
                desc : placeDesc,
            };
        }
        return values;
    },
    /**
     * @method setValues
     * Sets form values from object.
     * @param {Object} data place data as formatted in #getValues() 
     */
    setValues : function(data) {
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            onScreenForm.find('input[name=placename]').val(data.place.name);
            onScreenForm.find('textarea[name=placedesc]').val(data.place.desc);
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
    },
    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers 
     * @private
     */
    _getOnScreenForm : function() {
        // unbind live so 
        return jQuery('div.parcelform');
    }
});
