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
        'use strict';
        var me = this;
        me._clazz = 'Oskari.userinterface.component.Fieldset';
        me._element = document.createElement('fieldset');
        me._titleEl = document.createElement('legend');
        me._element.className = 'oskari-formcomponent oskari-fieldset';
        me._titleEl.style.display = 'none';
        me._element.appendChild(me._titleEl);
    }, {
        _destroyImpl: function (cleanup) {
            'use strict';
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
            'use strict';
            return !this._element.disabled;
        },

        /**
         * @method setEnabled
         * @param {Boolean} enabled
         */
        setEnabled: function (enabled) {
            'use strict';
            if (typeof enabled !== 'boolean') {
                throw new TypeError(
                    this.getClazz() +
                        '.setEnabled: enabled is not a boolean'
                );
            }
            this._element.disabled = !enabled;
        },

        getTitle: function () {
            'use strict';
            return this._titleEl.textContent;
        },

        /**
         * @method setTitle
         */
        setTitle: function (title) {
            'use strict';
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