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
            
            this._destroyImpl(cleanup);
            if (!cleanup) {
                if (this.getHandler()) {
                    this.getHandler()(undefined);
                }
                if (this._element && this._element.parentNode) {
                    this._element.parentNode.removeChild(this._element);
                }
            }
        },

        /**
         * @method focus
         * Focuses the component. Implement if component can be focused.
         */
        focus: function () {
            
            return undefined;
        },

        // TODO
        validate: function () {
            
            return true;
        },

        /**
         * @method isEnabled
         *     Override if the component can actually be disabled.
         * @return {Boolean} enabled
         */
        isEnabled: function () {
            
            return true;
        },

        /**
         * @method setEnabled
         * @param {Boolean} enabled
         */
        setEnabled: function (enabled) {
            
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
            
            return undefined;
        },

        /**
         * @method getHandler
         * @return {Function} handler
         */
        getHandler: function () {
            
            return this._handler;
        },

        /**
         * @method setHandler
         * @param {Function} handler
         */
        setHandler: function (handler) {
            
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
            
            return undefined;
        },

        /**
         * @method getName
         * @return {String} name
         */
        getName: function () {
            
            throw new Error(
                this.getClazz() + '.getName is unimplemented subclass'
            );
        },

        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            
            throw new Error(
                this.getClazz() + '.setName is unimplemented subclass'
            );
        },

        /**
         * @method isRequired
         * @return {Boolean} required
         */
        isRequired: function () {
            
            return false;
        },

        /**
         * @method setRequired
         * @param {Boolean} required
         */
        setRequired: function (required) {
            
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
            
            return undefined;
        },

        /**
         * @method getTitle
         * @return {String} title
         */
        getTitle: function () {
            
            throw new Error(
                this.getClazz() + '.getTitle is unimplemented subclass'
            );
        },

        /**
         * @method setTitle
         * @param {String} title
         */
        setTitle: function (title) {
            
            throw new Error(
                this.getClazz() + '.setTitle is unimplemented subclass'
            );
        },

        /**
         * @method getTooltip
         * @return {String}
         */
        getTooltip: function () {
            
            throw new Error(
                this.getClazz() + '.getTooltip is unimplemented subclass'
            );
        },

        /**
         * @method setTooltip
         * @param {String} tooltip
         */
        setTooltip: function (tooltip) {
            
            throw new Error(
                this.getClazz() + '.setTooltip is unimplemented in subclass'
            );
        },

        /**
         * @method getValue
         * @return {}
         */
        getValue: function () {
            
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
            
            throw new Error(
                this.getClazz() + '.setValue is unimplemented subclass'
            );
        }
    }, {
        extend: ['Oskari.userinterface.component.Component']
    }
    );