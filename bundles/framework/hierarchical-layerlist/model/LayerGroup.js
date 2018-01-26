Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',

    /**
     * @method create called automatically on construction
     * @static
     */

    function(group, mapLayerService) {
        this._name = group.name[Oskari.getLang()] || group.name[Oskari.getDefaultLanguage()];
        this._id = group.id;
        this._selectable = group.selectable;
        this._layers = [];
        var me = this;
        this.searchIndex = {};
        group.layers.forEach(function(layer) {
            me.addLayer(mapLayerService.createMapLayer(layer));
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
        }
    });