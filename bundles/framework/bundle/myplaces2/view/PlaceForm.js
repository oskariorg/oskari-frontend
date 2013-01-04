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
    this.newCategoryId = '-new-';
    this.placeId = undefined;
    this.initialValues = undefined;
    
    var loc = instance.getLocalization('placeform');
    
    this.template = jQuery('<div class="myplacesform">' +
            
            '<div class="field">' + 
                '<label for="category">' + loc.category.label + '</label><br clear="all" />' +
                '<select name="category" autofocus>' +
                '</select>' +
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
                if(this.initialValues) {
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
            var categorySelection = onScreenForm.find('select[name=category]').val();
            values.place = {
                name : placeName,
                link : placeLink,
                desc : placeDesc,
                category : categorySelection
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
                me.categoryForm = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.CategoryForm', me.instance);
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
