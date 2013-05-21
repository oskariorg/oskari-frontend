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
        // Let's use statsgrid's locale files.
        // They are linked from the bundle.js file.
        var locale = Oskari.getLocalization('StatsGrid');
        // Show the grid on startup, defaults to true.
        var showGrid = ( me.conf ? me.conf.gridShown : null) || true;
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

        // Fetch the state of the statsgrid bundle and create the UI based on it.
        // TODO: get the saved state from the published map.
        var statsGrid = this.sandbox.getStatefulComponents()['statsgrid'];
        var statsState = ( statsGrid ? statsGrid.getState() : null ) || {};

        // Get the stats layer.
        var statsLayer = me.sandbox.findMapLayerFromAllAvailable(statsState.layerId);

        // Register grid plugin to the map.
        var gridConf = {
            'published': true,
            'state': statsState,
            'layer': statsLayer
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

        if(showGrid) {
            me.createUI(statsState);
        }
    },

    /**
     * @method createUI
     * Creates the UI based on the given state (what indicators to use and so on).
     */
    createUI: function() {
        var me = this;
        
        // Makes some room in the DOM for the grid.
        me._toggleGrid(true);

        // Create the show/hide toggle button for the grid.
        me._createShowHideButton(me.container);

        // Initialize the grid
        me.gridPlugin.createStatsOut(me.container);
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
     * REFACTOR!
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
                    complete: function() {
                        // Fix the map div width etc.
                    }
                });
                jQuery(this).removeClass('hidePublishedGrid').addClass('showPublishedGrid');
            } else {
                me.gridVisible = true;
                jQuery(element).show("slide", {
                    complete: function() {
                        // Fix the map div width etc.
                    }
                });
                jQuery(this).removeClass('showPublishedGrid').addClass('hidePublishedGrid');
            }
        });
        element.append(button);
    }
}, {
    "protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
});
