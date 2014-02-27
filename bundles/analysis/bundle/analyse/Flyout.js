/**
 * @class Oskari.analysis.bundle.analyse.Flyout
 *
 * Request analyse flyout. The flyout shows options for analyse actions
 *
 * Oskari.analysis.bundle.analyse.view.StartView (shown for logged in users).
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
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
            return 'Oskari.analysis.bundle.analyse.Flyout';
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
            if (!jQuery(this.container).hasClass('analyse')) {
                jQuery(this.container).addClass('analyse');
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

            this.view = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.StartView',
                this.instance,
                this.instance.getLocalization('StartView'));
        },

        refresh: function () {
            var flyout = jQuery(this.container);
            flyout.empty();
            var sandbox = this.instance.getSandbox();

            if (!sandbox.getUser().isLoggedIn()) {
                this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer',
                this.instance.getLocalization('notLoggedIn'));
                this.tabsContainer.insertTo(flyout);
                return;
            }
            // Show info or not
            if (jQuery.cookie('analyse_info_seen') !== '1') {
                this.view.render(flyout);
                flyout.parent().parent().css('display', '');
            } else {
                this.instance.setAnalyseMode(true);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });