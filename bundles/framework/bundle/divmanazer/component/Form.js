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
        'use strict';
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
         *
         */
        _destroyImpl: function (cleanup) {
            'use strict';
            var i,
                components = this.getComponents();

            for (i = components.length - 1; i >= 0; i -= 1) {
                components.pop().destroy(cleanup);
            }
        },

        /**
         * @public @method getAction
         * Returns the form's action
         *
         *
         * @return {String} Form's action
         */
        getAction: function () {
            'use strict';
            return this._element.action;
        },

        /**
         * @public @method setAction
         * Sets the form's action
         *
         * @param {String} action
         *
         */
        setAction: function (action) {
            'use strict';
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
         *
         * @return {Boolean} enabled 
         */
        isEnabled: function () {
            'use strict';
            return !this._element.disabled;
        },

        /**
         * @public @method setEnabled
         *
         * @param {Boolean} enabled
         *
         */
        setEnabled: function (enabled) {
            'use strict';
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
         *
         * @return {String} Form method
         */
        getMethod: function () {
            'use strict';
            return this._element.method;
        },

        /**
         * @public @method setMethod
         * Sets the form's method (GET or POST)
         *
         * @param {String} method
         *
         */
        setMethod: function (method) {
            'use strict';
            var mtd;
            if (typeof method !== 'string') {
                throw new TypeError(
                    this.getClazz() + '.setMethod: method is not a string'
                );
            }
            mtd = method.toUpperCase();
            if (method !== 'GET' && method !== 'POST') {
                throw new TypeError(
                    this.getClazz() + '.setMethod: unknown method: ' + method
                );
            }
            this._element.method = mtd;
        },

        /**
         * @deprecated @public @method addField
         *
         * @param {Object} field
         *
         */
        addField: function (field) {
            'use strict';
            Oskari.getSandbox().printWarn(this.getClazz() +
                '.addField is deprecated, please use addComponent instead.');
            this.addComponent(field);
        },

        /**
         * @deprecated @public  @method getForm
         * Returns reference to the form DOM
         *
         *
         * @return {jQuery} form element
         */
        getForm: function (elementSelector) {
            'use strict';
            Oskari.getSandbox().printWarn(this.getClazz() +
                '.getForm is deprecated, please use getElement instead.');
            return jQuery(this.getElement());
        },

        /**
         * @public @method getHandler
         *
         *
         * @return {Function} handler
         */
        getHandler: function () {
            'use strict';
            return this._handler;
        },

        /**
         * @public @method setHandler
         *
         * @param {Function} handler Function(form, event)
         *
         */
        setHandler: function (handler) {
            'use strict';
            this._handler = handler;
        },

        /**
         * @method validate
         *
         *
         * @return {Array} errors
         */
        validate: function () {
            var errors = [];

            this.getComponents().forEach(function (component) {
                if (component.validate) {
                    errors = errors.concat(component.validate());
                }
            });
            return errors;
        },

        /**
         * @deprecated @public @method showErrors
         *
         *
         */
        showErrors: function () {
            'use strict';
            Oskari.getSandbox().printWarn(
                this.getClazz() + '.showErrors is deprecated.');
            var errors;

            this.getComponents().forEach(function (component) {
                if (component.validate) {
                    errors = component.validate();
                    if (component.showErrors) {
                        component.showErrors(errors);
                    }
                }
            });
        },

        /**
         * @deprecated @public @method showErrors
         *
         *
         */
        clearErrors: function () {
            'use strict';
            Oskari.getSandbox().printWarn(
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
         *
         *
         */
        submit: function () {
            this.getElement().submit();
        },

        /**
         * @private @method _onSubmit
         * Called before the form is submitted
         *
         * @param {Object} event
         *
         * @return {Boolean} True
         */
        _onSubmit: function (event) {
            'use strict';
            if (this.getHandler()) {
                this.getHandler()(this, event);
            }
            return true;
        }
    }, {
        extend: ['Oskari.userinterface.component.Container']
    }
);