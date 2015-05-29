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
/*        this.resultHeaders = [{
            title: this.getLocalization('grid').name,
            prop: 'name'
        }, {
            title: '', // this.getLocalization('grid').rating,
            tooltip: ''
//            prop: 'rating'
        }, {
            title: '',
            tooltip: this.getLocalization('grid').showBBOX,
            prop: 'showBbox'
        }, {
            title: '',
            tooltip: this.getLocalization('grid').info,
            prop: 'info'
        }, {
            title: '',
            tooltip: this.getLocalization('grid').remove,
            prop: 'remove'
        }];
        this.lastSearch = '';
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        this.drawCoverage = false;
        // Search result actions array.
        this.searchResultActions = [];*/
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
/*            ,
            metadataDropdown: jQuery(
                '<div class="metadataType">' +
                '  <select class="metadataDef"></select>' +
                '</div>'
            ),
            metadataButton: jQuery(
                '<div class="metadataType">' +
                '  <input id="metadataCoverageButton" class="metadataCoverageDef" type="button"></input>' +
                '</div>'
            ),
            dropdownOption: jQuery('<option></option>'),
            checkboxRow: jQuery(
                '<div class="metadataRow checkboxRow">' +
                '  <div class="rowLabel"></div>' +
                '  <div class="checkboxes"></div>' +
                '</div>'
            ),
            dropdownRow: jQuery(
                '<div class="metadataRow dropdownRow">' +
                '  <div class="rowLabel"></div>' +
                '</div>'
            ),
            buttonRow: jQuery(
                '<div class="metadataRow buttonRow">' +
                '  <div class="rowLabel"></div>' +
                '</div>'
            ),
            searchPanel: jQuery('<div class="main metadataSearching"></div>'),
            resultPanel: jQuery('<div class="main metadataResults"></div>'),
            resultHeader: jQuery(
                '<div class="metadataResultHeader">' +
                '  <div class="panelHeader resultTitle"></div>' +
                '  <div class="panelHeader resultLinks">' +
                '    <a href="JavaScript:void(0);" class="showLink"></a>' +
                '    <a href="JavaScript:void(0);" class="modifyLink"></a>' +
                '  </div>' +
                '</div>'
            ),
            resultTable: jQuery(
                '<div class="resultTable">' +
                '  <table class="metadataSearchResult">' +
                '    <thead><tr></tr></thead>' +
                '    <tbody></tbody>' +
                '  </table>' +
                '</div>'
            ),
            resultTableHeader: jQuery('<th><a href="JavaScript:void(0);"></a></th>'),
            resultTableRow: jQuery(
                '<tr class="spacerRow">' +
                '  <td class="spacer"></td>' +
                '</tr>' +
                '<tr class="resultRow">' +
                '  <td></td>' +
                '  <td></td>' +
                '  <td><div class="actionPlaceholder"></div></td>' +
                '  <td><div class="showBbox icon-zoomto"></div></td>' +
                '  <td><div class="layerInfo icon-info"></div></td>' +
                '  <td><div class="resultRemove icon-close"></div></td>' +
                '</tr>'
            ),
            layerList: jQuery('<ul class="layerList"></ul>'),
            layerListItem: jQuery('<li></li>'),
            layerLink: jQuery('<a href="JavaScript:void(0);" class="layerLink"></a>')*/
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

            /**
             * @method FeatureData.FinishedDrawingEvent
             */
