/**
 * @class Oskari.mapframework.bundle.publisher2.Flyout
 *
 * Renders the "publisher" flyout. The flyout shows different view
 * depending of application state. Currently implemented views are:
 * Oskari.mapframework.bundle.publisher2.view.NotLoggedIn (shown for guests) and
 * Oskari.mapframework.bundle.publisher2.view.StartView (shown for logged in users).
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher2.PublisherBundleInstance} instance
     *      reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.template = jQuery('<div></div>');
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.Flyout';
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.getEl().addClass('publisher');
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by divmanazer)
         * Creates the UI for a fresh start.
         * Selects the view to show based on user (guest/loggedin)
         */
        lazyRender: function () {
            var me = this,
                flyout = jQuery(this.container);
            flyout.empty();

            // check if the user is logged in
            if (!Oskari.user().isLoggedIn()) {
                this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.FlyoutNotLoggedIn',
                    this.instance,
                    this.instance.getLocalization('NotLoggedView'));
            } else {
                // proceed with publisher view
                this.view = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.FlyoutStartView',
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
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });