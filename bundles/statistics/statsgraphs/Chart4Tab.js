Oskari.clazz.define('Oskari.mapframework.statsgraphs.Chart4Tab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.statsgraphs.Chart1Tab} instance
     *     reference to component that created the tile
     */



    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div id="chart4" style="overflow: auto; resize: both; padding-right:40px;padding-left:40px; "></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            //return this.loc.title;
            return "Y Line Chart";
        },
        addTabContent: function (container) {
            var content = this.template.clone();
            container.append(content);
        },


        initChart: function() {
            if (this.chart) {
                return;
            }

            this.chart = c3.generate({
                bindto: "#chart4",
                data: {
                    columns: [],
                    type:'bar',

                    //These are the events.

                   onclick: function(e) {
                        var k = ".c3-shape-"+ e.index;
                        //make the clicked bar opacity 1
                        d3.selectAll(k).style({"opacity":1,'stroke': 'red', 'stroke-width': 4} )
                        event.stopPropagation()
                    },


                    /* 
                    onmouseover: function (e) {
                        var k = ".c3-shape-"+ e.index;
                        //make the clicked bar opacity 1
                        d3.selectAll(k).style("fill", "red")
                    },
                    onmouseout: function (e) {
                        var k = ".c3-shape-"+ e.index;
                        //make the clicked bar opacity 1
                        d3.selectAll(k).style("fill", "yellow")
                    },




                    color: function (color, d) {
                        return d.value > 150 ? "yellow" : "blue";

                    }
                    */
                },
                padding: {
                    right: 20,

                },
                
                axis: {
                    rotated: true
                },
                tooltip: {
                    show: true
                }


            });
        },

        drawChart: function(name,regions,data) {
            if (!this.chart) {
                // ui not on screen yet
                return;
            }

            this.chart.load({
                columns: [
                    [name].concat(data),
                ],
                keys: {
                    // this doesn't seem to work really
                    value: regions
                }
            });
        },

        removeChart: function() {
            this.chart = null;
        }
    });

