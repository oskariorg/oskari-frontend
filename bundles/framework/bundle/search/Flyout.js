/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.search.SearchBundleInstance}
     *        instance reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;

        this.state = null;

        this.template = null;
        this.templateResultTable = null;
        this.templateResultTableHeader = null;
        this.templateResultTableRow = null;

        this.resultHeaders = [];
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        // Actions that get added to the search result popup
        this.resultActions = {};

        this._searchContainer = null;
        this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.search.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('search')) {
                jQuery(this.container).addClass('search');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.template = jQuery('<div class="searchContainer">' +
                '<div class="searchDescription"></div>' +
                '<div class="controls">' +
                '</div>' +
                '<div><br></div>' +
                '<div class="info"></div>' +
                '<div><br></div>' +
                '<div class="resultList"></div>' +
                '</div>');
            this.templateResultTable = jQuery('<table class="search_result">' + '<thead><tr></tr></thead>' + '<tbody></tbody>' + '</table>');
            this.templateResultTableHeader = jQuery('<th><a href="JavaScript:void(0);"></a></th>');

            this.templateResultTableRow = jQuery('<tr>' + '<td><a href="JavaScript:void(0);"></a></td>' + '<td></td>' + '<td></td>' + '</tr>');

            this.resultHeaders = [{
                title: this.instance.getLocalization('grid').name,
                prop: 'name'
            }, {
                title: this.instance.getLocalization('grid').village,
                prop: 'village'
            }, {
                title: this.instance.getLocalization('grid').type,
                prop: 'type'
            }];
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @method getTabTitle
         * @return {String} localized text for the tab title
         */
        getTabTitle: function () {
            return this.instance.getLocalization('tabTitle');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            if (!this.state) {
                return {};
            }
            return this.state;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this;
            var sandbox = me.instance.getSandbox();

            var flyout = jQuery(this.container);
            flyout.empty();

            var searchContainer = this.template.clone();
            this._searchContainer = searchContainer;

            var searchDescription = searchContainer.find('div.searchDescription');
            searchDescription.html(this.instance.getLocalization('searchDescription'));

            var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization("searchAssistance"));

            var regex = /[\s\w\d\.\,\?\!\-äöåÄÖÅ]*\*?$/;
            field.setContentCheck(true, this.instance.getLocalization('contentErrorMsg'), regex);

            field.bindChange(function (event) {
                if (me.state === null) {
                    me.state = {};
                }
                var value = field.getValue();
                me.state.searchtext = value;
                if (!value) {
                    // remove results when field is emptied
                    var info = searchContainer.find('div.info');
                    info.empty();
                    var resultList = searchContainer.find('div.resultList');
                    resultList.empty();

                    // try to remove markers if request is available when field is emptied
                    var reqBuilder = sandbox.getRequestBuilder('MapModulePlugin.RemoveMarkerRequest');
                    if (reqBuilder) {
                        sandbox.request(me.instance.getName(), reqBuilder());
                    }
                }
            });
            field.addClearButton();

            var button = Oskari.clazz.create('Oskari.userinterface.component.Button');
            button.setTitle(this.instance.getLocalization('searchButton'));

            var doSearch = function () {
                field.setEnabled(false);
                button.setEnabled(false);

                var resultList = searchContainer.find('div.resultList');
                resultList.empty();
                var info = searchContainer.find('div.info');
                info.empty();


                // TODO: make some gif go round and round so user knows
                // something is happening
                var searchKey = field.getValue(true);
                me.instance.service.doSearch(searchKey, function (data) {
                    field.setEnabled(true);
                    button.setEnabled(true);
                    me._renderResults(data, searchKey);
                }, function (data) {
                    field.setEnabled(true);
                    button.setEnabled(true);

                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    var okBtn = dialog.createCloseButton('OK');
                    var title = me.instance.getLocalization('searchservice_search_alert_title');
                    var msg = me.instance.getLocalization('searchservice_search_not_found_anything_text');
                    dialog.show(title, msg, [okBtn]);
                });
            };

            button.setHandler(doSearch);
            field.bindEnterKey(doSearch);

            var controls = searchContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getButton());

            flyout.append(searchContainer);

        },

        _renderResults: function (result, searchKey) {
            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            var resultList = this._searchContainer.find('div.resultList');
            resultList.empty();
            this.lastResult = result;
            var me = this;

            var info = this._searchContainer.find('div.info');
            info.empty();

            var inst = this.instance;
            // error handling
            if (result.totalCount === -1) {
                resultList.append(this.instance.getLocalization('searchservice_search_alert_title') + this.instance.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                var alK = 'searchservice_search_alert_title';
                var al = inst.getLocalization(alK);
                var nfK = 'searchservice_search_not_found_anything_text';
                var nf = inst.getLocalization(nfK);
                resultList.append(al + ':' + nf);
                return;
            } else {
                info.append(this.instance.getLocalization('searchResultCount') +
                    result.totalCount + this.instance.getLocalization('searchResultCount2'));
                info.append('<br/>');

                if (result.hasMore) {
                    // more results available
                    info.append(this.instance.getLocalization('searchResultDescriptionMoreResults'));
                    info.append('<br/>');
                }
                info.append(this.instance.getLocalization('searchResultDescriptionOrdering'));
            }

            if (result.totalCount === 1) {
                // move map etc
                me._resultClicked(result.locations[0]);
                // close flyout
                inst.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
            }
            // render results
            var table = this.templateResultTable.clone();
            var tableHeaderRow = table.find('thead tr');
            var tableBody = table.find('tbody');
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
            for (i = 0; i < this.resultHeaders.length; ++i) {
                header = this.templateResultTableHeader.clone();
                link = header.find('a');
                link.append(this.resultHeaders[i].title);
                link.bind('click', headerClosureMagic(this.resultHeaders[i]));
                tableHeaderRow.append(header);
            }

            this._populateResultTable(tableBody);
            resultList.append('<div><h3>' +
                this.instance.getLocalization('searchResults') + result.totalCount +
                this.instance.getLocalization('searchResultsDescription') + searchKey + '</h3></div>');
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
            for (i = 0; i < locations.length; ++i) {
                row = locations[i];
                resultContainer = this.templateResultTableRow.clone();
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
            var me = this;
            var popupId = "searchResultPopup";
            var inst = this.instance;
            var sandbox = inst.sandbox;
            // good to go
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest');
            sandbox.request(me.instance.getName(), moveReqBuilder(result.lon, result.lat, result.zoomLevel, false));

            var loc = this.instance.getLocalization('resultBox');

            var resultActions = {};
            var action;
            for (var name in this.resultActions) {
                if (this.resultActions.hasOwnProperty(name)) {
                    action = this.resultActions[name];
                    resultActions[name] = action(result);
                }
            }

            var contentItem = {
                html: "<h3>" + result.name + "</h3>" + "<p>" + result.village + '<br/>' + result.type + "</p>",
                actions: resultActions
            };
            var content = [contentItem];

            /* impl smashes action key to UI - we'll have to localize that here */
            contentItem.actions[loc.close] = function () {
                var rN = 'InfoBox.HideInfoBoxRequest';
                var rB = sandbox.getRequestBuilder(rN);
                var request = rB(popupId);
                sandbox.request(me.instance.getName(), request);
            };

            var rN = 'InfoBox.ShowInfoBoxRequest';
            var rB = sandbox.getRequestBuilder(rN);
            var request = rB(popupId, loc.title, content, new OpenLayers.LonLat(result.lon, result.lat), true);
            sandbox.request(this.instance.getName(), request);
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
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            this.lastResult.locations.sort(function (a, b) {
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
         *
         *
         */
        addTab: function (item) {
            var me = this;
            var flyout = jQuery(this.container);
            // Change into tab mode if not already
            if (me.tabsContainer.panels.length === 0) {
                me.tabsContainer.insertTo(flyout);
                var defaultPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                var searchContainer = jQuery("div.searchContainer");
                defaultPanel.setTitle(me.getTabTitle());
                defaultPanel.setContent(searchContainer);
                defaultPanel.setPriority(me.instance.tabPriority);
                me.tabsContainer.addPanel(defaultPanel);
            }

            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(item.title);
            panel.setContent(item.content);
            panel.setPriority(item.priority);
            me.tabsContainer.addPanel(panel);
        },
        addSearchResultAction: function(action) {
            this.resultActions[action.name] = action.callback;
        },
        removeSearchResultAction: function(name) {
            delete this.resultActions[name];
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });