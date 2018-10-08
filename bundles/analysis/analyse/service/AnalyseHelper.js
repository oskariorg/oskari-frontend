import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olInteractionSelect from 'ol/interaction/Select';
import * as olEventsCondition from 'ol/events/condition';

Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.service.AnalyseHelper',
    function () {
    	this.analyseDrawLayerId = 0;
    }, {

	    /**
	     * Creates the feature layer where the drawn features are added to
	     *
	     * @method createFeatureLayer
	     * @return {ol/layer/Vector}
	     */
	    createFeatureLayer: function () {
	        var me = this;

	        me.featureSource = new olSourceVector();

	        var layer = new olLayerVector({
	            title: 'AnalyseFeatureLayer',
	            source: me.featureSource,
	            style: new olStyleStyle({
	              fill: new olStyleFill({
	                color: 'rgba(92, 176, 219, 0.5)'
	              }),
	              stroke: new olStyleStroke({
	                color: '#3399CC',
	                width: 3
	              }),
	              image: new olStyleCircle({
	                radius: 4,
	                fill: new olStyleFill({
	                  color: '#3399CC'
	                })
	              })
	            })
	        });

	        return layer;
	    },

	    /**
	      * Create hover interaction for the given layer
	      * @param {ol/layer/Vector} layer
	      * @return {ol/interaction/Select} hoverInteraction
	    */
	    createHoverInteraction: function (layer) {
	    	var hoverInteraction = new olInteractionSelect({
	            condition: olEventsCondition.pointerMove,
	            style: new olStyleStyle({
	              stroke: new olStyleStroke({
	                color: '#257ba8',
	                width: 3
	              }),
	              fill: new olStyleFill({
	                color: 'rgba(92, 176, 219, 0.8)'
	              }),
	              image: new olStyleCircle({
	                radius: 4,
	                fill: new olStyleFill({
	                  color: '#257ba8'
	                })
	              })
	            })
	        });

	        return hoverInteraction;
	    },

	    /**
	      * Create select interaction for the given layer
	      * @param {ol/layer/Vector} layer
	      * @return {ol/interaction/Select} selectInteraction
	    */
	    createSelectInteraction: function (layer) {
	    	var selectInteraction = new olInteractionSelect({
	            style: new olStyleStyle({
	              stroke: new olStyleStroke({
	                color: 'rgba(21, 6, 232, 1)',
	                width: 3
	              }),
	              fill: new olStyleFill({
	                color: 'rgba(21, 6, 232, 0.4)'
	              }),
	              image: new olStyleCircle({
	                radius: 4,
	                fill: new olStyleFill({
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