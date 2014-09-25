/**
 * @class Oskari.userinterface.component.CheckboxInput
 *
 * Simple text input component
 */
Oskari.clazz.define('Oskari.userinterface.component.CheckboxInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        var me = this;

        me._clazz = 'Oskari.userinterface.component.CheckboxInput';
        me._element = document.createElement('label');
        me._input = document.createElement('input');
        me._titleEl = document.createElement('span');
        me._element.className = 'oskari-formcomponent oskari-checkboxinput';
        me._titleEl.style.display = 'none';
        me._input.type = 'checkbox';
        // TODO none of these fire on autocomplete
        me._input.onchange = function () {
            me._valueChanged();
        };
        me._input.input = me._input.onchange;
        me._input.onkeyup = me._input.onchange;
        me._element.appendChild(me._input);
        me._element.appendChild(me._titleEl);
    }, {
        /**
         * @method focus
         * Focuses the component.
         */
        focus: function () {
            'use strict';
            this._input.focus();
        },

        isChecked: function () {
            return this._input.checked;
        },

        setChecked: function (checked) {
            if (this._input.checked !== checked) {
                this._input.checked = checked;
                this._valueChanged();
            }
        },

        isEnabled: function () {
            'use strict';
            return !this.getElement().disabled;
        },


        _valueChanged: function () {
            'use strict';
            if (this.getHandler()) {
                this.getHandler()(this.getValue());
            }
        },

        /**
         * @method _setEnabledImpl
         */
        _setEnabledImpl: function (enabled) {
            'use strict';
            this._input.disabled = !enabled;
        },

        getName: function () {
            'use strict';
            return this._input.name;
        },

        /**
         * @method setName
         */
        setName: function (name) {
            'use strict';
            this._input.name = name || '';
        },

        getPlaceHolder: function () {
            'use strict';
            return this._input.placeholder;
        },

        setPlaceHolder: function (placeholder) {
            'use strict';
            this._input.placeholder = placeholder;
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            'use strict';
            this._input.required = this.isRequired();
        },

        getTitle: function () {
            'use strict';
            return this._titleEl.textContent;
        },

        /**
         * @method setTitle
         */
        setTitle: function (title) {
            'use strict';
            this._titleEl.textContent = '';
            if (title !== null && title !== undefined) {
                this._titleEl.style.display = '';
                this._titleEl.appendChild(document.createTextNode(title));
            } else {
                this._titleEl.style.display = 'none';
            }
        },

        getTooltip: function () {
            'use strict';
            return this._element.title;
        },

        /**
         * @method setTooltip
         */
        setTooltip: function () {
            'use strict';
            this._element.title = this.getTooltip();
        },

        getValue: function () {
            'use strict';
            return this._input.checked ? this._input.value : undefined;
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            'use strict';
            this._input.value = value;
        },

        /**
         * @method _setVisibleImpl
         */
        _setVisibleImpl: function () {
            'use strict';
            this.getElement().style.display = this.isVisible() ? '' : 'none';
        }
    }, {
        extend: ['Oskari.userinterface.component.FormComponent']
    }
    );