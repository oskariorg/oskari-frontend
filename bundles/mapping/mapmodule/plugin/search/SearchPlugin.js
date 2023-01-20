import '../../../../service/search/searchservice';
import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBar } from './SearchBar';
import { showResultsPopup } from './SearchResultsPopup';
import { ThemeProvider } from 'oskari-ui/util';

/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map.
 * Uses same backend as search bundle:
 * http://www.oskari.org/trac/wiki/DocumentationBundleSearchBackend
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *     JSON config with params needed to run the plugin
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin';
        me._defaultLocation = 'top left';
        me._index = 0;
        me._name = 'SearchPlugin';
        me._searchMarkerId = 'SEARCH_RESULT_MARKER';
        me._popupControls = null;
    }, {

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         * Initializes ui templates and search service.
         *
         *
         */
        _initImpl: function () {
            var me = this;

            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage()).plugin.SearchPlugin;

            me.template = jQuery(
                '<div class="mapplugin search default-search-div" />'
            );

            me.service = Oskari.clazz.create(
                'Oskari.service.search.SearchService', me.getSandbox(), me.getConfig().url);

            me.inMobileMode = false;
        },
        _clearPopup: function () {
            if (this._popupControls) {
                this._popupControls.close();
            }
            this._popupControls = null;
        },
        _showResultsPopup: function (results) {
            this._enableSearch();
            this._clearPopup();
            const { totalCount, hasMore, locations } = results;
            const msgKey = hasMore ? 'searchMoreResults' : 'searchResultCount';
            let description = Oskari.getMsg('MapModule', 'plugin.SearchPlugin.' + msgKey, { count: totalCount });
            if (totalCount === 0) {
                description = this._loc.noresults;
            } else if (totalCount === 1) {
                // only one result, show it immediately
                this._resultClicked(locations[0]);
                return;
            }
            this._popupControls = showResultsPopup(this._loc.title, description, locations, (result) => this._resultClicked(result), () => this._clearPopup());
        },
        _setLayerToolsEditModeImpl: function () {
            var me = this,
                el = me.getElement();
            if (!el) {
                return;
            }
            if (this.inLayerToolsEditMode()) {
                this.renderSearchBar(null, el, true);
            } else {
                this.renderSearchBar(null, el);
            }
        },

        /**
         * @private @method _createControlElement
         * Creates UI for search functionality and places it on the maps
         * div where this plugin registered.
         *
         *
         */
        _createControlElement: function () {
            var me = this,
                conf = me.getConfig(),
                el;
            if (conf && !conf.toolStyle) {
                conf.toolStyle = me.getToolStyleFromMapModule();
            }
            if (conf && conf.toolStyle) {
                el = me.template.clone();
                me._element = el;
                me.changeToolStyle(conf.toolStyle, el);
            } else {
                el = me.template.clone();
                me._element = el;
            }

            // bind events
            me._bindUIEvents(el);
            return el;
        },

        _bindUIEvents: function (el) {
            var me = this,
                content = el || me.getElement();
            // to close button
            content.find('div.close').on('click', function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                }
            });
            content.find('div.close-results').on('click', function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                }
            });
            content.find('div.results').hide();
        },

        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                element = me.getElement();

            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, element);
                } else {
                    var toolStyle = me.getToolStyleFromMapModule();
                    if (toolStyle !== null && toolStyle !== undefined) {
                        me.changeToolStyle(toolStyle, element);
                    }
                }
            }
        },

        /**
         * @private @method _doSearch
         * Uses SearchService to make the actual search and calls  #_showResults
         *
         *
         */
        _doSearch: function (text) {
            if (this._searchInProgess) {
                return;
            }
            this._hideSearch();
            this._searchInProgess = true;
            this.service.doSearch(text, results => this._showResultsPopup(results), () => this._enableSearch());
        },

        _setMarker: function (result) {
            var me = this,
                reqBuilder,
                sandbox = me.getSandbox(),
                lat = typeof result.lat !== 'number' ? parseFloat(result.lat) : result.lat,
                lon = typeof result.lon !== 'number' ? parseFloat(result.lon) : result.lon;

            // Add new marker
            reqBuilder = Oskari.requestBuilder(
                'MapModulePlugin.AddMarkerRequest'
            );
            if (reqBuilder) {
                sandbox.request(
                    me.getName(),
                    reqBuilder({
                        color: 'ffde00',
                        msg: result.name,
                        shape: 2,
                        size: 3,
                        x: lon,
                        y: lat
                    }, me._searchMarkerId)
                );
            }
        },

        /**
         * @private @method _resultClicked
         * Click event handler for search result HTML table rows.
         * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
         *
         * @param {Object} result
         */
        _resultClicked: function (result) {
            var zoom = result.zoomLevel;
            if (result.zoomScale) {
                zoom = { scale: result.zoomScale };
            }
            this.getSandbox().request(
                this.getName(),
                Oskari.requestBuilder(
                    'MapMoveRequest'
                )(result.lon, result.lat, zoom)
            );
            this._setMarker(result);
        },

        /**
         * @method _enableSearch
         * Resets the 'search in progress' flag and removes the loading icon
         * @private
         */
        _enableSearch: function () {
            this._searchInProgess = false;
        },

        /**
         * @private @method _hideSearch
         * Hides the search result and sends out MapModulePlugin.RemoveMarkersRequest
         */
        _hideSearch: function () {
            var me = this;
            me.getElement().find('div.results').hide();
            // Send hide marker request
            // This is done just so the user can get rid of the marker somehow...
            var requestBuilder = Oskari.requestBuilder('MapModulePlugin.RemoveMarkersRequest');
            if (!requestBuilder) {
                return;
            }
            me.getSandbox().request(
                me.getName(),
                requestBuilder(me._searchMarkerId)
            );
        },
        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this;
            div = div || me.getElement();
            if (!div) {
                return;
            }

            this.renderSearchBar(style, div);

            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
            );
        },

        renderSearchBar: function (style, element, disabled = false) {
            let el = element;
            if (!element) {
                el = this.getElement();
            }
            if (!el) return;

            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <SearchBar
                        loading={this._searchInProgess}
                        search={text => {
                            if (!this.inLayerToolsEditMode()) {
                                this._doSearch(text);
                            }
                        }}
                        searchText={this.searchText}
                        disabled={disabled}
                        placeholder={this._loc.placeholder}
                    />
                </ThemeProvider>,
                el[0]
            );
        },

        /**
         * @method changeResultListStyle
         * Changes the style of the search result list.
         *
         * @param  {Object} toolStyle
         * @param  {jQuery} div
         *
         * @return {undefined}
         */
        changeResultListStyle: function (toolStyle, div) {
            var cssClass = 'oskari-publisher-search-results-' + toolStyle.val,
                testRegex = /oskari-publisher-search-results-/;

            this.changeCssClasses(cssClass, testRegex, [div]);
        },

        teardownUI: function () {
            if (this.popup) {
                this.popup.close();
            }
        },
        /**
        * @method _stopPluginImpl
        * Interface method for the plugin protocol.
        * Should unregisters requesthandlers and
        * eventlisteners.
        *
        *
        */
        _stopPluginImpl: function (sandbox) {
            var me = this;
            // Remove search results
            if (me.popup) {
                me.popup.close();
                me.popup = null;
            }
            this.removeFromPluginContainer(this.getElement());
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} modeChanged is the ui mode changed (mobile/desktop)
         */
        redrawUI: function (mapInMobileMode, modeChanged) {
            var isMobile = mapInMobileMode || Oskari.util.isMobile();
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            if (!me.getElement()) {
                me._element = me._createControlElement();
            }

            // remove old element
            this.teardownUI();
            this.inMobileMode = isMobile;

            var conf = me.getConfig();
            if (conf) {
                if (conf.toolStyle) {
                    me.changeToolStyle(conf.toolStyle, me._element);
                } else {
                    var toolStyle = me.getToolStyleFromMapModule();
                    me.changeToolStyle(toolStyle, me._element);
                }
            }

            this.addToPluginContainer(me._element);
            me.refresh();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
