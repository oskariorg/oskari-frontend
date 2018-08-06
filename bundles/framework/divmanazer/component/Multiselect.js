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
                                '</div>' +
                            '</div>';
        this.element = null;
    },
    {
        getElement: function () {
            return this.element;
        },
        getValue: function () {
            return this.element.find('.ui.dropdown').dropdown('get value');
        },
        setValue: function (value) {
            return this.element.find('.ui.dropdown').dropdown('set value', value);
        },
        create: function (options, placeholder, checkboxBoolean) {
            var list = jQuery(this.multiselect);
            var arr = this.getArrayFromOptions(options);

            this.element = list;
            this.element.find('.ui.dropdown').dropdown({
                placeholder: placeholder,
                values: arr
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
