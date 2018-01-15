Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.MarkerHandler',
    function (makeRequest) {
        this.makeRequest = makeRequest;
        this.markerOnMap = false;
    },
    {
        /**
         * @method showAt shows marker on map
         * @param {Number} lon longitude
         * @param {Number} lat latitude
         * @param {String} text label
         */
        showAt: function (lon, lat, text) {
            this.makeRequest('MapModulePlugin.AddMarkerRequest', [{ x: lon, y: lat, msg: text, shape: 5, color: '#00c3ff' }, 'TerrainProfileMarker']);
            this.markerOnMap = true;
        },
        /**
         * @method showAt hide marker
         */
        hide: function () {
            if (!this.markerOnMap) {
                return;
            }
            this.makeRequest('MapModulePlugin.RemoveMarkersRequest', ['TerrainProfileMarker']);
            this.markerOnMap = false;
        }
    },
    {
    }
);
