/**
 *
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.plugin.MarkersPlugin', function () {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    __name: 'lupakartta.MarkersPlugin',

    _markers: [],

    getName: function () {
        return this.pluginName;
    },

    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },

    init: function (sandbox) {
        var me = this;
        this.requestHandlers = {
            clearMapHandler: Oskari.clazz.create('Oskari.lupapiste.bundle.lupakartta.request.ClearMapRequestHandler', sandbox, me),
            addMarkerHandler: Oskari.clazz.create('Oskari.lupapiste.bundle.lupakartta.request.AddMarkerRequestHandler', sandbox, me)
        };
    },

    register: function () {

    },
    unregister: function () {

    },

    startPlugin: function (sandbox) {
        var me = this,
            p;
        me._sandbox = sandbox;
        me._map = me.getMapModule().getMap();

        me.createMapMarkersLayer();

        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
        sandbox.addRequestHandler('lupakartta.ClearMapRequest', me.requestHandlers.clearMapHandler);
        sandbox.addRequestHandler('lupakartta.AddMarkerRequest', me.requestHandlers.addMarkerHandler);
    },
    stopPlugin: function (sandbox) {
        var p;
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
        sandbox.removeRequestHandler('lupakartta.ClearMapRequest', this.requestHandlers.clearMapHandler);
        sandbox.removeRequestHandler('lupakartta.AddMarkerRequest', this.requestHandlers.addMarkerHandler);
        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },

    /* @method start
     * called from sandbox
     */
    start: function (sandbox) {},
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function (sandbox) {},

    eventHandlers: {},

    onEvent: function (event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },

    /**
     *
     */
    createMapMarkersLayer: function () {
        var sandbox = this._sandbox,
            layerMarkers = new OpenLayers.Layer.Markers("LupapisteMarkers");
        this._map.addLayer(layerMarkers);
        this._map.setLayerIndex(layerMarkers, 1000);
    },

    /***********************************************************
     * Handle HideMapMarkerEvent
     *
     * @param {Object}
     *            event
     */
    afterHideMapMarkerEvent: function (event) {
        // FIXME: AfterHideMapMarkerEvent is no longer available. Need to do this in another way
        var markerLayer = this._map.getLayersByName("LupapisteMarkers");
        if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
            markerLayer[0].setVisibility(false);
        }
    },

    clearMapMarkers: function () {
        var markerLayer = this._map.getLayersByName("LupapisteMarkers");
        if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
            markerLayer[0].clearMarkers();
        }
        this._markers.length = 0;
    },

    getMapMarkerBounds: function () {
        var markerLayer = this._map.getLayersByName("LupapisteMarkers");
        if (markerLayer !== null && markerLayer !== undefined && markerLayer[0] !== null && markerLayer[0] !== undefined) {
            return markerLayer[0].getDataExtent();
        }
    },

    addMapMarker: function (x, y, id, events, iconUrl) {
        if (!id) {
            id = this._markers.length + 1;
            id = "id" + id;
        }
        if (!iconUrl) {
            iconUrl = 'http://www.openlayers.org/dev/img/marker.png';
        }
        var markerLayer = this._map.getLayersByName("LupapisteMarkers"),
            size = new OpenLayers.Size(21, 25),
            offset = new OpenLayers.Pixel(-(size.w / 2), -size.h),
            icon = new OpenLayers.Icon(iconUrl, size, offset),
            marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon),
            i;
        this._markers[id] = marker;
        if (events) {
            for (i in events) {
                marker.events.register(i, marker, events[i]);
            }
        }
        markerLayer[0].addMarker(marker);
    }
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
