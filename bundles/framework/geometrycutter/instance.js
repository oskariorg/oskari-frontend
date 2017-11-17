/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryCutterBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance', function () {
    this._editsInProgress = {};
    this._geometryProcessor = Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor');
}, {
    __name: 'GeometryCutterBundleInstance',
    __idPrefix: 'geometryCutter-',
    __basicStyle: {
        stroke: {
            color: '#ff0000',
            width: 1
        },
        fill: {
            color: 'rgba(255,126,123, 0.7)'
        }
    },
    __selectedStyle: {
        stroke: {
            color: '#0000ff',
            width: 1
        },
        fill: {
            color: 'rgba(50,50,255, 0.7)'
        }
    },

    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {
        'DrawingEvent': function (event) {
            var me = this;
            var drawId = event.getId();
            if (drawId.substr(0, this.__idPrefix.length) !== this.__idPrefix || !event.getIsFinished()) {
                return;
            }
            var editState = this._editsInProgress[drawId];
            if(!editState || !editState.drawing) {
                return;
            }
            var featureCollection = event.getGeoJson();
            var editSuccess = this.executeEdit(editState, featureCollection.features[0]);
            if(editSuccess) {
                this.showResult(editState);
            }
            editState.drawing = false;
            // Workaround: doing call as sync will mess up DrawPlugin
            setTimeout(this.stopEditDrawing.bind(this, editState), 0);
        },
        'FeatureEvent': function(event) {
            var op = event.getOperation();
            if(op !== 'click') {
                return;
            }
            var featureLayers = event.getFeatures();
            var relevantLayers = featureLayers.filter(function(l){return this._editsInProgress[l.layerId]}, this);
            if(!relevantLayers.length) {
                return;
            }
            var editState = this._editsInProgress[relevantLayers[0].layerId];
            var newSelectedIndex = relevantLayers[0].geojson.features[0].properties.id;
            if(editState && typeof newSelectedIndex === 'number') {
                editState.selectedFeatureIndex = newSelectedIndex;
                this.showResult(editState);
            }
        }
    },
    requestHandlers:  {
        'StartGeometryCuttingRequest': function() {
            return Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequestHandler', this.sandbox, this);
        },
        'StopGeometryCuttingRequest': function() {
            return Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequestHandler', this.sandbox, this);
        }
    },
    executeEdit: function(editState, geometry) {
        editState.drawnFeature = geometry;
        switch (editState.mode) {
            case 'lineSplit':
                editState.resultFeatures = this._geometryProcessor.splitByLine(editState.sourceFeature, editState.drawnFeature);
                break;
            case 'polygonClip':
                editState.resultFeatures = this._geometryProcessor.clipByPolygon(editState.sourceFeature, editState.drawnFeature);
                break;
        }
        return !!editState.resultFeatures;
    },
    showResult: function(editState) {
        if(!editState.resultFeatures) {
            return;
        }
        var builder = this.sandbox.getRequestBuilder('MapModulePlugin.AddFeaturesToMapRequest');
        if (!builder) {
            return;
        }
        var featureCollection = {
            type: 'FeatureCollection',
            features: editState.resultFeatures
        };
        var request = builder(featureCollection, {
            layerId: editState.id,
            clearPrevious: true,
            featureStyle: this.__basicStyle,
            optionalStyles: [{
                property: {
                    key: 'id',
                    value: editState.selectedFeatureIndex
                },
                fill: this.__selectedStyle.fill,
                stroke: this.__selectedStyle.stroke
            }]
        });
        this.sandbox.request(this, request);
    },
    hideResult: function(editState) {
        if(!editState.resultFeatures) {
            return;
        }
        var builder = this.sandbox.getRequestBuilder('MapModulePlugin.RemoveFeaturesFromMapRequest');
        if (!builder) {
            return;
        }
        var request = builder(null, null, editState.drawId);
        this.sandbox.request(this, request);
    },

    startEditing: function (operationId, feature, mode) {
        var drawId = this.__idPrefix + operationId;
        // TODO: what if editing already in progress with same ID?
        var editState = {
            id: drawId,
            mode: mode,
            sourceFeature: feature,
            drawnFeature: null,
            resultFeatures: null,
            selectedFeatureIndex: 0,
            drawing: false
        };
        this._editsInProgress[drawId] = editState;
        this.startEditDrawing(editState);
    },

    startEditDrawing: function (editState) {
        var geometryType;
        switch (editState.mode) {
            case 'lineSplit':
                geometryType = 'LineString';
                break;
            case 'polygonClip':
                geometryType = 'Polygon';
                break;
        }

        var builder = this.sandbox.getRequestBuilder('DrawTools.StartDrawingRequest');
        if (builder) {
            var request = builder(editState.id, geometryType); //, {allowMultipleDrawing : false});
            this.sandbox.request(this, request);
            editState.drawing = true;
        }
    },
    stopEditDrawing: function(editState) {
        var builder = this.sandbox.getRequestBuilder('DrawTools.StopDrawingRequest');
        if (builder) {
            var request = builder(editState.id, true);
            this.sandbox.request(this, request);
            editState.drawing = false;
        }
    },

    stopEditing: function(operationId, sendEvent) {
        var drawId = this.__idPrefix + operationId;
        var editState = this._editsInProgress[drawId];
        if(!editState) {
            return;
        }
        this.clearEditState(editState);
        delete this._editsInProgress[drawId];
        if(!sendEvent) {
            return;
        }
        var feature = null;
        if(editState.resultFeatures) {
            var index = editState.selectedFeatureIndex;
            feature = editState.resultFeatures[index];
        }
        var event = Oskari.eventBuilder('FinishedGeometryCuttingEvent')(operationId, feature);
        this.sandbox.notifyAll(event);
    },

    clearEditState: function(editState) {
        if (editState.drawing) {
            this.stopEditDrawing(editState);
        }
        if (editState.resultFeatures) {
            this.hideResult(editState);
        }
    }
}, {
    'extend': ['Oskari.mapframework.bundle.geometrycutter.BundleModule'],
    'protocol': ['Oskari.bundle.BundleInstance']
});