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
    function(config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin';
        me._defaultLocation = 'top left';
        me._index = 1;
        me._name = 'SearchPlugin';
    }, {

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         * Initializes ui templates and search service.
         *
         *
         */
        _initImpl: function() {
            var me = this,
                ajaxUrl = null;

            me.template = jQuery(
                '<div class="mapplugin search default-search-div">' +
                '  <div class="search-textarea-and-button">' +
                '    <input placeholder="' + me._loc.placeholder + '" type="text" />' +
                '    <input type="button" value="' + me._loc.search + '" name="search" />' +
                '  </div>' +
                '  <div class="results">' +
                '    <div class="header">' +
                '      <div class="close icon-close" title="' + me._loc.close + '"></div>' +
                '    </div>' +
                '    <div class="content">&nbsp;</div>' +
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
                '      <th>' + me._loc.column_name + '</th>' +
                '      <th>' + me._loc.column_village + '</th>' +
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
            var conf = me.getConfig();
            if (conf && conf.url) {
                ajaxUrl = conf.url;
            } else {
                ajaxUrl = me.getSandbox().getAjaxUrl() + 'action_route=GetSearchResult';
            }

            me.service = Oskari.clazz.create(
                'Oskari.mapframework.bundle.search.service.SearchService',
                ajaxUrl
            );
        },

        _setLayerToolsEditModeImpl: function() {
            var me = this,
                overlay;

            if (me.inLayerToolsEditMode()) {
                me._inputField.prop('disabled', true);
                me._searchButton.prop('disabled', true);

                overlay = jQuery('<div class="search-editmode-overlay">');
                me.getElement().find('.search-textarea-and-button')
                    .css({
                        'position': 'relative'
                    })
                    .append(overlay);
                overlay.mousedown(function(e) {
                    e.preventDefault();
                });

            } else {
                me._inputField.prop('disabled', false);
                me._searchButton.prop('disabled', false);
                me.getElement().find('.search-editmode-overlay').remove();
            }
        },

        /**
         * @private @method _createControlElement
         * Creates UI for search functionality and places it on the maps
         * div where this plugin registered.
         *
         *
         */
        _createControlElement: function() {
            var me = this,
                conf = me.getConfig(),
                el;

            if (conf && conf.toolStyle) {
                el = me.styledTemplate.clone();
                me._inputField = el.find('input[type=text]');
                me._searchButton = el.find('input[type=button]');
                me.changeToolStyle(conf.toolStyle, el);
            } else {
                el = me.template.clone();
                me._inputField = el.find('input[type=text]');
                me._searchButton = el.find('input[type=button]');
            }

            // bind events
            me._bindUIEvents(el);
            return el;
        },

        _bindUIEvents: function(el) {
            var me = this,
                reqBuilder,
                sandbox = me.getSandbox(),
                content = el || me.getElement();
            
            // Toggle map keyboard controls so the user can use arrowkeys in the search...
            me._inputField.focus(function() {
                reqBuilder = sandbox.getRequestBuilder(
                    'DisableMapKeyboardMovementRequest'
                );
                if (reqBuilder) {
                    sandbox.request(me.getName(), reqBuilder());
                }
                //me._checkForKeywordClear();
            });
            me._inputField.blur(function() {
                reqBuilder = sandbox.getRequestBuilder(
                    'EnableMapKeyboardMovementRequest'
                );
                if (reqBuilder) {
                    sandbox.request(me.getName(), reqBuilder());
                }
                //me._checkForKeywordInsert();
            });

            me._inputField.keypress(function(event) {
                if (!me.isInLayerToolsEditMode) {
                    me._checkForEnter(event);
                }
            });

            // FIXME these are the same thing now...
            // to search button
            me._searchButton.click(function(event) {
                if (!me.isInLayerToolsEditMode) {
                    me._doSearch();
                }
            });
            content.find('div.search-right').click(function(event) {
                if (!me.isInLayerToolsEditMode) {
                    me._doSearch();
                }
            });


            // to close button
            content.find('div.close').click(function(event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                    me._inputField.val('');
                    // TODO: this should also unbind the TR tag click listeners?
                }
            });
            content.find('div.close-results').click(function(event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                    me._inputField.val('');
                }
            });
            content.find('div.results').hide();

            if (me.conf && me.conf.toolStyle) {
                // Hide the results if esc was pressed or if the field is empty.
                me._inputField.keyup(function(e) {
                    if (e.keyCode === 27 || (e.keyCode === 8 && !jQuery(this).val())) {
                        me._hideSearch();
                    }
                });
            }
        },

        refresh: function () {
            var me = this,
                conf = me.getConfig(),
                el = me.getElement();

            if (conf && conf.font) {
                me.changeFont(conf.font, el);
            }
        }, 

        /**
         * @method _checkForEnter
         * @private
         * @param {Object} event
         *      keypress event object from browser
         * Detects if <enter> key was pressed and calls #_doSearch if it was
         */
        _checkForEnter: function(event) {
            var keycode;
            if (window.event) {
                keycode = window.event.keyCode;
            } else if (event) {
                keycode = event.which;
            }

            if (event.keyCode === 13) {
                this._doSearch();
            }
        },

        /**
         * @private @method _doSearch
         * Uses SearchService to make the actual search and calls  #_showResults
         *
         *
         */
        _doSearch: function() {
            if (this._searchInProgess) {
                return;
            }

            var me = this;
            me._hideSearch();
            me._searchInProgess = true;
            var inputField = me.getElement().find('input[type=text]');
            inputField.addClass('search-loading');
            var searchText = inputField.val(),
                searchCallback = function(msg) {
                    me._showResults(msg);
                    me._enableSearch();
                },
                onErrorCallback = function() {
                    me._enableSearch();
                };
            me.service.doSearch(searchText, searchCallback, onErrorCallback);
        },


        _setMarker: function(result) {
            var me = this,
                reqBuilder,
                sandbox = me.getSandbox(),
                lat = typeof result.lat !== 'number' ? parseFloat(result.lat) : result.lat,
                lon = typeof result.lon !== 'number' ? parseFloat(result.lon) : result.lon;

            // Remove old markers
            reqBuilder = sandbox.getRequestBuilder(
                'MapModulePlugin.RemoveMarkersRequest'
            );
            if (reqBuilder) {
                sandbox.request(me.getName(), reqBuilder());
            }
            // Add new marker
            reqBuilder = sandbox.getRequestBuilder(
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
                    })
                );
            }
        },

        /**
         * @private @method _showResults
         *
         * Renders the results of the search or shows an error message if nothing was found.
         * Coordinates and zoom level of the searchresult item is written in data-href
         * attribute in the tr tag of search result HTML table. Also binds click listeners to <tr> tags.
         * Listener reads the data-href attribute and calls #_resultClicked with it for click handling.
         *
         * @param {Object} msg
         *          Result JSON returned by search functionality
         */
        _showResults: function(msg) {
            // check if there is a problem with search string
            var errorMsg = msg.error,
                me = this,
                resultsContainer = me.getElement().find('div.results'),
                header = resultsContainer.find('div.header'),
                content = resultsContainer.find('div.content');

            if (errorMsg) {
                content.html(errorMsg);
                resultsContainer.show();
                return;
            }

            // success
            var totalCount = msg.totalCount,
                lat,
                lon,
                zoom;

            me.results = msg.locations;

            if (totalCount === 0) {
                content.html(this._loc.noresults);
                resultsContainer.show();
            } else if (totalCount === 1) {
                // only one result, show it immediately
                lon = msg.locations[0].lon;
                lat = msg.locations[0].lat;
                zoom = msg.locations[0].zoomLevel;

                me.getSandbox().request(
                    me.getName(),
                    me.getSandbox().getRequestBuilder(
                        'MapMoveRequest'
                    )(lon, lat, zoom, false)
                );
                me._setMarker(msg.locations[0]);
            } else {

                // many results, show all
                var table = me.templateResultsTable.clone(),
                    tableBody = table.find('tbody'),
                    i,
                    clickFunction = function() {
                        me._resultClicked(
                            me.results[parseInt(
                                jQuery(this).attr('data-location'),
                                10
                            )]
                        );
                        return false;
                    };

                for (i = 0; i < totalCount; i += 1) {
                    if (i >= 100) {
                        tableBody.append(
                            '<tr>' +
                            '  <td class="search-result-too-many" colspan="3">' + me._loc.toomanyresults + '</td>' +
                            '</tr>'
                        );
                        break;
                    }
                    lon = msg.locations[i].lon;
                    lat = msg.locations[i].lat;
                    zoom = msg.locations[i].zoomLevel;
                    var row = me.templateResultsRow.clone(),
                        name = msg.locations[i].name,
                        municipality = msg.locations[i].village,
                        type = msg.locations[i].type,
                        cells = row.find('td'),
                        xref = jQuery(cells[0]).find('a');
                    row.attr('data-location', i);
                    xref.attr('data-location', i);
                    xref.attr('title', name);
                    xref.append(name);
                    xref.click(clickFunction);

                    jQuery(cells[1]).attr('title', municipality).append(municipality);
                    jQuery(cells[2]).attr('title', type).append(type);

                    // IE hack to get scroll bar on tbody element
                    if (jQuery.browser.msie) {
                        row.append(jQuery('<td style="width: 0px;"></td>'));
                    }

                    tableBody.append(row);
                }

                if (!(me.conf && me.conf.toolStyle)) {
                    tableBody.find(':odd').addClass('odd');
                }

                content.html(table);
                resultsContainer.show();

                // Change the font of the rendered table as well
                var conf = me.getConfig();
                if (conf) {
                    if (conf.font) {
                        me.changeFont(conf.font, content);
                    }
                    if (conf.toolStyle) {
                        header.remove();
                        me.changeResultListStyle(
                            conf.toolStyle,
                            resultsContainer
                        );
                    }
                }
            }
        },

        /**
         * @private @method _resultClicked
         * Click event handler for search result HTML table rows.
         * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
         *
         * @param {Object} result
         */
        _resultClicked: function(result) {
            this.getSandbox().request(
                this.getName(),
                this.getSandbox().getRequestBuilder(
                    'MapMoveRequest'
                )(result.lon, result.lat, result.zoomLevel, false)
            );
            this._setMarker(result);
        },

        /**
         * @method _enableSearch
         * Resets the 'search in progress' flag and removes the loading icon
         * @private
         */
        _enableSearch: function() {
            this._searchInProgess = false;
            jQuery('#search-string').removeClass('search-loading');
        },

        /**
         * @private @method _hideSearch
         * Hides the search result and sends out Oskari.mapframework.request.common.HideMapMarkerRequest
         *
         *
         */
        _hideSearch: function() {
            this.getElement().find('div.results').hide();
            // Send hide marker request
            // This is done just so the user can get rid of the marker somehow...
            this.getSandbox().request(
                this.getName(),
                this.getSandbox().getRequestBuilder('HideMapMarkerRequest')()
            );
        },

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function(style, div) {
            var me = this,
                removedClass,
                addedClass,
                template;

            div = div || me.getElement();

            if (!style || !div) {
                return;
            }

            // Set the correct template for the style... ugly.
            // FIXME use the same HTML for both of these so we don't have to muck about with the DOM
            if (style.val === null) {
                // hackhack
                var conf = me.getConfig();
                conf.toolStyle = null;
                me._config = conf;
                div.removeClass('published-search-div').addClass(
                    'default-search-div'
                );
                div.empty();
                me.template.children().clone().appendTo(div);
                me._inputField = div.find('input[type=text]');
                me._searchButton = div.find('input[type=button]');
                me._bindUIEvents();
                return;
            }

            // Remove the old unstyled search box and create a new one.
            if (div.hasClass('default-search-div')) {
                // hand replace with styled version so we don't destroy this.element
                div.removeClass('default-search-div').addClass(
                    'published-search-div'
                );
                div.empty();
                me.styledTemplate.children().clone().appendTo(div);
                me._inputField = div.find('input[type=text]');
                me._searchButton = div.find('input[type=button]');
                me._bindUIEvents();
            }

            var resourcesPath = this.getMapModule().getImageUrl(),
                imgPath = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/search/images/',
                styleName = style.val,
                bgLeft = imgPath + 'search-tool-' + styleName + '_01.png',
                bgMiddle = imgPath + 'search-tool-' + styleName + '_02.png',
                bgRight = imgPath + 'search-tool-' + styleName + '_03.png',
                left = div.find('div.search-left'),
                middle = div.find('div.search-middle'),
                right = div.find('div.search-right'),
                closeResults = middle.find('div.close-results'),
                inputField = div.find('input.search-input'),
                // Left and right widths substracted from the results table width
                middleWidth = (318 - (style.widthLeft + style.widthRight)),
                // Close search width substracted from the middle width
                inputWidth = (middleWidth - 35);

            left.css({
                'background-image': 'url("' + bgLeft + '")',
                'width': style.widthLeft + 'px'
            });
            middle.css({
                'background-image': 'url("' + bgMiddle + '")',
                'background-repeat': 'repeat-x',
                'width': middleWidth + 'px'
            });
            right.css({
                'background-image': 'url("' + bgRight + '")',
                'width': style.widthRight + 'px'
            });
            inputField.css({
                'width': inputWidth + 'px'
            });

            closeResults.removeClass('icon-close icon-close-white');

            // Change the font colour to whitish and the close icon to white
            // if the style is dark themed
            if (/dark/.test(styleName)) {
                closeResults.addClass('icon-close-white');
                closeResults.css({
                    'margin-top': '8px'
                });
                inputField.css({
                    'color': '#ddd'
                });
            } else {
                closeResults.addClass('icon-close');
                closeResults.css({
                    'margin-top': '10px'
                });
                inputField.css({
                    'color': ''
                });
            }

            me._setLayerToolsEditMode(
                me.getMapModule().isInLayerToolsEditMode()
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
        changeFont: function(fontId, div) {
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

            this.getMapModule().changeCssClasses(
                classToAdd,
                testRegex,
                elements
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
        changeResultListStyle: function(toolStyle, div) {
            var cssClass = 'oskari-publisher-search-results-' + toolStyle.val,
                testRegex = /oskari-publisher-search-results-/;

            this.getMapModule().changeCssClasses(cssClass, testRegex, [div]);
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
