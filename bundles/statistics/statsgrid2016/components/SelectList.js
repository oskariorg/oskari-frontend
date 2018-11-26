import 'sumoselect/jquery.sumoselect.js';
import 'sumoselect/sumoselect.css';

const _selectTemplate = jQuery('<div class="oskari-select"><select></select></div>');
const locale = Oskari.getMsg('StatsGrid', 'sumo');

const defaultOptions = Object.assign({
    okCancelInMulti: true,
    isClickAwayOk: true,
    triggerChangeCombined: true,
    selectAll: true,
    search: true,
    up: false,
    showTitle: true,
    multi: false
}, locale);

const FormComponent = Oskari.clazz.get('Oskari.userinterface.component.FormComponent');

export default class SelectList extends FormComponent {
    constructor (id) {
        super();
        this.id = id;
        this._element = null;
    }

    /**
     * @method _createOptionTag Helper method for creating options elements
     * @private
     * @param {Object} data Containing keys id, title, name and cls
     */
    _createOptionTag (data) {
        if (!data) {
            return '<option></option>';
        }
        const { id, title, name, cls } = data;
        let value = id;
        let text = title || name;
        if (!value && !text) {
            value = data;
            text = data;
        }
        return `<option class="${cls || ''}" title="${title || text}" value="${value}">${text}</option>`;
    }

    /**
     * @method _addSumoEventListeners
     * Creates listeners for opening and closing the list.
     * Calculates the opening direction and handles overflow visibility.
    */
    _addSumoEventListeners () {
        const selected = this._element.find('select');
        // check parent element(s) to apply overflow visible if needed
        selected.on('sumo:opened', function () {
            jQuery(this).parents('div').each((index, parent) => {
                const el = jQuery(parent);
                if (!el.hasClass('oskari-flyoutcontentcontainer')) {
                    el.css('overflow', 'visible');
                }
            });
        });

        // determine which way the dropdown should open
        if (!this.options.up) {
            selected.on('sumo:opened', (event, params) => {
                const dropdown = this._element.find('div.optWrapper');
                if (dropdown.hasClass('up')) {
                    return;
                }
                const dropdownTop = dropdown.offset().top - jQuery(window).scrollTop();
                const dropdownHeight = dropdown.height();
                const viewportHeight = jQuery(window).height();
                if (dropdownTop + dropdownHeight > viewportHeight) {
                    dropdown.addClass('up');
                }
            });
            selected.on('sumo:closed', () => {
                const dropdown = this._element.find('div.optWrapper');
                dropdown.removeClass('up');
            });
        }
    }

    /**
     * @method _getSumoInstance
     * @return {Object} The SumoSelect instance for the select element.
     */
    _getSumoInstance () {
        return this._element.find('select')[0].sumo;
    }

    /**
     * @method _showEmptySelect
     * Views the noResults placeholder if available.
     * Disables multi select, search and "ok - cancel" functionalities
    */
    _showEmptySelect () {
        const { noResultsText, placeholder } = this.options;
        this.deepReload({
            placeholder: noResultsText || placeholder,
            okCancelInMulti: false,
            search: false,
            multi: false
        });
        this.resetToPlaceholder();
    }

    /**
     * @method _setEnabledImpl or disable select
     * @param { boolean } true = enable
     */
    _setEnabledImpl (enableFlag) {
        enableFlag ? this._getSumoInstance().enable() : this._getSumoInstance().disable();
    }

