/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.request.ShowFilteredHierarchicalLayerListRequest
 * Forces filtering of the layers based on publishing rights for example.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.framework.bundle.hierarchical-layerlist.request.ShowFilteredHierarchicalLayerListRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} selectedFilter select wanted filter
     * @param {Boolean} opeLayerList Open layer list when calling request
     */
        function(selectedFilter, openLayerList) {
            this._selectedFilter = selectedFilter;
            this._openLayerList = openLayerList;
    }, {
        /** @static @property __name request name */
        __name : "ShowFilteredHierarchicalLayerListRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method  getSelectedFilter
         * @return {String} default selected filter
         */
        getSelectedFilter: function(){
            return this._selectedFilter;
        },
        /**
         * @method  getOpenLayerList
         * @return {Boolean} open layer list
         */
        getOpenLayerList: function(){
            return this._openLayerList;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
