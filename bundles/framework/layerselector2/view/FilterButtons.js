Oskari.clazz.define("Oskari.layerselector2.view.FilterButtons",
    function (layertabs) {
        this.layerTabs = null;
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');
        this.filterTemplate = jQuery('<div class="filter filter-border">'+
                                            '<center><div class="filter-icon">'+
                                            '</div><div class="filter-text"></div></center>'+
                                        '</div>');
        this.filterButtons = [];
        Oskari.makeObservable(this);
    }, {
        create: function (tabs, toolText, tooltip, iconClassActive, iconClassDeactive, filterName) {
            this.layerTabs = tabs;
            var me = this;
            var loc = Oskari.getLocalization('LayerSelector').layerFilter;

            if ( me.buttonIsCreated(filterName) ) {
                me.render();
                return;
            } else {
                var filterButton = me.filterTemplate.clone()

                filterButton.attr('data-filter', filterName);
                filterButton.find('.filter-text').html(toolText);
                filterButton.attr('title', tooltip);
                filterButton.find('.filter-icon').addClass('filter-' + filterName);
                filterButton.find('.filter-icon').addClass(iconClassDeactive);
               
                me.filterButtons.push({
                    name: filterName,
                    element: filterButton
                });

                filterButton.unbind('click');
                filterButton.bind('click', function(evt) {
                    var filterIcon = jQuery(evt.target).parent().find('.filter-icon.' + 'filter-' + filterName);
                    me.deactivateAllFilters(filterName);
                    if (filterIcon.hasClass(iconClassDeactive)) {
                        // Activate this filter
                        me._setFilterIconClasses(filterName);
                        me.activateFilter(filterName);
                        me._setFilterTooltip(filterName, loc.tooltips.remove);
                    } else {
                        // Deactivate all filters
                        me.deactivateAllFilters();
                    }
                });
                me.render();
            }
        },
        buttonIsCreated: function (filterName) {
            var created = false;
            this.filterButtons.filter(function(button) {
                if ( button.name === filterName ) {
                    created = true;
                }
            });
            return created;
        },
          /**
         * Set filter button tooltip
         * @method  @private _setFilterTooltip
         * @param {String} filterName filter name
         * @param {String} tooltip    tooltip
         */
        _setFilterTooltip: function(filterName, tooltip) {
            var me = this;
            me.layerTabs.forEach(function(tab) {
                var filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');
                var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filterName);
                filterIcon.parents('.filter').attr('title', tooltip);
            });
        },
        /**
         * Set filter icon classes
         * @method  @private _setFilterIconClasses
         * @param {String} filterName filter name
         */
        _setFilterIconClasses: function(filterName) {
            var me = this;
            me.layerTabs.forEach(function(tab) {
                var filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');
                var filters = me.layerlistService.getLayerlistFilterButton();
                Object.keys(filters).forEach(function(key) {
                    var filter = filters[key];
                    var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                    // First remove all active classes
                    filterIcon.removeClass(filter.cls.active);
                    filterIcon.removeClass(filter.cls.deactive);
                    filterIcon.removeClass('active');
                    // If filter has same than currently selected then activate icon
                    if (filter.id === filterName) {
                        filterIcon.addClass(filter.cls.active);
                        filterIcon.addClass('active');
                    }
                    // Otherwise use deactive icon
                    else {
                        filterIcon.addClass(filter.cls.deactive);
                    }
                });
            });
        },
        /**
         * Activate selected filter.
         * @method @public activateFilter
         * @param  {Function} filterName activate filter name
         */
        activateFilter: function(filterName) {
            var me = this;
            me._currentFilter = filterName;

            me.layerTabs.forEach(function(tab) {
                var filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');
                var filters = me.layerlistService.getLayerlistFilterButton();
                Object.keys(filters).forEach(function(key) {
                    var filter = filters[key];
                    var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                    if(filter.id === filterName) {
                        filterIcon.removeClass(filter.cls.deactive);
                        filterIcon.addClass(filter.cls.active);
                        filterIcon.addClass('active');
                    } else {
                        filterIcon.removeClass(filter.cls.active);
                        filterIcon.addClass(filter.cls.deactive);
                        filterIcon.removeClass('active');
                    }
                });
            });
            this.trigger('FilterActivate', me._currentFilter);
        },
        /**
         * Deactivate all filters
         * @method  @public deactivateAllFilters
         *
         * @param {String} notDeactivateThisFilter not deactivate this filter
         */
        deactivateAllFilters: function(notDeactivateThisFilter) {
            var me = this;

            me._currentFilter = null;
            me.layerTabs.forEach(function(tab, tabIndex) {
                var filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');
                var filters = me.layerlistService.getLayerlistFilterButton();
                Object.keys(filters).forEach(function(key) {
                    var filter = filters[key];
                    if (!notDeactivateThisFilter || filter.id !== notDeactivateThisFilter) {
                        var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                        filterIcon.removeClass(filter.cls.active);
                        filterIcon.removeClass('active');
                        filterIcon.addClass(filter.cls.deactive);
                        // Set tooltip for one per filter
                        if (tabIndex === 0) {
                            me._setFilterTooltip(filter.name, filter.tooltip);
                        }
                    }
                });
            });

            if (!notDeactivateThisFilter) {
                me.activateFilter();
            }
        },
        render: function() {
            var me = this;
            this.layerTabs.forEach( function( tab ) {
                var filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');
                filterContainer.empty();
                me.filterButtons.forEach( function(button) {
                    filterContainer.append(button.element.clone(true));
                });
            });
        }
    }
);