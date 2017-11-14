/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryCutterBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance', function () {
    this.sandbox = null;
    this._editsInProgress = {};
    this._geometryProcessor = Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor');
}, {
    __name: 'GeometryCutterBundleInstance',
    __idPrefix: 'geometryCutter-',

    /**
     * @method getName
     * Returns the name
     * @returns {string} Name
     */
    getName: function () {
        return this.__name
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.call(this, event);
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
            // check if feature is ours
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
            layerId: editState.drawId
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
    },

    init: function() {},

    /** 
     * @method start
     * Called from sandbox
     */
    start: function (sandbox) {
        var me = this;
        sandbox.register(this);
        me.sandbox = sandbox;

        Object.keys(this.requestHandlers).forEach(function(requestName) {
            sandbox.requestHandler(requestName, me.requestHandlers[requestName].call(me));
        });
        Object.keys(this.eventHandlers).forEach(function(eventName) {
            sandbox.registerForEventByName(me, eventName);
        });
    },

    /**
     * @method update
     * Called from sandbox
     */
    update: function (sandbox) {},

    /**
     * @method stop
     * Called from sandbox
     */
    stop: function (sandbox) {
        var me = this;
        Object.keys(this.requestHandlers).forEach(function(requestName) {
            sandbox.requestHandler(requestName, null);
        });
        Object.keys(this.eventHandlers).forEach(function(eventName) {
            sandbox.unregisterFromEventByName(me, eventName);
        });

        sandbox.unregister(this);
    }
}, {
    'protocol': ['Oskari.bundle.BundleInstance']
});