import * as d3 from 'd3';

Oskari.clazz.define('Oskari.userinterface.component.Chart', function () {
    this.svg = null;
    this.dimensions = {};
    this.x = null;
    this.y = null;
    this.colorScale = null;
    this.data = null;
    this.chartType = null;
    this.plot = jQuery('<div style="width:100%"></div>');
    this.axisLabelValues = jQuery('<div style="width:100%"></div>');
    this.sortingType = null;
    this._g = null;
    this._options = {
        colors: ['#555', '#555'],
        width: 630,
        margin: {
            left: 50,
            right: 50,
            bottom: 15,
            top: 10,
            maxForLabel: 140
        },
        maxTicks: 10
    };
    this.loc = Oskari.getMsg.bind(null, 'DivManazer');
    this.calculateDimensions();
}, {
    setOptions: function (options = {}) {
        const opts = jQuery.extend(true, {}, this._options, options);
        if (typeof opts.valueRenderer !== 'function') {
            opts.valueRenderer = null;
        }
        if (typeof opts.colors === 'string') {
            opts.colors = [opts.colors];
        }
        this._options = opts;
    },
    getOptions: function () {
        return this._options;
    },
    chartIsInitialized: function () {
        return this.svg !== null;
    },
    calculateDimensions: function () {
        const { width, margin: { top, bottom } } = this.getOptions();
        const { labels, dataset, axis, height, margin: { left, right } } = this.getDimensionsFromData();
        this.dimensions = {
            margin: { left, right, top, bottom },
            dataset,
            axis,
            container: { width, height },
            chart: {
                width: width - left - right,
                height: height - bottom - top
            },
            labels
        };
    },
    getDimensionsFromData: function () {
        const pxPerChar = 5.5;
        const xLabelOffset = 15;
        const xOffset = -5;

        const { width, margin: { left: optLeft, right: optRight, maxForLabel }, maxTicks } = this.getOptions();
        // default values if couldn't calculate from data
        let left = optLeft;
        let right = optRight;
        let min = 0;
        let max = 0;
        let ticks = 0;
        let height = 0;
        let positive = 0;
        let negative = 0;

        if (this.data) {
            height = this.data.length * 21;
            min = d3.min(this.data, function (d) { return d.value; });
            max = d3.max(this.data, function (d) { return d.value; });

            const widestLabel = d3.max(this.data, function (d) { return d.name.length; });
            const labelPx = widestLabel * pxPerChar;
            let labelMargin = labelPx < maxForLabel ? labelPx : maxForLabel;
            let chartWidth = width - left - right;
            const x = d3.scaleLinear().domain(this.getScaleArray(min, max)).range([0, chartWidth]);
            let xOrigin = x(0);
            // calculate how much space is needed for labels, if negative then label fits inside chart
            const spaceForPositive = labelMargin - xOrigin;
            const spaceForNegative = xOrigin + labelMargin - chartWidth;
            if (spaceForPositive > 0) {
                left = spaceForPositive + optLeft / 2;
            }
            if (spaceForNegative > 0) {
                right = spaceForNegative + optRight / 2;
            }
            // update chart width
            chartWidth = width - left - right;
            xOrigin = x.range([0, chartWidth])(0);
            // calculate max label lengths and ticks
            positive = Math.floor((left + xOrigin - xLabelOffset) / pxPerChar);
            negative = Math.floor((right + chartWidth - xOrigin - xLabelOffset) / pxPerChar);

            const xDigits = Math.floor((Math.log(Math.max(Math.abs(min), max)) * Math.LOG10E) + 1);
            const tickTarget = Math.floor((chartWidth / xDigits) / 10);
            ticks = tickTarget > maxTicks ? maxTicks : tickTarget;
        }

        return {
            height,
            dataset: { min, max },
            axis: { ticks, xOffset },
            margin: { left, right },
            labels: { positive, negative }
        };
    },
    initScales: function () {
        // from zero to max value. This could also be from min to max value, but it causes problems if
        // some values are missing -> resulting to negative widths for bars.
        // TODO: we need some proper handling for missing values AND negative values.

        this.x = d3.scaleLinear();
        this.y = d3.scaleBand();
        var { min, max } = this.dimensions.dataset;
        var xScaleDomain = this.getScaleArray(min, max);
        var yScaleDomain = this.data.map(function (d) {
            return d.name;
        });
        this.x.domain(xScaleDomain);
        this.y.domain(yScaleDomain);
    },
    getScaleArray (min, max) {
        if (min > 0) {
            return [0, max];
        }
        if (max < 0) {
            return [min, 0];
        }
        return [min, max];
    },
    getSVGTemplate: function () {
        const { container, margin } = this.dimensions;
        var svg = d3.select(this.plot.get(0)).append('svg')
            .attr('width', container.width)
            .attr('height', container.height)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        return svg;
    },
    nullsLast: function (a, b) {
        if (a == null && b == null) return 0;
        if (a == null) return -1;
        if (b == null) return 1;
        return 0;
    },
    /**
     *
     * @method sortDataByType
     * @param { String } type - indicates what sort of sorting we want to apply to our chart.
     * if no type provided it will default to value ascending
     */
    sortDataByType: function (type) {
        var me = this;
        // empty string ("") is the placeholder value from selectlist
        if (!this.sortingType) {
            if (typeof type === 'undefined' || type === '') {
                type = 'value-descending';
            }
        } else if (type === undefined || type === '') {
            type = this.sortingType;
        }

        switch (type) {
        case 'name-ascending':
            me.data.sort(function (a, b) {
                return d3.descending(a.name, b.name);
            });
            break;
        case 'name-descending':
            me.data.sort(function (a, b) {
                return d3.ascending(a.name, b.name);
            });
            break;
        case 'value-ascending':
            me.data.sort(function (a, b) {
                var result = me.nullsLast(a.value, b.value);
                if (!result) {
                    return d3.descending(a.value, b.value);
                }
                return result;
            });
            break;
        case 'value-descending':
            me.data.sort(function (a, b) {
                var result = me.nullsLast(a.value, b.value);
                if (!result) {
                    return d3.ascending(a.value, b.value);
                }
                return result;
            });
            break;
        }

        me.redraw();
        me.sortingType = type;
    },
    /**
     * d3 axis are functions that generate svg-elements based on the scale given
     * @method initAxis
     *
     */
    initAxis: function () {
        const { chart: { height }, axis: { ticks, xOffset } } = this.dimensions;
        this.xAxis = d3.axisTop(this.x)
            .ticks(ticks)
            .tickSizeInner(-height + xOffset)
            .tickSizeOuter(0)
            .tickFormat(d => this.loc('graph.tick', { value: d }));
    },
    /**
     * initializes the chart skeleton without any specific line or bar options
     *
     * @method initChart
     *
     */
    initChart: function () {
        this.svg = this.getSVGTemplate();
        this.initScales();
        var chart = this.chart(this.svg);
        return chart;
    },
    /**
     * sets this.data and sorts the values in ascending order
     *
     * @method handleData
     * @param  [] data only supports following format: [ { name: "", value: int } ]
     */
    handleData: function (data) {
        if (!Array.isArray(data)) {
            return;
        }
        this.data = data;
        this.sortDataByType();
        this.calculateDimensions();
    },
    /**
     *
     * @method svgAppendElements
     */
    svgAppendElements: function () {
        // append x-tick lines to chart
        var xtickAxis = this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate( 0, 0)')
            .attr('shape-rendering', 'crispEdges')
            .call(this.xAxis);

        xtickAxis.selectAll('x axis, tick, text').remove();
        xtickAxis.select('.domain').remove();
        xtickAxis.selectAll('line')
            .attr('stroke', '#eee');

        const { container, margin } = this.dimensions;
        // append the x-axis to different element so we can show the values when scrollign
        const height = 12;
        var gx = d3.select(this.axisLabelValues.get(0))
            .append('svg')
            .attr('width', container.width)
            .attr('height', height)
            .append('g')
            .attr('class', 'x axis header')
            .attr('transform', 'translate(' + margin.left + ',' + height + ')')
            .call(this.xAxis);

        gx.select('.domain').remove();
        gx.selectAll('line').remove();

        // / X
    },
    /**
     * @method setColorScale
     */
    setColorScale: function (colors) {
        if (Array.isArray(colors)) {
            this.colorScale = d3.scaleThreshold().range(colors);
        } else {
            this.colorScale = d3.scaleThreshold().domain(colors.bounds).range(colors.values);
        }
    },
    /**
     * handles data & options passed to it, initializes skeleton chart and then applies barchart specific options to the element
     * @method createBarChart
     * @param [Array] data
     * @param { Object } options keys: colors -> color scale, valueRenderer -> function for rendering bar values
     */
    createBarChart: function (data, options) {
        this.setOptions(options);
        if (this.svg === null) {
            this.handleData(data);
        }
        const { colors, valueRenderer } = this.getOptions();
        this.setColorScale(colors);
        this.initChart();
        var me = this;
        // labels
        var labels = this.svg.append('g')
            .selectAll('.labels')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', function (d) { return d.value < 0 ? 'labels negative' : 'labels positive'; })
            .attr('transform', function (d) {
                var marginized = me.y(d.name) + 11;
                return 'translate(' + me.x(0) + ',' + marginized + ')';
            });
        // append lines
        labels.append('line')
            .attr('x2', function (d) {
                if (d.value < 0) {
                    return 5;
                } else {
                    return -5;
                }
            })
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('x1', 0)
            .attr('stroke', '#aaa')
            .attr('shape-rendering', 'crispEdges');
        // append text
        const { labels: maxLabels } = this.dimensions;
        labels.append('text')
            .attr('text-anchor', function (d) {
                if (d.value < 0) {
                    return 'start';
                }
                return 'end';
            })
            .attr('x', function (d) {
                if (d.value < 0) {
                    return 8;
                } else {
                    return -8;
                }
            })
            .attr('dy', '0.32em')
            .style('font-size', '11px')
            .attr('fill', '#000')
            .text(function (d) {
                return me.getTextContent(d, maxLabels);
            });

        // bars
        var bars = this.svg.insert('g', 'g.y').selectAll('.bar')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', function (d) { return d.value < 0 ? 'negative' : 'positive'; })
            .attr('transform', function (d) {
                return 'translate(0,' + (me.y(d.name) + me.y.bandwidth() / 2) + ')';
            });

        function barWidth (d) {
            return d.value ? Math.abs(me.x(d.value) - me.x(0)) : 0;
        };

        // append rects
        bars.append('rect')
            .attr('class', 'bar')
            .attr('text-anchor', 'middle')
            .style('fill', function (d, i) { return me.colorScale(d.value); })
            .attr('y', -8) // 7 is half of 15 height (pixel aligned)
            .attr('x', function (d) { return d.value ? me.x(Math.min(0, d.value)) : 0; })
            .attr('height', 17)
            .attr('width', barWidth);
        // append text
        const noValStr = this.loc('graph.noValue');
        bars.each(function (d, i) {
            var isNumber = typeof d.value === 'number';
            if (!valueRenderer && isNumber) {
                return;
            }
            var textAnchor = 'start';
            var transformX = '5px';
            var locationX = me.x(0);
            var rendered = noValStr;
            var color = '#999';
            if (isNumber) {
                locationX = me.x(d.value);
                var width = barWidth(d);
                rendered = valueRenderer(d.value);
                var renderedLength = typeof rendered === 'string' ? rendered.length * 8 : 0; // 8px per char (generous)
                var fitsInBar = renderedLength < width - 10; // padding of 5px + 5px
                if (fitsInBar) {
                    color = Oskari.util.isDarkColor(me.colorScale(d.value)) ? '#fff' : '#000';
                    if (d.value >= 0) {
                        textAnchor = 'end';
                        transformX = '-5px';
                    }
                } else {
                    color = '#333';
                    if (d.value < 0) {
                        textAnchor = 'end';
                        transformX = '-5px';
                    }
                }
            }
            d3.select(this)
                .append('text')
                .attr('x', locationX)
                .attr('text-anchor', textAnchor)
                .attr('dx', transformX)
                .attr('y', 0)
                .attr('dy', isNumber ? '0.425em' : '0.32em')
                .style('font-size', '11px')
                .attr('fill', color)
                .text(rendered);
        });

        this.chartType = 'barchart';
        return this.getGraph();
    },
    /**
     * handles data & options passed to it, initializes skeleton chart and then applies linechart specific options to the element
     * @method createLineChart
     */
    createLineChart: function (data, options) {
        this.setOptions(options);
        this.handleData(data);
        const { colors } = this.getOptions(options);
        this.setColorScale(colors);
        this.initChart();
        var me = this;
        var linegen = d3.line()
            .x(function (d) { return me.x(d.value); })
            .y(function (d) { return me.y(d.name); });

        this.svg.append('path')
            .attr('d', linegen(this.data))
            .attr('stroke', function (d, i) { return me.colorScale(d.value); })
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.chartType = 'linechart';
        return this.getGraph();
    },
    getTextContent: function (d, maxLength) {
        const max = d.value < 0 ? maxLength.negative : maxLength.positive;
        if (d.name.length > max) {
            return d.name.substring(0, max - 3) + '\u2026'; // ellipsis
        }
        return d.name;
    },
    /**
     * skeleton chart with no data applied to it
     * @method chart
     * @param  d3 svg-element
     */
    chart: function (selection) {
        var me = this;
        const { height, width } = this.dimensions.chart;
        // update x & y scales
        this.y.range([height, 0]);
        this.x.range([0, width]);

        selection.each(function (data) {
            me.initAxis();
            me.svgAppendElements();
        });
    },
    clear: function () {
        this.plot.empty();
        this.axisLabelValues.empty();
    },
    /**
     * remove old graph and redraw
     * @method redraw
     * @param  [data]
     */
    redraw: function (data, options) {
        this.setOptions(options);
        var chart;
        this.handleData(data);

        // Clear previous graphs
        this.clear();
        if (this.chartType === 'barchart') {
            chart = this.createBarChart(this.data, options);
        } else if (this.chartType === 'linechart') {
            chart = this.createLineChart(this.data, options);
        }

        return chart;
    },
    getGraphAxisLabels: function () {
        return this.axisLabelValues;
    },
    getGraph: function () {
        return this.plot;
    }
});
