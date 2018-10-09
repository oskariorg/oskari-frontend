/**
 * @class Oskari.admin.bundle.admin.GenericAdminFlyout
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.admin.bundle.admin.GenericAdminFlyout',
    function () {
        this.tabsContainer = null;
    }, {
        tabs: [{
            'id': 'defaultviews',
            'clazz': 'Oskari.admin.bundle.admin.DefaultViews'
        }],

        /* App specific methods */
        createUI: function () {
            if (this.tabsContainer) {
                return;
            }
            var me = this;
            var tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            this.tabsContainer = tabsContainer;

            _.each(this.tabs, function (tabDef) {
                tabsContainer.addPanel(me.__createTab(tabDef));
            });
            tabsContainer.insertTo(this.getEl());
        },
        __createTab: function (tabDef) {
            var tab = Oskari.clazz.create(tabDef.clazz, this.locale[tabDef.id] || {}, this.instance);
            tab.setId(tabDef.id);
            if (tabDef.title) {
                tab.setTitle(tabDef.title, tabDef.id);
            }
            if (tabDef.content) {
                tab.setContent(tabDef.content);
            }
            if (tabDef.priority) {
                tab.setPriority(tabDef.priority);
            }
            return tab;
        },
        addTab: function (item) {
            // inject the default panel clazz
            item.clazz = 'Oskari.userinterface.component.TabPanel';
            this.tabs.push(item);

            // ui created, add the tab
            if (this.tabsContainer) {
                var tab = this.__createTab(item);
                this.tabsContainer.addPanel(tab);
            }
        },

        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.personaldata.request.AddTabRequestHandler} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            this.addTab({'title': request.getTitle(), 'content': request.getContent(), 'priority': request.getPriority(), 'id': request.getId()});
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
