/**
 * @class Oskari.analysis.bundle.analyse.Flyout
 *
 * Request analyse flyout. The flyout shows options for analyse actions
 *
 * Oskari.analysis.bundle.analyse.view.StartView (shown for logged in users).
 */
Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     * Reference to component that created the flyout
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.template = null;
        this.view = null;
    }, {
        /**
         * @public @method getName
         *
         *
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.analysis.bundle.analyse.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('analyse')) {
                jQuery(this.container).addClass('analyse');
            }
        },

        /**
         * @public @method startPlugin
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         *
         */
        startPlugin: function () {
            this.template = jQuery('<div></div>');
        },

        /**
         * @public @method stopPlugin
         * Interface method implementation, does nothing atm
         *
         *
         */
        stopPlugin: function () {},

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('flyouttitle');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @public @method getOptions
         * Interface method implementation, does nothing atm
         *
         *
         */
        getOptions: function () {},

        /**
         * @public @method setState
         * Interface method implementation, does nothing atm
         *
         * @param {Object} state
         * State that this component should use
         *
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @public @method createUi
         * Creates the UI for a fresh start.
         * Selects the view to show based on user (guest/loggedin)
         *
         *
         */
        createUi: function () {
            this.view = Oskari.clazz.create(
                'Oskari.analysis.bundle.analyse.view.StartView',
                this.instance,
                this.instance.getLocalization('StartView')
            );
        },

        /**
         * @public @method refresh
         *
         *
         */
        refresh: function () {
            var flyout = jQuery(this.container),
                sandbox = this.instance.getSandbox(),
                WFSSelections = sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService').getWFSSelections(),
                layersWithFeaturesCount = _.map(WFSSelections, 'layerId').length;

            flyout.empty();

            if (!Oskari.user().isLoggedIn()) {
                this.view = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.NotLoggedIn',
                    this.instance,
                    this.instance.getLocalization('NotLoggedView'));
            }
            // Show info or not
            if (jQuery.cookie('analyse_info_seen') !== '1' || layersWithFeaturesCount > 1) {
                this.view.render(flyout);
                flyout.parent().parent().css('display', '');
            } else {
                this.instance.setAnalyseMode(true);
            }
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
