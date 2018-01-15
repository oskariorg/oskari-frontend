Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainFlyout',
    function (title, options, markerHandler) {
        this.loc = Oskari.getMsg.bind(null, 'TerrainProfile');
        this.makeDraggable({
            handle: '.oskari-flyouttoolbar',
            scroll: false
        });
        this._spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._updateGraph = null;
        this.markerHandler = markerHandler;
    }, {
        update: function (data) {
            if (!data) {
                this._updateGraph = null;
                var spinnerHolder = jQuery('<div class="terrainprofile-spinnerholder"></div>');
                var wrapper = jQuery('<div class="terrainprofile-spinnerwrapper"></div>');
                wrapper.append(spinnerHolder);
                this.setContent(wrapper);
                this._spinner.insertTo(spinnerHolder);
                this._spinner.start();
                return;
            }
            this._spinner.stop();

            if (this._updateGraph) {
                this._updateGraph(data);
            } else {
                this._initGraph(data);
            }
        },
        _initGraph: function (data) {
            var graphMargin = { top: 25, bottom: 30, left: 45, right: 30 };
            var graphHeight = 300;
            var graphWidth = 600;
            var wrapper = document.createElement('div');
            var svg = d3.select(wrapper)
                .append('svg')
                .attr('height', graphHeight)
                .attr('width', graphWidth)
                .classed('terrainprofile-graph', true);

            // Set up scales & axes

            var x = d3.scaleLinear()
                .range([graphMargin.left, graphWidth - graphMargin.right]);

            var y = d3.scaleLinear()
                .range([graphHeight - graphMargin.bottom, graphMargin.top]);

            var area = d3.area()
                .x(function (d) {
                    return x(d.distance);
                })
                .y1(function (d) {
                    return y(d.height);
                });
            var me = this;
            var xAxis = d3.axisBottom(x)
                .tickSizeOuter(0)
                .ticks(5)
                .tickFormat(function (d) {
                    if (d > 1000) {
                        return me.loc('legendValue', { value: d / 1000 }) + ' km';
                    } else {
                        return me.loc('legendValue', { value: d }) + ' m'
                    }
                });
            var yAxis = d3.axisLeft(y)
                .tickSizeOuter(0)
                .ticks(4)
                .tickSizeInner(-graphWidth + graphMargin.right + graphMargin.left)
                .tickFormat(function (d) { return me.loc('legendValue', { value: d }) + ' m' });

            // Set up container groups (for draw ordering)

            var pathContainer = svg.append('g');

            svg.append('rect') // mask above graph
                .attr('fill', '#fafafa')
                .attr('x', 0)
                .attr('y', -10)
                .attr('width', graphWidth)
                .attr('height', graphMargin.top + 10);

            var cursor = svg.append('g');

            svg.append('rect') // mask below graph
                .attr('fill', '#fafafa')
                .attr('x', 0)
                .attr('y', graphHeight - graphMargin.bottom)
                .attr('width', graphWidth)
                .attr('height', graphMargin.bottom + 10);

            var xAxisContainer = svg.append('g')
                .attr('transform', 'translate(0 ' + (graphHeight - graphMargin.bottom) + ')');
            var yAxisContainer = svg.append('g')
                .classed('y-axis', true)
                .attr('transform', 'translate(' + (graphMargin.left) + ' 0)');

            // Set up Y-axis scaling

            var resetScalingButton = svg.append('g').classed('reset-scaling', true);
            resetScalingButton.append('path')
                .attr('d', 'M -7 -1 L 7 -1 L 0 -7 Z');
            resetScalingButton.append('path')
                .attr('d', 'M -7 2 L 7 2 L 0 8 Z');
            resetScalingButton.append('path')
                .classed('touch-area', true)
                .attr('d', 'M -15 -15 L 15 -15 L 15 15 L -15 15 Z')
                .on('click', function () {
                    recalculateYDomain();
                    me._updateGraph();
                    resetScalingButton.style('display', 'none');
                });
            resetScalingButton
                .attr('transform', 'translate(' + graphMargin.left / 2 + ' ' + graphMargin.top / 2 + ')');
            resetScalingButton.style('display', 'none');

            var brush = d3.brushY()
                .extent([[graphMargin.left, graphMargin.top], [graphWidth - graphMargin.right, graphHeight - graphMargin.bottom]])
                .on('end', brushed);

            var brushGroup = svg.append('g')
                .classed('axis-brush', true)
                .call(brush);

            function brushed() {
                var selection = d3.event.selection;
                if (!selection) {
                    return;
                }
                var start = y.invert(selection[1]);
                var end = y.invert(selection[0]);
                brushGroup.call(brush.move, null);
                y.domain([start, end]);
                resetScalingButton.style('display', null);
                me._updateGraph();
            }

            // Setup hover cursor

            cursor
                .attr('class', 'cursor')
                .style('display', 'none');

            cursor.append('line')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', graphMargin.top)
                .attr('y2', graphHeight - graphMargin.bottom);

            var focus = cursor.append('g');

            focus.append('circle')
                .attr('r', 5);

            focus.append('text')
                .attr('y', -16)
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em');

            brushGroup.select('.overlay') // reuse brush overlay element
                .on('mouseover', function () {
                    cursor.style('display', null);
                })
                .on('mouseout', function () {
                    cursor.style('display', 'none');
                    me.markerHandler.hide();
                })
                .on('mousemove', mousemove);

            var bisectX = d3.bisector(function (d) { return d.distance; }).left;

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectX(processed[0], x0, 1),
                    d0 = processed[0][i - 1],
                    d1 = processed[0][i],
                    d = x0 - d0.distance > d1.distance - x0 ? d1 : d0;
                if (d.height < y.domain()[0]) { // below minimum
                    cursor.style('display', 'none');
                } else {
                    cursor.style('display', null);
                }
                cursor.attr('transform', 'translate(' + x(d.distance) + ' 0)');
                cursor.select('line').attr('y1', y(d.height));
                focus.attr('transform', 'translate(0 ' + y(d.height) + ')');
                var text = me.loc('legendValue', { value: d.height });
                cursor.select('text').text(text);

                me.markerHandler.showAt(d.coords[0], d.coords[1], text);
            }

            var processed;

            function recalculateYDomain() {
                var extent = d3.extent(processed[0], function (d) { return d.height });
                if (extent[0] > 0) {
                    extent[0] = 0;
                }
                y.domain(extent);
            }

            // graph update function

            this._updateGraph = function (data) {
                if (data) {
                    processed = this._processData(data);
                    x.domain([0, d3.max(processed[0], function (d) { return d.distance })]);
                    recalculateYDomain();
                    resetScalingButton.style('display', 'none');
                }
                area.y0(y(0));

                var paths = pathContainer
                    .selectAll('path')
                    .data(processed);

                paths.enter().append('path')
                    .attr('fill', '#ebb819')
                    .merge(paths)
                    .attr('d', area);

                paths.exit().remove();

                xAxisContainer.call(xAxis);
                yAxisContainer.call(yAxis);
            }
            this._updateGraph(data);
            this.setContent(wrapper);
        },
        _processData: function (data) {
            var points = data.properties.distanceFromStart.map(function (d, i) {
                return { distance: d, height: data.geometry.coordinates[i][2], coords: data.geometry.coordinates[i] };
            });
            return [points];
        }
    },
    {
        'extend': ['Oskari.userinterface.extension.ExtraFlyout']
    }
);
