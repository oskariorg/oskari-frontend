Oskari.clazz.define('Oskari.userinterface.component.Chart', function(sandbox, loc) {
  this.sb = sandbox;
  this.loc = loc;
  this.svg = null;
  this.dimensions = this.chartDimensions();
  this.x = null;
  this.y = null;
  this.colorScale = null;
  this.data = null;
  this.chartType = null;
  this.containerWidth = null;
  this._g = null;
  this._options = {
    colors: ['#ebb819']
  };
}, {
    _template: {
        graph: jQuery('<div id="graphic" style="width:100%"></div>')
    },
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
    sortData: function () {
        this.data = this.data.sort(function (a, b) {
            return d3.ascending(a.value, b.value);
        });
    },
    chartDimensions: function () {
        var me = this;
            //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var dimensions = {
            margin: {
                top: 15,
                right: 25,
                bottom: 15,
                left: 80
            },
            label: {
                padding: 20,
                verticalCenterPadding: 8
            },
            width: function () {
                var width = me.containerWidth || 500;
                return width - this.margin.left - this.margin.right;
            },
            height: function () {
                return ( me.data.length * 21 ) - ( this.margin.top - this.margin.bottom );
            }
        };
        return dimensions;
    },
    createGridlines: function () {
        return d3.axisBottom( this.x ).ticks(10);
    },
    initScales: function () {
        this.x = d3.scaleLinear()
        .domain([ d3.min( this.data, function ( d ) {
                return d.value;
            }), d3.max( this.data, function ( d ) {
                return d.value;
            })
        ]);

        this.y = d3.scaleBand()
        .domain( this.data.map ( function ( d ) {
            return d.name;
        }));
    },
    initSVG: function () {
        var svg = d3.select( this._template.graph[0] ).append("svg")
            .attr( "width", this.dimensions.width() + this.dimensions.margin.left + this.dimensions.margin.right )
            .attr( "height", this.dimensions.height() + this.dimensions.margin.top + this.dimensions.margin.bottom )
            .append( "g" )
            .attr( "transform", "translate(" + this.dimensions.margin.left + "," + this.dimensions.margin.top + ")" );
        this.svg = svg;
        return svg;
    },
    /**
     * d3 axis are functions that generate svg-elements based on the scale given
     * @method initAxis
     *
     */
    initAxis: function () {
        this.yAxis = d3.axisLeft( this.y )
        .tickSize(10);

        this.xAxis = d3.axisBottom( this.x )
        .tickSize(10);
    },
    /**
     * initializes the chart skeleton without any specific line or bar options
     *
     * @method initChart
     *
     */
    initChart: function () {
        var svg = this.initSVG();
        var scales = this.initScales();
        var chart = this.chart( svg );
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
        this.sortData( this.data );
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
    /**
     *
     * @method callGroups
     */
    callGroups: function () {
        var padding = this.dimensions.label.padding;
        var lblCenterPadding = this.dimensions.label.verticalCenterPadding;
        //groups
        var gy = this.svg.append( "g" )
            .attr( "class", "y axis" )
            .attr( "transform", "translate(0," + (padding + lblCenterPadding) + ")" )
            .call( this.yAxis );

        var gx = this.svg.append( "g" )
            .attr( "class", "x axis" )
            .call( this.xAxis );
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
        if( data != undefined ) {
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
        var bars = this.svg.selectAll(".bar")
            .data(this.data)
            .enter()
            .append("g");

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("text-anchor", "middle")
            .attr("y", function (d) {
                return me.y( d.name ) + me.y.bandwidth() / 2 + me.dimensions.label.padding;
            })
            .style('fill', function( d,i ){ return me.colorScale(i); })
            .attr("height", 15)
            .attr("x", 0)
            .attr("width", function (d) {
                return me.x(d.value);
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
        //update x & y scales
        this.y.range( [ this.dimensions.height(), 0 ] );
        this.x.range( [ 0, this.dimensions.width() ] );

        selection.each( function ( data ) {
            // this._g = me.svg.select(this).append('g');
            me.initAxis();
            me.callGroups();
            // add the X gridlines
            me.svg.append("g")
                .attr("class", "grid")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(0," +  me.dimensions.height() + ")")
                .call( me.createGridlines()
                .tickSize( -me.dimensions.height() +30, 0, 0 )
                .tickFormat("")
            );
        });
    },
    clear: function () {
        this._template.graph.empty();
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
        opts.width = 620;
        //Clear previous graphs
        this.clear();
        if( this.chartType === 'barchart' ) {
            chart = this.createBarChart( this.data, opts );
        } else if( this.chartType === 'linechart' ) {
            chart = this.createLineChart( this.data, opts );
        }

        return chart;
    },
    getGraph: function() {
        return this._template.graph;
    }
});