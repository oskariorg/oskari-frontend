/**
 * @class Oskari.mapframework.bundle.admin-users.Flyout
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param
     * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
     * instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.container = null;
        this.state = {};
        this.tabsContainer = null;
        this._localization = this.instance.getLocalization('flyout');
    }, {
        tabs : [{
            'id' : 'adminusers',
            'clazz' : 'Oskari.mapframework.bundle.admin-users.AdminUsers'
            }, {
            'id' : 'adminroles',
            'clazz' : 'Oskari.mapframework.bundle.admin-users.AdminRoles'
            },
        ],
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.admin-users.Flyout';
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
            this.container = jQuery(el[0]);
            /**
            if (!this.container.hasClass('admin-users')) {
                this.container.addClass('admin-users');
            }
            */
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.createUI();
        },


        /* App specific methods */
        createUI : function () {
            if(this.tabsContainer) {
                return;
            }
            var me = this;
            var tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            this.tabsContainer = tabsContainer;

            _.each(this.tabs, function(tabDef) {
                var tab = Oskari.clazz.create(tabDef.clazz, me._getLocalization(tabDef.id), me.instance);
                tab.setId(tabDef.id);
                tabsContainer.addPanel(tab);
                tabDef.instance = tab;
            });
            tabsContainer.insertTo(this.container);
        },
        getEventHandlers : function() {
            var list = {};
            _.each(this.tabs, function(tabDef) {
                if(tabDef.instance.eventHandlers) {
                    for (var p in tabDef.instance.eventHandlers) {
                        list[p] = true;
                    }
                }
            });
            return list;
        },
        onEvent : function(event) {
            _.each(this.tabs, function(tabDef) {
                if(tabDef.instance.eventHandlers) {
                    var handler = tabDef.instance.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }
                    handler.apply(tabDef.instance, [event]);

                }
            });
        },

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];     
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
            return this._getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this._getLocalization('desc');
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

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
