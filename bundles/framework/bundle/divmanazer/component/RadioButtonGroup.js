/**
 * @class Oskari.userinterface.component.RadioButtonGroup
 *
 * A group of radio buttons
 */
Oskari.clazz.define('Oskari.userinterface.component.RadioButtonGroup',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        var me = this;
        me._clazz = 'Oskari.userinterface.component.RadioButtonGroup';
        me._element = document.createElement('fieldset');
        me._titleEl = document.createElement('legend');
        me._element.className = 'oskari-formcomponent oskari-radiobuttongroup';
        me._titleEl.style.display = 'none';
        me._element.appendChild(me._titleEl);
    }, {
        /**
         * @method focus
         * Focuses the component.
         */
        focus: function () {
            'use strict';
            var radioButton = this._element.querySelector('input');
            if (radioButton) {
                radioButton.focus();
            }
        },

        isEnabled: function () {
            'use strict';
            return !this.getElement().disabled;
        },

        /**
         * @method setOptions
         * @param {Array} options
         */
        setOptions: function (options) {
            'use strict';
            if (!Array.isArray(options)) {
                throw new TypeError(
                    this.getClazz() +
                        '.setOptions: options is not an array'
                );
            }
            var div,
                els = this._element.querySelectorAll('label'),
                i,
                input,
                j,
                me = this,
                onChangeFunc = function () {
                    me._valueChanged();
                },
                option;

            for (i = 0, j = options.length; i < j; i += 1) {
                if (i < els.length) {
                    option = els[i];
                } else {
                    option = document.createElement('label');
                    input = document.createElement('input');
                    input.name = me.getName();
                    input.type = 'radio';
                    input.onchange = onChangeFunc;
                    option.appendChild(input);
                    option.appendChild(document.createElement('span'));
                    me._element.appendChild(option);
                }
                div = option.querySelector('span');
                div.textContent = '';
                div.appendChild(document.createTextNode(options[i].title));
                option.querySelector('input').value = options[i].value;
            }

            me._element.disabled = j === 0;

            // Remove extra options
            for (j = els.length; i < j; i += 1) {
                me._element.removeChild(els[i]);
            }
        },

        _valueChanged: function () {
            'use strict';
            var value = this.getValue();

            if (this.getHandler()) {
                this.getHandler()(value);
            }
        },

        /**
         * @method _setEnabledImpl
         */
        _setEnabledImpl: function (enabled) {
            'use strict';
            this._element.disabled = !enabled;
        },

        getName: function (name) {
            'use strict';
            var input = this._element.querySelector('input'),
                ret = '';
            if (input) {
                ret = input.name;
            }
            return ret;
        },

        /**
         * @method setName
         */
        setName: function (name) {
            'use strict';
            var i,
                inputs = this._element.querySelectorAll('input');

            for (i = 0; i < inputs.length; i += 1) {
                inputs[i].name = name || '';
            }
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            'use strict';
            var i,
                inputs = this._element.querySelectorAll('input');
            // TODO check if this actually does something...
            for (i = 0; i < inputs.length; i += 1) {
                inputs[i].required = this.isRequired();
            }
        },

        getTitle: function () {
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
        setTooltip: function (tooltip) {
            'use strict';
            this._element.title = tooltip;
        },

        getValue: function () {
            'use strict';
            var input = this._element.querySelector('input:checked');
            return input ? input.value : undefined;
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            'use strict';
            var i,
                input,
                inputs = this._element.querySelectorAll('input'),
                found = false;

            for (i = inputs.length - 1; i >= 0; i -= 1) {
                input = inputs[i];
                input.checked = input.value === value;
                found = found || input.checked;
            }

            // Select first one if there's no found selections
            if (!found && inputs) {
                inputs[0].checked = true;
            }

            this._valueChanged();
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