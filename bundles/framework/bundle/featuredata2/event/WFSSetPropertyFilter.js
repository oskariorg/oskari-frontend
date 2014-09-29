/**
 * @class Oskari.mapframework.bundle.featuredata2.event.WFSSetPropertyFilter
 *
 * <GIEV MIEH! COMMENTS>
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.event.WFSSetPropertyFilter',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} filters    wfs filter params for properties
     * @param {Object} LayerId   id of wfs layer
     *
     */

    function (filters, layerId) {
        this._filters = filters;
        this._layerId = layerId;
    }, {
        /** @static @property __name event name */
        __name: "WFSSetPropertyFilter",
        /**
         * @method getName
         * @return {String} event name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * WFS layer id for feature property filter
         * @method getLayerId
         */
        getLayerId: function () {
            return this._layerId;
        },
        /**
         * WFS feature property filter params
         * @method getFilters
         */
        getFilters: function () {
            return this._filters;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
