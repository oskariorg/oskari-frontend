/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryCutterBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance', function () {
    this._editsInProgress = {};
}, {
    __name: 'GeometryCutterBundleInstance',
    __idPrefix: 'geometryCutter-',
    eventHandlers: {
        'DrawingEvent': function (event) {
            var me = this;
            var drawId = event.getId();
            if (drawId.substr(0, this.__idPrefix.length) !== this.__idPrefix || !event.getIsFinished()) {
                return;
            }
            var editState = this._editsInProgress[drawId];
            if (!editState || !editState.drawing) {
                return;
            }
            var featureCollection = event.getGeoJson();
            var editSuccess = editState.executeGeometryOp(featureCollection.features[0]);
            if (editSuccess) {
                editState.showResult();
            }
            this.sendEvent(editState);
            // Workaround: doing call sync would mess up DrawPlugin
            setTimeout(editState.stopDrawing.bind(editState), 0);
        },
        'FeatureEvent': function (event) {
            var op = event.getOperation();
            if (op !== 'click') {
                return;
            }
            var featureLayers = event.getFeatures();
            var relevantLayers = featureLayers.filter(function (l) { return this._editsInProgress[l.layerId] }, this);
            if (!relevantLayers.length) {
                return;
            }
            var editState = this._editsInProgress[relevantLayers[0].layerId];
            var newSelectedIndex = relevantLayers[0].geojson.features[0].properties.id;
            if (editState && typeof newSelectedIndex === 'number') {
                editState.selectedFeatureIndex = newSelectedIndex;
                editState.showResult();
                this.sendEvent(editState);
            }
        }
    },
    requestHandlers: {
        'StartGeometryCuttingRequest': function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequestHandler', this);
        },
        'StopGeometryCuttingRequest': function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequestHandler', this);
        }
    },
    /**
     * @method startEditing
     * @param {String} operationId unique id for geometry editing operation
     * @param {org.geojson.Feature} feature the target feature to be edited
     * @param {String} mode cutting mode: "lineSplit" or "polygonClip"
     */
    startEditing: function (operationId, feature, mode) {
        var drawId = this.__idPrefix + operationId;
        this.stopEditing(operationId, false); // cleanup any previous edits with same operationId
        function requestFunction(requestName, args) {
            var builder = Oskari.requestBuilder(requestName);
            if (!builder) {
                return false;
            }
            var request = builder.apply(null, args);
            this.sandbox.request(this, request);
            return true;
        }
        var editState = Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.EditState', drawId, mode, feature, requestFunction.bind(this))
        this._editsInProgress[drawId] = editState;
        editState.startDrawing();
    },
    /**
     * @method stopEditing
     * @param {String} operationId unique id for geometry editing operation
     * @param {Boolean} sendEvent should GeometryCuttingEvent be sent?
     */
    stopEditing: function (operationId) {
        var drawId = this.__idPrefix + operationId;
        var editState = this._editsInProgress[drawId];
        if (!editState) {
            return;
        }
        editState.clear();
        delete this._editsInProgress[drawId];
        this.sendEvent(editState, true);
    },
    /**
     * @method sendEvent
     * @param {Oskari.mapframework.bundle.geometrycutter.EditState} editState the editing state to notify about
     */
    sendEvent: function(editState, isFinished){
        var feature = null;
        if (editState.resultFeatures) {
            var index = editState.selectedFeatureIndex;
            feature = editState.resultFeatures[index];
        }
        var event = Oskari.eventBuilder('GeometryCuttingEvent')(editState.id.substr(this.__idPrefix.length), feature, !!isFinished);
        this.sandbox.notifyAll(event);
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});