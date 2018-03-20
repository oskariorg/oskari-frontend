/**
 * @class Oskari.userinterface.component.Fieldset
 * Generic form component
 */
Oskari.clazz.define('Oskari.userinterface.component.Fieldset',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        
        var me = this;
        me._clazz = 'Oskari.userinterface.component.Fieldset';
        me._element = document.createElement('fieldset');
        me._titleEl = document.createElement('legend');
        me._element.className = 'oskari-formcomponent oskari-fieldset';
        me._titleEl.style.display = 'none';
        me._element.appendChild(me._titleEl);
    }, {
        _destroyImpl: function (cleanup) {
            
            var i,
                components = this.getComponents();

            for (i = components.length - 1; i >= 0; i -= 1) {
                components.pop().destroy(cleanup);
            }
        },

        /**
         * @method isEnabled
         * @return {Boolean} enabled
         */
        isEnabled: function () {
            
            return !this._element.disabled;
        },

        /**
         * @method setEnabled
         * @param {Boolean} enabled
         */
        setEnabled: function (enabled) {
            
            if (typeof enabled !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setEnabled: enabled is not a boolean'
                );
            }
            this._element.disabled = !enabled;
        },

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
        }
    }, {
        extend: ['Oskari.userinterface.component.Container']
    }
);