/**
 * @class Oskari.mapframework.bundle.selected-featuredata.Flyout
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.selected-featuredata.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.mapframework.bundle.selected-featuredata}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.container = null;
        this.state = {};
        this.addTabBtn = null;
        this.addAccBtn = null;
        this._localization = this.instance.getLocalization('flyout');
        this.tabsContainer = Oskari.clazz.create(
            'Oskari.userinterface.component.TabContainer'
        );
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.selected-featuredata.Flyout';
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
            this.container = el[0];
            if (!jQuery(this.container).hasClass('selected-featuredata')) {
                jQuery(this.container).addClass('selected-featuredata');
            }
        },
        /**
        * @public @method startPlugin
        * Interface method implementation, assigns the HTML templates
        * that will be used to create the UI
        *
        *
        */
        startPlugin: function () {
            this.createUI();
        },
        /* App specific methods */
        createUI: function () {

           if(this.addTabBtn && this.addAccBtn){
                return;
            }

            var me = this;
            this.addTabBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            this.addAccBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            // Test for adding tab
            this.addTabBtn.addClass('primary');
            this.addTabBtn.setTitle('AddTab');
            this.addTabBtn.setHandler(function() {
                var title = 'Testi',
                content = '',
                priority = 1,
                id = 'id_on_1',
                reqName = 'SelectedFeatureData.AddTabRequest',
                reqBuilder = me.sandbox.getRequestBuilder(reqName),
                req = reqBuilder(title, content, priority, id);

            me.sandbox.request(me.instance, req);
            });

            this.addTabBtn.insertTo(me.container);

            // Test for adding tab
            this.addAccBtn.addClass('primary');
            this.addAccBtn.setTitle('AddAcc');
            this.addAccBtn.setHandler(function() {
                var title = 'Test Accordion',
                content = '<h5>SISÄLTÖÄ</h5>',
                visible = true,
                tabid = 'id_on_1',
                id = 'id_on_2',
                reqName = 'SelectedFeatureData.AddAccordionRequest',
                reqBuilder = me.sandbox.getRequestBuilder(reqName),
                req = reqBuilder(title, content, visible, id, tabid);

            me.sandbox.request(me.instance, req);
            });

            this.addAccBtn.insertTo(me.container);
        },
        /**
         * [addTab adds tab]
         * @param {[object]} item [contains all data tab needs]
         */
        addTab: function (item) {
            var me = this,
                flyout = jQuery(me.container);
            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);
            }

            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(item.title, item.id);
            panel.setId(item.id);
            panel.setContent(item.content);
            panel.setPriority(item.priority);
            console.dir(panel);
            me.tabsContainer.addPanel(panel);
        },
        /**
         * [addAccordion add accordion into certain tab]
         * @param {[Object]} panelData [description]
         * @param {[String]} tabid [description]
         */
        addAccordion: function (panelData){
            var me =  this,
            accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion'),
            container = jQuery(panelData.tabid),
            panel = null;

              panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
              panel.setTitle(panelData.title);
              panel.setContent(panelData.content);
              panel.setContent(panelData.id);
              panel.setVisible(panelData.isVisible);

              //panelData.isOpen ? panel.open() : panel.close();

              accordion.addPanel(panel);

            accordion.insertTo(container);

        },
        getEventHandlers: function () {
/*            var list = {};
            _.each(this.tabs, function (tabDef) {
                var p;
                if (tabDef.instance.eventHandlers) {
                    for (p in tabDef.instance.eventHandlers) {
                        if (tabDef.instance.eventHandlers.hasOwnProperty(p)) {
                            list[p] = true;
                        }
                    }
                }
            });
            return list;*/
        },
        onEvent: function (event) {
/*            _.each(this.tabs, function (tabDef) {
                if (tabDef.instance.eventHandlers) {
                    var handler = tabDef.instance.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }
                    handler.apply(tabDef.instance, [event]);

                }
            });*/
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
