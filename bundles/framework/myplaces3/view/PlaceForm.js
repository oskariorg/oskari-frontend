import React from 'react';
import ReactDOM from 'react-dom';
import { GenericForm } from 'oskari-ui';

/**
 * @class Oskari.mapframework.bundle.myplaces3.view.PlaceForm
 *
 * Shows a form for my place
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.view.PlaceForm',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (options, categories, saveCallback, cancelCallback) {
        this.options = options;
        this.categories = categories;
        this.saveCallback = saveCallback;
        this.cancelCallback = cancelCallback;

        this.initialCategory = typeof this.categories !== 'undefined' ? this.categories.find(category => category.isDefault) : null;
        this.container = null;
        this.newCategoryId = '-new-';
        this.place = undefined;
        this.drawing = undefined;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.measurementResult = null;
        this.template = jQuery('<div class="myplacesform form-v2"></div>');

        this.templateOption = jQuery('<option></option>');
        this.categoryForm = undefined;

        this.dialog = undefined;
        this.dialogForm = undefined;

        // Default generic rules
        this.defaultRules = [
            {
                required: false,
                message: 'Empty field'
            }
        ];

        this.PLACE_NAME_MAX_LENGTH = 256;

        // Rules for description field
        this.nameRules = [
            {
                required: true,
                message: this.loc('validation.placeName')
            },
            () => ({
                validator: (_, value) => {
                    if (Oskari.util.sanitize(value) !== value) {
                        return Promise.reject(new Error(this.loc('validation.placeNameIllegal')));
                    }

                    return Promise.resolve(value);
                }
            })
        ];

        // Default form settings
        this.formProps = {
            formSettings: {
                showLabels: true,
                disabledButtons: false,
                onFinish: (values) => {
                    this._setNewValues(values);
                    this._disableFormSubmit();
                    this.dialog.close();
                },
                onFinishFailed: () => {
                    this.cancelCallback();
                }
            }
        };
    }, {
        /**
         * @method showForm
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory[]} categories array containing available categories
         * @return {jQuery} jquery reference for the form
         */
        showForm: function (categories, place) {
            const ui = this.template.clone();
            const isPublished = (this.options ? this.options.published : false);
            // TODO: if a place is given for editing -> populate fields here
            // populate category options (only if not in a published map)
            if (categories && !isPublished) {
                const selection = ui.find('select[data-name=category]');
                const defaultCategory = categories.find(c => c.isDefault === true);
                let selectedCategoryId;
                if (place) {
                    selectedCategoryId = place.getCategoryId();
                } else if (defaultCategory) {
                    selectedCategoryId = defaultCategory.categoryId;
                }
                categories.forEach(({ categoryId, name }) => {
                    const option = this.templateOption.clone();
                    option.text(name);
                    option.attr('value', categoryId);
                    if (categoryId === selectedCategoryId) {
                        option.attr('selected', 'selected');
                    }
                    selection.append(option);
                });
                if (selectedCategoryId) {
                    selection.val(selectedCategoryId);
                }
            }
            if (isPublished) {
                // remove the layer selections if in a publised map
                ui.find('div#newLayerForm').remove();
            }

            // Hide the image preview at first
            this._updateImageUrl('', ui);

            if (place) {
                this.place = place;
            } else {
                this.place = null;
                if (this.measurementResult) {
                    ui.find('div.measurementResult').html(this.measurementResult);
                }
            }

            this.categories = categories;
            this.createEditDialog(categories);

            return ui;
        },
        /**
         * @method getPlace
         * Returns MyPlace and category values
         * @return {Object}
         */
        getValues: function () {
            // infobox will make us lose our reference so search
            // from document using the form-class
            const form = this._getOnScreenForm();
            if (form.length === 0) {
                return;
            }
            var forcedCategory = (this.options ? this.options.category : undefined);
            const place = this.place || Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
            const errors = [];
            const name = form.find('input[data-name=placename]').val();
            const desc = form.find('input[data-name=placedesc]').val();
            const att = form.find('input[data-name=placeAttention]').val();
            // Validate values
            if (!name) {
                errors.push({
                    name: 'name',
                    error: this.loc('validation.placeName')
                });
            } else if (Oskari.util.sanitize(name) !== name) {
                errors.push({
                    name: 'name',
                    error: this.loc('validation.placeNameIllegal')
                });
            }
            if (Oskari.util.sanitize(desc) !== desc) {
                errors.push({
                    name: 'desc',
                    error: this.loc('validation.descIllegal')
                });
            }

            if (errors.length > 0) {
                return { errors };
            }
            place.setName(name);
            place.setDescription(desc);
            place.setAttentionText(att);
            let placeLink = form.find('input[data-name=placelink]').val();
            if (placeLink) {
                if (placeLink.indexOf('://') === -1 || placeLink.indexOf('://') > 6) {
                    placeLink = 'http://' + placeLink;
                }
            }
            place.setLink(placeLink);
            place.setImageLink(form.find('input[data-name=imagelink]').val());
            const categoryId = forcedCategory || parseInt(form.find('select[data-name=category]').val());
            if (categoryId) {
                place.setCategoryId(categoryId);
            }
            const values = { place };
            if (this.categoryForm && !forcedCategory) {
                // add the values for a new category if present
                // and not in a publised map
                const category = this.categoryForm.getValues();
                if (category.errors) {
                    return { errors: category.errors };
                }
                values.category = category;
            }
            return values;
        },
        /**
         * @method setValues
         * Sets form values from object.
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} place
         */
        setValues: function (place) {
            this.place = place;
        },
        setMeasurementResult: function (measurementResult) {
            this.measurementResult = measurementResult || null;
        },
        bindEvents: function () {
            var me = this;
            var isPublished = (this.options ? this.options.published : false);
            if (!isPublished) {
                me._bindCategoryChange();
            }

            me._bindImageUrlChange();
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
            onScreenForm.find('select[data-name=category]').on('change', function () {
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
            onScreenForm.find('input[data-name=imagelink]').on('change keyup', function () {
                me._updateImageUrl(jQuery(this).val(), me._getOnScreenForm());
            });
        },
        _updateImageUrl: function (src, form) {
            if (form === null || form === undefined) {
                return;
            }
            var source = src || '';
            var preview = form.find('div.imagePreview');

            preview
                .find('a.myplaces_imglink').attr('href', source)
                .find('img').attr('src', source);

            if (src) {
                preview.show();
            } else {
                preview.hide();
            }
        },
        /**
         * @method destroy
         * Remove dialog and form
         */
        destroy: function () {
            this.dialog.close();
        },
        /**
         * @method _getOnScreenForm
         * Returns reference to the on screen version shown by OpenLayers
         * @private
         */
        _getOnScreenForm: function () {
            // unbind live so
            return jQuery('div.myplacesform').filter(':visible');
        },
        /**
         * @method _initializePlace
         * Initializes place to ensure that we don't have null pointers
         * @private
         */
        _initializePlace: function () {
            if (!this.place) {
                this.place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
                this.place.setCategoryId(this.initialCategory.categoryId);
            }
        },
        createEditDialog: function () {
            this._initializePlace(); // initialize place so we have empty place to fill on
            this._populateForm(); // populate form with data from place

            this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'); // Create popup dialog
            this.dialog.makeDraggable();
            this.dialog.addClass('places-edit-dialog');

            // add new dialog to ui
            this.container = this.dialog.renderReactContainer(this.loc('placeform.title'));
            this._renderForm();

            this.dialog.moveTo('#toolbar', 'right');
        },
        /**
         * @method _populateForm
         * Populate form with empty values or data got from place -object
         * @private
         */
        _populateForm: function () {
            const {
                name,
                description,
                imageLink,
                link,
                attentionText
            } = this.place.properties;

            const currentCategory = this.categories.find(category => category.categoryId === this.place.categoryId) || this.initialCategory;

            this.formProps.fields = [
                {
                    name: 'name',
                    type: 'text',
                    label: '',
                    placeholder: this.loc('placeform.placename.placeholder'),
                    rules: this.nameRules,
                    value: name !== '' ? name : '',
                    maxLength: this.PLACE_NAME_MAX_LENGTH,
                    tooltip: this.loc('placeform.placename.placeholder')
                },
                {
                    name: 'placedesc',
                    type: 'textarea',
                    label: '',
                    placeholder: this.loc('placeform.placedesc.placeholder'),
                    value: description !== '' ? description : '',
                    tooltip: this.loc('placeform.placedesc.placeholder')
                },
                {
                    name: 'placeAttention',
                    type: 'text',
                    label: '',
                    placeholder: this.loc('placeform.placeAttention.placeholder'),
                    rules: this.defaultRules,
                    value: attentionText !== '' ? attentionText : '',
                    tooltip: this.loc('placeform.placeAttention.placeholder')
                },
                {
                    name: 'link',
                    type: 'text',
                    label: '',
                    placeholder: this.loc('placeform.placelink.placeholder'),
                    rules: this.defaultRules,
                    value: link !== '' ? link : '',
                    tooltip: this.loc('placeform.placelink.placeholder')
                },
                {
                    name: 'imageLink',
                    type: 'text',
                    label: '',
                    placeholder: this.loc('placeform.imagelink.placeholder'),
                    rules: this.defaultRules,
                    value: imageLink !== '' ? imageLink : '',
                    tooltip: this.loc('placeform.imagelink.placeholder')
                },
                {
                    name: 'category',
                    type: 'dropdown',
                    label: this.loc('placeform.category.choose'),
                    placeholder: '',
                    value: this.categories.map(category => {
                        return {
                            name: category.name,
                            value: category.categoryId,
                            isDefault: category.categoryId === currentCategory.categoryId
                        };
                    }),
                    rules: this.defaultRules
                },
                {
                    name: 'categoryinfo',
                    type: 'info',
                    label: '',
                    placeholder: '',
                    value: this.loc('placeform.category.creatingNew')
                },
                {
                    name: 'formcontrols',
                    type: 'buttongroup',
                    buttons: [
                        {
                            name: 'cancel',
                            optionalClass: 't_btn_cancel',
                            type: 'button',
                            label: '',
                            placeholder: 'Cancel',
                            value: this.loc('buttons.cancel'),
                            style: 'secondary',
                            buttonType: 'button',
                            onClick: (event) => {
                                this.dialog.close();
                                this.cancelCallback();
                            }
                        },
                        {
                            name: 'submit',
                            optionalClass: 't_btn_save',
                            type: 'button',
                            label: '',
                            placeholder: 'Save',
                            value: this.loc('buttons.save'),
                            style: 'primary',
                            buttonType: 'submit'
                        }
                    ]
                }
            ];
        },
        /**
         * @method _setNewValues
         * Sets new place values
         * @private
         * @param {Object} values - form values as object
         */
        _setNewValues: function (values) {
            const place = this.place || Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
            place.setName(values.name);
            place.setAttentionText(values.placeAttention);
            place.setDescription(values.placedesc);
            place.setLink(values.link);
            place.setImageLink(values.imageLink);
            place.setCategoryId(values.category);

            this.saveCallback(place);
        },
        /**
         * @method setDrawing
         * Sets new drawing for current place
         * @param {GeoJSON} drawing - current drawing
         */
        setDrawing: function (drawing) {
            if (drawing) {
                this.drawing = drawing;
            }
        },
        /**
         * @method _disableFormSubmit
         * disables submitting form for multiple times
         * @private
         */
        _disableFormSubmit: function () {
            this.formProps.formSettings.disabledButtons = true;
            this._renderForm();
        },
        /**
         * @method _renderForm
         * - renders form to popup
         * @param {jQuery} container - jQuery reference to container where form is rendered
         *
         * @private
         */
        _renderForm: function () {
            ReactDOM.render((<GenericForm { ...this.formProps } />), this.container);
        }
    });
