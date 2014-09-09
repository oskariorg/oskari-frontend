/**
 * @class Oskari.userinterface.component.MultiLevelSelect
 *
 * Cascading multilevel select component
 */
Oskari.clazz.define('Oskari.userinterface.component.MultiLevelSelect',

    /**
     * @method create called automatically on construction
     */
    function () {
        var me = this;
        me._clazz = 'Oskari.userinterface.component.MultiLevelSelect';
        me._element = document.createElement('fieldset');
        me._selects = [];
        me._titleEl = document.createElement('legend');
        me._element.className = 'oskari-formcomponent oskari-multilevelselect';
        me._element.appendChild(me._titleEl);
        me._value = [];
    }, {

        /**
         * @method focus
         * Focuses the component
         */
        focus: function () {
            if (this._selects) {
                this._selects[0].focus();
            }
        },

        isEnabled: function () {
            return !this.getElement().disabled;
        },

        /**
         * @method setOptions
         * @param {Array} optionsArray
         *     [
         *         {
         *             title: 'foo',
         *             options: [{title: '1st', value: 'val1'}]
         *         },
         *         {
         *             title: 'bar',
         *             options: [
         *                          {title: '2nd', value: 'val2'},
         *                          {title: '3rd', value: 'val3'}
         *                      ]
         *         },
         *         {
         *             title: 'baz',
         *             multiple: true,
         *             options: [
         *                          {title: '4th', value: 'val4'},
         *                          {title: '5th', value: 'val5'}
         *                      ]
         *         }
         *     ]
         *     Top level title is optional, it's used as a label for the select.
         */
        setOptions: function (optionsArray) {
            if (!Array.isArray(optionsArray)) {
                throw new TypeError(
                    this.getClazz() +
                        '.setOptions: optionsArray is not an array'
                );
            }
            // TODO add a startIndex to this so we can only update selects
            // 'below' the changed value
            var me = this,
                i,
                j,
                select,
                currentCount = me._selects.length;

            // Update selects
            for (i = 0, j = optionsArray.length; i < j; i += 1) {
                if (i < currentCount) {
                    // Select element already exists, reuse it
                    me._setSelectOptions(
                        me._selects[i],
                        optionsArray[i],
                        me._value[i]
                    );
                } else {
                    // No select element, create a new one
                    select = me._createSelect(optionsArray[i], me._value[i]);
                    me._setSelectName(select, i);
                    select.insertTo(me.getElement());
                    me._selects.push(select);
                }
            }

            // Remove extraneous selects
            for (currentCount -= 1; currentCount >= i; currentCount -= 1) {
                me._selects.pop().destroy();
            }

            // Re-enable selects
            me.setEnabled(me.isEnabled());
        },

        /**
         * @method _createSelect
         * @private
         * @param  {Array}      options
         * @param  {String}     value
         * @return {Element}            Select element
         */
        _createSelect: function (options, value) {
            var me = this,
                select = Oskari.clazz.create(
                    'Oskari.userinterface.component.Select'
                );
            this._setSelectOptions(select, options, value);
            // Add changelistener that calls the user set listener...
            select.setHandler(function () {
                me._selectionChanged();
            });
            return select;
        },

        /**
         * @method _setSelectOptions
         * @param {Element} select
         * @param {Array}      options
         * @param {String}     value
         */
        _setSelectOptions: function (select, options, value) {
            if (options.title) {
                select.setTitle(options.title);
            }
            if (options.multiple) {
                select.setMultiple(true);
            }
            select.setValue(value);
            select.setOptions(options.options);
        },

        /**
         * @method _selectionChanged
         * @private
         * Called when selection is changed in any of the selects
         */
        _selectionChanged: function () {
            // Get changed select from event
            var me = this;

            me.setValue(me._selects.map(function (select) {
                return select.getValue();
            }));
            // Call user set handler if available
            if (me.getHandler()) {
                me.getHandler()(me.getValue());
            }
        },

        /**
         * @method _setEnabledImpl
         * @private
         */
        _setEnabledImpl: function (enabled) {
            /* We can just disable the fieldset as disable is inherited from
               parent form element.... */
            this.getElement().disabled = !enabled;
        },

        /**
         * @method _setNameImpl
         * @private
         */
        _setNameImpl: function () {
            var me = this,
                i;

            me.getElement().name = me.getName();
            for (i = me._selects.length - 1; i >= 0; i -= 1) {
                me._setSelectName(me._selects[i], i);
            }
        },

        /**
         * @method _setSelectName
         * @private
         * @param {Element} select
         * @param {Number}     index
         */
        _setSelectName: function (select, index) {
            if (this.getName()) {
                select.setName(this.getName() + '[' + index + ']');
            } else {
                select.setName();
            }
        },

        /**
         * @method _setTitleImpl
         * @private
         */
        _setTitleImpl: function () {
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
         * @private
         */
        _setTooltipImpl: function () {
            this.getElement().title = this.getTooltip();
        },

        /**
         * @method _setValueImpl
         * @private
         */
        _setValueImpl: function () {
            // Make sure set value is an array
            if (this._value === null || this._value === undefined) {
                this._value = [];
            } else if (!Array.isArray(this._value)) {
                throw new TypeError(
                    this.getClazz() +
                        '.setValue: value is not an array.'
                );
            }
        },

        /**
         * @method _setVisibleImpl
         */
        _setVisibleImpl: function () {
            this._element.style.display = this._visible ? '' : 'none';
        }
    }, {
        extend: ['Oskari.userinterface.component.FormComponent']
    }
    );