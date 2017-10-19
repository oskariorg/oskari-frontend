/**
 * @class Oskari.mapframework.bundle.timeseries.WMSAnimator
 * Handles timeseries enabled layer animation
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.WMSAnimator',
function (sandbox, layerId) {
    this._mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    this._sandbox = sandbox;
    this._layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
    
    var times = this.getTimes();
    this._currentTime = times[times.length-1];
    this._subsetRange = [times[0], times[times.length-1]];

    this._doneCallback = null;

    this._sandbox.register(this);
    var p;
    for (p in this.__eventHandlers) {
        if (this.__eventHandlers.hasOwnProperty(p)) {
            sandbox.registerForEventByName(this, p);
        }
    }
}, {
    __name : 'WMSAnimator',
    getName: function () {
        return this.__name;
    },
    _clazz : 'Oskari.mapframework.bundle.timeseries.WMSAnimator',
    __eventHandlers: {
        'ProgressEvent': function(event) {
            if(event.getStatus() && this._layer.getId() === event.getId()) {
                console.log('progressevent');
                if(this._doneCallback){
                    var cb = this._doneCallback;
                    this._doneCallback = null;
                    cb();
                }
            }
        }
    },
    onEvent: function (event) {
        var handler = this.__eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @method getTimes
     * Returns all available time instants that can be shown
     * @return {String[]} list of available timeseries times
     */
    getTimes : function() {
        var times = this._layer.getAttributes().times;
        if(!Array.isArray(times)) {
            var interval = moment.duration(times.interval);
            var end = moment(times.end);
            var t = moment(times.start);
            times = [t.toISOString()];
            while(t.add(interval) < end) {
                times.push(t.toISOString());
            }
            times.push(end.toISOString());
        }
        return times;
    },
    init: function() {},
    /**
     * @method getCurrentTime
     * Returns current selected time instant
     * @return {String} current time as ISO-string
     */
    getCurrentTime : function() {
        return this._currentTime;
    },
    /**
     * @method getSubsetRange
     * Returns current selected time range subset
     * @return {String[]} range Array with 2 elements, start & end, ISO-string
     */
    getSubsetRange: function() {
        return this._subsetRange.slice();
    },
    /**
     * @method getSubsetRange
     * Set current selected time range subset
     * @param {String[]} range Array with 2 elements, start & end, ISO-string
     */
    setSubsetRange : function(range) {
        this._subsetRange = range;
    },
    /**
     * @method requestNewTime
     * Requests change in current selected time
     * @param {String} newTime change current time to this value(ISO string)
     * @param {String} nextTime time value at next animation frame(ISO string). Can be null if not animating
     * @param {function} doneCallback callback that will be called after new time has been loaded
     */
    requestNewTime : function(newTime, nextTime, doneCallback) {
        this._currentTime = newTime;
        var requestBuilder = this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest');
        if(requestBuilder) {
            this._doneCallback = doneCallback;
            var request = requestBuilder(this._layer.getId(), true, {"TIME": newTime});
            this._sandbox.request(this, request);
        }
    },
    /**
     * @method destroy
     * Releases any event handlers and any other resources
     */
    destroy: function() {
        var p;
        for (var p in this.__eventHandlers) {
            if (this.__eventHandlers.hasOwnProperty(p)) {
                this._sandbox.unregisterFromEventByName(this, p);
            }
        }
    }
}, {
    'protocol': [
        'Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol',
        'Oskari.mapframework.module.Module'
    ]
}
);

Oskari.clazz.define('Oskari.mapframework.domain.ImageBuffer',
function () {
    this._images = [];
    this._currentBatch = 0;
    this._timeout = null;
    this._startTime = null;
},
{
    loadImages: function (urls, millisToTarget, millisToTimeout, callback) {
        var me = this;
        me._images = [];
        me._startTime = Date.now();
        me._currentBatch += 1;
        clearTimeout(me._timeout);

        var batch = me._currentBatch;
        var aborted = false;
        var numCompleted = 0;

        urls.forEach(function (url) {
            var image = document.createElement('img');
            image.onload = function () {
                if (batch === me._currentBatch && !aborted) {
                    numCompleted += 1;
                    if (numCompleted === urls.length) {
                        clearTimeout(me._timeout);
                        var timeLeftToTarget = me._startTime + millisToTarget - Date.now();
                        if(timeLeftToTarget <= 0){
                            callback(true);
                        } else {
                            me._timeout = setTimeout(function () {
                                callback(true);
                            }, timeLeftToTarget);
                        }
                    }
                }
            };
            image.src = url;
            me._images.push(image);
        });

        me._timeout = setTimeout(function () {
            if (numCompleted < urls.length && !aborted) {
                callback(false);
            }
        }, millisToTimeout);

        return function() {
            aborted = true;
            clearTimeout(me._timeout);
        };
    }
});