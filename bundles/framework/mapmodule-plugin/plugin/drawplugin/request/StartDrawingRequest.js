Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StartDrawingRequest', 

function(config) {
    // TODO: do we pass selected category colors here?
    if (config.geometry) {
        // editing existing
        this._geometry = config.geometry;
    } else if (config.continueCurrent) {
        // editing new
        this._continueCurrent = config.continueCurrent;
    } else {
        // start drawing new
        if (!this.drawModes[config.drawMode]) {
            throw "Unknown draw mode '" + config.drawMode + "'";
        }
        this._drawMode = config.drawMode;
    }

}, {
    __name : "DrawPlugin.StartDrawingRequest",
    getName : function() {
        return this.__name;
    },

    isModify : function() {
        return this._continueCurrent;
    },

    drawModes : {
        point : 'point',
        line : 'line',
        area : 'area',
        cut : 'cut',
        box : 'box'
    },

    getDrawMode : function() {
        return this._drawMode;
    },

    getGeometry : function() {
        return this._geometry;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});