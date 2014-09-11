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
        this._element = null;
        this._enabled = true;
        this._handler = null;
        this._name = null;
        this._required = false;
        this._title = null;
        this._tooltip = null;
        this._value = null;
        this._visible = true;
    }, {

        /**
         * @method destroy
         * Called whenever someone wants to get rid of the component
         */
        destroy: function () {
            this._destroyImpl();
            this._element.parent.removeChild(this._element);
        },

        /**
         * @method _destroyImpl
         * Called before component element is removed. Useful for cleanup.
         */
        _destroyImpl: function () {
            return undefined;
        },

        /**
         * @method focus
         * Focuses the component. Implement if component can be focused.
         */
        focus: function () {
            return undefined;
        },

        /**
         * @method insertTo
         * @param {Element} container 
         */
        insertTo: function (container) {
            if (!container) {
                throw new TypeError(
                    this.getClazz() +
                        '.insertTo: container is required.'
                );
            }
            if (!container.appendChild) {
                throw new TypeError(
                    this.getClazz() +
                        '.insertTo: container is not a DOMElement.'
                );
            }
            container.appendChild(this._element);
        },

        /**
         * @method getClazz
         * @return {String} clazz 
         */
        getClazz: function () {
            return this._clazz;
        },

        /**
         * @method getElement
         * @return {Element} element 
         */
        getElement: function () {
            return this._element;
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
         *     Implement if the component can actually be disabled.
         */
        _setEnabledImpl: function () {
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
            return this._name;
        },

        /**
         * @method setName
         * @param {String} name 
         */
        setName: function (name) {
            this._name = name;
            this._setNameImpl();
        },

        /**
         * @method _setNameImpl
         */
        _setNameImpl: function () {
            return undefined;
        },

        /**
         * @method isRequired
         * @return {Boolean} required 
         */
        isRequired: function () {
            return this._required;
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
            this._required = required;
            this._setRequiredImpl();
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
            return this._title;
        },

        /**
         * @method setTitle
         * @param {String} title 
         */
        setTitle: function (title) {
            this._title = title;
            this._setTitleImpl();
        },

        /**
         * @method _setTitleImpl
         */
        _setTitleImpl: function () {
            return undefined;
        },

        /**
         * @method getTooltip
         * @return {String} 
         */
        getTooltip: function () {
            return this._tooltip;
        },

        /**
         * @method setTooltip
         * @param {String} tooltip
         */
        setTooltip: function (tooltip) {
            this._tooltip = tooltip;
            this._setTooltipImpl();
        },

        /**
         * @method _setTooltipImpl
         */
        _setTooltipImpl: function () {
            return undefined;
        },

        /**
         * @method getValue
         * @return {} 
         */
        getValue: function () {
            return this._value;
        },

        /**
         * @method setValue
         * @param {} 
         */
        setValue: function (value) {
            this._value = value;
            this._setValueImpl();
        },

        /**
         * @method _setValueImpl
         */
        _setValueImpl: function () {
            return undefined;
        },

        /**
         * @method isVisible
         * @return {Boolean} 
         */
        isVisible: function () {
            return this._visible;
        },

        /**
         * @method setVisible
         * @param {Boolean} 
         */
        setVisible: function (visible) {
            if (typeof visible !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setVisible: visible is not a boolean'
                );
            }
            this._visible = visible;
            // Implementing component might have to hide more than this._element
            this._setVisibleImpl();
        },

        /**
         * @method _setVisibleImpl
         */
        _setVisibleImpl: function () {
            return undefined;
        }
    }
    );