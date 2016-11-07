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

        this._templates= {
            publishedToggleButtons: jQuery('<div class="statsgrid-published-toggle-buttons"><div class="map"></div><div class="table active"></div>')
        };
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

            if(conf.showLegend === true) {
                me.renderPublishedLegend(conf);
            }
            if(me.hasPublished() && conf.grid) {
                me.renderToggleButtons();
                me.changePosition({top:0,left:0});
            }
        },
        changePosition: function(position){
            var me = this;
            position = position || {};

            var flyout =  me.getFlyout().getEl().parent().parent();

            if(typeof position.top === 'number' || typeof position.top === 'string'){
                flyout.css('top', position.top);
            }
            if(typeof position.left === 'number' || typeof position.left === 'string'){
                flyout.css('left', position.left);
            }
        },
        renderToggleButtons: function(remove){
            var me = this;
            if(remove){
                jQuery('.statsgrid-published-toggle-buttons').remove();
                return;
            }
            var toggleButtons = me._templates.publishedToggleButtons.clone();
            var map = toggleButtons.find('.map');
            var table = toggleButtons.find('.table');
            table.addClass('active');

            map.attr('title', me.getLocalization().published.showMap);
            table.attr('title', me.getLocalization().published.showTable);

            map.bind('click', function(){
                if(!map.hasClass('active')) {
                    table.removeClass('active');
                    map.addClass('active');
                    me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[me, 'close', 'StatsGrid']);
                }
            });

            table.bind('click', function(){
                if(!table.hasClass('active')) {
                    map.removeClass('active');
                    table.addClass('active');
                    me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[me, 'detach', 'StatsGrid']);
                }
            });

            jQuery('body').append(toggleButtons);
        },
        hasPublished: function(){
            var map = jQuery('#contentMap');
            if(map.hasClass('mapPublishMode') ||  map.hasClass('published')) {
                return true;
            }
            return false;
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
                var isShown = event.getViewState() !== 'close';
                this.visible = isShown;
                var conf = this.getConfiguration();
                if(isShown) {
                    var defaultConf = {
                        search: true,
                        extraFeatures: true,
                        areaSelection: true,
                        mouseEarLegend: true,
                        showLegend: true
                    };
                    var map = jQuery('#contentMap');
                    if(map.hasClass('mapPublishMode')) {
                        conf.search = false;
                        conf.extraFeatures = false;
                        conf.areaSelection = false;
                        conf.mouseEarLegend = false;
                        conf.showLegend = true;
                    } else if(!map.hasClass('published')) {
                        conf.search = true;
                        conf.extraFeatures = true;
                        conf.areaSelection = true;
                        conf.mouseEarLegend = true;
                        conf.showLegend = false;
                    }

                    conf = jQuery.extend({}, defaultConf, this.getConfiguration());

                    if(conf.grid !== false) {
                        this.getFlyout().lazyRender(conf);
                    }

                }
                else if(event.getViewState() === 'close'){
                    this.getFlyout().handleClose();
                }

                if(conf.showLegend === true) {
                    me.renderPublishedLegend(conf);
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
         * @method  @public renderPublishedLegend Render published  legend
         */
        renderPublishedLegend: function(config){
            var me = this;
            var sb = me.getSandbox();
            var locale = this.getLocalization();

            jQuery('.statsgrid-legend-flyout-published').show();

            if(config.showLegend === false) {
                jQuery('.statsgrid-legend-flyout-published').hide();
                return;
            }

            var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            if(!service) {
                // not available yet
                return;
            }

            var state = service.getStateService();
            var ind = state.getActiveIndicator();
            if(!ind) {
                return;
            }

            service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
                if(err) {
                    me.log.warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                    return;
                }
                var classify = service.getClassificationService().getClassification(data);
                if(!classify) {
                    me.log.warn('Error getting indicator classification', data);
                    return;
                }

                var flyout = me.getFlyout();

                // format regions to groups for url
                var regiongroups = classify.getGroups();
                var classes = [];
                regiongroups.forEach(function(group) {
                    // make each group a string separated with comma
                    classes.push(group.join());
                });

                var colorsWithoutHash = service.getColorService().getColorset(regiongroups.length);
                var colors = [];
                colorsWithoutHash.forEach(function(color) {
                    colors.push('#' + color);
                });

                var state = service.getStateService();

                service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err) {
                    if(err) {
                        me.log.warn('Error getting indicator metadata', ind.datasource, ind.indicator);
                        return;
                    }
                    flyout.getLegendFlyout(
                    {
                        callbacks: {
                            show: function() {
                                var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
                                var container = jQuery('<div class="accordion-published"></div>');

                                var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                                panel.setTitle(locale.legend.title);
                                panel.setContent(me.__sideTools.legend.comp.getClassification());
                                panel.setVisible(true);
                                panel.open();

                                accordion.addPanel(panel);
                                accordion.insertTo(container);

                                me.__sideTools.legend.flyout.setContent(container);
                            },
                            after: function(){
                                me.__sideTools.legend.flyout.show();
                            }
                        },
                        locale: {
                            title: ''
                        },
                        cls: 'statsgrid-legend-flyout-published'
                    }, me);

                    service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
                        var ind = event.getCurrent();
                        if(ind) {
                            me.updatePublishedFlyoutTitle(ind, config);
                        }
                    });

                    me.updatePublishedFlyoutTitle(state.getActiveIndicator(), config);
                });
            });
        },
        /**
         * @method  @public updatePublishedFlyoutTitle update published map legend
         * @param  {Object} ind indicator
         * @param {Object} config config
         */
        updatePublishedFlyoutTitle: function (ind, config){
            var me = this;
            var sb = me.getSandbox();
            var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            if(!service) {
                // not available yet
                return;
            }
            var state = service.getStateService();

            service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {

                var getSourceLink = function(currentHash){
                    var indicators = state.getIndicators();
                    var currentIndex = state.getIndicatorIndex(currentHash);
                    var nextIndicatorIndex = 1;
                    if(currentIndex === indicators.length) {
                        nextIndicatorIndex = 1;
                    } else {
                        nextIndicatorIndex=currentIndex + 1;
                    }

                    return {
                        index: nextIndicatorIndex,
                        handler: function(){
                            var curIndex = nextIndicatorIndex-1;
                            var i = indicators[curIndex];
                            state.setActiveIndicator(i.hash);
                        }
                    };
                };

                var link = getSourceLink(ind.hash);
                var selectionsText = '';

                if(config.grid !== true || config.showLegend !== false) {
                    var linkButton = '';
                    if(state.indicators.length>1) {
                        linkButton = '<div class="link">' + me.getLocalization().statsgrid.source + ' ' + link.index + ' >></div>';
                    }
                    selectionsText = service.getSelectionsText(ind, me.getLocalization().panels.newSearch, function(text){
                        me.__sideTools.legend.flyout.setTitle('<div class="header">' + me.getLocalization().statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + '</div>' +
                            linkButton +
                            '<div class="sourcename">' + Oskari.getLocalized(indicator.name) + text + '</div>');
                    });
                }

                me.__sideTools.legend.flyout.getTitle().find('.link').unbind('click');
                me.__sideTools.legend.flyout.getTitle().find('.link').bind('click', function(){
                    link.handler();
                });

            });

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
            element.on('chosen:showing_dropdown', function(event) {
                var chosen_container = jQuery(event.target).next('.chosen-container');
                var dropdown = chosen_container.find('.chosen-drop');
                var dropdown_top = dropdown.offset().top - $(window).scrollTop();
                var dropdown_height = dropdown.height();
                var viewport_height = jQuery(window).height();

                if ( dropdown_top + dropdown_height > viewport_height ) {
                    chosen_container.addClass('chosen-drop-up');
                }
            });
            element.on('chosen:hiding_dropdown', function(event) {
                jQuery(event.target).next('.chosen-container').removeClass('chosen-drop-up');
            });
        },

        getState: function () {
            var me = this;

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
