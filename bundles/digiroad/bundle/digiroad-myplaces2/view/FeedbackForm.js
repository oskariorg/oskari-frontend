/**
 * @class Oskari.mapframework.bundle.myplaces2.view.FeedbackForm
 * 
 * Shows a form for my place
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.FeedbackForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.placeId = undefined;
    this.initialValues = undefined;
    
    var loc = instance.getLocalization('feedbackform');

    this.template = jQuery('<div class="feedbackform">' +
            '<div class="field">' + 
                '<div class="help icon-info" ' + 
                'title="' + loc.tooltip + '"></div>' + 
                '<input type="text" name="feedbackname" placeholder="' + loc.feedbackname.placeholder + '"/>' +
            '</div>' +
            '<div class="field">' +  
                '<textarea type="text" name="feedbackdesc" placeholder="' + loc.feedbackdesc.placeholder + '"/>' +
            '</div>' +
        '</div>');

    this.templateOption = jQuery('<option></option>');
    this.categoryForm = undefined;
}, {
    /**
     * @method getForm
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function(categories) {
        var ui = this.template.clone();
        var loc = this.instance.getLocalization('feedbackform');
        // TODO: if a place is given for editing -> populate fields here
        
        if(this.initialValues) {
            ui.find('input[name=feedbackname]').attr('value', this.initialValues.place.name);
            ui.find('textarea[name=feedbackdesc]').append(this.initialValues.place.desc);
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
            var name = onScreenForm.find('input[name=feedbackname]').val();
            var desc = onScreenForm.find('textarea[name=feedbackdesc]').val();
            values.place = {
                name : name,
                description : desc
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
            onScreenForm.find('input[name=feedbackname]').val(data.place.feedbackname);
            onScreenForm.find('textarea[name=feedbackdesc]').val(data.place.feedbackdesc);
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
        return jQuery('div.feedbackform');
    }
});
