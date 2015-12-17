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
        this._localization = this.instance.getLocalization('flyout');
        this.tabsContainer = Oskari.clazz.create(
            'Oskari.userinterface.component.TabContainer'
        );
        this._accordions = {};
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
         * [isFlyoutVisible checks if layout is visible]
         * @return {Boolean} [true/false]
         */
        isFlyoutVisible: function(){
            return jQuery(this.container).is(':visible');
        },
        /**
         * [clearContainer removes all elements from container]
         */
        clearContainer: function(){
            var me = this;
            jQuery(me.container).empty();
            this._accordions = [];
            this.tabsContainer = null;
            this.tabsContainer = Oskari.clazz.create(
            'Oskari.userinterface.component.TabContainer'
            );
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
        createUI: function (params) {
            var me = this,
            data = params[0],
            layer = me.sandbox.findMapLayerFromAllAvailable(data.layerId),
            tabContent = jQuery('<div></div>');

            if(jQuery('.selected_featuredata_tabcontent_'+layer.getId()).length == 0){
                tabContent.attr('class','selected_featuredata_tabcontent_'+layer.getId());
                me.addTab(data, tabContent, layer);
                me.addAccordion(data.html, tabContent, layer.getId());
            }else{
                me.addAccordion(data.html, tabContent, layer.getId());
            }

        },
        /**
         * [addTab adds tab]
         * @param {[object]} item [contains all data tab needs]
         */
        addTab: function (data, tabContent, layer) {
            var me = this,
                flyout = jQuery(me.container);

            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);
            }

            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(layer.getName(), layer.getId());
            panel.setContent(tabContent);
            panel.setPriority(1);
            me.tabsContainer.addPanel(panel);
            me.tabsContainer.insertTo(flyout);
            
        },
        /**
         * [addAccordion add accordion into certain tab]
         * @param {[Object]} panelData [description]
         * @param {[String]} tabid [description]
         */
        addAccordion: function (accPanelData, tabContent, layerId){
            var me =  this,
            panel = null,
            number = 1;

              panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
              panel.setContent(accPanelData);
              panel.setId('selected_featuredata_accpanel_'+layerId);
              panel.setVisible(true);
              //panelData.isOpen ? panel.open() : panel.close();

            if(!me._accordions[layerId]){
                // create new accordions
                var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
                me._accordions[layerId] = accordion;
                panel.setTitle(me._getLocalization('accordion-title') +' '+ number);
                me._accordions[layerId].addPanel(panel);

                me._accordions[layerId].insertTo(tabContent);
            }else{
                // just insert new panel to existing accordion
                number = number + me._accordions[layerId].panels.length;
                panel.setTitle(me._getLocalization('accordion-title') +' '+ number);
                me._accordions[layerId].addPanel(panel);
            }     

        },
        getEventHandlers: function () {

        },
        onEvent: function (event) {

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
