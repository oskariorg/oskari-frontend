/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin
 * Provides control UI for timeseries
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} delegate
     *      Object that has all the answers
     */
    function (delegate, conf) {
        conf = conf || {};
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
        me._defaultLocation = conf.location || 'bottom center';
        me._index = 90;
        me._name = 'TimeseriesControlPlugin';
        me._timelineWidth = 600;
        me.loc = Oskari.getMsg.bind(null, 'timeseries');
        me._sideMargin = conf.sideMargin || 10;
        me._waitingForFrame = false;

        me._delegate = delegate;

        me._uiState = {
            times: null,
            currentTime: null,
            rangeStart: null,
            rangeEnd: null,
            isAnimating: false,
            frameInterval: 1000,
            stepInterval: 'minutes'
        };
        me._setFrameInterval(me._uiState.frameInterval); // sets throttle for animation, too
        me._throttleNewTime = me._throttle(me._requestNewTime.bind(me), 500);

        this._uiState.times = delegate.getTimes();
        var range = delegate.getSubsetRange();
        this._uiState.rangeStart = range[0];
        this._uiState.rangeEnd = range[1];
        this._uiState.currentTime = delegate.getCurrentTime();

        me._isMobileVisible = false;
        me._inMobileMode = false;

        me._mobileDefs = {
            buttons: {
                'mobile-timeseries': {
                    iconCls: 'mobile-timeseries',
                    tooltip: '',
                    sticky: true,
                    toggleChangeIcon: true,
                    show: true,
                    callback: function () {
                        if(me._isMobileVisible) {
                            me.teardownUI();
                        } else {
                            me._isMobileVisible = true;
                            me._buildUI(true);
                            me.getSandbox().getService('Oskari.userinterface.component.PopupService').closeAllPopups(false);
                        }
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        __fullAxisYPos: 35,
        __localeData: {
            fi: {
                "dateTime": "%A, %-d. %Bta %Y klo %X",
                "date": "%-d.%-m.%Y",
                "time": "%H:%M:%S",
                "periods": ["a.m.", "p.m."],
                "days": ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
                "shortDays": ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
                "months": ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
                "shortMonths": ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"]
            },
            sv: {
                "dateTime": "%A den %d %B %Y %X",
                "date": "%Y-%m-%d",
                "time": "%H:%M:%S",
                "periods": ["fm", "em"],
                "days": ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
                "shortDays": ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
                "months": ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
                "shortMonths": ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
            }
        },

        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time. Normally, the throttled function will run
        // as much as it can, without ever going more than once per `wait` duration;
        // but if you'd like to disable the execution on the leading edge, pass
        // `{leading: false}`. To disable execution on the trailing edge, ditto.
        _throttle: function (func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = Date.now();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        _setFrameInterval: function(interval) {
            this._uiState.frameInterval = interval;
            this._throttleAnimation = this._throttle(this._animationStep.bind(this), interval);
        },
        _requestNewTime: function() {
            var me = this;
            var index = d3.bisectLeft(this._uiState.times, this._uiState.currentTime) +1;
            var nextTime = null;
            if(me._uiState.isAnimating) {
                nextTime = this._getNextTime(this._uiState.currentTime);
            }
            me._waitingForFrame = true;
            me._delegate.requestNewTime(me._uiState.currentTime, nextTime, function(){
                me._waitingForFrame = false;
                if(me._uiState.isAnimating) {
                    me._throttleAnimation();
                }
            });
        },
        _setRange: function(start, end){
            this._uiState.rangeStart = start;
            this._uiState.rangeEnd = end;
            this._delegate.setSubsetRange([start, end]);
        },
        _animationStep: function() {
            if(this._waitingForFrame) {
                return;
            }
            var nextTime = this._getNextTime(this._uiState.currentTime);

            if(!nextTime){
                var index = Math.max(d3.bisectLeft(this._uiState.times, this._uiState.rangeEnd)-1, 0);
                nextTime = this._uiState.times[index];
                this._setAnmationState(false);
            }
            
            if(this._uiState.currentTime !== nextTime) {
                this._uiState.currentTime = nextTime;
                this._requestNewTime();
                this._renderHandle();
                this._updateTimeDisplay();
            }
        },
        _getNextTime(fromTime){
            var targetTime = moment(fromTime);
            var index;
            if(this._uiState.stepInterval) {
                targetTime.add(1, this._uiState.stepInterval);
                index = d3.bisectLeft(this._uiState.times, targetTime.toISOString());
            } else {
                index = d3.bisectRight(this._uiState.times, targetTime.toISOString());
            }
            if(targetTime.toISOString() > this._uiState.rangeEnd) {
                return null;
                
            } else if(index >= this._uiState.times.length-1) {
                return null;
            }
            return this._uiState.times[index];
        },
        /**
         * @method _createControlElement
         * @private
         * Creates UI for timeseries control
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me.getSandbox(),
                el = jQuery(
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
        _getClosestTime: function (time){
            var index1 = Math.max(d3.bisectRight(this._uiState.times, time)-1, 0);
            var index2 = index1 + 1;
            var index;
            if(index1 < this._uiState.times.length - 1 && Math.abs(moment(this._uiState.times[index1]).diff(time)) > Math.abs(moment(this._uiState.times[index2]).diff(time))) {
                index = index2;
            } else {
                index = index1;
            }
            return this._uiState.times[index];
        },
        _doSingleStep: function(delta) {
            if(this.isAnimating) {
                return;
            }
            var index = d3.bisectLeft(this._uiState.times, this._uiState.currentTime);
            var newTime = this._uiState.times[index + delta];
            if(newTime && newTime > this._uiState.rangeStart &&  newTime < this._uiState.rangeEnd) {
                this._uiState.currentTime = newTime;
                this._throttleNewTime();
                this._renderHandle();
                this._updateTimeDisplay();
            }
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            me._inMobileMode = mapInMobileMode;

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            }
            if(!mapInMobileMode) {
                me._buildUI(mapInMobileMode);
            }
        },
        _buildUI: function(isMobile) {
            var me = this;
            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
            var aux = '<div class="timeseries-aux"></div>';
            var times = me._uiState.times;
            if(isMobile) {
                me._timelineWidth = 260;
                me._setRange(times[0], times[times.length-1]);
                me._element.toggleClass('mobile', isMobile);
                me._element.append(aux);
            } else {
                me._setWidth(me.getSandbox().getMap().getWidth(), true);
                me._element.prepend(aux);
                me._initMenus();
            }
            me._initStepper();
            me._updateTimelines(isMobile);
            me._updateTimeDisplay();
        },
        _setWidth: function(mapWidth, suppressUpdate) {
            var targetWidth = Math.min(mapWidth - this._sideMargin, 860) - 260 ;
            if(!this._inMobileMode && this._timelineWidth !== targetWidth) {
                this._timelineWidth = targetWidth;
                if(!suppressUpdate) {
                    this._updateTimelines(this._inMobileMode);
                }
            }
        },
        _generateSelectOptions: function(prefix, options){
            var me = this;
            return options.map(function(e) {
                return {
                    title: me.loc(prefix + e.key),
                    value: e.value
                }
            });
        },
        _initMenus: function() {
            var me = this;
            var template = jQuery('<div class="timeseries-menus"><div class="timeseries-menus-half"></div><div class="timeseries-menus-half"></div></div>');

            var speedMenu = Oskari.clazz.create('Oskari.userinterface.component.Select');
            speedMenu.setOptions(this._generateSelectOptions('animationSpeed.', [
                {key: 'fast', value: 1000},
                {key: 'normal', value: 2000},
                {key: 'slow', value: 3000}
            ]));
            speedMenu.setTitle(this.loc('label.animationSpeed'));
            speedMenu.setValue(this._uiState.frameInterval);
            speedMenu.setHandler(function(value) {
                me._setAnmationState(false);
                me._setFrameInterval(parseInt(value));
            });
            template.find('.timeseries-menus-half').first().append(speedMenu.getElement());

            var skipMenu = Oskari.clazz.create('Oskari.userinterface.component.Select');
            skipMenu.setOptions(this._generateSelectOptions('skip.', [
                {key: 'none', value: ''},
                {key: 'minute', value: 'minutes'},
                {key: 'hour', value: 'hours'},
                {key: 'day', value: 'days'},
                {key: 'week', value: 'weeks'},
                {key: 'month', value: 'months'}
            ]));
            skipMenu.setTitle(this.loc('label.skipAhead'));
            skipMenu.setValue(this._uiState.stepInterval);
            skipMenu.setHandler(function(value) {
                me._uiState.stepInterval = value;
            });
            template.find('.timeseries-menus-half').last().append(skipMenu.getElement());

            this._element.find('.timeseries-aux').append(template);
        },
        _initStepper: function() {
            var me = this;
            var template = jQuery(
                '<div class="timeseries-stepper">' +
                    '<div class="timeseries-back"></div><div class="timeseries-playpause"></div><div class="timeseries-forward"></div><div class="timeseries-datetime"></div>' +
                '</div>');
            var dateTimeInput = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
            dateTimeInput.setName('datetime');
            dateTimeInput.setEnabled(false);
            me._updateTimeDisplay = function() {
                dateTimeInput.setValue(me.loc('dateRender', {val: new Date(me._uiState.currentTime)}));
            },
            template.find('.timeseries-datetime').append(dateTimeInput.getElement());
            template.find('.timeseries-playpause').on('click', function(e){
                me._setAnmationState(!me._uiState.isAnimating);
            });
            template.find('.timeseries-back').on('click', this._doSingleStep.bind(this, -1));
            template.find('.timeseries-forward').on('click', this._doSingleStep.bind(this, 1));
            this._element.find('.timeseries-aux').append(template);
        },
        _updateCurrentTime: function(newTime) {
            newTime = this._getClosestTime(newTime);
            if(this._uiState.currentTime !== newTime){
                this._uiState.currentTime = newTime;
                this._throttleNewTime();
            }
            this._renderHandle();
            this._updateTimeDisplay();
        },
        _getTickFormatter: function() {
            var localeString = Oskari.getLang();
            var locale;
            var formatterFunction;
            if(this.__localeData[localeString]){
                locale = d3.timeFormatLocale(this.__localeData[localeString]);
                formatterFunction = locale.format.bind(locale);
            } else {
                formatterFunction = d3.timeFormat.bind(d3);
            }
            var formatMillisecond = formatterFunction(".%L"),
                formatSecond = formatterFunction(":%S"),
                formatMinute = formatterFunction(locale ? "%H:%M" : "%I:%M"),
                formatHour = formatterFunction(locale ? "%H:%M" : "%I %p"),
                formatDay = formatterFunction(locale ? "%d.%m." : "%d %b")
                formatYear = formatterFunction("%Y");

            return function multiFormat(date) {
                return (d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                : d3.timeHour(date) < date ? formatMinute
                : d3.timeDay(date) < date ? formatHour
                : d3.timeMonth(date) < date ? formatDay
                : formatYear)(date);
            }
        },
        _updateTimelines: function(isMobile) {
            var me = this;
            var margin = {left: 15, right: 15}
            var tickFormatter = me._getTickFormatter();
            var tickCount = me._timelineWidth / 60;
            var svg = d3.select(this._element.find('.timeline-svg').get(0));
            svg 
                .attr('viewBox', isMobile ? '0 50 ' + this._timelineWidth + ' 50' : null)
                .attr('width', this._timelineWidth)
                .attr('height', isMobile ? 50 : 100);

            var times = this._uiState.times;
            var scaleFull = d3.scaleTime()
                .domain([new Date(times[0]), new Date(times[times.length-1])])
                .range([margin.left, this._timelineWidth - margin.right]);

            var scaleSubset = d3.scaleTime()
                .domain([new Date(this._uiState.rangeStart), new Date(this._uiState.rangeEnd)])
                .range([margin.left, this._timelineWidth - margin.right]);

            var axisFull = d3.axisTop(scaleFull)
                .ticks(tickCount)
                .tickPadding(7)
                .tickFormat(tickFormatter);
            svg.select('.full-axis')
                .attr('transform', 'translate(0,' + me.__fullAxisYPos + ')')
                .call(axisFull);

            var axisSubset = d3.axisTop(scaleSubset)
                .ticks(tickCount)
                .tickPadding(7)
                .tickFormat(tickFormatter);
            svg.select('.subset-axis')
                .attr('transform', 'translate(0,80)')
                .call(axisSubset);

            var handle = svg.select('g.drag-handle')
                .attr('transform', 'translate('+ scaleSubset(new Date(this._uiState.currentTime)) +',80)')
                .on(".drag", null); // remove old event handlers


            function renderHandle(){
                var newX = scaleSubset(new Date(me._uiState.currentTime));
                handle.attr('transform', 'translate('+ newX +',80)');
            }
            me._renderHandle = renderHandle;

            function timeFromMouse(newX) {
                var scaleRange = scaleSubset.range();
                if(newX > scaleRange[1]) {
                    newX = scaleRange[1];
                }
                if(newX < scaleRange[0]) {
                    newX = scaleRange[0];
                }
                me._updateCurrentTime(scaleSubset.invert(newX).toISOString());
            }

            function updateFullAxisControls() {
                var range = scaleSubset.domain().map(scaleFull);
                svg.selectAll('.full-axis-controls circle').each(function(d, i) {
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
                .on('click', function(e) {
                    var newX = d3.mouse(this)[0];
                    timeFromMouse(newX);
                }); 
            
            var dragBehavior = d3.drag()
                .subject(function (d) {
                    return { x: scaleSubset(new Date(me._uiState.currentTime)), y: d3.event.y };
                })
                .on('drag', function () {
                    var newX = d3.event.x;
                    timeFromMouse(newX);
                });

            handle.call(dragBehavior);
            
            if(!isMobile) {
                var brush = d3.brushX()
                    .extent([[margin.left, 0], [this._timelineWidth - margin.right, 50]])
                    .handleSize(40)
                    .on(".brush", null) // remove old event handlers
                    .on('brush', brushed);

                svg.select('.full-axis-brush')
                    .call(brush)
                    .call(brush.move, [scaleFull(new Date(this._uiState.rangeStart)), scaleFull(new Date(this._uiState.rangeEnd))])
                    .select('.selection')
                    .attr('stroke', null)
                    .attr('fill-opacity', 0);
                
                updateFullAxisControls();
            }

            function brushed() {
                var selection = d3.event.selection;
                var inverted = selection.map(function(e) {return scaleFull.invert(e).toISOString()});
                scaleSubset.domain(inverted.map(function(t) {return new Date(me._getClosestTime(t))}));
                svg.select('.subset-axis').call(axisSubset);

                var changedTime = me._uiState.currentTime;
                if(inverted[0] > me._uiState.currentTime) {
                    changedTime = inverted[0];
                }
                if(inverted[1] < me._uiState.currentTime) {
                    changedTime = inverted[1];
                }
                me._setRange(inverted[0], inverted[1]);
                me._updateCurrentTime(changedTime);
                updateFullAxisControls();
            }
        },

        teardownUI: function () {
            //remove old element
            this._isMobileVisible = false;
            this.removeFromPluginContainer(this.getElement());
        },

        _setAnmationState: function(shouldAnimate){
            this._element.find('.timeseries-playpause').toggleClass('pause', shouldAnimate);
            this._element.find('.timeseries-back, .timeseries-forward').toggleClass('disabled', shouldAnimate);
            if(shouldAnimate !== this._uiState.isAnimating) {
                this._uiState.isAnimating = shouldAnimate;
                if(shouldAnimate) {
                    this._throttleAnimation();
                }
            }
        },

        _createEventHandlers: function () {
            return {
                MapSizeChangedEvent: function (evt) {
                    this._setWidth(evt.getWidth());
                },
                'Toolbar.ToolSelectedEvent': function(evt){
                    if(evt.getGroupId() === 'mobileToolbar-mobile-toolbar' && evt.getToolId() !== 'mobile-timeseries') {
                        this.teardownUI();
                    }
                }
            };
        },

    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
