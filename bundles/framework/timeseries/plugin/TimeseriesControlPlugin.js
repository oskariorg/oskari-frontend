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
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
        me._defaultLocation = 'bottom center';
        me._index = 90;
        me._name = 'TimeseriesControlPlugin';

        me._delegate = delegate;

        me._uiState = {
            times: null,
            currentTime: null,
            rangeStart: null,
            rangeEnd: null,
            isAnimating: false,
            frameInterval: 1000,
            stepInterval: moment.duration(1, 'minutes')
        };

        var times = delegate.getTimes();
        this._uiState.times = times;
        this._uiState.rangeStart = times[0];
        this._uiState.rangeEnd = times[times.length-1];
        this._uiState.currentTime = delegate.getCurrentTime();

        me._throttleNewTime = me._throttle(me._requestNewTime.bind(me), 500);
        me._throttleAnimation = me._throttle(me._animationStep.bind(me), me._uiState.frameInterval);

        me._mobileDefs = {
            buttons: {
                'mobile-featuredata': {
                    iconCls: 'mobile-info-marker',
                    tooltip: '',
                    sticky: true,
                    toggleChangeIcon: true,
                    show: true,
                    callback: function () {

                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        __timelineWidth: 600,

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
        _requestNewTime: function() {
            var me = this;
            me._delegate.requestNewTime(me._uiState.currentTime, null, function(){
                if(me._uiState.isAnimating) {
                    me._throttleAnimation();
                }

            });
        },
        _animationStep: function() {
            var targetTime = moment(this._uiState.currentTime).add(this._uiState.stepInterval, 'milliseconds').toISOString();
            var index = d3.bisectRight(this._uiState.times, targetTime);
            if(index > this._uiState.times.length-1) {
                this._uiState.isAnimating = false;
                return;
            }
            this._uiState.currentTime = this._uiState.times[index];
            this._requestNewTime();
            this._renderHandle();
        },
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me.getSandbox(),
                el = jQuery(
                    '<div class="mapplugin timeseriescontrolplugin">' +
                        '<div class="timeseries-aux"></div><div class="timeseries-timelines"><svg class="timeline-desktop">' +
                            '<g class="full-axis"></g>' +
                            '<g class="full-axis-brush"></g>' +
                            '<g class="subset-axis"></g>' +
                            '<g class="subset-bg"><rect x="-10" y="-10" width="10" height="10"/></g>' +
                            '<g class="drag-handle"><circle cx="0" cy="0" r="10"/></g>' +
                        '</svg></div>' +
                    '</div>');
            return el;
        },
        _getClosestTime: function (time){
            var index = Math.max(d3.bisect(this._uiState.times, time)-1, 0);
            return this._uiState.times[index];
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

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                me._element = me._createControlElement();
                this.addToPluginContainer(me._element);
                this._element.find('.timeseries-aux').empty();
                me._initStepper();
                me._updateTimelines();
            }
        },
        _initStepper: function() {
            var me = this;
            var template = jQuery(
                '<div class="timeseries-stepper">' +
                    '<div class="timeseries-back"></div><div class="timeseries-playpause"></div><div class="timeseries-forward"></div><div class="timeseries-datetime"></div>' +
                '</div>');
            var dateTimeInput = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
            dateTimeInput.setName('datetime');
            template.find('.timeseries-datetime').append(dateTimeInput.getElement());
            template.find('.timeseries-playpause').on('click', function(e){
                me._setAnmationState(!me._uiState.isAnimating);
            });
            this._element.find('.timeseries-aux').append(template);
        },
        _updateTimelines: function() {
            var margin = {left: 15, right: 15}
            var me = this;
            var svg = d3.select(this._element.find('.timeline-desktop').get(0));
            svg
                .attr('width', this.__timelineWidth)
                .attr('height', 100);

            var times = this._uiState.times;
            var scaleFull = d3.scaleTime()
                .domain([new Date(times[0]), new Date(times[times.length-1])])
                .range([margin.left, this.__timelineWidth - margin.right]);

            var scaleSubset = d3.scaleTime()
                .domain([new Date(this._uiState.rangeStart), new Date(this._uiState.rangeEnd)])
                .range([margin.left, this.__timelineWidth - margin.right]);

            var axisFull = d3.axisTop(scaleFull);
            svg.select('.full-axis')
                .attr('transform', 'translate(0,30)')
                .call(axisFull);

            var axisSubset = d3.axisTop(scaleSubset);
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
            function updateCurrentTime(newTime) {
                newTime = me._getClosestTime(newTime);
                if(me._uiState.currentTime !== newTime){
                    me._uiState.currentTime = newTime;
                    me._throttleNewTime();
                }
                renderHandle();
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
                updateCurrentTime(scaleSubset.invert(newX).toISOString());
            }

            svg.select('.subset-bg rect')
                .attr('fill', 'rgba(255,255,255,0.01)')
                .attr('x', margin.left)
                .attr('y', 50)
                .attr('width', this.__timelineWidth - margin.left - margin.right)
                .attr('height', 50)
                .on('click', null) // remove old event handlers
                .on('click', function(e) {
                    var newX = d3.mouse(this)[0];
                    timeFromMouse(newX);
                }); 
            
            var dragBehavior = d3.drag()
            .on('drag', function(){
                var newX = d3.event.x;
                timeFromMouse(newX);
            })
            .on('end', function(){
                // if brush too small, enlarge it
            })

            handle.call(dragBehavior);

            var brush = d3.brushX()
                .extent([[margin.left, 0], [this.__timelineWidth - margin.right, 50]])
                .handleSize(40)
                .on(".brush", null) // remove old event handlers
                .on('brush', brushed);

            svg.select('.full-axis-brush')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, [scaleFull(new Date(this._uiState.rangeStart)), scaleFull(new Date(this._uiState.rangeEnd))]);

            function brushed() {
                var selection = d3.event.selection;
                var inverted = selection.map(scaleFull.invert, scaleFull);
                scaleSubset.domain(inverted);
                svg.select('.subset-axis').call(axisSubset);
                var invertedISO = inverted.map(function(e){return e.toISOString()});

                var changedTime = me._uiState.currentTime;
                if(invertedISO[0] > me._uiState.currentTime) {
                    changedTime = invertedISO[0];
                }
                if(invertedISO[1] < me._uiState.currentTime) {
                    changedTime = invertedISO[1];
                }
                updateCurrentTime(changedTime);
            }
        },

        teardownUI: function () {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
        },

        _setAnmationState: function(shouldAnimate){
            if(shouldAnimate !== this._uiState.isAnimating) {
                this._uiState.isAnimating = shouldAnimate;
                if(shouldAnimate) {
                    this._throttleAnimation();
                }
            }
            this._element.find('.timeseries-playpause').toggleClass('pause', shouldAnimate);
        },

        _createEventHandlers: function () {
            return {
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
