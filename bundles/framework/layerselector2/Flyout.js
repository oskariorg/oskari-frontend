/**
 * @class Oskari.mapframework.bundle.layerselector2.Flyout
 *
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.layerselector2.LayerSelectorBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        var me = this;
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.state = null;
        this.layerTabs = [];
        this.filterTemplate = jQuery('<div class="filter filter-border"><center><div class="filter-icon"></div><div class="filter-text"></div></center></div>');
        this.filters = [];
        this._filterNewestCount = 20;
        this._currentFilter = null;

        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');

        this.addedButtons = {};

        this.layerlistService.on('Layerlist.Filter.Button.Add', function(button) {
            me.addFilterTool(button.properties.text, button.properties.tooltip, button.properties.cls.active, button.properties.cls.deactive, button.filterId);
        });
    }, {

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.layerselector2.Flyout';
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
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('layerselector2')) {
                jQuery(this.container).addClass('layerselector2');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this,
                inspireTab = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.view.LayersTab',
                    me.instance,
                    me.instance.getLocalization('filter').inspire,
                    'oskari_layerselector2_tabpanel_inspiretab'
                ),
                orgTab = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.view.LayersTab',
                    me.instance,
                    me.instance.getLocalization('filter').organization,
                    'oskari_layerselector2_tabpanel_orgtab'
                ),
                publishedTab,
                elParent,
                elId;


            me.template = jQuery('<div class="allLayersTabContent"></div>');
            inspireTab.groupingMethod = 'getInspireName';
            orgTab.groupingMethod = 'getOrganizationName';

            me.layerTabs.push(inspireTab);
            me.layerTabs.push(orgTab);

            // add published tab based on config
            if (me.instance.conf && me.instance.conf.showPublishedTab === true) {
                publishedTab = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.view.PublishedLayersTab',
                    me.instance,
                    me.instance.getLocalization('filter').published
                );
                this.layerTabs.push(publishedTab);
            }

            elParent = this.container.parentElement.parentElement;
            elId = jQuery(elParent).find('.oskari-flyouttoolbar .oskari-flyouttools .oskari-flyouttool-close');
            elId.attr('id', 'oskari_layerselector2_flyout_oskari_flyouttool_close');

            var buttons = me.layerlistService.getLayerlistFilterButton();
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

            me.layerlistService.registerLayerlistFilterButton(loc.buttons.newest,
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

            me.layerlistService.registerLayerlistFilterButton(loc.buttons.featuredata,
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
        stopPlugin: function () {
        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {
        },

        /**
         * @method setState
         * @param {String} state
         *     close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * Set content state
         * @method  @public setContentState
         * @param {Object} state a content state
         */
        setContentState: function (state) {
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

        getContentState: function () {
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
        createUi: function () {
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
            if (this.layerTabs && this.layerTabs.length) {
                this.layerTabs[0].focus();
            }
        },

        /**
         * Populate layer lists.
         * @method  @public populateLayers
         */
        populateLayers: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            // populate layer list
            var layers = (me._currentFilter) ? me.mapLayerService.getFilteredLayers(me._currentFilter) : me.mapLayerService.getAllLayers();

            this.layerTabs.forEach(function (tab) {
                // populate tab if it has grouping method
                if (tab.groupingMethod) {
                    var layersCopy = layers.slice(0);
                    var groups = me._getLayerGroups(
                        layersCopy,
                        tab.groupingMethod
                    );
                    tab.showLayerGroups(groups);
                }
            });
        },

        /**
         * @method _getLayerGroups
         * @private
         */
        _getLayerGroups: function (layers, groupingMethod) {
            var me = this,
                groupList = [],
                group = null,
                n,
                layer,
                groupAttr;

            // sort layers by grouping & name
            layers.sort(function(a, b) {
                return me._layerListComparator(a, b, groupingMethod);
            });

            for (n = 0; n < layers.length; n += 1) {
                layer = layers[n];
                if (layer.getMetaType && layer.getMetaType() === 'published') {
                    // skip published layers
                    continue;
                }
                groupAttr = layer[groupingMethod]();
                if (!group || group.getTitle() !== groupAttr) {
                    group = Oskari.clazz.create(
                        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                        groupAttr
                    );
                    groupList.push(group);
                }

                group.addLayer(layer);
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
        _layerListComparator: function (a, b, groupingMethod) {
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
        handleLayerSelectionChanged: function (layer, isSelected) {
            this.layerTabs.forEach(function (tab) {
                tab.setLayerSelected(layer.getId(), isSelected);
            });
        },

        /**
         * @method handleLayerModified
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was modified
         * let's refresh ui to match current layers
         */
        handleLayerModified: function (layer) {
            this.layerTabs.forEach(function (tab) {
                tab.updateLayerContent(layer.getId(), layer);
            });
        },

        /**
         * @method handleLayerSticky
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer thats switch off diasable/enable is changed
         * let's refresh ui to match current layers
         */
        handleLayerSticky: function (layer) {
            this.layerTabs.forEach(function (tab) {
                tab.updateLayerContent(layer.getId(), layer);
            });
        },

        /**
         * @method handleLayerAdded
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         *           layer that was added
         * let's refresh ui to match current layers
         */
        handleLayerAdded: function (layer) {
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
        handleLayerRemoved: function (layerId) {
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
                    filterContainer = tab.getTabPanel().getContainer().find('.layerselector2-layer-filter');

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
        }
    }, {

        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });