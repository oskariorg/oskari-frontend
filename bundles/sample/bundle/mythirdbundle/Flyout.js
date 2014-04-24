/**
 * @class Oskari.sample.bundle.mythirdbundle.Flyout
 */
Oskari.clazz.define('Oskari.sample.bundle.mythirdbundle.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.sample.bundle.mythirdbundle.FlyoutHelloWorldBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.template = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.sample.bundle.mythirdbundle.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('mythirdbundle')) {
                jQuery(this.container).addClass('mythirdbundle');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
            this.template = jQuery('<div></div>');
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('flyouttitle');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method createUI
         * Creates the UI for a fresh start
         */
        createUI: function () {
            var me = this,
                sandbox = me.instance.getSandbox();

            // clear container
            var cel = jQuery(this.container);
            cel.empty();
            var content = this.template.clone();
            content.append(this.instance.getLocalization('flyout').sayHello);
            cel.append(content);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