/*            'MetaData.FinishedDrawingEvent': function (event) {
                var me = this,
                    coverageFeature;

                coverageFeature = this.selectionPlugin.getFeaturesAsGeoJSON();

                this.coverageButton.val(me.getLocalization('deleteArea'));
                this.coverageButton[0].data = JSON.stringify(coverageFeature);
                this.drawCoverage = false;

                document.getElementById('oskari_metadatacatalogue_forminput_searchassistance').focus();
            },

            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    isShown = event.getViewState() !== 'close';

                // ExtensionUpdateEvents are fired a lot, only let metadatacatalogue extension event to be handled when enabled
                if (event.getExtension().getName() !== 'Search') {
                    // wasn't me or disabled -> do nothing
                    return;
                }

                if (!isShown && me.drawCoverage === false) {
                    if (me.selectionPlugin) {
                        me.selectionPlugin.stopDrawing();
                    }
                    if (me.coverageButton) {
                        me.coverageButton.val(me.getLocalization('delimitArea'));
                    }
                    me.drawCoverage = true;
                    document.getElementById('oskari_metadatacatalogue_forminput_searchassistance').focus();
                    var emptyData = {};
                    if (me.coverageButton) {
                        me.coverageButton[0].data = '';
                    }
                }

                if (event.getViewState() === 'close') {
                    me._removeFeaturesFromMap();
                }
            }*/
        },
        /**
         * @method _removeFeaturesFromMap
         * @private
         * Removes features from map.
         *
         * @param {String} identifier the identifier
         * @param {String} value the identifier value
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
/*        _removeFeaturesFromMap: function(identifier, value, layer){
            var me = this,
                rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';
            me.sandbox.postRequestByName(rn, [identifier, value, layer]);
        },*/
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
/*            me.searchPanel = me.templates.searchPanel.clone();
            me.resultPanel = me.templates.resultPanel.clone();*/
            searchFromChannelsContainer.append(me.optionPanel);
/*            metadataCatalogueContainer.append(me.searchPanel);
            metadataCatalogueContainer.append(me.resultPanel);*/
/*            me.searchPanel.hide();
            me.searchPanel.append(me.getLocalization('searching'));
            me.resultPanel.hide();*/

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
                        channelIds.push(jQuery(this).val());
                    }
                });
                console.dir(channelIds);

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

/*            var doMetadataCatalogue = function () {
                me._removeFeaturesFromMap();
                metadataCatalogueContainer.find('.metadataOptions').hide();
                metadataCatalogueContainer.find('.metadataSearching').show();
                var search = {
                    search: field.getValue()
                };
                // Collect the advanced search options
                if (moreLessLink.html() === me.getLocalization('showLess')) {
                    // Checkboxes
                    var checkboxRows = metadataCatalogueContainer.find('.checkboxRow'),
                        i,
                        checkboxDefs,
                        values,
                        j,
                        coverageButton,
                        checkboxDef,
                        dropdownDef,
                        dropdownRows,
                        dropdownRow;
                    for (i = 0; i < checkboxRows.length; i += 1) {
                        checkboxDefs = jQuery(checkboxRows[i]).find('.metadataMultiDef');
                        if (checkboxDefs.length === 0) {
                            continue;
                        }
                        values = [];
                        for (j = 0; j < checkboxDefs.length; j += 1) {
                            checkboxDef = jQuery(checkboxDefs[j]);
                            if (checkboxDef.is(':checked')) {
                                values.push(checkboxDef.val());
                            }
                        }
                        search[jQuery(checkboxDefs[0]).attr('name')] = values.join();
                    }
                    // Dropdown lists
                    dropdownRows = metadataCatalogueContainer.find('.dropdownRow');
                    for (i = 0; i < dropdownRows.length; i += 1) {
                        dropdownDef = jQuery(dropdownRows[i]).find('.metadataDef');
                        search[dropdownDef.attr('name')] = dropdownDef.find(':selected').val();
                    }
                    // Coverage geometry
                    search[me.coverageButton.attr('name')] = me.coverageButton[0].data;
                }
                me.lastSearch = field.getValue();

                me.searchService.doSearch(search, function (data) {
                    me._showResults(metadataCatalogueContainer, data);
                }, function (data) {
                    var key = field.getValue();
                    if (key === null || key === undefined || key.length === 0) {
                        me._showError(me.getLocalization('cannot_be_empty'));
                    } else {
                        me._showError(me.getLocalization('metadatasearchservice_not_found_anything_text'));
                    }
                });
            };*/

