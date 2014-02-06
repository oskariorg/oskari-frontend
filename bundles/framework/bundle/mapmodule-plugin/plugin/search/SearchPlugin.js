/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map.
 * Uses same backend as search bundle:
 * http://www.oskari.org/trac/wiki/DocumentationBundleSearchBackend
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *     JSON config with params needed to run the plugin
     */

    function (config) {
        var me = this;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me.conf = config;
        me.element = null;
        me.loc = null;
    }, {

        /** @static @property __name plugin name */
        __name: 'SearchPlugin',

        getClazz: function () {
            return "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin";
        },

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol.
         * Initializes ui templates and search service.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            var me = this,
                pluginLoc = me.getMapModule().getLocalization('plugin', true);
            me.loc = pluginLoc[me.__name];

            me.template = jQuery(
                '<div class="mapplugin search default-search-div" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin">' +
                    '<div class="search-textarea-and-button">' +
                    '<input placeholder="' + me.loc.placeholder + '" type="text" />' +
                    '<input type="button" value="' + me.loc.search + '" name="search" />' +
                    '</div>' +
                    '<div class="results">' +
                    '<div class="header">' +
                    '<div class="close icon-close" title="' + me.loc.close + '"></div>' +
                    '</div>' +
                    '<div class="content">&nbsp;</div>' +
                    '</div>' +
                    '</div>'
            );

            me.styledTemplate = jQuery(
                '<div class="mapplugin search published-search-div" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin">' +
                    '<div class="search-area-div search-textarea-and-button">' +
                    '<div class="search-left"></div>' +
                    '<div class="search-middle">' +
                    '<input class="search-input" placeholder="' + me.loc.placeholder + '" type="text" />' +
                    '<div class="close-results icon-close" title="' + me.loc.close + '"></div>' +
                    '</div>' +
                    '<div class="search-right"></div>' +
                    '</div>' +
                    '<div class="results published-search-results">' +
                    '<div class="content published-search-content"></div>' +
                    '</div>' +
                    '</div>'
            );

            me.templateResultsTable = jQuery("<table class='search-results'><thead><tr>" +
                "<th>" + me.loc.column_name + "</th>" + "<th>" + me.loc.column_village + "</th>" + "<th>" + me.loc.column_type +
                "</th>" + "</tr></thead><tbody></tbody></table>");

            me.templateResultsRow = jQuery("<tr><td><a href='JavaScript:void(0);'></a></td><td></td><td></td></tr>");

            var ajaxUrl = null;
            if (me.conf && me.conf.url) {
                ajaxUrl = me.conf.url;
            } else {
                ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
            }

            me.service = Oskari.clazz.create('Oskari.mapframework.bundle.search.service.SearchService', ajaxUrl);
        },
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the plugin UI on the map.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();

            me._sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }
            me._createUI();
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         * Removes the plugin UI from the map.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            me.element.remove();
            me.element = null;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'LayerToolsEditModeEvent': function (event) {
                this._setLayerToolsEditMode(event.isInMode());
            }
        },

        _setLayerToolsEditMode: function (isInEditMode) {
            if (this.isInLayerToolsEditMode === isInEditMode) {
                return;
            }
            this.isInLayerToolsEditMode = isInEditMode;
            if (this.isInLayerToolsEditMode) {
                this._inputField.prop("disabled", true);
                this._searchButton.prop("disabled", true);

                var overlay = jQuery('<div class="search-editmode-overlay">');
                this.element.find('.search-textarea-and-button')
                    .css({
                        'position': 'relative'
                    })
                    .append(overlay);
                overlay.mousedown(function (e) {
                    e.preventDefault();
                });

            } else {
                this._inputField.prop("disabled", false);
                this._searchButton.prop("disabled", false);
                this.element.find('.search-editmode-overlay').remove();
            }
        },


        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         * Sets the location of the search.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            if (!me.conf.location) {
                me.conf.location = {};
            }
            me.conf.location.classes = location;

            if (me.element) {
                me.getMapModule().setMapControlPlugin(me.element, location, 1);
            }
        },
        /**
         * @method _createUI
         * @private
         * Creates UI for search functionality and places it on the maps
         * div where this plugin registered.
         */
        _createUI: function () {
            var me = this,
                content;

            if (me.conf && me.conf.toolStyle) {
                content = me.styledTemplate.clone();
                me.element = content;
                me._inputField = content.find('input[type=text]');
                me._searchButton = content.find('input[type=button]');
                me.changeToolStyle(me.conf.toolStyle, content);
            } else {
                content = me.template.clone();
                me.element = content;
                me._inputField = content.find('input[type=text]');
                me._searchButton = content.find('input[type=button]');
            }

            // bind events
            me._bindUIEvents();

        },
        _bindUIEvents: function () {
            var me = this,
                sandbox = me._sandbox,
                content = this.element,
                containerClasses = 'top left',
                position = 1;
            // to text box
            me._inputField.focus(function () {
                sandbox.request(me.getName(), sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
                //me._checkForKeywordClear();
            });
            me._inputField.blur(function () {
                sandbox.request(me.getName(), sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
                //me._checkForKeywordInsert();
            });

            me._inputField.keypress(function (event) {
                console.log("Key pressed");
                if (!me.isInLayerToolsEditMode) {
                    console.log("Checking for enter");
                    me._checkForEnter(event);
                }
            });
            // to search button
            me._searchButton.click(function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._doSearch();
                }
            });
            content.find('div.search-right').click(function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._doSearch();
                }
            });
            // to close button
            content.find('div.close').click(function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                    me._inputField.val('');
                    // TODO: this should also unbind the TR tag click listeners?
                }
            });
            content.find('div.close-results').click(function (event) {
                if (!me.isInLayerToolsEditMode) {
                    me._hideSearch();
                    me._inputField.val('');
                }
            });
            content.find('div.results').hide();

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }
            //parentContainer.append(me.element);
            me.getMapModule().setMapControlPlugin(content, containerClasses, position);

            if (me.conf && me.conf.font) {
                me.changeFont(me.conf.font, content);
            }
            if (me.conf && me.conf.toolStyle) {
                // Hide the results if esc was pressed or if the field is empty.
                me._inputField.keyup(function (e) {
                    if (e.keyCode === 27 || (e.keyCode === 8 && !jQuery(this).val())) {
                        me._hideSearch();
                    }
                });
            }
            // in case we are already in edit mode when plugin is drawn
            me._setLayerToolsEditMode(me.getMapModule().isInLayerToolsEditMode());
        },
        /**
         * @method _checkForEnter
         * @private
         * @param {Object} event
         *      keypress event object from browser
         * Detects if <enter> key was pressed and calls #_doSearch if it was
         */
        _checkForEnter: function (event) {
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
         * @method _doSearch
         * @private
         * Uses SearchService to make the actual search and calls  #_showResults
         */
        _doSearch: function () {
            if (this._searchInProgess) {
                return;
            }

            var me = this;
            me._hideSearch();
            me._searchInProgess = true;
            var inputField = me.element.find('input[type=text]');
            inputField.addClass("search-loading");
            var searchText = inputField.val(),
                searchCallback = function (msg) {
                    me._showResults(msg);
                    me._enableSearch();
                },
                onErrorCallback = function () {
                    me._enableSearch();
                };
            me.service.doSearch(searchText, searchCallback, onErrorCallback);
        },
        /**
         * @method _showResults
         * @private
         * Renders the results of the search or shows an error message if nothing was found.
         * Coordinates and zoom level of the searchresult item is written in data-href
         * attribute in the tr tag of search result HTML table. Also binds click listeners to <tr> tags.
         * Listener reads the data-href attribute and calls #_resultClicked with it for click handling.
         *
         * @param {Object} msg
         *          Result JSON returned by search functionality
         */
        _showResults: function (msg) {
            // check if there is a problem with search string
            var errorMsg = msg.error,
                me = this,
                resultsContainer = me.element.find('div.results'),
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
            if (totalCount === 0) {
                content.html(this.loc.noresults);
                resultsContainer.show();
            } else if (totalCount === 1) {
                // only one result, show it immediately
                lon = msg.locations[0].lon;
                lat = msg.locations[0].lat;
                zoom = msg.locations[0].zoomLevel;

                me._sandbox.request(me.getName(), me._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, false));
            } else {

                // many results, show all
                var table = me.templateResultsTable.clone(),
                    tableBody = table.find('tbody'),
                    i,
                    clickFunction = function () {
                        me._resultClicked(jQuery(this).attr('data-location'));
                        return false;
                    };

                for (i = 0; i < totalCount; i += 1) {
                    if (i >= 100) {
                        tableBody.append("<tr><td class='search-result-too-many' colspan='3'>" + me.loc.toomanyresults + "</td></tr>");
                        break;
                    }
                    lon = msg.locations[i].lon;
                    lat = msg.locations[i].lat;
                    zoom = msg.locations[i].zoomLevel;
                    var dataLocation = lon + "---" + lat + "---" + zoom,
                        row = me.templateResultsRow.clone(),
                        name = msg.locations[i].name,
                        municipality = msg.locations[i].village,
                        type = msg.locations[i].type,
                        cells = row.find('td'),
                        xref = jQuery(cells[0]).find('a');
                    row.attr('data-location', dataLocation);
                    xref.attr('data-location', dataLocation);
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
                    tableBody.find(":odd").addClass("odd");
                }

                content.html(table);
                resultsContainer.show();

                // Change the font of the rendered table as well
                if (me.conf && me.conf.font) {
                    me.changeFont(me.conf.font, content);
                }
                if (me.conf && me.conf.toolStyle) {
                    header.remove();
                    me.changeResultListStyle(me.conf.toolStyle, resultsContainer);
                }
            }
        },
        /**
         * @method _resultClicked
         * Click event handler for search result HTML table rows.
         * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
         * @private
         * @param {String} paramStr String that has coordinates and zoom level separated with '---'.
         */
        _resultClicked: function (paramStr) {
            var values = paramStr.split('---'),
                lon = values[0],
                lat = values[1],
                zoom = values[2];
            this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, false));
        },
        /**
         * @method _enableSearch
         * Resets the 'search in progress' flag and removes the loading icon
         * @private
         */
        _enableSearch: function () {
            this._searchInProgess = false;
            jQuery("#search-string").removeClass("search-loading");
        },
        /**
         * @method _hideSearch
         * @private
         * Hides the search result and sends out Oskari.mapframework.request.common.HideMapMarkerRequest
         */
        _hideSearch: function () {
            this.element.find('div.results').hide();
            // Send hide marker request
            this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('HideMapMarkerRequest')());
        },

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                removedClass,
                addedClass,
                template;
            div = div || me.element;

            if (!style || !div) {
                return;
            }

            // Set the correct template for the style... ugly.
            // FIXME use the same HTML for both of these so we don't have to muck about with the DOM
            if (style.val === null) {
                me.conf.toolStyle = null;
                div.removeClass('published-search-div').addClass('default-search-div');
                div.empty();
                me.template.children().clone().appendTo(div);
                me._inputField = div.find('input[type=text]');
                me._searchButton = div.find('input[type=button]');
                me._bindUIEvents();
                // Force edit mode so the tool controls are disabled
                if (me.isInLayerToolsEditMode) {
                    me.isInLayerToolsEditMode = false;
                    me._setLayerToolsEditMode(true);
                }
                return;
            }

            // Remove the old unstyled search box and create a new one.
            if (div.hasClass('default-search-div')) {
                // hand replace with styled version so we don't destroy this.element
                div.removeClass('default-search-div').addClass('published-search-div');
                div.empty();
                me.styledTemplate.children().clone().appendTo(div);
                me._inputField = div.find('input[type=text]');
                me._searchButton = div.find('input[type=button]');
                me._bindUIEvents();
                // Force edit mode so the tool controls are disabled
                if (me.isInLayerToolsEditMode) {
                    me.isInLayerToolsEditMode = false;
                    me._setLayerToolsEditMode(true);
                }
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

            me._setLayerToolsEditMode(me.getMapModule().isInLayerToolsEditMode());

        },

        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @method changeFont
         * @param {String} fontId
         * @param {jQuery} div
         */
        changeFont: function (fontId, div) {
            div = div || this.element;

            if (!div || !fontId) {
                return;
            }

            // The elements where the font style should be applied to.
            var elements = [];
            elements.push(div.find('table.search-results'));
            elements.push(div.find('input'));

            var classToAdd = 'oskari-publisher-font-' + fontId,
                testRegex = /oskari-publisher-font-/;

            this.getMapModule().changeCssClasses(classToAdd, testRegex, elements);
        },

        /**
         * Changes the style of the search result list.
         *
         * @method changeResultListStyle
         * @param  {Object} toolStyle
         * @param  {jQuery} div
         * @return {undefined}
         */
        changeResultListStyle: function (toolStyle, div) {
            var cssClass = 'oskari-publisher-search-results-' + toolStyle.val,
                testRegex = /oskari-publisher-search-results-/;

            this.getMapModule().changeCssClasses(cssClass, testRegex, [div]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
