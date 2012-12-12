Oskari.clazz.define('Oskari.harava.bundle.mapmodule.request.StartGeometrySearchRequest', 

function(searchMode) {
    // start drawing new
    if (!this.searchModes[searchMode]) {
            throw "Unknown draw mode '" + searchMode + "'";
    }
    this._searchMode = searchMode;
}, {
    __name : "StartGeometrySearchRequest",
    getName : function() {
        return this.__name;
    },
    searchModes : {
        point : 'point',
        line : 'line',
        polygon : 'polygon',
    	regularPolygon: 'regularPolygon'
    },
    getSearchMode : function() {
        return this._searchMode;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});