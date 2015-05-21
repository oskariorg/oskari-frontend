/**
 * @class Oskari.elf.license.elements.ParamIntElement
 */
Oskari.clazz.define('Oskari.elf.license.elements.ParamIntElement',
    function(instance, validator) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this._templates = {
            licenseUserData: jQuery('<tr><td class="elf_license_user_data_label"></td><td class="elf_license_user_data"></td></tr>'),
            licenseInput: jQuery('<div class="elf_license_input"></div>')
        };
        this._validator = validator;
    }, {
        __name: 'elf-license.ParamIntElement',
        __qname: 'Oskari.elf.license.elements.ParamIntElement',
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
         * Get int element
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
                input = null,
                readOnlyElement = jQuery('<div></div>'),
                showInput = true;

            if(readOnly) {
                showInput = false;
            }

            if (title === null) {
                title = param.name;
            }

            if(showInput) {
                data.append('<input type="text"></input>');
                input = data.find('input');
                input.val(param.value);
                input.on('keydown keyup keypress change blur focus paste', function(evt) {
                    me._validator.number.keyListener(evt);
                });
                title += ' <span class="elf_license_required">*</span>';
            } else {
                var valueEl = readOnlyElement.clone();
                valueEl.attr('data-value', param.value);
                valueEl.html(param.value);
                data.append(valueEl);
            }

            // Add data to element
            data.attr('data-name', param.name);
            data.attr('data-title', param.title || param.name);
            data.attr('data-element-type', 'int');
            data.attr('data-read-only', readOnly);

            element.find('.elf_license_user_data_label').html(title);
            element.find('.elf_license_user_data').html(data);
            return element;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
