/**
 * @class Oskari.mapframework.bundle.mydata.service.MyDataService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.service.MyDataService',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (uiHandler) {
        this._uiHandler = uiHandler;
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: 'Oskari.mapframework.bundle.personaldata.service.MyDataService',
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: 'MyDataService',
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        addTab: function (id, title, component, handler) {
            handler.addStateListener(() => this._uiHandler.notify());
            this._uiHandler.addTab(id, title, component, handler);
        }
    },
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    }
);
