/**
 * @class Oskari.statistics.bundle.publishedgrid.PublishedGridBundleInstance
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.publishedgrid.PublishedGridBundleInstance',
/**
 * @static constructor function
 */
function() {
    this.conf =  {
        "sandbox": "sandbox"
    };
    this.state = {};
}, {
    __name: 'PublishedGrid',

    getName: function() {
        return this.__name;
    },

    init: function() {
        return null;
    },

    update: function() {},

    stop: function() {},

    start: function() {
        console.log('PublishedGrid bundle started.');
        var me = this;
        me.gridVisible = null;
        var conf = me.conf;
        var locale = Oskari.getLocalization('StatsGrid'); // Let's use statsgrid's locale files.
        var showGrid = me.conf ? me.conf.gridShown : true; // Show the grid on startup, defaults to true.
        var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
        var sandbox = Oskari.getSandbox(sandboxName);
        this.sandbox = sandbox;
        sandbox.register(this);

        // Find the map module.
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this.mapModule = mapModule;

        // The container where the grid will be rendered to.
        var container = jQuery('<div class="publishedgrid"></div>');
        this.container = container;

        // Create the StatisticsService for handling ajax calls and common functionality.
        // Used in both plugins below.
        var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
        sandbox.registerService(statsService);
        this.statsService = statsService;

        // Register grid plugin to the map.
        var gridConf = {
            'published': true
        };
        var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
        mapModule.registerPlugin(gridPlugin);
        mapModule.startPlugin(gridPlugin);
        this.gridPlugin = gridPlugin;

        // Register classification plugin to the map.
        var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', conf ,locale);
        mapModule.registerPlugin(classifyPlugin);
        mapModule.startPlugin(classifyPlugin);
        this.classifyPlugin = classifyPlugin;

        // Fetch the state of the statsgrid bundle and create the UI based on it.
        // TODO: get the saved state from the published map.
        var statsGrid = this.sandbox.getStatefulComponents()['statsgrid'];
        if(statsGrid && statsGrid.state && showGrid) {
            me.createUI(statsGrid.state);
        }
    },

    /**
     * @method createUI
     * Creates the UI based on the given state (what indicators to use and so on).
     * @param {Object} state statgrid's bundle state as JSON
     */
    createUI: function(state) {
        var me = this,
            view = me.gridPlugin,
            layer = me.sandbox.findMapLayerFromAllAvailable(state.layerId);

        // Layer not available - nothing to do here.
        if (!layer) {
            return;
        }

        // We need to notify the grid plugin of the used layer.
        view.setLayer(layer);
        
        // Makes some room in the DOM for the grid.
        me._toggleGrid(true);

        // Create the show/hide toggle button for the grid.
        me._createShowHideButton(me.container);

        // Load the indicator data specified in statsgrid's state.
        var gridLoadedCallback = function() {
            // First, let's clear out the old data from the grid.
            view.clearDataFromGrid();

            if (state.indicators.length > 0) {

                // Send ajax calls to get the indicators
                view.getSotkaIndicatorsMeta(state.indicators, function(){

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
                            // Current column is needed for rendering map
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
        view.createStatsOut(me.container, gridLoadedCallback);
    },

    /**
     * @method _toggleGrid
     * @param {Boolean} show Shows the grid when true, hides it when false
     */
    _toggleGrid: function(show) {
        var me = this,
            elCenter = jQuery('.oskariui-center'), // the map column
            elLeft = jQuery('.oskariui-left'), // the grid column
            gridWidth = 40; // How wide the grid should be, in percentages.

        if (show) {
            elCenter.removeClass('span12');
            elCenter.width((100 - gridWidth) + '%');
            elLeft.removeClass('oskari-closed');
            elLeft.width(gridWidth + '%');
            elLeft.append(me.container);
        } else {
            elCenter.width('').addClass('span12');
            elLeft.addClass('oskari-closed');
            elLeft.width('');
            elLeft.remove(me.container);
        }

        me.gridVisible = show;

        // A hack to notify openlayers of map size change.
        var map = me.mapModule.getMap();
        map.updateSize();
    },

    /**
     * Creates a button to show/hide the grid.
     *
     * @method _createShowHideButton
     * @param {Object} element The container where the button should be appended to.
     */
    _createShowHideButton: function(element) {
        var me = this;
        var button = jQuery(
            '<div class="publishedgridToggle"></div>'
        );
        button.click(function(event) {
            event.preventDefault();
            
            if (me.gridVisible) {
                me.gridVisible = false;
                jQuery(element).hide("slide", {
                    complete: function() {}
                });
                jQuery(this).removeClass('hidePublishedGrid').addClass('showPublishedGrid');
            } else {
                me.gridVisible = true;
                jQuery(element).show("slide", {
                    complete: function() {}
                });
                jQuery(this).removeClass('showPublishedGrid').addClass('hidePublishedGrid');
            }
        });
        element.append(button);

        /**
        .hidePublishedGrid {
            background: url(hide-navigation.png);
            width: 32px;
            height: 32px;
            position: absolute;
            top: 5px;
            right: 0;
        }

        .showPublishedGrid {
            background: url(show-navigation.png);
            width: 32px;
            height: 32px;
            position: absolute;
            top: 5px;
            right: -32px;
        }
        */
    }
}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
