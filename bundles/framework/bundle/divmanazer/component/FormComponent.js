/**
 * @class Oskari.userinterface.component.FormComponent
 *
 * Abstract superclass for form components
 */
Oskari.clazz.define('Oskari.userinterface.component.FormComponent',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        this._clazz = 'Oskari.userinterface.component.FormComponent';
        this._enabled = true;
        this._handler = null;
        this._name = null;
        this._required = false;
        this._title = null;
        this._tooltip = null;
        this._visible = true;
    }, {

        /**
         * @method destroy
         * Called whenever someone wants to get rid of the component
         * @param {Boolean} cleanup True if destroy is called just for cleanup
         */
        destroy: function (cleanup) {
            'use strict';
            this._destroyImpl(cleanup);
            if (!cleanup) {
                console.log('Real destroy');
                if (this.getHandler()) {
                    this.getHandler()(undefined);
                }
                if (this._element) {
                    console.log('Has element');
                    if (this._element.parentNode) {
                        console.log('Has element parent, removing element');
                        this._element.parentNode.removeChild(this._element);
                    }
                }
            }
        },

        /**
         * @method focus
         * Focuses the component. Implement if component can be focused.
         */
        focus: function () {
            'use strict';
            return undefined;
        },

        // TODO
        validate: function () {
            'use strict';
            return true;
        },

        /**
         * @method isEnabled
         *     Override if the component can actually be disabled.
         * @return {Boolean} enabled 
         */
        isEnabled: function () {
            'use strict';
            return true;
        },

        /**
         * @method setEnabled
         * @param {Boolean} enabled
         */
        setEnabled: function (enabled) {
            'use strict';
            if (typeof enabled !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setEnabled: enabled is not a boolean'
                );
            }
            this._setEnabledImpl(enabled);
        },

        /**
         * @method _setEnabledImpl
         * @param {Boolean} enabled
         *     Implement if the component can actually be disabled.
         */
        _setEnabledImpl: function (enabled) {
            'use strict';
            return undefined;
        },

        /**
         * @method getHandler
         * @return {Function} handler
         */
        getHandler: function () {
            'use strict';
            return this._handler;
        },

        /**
         * @method setHandler
         * @param {Function} handler 
         */
        setHandler: function (handler) {
            'use strict';
            if (handler && typeof handler !== 'function') {
                throw new TypeError(
                    this.getClazz() +
                        '.setHandler: handler is not a function.'
                );
            }

            this._handler = handler;
            this._setHandlerImpl();
        },

        /**
         * @method _setHandlerImpl
         */
        _setHandlerImpl: function () {
            'use strict';
            return undefined;
        },

        /**
         * @method getName
         * @return {String} name 
         */
        getName: function () {
            'use strict';
            throw new Error(
                this.getClazz() + '.getName is unimplemented subclass'
            );
        },

        /**
         * @method setName
         * @param {String} name 
         */
        setName: function (name) {
            'use strict';
            throw new Error(
                this.getClazz() + '.setName is unimplemented subclass'
            );
        },

        /**
         * @method isRequired
         * @return {Boolean} required 
         */
        isRequired: function () {
            'use strict';
            return false;
        },

        /**
         * @method setRequired
         * @param {Boolean} required 
         */
        setRequired: function (required) {
            'use strict';
            if (typeof required !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setRequired: required is not a boolean'
                );
            }
            this._setRequiredImpl(required);
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            'use strict';
            return undefined;
        },

        /**
         * @method getTitle
         * @return {String} title 
         */
        getTitle: function () {
            'use strict';
            throw new Error(
                this.getClazz() + '.getTitle is unimplemented subclass'
            );
        },

        /**
         * @method setTitle
         * @param {String} title 
         */
        setTitle: function (title) {
            'use strict';
            debugger;
            throw new Error(
                this.getClazz() + '.setTitle is unimplemented subclass'
            );
        },

        /**
         * @method getTooltip
         * @return {String} 
         */
        getTooltip: function () {
            'use strict';
            throw new Error(
                this.getClazz() + '.getTooltip is unimplemented subclass'
            );
        },

        /**
         * @method setTooltip
         * @param {String} tooltip
         */
        setTooltip: function (tooltip) {
            'use strict';
            throw new Error(
                this.getClazz() + '.setTooltip is unimplemented in subclass'
            );
        },

        /**
         * @method getValue
         * @return {} 
         */
        getValue: function () {
            'use strict';
            throw new Error(
                this.getClazz() + '.getValue is unimplemented subclass'
            );
        },

        /**
         * @method setValue
         * Sets the component's value.
         * @param {} value
         */
        setValue: function (value) {
            'use strict';
            throw new Error(
                this.getClazz() + '.setValue is unimplemented subclass'
            );
        }
    }, {
        extend: ['Oskari.userinterface.component.Component']
    }
    );