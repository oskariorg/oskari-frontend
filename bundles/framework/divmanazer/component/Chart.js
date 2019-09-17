Oskari.clazz.define('Oskari.userinterface.component.Chart', function () {
    this.svg = null;
    this.dimensions = this.chartDimensions();
    this.x = null;
    this.y = null;
    this.colorScale = null;
    this.data = null;
    this.chartType = null;
    this.containerWidth = null;
    this.plot = jQuery('<div style="width:100%"></div>');
    this.axisLabelValues = jQuery('<div style="width:100%"></div>');
    this.sortingType = null;
    this.defaultWidth = 630;
    this._g = null;
    this._options = {
        colors: ['#555', '#555']
    };
    this.loc = Oskari.getMsg.bind(null, 'DivManazer');
    this.noValStr = this.loc('graph.noValue');
}, {
    _checkColors: function (opts) {
        var options = opts || {};
        options.colors = options.colors || this._options.colors;
        if (typeof options.colors === 'string') {
            options.colors = [options.colors];
        } else if (options.colors) {
            options.colors = options.colors;
        }
    },
    chartIsInitialized: function () {
        return this.svg !== null;
    },
    chartDimensions: function (sideMargin) {
        var me = this;
        var margin = isNaN(sideMargin) ? 80 : Math.min(sideMargin, 140);
        var dataset = this.getDatasetMinMax();
        // dataset has both negative and positive values, labels are inside chart -> use smaller margin
        if (dataset.min < 0 && dataset.max > 0) {
            var ratio = Math.max(Math.abs(dataset.min), dataset.max) / Math.min(Math.abs(dataset.min), dataset.max);
            if (ratio < 10) { // 10 ticks/x-labels
                // min ratio 1: x-axel's origin is in the center
                margin = margin - margin / ratio;
                margin = Math.max(margin, 40); // min margin
            }
        }
        // set up svg using margin conventions - we'll need plenty of room on the left for labels
        var dimensions = {
            margin: {
                top: 10,
                right: margin,
                bottom: 15,
                left: margin
            },
            dataset: {
                min: dataset.min,
                max: dataset.max
            },
            xAxisOffset: -5,
            width: function () {
                var width = me.containerWidth || me.defaultWidth;
                return width - this.margin.left - this.margin.right;
            },
            height: function () {
                return (me.data.length * 21) - (this.margin.top - this.margin.bottom);
            }
        };
        return dimensions;
    },
    initScales: function () {
        // from zero to max value. This could also be from min to max value, but it causes problems if
        // some values are missing -> resulting to negative widths for bars.
        // TODO: we need some proper handling for missing values AND negative values.

        this.x = d3.scaleLinear();
        this.y = d3.scaleBand();
        var dataset = this.dimensions.dataset;
        var xScaleDomain;
        if (dataset.min > 0) {
            xScaleDomain = [0, dataset.max];
        } else if (dataset.max < 0) {
            xScaleDomain = [dataset.min, 0];
        } else {
            xScaleDomain = [dataset.min, dataset.max];
        }
        var yScaleDomain = this.data.map(function (d) {
            return d.name;
        });
        this.x.domain(xScaleDomain);
        this.y.domain(yScaleDomain);
    },
    getSVGTemplate: function () {
        var svg = d3.select(this.plot.get(0)).append('svg')
            .attr('width', this.dimensions.width() + this.dimensions.margin.left + this.dimensions.margin.right)
            .attr('height', this.dimensions.height() + this.dimensions.margin.top + this.dimensions.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.dimensions.margin.left + ',' + this.dimensions.margin.top + ')');

        return svg;
    },
    getDatasetMinMax: function () {
        var min = 0;
        var max = 0;
        if (this.data) {
            min = d3.min(this.data, function (d) { return d.value; });
            max = d3.max(this.data, function (d) { return d.value; });
        }
        return {
            min: min,
            max: max
        };
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
        var me = this;
        var widestValue = Math.max(Math.abs(this.dimensions.dataset.min), this.dimensions.dataset.max);
        var numDigits = Math.floor((Math.log(widestValue) * Math.LOG10E) + 1);
        var range = this.x.range();
        var width = range[1] - range[0];
        var tickTarget = Math.floor((width / numDigits) / 10);

        this.xAxis = d3.axisTop(this.x)
            .ticks(Math.min(10, tickTarget))
            .tickSizeInner(-this.dimensions.height() + this.dimensions.xAxisOffset)
            .tickSizeOuter(0)
            .tickFormat(function (d) { return me.loc('graph.tick', {value: d}); });
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
        var maxNameLength = d3.max(data, function (d) { return d.name.length; });
        this.dimensions = this.chartDimensions(maxNameLength * 5.5);
    },
    /**
     * parses the options passed in
     *
     * @method parseOptions
     * @param  {} options
     */
    parseOptions: function (options) {
        if (options.width) {
            this.containerWidth = options.width;
        }
        this.valueRenderer = options.valueRenderer;
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

        // append the x-axis to different element so we can show the values when scrollign
        var gx = d3.select(this.axisLabelValues.get(0))
            .append('svg')
            .attr('width', this.dimensions.width() + this.dimensions.margin.left + this.dimensions.margin.right)
            .attr('height', 12)
            .append('g')
            .attr('class', 'x axis header')
            .attr('transform', 'translate(' + this.dimensions.margin.left + ',' + this.dimensions.margin.top + ')')
            .call(this.xAxis);

        gx.select('.domain').remove();
        gx.selectAll('line').remove();

        // / X
    },
    /**
     * @method setColorScale
     */
    setColorScale: function (colors) {
        this.colorScale = d3.scaleQuantize()
            .domain([0, this.data.length])
            .range(colors);
    },
    /**
     * handles data & options passed to it, initializes skeleton chart and then applies barchart specific options to the element
     * @method createBarChart
     * @param [Array] data
     * @param { Object } options keys: colors -> color scale, valueRenderer -> function for rendering bar values
     */
    createBarChart: function (data, options) {
        if (this.svg === null) {
            this.handleData(data);
        }
        if (options) {
            this._options = options;
        }

        var opts = this._options;

        if (Object.keys(opts).length !== 0) {
            this.parseOptions(opts);
        }

        this._checkColors(opts);
        this.setColorScale(opts.colors);
        this.initChart();
        var me = this;
        var originX = this.x(0);
        var textMaxLength = {
            // handleData() maxNameLength uses 5.5 px/char, 10 + 5 px for text margin
            positive: Math.floor((this.dimensions.margin.left + originX - 15) / 5.5),
            negative: Math.floor((this.dimensions.margin.right + this.dimensions.width() - originX - 15) / 5.5)
        };
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
                return me.getTextContent(d, textMaxLength);
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
            .style('fill', function (d, i) { return me.colorScale(i); })
            .attr('y', -8) // 7 is half of 15 height (pixel aligned)
            .attr('x', function (d) { return d.value ? me.x(Math.min(0, d.value)) : 0; })
            .attr('height', 17)
            .attr('width', barWidth);
        // append text
        bars.each(function (d, i) {
            var isNumber = typeof d.value === 'number';
            if (!me.valueRenderer && isNumber) {
                return;
            }
            var textAnchor = 'start';
            var transformX = '5px';
            var locationX = originX;
            var rendered = me.noValStr;
            var color = '#999';
            if (isNumber) {
                locationX = me.x(d.value);
                var width = barWidth(d);
                rendered = me.valueRenderer(d.value);
                var renderedLength = typeof rendered === 'string' ? rendered.length * 8 : 0; // 8px per char (generous)
                var fitsInBar = renderedLength < width - 10; // padding of 5px + 5px
                if (fitsInBar) {
                    color = Oskari.util.isDarkColor(me.colorScale(i)) ? '#fff' : '#000';
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
        this.handleData(data);

        if (options) {
            this._options = options;
        }

        var opts = this._options;
        if (Object.keys(opts).length !== 0) {
            this.parseOptions(opts);
        }
        this._checkColors(opts);
        this.setColorScale(opts.colors);
        this.initChart();
        var me = this;
        var linegen = d3.line()
            .x(function (d) { return me.x(d.value); })
            .y(function (d) { return me.y(d.name); });

        this.svg.append('path')
            .attr('d', linegen(this.data))
            .attr('stroke', function (d, i) { return me.colorScale(i); })
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.chartType = 'linechart';
        return this.getGraph();
    },
    getTextContent: function (d, maxLength) {
        var max = maxLength.positive;
        if (d.value < 0) {
            max = maxLength.negative;
        }
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
        // //update x & y scales
        this.y.range([ this.dimensions.height(), 0 ]);
        this.x.range([ 0, this.dimensions.width() ]);

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
        var chart;
        this.handleData(data);

        if (options) {
            this._options = options;
        }
        this._options.width = this.defaultWidth;
        // Clear previous graphs
        this.clear();
        if (this.chartType === 'barchart') {
            chart = this.createBarChart(this.data);
        } else if (this.chartType === 'linechart') {
            chart = this.createLineChart(this.data);
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
