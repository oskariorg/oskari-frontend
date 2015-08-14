/**
 * @class Oskari.mapframework.bundle.parcel.handler.PreParcelSelectorHandler
 *
 * Handles PreParcelSelector events that are used to inform that feature with given fid should be loaded.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.handler.PreParcelSelectorHandler",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.ignoreEvents = false;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'PreParcelSelectorHandler';
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this,
            sandbox = this.instance.sandbox,
            p;
        sandbox.register(me);
        for (p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(me, p);
            }
        }
    },
    /**
     * @method stop
     * implements Module protocol stop method
     */
    stop : function() {
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    loadPreParcel : function (fid) {
        var me = this;
        me.instance.getService().loadPreParcelById(fid, function(preparcel) {
            me._loadCallback.call(me, preparcel);
        });
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {

    },
        /**
         * Get original parcel
         * @param fid
         */
        loadParceland : function (fid, preparcel) {
            var me = this;
            me.instance.getService().loadParcel(fid, function(feature) {
                me._loadCallback2.call(me, feature, preparcel, me.instance.conf.parcelFeatureType);
            });
        },
    /**
     * @method _loadCallback
     * @private
     * Callback function that gets the loaded preparcel with geometries
     * Calls the ....
     * @param {} preparcel.preparcel (attributes) and preparcel.data  (geom features)
     * @param {String} featureType Feature type of the feature.
     */
    _loadCallback : function(preparcel) {
        var me =this;
        if (jQuery.isEmptyObject(preparcel))
        {
            //  error message
        }
        else if (preparcel.preparcel && preparcel.data) {
            me.loadParceland(preparcel.preparcel.parent_property_id, preparcel)
        }

        },
        _loadCallback2 : function(features, preparcel, feaType) {
            var me = this;
            if (features) {

                // preparcel.preparcel; common preparcel attributes
                // preparcel.data geom features
                // Create editor
                this.instance.getDrawPlugin().createEditor(features, preparcel.data, preparcel.preparcel);


            }
    },
        _testExtendGeom: function (geom) {

            var line = geom;
            if (geom) {

                if (geom.CLASS_NAME == "OpenLayers.Geometry.LineString") {

                    var geometry = geom;
                    var nodes = geometry.getVertices();
                    var lonlast = nodes[nodes.length - 1].x;
                    var latlast = nodes[nodes.length - 1].y;
                    var lonlast2 = nodes[nodes.length - 2].x;
                    var latlast2 = nodes[nodes.length - 2].y;
                    var dx = lonlast - lonlast2;
                    var dy = latlast - latlast2;
                    var seglen = Math.sqrt((dx * dx) + (dy * dy));
                    var newlonlast = lonlast + ((dx / seglen) * 1.0);
                    var newlatlast = latlast + ((dy / seglen) * 1.0);

                    var lon1st = nodes[0].x;
                    var lat1st = nodes[0].y;
                    var lon2nd = nodes[1].x;
                    var lat2nd = nodes[1].y;
                    var dx = lon1st - lon2nd;
                    var dy = lat1st - lat2nd;
                    var seglen = Math.sqrt((dx * dx) + (dy * dy));
                    var newlon1st = lon1st + ((dx / seglen) * 1.0);
                    var newlat1st = lat1st + ((dy / seglen) * 1.0);

                    points = [];

                    for (var j = 0; j < nodes.length; j++) {
                        var lon = nodes[j].x;
                        var lat = nodes[j].y;
                        if (j == 0) {
                            lon = newlon1st;
                            lat = newlat1st;
                        }
                        else if (j == nodes.length - 1) {
                            lon = newlonlast;
                            lat = newlatlast;
                        }
                        var point = new OpenLayers.Geometry.Point(lon, lat);

                        points.push(point);


                    }
                    line = new OpenLayers.Geometry.LineString(points);
                }


            }
            return line;

        }
    },
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
