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
        startTool: function (plugin) {
            this.tool.active = true;
        },
        stopTool: function () {
            this.tool.active = false;
        },
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
        __handleMapClick: function (lonlat) {
            var me = this;

            this.searchService.doSearch({
                lon: lonlat.lat,
                lat: lonlat.lon
            }, function (response) {
                console.log(response);
                me.tab.__resultClicked(
                    _.first(response.locations));
            }, function () {
                console.log([].slice.call(arguments));
            });
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
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
