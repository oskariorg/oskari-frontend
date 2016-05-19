/**
 * @class Oskari.userinterface.component.Select
 *
 * Simple select component
 */
Oskari.clazz.define('Oskari.userinterface.component.Select',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        var me = this;
        me._clazz = 'Oskari.userinterface.component.Select';
        me._element = document.createElement('label');
        me._titleEl = document.createElement('div');
        me._select = document.createElement('select');
        me._element.className = 'oskari-formcomponent oskari-select';
        me._titleEl.style.display = 'none';
        if (name !== null && name !== undefined) {
            me.setName(name);
        }
        me._select.onchange = function () {
            me._valueChanged();
        };
        me._element.appendChild(me._titleEl);
        me._element.appendChild(me._select);
    }, {
        /**
         * @method focus
         * Focuses the component.
         */
        focus: function () {
            'use strict';
            this._select.focus();
        },

        isEnabled: function () {
            'use strict';
            return !this._element.disabled;
        },

        /**
         * @method isMultiple
         * Does the component allow multiple selections
         */
        isMultiple: function () {
            'use strict';
            return this._select.multiple;
        },

        /**
         * @method setMultiple
         * @param multiple
         */
        setMultiple: function (multiple) {
            'use strict';
            if (typeof multiple !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setMultiple: multiple is not a boolean'
                );
            }
            this._select.multiple = multiple;
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
            var oldValue = this.getValue(),
                els = this._select.querySelectorAll('option'),
                i,
                j,
                option;

            for (i = 0, j = options.length; i < j; i += 1) {
                if (i < els.length) {
                    option = els[i];
                } else {
                    option = document.createElement('option');
                    this._select.appendChild(option);
                }
                option.text = options[i].title;
                option.value = options[i].value;
            }

            this._select.disabled = j === 0;

            // Remove extra options
            for (j = els.length; i < j; i += 1) {
                this._select.removeChild(els[i]);
            }
            if (this.getValue() !== oldValue) {
                this._valueChanged();
            }
        },

        _getValueArray: function (value) {
            'use strict';
            var selectedValues = [];

            // Fill selected values for easy contains check
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(function (val) {
                        selectedValues.push(
                            String(val)
                        );
                    });
                    selectedValues = value;
                } else {
                    selectedValues.push(String(value));
                }
            }
            return selectedValues;
        },

        _equalValues: function (oldValue, newValue) {
            var i,
                equalValues = oldValue.length === newValue.length;
            if (equalValues) {
                for (i = 0; i < oldValue.length; i += 1) {
                    if (oldValue[i] !== newValue[i]) {
                        equalValues = false;
                        break;
                    }
                }
            }
            return equalValues;
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
            this._select.disabled = !enabled;
        },

        /**
         * @method getTitle
         * @return {String} name
         */
        getName: function () {
            'use strict';
            return this.select.name;
        },

        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            'use strict';
            this._select.name = name || '';
        },

        isRequired: function () {
            'use strict';
            return this._select.required;
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            'use strict';
            this._select.required = this.isRequired();
        },


        /**
         * @method getTitle
         */
        getTitle: function () {
            'use strict';
            return this._titleEl.textContent;
        },

        /**
         * @method setTitle
         * @param {String} title
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

        _getOptionValue: function (o) {
            // Apparently we should return content if there's no value.
            // If the value is an empty string, it should be returned...
            return o.value !== undefined ? o.value : o.textContent;
        },

        getValue: function () {
            'use strict';
            var i,
                me = this,
                opts = me._select.querySelectorAll('option:checked'),
                value;

            if (me.isMultiple()) {
                value = [];
                for (i = 0; i < opts.length; i += 1) {
                    value.push(me._getOptionValue(opts[i]));
                }
            } else {
                value = opts.length ? me._getOptionValue(opts[0]) : undefined;
            }
            return value;
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            'use strict';
            var i,
                oldValues = this._getValueArray(this.getValue()),
                selectedValues = this._getValueArray(value),
                valueHasChanged,
                option,
                options = this._select.querySelectorAll('option'),
                found = false;

            for (i = options.length - 1; i >= 0; i -= 1) {
                option = options[i];
                option.selected = selectedValues.indexOf(option.value) !== -1;
                if (option.selected) {
                    found = true;
                }
            }

            // Select first one if there's no found selections
            if (!found && options && options.length >= 1) {
                options[0].selected = true;
            }

            selectedValues = this._getValueArray(this.getValue());
            valueHasChanged = this._equalValues(oldValues, selectedValues);
            if (valueHasChanged) {
                this._valueChanged();
            }

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