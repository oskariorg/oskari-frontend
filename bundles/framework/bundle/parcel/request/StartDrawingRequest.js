Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StartDrawingRequest', function(config) {
    if (!this.drawModes[config.drawMode]) {
        throw "Unknown draw mode '" + config.drawMode + "'";
    }
    this._drawMode = config.drawMode;

}, {
    getName : function() {
        return "Parcel.StartDrawingRequest";
    },

    drawModes : {
        point : 'point',
        line : 'line',
        area : 'area',
        box : 'box'
    },

    getDrawMode : function() {
        return this._drawMode;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
