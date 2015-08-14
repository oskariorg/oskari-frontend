define(["./AbstractMapLayerModel", "bundles/framework/bundle/mapwmts/domain/WmtsLayer"], function () {
    // Dependency load helper

    Oskari.cls('Oskari.mapframework.wmts.domain.WmtsLayer').category({
    	_WmtsCaps: null,
	    /**
	     * @method setWmtsLayerDef
	     * @return {Object} def
	     */
	    setWmtsCaps : function(caps) {
	        this._WmtsCaps = caps;
	    },
	    /**
	     * @method getWmtsLayerDef
	     * @return {Object}
	     */
	    getWmtsCaps : function() {
	        return this._WmtsCaps ;
	    },

    });
});