Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',

/**
 * @method create called automatically on construction
 * @static
 */

function (title) {
    //"use strict";
    this.name = title;
    this.id = "";
    this.layers = [];
    this.searchIndex = {};
}, {
    /**
     * @method setId
     * @param {String} value
     */
    setTitle: function (value) {
        //"use strict";
        this.name = value;
    },
    /**
     * @method getTitle
     * @return {String}
     */
    getTitle: function () {
        //"use strict";
        return this.name;
    },
    /**
     * @method setId
     * @param {String} value
     */
    setId: function (value) {
        //"use strict";
        this.id = value;
    },
    /**
     * @method getId
     * @return {String}
     */
    getId: function () {
        //"use strict";
        return this.id;
    },
    /**
     * @method addLayer
     * @param {Layer} layer
     */
    addLayer: function (layer) {
        //"use strict";
        this.layers.push(layer);
        this.searchIndex[layer.getId()] = this._getSearchIndex(layer);
    },
    /**
     * @method getLayers
     * @return {Layer[]}
     */
    getLayers: function () {
        //"use strict";
        return this.layers;
    },
    _getSearchIndex: function (layer) {
        //"use strict";
        var val = layer.getName() + ' ' +
            layer.getInspireName() + ' ' +
            layer.getOrganizationName();
        // TODO: maybe filter out undefined texts
        return val.toLowerCase();
    },
    matchesKeyword: function (layerId, keyword) {
        //"use strict";
        var searchableIndex = this.searchIndex[layerId];
        return searchableIndex.indexOf(keyword.toLowerCase()) !== -1;
    }
});
