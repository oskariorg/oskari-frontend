/**
 * @class Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout
 *
 */
Oskari.clazz.define('Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.tampere.bundle.tampere.AdminWfsSearchChannel}
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
         tabs: [{
            'id': 'admin-wfs-search-channel-tab',
            'clazz': 'Oskari.tampere.bundle.tampere.admin-wfs-search-channel.Channels'
        }],
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         * Reference to the container in browser
         * @param {Number} width
         * Container size(?) - not used
         * @param {Number} height
         * Container size(?) - not used
         *
         */
        setEl: function (el, width, height) {
            this.container = jQuery(el[0]);
            // if (!jQuery(this.container).hasClass('admin__wfs-search-channel')) {
            //     jQuery(this.container).addClass('admin__wfs-search-channel');
            // }
        },
        /**
        * @public @method startPlugin
        * Interface method implementation, assigns the HTML templates
        * that will be used to create the UI
        *
        *
        */
        startPlugin: function () {
        },
        /* App specific methods */
        createUI: function () {
            if (this.tabsContainer) {
                return;
            }
            var me = this,
                tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            this.tabsContainer = tabsContainer;

            _.each(this.tabs, function (tabDef) {
                var tab = Oskari.clazz.create(tabDef.clazz, me._getLocalization(tabDef.id), me.instance);
                tab.setId(tabDef.id);
                tabsContainer.addPanel(tab);
                tabDef.instance = tab;
            });
            tabsContainer.insertTo(this.container);
        },
        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },
        /**
         * @public @method stopPlugin
         * Interface method implementation, does nothing atm
         *
         *
         */
        stopPlugin: function () {

        },

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this._getLocalization('title');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this._getLocalization('desc');
        },

        /**
         * @public @method getOptions
         * Interface method implementation, does nothing atm
         *
         *
         */
        getOptions: function () {

        },

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
         * @method refresh
         * utitity to temporarily support rightjs sliders (again)
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
