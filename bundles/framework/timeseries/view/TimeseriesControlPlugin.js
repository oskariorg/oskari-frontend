import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getNavigationTheme } from 'oskari-ui/theme';
import * as d3 from 'd3';
dayjs.extend(customParseFormat);

/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin
 * Provides control UI for timeseries
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} delegate component instance that timeseries UI is controlling
     * @param {Object} conf
     */
    function (delegate, conf) {
        conf = conf || {};
        const me = this;
        me._clazz = 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
        me._defaultLocation = conf.location || 'top left';
        me._index = 90;
        me._name = 'TimeseriesControlPlugin';
        me._timelineWidth = 600;
        me.loc = Oskari.getMsg.bind(null, 'timeseries');
        me._d3TimeDef = Oskari.getLocalization('timeseries').d3TimeDef;
        me._widthMargin = conf.widthMargin || 130;
        me._topMargin = conf.topMargin || 0;
        me._waitingForFrame = false;

        me._delegate = delegate;

        me._uiState = {
            times: null,
            currentTime: null,
            rangeStart: null,
            rangeEnd: null,
            isAnimating: false,
            frameInterval: 2000,
            stepInterval: 'minutes'
        };
        me._setFrameInterval(me._uiState.frameInterval); // sets throttle for animation, too
        me._throttleNewTime = Oskari.util.throttle(me._requestNewTime.bind(me), 500);
        this._uiState.times = delegate.getTimes();
        const range = delegate.getSubsetRange();
        this._uiState.rangeStart = range[0];
        this._uiState.rangeEnd = range[1];
        this._uiState.currentTime = delegate.getCurrentTime();
        this._validSkipOptions = this._filterSkipOptions(this._uiState.times);

        me._isStopped = false;
    }, {
        __fullAxisYPos: 35,
        __speedOptions: [
            { key: 'fast', value: 1000 },
            { key: 'normal', value: 2000 },
            { key: 'slow', value: 3000 }
        ],
        __skipOptions: [
            { key: 'none', value: '' },
            { key: 'minute', value: 'minutes' },
            { key: 'hour', value: 'hours' },
            { key: 'day', value: 'days' },
            { key: 'week', value: 'weeks' },
            { key: 'month', value: 'months' }
        ],
        isShouldStopForPublisher: function () {
            // prevent publisher to stop this plugin and start it again when leaving the publisher
            return false;
        },
        /**
         * @method getCurrentTimeFormatted
         * return current time in timeseries in same format as shown in timeseries control
         */
        getCurrentTimeFormatted () {
            return this.loc('dateRender', { val: new Date(this._uiState.currentTime) });
        },
        /**
         * @method getCurrentTime
         * return current time in timeseries
         */
        getCurrentTime () {
            return this._uiState.currentTime;
        },
        /**
         * Compares delegate to controls own delegate to see if it's being controlled by this plugin
         * @param {Oskari.mapframework.bundle.timeseries.TimeseriesDelegate} delegate for comparison
         * @returns {Boolean}
         */
        isControlling: function (delegate) {
            if (!delegate) {
                return false;
            }
            if (!this._delegate) {
                return false;
            }
            if (this._delegate._clazz !== delegate._clazz) {
                return false;
            }
            // we only have the WMSAnimator at this time but check that delegate is it so we can expect to find getLayer()
            if (this._delegate._clazz !== 'Oskari.mapframework.bundle.timeseries.WMSAnimator') {
                return false;
            }
            // here we can be sure that delegate and this._delegate are both WMSAnimator
            const myLayer = this._delegate.getLayer();
            const theirLayer = delegate.getLayer();
            if (!myLayer || !theirLayer) {
                return false;
            }

            return myLayer.getId() === theirLayer.getId();
        },
        /**
         * @method _filterSkipOptions Return animation skip options that are longer or as long than the shortest time interval in the series
         * @private
         * @param  {String[]} times time instants in timeseries, ISO-string
         */
        _filterSkipOptions: function (times) {
            times = times.map(function (t) { return dayjs(t); }); // optimization: parse time strings once
            let shortestInterval = Number.MAX_VALUE;
            for (let i = 0; i < times.length - 1; i++) {
                const current = times[i];
                const next = times[i + 1];
                const difference = next.diff(current);
                if (difference < shortestInterval) {
                    shortestInterval = difference;
                }
            }
            return this.__skipOptions.filter(function (option) {
                return option.value === '' || dayjs.duration(1, option.value).asMilliseconds() >= shortestInterval;
            });
        },
        /**
         * @method _setFrameInterval Sets animation frame interval & updates associated throttle function
         * @private
         * @param  {Number} interval number of milliseconds between frames
         */
        _setFrameInterval: function (interval) {
            this._uiState.frameInterval = interval;
            this._throttleAnimation = Oskari.util.throttle(this._animationStep.bind(this), interval);
        },
        /**
         * @method _requestNewTime Requests delegate to set new current time and hadles callback when done
         * @private
         */
        _requestNewTime: function () {
            const me = this;
            let nextTime = null;
            if (me._uiState.isAnimating) {
                nextTime = this._getNextTime(this._uiState.currentTime);
            }
            me._waitingForFrame = true;
            me._delegate.requestNewTime(me._uiState.currentTime, nextTime, function () {
                me._waitingForFrame = false;
                if (me._uiState.isAnimating) {
                    me._throttleAnimation();
                }
            });
        },
        /**
         * @method _setRange Set selected time subset range
         * @private
         * @param  {String} start range start, ISO-string
         * @param  {String} end range end, ISO-string
         */
        _setRange: function (start, end) {
            this._uiState.rangeStart = start;
            this._uiState.rangeEnd = end;
            this._delegate.setSubsetRange([start, end]);
        },
        /**
         * @method _animationStep Make one animation step
         * @private
         */
        _animationStep: function () {
            if (this._waitingForFrame) {
                return;
            }
            const nextTime = this._getNextTime(this._uiState.currentTime);
            if (!nextTime) {
                this._setAnimationState(false);
                return;
            }
            this._uiState.currentTime = nextTime;
            this._requestNewTime();
            this._renderHandle();
            this._updateTimeDisplay();
        },
        /**
         * @method _getNextTime Get time instant for next animation frame
         * @private
         * @param  {String} fromTime time instant from which "next" is relative to, ISO-string
         * @return {String} time, ISO-string
         */
        _getNextTime: function (fromTime) {
            let targetTime = dayjs(fromTime);
            let index;
            if (this._uiState.stepInterval) {
                targetTime = targetTime.add(1, this._uiState.stepInterval);
                index = d3.bisectLeft(this._uiState.times, targetTime.toISOString());
            } else {
                index = d3.bisectRight(this._uiState.times, targetTime.toISOString());
            }
            const endIndex = Math.max(d3.bisect(this._uiState.times, this._uiState.rangeEnd) - 1, 0);
            if (targetTime.toISOString() > this._uiState.rangeEnd) {
                return null;
            } else if (index > endIndex) {
                return null;
            }
            return this._uiState.times[index];
        },
        /**
         * @method _createControlElement Creates UI for timeseries control
         * @private
         */
        _createControlElement: function () {
            const me = this;
            this._createThematicStyling();
            const el = jQuery(
                '<div class="mapplugin timeseriescontrolplugin">' +
                '<div class="timeseries-timelines"><svg class="timeline-svg">' +
                '<g class="full-axis"></g>' +
                '<g class="full-axis-controls"><line x1="0" y1="' + me.__fullAxisYPos + '" x2="0" y2="' + me.__fullAxisYPos + '" /><circle cx="0" cy="' + me.__fullAxisYPos + '" r="8"/><circle cx="0" cy="' + me.__fullAxisYPos + '" r="8"/></g>' +
                '<g class="full-axis-brush"></g>' +
                '<g class="subset-axis"></g>' +
                '<g class="subset-bg"><rect x="-10" y="-10" width="10" height="10"/></g>' +
                '<g class="drag-handle" cursor="ew-resize"><rect x="-15" y="-15" width="30" height="30" fill-opacity="0"/><circle cx="0" cy="0" r="8"/></g>' +
                '</svg></div>' +
                '</div>');
            return el;
        },
        _createThematicStyling: function () {
            const styleId = 'timeseries_style';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.setAttribute('id', styleId);
                document.head.appendChild(styleEl);
            }

            const themeObj = this.getMapModule().getMapTheme();
            const theme = getNavigationTheme(themeObj);
            const buttonColor = theme.getButtonColor();
            const textColor = theme.getTextColor();
            const accentColor = theme.getButtonHoverColor();
            styleEl.innerHTML = `
            .mapplugin.timeseriescontrolplugin {
                white-space: nowrap;
                background-color: ${theme.getNavigationBackgroundColor()};
                flex-direction: row;
                color: ${textColor};
            }
            @media (max-width: 600px) {
                .mapplugin.timeseriescontrolplugin {
                    flex-direction: column;
                }
            }
            .mapplugin.timeseriescontrolplugin .timeseries-handle {
                background-color: ${accentColor};
                width: 15px;
                height: 100px;
                cursor: grab;
            }
            .mapplugin.timeseriescontrolplugin .timeline-svg g.full-axis-controls circle {
                stroke: ${accentColor};
                fill: ${buttonColor};
                stroke-width: 2px;
            }
            .mapplugin.timeseriescontrolplugin .timeline-svg g.full-axis-controls line {
                stroke: ${accentColor};
                stroke-width: 3px;
            }
            .timeline-svg g.drag-handle circle{
                fill: ${accentColor};
                stroke: ${buttonColor};
                stroke-width: 2px;
            }
            .timeline-svg g.subset-axis line, g.subset-axis path {
                stroke: ${textColor};
            }
            .timeline-svg g.subset-axis text, g.full-axis text {
                fill: ${textColor};
                stroke: none;
            }
            `;
        },
        /**
         * @method _getClosestTime Get closest time instant in timeseries relative to param
         * @private
         * @param  {String} time time instant, ISO-string
         * @return {String} time, ISO-string
         */
        _getClosestTime: function (time) {
            const index1 = Math.max(d3.bisectRight(this._uiState.times, time) - 1, 0);
            const index2 = index1 + 1;
            let index;
            if (index1 < this._uiState.times.length - 1 && Math.abs(dayjs(this._uiState.times[index1]).diff(time)) > Math.abs(dayjs(this._uiState.times[index2]).diff(time))) {
                index = index2;
            } else {
                index = index1;
            }
            index = this._getRangeCheckedIndex(index);
            return this._uiState.times[index];
        },
        /**
         * @method _getRangeCheckedIndex Performs uistate range check for the time index
         * @param  {Number} index uistate time index
         * @return {Number} index, rangeStart index or rangeEnd index if given index was outside the range.
         */
        _getRangeCheckedIndex: function (index) {
            const rangeStartIndex = Math.max(d3.bisectLeft(this._uiState.times, this._uiState.rangeStart), 0);
            const rangeEndIndex = Math.max(d3.bisect(this._uiState.times, this._uiState.rangeEnd) - 1, 0);
            if (index < rangeStartIndex) {
                return rangeStartIndex;
            } else if (index > rangeEndIndex) {
                return rangeEndIndex;
            }
            return index;
        },
        /**
         * @method _doSingleStep Step current time forward/back (in response to step forward/back buttons)
         * @private
         * @param  {Number} delta Number of time instant steps to move forward, negative means back
         */
        _doSingleStep: function (delta) {
            if (this.isAnimating) {
                return;
            }
            const index = d3.bisectLeft(this._uiState.times, this._uiState.currentTime);
            const newTime = this._uiState.times[index + delta];
            if (newTime && newTime >= this._uiState.rangeStart && newTime <= this._uiState.rangeEnd) {
                this._uiState.currentTime = newTime;
                this._throttleNewTime();
                this._renderHandle();
                this._updateTimeDisplay();
            }
        },
        /**
         * @method redrawUI Handle plugin UI and change it when desktop / mobile mode
         * @public
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function () {
            this.refresh();
        },

        refresh: function () {
            this.teardownUI();
            this._buildUI();
        },
        /**
         * @method _buildUI Create element and construct DOM structure
         * @private
         * @param  {Boolean} isMobile is UI in mobile mode?
         */
        _buildUI: function (isMobile = Oskari.util.isMobile()) {
            if (this._isStopped) {
                return;
            }
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            const aux = '<div class="timeseries-aux"></div>';
            const times = this._uiState.times;
            if (isMobile) {
                this._timelineWidth = 260;
                this._setRange(times[0], times[times.length - 1]);
                this._element.toggleClass('mobile', isMobile);
                this._element.append(aux);
            } else {
                this._setWidth(this.getSandbox().getMap().getWidth(), true);
                this._applyTopMargin(this._topMargin);
                this._element.prepend(aux);
                this._initMenus();
                this._makeDraggable();
            }
            this._initStepper();
            this._updateTimelines(isMobile);
            this._updateTimeDisplay();
        },
        _makeDraggable: function () {
            this._element.prepend('<div class="timeseries-handle"></div>');
            this._element.draggable({
                scroll: false,
                handle: '.timeseries-handle'
            });
        },
        /**
         * @method _setWidth Set timeline width and update them if needed
         * @private
         * @param  {Number} mapWidth width of map in px
         * @param {Boolean} suppressUpdate true if no timelines update should be done
         */
        _setWidth: function (mapWidth, suppressUpdate) {
            const targetWidth = Math.min(mapWidth - this._widthMargin, 860) - 260;
            if (!this._inMobileMode && this._timelineWidth !== targetWidth) {
                this._timelineWidth = targetWidth;
                if (!suppressUpdate) {
                    this._updateTimelines(this._inMobileMode);
                }
            }
        },
        /**
         * @method _applyTopMargin
         * @private
         *
         * @param  {number | string} topMargin Top margin for control as number representing px or css syntax using "px" or "%".
         */
        _applyTopMargin: function (topMargin) {
            if (!this._inMobileMode) {
                if (typeof topMargin === 'string') {
                    if (topMargin.indexOf('%') !== -1) {
                        const mapHeight = this.getSandbox().getMap().getHeight() || 200;
                        const percetageFromTop = topMargin.substring(0, topMargin.length - 1);
                        if (!isNaN(percetageFromTop)) {
                            const margin = mapHeight / 100 * percetageFromTop;
                            this._element.css('margin-top', margin + 'px');
                        }
                    } else {
                        this._element.css('margin-top', topMargin);
                    }
                } else if (typeof topMargin === 'number') {
                    this._element.css('margin-top', topMargin + 'px');
                }
            }
        },
        /**
         * @method _generateSelectOptions Generate localized options for <select> dropdowns
         * @private
         * @param  {String} prefix localization path prefix
         * @param  {Object[]} options key, value to localize
         * @return {Object[]} key, value that has been localized
         */
        _generateSelectOptions: function (prefix, options) {
            const me = this;
            return options.map(function (e) {
                return {
                    title: me.loc(prefix + e.key),
                    value: e.value
                };
            });
        },
        /**
         * @method _initMenus Set up dropdown menus
         * @private
         */
        _initMenus: function () {
            const me = this;
            const template = jQuery('<div class="timeseries-menus"><div class="timeseries-menus-half"></div><div class="timeseries-menus-half"></div></div>');

            const speedMenu = Oskari.clazz.create('Oskari.userinterface.component.Select');
            speedMenu.setOptions(this._generateSelectOptions('animationSpeed.', this.__speedOptions));
            speedMenu.setTitle(this.loc('label.animationSpeed'));
            speedMenu.setValue(this._uiState.frameInterval);
            speedMenu.setHandler(function (value) {
                me._setAnimationState(false);
                me._setFrameInterval(parseInt(value));
            });
            template.find('.timeseries-menus-half').first().append(speedMenu.getElement());

            const skipMenu = Oskari.clazz.create('Oskari.userinterface.component.Select');
            skipMenu.setOptions(this._generateSelectOptions('skip.', this._validSkipOptions));
            skipMenu.setTitle(this.loc('label.skipAhead'));
            skipMenu.setValue(this._uiState.stepInterval);
            skipMenu.setHandler(function (value) {
                me._uiState.stepInterval = value;
            });
            template.find('.timeseries-menus-half').last().append(skipMenu.getElement());

            this._element.find('.timeseries-aux').append(template);
        },
        /**
         * @method _initStepper Set up back/play/pause buttons & time display
         * @private
         */
        _initStepper: function () {
            const me = this;
            const template = jQuery(
                '<div class="timeseries-stepper">' +
                '<div class="timeseries-back"></div><div class="timeseries-playpause"></div><div class="timeseries-forward"></div><div class="timeseries-datetime"></div>' +
                '</div>');
            const dateTime = template.find('.timeseries-datetime');
            me._updateTimeDisplay = function () {
                const date = new Date(me._uiState.currentTime);
                const diff = date.getTimezoneOffset() * 60000;
                dateTime.text(me.loc('dateRender', { val: new Date(date.valueOf() + diff) }));
            };
            template.find('.timeseries-playpause').on('click', function (e) {
                if (me._uiState.isAnimating) {
                    me._setAnimationState(false);
                    return;
                }
                const times = me._uiState.times;
                const curIndex = Math.max(d3.bisectLeft(times, me._uiState.currentTime), 0);
                const endIndex = Math.max(d3.bisect(times, me._uiState.rangeEnd) - 1, 0);
                if (curIndex >= endIndex) {
                    me._restartAnimation();
                } else {
                    me._setAnimationState(true);
                }
            });
            template.find('.timeseries-back').on('click', this._doSingleStep.bind(this, -1));
            template.find('.timeseries-forward').on('click', this._doSingleStep.bind(this, 1));
            this._element.find('.timeseries-aux').append(template);
        },
        /**
         * @method _restartAnimation Moves the handle to the beginning of the series and starts the animation.
         */
        _restartAnimation: function () {
            const startIndex = Math.max(d3.bisectLeft(this._uiState.times, this._uiState.rangeStart), 0);
            this._updateCurrentTime(this._uiState.times[startIndex]);
            setTimeout(() => this._setAnimationState(true), this._uiState.frameInterval);
        },
        /**
         * @method _updateCurrentTime Update current time in response to user input
         * @private
         * @param  {String} newTime time instant, ISO-string
         */
        _updateCurrentTime: function (newTime) {
            newTime = this._getClosestTime(newTime);
            if (this._uiState.currentTime !== newTime) {
                this._uiState.currentTime = newTime;
                this._throttleNewTime();
            }
            this._renderHandle();
            this._updateTimeDisplay();
        },
        /**
         * @method _getTickFormatter Get formatting function for current locale
         * @private
         * @return {Function} time formatting function
         */
        _getTickFormatter: function () {
            let locale;
            let formatterFunction;
            if (this._d3TimeDef) {
                locale = d3.timeFormatLocale(this._d3TimeDef);
                formatterFunction = locale.format.bind(locale);
            } else {
                formatterFunction = d3.timeFormat.bind(d3);
            }
            const getFormatter = (date) => {
                // try to format date sensibly based on accuracy
                if (d3.timeSecond(date) < date) {
                    // milliseconds
                    return formatterFunction('.%L');
                } else if (d3.timeMinute(date) < date) {
                    // seconds
                    return formatterFunction(':%S');
                } else if (d3.timeHour(date) < date) {
                    // minutes
                    return formatterFunction(locale ? '%H:%M' : '%I:%M');
                } else if (d3.timeDay(date) < date) {
                    // hours
                    return formatterFunction(locale ? '%H:%M' : '%I %p');
                } else if (d3.timeMonth(date) < date) {
                    // days
                    return formatterFunction(locale ? '%d.%m.' : '%d %b');
                } else if (d3.timeYear(date) < date) {
                    // months
                    return formatterFunction('%b');
                }
                // default to years
                return formatterFunction('%Y');
            };
            return function multiFormat (date) {
                const textEl = d3.select(this);
                textEl.classed('bold', true);
                const formatFn = getFormatter(date);
                return formatFn(date);
            };
        },
        /**
         * @method _updateTimelines Update timelines SVG
         * @private
         * @param  {Boolean} isMobile is in mobile mode?
         */
        _updateTimelines: function (isMobile) {
            const me = this;
            const margin = { left: 15, right: 15 };
            const tickFormatter = me._getTickFormatter();
            const tickCount = me._timelineWidth / 60;
            const svg = d3.select(this._element.find('.timeline-svg').get(0));
            svg
                .attr('viewBox', isMobile ? '0 50 ' + this._timelineWidth + ' 50' : null)
                .attr('width', this._timelineWidth)
                .attr('height', isMobile ? 50 : 100);

            const times = this._uiState.times;
            const scaleFull = d3.scaleTime()
                .domain([new Date(times[0]), new Date(times[times.length - 1])])
                .range([margin.left, this._timelineWidth - margin.right]);

            const scaleSubset = d3.scaleTime()
                .domain([new Date(this._uiState.rangeStart), new Date(this._uiState.rangeEnd)])
                .range([margin.left, this._timelineWidth - margin.right]);

            const axisFull = d3.axisTop(scaleFull)
                .ticks(tickCount)
                .tickPadding(7)
                .tickFormat(tickFormatter);
            svg.select('.full-axis')
                .attr('transform', 'translate(0,' + me.__fullAxisYPos + ')')
                .call(axisFull);

            const axisSubset = d3.axisTop(scaleSubset)
                .ticks(tickCount)
                .tickPadding(7)
                .tickFormat(tickFormatter);
            svg.select('.subset-axis')
                .attr('transform', 'translate(0,80)')
                .call(axisSubset);

            const handle = svg.select('g.drag-handle')
                .attr('transform', 'translate(' + scaleSubset(new Date(this._uiState.currentTime)) + ',80)')
                .on('.drag', null); // remove old event handlers

            function renderHandle () {
                const newX = scaleSubset(new Date(me._uiState.currentTime));
                handle.attr('transform', 'translate(' + newX + ',80)');
            }
            me._renderHandle = renderHandle;

            function timeFromMouse (newX) {
                const scaleRange = scaleSubset.range();
                if (newX > scaleRange[1]) {
                    newX = scaleRange[1];
                }
                if (newX < scaleRange[0]) {
                    newX = scaleRange[0];
                }
                me._updateCurrentTime(scaleSubset.invert(newX).toISOString());
            }

            function updateFullAxisControls () {
                const range = scaleSubset.domain().map(scaleFull);
                svg.selectAll('.full-axis-controls circle').each(function (d, i) {
                    d3.select(this).attr('cx', range[i]);
                });
                svg.select('.full-axis-controls line')
                    .attr('x1', range[0])
                    .attr('x2', range[1]);
            }

            svg.select('.subset-bg rect')
                .attr('fill', 'rgba(255,255,255,0.01)')
                .attr('x', margin.left)
                .attr('y', 50)
                .attr('width', this._timelineWidth - margin.left - margin.right)
                .attr('height', 50)
                .on('click', null) // remove old event handlers
                .on('click', function (e) {
                    const newX = d3.pointer(e)[0];
                    timeFromMouse(newX);
                });

            const dragBehavior = d3.drag()
                .subject(function (e) {
                    return { x: scaleSubset(new Date(me._uiState.currentTime)), y: e.y };
                })
                .on('drag', function (e) {
                    const newX = e.x;
                    timeFromMouse(newX);
                });

            handle.call(dragBehavior);

            if (!isMobile) {
                const brush = d3.brushX()
                    .extent([[margin.left, 0], [this._timelineWidth - margin.right, 50]])
                    .handleSize(40)
                    .on('.brush', null) // remove old event handlers
                    .on('brush', brushed);

                svg.select('.full-axis-brush')
                    .call(brush)
                    .call(brush.move, [scaleFull(new Date(this._uiState.rangeStart)), scaleFull(new Date(this._uiState.rangeEnd))])
                    .select('.selection')
                    .attr('stroke', null)
                    .attr('fill-opacity', 0);

                updateFullAxisControls();
            }

            function brushed (e) {
                const selection = e.selection;
                const inverted = selection.map(function (e) { return scaleFull.invert(e).toISOString(); });
                scaleSubset.domain(inverted.map(function (t) { return new Date(me._getClosestTime(t)); }));
                svg.select('.subset-axis').call(axisSubset);

                let changedTime = me._uiState.currentTime;
                if (inverted[0] > me._uiState.currentTime) {
                    changedTime = inverted[0];
                }
                if (inverted[1] < me._uiState.currentTime) {
                    changedTime = inverted[1];
                }
                me._setRange(inverted[0], inverted[1]);
                me._updateCurrentTime(changedTime);
                updateFullAxisControls();
            }
        },
        /**
         * @method teardownUI Remove control element from DOM
         * @private
         */
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
        },
        /**
         * @method _setAnimationState Set animating / not animating state
         * @private
         * @param  {Boolean} shouldAnimate should the timeseries be animating?
         */
        _setAnimationState: function (shouldAnimate) {
            this._element.find('.timeseries-playpause').toggleClass('pause', shouldAnimate);
            this._element.find('.timeseries-back, .timeseries-forward').toggleClass('disabled', shouldAnimate);
            if (shouldAnimate !== this._uiState.isAnimating) {
                this._uiState.isAnimating = shouldAnimate;
                if (shouldAnimate) {
                    this._throttleAnimation();
                }
            }
        },
        /**
         * @method _createEventHandlers Set up event handlers
         * @private
         */
        _createEventHandlers: function () {
            return {
                'MapSizeChangedEvent': function (evt) {
                    this._setWidth(evt.getWidth());
                },
                'Toolbar.ToolSelectedEvent': function (evt) {
                    if (evt.getGroupId() === 'mobileToolbar-mobile-toolbar' && evt.getToolId() !== 'mobile-timeseries' && event.getSticky()) {
                        this.teardownUI();
                    }
                }
            };
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this._isStopped = true;
            if (this._element) {
                this._setAnimationState(false);
                this.removeFromPluginContainer(this.getElement());
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
