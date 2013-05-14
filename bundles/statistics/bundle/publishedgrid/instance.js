/**
 * @class Oskari.statistics.bundle.statsgrid.PublishedGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.PublishedGridBundleInstance',
/**
 * @static constructor function
 */
function() {
    this.conf =  {
        "name": "PublishedGrid",
        "sandbox": "sandbox",
        "stateful": false,
        "gridShown": true // show the grid on startup, defaults to true
    };
    this.state = {};
}, {
    init: function() {
        var me = this;
        var conf = me.conf;
        var locale = me.getLocalization();
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        var sandbox = Oskari.getSandbox(sandboxName);
        this.sandbox = sandbox;
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.mapModule = mapModule;

        // TODO: where to get the grid container from?
        var container = jQuery('<div class="statsgrid"></div>');
        this.container = container;

        // Create the StatisticsService for handling ajax calls and common functionality.
        var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
        sandbox.registerService(statsService);
        this.statsService = statsService;

        // Register grid plugin for map.
        var gridConf = {
            'published': true
        };
        var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
        mapModule.registerPlugin(gridPlugin);
        mapModule.startPlugin(gridPlugin);
        this.gridPlugin = gridPlugin;

        // Register classify plugin for map.
        var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', conf ,locale);
        mapModule.registerPlugin(classifyPlugin);
        mapModule.startPlugin(classifyPlugin);
        this.classifyPlugin = classifyPlugin;

        // Fetch the state of the statsgrid bundle and create the UI based on it.
        // TODO: get the saved state from the published map.
        var statsGrid = this.sandbox.getStatefulComponents()['statsgrid'];
        if(statsGrid && statsGrid.state) {
            me.createUI(statsGrid.state);
        }
    },

    /**
     * @method createUI
     * Creates the UI based on the given state (what indicators to use and so on).
     * @param {Object} state statgrid's bundle state as JSON
     * @param {Boolean} ignoreLocation true to NOT set map location based on state
     */
    createUI: function(state, ignoreLocation) {
        var me = this,
            view = me.gridView,
            showGrid = me.conf ? me.conf.gridShown : true;
        var layer = me.sandbox.findMapLayerFromAllAvailable(state.layerId);

        var gridLoadedCallback = function() {
            if (state.indicators.length > 0) {

                //send ajax calls and build the grid
                view.getSotkaIndicatorsMeta(state.indicators, function(){

                    //send ajax calls and build the grid
                    view.getSotkaIndicatorsData(state.indicators, function(){

                        if(state.currentColumn != null) {

                            if(state.methodId != null && state.methodId > 0) {
                                var select = me.classifyPlugin.element.find('.classificationMethod').find('.method');
                                select.val(state.methodId);
                                // The manual breaks method:
                                if(state.methodId == 4 && state.manualBreaksInput) {
                                    var manualInput = me.classifyPlugin.element.find('.manualBreaks').find('input[name=breaksInput]');
                                    manualInput.val(state.manualBreaksInput);
                                    me.classifyPlugin.element.find('.classCount').hide();
                                    me.classifyPlugin.element.find('.manualBreaks').show();
                                }
                            }
                            if(state.numberOfClasses != null && state.numberOfClasses > 0) {
                                var slider = me.classifyPlugin.rangeSlider;
                                if(slider != null) {
                                    slider.slider("value", state.numberOfClasses);
                                    slider.parent().find('input#amount_class').val(state.numberOfClasses);
                                }
                            }
                            // current column is needed for rendering map
                            var columns = view.grid.getColumns();
                            for (var i = 0; i < columns.length; i++) {
                                var column = columns[i];
                                if (column.id == state.currentColumn) {
                                    view.sendStatsData(column);
                                }
                            };
                        }
                    });
                });
            }
        };

        // Initialize the grid
        if (showGrid) {
            me.createGrid(me.container, gridLoadedCallback);
        }
    },

    /**
     * @method createGrid
     * @param {Object} container
     * @param {Function} callback
     */
    createGrid: function(container, callback) {
        var me = this;
        // call ajax function (params: url, successFallback, errorCallback)
        me.statsService.fetchStatsData(me.sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
        // success callback
        function(regionData) {
            if (regionData) {
                me.gridView.createMunicipalitySlickGrid(container, regionData);

                // Data loaded and grid created, now it's time to call the function provided, if any.
                callback && callback();
            } else {
                // TODO
                // Handle no data
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            // TODO
            // Error handling
        });
    }
}, {
    "protocol" : ["Oskari.bundle.BundleInstance"]
});

