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
        this._tabs = {};
        this._accordions = {};
        this._panels = {};
        this._array = [];
        this._contents = {};
        this.wfsMapIdList = [];
        this.isMany = false;
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
         *
         */
        setEl: function (el) {
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
            this._panels = [];
            this.tabsContainer = null;
            this.tabsContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );
            me.removeAllMarkersAndHighlights();
        },
        /**
         * [clearFlyout removes tab elements from container]
         */
        clearTabsLayout: function(){
            var me = this;
            jQuery(me.container).find('.oskariTabs').empty();
            this._accordions = [];
            this._panels = [];
            this.tabsContainer = null;
            this.tabsContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );
            me.removeAllMarkersAndHighlights();
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
        /**
         * [createUI fires UI building from ResultHandler (instance.js)]
         * @param  {[Object]} params    [params]
         * @param  {[Object]} mapobject [mapobject]
         */
        createUI: function (params, mapobject) {
            var me = this,
            data = params[0],
            layer = me.sandbox.findMapLayerFromAllAvailable(data.layerId),
            tabName = layer.getName(),
            tabContent = jQuery('<div></div>'),
            howManyShowLink = jQuery(me.container).find('.selected_featuredata_howmany_show');

            //Show many or one link created only once
            if(howManyShowLink.length === 0){
                jQuery(me.container).append(me.createShowManyOrOneLink());
            }

            //restore flyout if oskari-minimized
            if(this.parent.hasClass('oskari-minimized')){
                me.sandbox.postRequestByName(
                   'userinterface.UpdateExtensionRequest',
                   [me.instance, 'restore']
               );
            }

            me.removeAllMarkersAndHighlights();

            //check if certain layer has tab allready
            if(jQuery('.selected_featuredata_tabcontent_'+layer.getId()).length === 0){
                tabContent.attr('class','selected_featuredata_tabcontent_'+layer.getId());
                me.addTab(data, tabContent, tabName, layer.getId());
                me.addAccordion(data.html, tabContent, layer.getId(), mapobject);
            }else{
                tabContent = jQuery('.selected_featuredata_tabcontent_'+layer.getId());
                var compare = me.compareAccodionPanelHtml(data.html, tabContent);
                if(compare.add){
                    me.addAccordion(data.html, tabContent, layer.getId(), mapobject);
                }else{

                    for (var i in me._panels) {
                        if(i.indexOf(layer.getId()) >= 0){
                            me._panels[i].close();
                        }
                    }
                    me._panels[compare.id].open();
                }
            }

        },
        /**
         * [addTab adds tab]
         * @param {[Object]} data       [data]
         * @param {[Object]} tabContent [tabContent]
         * @param {[String]} tabName    [tabName]
         * @param {[Integer]} layerId    [layerId]
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
            me._tabs[layerId] = panel;
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
         * @param {[Integer]} layerId [description]
         * @param {[Object]} mapobject [description]
         */
        addAccordion: function (accPanelData, tabContent, layerId, mapobject){
            var me =  this,
            panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
            number = 1,
            panelId = 'selected_featuredata_accpanel_',
            fullHtml = accPanelData,
            features = mapobject.features[0];

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
                panel.open();
                me._panels[panelId] = panel;

                me._accordions[layerId].addPanel(panel);
                me._accordions[layerId].insertTo(tabContent);
                //add link show all features on map and add link add layer back to map
                tabContent.prepend(me.createLinkShowTabOnMap(tabContent, layerId));
                tabContent.prepend(me.createLinkAddLayerToMap(tabContent, layerId));
            }else{
                // just insert new panel to existing accordion
                number = number + me._accordions[layerId].panels.length;
                panel.setTitle(me._getLocalization('accordion-title') +' '+ number);
                panelId = panelId + layerId + '_' + number;
                panel.setId(panelId);

                for (var i in me._panels) {
                    if(i.indexOf(layerId) >= 0){
                        me._panels[i].close();
                    }
                }

                panel.open();
                me._panels[panelId] = panel;
                me._accordions[layerId].addPanel(panel);
            }

            //Add needed data for panelWrapper like links and datas
            var panelWrapper = panel.getContainer().parents('.accordion_panel').find('.header');
            panelWrapper.append(me.createCloseIconForAcc(panel, layerId, tabContent));
            panelWrapper.append(me.createLinkShowOnMap(mapobject));


            if((typeof(features.type) !== 'undefined')){
               //WMS
                panelWrapper.attr("data-type", "WMS");
                panelWrapper.attr("data-x", mapobject.lonlat.lon);
                panelWrapper.attr("data-y", mapobject.lonlat.lat);
            }else{
                //WFS
                panelWrapper.attr("data-type", "WFS");
                panelWrapper.attr("data-featureid", features[0]);
                panelWrapper.attr("data-x", mapobject.lonlat.lon);
                panelWrapper.attr("data-y", mapobject.lonlat.lat);
            }
        },
        /**
         * [compareAccodionPanelHtml checks if html already in accordion panel]
         * @return {[Boolean]} [true/false]
         */
        compareAccodionPanelHtml: function(newHtml, tabContent){
            var output = {
                add: true,
                id: null
            };

            tabContent.find('.accordion_panel>.content>div').each(function(){
                var oldHtml = jQuery(this);
                if(oldHtml.html() === newHtml.html()){
                    output.id = oldHtml.parents('.accordion_panel').find('.header').attr('id');
                    output.add = false;
                }
            });

            return output;
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

            if(tabContent.find('.accordion_panel>.content').length === 0){
                 me.removeAllMarkersAndHighlights();

                jQuery.each(me.tabsContainer.panels, function(index, tabpanel){
                    if(tabpanel && tabpanel.id === layerId){
                        tabpanel.destroy();
                        me.tabsContainer.panels.splice(jQuery.inArray(tabpanel, me.tabsContainer.panels),1);
                    }
                });

                delete me._accordions[layerId];
                tabsItem.find("li:first a").trigger("click");
            }

            if(tabsItem.children().length === 0){
                me.clearFlyout();
                me.sandbox.postRequestByName(
                   'userinterface.UpdateExtensionRequest',
                   [me.instance, 'close']
               );
            }

        },
         /**
         * [createShowManyOrOneLink adds link that modifies how many panels should show]
         * @return  {[a link]}
         */
        createShowManyOrOneLink: function(){
            var me = this;
            return jQuery('<a />', {
                "href": "JavaScript:void(0);",
                "data-many": "many",
                "class": 'selected_featuredata_howmany_show',
                "text": me._getLocalization('tabs_pick_one'),
                click: function(e){
                    var mea = jQuery(this);

                    if(mea.attr("data-many") === "many"){
                        mea.attr("data-many", "one");
                        mea.text(me._getLocalization('tabs_pick_many'));
                        me.isMany = false;
                    }else{
                        mea.attr("data-many", "many");
                        mea.text(me._getLocalization('tabs_pick_one'));
                        me.isMany = true;
                    }
                    e.preventDefault();
                }});
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

                    var features = mapobject.features[0];
                    me.removeAllMarkersAndHighlights();
                    me.moveMapRequest(mapobject.lonlat.lon, mapobject.lonlat.lat);

                    if((typeof(features.type) !== 'undefined')){
                        me.showWmsMarker(mapobject.lonlat.lon, mapobject.lonlat.lat);
                    }else{
                        me.highlightWFSFeature(mapobject.layerId, features[0]);
                    }

                    e.preventDefault();
                    return false;
                }});
        },
        /**
        * [createLinkShowTabOnMap shows all on map that are inside tab]
         * @param  {[Object]} tabContent [tabContent]
         * @param  {[integer]} layerId    [layerId]
         * @return {[jQuery object]}            [a link]
         */
        createLinkShowTabOnMap: function(tabContent, layerId){
            var me = this;
            return jQuery('<a />', {
                "href": "JavaScript:void(0);",
                "class": 'selected_featuredata_show_all_on_map',
                "text": me._getLocalization('show_all_on_map'),
                click: function(){

                    me.removeAllMarkersAndHighlights();

                    var wfs = false,
                    featureIds = [],
                    wfsvectors = new OpenLayers.Layer.Vector("fakeVectorLayer"),
                    mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule'),
                    _map = mapModule.getMap();

                    //loop accordion headers
                    var header = tabContent.find(".accordion_panel .header");
                    jQuery(header).each(function() {
                        var el = jQuery(this);
                        if(el.data("type") === "WFS"){
                            wfs = true;
                            featureIds.push(el.data("featureid"));
                            var point = new OpenLayers.Geometry.Point(el.data("x"),el.data("y"));
                            wfsvectors.addFeatures([new OpenLayers.Feature.Vector(point)]);
                        }else{
                            me.showWmsMarker(el.data("x"), el.data("y"));
                        }
                    });

                    //handle the right zooming
                    if(wfs){
                        me.zoomMapToCertainExtent(wfsvectors.getDataExtent());
                        me.highlightWFSFeature(layerId, featureIds);
                    }else{
                        var layer = _map.getLayersByName("Markers");
                        me.zoomMapToCertainExtent(layer[0].getDataExtent());
                    }

                    return false;
                }});
        },
        /**
         * [createLinkAddLayerToMap add removed layer back into map]
         * @param  {[Object]} tabContent [tabContent]
         * @param  {[Integer]} layerId [layerId]
         * @return {[boolean]}         [boolean]
         */
        createLinkAddLayerToMap: function(tabContent, layerId){
            var me = this;
            return jQuery('<a />', {
                "href": "JavaScript:void(0);",
                "class": 'selected_featuredata_add_layer_to_map hidden',
                "text": me._getLocalization('add_layer_to_map'),
                click: function(e){
                    e.preventDefault();
                    tabContent.find('.selected_featuredata_add_layer_to_map').addClass('hidden');
                    tabContent.find('.selected_featuredata_show_all_on_map').removeClass('hidden');
                    tabContent.find('.selected_featuredata_accpanel_showonmap').removeClass('hidden');
                    tabContent.find('.selected_featuredata_removed_map_text').remove();
                    me.addLayerToMapById(layerId);
                    return false;
                }});
        },
        /**
         * [addLayerToMapById add layer back to map by layer id]
         * @param {[Integer]} layerId [layerId]
         */
        addLayerToMapById: function(layerId){
            var me = this,
            request = me.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
            me.sandbox.request(me.instance, request);
        },
        /**
         * [layerRemovedOrAddedFromMapMergeTabs checks if remove layerId is in tabs, notify user tab is in flyout]
         * @param  {[Integer]} layerId [layerId]
         * @param  {[Boolean]} removed [true if removed, false if added]
         */
        layerRemovedOrAddedFromMapMergeTabs: function(layerId, removed){
            var me = this;

            for (var i in me._tabs) {
                if(i.indexOf(layerId) >= 0){
                    var tabContent = me._tabs[i].getContainer();
                    if(removed){
                        me.removeAllMarkersAndHighlights();
                        tabContent.find('.selected_featuredata_show_all_on_map').addClass('hidden');
                        tabContent.find('.selected_featuredata_add_layer_to_map').removeClass('hidden');
                        tabContent.find('.selected_featuredata_accpanel_showonmap').addClass('hidden');
                        tabContent.find('.selected_featuredata_show_all_on_map').parent('div').prepend(
                            jQuery('<p />', {
                            "class": 'selected_featuredata_removed_map_text',
                            "text": me._getLocalization('removed_from_map')}));
                    }else{
                        tabContent.find('.selected_featuredata_add_layer_to_map').addClass('hidden');
                        tabContent.find('.selected_featuredata_show_all_on_map').removeClass('hidden');
                        tabContent.find('.selected_featuredata_accpanel_showonmap').removeClass('hidden');
                        tabContent.find('.selected_featuredata_removed_map_text').remove();
                    }
                }
            }
        },
        /**
         * [zoomMapToCertainExtent zooms map to extent and minus 1 zoom back]
         * @param  {[Object]} dataextent [extent]
         */
        zoomMapToCertainExtent: function(dataextent){
                var me = this,
                mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule'),
                _map = mapModule.getMap(),
                newZoom = 0;

                _map.zoomToExtent(dataextent);
                newZoom = _map.getZoom() - 1;
                _map.zoomTo(newZoom);
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
            var mapmoveRequest = me.sandbox.getRequestBuilder('MapMoveRequest')(x, y);
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
                    size: 5
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
