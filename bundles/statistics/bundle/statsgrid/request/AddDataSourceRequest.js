/**
 * Request to add a data source to the stats plugin.
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 *
 * @class Oskari.statistics.bundle.statsgrid.request.AddDataSourceRequest
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.AddDataSourceRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (_dataSourceId, _dataSourceName, _data) {
        this._dataSourceId = _dataSourceId;
        this._dataSourceName = _dataSourceName;
        this._data = _data;
    }, {
        /**
         * @static
         * @property __name request name
         */
        __name: 'StatsGrid.AddDataSourceRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        getDataSourceId: function () {
            return this._dataSourceId;
        },
        getDataSourceName: function () {
            return this._dataSourceName;
        },
        getData: function () {
            return this._data;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
