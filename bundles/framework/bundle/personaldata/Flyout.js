/**
 * @class Oskari.mapframework.bundle.personaldata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
     *     reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;

        this.template = null;
        this.templateTabHeader = null;
        this.templateTabContent = null;
        this.tabsData = [];

    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.personaldata.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('personaldata')) {
                jQuery(this.container).addClass('personaldata');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this,
                tabsLocalization = me.instance.getLocalization('tabs');
            // TODO: move these to correct bundle and use AddTabRequest to add itself to PersonalData
            this.tabsData = {
                "myPlaces": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyPlacesTab', me.instance, tabsLocalization.myplaces),
                "myViews": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', me.instance, tabsLocalization.myviews),
                "publishedMaps": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', me.instance, tabsLocalization.publishedmaps),
                // TODO should we pass conf to accounttab here?
                "account": Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.AccountTab', me.instance, tabsLocalization.account)
            };
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
            return this.instance.getLocalization('title');
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
         *     state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                flyout = jQuery(this.container), // clear container
                tabId,
                tab,
                panel;
            flyout.empty();
            this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer',
                this.instance.getLocalization('notLoggedIn'));
            this.tabsContainer.insertTo(flyout);

            if (!sandbox.getUser().isLoggedIn()) {
                return;
            }

            // now we can presume user is logged in
            for (tabId in this.tabsData) {
                if (this.tabsData.hasOwnProperty(tabId)) {
                    tab = this.tabsData[tabId];
                    panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                    panel.setTitle(tab.getTitle());

                    // Eikö sen pitäisi asettaa tabin contentti paneliin?
                    // panel.setContent(tab.getContent());
                    // sen sijaan että addTabContentille annetaan container mihin dom ammutaan?
                    tab.addTabContent(panel.getContainer());
                    // binds tab to events
                    if (tab.bindEvents) {
                        tab.bindEvents();
                    }
                    this.tabsContainer.addPanel(panel);
                }
            }
        },

        /**
         *
         *
         */
        addTab: function (item) {
            var sandbox = this.instance.getSandbox(),
                panel;
            if (!sandbox.getUser().isLoggedIn()) {
                return;
            }
            panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(item.title);
            panel.setContent(item.content);
            this.tabsContainer.addPanel(panel, item.first);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });