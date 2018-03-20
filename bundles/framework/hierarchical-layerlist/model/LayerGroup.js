Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',

    /**
     * @method create called automatically on construction
     * @static
     */

    function(group, mapLayerService) {
        this._name = Oskari.getLocalized(group.name);
        this._id = group.getId();
        this._selectable = group.hasSelectable();
        this._layers = [];
        this._groups = group.getGroups() || [];
        this._orderNumber = group.getOrderNumber();
        this._toolsVisible = group.hasToolsVisible();
        var me = this;
        this.searchIndex = {};
        group.getLayers().forEach(function(layer) {
            me.addLayer(Oskari.getSandbox().findMapLayerFromAllAvailable(layer.id));
        });
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
        /**
         * @method addLayer
         * @param {Layer} layer
         */
        addLayer: function(layer) {
            if (layer && layer.getId() !== null) {
                this._layers.push(layer);
                this.searchIndex[layer.getId()] = this._getSearchIndex(layer);
            }
        },
        /**
         * @method getLayers
         * @return {Layer[]}
         */
        getLayers: function() {
            return this._layers;
        },
        _getSearchIndex: function(layer) {
            var val = layer.getName() + ' ' +
                layer.getInspireName() + ' ' +
                layer.getOrganizationName();
            // TODO: maybe filter out undefined texts
            return val.toLowerCase();
        },
        matchesKeyword: function(layerId, keyword) {
            var searchableIndex = this.searchIndex[layerId];
            return searchableIndex.indexOf(keyword.toLowerCase()) !== -1;
        },
        setSelectable: function(selectable) {
            this._selectable = selectable;
        },
        hasSelectable: function() {
            return this._selectable;
        },
        getGroups: function() {
            return this._groups;
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