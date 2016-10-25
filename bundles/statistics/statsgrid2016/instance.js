/**
 * @class Oskari.statistics.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define(
    'Oskari.statistics.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        // these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
        this.defaultConf = {
            name: 'StatsGrid',
            sandbox: 'sandbox',
            stateful: true,
            tileClazz: 'Oskari.userinterface.extension.DefaultTile',
            flyoutClazz: 'Oskari.statistics.statsgrid.Flyout'
        };
        this.visible = false;
    }, {
        afterStart: function (sandbox) {
            var me = this;
            // create the StatisticsService for handling ajax calls and common functionality.
            var statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox);
            sandbox.registerService(statsService);
            me.statsService = statsService;

            var conf = this.getConfiguration() || {};
            statsService.addDatasource(conf.sources);

            this.getTile().setEnabled(this.hasData());
            if(this.state) {
                this.setState(this.state);
            }

            var tile = this.getTile();
            var cel = tile.container;

            if (!cel.hasClass('statsgrid')) {
                cel.addClass('statsgrid');
            }
        },
        eventHandlers: {
            'StatsGrid.IndicatorEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionsetChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionSelectedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'UIChangeEvent' : function() {
                // close/tear down tge ui when receiving the event
                var sandbox = this.getSandbox();
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {

                if (event.getExtension().getName() !== this.getName() || !this.hasData()) {
                    // not me/no data -> do nothing
                    this.visible = false;
                    return;
                }
                var me = this;
                var sandbox = this.getSandbox();
                var isShown = event.getViewState() !== 'close';
                this.visible = isShown;
                if(isShown) {
                    var conf = this.getConfiguration();
                    var defaultConf = {
                        search: true,
                        extraFeatures: true,
                        areaSelection: true,
                        mouseEarLegend: true
                    };
                    if(sandbox.mapMode === 'mapPublishMode') {
                        conf.search = false;
                        conf.extraFeatures = false;
                        conf.areaSelection = false;
                        conf.mouseEarLegend = false;
                    }

                    conf = jQuery.extend({}, defaultConf, this.getConfiguration());
                    this.getFlyout().lazyRender(this.getConfiguration());
                }
                else if(event.getViewState() === 'close'){
                    this.getFlyout().handleClose();
                }
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            MapLayerEvent: function (event) {
                // Enable tile when stats layer is available
                this.getTile().setEnabled(this.hasData());
            }
        },
        hasData: function () {
            return this.statsService.getDatasource().length && this.statsService.getRegionsets().length;
        },

        /**
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            state = state || {};
            var service = this.statsService.getStateService();
            service.reset();
            if(state.regionset) {
                service.setRegionset(state.regionset);
            }
            if(state.indicators) {
                state.indicators.forEach(function(ind) {
                    service.addIndicator(ind.ds, ind.id, ind.selections);
                });
            }
            if(state.active) {
                service.setActiveIndicator(state.active);
            }
            // if state says view was visible fire up the UI, otherwise close it
            var sandbox = this.getSandbox();
            var uimode = state.view ? 'attach' : 'close';
            sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, uimode]);
        },
        /**
         * addChosenHacks Add chosen hacks to element
         * FIXME: remove this when oskari components have own working selection
         * @param {Jquery.element} element
         */
        addChosenHacks: function(element){
            // Fixes chosen selection to visible when rendering chosen small height elements
            element.on('chosen:showing_dropdown', function () {

                jQuery(this).parents('div').each(function() {
                    var el = jQuery(this);
                    if(!el.hasClass('oskari-flyoutcontentcontainer')) {
                        el.css('overflow', 'visible');
                    }
                });
            });

            // Fixes chosen selection go upper when chosen element is near by window bottom
            element.on('chosen:showing_dropdown', function(event, params) {
                var chosen_container = jQuery(event.target).next('.chosen-container');
                var dropdown = chosen_container.find('.chosen-drop');
                var dropdown_top = dropdown.offset().top - $(window).scrollTop();
                var dropdown_height = dropdown.height();
                var viewport_height = jQuery(window).height();

                if ( dropdown_top + dropdown_height > viewport_height ) {
                    chosen_container.addClass('chosen-drop-up');
                }
            });
            element.on('chosen:hiding_dropdown', function(event, params) {
                jQuery(event.target).next('.chosen-container').removeClass('chosen-drop-up');
            });
        },

        getState: function () {
            var me = this;
            var view = me.getView();

            var service = this.statsService.getStateService();
            var state = {
                indicators : [],
                regionset : service.getRegionset(),
                view :me.visible
            };
            service.getIndicators().forEach(function(ind) {
                state.indicators.push({
                    ds : ind.datasource,
                    id : ind.indicator,
                    selections : ind.selections
                });
            });
            var active = service.getActiveIndicator();
            if(active) {
                state.active = active.hash;
            }
            return state;
        }

    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
