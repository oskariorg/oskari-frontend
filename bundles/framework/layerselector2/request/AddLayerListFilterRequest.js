/**
 * @class Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest
 * Adds filterin button to layerlist.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} toolText tool label text
     * @param {String} tooltip tool tooltip
     * @param {Function} filterFunction layer list filter function
     * @param {String} iconClassActive filter tool icon class when filter is active
     * @param {String} iconClass filter tool icon class when filter is deactive
     * @param {String} filterName filter name, used on {Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequest} if wanted acivate selected filter
     */
        function(toolText, tooltip, filterFunction, iconClassActive, iconClassDeactive, filterName) {
            this._toolText = toolText;
            this._tooltip = tooltip;
            this._filterFunction = filterFunction;
            this._iconClassActive = iconClassActive;
            this._iconClassDeactive = iconClassDeactive;
            this._filterName = filterName;
    }, {
        /** @static @property __name request name */
        __name : "AddLayerListFilterRequest",
        /**
         * @method getName
         * @return {String} request name
         */
        getName : function() {
            return this.__name;
        },
        /**
         * @method getToolText
         * @return {String} a tool text
         */
        getToolText : function() {
            return this._toolText;
        },
        /**
         * @method getTooltip
         * @return {String} a tooltip
         */
        getTooltip : function() {
            return this._tooltip;
        },
        /**
         * @method getFilterFunction
         * @return {Function} a function used for filtering the map layers' list
         */
        getFilterFunction : function() {
            return this._filterFunction;
        },
        /**
         * @method getIconClassActive
         * @return {String} a active tool icon class
         */
        getIconClassActive : function() {
            return this._iconClassActive;
        },
        /**
         * @method getIconClassDeactive
         * @return {String} a deactive tool icon class
         */
        getIconClassDeactive : function() {
            return this._iconClassDeactive;
        },
        /**
         * @method getFilterName
         * @return {String} a filter name
         */
        getFilterName : function() {
            return this._filterName;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ['Oskari.mapframework.request.Request']
    });
