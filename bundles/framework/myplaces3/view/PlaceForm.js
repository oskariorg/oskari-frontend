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
        this.latestCategoryId = undefined;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');

        this.template = jQuery(
            '<div class="myplacesform">' +
            '  <div class="field">' +
            '    <div class="help icon-info" title="' + this.loc('placeform.tooltip') + '"></div>' +
            '    <input type="text" data-name="placename" placeholder="' + this.loc('placeform.placename.placeholder') + '" />' +
            '  </div>' +
            '  <div class="field">' +
            '    <input type="text" data-name="placedesc" placeholder="' + this.loc('placeform.placedesc.placeholder') + '" />' +
            '  </div>' +
            '  <div class="field">' +
            '    <input type="text" data-name="placeAttention" placeholder="' + this.loc('placeform.placeAttention.placeholder') + '"/>' +
            '  </div>' +
            '  <div class="field measurementResult"></div>' +
            '  <div class="field">' +
            '    <input type="text" data-name="placelink" placeholder="' + this.loc('placeform.placelink.placeholder') + '"/>' +
            '  </div>' +
            '  <div class="field">' +
            '    <input type="text" data-name="imagelink" placeholder="' + this.loc('placeform.imagelink.placeholder') + '"/>' +
            '  </div>' +
            '  <div class="field imagePreview">' +
            '    <label>' + this.loc('placeform.imagelink.previewLabel') + '</label><br clear="all" />' +
            '    <a class="myplaces_imglink" target="_blank"><img src=""></img></a>' +
            '  </div>' +
            '  <div class="field" id="newLayerForm">' +
            '    <label for="category">' +
            '      <span>' + this.loc('placeform.category.choose') + '</span>' +
            '    </label>' +
            '    <br clear="all" />' +
            '    <select data-name="category"></select>' +
            '  </div>' +
            '</div>'
        );
        this.templateOption = jQuery('<option></option>');
        this.categoryForm = undefined;
    }, {
        /**
         * @method getForm
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory[]} categories array containing available categories
         * @return {jQuery} jquery reference for the form
         */
        getForm: function (categories, place) {
            var ui = this.template.clone(),
                isPublished = (this.options ? this.options.published : false);
            // TODO: if a place is given for editing -> populate fields here
            // populate category options (only if not in a published map)
            if (categories && !isPublished) {
                const selection = ui.find('select[data-name=category]');
                categories.forEach(({ layerId, name }) => {
                    const option = this.templateOption.clone();
                    option.text(name);
                    option.attr('value', layerId);
                    selection.append(option);
                });
                const selectedCategoryId = place ? place.getCategoryId() : this.latestCategoryId || categories.find(c => c.isDefault === true).layerId;
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
            }

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
            const att = form.find('input[data-name=placedesc]').val();
            const desc = form.find('input[data-name=placeAttention]').val();
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
            if (Oskari.util.sanitize(att) !== att) {
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
                placeLink = placeLink.replace('<', '');
                placeLink = placeLink.replace('>', '');
            }
            place.setLink(placeLink);
            place.setimageLink(form.find('input[data-name=imagelink]').val());
            const categoryId = forcedCategory || parseInt(form.find('select[data-name=category]').val());
            // TODO: what categoryId comes for new category
            if (categoryId) {
                place.setCategoryId(categoryId);
                // TODO values.isMovePlace ?? or oldCategory to update added layers
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
        /**
         * @method setValues
         * Sets form values from object.
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} place
         */
        setValues: function (place, form) {
            this.place = place;
            // infobox will make us lose our reference so search
            // from document using the form-class
            var onScreenForm = form || this._getOnScreenForm();

            if (onScreenForm.length > 0) {
                // found form on screen
                onScreenForm.find('input[data-name=placename]').val(place.getName());
                onScreenForm.find('input[data-name=placedesc]').val(place.getDescription());
                onScreenForm.find('input[data-name=placeAttention]').val(place.getAttentionText());
                onScreenForm.find('input[data-name=placelink]').val(place.getLink());
                onScreenForm.find('input[data-name=imagelink]').val(place.getImageLink());
                onScreenForm.find('select[data-name=category]').val(place.getCategoryId());
                this._updateImageUrl(place.getImageLink(), onScreenForm);
                const measurementDiv = onScreenForm.find('div.measurementResult');
                const measurement = place.getMeasurement();
                if (measurement) {
                    measurementDiv.html(this.loc('placeform.measurement.' + 'line') + ' ' + measurement); // TODO mistä drawmode
                } else {
                    measurementDiv.remove();
                }
            }
        },
        setMeasurementResult: function (measurement, drawMode) {
            if (drawMode === 'point' || typeof measurement !== 'number') {
                return;
            }
            var measurementWithUnit = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(measurement, drawMode);
            const measurementResult = this.loc('placeform.measurement.' + drawMode) + ' ' + measurementWithUnit;
            this._getOnScreenForm().find('div.measurementResult').html(measurementResult);
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

        createCategoryForm: function () {
            var onScreenForm = this._getOnScreenForm();
            this.categoryForm = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.view.CategoryForm', this.instance);
            onScreenForm.find('div#newLayerForm').html(this.categoryForm.getForm());
            this.categoryForm.start();
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
        }
    });
