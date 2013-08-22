/**
 * @class Oskari.userinterface.component.Form
 * Generic form component
 */
Oskari.clazz.define('Oskari.userinterface.component.Form',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        "use strict";
        this.template = jQuery('<div class="oskariform"></div>');
        this._form = this.template.clone();
        this.fields = [];
    }, {
        addField: function (field) {
            "use strict";
            this.fields.push(field);
        },
        /**
         * @method getForm
         * Returns reference to the form DOM
         * @return {jQuery
         */
        getForm: function (elementSelector) {
            "use strict";
            var i;
            this._form = this.template.clone();
            for (i = 0; i < this.fields.length; i += 1) {
                this._form.append(this.fields[i].getField());
            }
            return this._form;
        },
        /**
         * @method getForm
         * Returns reference to the form DOM
         * @return {jQuery
         */
        validate: function (elementSelector) {
            "use strict";
            var errors = [],
                i;
            for (i = 0; i < this.fields.length; i += 1) {
                errors = errors.concat(this.fields[i].validate());
            }
            return errors;
        },
        showErrors: function () {
            "use strict";
            var i,
                errors;
            // TODO : maybe not validate again
            for (i = 0; i < this.fields.length; i += 1) {
                errors = this.fields[i].validate();
                this.fields[i].showErrors(errors);
            }
        },
        clearErrors: function () {
            "use strict";
            var i;
            for (i = 0; i < this.fields.length; i += 1) {
                this.fields[i].clearErrors();
            }
        }
    });