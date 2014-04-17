/**
 * @class Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintWithParcelUIEvent
 *
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintWithParcelUIEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {String} contentId
     *
     * @param {Object} printParams
     *          Parameters for to send backend print service
     * @param {Object} geojsonData
     */
        function (contentId, printParams, geojsonData, tableData) {
        this._contentId = contentId;
        this._printParams = printParams;
        this._geojsonData = geojsonData;
        this._tableData = tableData;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName: function () {
            return "Printout.PrintWithParcelUIEvent";
        },

        getContentId: function () {
            return this._contentId;
        },

        /**
         * Returns print parameters for backend
         *
         * @method getPrintParams
         * @return {Array[Object]}
         */
        getPrintParams: function () {
            return this._printParams;
        },

        /**
         * Returns the geojson data used to generate output
         *
         * @method getGeoJsonData
         * @return {Object}
         */
        getGeoJsonData: function () {
            return this._geojsonData;
        },
        /**
         * Returns the tableData data for print table section
         *
         * @method getTableData
         * @return {Object}
         */
        getTableData: function () {
            return this._tableData;
        }

    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });