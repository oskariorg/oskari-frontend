Oskari.clazz.define('Oskari.mapframework.statsgraphs.Chart1Tab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.statsgraphs.Chart1Tab} instance
     *     reference to component that created the tile
     */

    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div id="chart1" style=" width:100%; height: 100%; overflow: auto; resize: both; padding-right:40px;padding-left:40px; "></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            //return this.loc.title;
            return "Bar Chart";
        },
        addTabContent: function (container) {
            var content = this.template.clone();
            container.append(content);
        },

        initChart: function(regions, data) {
            if (this.chart) {
                // ui not on screen yet
                this.chart = this.removeChart();
            }
            if(!arguments.length) {
                return;
            }

            this.chart = c3.generate({
                bindto: "#chart1",
                data: {
                    columns: data,
                    type:'bar',
                    onclick: function (d, element) {
                        //give the id and index of the latest data set.
                    },
                    onmouseover: function (d) {

                        //var k = ".c3-shape-" + d.index;
                        //make the bar red
                        //d3.selectAll(k).style("fill", "red");
                        //event.stopPropagation();

                        //make all teh bar opacity 0.1
                        d3.selectAll(".c3-shape").style("opacity", 0.5);
                        var k = ".c3-shape-" + d.index;
                        //make the clicked bar opacity 1
                        d3.selectAll(k).style("opacity", 1);
                        event.stopPropagation();

                        },
                    onmouseout: function (d) {
                        d3.selectAll(".c3-shape").style("opacity", 1);

                        //var k = ".c3-shape-" + d.index;
                        //make the clicked bar opacity
                        //d3.selectAll(k).style("fill",'#1f77b4');
                    }
                },
                grid: {
                    x: {
                        show: true
                    }
                },
                subchart: {
                    show: true

                },
                size: {
                    height: 400
                },
                padding: {
                    right: 20
                },
                axis : {
                    x : {
                        type : 'category',
                        categories : regions,
                        tick: {

                            multiline: false,
                            culling: {
                                max: 5 // the number of tick texts will be adjusted to less than this value
                            }
                        }
                    }
                }
            });

//hacking way of creating charts ..Try to find better way!
            this.chart = c3.generate({
                bindto: "#chart2",
                data: {
                    columns: data,
                    type:'line'
                },
                grid: {
                    x: {
                        show: true
                    }
                },
                subchart: {
                    show: true
                },
                size: {
                    height: 400
                },
                padding: {
                    right: 20

                },
                axis : {
                    x : {
                        type : 'category',
                        categories : regions,
                        tick: {

                            multiline: false,
                            culling: {
                                max: 5 // the number of tick texts will be adjusted to less than this value
                            }
                        }
                    }
                }
            });
            this.chart = c3.generate({
                bindto: "#chart3",
                data: {
                    columns: data,
                    type:'scatter'
                },
                grid: {
                    x: {
                        show: true
                    }
                },
                size: {
                    height: 400
                },
                padding: {
                    right: 20
                },
                axis : {
                    x : {
                        type : 'category',
                        categories : regions,
                        tick: {
                            multiline: false,
                            culling: {
                                max: 5 // the number of tick texts will be adjusted to less than this value
                            }
                        }
                    }
                }
            });
        },

        showChart : function(data) {
            var list = data.indicators;
            if(!list.length) {
                return;
            }
            var sortBy = list[0].hash;
            var itemsToSort = data.data;

            itemsToSort.sort(function(a, b) {
                return (a.values[sortBy] || 0) - (b.values[sortBy] || 0);
            });
            var sortedRegions = [];
            var sortedValues = {};
            list.forEach(function(ind) {
                //This is for readable selectors like year:1994 sex: male
                var txt = "";
                var sel = ind.selections;
                var x;
                for (x in sel) {
                    if (sel.hasOwnProperty(x)) {
                        txt += x +": " + sel[x] + " ";
                    }
                }
                sortedValues[ind.hash] = [ind.name + ' ' + txt];
            });

            itemsToSort.forEach(function(item) {
                sortedRegions.push(item.name);
                for(var hash in item.values) {
                    sortedValues[hash].push(item.values[hash]);
                }
            });
            var values = [];
            var me = this;
            for(var hash in sortedValues) {
                values.push(me.sanitize(sortedValues[hash]));
            }


            this.initChart(sortedRegions, values);

        },
        sanitize : function(list, defaultValue)  {

            var sanitized = [];

            // c3 doesn't like null/undefined -> map to zero
            list.forEach(function(item) {
                if(item) {
                    sanitized.push(item);
                }
                else {
                    sanitized.push(defaultValue || 0);
                }
            });
            return sanitized;
        },

        drawChart: function(name,regions,data) {
            var regionNames = [];
            var itemsToSort = [];
            regions.forEach(function(reg, index) {
                regionNames.push(reg.name);
                itemsToSort.push({
                    regionId : reg.id,
                    name : reg.name,
                    value : data[index]

                });
            });

            itemsToSort.sort(function(a, b) {
                return a.value - b.value;
            });
            var sortedRegions = [];
            var sortedValues = [];

            itemsToSort.forEach(function(item) {
                sortedRegions.push(item.name);
                sortedValues.push(item.value);
            });



            /*
            // maybe save reference to latest data shown on chart
            this.latestData = itemsToSort;
            Answer:It is now done on mouse events. In each mouse events it logs  the data to console so it can be used.
            // so we can map an c3 event.index of hover/click to region id
            this.latestData[event.index].regionId
*/

            this.initChart(sortedRegions, [[name].concat(sortedValues)]);
        },

        removeChart: function() {
            //this.chart = this.chart.destroy();
            //Maybe i can find better way on close
            this.chart = null;
        }
    });

