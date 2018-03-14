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
        me._name = null;
        me._selects = [];
        me._titleEl = document.createElement('legend');
        me._element.className = 'oskari-formcomponent oskari-multilevelselect';
        me._element.appendChild(me._titleEl);
        me._handlerInvactive = false;
    }, {

        _destroyImpl: function (cleanup) {
            // Call destroy on selects
            var i;
            if (!cleanup) {
                for (i = this._selects.length -1; i >= 0; i -= 1) {
                    this._selects.pop().destroy(true);
                }
            }
        },

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
            if (optionsArray.some(function (options) {
                return !options || !Array.isArray(options.options);
            })) {
                throw new TypeError(
                    this.getClazz() +
                        '.setOptions: invalid options in optionsArray'
                );
            }
            // TODO add a startIndex to this so we can only update selects
            // 'below' the changed value
            var me = this,
                handler = me.getHandler(),
                i,
                j,
                select,
                currentCount = me._selects.length,
                oldValue,
                dirty = false;

            // Disable handler so it doesn't fire on each select
            me._handlerInvactive = true;

            // Update selects
            for (i = 0, j = optionsArray.length; i < j; i += 1) {
                if (i < currentCount) {
                    // Select element already exists, reuse it
                    oldValue = me._selects[i].getValue();
                    me._setSelectOptions(
                        me._selects[i],
                        optionsArray[i],
                        oldValue
                    );
                    var currentValue = me._selects[i].getValue();
                    dirty = dirty || currentValue !== oldValue;
                } else {
                    // No select element, create a new one
                    dirty = true;
                    select = me._createSelect(optionsArray[i]);
                    select.insertTo(me.getElement());
                    me._selects.push(select);
                }
            }

            // Remove extraneous selects
            for (currentCount -= 1; currentCount >= i; currentCount -= 1) {
                dirty = true;
                me._selects.pop().destroy(false);
            }
            me._handlerInvactive = false;
            if (dirty) {
                me._valueChanged();
            }
        },

        /**
         * @method _createSelect
         * @private
         * @param  {Array}      options
         * @param  {String}     value
         * @return {Element}            Select element
         */
        _createSelect: function (options, value) {
            
            if (!Array.isArray(options.options)) {
                throw new TypeError(
                    this.getClazz() +
                        '._createSelect: options.options is not an array'
                );
            }
            var me = this,
                select = Oskari.clazz.create(
                    'Oskari.userinterface.component.Select',
                    me._name
                );
            this._setSelectOptions(select, options, value);
            // Add changelistener that calls the user set listener...
            select.setHandler(function () {
                me._valueChanged();
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
            select.setOptions(options.options);
            if (value !== undefined) {
                select.setValue(value);
            }
        },

        /**
         * @method _valueChanged
         * @private
         * Called when selection is changed in any of the selects
         */
        _valueChanged: function () {
            
            // Call user set handler if available
            if (!this._handlerInvactive && this.getHandler()) {
                this.getHandler()(this.getValue());
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
         * @method getName
         */
        getName: function () {
            return this._name;
        },

        /**
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            
            var me = this,
                i;

            me._name = name;
            me._selects.forEach(function (select) {
                select.name = name;
            });
        },

        /**
         * @method getTitle
         */
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

        /**
         * @method getTooltip
         */
        getTooltip: function () {
            
            return this.getElement().title;
        },

        /**
         * @method setTooltip
         */
        setTooltip: function (tooltip) {
            
            this.getElement().title = tooltip;
        },

        /**
         * @method getValue
         */
        getValue: function () {
            
            return this._selects.map(function (select) {
                return select.getValue();
            });
        },

        /**
         * @method setValue
         */
        setValue: function (value) {
            
            var i,
                select,
                me = this,
                oldValue,
                dirty = false,
                val = value;
            // Make sure set value is an array
            if (val === null || val === undefined) {
                val = [];
            } else if (!Array.isArray(val)) {
                throw new TypeError(
                    this.getClazz() +
                        '.setValue: value is not an array.'
                );
            }
            if (value.length > me._selects.length) {
                throw new TypeError(
                    this.getClazz() +
                        '.setValue: more values than selects.'
                );
            }
            me._handlerInvactive = true;
            for (i = 0; i < value.length; i += 1) {
                select = me._selects[i];
                oldValue = select.getValue();
                select.setValue(value[i]);
                dirty = dirty || select.getValue() !== oldValue;
            }
            me._handlerInvactive = false;
            if (dirty) {
                me._valueChanged();
            }
        },

        /**
         * @method _setVisibleImpl
         * @param {Boolean} visible
         */
        _setVisibleImpl: function (visible) {
            
            this._element.style.display = this._visible ? '' : 'none';
        }
    }, {
        extend: ['Oskari.userinterface.component.FormComponent']
    }
    );