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
        this.parent = null;
        this.elParent = null;
        this.container = null;
        this.minimizeBtn = null;
        this.restoreBtn = null;
        this.state = {};
        this._localization = this.instance.getLocalization('flyout');
        this.tabsContainer = Oskari.clazz.create(
            'Oskari.userinterface.component.TabContainer'
        );
        this._accordions = {};
        this.wfsMapIdList = [];
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
            if(this.parent.hasClass('oskari-minimized')){
                return true;
            }else{
                return jQuery(this.container).is(':visible');
            }
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
            me.removeAllMarkersAndHighlights();
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
            var me = this;
            //Set class to flyout parent
            me.elParent = jQuery(me.container).parents('.oskari-flyout');
            jQuery(me.elParent).addClass('selected-featuredata-flyout');

            //Set minimize flyout button
            me.parent = jQuery(me.container).parents('.oskari-flyout');
            me.minimizeBtn = me.parent.find('.oskari-flyouttool-minimize');
            me.restoreBtn = me.parent.find('.oskari-flyouttool-restore');
            me.minimizeBtn.addClass('icon-minimize');
            me.restoreBtn.addClass('icon-restore');
        },
        /* App specific methods */
        createUI: function (params, mapobject) {
            var me = this,
            data = params[0],
            layer = me.sandbox.findMapLayerFromAllAvailable(data.layerId),
            tabName = layer.getName(),
            tabContent = jQuery('<div></div>');

            //check if certain layer has tab allready
            if(jQuery('.selected_featuredata_tabcontent_'+layer.getId()).length == 0){
                tabContent.attr('class','selected_featuredata_tabcontent_'+layer.getId());
                me.addTab(data, tabContent, tabName, layer.getId());
                me.addAccordion(data.html, tabContent, layer.getId(), mapobject);
            }else{
                tabContent = jQuery('.selected_featuredata_tabcontent_'+layer.getId());
                if(me.compareAccodionPanelHtml(data.html, tabContent)){
                    me.addAccordion(data.html, tabContent, layer.getId(), mapobject);
                }
            }

        },
        /**
         * [addTab adds tab]
         * @param {[object]} item [contains all data tab needs]
         */
        addTab: function (data, tabContent, tabName, layerId) {
            var me = this,
                tabId = 'selected_featuredata_tab_'+layerId,
                flyout = jQuery(me.container);

            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);
            }

            var panel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel'
            );
            panel.setTitle(tabName, tabId);
            panel.setId(layerId);
            panel.setContent(tabContent);
            panel.setPriority(1);
            me.tabsContainer.addPanel(panel);
        },
        /**
         * [addAccordion add accordion into certain tab]
         * @param {[Object]} panelData [description]
         * @param {[String]} tabid [description]
         */
        addAccordion: function (accPanelData, tabContent, layerId, mapobject){
            var me =  this,
            panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
            number = 1,
            panelId = 'selected_featuredata_accpanel_',
            linkShowOnMap = me.createLinkShowOnMap(mapobject);
            fullHtml = accPanelData.append(linkShowOnMap);

              //initialize panel component
              panel.setContent(fullHtml);
              panel.setVisible(true);

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

            jQuery("#"+panelId).append(me.createCloseIconForAcc(panel, layerId, tabContent));
        },
        /**
         * [createCloseIconForAcc adds close btn for every accordionpanel]
         * @param  {[panel]} panel   [accordionpanel]
         * @param  {[layerId]} layerId [layerId]
         * @param  {[tabContent]} tabContent [tabContent]
         */
        createCloseIconForAcc: function(panel, layerId, tabContent){
            var me = this;
            return jQuery('<div />', {
                "class": 'icon-close selected_featuredata_accpanel_close',
                click: function(e){
                    e.preventDefault();
                    me.removeAcc(panel, layerId, tabContent);
                }});
        },
        /**
         * [removeAcc click event handler removing certain accordionPanel and handle last one]
         * @param  {[panel]} panel  [panel]
         * @param  {[layerId]} layerId [layerId]
         * @param  {[tabContent]} tabContent [tabContent]
         */
        removeAcc: function(panel, layerId, tabContent){
            var me = this,
            tabsItem = jQuery(tabContent).parents(".selected-featuredata").find(".tabsItem");

            panel.destroy();

            if(tabContent.find('.accordion_panel>.content').length == 0){
                 me.removeAllMarkersAndHighlights();
                
                jQuery.each(me.tabsContainer.panels, function(index, tabpanel){
                    if(typeof(tabpanel) != "undefined"){
                    if(tabpanel.id == layerId){
                        tabpanel.destroy();
                        me.tabsContainer.panels.splice(jQuery.inArray(tabpanel, me.tabsContainer.panels),1);
                    }
                    }
                });

                delete me._accordions[layerId];
                tabsItem.find("li:first a").trigger("click");
            }

            if(tabsItem.children().length == 0){
                me.clearFlyout();
                me.sandbox.postRequestByName(
                   'userinterface.UpdateExtensionRequest',
                   [me.instance, 'close']
               );
            }

        },
        /**
         * [createObjectOnMap creates link for wms marker or wfs highlight]
         * @param  {[object]} mapobject [description]
         */
        createLinkShowOnMap: function(mapobject){
            var me = this;
            return jQuery('<a />', {
                "href": "JavaScript:void(0);",
                "class": 'selected_featuredata_accpanel_showonmap',
                "text": me._getLocalization('accordion-show-onmap'),
                click: function(e){
                    e.preventDefault();
                    var features = mapobject.features[0];
                    me.removeAllMarkersAndHighlights();
                    me.moveMapRequest(mapobject.lonlat.lon, mapobject.lonlat.lat);

                    if((typeof(features.type) !== 'undefined')){
                        me.showWmsMarker(mapobject.lonlat.lon, mapobject.lonlat.lat);
                    }else{
                        me.highlightWFSFeature(mapobject.layerId, features[0]);
                    }
                }});
        },
        /**
         * [highlightWFSFeature highlight wfs object on map]
         * @param  {[String]} layerId   [Oskari layerId]
         * @param  {[array]} featureId [FID from feature]
         */
        highlightWFSFeature: function(layerId, featureId){
                var me = this,
                builder = me.sandbox.getEventBuilder('WFSFeaturesSelectedEvent');

                var featureIdList = [];
                // check if the param is already an array
                if (Object.prototype.toString.call(featureId) === '[object Array]') {
                    featureIdList = featureId;
                } else {
                    featureIdList.push(featureId);
                }

                var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                if (!mapLayerService || featureIdList.length === 0) {
                    return;
                }

                var layer = mapLayerService.findMapLayer(layerId);
                me.wfsMapIdList = [];
                me.wfsMapIdList.push(layerId);
                var event = builder(featureIdList, layer, true);
                me.sandbox.notifyAll(event);
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
         * [showWmsMarker show marker on map]
         * @param  {[String]} x [lon]
         * @param  {[String]} y [lat]
         */
        showWmsMarker: function(x,y){
            var sb = Oskari.getSandbox();
            var reqBuilder = sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
            if (reqBuilder) {
                var data = {
                    x: x,
                    y: y,
                    color: "ffd400",
                    msg : '',
                    shape: 2,
                    size: 3
                };
                var request = reqBuilder(data);
                sb.request('MainMapModule', request);
            }
        },
        /**
         * [removeAllMarkersAndHighlights deletes markers and highlights from map]
         */
        removeAllMarkersAndHighlights: function(){
            var me = this,
            sb = Oskari.getSandbox();

            //WMS marker
            var reqBuilder = sb.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest');
            if (reqBuilder) {
                sb.request('MainMapModule', reqBuilder());
            }

            //WFS highlight
            if(me.wfsMapIdList.length > 0){
                var mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                var layer = mapLayerService.findMapLayer(me.wfsMapIdList[0]);
                var event = me.sandbox.getEventBuilder('WFSFeaturesSelectedEvent')([], layer, false);
                me.sandbox.notifyAll(event);
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
