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
        this.template = jQuery('<div id="chart1" style="overflow: auto; resize: both; padding-right:40px;padding-left:40px; "></div>');
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
                    columns: [data],
                    type:'bar'
                },
                subchart: {
                    show: true
                },
                size: {
                    height: 400,
                },
                padding: {
                    right: 20,

                },
                axis : {
                    x : {
                        type : 'category',
                        categories : regions
                    }
                }
            });
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
            // so we can map an c3 event.index of hover/click to region id
            this.latestData[event.index].regionId
*/

            this.initChart(sortedRegions, [name].concat(sortedValues));
        },

        removeChart: function() {
            this.chart = this.chart.destroy();
            this.chart = null;
        }
    });

