/**
 * @class Oskari.mapframework.bundle.personaldata.AccountTab
 * Renders the "Search" tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.SearchTab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.search.PersonalDataBundleInstance} instance
     *     reference to component that created the tab
     */

    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.tabsContainer = undefined;
        this.template = jQuery('<div class="search"></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            return this.loc.title;
        },
        getTabsContainer: function () {
            return this.tabsContainer;
        },
        getContent: function () {
            return this.tabsContainer.ui;
        },
        initContainer: function () {
            var me = this;
            me.tabsContainer = { ui: this.template.clone() };
        },

        addTabContent: function (container) {
            var me = this;
            me.initTabContent();
            container.append(me.tabsContainer.ui);
        },

        _createSearchTab: function (container) {

        }
    });