    /**
     * @method create
     *  creates a select with data specified
     * @param {Object} data, needs to have the keys id and title to construct a list. Optional keys: cls, name.
     * @param {Object} options
     * @return {Object} div element containing the list
     */
    create (data, modifiedOptions) {
        this._element = _selectTemplate.clone();
        const select = this._element.find('select');
        const options = Object.assign({}, defaultOptions, modifiedOptions);
        // preserve original options
        this.options = Object.assign({}, options);
        // Create options
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(cur => select.append(this._createOptionTag(cur)));
        } else {
            options.okCancelInMulti = false;
            options.search = false;
            options.placeholder = options.noResultsText || options.placeholder;
            options.multi = false;
        }
        if (options.multi) {
            select.prop('multiple', true);
        }
        // Initialize SumoSelect
        select.SumoSelect(options);
        // Sumo selects the first value by default. Reset to placeholder.
        this.resetToPlaceholder();
        this._addSumoEventListeners();
        return this._element;
    }

    /**
     * @method setValue
     * @param {String} value
     */
    setValue (value) {
        this._element.find('select').val(value);
        this.update();
    }

    /**
     * @method getValue
     * @param {String} value
     * @return The value, or an array of selected values, if this is a multi select.
     */
    getValue () {
        const value = this._element.find('select').val();
        if (Array.isArray(value)) {
            // cleanup empty placeholder value to an empty array
            return value.filter(function (item) {
                return item !== '';
            });
        }
        return value;
    }

    /**
     * @method selectFirstValue Select the first non-placeholder value
     */
    selectFirstValue () {
        this._getSumoInstance().selectItem(0);
    }

    /**
     * @method selectLastValue Select the last value
     */
    selectLastValue () {
        const lastIndex = this._element.find('select').find('option:last-child').prop('index');
        if (lastIndex || lastIndex === 0) {
            this._getSumoInstance().selectItem(lastIndex);
        }
    }

    /**
     * @method reset
     * Enables all options.
     * @param {Boolean} resetToPlaceholder If true, removes the selected value. Defaults to true.
     */
    reset (resetToPlaceholder = true) {
        this._element.find('select').find('option:disabled').each((index, opt) => {
            jQuery(opt).prop('disabled', false);
        });
        if (resetToPlaceholder) {
            this.resetToPlaceholder();
        } else {
            this._getSumoInstance().reload();
        }
    }

    /**
     * @method resetToPlaceholder
     * Resets selected value.
     */
    resetToPlaceholder () {
        this._element.find('select').val('');
        this.update();
    }

    /**
     * @method update
     * Triggers change on select and reloads UI components.
    */
    update () {
        this._element.find('select').trigger('change');
        this._getSumoInstance().reload();
    }

    /**
     * @method getOptions
     * @return {Object} Object containing keys options and disabled. Both containing a list of jQuery option elements.
     */
    getOptions () {
        const select = this._element.find('select');
        const notEmpty = (index, opt) => opt.value !== '';
        return {
            'options': select.find('option').filter(notEmpty),
            'disabled': select.find('option:disabled')
        };
    }

    /**
     * @method setOptions
     * Set all options elements at once.
     * @param {Array} data to apply
     */
    setOptions (data) {
        const select = this._element.find('select');
        let wasEmpty = select.find('option').length === 0;
        select.empty();
        if (!Array.isArray(data) || data.length === 0) {
            if (!wasEmpty) {
                this._showEmptySelect();
            }
            return;
        }
        data.forEach(cur => select.append(this._createOptionTag(cur)));
        wasEmpty ? this.deepReload() : this._getSumoInstance().reload();
    }

    /**
     * @method addOption appends a new option to the select
     * @param { Object } object with keys id and title
     */
    addOption (data) {
        this._element.find('select').append(this._createOptionTag(data));
        this._getSumoInstance().reload();
    }

    /**  @method removeOption removes an options where value mathces id
     *   @param { Number } id value to remove
     */
    removeOption (id) {
        this._element.find('select').find(`option[value='${id}']`).each((index, opt) => {
            const removeIndex = jQuery(opt).prop('index');
            this._getSumoInstance().removeItem(removeIndex);
        });
    }

    /**
     * @method clearOptions
     * Removes all 'options' elements from component
     */
    clearOptions () {
        this._element.find('select').empty();
        this._showEmptySelect();
    }

    /** @method disableOptions disables options where value matches id
     *   @param { Array } ids array of ids to find
     */
    disableOptions (ids) {
        if (!ids && ids !== 0) {
            return;
        }
        const select = this._element.find('select');
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        ids = ids.map(cur => '' + cur);
        const selectedValue = select.val();
        select.find('option').each((index, opt) => {
            if (ids.includes(opt.value)) {
                jQuery(opt).prop('disabled', true);
                if (opt.value === selectedValue) {
                    select.val('');
                    select.trigger('change');
                }
            }
        });
        this._getSumoInstance().reload();
    }

    /**
     * @method deepReload
     * @param {Object} opt options for the SelectList
     * @param {Boolean} resetToPlaceholder If true, clears the selected value. Defaults to true.
     */
    deepReload (opt, resetToPlaceholder = true) {
        const options = Object.assign({}, this.options, opt || {});
        const select = this._element.find('select');
        this._getSumoInstance().unload();
        select.prop('multiple', !!options.multi);
        select.SumoSelect(options);
        if (resetToPlaceholder) {
            this.resetToPlaceholder();
        }
    }
}
