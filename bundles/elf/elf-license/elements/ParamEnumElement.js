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

            if(readOnly) {
                showInput = false;
            }

            if(title === null) {
                title = param.name;
            }

            if(showInput) {
                // Radio button list
                if(!param.multi) {
                    jQuery.each(param.options, function(index, value){
                        data.append('<input type="radio" name="'+param.name+'" value="'+value+'">' + me.getElementLabel(param, value) + '<br>');
                    });

                    data.find('input').first().prop("checked", true);
                    title += ' <span class="elf_license_required">*</span>';
                }
                // Checkbox list
                else {
                    jQuery.each(param.options, function(index, value){
                        data.append('<input type="checkbox" name="'+param.name+'" value="'+value+'">' + me.getElementLabel(param, value) + '<br>');
                    });
                }
            } else {
                if(param.selections.length>0) {
                    var list = jQuery('<div class="license_enum_list"></div>');

                    jQuery.each(param.selections, function(index, value){
                        var valueEl = readOnlyElement.clone();
                        var textValue = me.getElementLabel(param, value);
                        valueEl.attr('data-value', value);
                        valueEl.html(textValue);
                        list.append(valueEl);
                        if(param.multi && index < param.selections.length-1) {
                            list.append(', ');
                        }
                    });

                    data.append(list);
                }
            }

            // Add data to element
            data.attr('data-name', param.name);
            data.attr('data-title', param.title || param.name);
            data.attr('data-element-type', 'enum');
            data.attr('data-read-only', readOnly);
            data.attr('data-multi', param.multi);

            element.find('.elf_license_user_data_label').html(title);
            element.find('.elf_license_user_data').html(data);

            return element;
        },
        /**
         * Returns a localised label for the license's duration options. The original value is returned for everything else.
         */
        getElementLabel: function(param, value) {
            if (param.name === 'LICENSE_DURATION' && value && value.length) {
                //value is of form P[int][D/W/M/Y]
                var me = this,
                    duration = value.substring(1, value.length - 1),
                    unit = value[value.length - 1],
                    durationLocalisation = null,
                    durationSplit;

                if (!duration || isNaN(duration)) {
                    return value;
                }
                if (duration && unit) {
                    durationLocalisation = me.instance._locale.dialog.licenseDurations[unit.toUpperCase()];
                    if (durationLocalisation) {
                        return duration + ' ' + durationLocalisation;
                    } else {
                        return value;
                    }
                }
            }
            return value;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
