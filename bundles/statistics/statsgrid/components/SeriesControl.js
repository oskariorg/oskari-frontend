import * as d3 from 'd3';
import '../resources/css/seriesplayback.css';

const INTERVALS = [
    { key: 'fast', value: 1000 },
    { key: 'normal', value: 2000 },
    { key: 'slow', value: 3000 }
];

Oskari.clazz.define('Oskari.statistics.statsgrid.SeriesControl', function (controller, locale) {
    this.controller = controller;
    this.loc = locale;
    this.log = Oskari.log('Oskari.statistics.statsgrid.SeriesControl');
    this.__templates = {
        main: _.template(
            '<div class="statsgrid-series-control-container">' +
                '<svg class="line-svg">' +
                    '<g class="axis"></g>' +
                    '<g class="bg"><rect x="-10" y="-10" width="10" height="10"/></g>' +
                    '<g class="drag-handle" cursor="ew-resize">' +
                        '<rect x="-9" y="-9" width="18" height="18" fill-opacity="0"/>' +
                        '<circle cx="0" cy="0" r="8"/>' +
                    '</g>' +
                '</svg>' +
                '<div class="value-controls">' +
                '</div>' +
            '</div>'),
        stepper: _.template(
            '<div class="stats-series-stepper">' +
                '<div class="stats-series-back"></div>' +
                '<div class="stats-series-playpause"></div>' +
                '<div class="stats-series-forward"></div>' +
            '</div>')
    };
    this._lineWidth = 500;
    this._minWidth = 290;
    // internal state
    this._uiState = {
        values: [],
        animating: false,
        interval: 2000,
        index: 0,
        hash: null
    };
    this._throttleAnimation = Oskari.util.throttle(() => this._next(), 2000);
}, {
    getState: function () {
        return this._uiState;
    },
    updateState: function (state) {
        this._uiState = {...this._uiState, ...state};
    },
    /**
     * @method _generateSelectOptions Generate localized options for <select> dropdowns
     * @private
     * @return {Object[]} key, value that has been localized
     */
    _generateSelectOptions: function () {
        return INTERVALS.map(({key, value}) =>  {
            return {
                title: this.loc(`series.speed.${key}`),
                value
            };
        });
    },
    /**
     * @method _initControls Set up previous, play/pause and next buttons, speed menu and value display
     * @private
     */
    _initControls: function () {
        var me = this;
        var controlPanel = me._element.find('.value-controls');

        var stepper = jQuery(this.__templates.stepper());

        stepper.find('.stats-series-playpause').on('click', function (e) {
            me._setAnimationState(!me.getState().animating);
        });
        stepper.find('.stats-series-back').on('click', this._doSingleStep.bind(this, false));
        stepper.find('.stats-series-forward').on('click', this._doSingleStep.bind(this, true));

        controlPanel.append(stepper);

        var speedPanel = jQuery('<div class="stats-series-speed"></div>');
        var speedLabel = jQuery('<label>').text(me.loc('series.speed.label'));
        var speedSelect = jQuery('<select></select>');
        var speedOpts = '';
        me._generateSelectOptions().forEach(function (opt) {
            speedOpts += '<option value="' + opt.value + '">' + opt.title + '</option>';
        });
        speedSelect.append(speedOpts);
        speedSelect.val(this.getState().interval);
        speedSelect.on('change', function () {
            me.setFrameInterval(parseInt(speedSelect.val()));
        });
        speedPanel.append(speedLabel);
        speedPanel.append(speedSelect);

        controlPanel.append(speedPanel);

        var valueDisplay = jQuery('<div class="stats-series-value"></div>');
        controlPanel.append(valueDisplay);
    },
    /**
     * @method _doSingleStep Step current value forward/back (in response to step forward/back buttons)
     * @private
     * @param  {Boolean} forward true to move forward, false to move back
     */
    _doSingleStep: function (forward) {
        const { animating, index } =  this.getState();
        if (animating) {
            return;
        }
        // quick ui response
        const delta = forward ? 1 : -1;
        const requestedIndex = index + delta;
        if (!this._isValidIndex(requestedIndex)) {
            return;
        }
        this._renderHandle(requestedIndex);
        this._updateValueDisplay(requestedIndex);
        this._setSelectedValue(requestedIndex);
    },
    _next: function () {
        const { index = 0, values, animating } =  this.getState();
        if (!animating) {
            return;
        }
        const next = index + 1;
        if (next > values.length - 1) {
            this._setAnimationState(false);
            return;
        }
        this._setSelectedValue(next);
    },
    _setSelectedValue: function (index, delayed) {
        const { animating, values, interval } = this.getState();
        const value = values[index];
        this.controller.setSeriesValue(value);
        if (animating) {
            this._updateSeriesIndex(index);
            if (delayed === true) {
                // Wait frameInterval before starting the animation
                setTimeout(this._throttleAnimation, interval);
            } else {
                this._throttleAnimation();
            }
        }
    },
    _isValidIndex: function (index) {
        return index >= 0 && index < this._uiState.values.length;
    },
    render: function (el) {
        this._element = jQuery(this.__templates.main());
        this._initControls();
        if (Oskari.util.isMobile()) {
            this.setWidth(this._minWidth);
        }
        el.append(this._element);
    },
    setFrameInterval: function (interval) {
        this._setAnimationState(false);
        this._throttleAnimation = Oskari.util.throttle(() => this._next(), interval);
        this.updateState({interval});
    },
    /**
     * @method _setAnimationState Set animating / not animating state
     * @private
     * @param  {Boolean} shouldAnimate should the series be animating, toggle if missing
     */
    _setAnimationState: function (animating) {
        this._element.find('.stats-series-playpause').toggleClass('pause', animating);
        this._element.find('.stats-series-back, .stats-series-forward').toggleClass('disabled', animating);
        this.updateState({ animating });
        if (!animating) {
            return;
        }
        const { values, index } = this.getState();
        if (index >= values.length -1) {
            // Step to the beginning, if the series is on the last value
            this._setSelectedValue(0, true);
        } else {
            this._throttleAnimation();
        }
    },
    /**
     * @method setWidth Set component width and redraw series axis
     * @private
     * @param  {Number} width control width in px
     */
    setWidth: function (width) {
        var container = this._element.find('.statsgrid-series-control-container');
        container.css('max-width', width + 'px');
        container.css('width', width + 'px');
        this._lineWidth = width;
        this._updateLineSegments();
    },
    /**
     * @method _updateLineSegments Update line segments SVG
     * @private
     */
    _updateLineSegments: function () {
        const { index, values } = this.getState();
        var me = this;
        var margin = { left: 15, right: 15 };

        // calculate tick density
        var tickCount = values.length;
        var tickWidth = 50;
        var axisLength = this._lineWidth - margin.left - margin.right;

        if (tickCount * tickWidth > axisLength) {
            var ratio = axisLength / (tickCount * tickWidth);
            tickCount = Math.floor(ratio * tickCount);
        }

        var svg = d3.select(this._element.find('.line-svg').get(0));
        svg
            .attr('width', this._lineWidth)
            .attr('height', 40);

        var scale = d3.scaleLinear()
            .domain([0, values.length - 1])
            .range([margin.left, this._lineWidth - margin.right]);

        var ticks = scale.ticks(tickCount);
        ticks[ticks.length - 1] = scale.domain()[1];

        var axis = d3.axisTop(scale)
            .tickValues(ticks)
            .tickPadding(7)
            .tickFormat(function (domainVal) {
                return values[domainVal];
            })
            .tickSizeOuter(0);

        axis.tickValues();

        svg.select('.axis')
            .attr('transform', 'translate(0,30)')
            .call(axis);

        var handle = svg.select('g.drag-handle')
            .attr('transform', 'translate(' + scale(index) + ',30)')
            .on('drag', null)
            .on('end', null); // remove old event handlers

        function renderHandle (seriesIndex) {
            var newX = scale(seriesIndex);
            handle.attr('transform', 'translate(' + newX + ',30)');
        }
        me._renderHandle = renderHandle;

        function valueFromMouse (newX, deepUpdate) {
            var scaleRange = scale.range();
            if (newX > scaleRange[1]) {
                newX = scaleRange[1];
            }
            if (newX < scaleRange[0]) {
                newX = scaleRange[0];
            }
            me._updateSeriesIndex(scale.invert(newX));

            if (deepUpdate) {
                me._setSelectedValue(me.getState().index);
            }
        }

        svg.select('.bg rect')
            .attr('fill', 'rgba(255,255,255,0.01)')
            .attr('x', margin.left)
            .attr('y', 0)
            .attr('width', this._lineWidth - margin.left - margin.right)
            .attr('height', 40)
            .on('click', null) // remove old event handlers
            .on('click', function (e) {
                me._setAnimationState(false);
                var newX = d3.pointer(e)[0];
                valueFromMouse(newX, true);
            });

        var dragBehavior = d3.drag()
            .subject(function (e) {
                return { x: scale(me._uiState.currentSeriesIndex), y: e.y };
            })
            .on('drag', function (e) {
                var newX = e.x;
                valueFromMouse(newX, false);
            })
            .on('end', function (e) {
                var newX = e.x;
                valueFromMouse(newX, true);
            });

        handle.call(dragBehavior);
    },
    _updateSeriesIndex: function (num) {
        var index = Math.round(num);
        this._renderHandle(index);
        this.updateState ({ index });
        this._updateValueDisplay();
    },
    _updateValueDisplay: function () {
        const { values, index } = this.getState();
        var display = this._element.find('.stats-series-value');
        var value = values[index];
        display.text(value);
    },
    updateValues: function (indicator) {
        if (!indicator || !indicator.series || this.getState().hash === indicator.hash) {
            return;
        }
        const { values, id } = indicator.series;
        const value = indicator.selections[id];
        const index = values.indexOf(value);
        this.updateState({ values, index });
        this._updateLineSegments();
        this._updateSeriesIndex(index);
        this._setAnimationState(false);
    }
});
