/**
 * @class Oskari.mapframework.bundle.featuredata2.event.WFSSetExport
 *
 * <GIEV MIEH! COMMENTS>
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.event.WFSSetExport',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} format    gdal code for export file format
     * @param {Object} LayerId   id of wfs layer for to export
     *
     */

    function (format, layerId) {
        this._format = format;
        this._layerId = layerId;
    }, {
        /** @static @property __name event name */
        __name: "WFSSetExport",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * WFS layer id for the export
         * @method getLayerId
         */
        getLayerId: function () {
            return this._layerId;
        },
        /**
         * WFS export file format
         * @method getFormat
         */
        getFormat: function () {
            return this._format;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
