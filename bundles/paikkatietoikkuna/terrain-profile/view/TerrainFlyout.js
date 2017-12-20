Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainFlyout',
    function (title, options, data) {
        this.loc = Oskari.getMsg.bind(null, 'TerrainProfile');
        this.makeDraggable({
            handle : '.oskari-flyouttoolbar',
            scroll : false
        });
        this._spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._updateGraph = null;
        this.update(data);
    }, {
        update: function (data) {
            if(!data) {
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

            if(this._updateGraph) {
                this._updateGraph(data);
            } else {
                this._initGraph(data);
            }
        },
        _initGraph: function (data) {
            var graphMargin = {top: 20, bottom: 30, left: 45, right: 30};
            var graphHeight = 300;
            var graphWidth = 600;
            var wrapper = document.createElement('div');
            var svg = d3.select(wrapper)
                        .append('svg')
                        .attr('height', graphHeight)
                        .attr('width', graphWidth)
                        .classed('terrainprofile-graph', true);
            
            var x = d3.scaleLinear()
                .range([graphMargin.left, graphWidth-graphMargin.right]);
            
            var y = d3.scaleLinear()
                .range([graphHeight-graphMargin.bottom, graphMargin.top]);
            
            var area = d3.area()
                .x(function(d) {
                    return x(d.distance);
                })
                .y1(function(d) {
                    return y(d.height);
                });
            var me = this;
            var xAxis = d3.axisBottom(x)
                        .tickSizeOuter(0)
                        .ticks(5)
                        .tickFormat(function(d){
                            if(d > 1000) {
                                return me.loc('legendValue', {value: d/1000}) + ' km';
                            } else {
                                return me.loc('legendValue', {value: d}) + ' m'
                            }
                        });
            var yAxis = d3.axisLeft(y)
                        .tickSizeOuter(0)
                        .tickFormat(function(d){return me.loc('legendValue', {value: d}) + ' m'});
            
            var pathContainer = svg.append('g');
            var xAxisContainer = svg.append('g')
                .attr('transform', 'translate(0 ' + (graphHeight-graphMargin.bottom) + ')');
            var yAxisContainer = svg.append('g')
                .attr('transform', 'translate(' + (graphMargin.left) + ' 0)');
            
            this._updateGraph = function(data){
                var processed = this._processData(data);
                x.domain([0, d3.max(processed[0], function(d){return d.distance})]);
                var extent = d3.extent(processed[0], function(d){return d.height});
                if(extent[0] > 0) {
                    extent[0] = 0;
                }
                y.domain(extent);
                area.y0(y(0));

                var paths = pathContainer
                            .selectAll('path')
                            .data(processed);
                
                paths.enter().append('path')
                    .attr('fill', 'steelblue')
                .merge(paths)
                    .attr('d', area);
                
                paths.exit().remove();

                xAxisContainer.call(xAxis);
                yAxisContainer.call(yAxis);
            }
            this._updateGraph(data);
            this.setContent(wrapper);
        },
        _processData: function(data) {
            var points = data.properties.distanceFromStart.map(function(d, i){
                return {distance: d, height: data.geometry.coordinates[i][2]};
            });
            return [points];
        }
    },
    {
        'extend': ['Oskari.userinterface.extension.ExtraFlyout']
    }
);
