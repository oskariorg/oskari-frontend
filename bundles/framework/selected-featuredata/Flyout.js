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
         * [clearFlyout removes all elements from container]
         */
        clearFlyout: function(){
            var me = this;
            jQuery(me.container).empty();
            this._accordions = [];
            this.tabsContainer = null;
            this.tabsContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );
            me.removeAllMarkers();
        },
        /**
         * [compareAccodionPanelHtml checks if html already in accordion panel]
         * @return {[Boolean]} [true/false]
         */
        compareAccodionPanelHtml: function(newHtml, tabContent){
            var me = this,
            output = true;

            tabContent.find('.accordion_panel>.content>div').each(function(){
                var oldHtml = jQuery(this);
                if(oldHtml.html() == newHtml.html()){
                    output = false;
                }
            });

            return output;
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
        createUI: function (params, mapobject) {
            var me = this,
            data = params[0],
            layer = me.sandbox.findMapLayerFromAllAvailable(data.layerId),
            tabId = 'selected_featuredata_tab_'+layer.getId();
            tabName = layer.getName(),
            tabContent = jQuery('<div></div>');

            //check if certain layer has tab allready
            if(jQuery('.selected_featuredata_tabcontent_'+layer.getId()).length == 0){
                tabContent.attr('class','selected_featuredata_tabcontent_'+layer.getId());
                me.addTab(data, tabContent, tabId, tabName);
                me.addAccordion(data.html, tabContent, layer.getId(), tabId, mapobject);
            }else{
                tabContent = jQuery('.selected_featuredata_tabcontent_'+layer.getId());
                if(me.compareAccodionPanelHtml(data.html, tabContent)){
                    me.addAccordion(data.html, tabContent, layer.getId(), tabId, mapobject);
                }
            }

        },
        /**
         * [addTab adds tab]
         * @param {[object]} item [contains all data tab needs]
         */
        addTab: function (data, tabContent, tabId, tabName) {
            var me = this,
                flyout = jQuery(me.container);

            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);
            }

            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(tabName, tabId);
            panel.setContent(tabContent);
            panel.setPriority(1);
            me.tabsContainer.addPanel(panel);
        },
        /**
         * [addAccordion add accordion into certain tab]
         * @param {[Object]} panelData [description]
         * @param {[String]} tabid [description]
         */
        addAccordion: function (accPanelData, tabContent, layerId, tabId, mapobject){
            var me =  this,
            panel = null,
            number = 1,
            panelId = 'selected_featuredata_accpanel_';

              //initialize panel component
              panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
              panel.setContent(accPanelData);
              panel.setVisible(true);
              //panelData.isOpen ? panel.open() : panel.close();

            if(!me._accordions[layerId]){
                // create new accordions
                var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
                me._accordions[layerId] = accordion;
                panel.setTitle(me._getLocalization('accordion-title') +' '+ number);
                panelId = panelId + layerId + '_' + number;
                panel.setId(panelId);
                me._accordions[layerId].addPanel(panel);

                me._accordions[layerId].insertTo(tabContent);
            }else{
                // just insert new panel to existing accordion
                number = number + me._accordions[layerId].panels.length;
                panel.setTitle(me._getLocalization('accordion-title') +' '+ number);
                panelId = panelId + layerId + '_' + number;
                panel.setId(panelId);
                me._accordions[layerId].addPanel(panel);
            }

            jQuery("#"+panelId).append(me.createCloseIconForAcc(panel, tabId, tabContent));
            jQuery("#"+panelId).append(me.createWmsMarker(mapobject));
            

        },
        /**
         * [createWmsMarker creates link for wms marker]
         * @param  {[object]} mapobject [description]
         */
        createWmsMarker: function(mapobject){
            var me = this;
            return jQuery('<div />', {
                "class": 'selected_featuredata_accpanel_close',
                "text": "testi",
                click: function(e){
                    e.preventDefault();
                    me.removeAllMarkers();
                    me.showWmsMarker(mapobject.lonlat.lon, mapobject.lonlat.lat);
                    me.moveMapRequest(mapobject.lonlat.lon, mapobject.lonlat.lat);
                }});
        },
        /**
         * [moveMapRequest move map to given x and y]
         * @param  {[number]} x [lon]
         * @param  {[number]} y [lat]
         */
        moveMapRequest: function(x, y){
            var me = this;
            var mapmoveRequest = me.sandbox.getRequestBuilder('MapMoveRequest')(x, y, null, false);
            me.sandbox.request(me.instance, mapmoveRequest);
        },
        /**
         * [createCloseIconForAcc adds close btn for every accordionpanel]
         * @param  {[panel]} panel   [accordionpanel]
         * @param  {[layerId]} layerId [layerId]
         */
        createCloseIconForAcc: function(panel, tabId, tabContent){
            var me = this;
            return jQuery('<div />', {
                "class": 'icon-close selected_featuredata_accpanel_close',
                click: function(e){
                    e.preventDefault();
                    me.removeAcc(panel, tabId, tabContent);
                }});
        },
        /**
         * [removeAcc click event handler removing certain accordionPanel and handle last one]
         * @param  {[type]} parent  [description]
         * @param  {[type]} layerId [description]
         * @return {[type]}         [description]
         */
        removeAcc: function(panel, tabId, tabContent){
            var me = this;

            panel.destroy();

            if(tabContent.find('.accordion_panel>.content').length == 0){
                me.clearFlyout();
                //FIXME
                //jQuery(tabContent).parent().remove();
                //jQuery("#"+tabId).remove();
            }

        },
        showWmsMarker: function(x,y){
            var sb = Oskari.getSandbox();
            var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
            if (reqBuilder) {
                var data = {
                    x: x,
                    y: y,
                    color: "ff0000",
                    msg : '',
                    shape: 3,
                    size: 3
                };
                var request = reqBuilder(data);
                sb.request('MainMapModule', request);
            }
        },
        /**
         * [removeAllMarkers deletes markers from map]
         */
        removeAllMarkers: function(){
            var me = this,
            sb = Oskari.getSandbox();

            var reqBuilder = sb.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest');
            if (reqBuilder) {
                sb.request('MainMapModule', reqBuilder());
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
