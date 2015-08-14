/**
 * @class Oskari.mapframework.service.UsageSnifferService
 * 
 * This service provides map usage statistics tracking.
 */
Oskari.clazz.define('Oskari.mapframework.service.UsageSnifferService', 

/**
 * @method create called automatically on construction
 * @static
 * @param {Number} sendInterval - time in seconds how often data should be uploaded
 * @param {String} snifferEndpoint - URL where to upload data
 */
function UsageSnifferService(sendInterval, snifferEndpoint) {

    // how often data is sent
    this._sendInterval = sendInterval;
    // where to send data
    this._snifferEndpoint = snifferEndpoint;
    // array of current map layer movement urls
    this._currentStatistics = [];
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.mapframework.service.UsageSnifferService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },

    /** @static @property __name service name */
    __name : "UsageSnifferService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method startSniffing
     * Starts the scheduler for usage statistics endpoint polling 
     */
    startSniffing : function() {
        var me = this;
        setInterval(function() {
            me._sendData();
        }, this._sendInterval * 1000);

        this._clearStats();
    },

    /**
     * @method _sendData
     * Gathers data and sends it to server
     * @private
     */
    _sendData : function() {
        var stats = this._currentStatistics;
        for (var i = 0; i < stats.length; i++) {
            jQuery.get(stats[i], function(data, textStatus, XMLHttpRequest) {
                // no need to do anything regardless of outcome
            });
        }
        this._clearStats();
    },
    /**
     * @method _clearStats
     * Clear stats that have been gathered so far
     * @private
     */
    _clearStats : function() {
        delete this._currentStatistics;
        this._currentStatistics = [];
    },

    /**
     * @method registerMapMovement
     * Registers map movement for given layers and position. Send as usage statistics when scheduler runs.
     *
     * @param {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]} 
     *            visibleLayers
     * @param {Number}
     *            lon
     * @param {Number}
     *            lat
     * @param {Number}
     *            zoom
     * @param {Number}
     *            mapId
     */
    registerMapMovement : function(visibleLayers, lon, lat, zoom, bbox, mapId) {

        for (var i = 0; i < visibleLayers.length; i++) {
            var layer = visibleLayers[i];
            var finalUrl = layer.getId() + "?lon=" + lon + "&lat=" + lat + "&zoom=" + zoom + "&bbox=" + bbox;
 
            // Add mapId if not null 
            if (mapId) {
                finalUrl += "&mapId=" + mapId;
            }

            this._currentStatistics.push(this._snifferEndpoint + finalUrl);
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});