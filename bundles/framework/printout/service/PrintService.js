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
        __name: 'Printout.PrintService',
        __qname: 'Oskari.mapframework.bundle.printout.service.PrintService',

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
        fetchPrint: function (url, payload, successCb, errorCb) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'blob',
                body: JSON.stringify(payload)
            }).then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    return Promise.reject(new Error('Failed to get print'));
                }
            }).then(blob => {
                successCb(blob);
            }).catch(error => errorCb(error));
        }

    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
