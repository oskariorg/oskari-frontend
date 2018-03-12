/**
 * @class Oskari.userinterface.component.ColorPickerInput
 *
 * Color picker component with default color palette
 */
Oskari.clazz.define('Oskari.userinterface.component.ColorPickerInput',

    /**
     * @method create called automatically on construction
     * @param object options colorPicker options for customizing spectrum component
     */
    function (options) {
        var me = this;
        
        if (!options) {
            options = {}
        }

        me._clazz = 'Oskari.userinterface.component.ColorPickerInput';

        me._element = document.createElement('label');
        me._input = document.createElement('input');
        me._titleEl = document.createElement('span');
        me._titleEl.style.display = 'none';
        me._element.appendChild(me._input);
        me._element.appendChild(me._titleEl);

        me._element.className = 'oskari-formcomponent oskari-colorpickerinput';
        me._input.type = 'text';

        me._input.onchange = function () {
            me._valueChanged();
        };
        me._input.input = me._input.onchange;
        me._input.onkeyup = me._input.onchange;

        me._colorPickerOptions = {
            color: '#818282',
            preferredFormat: 'hex',
            clickoutFiresChange: true,
            chooseText: Oskari.getMsg('DivManazer', 'buttons.ok'),
            cancelText: '',
            localStorageKey: 'colorpicker',
            showPalette: true,
            hideAfterPaletteSelect:true,
            showAlpha: false,
            palette: [
                ['#ffffff','#666666'],
                ['#ffde00','#f8931f'],
                ['#ff3334','#bf2652'],
                ['#000000','#cccccc'],
                ['#652d90','#3233ff'],
                ['#26bf4b','#00ff01']
            ],
            maxSelectionSize: 2
        };
        jQuery.extend(me._colorPickerOptions, options);
        jQuery(me._input).spectrum(me._colorPickerOptions);
    }, {
        /**
         * @method focus
         * Focuses the component.
         */
        focus: function () {
            this._input.focus();
        },

        isEnabled: function () {
            return !this._input.disabled;
        },

        _valueChanged: function () {
            if (this.getHandler()) {
                this.getHandler()(this.getValue());
            }
        },

        /**
         * @method _setEnabledImpl
         */
        _setEnabledImpl: function (enabled) {
            var action = enabled ? 'enable' : 'disable';
            jQuery(this._input).spectrum(action);
        },

        getName: function () {
            return this._input.name;
        },

        /**
         * @method setName
         */
        setName: function (name) {
            this._input.name = name || '';
        },

        getPlaceHolder: function () {
            return this._input.placeholder;
        },

        setPlaceHolder: function (placeholder) {
            this._input.placeholder = placeholder;
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            this._input.required = this.isRequired();
        },

        getTitle: function () {
            return this._titleEl.textContent;
        },

        /**
         * @method setTitle
         */
        setTitle: function (title) {
            this._titleEl.textContent = '';
            if (title !== null && title !== undefined) {
                this._titleEl.style.display = '';
                this._titleEl.appendChild(document.createTextNode(title));
            } else {
                this._titleEl.style.display = 'none';
            }
        },

        getTooltip: function () {
            return this._element.title;
        },

        /**
         * @method setTooltip
         */
        setTooltip: function () {
            this._element.title = this.getTooltip();
        },

        getValue: function () {
            return jQuery(this._input).spectrum('get').toHexString();
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            return jQuery(this._input).spectrum('set', value);
        },

        /**
         * @method _setVisibleImpl
         */
        _setVisibleImpl: function () {
            this.getElement().style.display = this.isVisible() ? '' : 'none';
        }
    }, {
        extend: ['Oskari.userinterface.component.FormComponent']
    }
    );