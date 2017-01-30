/**
 * @class Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.findbycoordinates.FindByCoordinatesBundleInstance",

    /**
     * @static @method create called automatically on construction
     *
     */
    function() {
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
        this.POPUP_ID = "findbycoordinates-search-result";
    }, {
        __name : 'findbycoordinates',
        __templates : {
            item : jQuery('<div>' +
                '   <div class="channel_header">'+
                '       <h3 class="channel_id"></h3>'+
                '   </div>'+
                '   <div class="channel_description icon-info"></div>'+
                '   <div class="none"></div>'+
                '   <div class="result">'+
                '       <div class="name"></div>' +
                '       <div class="info"></div>' +
                '       <div class="lonlat"></div>' +
                '   </div>'+
                '</div>'),
            popup: jQuery('<div class="findbycoordinates__popup__content"></div>'),
            popupChannelResult: jQuery('<div class="channel_result">'+
                '   <div class="channel_header">'+
                '       <h3 class="channel_id"></h3>'+
                '   </div>'+
                '   <div class="channel_description icon-info"></div>'+
                '   <div class="none"></div>'+
                '   <div class="channel__results"></div>'+
                '</div>'),
            popupResult: jQuery('<div class="resultmarker">'+
                '   <img alt="marker"></img>'+
                '</div>'+
                '<div class="nameinfo">'+
                '   <div class="name"></div>'+
                '   <div class="info"></div>'+
                '   <div class="lonlat"></div>'+
                '</div>'+
                '<div class="none"></div>')
        },
        __colors: ['#ffffff', '#666666', '#ffde00', '#f8931f', '#ff3334', '#bf2652',
            '#000000', '#cccccc', '#652d90', '#3233ff', '#26bf4b', '#00ff01'
            ],
        getName : function () {
            return this.__name;
        },
        eventHandlers: {
            'MapClickedEvent': function (event) {
                if (this.tool.active === true) {
                    this.__handleMapClick(event.getLonLat());
                }
            },
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() !== this.toolName) {
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
                this.searchUrl = sandbox.getAjaxUrl() +
                    'action_route=GetReverseGeocodingResult';
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
                reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');

            this.tool.callback = function() {
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
            jQuery('#mapdiv').addClass('findbycoordinates-cursor');
            me._hidePopups();
            me.enableGFI(false);
        },
        /**
         * Stops the tool
         * (for now only sets its `active` property to false)
         *
         * @method stopTool
         */
        stopTool: function () {
            var me = this,
                sandbox = this.getSandbox(),
                spinnerRequestBuilder = sandbox.getRequestBuilder('ShowProgressSpinnerRequest');
            if(spinnerRequestBuilder) {
                sandbox.request(this, spinnerRequestBuilder(false));
            }
            me.tool.active = false;
            jQuery('#mapdiv').removeClass('findbycoordinates-cursor');
            me.enableGFI(true);
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGFI: function (blnEnable) {
            var gfiReqBuilder = this.sandbox.getRequestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
                ),
                hiReqBuilder = this.sandbox.getRequestBuilder(
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
                toolbarReqBuilder = sandbox
                    .getRequestBuilder('Toolbar.SelectToolButtonRequest'),
                toolBarReq;

            if (toolbarReqBuilder) {
                toolBarReq = toolbarReqBuilder();
                sandbox.request(this, toolBarReq);
            }
        },
        /**
         * @method  @private _hidePopups Hide popups
         */
        _hidePopups: function(){
            var me = this,
                sandbox = this.getSandbox(),
                infoBoxHideReqBuilder = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest');

            if(me._popup){
                me._popup.close();
            }
            if(infoBoxHideReqBuilder) {
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
                spinnerRequestBuilder = sandbox.getRequestBuilder('ShowProgressSpinnerRequest');

            if(spinnerRequestBuilder) {
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

            // If there is only one response then show Infobox
            if(results.totalCount === 1) {
                result = results.locations[0];
                var lonlat = {
                        lon: result.lon,
                        lat: result.lat
                    },
                    moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                    infoBoxReqBuilder = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest'),
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
                var popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService'),
                    popupContent = me.__templates.popup.clone(),
                    popupLocation = 'right',
                    popupName = 'findbycoordinatespopup',
                    mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                    themeColours = mapmodule.getThemeColours(),
                    closeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined,
                    oskariMarkers = Oskari.getMarkers(),
                    markersLength = oskariMarkers.length,
                    colorsLength = me.__colors.length,
                    shapeIndex = 0,
                    colorIndex = 0,
                    addMarkerRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest'),
                    removeMarkerRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest'),
                    MARKER_ID_PREFIX = 'findbycoordinates_';

                // Close button
                closeBtn.setTitle(loc.close);
                closeBtn.setHandler(function() {
                    me._popup.close();
                });

                // Create popup
                me._popup = popupService.createPopup();
                me._popup.createCloseIcon();
                me._popup.onClose(function () {
                    if (removeMarkerRequestBuilder) {
                        for(var i=0;i<=me._markerMaxIndex;i++) {
                            sandbox.request(me, removeMarkerRequestBuilder(MARKER_ID_PREFIX + i));
                        }
                    }
                    me._markerMaxIndex = 0;
                });

                me._popup.addClass('findbycoordinates__popup');
                me._popup.setColourScheme({
                    'bgColour': themeColours.backgroundColour,
                    'titleColour': themeColours.textColour,
                    'iconCls': popupCloseIcon
                });

                me._popup.makeDraggable();

                // If there is more than 2 results then add scrolls
                if(results.locations.length>2) {
                    me._popup.getJqueryContent().addClass('show-scroll');
                }

                // Loop results
                for(var i=0, resultsCount=results.locations.length; i<resultsCount;i++) {
                    if(i >= markersLength * colorsLength) {
                        // If all markers and colors are used hten log warn and break results.
                        this._logger.warn('Find nearest places return more than ' + (markersLength * colorsLength) + 'results, breaking.');
                        break;
                    }
                    result = results.locations[i];
                    var channelId = result.channelId,
                        lang = (result.lang && typeof result.lang ==='string') ? result.lang.toUpperCase() : '',
                        langText = (lang !== '') ? ' (' + lang + ')': '',
                        channelResults = popupContent.find('.channel_result[data-channel-id="'+channelId+lang +'"]'),
                        color = me.__colors[colorIndex];

                    if(channelResults.length === 0) {
                        channelResults = me.__templates.popupChannelResult.clone();
                        channelResults.find('.channel_id').html((loc.channels[channelId] || channelId || '') + langText );
                        if(loc.channelDescriptions[channelId]) {
                            channelResults.find('.channel_description').attr('title', loc.channelDescriptions[channelId]);
                        } else {
                            channelResults.find('.channel_description').hide();
                        }
                        channelResults.attr('data-channel-id', channelId+lang);
                        popupContent.append(channelResults);
                    }

                    var markerSvg = mapmodule.getSvg({
                        shape:shapeIndex,
                        color: color,
                        stroke: '#000000'
                    });

                    var markerData = {
                        x: result.lon,
                        y: result.lat,
                        color: color,
                        msg : '',
                        shape: shapeIndex,
                        size: 3,
                        stroke: '#000000'
                    };

                    var resultRow = this.__templates.popupResult.clone();
                    resultRow.find('img').attr('src', markerSvg);
                    resultRow.find('.name').html(result.name || '');
                    resultRow.find('.info').html(result.village || '');
                    resultRow.find('.lonlat').html(result.lon + ', ' + result.lat);

                    channelResults.find('.channel__results').append(resultRow);
                    if (addMarkerRequestBuilder) {
                        sandbox.request(this, addMarkerRequestBuilder(markerData, MARKER_ID_PREFIX + i));
                        me._markerMaxIndex = i;
                    }
                    colorIndex+=1;
                    if(colorIndex>colorsLength-1) {
                        colorIndex = 0;
                        shapeIndex+=1;
                    }

                }

                me._popup.show(loc.popupTitle, popupContent, [closeBtn]);

                me._popup.moveTo(jQuery('#oskari_toolbar_selectiontools_findbycoordinates'), popupLocation, true);
                me._popup.adaptToMapSize(sandbox, popupName);

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
            var me = this,
                loc = this.getLocalization(),
                lang = (result.lang && typeof result.lang ==='string') ? ' (' + result.lang.toUpperCase() + ')' : '';

            var item = this.__templates.item.clone();
            item.find('.channel_id').html((loc.channels[result.channelId] || result.channelId || '') + lang);
            if(loc.channelDescriptions[result.channelId]) {
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
                prio : (result.village) ? 1 : -1,
                html : item
            };
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});