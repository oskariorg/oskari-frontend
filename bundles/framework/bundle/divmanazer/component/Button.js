/**
 * @class Oskari.userinterface.component.Button
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.Button',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (name) {
        'use strict';
        this._element = document.createElement('input');
        this._element.className = 'oskari-formcomponent oskari-button';
        this._element.type = 'button';
        if (name !== null && name !== undefined) {
            this.setName(name);
        }
    }, {

        focus: function () {
            'use strict';
            this._element.focus();
        },

        getName: function () {
            'use strict';
            return this._element.name;
        },

        setName: function (name) {
            'use strict';
            this._element.name = name;
        },

        getTitle: function () {
            'use strict';
            return this._element.value;
        },

        /**
         * @method setTitle
         * Sets the button title
         */
        setTitle: function (title) {
            'use strict';
            this._element.value = title;
        },

        getTooltip: function () {
            'use strict';
            return this._element.title;
        },

        setTooltip: function (tooltip) {
            'use strict';
            this._element.title = tooltip;
        },

        getValue: function () {
            'use strict';
            return this._element.value;
        },

        setValue: function (value) {
            'use strict';
            this._element.value = value;
        },

        /**
         * @method setId
         * Set an Id to the button
         * @param {String} pId id to be set
         */
        setId: function (pId) {
            this.id = pId;
            if (this.ui) {
                this.ui.attr('id', pId);
            } else {
                console.err("No UI");
            }
        },        
        /**
         * @method setEnabled
         * Enables/Disables the button
         * @param {Boolean} enabled true to enable, false to disable
         */
        _setEnabledImpl: function (enabled) {
            'use strict';
            this._element.disabled = !enabled;
        },

        /**
         * @method _setHandlerImpl
         * Sets click handler for button
         */
        _setHandlerImpl: function () {
            'use strict';
            this._element.onclick = this._handler;
        },

        /**
         * @method setPrimary
         * Sets primary status of the button
         */
        setPrimary: function (primary, focus) {
            'use strict';
            if (typeof primary !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setPrimary: primary is not a boolean'
                );
            }
            if (focus !== undefined && typeof focus !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setPrimary: focus is not a boolean'
                );
            }
            this.toggleClass('primary', primary);
            if (focus) {
                this.focus();
            }
        },

        /**
         * @method hide
         * @deprecated
         * Hide the button/hide  it in the document
         */
        hide: function () {
            'use strict';
            Oskari.getSandbox().printWarn('Oskari.userinterface.component.Button: hide is deprecated, please use setVisible instead.');
            this.setVisible(false);
        },

        /**
         * @method show
         * @deprecated
         * Show the button/show it in the document
         */
        show: function () {
            'use strict';
            Oskari.getSandbox().printWarn('Oskari.userinterface.component.Button: show is deprecated, please use setVisible instead.');
            this.setVisible(true);
        },

        /**
         * @method setFocus
         * @deprecated
         * Adds this button to given container.
         * @param {Boolean} focus
         */
        setFocus: function(focus) {
            'use strict';
            Oskari.getSandbox().printWarn('Oskari.userinterface.component.Button: setFocus is deprecated, please use focus instead.');
            if (focus) {
                this.focus();
            }
        },

        /**
         * @method getButton
         * @deprecated
         * Returns this buttons DOM element.
         * @return {jQuery} reference to DOM element
         */
        getButton: function () {
            'use strict';
            Oskari.getSandbox().printWarn('Oskari.userinterface.component.Button: getButton is deprecated, please use getElement instead.');
            return jQuery(this.getElement());
        }
    }, {
        extend: ['Oskari.userinterface.component.FormComponent']
    }
    );
