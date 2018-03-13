Oskari.clazz.define('Oskari.userinterface.component.Chart', function() {
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
    colors:  ['#555','#555']
  };
  this.loc = Oskari.getMsg.bind(null, 'DivManazer');
  this.noValStr = this.loc('graph.noValue');
}, {
    _checkColors: function ( opts ) {
        var options = opts || {};
        options.colors = options.colors || this._options.colors;
        if ( typeof options.colors === 'string' ) {
            options.colors = [options.colors];
        } else if ( options.colors ) {
            options.colors = options.colors;
        }
    },
    chartIsInitialized: function () {
        return this.svg !== null;
    },
    chartDimensions: function (sideMargin) {
        var me = this;
        var margin = sideMargin ? Math.min(sideMargin, 140) : 80;
            //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var dimensions = {
            margin: {
                top: 10,
                right: margin,
                bottom: 15,
                left: margin
            },
            xAxisOffset: -5,
            width: function () {
                var width = me.containerWidth || me.defaultWidth;
                return width - this.margin.left - this.margin.right;
            },
            height: function () {
                return ( me.data.length * 21 ) - ( this.margin.top - this.margin.bottom );
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
        var dataset = this.getDatasetMinMax();
        var xScaleDomain;

        if ( !this.dataHasNegativeValues() ) {
            xScaleDomain = [ 0, dataset.max]
        } else {
            xScaleDomain = d3.extent(this.data, function ( d ) {return d.value; } );
        }
        var yScaleDomain = this.data.map( function ( d ) {
            return d.name;
        });
        this.x.domain( xScaleDomain );
        this.y.domain( yScaleDomain );
    },
    getSVGTemplate: function () {
        var svg = d3.select( this.plot.get(0) ).append("svg")
            .attr( "width", this.dimensions.width() + this.dimensions.margin.left + this.dimensions.margin.right )
            .attr( "height", this.dimensions.height() + this.dimensions.margin.top + this.dimensions.margin.bottom )
            .append( "g" )
            .attr( "transform", "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")" );

        return svg;
    },
    getDatasetMinMax: function () {
        var min = d3.min(this.data, function ( d ) { return d.value; });
        var max = d3.max(this.data, function ( d ) { return d.value; });
        return {
            min: min,
            max: max
        }
    },
    nullsLast: function (a, b) {
        if(a == null && b == null) return 0;
        if(a == null) return -1;
        if(b == null) return 1;
        return 0;
    },
    /**
     *
     * @method sortDataByType
     * @param { String } type - indicates what sort of sorting we want to apply to our chart.
     * if no type provided it will default to value ascending
     */
    sortDataByType: function ( type ) {
        var me = this;
        // empty string ("") is the placeholder value from selectlist
        if ( !this.sortingType ) {
            if ( typeof type === "undefined" || type === "" ) {
                type = 'value-descending';
            } 
        } else if( type === undefined || type === "" ) {
            type = this.sortingType;
        }

        switch( type ) {
            case "name-ascending":
                me.data.sort(function (a, b) {
                    return d3.descending(a.name , b.name);
                });
            break;
            case "name-descending":
                me.data.sort(function (a, b) {
                    return d3.ascending(a.name , b.name);
                });
            break;
            case "value-ascending":
                me.data.sort(function (a, b) {
                    var result = me.nullsLast(a.value, b.value);
                    if (!result) {
                        return d3.descending(a.value, b.value);
                    }
                    return result;
                });
            break;
            case "value-descending":
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
        var maxValue = d3.max(this.data, function (d) {return d.value});
        var numDigits = Math.floor((Math.log(maxValue) * Math.LOG10E) + 1);
        var range = this.x.range();
        var width = range[1] - range[0];
        var tickTarget = (width / numDigits) / 10;

        this.xAxis = d3.axisTop( this.x )
        .ticks(Math.min(10, tickTarget))
        .tickSizeInner(-this.dimensions.height()+this.dimensions.xAxisOffset)
        .tickSizeOuter(0)
        .tickFormat(function (d) {return me.loc('graph.tick', {value: d})});
    },
    /**
     * initializes the chart skeleton without any specific line or bar options
     *
     * @method initChart
     *
     */
    initChart: function () {
        this.svg = this.getSVGTemplate();
        var scales = this.initScales();
        var chart = this.chart( this.svg );
        return chart;
    },
    /**
     * sets this.data and sorts the values in ascending order
     *
     * @method handleData
     * @param  [] data only supports following format: [ { name: "", value: int } ]
     */
    handleData: function ( data ) {
        this.data = data;
        this.sortDataByType();
        var maxNameLength = d3.max(data, function (d) {return d.name.length});
        this.dimensions = this.chartDimensions(maxNameLength * 5.5);
    },
    /**
     * parses the options passed in
     *
     * @method parseOptions
     * @param  {} options
     */
    parseOptions: function ( options ) {
        if( options.width ) {
            this.containerWidth = options.width;
        }
    },
    dataHasNegativeValues: function () {
        var dataset = this.getDatasetMinMax();
        return dataset.min < 0;
    },
    /**
     *
     * @method svgAppendElements
     */
    svgAppendElements: function () {
        var me = this;

        // append x-tick lines to chart
        var xtickAxis = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate( 0, 0)")
            .attr('shape-rendering', 'crispEdges')
            .call(this.xAxis);

            xtickAxis.selectAll("x axis, tick, text").remove();
            xtickAxis.select('.domain').remove();

        xtickAxis.selectAll('line')
            .attr('stroke', '#aaa')

            //append the x-axis to different element so we can show the values when scrollign
            var gx = d3.select( this.axisLabelValues.get(0) )
            .append("svg")
            .attr( "width", this.dimensions.width() + this.dimensions.margin.left + this.dimensions.margin.right )
            .attr( "height", 12 )
            .append("g")
            .attr("class", "x axis header")
            .attr( "transform", "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")" )
            .call(this.xAxis);

            gx.select('.domain').remove();
            gx.selectAll('line').remove();

            // / X
        },
    /**
     * @method setColorScale
     */
    setColorScale: function ( colors ) {
        this.colorScale = d3.scaleQuantize()
            .domain( [0, this.data.length] )
            .range( colors );
    },
    /**
     * handles data & options passed to it, initializes skeleton chart and then applies barchart specific options to the element
     * @method createBarChart
     * @param [Array] data
     * @param { Object } options if options color is passed it needs to be an array for d3 to apply it
     */
    createBarChart: function ( data, options ) {
        if( data != undefined && this.svg === null ) {
            this.handleData( data );
        }
        var opts = options || this._options;

        if( Object.keys(opts).length !== 0 ) {
            this.parseOptions( opts );
        }

        this._checkColors(opts);
        this.setColorScale(opts.colors);
        this.initChart();

        var me = this;

        // labels
        var labels = this.svg.append('g')
            .selectAll(".labels")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", function ( d ) { return d.value < 0 ? "labels negative" : "labels positive" } )
            .attr("transform", function ( d ) {
                var marginized = me.y(d.name) + 11;
                return  "translate("+ me.x(0) +","+ marginized +")";
            })
        //append lines
        labels.append("line")
            .attr('x2', function ( d ) {
                if ( d.value < 0 ) {
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
        //append text
        labels.append("text")
            .attr("text-anchor", function (d) {
                if ( d.value < 0 ) {
                    return "start";
                }
                return "end";
            })
            .attr('x', function ( d ) {
                if ( d.value < 0 ) {
                    return 8;
                } else {
                    return -8;
                }
            })
            .attr('dy', '0.32em')
            .style('font-size', '11px')
            .attr('fill', '#000')
            .text(function (d) {
                return d.name;
            });

        // bars
        var bars = this.svg.insert('g','g.y').selectAll(".bar")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", function ( d ) { return d.value < 0 ? "negative" : "positive" } )
            .attr('transform', function ( d ) {
                return 'translate(0,' + ( me.y( d.name ) + me.y.bandwidth() / 2 ) + ')';
            });

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("text-anchor", "middle")
            .style('fill', function( d,i ){ return me.colorScale(i); }) 
            .attr("y", -8) // 7 is half of 15 height (pixel aligned)
            .attr("x", function ( d ) { return d.value ? me.x( Math.min( 0, d.value ) ) : 0 })
            .attr("height", 17)
            .attr("width", function( d ) {
                 return d.value ? Math.abs( me.x( d.value ) - me.x( 0 ) ) : 0; 
            });
        //append text
        bars.each(function (d) {
            if(typeof d.value === 'number') {
                return;
            }
            d3.select(this)
            .append('text')
            .attr('x',  me.x( 0 ) + 10 )
            .attr('y', 0)
            .attr('dy', '0.32em')
            .style('font-size', '11px')
            .attr('fill', '#999')
            .text(me.noValStr);
        });

        this.chartType = 'barchart';
        return this.getGraph();
    },
    /**
     * handles data & options passed to it, initializes skeleton chart and then applies linechart specific options to the element
     * @method createLineChart
     */
    createLineChart: function ( data, options ) {
        if( data != undefined ) {
            this.handleData( data );
        }

        var opts = options || this._options;
        if ( Object.keys( opts ).length !== 0 ) {
            this.parseOptions( opts );
        }
        this._checkColors( opts );
        this.setColorScale( opts.colors );
        this.initChart();
        var me = this;
        var linegen = d3.line()
            .x(function(d) { return me.x( d.value ); })
            .y(function(d) { return me.y( d.name ); });

        this.svg.append('path')
            .attr( 'd', linegen( this.data ) )
            .attr( 'stroke', function( d,i ){ return me.colorScale( i ); } )
            .attr( 'stroke-width', 2 )
            .attr( 'fill', 'none' );

        this.chartType = 'linechart';
        return this.getGraph();
    },
    /**
     * skeleton chart with no data applied to it
     * @method chart
     * @param  d3 svg-element
     */
    chart: function ( selection ) {
        var me = this;
        // //update x & y scales
        this.y.range( [ this.dimensions.height(), 0 ] );
        this.x.range( [ 0, this.dimensions.width() ] );

        selection.each( function ( data ) {
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
    redraw: function ( data, options ) {
        var chart;
        if( data != undefined ) {
            this.handleData( data );
        }

        var opts = options || {};
        opts.width = this.defaultWidth;
        //Clear previous graphs
        this.clear();
        if( this.chartType === 'barchart' ) {
            chart = this.createBarChart( this.data, opts );
        } else if( this.chartType === 'linechart' ) {
            chart = this.createLineChart( this.data, opts );
        }

        return chart;
    },
    getGraphAxisLabels: function () {
        return this.axisLabelValues;
    },
    getGraph: function() {
        return this.plot;
    }
});