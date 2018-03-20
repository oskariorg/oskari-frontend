Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.model.MyPlace',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    //GeoJSON format
    //Type Feature, not FeatureCollection
    this.type = "Feature";
    this.id = undefined;
    this.uuid = undefined; //extension
    this.categoryId = undefined; //extension  
    this.createDate = undefined; //extension
    this.updateDate = undefined; //extension
    this.geometry = {
        "type": undefined,
        "coordinates": undefined
    };
    this.properties = {
        "name": undefined,
        "description": undefined,
        "link": undefined,
        "imageLink": undefined,
        "attentionText": undefined
    };
    
}, {
    /**
     * @method getType
     * @return {String} type "Feature"
     */
    getType : function() {
        return this.type;
    },
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
        this.properties.name = value;
    },
    /**
     * @method getName
     * @return {String}
     */
    getName : function() {
        return this.properties.name;
    },
    /**
     * @method setDescription
     * @param {String} value
     */
    setDescription : function(value) {
        this.properties.description = value;
    },
    /**
     * @method getDescription
     * @return {String}
     */
    getDescription : function() {
        return this.properties.description;
    },
    /**
     * @method getAttentionText
     * @return {String}
     */
    getAttentionText : function() {
        return this.properties.attentionText;
    },
    /**
     * @method setAttentionText
     * @param {String} value
     */
    setAttentionText : function(value) {
        this.properties.attentionText = value;
    },
    /**
     * @method setLink
     * @param {String} value
     */
    setLink : function(value) {
        this.properties.link = value;
    },
    /**
     * @method getLink
     * @return {String}
     */
    getLink : function() {
        return this.properties.link;
    },
    /**
     * @method setImageLink
     * @param {String} value
     */
    setImageLink : function(value) {
        this.properties.imageLink = value;
    },
    /**
     * @method getImageLink
     * @return {String}
     */
    getImageLink : function() {
        return this.properties.imageLink;
    },
    /**
     * @method setCategoryId
     * @param {Number} value
     */
    setCategoryId : function(value) {
        this.categoryId = value;
    },
    /**
     * @method getCategoryId
     * @return {Number}
     */
    getCategoryId : function() {
        return this.categoryId;
    },
    /**
     * @method setGeometry
     * @param {Object} value geojson geometry
     */
    setGeometry: function(value) {
        this.geometry.type = value.type;
        this.geometry.coordinates = value.coordinates;
    },

    setDrawToolsMultiGeometry: function(value){
        var coordsArray = [];
        if (value.type === "FeatureCollection" && value.features.length){ //features array
            var feature = value.features[0]; //DrawTools multiGeom returns only one feature
            this.geometry.type = feature.geometry.type;
            this.geometry.coordinates = feature.geometry.coordinates;
        }
    },
    /**
     * @method getGeometry
     * @return {Object} geojson geometry
     */
    getGeometry: function() {
        return this.geometry;
    },
    /**
     * @method setCreateDate
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
     * @param {String} value
     */
    setCreateDate : function(value) {
        this.createDate = value;
    },
    /**
     * @method getCreateDate
     * Returns date in string format:
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
     * @return {String}
     */
    getCreateDate : function() {
        return this.createDate;
    },
    /**
     * @method setUpdateDate
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
     * @param {String} value
     */
    setUpdateDate : function(value) {
        this.updateDate = value;
    },
    /**
     * @method getUpdateDate
     * Returns date in string format:
     * Date format is 2011-11-02T15:27:48.981+02:00 (time part is optional).
     * See Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
     * @return {String}
     */
    getUpdateDate : function() {
        return this.updateDate;
    },
    /**
     * @method setUuid
     * @param {String} value
     */
    setUuid : function(value) {
        this.uuid = value;
    },
    /**
     * @method getUuid
     * @return {String}
     */
    getUuid : function() {
        return this.uuid;
    }
});
