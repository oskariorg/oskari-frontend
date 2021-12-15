import React from 'react';
import ReactDOM from 'react-dom';
import { SearchInput } from './SearchInput';
import { SearchHandler } from './SearchHandler';
import { SearchResultTable } from './SearchResultTable';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import styled from 'styled-components';

const Description = styled('div')`
    margin-bottom: 8px;
`;

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
        // Actions that get added to the search result popup
        this.resultActions = {};
        this._searchContainer = null;
        const instanceConf = instance.conf || {};
        this.handler = new SearchHandler(!!instanceConf.autocomplete, this.searchservice, this.sandbox, () => { this.__refresh(); });
        this.loc = Oskari.getMsg.bind(null, this.instance.getName());
    }, {
        __refresh: function () {
            var el = this.getContainer();
            const {
                query = '',
                loading = false,
                suggestions = [],
                result = {}
            } = this.handler.getState();
            const controller = this.handler.getController();

            ReactDOM.render(
                (<LocaleProvider value={{ bundleKey: 'Search' }}>
                    <div className="searchContainer">
                        <Message messageKey="searchDescription" LabelComponent={Description}/>
                        <div className="controls">
                            <SearchInput
                                placeholder={this.instance.getLocalization('searchAssistance')}
                                query={query}
                                suggestions={suggestions}
                                onSearch={controller.triggerSearch}
                                onChange={controller.updateQuery}
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
        focus: function () {},
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
