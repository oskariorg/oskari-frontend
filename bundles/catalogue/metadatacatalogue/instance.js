/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundleInstance
 *
 * Main component and starting point for the "metadata catalogue" functionality.
 * Provides metadata catalogue search functionality for the map.
 *
 * See Oskari.mapframework.bundle.metadatacatalogue.MetadataCatalogueBundle for bundle definition.
 *
 */
Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadatacatalogue.MetadataCatalogueBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.loc = Oskari.getMsg.bind(null, 'catalogue.bundle.metadatacatalogue');
        this.optionService = null;
        this.searchService = null;
        this.tabPriority = 5.0;
        this.conditions = [];
        this.resultHeaders = [{
            title: this.loc('grid.name'),
            prop: 'name'
        }, {
            title: '',
            tooltip: ''
        }, {
            title: '',
            tooltip: this.loc('grid.showBBOX'),
            prop: 'showBbox'
        }, {
            title: '',
            tooltip: this.loc('grid.info'),
            prop: 'info'
        }, {
            title: '',
            tooltip: this.loc('grid.remove'),
            prop: 'remove'
        }];
        this.lastSearch = '';
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        this.drawCoverage = true;
        // Search result actions array.
        this.searchResultActions = [];
        this.conf = this.conf || {};
        this.state = this.state || {};
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._vectorLayerId = 'METADATACATALOGUE_VECTORLAYER';
        this.id = 'oskari_metadatacatalogue_tabpanel_header';
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'catalogue.bundle.metadatacatalogue',
        /**
         * @static
         * @property __drawStyle
         */
        __drawStyle: {
            draw: {
                fill: {
                    color: 'rgba(35, 216, 194, 0.3)'
                },
                stroke: {
                    color: 'rgba(35, 216, 194, 1)',
                    width: 2
                }
            },
            modify: {
                fill: {
                    color: 'rgba(0, 0, 238, 0.3)'
                },
                stroke: {
                    color: 'rgba(0, 0, 238, 1)',
                    width: 2
                }
            }
        },
        /**
         * @static
         * @property templates
         */
        templates: {
            metadataTab: jQuery('<div class="metadataCatalogueContainer"></div>'),
            optionPanel: jQuery(
                '<div class="main metadataOptions">' +
                '  <div class="metadataCatalogueDescription"></div>' +
                '  <div class="controls"></div>' +
                '  <div class="moreLess"></div>' +
                '  <div class="advanced"></div>' +
                '</div>'
            ),
            moreLessLink: jQuery('<a href="JavaScript:void(0);" class="moreLessLink"></a>'),
            advanced: jQuery('<div class="advanced"></div>'),
            metadataCheckbox: jQuery(
                '<div class="metadataType">' +
                '  <label class="metadataTypeText">' +
                '    <input type="checkbox" class="metadataMultiDef">' +
                '  </label>' +
                '</div>'
            ),
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
                '    <a href="JavaScript:void(0);" class="showDatasets filter-link" data-value="dataset,series"></a>' +
                '    <a href="JavaScript:void(0);" class="showServices filter-link" data-value="service"></a>' +
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
                '  <td><div class="showBbox icon-info-area"></div></td>' +
                '  <td><div class="layerInfo icon-info"></div></td>' +
                '  <td><div class="resultRemove icon-close"></div></td>' +
                '</tr>'
            ),
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
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function () {
            const me = this;

            if (me.started) {
                return;
            }

            me.started = true;

            const conf = me.conf;
            const sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;

            var optionAjaxUrl = null;
            if (me.conf && me.conf.optionUrl) {
                optionAjaxUrl = me.conf.optionUrl;
            } else {
                optionAjaxUrl = Oskari.urls.getRoute('GetMetadataSearchOptions');
            }

            var searchAjaxUrl = null;
            if (me.conf && me.conf.searchUrl) {
                searchAjaxUrl = me.conf.searchUrl;
            } else {
                searchAjaxUrl = Oskari.urls.getRoute('GetMetadataSearch');
            }

            // Default tab priority
            if (me.conf && typeof me.conf.priority === 'number') {
                me.tabPriority = me.conf.priority;
            }

            const optionServName =
              'Oskari.catalogue.bundle.metadatacatalogue.service.MetadataOptionService';
            me.optionService = Oskari.clazz.create(optionServName, optionAjaxUrl);

            const searchServName =
                'Oskari.catalogue.bundle.metadatacatalogue.service.MetadataSearchService';
            me.searchService = Oskari.clazz.create(searchServName, searchAjaxUrl);

            sandbox.register(me);
            Object.keys(me.eventHandlers).forEach(eventName => {
                sandbox.registerForEventByName(me, eventName);
            });

            const addSearchResultActionRequestHandler = Oskari.clazz.create(
                'Oskari.catalogue.bundle.metadatacatalogue.request.AddSearchResultActionRequestHandler',
                sandbox,
                me
            );
            sandbox.requestHandler(
                'AddSearchResultActionRequest',
                addSearchResultActionRequestHandler
            );

            const metadataSearchRequestHandler = Oskari.clazz.create(
                'Oskari.catalogue.bundle.metadatacatalogue.request.MetadataSearchRequestHandler',
                me
            );
            sandbox.requestHandler(
                'MetadataSearchRequest',
                metadataSearchRequestHandler
            );

            if (conf.noUI === true) {
                // bundle started by published map
                return;
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
            'DrawingEvent': function (event) {
                if (event.getId() !== this.getName() || event.getIsFinished() !== true || this.drawCoverage) {
                    return;
                }

                const coverageFeature = event.getGeoJson();

                this.coverageButton.val(this.loc('deleteArea'));
                this.coverageButton[0].data = JSON.stringify(coverageFeature);
                this.coverageButton.prop('disabled', false).css({
                    'border-color': ''
                });
                this.drawCoverage = false;

                document.getElementById('oskari_metadatacatalogue_forminput_searchassistance').focus();
            },

            'userinterface.ExtensionUpdatedEvent': function (event) {
                const isShown = event.getViewState() !== 'close';

                // ExtensionUpdateEvents are fired a lot, only let metadatacatalogue extension event to be handled when enabled
                if (![this.getName(), 'Search'].includes(event.getExtension().getName())) {
                    // wasn't me or disabled -> do nothing
                    return;
                }

                if ((!isShown && this.drawCoverage === false) || event.getViewState() === 'close') {
                    this._teardownMetaSearch();
                }
            },
            'Search.TabChangedEvent': function (event) {
                if (event.getNewTabId() !== this.id) {
                    this._teardownMetaSearch();
                } else {
                    this._removeFeaturesFromMap(); // unactive show-area-icons when changing to metadata search tab
                }
            },
            'MetadataSearchResultEvent': function (event) {
                this.progressSpinner.stop();

                if (this.conf.noUI === true) {
                    // bundle started by published map --> not handle event
                    return;
                }
                if (event.hasSuccess()) {
                    this._showResults(event.getResults());
                } else {
                    this._showError(this.loc('metadatasearchservice_error'));
                }
            }
        },
        /**
         * @method _teardownMetaSearch
         * @private
         * Tears down meta data search when changing tab or closing flyout
         */
        _teardownMetaSearch: function () {
            this._stopCoverage();

            if (this.coverageButton) {
                this.coverageButton.val(this.loc('delimitArea'));
                this.coverageButton[0].data = '';
            }

            this.drawCoverage = true;
            this._removeFeaturesFromMap();
        },
        /**
         * @method _removeFeaturesFromMap
         * @private
         * Removes features from map.
         *
         * @param {String} identifier the identifier
         * @param {String} value the identifier value
         */
        _removeFeaturesFromMap: function (identifier, value) {
            this._unactiveShowInfoAreaIcons();
            this.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [identifier, value, this._vectorLayerId]);
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.sandbox;

            Object.keys(this.eventHandlers).forEach(eventName => {
                sandbox.unregisterFromEventByName(this, eventName);
            });

            var reqBuilder = Oskari.requestBuilder('userinterface.RemoveExtensionRequest');
            this.sandbox.request(this, reqBuilder(this));

            this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.loc('tabTitle');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * component
         */
        getDescription: function () {
            return this.loc('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "metadata catalogue" functionality
         */
        createUi: function () {
            var me = this;
            me.metadataCatalogueContainer = me.templates.metadataTab.clone();
            me.optionPanel = me.templates.optionPanel.clone();
            me.searchPanel = me.templates.searchPanel.clone();
            me.resultPanel = me.templates.resultPanel.clone();
            me.metadataCatalogueContainer.append(me.optionPanel);
            me.metadataCatalogueContainer.append(me.searchPanel);
            me.metadataCatalogueContainer.append(me.resultPanel);
            me.searchPanel.hide();
            me.searchPanel.append(me.loc('searching'));
            me.resultPanel.hide();

            me.progressSpinner.insertTo(me.metadataCatalogueContainer);

            var metadataCatalogueDescription = me.metadataCatalogueContainer.find(
                'div.metadataCatalogueDescription'
            );
            metadataCatalogueDescription.html(
                me.loc('metadataCatalogueDescription')
            );

            var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.loc('assistance'));
            field.setIds('oskari_metadatacatalogue_forminput', 'oskari_metadatacatalogue_forminput_searchassistance');

            field.bindChange(function (event) {
                if (me.state === null) {
                    me.state = {};
                }
                var value = field.getValue();
                me.state.metadatacataloguetext = value;
                if (!value) {
                    // remove results when field is emptied
                    var resultList = me.metadataCatalogueContainer.find('div.resultList');
                    resultList.empty();
                }
            });
            field.addClearButton('oskari_metadatacatalogue_forminput_clearbutton');

            var button = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SearchButton'
            );
            button.setId('oskari_metadatacatalogue_button_search');

            var doMetadataCatalogue = function () {
                me.progressSpinner.start();
                me._removeFeaturesFromMap();
                me.metadataCatalogueContainer.find('.metadataOptions').hide();
                me.metadataCatalogueContainer.find('.metadataSearching').show();
                var search = {
                    search: field.getValue().trim()
                };
                var isAdvancedSearch = false;
                // Collect the advanced search options
                if (moreLessLink.html() === me.loc('showLess')) {
                    isAdvancedSearch = true;
                    // Checkboxes
                    var checkboxRows = me.metadataCatalogueContainer.find('.checkboxRow'),
                        i,
                        checkboxDefs,
                        values,
                        j,
                        checkboxDef,
                        dropdownDef,
                        dropdownRows;
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
                    dropdownRows = me.metadataCatalogueContainer.find('.dropdownRow');
                    for (i = 0; i < dropdownRows.length; i += 1) {
                        dropdownDef = jQuery(dropdownRows[i]).find('.metadataDef');
                        search[dropdownDef.attr('name')] = dropdownDef.find(':selected').val();
                    }
                    // Coverage geometry
                    if (me.coverageButton && me.coverageButton[0] && me.coverageButton[0].data) {
                        search[me.coverageButton.attr('name')] = me.coverageButton[0].data;
                    }
                }
                me.lastSearch = field.getValue();

                // Check if any search fields has values, otherwise it's useless to send post request
                var doSearch = false;

                jQuery.each(search, function (key, value) {
                    doSearch = value ? true : doSearch;
                });
                if (doSearch) {
                    me.searchService.doSearch(search);
                } else {
                    if (isAdvancedSearch) {
                        me._showError(me.loc('no_search_selections'));
                    } else {
                        me._showError(me.loc('cannot_be_empty'));
                    }
                    me.progressSpinner.stop();
                }
            };

            button.setHandler(doMetadataCatalogue);
            field.bindEnterKey(doMetadataCatalogue);

            var controls = me.metadataCatalogueContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());

            // Metadata catalogue tab

            var title = me.loc('tabTitle'),
                content = me.metadataCatalogueContainer,
                priority = this.tabPriority,
                reqBuilder = Oskari.requestBuilder('Search.AddTabRequest');
            if (typeof reqBuilder === 'function') {
                me.sandbox.request(me, reqBuilder(title, content, priority, this.id));
            } else {
                // add a tile and flyout if search is not present on the appsetup
                this.__addTileAndFlyout();
            }

            // Link to advanced search
            var moreLessLink = this.templates.moreLessLink.clone();
            moreLessLink.html(me.loc('showMore'));
            moreLessLink.on('click', function () {
                var advancedContainer = me.metadataCatalogueContainer.find('div.advanced');
                if (moreLessLink.html() === me.loc('showMore')) {
                    if (advancedContainer.is(':empty')) {
                        me.optionService.getOptions(function (data) {
                            // open advanced/toggle link text
                            moreLessLink.html(me.loc('showLess'));
                            me._createAdvancedPanel(data, advancedContainer, moreLessLink);
                        }, function (data) {
                            // don't toggle link text on error
                            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                            var okBtn = dialog.createCloseButton('OK');
                            var title = me.loc('metadataoptionservice_alert_title');
                            var msg = me.loc('metadataoptionservice_not_found_anything_text');
                            dialog.show(title, msg, [okBtn]);
                        });
                    } else {
                        // open advanced/toggle link text
                        moreLessLink.html(me.loc('showLess'));
                        advancedContainer.show();
                    }
                } else {
                    // close advanced/toggle link text
                    moreLessLink.html(me.loc('showMore'));
                    advancedContainer.hide();
                }
            });
            me.metadataCatalogueContainer.find('div.moreLess').append(moreLessLink);
        },

        /* ----------- Tile and Flyout ------------- */
        __addTileAndFlyout: function () {
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            this.getSandbox().request(this, request);
            // attach content to flyout when divmanazer has set up root element
            this.plugins['Oskari.userinterface.Flyout'].getEl().append(this.metadataCatalogueContainer);
        },

        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.layerlist.Flyout
         * Oskari.mapframework.bundle.layerlist.Tile
         */
        startExtension: function () {
            const title = this.getTitle();
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.userinterface.extension.DefaultTile', this, {
                    title
                });
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.userinterface.extension.DefaultFlyout', this, {
                    title
                });
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /* ----------- /Tile and Flyout ------------- */
        _showError: function (error) {
            this.searchPanel.hide();
            this.optionPanel.show();
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okButton = dialog.createCloseButton('OK');

            dialog.setId('oskari_search_error_popup');
            dialog.makeModal();

            dialog.show(
                this.loc('metadataoptionservice_alert_title'),
                error, [okButton]
            );
        },
        _createAdvancedPanel: function (data, advancedContainer, moreLessLink) {
            var me = this,
                dataFields = data.fields,
                i,
                dataField,
                newRow,
                newLabel,
                newCheckboxDef,
                newDropdown,
                dropdownDef,
                emptyOption,
                renderCoverageButton = (_.filter(dataFields, { 'field': 'coverage' }).length > 0),
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
                newLabel = me.loc(dataField.field);
                // Continue gracefully also without localization
                if (typeof newLabel !== 'string') {
                    newLabel = dataField.field;
                }

                const options = dataField.values.map(value => {
                    const label = me._getOptionLocalization(value);
                    return {
                        label,
                        val: value.val
                    };
                });
                // We could filter out "bad values" here, but its easier to find them and fix at source if they are present in the lists
                // .filter(opt => !opt.label.startsWith('--'));
                options.sort((a, b) => Oskari.util.naturalSort(a.label, b.label));
                // Checkbox
                if (dataField.multi) {
                    newRow = me.templates.checkboxRow.clone();
                    newRow.find('div.rowLabel').text(newLabel);
                    options.forEach(opt => {
                        const newCheckbox = me.templates.metadataCheckbox.clone();
                        newCheckboxDef = newCheckbox.find(':checkbox');
                        newCheckboxDef.attr('name', dataField.field);
                        newCheckboxDef.attr('value', opt.val);
                        newCheckbox.find('label.metadataTypeText').append(opt.label);
                        newCheckbox.on('change', checkboxChange);
                        newRow.find('.checkboxes').append(newCheckbox);
                    });
                    // Dropdown list
                } else {
                    newRow = me.templates.dropdownRow.clone();
                    newRow.find('div.rowLabel').append(newLabel);
                    newDropdown = me.templates.metadataDropdown.clone();
                    dropdownDef = newDropdown.find('.metadataDef');
                    dropdownDef.attr('name', dataField.field);
                    emptyOption = me.templates.dropdownOption.clone();
                    emptyOption.attr('value', '');
                    emptyOption.text(me.loc('emptyOption'));
                    dropdownDef.append(emptyOption);
                    options.forEach(opt => {
                        const newOption = me.templates.dropdownOption.clone();
                        newOption.attr('value', opt.val);
                        newOption.text(opt.label);
                        dropdownDef.append(newOption);
                    });
                    newDropdown.find('.metadataDef').on('change', checkboxChange);
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

            if (renderCoverageButton) {
                newRow = me.templates.buttonRow.clone();
                newLabel = me.loc('searchArea');
                newRow.find('div.rowLabel').append(newLabel);

                var newButton = me.templates.metadataButton.clone();
                this.coverageButton = this._initCoverageButton(me, newButton);
                this.drawCoverage = true;

                this.coverageButton.on('click', function () {
                    if (me.drawCoverage === true) {
                        me.coverageButton.prop('disabled', true).css({
                            'border-color': '#0099CB'
                        });
                        me.coverageButton.val(me.loc('startDraw'));
                        me._getCoverage();
                        me.drawCoverage = false;
                    } else {
                        me.drawCoverage = true;
                        me._stopCoverage();
                        me.coverageButton.val(me.loc('delimitArea'));
                        document.getElementById('oskari_metadatacatalogue_forminput_searchassistance').focus();
                        me.coverageButton[0].data = '';
                        me._removeFeaturesFromMap();
                    }
                });

                newRow.append(newButton);

                advancedContainer.append(newRow);
            }

            me._updateOptions(advancedContainer);
        },

        _initCoverageButton: function (me, newButton) {
            this.coverageButton = newButton.find('.metadataCoverageDef');
            this.coverageButton.attr('value', me.loc('delimitArea'));
            this.coverageButton.attr('name', 'coverage');
            return this.coverageButton;
        },

        /**
         * @method _getOptionLocalization
         * Generates localization for option values
         */
        _getOptionLocalization: function (value) {
            var text;
            // Localization available?
            if (typeof value.locale !== 'undefined') {
                text = value.locale;
            } else {
                text = this.loc(value.val);
                if (typeof text !== 'string') {
                    text = value.val;
                }
            }
            return text;
        },

        _getCoverage: function () {
            this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [this.getName(), 'Box', {
                style: this.__drawStyle
            }]);
        },

        _stopCoverage: function () {
            this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.getName(), true]);
        },

        /**
         * @method _updateOptions
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
                row.show();
            }
        },

        /**
         * @method showResults
         * Displays metadata search results
         */
        _showResults: function (results) {
            var me = this;
            // make sure we have an array as results. Otherwise the UI breaks when we check for length etc
            results = results || [];
            me.lastResult = results;
            var resultPanel = me.metadataCatalogueContainer.find('.metadataResults');
            var searchPanel = me.metadataCatalogueContainer.find('.metadataSearching');
            var optionPanel = me.metadataCatalogueContainer.find('.metadataOptions');

            // Hide other panels, if visible
            searchPanel.hide();
            optionPanel.hide();
            // Create header
            var resultHeader = me.templates.resultHeader.clone();
            resultHeader.find('.resultTitle').text(me.loc('metadataCatalogueResults'));
            var showLink = resultHeader.find('.showLink');
            showLink.hide();
            showLink.text(me.loc('showSearch'));
            showLink.on('click', function () {
                jQuery('table.metadataSearchResult tr').show();
                showLink.hide();
                resultHeader.find('.filter-link').show();
            });
            var modifyLink = resultHeader.find('.modifyLink');
            modifyLink.html(me.loc('modifySearch'));
            modifyLink.on('click', function () {
                resultPanel.empty();
                optionPanel.show();
                me._removeFeaturesFromMap();
            });

            if (results.length === 0) {
                resultPanel.append(resultHeader);
                resultPanel.append(me.loc('searchservice_search_not_found_anything_text'));
                resultPanel.show();
                return;
            }

            var showDatasetsLink = resultHeader.find('.showDatasets');
            showDatasetsLink.text(me.loc('showDatasets'));

            var showServicessLink = resultHeader.find('.showServices');
            showServicessLink.text(me.loc('showServices'));

            // render results
            var table = me.templates.resultTable.clone();
            var tableHeaderRow = table.find('thead tr');
            var tableBody = table.find('tbody');
            tableBody.empty();
            // header reference needs some closure magic to work here
            var headerClosureMagic = function (scopedValue) {
                return function () {
                    var i;
                    // save hidden results
                    var hiddenRows = tableBody.find('tr.resultRow:hidden');
                    var hiddenResults = [];

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
                    var newRows = tableBody.find('tr');
                    for (i = 0; i < newRows.length; i += 1) {
                        var resultId = jQuery(newRows[i]).data('resultId');
                        for (var j = 0; j < hiddenResults.length; j += 1) {
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

            me.resultHeaders.forEach((resultHeader, index) => {
                var header = me.templates.resultTableHeader.clone();
                header.addClass(resultHeader.prop);
                var link = header.find('a');
                link.append(resultHeader.title);
                // Todo: Temporarily only the first column is sortable
                if (index === 0) {
                    link.on('click', headerClosureMagic(resultHeader));
                }
                tableHeaderRow.append(header);
            });

            me._populateResultTable(tableBody);
            resultPanel.append(resultHeader);
            resultPanel.append(table);
            optionPanel.hide();
            resultPanel.show();

            // filter functionality
            resultHeader.find('.filter-link').on('click', function (event) {
                var filterValues = jQuery(event.currentTarget).data('value').split(',');
                // hide filterlinks and show "show all"-link
                resultHeader.find('.filter-link').hide();
                resultHeader.find('.showLink').show();

                var allRows = table.find('tr[class*=filter-]');
                _.each(allRows, function (item) {
                    var classNameFound = false;
                    for (var i = 0; i < filterValues.length; i++) {
                        if (jQuery(item).hasClass('filter-' + filterValues[i])) {
                            classNameFound = true;
                        }
                    }

                    if (!classNameFound) {
                        jQuery(item).hide();
                    }
                });
            });
        },

        _populateResultTable: function (resultsTableBody) {
            var me = this;
            var results = me.lastResult;
            var i;
            var style = {
                stroke: {
                    color: 'rgba(211, 187, 27, 0.8)',
                    width: 2
                },
                fill: {
                    color: 'rgba(255,222,0, 0.6)'
                }
            };

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

                    // resultcontainer filtering
                    if (row.natureofthetarget) {
                        resultContainer.addClass('filter-' + row.natureofthetarget);
                    }
                    resultContainer.data('resultId', row.id);
                    cells = resultContainer.find('td').not('.spacer');
                    titleText = row.name;
                    // Include organization information if available
                    if ((row.organization) && (row.organization.length > 0)) {
                        titleText = titleText + ', ' + row.organization;
                    }

                    // Include identification
                    var identification = row.identification;
                    var isIdentificationCode = !!((identification && identification.code && identification.code.length > 0));
                    var isIdentificationDate = !!((identification && identification.date && identification.date.length > 0));
                    var isUpdateFrequency = !!((identification && identification.updateFrequency && identification.updateFrequency.length > 0));
                    if (isIdentificationCode && isIdentificationDate) {
                        var locIdentificationCode = me.loc('identificationCode')[identification.code];
                        if (!locIdentificationCode) {
                            locIdentificationCode = identification.code;
                        }

                        // only add the date for certain types of targets
                        if (row.natureofthetarget === 'dataset' || row.natureofthetarget === 'series') {
                            titleText = titleText + ' (' + locIdentificationCode + ':' + identification.date;
                            if (isUpdateFrequency) {
                                titleText += ', ' + me.loc('updated') + ': ' + identification.updateFrequency;
                            }
                            titleText += ')';
                        }
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
                        layers.forEach(layer => {
                            me._addLayerLinks(layer, layerList);
                        });

                        jQuery(cells[0]).append(layerList);
                        // Todo: real rating
                        // jQuery(cells[1]).append("*****");
                        // jQuery(cells[1]).addClass(me.resultHeaders[1].prop);

                        // Action link
                        if (me._isAction() === true) {
                            jQuery.each(me.searchResultActions, function (index, action) {
                                if (action.showAction(row)) {
                                    var actionElement = action.actionElement.clone();
                                    var actionTextEl = null;

                                    actionElement.css('margin-left', '6px');
                                    actionElement.css('margin-right', '6px');

                                    // Set action callback
                                    if (action.callback && typeof action.callback === 'function') {
                                        // Bind action click to bindCallbackTo if bindCallbackTo param exist
                                        var callbackElement = actionElement.first();
                                        callbackElement.css({ 'cursor': 'pointer' }).on('click', { metadata: row }, function (event) {
                                            action.callback(event.data.metadata);
                                        });
                                    }

                                    // Set action text
                                    if (action.actionTextElement) {
                                        actionTextEl = actionElement.find(action.actionTextElement);
                                    } else {
                                        actionTextEl = actionElement.first();
                                    }

                                    if (actionTextEl.is('input') ||
                                        actionTextEl.is('select') ||
                                        actionTextEl.is('button') ||
                                        actionTextEl.is('textarea')) {
                                        if (action.actionText && action.actionText != null) {
                                            actionTextEl.val(action.actionText);
                                        } else {
                                            actionTextEl.val(me.loc('licenseText'));
                                        }
                                    } else {
                                        if (action.actionText && action.actionText != null) {
                                            actionTextEl.html(action.actionText);
                                        } else {
                                            actionTextEl.html(me.loc('licenseText'));
                                        }
                                    }

                                    jQuery(cells[2]).find('div.actionPlaceholder').append(actionElement);
                                }
                            });
                        }

                        // Show bbox icon
                        if (row.geom && row.geom != null) {
                            jQuery(cells[3]).addClass(me.resultHeaders[2].prop);
                            jQuery(cells[3]).attr('title', me.resultHeaders[2].tooltip);
                            jQuery(cells[3]).find('div.showBbox').on('click', function () {
                                // If show info area is active, remove geom from map
                                if (jQuery(this).hasClass('icon-info-area-active')) {
                                    me._removeFeaturesFromMap();
                                    jQuery(this).parent().attr('title', me.loc('grid.showBBOX'));
                                }
                                // Else show info area is not active, add geom to map
                                else {
                                    var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                                    me.sandbox.postRequestByName(rn, [row.geom, {
                                        layerId: me._vectorLayerId,
                                        clearPrevious: true,
                                        layerOptions: null,
                                        centerTo: true,
                                        featureStyle: style
                                    }]);
                                    me._unactiveShowInfoAreaIcons();
                                    jQuery(this).removeClass('icon-info-area').addClass('icon-info-area-active');
                                    jQuery(this).parent().attr('title', me.loc('grid.removeBBOX'));
                                }
                            });
                        } else {
                            jQuery(cells[3]).find('div.showBbox').hide();
                        }

                        // Show layer info icon
                        jQuery(cells[4]).addClass(me.resultHeaders[3].prop);
                        jQuery(cells[4]).attr('title', me.resultHeaders[3].tooltip);
                        jQuery(cells[4]).find('div.layerInfo').on('click', function () {
                            var rn = 'catalogue.ShowMetadataRequest';
                            me.sandbox.postRequestByName(rn, [{
                                uuid: row.id,
                                metadataUrl: row.getAttributes().metadataUrl || null
                            }]);
                        });

                        // Show remove icon
                        jQuery(cells[5]).addClass(me.resultHeaders[4].prop);
                        jQuery(cells[5]).attr('title', me.resultHeaders[4].tooltip);
                        jQuery(cells[5]).find('div.resultRemove').on('click', function () {
                            jQuery('table.metadataSearchResult tr.res' + i).hide();
                            jQuery('div.metadataResultHeader a.showLink').show();
                            me._removeFeaturesFromMap('id', row.id);
                        });
                    }
                    resultsTableBody.append(resultContainer);
                })(i);
            }
        },
        /**
        * Unactive show info area icons.
        * @method _unactiveShowInfoAreaIcons
        * @private
        */
        _unactiveShowInfoAreaIcons: function () {
            jQuery('table.metadataSearchResult tr.resultRow td.showBbox div.showBbox')
                .removeClass('icon-info-area-active')
                .removeClass('icon-info-area')
                .addClass('icon-info-area');
        },
        _addLayerLinks: function (layer, layerList) {
            const me = this;
            const selectedLayers = this.sandbox.findAllSelectedMapLayers();
            let layerSelected = selectedLayers.map(l => l.getId()).includes(layer.getId());
            const layerLink = this.templates.layerLink.clone();
            const showText = this.loc('show');
            const hideText = this.loc('hide');

            // Check if layer is already selected and visible
            if ((layerSelected) && (layer.isVisible())) {
                layerLink.html(hideText);
            } else {
                layerLink.html(showText);
            }

            // Click binding
            layerLink.on('click', function () {
                // Hide layer
                if (jQuery(this).html() === hideText) {
                    // Set previously selected layer only invisible
                    var builder = Oskari.requestBuilder('RemoveMapLayerRequest');
                    layerSelected = false;
                    me.sandbox.request(me.getName(), builder(layer.getId()));
                    jQuery(this).html(showText);
                } else {
                    // Select previously unselected layer
                    if (!layerSelected) {
                        me.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
                    }
                    // Set layer visible
                    var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                    me.sandbox.request(me.getName(), visibilityRequestBuilder(layer.getId(), true));
                    jQuery(this).html(hideText);
                }
            });
            const layerListItem = me.templates.layerListItem.clone();
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
            const me = this;

            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
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
            var nameA = a[pAttribute].toLowerCase();
            var nameB = b[pAttribute].toLowerCase();
            var value = 0;
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
        addSearchResultAction: function (actionElement, actionTextElement, callback, bindCallbackTo, actionText, showAction) {
            const status = {
                actionElement: actionElement,
                actionTextElement: actionTextElement,
                callback: callback,
                bindCallbackTo: bindCallbackTo,
                actionText: actionText,
                showAction: function (metadata) { return true; }
            };

            if (showAction && showAction !== null) {
                status.showAction = showAction;
            }

            this.searchResultActions.push(status);
        },
        /**
        * @method _isAction
        * @private
        * @return {Boolean} is action
        */
        _isAction: function () {
            return this.searchResultActions.length > 0;
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
