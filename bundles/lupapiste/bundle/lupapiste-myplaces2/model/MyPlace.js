
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.model.MyPlace', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.id = undefined;
    this.name = undefined;
    this.description = undefined;
    this.categoryID = undefined;
    this.geometry = undefined;
    this.link = undefined;
    this.createDate = undefined;
    this.updateDate = undefined; 
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
     * @method setDescription 
     * @param {String} value
     */
    setDescription : function(value) {
        this.description = value;
    },
    /**
     * @method getDescription
     * @return {String}
     */
    getDescription : function() {
        return this.description;
    },
    /**
     * @method setLink 
     * @param {String} value
     */
    setLink : function(value) {
        this.link = value;
    },
    /**
     * @method getLink
     * @return {String}
     */
    getLink : function() {
        return this.link;
    },
    /**
     * @method setCategoryID 
     * @param {Number} value
     */
    setCategoryID : function(value) {
        this.categoryID = value;
    },
    /**
     * @method getCategoryID 
     * @return {Number}
     */
    getCategoryID : function() {
        return this.categoryID;
    }, 
    /**
     * @method setGeometry 
     * @param {OpenLayers.Geometry} value
     */
    setGeometry : function(value) {
        this.geometry = value;
    },
    /**
     * @method getGeometry 
     * @return {OpenLayers.Geometry}
     */
    getGeometry : function() {
        return this.geometry;
    },
    /**
     * @method setCreateDate
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces2.service.MyPlacesService
     * @param {String} value
     */
    setCreateDate : function(value) {
        this.createDate = value;
    },
    /**
     * @method getCreateDate
     * Returns date in string format:
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces2.service.MyPlacesService 
     * @return {String} 
     */
    getCreateDate : function() {
        return this.createDate;
    },
    /**
     * @method setUpdateDate 
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces2.service.MyPlacesService
     * @param {String} value
     */
    setUpdateDate : function(value) {
        this.updateDate = value;
    },
    /**
     * @method getUpdateDate 
     * Returns date in string format:
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces2.service.MyPlacesService 
     * @return {String}
     */
    getUpdateDate : function() {
        return this.updateDate;
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
    }
});
