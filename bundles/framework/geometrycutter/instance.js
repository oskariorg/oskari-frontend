/**
 * @class Oskari.mapframework.ui.module.common.geometrycutter.GeometryCutterBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCutterBundleInstance', function () {
    this._editsInProgress = {};
    this._geometryProcessor = Oskari.clazz.create('Oskari.mapframework.bundle.geometrycutter.GeometryProcessor');
}, {
    __name: 'GeometryCutterBundleInstance',
    __idPrefix: 'geometryEdit-',

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
            var drawId = event.getId();
            if (drawId.substr(0, this.__idPrefix.length) !== this.__idPrefix || !event.getIsFinished()) {
                return;
            }
            var editState = this._editsInProgress[drawId];
            if(!editState) {
                throw new Error('No editable geometry for id: ', drawId);
            }
            this.executeEdit(editState, event.getGeoJson());
            // TODO: remove drawn fatures if edit successful
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
        editState.drawnGeometry = geometry;
        switch (editState.mode) {
            case 'lineSplit':
                editState.resultGeometry = this._geometryProcessor.splitByLine(editState.sourceGeometry, editState.drawnGeometry);
                break;
            case 'polygonClip':
                editState.resultGeometry = this._geometryProcessor.clipByPolygon(editState.sourceGeometry, editState.drawnGeometry);
                break;
        }
        if(editState.resultGeometry) {
            var builder = this.__sandbox.getRequestBuilder('MapModulePlugin.AddFeaturesToMapRequest');
            var featureCollection = {
                type: 'FeatureCollection',
                features: editState.resultGeometry
            };
            if (builder) {
                var request = builder(featureCollection, {
                    layerId: 'GEOM_EDITOR'
                });
                this.__sandbox.request(this, request);
            }
        }
    },
    /**
     * @method startEditing
     */
    startEditDrawing: function (functionalityId, geometry, mode) {

        var drawId = this.__idPrefix + functionalityId,
            options = {allowMultipleDrawing : false},
            geometryType;

        switch (mode) {
            case 'lineSplit':
                geometryType = 'LineString';
                break;
            case 'polygonClip':
                geometryType = 'Polygon';
                break;
        }

        this._editsInProgress[drawId] = {
            id: drawId,
            mode: mode,
            sourceGeometry: geometry,
            drawnGeometry: null,
            resultGeometry: null
        };

        var startDrawingRequest = this.__sandbox.getRequestBuilder('DrawTools.StartDrawingRequest');
        if (startDrawingRequest) {
            var request = startDrawingRequest(drawId, geometryType, options);
            this.__sandbox.request(this, request);
        }
    },

    cancelEditing: function(functionalityId) {

    },

    init: function() {},

    /** 
     * @method start
     * Called from sandbox
     */
    start: function (sandbox) {
        var me = this;
        sandbox.register(this);

        Object.keys(this.requestHandlers).forEach(function(requestName) {
            sandbox.requestHandler(requestName, me.requestHandlers[requestName]());
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