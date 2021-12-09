import React from 'react';
import ReactDOM from 'react-dom';
import { SearchInput } from './SearchInput';
import { SearchHandler } from './SearchHandler';
import { SearchResultTable } from './SearchResultTable';


import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.search.DefaultView',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.search.SearchBundleInstance}
     * Instance reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = this.instance.getSandbox();
        this.searchservice = instance.service;
        this.state = null;
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        // Actions that get added to the search result popup
        this.resultActions = {};
        this._searchContainer = null;
        this.handler = new SearchHandler(this.sandbox, () => { this.__refresh() });

        this.resultHeaders = [
            {
                title: this.instance.getLocalization('grid').name,
                prop: 'name'
            }, {
                title: this.instance.getLocalization('grid').region,
                prop: 'region'
            }, {
                title: this.instance.getLocalization('grid').type,
                prop: 'type'
            }
        ];
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.loc = Oskari.getMsg.bind(null, this.instance.getName());
    }, {
        __templates: {
            resultTable: () =>
                `<table class="search_result oskari-grid">
                    <thead><tr></tr></thead>
                    <tbody></tbody>
                </table>`,
            resultTableHeader: ({ title }) => `<th><a href="JavaScript:void(0);">${title}</a></th>`,
            resultTableRow: ({ name, region, type }) =>
                `<tr>
                    <td><a href="JavaScript:void(0);">${Oskari.util.sanitize(name)}</a></td>
                    <td>${region}</td>
                    <td>${type}</td>
                </tr>`
        },

        __refresh: function () {
            var el = this.getContainer();
            
            const {
                query = '',
                loading = false,
                result = {}
            } = this.handler.getState();
            const controller = this.handler.getController();

            ReactDOM.render(
                (<LocaleProvider value={{ bundleKey: 'Search' }}>
                    <div className="searchContainer">
                        <div className="searchDescription">
                            <Message messageKey="searchDescription" />
                        </div>
                        <div className="controls">
                            <SearchInput
                                placeholder={this.instance.getLocalization('searchAssistance')}
                                query={query}
                                onSearch={controller.triggerSearch}
                                onChange={controller.autocomplete}
                                loading={loading} />
                        </div>
                        <div><br /></div>
                        <div className="info">
                            { result.hasMore && <Message messageKey="searchMoreResults" messageArgs={{ count: result.totalCount }}/> }
                            { result.totalCount === 0 && <React.Fragment>
                                <Message messageKey="searchservice_search_alert_title" />:
                                <Message messageKey="searchservice_search_not_found_anything_text" />
                            </React.Fragment> }
                            { result.totalCount > 0 && <Message messageKey="searchResultDescriptionOrdering" /> }
                        </div>
                        <div><br /></div>
                        <div className="resultList">
                            <SearchResultTable
                                result={result}
                                onResultClick={(result) => this._resultClicked(result)} />
                        </div>
                    </div>
                </LocaleProvider>)
                , el[0]);
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function (container) {
            var ui = jQuery(container);
            ui.empty();
            // create ui
            var searchContainer = this.getContainer();
/*
            var doAutocompleteSearch = function (e) {
                if (e.keyCode === 38 || e.keyCode === 40) { // arrow keys up/down
                    return;
                }
                me.__doAutocompleteSearch();
            };

            if (this.instance.conf.autocomplete === true) {
                field.bindUpKey(doAutocompleteSearch);
                field.bindAutocompleteSelect(function (event, ui) {
                    field.setValue(ui.item.value);
                    doSearch();
                });
            }

            var controls = searchContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());
*/
            // add it to container
            ui.append(searchContainer);
            this.__refresh();
        },
        getContainer: function () {
            if (!this._searchContainer) {
                var searchContainer = document.createElement('div');
                this._searchContainer = jQuery(searchContainer);
            }
            return this._searchContainer;
        },
        /**
         * The search field
         * @return {Oskari.userinterface.component.FormInput}
         */
        getField: function () {
            var me = this;
            if (!this._searchField) {
                // TODO: change to TextInput, but it doesn't have setIds()
                var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
                this._searchField = field;
                field.setPlaceholder(this.instance.getLocalization('searchAssistance'));
                field.setIds('oskari_search_forminput', 'oskari_search_forminput_searchassistance');
                field.bindChange(function () {
                    me.__searchTextChanged(field.getValue());
                });
                field.addClearButton('oskari_search_forminput_clearbutton');
            }
            return this._searchField;
        },
        __searchTextChanged: function (value) {
            var me = this;
            var sandbox = me.getSandbox();
            var searchContainer = this.getContainer();
            if (me.state === null) {
                me.state = {};
            }
            me.state.searchtext = value;
            if (!value) {
                // remove results when field is emptied
                searchContainer.find('div.info').empty();
                searchContainer.find('div.resultList').empty();

                // try to remove markers if request is available when field is emptied
                var reqBuilder = Oskari.requestBuilder('MapModulePlugin.RemoveMarkersRequest');
                if (reqBuilder) {
                    sandbox.request(me.instance.getName(), reqBuilder());
                }
            }
        },

        __doAutocompleteSearch: function (query = '') {
            this.searchservice.doAutocompleteSearch(query, function (result) {
                var autocompleteValues = [];
                for (var i = 0; i < result.methods.length; i++) {
                    autocompleteValues.push({ value: result.methods[i], data: result.methods[i] });
                }
                field.autocomplete(autocompleteValues);
            });
        },

        handleSearchResult: function (isSuccess, result, searchedFor) {
        },

        focus: function () {
            // this.getField().focus();
        },

        __getSearchResultHeader: function (count, hasMore) {
            const msgKey = hasMore ? 'searchMoreResults' : 'searchResultCount';
            return this.loc(msgKey, { count }) + '<br/>' + this.loc('searchResultDescriptionOrdering');
        },

        _renderResults: function (result, searchKey) {
            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            var me = this;
            var ui = me.getContainer();
            var resultList = ui.find('div.resultList');
            var info = ui.find('div.info');

            // save reference to result
            me.lastResult = result;
            // clear previous results
            resultList.empty();
            info.empty();

            var inst = me.instance;
            // error handling
            if (result.totalCount === -1) {
                resultList.append(
                    this.instance.getLocalization('searchservice_search_alert_title') + ': ' +
                    this.instance.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                resultList.append(
                    inst.getLocalization('searchservice_search_alert_title') + ': ' +
                    inst.getLocalization('searchservice_search_not_found_anything_text'));
                return;
            } else {
                info.append(this.__getSearchResultHeader(result.totalCount, result.hasMore));
            }

            result.locations.forEach(cur => this._setMatchingTitle(cur, searchKey));

            if (result.totalCount === 1) {
                // move map etc
                me._resultClicked(result.locations[0]);
            }
            // render results
            var table = jQuery(this.__templates.resultTable()),
                tableHeaderRow = table.find('thead tr'),
                tableBody = table.find('tbody');

            this.resultHeaders.forEach(headerItem => {
                var header = me.__templates.resultTableHeader({ title: headerItem.title });
                header = jQuery(header);
                var link = header.find('a');
                link.on('click', function () {
                    // clear table for sorted results
                    tableBody.empty();
                    // default to descending sort
                    var descending = false;
                    // if last sort was made on the same column ->
                    // change direction
                    if (me.lastSort && me.lastSort.attr === headerItem.prop) {
                        descending = !me.lastSort.descending;
                    }
                    // sort the results
                    var locations = me._sortResults(headerItem.prop, descending, result.locations);
                    // populate table content
                    me._populateResultTable(tableBody, locations);
                    // apply visual changes
                    tableHeaderRow.find('th').removeClass('asc');
                    tableHeaderRow.find('th').removeClass('desc');
                    if (descending) {
                        link.parent().addClass('desc');
                    } else {
                        link.parent().addClass('asc');
                    }
                    return false;
                });
                tableHeaderRow.append(header);
            });

            this._populateResultTable(tableBody, result.locations);
            resultList.append(table);
        },

        _setMatchingTitle: function (location, searchKey) {
            if (!location || !location.localized) {
                return;
            }
            // find exact match
            let match = location.localized.find(cur => cur.name.toUpperCase() === searchKey.toUpperCase());
            if (match) {
                location.name = match.name;
                return;
            }
            // try matching starting with
            match = location.localized.find(cur => cur.name.toUpperCase().startsWith(searchKey.toUpperCase()));
            if (match) {
                location.name = match.name;
            }
        },

        _populateResultTable: function (resultsTableBody, locations) {
            var me = this;
            locations.forEach(row => {
                let resultRow = this.__templates.resultTableRow(row);
                resultRow = jQuery(resultRow);
                resultRow.find('a').on('click', function () {
                    me._resultClicked(row);
                    return false;
                });
                resultsTableBody.append(resultRow);
            });
        },
        
        _resultClicked: function (result) {
            var me = this;
            var popupId = 'searchResultPopup';
            var inst = this.instance;
            var sandbox = inst.sandbox;
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = Oskari.requestBuilder('MapMoveRequest');
            var zoom = result.zoomLevel;

            if (result.zoomScale) {
                zoom = { scale: result.zoomScale };
            }
            sandbox.request(
                me.instance.getName(),
                moveReqBuilder(result.lon, result.lat, zoom)
            );

            var loc = this.instance.getLocalization('resultBox');
            var resultActions = [];
            var resultAction;
            var action;
            for (var name in this.resultActions) {
                if (this.resultActions.hasOwnProperty(name)) {
                    action = this.resultActions[name];
                    resultAction = {};
                    resultAction.name = name;
                    resultAction.type = 'link';
                    resultAction.action = action(result);
                    resultAction.group = 1;
                    resultActions.push(resultAction);
                }
            }

            var closeAction = {};
            closeAction.name = loc.close;
            closeAction.type = 'link';
            closeAction.group = 1;
            closeAction.action = function () {
                var rN = 'InfoBox.HideInfoBoxRequest';
                var rB = Oskari.requestBuilder(rN);
                var request = rB(popupId);
                sandbox.request(me.instance.getName(), request);
            };
            resultActions.push(closeAction);

            const alternatives = me._createAlternativeNamesHTMLBlock(result);
            var contentItem = {
                html: `<h3>${Oskari.util.sanitize(result.name)}</h3>
                        ${alternatives}
                        <p>${result.region}<br/>
                        ${result.type}</p>`,
                actions: resultActions
            };
            var content = [contentItem];

            var options = {
                hidePrevious: true
            };

            var rN = 'InfoBox.ShowInfoBoxRequest';
            var rB = Oskari.requestBuilder(rN);
            var request = rB(
                popupId,
                loc.title,
                content,
                {
                    lon: result.lon,
                    lat: result.lat
                },
                options
            );

            sandbox.request(this.instance.getName(), request);
        },

        _createAlternativeNamesHTMLBlock: function (result) {
            if (!result || !result.localized) {
                return '';
            }
            const alternatives = result.localized
                .filter(cur => cur.name !== result.name)
                .map(cur => `${cur.name} [${cur.locale}]`)
                .sort();
            if (alternatives.length === 0) {
                return '';
            }
            const loc = this.instance.getLocalization('resultBox');
            const div = document.createElement('div');
            div.style.fontSize = '12px';
            const list = document.createElement('ul');
            alternatives.forEach(txt => {
                const item = document.createElement('li');
                item.append(document.createTextNode(txt));
                list.append(item);
            });
            list.style.marginTop = '5px';
            list.style.listStylePosition = 'inside';
            div.append(document.createTextNode(loc.alternatives));
            div.append(list);
            return div.outerHTML;
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
        _sortResults: function (pAttribute, pDescending, locations) {
            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            locations.sort(function (a, b) {
                return Oskari.util.naturalSort(a[pAttribute].toLowerCase(), b[pAttribute].toLowerCase(), pDescending);
            });
            return locations;
        },

        addSearchResultAction: function (action) {
            this.resultActions[action.name] = action.callback;
        },

        removeSearchResultAction: function (name) {
            delete this.resultActions[name];
        },
        getSandbox: function () {
            return this.sandbox;
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
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
