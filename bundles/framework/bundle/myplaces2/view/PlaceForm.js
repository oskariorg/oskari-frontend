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

    function (instance) {
        this.instance = instance;
        this.newCategoryId = '-new-';
        this.placeId = undefined;
        this.initialValues = undefined;

        var loc = instance.getLocalization('placeform');

        this.template = jQuery('<div class="myplacesform">' +
            '<div class="field">' +
            '<div class="help icon-info" ' +
            'title="' + loc.tooltip + '"></div>' +
            '<input type="text" name="placename" placeholder="' + loc.placename.placeholder + '"/>' +
            '</div>' +
            '<div class="field">' +
            '<textarea name="placedesc" placeholder="' + loc.placedesc.placeholder + '">' +
            '</textarea>' +
            '</div>' +
            '<div class="field">' +
            '<input type="text" name="placeAttention" placeholder="' + loc.placeAttention.placeholder + '"/>' +
            '</div>' +
            '<div class="field measurementResult">' +
            '</div>' +
            '<div class="field">' +
            '<input type="text" name="placelink" placeholder="' + loc.placelink.placeholder + '"/>' +
            '</div>' +
            '<div class="field">' +
            '<input type="text" name="imagelink" placeholder="' + loc.imagelink.placeholder + '"/>' +
            '</div>' +
            '<div class="field imagePreview">' +
            '<label>' + loc.imagelink.previewLabel + '</label><br clear="all" />' +
            '<a class="myplaces_imglink" target="_blank"><img src=""></img></a>' +
            '</div>' +
            '<div class="field" id="newLayerForm">' +
            '<label for="category">' + '<a href="#" class="newLayerLink">' + loc.category.newLayer + '</a>' + loc.category.choose + '</label><br clear="all" />' +
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
        getForm: function (categories) {
            var ui = this.template.clone(),
                loc = this.instance.getLocalization('placeform');
            // TODO: if a place is given for editing -> populate fields here
            // populate category options
            if (categories) {
                var selection = ui.find('select[name=category]'),
                    option,
                    i,
                    cat;
                //option.append(loc.category['new']);
                //option.attr('value', this.newCategoryId);
                //selection.append(option);
                for (i = 0; i < categories.length; ++i) {
                    cat = categories[i];
                    option = this.templateOption.clone();
                    option.append(cat.getName());
                    option.attr('value', cat.getId());
                    // find another way if we want to keep selection between places
                    if (this.initialValues) {
                        if (this.initialValues.place.category === cat.getId()) {
                            option.attr('selected', 'selected');
                        }
                    } else if (cat.isDefault()) {
                        option.attr('selected', 'selected');
                    }
                    selection.append(option);
                }
                this._bindCategoryChange();
            }

            this._bindImageUrlChange();
            this._bindCreateNewLayer();

            if (this.initialValues) {
                ui.find('input[name=placename]').attr('value', this.initialValues.place.name);
                ui.find('textarea[name=placedesc]').append(this.initialValues.place.desc);
                ui.find('input[name=placeAttention]').attr('value', this.initialValues.place.attention_text);
                ui.find('input[name=placelink]').attr('value', this.initialValues.place.link);
                ui.find('input[name=imagelink]').attr('value', this.initialValues.place.imageLink);
                this._updateImageUrl(this.initialValues.place.imageLink, ui);
            }

            var measurementDiv = ui.find('div.measurementResult');
            if (this.measurementResult) {
                measurementDiv.html(this.measurementResult);
            } else {
                measurementDiv.remove();
            }

            return ui;
        },
        /**
         * @method getValues
         * Returns form values as an object
         * @return {Object}
         */
        getValues: function () {
            var values = {};
            // infobox will make us lose our reference so search 
            // from document using the form-class
            var onScreenForm = this._getOnScreenForm();

            if (onScreenForm.length > 0) {
                // found form on screen
                var placeName = onScreenForm.find('input[name=placename]').val(),
                    placeDesc = onScreenForm.find('textarea[name=placedesc]').val(),
                    placeAttention = onScreenForm.find('input[name=placeAttention]').val(),
                    placeLink = onScreenForm.find('input[name=placelink]').val();
                if (placeLink) {
                    if (placeLink.indexOf('://') === -1 || placeLink.indexOf('://') > 6) {
                        placeLink = 'http://' + placeLink;
                    }
                    placeLink = placeLink.replace("<", '');
                    placeLink = placeLink.replace(">", '');
                }
                var imageLink = onScreenForm.find('input[name=imagelink]').val(),
                    categorySelection = onScreenForm.find('select[name=category]').val();
                values.place = {
                    name: placeName,
                    desc: placeDesc,
                    attention_text: placeAttention,
                    link: placeLink,
                    imageLink: imageLink,
                    category: categorySelection
                };
                if (this.placeId) {
                    values.place.id = this.placeId;
                }
            }
            if (this.categoryForm) {
                values.category = this.categoryForm.getValues();
            }
            return values;
        },
        /**
         * @method setValues
         * Sets form values from object.
         * @param {Object} data place data as formatted in #getValues()
         */
        setValues: function (data) {
            this.placeId = data.place.id;
            // infobox will make us lose our reference so search 
            // from document using the form-class
            var onScreenForm = this._getOnScreenForm();

            if (onScreenForm.length > 0) {
                // found form on screen
                onScreenForm.find('input[name=placename]').val(data.place.name);
                onScreenForm.find('textarea[name=placedesc]').val(data.place.desc);
                onScreenForm.find('input[name=placeAttention]').val(data.place.attention_text);
                onScreenForm.find('input[name=placelink]').val(data.place.link);
                onScreenForm.find('input[name=imagelink]').val(data.place.imageLink);
                onScreenForm.find('select[name=category]').val(data.place.category);
                this._updateImageUrl(data.place.imageLink, onScreenForm);

            }

            this.initialValues = data;
        },
        setMeasurementResult: function (geometry, drawMode) {
            var loc = this.instance.getLocalization('placeform'),
                measurementWithUnit = this.instance.getDrawPlugin().getMapModule().formatMeasurementResult(geometry, drawMode);

            this.measurementResult = loc.measurement[drawMode] + measurementWithUnit;

            this._getOnScreenForm().
            find('div.measurementResult').
            html(this.measurementResult);
        },
        /**
         * @method _bindCategoryChange
         * Binds change listener for category selection.
         * NOTE! THIS IS A WORKAROUND since infobox uses OpenLayers popup which accepts
         * only HTML -> any bindings will be lost
         * @private
         * @param {String} newCategoryId category id for the new category option == when we need to react
         */
        _bindCategoryChange: function () {
            var me = this,
                onScreenForm = this._getOnScreenForm();
            onScreenForm.find('select[name=category]').live('change', function () {
                // remove category form is initialized
                if (me.categoryForm) {
                    me.categoryForm.destroy();
                    me.categoryForm = undefined;
                }
            });
        },

        /**
         * Changes the src attribute of the preview image when the user changes the
         * value of the image link field.
         *
         * @method _bindImageUrlChange
         * @private
         */
        _bindImageUrlChange: function () {
            var me = this,
                onScreenForm = me._getOnScreenForm();
            onScreenForm.find('input[name=imagelink]').live('change keyup', function () {
                me._updateImageUrl(jQuery(this).val(), me._getOnScreenForm());
            });
        },

        _updateImageUrl: function (src, form) {
            var img = form.find('div.imagePreview').find('img');
            img.attr('src', src);
            form.find('a.myplaces_imglink').attr({
                'href': src
            });
        },

        /**
         * Binds the link for creating a new category.
         *
         * @method _bindCreateNewLayer
         * @private
         */
        _bindCreateNewLayer: function () {
            var me = this,
                onScreenForm = me._getOnScreenForm();
            onScreenForm.find('a.newLayerLink').live('click', function (evt) {
                var form = me._getOnScreenForm();
                evt.preventDefault();
                me.categoryForm = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.CategoryForm', me.instance);
                form.find('div#newLayerForm').html(me.categoryForm.getForm());
                //add listeners etc.
                me.categoryForm.start();
            });
        },

        /**
         * @method destroy
         * Removes eventlisteners
         */
        destroy: function () {
            // unbind live bindings
            var onScreenForm = this._getOnScreenForm();
            onScreenForm.find('select[name=category]').die();
            onScreenForm.find('input[name=imagelink]').die();
            onScreenForm.find('a.newLayerLink').die();
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
        _getOnScreenForm: function () {
            // unbind live so 
            return jQuery('div.myplacesform');
        }
    });
