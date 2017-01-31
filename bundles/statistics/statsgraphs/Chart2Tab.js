Oskari.clazz.define('Oskari.mapframework.statsgraphs.Chart2Tab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.statsgraphs.Chart2Tab} instance
     *     reference to component that created the tile
     */

    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div id="chart2" style="overflow: auto; resize: both; padding-right:40px;padding-left:40px; "></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            //return this.loc.title;
            return "Line Chart";
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
                bindto: "#chart2",
                data: {
                    columns: data

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
                        categories : regions
                    }
                }
            });
        },
        /*
         Data is in this format:
         {
         regionset : {
         id : 1234,
         name : "Municipalities"
         },
         indicators : [
         {
         datasource : {
         id : 12,
         name : "SotkaNet"
         },
         id : 346,
         name : "indicator name",
         selections : {
         sex : 'male',
         year : '1993'
         },
         hash : 'unique id for ds, id and selections'
         }
         ],
         data : [
         {
         id : 2353,
         name : "municipality name",
         values : {
         hash1 : value of indicator with hash1,
         hash2 : value of indicator with hash2
         }
         }
         ]
         }
         */
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
                sortedValues[ind.hash] = [ind.name + ' ' + JSON.stringify(ind.selections)];
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

            /*
             // maybe save reference to latest data shown on chart
             this.latestData = itemsToSort;
             // so we can map an c3 event.index of hover/click to region id
             this.latestData[event.index].regionId
             */

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
             // so we can map an c3 event.index of hover/click to region id
             this.latestData[event.index].regionId
             */

            this.initChart(sortedRegions, [[name].concat(sortedValues)]);
        },

        removeChart: function() {
            this.chart = null;
        }
    });

