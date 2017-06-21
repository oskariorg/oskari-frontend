Oskari.clazz.define('Oskari.statistics.statsgrid.Charts', function(sandbox, loc, data) {
  this.sb = sandbox;
  this.loc = loc;
  this.data = data;
  this.__chartFlyout = null;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  this.container = null;
}, {
  _template: {
    btn: _.template('<button>${ icon }</button>'),
    select: jQuery('<div class="dropdown"></div>'),
    graph: jQuery('<div id="graphic"></div>'),
    container: jQuery('<div class="dataDescriptionContainer" style="padding:20px"></div>')
  },
  createDropdown: function () {
    var dataOptions = {
        placeholder_text: "asd",
        allow_single_deselect : true,
        disable_search_threshold: 10,
        no_results_text: "locale.panels.newSearch.noResults",
        width: '100%'
    };
    var dataSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    var dataDropdown = dataSelect.create(undefined, dataOptions);
    dataDropdown.css({width:'100%'});
    this._template.select.append(dataDropdown);
    dataSelect.adjustChosen();

    var clrOptions = {
        placeholder_text: "asd",
        allow_single_deselect : true,
        disable_search_threshold: 10,
        no_results_text: "locale.panels.newSearch.noResults",
        width: '100%'
    };
    var clrSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    var clrDropdown = clrSelect.create(undefined, clrOptions);
    clrDropdown.css({width:'100%'});
    this._template.select.append(clrDropdown);
    clrSelect.adjustChosen();

    this._template.container.append(this._template.select);
  },
  createChart: function () {
    var graph = this._template.graph;
    if(this.data === null) {
      graph.append(jQuery('<h3>'+this.loc.datacharts.nodata+'</h3>'));
      return;
    }
    var me = this;
    graph.append(this._template.btn({icon:"Zoom In"}));
    graph.append(this._template.btn({icon:"Zoom Out"}));
    //sort bars based on value
    this.data = this.data.sort(function (a, b) {
      return d3.ascending(a.value, b.value);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
      top: 15,
      right: 25,
      bottom: 15,
      left: 60
    };
    var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

    var width = 960 - margin.left - margin.right,
    height = this.data.length * 20 - margin.top - margin.bottom;

    var svg = d3.select(this._template.graph[0]).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function make_x_gridlines() {
    return d3.svg.axis()
        .scale(x)
        // .orient("bottom")
        .ticks(me.data.length)
    }
    function zoomed() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);
    }

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(this.data, function (d) {
      return d.value;
    })]);

    var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1)
    .domain(this.data.map(function (d) {
      return d.name;
    }));

    var colorScale = d3.scale.quantize()
        .domain([0, this.data.length])
        .range(colors);

    //make y axis to show bar names
    var yAxis = d3.svg.axis()
    .scale(y)
    //no tick marks
    .tickSize(1)
    .orient("left");

    var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

    //make x axis to show bar values
    var xAxis = d3.svg.axis()
    .scale(x)
    //no tick marks
    .tickSize(10)
    .orient("bottom");

    var gx = svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)

    var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

    // add the X gridlines
svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height +25, 0, 0)
        .tickFormat("")
    )
    .call(zoom)

    var bars = svg.selectAll(".bar")
    .data(this.data)
    .enter()
    .append("g")

    //append rects
    bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
      return y(d.name) + y.rangeBand() / 2;
    })
    .style('fill',function(d,i){ return colorScale(i); })
    .attr("height", 15)
    .attr("x", 0)
    .attr("width", function (d) {
      return x(d.value);
    });
    return this._template.graph;
    // this._template.container.append(this._template.graph);
  }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
     protocol: ['Oskari.userinterface.Flyout']
  });
