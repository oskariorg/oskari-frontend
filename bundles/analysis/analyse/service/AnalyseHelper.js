Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.service.AnalyseHelper',
    function () {
    	this.analyseDrawLayerId = 0;
    }, {

	    /**
	     * Creates the feature layer where the drawn features are added to
	     *
	     * @method createFeatureLayer
	     * @return {ol.layer.Vector}
	     */
	    createFeatureLayer: function () {
	        var me = this;

	        me.featureSource = new ol.source.Vector();

	        var layer = new ol.layer.Vector({
	            title: 'AnalyseFeatureLayer',
	            source: me.featureSource,
	            style: new ol.style.Style({
	              fill: new ol.style.Fill({
	                color: 'rgba(92, 176, 219, 0.5)'
	              }),
	              stroke: new ol.style.Stroke({
	                color: '#3399CC',
	                width: 3
	              }),
	              image: new ol.style.Circle({
	                radius: 4,
	                fill: new ol.style.Fill({
	                  color: '#3399CC'
	                })
	              })
	            })
	        });

	        return layer;
	    },

	    /**
	      * Create hover interaction for the given layer
	      * @param {ol.layer.Vector} layer
	      * @return {ol.interaction.Select} hoverInteraction
	    */
	    createHoverInteraction: function (layer) {
	    	var hoverInteraction = new ol.interaction.Select({
	            condition: ol.events.condition.pointerMove,
	            style: new ol.style.Style({
	              stroke: new ol.style.Stroke({
	                color: '#257ba8',
	                width: 3
	              }),
	              fill: new ol.style.Fill({
	                color: 'rgba(92, 176, 219, 0.8)'
	              }),
	              image: new ol.style.Circle({
	                radius: 4,
	                fill: new ol.style.Fill({
	                  color: '#257ba8'
	                })
	              })
	            })
	        });

	        return hoverInteraction;
	    },

	    /**
	      * Create select interaction for the given layer
	      * @param {ol.layer.Vector} layer
	      * @return {ol.interaction.Select} selectInteraction
	    */
	    createSelectInteraction: function (layer) {
	    	var selectInteraction = new ol.interaction.Select({
	            style: new ol.style.Style({
	              stroke: new ol.style.Stroke({
	                color: 'rgba(21, 6, 232, 1)',
	                width: 3
	              }),
	              fill: new ol.style.Fill({
	                color: 'rgba(21, 6, 232, 0.4)'
	              }),
	              image: new ol.style.Circle({
	                radius: 4,
	                fill: new ol.style.Fill({
	                  color: 'rgba(21, 6, 232, 1)'
	                })
	              })
	            })
	        });

	        return selectInteraction;
	    },

	    /**
	      * Each new drawLayer gets a "unique id" with this sequence
	      * @return {String} [description]
	    */
	    generateDrawLayerId: function () {
	        return 'analyseDrawLayer' + this.analyseDrawLayerId++;
	    },

	    /**
	      * Convert internal geometry type to drawRequest geometry type
	      * @param  {String} internalGeometryType 'point', 'line' or 'area'
	      * @return {String} drawRequestGeometryType 'Point', 'LineString' or 'Polygon'
	    */
	    getDrawRequestType: function (internalGeometryType) {
	    	if (internalGeometryType === 'line') {
	          return 'LineString';
	        } else if (internalGeometryType === 'area') {
	          return 'Polygon';
	        }
	        return 'Point';
	    },

	    /**
	      * Convert drawRequest geometry type to internal geometry type
	      * @param  {String} drawRequestGeometryType 'Point', 'LineString' or 'Polygon'
	      * @return {String} internalGeometryType 'point', 'line' or 'area'
	    */
	    getInternalType: function (drawRequestGeometryType) {
	    	if (drawRequestGeometryType === 'LineString') {
	          return 'line';
	        } else if (drawRequestGeometryType === 'Polygon') {
	          return 'area';
	        }

	        return 'point';
	    }
	}, {
        protocol: ['Oskari.mapframework.service.Service']
    }
);