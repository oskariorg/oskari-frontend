import { showFindByCoordinatesPopup } from './view/FindByCoordinatesPopup';
import { boundingExtent } from 'ol/extent';

const MARKER_ID_PREFIX = 'findbycoordinates_';
/**
 * @class Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance',

    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        this.buttonGroup = 'selectiontools';
        this.toolName = 'findbycoordinates';
        this.tool = {
            iconCls: 'icon-find-nearest-address',
            sticky: true,
            active: false
        };
        this.searchUrl = undefined;
        this._popup = null;
        this._logger = Oskari.log('findbycoordinates');
        this.POPUP_ID = 'findbycoordinates-search-result';
        this.popupControls = null;
    }, {
        __name: 'findbycoordinates',
        __templates: {
            item: jQuery('<div>' +
                '   <div class="channel_header">' +
                '       <h3 class="channel_id"></h3>' +
                '   </div>' +
                '   <div class="channel_description icon-info"></div>' +
                '   <div class="none"></div>' +
                '   <div class="result">' +
                '       <div class="name"></div>' +
                '       <div class="info"></div>' +
                '       <div class="lonlat"></div>' +
                '   </div>' +
                '</div>')
        },
        __colors: ['#ffffff', '#666666', '#ffde00', '#f8931f', '#ff3334', '#bf2652',
            '#000000', '#cccccc', '#652d90', '#3233ff', '#26bf4b', '#00ff01'
        ],
        getName: function () {
            return this.__name;
        },
        eventHandlers: {
            'MapClickedEvent': function (event) {
                if (this.tool.active === true) {
                    this.__handleMapClick(event.getLonLat());
                }
            },
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() !== this.toolName && event.getSticky()) {
                    this.stopTool();
                }
            }
        },
        /**
         * DefaultExtension method for doing stuff after the bundle has started.
         *
         * @method afterStart
         */
        afterStart: function (sandbox) {
            var conf = this.conf;

            if (conf && conf.searchUrl) {
                this.searchUrl = conf.searchUrl;
            } else {
                this.searchUrl = Oskari.urls.getRoute('GetReverseGeocodingResult');
            }

            // Create the search service
            this.searchService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.findbycoordinates.service.FindByCoordinatesService',
                this, this.searchUrl);

            // Create the tool for searching places by clicking on the map
            this.registerTool();
        },
        /**
         * Returns the search service.
         *
         * @method getSearchService
         * @return {Oskari.mapframework.bundle.findbycoordinates.service.FindByCoordinatesService}
         */
        getSearchService: function () {
            return this.searchService;
        },
        /**
         * Requests the tool to be added to the toolbar.
         *
         * @method registerTool
         */
        registerTool: function () {
            var me = this,
                loc = this.getLocalization(),
                sandbox = this.getSandbox(),
                request,
                reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');

            this.tool.callback = function () {
                me.startTool();
            };
            this.tool.tooltip = loc.tool.tooltip;

            if (reqBuilder) {
                request = reqBuilder(
                    this.toolName, this.buttonGroup, this.tool);
                sandbox.request(this, request);
            }
        },
        /**
         * Starts the tool
         * (for now only sets its `active` property to true)
         *
         * @method startTool
         */
        startTool: function () {
            var me = this;
            me.tool.active = true;
            const mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.getMapEl().addClass('findbycoordinates-cursor');
            me._hidePopups();
            me.closePopup();
            me.enableGFI(false);
        },
        /**
         * Stops the tool
         * (for now only sets its `active` property to false)
         *
         * @method stopTool
         */
        stopTool: function () {
            if (!this.tool.active) {
                return;
            }
            var sandbox = this.getSandbox();
            var spinnerRequestBuilder = Oskari.requestBuilder('ShowProgressSpinnerRequest');
            if (spinnerRequestBuilder) {
                sandbox.request(this, spinnerRequestBuilder(false));
            }
            this.tool.active = false;
            const mapmodule = this.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.getMapEl().removeClass('findbycoordinates-cursor');
            this.enableGFI(true);
        },
        closePopup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            const removeMarkerRequestBuilder = Oskari.requestBuilder('MapModulePlugin.RemoveMarkersRequest');
            if (removeMarkerRequestBuilder) {
                const sandbox = this.getSandbox();
                for (var i = 0; i <= this._markerMaxIndex; i++) {
                    sandbox.request(this, removeMarkerRequestBuilder('findbycoordinates_' + i));
                }
            }
            this._markerMaxIndex = 0;
            this.popupControls = null;
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGFI: function (blnEnable) {
            var gfiReqBuilder = Oskari.requestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'
                ),
                hiReqBuilder = Oskari.requestBuilder(
                    'WfsLayerPlugin.ActivateHighlightRequest'
                );
            // enable or disable gfi requests
            if (gfiReqBuilder) {
                this.sandbox.request(this, gfiReqBuilder(blnEnable));
            }
            // enable or disable wfs highlight
            if (hiReqBuilder) {
                this.sandbox.request(this, hiReqBuilder(blnEnable));
            }
        },
        /**
         * Sends a request to select the default tool.
         *
         * @method selectDefaultTool
         */
        selectDefaultTool: function () {
            // ask toolbar to select default tool
            var sandbox = this.getSandbox(),
                toolbarReqBuilder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest'),
                toolBarReq;

            if (toolbarReqBuilder) {
                toolBarReq = toolbarReqBuilder();
                sandbox.request(this, toolBarReq);
            }
        },
        /**
         * @method  @private _hidePopups Hide popups
         */
        _hidePopups: function () {
            var me = this,
                sandbox = this.getSandbox(),
                infoBoxHideReqBuilder = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest');

            if (infoBoxHideReqBuilder) {
                sandbox.request(this, infoBoxHideReqBuilder(me.POPUP_ID));
            }
        },
        /**
         * Sends the search request to the search service
         * and handles the response.
         *
         * @method __handleMapClick
         * @private
         * @param  {Object} lonlat
         */
        __handleMapClick: function (lonlat) {
            var me = this,
                sandbox = this.getSandbox(),
                spinnerRequestBuilder = Oskari.requestBuilder('ShowProgressSpinnerRequest');

            if (spinnerRequestBuilder) {
                sandbox.request(this, spinnerRequestBuilder(true));
            }

            this.searchService.doSearch({
                lon: lonlat.lon,
                lat: lonlat.lat
            }, function (response) {
                if (response) {
                    me.handleResponse(response);
                }
                me.stopTool();
                me.selectDefaultTool();
            }, function () {
                me.getSandbox().printWarn(
                    'ReverseGeoCode search failed',
                    [].slice.call(arguments));

                me.stopTool();
                me.selectDefaultTool();
            });
        },
        /**
         * Sends a map move and infobox requests for the given result.
         *
         * @method resultClicked
         * @param  {Object} result
         */
        handleResponse: function (results) {
            if (!results || results.totalCount < 1) {
                return;
            }

            var me = this,
                loc = this.getLocalization(),
                sandbox = this.getSandbox(),
                result;

            const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');

            // If there is only one response then show Infobox
            if (results.totalCount === 1) {
                result = results.locations[0];
                var lonlat = {
                        lon: result.lon,
                        lat: result.lat
                    },
                    moveReqBuilder = Oskari.requestBuilder('MapMoveRequest'),
                    infoBoxReqBuilder = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest'),
                    options = {
                        hidePrevious: true
                    };

                if (moveReqBuilder) {
                    sandbox.request(this, moveReqBuilder(
                        lonlat.lon, lonlat.lat, sandbox.getMap().getZoom(),
                        false, sandbox.getMap().getSrsName()));
                }
                if (infoBoxReqBuilder) {
                    var contents = [];
                    contents.push(me.__getInfoBoxHtml(result));
                    sandbox.request(this, infoBoxReqBuilder(
                        me.POPUP_ID, loc.resultsTitle,
                        contents, lonlat, options));
                }
            }
            // If there is more than one results then show results in popup
            else {
                const markersLength = Oskari.custom.getMarkers().length;
                const colorsLength = me.__colors.length;
                let shapeIndex = 0;
                let colorIndex = 0;
                const addMarkerRequestBuilder = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');

                let channelResults = {};

                // Loop results
                for (var i = 0, resultsCount = results.locations.length; i < resultsCount; i++) {
                    if (i >= markersLength * colorsLength) {
                        // If all markers and colors are used hten log warn and break results.
                        this._logger.warn('Find nearest places return more than ' + (markersLength * colorsLength) + 'results, breaking.');
                        break;
                    }
                    result = results.locations[i];

                    var channelId = result.channelId,
                        lang = (result.lang && typeof result.lang === 'string') ? result.lang.toUpperCase() : '',
                        langText = (lang !== '') ? ' (' + lang + ')' : '',
                        color = me.__colors[colorIndex];

                    var markerData = {
                        x: result.lon,
                        y: result.lat,
                        color: color,
                        msg: '',
                        shape: shapeIndex,
                        size: 3,
                        stroke: '#000000'
                    };

                    const { src } = Oskari.custom.getSvg({
                        shape: shapeIndex,
                        fill: { color }
                    });

                    const row = {
                        img: src,
                        name: result.name || '',
                        info: result.village || '',
                        lonlat: result.lon + ', ' + result.lat
                    };
                    if (channelResults[channelId]) {
                        channelResults[channelId].rows.push(row);
                    } else {
                        channelResults[channelId] = {
                            channelId,
                            lang,
                            langText,
                            color,
                            rows: [row]
                        };
                    }

                    if (addMarkerRequestBuilder) {
                        sandbox.request(this, addMarkerRequestBuilder(markerData, MARKER_ID_PREFIX + i));
                        me._markerMaxIndex = i;
                    }
                    colorIndex += 1;
                    if (colorIndex > colorsLength - 1) {
                        colorIndex = 0;
                        shapeIndex += 1;
                    }
                }

                if (!this.popupControls) {
                    const mapTheme = mapmodule.getMapTheme();
                    this.popupControls = showFindByCoordinatesPopup(channelResults, mapTheme, () => this.closePopup());
                }
            }

            if (results?.locations) {
                const coordinates = [];
                for (const location of results.locations) {
                    coordinates.push([location.lon, location.lat]);
                }
                const extent = boundingExtent(coordinates);

                mapmodule.zoomToExtent(extent, false, false, 7);
            }
        },
        /**
         * Returns the content for the infobox.
         *
         * @method __getInfoBoxHtml
         * @private
         * @param  {Object} result
         * @return {String}
         */
        __getInfoBoxHtml: function (result) {
            var loc = this.getLocalization(),
                lang = (result.lang && typeof result.lang === 'string') ? ' (' + result.lang.toUpperCase() + ')' : '';

            var item = this.__templates.item.clone();
            item.find('.channel_id').html((loc.channels[result.channelId] || result.channelId || '') + lang);
            if (loc.channelDescriptions[result.channelId]) {
                item.find('.channel_description').attr('title', loc.channelDescriptions[result.channelId]);
            } else {
                item.find('.channel_description').hide();
            }
            item.find('.name').html(result.name);
            item.find('.info').html(result.village || '');
            item.find('.lonlat').html(result.lon + ', ' + result.lat);
            return {
                // use higher priority for ones with "village" info more than ones that don't
                // this way "nice-to-know" features like "what 3 words" are at the bottom
                prio: (result.village) ? 1 : -1,
                html: item
            };
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    });
