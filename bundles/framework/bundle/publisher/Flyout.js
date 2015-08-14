/**
 * @class Oskari.mapframework.bundle.publisher.Flyout
 *
 * Renders the "publisher" flyout. The flyout shows different view
 * depending of application state. Currently implemented views are:
 * Oskari.mapframework.bundle.publisher.view.NotLoggedIn (shown for guests) and
 * Oskari.mapframework.bundle.publisher.view.StartView (shown for logged in users).
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
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
            return 'Oskari.mapframework.bundle.publisher.Flyout';
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
            if (!jQuery(this.container).hasClass('publisher')) {
                jQuery(this.container).addClass('publisher');
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
            var me = this,
                flyout = jQuery(this.container),
                sandbox = me.instance.getSandbox();
            flyout.empty();

            // check if the user is logged in 
            if (!sandbox.getUser().isLoggedIn()) {
                this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.NotLoggedIn',
                    this.instance,
                    this.instance.getLocalization('NotLoggedView'));
            } else {
                // proceed with publisher view
                this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.StartView',
                    this.instance,
                    this.instance.getLocalization('StartView'));
            }

            this.view.render(flyout);
        },
        /**
         * @method handleLayerSelectionChanged
         * Calls the current views handleLayerSelectionChanged method if one is defined
         */
        handleLayerSelectionChanged: function () {
            if (this.view && this.view.handleLayerSelectionChanged) {
                this.view.handleLayerSelectionChanged();
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });