/**
 * @class Oskari.mapframework.bundle.myplaces3.view.CategoryForm
 *
 * Shows a form for a myplaces category
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplaces3.view.CategoryForm',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (instance) {
        this.instance = instance;
        this.visualizationForm = Oskari.clazz.create('Oskari.userinterface.component.VisualizationForm');

        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');

        this.template = jQuery(
            '<div class="myplacescategoryform">' +
            '  <div class="field">' +
            '    <label for="categoryname">' + this.loc('categoryform.name.label') + '</label><br clear="all" />' +
            '    <input type="text" data-name="categoryname" placeholder="' + this.loc('categoryform.name.placeholder') + '"/>' +
            '  </div>' +
            '  <div class="field drawing">' +
            '    <div class="rendering"></div>' +
            '  </div>' +
            // Currently visible fields are not saved or used in any way so commenting out the UI for now
            /*            '<div class="field visibleFields">' +
            '<label>' + loc('categoryform.visibleFields.label') + '</label><br clear="all" />' +
            '<input type="checkbox" name="placename" checked="checked" />' + loc('categoryform.visibleFields.placename') + '<br/>' +
            '<input type="checkbox" name="placedesc" checked="checked" />' + loc('categoryform.visibleFields.placedesc') + '<br/>' +
            '<input type="checkbox" name="image" checked="checked" />' + loc('categoryform.visibleFields.image') + '<br/>' +
            '</div>' + */
            '</div>'
        );
        this.templateTableRow = jQuery('<tr></tr>');
        this.templateTableCell = jQuery('<td></td>');
        this.templateTextInput = jQuery('<input type="text"/>');
    }, {
        start: function () {},
        /**
         * @method getForm
         * @return {jQuery} jquery reference for the form
         */
        getForm: function (values) {
            var ui = this.template.clone();
            // populate the rendering fields
            var content = ui.find('div.rendering');
            content.append(this.visualizationForm.getForm());
            if (values) {
                this.setValues(values, ui);
            }
            return ui;
        },

        /**
         * @method getValues
         * Returns form values as an object
         * @return {Object}
         */
        getValues: function () {
            // infobox will make us lose our reference so search
            // from document using the form-class
            var onScreenForm = this._getOnScreenForm();

            if (onScreenForm.length > 0) {
                // found form on screen
                const name = onScreenForm.find('input[data-name=categoryname]').val();
                const style = this.visualizationForm.getOskariStyle();
                if (!name) {
                    return {
                        errors: [{
                            field: 'name',
                            error: this.loc('validation.categoryName')
                        }]
                    };
                } else if (Oskari.util.sanitize(name) !== name) {
                    return {
                        errors: [{
                            field: 'name',
                            error: this.loc('validation.categoryNameIllegal')
                        }]
                    };
                }
                // Get the names of the fields the user has checked.
                const visibleFields = [];
                onScreenForm.find('div.visibleFields').find('input[type=checkbox]:checked').each(function () {
                    visibleFields.push(this.name);
                });
                return { name, style };
            }
            this.log.error('Could not find category form');
        },
        /**
         * @method setValues
         * Sets form values from object.
         * @param {Object} values category values
         */
        setValues: function (data, form) {
            const { name, style, visibleFields } = data;
            // infobox will make us lose our reference so search
            // from document using the form-class
            form = form || this._getOnScreenForm();
            if (form.length > 0) {
                form.find('input[data-name=categoryname]').val(name);
                // found form on screen
                this._checkVisibleFields(form, visibleFields);
            }

            this.visualizationForm.setOskariStyleValues(style);
        },

        /**
         * @method _getOnScreenForm
         * Returns reference to the on screen version shown by OpenLayers
         * @private
         */
        _getOnScreenForm: function () {
            return jQuery('div.myplacescategoryform');
        },

        _checkVisibleFields: function (form, fields = []) {
            form.find('div.visibleFields input[type=checkbox]').each(function (i, elem) {
                elem.prop('checked', false);
                fields.forEach(field => {
                    if (field === elem.attr('name')) {
                        elem.prop('checked', true);
                    }
                });
            });
        },

        /**
         * @method destroy
         */
        destroy: function () {
            // remember to remove live bindings if any
            // jQuery('div.myplacescategoryform input.oskaricolor').off();
            if (this.dialog) {
                this.dialog.close();
            }
            var onScreenForm = this._getOnScreenForm();
            onScreenForm.remove();
        }
    });
