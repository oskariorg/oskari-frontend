Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',

    /**
     * @method create called automatically on construction
     * @static
     */

    function(group, mapLayerService) {
        this._name = Oskari.getLocalized(group.name);
        this._id = group.getId();
        this._selectable = group.hasSelectable();
        this._children = group.getChildren();
        this._orderNumber = group.getOrderNumber();
        this._toolsVisible = group.hasToolsVisible();
        var me = this;
    }, {
        /**
         * @method setId
         * @param {String} value
         */
        setTitle: function(value) {
            this._name = value;
        },
        /**
         * @method getTitle
         * @return {String}
         */
        getTitle: function() {
            return this._name;
        },
        /**
         * @method setId
         * @param {String} value
         */
        setId: function(value) {
            this._id = value;
        },
        /**
         * @method getId
         * @return {String}
         */
        getId: function() {
            return this._id;
        },
        setSelectable: function(selectable) {
            this._selectable = selectable;
        },
        hasSelectable: function() {
            return this._selectable;
        },
        getChildren: function() {
            return this._children;
        },
        getOrderNumber: function() {
            return this._orderNumber;
        },
        setOrderNumber: function(orderNumber) {
            this._orderNumber = orderNumber;
        },
        isToolsVisible: function() {
            return this._toolsVisible;
        }
    });