/*            button.setHandler(doMetadataCatalogue);
            field.bindEnterKey(doMetadataCatalogue);*/

            var controls = searchFromChannelsContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());

            // Metadata catalogue tab

            var title = me.getLocalization('tabTitle'),
                content = searchFromChannelsContainer,
                priority = this.tabPriority,
                id = 'oskari_searchfromchannels_tabpanel_header',
                reqName = 'Search.AddTabRequest',
                reqBuilder = me.sandbox.getRequestBuilder(reqName),
                req = reqBuilder(title, content, priority, id);

            me.sandbox.request(me, req);
            me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');

            // Link to advanced search
            var moreLessLink = this.templates.moreLessLink.clone();
            moreLessLink.html(me.getLocalization('showMore'));
            moreLessLink.click(function () {
                var advancedContainer = searchFromChannelsContainer.find('div.advanced');
                if (moreLessLink.html() === me.getLocalization('showMore')) {
                    // open advanced/toggle link text                    
                    me._progressSpinner.insertTo(jQuery(".searchFromChannelsOptions"));             
                    moreLessLink.html(me.getLocalization('showLess'));
                    if (advancedContainer.is(':empty')) {
                        me._progressSpinner.start();
                        me.optionService.getOptions(function (data) {
                            me._progressSpinner.stop();
                            me._createAdvancedPanel(data, advancedContainer, moreLessLink);
                        }, function (data) {
                            me._progressSpinner.stop(); 
                            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            var okBtn = dialog.createCloseButton('OK');
                            var title = me.getLocalization('channeloptionservice_alert_title');
                            var msg = me.getLocalization('channeloptionservice_not_found_anything_text');
                            dialog.show(title, msg, [okBtn]);
                        });
                    } else {
                        advancedContainer.show();
                    }
                } else {
                    // close advanced/toggle link text
                    me._progressSpinner.stop();
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
            sandbox = me.sandbox;
            // good to go
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                zoom = result.zoomLevel;
            if(result.zoomScale) {
                var zoom = {scale : result.zoomScale};
            }
            sandbox.request(
                me.getName(),
                moveReqBuilder(result.lon, result.lat, zoom, false)
            );

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
        },

        /**
         * @method _getOptionLocalization
         * Generates localization for option values
         */
/*        _getOptionLocalization: function (value) {
            var me = this,
                text;
            // Localization available?
            if (typeof value.locale !== 'undefined') {
                text = value.locale;
            } else {
                text = me.getLocalization(value.val);
                if (typeof text !== 'string') {
                    text = value.val;
                }
            }
            return text;
        },

        _getCoverage: function () {
            var me = this;
            var mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');

            var config = {
                id: 'MetaData',
                enableTransform: true
            };

            this.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', config);
            mapModule.registerPlugin(this.selectionPlugin);
            mapModule.startPlugin(this.selectionPlugin);
            this.selectionPlugin.startDrawing({drawMode: 'square'});
        },*/

        /**
         * @method _updateOptions
         * Updates availability of the options
         */
/*        _updateOptions: function (container) {
            var me = this,
                i,
                condition,
                row,
                j,
                ref,
                refItem,
                value,
                refRow,
                selectedOption;
            for (i = 0; i < me.conditions.length; i += 1) {
                condition = me.conditions[i];
                row = container.find('.' + condition.field);
                for (j = 0; j < condition.shownIf.length; j += 1) {
                    ref = condition.shownIf[j];
                    for (refItem in ref) {
                        if (ref.hasOwnProperty(refItem)) {
                            value = condition.shownIf[j][refItem];
                            refRow = container.find('.metadataRow.' + refItem);
                            if (refRow.hasClass('checkboxRow')) {
                                // Check box
                                if (!refRow.find('input:checkbox[value=' + value + ']').is(':checked')) {
                                    row.hide();
                                    return;
                                }
                            } else if (refRow.hasClass('dropdownRow')) {
                                selectedOption = refRow.find('.metadataDef option:selected').val();
                                if (value !== selectedOption) {
                                    row.hide();
                                    return;
                                }
                            }
                        }
                    }
                }
                row.show();
            }
        },*/

        /**
         * @method showResults
         * Displays metadata search results
         */
/*        _showResults: function (metadataCatalogueContainer, data) {
            var me = this;

            me.lastResult = data.results;
            var resultPanel = metadataCatalogueContainer.find('.metadataResults'),
                searchPanel = metadataCatalogueContainer.find('.metadataSearching'),
                optionPanel = metadataCatalogueContainer.find('.metadataOptions');

            // Hide other panels, if visible
            searchPanel.hide();
            optionPanel.hide();
            // Create header
            var resultHeader = me.templates.resultHeader.clone();
            resultHeader.find('.resultTitle').text(me.getLocalization('metadataCatalogueResults'));
            var showLink = resultHeader.find('.showLink');
            showLink.hide();
            showLink.html(me.getLocalization('showSearch'));
            showLink.click(function () {
                jQuery('table.metadataSearchResult tr').show();
                showLink.hide();
            });
            var modifyLink = resultHeader.find('.modifyLink');
            modifyLink.html(me.getLocalization('modifySearch'));
            modifyLink.click(function () {
                resultPanel.empty();
                optionPanel.show();
                me._removeFeaturesFromMap();
            });

            if (data.results.length === 0) {
                resultPanel.append(resultHeader);
                resultPanel.append(me.getLocalization('searchservice_search_not_found_anything_text'));
                resultPanel.show();
                return;
            }

            // render results
            var table = me.templates.resultTable.clone(),
                tableHeaderRow = table.find('thead tr'),
                tableBody = table.find('tbody');
            tableBody.empty();
            // header reference needs some closure magic to work here
            var headerClosureMagic = function (scopedValue) {
                return function () {
                    // save hidden results
                    var hiddenRows = tableBody.find('tr.resultRow:hidden'),
                        hiddenResults = [],
                        i;
                    for (i = 0; i < hiddenRows.length; i += 1) {
                        hiddenResults.push(jQuery(hiddenRows[i]).data('resultId'));
                    }

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

                    // hide hidden results
                    var newRows = tableBody.find('tr'),
                        resultId,
                        j;
                    for (i = 0; i < newRows.length; i += 1) {
                        resultId = jQuery(newRows[i]).data('resultId');
                        for (j = 0; j < hiddenResults.length; j += 1) {
                            if (resultId === hiddenResults[j]) {
                                jQuery(newRows[i]).hide();
                            }
                        }
                    }

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
                header = me.templates.resultTableHeader.clone();
                header.addClass(me.resultHeaders[i].prop);
                link = header.find('a');
                link.append(me.resultHeaders[i].title);
                // Todo: Temporarily only the first column is sortable
                if (i === 0) {
                    link.bind('click', headerClosureMagic(me.resultHeaders[i]));
                }
                tableHeaderRow.append(header);
            }

            me._populateResultTable(tableBody);
            resultPanel.append(resultHeader);
            resultPanel.append(table);
            optionPanel.hide();
            resultPanel.show();
        },*/

/*        _populateResultTable: function (resultsTableBody) {
            var me = this,
                results = me.lastResult;
            // row reference needs some closure magic to work here
            var closureMagic = function (scopedValue) {
                return function () {
                    me._resultClicked(scopedValue);
                    return false;
                };
            };
            var selectedLayers = me.sandbox.findAllSelectedMapLayers(),
                i,
                style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#D3BB1B';
            style.fillColor = '#FFDE00';
            style.fillOpacity = 0.6;
            style.strokeOpacity = 0.8;
            style.strokeWidth = 2;
            style.cursor = 'pointer';

            for (i = 0; i < results.length; i += 1) {
                if ((!results[i].name) || (results[i].name.length === 0)) {
                    continue;
                }
                (function (i) {
                    var j,
                        k,
                        resultContainer,
                        cells,
                        titleText,
                        layers,
                        newLayers,
                        row,
                        mapLayerService,
                        layerList;
                    row = results[i];
                    resultContainer = me.templates.resultTableRow.clone();
                    resultContainer.addClass('res' + i);
                    resultContainer.data('resultId', row.id);
                    cells = resultContainer.find('td').not('.spacer');
                    titleText = row.name;
                    // Include organization information if available
                    if ((row.organization) && (row.organization.length > 0)) {
                        titleText = titleText + ', ' + row.organization;
                    }
                    // Add title
                    jQuery(cells[0]).append(titleText);
                    jQuery(cells[0]).addClass(me.resultHeaders[0].prop);
                    if ((row.id) && (row.id.length > 0)) {
                        mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                        layers = mapLayerService.getLayersByMetadataId(row.id);

                        // Optional complementary layers
                        if ((row.uuid) && (row.uuid.length > 0)) {
                            row_loop: for (j = 0; j < row.uuid.length; j += 1) {
                                // Check for duplicates
                                if (row.uuid[j] === row.id) {
                                    continue;
                                }
                                for (k = 0; k < j; k += 1) {
                                    if (row.uuid[k] === row.uuid[j]) {
                                        continue row_loop;
                                    }
                                }
                                newLayers = mapLayerService.getLayersByMetadataId(row.uuid[j]);
                                if ((newLayers) && (newLayers.length > 0)) {
                                    layers = layers.concat(newLayers);
                                }
                            }
                        }
                        // Check for duplicates
                        j = 0;
                        layer_loop: while (j < layers.length) {
                            for (k = 0; k < j; k += 1) {
                                if (layers[k].getId() === layers[j].getId()) {
                                    layers.splice(j, 1);
                                    continue layer_loop;
                                }
                            }
                            j = j + 1;
                        }

                        // Add layer links
                        layerList = me.templates.layerList.clone();
                        for (j = 0; j < layers.length; j += 1) {
                            me._addLayerLinks(layers[j], layerList);
                        }

                        jQuery(cells[0]).append(layerList);
                        // Todo: real rating
                        // jQuery(cells[1]).append("*****");
                        //jQuery(cells[1]).addClass(me.resultHeaders[1].prop);

                        // Action link
                        if(me._isAction() == true){
                            jQuery.each(me.searchResultActions, function(index, action){
                                if(action.showAction(row)) {
                                    var actionElement = action.actionElement.clone(),
                                        callbackElement = null,
                                        actionTextEl = null;

                                    actionElement.css('margin-left','6px');
                                    actionElement.css('margin-right','6px');

                                    // Set action callback
                                    if(action.callback && typeof action.callback == 'function') {
                                        // Bind action click to bindCallbackTo if bindCallbackTo param exist
                                        if(action.bindCallbackTo) {
                                            callbackElement = licenseElement.find(action.bindCallbackTo);
                                        }
                                        // Bind action click to root element if bindCallbackTo is null
                                        else {
                                            callbackElement =  actionElement.first();
                                        }
                                        callbackElement.css({'cursor':'pointer'}).bind('click', {metadata: row}, function(event){
                                           action.callback(event.data.metadata);
                                        });
                                    }

                                    // Set action text
                                    if(action.actionTextElement) {
                                        actionTextEl = actionElement.find(action.actionTextElement);
                                    } else {
                                        actionTextEl = actionElement.first();
                                    }

                                    if(actionTextEl.is('input') ||
                                        actionTextEl.is('select') ||
                                        actionTextEl.is('button') ||
                                        actionTextEl.is('textarea')) {

                                        if(action.actionText && action.actionText != null){
                                            actionTextEl.val(action.actionText);
                                        }
                                        else {
                                            actionTextEl.val(me.getLocalization('licenseText'));
                                        }
                                    }
                                    else {
                                        if(action.actionText && action.actionText != null){
                                            actionTextEl.html(action.actionText);
                                        }
                                        else {
                                            actionTextEl.html(me.getLocalization('licenseText'));
                                        }
                                    }

                                    jQuery(cells[2]).find('div.actionPlaceholder').append(actionElement);
                                }
                            });
                        }

                        // Show bbox icon
                        if(row.geom && row.geom != null) {
                            jQuery(cells[3]).addClass(me.resultHeaders[2].prop);
                            jQuery(cells[3]).attr('title', me.resultHeaders[2].tooltip);
                            jQuery(cells[3]).find('div.showBbox').click(function () {
                                var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                                me.sandbox.postRequestByName(rn, [row.geom, 'WKT', {id:row.id}, null, 'replace', true, style, true]);
                            });
                        } else {
                            jQuery(cells[3]).find('div.showBbox').hide();
                        }

                        // Show layer info icon
                        jQuery(cells[4]).addClass(me.resultHeaders[3].prop);
                        jQuery(cells[4]).attr('title', me.resultHeaders[3].tooltip);
                        jQuery(cells[4]).find('div.layerInfo').click(function () {
                            var rn = 'catalogue.ShowMetadataRequest';
                            me.sandbox.postRequestByName(rn, [{
                                uuid: row.id
                            }]);
                        });

                        // Show remove icon
                        jQuery(cells[5]).addClass(me.resultHeaders[4].prop);
                        jQuery(cells[5]).attr('title', me.resultHeaders[4].tooltip);
                        jQuery(cells[5]).find('div.resultRemove').click(function () {
                            jQuery('table.metadataSearchResult tr.res' + i).hide();
                            jQuery('div.metadataResultHeader a.showLink').show();
                            me._removeFeaturesFromMap('id', row.id);
                        });
                    }
                    resultsTableBody.append(resultContainer);
                })(i);
            }
        },*/

/*        _addLayerLinks: function (layer, layerList) {
            var me = this,
                selectedLayers,
                selectedLayer,
                layerSelected,
                showText,
                hideText,
                visibilityRequestBuilder,
                builder,
                request,
                layerListItem,
                layerLink;

            layerSelected = false;
            selectedLayers = me.sandbox.findAllSelectedMapLayers();
            for (var k = 0; k < selectedLayers.length; k += 1) {
                selectedLayer = selectedLayers[k];
                if (layer.getId() === selectedLayer.getId()) {
                    layerSelected = true;
                    break;
                }
            }
            layerLink = me.templates.layerLink.clone();
            showText = me.getLocalization('show');
            hideText = me.getLocalization('hide');

            // Check if layer is already selected and visible
            if ((layerSelected) && (layer.isVisible())) {
                layerLink.html(hideText);
            } else {
                layerLink.html(showText);
            }

            // Click binding
            layerLink.click(function () {
                visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                // Hide layer
                if (jQuery(this).html() === hideText) {
                    // Set previously selected layer only invisible
                    /* if (layerSelected) {
                     request = visibilityRequestBuilder(layer.getId(), false);
                     // Unselect previously unselected layer
                     } else {
                     builder = me.sandbox.getRequestBuilder('RemoveMapLayerRequest');
                     request = builder(layer.getId());
                     }*/

                   /* builder = me.sandbox.getRequestBuilder('RemoveMapLayerRequest');
                    layerSelected = false;

                    request = builder(layer.getId());
                    me.sandbox.request(me.getName(), request);
                    jQuery(this).html(showText);
                } else {
                    // Select previously unselected layer
                    if (!layerSelected) {
                        me.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId(), false, layer.isBaseLayer()]);
                    }
                    // Set layer visible
                    request = visibilityRequestBuilder(layer.getId(), true);
                    me.sandbox.request(me.getName(), request);
                    jQuery(this).html(hideText);
                }
            });
            layerListItem = me.templates.layerListItem.clone();
            layerListItem.text(layer.getName());
            layerListItem.append('&nbsp;&nbsp;');
            layerListItem.append(layerLink);
            layerList.append(layerListItem);
        },*/

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
         * @method _searchResultComparator
         * Compares the given attribute on given objects for sorting
         * search result objects.
         * @private
         * @param {Object} a search result 1
         * @param {Object} b search result 2
         * @param {String} pAttribute attributename to sort by (e.g.
         * a[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
/*        _searchResultComparator: function (a, b, pAttribute, pDescending) {
            var nameA = a[pAttribute].toLowerCase(),
                nameB = b[pAttribute].toLowerCase(),
                value = 0;
            if (nameA === nameB) {
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
        },*/
        /**
        * @method addSearchResultAction
        * Add search result action.
        * @public
        * @param {jQuery} actionElement jQuery action element
        * @param {Function} callback the callback function
        * @param {String} bindCallbackTo the jQuery selector where to bind click operation
        * @param {String} actionTextElement action text jQuery selector. If it's null then text showed on main element
        * @param {String} actionText action text
        * @param {Function} showAction function. If return true then shows action text. Optional.
        */
/*        addSearchResultAction: function(actionElement, actionTextElement, callback, bindCallbackTo, actionText, showAction){
            var me = this,
                status = null;

            status = {
                actionElement: actionElement,
                actionTextElement: actionTextElement,
                callback: callback,
                bindCallbackTo: bindCallbackTo,
                actionText: actionText,
                showAction: function(metadata){return true;}
            };

            if(showAction && showAction !== null) {
                status.showAction = showAction;
            }

            me.searchResultActions.push(status);
        },*/
        /**
        * @method _isAction
        * @private
        * @return {Boolean} is action
        */
/*        _isAction: function(){
            var me = this;
            return me.searchResultActions.length > 0;
        },*/
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
