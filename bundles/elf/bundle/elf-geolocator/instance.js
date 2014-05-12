/**
 * @class Oskari.elf.geolocator.BundleInstance
 */
Oskari.clazz.define("Oskari.elf.geolocator.BundleInstance",
    function() {
        this.buttonGroup = 'basictools';
        this.toolName = 'geolocator';
        this.tool = {
            iconCls: 'icon-geolocator',
            sticky: true,
            active: false
        };
        this.searchUrl = undefined;
    }, {
        __name : 'elf-geolocator',
        getName : function () {
            return this.__name;
        },
        eventHandlers: {
            'MapClickedEvent': function (event) {
                if (this.tool.active === true) {
                    this.stopTool();
                    this.selectDefaultTool();
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
         * BundleInstance protocol method
         * 
         * @method start
         */
        start: function () {
            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;

            this.sandbox = sandbox;
            sandbox.register(this);

            // stateful
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            request = sandbox
                .getRequestBuilder('userinterface.AddExtensionRequest');
            sandbox.request(this, request(this));

            if (conf && conf.searchUrl) {
                this.searchUrl = conf.searchUrl;
            } else {
                this.searchUrl = sandbox.getAjaxUrl() +
                    'action_route=GetGeoLocatorSearchResult';
            }

            // Create the search service
            this.searchService = Oskari.clazz.create(
                'Oskari.elf.geolocator.service.GeoLocatorSearchService',
                this, this.searchUrl);

            // Create the search tab
            this.tab = Oskari.clazz.create(
                'Oskari.elf.geolocator.GeoLocatorSeachTab',
                this);
            this.tab.requestToAddTab();

            // Create the tool for searching places by clicking on the map
            this.registerTool();
        },
        /**
         * Returns the search service.
         * 
         * @method getSearchService
         * @return {Oskari.elf.geolocator.service.GeoLocatorSearchService}
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
                reqBuilder = sandbox
                    .getRequestBuilder('Toolbar.AddToolButtonRequest'),
                request;

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
        },
        /**
         * Stops the tool
         * (for now only sets its `active` property to false)
         * 
         * @method stopTool
         */
        stopTool: function () {
            this.tool.active = false;
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
                console.log(response);
                if (response) {
                    me.resultClicked(_.first(response.locations));
                }
            }, function () {
                me.getSandbox().printWarn(
                    'ELF ReverseGeoCode search failed',
                    [].slice.call(arguments));
            });
        },
        /**
         * Sends a map move and infobox requests for the given result.
         * 
         * @method resultClicked
         * @param  {Object} result
         */
        resultClicked: function (result) {
            if (!result) return;

            var sandbox = this.getSandbox(),
                zoomLevel = sandbox.getMap().getZoom(),
                srsName = sandbox.getMap().getSrsName(),
                lonlat = new OpenLayers.LonLat(result.lon, result.lat),
                popupId = "elf-geolocator-search-result",
                moveReqBuilder = sandbox
                    .getRequestBuilder('MapMoveRequest'),
                infoBoxReqBuilder = sandbox
                    .getRequestBuilder('InfoBox.ShowInfoBoxRequest'),
                moveReq,
                infoBoxReq,
                infoBoxContent;

            if (moveReqBuilder) {
                moveReq = moveReqBuilder(
                    result.lon, result.lat, zoomLevel, false, srsName);
                sandbox.request(this, moveReq);
            }

            if (infoBoxReqBuilder) {
                infoBoxContent = {
                    html: this.__getInfoBoxHtml(result),
                    actions: {}
                };
                infoBoxReq = infoBoxReqBuilder(
                    popupId, this.getLocalization('tab').resultsTitle,
                    [infoBoxContent], lonlat, true);
                sandbox.request(this, infoBoxReq);
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
            var template = '<h3><%= name %></h3>'
                    + '<p><%= village %></p>'
                    + '<p><%= type %></p>';

            return _.template(template, result);
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
