/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundleInstance
 *
 * Main component and starting point for the "metadata catalogue" functionality.
 * Provides metadata catalogue search functionality for the map.
 *
 * See Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundle for bundle definition.
 *
 */
Oskari.clazz
    .define('Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance',

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
            this.resultHeaders = [{
                title: this.getLocalization('grid').name,
                prop: 'name'
            }, {
                title: '', // this.getLocalization('grid').rating,
                prop: 'rating'
            }, {
                title: '',
                prop: 'info'
            }, {
                title: '',
                prop: 'remove'
            }];
            this.lastSearch = '';
            // last search result is saved so we can sort it in client
            this.lastResult = null;
            // last sort parameters are saved so we can change sort direction
            // if the same column is sorted again
            this.lastSort = null;
        }, {
            /**
             * @static
             * @property __name
             */
            __name: 'catalogue.bundle.metadatacatalogue',
            /**
             * @static
             * @property templates
             */
            templates: {
                metadataTab: jQuery('<div class="metadataCatalogueContainer"></div>'),
                optionPanel: jQuery('<div class="main metadataOptions">' +
                    '<div class="metadataCatalogueDescription"></div>' +
                    '<div class="controls"></div>' +
                    '<div class="moreLess"></div>' +
                    '<div class="advanced"></div>' +
                    '</div>'),
                moreLessLink: jQuery('<a href="JavaScript:void(0);" class="moreLessLink"></a>'),
                advanced: jQuery('<div class="advanced"></div>'),
                metadataCheckbox: jQuery('<div class="metadataType"><label class="metadataTypeText"><input type="checkbox" class="metadataMultiDef"></label></div>'),
                metadataDropdown: jQuery('<div class="metadataType"><select class="metadataDef"></select></div>'),
                dropdownOption: jQuery('<option></option>'),
                checkboxRow: jQuery('<div class="metadataRow checkboxRow"><div class="rowLabel"></div class=""><div class="checkboxes"></div></div></div>'),
                dropdownRow: jQuery('<div class="metadataRow dropdownRow"><div class="rowLabel"></div></div>'),
                searchPanel: jQuery('<div class="main metadataSearching"></div>'),
                resultPanel: jQuery('<div class="main metadataResults"></div>'),
                resultHeader: jQuery('<div class="metadataResultHeader">' + '<div class="panelHeader resultTitle"></div>' + '<div class="panelHeader resultLinks">' + '<a href="JavaScript:void(0);" class="showLink"></a>' + '<a href="JavaScript:void(0);" class="modifyLink"></a>' + '</div>' + '</div>'),
                resultTable: jQuery('<div class="resultTable"><table class="metadataSearchResult">' + '<thead><tr></tr></thead>' + '<tbody></tbody>' + '</table></div>'),
                resultTableHeader: jQuery('<th><a href="JavaScript:void(0);"></a></th>'),
                resultTableRow: jQuery('<tr class="spacerRow"><td class="spacer"></td></tr><tr class="resultRow">' + '<td></td>' + '<td></td>' + '<td><div class="layerInfo icon-info"></div></td>' + '<td><div class="resultRemove icon-close"></div></td>' + '</tr>'),
                layerList: jQuery('<ul class="layerList"></ul>'),
                layerListItem: jQuery('<li></li>'),
                layerLink: jQuery('<a href="JavaScript:void(0);" class="layerLink"></a>')
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
                    optionAjaxUrl = sandbox.getAjaxUrl() + 'action_route=GetMetadataSearchOptions';
                }

                var searchAjaxUrl = null;
                if (me.conf && me.conf.searchUrl) {
                    searchAjaxUrl = me.conf.searchUrl;
                } else {
                    searchAjaxUrl = sandbox.getAjaxUrl() + 'action_route=GetMetadataSearch';
                }

                // Default tab priority
                if (me.conf && typeof me.conf.priority === 'number') {
                    me.tabPriority = me.conf.priority;
                }

                var optionServName =
                    'Oskari.catalogue.bundle.metadatacatalogue.service.MetadataOptionService';
                me.optionService = Oskari.clazz.create(optionServName, optionAjaxUrl);

                var searchServName =
                    'Oskari.catalogue.bundle.metadatacatalogue.service.MetadataSearchService';
                me.searchService = Oskari.clazz.create(searchServName, searchAjaxUrl);

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
            eventHandlers: {},

            /**
             * @method stop
             * implements BundleInstance protocol stop method
             */
            stop: function () {
                var sandbox = this.sandbox(),
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
                    metadataCatalogueContainer = me.templates.metadataTab.clone(),
                    optionPanel = me.templates.optionPanel.clone(),
                    searchPanel = me.templates.searchPanel.clone(),
                    resultPanel = me.templates.resultPanel.clone();
                metadataCatalogueContainer.append(optionPanel);
                metadataCatalogueContainer.append(searchPanel);
                metadataCatalogueContainer.append(resultPanel);
                searchPanel.hide();
                searchPanel.append(me.getLocalization('searching'));
                resultPanel.hide();

                var metadataCatalogueDescription = metadataCatalogueContainer.find('div.metadataCatalogueDescription');
                metadataCatalogueDescription.html(me.getLocalization('metadataCatalogueDescription'));

                var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
                field.setPlaceholder(me.getLocalization('assistance'));
                field.setIds('oskari_metadatacatalogue_forminput', 'oskari_metadatacatalogue_forminput_searchassistance');

                // var regex = /[\s\w\d\.\,\?\!\-äöåÄÖÅ]*\*?$/;
                // field.setContentCheck(true, me.getLocalization('contentErrorMsg'), regex);

                field.bindChange(function (event) {
                    if (me.state === null) {
                        me.state = {};
                    }
                    var value = field.getValue();
                    me.state.metadatacataloguetext = value;
                    if (!value) {
                        // remove results when field is emptied
                        var resultList = metadataCatalogueContainer.find('div.resultList');
                        resultList.empty();
                    }
                });
                field.addClearButton('oskari_metadatacatalogue_forminput_clearbutton');

                var button = Oskari.clazz.create('Oskari.userinterface.component.Button');
                button.setTitle(me.getLocalization('metadataCatalogueButton'));
                button.setId('oskari_metadatacatalogue_button_search');

                var doMetadataCatalogue = function () {
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
                    }
                    me.lastSearch = field.getValue();
                    me.searchService.doSearch(search, function (data) {
                        me._showResults(metadataCatalogueContainer, data);
                    }, function (data) {
                        searchPanel.hide();
                        optionPanel.show();
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                            okBtn = dialog.createCloseButton('OK'),
                            title = me.getLocalization('metadatasearchservice_alert_title'),
                            msg = me.getLocalization('metadatasearchservice_not_found_anything_text');
                        dialog.show(title, msg, [okBtn]);
                    });
                };

                button.setHandler(doMetadataCatalogue);
                field.bindEnterKey(doMetadataCatalogue);

                var controls = metadataCatalogueContainer.find('div.controls');
                controls.append(field.getField());
                controls.append(button.getElement());

                // Metadata catalogue tab

                var title = me.getLocalization('tabTitle'),
                    content = metadataCatalogueContainer,
                    priority = this.tabPriority,
                    id = 'oskari_metadatacatalogue_tabpanel_header',
                    reqName = 'Search.AddTabRequest',
                    reqBuilder = me.sandbox.getRequestBuilder(reqName),
                    req = reqBuilder(title, content, priority, id);

                me.sandbox.request(me, req);

                // Link to advanced search
                var moreLessLink = this.templates.moreLessLink.clone();
                moreLessLink.html(me.getLocalization('showMore'));
                moreLessLink.click(function () {
                    var advancedContainer = metadataCatalogueContainer.find('div.advanced');
                    if (moreLessLink.html() === me.getLocalization('showMore')) {
                        // open advanced/toggle link text
                        moreLessLink.html(me.getLocalization('showLess'));
                        if (advancedContainer.is(':empty')) {
                            me.optionService.getOptions(function (data) {
                                me._createAdvancedPanel(data, advancedContainer, moreLessLink);
                            }, function (data) {
                                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                                var okBtn = dialog.createCloseButton('OK');
                                var title = me.getLocalization('metadataoptionservice_alert_title');
                                var msg = me.getLocalization('metadataoptionservice_not_found_anything_text');
                                dialog.show(title, msg, [okBtn]);
                            });
                        } else {
                            advancedContainer.show();
                        }
                    } else {
                        // close advanced/toggle link text
                        moreLessLink.html(me.getLocalization('showMore'));
                        advancedContainer.hide();
                    }
                });
                metadataCatalogueContainer.find('div.moreLess').append(moreLessLink);
            },
            _createAdvancedPanel: function (data, advancedContainer, moreLessLink) {
                var me = this,
                    dataFields = data.fields,
                    i,
                    dataField,
                    newRow,
                    newLabel,
                    j,
                    value,
                    text,
                    newCheckbox,
                    newCheckboxDef,
                    newDropdown,
                    dropdownDef,
                    emptyOption,
                    newOption,
                    checkboxChange = function () {
                        me._updateOptions(advancedContainer);
                    };

                for (i = 0; i < dataFields.length; i += 1) {
                    dataField = dataFields[i];
                    if (dataField.values.length === 0) {
                        // no options to show -> skip
                        continue;
                    }
                    newRow = null;
                    newLabel = me.getLocalization(dataField.field);
                    // Continue gracefully also without localization
                    if (typeof newLabel !== 'string') {
                        newLabel = dataField.field;
                    }
                    // Checkbox
                    if (dataField.multi) {
                        newRow = me.templates.checkboxRow.clone();
                        newRow.find('div.rowLabel').text(newLabel);
                        for (j = 0; j < dataField.values.length; j += 1) {
                            value = dataField.values[j];
                            text = me._getOptionLocalization(value);
                            newCheckbox = me.templates.metadataCheckbox.clone();
                            newCheckboxDef = newCheckbox.find(':checkbox');
                            newCheckboxDef.attr('name', dataField.field);
                            newCheckboxDef.attr('value', value.val);
                            newCheckbox.find('label.metadataTypeText').append(text);
                            newCheckbox.change(checkboxChange);
                            newRow.find('.checkboxes').append(newCheckbox);
                        }
                        // Dropdown list
                    } else {
                        newRow = me.templates.dropdownRow.clone();
                        newRow.find('div.rowLabel').append(newLabel);
                        newDropdown = me.templates.metadataDropdown.clone();
                        dropdownDef = newDropdown.find('.metadataDef');
                        dropdownDef.attr('name', dataField.field);
                        emptyOption = me.templates.dropdownOption.clone();
                        emptyOption.attr('value', '');
                        emptyOption.text(me.getLocalization('emptyOption'));
                        dropdownDef.append(emptyOption);
                        for (j = 0; j < dataField.values.length; j += 1) {
                            value = dataField.values[j];
                            text = me._getOptionLocalization(value);
                            newOption = me.templates.dropdownOption.clone();
                            newOption.attr('value', value.val);
                            newOption.text(text);
                            dropdownDef.append(newOption);
                        }
                        newDropdown.find('.metadataDef').change(checkboxChange);
                        newRow.append(newDropdown);
                    }
                    // Conditional visibility
                    if ((typeof dataField.shownIf !== 'undefined') && (dataField.shownIf.length > 0)) {
                        me.conditions.push({
                            field: dataField.field,
                            shownIf: dataField.shownIf
                        });
                        newRow.hide();
                    }
                    newRow.addClass(dataField.field);
                    advancedContainer.append(newRow);
                }
                me._updateOptions(advancedContainer);
            },

            /**
             * @method _getOptionLocalization
             * Generates localization for option values
             */
            _getOptionLocalization: function (value) {
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

            /**
             * @method showResults
             * Updates availability of the options
             */
            _updateOptions: function (container) {
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
                }
                row.show();
            },

            /**
             * @method showResults
             * Displays metadata search results
             */
            _showResults: function (metadataCatalogueContainer, data) {
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
                });

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
                for (i = 0; i < me.resultHeaders.length;  i += 1) {
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
            },

            _populateResultTable: function (resultsTableBody) {
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
                    i;
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
                            //jQuery(cells[1]).append("*****");
                            jQuery(cells[1]).addClass(me.resultHeaders[1].prop);
                            jQuery(cells[2]).addClass(me.resultHeaders[2].prop);
                            jQuery(cells[2]).find('div.layerInfo').click(function () {
                                var rn = 'catalogue.ShowMetadataRequest';
                                me.sandbox.postRequestByName(rn, [{
                                    uuid: row.id
                                }]);
                            });
                            jQuery(cells[3]).addClass(me.resultHeaders[3].prop);
                            jQuery(cells[3]).find('div.resultRemove').click(function () {
                                jQuery('table.metadataSearchResult tr.res' + i).hide();
                                jQuery('div.metadataResultHeader a.showLink').show();
                            });
                        }
                        resultsTableBody.append(resultContainer);
                    })(i);
                }
            },

            _addLayerLinks: function (layer, layerList) {
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

                        builder = me.sandbox.getRequestBuilder('RemoveMapLayerRequest');
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
            },

            /**
             * @method _sortResults
             * Sorts the last search result by comparing given attribute on
             * the search objects
             * @private
             * @param {String} pAttribute attributename to sort by (e.g.
             * result[pAttribute])
             * @param {Boolean} pDescending true if sort direction is descending
             */
            _sortResults: function (pAttribute, pDescending) {
                var me = this;
                if (!this.lastResult) {
                    return;
                }
                me.lastSort = {
                    attr: pAttribute,
                    descending: pDescending
                };
                this.lastResult.sort(function (a, b) {
                    return me._searchResultComparator(a, b, pAttribute, pDescending);
                });

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
            _searchResultComparator: function (a, b, pAttribute, pDescending) {
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
            'protocol': [
                'Oskari.bundle.BundleInstance',
                'Oskari.mapframework.module.Module'
            ]
        }
);
