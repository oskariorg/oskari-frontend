import React from 'react';
import { SearchInput } from './SearchInput';
import { SearchHandler } from './SearchHandler';
import { SearchResultInfo } from './SearchResultInfo';
import { SearchResultTable } from './SearchResultTable';
import { Message } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import styled from 'styled-components';
import { createRoot } from 'react-dom/client';

const Description = styled('div')`
    margin-bottom: 8px;
`;

const SearchContainer = styled('div')`
    max-width: 450px;
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
        this._reactRoot = null;
    }, {
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        __refresh: function () {
            const el = this.getContainer();
            const {
                query = '',
                loading = false,
                suggestions = [],
                result = {}
            } = this.handler.getState();
            const controller = this.handler.getController();
            const searchPerformed = result && Array.isArray(result.locations);

            this.getReactRoot(el[0]).render(
                <LocaleProvider value={{ bundleKey: 'Search' }}>
                    <ThemeProvider>
                        <SearchContainer>
                            <Message messageKey="searchDescription" LabelComponent={Description}/>
                            <SearchInput
                                placeholder={this.instance.getLocalization('searchAssistance')}
                                query={query}
                                suggestions={suggestions}
                                onSearch={controller.triggerSearch}
                                onChange={controller.updateQuery}
                                loading={loading} />
                            { searchPerformed && <SearchResultInfo count={result.totalCount} hasMore={result.hasMore} /> }
                            <SearchResultTable
                                result={result}
                                onResultClick={(result) => this._resultClicked(result)} />
                        </SearchContainer>
                    </ThemeProvider>
                </LocaleProvider>);
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function (container) {
            const ui = jQuery(container);
            ui.empty();
            // create ui
            const searchContainer = this.getContainer();
            // add it to container
            ui.append(searchContainer);
            this.__refresh();
        },
        getContainer: function () {
            if (!this._searchContainer) {
                const searchContainer = document.createElement('div');
                this._searchContainer = jQuery(searchContainer);
            }
            return this._searchContainer;
        },
        focus: function () {},
        _resultClicked: function (result) {
            const me = this;
            const popupId = 'searchResultPopup';
            const inst = this.instance;
            const sandbox = inst.sandbox;
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            const moveReqBuilder = Oskari.requestBuilder('MapMoveRequest');
            let zoom = result.zoomLevel;

            if (result.zoomScale) {
                zoom = { scale: result.zoomScale };
            }
            sandbox.request(
                me.instance.getName(),
                moveReqBuilder(result.lon, result.lat, zoom)
            );

            const loc = this.instance.getLocalization('resultBox');
            const resultActions = [];
            let resultAction;
            let action;
            for (const name in this.resultActions) {
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

            const closeAction = {};
            closeAction.name = loc.close;
            closeAction.type = 'link';
            closeAction.group = 1;
            closeAction.action = function () {
                const rN = 'InfoBox.HideInfoBoxRequest';
                const rB = Oskari.requestBuilder(rN);
                const request = rB(popupId);
                sandbox.request(me.instance.getName(), request);
            };
            resultActions.push(closeAction);

            const alternatives = me._createAlternativeNamesHTMLBlock(result);
            const contentItem = {
                html: `<h3>${Oskari.util.sanitize(result.name)}</h3>
                        ${alternatives}
                        <p>${result.region}<br/>
                        ${result.type}</p>`,
                actions: resultActions
            };
            const content = [contentItem];

            const options = {
                hidePrevious: true
            };

            const rN = 'InfoBox.ShowInfoBoxRequest';
            const rB = Oskari.requestBuilder(rN);
            const request = rB(
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
            if (Oskari.util.isMobile()) {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'Search']);
            }
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
