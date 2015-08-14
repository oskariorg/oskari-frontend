/**
 * @class Oskari.mapframework.bundle.parcel.Flyout
 *
 * Request parcel print flyout. The flyout shows remarks for parcel print
 *
 * Oskari.mapframework.bundle.parcel.view.StartPrintView.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
     *      reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;

        this.template = null;
        this.view = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.parcel.Flyout';
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
            if (!jQuery(this.container).hasClass('parcelprint')) {
                jQuery(this.container).addClass('parcelprint');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.template = jQuery('<div></div>');
        },
        /**
         * @method stopPlugin
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {},
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('flyouttitle');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {},
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
         * @method createUi
         * Creates the UI for a fresh start.
         * Selects the view to show based on user (guest/loggedin)
         */
        createUi: function () {
            var me = this;

            this.view = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.view.StartPrintView',
                this.instance,
                this.instance.getLocalization('StartPrintView'));
        },

        refresh: function () {
            var flyout = jQuery(this.container);
            flyout.empty();

            // Show info or not
            if (jQuery.cookie('parcelprint_info_seen') !== '1') {
                this.view.render(flyout);
                flyout.parent().parent().css('display', '');
            } else {
                this.instance.setParcelPrintMode(true);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });