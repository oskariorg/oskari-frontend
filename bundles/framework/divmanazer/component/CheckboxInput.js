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
            
            this._input.disabled = !enabled;
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
            
            return this._input.checked ? this._input.value : undefined;
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            
            this._input.value = value;
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