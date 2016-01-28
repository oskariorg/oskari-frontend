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
    }, {
        __name : 'findbycoordinates',
        __templates : {
            item : _.template('<h3>${ name }</h3>' +
                   '<h3>${ info }</h3>' +
                   '<p>${ lat }, ${ lon }</p>')
        },
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
            this.tool.active = true;
            jQuery('#mapdiv').addClass('reverse-geocode');
            this.enableGFI(false);
        },
        /**
         * Stops the tool
         * (for now only sets its `active` property to false)
         *
         * @method stopTool
         */
        stopTool: function () {
            this.tool.active = false;
            jQuery('#mapdiv').removeClass('reverse-geocode');
            this.enableGFI(true);
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
         * Sends the search request to the search service
         * and handles the response.
         *
         * @method __handleMapClick
         * @private
         * @param  {Object} lonlat
         */
        __handleMapClick: function (lonlat) {
            var me = this;

            this.searchService.doSearch({
                lon: lonlat.lon,
                lat: lonlat.lat
            }, function (response) {
                if (response) {
                    me.handleResponse(response.locations);
                }
                this.stopTool();
                this.selectDefaultTool();
            }, function () {
                me.getSandbox().printWarn(
                    'ReverseGeoCode search failed',
                    [].slice.call(arguments));
                this.stopTool();
                this.selectDefaultTool();
            });
        },
        /**
         * Sends a map move and infobox requests for the given result.
         *
         * @method resultClicked
         * @param  {Object} result
         */
        handleResponse: function (results) {
            if (!results || !results.length) {
                return;
            }

            var me = this,
                loc = this.getLocalization(),
                sandbox = this.getSandbox(),
                popupId = "findbycoordinates-search-result";
            // get the location from first. This is error prone since locations may differ a bit
            // Maybe find another way of doing this like a generic popup with markers for each location?
            var lonlat =  {
                lon: results[0].lon,
                lat: results[0].lat
            };
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest');
            var infoBoxReqBuilder = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest');

            if (moveReqBuilder) {
                sandbox.request(this, moveReqBuilder(
                    lonlat.lon, lonlat.lat, sandbox.getMap().getZoom(),
                    false, sandbox.getMap().getSrsName()));
            }
            if (infoBoxReqBuilder) {
                var contents = [];
                results.forEach(function(result) {
                    contents.push(me.__getInfoBoxHtml(result));
                });
                sandbox.request(this, infoBoxReqBuilder(
                    popupId, loc.resultsTitle,
                    contents, lonlat, true));
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
            var data = {
                name : result.name,
                info : result.village || result.type || "",
                lon : result.lon,
                lat : result.lat
            };
            return this.__templates.item(data);
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});