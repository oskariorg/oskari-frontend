/**
 * @class Oskari.admin.bundle.admin.GenericAdminFlyout
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.admin.bundle.admin.GenericAdminFlyout',
    function() {
        this.tabsContainer = null;
    }, {
        tabs : [{
            'id' : 'defaultviews',
            'clazz' : 'Oskari.admin.bundle.admin.DefaultViews'
        }],

        /* App specific methods */
        createUI : function () {
            if(this.tabsContainer) {
                return;
            }
            var me = this;
            var tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            this.tabsContainer = tabsContainer;

            _.each(this.tabs, function(tabDef) {
                var tab = Oskari.clazz.create(tabDef.clazz, me.locale[tabDef.id], me.instance);
                tab.setId(tabDef.id);
                tabsContainer.addPanel(tab);
            });
            tabsContainer.insertTo(this.getEl());
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });