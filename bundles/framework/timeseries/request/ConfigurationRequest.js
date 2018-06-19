/**
 * @class Oskari.mapframework.bundle.timeseries.ConfigurationRequest
 * Request timeseries to set configuration for control plugin.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.ConfigurationRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} conf
     *            Configuration object for timeseries control plugin
     */
    function (conf) {
        this._conf = conf;
    }, {
        /** @static @property __name request name */
        __name: 'Timeseries.ConfigurationRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getConfiguration
         */
        getConfiguration: function () {
            return this._conf;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    });
