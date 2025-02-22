import { bind } from 'lodash';
import { FeatureDataHandler, DEFAULT_PROPERTY_LABELS, DEFAULT_HIDDEN_FIELDS, ID_FIELD } from './view/FeatureDataHandler';
/**
 * @class Oskari.mapframework.bundle.featuredata2.Flyout
 *
 * Renders the "featuredata2" flyout.
 */

Oskari.clazz.define(
    'Oskari.mapframework.bundle.featuredata2.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataGridBundleInstance} instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.flyout = null;
        this.state = null;
        this.panels = {};
        this._fixedDecimalCount = 2;

        this.tabsContainer = null;
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');

        this.templateLocateOnMap = jQuery('<div class="featuredata-go-to-location"></div>');
        this.locateOnMapIcon = 2;
        this.colors = {
            locateOnMap: {
                active: '#ffde00',
                normal: '#000000'
            }
        };
        // Resizability of the flyout
        this.resizable = true;
        // Is layout currently resizing?
        this.resizing = false;
        // The size of the layout has been changed (needed when changing tabs)
        this.resized = false;

        this.locateOnMapFID = null;

        // templates
        this.template = {};
        for (var p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
        for (var t in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(t)) {
                this.sandbox.registerForEventByName(this, t);
            }
        }
        this.handler = new FeatureDataHandler(instance.getSelectionService(), (state, updated) => this.update(state, updated));
    }, {
        __templates: {
            wrapper: '<div class="gridMessageContainer" style="margin-top:30px; margin-left: 10px;"></div>'
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.featuredata2.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         *
         * Interface method implementation
         */
        setEl: function (el, flyout) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('featuredata')) {
                jQuery(this.container).addClass('featuredata');
            }
            if (!flyout.hasClass('featuredata')) {
                flyout.addClass('featuredata');
            }
            this.flyout = flyout;
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.tabsContainer = Oskari.clazz.create(
                'Oskari.userinterface.component.TabContainer',
                this.instance.loc('nodata')
            );
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
            return this.instance.loc('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.loc('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },

        isActive: function () {
            if (!this.handler) {
                return false;
            }
            return this.handler.getState().isActive;
        },

        /**
         * @method setState
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method setResizable
         * @param {Boolean} resizable
         *      state of the flyout resizability
         * Defines if the flyout is resizable
         */
        setResizable: function (resizable) {
            this.resizable = resizable;
        },
        setPanel (layerId, panel) {
            this.panels[layerId] = panel;
        },
        getPanel (layerId) {
            return this.panels[layerId];
        },
        hasPanel (layerId) {
            return !!this.panels[layerId];
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            const container = jQuery(this.container);
            container.empty();
            // if previous panel is undefined -> just added first tab
            // if selectedPanel is undefined -> just removed last tab
            this.tabsContainer.addTabChangeListener(
                (previousPanel, selectedPanel) => {
                    // sendout dim request for unselected tab
                    if (previousPanel) {
                        previousPanel.getContainer().hide();
                    }
                    if (!selectedPanel) {
                        return;
                    }
                    const { layer } = selectedPanel;
                    if (layer) {
                        this.handler.setActiveLayer(layer.getId());
                    }
                    if (selectedPanel.getContainer().css('display') === 'none') {
                        selectedPanel.getContainer().show();
                    }
                }
            );
            this.tabsContainer.insertTo(container);

            // Check if  tabcontainer is rendered flyout, fix then flyout overflow
            var containerEl = this.tabsContainer.getElement();
            containerEl.parents('.oskari-flyoutcontentcontainer').css('overflow', 'hidden');
            if (this.resizable) {
                this._enableResize();
            }
            // update panels to add layers that are added before handler and panel container is initialized
            // handler setState doesn't trigger _updatePanels, only add/remove layer updates panels
            this._updatePanels(this.handler.getState().layerIds);
        },
        update: function (state, updated) {
            // some optimization for jQuery rendering
            if (updated === 'selectedFeatures') {
                const { layerId, selectedFeatures } = state;
                this.selectGridValues(layerId, selectedFeatures);
                return;
            }
            if (updated === 'layerIds') {
                const { layerIds } = state;
                this._updatePanels(layerIds);
                return;
            }
            if (updated === 'layerUpdate') {
                this.updatePanelTitles();
                return;
            }
            if (state.isActive) {
                this._renderFeatureData(state);
            }
        },
        _updatePanels: function (layerIds) {
            layerIds.filter(id => !this.hasPanel(id)).forEach(id => this.createPanel(id));
            const stringIds = layerIds.map(id => '' + id);
            Object.keys(this.panels).filter(id => !stringIds.includes(id)).forEach(id => this.removePanel(id));
        },
        turnOnClickOff: function () {
            var me = this;
            me.filterDialog.popup.dialog.off('click', '.add-link');
        },

        addFilterFunctionality: function (event, layer) {
            if (!layer.isFilterSupported()) {
                return;
            }

            var me = this,
                prevJson;

            // this is needed to add the functionality to filter with aggregate analyse values
            // if value is true, the link to filter with aggregate analyse values is added to dialog
            var isAggregateValueAvailable = false; // me.checkIfAggregateValuesAreAvailable();

            var fixedOptions = {
                bboxSelection: true,
                clickedFeaturesSelection: false,
                addLinkToAggregateValues: isAggregateValueAvailable
            };
            me.filterDialog = Oskari.clazz.create(
                'Oskari.userinterface.component.FilterDialog',
                fixedOptions
            );

            me.filterDialog.setUpdateButtonHandler(function (values = {}) {
                me.instance.getFilterSelector().selectWithProperties(values.filters, layer.getId());
            });
            if (isAggregateValueAvailable) {
                me.aggregateAnalyseFilter = Oskari.clazz.create(
                    'Oskari.analysis.bundle.analyse.aggregateAnalyseFilter',
                    me.instance,
                    me.filterDialog
                );

                me.filterDialog.createFilterDialog(layer, prevJson, function () {
                    me.service._returnAnalysisOfTypeAggregate(bind(me.aggregateAnalyseFilter.addAggregateFilterFunctionality, me));
                });
            } else {
                me.filterDialog.createFilterDialog(layer);
            }
            me.filterDialog.setCloseButtonHandler(bind(me.turnOnClickOff, me));
        },

        // function gives value to addLinkToAggregateValues (true/false)
        checkIfAggregateValuesAreAvailable: function () {
            // Force false since 99,999% of users don't have aggregate analysis saved and this only adds confusion to most people.
            // We could enable it if we detect that user actually have these OR add error handling that tells the user the
            //  links is not functioning before there are aggregate analysis available for the user
            return false;
            /*
            this.service = this.instance.sandbox.getService(
                'Oskari.analysis.bundle.analyse.service.AnalyseService'
            );
            if (!this.service) {
                return false;
            }
            return true;
            */
        },

        /**
         * @method createPanel
         * @param {number/string} layerId
         * Adds a tab for the layer
         */
        createPanel: function (layerId) {
            const layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                return;
            }
            const panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.getContainer().append(
                this.instance.loc('loading')
            );
            const name = layer.getName();
            panel.setTitle(name);
            panel.setTooltip(name);
            panel.layer = layer;
            this.setPanel(layer.getId(), panel);
            this.tabsContainer.addPanel(panel);
            if (layer.isFilterSupported()) {
                panel.setTitleIcon('icon-funnel', event => {
                    this.addFilterFunctionality(event, layer);
                });
                panel.getHeader().find('.icon-funnel').prop('title', this.instance.loc('filterDialogTooltip'));
            }
            this.updatePanelTitles();
            return panel;
        },
        updatePanelTitles: function () {
            const panels = this.panels;
            const ids = Object.keys(panels);
            if (!this.flyout || !ids.length) return;
            const spaceForLabel = (this.flyout.width() - 45) / ids.length;
            let maxLabel = (spaceForLabel - 58) / 7; // 7px/char
            maxLabel = maxLabel && maxLabel > 15 ? maxLabel : 15;
            ids.forEach(id => {
                const panel = panels[id];
                const name = panel.layer.getName();
                if (name.length > maxLabel) {
                    panel.updateTitle(name.substring(0, maxLabel - 3) + '\u2026'); // ellipsis
                } else {
                    panel.updateTitle(name);
                }
            });
        },
        /**
         * @method removePanel
         * @param {number/string} layerId
         * Removes the tab for the layer
         */
        removePanel: function (layerId) {
            const panel = this.getPanel(layerId);
            if (panel) {
                panel.getContainer().remove();
                this.tabsContainer.removePanel(panel);
                delete this.panels[layerId];
            }
            this.updatePanelTitles();
        },

        selectGridValues: function (layerId, selectedFeatures) {
            const panel = this.getPanel(layerId);
            if (!panel || !panel.grid) {
                return;
            }
            panel.grid.select(selectedFeatures, false);
        },

        moveSelectedRowsTop: function (layerId) {
            const panel = this.getPanel(layerId);
            if (!panel || !panel.grid) {
                return;
            }
            if (panel.showSelectedRowsFirst) {
                panel.grid.moveSelectedRowsTop(true);
            }
        },
        /**
         * @method _enableResize
         * Enables the flyout resizing
         */
        _enableResize: function () {
            var me = this,
                content = jQuery('div.oskari-flyoutcontent.featuredata'),
                flyout = content.parent().parent(),
                container = content.parent(),
                mouseOffsetX = 0,
                mouseOffsetY = 0;

            // Resizer image for lower right corner
            flyout.find('div.tab-content').css({
                'padding-top': '1px',
                'padding-right': '1px'
            });
            var resizer = jQuery('<div/>');
            resizer.addClass('flyout-resizer');
            var resizerHeight = 16;
            resizer.removeClass('allowHover');
            resizer.addClass('icon-drag');
            resizer.on('dragstart', function (event) {
                event.preventDefault();
            });

            // Start resizing
            resizer.on('mousedown', function (e) {
                if (me.resizing) {
                    return;
                }
                me.resizing = true;
                mouseOffsetX = e.pageX - flyout[0].offsetWidth - flyout[0].offsetLeft;
                mouseOffsetY = e.pageY - flyout[0].offsetHeight - flyout[0].offsetTop;
                // Disable mouse selecting
                jQuery(document).attr('unselectable', 'on')
                    .css('user-select', 'none')
                    .on('selectstart', false);
            });

            // End resizing
            jQuery(document).on('mouseup', function () {
                if (me.resizing) {
                    me.updatePanelTitles();
                }
                me.resizing = false;
                me.resized = true;
            });

            // Resize the featuredata2 flyout
            jQuery(document).on('mousemove', function (e) {
                if (!me.resizing) {
                    return;
                }

                var flyOutMinHeight = 100,
                    flyoutPosition = flyout.offset(),
                    containerPosition = container.offset();

                if (e.pageX > flyoutPosition.left) {
                    var newWidth = e.pageX - flyoutPosition.left - mouseOffsetX;
                    flyout.css('max-width', newWidth.toString() + 'px');
                    flyout.css('width', newWidth.toString() + 'px');
                }
                if (e.pageY - flyoutPosition.top > flyOutMinHeight) {
                    var newHeight = e.pageY - flyoutPosition.top - mouseOffsetY;
                    flyout.css('max-height', newHeight.toString() + 'px');
                    flyout.css('height', newHeight.toString() + 'px');

                    var newContainerHeight = e.pageY - containerPosition.top - mouseOffsetY;
                    container.css('max-height', (newContainerHeight - resizerHeight).toString() + 'px');
                    container.css('height', (newContainerHeight - resizerHeight).toString() + 'px');

                    var tabTools = jQuery('div.oskari-flyoutcontent.featuredata').find('div.grid-tools');

                    // FIXME Need calculate different way or only use styles
                    var paddings = tabTools.height() +
                        flyout.find('.tabsHeader').height() +
                        parseInt(content.css('padding-top') || 0) +
                        parseInt(content.css('padding-bottom') || 0) +
                        (flyout.find('.exporter').height() || 0) + 20;

                    var parent = flyout.find('.oskari-flyoutcontentcontainer');
                    flyout.find('div.tab-content').css('height', (parent.height() - paddings) + 'px');
                }
            });

            // Modify layout for the resizer image
            flyout.find('div.oskari-flyoutcontent').css('padding-bottom', '5px');
            if (flyout.find('div.flyout-resizer').length === 0) {
                flyout.append(resizer);
            }
        },
        calculateSize: function () {
            const flyoutEl = this.flyout;
            const flyoutContent = jQuery(this.container);
            // Define default size for the object data list
            var tabContent = flyoutEl.find('div.tab-content');
            var flyoutContainer = flyoutEl.find('.oskari-flyoutcontentcontainer');

            // FIXME Need calculate different way or only use styles
            var paddings = flyoutContent.find('.grid-tools').height() +
                flyoutContent.find('.tabsHeader').height() +
                parseInt(tabContent.css('padding-top') || 0) +
                parseInt(tabContent.css('padding-bottom') || 0) +
                (flyoutContent.find('.exporter').height() || 0) + 10;
            const containerHeight = flyoutContainer.height();
            if (containerHeight === null) {
                tabContent.css('max-height', '100%');
            } else {
                tabContent.css('height', (containerHeight - paddings) + 'px');
            }
            const mapdiv = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule').getMapEl();
            flyoutContainer.css('max-width', mapdiv.width().toString() + 'px');
        },
        _renderFeatureData: function ({ layerId, inScale, features, selectedFeatures }) {
            let panel = this.getPanel(layerId);
            if (!panel) {
                panel = this.createPanel(layerId);
            }
            if (!this.tabsContainer.isSelected(panel)) {
                return;
            }
            const { layer } = panel;
            const flyoutContent = jQuery(this.container);
            const panelContent = panel.getContainer();
            panelContent.empty();
            if (!inScale) {
                panelContent.append(this.instance.loc('errorscale'));
                return;
            }
            if (features.length === 0) {
                flyoutContent.find('.tab-tools').remove();
                panelContent.removeAttr('style');
                panelContent.append(this.instance.loc('layer.out-of-content-area'));

                if (!panel.grid) {
                    flyoutContent.find('.grid-tools').remove();
                }
                return;
            }
            panelContent.append(this.instance.loc('loading'));

            if (this.instance.getLayerLoadingStatus(layerId) === 'error') {
                return;
            }

            flyoutContent.find('.featuredata2-show-selected-first').remove();
            flyoutContent.find('.grid-tools').remove();
            panelContent.empty();

            const model = this.createModel(layer, features);
            let { grid } = panel;
            if (!grid) {
                grid = this.createGrid(layer, model);
                panel.grid = grid;
            }
            grid.setDataModel(model);

            const gridEl = jQuery('<div class="featuredata2-grid"></div>');
            panelContent.append(gridEl);
            grid.renderTo(gridEl, null, panel.getContainer().parent());

            // Grid opacity
            this.setGridOpacity(layerId, 1.0);
            this.selectGridValues(layerId, selectedFeatures);
            if (!panel.selectedFirstCheckbox) {
                panel.selectedFirstCheckbox = this.createShowSelectedFirst(grid);
            }
            const gridToolsEl = flyoutContent.find('.grid-tools:visible');
            gridToolsEl.find('.featuredata2-show-selected-first').remove();
            const checkboxEl = jQuery(panel.selectedFirstCheckbox.getElement());
            const { disableExport } = this.instance.getConfiguration();
            if (!disableExport && layer.hasPermission('download')) {
                checkboxEl.insertAfter(gridToolsEl);
                jQuery('<div class="featuredata2-show-selected-first" style="clear:both;"></div>').insertAfter(gridToolsEl);
            } else {
                checkboxEl.css('margin-top', '7px');
                gridToolsEl.append(checkboxEl);
            }
            // Extra header message on top of grid
            this._appendHeaderMessage(panel, layer);
            if (!this.resized) {
                this.calculateSize();
            }
        },
        createGrid: function (layer, model) {
            const grid = Oskari.clazz.create(
                'Oskari.userinterface.component.Grid',
                this.instance.loc('columnSelectorTooltip')
            );

            // set selection handler
            grid.addSelectionListener((pGrid, dataId, isCtrlKey) => {
                this._handleGridSelect(layer, dataId, isCtrlKey);
            });

            // set popup handler for inner data
            const showMore = this.instance.loc('showmore');
            grid.setAdditionalDataHandler(showMore, (link, content) => {
                const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(showMore, content);
                dialog.moveTo(link, 'bottom');
                if (this.dialog) {
                    this.dialog.close(true);
                }
                this.dialog = dialog;
            });

            grid.setColumnSelector(true);
            grid.setResizableColumns(true);
            const { disableExport } = this.instance.getConfiguration();
            if (!disableExport) {
                grid.setExcelExporter(layer.hasPermission('download'));
            }
            const dataSource = typeof layer.getSource === 'function' && layer.getSource() ? layer.getSource() : layer.getOrganizationName();
            // Data source & metadata link
            grid.setDataSource(dataSource);
            grid.setMetadataLink(layer.getMetadataIdentifier());
            // localizations
            DEFAULT_PROPERTY_LABELS.forEach((value, key) => grid.setColumnUIName(key, value));
            Object.entries(layer.getPropertyLabels()).forEach(([key, value]) => grid.setColumnUIName(key, value));

            const visibleFields = model.getFields().filter(field => !DEFAULT_HIDDEN_FIELDS.includes(field));
            visibleFields.forEach(field => grid.setNumericField(field, this._fixedDecimalCount));
            grid.setVisibleFields(visibleFields);
            return grid;
        },
        createShowSelectedFirst: function (grid) {
            const checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
            checkbox.setTitle(this.instance.loc('showSelectedFirst'));
            checkbox.addClass('featuredata2-show-selected-first');
            checkbox.setHandler(() => {
                grid.moveSelectedRowsTop(checkbox.isChecked());
            });
            return checkbox;
        },

        setGridOpacity: function (layerId, opacity) {
            if (!this.isActive() || isNaN(opacity)) {
                return;
            }
            const panel = this.getPanel(layerId);
            if (panel && panel.grid && this.tabsContainer.isSelected(panel)) {
                this.flyout.find('div.tab-content').css({ opacity });
            }
        },
        /**
         * @method _addFeatureValues
         * @private
         * @param {Oskari.userinterface.component.GridModel} grid
         * @param {Object[]} features
         *
         * Adds features to the model data
         */
        createModel: function (layer, features) {
            const model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            const selection = layer.getPropertySelection();
            if (selection.length) {
                const fields = selection.includes(ID_FIELD) ? selection : [ID_FIELD, ...selection];
                model.setFields(fields);
            }
            model.setIdField(ID_FIELD);
            // if layer doesn't have filtered fields then fields is set from first feature
            features.forEach(feat => {
                model.addData(feat);
            });
            model.setFirstField(ID_FIELD);
            return model;
        },
        _processPropertyValue: function (value) {
            if (value === null || value === undefined) {
                return '';
            }
            if (this._isUrlValid(value)) {
                const url = value.startsWith('http') ? value : 'http://' + value;
                return '<a href="' + url + '" target="_blank">' + value + '</a>';
            }
            return value;
        },

        /**
         * @method _isUrlValid
         * @param {String} url
         * @returns {boolean}
         * @private
         *
         * Checks if a url is valid
         */
        _isUrlValid: function (url) {
            if ((!url) || (typeof url !== 'string')) {
                return false;
            }
            var re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-zåÅäÄöÖ0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(url);
        },

        /**
         * @method _handleGridSelect
         * @private
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * @param {String} featureId
         *           id for the feature that was selected
         * @param {Boolean} keepPrevious
         *           true to keep previous selection, false to clear before selecting
         * Notifies components that a selection was made
         */
        // TODO: why WFSLayerService doesn't send selected events??
        _handleGridSelect: function (layer, featureId, keepPrevious) {
            const layerId = layer.getId();
            const panel = this.getPanel(layerId);
            if (!this.tabsContainer.isSelected(panel)) {
                return;
            }
            this.instance.setFeatureSelections(layerId, [featureId], keepPrevious);
        },

        /**
         * @method setEnabled
         * True to enable grid functionality
         * False to disable and stop reacting to any map movements etc
         *
         * @param {Boolean} isEnabled
         *
         */
        setEnabled: function (isEnabled) {
            this.handler.setIsActive(!!isEnabled);
            // feature info activation disabled if object data grid flyout active and vice versa
            var gfiReqBuilder = Oskari.requestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
            );
            const name = this.instance.getName();
            if (gfiReqBuilder) {
                this.instance.sandbox.request(
                    name,
                    gfiReqBuilder(!isEnabled, name)
                );
            }
            if (!isEnabled) {
                return;
            }
            // clear panels
            for (var panel in this.panels) {
                if (panel.getContainer) {
                    panel.getContainer().empty();
                }
            }
        },
        /**
         * Shows/removes a loading indicator for the layer
         * @param  {String}  layerId
         * @param  {Boolean} blnLoading true to show, false to remove
         */
        showLoadingIndicator: function (layerId, blnLoading) {
            this.__addOrRemoveClassFromHeader(
                this.panels[layerId], blnLoading, 'loading');
        },
        /**
         * Shows/removes an error indicator for the layer
         * @param  {String}  layerId
         * @param  {Boolean} blnError true to show, false to remove
         */
        showErrorIndicator: function (layerId, blnError) {
            this.__addOrRemoveClassFromHeader(
                this.panels[layerId], blnError, 'error');
        },
        /**
         * Actual implementation to show/remove indicator. Just
         * adds a class to the header of a panel
         * @private
         * @param  {Oskari.userinterface.component.TabPanel} panel
         * @param  {Boolean} blnAdd  true to show, false to remove
         * @param  {String} strClass class to toggle
         */
        __addOrRemoveClassFromHeader: function (panel, blnAdd, strClass) {
            var link;
            if (panel) {
                link = panel.getHeader().find('a');
            }
            if (!link) {
                // not found
                return;
            }
            // setup indicator
            if (blnAdd) {
                link.addClass(strClass);
            } else {
                link.removeClass(strClass);
            }
        },
        /**
         * Add message text over tab data grid, if analysislayer
         * @private
         * @param  {Oskari.userinterface.component.TabPanel} panel
         * @param  {String} layer  Oskari layer
         */
        _appendHeaderMessage: function (panel, layer) {
            // clean up the old headermessage in case there was one
            jQuery(panel.html).parent().find('div.gridMessageContainer').remove();
            if (!layer || !layer.isLayerOfType('analysislayer')) {
                return;
            }
            // Extract analysis input layer id
            const inputid = layer.getId().split('_')[1];
            const inputlayer = this.instance.getSandbox().findMapLayerFromAllAvailable(inputid);
            let message;
            if (inputlayer && inputlayer.getLayerType().toUpperCase() === 'WFS') {
                const noData = inputlayer.getWpsLayerParams().noDataValue;
                if (noData) {
                    message = this.instance.loc('gridFooter.noDataCommonMessage') + ' (' + noData + ').';
                    const locales = Object.values(layer.getPropertyLabels());
                    const aggregateLoc = this.instance.loc('gridFooter.aggregateColumnField');
                    // TODO: better management for recognasing private data messages
                    locales.forEach(field => {
                        if (field === aggregateLoc) {
                            message = this.instance.loc('gridFooter.noDataMessage') + ' (' + noData + ').';
                        } else if (field === 'Muutos_t2-t1') {
                            message += ' ' + this.instance.loc('gridFooter.differenceMessage') + ' -111111111.';
                        }
                    });
                }
            }

            if (message) {
                var footer = this.template.wrapper.clone();
                // insert header text into dom before tabcontent (=always visible when content scrolling)
                jQuery(panel.html).before(footer.html(message));
            }
        }

    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
