/**
 * @class Oskari.userinterface.component.Multiselect
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
        create: function (options) {
            var list = jQuery(this.multiselect);
            var arr = [];
            options.forEach(function (option) {
                arr.push({
                    name: option.name,
                    value: option.id
                });
            });
            this.element = list;
            this.element.find('.ui.dropdown').dropdown({
                values: arr
            });

            var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
            checkbox.setTitle('Select all');
            checkbox.setChecked(false);
            this.element.append(checkbox.getElement());
            var me = this;
            checkbox.setHandler(function () {
                debugger;
                if (checkbox.isChecked()) {
                    me.selectAll();
                } else {
                    me.clear();
                }
            });
        },
        clear: function () {
            this.element.dropdown('clear');
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
