/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesAnimationPlugin
 * Handles timeseries enabled layer animation
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesAnimationPlugin',
    function (mapModule) {
        this._mapModule = mapModule;
        this._lastFrameLoadTime = 0;
        this._scheduleNextTimestep = false;
        this._currentTime = null;
        this._stepInterval = 60000; // 1 minute
        this._imageBuffer = Oskari.clazz.create('Oskari.mapframework.domain.ImageBuffer');
        this._cancelBuffering = null;
        this._frameInterval = 1000;
        this._currentLayerId = null;
    }, {
        __name : 'TimeseriesAnimationPlugin',
        _clazz : 'Oskari.mapframework.bundle.timeseries.TimeseriesAnimationPlugin',
        getCurrentLayerId: function() {
            return this._currentLayerId;
        },
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
        },
        /**
         * @method advancePlayback
         * Schedule new timeseries frame if needed
         */
        advancePlayback: function () {
            var me = this;
            if (me._scheduleNextTimestep) {
                var nextStep = me._getNextTimestep(this._stepInterval);
                if (nextStep) {
                    var imagesToLoad = me._getTileUrls(nextStep);
                    var millisToTarget = this._frameInterval - Date.now() + me._lastFrameLoadTime;
                    var millisTimeout = 5000;
                    me._cancelBuffering = me._imageBuffer.loadImages(imagesToLoad, millisToTarget, Math.max(millisToTarget, millisTimeout), function (success) {
                        me._setLayerTimestep(nextStep, true);
                    });
                } else {
                    me._stopTimeseriesPlayback();
                }
            }
            me._scheduleNextTimestep = false;
        },
        /**
         * @method _getTileUrls
         * Get tile urls for given time
         * @param {String} time time as ISO-string 
         */
        _getTileUrls: function (time) {
            var OLlayers = this._mapModule.getOLMapLayers(this._currentLayerId);
            var urls = [];
            OLlayers[0].grid.forEach(function (a) {
                a.forEach(function (b) {
                    urls.push(b.url.replace(/([?&])(TIME=[^&]*)/, '$1TIME=' + encodeURIComponent(time)));
                });
            });
            return urls;
        },
        /**
         * @method _getNextTimestep
         * Get next timestep from timeseries
         * @param {Number} stepInterval time as ISO-string 
         */
        _getNextTimestep(stepInterval){
            var times = this._getLayer().getAttributes().times;
            var nextTime;
            var projection;
            if(!times) {
                Oskari.log('TimeseriesAnimationPlugin').warn('layer does not have "times" attribute');
                return;
            }
            if(!this._currentTime) {
                Oskari.log('TimeseriesAnimationPlugin').warn('current timestep not set for layer');
                return;
            }

            if(Array.isArray(times)){
                var index = times.indexOf(this._currentTime);
                if(index < 0) {
                    Oskari.log('TimeseriesAnimationPlugin').warn('current timestep not found in "times" array');
                    return;
                }
                if(index === times.length-1) {
                    Oskari.log('TimeseriesAnimationPlugin').warn('timestep would be after timeseries end, cannot advance');
                    return;
                }
                projection = moment(this._currentTime).add(stepInterval, 'milliseconds');
                index = _.sortedIndex(times, projection.toISOString()); // binary search into times to find next "time" after step interval
                if(index > times.length-1) {
                    index = times.length-1;
                }
                nextTime = times[index];
            } else {
                var interval = moment.duration(times.interval).asMilliseconds();
                var numIntervals = Math.floor(stepInterval / interval);
                if(numIntervals === 0) {
                    numIntervals = 1; // at least one timestep interval
                }

                projection = moment(this._currentTime).add(interval * numIntervals, 'milliseconds');
                if(next.isAfter(times.end)) {
                    Oskari.log('TimeseriesAnimationPlugin').warn('next timestep would be after end of series, cannot advance');
                    return;
                }
                nextTime = projection.toISOString();
            }

            return nextTime;
        },
        /**
         * @method configureTimeseriesPlayback
         * Change timeseries animation state
         * @param {String} time time to move playback head to (ISO-string)
         * @param {Boolean} playing should the animation run?
         * @param {Number} frameInterval time in milliseconds between animation frames (playback)
         * @param {Number} stepInterval time interval to skip ahead on each frame in milliseconds
         */
        configureTimeseriesPlayback(layerId, time, playing, frameInterval, stepInterval){
            this._currentLayerId = layerId;
            if(!this._getLayer().hasTimeseries()){
                Oskari.log('TimeseriesAnimationPlugin').warn('Layer does not have timeseries! Cannot start playback.');
                return;
            }
            this._stepInterval = stepInterval;
            this._frameInterval = frameInterval;
            this._setLayerTimestep(time, playing);
            if(!playing) {
                this._stopTimeseriesPlayback();
            }
        },
        /**
        * @method _resetBuffer
        * Cancel any future frame buffering that might be ongoing
        */
        _resetBuffer() {
            if(this._cancelBuffering){
                this._cancelBuffering();
                this._cancelBuffering = null;
            }
        },
        /**
        * @method _stopTimeseriesPlayback
        * Stop playback animation of timeseries layer
        */
        _stopTimeseriesPlayback() {
            this._resetBuffer();
            this._scheduleNextTimestep = false;
            this._sendTimeseriesAnimationEvent(this._currentLayerId, this._currentTime, false);
        },
        /**
        * @method _setLayerTimestep
        * Set current shown time of layer and playback state
        @param {String} time current shown time (ISO-string)
        @param {Boolean} playing should start playback?
        */
        _setLayerTimestep(time, playing){
            this._currentTime = time;
            this._lastFrameLoadTime = Date.now();
            this._scheduleNextTimestep = playing;

            this._resetBuffer();
            
            this._mapModule.handleMapLayerUpdateRequest(this._currentLayerId, true, {"TIME": time});
            this._sendTimeseriesAnimationEvent(this._currentLayerId, time, playing);
        },
        /**
         * @method sendTimeseriesAnimationEvent
         * Send event about state of layer animation
         * @param {String} layerId layerId
         * @param {String} time requested point in time
         * @param {Boolean} playing should the animation start/stop 
         */
        _sendTimeseriesAnimationEvent(layerId, time, playing) {
            var eventBuilder = Oskari.eventBuilder('TimeseriesAnimationEvent');
            var evt = eventBuilder(layerId, time, playing);
            this.getSandbox().notifyAll(evt);
        },
        _getLayer: function() {
            return this.getSandbox().findMapLayerFromSelectedMapLayers(this._currentLayerId);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);

Oskari.clazz.define('Oskari.mapframework.domain.ImageBuffer',
    function () {
        this._images = [];
        this._currentBatch = 0;
        this._timeout = null;
        this._startTime;
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
                }
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
            }
        }
    });