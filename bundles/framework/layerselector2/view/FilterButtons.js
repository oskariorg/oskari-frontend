Oskari.clazz.define('Oskari.layerselector2.view.FilterButtons',
    function (element, layerListService) {
        var me = this;
        this.layerlistService = layerListService;
        this.filterTemplate = jQuery('<div class="filter filter-border">' +
                                            '<center><div class="filter-icon">' +
                                            '</div><div class="filter-text"></div></center>' +
                                        '</div>');
        this.filterButtons = [];
        this.renderableButtons = [];
        this.rootElement = element;

        this.layerlistService.on('Layerlist.Filter.Button.Add', function (button) {
            me.createButton(button.properties.text, button.properties.tooltip, button.properties.cls.active, button.properties.cls.deactive, button.filterId);
        });

        Oskari.makeObservable(this);
    }, {
        createButton: function (toolText, tooltip, iconClassActive, iconClassDeactive, filterName) {
            var me = this;
            var loc = Oskari.getLocalization('LayerSelector').layerFilter;
            if (me.filterIsCreated(filterName)) {
                return;
            }
            var filterButton = me.filterTemplate.clone();

            filterButton.attr('data-filter', filterName);
            filterButton.find('.filter-text').html(toolText);
            filterButton.attr('title', tooltip);
            filterButton.find('.filter-icon').addClass('filter-' + filterName);
            filterButton.find('.filter-icon').addClass(iconClassDeactive);

            me.filterButtons.push({
                name: filterName,
                element: filterButton
            });

            filterButton.off('click');
            filterButton.on('click', function (evt) {
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
        },
        filterIsCreated: function (filterName) {
            var created = false;
            this.filterButtons.filter(function (button) {
                if (button.name === filterName) {
                    created = true;
                }
            });
            return created;
        },
        setFilters: function (activeFiltersList) {
            var me = this;
            if (activeFiltersList.length === 0) {
                return;
            }
            me.renderableButtons = activeFiltersList;
            activeFiltersList.forEach(function (filter) {
                var button = me.layerlistService.getLayerlistFilterButton(filter);
                if (!button) {
                    return;
                }
                if (me.filterIsCreated(button.id)) {
                    me.render();
                    return;
                }
                me.createButton(button.text, button.tooltip, button.cls.active, button.cls.deactive, button.id);
            });
        },
        /**
         * Set filter button tooltip
         * @method  @private _setFilterTooltip
         * @param {String} filterName filter name
         * @param {String} tooltip    tooltip
         */
        _setFilterTooltip: function (filterName, tooltip) {
            var filterIcon = this.rootElement.find('.filter-icon.' + 'filter-' + filterName);
            filterIcon.parents('.filter').attr('title', tooltip);
        },
        /**
         * Set filter icon classes
         * @method  @private _setFilterIconClasses
         * @param {String} filterName filter name
         */
        _setFilterIconClasses: function (filterName) {
            var filterContainer = this.rootElement;
            var filters = this.layerlistService.getLayerlistFilterButton();

            Object.keys(filters).forEach(function (key) {
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
        },
        /**
         * Activate selected filter.
         * @method @public activateFilter
         * @param  {Function} filterName activate filter name
         */
        activateFilter: function (filterName) {
            this._currentFilter = filterName;

            var filterContainer = this.rootElement;
            var filters = this.layerlistService.getLayerlistFilterButton();
            Object.keys(filters).forEach(function (key) {
                var filter = filters[key];
                var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                if (filter.id === filterName) {
                    filterIcon.removeClass(filter.cls.deactive);
                    filterIcon.addClass(filter.cls.active);
                    filterIcon.addClass('active');
                } else {
                    filterIcon.removeClass(filter.cls.active);
                    filterIcon.addClass(filter.cls.deactive);
                    filterIcon.removeClass('active');
                }
            });
            this.trigger('FilterActivate', this._currentFilter);
        },
        /**
         * Deactivate all filters
         * @method  @public deactivateAllFilters
         *
         * @param {String} notDeactivateThisFilter not deactivate this filter
         */
        deactivateAllFilters: function (notDeactivateThisFilter) {
            var me = this;
            me._currentFilter = null;
            var filterContainer = this.rootElement;
            var filters = me.layerlistService.getLayerlistFilterButton();

            Object.keys(filters).forEach(function (key) {
                var filter = filters[key];
                if (!notDeactivateThisFilter || filter.id !== notDeactivateThisFilter) {
                    var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                    filterIcon.removeClass(filter.cls.active);
                    filterIcon.removeClass('active');
                    filterIcon.addClass(filter.cls.deactive);
                    // Set tooltip for one per filter
                    me._setFilterTooltip(filter.name, filter.tooltip);
                }
            });

            if (!notDeactivateThisFilter) {
                me.activateFilter();
            }
            this.trigger('FilterActivate', this._currentFilter);
        },
        render: function () {
            var me = this;
            this.rootElement.empty();
            this.filterButtons.forEach(function (button) {
                if (me.renderableButtons.indexOf(button.name) !== -1) {
                    me.rootElement.append(button.element.clone(true));
                }
            });
        }
    }
);
