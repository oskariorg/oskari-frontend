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
        me._select.onchange = function () {me._selectionChanged(); };
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
            return !this.getElement().disabled;
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
            var els = this._select.querySelectorAll('option'),
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

            // Update selection
            this.setValue(this.getValue());
        },

        _getValueArray: function () {
            'use strict';
            var selectedValues = [],
                value = this.getValue();

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

        _selectionChanged: function () {
            'use strict';
            var options = this._select.querySelectorAll('option:checked'),
                value;

            if (this.isMultiple()) {
                value = options.map(function (o) {
                    return o.value;
                });
            } else {
                value = options.length ? options[0].value : undefined;
            }
            this._value = value;
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
         * @method _setNameImpl
         */
        _setNameImpl: function () {
            'use strict';
            this._select.name = this.getName() || '';
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            'use strict';
            this._select.required = this.isRequired();
        },

        /**
         * @method _setTitleImpl
         */
        _setTitleImpl: function () {
            'use strict';
            var title = this.getTitle();
            this._titleEl.textContent = '';
            if (title !== null && title !== undefined) {
                this._titleEl.style.display = '';
                this._titleEl.appendChild(document.createTextNode(title));
            } else {
                this._titleEl.style.display = 'none';
            }
        },

        /**
         * @method _setTooltipImpl
         */
        _setTooltipImpl: function () {
            'use strict';
            this._select.title = this.getTooltip();
        },

        /**
         * @method _setValueImpl
         */
        _setValueImpl: function () {
            'use strict';
            var i,
                selectedValues = this._getValueArray(),
                option,
                options = this._select.querySelectorAll('option'),
                found = [];

            for (i = options.length - 1; i >= 0; i -= 1) {
                option = options[i];
                option.selected = selectedValues.indexOf(option.value) !== -1;
                if (option.selected) {
                    found.push(option.value);
                }
            }

            // Select first one if there's no found selections
            if (!found && options) {
                options[0].selected = true;
                found.push(options[0].value);
            }

            // Force _value to match the actual selection
            if (this.isMultiple()) {
                this._value = found;
            } else {
                this._value = found ? found[found.length - 1] : undefined;
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