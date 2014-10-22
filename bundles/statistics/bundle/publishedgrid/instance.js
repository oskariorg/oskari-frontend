/**
 * @class Oskari.statistics.bundle.publishedgrid.PublishedGridBundleInstance
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.publishedgrid.PublishedGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        this.conf = {
            sandbox: 'sandbox'
        };
        this.state = {};
    }, {
        __name: 'PublishedGrid',

        getName: function () {
            return this.__name;
        },

        init: function () {
            return null;
        },

        update: function () {},

        stop: function () {},

        start: function () {
            var me = this;
            // Do not start if we can't get the state.
            if (!me.state) {
                return;
            }

            me.gridVisible = null;
            var conf = me.conf;
            // Let's use statsgrid's locale files.
            // They are linked from the bundle.js file.
            var locale = Oskari.getLocalization('StatsGrid'),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;
            sandbox.register(this);

            sandbox.registerAsStateful(this.mediator.bundleId, this);

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

            var tooltipRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.TooltipContentRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.TooltipContentRequest', tooltipRequestHandler);

            var indicatorRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.IndicatorsRequest', indicatorRequestHandler);

            // Get the stats layer.
            var statsLayer = me.sandbox.findMapLayerFromAllAvailable(me.state.layerId);
            if (!statsLayer) {
                return;
            }

            // Register grid plugin to the map.
            var gridConf = {
                'published': true,
                'state': me.state,
                'layer': statsLayer
            };
            var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
            mapModule.registerPlugin(gridPlugin);
            mapModule.startPlugin(gridPlugin);
            this.gridPlugin = gridPlugin;

            // Register classification plugin to the map.
            var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', {
                'state': me.getState()
            }, locale);
            mapModule.registerPlugin(classifyPlugin);
            mapModule.startPlugin(classifyPlugin);
            this.classifyPlugin = classifyPlugin;

            var statsLayerPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleStatsLayerPlugin');
            if (statsLayerPlugin) {
                // A sort of a hack to enable the hover and select controls in a published map.
                statsLayerPlugin._modeVisible = true;
            }
            me.createUI();
        },

        setState: function (state) {
            if (state) {
                this.gridPlugin.loadStateIndicators(state, this.container);
            }
        },

        getState: function () {
            return this.state;
        },

        /**
         * Get state parameters.
         * Returns string with statsgrid state. State value keys are before the '-' separator and
         * the indiators are after the '-' separator. The indicators are further separated by ',' and
         * both state values and indicator values are separated by '+'.
         * Note that we're returning the state even when there's no view.
         *
         * @method getStateParameters
         * @return {String} statsgrid state
         */
        getStateParameters: function () {
            var me = this,
                state = me.state;

            // If the state is null or an empty object, nothing to do here!
            if (!state || jQuery.isEmptyObject(state)) {
                return null;
            }

            var i = null,
                len = null,
                last = null,
                statsgridState = 'statsgrid=',
                valueSeparator = '+',
                indicatorSeparator = ',',
                stateValues = null,
                indicatorValues = null,
                colorsValues = null,
                colors = state.colors || {},
                keys = [
                    'layerId',
                    'currentColumn',
                    'methodId',
                    'numberOfClasses',
                    'classificationMode',
                    'manualBreaksInput',
                    'allowClassification'
                ],
                colorKeys = ['set', 'index', 'flipped'],
                indicators = state.indicators || [],
                value;
            // Note! keys needs to be handled in the backend as well.
            // Therefore the key order is important as well as actual values.
            // 'classificationMode' can be an empty string but it must be the
            // fifth value.
            // 'manualBreaksInput' can be an empty string but it must be the
            // sixth value.
            for (i = 0, len = keys.length, last = len - 1; i < len; i += 1) {
                value = state[keys[i]];
                if (value !== null && value !== undefined) {
                    // skip undefined and null
                    stateValues += value;
                }
                if (i !== last) {
                    stateValues += valueSeparator;
                }
            }



            // handle indicators separately
            for (i = 0, len = indicators.length, last = len - 1; i < len; i += 1) {
                indicatorValues += indicators[i].id;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].year;
                indicatorValues += valueSeparator;
                indicatorValues += indicators[i].gender;
                if (i !== last) {
                    indicatorValues += indicatorSeparator;
                }
            }

            // handle colors separately
            var colorArr = [],
                cKey;

            colors.flipped = colors.flipped === true;
            for (i = 0, len = colorKeys.length; i < len; i += 1) {
                cKey = colorKeys[i];
                if (colors.hasOwnProperty(cKey) && colors[cKey] !== null && colors[cKey] !== undefined) {
                    colorArr.push(colors[cKey]);
                }
            }
            if (colorArr.length === 3) {
                colorsValues = colorArr.join(',');
            }

            var ret = null;
            if (stateValues && indicatorValues) {
                ret = statsgridState + stateValues + '-' + indicatorValues + '-';
                if (colorsValues) {
                    ret += colorsValues;
                }
                ret += '-1'; // always enable mode
            }

            return ret;
        },

        /**
         * @method createUI
         * Creates the UI based on the given state (what indicators to use and so on).
         */
        createUI: function () {
            var me = this;

            // Makes some room in the DOM for the grid.
            me._toggleGrid(me.state.gridShown);

            // don't print this if there is no grid to be shown
            if (me.state.gridShown) {
                // Create the show/hide toggle button for the grid.
                me._createShowHideButton(me.container);
            }
            // Initialize the grid
            me.gridPlugin.createStatsOut(me.container);
            me._adjustDataContainer();
        },

        /**
         * Gets the instance sandbox.
         *
         * @method getSandbox
         * @return {Object} return the sandbox associated with this instance
         */
        getSandbox: function () {
            return this.sandbox;
        },

        isLayerVisible: function () {
            var ret = false,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(this.state.layerId);
            if (layer) {
                ret = true;
            }
            return ret;
        },

        /**
         * Returns the open indicators of the instance's grid plugin.
         *
         * @method getGridIndicators
         * @return {Object/null} returns the open indicators of the grid plugin, or null if no grid plugin
         */
        getGridIndicators: function () {
            return (this.gridPlugin ? this.gridPlugin.indicatorsMeta : null);
        },

        /**
         * @method _toggleGrid
         * @param {Boolean} show Shows the grid when true, hides it when false
         */
        _toggleGrid: function (show) {
            var me = this,
                elCenter = jQuery('.oskariui-center'), // the map column
                elLeft = jQuery('.oskariui-left'); // the grid column

            elCenter.toggleClass('span12', !show);
            elLeft.toggleClass('oskari-closed', !show);

            if (show) {
                elLeft.html(me.container);
            } else {
                if (!elLeft.is(':empty')) {
                    elLeft.remove(me.container);
                }
            }

            me.gridVisible = show;

            me._updateMapModuleSize();
        },

        /**
         * Creates a button to show/hide the grid.
         *
         * @method _createShowHideButton
         * @param {Object} elementToHide The element the button should hide.
         */
        _createShowHideButton: function (elementToHide) {
            var me = this,
                buttonContainer = jQuery(me.mapModule.getMap().div),
                button = jQuery(
                    '<div id="publishedgridToggle" class="hidePublishedGrid"></div>'
                );

            button.click(function (event) {
                event.preventDefault();

                if (me.gridVisible) {
                    me.gridVisible = false;
                    jQuery(elementToHide).hide({
                        duration: 50,
                        complete: function () {
                            me._adjustDataContainer();
                        }
                    });
                    jQuery(this).removeClass('hidePublishedGrid').addClass('showPublishedGrid');
                } else {
                    me.gridVisible = true;
                    jQuery(elementToHide).show({
                        duration: 50,
                        complete: function () {
                            me._adjustDataContainer();
                        }
                    });
                    jQuery(this).removeClass('showPublishedGrid').addClass('hidePublishedGrid');
                }
            });

            buttonContainer.append(button);
        },

        _updateMapModuleSize: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                reqBuilder = sandbox.getRequestBuilder(
                    'MapFull.MapSizeUpdateRequest'
                );

            if (reqBuilder) {
                sandbox.request(this, reqBuilder());
            }
        },

        /**
         * @private @method _adjustDataContainer
         * This horrific thing is what sets the statsgrid, container and map size.
         */
        _adjustDataContainer: function () {
            /*
            Structure:
            - content
                - dataContainer
                    - grid
                - mapContainer
                    - mapDiv
            */
            var me = this,
                mapDiv = this.mapModule.getMapEl(),
                content = jQuery('#contentMap'),
                container = content.find('.row-fluid'),
                dataContainer = container.find('.oskariui-left'),
                gridWidth = me._calculateGridWidth(),
                gridHeight = 0,
                mapContainer = container.find('.oskariui-center'),
                mapWidth,
                mapHeight,
                totalWidth = content.width(),
                totalHeight = content.height();

            dataContainer.toggleClass('oskari-closed', !me.gridVisible);

            if (me.gridVisible) {
                gridHeight = totalHeight;
                dataContainer.show();
            } else {
                gridWidth = 0;
            }

            mapWidth = (totalWidth - gridWidth) + 'px';
            mapHeight = totalHeight + 'px';
            gridWidth = gridWidth + 'px';
            gridHeight = gridHeight + 'px';

            dataContainer.css({
                'width': gridWidth,
                'height': gridHeight,
                'float': 'left'
            }).addClass('published-grid-left');

            mapDiv.css({
                'width': mapWidth,
                'height': mapHeight,
            });

            mapContainer.css({
                'width': mapWidth,
                'height': mapHeight,
                'float': 'left'
            }).addClass('published-grid-center');

            if (me.container) {
                me.container.height(mapHeight);
            }

            // notify map module that size has changed
            me._updateMapModuleSize();
        },

        /**
         * @private @method _calculateGridWidth
         * Calculates a sensible width for statsgrid (but doesn't set it...)
         */
        _calculateGridWidth: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                columns,
                statsGrid = sandbox.getStatefulComponents().statsgrid, // get state of statsgrid
                width = 160;

            if (this.state &&
                this.state.indicators !== null &&
                this.state.indicators !== undefined) {

                //indicators + municipality (name & code)
                columns = this.state.indicators.length + 2;
                //slickgrid column width is 80 by default
                width = columns * 80;
            }
            // Width + scroll bar width, but 400 at most.
            return Math.min((width + 20), 400);
        }
    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    });
