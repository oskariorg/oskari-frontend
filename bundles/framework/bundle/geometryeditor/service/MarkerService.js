/**
 * @class Oskari.mapframework.bundle.geometryeditor.service.MarkerService
 * Methods for handling markers.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometryeditor.service.MarkerService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

        function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.loc = instance.getLocalization('GeometryEditor');
    }, {
        __name: "DrawFilterPlugin.MarkerService",
        __qname: "Oskari.mapframework.bundle.geometryeditor.service.MarkerService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {
debugger;
        },

        /*
         * @method selectActiveMarker
         *
         * @param {} evt
         */
        selectActiveMarker: function (evt) {
debugger;
            OpenLayers.Event.stop(evt);
            var xy = this.map.events.getMousePosition(evt);
            var pixel = new OpenLayers.Pixel(xy.x, xy.y);
            var xyLonLat = this.map.getLonLatFromPixel(pixel);
            this.map.activeMarker = evt.object;
            this.map.activeMarker.markerMouseOffset.lon = xyLonLat.lon - this.map.activeMarker.lonlat.lon;
            this.map.activeMarker.markerMouseOffset.lat = xyLonLat.lat - this.map.activeMarker.lonlat.lat;
            // Two point lines
            var lines = this.map.editLayer.features[0].geometry.components;
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].components.length === 2) {
                    lines[i].components[0].short = i;
                    lines[i].components[1].short = i;
                    lines[i].components[0].shortLink = lines[i].components[1];
                    lines[i].components[1].shortLink = lines[i].components[0];
                } else {
                    lines[i].components[0].short = -1;
                    lines[i].components[lines[i].components.length - 1].short = -1;
                }
            }
            this.map.events.register("mouseup", this.map, this.map.freezeActiveMarker);
            this.map.events.register("mousemove", this.map, this.map.moveActiveMarker);
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
