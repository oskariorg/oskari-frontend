/**
 * @class Oskari.elf.license.validator.NumberValidator
 */
Oskari.clazz.define('Oskari.elf.license.validator.NumberValidator',
    function(instance, allowDecimal, allowNegative) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this._allowDecimal = allowDecimal;
        this._allowNegative = allowNegative;

    }, {
        __name: 'elf-license.NumberValidator',
        __qname: 'Oskari.elf.license.validator.NumberValidator',
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
         * Initializes the service
         * @method init
         * @public
         */
        init: function () {
            var me = this;
            if(me._allowDecimal === null) {
                me._allowDecimal = true;
            }

            if(me._allowNegative === null) {
                me._allowNegative = true;
            }
        },
        /**
         * Key listener
         * @method keyListener
         * @public
         *
         * @param {Object} evt event object
         */
        keyListener: function(evt){
            var me = this,
                target = jQuery(evt.target),
                prev_val = target.val();

            setTimeout(function(){
                var chars = target.val().split(''),
                    decimal_exist = !me._allowDecimal,
                    negative_exist = !me._allowNegative,
                    remove_char = false;

                jQuery.each(chars, function(key, value){
                    switch(value){
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '.':
                    case ',':
                    case '-':
                        if (value === '.' || value === ','){
                            if(decimal_exist === false){
                                decimal_exist = true;
                            } else{
                                remove_char = true;
                                chars[''+key+''] = '';
                            }
                        }

                        if(value === '-'){
                            if(negative_exist === false){
                                negative_exist = true;
                            } else{
                                remove_char = true;
                                chars[''+key+''] = '';
                            }
                        }
                        break;
                    default:
                        remove_char = true;
                        chars[''+key+''] = '';
                        break;
                    }
                });

                if(prev_val !== target.val() && remove_char === true) {
                    target.val(chars.join(''));
                }
            }, 0);
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
