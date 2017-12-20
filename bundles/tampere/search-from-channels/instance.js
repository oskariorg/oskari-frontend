/**
 * @Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundleInstance
 *
 * Main component and starting point for the "search-from-channels" functionality.
 * Provides search functionality for channels that can be done by admin.
 *
 * See Oskari.tampere.bundle.tampere.SearchFromChannelsBundle for bundle definition.
 *
 */
Oskari.clazz.define(
    'Oskari.tampere.bundle.searchfromchannels.SearchFromChannelsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.optionService = null;
        this.searchService = null;
        this.tabPriority = 1.0;
        this.conditions = [];
        this.safeChars = false;
        this.resultHeaders = [
                {
                    title: '',
                    prop: 'check'
                },
                {
                    title: this.getLocalization('grid').name,
                    prop: 'name'
                }, {
                    title: this.getLocalization('grid').village,
                    prop: 'village'
                }, {
                    title: this.getLocalization('grid').type,
                    prop: 'type'
                }
        ];
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'search-from-channels',
        /**
         * @static
         * @property templates
         */
        templates: {
            searchFromChannelsTab: jQuery('<div class="searchFromChannelsContainer"></div>'),
            optionPanel: jQuery(
                '<div class="main searchFromChannelsOptions">' +
                '  <div class="searchFromChannelsDescription"></div>' +
                '  <div class="controls"></div>' +
                '  <div class="moreLess"></div>' +
                '  <div class="advanced"></div>' +
                '  <div class="resultList"></div>' +
                '</div>'
            ),
            moreLessLink: jQuery('<a href="JavaScript:void(0);" class="moreLessLink"></a>'),
            advanced: jQuery('<div class="advanced"></div>'),
            checkbox: jQuery(
                '<div class="searchFromChannelsType">' +
                '  <label class="searchFromChannelsTypeText">' +
                '    <input type="checkbox">' +
                '  </label>' +
                '</div>'
            ),
            checkboxRow: jQuery(
                '<div class="searchFromChannelsRow checkboxRow">' +
                '  <div class="rowLabel"></div>' +
                '  <div class="checkboxes"></div>' +
                '</div>'
            ),
            templateSearchResultsWindow: jQuery(
            '<div class="searchFromChannels_window_search_results">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '   <div class="returnTosearch"></div>'+
            '       <div class="info"></div>' +
            '           <div class="showOnMapBtns"></div>'+
            '               <div class="resultList"></div>' +
            '  </div>' +
            '  </div>' +
            '</div>'),
            templateResultTable: jQuery(
                '<table class="search_result oskari-grid">' +
                '  <thead><tr></tr></thead>' +
                '  <tbody></tbody>' +
                '</table>'
            ),
            templateResultTableHeader: jQuery(
                '<th><a href="JavaScript:void(0);"></a></th>'
            ),
            templateResultTableRow: jQuery(
                '<tr>' +
                '  <td><input type="checkbox"/></td>' +
                '  <td><a href="JavaScript:void(0);"></a></td>' +
                '  <td></td>' +
                '  <td></td>' +
                '</tr>'
            )
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key && this._localization[key]) {
                return this._localization[key];
            }
            if (!this.localization) {
                return {};
            }
            return this._localization;
        },
        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            var me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;

            me.localization = Oskari.getLocalization(me.getName());

            var optionAjaxUrl = null;
            if (me.conf && me.conf.optionUrl) {
                optionAjaxUrl = me.conf.optionUrl;
            } else {
                optionAjaxUrl = sandbox.getAjaxUrl() + 'action_route=SearchOptions';
            }

            var searchAjaxUrl = null;
            if (me.conf && me.conf.searchUrl) {
                searchAjaxUrl = me.conf.searchUrl;
            } else {
                searchAjaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
            }

            // Default tab priority
            if (me.conf && typeof me.conf.priority === 'number') {
                me.tabPriority = me.conf.priority;
            }

              // Filter special characters?
            if (this.conf && this.conf.safeChars === true) {
                this.safeChars = true;
            }

            var searchServName =
                'Oskari.tampere.bundle.searchfromchannels.service.WfsSearchService';
            me.searchService = Oskari.clazz.create(searchServName, searchAjaxUrl);

            var optionServName =
                'Oskari.tampere.bundle.searchfromchannels.service.ChannelOptionService';
            me.optionService = Oskari.clazz.create(optionServName, optionAjaxUrl);

            sandbox.register(me);
            var p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            // draw ui
            me.createUi();
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does
         * nothing atm
         */
        update: function () {

        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event
         * object
         * Event is handled forwarded to correct #eventHandlers if found
         * or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;
                // ExtensionUpdateEvents are fired a lot, only let search extension event to be handled when enabled
                if (event.getExtension().getName() !== 'Search') {
                    return;
                }
                if (event.getViewState() !== 'close') {
                    var searchFromChannelsContainer = jQuery(".searchFromChannelsContainer"),
                    advancedContainer = searchFromChannelsContainer.find('div.advanced'),
                    moreLessLink = searchFromChannelsContainer.find('a.moreLessLink');

                    advancedContainer.empty();
                    me._getChannelsForAdvancedUi(searchFromChannelsContainer,advancedContainer,moreLessLink,false);
                }
            }
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var sandbox = this.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            var reqName = 'userinterface.RemoveExtensionRequest',
                reqBuilder = sandbox.getRequestBuilder(reqName),
                request = reqBuilder(this);

            sandbox.request(this, request);

            this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('tabTitle');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "metadata catalogue" functionality
         */
        createUi: function () {

            var me = this,
                searchFromChannelsContainer = me.templates.searchFromChannelsTab.clone();

            me.optionPanel = me.templates.optionPanel.clone();
            searchFromChannelsContainer.append(me.optionPanel);

            var searchFromChannelsDescription = searchFromChannelsContainer.find(
                'div.searchFromChannelsDescription'
            );
            searchFromChannelsDescription.html(
                me.getLocalization('searchFromChannelsDescription')
            );

            var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.getLocalization('assistance'));
            field.setIds('oskari_searchfromchannels_forminput', 'oskari_searchfromchannels_forminput_searchassistance');

            field.bindChange(function (event) {
                if (!me.state) {
                    me.state = {};
                }
                var value = field.getValue();
                me.state.metadatacataloguetext = value;
                if (!value) {
                    // remove results when field is emptied
                    var resultList = searchFromChannelsContainer.find('div.resultList');
                    var showMapBtns = me.optionPanel.find('div.showOnMapBtns');
                    var info = me.optionPanel.find('div.info');
                    resultList.empty();
                    showMapBtns.empty();
                    info.empty();
                    me._clearMapFromResults();
                    me._closeMapPopup();
                }
            });
            field.addClearButton('oskari_searchfromchannels_forminput_clearbutton');

            var button = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SearchButton'
            );
            button.setId('oskari_searchfromchannels_button_search');

            var doSearch = function () {
                field.setEnabled(false);
                button.setEnabled(false);

                var resultList = me.optionPanel.find('div.resultList');
                var showMapBtns = me.optionPanel.find('div.showOnMapBtns');
                resultList.empty();
                showMapBtns.empty();
                var info = me.optionPanel.find('div.info');
                info.empty();
                me._clearMapFromResults();
                me._closeMapPopup();

                var searchKey = field.getValue(me.safeChars);
                var channelIds = [];

                me.optionPanel.find("input[name='channelChkBox']").each( function () {
                    if(jQuery(this).is(":checked")){
                        channelIds.push(jQuery(this).val());
                    }
                });

                if (!me._validateSearchKey(field.getValue(false))) {
                    field.setEnabled(true);
                    button.setEnabled(true);
                    return;
                }

                me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
                me._progressSpinner.insertTo(jQuery(".searchFromChannelsOptions"));
                me._progressSpinner.start();

                me.searchService.doSearch(
                    searchKey, channelIds,
                    function (data) {
                        me._progressSpinner.stop();
                        field.setEnabled(true);
                        button.setEnabled(true);
                        me._renderResults(data, searchKey);
                    },
                    function (data) {
                        me._progressSpinner.stop();
                        field.setEnabled(true);
                        button.setEnabled(true);

                        var errorKey = data ? data.responseText : null,
                            msg = me.getLocalization(
                                'searchservice_search_not_found_anything_text');

                        if (errorKey) {
                            if (typeof me.getLocalization(errorKey) === 'string') {
                                msg = me.getLocalization(errorKey);
                            }
                        }

                        me._showError(msg);
                    });
            };

            button.setHandler(doSearch);
            field.bindEnterKey(doSearch);

            var controls = searchFromChannelsContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());

            var advancedContainer = searchFromChannelsContainer.find('div.advanced');
            // Link to advanced search
            var moreLessLink = this.templates.moreLessLink.clone();
            moreLessLink.html(me.getLocalization('showMore'));

            me._getChannelsForAdvancedUi(searchFromChannelsContainer,advancedContainer,moreLessLink,true);
            advancedContainer.hide();

            moreLessLink.click(function () {
                if (moreLessLink.html() === me.getLocalization('showMore')) {
                    // open advanced/toggle link text
                    moreLessLink.html(me.getLocalization('showLess'));
                    if (!advancedContainer.is(':empty')) {
                         advancedContainer.show();
                    }
                } else {
                    // close advanced/toggle link text
                    moreLessLink.html(me.getLocalization('showMore'));
                    advancedContainer.hide();
                }
            });
            searchFromChannelsContainer.find('div.moreLess').append(moreLessLink);
        },
        /**
         * [_getChannelsForAdvancedUi description] Create UI for advanden options
         * @param  {[type]} searchFromChannelsContainer [description]
         * @param  {[type]} advancedContainer           [description]
         * @param  {[type]} moreLessLink                [description]
         * @param  {[type]} createTab                   [description]
         * @return {[type]}                             [description]
         */
        _getChannelsForAdvancedUi: function(searchFromChannelsContainer,advancedContainer,moreLessLink, createTab) {
            var me = this;
            me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
            me._progressSpinner.insertTo(jQuery(".searchFromChannelsOptions"));
            me._progressSpinner.start();

            me.optionService.getOptions(function (data) {

            if(data.channels.length > 0){
                if(createTab){
                    // Wfs search from channels tab OBS. this will be in UI if user has rights into channels
                    var title = me.getLocalization('tabTitle'),
                        content = searchFromChannelsContainer,
                        priority = me.tabPriority,
                        id = 'oskari_searchfromchannels_tabpanel_header',
                        reqName = 'Search.AddTabRequest',
                        reqBuilder = me.sandbox.getRequestBuilder(reqName),
                        req = reqBuilder(title, content, priority, id);

                    me.sandbox.request(me, req);
                }

                me._createAdvancedPanel(data, advancedContainer, moreLessLink);
                me._progressSpinner.stop();
            }

            }, function (data) {
                me._progressSpinner.stop();
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var okBtn = dialog.createCloseButton('OK');
                var title = me.getLocalization('channeloptionservice_alert_title');
                var msg = me.getLocalization('channeloptionservice_not_found_anything_text');
                dialog.show(title, msg, [okBtn]);
            });

        },
        /**
         * [_validateSearchKey description] Validate string that user is searching
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        _validateSearchKey: function (key) {
            var me = this;
            // empty string
            if (key === null || key === undefined || key.length === 0) {
                me._showError(me.getLocalization('cannot_be_empty'));
                return false;
            }
            // too many stars
            if ((key.match(/\*/g) || []).length > 1) {
                me._showError(me.getLocalization('too_many_stars'));
                return false;
            }
            // not enough characters accompanying a star
            if (key.indexOf('*') > -1 && key.length < 5) {
                me._showError(me.getLocalization('too_short'));
                return false;
            }

            // invalid characters (or a star in the wrong place...)
            if (me.safeChars) {
                if (!/^[a-zåäöA-ZÅÄÖ \.,\?\!0-9]+\**$/.test(key)) {
                    me._showError(me.getLocalization('invalid_characters'));
                    return false;
                }
            }
            return true;
        },
        /**
         * [_renderResults description] Renders results into UI
         * @param  {[type]} result    [description]
         * @param  {[type]} searchKey [description]
         * @return {[type]}           [description]
         */
        _renderResults: function (result, searchKey) {
            var me = this,
                searchResultWindow = me.templates.templateSearchResultsWindow.clone(),
                resultList = null,
                mapDiv = jQuery("#contentMap"),
                types = [];

            jQuery.each(result.locations, function(index, val) {
                if(jQuery.inArray(val.type, types) === -1) {
                    types.push(val.type);
                }
            });

            types.sort();

            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            searchResultWindow.find('div.header h3').text(me.getLocalization('searchResults_header'));

            searchResultWindow.find('div.header div.icon-close').bind(
                'click',
                function () {
                    searchResultWindow.remove();
                    me._updateMapModuleSize(mapDiv, searchResultWindow);
                    me._clearMapFromResults();
                    me._closeMapPopup();

                    me.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                    );
                }
            );

            var info = searchResultWindow.find('div.info');
            info.empty();

            // error handling
            if (result.totalCount === -1) {
                resultList.append(me.getLocalization('searchservice_search_alert_title') + ': ' + me.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                var nfK = 'searchservice_search_not_found_anything_text',
                    nf = me.getLocalization(nfK);

                resultList = me.optionPanel.find('div.resultList');
                resultList.append(nf);
                return;
            } else {

                me.toggleParentFlyout(me.optionPanel, searchResultWindow, mapDiv);

                info.append(me.getLocalization('searchResultCount') + ' ' +
                    result.totalCount + ' ' + me.getLocalization('searchResultCount2'));
                info.append('<br/>');

                if (result.hasMore) {
                    // more results available
                    info.append(
                        me.getLocalization('searchResultDescriptionMoreResults')
                    );
                    info.append('<br/>');
                }
                info.append(
                    me.getLocalization('searchResultDescriptionOrdering')
                );

                mapDiv.append(searchResultWindow);
                me._updateMapModuleSize(mapDiv, searchResultWindow);

                resultList = searchResultWindow.find('div.resultList');
                resultList.empty();
                me.lastResult = result;

             if (result.totalCount === 1) {
                    // move map etc
                    me._resultClicked(result.locations[0], true);
                }
            }

            //Accordion
            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion'),
                container = jQuery('div.myAccordion'),
                panel = null;

            jQuery.each(types, function(index, type) {
                var results = jQuery.grep(result.locations, function(r, i){
                    return r.type === type;
                });
                if(results.length>0) {

                    panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                    panel.setTitle(type);

                    // render results
                    var table = me.templates.templateResultTable.clone(),
                        tableHeaderRow = table.find('thead tr'),
                        tableBody = table.find('tbody');
                    // header reference needs some closure magic to work here

                    var headerClosureMagic = function (scopedValue, results) {
                        return function () {
                            // clear table for sorted results
                            tableBody.empty();
                            // default to descending sort
                            var descending = false;
                            // if last sort was made on the same column ->
                            // change direction
                            if (me.lastSort && me.lastSort.attr === scopedValue.prop) {
                                descending = !me.lastSort.descending;
                            }
                            // sort the results
                            me._sortResults(scopedValue.prop, descending, results);
                            // populate table content
                            me._populateResultTable(tableBody, results);
                            // apply visual changes
                            var headerContainer = tableHeaderRow.find('a:contains(' + scopedValue.title + ')');
                            tableHeaderRow.find('th').removeClass('asc');
                            tableHeaderRow.find('th').removeClass('desc');
                            if (descending) {
                                headerContainer.parent().addClass('desc');
                            } else {
                                headerContainer.parent().addClass('asc');
                            }
                            return false;
                        };
                    };
                    var i,
                        header,
                        link;

                    for (i = 0; i < me.resultHeaders.length; i += 1) {
                        header = me.templates.templateResultTableHeader.clone();
                        link = header.find('a');
                        link.append(me.resultHeaders[i].title);
                        link.bind('click', headerClosureMagic(me.resultHeaders[i], results));
                        tableHeaderRow.append(header);
                    }

                    me._populateResultTable(tableBody, results);

                    panel.setContent(table);
                    panel.setVisible(true);

                    if(types.length == 1){
                        panel.open();
                    }

                    accordion.addPanel(panel);
                }
            });

            resultList.append('<div><h3>' +
                me.getLocalization('searchResults') + ' ' + result.totalCount + ' ' +
                me.getLocalization('searchResultsDescription') + ' ' + searchKey + '</h3></div>');

            accordion.insertTo(resultList);

            var btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            btn.setTitle(me.getLocalization("show-all-on-map"));
            btn.addClass('show-on-map');
            jQuery(btn.getElement()).click(
                function (event) {
                    jQuery(this).addClass('active');
                    me._zoomMapToResults(result, true, resultList.find('table.search_result'));
                }
            );
            var showOnMapBtns = searchResultWindow.find('div.showOnMapBtns');
            btn.insertTo(showOnMapBtns);

            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            btn.setTitle(me.getLocalization("show-selected-on-map"));
            btn.addClass('show-on-map');
            jQuery(btn.getElement()).click(
                function (event) {
                    jQuery(this).addClass('active');
                    me._zoomMapToResults(result, false, resultList.find('table.search_result'));
                }
            );
            btn.insertTo(showOnMapBtns);

            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            btn.setTitle(me.getLocalization("back-to-search"));
            jQuery(btn.getElement()).click(
                function (event) {
                   me.toggleParentFlyout(me.optionPanel, searchResultWindow, mapDiv);
                }
            );
            var returnTosearch = searchResultWindow.find('div.returnTosearch');
            btn.insertTo(returnTosearch);
        },

        /**
         * [toggleParentFlyout description] Toggles flyout UI, needed cause user wants to go back on search module
         * @param  {[type]} optionPanel [description]
         * @return {[type]}             [description]
         */
        toggleParentFlyout: function(optionPanel, searchResultWindow, mapDiv){
            var me = this;
            var menuBtn = jQuery('.oskari-tile.search');
            if(optionPanel.parents('.oskari-flyout').is(':visible')){
                optionPanel.parents('.oskari-flyout').removeClass('oskari-attached').addClass('oskari-closed');
                menuBtn.removeClass('oskari-tile-attached').addClass('oskari-tile-closed');

            } else {
                optionPanel.parents('.oskari-flyout').removeClass('oskari-closed').addClass('oskari-attached');
                menuBtn.removeClass('oskari-tile-closed').addClass('oskari-tile-attached');

                searchResultWindow.remove();
                me._updateMapModuleSize(mapDiv, searchResultWindow);
                me._clearMapFromResults();
                me._closeMapPopup();
            }

        },

        /**
         * [_updateMapModuleSize description] Updates size left UI component and map
         * @param  {[type]} mapDiv             [description]
         * @param  {[type]} searchResultWindow [description]
         * @return {[type]}                    [description]
         */
         _updateMapModuleSize: function (mapDiv, searchResultWindow) {
            var me = this;

            if(searchResultWindow.find('div.resultList').is(":visible")){
                mapDiv.css("margin-left",searchResultWindow.width());
                jQuery(".oskariui-center").width(jQuery(".oskariui-center").width()-searchResultWindow.width());
                jQuery(".fullscreenDiv").hide();
            }else{
                mapDiv.css("margin-left",jQuery("#maptools").width());
                jQuery(".oskariui-center").width(jQuery(".oskariui-center").width()+searchResultWindow.width());
                jQuery(".fullscreenDiv").show();
            }

            var reqBuilder = me.sandbox.getRequestBuilder(
                 'MapFull.MapSizeUpdateRequest'
            );

            if (reqBuilder) {
                 me.sandbox.request(me, reqBuilder(true));
            }
        },

        /**
         * [_clearMapFromResults description] Clears map from result vectors
         * @param  {[type]} identifier [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} layer      [description]
         * @return {[type]}            [description]
         */
        _clearMapFromResults: function(identifier, value, layer){
            var me = this,
             rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';

            me.sandbox.postRequestByName(rn, [identifier, value, layer]);
        },

        /**
         * [_getVectorLayerStyle description] Vector layer styles
         * @return {[type]} [description]
         */
        _getVectorLayerStyle: function(){

            var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#D3BB1B';
            style.fillColor = '#FFDE00';
            style.fillOpacity = 0.6;
            style.strokeOpacity = 0.8;
            style.strokeWidth = 2;
            style.cursor = 'pointer';

            return style;
        },
        /**
         * [_zoomMapToResults description] Zooms map into results
         * @param  {[type]} result    [description]
         * @param  {[type]} showAll   [description]
         * @param  {[type]} tableBody [description]
         * @return {[type]}           [description]
         */
        _zoomMapToResults: function(result, showAll, tableBody) {
            var me = this;
            var rn = 'MapModulePlugin.AddFeaturesToMapRequest';

            me._clearMapFromResults();
            me._closeMapPopup();

            //Fake layer for zoomin event
            var olLayer = new OpenLayers.Layer.Vector('templayer'),
                format = new OpenLayers.Format.WKT({}),
                feature,
                geometry,
                mapMoveRequest,
                bounds,
                center,
                isSelected = false;

            jQuery.each(result.locations, function( i, value ){
                if(showAll){
                    me.sandbox.postRequestByName(rn, [value.GEOMETRY, 'WKT', {id:value.id}, null, null, true, me._getVectorLayerStyle(), false]);
                    feature = format.read(value.GEOMETRY);
                    olLayer.addFeatures([feature]);
                    isSelected = true;
                }else{
                    var row = tableBody.find("tr[name="+value.id+"]");
                    var firstCell = row.find("td:first-child");
                    if(firstCell.find("input").is(":checked")){
                        me.sandbox.postRequestByName(rn, [value.GEOMETRY, 'WKT', {id:value.id}, null, null, true, me._getVectorLayerStyle(), false]);
                        feature = format.read(value.GEOMETRY);
                        olLayer.addFeatures([feature]);
                        isSelected = true;
                    }
                }

            });

            if(isSelected){

            bounds = olLayer.getDataExtent();
            center = bounds.getCenterLonLat();

            mapmoveRequest = me.sandbox.getRequestBuilder('MapMoveRequest')(center.lon, center.lat, bounds);
            me.sandbox.request(me, mapmoveRequest);

            }else{
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var okBtn = dialog.createCloseButton('OK');
                var title = me.getLocalization('no_selected_rows_alert_title');
                var msg = me.getLocalization('no_selected_rows_have_to_select');
                dialog.show(title, msg, [okBtn]);
                tableBody.parents('.searchFromChannels_window_search_results').find('.show-on-map').removeClass('active');
            }

        },
        /**
         * [_populateResultTable description] Populate results into UI
         * @param  {[type]} resultsTableBody [description]
         * @return {[type]}                  [description]
         */
        _populateResultTable: function (resultsTableBody, data) {
            var me = this;
            // row reference needs some closure magic to work here
            var closureMagic = function (scopedValue) {
                return function () {
                    if(resultsTableBody.parents('.searchFromChannels_window_search_results').find('.show-on-map').hasClass('active')){
                        me._resultClicked(scopedValue, false);
                    }else{
                        me._resultClicked(scopedValue, true);
                    }

                    return false;
                };
            };
            var i,
                row,
                resultContainer,
                cells,
                titleCell,
                title;

            for (i = 0; i < data.length; i += 1) {
                row = data[i];
                resultContainer = me.templates.templateResultTableRow.clone();
                resultContainer.attr("name",row.id);
                cells = resultContainer.find('td');
                titleCell = jQuery(cells[1]);
                title = titleCell.find('a');
                title.append(row.name);
                title.bind('click', closureMagic(row));
                jQuery(cells[2]).append(row.village);
                jQuery(cells[3]).append(row.type);
                resultsTableBody.append(resultContainer);
            }
        },
        /**
         * [_resultClicked description] Click result from UI
         * @param  {[type]} result [description]
         * @return {[type]}        [description]
         */
        _resultClicked: function (result, drawVector) {
            var me = this,
                popupId = 'searchResultPopup',
                sandbox = me.sandbox;
            // good to go
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                zoom = result.zoomLevel;
            if(result.zoomScale) {
                 zoom = {scale : result.zoomScale};
            }

           sandbox.request(
                me.getName(),
                moveReqBuilder(result.lon, result.lat, zoom)
            );

            if(drawVector){
                var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                sandbox.postRequestByName(rn, [result.GEOMETRY, 'WKT', {id:result.id}, null, 'replace', true, me._getVectorLayerStyle(), false]);
            }

            var loc = me.getLocalization('resultBox');

            var content = [
                {
                    html: '<h3>' + result.name + '</h3>' + '<p>' + result.village + '<br/>' + result.type + '</p>',
                    actions: [{
                        name: loc.close,
                        type: 'link',
                        action: function(){
                            var rN = 'InfoBox.HideInfoBoxRequest',
                                rB = sandbox.getRequestBuilder(rN),
                                request = rB(popupId);
                            sandbox.request(me.getName(), request);
                        }
                    }]
                }
            ];

            var options = {
                hidePrevious: true
            };

            var rN = 'InfoBox.ShowInfoBoxRequest',
                rB = sandbox.getRequestBuilder(rN),
                request = rB(
                    popupId,
                    loc.title,
                    content,
                    new OpenLayers.LonLat(result.lon, result.lat),
                    options
                );

            sandbox.request(me.getName(), request);
        },
        /**
         * [_closeMapPopup description] Close map popup
         * @return {[type]} [description]
         */
        _closeMapPopup: function (){
            var me = this;
            var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(me.popupId);
            me.sandbox.request(this, request);
        },

        /**
         * [_showError description] Error dialog
         * @param  {[type]} error [description]
         * @return {[type]}       [description]
         */
        _showError: function (error) {
            var me = this;
           /* me.searchPanel.hide();*/
            me.optionPanel.show();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okButton = dialog.createCloseButton('OK');

            dialog.setId('oskari_search_error_popup');

            dialog.show(
                this.getLocalization('searchservice_alert_title'),
                error, [okButton]
            );
        },

        /**
        * Sort advanced options.
        * @method _sortAdvanced
        * @private
        */
        _sortAdvanced: function(a, b){
            var topicA = a.locale.name;
            var topicB = b.locale.name;
            if(topicA === null){
                topicA = '';
            }
            if(topicB === null){
                topicB = '';
            }

            topicA = topicA.toLowerCase();
            topicB = topicB.toLowerCase();

            if (topicA < topicB) {
                return -1;
            } else if (topicA > topicB) {
                return 1;
            } else {
                return 0;
            }
        },

        /**
         * [_createAdvancedPanel creates checkboxes from channes by role]
         * @param  {[type]} data              [description]
         * @param  {[type]} advancedContainer [description]
         * @param  {[type]} moreLessLink      [description]
         * @return {[type]}                   [description]
         */
        _createAdvancedPanel: function (data, advancedContainer, moreLessLink) {
            var me = this,
                dataFields = data.channels,
                i,
                dataField,
                newRow,
                newLabel,
                value,
                text,
                newCheckbox,
                newCheckboxDef;

            newRow = me.templates.checkboxRow.clone();
            newRow.find('div.rowLabel').text(me.getLocalization('advanced_topic'));

            if (dataFields.length === 0) {
                newRow.find('div.rowLabel').text(me.getLocalization('no_channels_found'));
                advancedContainer.append(newRow);
                return false;
            }

            dataFields.sort(me._sortAdvanced);

            for (i = 0; i < dataFields.length; i += 1) {
                dataField = dataFields[i];

                value = dataField.id;
                text = dataField.locale.name;
                newCheckbox = me.templates.checkbox.clone();
                newCheckboxDef = newCheckbox.find(':checkbox');
                newCheckboxDef.attr('name', "channelChkBox");
                newCheckboxDef.attr('value', dataField.id);
                newCheckboxDef.attr('checked', !!dataField.isDefault);
                newCheckbox.find('label.searchFromChannelsTypeText').append(text);
                newRow.find('.checkboxes').append(newCheckbox);

                advancedContainer.append(newRow);
            }

            advancedContainer.append(newRow);
        },

        /**
         * @private @method _sortResults
         * Sorts the last search result by comparing given attribute on
         * the search objects
         *
         * @param {String} pAttribute attributename to sort by (e.g.
         * result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         *
         */
        _sortResults: function (pAttribute, pDescending, data) {
            var me = this;
            if (!data) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            data.sort(function (a, b) {
                return me._searchResultComparator(a, b, pAttribute, pDescending);
            });

        },

         /**
         * @private @method _searchResultComparator
         * Compares the given attribute on given objects for sorting
         * search result objects.
         *
         * @param {Object} a search result 1
         * @param {Object} b search result 2
         * @param {String} pAttribute attributename to sort by (e.g.
         * a[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         *
         */
        _searchResultComparator: function (a, b, pAttribute, pDescending) {
            var nameA = a[pAttribute].toLowerCase(),
                nameB = b[pAttribute].toLowerCase(),
                value = 0;
            if (nameA === nameB || 'name' === pAttribute) {
                // Because problem with address 1 and address 10 then
                // id are ranked right
                nameA = a.id;
                nameB = b.id;
            }
            if (nameA < nameB) {
                value = -1;
            } else if (nameA > nameB) {
                value = 1;
            }
            if (pDescending) {
                value = value * -1;
            }
            return value;
        },

        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {

        },
        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
