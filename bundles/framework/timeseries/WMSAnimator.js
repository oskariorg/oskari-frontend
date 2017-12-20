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
        this._currentTime = times[0];
        this._subsetRange = [times[0], times[times.length - 1]];

        this._doneCallback = null;
        this._isBuffering = false;
        this._isLoading = false;
        
        this._sandbox.register(this);
        var p;
        for (p in this.__eventHandlers) {
            if (this.__eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(this, p);
            }
        }
        this.requestNewTime(this._currentTime, null, function(){});
    }, {
        __name: 'WMSAnimator',
        getName: function () {
            return this.__name;
        },
        _clazz: 'Oskari.mapframework.bundle.timeseries.WMSAnimator',
        __eventHandlers: {
            'ProgressEvent': function (event) {
                if (event.getStatus() && this._layer.getId() === event.getId()) {
                    this._isLoading = false;
                    this._resolveWait();
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
        getTimes: function () {
            var times = this._layer.getAttributes().times;
            if (!Array.isArray(times)) {
                var interval = moment.duration(times.interval);
                var end = moment(times.end);
                var t = moment(times.start);
                times = [t.toISOString()];
                while (t.add(interval) < end) {
                    times.push(t.toISOString());
                }
                times.push(end.toISOString());
            }
            return times;
        },
        init: function () { },
        /**
         * @method getCurrentTime
         * Returns current selected time instant
         * @return {String} current time as ISO-string
         */
        getCurrentTime: function () {
            return this._currentTime;
        },
        /**
         * @method getSubsetRange
         * Returns current selected time range subset
         * @return {String[]} range Array with 2 elements, start & end, ISO-string
         */
        getSubsetRange: function () {
            return this._subsetRange.slice();
        },
        /**
         * @method getSubsetRange
         * Set current selected time range subset
         * @param {String[]} range Array with 2 elements, start & end, ISO-string
         */
        setSubsetRange: function (range) {
            this._subsetRange = range;
        },
        /**
         * @method requestNewTime
         * Requests change in current selected time
         * @param {String} newTime change current time to this value(ISO string)
         * @param {String} nextTime time value at next animation frame(ISO string). Can be null if not animating
         * @param {function} doneCallback callback that will be called after new time has been loaded
         */
        requestNewTime: function (newTime, nextTime, doneCallback) {
            var me = this;
            this._currentTime = newTime;
            var requestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest');
            if (requestBuilder) {
                this._isLoading = true;
                this._doneCallback = doneCallback;
                if (nextTime) {
                    this._isBuffering = true;
                    this._bufferImages(this._mapModule.getLayerTileUrls(this._layer.getId()), nextTime, function (success) {
                        me._isBuffering = false;
                        me._resolveWait();
                    });
                }
                var request = requestBuilder(this._layer.getId(), true, { "TIME": newTime });
                this._sandbox.request(this, request);
            }
        },
        /**
         * @method _bufferImages
         * @private
         * Preload tile images that will be used in next animation frame
         * @param {String[]} urls urls of tile images
         * @param {String} nextTime the time instant to request tiles for
         * @param {Function} callback is called when loading is ready or 5000 ms timeout reached
         */
        _bufferImages: function (urls, nextTime, callback) {
            var imgCount = urls.length;
            if (imgCount === 0) {
                callback(true);
                return;
            }
            var aborted = false;
            var timeout = setTimeout(function () {
                aborted = true;
                callback(false);
            }, 5000);
            urls.forEach(function (url) {
                var image = document.createElement('img');
                image.onload = function () {
                    if (aborted) {
                        return;
                    }
                    imgCount--;
                    if (imgCount === 0) {
                        clearTimeout(timeout);
                        callback(true);
                    }
                };
                image.src = url.replace(/([?&])(TIME=[^&]*)/, '$1TIME=' + encodeURIComponent(nextTime));
            });
        },
        /**
         * @method _resolveWait
         * @private
         * Check if both map layer has loaded AND next frame has buffered
         */
        _resolveWait: function () {
            if (!this._isLoading && !this._isBuffering && this._doneCallback) {
                var cb = this._doneCallback;
                this._doneCallback = null;
                cb();
            }
        },
        /**
         * @method destroy
         * Releases any event handlers and any other resources
         */
        destroy: function () {
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