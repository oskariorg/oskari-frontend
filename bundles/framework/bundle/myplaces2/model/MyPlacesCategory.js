/**
 * @class Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.id = undefined;
    this.name = undefined;
    this._isDefault = false;
    this._isPublic = false;
    this.style = 0;
    this.cap = 0;
    this.corner = 0;
    this.lineWidth = 1;
    this.lineColor = '0000ff';
    this.areaLineWidth = 1;
    this.areaLineColor = '993300';
    this.areaFillColor = '993300';
    this.dotSize = 3;
    this.dotColor = '000000';
    this.uuid = undefined;
}, {
    /**
     * @method setId 
     * @param {Number} value
     */
    setId : function(value) {
        this.id = value;
    },
    /**
     * @method getId 
     * @return {Number} 
     */
    getId : function() {
        return this.id;
    },
    /**
     * @method setName 
     * @param {String} value
     */
    setName : function(value) {
        this.name = value;
    },
    /**
     * @method getName 
     * @return {String} 
     */
    getName : function() {
        return this.name;
    },
    /**
     * @method setDefault 
     * @param {Boolean} value
     */
    setDefault : function(value) {
        this._isDefault = (value == true);
    },
    /**
     * @method isDefault
     * @return {Boolean}
     */
    isDefault : function() {
        return (this._isDefault == true);
    },
    /**
     * @method setPublic 
     * @param {Boolean} value
     */
    setPublic : function(value) {
        this._isPublic = (value == true);
    },
    /**
     * @method isPublic
     * @return {Boolean}
     */
    isPublic : function() {
        return (this._isPublic == true);
    },
    /**
     * @method setLineStyle
     * @param {Number} value
     */
    setLineStyle : function(value) {
        this.lineStyle = value;
    },
    /**
     * @method getLineStyle
     * @return {Number}
     */
    getLineStyle : function() {
        return this.lineStyle;
    },
    /**
     * @method setLineCap
     * @param {Number} value
     */
    setLineCap : function(value) {
        this.lineCap = value;
    },
    /**
     * @method getLineCap
     * @return {Number}
     */
    getLineCap : function() {
        return this.lineCap;
    },
    /**
     * @method setLineCorner
     * @param {Number} value
     */
    setLineCorner : function(value) {
        this.lineCorner = value;
    },
    /**
     * @method getLineCorner
     * @return {Number}
     */
    getLineCorner : function() {
        return this.lineCorner;
    },
    /**
     * @method setLineWidth
     * @param {Number} value
     */
    setLineWidth : function(value) {
        this.lineWidth = value;
    },
    /**
     * @method getLineWidth 
     * @return {Number}
     */
    getLineWidth : function() {
        return this.lineWidth;
    }, 
    /**
     * @method setLineColor 
     * @param {String} value color as hex string 
     */
    setLineColor : function(value) {
        this.lineColor = value;
    },
    /**
     * @method getLineColor 
     * Returns color as hex string 
     * @return {String}
     */
    getLineColor : function() {
        return this.lineColor;
    },
    /**
     * @method setAreaLineWidth
     * @param {Number} value
     */
    setAreaLineWidth : function(value) {
        this.areaLineWidth = value;
    },
    /**
     * @method getAreaLineWidth 
     * @return {Number}
     */
    getAreaLineWidth : function() {
        return this.areaLineWidth;
    }, 
    /**
     * @method setAreaLineCorner
     * @param {Number} value
     */
    setAreaLineCorner : function(value) {
        this.areaLineCorner = value;
    },
    /**
     * @method getAreaLineCorner
     * @return {Number}
     */
    getAreaLineCorner : function() {
        return this.areaLineCorner;
    },
    /**
     * @method setAreaLineCap
     * @param {Number} value
     */
    setAreaLineCap : function(value) {
        this.areaLineCap = value;
    },
    /**
     * @method getAreaLineCap
     * @return {Number}
     */
    getAreaLineCap : function() {
        return this.areaLineCap;
    },
    /**
     * @method setAreaLineStyle
     * @param {Number} value
     */
    setAreaLineStyle : function(value) {
        this.areaLineStyle = value;
    },
    /**
     * @method getAreaLineStyle
     * @return {Number}
     */
    getAreaLineStyle : function() {
        return this.areaLineStyle;
    },
    /**
     * @method setAreaLineColor 
     * @param {String} value color as hex string 
     */
    setAreaLineColor : function(value) {
        this.areaLineColor = value;
    },
    /**
     * @method getAreaLineColor 
     * Returns color as hex string 
     * @return {String}
     */
    getAreaLineColor : function() {
        return this.areaLineColor;
    },
    /**
     * @method setAreaFillColor
     * @param {String} value color as hex string 
     */
    setAreaFillColor : function(value) {
        this.areaFillColor = value;
    },
    /**
     * @method getAreaFillColor
     * Returns color as hex string 
     * @return {String} 
     */
    getAreaFillColor : function() {
        return this.areaFillColor;
    },
    /**
     * @method setAreaFillStyle
     * @param {String} value
     */
    setAreaFillStyle : function(value) {
        this.areaFillStyle = value;
    },
    /**
     * @method getAreaFillStyle
     * @return {String}
     */
    getAreaFillStyle : function() {
        return this.areaFillStyle;
    },
    /**
     * @method setDotShape
     * @param {Number} value
     */
    setDotShape : function(value) {
        this.dotShape = value;
    },
    /**
     * @method getDotShape
     * @return {Number}
     */
    getDotShape : function() {
        return this.dotShape;
    },
    /**
     * @method setDotSize
     * @param {Number} value
     */
    setDotSize : function(value) {
        this.dotSize = value;
    },
    /**
     * @method getDotSize 
     * @return {Number}
     */
    getDotSize : function() {
        return this.dotSize;
    }, 
    /**
     * @method setDotColor 
     * @param {String} value color as hex string 
     */
    setDotColor : function(value) {
        this.dotColor = value;
    },
    /**
     * @method getDotColor 
     * Returns color as hex string 
     * @return {String}
     */
    getDotColor : function() {
        return this.dotColor;
    },
    /**
     * @method setUUID 
     * @param {String} value
     */
    setUUID : function(value) {
        this.uuid = value;
    },
    /**
     * @method getUUID 
     * @return {String} 
     */
    getUUID : function() {
        return this.uuid;
    },
    /**
     * @method setVisibleFields
     * @param {Array[String]} value
     */
    setVisibleFields: function(value) {
        this.visibleFields = value;
    },
    /**
     * @method getVisibleFields
     * @return {Array[String]}
     */
    getVisibleFields: function() {
        return this.visibleFields;
    }
});
