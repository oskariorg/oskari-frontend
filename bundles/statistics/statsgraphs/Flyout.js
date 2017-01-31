/**
 * @class Oskari.mapframework.statsgraphs.Flyout
 *
 * Renders the "help" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.statsgraphs.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.userguide.UserGuideBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        this.instance = instance;
        this.chart = null;
        this.tabsData = [];


    }, {

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('statsgraphs')) {
                jQuery(this.container).addClass('statsgraphs');
            }
        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function () {
            var me = this;
            this.tabsData = {
                "chart1": Oskari.clazz.create('Oskari.mapframework.statsgraphs.Chart1Tab', me.instance),
                "chart2": Oskari.clazz.create('Oskari.mapframework.statsgraphs.Chart2Tab', me.instance),
                "chart3": Oskari.clazz.create('Oskari.mapframework.statsgraphs.Chart3Tab', me.instance)
            };
        },

        onOpen: function () {
            this.createUi(this.container);
        },

        onClose: function () {
            for (tabId in this.tabsData) {
                if (this.tabsData.hasOwnProperty(tabId)) {
                    tab = this.tabsData[tabId];
                    tab.removeChart();
                }
            }
        },


        //},

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */

        createUi: function (container) {
            var flyout = jQuery(this.container); // clear container;
            flyout.empty();

            this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', "Tab Container for charts");
            this.tabsContainer.insertTo(flyout);

            for (tabId in this.tabsData) {
                if (this.tabsData.hasOwnProperty(tabId)) {

                    tab = this.tabsData[tabId];
                    panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                    panel.setTitle(tab.getTitle());
                    tab.addTabContent(panel.getContainer());

                    // binds tab to events
                    if (tab.bindEvents) {
                        tab.bindEvents();
                    }

                    this.tabsContainer.addPanel(panel);
                    tab.initChart();
                }
            }
        },

        updateUI: function (name, regions, data) {
            Oskari.log('StatsGraph').info('indicator name ' + name);
            Oskari.log('StatsGraph').info('data parameter'+data);
            Oskari.log('StatsGraph').info('data parameter'+regions);
            var sanitized = [];

            // c3 doesn't like null/undefined -> map to zero
            data.forEach(function(item) {
                if(item) {
                    sanitized.push(item);
                }
                else {
                    sanitized.push(0);
                }
            });


            for (tabId in this.tabsData) {
                if (this.tabsData.hasOwnProperty(tabId)) {
                    tab = this.tabsData[tabId];
                    tab.drawChart(name, regions, sanitized);
                }
            }
        },
        chartDataChanged : function(data) {
            this.tabsData.chart1.showChart(data);
        },
        regionSelected : function(region, regionset) {
            //this.tabsData.chart1.showChart(data);
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });