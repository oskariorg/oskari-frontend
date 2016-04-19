/**
 * @class Oskari.elf.geolocator.BundleInstance
 */
Oskari.clazz.define("Oskari.elf.geolocator.BundleInstance",
    function() {
        this.searchUrl = undefined;
    }, {
        __name : 'elf-geolocator',
        getName : function () {
            return this.__name;
        },
        eventHandlers: {
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
         * Sends a map move and infobox requests for the given result.
         *
         * @method resultClicked
         * @param  {Object} result
         */
        resultClicked: function (result) {
            if (!result) {
                return;
            }

            var sandbox = this.getSandbox(),
                zoom =  sandbox.getMap().getZoom(),
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

            if(result.zoomScale) {
                zoom = {scale : result.zoomScale};
            }

            if (moveReqBuilder) {
                moveReq = moveReqBuilder(
                    result.lon, result.lat, zoom, false, srsName);
                sandbox.request(this, moveReq);
            }

            var options = {
                hidePrevious: true
            };

            if (infoBoxReqBuilder) {
                infoBoxContent = {
                    html: this.__getInfoBoxHtml(result),
                    actions: {}
                };
                infoBoxReq = infoBoxReqBuilder(
                    popupId, this.getLocalization('tab').resultsTitle,
                    [infoBoxContent], lonlat, options);
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
