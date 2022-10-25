import '../../../../service/search/searchservice';
import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBar } from './SearchBar';

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
        me._index = 10;
        me._name = 'SearchPlugin';
        me._searchMarkerId = 'SEARCH_RESULT_MARKER';
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
                '<div class="mapplugin search default-search-div">' +
                '  <div class="search-textarea-and-button">' +
                '  </div>'
            );

            me.resultsContainer = jQuery(
                '  <div class="results">' +
                '    <div class="content"></div>' +
                '  </div>' +
                '</div>'
            );

            // FIXME
            // - use only this template
            // - add header to results
            // - hide header when styled
            // - search-right is effectively the search button?
            me.styledTemplate = jQuery(
                '<div class="mapplugin search published-search-div">' +
                '  <div class="search-area-div search-textarea-and-button">' +
                '    <div class="search-left"></div>' +
                '    <div class="search-middle">' +
                '      <input class="search-input" placeholder="' + me._loc.placeholder + '" type="text" />' +
                '      <div class="close-results icon-close" title="' + me._loc.close + '"></div>' +
                '    </div>' +
                '    <div class="search-right"></div>' +
                '  </div>' +
                '  <div class="results published-search-results">' +
                '    <div class="content published-search-content"></div>' +
                '  </div>' +
                '</div>'
            );
            me.templateResultsTable = jQuery(
                '<table class="search-results">' +
                '  <thead>' +
                '    <tr>' +
                '      <th class="search-results-count" colspan="3"/>' +
                '    </tr>' +
                '    <tr>' +
                '      <th>' + me._loc.column_name + '</th>' +
                '      <th>' + me._loc.column_region + '</th>' +
                '      <th>' + me._loc.column_type + '</th>' +
                '    </tr>' +
                '  </thead>' +
                '  <tbody></tbody>' +
                '</table>'
            );

            me.templateResultsRow = jQuery(
                '<tr>' +
                '  <td><a href="JavaScript:void(0);""></a></td>' +
                '  <td></td>' +
                '  <td></td>' +
                '</tr>'
            );

            me.service = Oskari.clazz.create(
                'Oskari.service.search.SearchService', me.getSandbox(), me.getConfig().url);
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
                el = me.styledTemplate.clone();
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
                        me.changeToolStyle(me.toolStyles[toolStyle], element);
                    }
                }

                if (conf.font) {
                    me.changeFont(conf.font, element);
                } else {
                    var font = me.getToolFontFromMapModule();
                    if (font !== null && font !== undefined) {
                        me.changeFont(font, element);
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
            this.service.doSearch(text, results => this._showResults(results), () => this._enableSearch());
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

        _showResults: function (results) {
            const me = this;
            const { totalCount, error, hasMore, locations } = results;
            const resultsContainer = me.resultsContainer.clone();
            const content = resultsContainer.find('div.content');
            const mapmodule = me.getMapModule();
            const popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');

            /* clear the existing search results */
            this._enableSearch();
            if (me.popup) {
                me.popup.close();
                me.popup = null;
            }
            me.popup = popupService.createPopup();
            if (error) {
                content.html(error);
            } else {
                // success
                if (totalCount === 0) {
                    content.html(this._loc.noresults);
                } else if (totalCount === 1) {
                    // only one result, show it immediately
                    this._resultClicked(locations[0]);
                    return;
                } else {
                    // many results, show all
                    const table = me.templateResultsTable.clone();
                    const tableBody = table.find('tbody');
                    const msgKey = hasMore ? 'searchMoreResults' : 'searchResultCount';
                    const resultMsg = Oskari.getMsg('MapModule', 'plugin.SearchPlugin.' + msgKey, { count: totalCount });
                    table.find('.search-results-count').html(resultMsg);

                    locations.forEach((result, i) => {
                        const { type, region, name } = result;
                        const row = me.templateResultsRow.clone();
                        const cells = row.find('td');
                        const xref = jQuery(cells[0]).find('a');
                        row.attr('data-location', i);
                        xref.attr('data-location', i);
                        xref.attr('title', name);
                        xref.append(name);
                        xref.on('click', () => this._resultClicked(result));
                        jQuery(cells[1]).attr('title', region).append(region);
                        jQuery(cells[2]).attr('title', type).append(type);

                        tableBody.append(row);
                    });

                    if (!(me.getConfig() && me.getConfig().toolStyle)) {
                        tableBody.find(':odd').addClass('odd');
                    }

                    content.html(table);

                    // Change the font of the rendered table as well
                    var conf = me.getConfig();
                    if (conf) {
                        if (conf.font) {
                            me.changeFont(conf.font, content);
                        }
                        if (conf.toolStyle) {
                            me.changeResultListStyle(
                                conf.toolStyle,
                                resultsContainer
                            );
                        }
                    }
                }
            }

            var popupContent = resultsContainer;
            if (Oskari.util.isMobile()) {
                // get the sticky buttons into their initial state and kill all popups
                me.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
                popupService.closeAllPopups(true);
            }

            me.popup.show(me._loc.title, popupContent);
            me.popup.createCloseIcon();
            const { backgroundColour, textColour } = mapmodule.getThemeColours();
            const popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
            me.popup.setColourScheme({
                'bgColour': backgroundColour,
                'titleColour': textColour,
                'iconCls': popupCloseIcon
            });

            if (!Oskari.util.isMobile()) {
                me.popup.addClass('searchresult');
                me.popup.moveTo(me.getElement(), 'bottom', true);
            } else {
                me.popup.addClass('mobile-popup');
                me.popup.moveTo(me.getElement(), 'bottom', true, mapmodule.getMobileDiv());
                me.popup.getJqueryContent().parent().parent().css('left', 0);
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

            let styleName = style;
            if (!style) {
                styleName = this.getToolStyleFromMapModule();
            }

            ReactDOM.render(
                <SearchBar
                    loading={this._searchInProgess}
                    search={text => {
                        if (!this.inLayerToolsEditMode()) {
                            this._doSearch(text);
                        }
                    }}
                    styleName={styleName}
                    searchText={this.searchText}
                    disabled={disabled}
                    placeholder={this._loc.placeholder}
                />,
                el[0]
            );
        },

        /**
         * @method changeFont
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @param {String} fontId
         * @param {jQuery} div
         *
         */
        changeFont: function (fontId, div) {
            div = div || this.getElement();

            if (!div || !fontId) {
                return;
            }

            // The elements where the font style should be applied to.
            var elements = [];
            elements.push(div.find('table.search-results'));
            elements.push(div.find('input'));

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;
            this.changeCssClasses(classToAdd, testRegex, elements);
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

            if (isMobile) {
                // remove old element
                this.removeFromPluginContainer(this.getElement(), true);

                var mobileDivElement = me.getMapModule().getMobileDiv();
                me._element.addClass('mobilesearch');
                // FIXME is index is not first then this fails
                mobileDivElement.prepend(me._element[0]);
                me._uiMode = 'mobile';
                me.changeToolStyle('rounded-light', me._element);
                me._element.find('div.close-results').remove();
                me._element.find('input.search-input').css({
                    'height': '26px',
                    'margin': 'auto'
                });
            } else {
                me._element.removeClass('mobilesearch');

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
