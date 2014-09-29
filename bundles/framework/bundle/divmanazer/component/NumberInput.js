/**
 * @class Oskari.userinterface.component.NumberInput
 *
 * Simple numeric input component
 */
Oskari.clazz.define('Oskari.userinterface.component.NumberInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        this._element.className = 'oskari-formcomponent oskari-numberinput';
        this._input.type = 'number';
    }, {

        /**
         * @method getMax
         * @return {String} max
         */
        getMax: function () {
            'use strict';
            return this._input.max;
        },

        /**
         * @method setMax
         * @param {String} max
         */
        setMax: function (max) {
            'use strict';
            if (!this._isNumberOrEmpty(max)) {
                throw new TypeError(
                    this.getClazz() + '.setMax: ' + max + ' is Not a Number'
                );
            }
            this._input.max = max;
        },

        /**
         * @method getMin
         * @return {String} min
         */
        getMin: function () {
            'use strict';
            return this._input.min;
        },

        /**
         * @method setMin
         * @param {String} min
         */
        setMin: function (min) {
            'use strict';
            if (!this._isNumberOrEmpty(min)) {
                throw new TypeError(
                    this.getClazz() + '.setMin: ' + min + ' s Not a Number'
                );
            }
            this._input.min = min;
        },

        /**
         * @method getStep
         * @return {String} step
         */
        getStep: function () {
            'use strict';
            return this._input.step;
        },

        /**
         * @method setStep
         * @param {String} step
         */
        setStep: function (step) {
            'use strict';
            if (!this._isNumberOrEmpty(step)) {
                throw new TypeError(
                    this.getClazz() + '.setStep: ' + step + ' is Not a Number'
                );
            }
            this._input.step = step;
        },

        /**
         * @method setValue
         * @param {String} value
         */
        setValue: function (value) {
            'use strict';
            if (!this._isNumberOrEmpty(value)) {
                throw new TypeError(
                    this.getClazz() + '.setValue: ' + value + ' is Not a Number'
                );
            }
            this._input.value = value;
        },

        _isNumberOrEmpty: function (value) {
            return value === null ||
                value === undefined ||
                value === '' ||
                !isNaN(value);
        }

    },
    {
        extend: ['Oskari.userinterface.component.TextInput']
    }
    );