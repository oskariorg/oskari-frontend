/**
 * @class Oskari.mapframework.bundle.printout.service.PrintService
 * Requests to print preview and for legend parameters
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.service.PrintService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
    }, {
        __name: "Printout.PrintService",
        __qname: "Oskari.mapframework.bundle.printout.service.PrintService",

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

        },

        /**
         * @method fetchPrintMapData
         * Make the AJAX call. This method helps
         * if we need to do someting for all the calls to backend.
         *
         * param url to correct action route
         * param successCb (success callback)
         * param errorCb (error callback)
         */
        fetchPrintMapData: function (url, successCb, errorCb) {
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data: {
                    srs: this.sandbox.getMap().getSrsName()
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: url,
                success: function (pResp) {
                    if (successCb) {
                        successCb(pResp);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (errorCb && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            });
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });