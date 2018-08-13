Oskari.clazz.define('Oskari.statistics.statsgrid.SeriesControl', function (sandbox, locale) {
    this.sb = sandbox;
    this.loc = locale;
    this.log = Oskari.log('Oskari.statistics.statsgrid.SeriesControl');
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.seriesService = this.service.getSeriesService();
    this.__templates = {
        main: _.template(
            '<div class="statsgrid-series-control-container">' +
                '<svg class="line-svg">' +
                    '<g class="axis"></g>' +
                    '<g class="bg"><rect x="-10" y="-10" width="10" height="10"/></g>' +
                    '<g class="drag-handle" cursor="ew-resize">' +
                        '<rect x="-9" y="-9" width="18" height="18" fill-opacity="0"/>' +
                        '<circle cx="0" cy="0" r="4"/>' +
                    '</g>' +
                '</svg>' +
                '<div class="value-controls">' +
                '</div>' +
            '</div>')
    };
    this._lineWidth = 500;

    this._renderState = {
        panels: {}
    };
    this._uiState = {
        values: [],
        currentSeriesIndex: undefined
    };
    this._bindToEvents();
}, {
    __speedOptions: [
        { key: 'fast', value: 1000 },
        { key: 'normal', value: 2000 },
        { key: 'slow', value: 3000 }
    ],
    /**
     * @method _generateSelectOptions Generate localized options for <select> dropdowns
     * @private
     * @param  {String} prefix localization path prefix
     * @param  {Object[]} options key, value to localize
     * @return {Object[]} key, value that has been localized
     */
    _generateSelectOptions: function (prefix, options) {
        var me = this;
        return options.map(function (e) {
            return {
                title: me.loc(prefix + e.key),
                value: e.value
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

        var template = jQuery(
            '<div class="stats-series-stepper">' +
                '<div class="stats-series-back"></div>' +
                '<div class="stats-series-playpause"></div>' +
                '<div class="stats-series-forward"></div>' +
            '</div>');

        template.find('.stats-series-playpause').on('click', function (e) {
            me._setAnimationState(!me.seriesService.isAnimating());
        });
        template.find('.stats-series-back').on('click', this._doSingleStep.bind(this, false));
        template.find('.stats-series-forward').on('click', this._doSingleStep.bind(this, true));

        controlPanel.append(template);

        var speedPanel = jQuery('<div class="stats-series-speed"></div>');
        var speedLabel = jQuery('<label>' + me.loc('series.speed.label') + '</label>');
        var speedSelect = jQuery('<select></select>');
        var speedOpts = '';
        me._generateSelectOptions('series.speed.', me.__speedOptions).forEach(function (opt) {
            speedOpts += '<option value="' + opt.value + '">' + opt.title + '</option>';
        });
        speedSelect.append(speedOpts);
        speedSelect.val(me.seriesService.getFrameInterval());
        speedSelect.change(function () {
            me._setAnimationState(false);
            me.seriesService.setFrameInterval(parseInt(speedSelect.val()));
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
        if (this.seriesService.isAnimating()) {
            return;
        }
        // quick ui response
        var delta = forward ? 1 : -1;
        var requestedIndex = this._uiState.currentSeriesIndex + delta;
        if (requestedIndex >= 0 && requestedIndex < this._uiState.values.length) {
            this._renderHandle(requestedIndex);
            this._updateValueDisplay(requestedIndex);
        }

        forward ? this.seriesService.next() : this.seriesService.previous();
    },
    render: function (el) {
        var me = this;

        me._element = jQuery(me.__templates.main());
        me._initControls();
        me._updateLineSegments();

        if (el) {
            // attach container to parent if provided, otherwise updates UI in the current parent
            el.append(me._element);
        }
    },
    /**
     * @method _setAnimationState Set animating / not animating state
     * @private
     * @param  {Boolean} shouldAnimate should the series be animating?
     */
    _setAnimationState: function (shouldAnimate) {
        this._element.find('.stats-series-playpause').toggleClass('pause', shouldAnimate);
        this._element.find('.stats-series-back, .stats-series-forward').toggleClass('disabled', shouldAnimate);
        this.seriesService.setAnimating(shouldAnimate);
    },
    /**
     * @method setWidth Set timeline width and update them if needed
     * @private
     * @param  {Number} width control width in px
     * @param {Boolean} suppressUpdate true if no timelines update should be done
     */
    setWidth: function (width) {
        var container = jQuery('.statsgrid-series-control-container');
        container.css('max-width', width + 'px');
        container.css('width', width + 'px');
        this._lineWidth = width;
        this._updateLineSegments(this._inMobileMode);
    },
    /**
     * @method _updateLineSegments Update line segments SVG
     * @private
     */
    _updateLineSegments: function () {
        var me = this;
        var values = me.seriesService.getValues();
        var margin = { left: 15, right: 15 };

        me._uiState.values = values;

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
            .attr('transform', 'translate(' + scale(me.seriesService.getSelectedIndex()) + ',30)')
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
                var serieValue = me._uiState.values[me._uiState.currentSeriesIndex];
                me.seriesService.setValue(serieValue);
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
                var newX = d3.mouse(this)[0];
                valueFromMouse(newX, true);
            });

        var dragBehavior = d3.drag()
            .subject(function (d) {
                return { x: scale(me._uiState.currentSeriesIndex), y: d3.event.y };
            })
            .on('drag', function () {
                var newX = d3.event.x;
                valueFromMouse(newX, false);
            })
            .on('end', function () {
                var newX = d3.event.x;
                valueFromMouse(newX, true);
            });

        handle.call(dragBehavior);
    },
    _updateSeriesIndex: function (index) {
        var seriesIndex = Math.round(index);
        if (this._uiState.currentSeriesIndex !== seriesIndex) {
            this._uiState.currentSeriesIndex = seriesIndex;
        }
        this._renderHandle(index);
        this._updateValueDisplay(this._uiState.currentSeriesIndex);
    },
    _updateValueDisplay: function (index) {
        var display = jQuery('.stats-series-value');
        var value = this._uiState.values[index];
        display.html(value);
    },
    /**
     * Listen to events that require re-rendering the UI
     */
    _bindToEvents: function () {
        var me = this;
        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
            me._updateSeriesIndex(me.seriesService.getSelectedIndex());
        });
    }
});
