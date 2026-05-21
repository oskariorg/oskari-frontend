import React from 'react';
import { SearchInput } from './SearchInput';
import { SearchHandler } from './SearchHandler';
import { SearchResultInfo } from './SearchResultInfo';
import { SearchResultTable } from './SearchResultTable';
import { Message } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import styled from 'styled-components';
import { getReactRoot } from 'oskari-ui/components/window';

const Description = styled('div')`
    margin-bottom: 8px;
`;

const SearchContainer = styled('div')`
    max-width: 450px;
`;

const SELECT_OUTLINED_ICON_HTML = ' <span role="img" aria-label="select" class="anticon anticon-select" style="margin-left: 6px;"><svg viewBox="64 64 896 896" focusable="false" data-icon="select" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h360c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H184V184h656v320c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V144c0-17.7-14.3-32-32-32zM653.3 599.4l52.2-52.2a8.01 8.01 0 00-4.7-13.6l-179.4-21c-5.1-.6-9.5 3.7-8.9 8.9l21 179.4c.8 6.6 8.9 9.4 13.6 4.7l52.4-52.4 256.2 256.2c3.1 3.1 8.2 3.1 11.3 0l42.4-42.4c3.1-3.1 3.1-8.2 0-11.3L653.3 599.4z"></path></svg></span>';

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
            const el = this.getContainer();
            const {
                query = '',
                loading = false,
                suggestions = [],
                result = {}
            } = this.handler.getState();
            const controller = this.handler.getController();
            const searchPerformed = result && Array.isArray(result.locations);

            getReactRoot(el[0]).render(
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
            // cannot do this with an action link because link name is being used to map and action to clicked link and anything additional (=icon) in label will screw this up
            const contentUrlLink = result.contentURL
                ? `<p>
                    <a href="${Oskari.util.sanitize(result.contentURL)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                        <span style="text-decoration: underline;">${loc.contentCard}</span>
                        ${SELECT_OUTLINED_ICON_HTML}
                    </a>
                </p>`
                : '';
            const contentItem = {
                html: `<h3>${Oskari.util.sanitize(result.name)}</h3>
                        ${alternatives}
                        <p>${result.region}<br/>
                        ${result.type}</p>
                        ${contentUrlLink}`,
                actions: resultActions
            };
            const content = [contentItem];

            const options = {
                hidePrevious: true,
                keepOnScreen: false
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
