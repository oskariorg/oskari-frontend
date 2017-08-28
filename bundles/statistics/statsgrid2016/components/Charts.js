Oskari.clazz.define('Oskari.statistics.statsgrid.Charts', function(sandbox, loc, activeIndicator) {
  this.sb = sandbox;
  this.loc = loc;
  this.activeIndicator = activeIndicator;
  this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
  this.svg = null;
  this.x, this.y = null;
  this.colorScale = null;
  this.data = null;
}, {
  _template: {
    btn: _.template('<button>${ icon }</button>'),
    select: jQuery('<div class="dropdown"></div>'),
    graph: jQuery('<div id="graphic"></div>'),
    container: jQuery('<div class="dataDescriptionContainer" style="padding:10px"></div>')
  },
  chartIsInitialized: function() {
    return this.svg !== null;
  },
  sortData: function () {
    this.data = this.data.sort(function (a, b) {
      return d3.ascending(a.value, b.value);
    })
  },
  updateChart: function (data) {
    var svg = d3.select(this._template.graph[0]);
    svg.remove();
    return this.initChart(data);
  },
  updateColor: function (colors) {
    if( colors ) {
      this.initChart(null, [colors]);
    } else {
      Oskari.log("No color provided.");
    }
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
      width: function () { return 960 - this.margin.left - this.margin.right },
      height: function () { return ( me.data.length * 21 ) - ( this.margin.top - this.margin.bottom ) }
    }
    return dimensions;
  },
  /**
   * Creates the svg element but doesn't append it to DOM
   *
   * @return d3 chart as a DOM element
   */
  initChart: function (data, clr) {
    if( data ) {
      this.data = data;
      this.sortData();
    }
    var stateService = this.service.getStateService();
    var classificationOpts = stateService.getClassificationOpts(this.activeIndicator.hash);

    if( clr ) {
      var colors = clr;
    } else {
      var colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
    }
    var dimensions = this.chartDimensions();
    //init scales
    this.x = d3.scaleLinear()
    .domain([ 
      d3.min( this.data, function (d) {
        return d.value;
      }), d3.max( this.data, function (d) {
        return d.value;
      })
    ]);

    this.y = d3.scaleBand()
    .domain(this.data.map(function (d) {
      return d.name;
    }));

    this.colorScale = d3.scaleQuantize()
    .domain([0, this.data.length])
    .range(colors);

    // Init axes
    this.yAxis = d3.axisLeft(this.y)
    .tickSize(10);

    this.xAxis = d3.axisBottom(this.x)
    .tickSize(10);

    return this.render();
  },
  render: function ( data ) {
    var me = this;

    if( data ) {
      this.data = data;
      this.sortData();
    }
    //Clear previous graphs
    this._template.graph.empty(); 

    var dimensions = this.chartDimensions();
    var padding = dimensions.label.padding;
    var lblCenterPadding = dimensions.label.verticalCenterPadding;
    //update x & y scales
    this.y.range([ dimensions.height(), 0 ]);
    this.x.range([ 0, dimensions.width() ]);
    

    this.svg = d3.select(this._template.graph[0]).append("svg")
    .attr("width", dimensions.width() + dimensions.margin.left + dimensions.margin.right)
    .attr("height", dimensions.height() + dimensions.margin.top + dimensions.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

    //groups
    var gy = this.svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0," + (padding + lblCenterPadding) + ")")
    .call(this.yAxis)

    var gx = this.svg.append("g")
    .attr("class", "x axis")
    .call(this.xAxis)

    var graph = this._template.graph;
    if( this.data === null ) {
      graph.append(jQuery('<h3>'+this.loc.datacharts.nodata+'</h3>'));
      return;
    }

    function make_x_gridlines() {
      return d3.axisBottom(me.x)
          .ticks(10)
    }
    function zoomed() {
      // create new scale ojects based on event
      var new_xScale = d3.event.transform.rescaleX(me.x)
      var new_yScale = d3.event.transform.rescaleY(me.y)
      console.log(d3.event.transform)

      // update axes
      gX.call(me.xAxis.scale(new_xScale));
      gY.call(me.yAxis.scale(new_yScale));

    }
    var zoom = d3.zoom()
    .on("zoom", zoomed);

    // add the X gridlines
    this.svg.append("g")
    .attr("class", "grid")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0," +  dimensions.height() + ")")
    .call(make_x_gridlines()
    .tickSize(-dimensions.height() +30, 0, 0)
    .tickFormat("")
    )
    .call(zoom)

    var bars = this.svg.selectAll(".bar")
    .data(this.data)
    .enter()
    .append("g")

    //append rects
    bars.append("rect")
    .attr("class", "bar")
    .attr("text-anchor", "middle")
    .attr("y", function (d) {
      return me.y(d.name) + me.y.bandwidth() / 2 + padding;
    })
    .style('fill',function(d,i){ return me.colorScale(i); })
    .attr("height", 15)
    .attr("x", 0)
    .attr("width", function (d) {
      return me.x(d.value);
    });
      // window.addEventListener('resize', svg.render);

    return this._template.graph;
  },
  createChart: function (data, clr) {

  }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
     protocol: ['Oskari.userinterface.Flyout']
  });
