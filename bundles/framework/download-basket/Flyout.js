/**
 * @class Oskari.mapframework.bundle.downloadBasket.Flyout
 *
 */
/**
 * @class Oskari.mapframework.bundle.downloadBasket.Flyout
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.downloadBasket.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.mapframework.bundle.downloadBasket}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.container = null;
        this.state = {};
        this.tabsContainer = null;
        this._localization = this.instance.getLocalization('flyout');
    }, {
        /**
         * @method getName
         * @public
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.downloadBasket.Flyout';
        },

        /**
         * Interface method implementation
         * @public @method setEl
         * @param {Object} el reference to the container in browser         *
         */
        setEl: function (el) {
            this.container = jQuery(el[0]);
            this.container.addClass('download-basket');

        },
        /**
        * Interface method implementation, assigns the HTML templates
        * that will be used to create the UI
        * @public @method startPlugin
        */
        startPlugin: function () {
            this.createUI();
        },
        /**
         * Creates UI
         * @method createUI
         * @public
         */
        createUI: function () {
            if (this.tabsContainer) {
                return;
            }
            var me = this;
            var tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            tabsContainer.addTabChangeListener(me.tabChanged);
            me.tabsContainer = tabsContainer;

            tabsContainer.addPanel(me.instance.cropping);
            tabsContainer.addPanel(me.instance.basket);
            tabsContainer.insertTo(me.container);
        },
        /**
         * Handles tab changes
         * @method tabChanged
         * @public
         * @param  {Object}   previous previous tab
         * @param  {Object}   current  current tab
         */
        tabChanged: function(previous, current){
            if(current.getId() === 'download-basket-tab'){
                current.createBasket();
            }
        },

         /**
         * Gets event handlers
         * @method getEventHandlers
         * @public
         */
        getEventHandlers: function () {

        },

        /**
         * On event
         * @method onEvent
         * @param  {Object} event
         */
        onEvent: function (event) {

        },

        /**
         * Interface method implementation, does nothing atm
         * @method stopPlugin
         * @public
         */
        stopPlugin: function () {

        },

        /**
         * Gets localization
         * @method _getLocalization
         * @private
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },


        /**
         * Gets title
         * @method getTitle
         * @public
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this._getLocalization('title');
        },

        /**
         * Gets description
         * @method getDescription
         * @public
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this._getLocalization('desc');
        },

        /**
         * Interface method implementation, does nothing atm
         * @method getOptions
         * @public
         */
        getOptions: function () {

        },

        /**
         * Interface method implementation, does nothing atm
         * @method setState
         * @public
         * @param {Object} state state that this component should use
         */
        setState: function (state) {
            this.state = state;

        },
        /**
         * @method refresh
         * @public
         */
        refresh: function () {

        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
