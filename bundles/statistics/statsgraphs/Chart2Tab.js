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

        initChart: function() {
            if (this.chart) {
                return;
            }

            this.chart = c3.generate({
                bindto: "#chart2",
                data: {
                    columns: []
                },

                padding: {
                    right: 20,

                },

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
    }
);
