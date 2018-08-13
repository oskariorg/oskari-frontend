/**
 * @class Oskari.userinterface.component.Multiselect
 * 
 * https://semantic-ui.com/modules/dropdown.html#behavior
 */
Oskari.clazz.define('Oskari.userinterface.component.Multiselect',

    function () {
        this.multiselect = '<div>' +
                                '<div class="ui multiple selection fluid dropdown"> ' +
                                '    <div class="text"></div>' +
                                '    <i class="dropdown icon"></i>' +
                                '          <div class="menu"></div>' +
                                '</div>' +
                            '</div>';
        this.element = null;
    },
    {
        getElement: function () {
            return this.element;
        },
        getValue: function () {
            return this.element.find('.menu').dropdown('get value');
        },
        setValue: function (value) {
            return this.element.find('.menu').dropdown('set value', value);
        },
        getOptions: function () {
            var main = this.element.find('.main');
            // filter away the placeholder
            var options = main.find('.item').filter(function (item) {
                return this.value !== '';
            });
            var disabled = main.find('option:disabled');
            return {
                'options': options,
                'disabled': disabled
            };
        },
        disableOptions: function (ids) {
            var main = this.element.find('.main');

            this.reset(true);
    
            var isDisabledOption = function (optionId) {
                return ids.some(function (id) {
                    return '' + id === optionId;
                });
            }
            main.find('.item').each(function (index, opt) {
                if (isDisabledOption(opt.value)) {
                    jQuery(opt).attr('disabled', true);
                }
            });
        },
        create: function (options, placeholder, checkboxBoolean) {
            var list = jQuery(this.multiselect);
            var arr = this.getArrayFromOptions(options);

            this.element = list;
            this.element.find('.ui.dropdown').dropdown({
                placeholder: placeholder,
                values: arr,
                performance: true
            });
            if (checkboxBoolean) {
                var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
                checkbox.setTitle('Select all');
                checkbox.setChecked(false);
                this.element.append(checkbox.getElement());
                var me = this;
                checkbox.setHandler(function () {
                    if (checkbox.isChecked()) {
                        me.selectAll();
                    } else {
                        me.reset();
                    }
                });
            }
        },
        getArrayFromOptions: function (options) {
            var arr = [];
            if (options) {
                options.forEach(function (option) {
                    arr.push({
                        name: option.name,
                        value: option.id
                    });
                });
            }
            return arr;
        },
        updateOptions: function (options) {
            var arr = this.getArrayFromOptions(options);
            this.element.find('.ui.dropdown').dropdown({ values: arr });
        },
        reset: function () {
            this.element.find('.ui.dropdown').dropdown('clear');
        },
        limitSelectionAmount: function (number) {
            this.element.find('.ui.dropdown').dropdown({
                maxSelections: number
            });
        },
        selectAll: function () {
            var options = this.element.find('.ui.dropdown > .menu > .item').toArray().map(function (item) {
                return item.dataset.value;
            });
            this.element.find('.ui.dropdown').dropdown('set exactly', options);
        }
    },
    {
    });
