/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.Flyout
 *
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundleInstance} instance
     *    reference to component that created the flyout
     */

    function(instance) {
        var me = this;
        //"use strict";
        this.instance = instance;
        this.service = this.instance.layerlistExtenderService;
        this.container = null;
        this.template = null;
        this.state = null;
        this.layerTabs = [];
        this.filterTemplate = jQuery('<div class="filter filter-border"><center><div class="filter-icon"></div><div class="filter-text"></div></center></div>');

        this._filterNewestCount = 20;
        this._currentFilter = null;
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');

        this.addedButtons = {};

        this.mapLayerService.on('Layerlist.Filter.Button.Add', function(button) {
            me.addFilterTool(button.properties.text, button.properties.tooltip, button.properties.cls.active, button.properties.cls.deactive, button.filterId);
        });
        this._bindExtenderServiceListeners();
    }, {
        _bindExtenderServiceListeners: function() {
            var me = this;

            me.service.on('option.added', function() {
                me.populateLayers();
            });

            me.service.on('admin.changed', function() {
                me.populateLayers();
            });
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            //"use strict";
            return 'Oskari.framework.bundle.hierarchical-layerlist.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function(el, width, height) {
            //"use strict";
            this.container = el[0];
            if (!jQuery(this.container).hasClass('hierarchical-layerlist')) {
                jQuery(this.container).addClass('hierarchical-layerlist');
            }
            jQuery(this.container).parents('.oskari-flyout').addClass('hierarchical-layerlist-flyout');
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function() {
            //"use strict";
            var me = this,
                layerGroupTab = Oskari.clazz.create(
                    'Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroupTab',
                    me.instance,
                    me.instance.getLocalization('filter').allLayers,
                    'oskari_hierarchical-layerlist_tabpanel_layergrouptab'
                ),
                elParent,
                elId;

            me.template = jQuery('<div class="allLayersTabContent"></div>');
            layerGroupTab.groupingMethod = 'getInspireName';
            me.layerTabs.push(layerGroupTab);

            elParent = this.container.parentElement.parentElement;
            elId = jQuery(elParent).find('.oskari-flyouttoolbar .oskari-flyouttools .oskari-flyouttool-close');
            elId.attr('id', 'oskari_hierarchical-layerlist_flyout_oskari_flyouttool_close');

            var buttons = me.mapLayerService.getLayerlistFilterButton();
            Object.keys(buttons).forEach(function(key) {
                var button = buttons[key];
                me.addFilterTool(button.text, button.tooltip, button.cls.active, button.cls.deactive, button.id);
            });
        },

        /**
         * Adds default filter buttons.
         * @method  @private addDefaultFilters
         */
        addDefaultFilters: function() {
            var me = this;

            // Add newest filter
            me.addNewestFilter();

            // Add featuredata filter
            me.addFeaturedataFilter();
        },

        /**
         * Add newest filter.
         * @method  @public addNewestFilter
         */
        addNewestFilter: function() {
            var me = this,
                loc = me.instance.getLocalization('layerFilter');

            me.mapLayerService.registerLayerlistFilterButton(loc.buttons.newest,
                loc.tooltips.newest.replace('##', me._filterNewestCount), {
                    active: 'layer-newest',
                    deactive: 'layer-newest-disabled'
                },
                'newest');
        },

        /**
         * Add featuredata filter.
         * @method  @public addFeaturedataFilter
         */
        addFeaturedataFilter: function() {
            var me = this,
                loc = me.instance.getLocalization('layerFilter');

            me.mapLayerService.registerLayerlistFilterButton(loc.buttons.featuredata,
                loc.tooltips.featuredata, {
                    active: 'layer-stats',
                    deactive: 'layer-stats-disabled'
                },
                'featuredata');
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function() {
            //"use strict";
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function() {
            //"use strict";
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function() {
            //"use strict";
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function() {
            //"use strict";
        },

        /**
         * @method setState
         * @param {String} state
         *     close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function(state) {
            //"use strict";
            this.state = state;
        },

        /**
         * Set content state
         * @method  @public setContentState
         * @param {Object} state a content state
         */
        setContentState: function(state) {
            //"use strict";
            var i,
                tab;
            // prepare for complete state reset
            if (!state) {
                state = {};
            }

            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                if (tab.getTitle() === state.tab) {
                    this.tabContainer.select(tab.getTabPanel());
                    tab.setState(state);
                }
            }
        },

        getContentState: function() {
            //"use strict";
            var state = {},
                i,
                tab;
            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                if (this.tabContainer.isSelected(tab.getTabPanel())) {
                    state = tab.getState();
                    break;
                }
            }
            return state;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function() {
            //"use strict";
            var me = this,
                // clear container
                cel = jQuery(this.container),
                i,
                tab;

            cel.empty();

            me.tabContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer'
            );

            // Add filter tab change listener
            me.tabContainer.addTabChangeListener(function(previousTab, newTab) {
                if (me._currentFilter) {
                    me.activateFilter(me._currentFilter);
                }
            });
            me.tabContainer.insertTo(cel);
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                me.tabContainer.addPanel(tab.getTabPanel());
            }


            // Add other tabs
            var selectedTab = Oskari.clazz.create('Oskari.framework.bundle.hierarchical-layerlist.view.SelectedLayersTab', me.instance);
            me.tabContainer.addPanel(selectedTab.getTabPanel());

            me.tabContainer.addTabChangeListener(
                function(previousTab, newTab) {
                    // Make sure this fires only when the flyout is open
                    if (!cel.parents('.oskari-flyout.oskari-closed').length) {
                        var searchInput = newTab.getContainer().find('input[type=text]');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }
                }
            );

            // Create default filters
            me.addDefaultFilters();
            me.populateLayers();
        },

        /**
         * @public @method focus
         * Focuses the first panel's search field (if available)
         *
         *
         */
        focus: function() {
            if (this.layerTabs) {
                this.layerTabs[0].focus();
            }
        },

        /**
         * Populate layer lists.
         * @method  @public populateLayers
         */
        populateLayers: function() {
            //"use strict";
            var me = this;
            var sandbox = this.instance.getSandbox(),
                // populate layer list
                layers = (me._currentFilter) ? me.mapLayerService.getFilteredLayers(me._currentFilter) : me.mapLayerService.getAllLayers(),
                i,
                tab,
                layersCopy,
                groups;
            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                // populate tab if it has grouping method
                if (tab.groupingMethod) {
                    //layersCopy = layers.slice(0);
                    groups = this._getLayerGroups(
                        tab.groupingMethod
                    );
                    tab.showLayerGroups(groups);
                }
            }
        },

        /**
         * @method _getLayerGroups
         * @private
         */
        _getLayerGroups: function(groupingMethod) {
            //"use strict";
            var me = this,
                groupList = [],
                groupModel = null,
                n,
                layer,
                groupAttr;

            var allGroups = (me._currentFilter) ? me.mapLayerService.getFilteredLayerGroups(me._currentFilter) : me.mapLayerService.getAllLayerGroups();
            allGroups.forEach(function(group) {
                groupModel = Oskari.clazz.create(
                    'Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',
                    group,
                    me.mapLayerService
                );
                groupList.push(groupModel);
            });

            if (me.service.hasAdmin()) {
                return groupList;
            }

            var sortedGroupList = jQuery.grep(groupList, function(group, index) {
                return group.getLayers().length > 0;
            });
            return sortedGroupList;
        },

        /**
         * @method _layerListComparator
         * Uses the private property #grouping to sort layer objects in the wanted order for rendering
         * The #grouping property is the method name that is called on layer objects.
         * If both layers have same group, they are ordered by layer.getName()
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
         * @param {String} groupingMethod method name to sort by
         */
        _layerListComparator: function(a, b, groupingMethod) {
            //"use strict";
            var nameA = a[groupingMethod]().toLowerCase(),
                nameB = b[groupingMethod]().toLowerCase();
            if (nameA === nameB && (a.getName() && b.getName())) {
                nameA = a.getName().toLowerCase();
                nameB = b.getName().toLowerCase();
            }
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        },

        /**
         * @method handleLayerSelectionChanged
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
         *           layer that was changed
         * @param {Boolean} isSelected
         *           true if layer is selected, false if removed from selection
         * let's refresh ui to match current layer selection
         */
        handleLayerSelectionChanged: function(layer, isSelected) {
            //"use strict";
            var i,
                tab;
            for (i = 0; i < this.layerTabs.length; i += 1) {
                tab = this.layerTabs[i];
                tab.setLayerSelected(layer.getId(), isSelected);
            }
        },

        /**
         * @method handleLayerModified
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was modified
         * let's refresh ui to match current layers
         */
        handleLayerModified: function(layer) {
            //"use strict";
            var me = this,
                i,
                tab;
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                tab.updateLayerContent(layer.getId(), layer);
            }
        },

        /**
         * @method handleLayerSticky
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer thats switch off diasable/enable is changed
         * let's refresh ui to match current layers
         */
        handleLayerSticky: function(layer) {
            //"use strict";
            var me = this,
                i,
                tab;
            for (i = 0; i < me.layerTabs.length; i += 1) {
                tab = me.layerTabs[i];
                tab.updateLayerContent(layer.getId(), layer);
            }
        },

        /**
         * @method handleLayerAdded
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was added
         * let's refresh ui to match current layers
         */
        handleLayerAdded: function(layer) {
            //"use strict";
            var me = this;
            me.populateLayers();
            // we could just add the layer to correct group and update the layer count for the group
            // but saving time to do other finishing touches
        },

        /**
         * @method handleLayerRemoved
         * @param {String} layerId
         *           id of layer that was removed
         * let's refresh ui to match current layers
         */
        handleLayerRemoved: function(layerId) {
            //"use strict";
            var me = this;
            me.populateLayers();
            // we could  just remove the layer and update the layer count for the group
            // but saving time to do other finishing touches
        },

        /**
         * Add filter tool to layer list.
         * @method  @public addFilterTool
         * @param {String} toolText             tool button text
         * @param {String} tooltip              tool tooltip text
         * @param {String} iconClassActive      tool icon active class
         * @param {String} iconClassDeactive    tool icon deactive class
         * @param {String} filterName           filter name
         */
        addFilterTool: function(toolText, tooltip, iconClassActive, iconClassDeactive, filterName) {
            var me = this;
            if (me.addedButtons[filterName]) {
                return;
            }

            var filter = {
                toolText: toolText,
                tooltip: tooltip,
                iconClassActive: iconClassActive,
                iconClassDeactive: iconClassDeactive,
                filterName: filterName
            };
            var loc = me.instance.getLocalization('layerFilter');

            me.layerTabs.forEach(function(tab) {
                var filterButton = me.filterTemplate.clone(),
                    filterContainer = tab.getTabPanel().getContainer().find('.hierarchical-layerlist-layer-filter');

                filterButton.attr('data-filter', filterName);
                filterButton.find('.filter-text').html(toolText);
                filterButton.attr('title', tooltip);
                filterButton.find('.filter-icon').addClass('filter-' + filterName);
                filterButton.find('.filter-icon').addClass(iconClassDeactive);

                filterButton.unbind('click');
                filterButton.bind('click', function() {
                    var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filterName);
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

                filterContainer.append(filterButton);
            });
            me.addedButtons[filterName] = true;
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
                var filterContainer = tab.getTabPanel().getContainer().find('.hierarchical-layerlist-layer-filter');
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
                var filterContainer = tab.getTabPanel().getContainer().find('.hierarchical-layerlist-layer-filter');
                var filters = me.mapLayerService.getLayerlistFilterButton();
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
            me.populateLayers();
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
                var filterContainer = tab.getTabPanel().getContainer().find('.hierarchical-layerlist-layer-filter');
                var filters = me.mapLayerService.getLayerlistFilterButton();
                Object.keys(filters).forEach(function(key) {
                    var filter = filters[key];
                    if (!notDeactivateThisFilter || filter.id !== notDeactivateThisFilter) {
                        var filterIcon = filterContainer.find('.filter-icon.' + 'filter-' + filter.id);
                        filterIcon.removeClass(filter.cls.active);
                        filterIcon.removeClass('active');
                        filterIcon.addClass(filter.cls.deactive);
                        // Set tooltip for one per filter
                        if (tabIndex === 0) {
                            me._setFilterTooltip(filter.id, filter.tooltip);
                        }
                    }
                });
            });

            if (!notDeactivateThisFilter) {
                me.activateFilter();
            }
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });