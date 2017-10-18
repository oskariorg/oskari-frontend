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
}, {
    __name : 'WMSAnimator',
    _clazz : 'Oskari.mapframework.bundle.timeseries.WMSAnimator',
    /**
     * @method getTimes
     * Returns all available time instants that can be shown
     * @return {String[]} list of available timeseries times
     * @throws always override this
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
    /**
     * @method getCurrentTime
     * Returns current selected time instant
     * @return {String} current time as ISO-string
     * @throws always override this
     */
    getCurrentTime : function() {
        return this._currentTime;
    },
    /**
     * @method requestNewTime
     * Requests change in current selected time
     * @param {String} newTime change current time to this value(ISO string)
     * @param {String} nextTime time value at next animation frame(ISO string). Can be null if not animating
     * @param {function} doneCallback callback that will be called after new time has been loaded
     * @throws always override this
     */
    requestNewTime : function(newTime, nextTime, doneCallback) {
        console.log('ansking layer to animate')
        this._currentTime = newTime;
        this._mapModule.handleMapLayerUpdateRequest(this._layer.getId(), true, {"TIME": newTime});
    }
}, {
    'protocol': [
        'Oskari.mapframework.bundle.timeseries.TimeseriesUIProtocol'
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