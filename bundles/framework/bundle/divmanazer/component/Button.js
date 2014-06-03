/**
 * @class Oskari.userinterface.component.Button
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.Button',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.template = jQuery('<input type="button"/>');
        this.title = null;
        this.ui = this.template.clone();
        this.handler = null;
    }, {
        /**
         * @method setTitle
         * Sets the button title
         * @param {String} pTitle title for the button
         */
        setTitle: function (pTitle) {
            this.title = pTitle;
            if (this.ui) {
                this.ui.attr('value', pTitle);
            } else {
                console.err("No UI");
            }
        },
        /**
         * @method addClass
         * Adds a css class to the button
         * @param {String} pClass class to be added
         */
        addClass: function (pClass) {
            this.ui.addClass(pClass);
        },
        /**
         * @method setEnabled
         * Enables/Disables the button
         * @param {Boolean} blnEnabled true to enable, false to disable
         */
        setEnabled: function (blnEnabled) {
            if (blnEnabled === true) {
                this.ui.removeAttr('disabled');
            } else {
                this.ui.attr('disabled', 'disabled');
            }
        },
        /**
         * @method getTitle
         * Returns the panel title
         * @return {String} title for the panel
         */
        getTitle: function () {
            return this.title;
        },
        /**
         * @method setHandler
         * Sets click handler for button
         * @param {Function} pHandler click handler
         */
        setHandler: function (pHandler) {
            if (this.handler) {
                this.ui.unbind('click', this.handler);
            }
            this.handler = pHandler;
            this.ui.bind('click', this.handler);
        },
        /**
         * @method setPrimary
         * Sets primary status of the button
         */
        setPrimary: function (primary) {
            this.ui.toggleClass('primary', primary);
        },
        /**
         * @method destroy
         * Destroys the button/removes it from document
         */
        destroy: function () {
            this.ui.remove();
        },

        /**
         * @method insertTo
         * Adds this button to given container.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            container.append(this.ui);
        },
        /**
         * @method getButton
         * Returns this buttons DOM element.
         * @return {jQuery} reference to DOM element
         */
        getButton: function () {
            return this.ui;
        }
    });
