/**
 * @class Oskari.elf.license.elements.ParamEnumElement
 */
Oskari.clazz.define('Oskari.elf.license.elements.ParamEnumElement',
    function(instance, validator) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this._templates = {
            licenseUserData: jQuery('<tr><td class="elf_license_user_data_label"></td><td class="elf_license_user_data"></td></tr>'),
            licenseInput: jQuery('<div class="elf_license_input"></div>')
        };
        this._validator = validator;
    }, {
        __name: 'elf-license.ParamEnumElement',
        __qname: 'Oskari.elf.license.elements.ParamEnumElement',
        /**
         * Get Qualified name
         * @method getQName
         * @public
         */
        getQName: function () {
            return this.__qname;
        },
        /**
         * Get name
         * @method getName
         * @public
         */
        getName: function () {
            return this.__name;
        },
        /**
         * Initializes the elements
         * @method init
         * @public
         */
        init: function () {},
        /**
         * Get enum element. Can be a radio button group or checkbox list.
         * @method getElement
         * @public
         *
         * @param {Object} param the license model param
         *
         * @return {Object} jQuery element object
         */
        getElement: function (param, readOnly) {
            var me = this,
                element = me._templates.licenseUserData.clone(),
                title = param.title,
                data = me._templates.licenseInput.clone(),
                readOnlyElement = jQuery('<span></span>'),
                showInput = true;

            if(readOnly && readOnly === true) {
                showInput = false;
            }

            if(title === null) {
                title = param.name;
            }

            if(showInput === true) {
                // Radio button list
                if(param.multi === false) {
                    jQuery.each(param.options, function(index, value){
                        data.append('<input type="radio" name="'+param.name+'" value="'+value+'">' + value + '<br>');
                    });

                    data.find('input').first().prop("checked", true);
                }
                // Checkbox list
                else {
                    jQuery.each(param.options, function(index, value){
                        data.append('<input type="checkbox" name="'+param.name+'" value="'+value+'">' + value + '<br>');
                    });
                }
            } else {
                if(param.selections.length>0) {
                    var list = jQuery('<div class="license_enum_list"></div>');

                    jQuery.each(param.selections, function(index, value){
                        var valueEl = readOnlyElement.clone();
                        valueEl.attr('data-value', value);
                        valueEl.html(value);
                        list.append(valueEl);
                        if(param.multi === true && index < param.selections.length-1) {
                            list.append(', ');
                        }
                    });

                    data.append(list);
                }
            }

            // Add data to element
            data.attr('data-name', param.name);
            data.attr('data-title', title);
            data.attr('data-element-type', 'enum');
            data.attr('data-read-only', readOnly);

            element.find('.elf_license_user_data_label').html(title);
            element.find('.elf_license_user_data').html(data);

            return element;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
