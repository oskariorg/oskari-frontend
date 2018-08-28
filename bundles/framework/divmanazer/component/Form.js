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
        var me = this;
        me._element = document.createElement('form');
        me._element.className = 'oskariform oskari-formcomponent oskari-form';
        me._element.onsubmit = function (event) {
            return me._onSubmit(event);
        };
    }, {

        /**
         * @private @method _destroyImpl
         *
         * @param {Boolean} cleanup
         */
        _destroyImpl: function (cleanup) {
            var components = this.getComponents();
            var i = components.length - 1;

            for (; i >= 0; i--) {
                components.pop().destroy(cleanup);
            }
        },

        /**
         * @public @method getAction
         * Returns the form's action
         *
         * @return {String} Form's action
         */
        getAction: function () {
            return this._element.action;
        },

        /**
         * @public @method setAction
         * Sets the form's action
         *
         * @param {String} action
         */
        setAction: function (action) {
            if (typeof action !== 'string') {
                throw new TypeError(
                    this.getClazz() + '.setAction: action is not a string'
                );
            }
            this._element.action = action;
        },

        /**
         * @public @method isEnabled
         *
         * @return {Boolean} enabled
         */
        isEnabled: function () {
            return !this._element.disabled;
        },

        /**
         * @public @method setEnabled
         *
         * @param {Boolean} enabled
         */
        setEnabled: function (enabled) {
            if (typeof enabled !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setEnabled: enabled is not a boolean'
                );
            }
            this._element.disabled = !enabled;
        },

        /**
         * @public @method getMethod
         * Returns the form's method
         *
         * @return {String} Form method
         */
        getMethod: function () {
            return this._element.method;
        },

        /**
         * @public @method setMethod
         * Sets the form's method (GET or POST)
         *
         * @param {String} method
         */
        setMethod: function (method) {
            if (typeof method !== 'string') {
                throw new TypeError(
                    this.getClazz() + '.setMethod: method is not a string'
                );
            }
            var mtd = method.toUpperCase();
            if (mtd !== 'GET' && mtd !== 'POST') {
                throw new TypeError(
                    this.getClazz() + '.setMethod: unknown method: ' + mtd
                );
            }
            this._element.method = mtd;
        },

        /**
         * @deprecated @public @method addField
         *
         * @param {Object} field
         */
        addField: function (field) {
            Oskari.log('FormComponent').warn(this.getClazz() +
                '.addField is deprecated, please use addComponent instead.');
            this.addComponent(field);
        },

        /**
         * @deprecated @public  @method getForm
         * Returns reference to the form DOM
         *
         * @return {jQuery} form element
         */
        getForm: function (elementSelector) {
            Oskari.log('FormComponent').warn(this.getClazz() +
                '.getForm is deprecated, please use getElement instead.');
            return jQuery(this.getElement());
        },

        /**
         * @public @method getHandler
         *
         * @return {Function} handler
         */
        getHandler: function () {
            return this._handler;
        },

        /**
         * @public @method setHandler
         *
         * @param {Function} handler Function(form, event)
         */
        setHandler: function (handler) {
            this._handler = handler;
        },

        /**
         * @method validate
         *
         * @return {Array} errors
         */
        validate: function () {
            var errors = [];

            this.getComponents().forEach(function (component) {
                if (typeof component.validate === 'function') {
                    errors = errors.concat(component.validate());
                }
            });
            return errors;
        },

        /**
         * @deprecated @public @method showErrors
         */
        showErrors: function () {
            Oskari.log('FormComponent').warn(
                this.getClazz() + '.showErrors is deprecated.');

            this.getComponents().forEach(function (component) {
                if (typeof component.validate === 'function') {
                    var errors = component.validate();
                    if (component.showErrors) {
                        component.showErrors(errors);
                    }
                }
            });
        },

        /**
         * @deprecated @public @method showErrors
         */
        clearErrors: function () {
            Oskari.log('FormComponent').warn(
                this.getClazz() + '.clearErrors is deprecated.'
            );
            this.getComponents().forEach(function (component) {
                if (component.clearErrors) {
                    component.clearErrors();
                }
            });
        },

        /**
         * @public @method submit
         * Submits the form
         */
        submit: function () {
            var token = Oskari.app.getXSRFToken();
            if (token) {
                // add csrf prevention token to form
                var xsrfTokenField = document.createElement('input');
                xsrfTokenField.name = '_csrf';
                xsrfTokenField.value = token;
                xsrfTokenField.type = 'hidden';
                this.getElement().appendChild(xsrfTokenField);
            }

            this.getElement().submit();
        },

        /**
         * @private @method _onSubmit
         * Called before the form is submitted
         *
         * @param {Object} event
         * @return {Boolean} True
         */
        _onSubmit: function (event) {
            if (this.getHandler()) {
                this.getHandler()(this, event);
            }
            return true;
        }
    }, {
        extend: ['Oskari.userinterface.component.Container']
    }
);
