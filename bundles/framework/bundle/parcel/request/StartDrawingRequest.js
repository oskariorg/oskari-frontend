/**
 * @class Oskari.mapframework.bundle.parcel.request.StartDrawingRequest
 *
 * Handle request to start drawing operation of the given given draw mode.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.StartDrawingRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config Configuration object contains drawMode string
 *                        that should be one defined in drawModes object of this class.
 */
function(config) {
    if (!this.drawModes[config.drawMode]) {
        throw "Unknown draw mode '" + config.drawMode + "'";
    }
    this._drawMode = config.drawMode;

}, {
    /**
     * @method getName
     * Returns request name
     * @return {String} The request name.
     */
    getName : function() {
        return "Parcel.StartDrawingRequest";
    },

    /**
     * @property {Object} drawModes
     * Defines the supported draw modes.
     */
    drawModes : {
        point : 'point',
        line : 'line',
        area : 'area',
        box : 'box'
    },

    /**
     * @method getDrawMode
     * @return {String} Draw mode set for the request.
     */
    getDrawMode : function() {
        return this._drawMode;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
