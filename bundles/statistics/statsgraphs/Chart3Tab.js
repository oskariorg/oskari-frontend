Oskari.clazz.define('Oskari.mapframework.statsgraphs.Chart3Tab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.statsgraphs.Chart1Tab} instance
     *     reference to component that created the tile
     */

    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div id="chart3" style=" overflow: auto; resize: both; width:100%;height:100% "></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            //return this.loc.title;
            return "Scatter Plot";
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
                bindto: "#chart3",
                data: {
                    columns: [],
                    type:'scatter'
                },
                padding: {
                    right: 20
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
                    [name].concat(data)
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
