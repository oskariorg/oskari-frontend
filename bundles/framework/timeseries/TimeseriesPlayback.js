/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesPlayback
 *
 * Handles timeseries playback functionality.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.timeseries.TimeseriesPlayback",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.routingUI.RoutingUIBundleInstance} instance
     */

    function (instance, conf, locale, mapmodule, sandbox) {
        this._TIMESERIES_INDEX = 'data-index';

        this.instance = instance;
        this.sandbox = sandbox;
        this.loc = locale;
        this.mapmodule = mapmodule;
        conf = conf || {};
        this.conf = conf;
        this.template = {};
        this._isPlaying = false;

        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
        this._control = null;

        this._playbackSlider = {
            times: [],
            differentDates: [],
            currentDate: null,
            currentDateIntervals: 0,
            hours: [],
            intervalCount: 0
        };
        this._isPopupMove = false;
        this._selectedLayerId = null;
        this._dimensionName = null;
    }, {

        __templates: {
            'control': jQuery('<div class="mapplugin timeseries">'+
                        '<div class="playback-button">'+
                            '<button class="play" name="play"></button>'+
                        '</div>'+
                        '<div class="playback-button">'+
                            '<button class="pause" name="pause"></button>'+
                        '</div>'+
                        '<div class="oskari-timeslider-empty">&nbsp;</div>'+
                        '<div class="oskari-timeslider"></div>'+
                    '</div>'+
                    '<div class="mapplugin-timeseries-popup">'+
                        '<div class="arrow"></div>'+
                        '<div class="content"></div>'+
                    '</div>'),
            'intervalLineHighlight': '<div class="interval-line-highlight"><div class="label"></div><div class="line"></div></div>',
            'intervalLine': '<div class="interval-line"><div class="label"></div><div class="line"></div></div>'
        },
        /**
         * @method @public showSlider
         *
         * @param {String|Integer} layerId layer id to animate
         * @param {Object|Array} times times object {start:null,end:null,interval:null} or array
         * @param {Boolean} autoPlay if true, start playing other false
         * @param {String} dimensionName dimension name
         * @param {String} units units format
         */
        showSlider: function (layerId, times, autoPlay, dimensionName, units) {
            var me = this;
            var layer = me.sandbox.findMapLayerFromSelectedMapLayers(layerId);

            var isLayer = (layerId && layer) ? true : false;
            var isTimes = (times || (Array.isArray(times) && times.length>0)) ? true : false;

            // Supported only now ISO8601 units format
            if(!isLayer && !isTimes && !dimensionName && 'ISO8601' !== units) {
                return;
            }

            me._selectedLayerId = layerId;
            me._dimensionName = dimensionName;

            if(me._control === null) {
                me._control = this.template.control.clone();
                //only set the event handlers the first time the control is created.
                me._setSliderHandlers();
                jQuery(me.mapmodule.getMapEl()).append(me._control);
            }

            me._resetPlaybackSliderVariables();
            me._calculateIntervals(times);
            me._control.filter('.mapplugin-timeseries-popup').attr(me._TIMESERIES_INDEX, 0);
            me._calculatePopupPosition();
            me._addDayLines();
            me._addInternalLines();

            if(autoPlay) {
                me._startPlayback();
            }

        },
        /**
         * @method  @public removeSlider remove slider
         */
        removeSlider: function(){
            var me = this;
            if(me._control) {
                me._stopPlayback();
                me._control.remove();
                me._control = null;
                me._resetPlaybackSliderVariables();
                me._selectedLayerId = null;
            }

        },
        /**
         * @method  @private checkDifferentDates check different dates
         * @param  {Object} newDate new date
         */
        _checkDifferentDates: function(newDate){
            var me = this;
            if(me._playbackSlider.currentDate === newDate.format('DD.MM.YYYY')) {
                me._playbackSlider.currentDateIntervals++;
            } else {
                me._playbackSlider.differentDates.push({
                    date: me._playbackSlider.currentDate,
                    intervals: me._playbackSlider.currentDateIntervals
                });

                me._playbackSlider.currentDateIntervals = 1;
                me._playbackSlider.currentDate = newDate.format('DD.MM.YYYY');
            }
        },
        /**
         * @method  @private _checkHours check hours
         * @param  {Object} date     checked date
         * @param  {Integer} interval interval count
         */
        _checkHours: function(date, interval) {
            var me = this;
            if(date.millisecond() === 0 && date.second() === 0 && date.minute() === 0) {
                me._playbackSlider.hours.push({
                    value: date.format('HH:mm'),
                    intervals: interval
                });
            }
        },
        /**
         * @method  @private _resetPlaybackSliderVariables reset playback variables
         */
        _resetPlaybackSliderVariables: function() {
            var me = this;
            me._playbackSlider = {
                times: [],
                differentDates: [],
                currentDate: null,
                currentDateIntervals: 0,
                hours: [],
                intervalCount: 0
            };
        },
        /**
         * @method  @private _calculateIntervals calculate time inervals
         * @param  {Array} times times array
         */
        _calculateIntervals: function(times){
            var me = this;
            var startDate;
            var newDate;

            // Times variable is object
            if('object' === typeof times && !Array.isArray(times)) {
                var interval = moment.duration(times.interval);

                // start
                startDate = moment(times.start);
                me._playbackSlider.currentDate = startDate.format('DD.MM.YYYY');
                me._playbackSlider.times.push({
                    time: startDate.format('HH:mm'),
                    value: startDate.toISOString(),
                    date: startDate.format('DD.MM.YYYY')
                });
                me._playbackSlider.currentDateIntervals++;
                me._checkHours(startDate, me._playbackSlider.intervalCount);

                // End
                var endDate = moment(times.end);
                var loop = true;

                while(loop) {
                    me._playbackSlider.intervalCount++;
                    var lastDate = moment(me._playbackSlider.times[me._playbackSlider.times.length-1].value);
                    newDate = lastDate.add(interval);

                    if(newDate<=endDate) {
                        me._playbackSlider.times.push({
                            time: newDate.format('HH:mm'),
                            value: newDate.toISOString(),
                            date: newDate.format('DD.MM.YYYY')
                        });
                        me._checkHours(newDate, me._playbackSlider.intervalCount);
                    } else {
                        loop = false;
                    }

                    me._checkDifferentDates(newDate);

                    // If loop coun is over than 1000 then stop it
                    if(me._playbackSlider.intervalCount>1000) {
                        loop = false;
                    }
                }

                // Fix different dates if different dates length is 0 or last data is different as current date
                if(me._playbackSlider.differentDates.length === 0 ||
                    me._playbackSlider.currentDate !== me._playbackSlider.differentDates[me._playbackSlider.differentDates.length-1].date) {
                    me._playbackSlider.differentDates.push({
                        date: me._playbackSlider.currentDate,
                        intervals: me._playbackSlider.currentDateIntervals
                    });
                }
            }
            // Times variable is array
            else if(Array.isArray(times)) {
                startDate = moment(times[0]);
                me._playbackSlider.currentDate = startDate.format('DD.MM.YYYY');

                for(var i=0;i<times.length;i++) {
                    newDate = moment(times[i]);

                    me._playbackSlider.times.push({
                        time: newDate.format('HH:mm'),
                        value: newDate.toISOString(),
                        date: newDate.format('DD.MM.YYYY')
                    });
                    me._checkDifferentDates(newDate);
                    me._checkHours(newDate, i);
                }
                // Add last values
                me._playbackSlider.differentDates.push({
                    date: newDate.format('DD.MM.YYYY'),
                    intervals: me._playbackSlider.currentDateIntervals
                });
                if(me._playbackSlider.differentDates.length === 0){
                    me._playbackSlider.differentDates.push({
                        date: me._playbackSlider.currentDate,
                        intervals: me._playbackSlider.currentDateIntervals
                    });
                }
            }
        },
        /**
         * @method  @private _startPlayback start playback
         */
        _startPlayback: function(){
            var me = this;
            me._control.find('.playback-button .play').hide();
            me._control.find('.playback-button .pause').show();
            me._isPlaying = true;
            me._requestPlayback();
        },
        /**
         * @method  _stopPlayback stop playback
         */
        _stopPlayback: function(){
            var me = this;
            me._control.find('.playback-button .pause').hide();
            me._control.find('.playback-button .play').show();
            me._isPlaying = false;
            me._requestPlayback();
        },
        /**
         * @method  @private _setSliderHandlers set button handlers
         */
        _setSliderHandlers: function(){
            var me = this;

            // Play button
            me._control.find('.playback-button .play').click(function(evt){
                evt.preventDefault();
                me._startPlayback();
            });

            // Pause button
            me._control.find('.playback-button .pause').click(function(evt){
                evt.preventDefault();
                me._stopPlayback();
            });


            // Slider click
            me._control.find('.oskari-timeslider').mouseup(function(e) {
                me._moveSlider(e);
            });

            // Slider popup drag
            me._control.filter('.mapplugin-timeseries-popup').mousedown(function(){
                me._isPopupMove = true;
            }).mouseleave(function(){
                me._isPopupMove = false;
            }).mousemove(function(e){
                if(me._isPopupMove) {
                    me._moveSlider(e);
                }
            }).mouseup(function(){
                me._isPopupMove = false;
            });
        },
        /**
         * @method  @private _calculatePopupPosition calculate popup position
         */
        _calculatePopupPosition: function(){
            var me = this;
            if(!me._control) {
                return;
            }
            var popup = me._control.filter('.mapplugin-timeseries-popup');

            var timeSlider = me._control.find('.oskari-timeslider');
            var timeSliderPosition = timeSlider.position();
            var sliderWidth = timeSlider.width();
            var sliderHeight = timeSlider.height();
            var popupIndex = parseInt(popup.attr(me._TIMESERIES_INDEX));
            if(isNaN(popupIndex)){
                return;
            }
            popup.hide();
            popup.find('.content').html('<div>' + me._playbackSlider.times[popupIndex].time + '</div><div>' + me._playbackSlider.times[popupIndex].date + '</div>');

            var leftPopup = (sliderWidth / (me._playbackSlider.times.length - 1)) * (popupIndex) + timeSliderPosition.left - popup.width()/2 + me._control.find('.playback-button button').width() +1;

            var topPopup = sliderHeight + timeSliderPosition.top + 10;
            popup.css('left', leftPopup + 'px');
            popup.css('top', topPopup + 'px');
            popup.show();
        },
        /**
         * @method  @private _requestPlayback request timeseries animation playback from layer
         * @param  {Boolean} shouldPlay start or continue playing (animation)
         */
        _requestPlayback: function(){
            var me = this;
            var popup = me._control.filter('.mapplugin-timeseries-popup');
            var popupIndex = parseInt(popup.attr(me._TIMESERIES_INDEX));
            if(isNaN(popupIndex)){
                return;
            }
            var time = me._playbackSlider.times[popupIndex].value
            var playbackRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerPlaybackRequest');
            var playbackRequest;

            playbackRequest = playbackRequestBuilder(this._selectedLayerId, time, me._isPlaying);
            me.sandbox.request(this.instance, playbackRequest);
        },
        /**
         * @method  @private _addDayLines add day lines to slider
         */
        _addDayLines: function() {
            var me = this;
            // If there is only one day then not add dayline
            if(me._playbackSlider.differentDates.length <= 1) {
                return;
            }
            var timeSlider = me._control.find('.oskari-timeslider');
            var timeSliderPosition = timeSlider.position();
            var sliderHeight = timeSlider.height();
            var sliderWidth = timeSlider.width();
            timeSlider.find('.interval-line-highlight').remove();
            var pixelsPerTimeSerie = sliderWidth / me._playbackSlider.times.length;

            var top = timeSliderPosition.top + 10;
            var prevLeft = timeSliderPosition.left;
            var labelPadding = 5;

            for(var i=0;i<me._playbackSlider.differentDates.length;i++) {
                var currentDate = me._playbackSlider.differentDates[i];
                var dayLine = me.template.intervalLineHighlight.clone();
                var label = dayLine.find('.label');
                label.html(currentDate.date);
                if(i>0) {
                    label.addClass('center');
                }
                dayLine.css('left', prevLeft + 'px' );
                prevLeft = (currentDate.intervals * pixelsPerTimeSerie + prevLeft);
                timeSlider.append(dayLine);
                var topPosition = top + sliderHeight - dayLine.height();
                dayLine.css('top', topPosition + 'px');

                if(label.width() + labelPadding > pixelsPerTimeSerie) {
                    jQuery('.interval-line-highlight').remove();
                    break;
                }
            }
        },
        /**
         * @method  @private _addInternalLines add internal lines
         */
        _addInternalLines: function(){
            var me = this;
            // If there is only one one hour then not add internal lines
            if(me._playbackSlider.hours.length <= 1) {
                return;
            }
            var timeSlider = me._control.find('.oskari-timeslider');
            var timeSliderPosition = timeSlider.position();
            var sliderHeight = timeSlider.height();

            var sliderWidth = timeSlider.width();
            timeSlider.find('.interval-line').remove();
            var pixelsPerTimeSerie = sliderWidth / (me._playbackSlider.times.length-1);

            var top = timeSliderPosition.top + 10;
            var sliderLeft = timeSliderPosition.left;
            var pixelsPerHourSerie = sliderWidth / me._playbackSlider.hours.length;

            var labelPadding = 5;

            for(var i=0;i<me._playbackSlider.hours.length;i++) {
                var currentHour = me._playbackSlider.hours[i];
                /*if(currentHour.value === '00:00') {
                    continue;
                }*/
                var intervals = currentHour.intervals;
                var left = (intervals * pixelsPerTimeSerie + sliderLeft);
                var intervalLine = me.template.intervalLine.clone();
                var label = intervalLine.find('.label');
                label.html(currentHour.value);
                if(i>0) {
                    label.addClass('center');
                }
                intervalLine.css('left', left + 'px' );
                timeSlider.append(intervalLine);
                var topPosition = top + sliderHeight - intervalLine.height();
                intervalLine.css('top', topPosition + 'px');

                if(label.width() + labelPadding > pixelsPerHourSerie) {
                    jQuery('.interval-line').find('.label').remove();
                }
            }
        },
        /**
         * @method  @private _moveSlider move slider
         * @param  {Object} e jQuery event
         */
        _moveSlider: function(e){
            var me = this;
            var timeSlider = me._control.find('.oskari-timeslider');
            var sliderWidth = timeSlider.width();
            var position = me._getXY(e,timeSlider[0]);
            var timeSeriesPopup = me._control.filter('.mapplugin-timeseries-popup');
            var pixelsPerTimeSerie = sliderWidth / (me._playbackSlider.times.length-1);
            var index = parseInt(position.x/pixelsPerTimeSerie);
            var prevIndex = timeSeriesPopup.attr(me._TIMESERIES_INDEX);
            if(!isNaN(index) && index >= 0 && index < me._playbackSlider.times.length && prevIndex != index) {
                timeSeriesPopup.attr(me._TIMESERIES_INDEX, index);
                me._calculatePopupPosition();
                me._requestPlayback();
            }
        },
        /**
         * @method  @public handleMapSizeChanged handle map size changed
         */
        handleMapSizeChanged: function(){
            var me = this;
            me._addDayLines();
            me._addInternalLines();
        },
        /**
         * @method  @private _getXY get xy pixels from clicked element
         * @param  {Object} evt event
         * @param  {Object} element clicked element
         * @return {Object} {x:1,y:2}
         */
        _getXY: function(evt, element) {
            var rect = element.getBoundingClientRect();
            var scrollTop = document.documentElement.scrollTop?
                            document.documentElement.scrollTop:document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft?
                            document.documentElement.scrollLeft:document.body.scrollLeft;
            var elementLeft = rect.left+scrollLeft;
            var elementTop = rect.top+scrollTop;

            x = evt.pageX-elementLeft;
            y = evt.pageY-elementTop;

            return {x:x, y:y};
        },
        getControl: function() {
            return this._control;
        },
        getSelectedLayerId: function() {
            return this._selectedLayerId;
        }
});
