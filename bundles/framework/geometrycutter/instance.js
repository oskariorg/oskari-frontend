/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryCutterBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance', function () {
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
                editState.resultFeature = this._geometryProcessor.splitByLine(editState.sourceFeature, editState.drawnFeature);
                break;
            case 'polygonClip':
                editState.resultFeature = this._geometryProcessor.clipByPolygon(editState.sourceFeature, editState.drawnFeature);
                break;
        }
        return !!editState.resultFeature;
    },
    showResult: function(editState) {
        if(editState.resultFeature) {
            var builder = this.sandbox.getRequestBuilder('MapModulePlugin.AddFeaturesToMapRequest');
            var featureCollection = {
                type: 'FeatureCollection',
                features: [editState.resultFeature]
            };
            if (builder) {
                var request = builder(featureCollection, {
                    layerId: 'GEOM_EDITOR'
                });
                this.sandbox.request(this, request);
            }
        }
    },

    startEditing: function (functionalityId, feature, mode) {
        var drawId = this.__idPrefix + functionalityId;
        // TODO: what if editing already in progress with same ID?
        var editState = {
            id: drawId,
            mode: mode,
            sourceFeature: feature,
            drawnFeature: null,
            resultFeature: null,
            drawing: true
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
        }
    },
    stopEditDrawing: function(editState) {
        var builder = this.sandbox.getRequestBuilder('DrawTools.StopDrawingRequest');
        if (builder) {
            var request = builder(editState.id, true);
            this.sandbox.request(this, request);
        }
    },

    cancelEditing: function(drawId) {

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