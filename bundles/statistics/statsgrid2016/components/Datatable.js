Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(sandbox, locale) {
    this.locale = locale;
    this.sb = sandbox;
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
    this._bindToEvents();
    this.regionSelectorEnabled = true;
    this.indicatorRemovalEnabled = true;
    this._defaultSortOrder  = {
        item: 'region',
        descending: false
    };

    this._maxCols = 3;

    // Keep latest sorting on memory
    this._sortOrder = null;
}, {
    __templates : {
        main : _.template('<div class="stats-table">'+
            '<div class="noresults">'+
            '   <div class="title"></div>'+
            '   <div class="content"></div>'+
            '</div>'+
            '<div class="grid"></div>'+
            '</div>'),
        tableHeader: _.template('<div class="statsgrid-grid-table-header">'+
                '<div class="title"></div>'+
                '<div class="header">'+
                '   <div class="selection"></div>'+
                '   <div class="info"></div>'+
                '</div>'+
                '<div class="sortby"><div class="orderTitle"></div><div class="order"></div><div style="clear:both;"></div></div>' +
                '</div>'),
        tableHeaderWithContent: _.template('<div class="statsgrid-grid-table-header-content">'+
                '<div class="header"><span class="title"></span> </div>'+
                '<div class="icon icon-close-dark"></div>' +
                '<div style="clear:both;"></div>' +
                '<div class="sortby"><div class="orderTitle"></div><div class="order"></div><div style="clear:both;"></div></div>' +
                '</div>')
    },

    /****** PRIVATE METHODS ******/

    /**
     * @method  @private handleRegionsetChanged Handle regionset changing
     * @param  {Integer} setId regionset id
     */
    _handleRegionsetChanged: function(setId) {
        var me = this;

        // Grid not ready
        if(!me.grid) {
            return;
        }

        var currentRegion = this.getCurrentRegionset();
        var locale = me.locale;
        var errorService = me.service.getErrorService();

        if(!setId) {
            setId = this.getCurrentRegionset();
        }
        if(!setId) {
            return;
        }
        var regionset = this.service.getRegionsets(setId);

        if(this.getIndicators().length>0){
            me.spinner.start();
        }
        this.service.getRegions(setId, function(err, regions) {
            if(err) {
                me.log.warn('Cannot get regions for wanted regionset='+setId);
                me.spinner.stop();
                // notify error!!
                errorService.show(locale.errors.title,locale.errors.regionsDataError);
                return;
            }

            if(regions.length === 0) {
                errorService.show(locale.errors.title,locale.errors.regionsDataIsEmpty);
            }
            me.createModel(regions, function(model) {
                me.updateModel(model, regions);
                me.spinner.stop();
                me.setHeaderHeight();
                var state = me.service.getStateService();
                me.grid.select(state.getRegion());
            });
        });
    },

    /**
     * @method  @private setGridGroupingHeaders sets datatable grid grouping headers
     * @param {Object} indicators indicators
     * @param {Object} gridLoc    locale
     */
    _setGridGroupingHeaders: function(indicators,gridLoc){
        var me = this;
        if(!me.grid) {
            return;
        }
        me.grid.setGroupingHeader([
            {
                cls: 'statsgrid-grouping-header region',
                text: gridLoc.areaSelection.title
            },
            {
                cls:'statsgrid-grouping-header sources',
                text: gridLoc.title + ' <span>('+indicators.length+')</span>',
                maxCols: me._maxCols,
                pagingHandler: function(element, data){
                    element.html(gridLoc.title + ' <span>('+data.visible.start + '-' + data.visible.end +'/' + data.count+')</span>');
                    me.setHeaderHeight();
                }
            }
        ]);
    },

    /**
     * @method  @private setGridAreaSelection Set grid area selection header
     * @param  {Object} regions regions
     * @param {Object} gridLoc grid locales
     */
    _setGridAreaSelection: function(regions,gridLoc){
        var me = this;
        // Grid not ready yet
        if(!me.grid) {
            return;
        }
        var regionSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', me.sb, me.locale);

        me.grid.setColumnUIName('region', function(content) {
            var tableHeader = jQuery(me.__templates.tableHeader());
            tableHeader.find('.title').remove();
            tableHeader.find('.info').html(gridLoc.areaSelection.info);

            content.append(tableHeader);

            // regionset selection is shown if map is not embedded
            if(me.regionSelectorEnabled) {
                var regionSelect = regionSelector.create(me.service.getSelectedIndicatorsRegions(), true);
                if(!regionSelect) {
                    return;
                }
                regionSelector.setWidth(170);
                regionSelect.value(me.getCurrentRegionset());
                regionSelect.field.on('change', function() {
                    var value = jQuery(this).val();
                    me.log.debug('Selected region ' + value);
                    me.service.getStateService().setRegionset(value);
                });
                // container includes
                tableHeader.find('.selection').append(regionSelect.oskariSelect);
                tableHeader.find('.oskari-select').css('width', '100%');
            }
            // Else only show current regionset without info
            else {
                var regionsetDef = me.service.getRegionsets(me.getCurrentRegionset()) || {};
                tableHeader.find('.selection').html(regionsetDef.name);
                tableHeader.find('.info').remove();
            }

            var sortBy = tableHeader.find('.sortby');
            sortBy.find('.orderTitle').html(gridLoc.orderBy);
            var order = sortBy.find('.order');

            sortBy.bind('click', function(evt){
                evt.stopPropagation();

                me.mainEl.find('.grid .sortby .orderTitle').removeClass('selected');
                sortBy.find('.orderTitle').addClass('selected');

                var descending = (sortBy.attr('data-descending') === 'true') ? true : false;

                // Check at if not selected previous then select item current order
                var notAllreadySelected = (me._sortOrder.item !== 'region') ? true : false;
                if(notAllreadySelected) {
                    descending = !descending;
                }

                me.grid.sortBy('region', descending);
                sortBy.attr('data-descending', !descending);

                order.removeClass('asc');
                order.removeClass('desc');

                me._sortOrder = {
                    item: 'region',
                    descending: descending
                };

                if(descending) {
                    sortBy.find('.orderTitle').attr('title', gridLoc.orderByDescending);
                    order.addClass('desc');
                } else {
                    sortBy.find('.orderTitle').attr('title', gridLoc.orderByAscending);
                    order.addClass('asc');
                }
            });

            // region selected by default sort order
            if(me._sortOrder === null) {
                me._sortOrder = me._defaultSortOrder;
            }

            if(me._sortOrder.item === 'region') {
                sortBy.find('.orderTitle').addClass('selected');
                sortBy.attr('data-descending', !me._sortOrder.descending);
                var tooltip = (me._sortOrder.descending === true) ? gridLoc.orderByDescending : gridLoc.orderByAscending;
                sortBy.find('.orderTitle').attr('title', tooltip);

                var orderClass = (me._sortOrder.descending === true) ? 'desc' : 'asc';
                order.addClass(orderClass);
            } else {
                sortBy.attr('data-descending', false);
                sortBy.find('.orderTitle').attr('title', gridLoc.orderByAscending);
            }

            content.css('width', '30%');
        });


        var regionIdMap = {};
        regions.forEach(function(reg) {
            regionIdMap[reg.id] = reg.name;
        });
        me.grid.setColumnValueRenderer('region', function(regionId) {
            return regionIdMap[regionId];
        });
    },

    _updateHeaderHeight: function(){
        if(this.grid) {
            this.grid.updateHeaderHeight();
        }
    },

    /**
     * @method  @private _setIndicators set indicators
     * @param {Object} indicators indicators
     * @param {Object} model   model
     * @param {Object} gridLoc    locale
     */
    _setIndicators: function(indicators, model, gridLoc){
        var me = this;
        var locale = me.locale;
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');

        // done is called when we have indicator names for columns
        var done = function() {
            me.grid.setAutoHeightHeader(30);
            me.grid.setDataModel(model);
            me.grid.renderTo(me.mainEl.find('.grid'));

            var state = me.service.getStateService();
            var activeIndicator = state.getActiveIndicator();
            if(activeIndicator) {
                me.grid.selectColumn(activeIndicator.hash);
            }
        };
        if(!indicators.length) {
            done();
            return;
        }
        indicators.forEach(function(ind, id) {
            me.grid.setColumnUIName(ind.hash, function(content) {
                var tableHeader = jQuery(me.__templates.tableHeaderWithContent());
                tableHeader.find('.title').html(gridLoc.source + ' ' + (id+1) + ':');

                me.service.getUILabels(ind, function(labels) {
                    tableHeader.find('.header').append(labels.full).attr('title', labels.full);
                });

                tableHeader.find('.icon').attr('title', gridLoc.removeSource);

                // If not published then show close icon
                if(me.indicatorRemovalEnabled) {
                    tableHeader.find('.icon').attr('data-ind-hash', ind.hash);
                    tableHeader.find('.icon').bind('click', function(){
                        var hash = jQuery(this).attr('data-ind-hash');
                        log.debug('Removing indicator ', + ind.hash);

                        // Set default sort order
                        if(me._sortOrder.item === ind.hash) {
                            me._sortOrder = me._defaultSortOrder;
                        }
                        me.service.getStateService().removeIndicator(ind.datasource, ind.indicator, ind.selections);
                    });
                }
                // Else remove close icon
                else {
                    tableHeader.find('.icon').remove();
                }

                var sortBy = tableHeader.find('.sortby');
                sortBy.find('.orderTitle').html(gridLoc.orderBy);
                var order = sortBy.find('.order');

                sortBy.bind('click', function(evt){
                    evt.stopPropagation();

                    me.mainEl.find('.grid .sortby .orderTitle').removeClass('selected');
                    sortBy.find('.orderTitle').addClass('selected');

                    var descending = (sortBy.attr('data-descending') === 'true') ? true : false;

                     // Check at if not selected previous then select item current order
                    var notAllreadySelected = (me._sortOrder === null || me._sortOrder.item !== ind.hash) ? true : false;
                    if(notAllreadySelected) {
                        descending = !descending;
                    }

                    me.grid.sortBy(ind.hash, descending);
                    sortBy.attr('data-descending', !descending);

                    me._sortOrder = {
                        item: ind.hash,
                        descending: descending
                    };

                    order.removeClass('asc');
                    order.removeClass('desc');

                    if(descending) {
                        sortBy.find('.orderTitle').attr('title', gridLoc.orderByDescending);
                        order.addClass('desc');
                    } else {
                        sortBy.find('.orderTitle').attr('title', gridLoc.orderByAscending);
                        order.addClass('asc');
                    }
                });

                if(me._sortOrder.item === ind.hash) {
                    var sortByTooltip = (me._sortOrder.descending === true) ? gridLoc.orderByDescending : gridLoc.orderByAscending;
                    var sortCls = (me._sortOrder.descending === true) ? 'desc' : 'asc';
                    sortBy.attr('data-descending', me._sortOrder.descending);
                    sortBy.find('.orderTitle').addClass('selected');
                    sortBy.find('.orderTitle').attr('title', sortByTooltip);
                    order.addClass(sortCls);
                }
                else {
                    sortBy.attr('data-descending', false);
                    sortBy.find('.orderTitle').attr('title', gridLoc.orderByDescending);
                    order.addClass('desc');
                }

                tableHeader.bind('click', function(){
                    me.service.getStateService().setActiveIndicator(ind.hash);
                });

                // calculate cell width
                var visibleCells = (indicators.length > me._maxCols) ? me._maxCols : indicators.length;
                var cellWidth = 70 / visibleCells;
                content.css('width', cellWidth + '%');
                content.append(tableHeader);
            });
            if(indicators.length - 1 === id) {
                done();
            }
        });
    },

    /**
     * @method  @private handleIndicatorAdded Handle indicator added
     * @param  {Integer} datasrc    datasource
     * @param  {String} indId      indicator id
     * @param  {Object} selections seelctions
     */
    _handleIndicatorAdded: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.debug('Indicator added ', src, indId, selections);
        var state = this.service.getStateService();
        var hash = this.service.getStateService().getHash(datasrc, indId, selections);

        state.setActiveIndicator(hash);
        this._handleRegionsetChanged(this.getCurrentRegionset());
    },
    /**
     * @method  @private handleIndicatorAdded Handle indicator removed
     * @param  {Integer} datasrc    datasource
     * @param  {String} indId      indicator id
     * @param  {Object} selections seelctions
     */
    _handleIndicatorRemoved: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.debug('Indicator removed', src, indId, selections);
        this._handleRegionsetChanged(this.getCurrentRegionset());
    },

    _bindToEvents : function() {
        var me = this;
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        if(me._bindedEvents === true) {
            return;
        }

        this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if(event.isRemoved()) {
                me._handleIndicatorRemoved(event.getDatasource(), event.getIndicator(), event.getSelections());
            } else {
                me._handleIndicatorAdded(event.getDatasource(), event.getIndicator(), event.getSelections());
            }
        });
        this.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            log.debug('Region changed! ', event.getRegionset());
            me._handleRegionsetChanged(event.getRegionset());
        });

        this.service.on('StatsGrid.RegionSelectedEvent', function(event) {
            log.debug('Region selected! ', event.getRegion());
            if(!me.mainEl || !me.grid) {
                // ui not created yet
                return;
            }

            var scrollableElement = null;
            var gridEl = me.mainEl.find('table.oskari-grid:visible');
            var parent = gridEl.parents('.oskari-flyoutcontentcontainer');

            if(event.getTriggeredBy() === 'map' && parent.length>0) {
                scrollableElement = parent;
            }
            me.grid.select(event.getRegion(), false, {element: scrollableElement, fixTopPosition: jQuery('.oskari-flyout.statsgrid-data-flyout .oskari-flyouttoolbar').height()});
        });

        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var current = event.getCurrent();
            log.debug('Active indicator changed! ', current);
            if(current && me.grid) {
                me.grid.selectColumn(current.hash);
            }
        });
        me._bindedEvents = true;
    },

    _setSort: function(){
        var me = this;
        var sort = me._sortOrder || me._defaultSortOrder;
        me.grid.sortBy(sort.item, sort.descending);
    },

    /****** PUBLIC METHODS ******/

    showRegionsetSelector : function(enabled) {
        this.regionSelectorEnabled = !!enabled;
    },
    showIndicatorRemoval : function(enabled) {
        this.indicatorRemovalEnabled = !!enabled;
    },
    /**
     * @method  @public render Render datatable
     * @param  {Object} el jQuery element
     */
    render : function(el) {
        var me = this;
        var gridLoc = me.locale.statsgrid || {};

        var main = jQuery(this.__templates.main());
        me.spinner.insertTo(main);
        var noresults = main.find('.noresults');
        noresults.find('.title').html(gridLoc.title);
        noresults.find('.content').html(gridLoc.noResults);

        me.mainEl = main;
        me.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

        me.grid.addSelectionListener(function(grid, region) {
            me.service.getStateService().toggleRegion(region, 'grid');
        });

        el.append(main);
        me._handleRegionsetChanged();
    },

    setHeaderHeight: function(){
        var me = this;
        var statsTableEl = jQuery('.oskari-flyout.statsgrid-data-flyout .stats-table');

        // IE fix
        if(statsTableEl.length > 0) {
            var latestCell = statsTableEl.find('tbody tr').last();
            latestCell.addClass('autoheight');
            // hack is needed by IE 11. Otherwise header elements with css like
            //   position : absolute, bottom : 0
            // will render in wrong location.
            // This will force a repaint which will fix the locations.
            latestCell.removeClass('autoheight');
            latestCell.hide();
            latestCell.show(0);
        }
    },

    /**
     * @method  @public getCurrentRegionset Get current regionset
     * @return {Object} current regionset
     */
    getCurrentRegionset : function() {
        return this.service.getStateService().getRegionset();
    },

    /**
     * @method  @public getIndicators get selected indicators
     * @return {Object} indicators
     */
    getIndicators : function() {
        return this.service.getStateService().getIndicators();
    },

    /**
     * @method  @public showResults Show results
     * @param  {Object} indicators   indicators array
     * @return {Boolean}              is shown datatable
     */
    showResults: function(indicators){
        var me = this;

        var currentIndicators = indicators || me.getIndicators();
        var statsTableEl = jQuery('.oskari-flyout.statsgrid-data-flyout .stats-table');
        // Show no results text
        if(currentIndicators.length === 0) {
            statsTableEl.find('.oskari-grid').hide();
            statsTableEl.find('.noresults').show();
            return false;
        }
        // Show datatable
        else {
            statsTableEl.find('.oskari-grid').show();
            statsTableEl.find('.noresults').hide();
            return true;
        }
    },

    /**
     * @method  @public updateModel Update model
     * @param  {Object} model   model
     * @param  {Object} regions regions
     */
    updateModel : function(model, regions) {
        var me = this;
        var gridLoc = me.locale.statsgrid || {};

        var indicators = this.getIndicators();

        if (!me.showResults(indicators)){
            return;
        }

        // Set grouping headers
        me._setGridGroupingHeaders(indicators, gridLoc);

        // Set area selection
        me._setGridAreaSelection(regions, gridLoc);

        // Set indicators
        me._setIndicators(indicators, model, gridLoc);

        // Set sort
        me._setSort();
    },

    /**
     * @method  @public createModel Create model
     * @param  {Object}   regions  regions
     * @param  {Function} callback callback function
     */
    createModel : function(regions, callback) {
        var me = this;
        var list = this.getIndicators();
        var data = {};
        regions.forEach(function(reg) {
            data[reg.id] = {};
        });
        var done = function(data) {
            var model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            model.setIdField('region');
            for(var region in data) {
                var value = data[region] || {};
                value.region = region;
                model.addData(value);
            }
            var fields = ['region'];
            list.forEach(function(ind) {
                fields.push(ind.hash);
            });
            model.setFields(fields);
            callback(model);
        };
        var count = 0;
        if(!list.length) {
            // no indicators
            done(data);
            return;
        }
        list.forEach(function(ind) {
            me.service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, me.getCurrentRegionset(), function(err, indicatorData) {
                count++;
                for(var key in indicatorData) {
                    var region =  data[key];
                    if(!region) {
                        continue;
                    }
                    region[ind.hash] = indicatorData[key];
                }
                if(count===list.length) {
                    done(data);
                }
            });
        });
    }
});
