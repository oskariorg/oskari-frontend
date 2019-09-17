/**
 * @class Oskari.userinterface.component.Select
 *
 * Simple select using jQuery chosen
 */
Oskari.clazz.define('Oskari.userinterface.component.SelectList', function (id) {
    this.id = id;
    this._option = jQuery('<option></option>');
    this._selectTemplate = jQuery('<div class="oskari-select">' +
                                  '<select></select>' +
                                  '</div>');
    this.element = null;
}, {
    defaultOptions: {
        placeholder_text: '',
        allow_single_deselect: true,
        disable_search_threshold: 10,
        no_results_text: '',
        multi: false,
        width: '100%'
    },
    /**
     * @method create
     *  creates a select with data specified
     * @param {Object} data, needs to have the keys id and title to construct a list
     *   * cls - optional param in data which sets a class to the list element so you can ex. toggle visible items in a dropdown based on class.
     * @param {Object} options
     * @return {jQuery Element} a list with chosen applied
     */
    create: function (data, modifiedOptions) {
        var me = this;
        var options = jQuery.extend(true, {}, me.defaultOptions, modifiedOptions);

        options.allowReset = options.allowReset === false ? options.allowReset : true;
        var select = this._selectTemplate.clone();
        this.element = select;
        if (options.multi) {
            select.find('select').prop('multiple', true);
        }
        if (data === undefined) {
            return this.makeChosen(select, options);
        }

        // append empty options so we can use the placeholder
        if (options.allowReset) {
            var emptyoption = this._option.clone();
            select.find('select').append(emptyoption);
        }

        for (var i = 0; i < data.length; i++) {
            // datakey needs to be parsed to suit all incoming data
            var dataKey = data[i];
            var option = this._option.clone();

            if (!dataKey.id && (!dataKey.title || !dataKey.name)) {
                option.val(dataKey).text(dataKey);
            }
            if (dataKey.cls) {
                option.addClass(dataKey.cls);
            }
            if (dataKey.tooltip) {
                option.prop('title', dataKey.tooltip);
            }
            option.val(dataKey.id).text(dataKey.title || dataKey.name);
            select.find('select').append(option);
        }
        return this.makeChosen(select, options);
    },
    /** @method makeChosen
     *  applies jQuery chosen to specidied element
     * @param {element} el
     */
    makeChosen: function (el, options) {
        el.find('select').chosen({
            width: options.width,
            no_results_text: options.no_results_text,
            placeholder_text: options.placeholder_text,
            disable_search_threshold: options.disable_search_threshold ? options.disable_search_threshold : 10,
            allow_single_deselect: options.allow_single_deselect ? options.allow_single_deselect : false
        });
        // Fixes an issue where placeholder is cut off with the input field width set as pixel value even if options.width is %
        // https://github.com/harvesthq/chosen/issues/1162
        el.find('li.search-field input').css('width', '100%');
        return el;
    },
    /** @method selectFirstValue
     *   Select the first non-placeholder value
     */
    selectFirstValue: function () {
        var chosen = this.element.find('select');
        chosen.find('option:nth-child(2)').prop('selected', 'selected');
        this.update();
    },
    /** @method selectLastValue
     *   Select the last value
     */
    selectLastValue: function () {
        var chosen = this.element.find('select');
        chosen.find('option:last-child').prop('selected', 'selected');
        this.update();
    },
    resetToPlaceholder: function () {
        var chosen = this.element.find('select');
        if (chosen.prop('multiple')) {
            chosen.val('');
        } else {
            chosen.find('option:first-child').prop('selected', 'selected');
        }
        this.update();
    },
    update: function () {
        var select = this.element.find('select');
        select.trigger('chosen:updated');
        select.trigger('change');
    },
    getOptions: function () {
        var chosen = this.element.find('select');
        // filter away the placeholder
        var options = chosen.find('option').filter(function (option) {
            return this.value !== '';
        });
        var disabled = chosen.find('option:disabled');
        return {
            'options': options,
            'disabled': disabled
        };
    },
    /**
     * @method _setEnabledImpl or disable select
     * @param { boolean } true = enable
     */
    _setEnabledImpl: function (enableFlag) {
        var chosen = this.element.find('select');
        if (enableFlag) {
            chosen.prop('disabled', false);
        } else {
            chosen.prop('disabled', true);
        }
        chosen.trigger('chosen:updated');
    },
    /**
     * @method addOption appends a new option to the select
     * @param { Object } object with keys id and title
     */
    addOption: function (data) {
        var chosen = this.element.find('select');
        var option = this._option.clone();
        option.val(data.id).text(data.title);
        chosen.append(option);
        chosen.trigger('chosen:updated');
    },
    /**  @method removeOption removes an options where value mathces id
     *   @param { Object } object with keys id and title
     */
    removeOption: function (id) {
        var chosen = this.element.find('select');
        var options = chosen.find('option');
        var tobeRemoved = options.filter(function (index, opt) {
            return opt.value === '' + id;
        });
        tobeRemoved.remove();
        chosen.trigger('chosen:updated');
    },
    /** @method disableOption disables an options where value matches id
     *   @param { Array } ids array if ids to find
     */
    disableOptions: function (ids) {
        var chosen = this.element.find('select');

        this.reset(true);

        var isDisabledOption = function (optionId) {
            return ids.some(function (id) {
                return '' + id === optionId;
            });
        };
        chosen.find('option').each(function (index, opt) {
            if (isDisabledOption(opt.value)) {
                jQuery(opt).prop('disabled', true);
                jQuery(opt).prop('selected', false);
            }
        });
        this.update();
    },
    reset: function (supressEvent) {
        var state = this.getOptions();
        for (var i = 0; i < state.disabled.length; i++) {
            jQuery(state.disabled[i]).prop('disabled', false);
        }
        if (!supressEvent) {
            this.resetToPlaceholder();
        } else {
            this.element.find('select').trigger('chosen:updated');
        }
    },
    /** @method updateOptions
    *   updates an already defined chosen with new data
    *   @param {data} data to apply
    */
    updateOptions: function (data) {
        var me = this;
        var chosen = this.element.find('select');
        chosen.trigger('chosen:close');
        chosen.empty();
        // append empty options so we can use the placeholder
        if (chosen.find('option').length === 0) {
            var emptyoption = this._option.clone();
            chosen.append(emptyoption);
        }
        data.forEach(function (choice) {
            var option = me._option.clone();
            option.val(choice.id).text(choice.title);
            chosen.append(option);
        });
        this.update();
    },
    getId: function () {
        return this.id;
    },
    setValue: function (value) {
        if (!this.element.find('select')) {
            Oskari.log('Oskari.userinterface.component.SelectList').warn(" Couldn't set value, no element. Call create to initialize");
        }
        this.element.find('select').val(value);
        this.element.find('select').trigger('chosen:updated');
    },
    getValue: function () {
        if (typeof this.element === 'undefined') {
            Oskari.log('Oskari.userinterface.component.SelectList').warn(" Couldn't get value, no element set");
            return;
        }
        var value = this.element.find('select').val();
        if (Array.isArray(value)) {
            // cleanup empty placeholder value to an empty array
            return value.filter(function (item) {
                return item !== '';
            });
        }
        return value;
    },
    /** @method adjustChosen
    *   adjusts the chosen direction according to the screen
    */
    adjustChosen: function () {
        var selected = this.element.find('select');
        // check parent element(s) to apply overflow visible if needed
        selected.on('chosen:showing_dropdown', function () {
            jQuery(this).parents('div').each(function () {
                var el = jQuery(this);
                if (!el.hasClass('oskari-flyoutcontentcontainer')) {
                    el.css('overflow', 'visible');
                }
            });
        });
        // determine which way the dropdown should open
        selected.on('chosen:showing_dropdown', function (event, params) {
            var chosenContainer = jQuery(event.target).next('.chosen-container');
            var dropdown = chosenContainer.find('.chosen-drop');
            var dropdownTop = dropdown.offset().top - jQuery(window).scrollTop();
            var dropdownHeight = dropdown.height();
            var viewportHeight = jQuery(window).height();

            if (dropdownTop + dropdownHeight > viewportHeight) {
                chosenContainer.addClass('chosen-drop-up');
            }
        });
        selected.on('chosen:hiding_dropdown', function (event, params) {
            jQuery(event.target).next('.chosen-container').removeClass('chosen-drop-up');
        });
    },
    /**
     * @method clearOptions
     * Removes all 'select' elements from component
     */
    clearOptions: function () {
        this.element.find('select').empty().trigger('chosen:updated');
    }
}, {
    extend: ['Oskari.userinterface.component.FormComponent']
});
