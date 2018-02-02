
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
        this.state = null;
        this.layers = {};
        this._fixedDecimalCount = 2;

        this.tabsContainer = null;
        this.selectedTab = null;
        this.active = false;
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
                me.sandbox.registerForEventByName(me, t);
            }
        }

        this.wfsLayerService = null;
    }, {
        __templates: {
            wrapper : '<div class="gridMessageContainer" style="margin-top:30px; margin-left: 10px;"></div>'
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
        setEl: function (el) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('featuredata')) {
                jQuery(this.container).addClass('featuredata');
            }
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
                this.instance.getLocalization('nodata')
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
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
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

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                flyout = jQuery(me.container),
                sandbox = me.instance.sandbox,
                reqBuilder = Oskari.requestBuilder(
                    'activate.map.layer'
                );

            flyout.empty();
            me.WFSLayerService = sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');

            // if previous panel is undefined -> just added first tab
            // if selectedPanel is undefined -> just removed last tab
            me.tabsContainer.addTabChangeListener(
                function (previousPanel, selectedPanel) {
                    var request;
                    // sendout dim request for unselected tab
                    if (previousPanel) {
                        request = reqBuilder(previousPanel.layer.getId(), false);
                        sandbox.request(me.instance.getName(), request);
                        previousPanel.getContainer().hide();
                    }
                    me.selectedTab = selectedPanel;
                    if (selectedPanel) {

                        if( selectedPanel.getContainer().css('display') == 'none') {
                            selectedPanel.getContainer().show();
                        }
                        // sendout highlight request for selected tab
                        if (me.active) {
                            var selection = [];
                            if(me.layers[selectedPanel.layer.getId()] && me.layers[selectedPanel.layer.getId()].grid) {
                                selection = me.layers[selectedPanel.layer.getId()].grid.getSelection();
                            }
                            if(selection && selection.length>0) {
                                selection.forEach(function(selected, index){
                                    me._handleGridSelect(selectedPanel.layer, selected.__fid, index!==0);
                                });
                            }
                            request = reqBuilder(selectedPanel.layer.getId(), true);
                            sandbox.request(me.instance.getName(), request);
                        }
                        me.updateData(selectedPanel.layer);
                    }
                }
            );
            me.tabsContainer.insertTo(flyout);

            // Check if  tabcontainer is rendered flyout, fix then flyout overflow
            var containerEl = me.tabsContainer.getElement();
            containerEl.parents('.oskari-flyoutcontentcontainer').css('overflow', 'hidden');
        },
        turnOnClickOff: function () {
            var me = this;
            me.filterDialog.popup.dialog.off('click', '.add-link');
        },

        addFilterFunctionality: function (event, layer) {
            if (layer.isLayerOfType('userlayer')) { //Filter functionality is not implemented for userlayers
                return;
            }

            var me = this,
                prevJson;

                // this is needed to add the functionality to filter with aggregate analyse values
                // if value is true, the link to filter with aggregate analyse values is added to dialog
                isAggregateValueAvailable = me.checkIfAggregateValuesAreAvailable();

            var fixedOptions = {
                bboxSelection: true,
                clickedFeaturesSelection: false,
                addLinkToAggregateValues: isAggregateValueAvailable
            };
            me.filterDialog = Oskari.clazz.create(
                'Oskari.userinterface.component.FilterDialog',
                fixedOptions
            );

            me.filterDialog.setUpdateButtonHandler(function (filters) {
                // throw event to new wfs
                var event = me.instance.sandbox.getEventBuilder('WFSSetPropertyFilter')(filters, layer.getId());
                me.instance.sandbox.notifyAll(event);
            });

            if (me.service) {
                me.aggregateAnalyseFilter = Oskari.clazz.create(
                    'Oskari.analysis.bundle.analyse.aggregateAnalyseFilter',
                    me.instance,
                    me.filterDialog
                );

                me.filterDialog.createFilterDialog(layer, prevJson, function () {
                    me.service._returnAnalysisOfTypeAggregate(_.bind(me.aggregateAnalyseFilter.addAggregateFilterFunctionality, me));
                });
            } else {
                me.filterDialog.createFilterDialog(layer);
            }
            me.filterDialog.setCloseButtonHandler(_.bind(me.turnOnClickOff, me));
        },

        // function gives value to addLinkToAggregateValues (true/false)
        checkIfAggregateValuesAreAvailable: function () {
            this.service = this.instance.sandbox.getService(
                'Oskari.analysis.bundle.analyse.service.AnalyseService'
            );
            if (!this.service) {
                return false;
            }
            return true;
        },
        /**
         * @method layerAdded
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Adds a tab for the layer
         */
        layerAdded: function (layer) {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.TabPanel'
                );

            panel.setTitle(layer.getName());
            panel.setTooltip(layer.getName());
            panel.getContainer().append(
                this.instance.getLocalization('loading')
            );
            panel.layer = layer;
            this.layers['' + layer.getId()] = panel;
            this.tabsContainer.addPanel(panel);
            if (!layer.isLayerOfType('userlayer')) { //Filter functionality is not implemented for userlayers
                panel.setTitleIcon('icon-funnel', function (event) {
                me.addFilterFunctionality(event, layer);
                });
            }
        },
        /**
         * @method layerRemoved
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was removed
         * Removes the tab for the layer
         */
        layerRemoved: function (layer) {
            var layerId = '' + layer.getId(),
                panel = this.layers[layerId];
            this.tabsContainer.removePanel(panel);
            // clean up
            if (panel) {
                panel.grid = null;
                delete panel.grid;
                panel.layer = null;
                delete panel.layer;
                this.layers[layerId] = null;
                delete this.layers[layerId];
                panel.getContainer().remove();
            }
        },
        /**
         * @method  @public selectGridValues select grid values
         * @param  {Array} selected     selected values
         * @param  {Oskari.mapframework.domain.WfsLayer} layer     WFS layer that was select features
         */
        selectGridValues: function(selected, layer){
            if(!selected) {
                return;
            }
            var me = this;
            var panel = me.layers['' + layer.getId()];
            if (!panel || !panel.grid) {
                return;
            }
            panel.grid.select(selected, false);
        },

        /**
         * @method updateData
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Updates data for layer
         */
        updateData: function (layer) {
            var me = this;
            var panel = this.layers['' + layer.getId()];
            var isOk = this.tabsContainer.isSelected(panel);
            if (!layer || !isOk) {
                return;
            }

            var map = this.instance.sandbox.getMap(),
                container = panel.getContainer(),
                i;

            container.empty();
            if (!layer.isInScale(map.getScale())) {
                container.append(this.instance.getLocalization('errorscale'));
                return;
            }
            if(layer.getFields().length === 0) {
                container.append(this.instance.getLocalization('errorNoFields'));
                return;
            }
            if(layer.getActiveFeatures().length === 0 ) {
                container.parent().children('.tab-tools').remove();
                container.removeAttr('style');
                container.append(this.instance.getLocalization('layer')['out-of-content-area']);

                if (!panel.grid) {
                   container.parent().find('.grid-tools').remove();
                }
                
                return;
            }
            container.append(this.instance.getLocalization('loading'));

            if (this.instance.__loadingStatus[layer.getId()] === 'error') {
                return;
            }

            // in scale, proceed
            this._prepareData(layer);

            // Grid opacity
            this.setGridOpacity(layer, 1.0);
        },

        moveSelectedRowsTop: function(layer) {
            var me = this;
            if(me.getSelectedFeatureIds() && me.layers[layer.getId()] && me.layers[layer.getId()].showSelectedRowsFirst) {
                me.layers[layer.getId()].grid.moveSelectedRowsTop(true);
            }
        },

        getSelectedFeatureIds: function(layer) {
            var me = this;
            if(!me.wfsLayerService) {
                me.wfsLayerService = me.instance.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
            }
            return me.wfsLayerService.getSelectedFeatureIds(layer.getId());
        },

        /**
         * @method updateGrid
         * @param {Object} user's selection on map
         * Updates grid for drawn places
         */
        updateGrid: function () {
            if (!this.selectedTab) {
                return;
            }
            this.updateData(this.selectedTab.layer);
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
            resizer.bind('dragstart', function (event) {
                event.preventDefault();
            });

            // Start resizing
            resizer.mousedown(function (e) {
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
            jQuery(document).mouseup(function () {
                me.resizing = false;
                me.resized = true;
            });

            // Resize the featuredata2 flyout
            jQuery(document).mousemove(function (e) {
                if (!me.resizing) {
                    return;
                }

                var flyOutMinHeight = 100,
                    bottomPadding = 60,
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

                    var tabsContent = jQuery('div.oskari-flyoutcontent.featuredata').find('div.tabsContent'),
                        newMaxHeight = e.pageY - tabsContent[0].offsetTop - resizerHeight - bottomPadding,
                        tabTools = jQuery('div.oskari-flyoutcontent.featuredata').find('div.grid-tools');
                    if (tabTools.length > 0) {
                        newMaxHeight = newMaxHeight - tabTools.height();
                    }

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
            if (jQuery('div.flyout-resizer').length === 0) {
                flyout.append(resizer);
            }
        },

        // helper for removing item (indexOf is not in IE8)
        remove_item: function (a, val) {
            var key;
            for (key in a) {
                if (a[key] === val) {
                    a.splice(key, 1);
                    break;
                }
            }
            return a;
        },

        /**
         * Get visible fields
         * @method @public getVisibleFields
         * @param  {Object} layer
         * @return {Array}  visible fields
         */
        getVisibleFields: function(layer){
            var me = this;
            var fields = layer.getFields();
            var hiddenFields = [];
            var visibleFields = [];
            hiddenFields.push('__fid');
            hiddenFields.push('__centerX');
            hiddenFields.push('__centerY');
            hiddenFields.push('geometry');
            // helper function for visibleFields
            var contains = function (a, obj) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            };
            // filter out certain fields
            for (var i = 0; i < fields.length; i += 1) {
                if (!contains(hiddenFields, fields[i])) {
                    visibleFields.push(fields[i]);
                }
            }
            return visibleFields;
        },

        /**
         * @private @method _prepareData
         * Updates data for layer
         *
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         * WFS layer that was added
         * @param {Object} data
         * WFS data JSON
         *
         */
        _prepareData: function (layer) {
            var me = this,
                panel = this.layers['' + layer.getId()],
                isOk = this.tabsContainer.isSelected(panel),
                conf = me.instance.conf,
                isManualRefresh = layer.isManualRefresh(),
                allowLocateOnMap = isManualRefresh && this.instance && this.instance.conf && this.instance.conf.allowLocateOnMap;

            if (isOk) {
                panel.getContainer().parent().find('.featuredata2-show-selected-first').remove();
                panel.getContainer().empty();
                panel.getContainer().parent().find('.grid-tools').remove();

                // create model
                var model = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel'
                );
                model.setIdField('__fid');

                // hidden fields (hide all - remove if not empty)
                var hiddenFields = layer.getFields().slice(0);

                // get data
                var fields = layer.getFields().slice(0),
                    locales = layer.getLocales().slice(0),
                    features = layer.getActiveFeatures().slice(0),
                    selectedFeatures = layer.getSelectedFeatures().slice(0); // filter

                me._addFeatureValues(model, fields, hiddenFields, features, selectedFeatures);
                me._addFeatureValues(model, fields, hiddenFields, selectedFeatures, null);

                fields = model.getFields();

                //ONLY AVAILABLE FOR WFS LAYERS WITH MANUAL REFRESH!
                if (allowLocateOnMap) {
                    fields.unshift('locate_on_map');
                }

                // check if properties (fields or locales) have changed
                if (!panel.fields || !panel.locales || !me._isArrayEqual(fields, panel.fields) || !me._isArrayEqual(locales, panel.locales)) {
                    panel.fields = fields;
                    panel.locales = locales;
                    panel.propertiesChanged = true;
                }

                var visibleFields = [];
                var panelParent = panel.getContainer().parent();
                var gridEl = jQuery('<div class="featuredata2-grid"></div>');

                if(!panel.grid){
                    panel.grid = Oskari.clazz.create(
                            'Oskari.userinterface.component.Grid',
                            me.instance.getLocalization('columnSelectorTooltip')
                        );

                    // set selection handler
                    panel.grid.addSelectionListener(function (pGrid, dataId, isCtrlKey) {
                        me._handleGridSelect(layer, dataId, isCtrlKey);
                    });

                    // set popup handler for inner data
                    var showMore = me.instance.getLocalization('showmore');
                    panel.grid.setAdditionalDataHandler(showMore,
                        function (link, content) {
                            var dialog = Oskari.clazz.create(
                                'Oskari.userinterface.component.Popup'
                            );
                            dialog.show(showMore, content);
                            dialog.moveTo(link, 'bottom');
                            if (me.dialog) {
                                me.dialog.close(true);
                            }
                            me.dialog = dialog;
                        });


                    panel.grid.setColumnSelector(true);
                    panel.grid.setResizableColumns(true);
                    if (conf && !conf.disableExport) {
                        panel.grid.setExcelExporter(
                            layer.getPermission('download') === 'download_permission_ok'
                        );
                    }
                }

                if (panel.propertiesChanged) {
                    panel.propertiesChanged = false;
                    var k;

                    // Data source & metadata link
                    panel.grid.setDataSource(
                        layer.getSource && layer.getSource() ? layer.getSource() : layer.getOrganizationName()
                    );
                    panel.grid.setMetadataLink(layer.getMetadataIdentifier());

                    // localizations
                    if (locales) {
                        for (k = 0; k < locales.length; k += 1) {
                            panel.grid.setColumnUIName(fields[k], locales[k]);
                        }
                    }
                    visibleFields = me.getVisibleFields(layer);

                    panel.grid.setVisibleFields(visibleFields);
                }
                panel.grid.setDataModel(model);
                _.forEach(visibleFields, function (field) {
                    panel.grid.setNumericField(field, me._fixedDecimalCount);
                });

                //custom renderer for locating feature on map
                if (allowLocateOnMap) {
                    panel.grid.setColumnUIName('locate_on_map', ' ');
                    panel.grid.setColumnValueRenderer('locate_on_map', function(name, data) {
                        var div = me.templateLocateOnMap.clone();
                        var fid = data.__fid;
                        div.attr('data-fid', fid);

                        var markers = Oskari.getMarkers();
                        var normalIcon = markers[me.locateOnMapIcon];
                        var normalIconObj = jQuery(normalIcon.data);
                        normalIconObj.find('path').attr({
                            fill: me.colors.locateOnMap.normal,
                            stroke: '#000000'
                        });
                        normalIconObj.attr({
                            x: 0,
                            y: 0
                        });
                        var activeIcon = markers[me.locateOnMapIcon];
                        var activeIconObj = jQuery(activeIcon.data);
                        activeIconObj.find('path').attr({
                            fill: me.colors.locateOnMap.active,
                            stroke: '#000000'
                        });
                        activeIconObj.attr({
                            x: 0,
                            y: 0
                        });

                        div.html(normalIconObj.outerHTML());

                        if(me.locateOnMapFID !== null && me.locateOnMapFID !== undefined && fid === me.locateOnMapFID) {
                            div.html(activeIconObj.outerHTML());
                        }

                        div.on('click', function(event) {
                            // Save clicked feature fid to check centered status
                            me.locateOnMapFID  = fid;
                            jQuery('.featuredata-go-to-location').html(normalIconObj.outerHTML());
                            jQuery(this).html(activeIconObj.outerHTML());

                            var feature = null;
                            //create the eventhandler for this particular fid
                            me.instance.eventHandlers.WFSFeatureGeometriesEvent = function(event) {
                                var wkts = event.getGeometries(),
                                    wkt;
                                for (var i = 0; i < wkts.length; i++) {
                                    if (wkts[i][0] === fid) {
                                        wkt = wkts[i][1];
                                        break;
                                    }
                                }
                                var viewportInfo = me.instance.mapModule.getViewPortForGeometry(wkt);
                                if (viewportInfo) {

                                    //feature didn't fit -> zoom to bounds
                                    if (viewportInfo.bounds) {
                                        setTimeout(function() {
                                            me.instance.sandbox.postRequestByName('MapMoveRequest', [viewportInfo.x, viewportInfo.y, viewportInfo.bounds]);
                                        }, 1000);
                                    } else {
                                        //else just set center.
                                        setTimeout(function() {
                                            me.instance.sandbox.postRequestByName('MapMoveRequest', [viewportInfo.x, viewportInfo.y]);
                                        }, 1000);
                                    }
                                }
                                me.instance.sandbox.unregisterFromEventByName(me.instance, "WFSFeatureGeometriesEvent");
                                me.instance.eventHandlers.WFSFeatureGeometriesEvent = null;
                            };
                            me.instance.sandbox.registerForEventByName(me.instance, "WFSFeatureGeometriesEvent");

                        });
                        return div;
                    });
                }

                panel.getContainer().append(gridEl);
                panel.grid.renderTo(gridEl, null, panelParent);

                // define flyout size to adjust correctly to arbitrary tables
                var mapdiv = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule').getMapEl(),
                    content = jQuery('div.oskari-flyoutcontent.featuredata'),
                    flyout = content.parent().parent();

                if (!me.resized) {
                    // Define default size for the object data list
                    var tabContent = flyout.find('div.tab-content');
                    var parent = tabContent.parent('.oskari-flyoutcontentcontainer');

                    // FIXME Need calculate different way or only use styles
                    var paddings = flyout.find('.grid-tools').height() +
                        flyout.find('.tabsHeader').height() +
                        parseInt(tabContent.css('padding-top') || 0) +
                        parseInt(tabContent.css('padding-bottom') || 0) +
                        (flyout.find('.exporter').height() || 0) + 10;

                    tabContent.css('height', (parent.height() - paddings) + 'px');
                    flyout.css('max-width', mapdiv.width().toString() + 'px');
                }
                if (me.resizable) {
                    this._enableResize();
                }

                // Extra header message on top of grid
                this._appendHeaderMessage(panel, locales, layer);

                if(!panel.selectedFirstCheckbox) {
                    panel.selectedFirstCheckbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
                    var locale = me.instance.getLocalization();
                    panel.selectedFirstCheckbox.setTitle(locale.showSelectedFirst);
                    panel.selectedFirstCheckbox.setChecked(false);
                    panel.selectedFirstCheckbox.setHandler(function() {
                        panel.grid.moveSelectedRowsTop(panel.selectedFirstCheckbox.isChecked());
                    });
                }

                panel.selectedFirstCheckbox.setChecked(panel.selectedFirstCheckbox.isChecked() === true);

                // Checkbox
                var checkboxEl = jQuery(panel.selectedFirstCheckbox.getElement());
                checkboxEl.addClass('featuredata2-show-selected-first');
                var gridToolsEl = panelParent.find('.grid-tools:visible');
                gridToolsEl.find('.featuredata2-show-selected-first').remove();
                if (conf && !conf.disableExport && layer.getPermission('download') === 'download_permission_ok') {
                    checkboxEl.insertAfter(gridToolsEl);
                    jQuery('<div class="featuredata2-show-selected-first" style="clear:both;"></div>').insertAfter(gridToolsEl);
                } else {
                    checkboxEl.css('margin-top', '7px');
                    gridToolsEl.append(checkboxEl);
                }

                var selected = me.getSelectedFeatureIds(layer);
                if(selected && selected.length>0) {
                    me.selectGridValues(selected, layer);
                }

            }
        },
        setGridOpacity: function (layer, opacity) {
            if (!this.active || !layer || isNaN(opacity)) {
                return;
            }
            var me = this,
                panel = this.layers['' + layer.getId()],
                tabContent = jQuery('div.oskari-flyoutcontent.featuredata').find('div.tab-content');
                isOk = this.tabsContainer.isSelected(panel);


            if (isOk && panel.grid) {
                tabContent.css({ 'opacity': opacity });
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
        _addFeatureValues: function (model, fields, hiddenFields, features, selectedFeatures) {
            var i,
                j,
                k,
                featureData,
                urlLink,
                values;

            eachFeature:
                for (i = 0; i < features.length; i += 1) {
                    featureData = {};
                    values = features[i];

                    // remove from selected if in feature list
                    if (selectedFeatures !== null && selectedFeatures !== undefined && selectedFeatures.length > 0) {
                        for (k = 0; k < selectedFeatures.length; k += 1) {
                            if (values[0] === selectedFeatures[k][0]) { // fid match
                                selectedFeatures.splice(k, 1);
                            }
                        }
                    }

                    for (j = 0; j < fields.length; j += 1) {
                        if (!values || values[j] === null || values[j] === undefined || values[j] === '') {
                            featureData[fields[j]] = '';
                        } else {
                            // Generate and url links
                            if (this._isUrlValid(values[j])) {
                                if (values[j].substring(0, 4) === 'http') {
                                    urlLink = values[j];
                                } else {
                                    urlLink = 'http://' + values[j];
                                }
                                featureData[fields[j]] = '<a href="' + urlLink + '" target="_blank">' + values[j] + '</a>';
                            } else {
                                featureData[fields[j]] = values[j];
                            }
                            // remove from empty fields
                            this.remove_item(hiddenFields, fields[j]);
                        }
                    }

                    // Remove this when better solution to handle duplicates is implemented
                    var tableData = model.getData();
                    for (j = 0; j < tableData.length; j += 1) {
                        if (tableData[j].__fid === featureData.__fid) {
                            continue eachFeature;
                        }
                    }

                    model.addData(featureData);
                }
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
            var re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-zåÅäÄöÖ0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(url);
        },

        /**
         * @method _isArrayEqual
         * @private
         * @param {String[]} current
         * @param {String[]} old
         *
         * Checks if the arrays are equal
         */
        _isArrayEqual: function (current, old) {
            var i;

            if (old.length !== current.length) {
                // arrays have different lengths, no way are they equal
                return false;
            }

            for (i = 0; i < current.length; i += 1) {
                if (current[i] !== old[i]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @method _handleGridSelect
         * @private
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * @param {String} dataId
         *           id for the data that was selected
         * @param {Boolean} keepCollection
         *           true to keep previous selection, false to clear before selecting
         * Notifies components that a selection was made
         */
        _handleGridSelect: function (layer, dataId, keepCollection) {
            var sandbox = this.instance.sandbox,
                featureIds = [dataId],
                builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent'),
                panel = this.layers['' + layer.getId()],
                isOk = this.tabsContainer.isSelected(panel);

            if(!isOk) {
                return;
            }
            if (!keepCollection) {
                this.WFSLayerService.emptyWFSFeatureSelections(layer);
            }
            this.WFSLayerService.setWFSFeaturesSelections(layer._id, featureIds);
            var event = builder(this.WFSLayerService.getSelectedFeatureIds(layer._id), layer, true);
            sandbox.notifyAll(event);
        },

        /**
         * @method featureSelected
         *
         * @param {Oskari.mapframework.bundle.mapwfs.event.WFSFeaturesSelectedEvent} event
         * Handles changes on the UI when a feature has been selected (highlights grid row)
         *
         */
        featureSelected: function (layer) {
            var me = this,
                panel = this.layers['' + layer.getId()],
                isOk = !!panel,
                selected = me.getSelectedFeatureIds(layer);

            if(!isOk) {
                return;
            }

            if (selected && selected.length > 0) {
                this.selectGridValues(selected, layer);
            } else if (panel && panel.grid && isOk) {
                panel.grid.removeSelections();
            }
        },

        /**
         * @method setEnabled
         * True to enable grid functionality
         * False to disable and stop reacting to any map movements etc
         *
         * @param {Boolean} isEnabled
         *
         */
        setEnabled: function (isEnabled, clearContent) {
            if (this.active === isEnabled) {
                return;
            }

            this.active = !!isEnabled;
            var sandbox = this.instance.sandbox,
                request;

            // feature info activation disabled if object data grid flyout active and vice versa
            var gfiReqBuilder = sandbox.getRequestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
            );
            if (gfiReqBuilder) {
                sandbox.request(
                    this.instance.getName(),
                    gfiReqBuilder(!this.active)
                );
            }
            var activateReqBuilder = Oskari.requestBuilder('activate.map.layer');

            // disabled
            if (!this.active &&this.selectedTab) {
                // dim possible highlighted layer
                request = activateReqBuilder(this.selectedTab.layer.getId(), false);
                sandbox.request(this.instance.getName(), request);
            }
            // enabled
            else if (this.selectedTab) {
                // highlight layer if any
                request = activateReqBuilder(this.selectedTab.layer.getId(), true);
                sandbox.request(this.instance.getName(), request);

                if(clearContent) {
                    // clear panels
                    for (var panel in this.layers) {
                        if (panel.getContainer) {
                            panel.getContainer().empty();
                        }
                    }

                    // update data
                    this.updateGrid();
                }
            }
        },
        /**
         * Shows/removes a loading indicator for the layer
         * @param  {String}  layerId
         * @param  {Boolean} blnLoading true to show, false to remove
         */
        showLoadingIndicator : function(layerId, blnLoading) {
            this.__addOrRemoveClassFromHeader(
                this.layers[layerId], blnLoading, 'loading');
        },
        /**
         * Shows/removes an error indicator for the layer
         * @param  {String}  layerId
         * @param  {Boolean} blnError true to show, false to remove
         */
        showErrorIndicator : function(layerId, blnError) {
            this.__addOrRemoveClassFromHeader(
                this.layers[layerId], blnError, 'error');
        },
        /**
         * Actual implementation to show/remove indicator. Just
         * adds a class to the header of a panel
         * @private
         * @param  {Oskari.userinterface.component.TabPanel} panel
         * @param  {Boolean} blnAdd  true to show, false to remove
         * @param  {String} strClass class to toggle
         */
        __addOrRemoveClassFromHeader : function(panel, blnAdd, strClass) {
            if(panel) {
                link = panel.getHeader().find('a');
            }
            if(!link) {
                // not found
                return;
            }
            // setup indicator
            if(blnAdd) {
                link.addClass(strClass);
            }
            else {
                link.removeClass(strClass);
            }
        },
        /**
         * Add message text over tab data grid, if analysislayer
         * @private
         * @param  {Oskari.userinterface.component.TabPanel} panel
         * @param  {Array} locales localized field names
         * @param  {String} layer  Oskari layer
         */
        _appendHeaderMessage: function (panel, locales, layer) {
            var footer = this.template.wrapper.clone(),
                sandbox = this.instance.getSandbox(),
                inputid,
                inputlayer,
                loc = this.instance.getLocalization('gridFooter'),
                message;
            //clean up the old headermessage in case there was one
            jQuery(panel.html).parent().find('div.gridMessageContainer').remove();
            if (!loc || !layer || layer.getLayerType().toUpperCase() !== 'ANALYSIS') {
                return;
            }
            // Extract analysis input layer id
            inputid = layer.getId().split("_")[1];
            inputlayer = sandbox.findMapLayerFromAllAvailable(inputid);
            if (inputlayer &&  inputlayer.getLayerType().toUpperCase() === 'WFS') {
                if (inputlayer.getWpsLayerParams()) {
                    if (inputlayer.getWpsLayerParams().no_data) {
                        message = loc.noDataCommonMessage + ' (' + inputlayer.getWpsLayerParams().no_data + ').';
                        if(locales){
                            //TODO: better management for recognasing private data messages
                            _.forEach(locales, function (field) {
                                if (field === loc.aggregateColumnField){
                                    message = loc.noDataMessage + ' (' + inputlayer.getWpsLayerParams().no_data + ').';
                                } else if (field ===  'Muutos_t2-t1') {
                                    message += ' '+loc.differenceMessage + ' -111111111.';
                                }
                            });
                        }

                    }
                }
            }

            if (message) {
                //insert header text into dom before tabcontent (=always visible when content scrolling)
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
