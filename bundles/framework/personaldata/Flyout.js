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
            var me = this;
            // TODO: move these to correct bundle and use AddTabRequest to add itself to PersonalData
            this.tabsData = {
                'myviews': Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.MyViewsTab', me.instance),
                'publishedmaps': Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.PublishedMapsTab', me.instance),
                // TODO should we pass conf to accounttab here?
                'account': Oskari.clazz.create('Oskari.mapframework.bundle.personaldata.AccountTab', me.instance)
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
            var me = this;
            // clear container
            var flyout = jQuery(this.container);

            var notLoggedInFullText = this.instance.getLocalization('notLoggedIn');
            var conf = this.instance.conf || {};

            // in analyse/publisher it's conf.loginUrl - in here it's conf.logInUrl !!
            var loginUrl = Oskari.getLocalized(conf.logInUrl) || Oskari.urls.getLocation('login');
            if (loginUrl) {
                notLoggedInFullText += '<br/><br/>' +
                    '<a href="' + loginUrl + '">' + this.instance.getLocalization('notLoggedInText') + '</a>';
            }
            var registerUrl = Oskari.urls.getLocation('register');
            if (registerUrl) {
                notLoggedInFullText += '<br/><br/>' +
                    '<a href="' + registerUrl + '">' + this.instance.getLocalization('register') + '</a>';
            }

            flyout.empty();

            this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', notLoggedInFullText);

            this.tabsContainer.insertTo(flyout);

            if (!Oskari.user().isLoggedIn()) {
                return;
            }

            // now we can presume user is logged in
            Object.keys(this.tabsData).forEach(function (tabId) {
                var tab = me.tabsData[tabId];
                var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                panel.setTitle(tab.getTitle());
                panel.setId(tabId);
                tab.addTabContent(panel.getContainer());

                // binds tab to events
                if (tab.bindEvents) {
                    tab.bindEvents();
                }
                me.tabsContainer.addPanel(panel);
            });
        },

        /**
         *
         *
         */
        addTab: function (item) {
            if (!Oskari.user().isLoggedIn()) {
                return;
            }
            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(item.title);
            panel.setContent(item.content);
            panel.setId(item.id);
            this.tabsContainer.addPanel(panel, item.first);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
