/**
 * @class Oskari.mapframework.bundle.parcel.view.PlaceForm
 * 
 * Shows a form for my place. For requests for name and description.
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
        '<label>' + loc.placename.placeholder + '</label>' +
        '<input type="text" name="placename" placeholder="' + loc.placename.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.ptitle.placeholder + '</label>' +
        '<input type="text" name="ptitle" placeholder="' + loc.ptitle.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.subtitle.placeholder + '</label>' +
        '<input type="text" name="subtitle" placeholder="' + loc.subtitle.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.description.placeholder + '</label>' +
        '<textarea name="description" placeholder="' + loc.description.placeholder + '">' +
        '</textarea>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.parent_property_id.placeholder + '</label>' +
        '<input type="text" name="parent_property_id" placeholder="' + loc.parent_property_id.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.parent_property_quality.placeholder + '</label>' +
        '<input type="text" name="parent_property_quality" placeholder="' + loc.parent_property_quality.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.area.placeholder + '</label>' +
        '<input type="text" name="area" placeholder="' + loc.area.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.reporter.placeholder + '</label>' +
        '<input type="text" name="reporter" placeholder="' + loc.reporter.placeholder + '"/>' +
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
        if(this.initialValues) {
            ui.find('input[name=placename]').attr('value', this.initialValues.place.name);
            ui.find('textarea[name=description]').append(this.initialValues.place.desc);
            ui.find('input[name=ptitle]').attr('value',this.initialValues.place.title);
            ui.find('input[name=subtitle]').attr('value',this.initialValues.place.subtitle);
            ui.find('input[name=parent_property_id]').attr('value',this.initialValues.place.parent_property_id);
            ui.find('input[name=parent_property_quality]').attr('value',this.initialValues.place.parent_property_quality);
            ui.find('input[name=area]').attr('value',this.initialValues.place.area);
            ui.find('input[name=reporter]').attr('value',this.initialValues.place.reporter);
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

        if (onScreenForm.length > 0) {
            // found form on screen
            var placeName = onScreenForm.find('input[name=placename]').val();
            var description = onScreenForm.find('textarea[name=description]').val();
            var ptitle = onScreenForm.find('input[name=ptitle]').val();
            var subtitle = onScreenForm.find('input[name=subtitle]').val();
            var parent_property_id = onScreenForm.find('input[name=parent_property_id]').val();
            var parent_property_quality = onScreenForm.find('input[name=parent_property_quality]').val();
            var area = onScreenForm.find('input[name=area]').val();
            var reporter = onScreenForm.find('input[name=reporter]').val();
            values.place = {
                name: placeName,
                desc: description,
                title: ptitle,
                subtitle: subtitle,
                parent_property_id: parent_property_id,
                parent_property_quality: parent_property_quality,
                area: area,
                reporter: reporter
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
            onScreenForm.find('textarea[name=description]').val(data.place.desc);
            onScreenForm.find('input[name=ptitle]').val(data.place.title);
            onScreenForm.find('input[name=subtitle]').val(data.place.subtitle);
            onScreenForm.find('input[name=parent_property_id]').val(data.place.parent_property_id);
            onScreenForm.find('input[name=parent_property_quality]').val(data.place.parent_property_quality);
             onScreenForm.find('input[name=area]').val(data.place.area);
             onScreenForm.find('input[name=reporter]').val(data.place.reporter);
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
