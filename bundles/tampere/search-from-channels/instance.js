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
        this.tabPriority = 5.0;
        this.conditions = [];
        this.safeChars = false;
        this.resultHeaders = [
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
                '  <div class="info"></div>' +
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
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
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
                optionAjaxUrl = sandbox.getAjaxUrl() + 'action_route=SearchWFSChannel';
            }

            var searchAjaxUrl = null;
            if (me.conf && me.conf.searchUrl) {
                searchAjaxUrl = me.conf.searchUrl;
            } else {
                searchAjaxUrl = sandbox.getAjaxUrl() + 'action_route=GetWfsSearchResult';
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
/*
            var searchServName =
                'Oskari.tampere.bundle.searchfromchannels.service.MetadataSearchService';
            me.searchService = Oskari.clazz.create(searchServName, searchAjaxUrl);*/

            sandbox.register(me);
            var p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            this.addSearchResultActionRequestHandler = Oskari.clazz.create(
                'Oskari.tampere.bundle.searchfromchannels.request.AddSearchResultActionRequestHandler',
                sandbox,
                me
            );
            sandbox.addRequestHandler(
                'AddSearchResultActionRequest',
                this.addSearchResultActionRequestHandler
            );

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
                if (me.state === null) {
                    me.state = {};
                }
                var value = field.getValue();
                me.state.metadatacataloguetext = value;
                if (!value) {
                    // remove results when field is emptied
                    var resultList = searchFromChannelsContainer.find('div.resultList');
                    resultList.empty();
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
                resultList.empty();
                var info = me.optionPanel.find('div.info');
                info.empty();

                // TODO: make some gif go round and round so user knows
                // something is happening
                var searchKey = field.getValue(me.safeChars);
                var channelIds = [];

                me.optionPanel.find("input[name='channelChkBox']").each( function () {
                    if(jQuery(this).is(":checked")){
                        channelIds.push(parseInt(jQuery(this).val()));
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

            me.optionService.getOptions(function (data) {

                if(data.channels.length > 0){
                    // Wfs search from channels tab OBS. this will be in UI if user has rights into channels
                    var title = me.getLocalization('tabTitle'),
                        content = searchFromChannelsContainer,
                        priority = this.tabPriority,
                        id = 'oskari_searchfromchannels_tabpanel_header',
                        reqName = 'Search.AddTabRequest',
                        reqBuilder = me.sandbox.getRequestBuilder(reqName),
                        req = reqBuilder(title, content, priority, id);

                    me.sandbox.request(me, req);  
                
                    me._createAdvancedPanel(data, advancedContainer, moreLessLink);    
                }
                
            }, function (data) {
                me._progressSpinner.stop(); 
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var okBtn = dialog.createCloseButton('OK');
                var title = me.getLocalization('channeloptionservice_alert_title');
                var msg = me.getLocalization('channeloptionservice_not_found_anything_text');
                dialog.show(title, msg, [okBtn]);
            });
     
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

        _renderResults: function (result, searchKey) {
            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            var me = this,
                resultList = me.optionPanel.find('div.resultList');

            resultList.empty();
            me.lastResult = result;

            var info = me.optionPanel.find('div.info');
            info.empty();

            // error handling
            if (result.totalCount === -1) {
                resultList.append(me.getLocalization('searchservice_search_alert_title') + ': ' + me.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                var nfK = 'searchservice_search_not_found_anything_text',
                    nf = me.getLocalization(nfK);

                resultList.append(nf);
                return;
            } else {
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
            }

            if (result.totalCount === 1) {
                // move map etc
                me._resultClicked(result.locations[0]);
                // close flyout
                inst.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            }
            // render results
            var table = me.templates.templateResultTable.clone(),
                tableHeaderRow = table.find('thead tr'),
                tableBody = table.find('tbody');
            // header reference needs some closure magic to work here

            var headerClosureMagic = function (scopedValue) {
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
                    me._sortResults(scopedValue.prop, descending);
                    // populate table content
                    me._populateResultTable(tableBody);
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
            for (i = 0; i < this.resultHeaders.length; i += 1) {
                header = me.templates.templateResultTableHeader.clone();
                link = header.find('a');
                link.append(this.resultHeaders[i].title);
                link.bind('click', headerClosureMagic(this.resultHeaders[i]));
                tableHeaderRow.append(header);
            }

            this._populateResultTable(tableBody);
            resultList.append('<div><h3>' +
                me.getLocalization('searchResults') + ' ' + result.totalCount + ' ' +
                me.getLocalization('searchResultsDescription') + ' ' + searchKey + '</h3></div>');
            resultList.append(table);
        },

        _populateResultTable: function (resultsTableBody) {
            var me = this;
            // row reference needs some closure magic to work here
            var closureMagic = function (scopedValue) {
                return function () {
                    me._resultClicked(scopedValue);
                    return false;
                };
            };
            var locations = this.lastResult.locations,
                i,
                row,
                resultContainer,
                cells,
                titleCell,
                title;

            for (i = 0; i < locations.length; i += 1) {
                row = locations[i];
                resultContainer = me.templates.templateResultTableRow.clone();
                cells = resultContainer.find('td');
                titleCell = jQuery(cells[0]);
                title = titleCell.find('a');
                title.append(row.name);
                title.bind('click', closureMagic(row));
                jQuery(cells[1]).append(row.village);
                jQuery(cells[2]).append(row.type);
                resultsTableBody.append(resultContainer);
            }
        },

        _resultClicked: function (result) {
            var me = this,
                popupId = 'searchResultPopup',
                sandbox = me.sandbox,
                style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            // good to go
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                zoom = result.zoomLevel;
            if(result.zoomScale) {
                var zoom = {scale : result.zoomScale};
            }
            /*
            sandbox.request(
                me.getName(),
                moveReqBuilder(result.lon, result.lat, zoom, false)
            );
*/

            
            style.pointRadius = 8;
            style.strokeColor = '#D3BB1B';
            style.fillColor = '#FFDE00';
            style.fillOpacity = 0.6;
            style.strokeOpacity = 0.8;
            style.strokeWidth = 2;
            style.cursor = 'pointer';
            var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
            sandbox.postRequestByName(rn, [result.GEOMETRY, 'WKT', {id:result.id}, null, 'replace', true, style, true]);

            var loc = me.getLocalization('resultBox'),
                resultActions = {},
                action;
            for (var name in this.resultActions) {
                if (this.resultActions.hasOwnProperty(name)) {
                    action = this.resultActions[name];
                    resultActions[name] = action(result);
                }
            }

            var contentItem = {
                html: '<h3>' + result.name + '</h3>' + '<p>' + result.village + '<br/>' + result.type + '</p>',
                actions: resultActions
            };
            var content = [contentItem];

            /* impl smashes action key to UI - we'll have to localize that here */
            contentItem.actions[loc.close] = function () {
                var rN = 'InfoBox.HideInfoBoxRequest',
                    rB = sandbox.getRequestBuilder(rN),
                    request = rB(popupId);
                sandbox.request(me.getName(), request);
            };

            var rN = 'InfoBox.ShowInfoBoxRequest',
                rB = sandbox.getRequestBuilder(rN),
                request = rB(
                    popupId,
                    loc.title,
                    content,
                    new OpenLayers.LonLat(result.lon, result.lat),
                    true
                );

            sandbox.request(me.getName(), request);
        },

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

                newRow = null;
                newRow = me.templates.checkboxRow.clone();
                newRow.find('div.rowLabel').text(me.getLocalization('advanced_topic'));

                 if (dataFields.length === 0) {
                    newRow.find('div.rowLabel').text(me.getLocalization('no_channels_found'));
                    advancedContainer.append(newRow);
                    return false;
                }  

            for (i = 0; i < dataFields.length; i += 1) {
                dataField = dataFields[i];            

                value = dataField["wfsId"];
                text = dataField.topic[Oskari.getLang()];
                newCheckbox = me.templates.checkbox.clone();
                newCheckboxDef = newCheckbox.find(':checkbox');
                newCheckboxDef.attr('name', "channelChkBox");
                newCheckboxDef.attr('value', dataField["id"]);
                if(dataField["is_default"]){
                    newCheckboxDef.attr('checked', true);
                }
                newCheckbox.find('label.searchFromChannelsTypeText').append(text);
                newRow.find('.checkboxes').append(newCheckbox);

                advancedContainer.append(newRow);
            }

            advancedContainer.append(newRow);
            advancedContainer.hide();
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
        _sortResults: function (pAttribute, pDescending) {
            var me = this;
            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            this.lastResult.locations.sort(function (a, b) {
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
