/**
 * @class Oskari.mapframework.bundle.featuredata2.Flyout
 *
 * Renders the "featuredata2" flyout.
 */

Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata2.FeatureDataGridBundleInstance} instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.layers = {};

        this.tabsContainer = null;
        this.selectedTab = null;
        this.active = false;
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
        // Resizability of the flyout
        this.resizable = true;
        // Is layout currently resizing?
        this.resizing = false;
        // The size of the layout has been changed (needed when changing tabs)
        this.resized = false;
    }, {
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
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
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
            this.tabsContainer =
                Oskari.clazz.create('Oskari.userinterface.component.TabContainer',
                    this.instance.getLocalization('nodata'));
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
                flyout = jQuery(this.container);
            flyout.empty();

            var sandbox = this.instance.sandbox,
                dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest'),
                hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
            // if previous panel is undefined -> just added first tab
            // if selectedPanel is undefined -> just removed last tab
            this.tabsContainer.addTabChangeListener(function (previousPanel, selectedPanel) {
                var request;
                // sendout dim request for unselected tab
                if (previousPanel) {
                    request = dimReqBuilder(previousPanel.layer.getId());
                    sandbox.request(me.instance.getName(), request);
                }
                me.selectedTab = selectedPanel;
                if (selectedPanel) {
                    me.updateData(selectedPanel.layer);
                    // sendout highlight request for selected tab
                    if (me.active) {
                        request = hlReqBuilder(selectedPanel.layer.getId());
                        sandbox.request(me.instance.getName(), request);
                    }
                }
            });
            this.tabsContainer.insertTo(flyout);
        },

        /**
         * @method layerAdded
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Adds a tab for the layer
         */
        layerAdded: function (layer) {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setTitle(layer.getName());
            panel.getContainer().append(this.instance.getLocalization('loading'));
            panel.layer = layer;
            this.layers['' + layer.getId()] = panel;
            this.tabsContainer.addPanel(panel);
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
            }
        },

        /**
         * @method updateData
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * Updates data for layer
         */
        updateData: function (layer) {
            if (!this.active) {
                return;
            }

            var map = this.instance.sandbox.getMap(),
                panel = this.layers['' + layer.getId()],
                selection = null,
                i;
            if (panel.grid) {
                selection = panel.grid.getSelection();
            }
            panel.getContainer().empty();
            if (!layer.isInScale(map.getScale())) {
                panel.getContainer().append(this.instance.getLocalization('errorscale'));
                return;
            }
            panel.getContainer().append(this.instance.getLocalization('loading'));

            // in scale, proceed
            this._prepareData(layer);

            if (selection && selection.length > 0 && typeof selection[0].featureId !== 'undefined') {
                for (i = 0; i < selection.length; i += 1) {
                    panel.grid.select(selection[i].featureId, true);
                }
            }

            // mapClick
            if (panel.grid && layer.getClickedFeatureIds().length > 0) {
                for (i = 0; i < layer.getClickedFeatureIds().length; i += 1) {
                    panel.grid.select(layer.getClickedFeatureIds()[i], true);
                }
            }

            // filter
            if (panel.grid && layer.getSelectedFeatures().length > 0) {
                for (i = 0; i < layer.getSelectedFeatures().length; i += 1) {
                    panel.grid.select(layer.getSelectedFeatures()[i][0], true);
                }
            }
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
                tabsContent = content.find('div.tabsContent'),
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
            jQuery(document).mouseup(function (e) {
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
                        tabTools = jQuery('div.oskari-flyoutcontent.featuredata').find('div.tab-tools');
                    if (tabTools.length > 0) {
                        newMaxHeight = newMaxHeight - tabTools.height();
                    }

                    flyout.find('div.tab-content').css('max-height', newMaxHeight.toString() + 'px');
                }
            });

            // Modify layout for the resizer image
            flyout.find('div.oskari-flyoutcontent').css('padding-bottom', '5px');
            if (jQuery('div.flyout-resizer').length === 0) {
                flyout.append(resizer);
            }
        },

        /**
         * @method _addNumericColumnRenderers
         * @private
         * @param {Grid} Grid instance
         * Adds column renderers for numeric columns, each renderer rendering 
         * the numbers with the highest decimal count found in the column.
         */
        _addNumericColumnRenderers: function (grid) {
            var dataArray = grid.getDataModel().data,
                visibleFields = grid.getVisibleFields(),
                notNumeric = {},
                decimals = {},
                i,
                j,
                row,
                key,
                value;

            for (i = 0; i < dataArray.length; i += 1) {
                row = dataArray[i];
                for (j = 0; j < visibleFields.length; j += 1) {
                    key = visibleFields[j];
                    value = row[key];
                    if (!notNumeric[key] && value !== null && value !== undefined) {
                        if (isNaN(value)) {
                            value = parseFloat(value);
                        }
                        if (isNaN(value) && (typeof row[key] === 'string' && row[key].length)) {
                            notNumeric[key] = true;
                        } else {
                            value = value + '';
                            value = value.split('.');
                            decimals[key] = Math.max(decimals[key] || 0, value.length === 2 ? value[1].length : 0);
                        }
                    }
                }
            }

            var closureMagic = function (decimalCount) {
                return function (value) {
                    var parsed = parseFloat(value);
                    if (!isNaN(parsed)) {
                        return parsed.toFixed(decimalCount);
                    } else {
                        return value;
                    }
                };
            };

            for (i = 0; i < visibleFields.length; i += 1) {
                if (!notNumeric[visibleFields[i]] && decimals[visibleFields[i]]) {
                    grid.setColumnValueRenderer(
                        visibleFields[i],
                        closureMagic(decimals[visibleFields[i]])
                    );
                }
            }
        },

        // FIXME why are we creating a global here? It's actually used in _addFeatureValues
        // 
        /**
         * @private @method removeItem
         * helper for removing item (indexOf is not in IE8)
         */
       _removeItem: function (arr, value) {
            var idx = arr.indexOf(value);
            while (idx !== -1) {
                arr.splice(idx, 1);
                idx = arr.indexOf(value);
            }
            return arr;
        },

        /**
         * @method _prepareData
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         *           WFS layer that was added
         * @param {Object} data
         *           WFS data JSON
         * Updates data for layer
         */
        _prepareData: function (layer) {
            var me = this,
                panel = this.layers['' + layer.getId()],
                isOk = this.tabsContainer.isSelected(panel);

            if (!isOk) {
                // Wrong tab selected -> ignore (shouldn't happen)
                return;
            }

            panel.getContainer().empty();

            // create model
            var model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            model.setIdField('__fid');

            // hidden fields (hide all - remove if not empty)
            var hiddenFields = layer.getFields().slice(0);

            // get data
            var featureData,
                values,
                fields = layer.getFields().slice(0),
                locales = layer.getLocales().slice(0),
                features = layer.getActiveFeatures().slice(0),
                selectedFeatures = layer.getSelectedFeatures().slice(0); // filter

            this._addFeatureValues(model, fields, hiddenFields, features, selectedFeatures);
            this._addFeatureValues(model, fields, hiddenFields, selectedFeatures, null);

            fields = model.getFields();
            hiddenFields.push('__fid');
            hiddenFields.push('__centerX');
            hiddenFields.push('__centerY');
            hiddenFields.push('geometry');

            // check if properties (fields or locales) have changed
            if (!panel.fields || !panel.locales || !this._isArrayEqual(fields, panel.fields) || !this._isArrayEqual(locales, panel.locales)) {
                panel.fields = fields;
                panel.locales = locales;
                panel.propertiesChanged = true;
            }

            if (!panel.grid || panel.propertiesChanged) {
                panel.propertiesChanged = false;

                var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid', this.instance.getLocalization('columnSelectorTooltip')),
                    k;

                // localizations
                if (locales) {
                    for (k = 0; k < locales.length; k += 1) {
                        grid.setColumnUIName(fields[k], locales[k]);
                    }
                }

                // set selection handler
                grid.addSelectionListener(function (pGrid, dataId) {
                    me._handleGridSelect(layer, dataId);
                });

                // set popup handler for inner data
                var showMore = this.instance.getLocalization('showmore');
                grid.setAdditionalDataHandler(showMore,
                    function (link, content) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(showMore, content);
                        dialog.moveTo(link, 'bottom');
                        if (me.dialog) {
                            me.dialog.close(true);
                        }
                        me.dialog = dialog;
                    });

                // helper function for visibleFields
                var contains = function (arr, obj) {
                    return arr.indexOf(obj) !== -1;
                };

                // filter out certain fields
                var visibleFields = [],
                    i;
                for (i = 0; i < fields.length; i += 1) {
                    if (!contains(hiddenFields, fields[i])) {
                        visibleFields.push(fields[i]);
                    }
                }

                grid.setVisibleFields(visibleFields);
                grid.setColumnSelector(true);
                grid.setResizableColumns(true);
                grid.setExcelExporter(layer.getPermission('publish') === 'publication_permission_ok');

                panel.grid = grid;
            }
            panel.grid.setDataModel(model);
            me._addNumericColumnRenderers(panel.grid);
            panel.grid.renderTo(panel.getContainer());
            // define flyout size to adjust correctly to arbitrary tables
            var mapdiv = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule').getMapEl(),
                content = jQuery('div.oskari-flyoutcontent.featuredata'),
                flyout = content.parent().parent();

            if (!me.resized) {
                // Define default size for the object data list
                flyout.find('div.tab-content').css('max-height', (mapdiv.height() / 4).toString() + 'px');
                flyout.css('max-width', mapdiv.width().toString() + 'px');
            }
            if (me.resizable) {
                this._enableResize();
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
                    if (values[j] === null || values[j] === undefined || values[j] === '') {
                        featureData[fields[j]] = '';
                    } else {
                        // Generate email and url links
                        if (this._isEmailValid(values[j])) {
                            featureData[fields[j]] = '<a href="mailto:'+values[j].replace("(a)","@").replace("(at)","@")+'">'+values[j]+'</a>';
                        } else if (this._isUrlValid(values[j])) {
                            if (values[j].substring(0,4) === "http") {
                                urlLink = values[j];
                            } else {
                                urlLink = "http://"+values[j];
                            }
                            featureData[fields[j]] = '<a href="'+urlLink+'" target="_blank">'+values[j]+'</a>';
                        } else {
                            featureData[fields[j]] = values[j];
                        }
                        // remove from empty fields
                        this._removeItem(hiddenFields, fields[j]);
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
        _isUrlValid: function(url) {
            if ((!url)||(typeof url !== "string")){
                return false;
            }
            var re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-zåÅäÄöÖ0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(url);
        },

        /**
         * @method _isEmailValid
         * @param {String} email
         * @returns {boolean}
         * @private
         *
         * Checks if an email address is valid
         */
        _isEmailValid: function(email) {
            if ((!email)||(typeof email !== "string")){
                return false;
            }
            var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var  atEmail = email.replace("(a)","@").replace("(at)","@");
            return filter.test(atEmail);
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
            if (old.length !== current.length) {
                // arrays have different lengths, no way are they equal
                return false;
            }

            for (var i = 0; i < current.length; i += 1) {
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
                builder = sandbox.getEventBuilder('WFSFeaturesSelectedEvent');
            if (keepCollection === undefined) {
                keepCollection = sandbox.isCtrlKeyDown();
            }
            var event = builder(featureIds, layer, keepCollection);
            sandbox.notifyAll(event);
        },

        /**
         * @method featureSelected
         * @param {Oskari.mapframework.bundle.mapwfs.event.WFSFeaturesSelectedEvent} event
         * Handles changes on the UI when a feature has been selected (highlights grid row)
         */
        featureSelected: function (event) {
            if (!this.active) {
                return;
            }

            var layer = event.getMapLayer(),
                panel = this.layers['' + layer.getId()],
                fids = event.getWfsFeatureIds(),
                i;
            if (fids !== null && fids !== undefined && fids.length > 0) {
                panel.grid.select(fids[0], event.isKeepSelection());
                if (fids.length > 1) {
                    for (i = 1; i < fids.length; i += 1) {
                        panel.grid.select(fids[i], true);
                    }
                }
            } else {
                panel.grid.removeSelections();
            }
        },

        /**
         * @method setEnabled
         * @param {Boolean} isEnabled
         * True to enable grid functionality
         * False to disable and stop reacting to any map movements etc
         */
        setEnabled: function (isEnabled) {
            if (this.active === isEnabled) {
                return;
            }

            this.active = !!isEnabled;
            var sandbox = this.instance.sandbox,
                request;

            // feature info activation disabled if object data grid flyout active and vice versa
            var gfiReqBuilder = sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            if (gfiReqBuilder) {
                sandbox.request(this.instance.getName(), gfiReqBuilder(!this.active));
            }

            // disabled
            if (!this.active) {
                if (this.selectedTab) {
                    // dim possible highlighted layer
                    var dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest');
                    request = dimReqBuilder(this.selectedTab.layer.getId());
                    sandbox.request(this.instance.getName(), request);
                }
                // clear panels
                for (var panel in this.layers) {
                    if (panel.getContainer) {
                        panel.getContainer().empty();
                    }
                }
            }
            // enabled
            else {
                if (this.selectedTab) {
                    // highlight layer if any
                    var hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
                    request = hlReqBuilder(this.selectedTab.layer.getId());
                    sandbox.request(this.instance.getName(), request);

                    // update data
                    this.updateGrid();
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
