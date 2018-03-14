/**
 * @class Oskari.userinterface.component.TextAreaInput
 *
 * Simple textarea input component
 */
Oskari.clazz.define('Oskari.userinterface.component.TextAreaInput',

    /**
     * @method create called automatically on construction
     */
    function (name) {
        
        var me = this,
            closeIcon = document.createElement('div'),
            controlsWrapper = document.createElement('div');

        me._clazz = 'Oskari.userinterface.component.TextAreaInput';
        me._element = document.createElement('label');
        me._titleEl = document.createElement('div');
        me._input = document.createElement('textarea');
        me._element.className = 'oskari-formcomponent oskari-textareainput';
        me._titleEl.style.display = 'none';
        if (name !== null && name !== undefined) {
            me.setName(name);
        }
        me._input.setAttribute('autocomplete', 'off');
        // TODO none of these fire on autofill, it would need a timer...
        me._input.onchange = function () {
            me._valueChanged();
        };
        me._input.input = me._input.onchange;
        me._input.onkeyup = me._input.onchange;
        closeIcon.onclick = function () {
            me.setValue('');
        };
        closeIcon.className = 'icon-close';
        controlsWrapper.className = 'input-controls';
        controlsWrapper.appendChild(me._input);
        controlsWrapper.appendChild(closeIcon);
        me._element.appendChild(me._titleEl);
        me._element.appendChild(controlsWrapper);
    }, {

        /**
         * @method focus
         * Focuses the component.
         */
        focus: function () {
            
            this._input.focus();
        },

        /**
         * @method isEnabled
         * @return {Boolean} enabled
         */
        isEnabled: function () {
            
            return !this.getElement().disabled;
        },

        /**
         * @method _setEnabledImpl
         * @param {Boolean} enabled
         */
        _setEnabledImpl: function (enabled) {
            
            this._input.disabled = !enabled;
        },

        /**
         * @method _valueChanged
         * @private
         */
        _valueChanged: function () {
            
            if (this.getHandler()) {
                this.getHandler()(this.getValue());
            }
        },

        /**
         * @method getName
         * @return {String} name
         */
        getName: function () {
            
            return this._input.name;
        },

        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            
            this._input.name = name || '';
        },

        /**
         * @method getPlaceholder
         * @return {String} placeholder
         */
        getPlaceholder: function () {
            
            return this._input.placeholder;
        },

        /**
         * @method setPlaceholder
         * @param {String} placeholder
         */
        setPlaceholder: function (placeholder) {
            
            this._input.placeholder = placeholder;
        },

        /**
         * @method _setRequiredImpl
         */
        _setRequiredImpl: function () {
            
            this._input.required = this.isRequired();
        },

        /**
         * @method getTitle
         * @return {String} title
         */
        getTitle: function () {
            
            return this._titleEl.textContent;
        },

        /**
         * @method setTitle
         * @param {String} title
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

        /**
         * @method getTooltip
         * @return {String} tooltip
         */
        getTooltip: function () {
            
            return this._element.title;
        },

        /**
         * @method setTooltip
         * @param {String} tooltip
         */
        setTooltip: function (tooltip) {
            
            this._element.title = tooltip;
        },

        /**
         * @method getValue
         * @return {String} value
         */
        getValue: function () {
            
            return this._input.value;
        },

        /**
         * @method setValue
         * @param {String} value
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