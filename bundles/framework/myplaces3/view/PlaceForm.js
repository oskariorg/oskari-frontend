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
    function (instance, options) {
        this.instance = instance;
        this.options = options;
        this.newCategoryId = '-new-';
        this.place = undefined;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.measurementResult = null;


        this.template = jQuery('<div class="myplacesform form-v2"></div>');

        this.templateOption = jQuery('<option></option>');
        this.categoryForm = undefined;

        this.dialog = undefined;
        this.dialogForm = undefined;
        this.categories = [];

        this.defaultRules = [
            {
                required: false,
                message: 'Empty field'
            }
        ];

        this.testRules = [
            {
                required: true,
                message: 'Please fill in this area'
            },
            () => ({
                validator: (_, value) => value ? Promise.resolve(value).then(value => console.log('Validated:', value)) : Promise.reject('Must validate')
            })
        ];

        this.defaultProps = {
            formSettings: {
                label: 'Form settings label',
                showLabels: true,
                onFinish: (values) => {
                    console.log(values);
                    this._setNewValues(values);
                    this.dialog.close();
                },
                onFinishFailed: () => {
                    console.log('onFinishFailed');
                }
            }
        };
    }, {
        /**
         * @method getForm
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory[]} categories array containing available categories
         * @return {jQuery} jquery reference for the form
         */
        getForm: function (categories, place) {
            const ui = this.template.clone();
            const isPublished = (this.options ? this.options.published : false);
            // TODO: if a place is given for editing -> populate fields here
            // populate category options (only if not in a published map)
            if (categories && !isPublished) {
                const selection = ui.find('select[data-name=category]');
                const selectedCategoryId = place ? place.getCategoryId() : categories.find(c => c.isDefault === true).categoryId;
                categories.forEach(({ categoryId, name }) => {
                    const option = this.templateOption.clone();
                    option.text(name);
                    option.attr('value', categoryId);
                    if (categoryId === selectedCategoryId) {
                        option.attr('selected', 'selected');
                    }
                    selection.append(option);
                });
                selection.val(selectedCategoryId);
            }
            if (isPublished) {
                // remove the layer selections if in a publised map
                ui.find('div#newLayerForm').remove();
            }

            // Hide the image preview at first
            this._updateImageUrl('', ui);

            if (place) {
                this.setValues(place, ui);
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
            /*
            TODO: Should we validate attention_text. Localization is missing!
            if (Oskari.util.sanitize(att) !== att) {
                errors.push({
                    name: 'att',
                    error: this.loc('validation.attIllegal')
                });
            }
            */
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
            var values = { place };
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
        setMeasurementResult: function (measurement, drawMode) {
            if (drawMode === 'point' || typeof measurement !== 'number') {
                this.measurementResult = null;
                return;
            }
            var measurementWithUnit = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(measurement, drawMode);
            const measurementResult = this.loc('placeform.measurement.' + drawMode) + ' ' + measurementWithUnit;
            this._getOnScreenForm().find('div.measurementResult').html(measurementResult);
            this.measurementResult = measurementResult;
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
         * Removes eventlisteners
         */
        destroy: function () {
            // unbind on bindings
            var onScreenForm = this._getOnScreenForm();
            onScreenForm.find('select[data-name=category]').off();
            onScreenForm.find('input[data-name=imagelink]').off();
            onScreenForm.find('a.newLayerLink').off();
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
            return jQuery('div.myplacesform').filter(':visible');
        },
        createEditDialog: function (categories) {
            this.populateForm();
            this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog.makeDraggable();

            // add new dialog to ui
            this.dialog.show(this.loc('placeform.title'), '<div class="places-edit-dialog"></div>');

            [this.container] = jQuery('.places-edit-dialog');

            this.placeForm = (<GenericForm { ...this.defaultProps } />);

            this.populateForm();
            this.renderForm();

            this.dialog.moveTo('div.personaldata ul li select', 'right');
        },
        populateForm: function () {
            const {
                name,
                description,
                imageLink,
                link,
                attentionText
            } = this.place.properties;

            this.defaultProps.fields = [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Name for place',
                    placeholder: this.loc('placeform.placename.placeholder'),
                    rules: this.testRules,
                    value: name
                },
                {
                    name: 'placedesc',
                    type: 'textarea',
                    label: 'Place description',
                    placeholder: this.loc('placeform.placedesc.placeholder'),
                    rules: this.defaultRules,
                    value: description
                },
                {
                    name: 'placeAttention',
                    type: 'text',
                    label: 'Text visible on map',
                    placeholder: this.loc('placeform.placeAttention.placeholder'),
                    rules: this.defaultRules,
                    value: attentionText
                },
                {
                    name: 'link',
                    type: 'text',
                    label: 'Link to additional information',
                    placeholder: this.loc('placeform.placelink.placeholder'),
                    rules: this.defaultRules,
                    value: link
                },
                {
                    name: 'imageLink',
                    type: 'text',
                    label: this.loc('placeform.imagelink.placeholder'),
                    placeholder: this.loc('placeform.imagelink.placeholder'),
                    rules: this.defaultRules,
                    value: imageLink
                },
                {
                    name: 'category',
                    type: 'dropdown',
                    label: this.loc('placeform.category.choose'),
                    placeholder: this.loc('placeform.category.choose'),
                    value: this.categories.map(category => {
                        return {
                            name: category.name,
                            categoryId: category.categoryId,
                            isDefault: (this.place.getCategoryId() === category.categoryId)
                        };
                    }),
                    rules: this.defaultRules
                },
                {
                    name: 'formcontrols',
                    type: 'buttongroup',
                    buttons: [
                        {
                            name: 'cancel',
                            type: 'button',
                            label: '',
                            placeholder: 'Cancel',
                            value: this.loc('buttons.cancel'),
                            style: 'secondary',
                            buttonType: 'button',
                            onClick: (event) => {
                                this.dialog.close();
                            }
                        },
                        {
                            name: 'submit',
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

            this._savePlace(place);
        },
        /**
         * @method _savePlace
         * Handles save place after possible category save
         * @private
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} place
         */
        _savePlace: function (place) {
            const drawing = this.drawing;
            const isMovePlace = false;
            if (drawing) {
                place.setDrawToolsMultiGeometry(drawing);
            }
            var serviceCallback = (blnSuccess, categoryId, oldCategoryId) => {
                if (blnSuccess) {
                    const handler = this.instance.getCategoryHandler();
                    handler.refreshLayerIfSelected(categoryId);
                    handler.addLayerToMap(categoryId);
                    // refresh old layer as well if category changed
                    if (oldCategoryId) {
                        handler.refreshLayerIfSelected(oldCategoryId);
                    }
                    //this.cleanupPopup();

                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(this.loc('notification.placeAdded.title'), this.loc('notification.placeAdded.message'));
                    dialog.fadeout();
                    // remove drawing handled in ButtonHandler InfoBox.InfoBoxEvent listener
                } else {
                    this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.savePlace'));
                }
            };
            this.instance.getService().saveMyPlace(place, serviceCallback, isMovePlace);
        },
        renderForm: function () {
            ReactDOM.render(this.placeForm, this.container);
        }
    });
