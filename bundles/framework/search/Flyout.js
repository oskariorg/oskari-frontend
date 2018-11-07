/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.search.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.search.SearchBundleInstance}
     * Instance reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;

        // Actions that get added to the search result popup
        this.resultActions = {};

        this._searchContainer = null;
        this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.search.Flyout';
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
            if (!jQuery(this.container).hasClass('search')) {
                jQuery(this.container).addClass('search');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
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
         * @method getTabTitle
         * @return {String} localized text for the tab title
         */
        getTabTitle: function () {
            return this.instance.getLocalization('tabTitle');
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
        getOptions: function () {

        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            this.getDefaultUI().setState(state);
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            return this.getDefaultUI().getState();
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                flyout = jQuery(this.container);
            me.tabsContainer.addTabChangeListener(
                function (previousTab, newTab) {
                    // Make sure this fires only when the flyout is open
                    if (!flyout.parents('.oskari-flyout.oskari-closed').length) {
                        var searchInput = newTab.getContainer().find('input[type=text]');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                    var eventBuilder = Oskari.eventBuilder('Search.TabChangedEvent'),
                        previousTabId = previousTab ? previousTab.getId() : null,
                        newTabId = newTab ? newTab.getId() : null,
                        event = eventBuilder(previousTabId, newTabId);

                    sandbox.notifyAll(event);
                }
            );

            // Do not create the default UI if configured so
            if (this.instance.disableDefault) {
                return;
            }

            var defaultUI = this.getDefaultUI();
            defaultUI.createUi(me.container);
        },
        getDefaultUI: function () {
            if (!this._defaultUI) {
                this._defaultUI = Oskari.clazz.create('Oskari.mapframework.bundle.search.DefaultView', this.instance);
            }
            return this._defaultUI;
        },

        focus: function () {
            this.getDefaultUI().focus();
        },

        /**
         *
         *
         */
        addTab: function (item) {
            var me = this,
                flyout = jQuery(me.container);
            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);

                if (me.instance.disableDefault !== true) {
                    var defaultPanel = Oskari.clazz.create(
                            'Oskari.userinterface.component.TabPanel'
                        ),
                        searchContainer = jQuery('div.searchContainer');

                    defaultPanel.setTitle(
                        me.getTabTitle(),
                        'oskari_search_tabpanel_header'
                    );
                    defaultPanel.setContent(searchContainer);
                    defaultPanel.setId('oskari_search_tabpanel_header');
                    defaultPanel.setPriority(me.instance.tabPriority);
                    me.tabsContainer.addPanel(defaultPanel);
                }
            }

            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(item.title, item.id);
            panel.setId(item.id);
            panel.setContent(item.content);
            panel.setPriority(item.priority);
            me.tabsContainer.addPanel(panel);
        },
        handleSearchResult: function (isSuccess, result, searchedFor) {
            this.getDefaultUI().handleSearchResult(isSuccess, result, searchedFor);
        },
        addSearchResultAction: function (action) {
            this.getDefaultUI().addSearchResultAction(action);
        },

        removeSearchResultAction: function (name) {
            this.getDefaultUI().removeSearchResultAction(name);
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
