/**
 * @class Oskari.lupapiste.bundle.myplaces2.view.PlaceForm
 * 
 * Shows a form for my place
 */
Oskari.clazz.define("Oskari.lupapiste.bundle.myplaces2.view.PlaceForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.newCategoryId = '-new-';
    this.placeId = undefined;
    this.initialValues = undefined;
    
    var loc = instance.getLocalization('placeform');
    
    this.template = jQuery('<div class="myplacesform">' +
            '<div class="field">' + 
                '<div class="help icon-info" ' + 
                'title="' + loc.tooltip + '"></div>' + 
                loc.placename.label + '<br/>' +
                '<input type="text" name="placename" placeholder="' + loc.placename.placeholder + '"/>' +
            '</div>' +
            '<div class="field" style="visibility:hidden;display:none;">' + 
                '<input type="text" name="placelink" placeholder="' + loc.placelink.placeholder + '"/>' +
            '</div>' +
            '<div class="field">' +
                loc.placedesc.label + '<br/>' +
                '<textarea name="placedesc" placeholder="' + loc.placedesc.placeholder + '">' +
                '</textarea>' +
            '</div>' +
            '<div class="field" style="visibility:hidden;display:none;">' + 
                '<label for="category">' + loc.category.label + '</label><br clear="all" />' +
                '<select name="category" autofocus>' +
                '</select>' +
            '</div>' +
            '<div class="field">' +
              loc.placeheight.label + '<br/>' +
              '<input type="text" name="placeheight" placeholder="' + loc.placeheight.placeholder + '"/>' +
            '</div>' +
            '<div class="field" style="display:none;">' +
              loc.placewidth.label + '<br/>' +
              '<input type="text" name="placewidth" placeholder="' + loc.placewidth.placeholder + '"/>' +
            '</div>' + 
            '<div class="field">' +
                loc.area.label + '<br/>' +
                '<input type="text" name="area" placeholder="" />' +  
            '</div>' +
            '<div class="field">' +
            	loc.length.label + '<br/>' +
            	'<input type="text" name="length" placeholder="" />' +  
            '</div>' +
        '</div>');
    this.templateOption = jQuery('<option></option>');
    this.categoryForm = undefined;
}, {
    /**
     * @method getForm
     * @param {Oskari.lupapiste.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function(categories) {
        var ui = this.template.clone();
        ui.find('textarea[name=placedesc]').val('');
        ui.find('textarea[name=placedesc]').text('');
        var loc = this.instance.getLocalization('placeform');
        // TODO: if a place is given for editing -> populate fields here
        // populate category options
        if(categories) {
            var selection = ui.find('select[name=category]');
            var option = this.templateOption.clone();
            option.append(loc.category['new']);
            option.attr('value', this.newCategoryId);
            selection.append(option);
            for(var i = 0; i < categories.length; ++i) {
                var cat = categories[i];
                var option = this.templateOption.clone();
                option.append(cat.getName());
                option.attr('value', cat.getId());
                // find another way if we want to keep selection between places
                if(this.initialValues && this.initialValues.place && this.initialValues.place.category) {
                    if(this.initialValues.place.category == cat.getId()) {
                        option.attr('selected', 'selected');
                    }
                }
                else if(cat.isDefault()) {
                    option.attr('selected', 'selected');
                }
                selection.append(option);
            }
            this._bindCategoryChange();
        }
        
        if(this.initialValues) {
            ui.find('input[name=placename]').attr('value', this.initialValues.place.name);
            ui.find('input[name=placelink]').attr('value', this.initialValues.place.link);
            ui.find('textarea[name=placedesc]').append(this.initialValues.place.desc);
            ui.find('input[name=area]').attr('value', this.initialValues.place.area);
            ui.find('input[name=length]').attr('value', this.initialValues.place.length);
            ui.find('input[name=placeheight]').attr('value', this.initialValues.place.height);
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
            var placeLink = onScreenForm.find('input[name=placelink]').val();
            if(placeLink) {
                if(placeLink.indexOf('://') == -1 || placeLink.indexOf('://') > 6) {
                    placeLink = 'http://' + placeLink;
                }
                placeLink = placeLink.replace("<", '');
                placeLink = placeLink.replace(">", '');
            }
            var placeDesc = onScreenForm.find('textarea[name=placedesc]').val();
            var placeHeight = onScreenForm.find('input[name=placeheight]').val();
            var categorySelection = onScreenForm.find('select[name=category]').val();
            var area = onScreenForm.find('input[name=area]').val();
            var length = onScreenForm.find('input[name=length]').val();
            var width = onScreenForm.find('input[name=placewidth]').val();
            values.place = {
                name : placeName,
                link : placeLink,
                desc : placeDesc,
                category : categorySelection,
                area: area,
                length: length,
                height : placeHeight,
                width : width
            };
            if(this.placeId) {
                values.place.id = this.placeId;
            }
        }
        if(this.categoryForm) {
           values.category = this.categoryForm.getValues();
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
            onScreenForm.find('input[name=placename]').val(data.place.name);
            onScreenForm.find('input[name=placelink]').val(data.place.link);
            onScreenForm.find('textarea[name=placedesc]').val(data.place.desc);
            onScreenForm.find('select[name=category]').val(data.place.category);
            onScreenForm.find('input[name=area]').val(data.place.area);
            onScreenForm.find('input[name=length]').val(data.place.length);
            onScreenForm.find('input[name=placeHeight]').val(data.place.height);
        }

        
        this.initialValues = data;
    },
    /**
     * @method _bindCategoryChange
     * Binds change listener for category selection.
     * NOTE! THIS IS A WORKAROUND since infobox uses OpenLayers popup which accepts
     * only HTML -> any bindings will be lost
     * @private
     * @param {String} newCategoryId category id for the new category option == when we need to react
     */
    _bindCategoryChange : function() {
        var me = this;
        var onScreenForm = this._getOnScreenForm();
        onScreenForm.find('select[name=category]').live('change', function() {
            var value = jQuery(this).val();
            // fetch new reference from screen because the closure scoped  
            // is not proper reference with our live binding
            var form = me._getOnScreenForm();
            // show category form
            if(value == me.newCategoryId) {
                me.categoryForm = Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.view.CategoryForm', me.instance);
                form.append(me.categoryForm.getForm());
            }
            // remove category form is initialized
            else if(me.categoryForm) {
                me.categoryForm.destroy();
                me.categoryForm = undefined;
            }
        });
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
