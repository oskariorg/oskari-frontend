/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.EditState
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.EditState', function (id, mode, sourceFeature, requestFunction) {
    this.id = id;
    this.mode = mode;
    this.sourceFeature = sourceFeature;
    this.drawnFeature = null;
    this.resultFeatures = null;
    this.selectedFeatureIndex = 0;
    this.drawing = false;
    this.makeRequest = requestFunction;

    this._geometryProcessor = Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor');
}, {
    __basicStyle: {
        stroke: {
            color: '#555555',
            width: 1
        },
        fill: {
            color: 'rgba(0, 0, 0, 0.15)'
        }
    },
    __selectedStyle: {
        stroke: {
            color: '#0000ff',
            width: 1
        },
        fill: {
            color: 'rgba(50,50,255, 0.4)'
        }
    },
    startDrawing: function () {
        if(this.drawing) {
            return;
        }
        var geometryType;
        switch (this.mode) {
            case 'lineSplit':
                geometryType = 'LineString';
                break;
            case 'polygonClip':
                geometryType = 'Polygon';
                break;
        }
        this.drawing = true;
        this.makeRequest('DrawTools.StartDrawingRequest', [this.id, geometryType]);
    },
    stopDrawing: function() {
        if(!this.drawing) {
            return;
        }
        this.drawing = false;
        this.makeRequest('DrawTools.StopDrawingRequest', [this.id, true]);
    },
    showResult: function() {
        if(!this.resultFeatures) {
            return;
        }
        var featureCollection = {
            type: 'FeatureCollection',
            features: this.resultFeatures
        };
        this.makeRequest('MapModulePlugin.AddFeaturesToMapRequest', [featureCollection, {
            layerId: this.id,
            clearPrevious: true,
            featureStyle: this.__basicStyle,
            optionalStyles: [{
                property: {
                    key: 'id',
                    value: this.selectedFeatureIndex
                },
                fill: this.__selectedStyle.fill,
                stroke: this.__selectedStyle.stroke
            }]
        }]);
    },
    hideResult: function() {
        if(!this.resultFeatures) {
            return;
        }
        this.makeRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, this.id]);
    },
    clear: function() {
        this.stopDrawing();
        this.hideResult();
    },
    /**
     * @method executeGeometryOp
     * @param {org.geojson.Feature} feature
     * @return {boolean} was the operation a success?
     */
    executeGeometryOp: function(feature) {
        this.drawnFeature = feature;
        switch (this.mode) {
            case 'lineSplit':
                this.resultFeatures = this._geometryProcessor.splitByLine(this.sourceFeature, this.drawnFeature);
                break;
            case 'polygonClip':
                this.resultFeatures = this._geometryProcessor.clipByPolygon(this.sourceFeature, this.drawnFeature);
                break;
        }
        return !!this.resultFeatures;
    },
}, {});
