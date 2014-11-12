/**
 * @class Oskari.mapframework.bundle.publisher.view.BasicPublisher
 * Renders the publishers "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.BasicPublisher',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     */
    function (instance, localization, data) {
        var me = this;
        me.data = data;

        me.instance = instance;
        me.template = jQuery(
            '<div class="basic_publisher">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div>');

        me.templates = {
            publishedGridTemplate: '<div class="publishedgrid"></div>'
        };

        me.templateButtonsDiv = jQuery('<div class="buttons"></div>');
        me.templateHelp = jQuery('<div class="help icon-info"></div>');
        me.templateLayout = jQuery(
            '<div class="tool ">' +
            '  <label>' +
            '    <input type="radio" name="toolLayout" /><span></span>' +
            '  </label>' +
            '</div>'
        );
        me.templateData = jQuery(
            '<div class="data ">' +
            '  <input class="show-grid" type="checkbox"/>' +
            '  <label class="show-grid-label"></label>' + '<br />' +
            '  <input class="allow-classification" type="checkbox"/>' +
            '  <label class="allow-classification-label"></label>' +
            '</div>');

        me.normalMapPlugins = [];

        // These define where and what with plugins can be dropped in
        me.toolDropRules = {
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin': {
                // Disabled for now, need to fix config reading first allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedLocations: ['top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
                    'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
                ],
                groupedSiblings: false
            }
        };

        // TODO see if this and layerselection could be moved to tools...
        // just ignore them on ui creation or smthn
        me.logoPluginClasses = {
            lefthanded: 'bottom left',
            righthanded: 'bottom right',
            classes: 'bottom left'
        };

        // Not sure where this should be...
        me.layerSelectionClasses = {
            lefthanded: 'top right',
            righthanded: 'top left',
            classes: 'top right'
        };

        me.toolLayouts = ['lefthanded', 'righthanded', 'userlayout'];

        me.activeToolLayout = 'lefthanded';

        me.sizeOptions = [{
            id: 'small',
            width: 580,
            height: 387
        }, {
            id: 'medium',
            width: 700,
            height: 525,
            selected: true // default option
        }, {
            id: 'large',
            width: 1240,
            height: 700
        }, {
            id: 'fill',
            width: '',
            height: ''
        }, {
            id: 'custom',
            minWidth: 30,
            minHeight: 20,
            maxWidth: 4000,
            maxHeight: 2000
        }];

        me.grid = {};
        me.grid.selected = true;

        if (data) {
            if (data.lang) {
                Oskari.setLang(data.lang);
            }
            if (me.data.state.mapfull.config.layout) {
                me.activeToolLayout = me.data.state.mapfull.config.layout;
            }
            // setup initial size
            var sizeIsSet = false,
                initWidth,
                initHeight,
                option,
                i;

            if (me.data.state.mapfull.config.size) {
                initWidth = me.data.state.mapfull.config.size.width
                initHeight = me.data.state.mapfull.config.size.height
            }

            if (initWidth === null || initWidth === undefined) {
                initWidth = '';
            }

            if (initHeight === null || initHeight === undefined) {
                initHeight = '';
            }

            for (i = 0; i < me.sizeOptions.length; i += 1) {
                option = me.sizeOptions[i];
                if (initWidth === option.width && initHeight === option.height) {
                    option.selected = true;
                    sizeIsSet = true;
                } else {
                    option.selected = false;
                }
            }
            if (!sizeIsSet) {
                var customSizeOption = me.sizeOptions[me.sizeOptions.length - 1];
                customSizeOption.selected = true;
                customSizeOption.width = initWidth;
                customSizeOption.height = initHeight;
            }
        }

        me.loc = localization;
        me.accordion = null;

        me.maplayerPanel = null;
        me.mainPanel = null;
        me.logoPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin', {
            location: {
                classes: me.logoPluginClasses.classes
            }
        });
        me.latestGFI = null;
        me.urlBase = instance.conf.urlPrefix + '/web/';
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = me.template.clone();

            me.mainPanel = content;

            container.append(content);
            var contentDiv = content.find('div.content'),
                accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            me.accordion = accordion;

            var form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.PublisherLocationForm', me.loc, me);
            me.locationForm = form;
            if (me.data) {
                content.find('div.header h3').append(me.loc.titleEdit);
                form.init({
                    domain: me.data.domain,
                    name: me.data.name,
                    lang: me.data.lang
                });
            } else {
                content.find('div.header h3').append(me.loc.title);
                form.init();
            }

            var panel = form.getPanel();
            panel.open();
            // 1st panel: location panel
            accordion.addPanel(panel);

            // add grid checkbox
            var sandbox = me.instance.getSandbox(),
                selectedLayers = sandbox.findAllSelectedMapLayers(),
                showStats = false,
                i,
                layer,
                mapModule = sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                );

            me.mapModule = mapModule;

            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === 'stats') {
                    showStats = true;
                }
            }

            if (showStats) {
                me.showStats = true;

                // The container where the grid will be rendered to.
                me.statsContainer = jQuery(me.templates.publishedGridTemplate);

                var dataPanel = me._createDataPanel();
                dataPanel.open();
                // 2nd (optional) panel: stats panel
                accordion.addPanel(dataPanel);
            }

            // 3rd panel: size panel
            accordion.addPanel(me._createSizePanel());

            // 4th panel: tools panel
            accordion.addPanel(me._createToolsPanel());

            // 5th panel: tool layout panel
            accordion.addPanel(me._createToolLayoutPanel());

            // TODO we need to have a serious discussion with this one whenever layout is changed or
            // copy location from config...
            if (me.data && me.data.hasLayerSelectionPlugin && me.data.hasLayerSelectionPlugin.location) {
                me.layerSelectionClasses.classes = me.data.hasLayerSelectionPlugin.location.classes;
            }

            me.maplayerPanel = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher.view.PublisherLayerForm',
                me.loc,
                me.instance,
                {
                    location: {
                        classes: me.layerSelectionClasses.classes
                    }
                },
                me
            );
            me.maplayerPanel.init();

            // Add the layout panel to the accordion.
            me.layoutPanel = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm',
                me.loc,
                me
            );
            var layoutData = me._getInitialLayoutData(me.data);
            me.layoutPanel.init(layoutData);
            // 6th panel: layout panel
            accordion.addPanel(me.layoutPanel.getPanel());
            // 7th panel: map layer panel
            accordion.addPanel(me.maplayerPanel.getPanel());

            accordion.insertTo(contentDiv);

            // buttons
            // close
            container.find('div.header div.icon-close').bind(
                'click',
                function () {
                    me.instance.setPublishMode(false);
                }
            );
            contentDiv.append(me._getButtons());

            var inputs = me.mainPanel.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName(
                    'DisableMapKeyboardMovementRequest'
                );
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName(
                    'EnableMapKeyboardMovementRequest'
                );
            });

            // bind help tags
            var helper = Oskari.clazz.create(
                'Oskari.userinterface.component.UIHelper',
                me.instance.sandbox
            );
            helper.processHelpLinks(
                me.loc.help,
                content,
                me.loc.error.title,
                me.loc.error.nohelp
            );
        },

        /**
         * @private @method _getActiveMapSize
         * Returns an object containing the active map size.
         * This will differ from selected size if selected size is invalid.
         *
         * @return {Object} size
         */
        _getActiveMapSize: function () {
            var mapDiv = this.mapModule.getMapEl(),
                width = mapDiv.width(),
                height = mapDiv.height();

            return {
                width: width,
                height: height
            };
        },

        /**
         * @private @method _getSelectedMapSize
         * Returns an object containing the user seleted/set map size and the corresponding size option
         *
         * @return {Object} size
         */
        _getSelectedMapSize: function () {
            var me = this,
                option = me.sizeOptions.filter(function (el) {
                    return el.selected;
                })[0],
                width = option.width,
                height = option.height,
                validWidth = true,
                validHeight = true;

            if (option.id === 'custom') {
                width = parseInt(me.mainPanel.find('.customsize input[name=width]').val(), 10);
                height = parseInt(me.mainPanel.find('.customsize input[name=height]').val(), 10);
                validWidth = me._validateNumberRange(width, option.minWidth, option.maxWidth);
                validHeight = me._validateNumberRange(height, option.minHeight, option.maxHeight);
            }

            return {
                valid: validWidth && validHeight,
                width: width,
                validWidth: validWidth,
                height: height,
                validHeight: validHeight,
                option: option
            };
        },

        /**
         * @private @method _updateMapSize
         * Adjusts the map size according to publisher selection
         *
         *
         */
        _updateMapSize: function () {
            var me = this,
                mapDiv = me.mapModule.getMapEl(),
                size = me._getSelectedMapSize(),
                customsize = me.mainPanel.find('.customsize'),
                widthInput = customsize.find('input[name=width]'),
                heightInput = customsize.find('input[name=height]');

            if (size.option.id === 'custom') {
                customsize.prop('disabled', false);
                widthInput.prop('disabled', false);
                heightInput.prop('disabled', false);
                // Only custom option can have invalid values
                widthInput.toggleClass('error', !size.validWidth);
                heightInput.toggleClass('error', !size.validHeight);
            } else {
                customsize.prop('disabled', true);
                widthInput.prop('disabled', true);
                heightInput.prop('disabled', true);
                // Update selected size to custom size fields, it's a decent
                // starting point and it avoids error states...
                if (!isNaN(size.width) && typeof size.width === 'number') {
                    widthInput.val(size.width);
                    widthInput.removeClass('error');
                }
                if (!isNaN(size.height) && typeof size.height === 'number') {
                    heightInput.val(size.height);
                    heightInput.removeClass('error');
                }
            }

            if (size.valid) {
                // Adjust map and grid sizes
                me._adjustDataContainer();
            }
        },

        _parseIntFromPxValue: function (value) {
            var ret = null;
            if (value && value.length) {
                ret = parseInt(value.split('px')[0], 10);
            }
            return ret;
        },

        _updateMapModuleSize: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                reqBuilder = sandbox.getRequestBuilder(
                    'MapFull.MapSizeUpdateRequest'
                );

            if (reqBuilder) {
                sandbox.request(this.instance, reqBuilder());
            }
        },

        /**
         * @private @method _adjustDataContainer
         * This horrific thing is what sets the statsgrid, container and map size.
         */
        _adjustDataContainer: function () {
            /*
            Structure:
            - content
                - dataContainer
                    - grid
                - mapContainer
                    - mapDiv
            */
            var me = this,
                selectedSize = me._getSelectedMapSize(),
                size = selectedSize.valid ? selectedSize : me._getActiveMapSize(),
                content = jQuery('#contentMap'),
                container = content.find('.row-fluid'),
                dataContainer = container.find('.oskariui-left'),
                gridWidth = me._calculateGridWidth(),
                gridHeight = 0,
                mapContainer = container.find('.oskariui-center'),
                mapDiv = me.mapModule.getMapEl(),
                mapWidth,
                mapHeight,
                totalWidth = size.width,
                totalHeight = size.height;

            if (totalWidth === null || totalWidth === undefined || totalWidth === '') {
                // Ugly hack, container has a nasty habit of overflowing the viewport...
                totalWidth = jQuery(window).width() - container.offset().left;
            }
            if (totalHeight === null || totalHeight === undefined || totalHeight === '') {
                totalHeight = jQuery(window).height();
            }

            dataContainer.toggleClass('oskari-closed', !me.isDataVisible);

            if (me.isDataVisible) {
                dataContainer.removeClass('oskari-closed');
                gridHeight = totalHeight;
            } else {
                dataContainer.addClass('oskari-closed');
                gridWidth = 0;
            }

            mapWidth = (totalWidth - gridWidth) + 'px';
            mapHeight = totalHeight + 'px';
            gridWidth = gridWidth + 'px';
            gridHeight = gridHeight + 'px';

            dataContainer.css({
                'width': gridWidth,
                'height': gridHeight,
                'float': 'left'
            }).addClass('published-grid-left');

            mapContainer.css({
                'width': mapWidth,
                'height': mapHeight,
                'float': 'left'
            }).addClass('published-grid-center');

            mapDiv.width(mapWidth);
            mapDiv.height(mapHeight);

            if (me.statsContainer) {
                me.statsContainer.height(mapHeight);
            }

            if (me.gridPlugin) {
                me.gridPlugin.setGridHeight();
            }
            // notify map module that size has changed
            me._updateMapModuleSize();
        },

        /**
         * @private @method _calculateGridWidth
         * Calculates a sensible width for statsgrid (but doesn't set it...)
         */
        _calculateGridWidth: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                columns,
                statsGrid = sandbox.getStatefulComponents().statsgrid, // get state of statsgrid
                width = 160;

            if (statsGrid &&
                statsGrid.state &&
                statsGrid.state.indicators !== null &&
                statsGrid.state.indicators !== undefined) {

                //indicators + municipality (name & code)
                columns = statsGrid.state.indicators.length + 2;
                //slickgrid column width is 80 by default
                width = columns * 80;
            }
            // Width + scroll bar width, but 400 at most.
            return Math.min((width + 20), 400);
        },

        /**
         * @method _createSizePanel
         * @private
         * Creates the size selection panel for publisher
         * @return {jQuery} Returns the created panel
         */
        _createSizePanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                radioButtonGroup = Oskari.clazz.create(
                    'Oskari.userinterface.component.RadioButtonGroup'
                ),
                widthInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.NumberInput'
                ),
                heightInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.NumberInput'
                ),
                contentPanel = panel.getContainer(),
                customOption = me.sizeOptions.filter(function (option) {
                    return option.id === 'custom';
                })[0],
                customSizes = document.createElement('fieldset'),
                selectedOption = me.sizeOptions.filter(function (option) {
                    return option.selected;
                })[0],
                tooltipCont = me.templateHelp.clone(),
                selectionHandler = function (value) {
                    me.sizeOptions.forEach(function (option) {
                        option.selected = option.id === value;
                    });
                    me._updateMapSize();
                };

            panel.setTitle(me.loc.size.label);
            tooltipCont.attr('title', me.loc.size.tooltip);
            contentPanel.append(tooltipCont);
            radioButtonGroup.setName('size');
            radioButtonGroup.setOptions(me.sizeOptions.map(function (option) {
                var title = me.loc.sizes[option.id];
                if ('custom' !== option.id && 'fill' !== option.id) {
                    title = me._getSizeLabel(title, option);
                }
                return {
                    title: title,
                    value: option.id
                };
            }));
            radioButtonGroup.setHandler(selectionHandler);
            radioButtonGroup.insertTo(contentPanel);

            customSizes.className = 'customsize';

            widthInput.setName('width');
            widthInput.setPlaceholder(me.loc.sizes.width);
            widthInput.setMax(customOption.maxWidth);
            widthInput.setMin(customOption.minWidth);
            widthInput.setValue(selectedOption.width);
            widthInput.setHandler(function () {
                me._updateMapSize();
            });
            widthInput.insertTo(customSizes);

            customSizes.appendChild(
                document.createTextNode(me.loc.sizes.separator)
            );

            heightInput.setName('height');
            heightInput.setPlaceholder(me.loc.sizes.height);
            heightInput.setMax(customOption.maxHeight);
            heightInput.setMin(customOption.minHeight);
            heightInput.setValue(selectedOption.height);
            heightInput.setHandler(function () {
                me._updateMapSize();
            });
            heightInput.insertTo(customSizes);
            contentPanel.append(customSizes);

            radioButtonGroup.setValue(selectedOption.id);

            return panel;
        },

        /**
         * Gets the label text for a size option. It changes based on grid visibility.
         *
         * @method _getSizeLabel
         * @private
         */
        _getSizeLabel: function (label, option) {
            //var gridWidth = (this.isDataVisible ? this._calculateGridWidth() : 0);
            return (label + ' (' + option.width + ' x ' + option.height + 'px)');
        },

        /**
         * @private @method _setSizeLabels
         * Sets the size label in size accordion panel in UI.
         *
         *
         */
        _setSizeLabels: function () {
            var i,
                option,
                span,
                label;

            for (i = 0; i < this.sizeOptions.length; i += 1) {
                option = this.sizeOptions[i];
                span = jQuery('span.sizeoption_' + option.id);
                label = this.loc.sizes[option.id];
                if (option.width && option.height && 'custom' !== option.id && 'fill' !== option.id) {
                    label = this._getSizeLabel(label, option);
                }
                span.text(label);
            }
        },

        /**
         * @private @method _createToolsPanel
         * Creates the tool selection panel for publisher
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createToolsPanel: function () {
            var i,
                me = this,
                enabledPlugins = null,
                plugins;
            // setup initial plugins if available (move this... somewhere)
            if (me.data && me.data.state && me.data.state.mapfull &&
                me.data.state.mapfull.config &&
                me.data.state.mapfull.config.plugins) {
                plugins = me.data.state.mapfull.config.plugins;

                enabledPlugins = {};
                // set enabled plugins
                for (i = 0; i < plugins.length; i += 1) {
                    enabledPlugins[plugins[i].id] = true;
                    if (plugins[i].id === 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin') {
                        me.data.hasLayerSelectionPlugin = plugins[i].getConfig();
                    }
                }
            }
            // Add the layout panel to the accordion.
            me.toolsPanel = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher.view.PublisherToolsForm',
                me,
                enabledPlugins
            );

            me.toolsPanel.init();
            return me.toolsPanel.getPanel(me.data);
        },

        /**
         * @private @method _changeToolLayout
         *
         * @param {string} layout
         * @param {Object} event
         *
         */
        _changeToolLayout: function (layout, event) {
            // iterate plugins
            var me = this,
                tools = me.toolsPanel.getTools(),
                i,
                tool,
                target,
                button;
            // store location so we have easy access to it on save
            me.activeToolLayout = layout;
            if (layout !== 'userlayout') {
                // make sure we're not in edit mode
                if (me.toolLayoutEditMode) {
                    me._editToolLayoutOff();
                }
                // set location for all tools
                for (i = tools.length - 1; i > -1; i -= 1) {
                    tool = tools[i];
                    if (tool[layout]) {
                        if (!tool.config) {
                            tool.config = {};
                        }
                        if (!tool.config.location) {
                            tool.config.location = {};
                        }
                        tool.config.location.classes = tool[layout];
                        if (tool.plugin && tool.plugin.setLocation) {
                            tool.plugin.setLocation(tool.config.location.classes);
                        }
                    }
                }
                // Set logoplugin and layerselection as well
                me.logoPluginClasses.classes = me.logoPluginClasses[layout];
                if (me.logoPlugin) {
                    me.logoPlugin.setLocation(me.logoPluginClasses.classes);
                }
                me.layerSelectionClasses.classes = me.layerSelectionClasses[layout];
                me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses.classes);

                if (event) {
                    target = jQuery(event.currentTarget);
                    button = target.parents('.content').find('input#editModeBtn');
                    button.prop('disabled', true);
                    button.addClass('disabled-button');
                    me._editToolLayoutOff();
                }
            } else {
                if (event) {
                    target = jQuery(event.currentTarget);
                    button = target.parents('.tool').find('input#editModeBtn');
                    button.prop('disabled', false);
                    button.removeClass('disabled-button');
                    me._editToolLayoutOn();
                }
            }
        },

        /**
         * @private @method _createToolLayoutPanel
         *
         *
         */
        _createToolLayoutPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(), // tooltip
                i,
                input,
                layoutContainer,
                changeListener = function (e) {
                    if (this.checked) {
                        me._changeToolLayout(this.value, e);
                    }
                };

            panel.setTitle(me.loc.toollayout.label);


            tooltipCont.attr('title', me.loc.toollayout.tooltip);
            contentPanel.append(tooltipCont);

            // content
            for (i = 0; i < me.toolLayouts.length; i += 1) {
                layoutContainer = me.templateLayout.clone();
                input = layoutContainer.find('input');
                input.val(me.toolLayouts[i]).change(changeListener);
                // FIXME default to 0 index if activeToolLayout is not found
                // First choice is active unless we have an active layout
                if (me.activeToolLayout) {
                    if (me.toolLayouts[i] === me.activeToolLayout) {
                        input.attr('checked', 'checked');
                    }
                } else if (i === 0) {
                    input.attr('checked', 'checked');
                }
                layoutContainer.find('span').html(me.loc.toollayout[me.toolLayouts[i]] || me.toolLayouts[i]);
                contentPanel.append(layoutContainer);
                if (me.toolLayouts[i] === 'userlayout') {
                    var editBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    editBtn.setTitle(me.loc.toollayout.usereditmode);
                    // FIXME create function outside loop
                    editBtn.setHandler(function () {
                        // user is in edit mode
                        if (jQuery(editBtn.getElement()).val() === me.loc.toollayout.usereditmodeoff) {
                            // remove edit mode
                            me._editToolLayoutOff();
                        } else {
                            me._editToolLayoutOn();
                        }
                    });
                    editBtn.setEnabled(me.activeToolLayout === 'userlayout');
                    jQuery(editBtn.getElement()).attr('id', 'editModeBtn');
                    editBtn.insertTo(layoutContainer);
                }
            }

            return panel;
        },

        /**
         * @private @method _makeDraggable
         *
         * @param {jQuery} draggables
         *
         */
        _makeDraggable: function (draggables) {
            var me = this;
            return draggables.draggable({
                appendTo: '.mappluginsContent',
                //containment: "#mapdiv", nosiree, this doesn't play well with droppable's tolerance: 'pointer'
                drag: function (event, ui) {
                    //return false;
                },
                snap: true,
                start: function (event, ui) {
                    // drag start, see which droppables are valid
                    me._showDroppable(ui.helper.attr('data-clazz'), ui.helper.parents('.mapplugins'));
                },
                stop: me._hideDroppable,
                revert: 'invalid'
            });
        },

        /**
         * @private @method _togglePluginUIControls
         *
         * @param {Boolean} enable
         *
         */
        _togglePluginUIControls: function (enable) {
            var i,
                tool,
                tools;

            for (i = 0; i < this.tools.length; i += 1) {
                tool = tools[i];
                if (tool.plugin && tool.plugin.toggleUIControls) {
                    tool.plugin.toggleUIControls(enable);
                }
            }
        },

        /**
         * @private @method _editToolLayoutOn
         *
         *
         */
        _editToolLayoutOn: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            me.toolLayoutEditMode = true;
            jQuery('#editModeBtn').val(me.loc.toollayout.usereditmodeoff);
            jQuery('.mapplugins').show();
            jQuery('.mapplugin').addClass('toollayoutedit');
            // TODO create droppables on _showDroppable, destroy them on _hideDroppable
            var draggables = me._makeDraggable(jQuery('.mapplugin')),
                droppables = jQuery('.mappluginsContent').droppable({
                    // TODO see if this can be done in hover? Would it even be wanted behaviour?
                    drop: function (event, ui) {
                        var pluginClazz = ui.draggable.attr('data-clazz'),
                            plugin = me._getPluginByClazz(pluginClazz),
                            source = ui.draggable.parents('.mapplugins'),
                            target = jQuery(this);
                        me._moveSiblings(pluginClazz, source, target);
                        if (plugin && plugin.setLocation) {
                            plugin.setLocation(jQuery(this).parents('.mapplugins').attr('data-location'));
                            // Reset draggable's inline css... couldn't find a cleaner way to do this.
                            // Can't be removed as that breaks draggable, has to be zeroed because we're changing containers
                            plugin.getElement().css({
                                'top': '0px',
                                'left': '0px'
                            });
                        }
                        // draggable.stop doesn't fire if dropped to a droppable so we have to do this here as well...
                        me._hideDroppable();
                    },
                    hoverClass: 'ui-state-highlight',
                    tolerance: 'pointer' // bit of a compromise, we'd need a combination of pointer and intersect
                });

            var event = sandbox.getEventBuilder('LayerToolsEditModeEvent')(true);
            sandbox.notifyAll(event);

            // remove map controls when editing tool layout
            var controlsPluginTool = me.toolsPanel.getToolById('Oskari.mapframework.mapmodule.ControlsPlugin');
            if (controlsPluginTool) {
                me.isMapControlActive = controlsPluginTool && controlsPluginTool.selected;
                me.toolsPanel.activatePreviewPlugin(controlsPluginTool, false);
            }
        },

        /**
         * @private @method _editToolLayoutOff
         *
         *
         */
        _editToolLayoutOff: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            me.toolLayoutEditMode = false;
            jQuery('#editModeBtn').val(me.loc.toollayout.usereditmode);
            jQuery('.mapplugin').removeClass('toollayoutedit');

            var draggables = jQuery('.mapplugin.ui-draggable');
            draggables.css('position', '');
            draggables.draggable('destroy');
            jQuery('.mappluginsContent.ui-droppable').droppable('destroy');

            var event = sandbox.getEventBuilder('LayerToolsEditModeEvent')(false);
            sandbox.notifyAll(event);

            // Set logoplugin and layerselection as well
            // FIXME get this from logoPlugin's config, no need to traverse the DOM
            if (me.logoPlugin) {
                me.logoPluginClasses.classes = me.logoPlugin.getElement().parents('.mapplugins').attr('data-location');
                me.logoPlugin.getElement().css('position', '');
                //me.logoPlugin.setLocation(me.logoPluginClasses.classes);
            }
            if (me.maplayerPanel.plugin && me.maplayerPanel.plugin.getElement()) {
                me.layerSelectionClasses.classes = me.maplayerPanel.plugin.getElement().parents('.mapplugins').attr('data-location');
                //me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses.classes);
                me.maplayerPanel.plugin.getElement().css('position', '');
            }

            // set map controls back to original settings after editing tool layout
            var controlsPluginTool = me.toolsPanel.getToolById('Oskari.mapframework.mapmodule.ControlsPlugin');
            if (controlsPluginTool) {
                me.toolsPanel.activatePreviewPlugin(controlsPluginTool, me.isMapControlActive);
                delete me.isMapControlActive;
            }

            // Hide unneeded containers
            var container;
            jQuery('.mapplugins').each(function () {
                container = jQuery(this);
                if (container.find('.mappluginsContent').children().length === 0) {
                    container.css('display', 'none');
                }
            });
        },

        /**
         * @private @method _createDataPanel
         *
         *
         */
        _createDataPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(me.loc.data.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(); // tooltip
            tooltipCont.attr('title', me.loc.data.tooltip);
            contentPanel.append(tooltipCont);

            var dataContainer = me.templateData.clone();
            dataContainer.find('input.show-grid').attr(
                'id',
                'show-grid-checkbox'
            ).change(function (e) {
                var checkbox = jQuery(e.target),
                    isChecked = checkbox.is(':checked');
                me.isDataVisible = isChecked;
                me._adjustDataContainer();
                // Update the size labels
                me._setSizeLabels();
            });
            dataContainer.find('label.show-grid-label').attr(
                'for',
                'show-grid-checkbox'
            ).append(me.loc.data.grid);

            dataContainer.find('input.allow-classification').attr(
                'id',
                'allow-classification-checkbox'
            ).change(function (e) {
                var checkbox = jQuery(e.target),
                    isChecked = checkbox.is(':checked');

                // FIXME this doesn't seem right... aren't we supposed to show _something_ even if the user can't select the classification?
                me.classifyPlugin.showClassificationOptions(isChecked);
                me.classifyPlugin.setVisible(isChecked);
            });
            dataContainer.find(
                'label.allow-classification-label'
            ).attr('for', 'allow-classification-checkbox').append(
                me.loc.data.allowClassification
            );

            if (me.grid.selected) {
                dataContainer.find('input#show-grid-checkbox').attr(
                    'checked',
                    'checked'
                );
                me.isDataVisible = me.grid.selected;
                me._adjustDataContainer();
            }
            contentPanel.append(dataContainer);

            return panel;
        },

        /**
         * @method getDataContainer
         *
         *
         * @return {jQuery} Data container
         */
        getDataContainer: function () {
            return jQuery('.oskariui-left');
        },

        /**
         * @method addDataGrid
         *
         * @param {} grid
         *
         */
        addDataGrid: function (grid) {
            this.getDataContainer.html(grid);
        },

        /**
         * @method handleMapMoved
         * Does nothing currently.
         *
         *
         */
        handleMapMoved: function () {
            /*var mapVO = this.instance.sandbox.getMap(),
                lon = mapVO.getX(),
                lat = mapVO.getY(),
                zoom = mapVO.getZoom();*/
            //this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
        },

        /**
         * @private @method _getButtons
         * Renders publisher buttons to DOM snippet and returns it.
         *
         *
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = me.templateButtonsDiv.clone(),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelBtn.setTitle(me.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me._editToolLayoutOff();
                me.instance.setPublishMode(false);
            });
            cancelBtn.insertTo(buttonCont);

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.addClass('primary');

            if (me.data) {
                var save = function () {
                    me._editToolLayoutOff();
                    var selections = me._gatherSelections();
                    if (selections) {
                        me._publishMap(selections);
                    }
                };
                saveBtn.setTitle(me.loc.buttons.saveNew);
                saveBtn.setHandler(function () {
                    me.data.id = null;
                    delete me.data.id;
                    save();
                });
                saveBtn.insertTo(buttonCont);

                var replaceBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                replaceBtn.setTitle(me.loc.buttons.replace);
                replaceBtn.addClass('primary');
                replaceBtn.setHandler(function () {
                    me._showReplaceConfirm(save);
                });
                replaceBtn.insertTo(buttonCont);

            } else {
                saveBtn.setTitle(me.loc.buttons.save);
                saveBtn.setHandler(function () {
                    me._editToolLayoutOff();
                    var selections = me._gatherSelections();
                    if (selections) {
                        me._publishMap(selections);
                    }
                });
                saveBtn.insertTo(buttonCont);
            }

            return buttonCont;
        },

        /**
         * @private @method _showReplaceConfirm
         * Shows a confirm dialog for replacing published map
         *
         * @param {Function} continueCallback function to call if the user confirms
         *
         */
        _showReplaceConfirm: function (continueCallback) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc.buttons.replace);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close();
                continueCallback();
            });
            var cancelBtn = dialog.createCloseButton(this.loc.buttons.cancel);
            dialog.show(this.loc.confirm.replace.title, this.loc.confirm.replace.msg, [cancelBtn, okBtn]);
        },

        /**
         * @private @method _showValidationErrorMessage
         * Takes an error array as defined by Oskari.userinterface.component.FormInput validate() and
         * shows the errors on a  Oskari.userinterface.component.Popup
         *
         * @param {Object[]} errors validation error objects to show
         *
         */
        _showValidationErrorMessage: function (errors) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = dialog.createCloseButton(this.loc.buttons.ok),
                content = jQuery('<ul></ul>'),
                i,
                row;

            for (i = 0; i < errors.length; i += 1) {
                row = jQuery('<li></li>');
                row.append(errors[i].error);
                content.append(row);
            }
            dialog.show(this.loc.error.title, content, [okBtn]);
        },

        /**
         * @private @method _gatherSelections
         * Gathers publisher selections and returns them as JSON object
         *
         *
         * @return {Object} selections
         */
        _gatherSelections: function () {
            var me = this,
                container = me.mainPanel,
                sandbox = me.instance.getSandbox(),
                errors = me.locationForm.validate(),
                values = me.locationForm.getValues(),
                size = me._getSelectedMapSize(),
                selections = {
                    domain: values.domain,
                    name: values.name,
                    language: values.language,
                    plugins: [],
                    bundles: []
                },
                i,
                option,
                classes;

            if (me.data && me.data.id) {
                selections.id = me.data.id;
            }
            // get layout
            selections.layout = me.activeToolLayout;
            me.toolsPanel.addValues(selections);

            if (size.valid) {
                if (size.option.id !== 'fill') {
                    selections.size = {
                        width: size.width,
                        height: size.height
                    };
                }
            } else {
                errors.push({
                    field: 'size',
                    error: this.loc.error.size
                });
            }

            // if maplayer plugin is enabled
            var layerValues = me.maplayerPanel.getValues();
            if (layerValues.layerSelection) {
                // Add tool location classes
                layerValues.layerSelection.location = {
                    classes: me.layerSelectionClasses.classes
                };
                selections.plugins.push(layerValues.layerSelection);
                selections.defaultBase = layerValues.defaultBase;
                selections.baseLayers = layerValues.baseLayers;
            }
            // add logoplugin
            var layoutOptions = me.layoutPanel.getValues();
            var logoPlugin = {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                config: {
                    font: layoutOptions.font,
                    location: {
                        classes: me.logoPluginClasses.classes
                    }
                }
            };
            selections.plugins.push(logoPlugin);

            // if data grid is enabled
            if (me.showStats) {
                // get state of statsgrid
                // TODO? for some reason original state has been cloned
                // real / live state can be found from plugins...
                var statsGridState = me.gridPlugin.getState(); //me.sandbox.getStatefulComponents().statsgrid,
                statsGridState = me._filterIndicators(_.clone(statsGridState, true));
                statsGridState.gridShown = me.isDataVisible;
                selections.gridState = statsGridState;
            }

            var mapFullState = sandbox.getStatefulComponents().mapfull.getState();
            selections.mapstate = mapFullState;

            // saves possible open gfi popups
            if (sandbox.getStatefulComponents().infobox) {
                selections.infobox = sandbox.getStatefulComponents().infobox.getState();
            }

            // adds possible feature data bundle
            if (this.toolsPanel.hasFeatureDataBundle()) {
                selections.featuredata2 = {
                    /* TODO enable this when it's actually read somewhere...
                    location: {
                        classes: this.toolsPanel.getFeatureDataPlugin().plugin.getLocation()
                    },*/
                    selectionTools: false
                };
            }

            if (errors.length > 0) {
                // TODO: messages
                me._showValidationErrorMessage(errors);
                return;
            }
            return selections;

        },

        /**
         * @private @method _publishMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} selections map data as returned by _gatherSelections()
         *
         */
        _publishMap: function (selections) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                totalWidth = '100%',
                totalHeight = '100%',
                errorHandler = function () {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = dialog.createCloseButton(me.loc.buttons.ok);
                    dialog.show(me.loc.error.title, me.loc.error.saveFailed, [okBtn]);
                };

            if (selections.size) {
                totalWidth = selections.size.width + 'px';
                totalHeight = selections.size.height + 'px';
            }

            // make the ajax call
            jQuery.ajax({
                url: url + '&action_route=Publish',
                type: 'POST',
                dataType: 'json',
                data: {
                    pubdata: JSON.stringify(selections)
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    if (response.id > 0) {
                        var event = sandbox.getEventBuilder(
                            'Publisher.MapPublishedEvent'
                        )(
                            response.id,
                            totalWidth,
                            totalHeight,
                            selections.language
                        );
                        sandbox.notifyAll(event);
                    } else {
                        errorHandler();
                    }
                },
                error: errorHandler
            });
        },

        /**
         * @private @method _validateNumberRange
         * Validates number in range
         *
         * @param {Object} value number to validate
         * @param {Number} min min value
         * @param {Number} max max value
         *
         * @return {Boolean} Number validity
         */
        _validateNumberRange: function (value, min, max) {
            var ret = true;

            if (isNaN(parseInt(value, 10))) {
                ret = false;
            } else if (!isFinite(value)) {
                ret = false;
            } else if (value < min || value > max) {
                ret = false;
            }
            return ret;
        },

        /**
         * @method setEnabled
         * "Activates" the published map preview when enabled
         * and returns to normal mode on disable
         *
         * @param {Boolean} isEnabled true to enable preview, false to disable
         * preview
         *
         */
        setEnabled: function (isEnabled) {
            if (isEnabled) {
                this._enablePreview();
            } else {
                this._disablePreview();
            }
        },

        /**
         * @private @method _enablePreview
         * Modifies the main map to show what the published map would look like
         *
         *
         */
        _enablePreview: function () {
            var me = this,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance(
                    'MainMapModule'
                ),
                plugins = mapModule.getPluginInstances(),
                tools = me.toolsPanel.getTools(),
                p,
                plugin,
                i;

            for (p in plugins) {
                if (plugins.hasOwnProperty(p)) {
                    plugin = plugins[p];
                    if (plugin.hasUI && plugin.hasUI()) {
                        plugin.stopPlugin(me.instance.sandbox);
                        mapModule.unregisterPlugin(plugin);
                        me.normalMapPlugins.push(plugin);
                    }
                }
            }

            me.maplayerPanel.start();
            if (me.data && me.data.hasLayerSelectionPlugin) {
                // sets up initial data when editing published map
                me.maplayerPanel.useConfig(me.data.hasLayerSelectionPlugin);
            }

            me._updateMapSize();

            for (i = 0; i < tools.length; i += 1) {
                if (tools[i].selected) {
                    me.toolsPanel.activatePreviewPlugin(tools[i], true);
                }
            }
            me.toolsPanel.activateFeatureDataPlugin(true);

            mapModule.registerPlugin(me.logoPlugin);
            this.logoPlugin.startPlugin(me.instance.sandbox);
        },

        /**
         * @private @method _disablePreview
         * Returns the main map from preview to normal state
         *
         *
         */
        _disablePreview: function () {
            var me = this,
                tools = me.toolsPanel.getTools(),
                mapElement,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                plugin,
                i;
            // teardown preview plugins
            for (i = 0; i < tools.length; i += 1) {
                if (tools[i].plugin) {
                    me.toolsPanel.activatePreviewPlugin(tools[i], false);
                    mapModule.unregisterPlugin(tools[i].plugin);
                    tools[i].plugin = undefined;
                    delete tools[i].plugin;
                }
            }
            me.toolsPanel.activateFeatureDataPlugin(false);

            me.maplayerPanel.stop();

            me.layoutPanel.stop();

            // return map size to normal
            mapElement = jQuery(mapModule.getMap().div);
            // remove width definition to resume size correctly
            mapElement.width('');
            mapElement.height(jQuery(window).height());

            // notify openlayers that size has changed
            me._updateMapModuleSize();
            //mapModule.updateSize();

            // stop our logoplugin
            mapModule.unregisterPlugin(me.logoPlugin);
            me.logoPlugin.stopPlugin(me.instance.sandbox);

            // stop our classify plugin
            if (me.classifyPlugin) {
                mapModule.unregisterPlugin(me.classifyPlugin);
                me.classifyPlugin.stopPlugin(me.instance.sandbox);
            }

            // stop our grid plugin
            if (me.gridPlugin) {
                mapModule.unregisterPlugin(me.gridPlugin);
                me.gridPlugin.stopPlugin(me.instance.sandbox);
            }

            // resume normal plugins
            for (i = 0; i < me.normalMapPlugins.length; i += 1) {
                plugin = me.normalMapPlugins[i];
                mapModule.registerPlugin(plugin);
                plugin.startPlugin(me.instance.sandbox);
            }
            // reset listing
            me.normalMapPlugins = [];
        },

        /**
         * @method destroy
         * Destroys/removes this view from the screen.
         *
         *
         */
        destroy: function () {
            this.mainPanel.remove();
        },

        /**
         * @method setPluginLanguage
         * Changes system language with Oskari.setLang and stops/starts plugins to make
         * them rewrite their UI with the new language.
         *
         * @param {string} lang language code
         *
         */
        setPluginLanguage: function (lang) {
            if (lang === null || lang === undefined) {
                throw new TypeError(
                    'Oskari.mapframework.bundle.publisher.view.BasicPublisher' +
                    '.setPluginLanguage: missing language'
                );
            }
            Oskari.setLang(lang);
            var me = this,
                i,
                tool,
                tools = me.toolsPanel.getTools();
            for (i = 0; i < tools.length; i += 1) {
                tool = tools[i];
                if (tool._isPluginStarted) {
                    // FIXME no restarts, it breaks stuff... add a changeLanguage function or smthn...
                    // stop and start if enabled to change language
                    me.toolsPanel.activatePreviewPlugin(tool, false);
                    me.toolsPanel.activatePreviewPlugin(tool, true);
                }
            }
            // stop and start if enabled to change language
            me._resetLayerSelectionPlugin();

            // stop and start if enabled to change language
            me.logoPlugin.stopPlugin(this.instance.sandbox);
            me.logoPlugin.startPlugin(this.instance.sandbox);
        },

        /**
         * @private @method _resetLayerSelectionPlugin
         * Changes system language with Oskari.setLang and stops/starts plugins to make
         * them rewrite their UI with the new language.
         *
         * @param {string} lang language code
         *
         */
        _resetLayerSelectionPlugin: function () {
            // stop and start if enabled to change language
            if (this.maplayerPanel.isEnabled()) {
                var values = this.maplayerPanel.plugin.getBaseLayers();

                this.maplayerPanel.enablePlugin(false);
                this.maplayerPanel.enablePlugin(true);

                var baseLayers = values.baseLayers,
                    selectedBase = values.defaultBaseLayer,
                    i,
                    layer;
                for (i = 0; i < baseLayers.length; i += 1) {
                    layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(baseLayers[i]);
                    this.maplayerPanel.plugin.addBaseLayer(layer);
                }
                this.maplayerPanel.plugin.selectBaseLayer(selectedBase);
            }
        },

        /**
         * @method initGrid
         *
         * @param {string} layer Layer id
         *
         */
        initGrid: function (layer) {
            var me = this,
                conf = me.conf,
                locale = Oskari.getLocalization('StatsGrid'), // Let's use statsgrid's locale files.
                showGrid = true, //me.conf ? me.conf.gridShown : true; // Show the grid on startup, defaults to true.
                sandboxName = 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                statsGridState;

            me.sandbox = sandbox;
            sandbox.register(me.instance);

            // Create the StatisticsService for handling ajax calls and common functionality.
            // Used in both plugins below.
            var statsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.StatisticsService',
                me
            );
            sandbox.registerService(statsService);
            me.statsService = statsService;

            // Fetch the state of the statsgrid bundle and create the UI based on it.
            // TODO: get the saved state from the published map.
            var statsGrid = me.sandbox.getStatefulComponents().statsgrid;
            if (statsGrid && statsGrid.state && showGrid) {
                //me.createUI(statsGrid.state);
                //me.publisher.
                statsGridState = me._filterIndicators(_.clone(statsGrid.state, true));
                // Register grid plugin to the map.
                var gridConf = {
                    'published': true,
                    'layer': layer,
                    'state': statsGridState
                };
                var gridPlugin = Oskari.clazz.create(
                    'Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
                    gridConf,
                    locale
                );
                me.mapModule.registerPlugin(gridPlugin);
                me.mapModule.startPlugin(gridPlugin);
                me.gridPlugin = gridPlugin;

                // Register classification plugin to the map.
                gridConf.state.allowClassification = false;

                var classifyPlugin = Oskari.clazz.create(
                    'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
                    gridConf,
                    locale
                );
                me.mapModule.registerPlugin(classifyPlugin);
                me.mapModule.startPlugin(classifyPlugin);
                me.classifyPlugin = classifyPlugin;

                var elLeft = me.getDataContainer();
                elLeft.html(me.statsContainer);

                // Initialize the grid
                me.gridPlugin.createStatsOut(me.statsContainer);

            }
        },

        /**
         * @private @method _filterIndicators
         * Filters out user's indicators which aren't allowed to be published.
         *
         * @param  {Object} statsGridState
         *
         * @return {Object} filtered state
         */
        _filterIndicators: function (statsGridState) {
            statsGridState.indicators = _.filter(statsGridState.indicators, function (indicator) {
                return (
                    // indicators
                    (!indicator.ownIndicator) ||
                    // own indicators
                    (indicator.ownIndicator && indicator.public)
                );
            });
            return statsGridState;
        },

        /**
         * @method changeToolStyles
         * Changes the style of each tool, if the tool's plugin supports it.
         *
         * @param {Object} style
         *
         */
        changeToolStyles: function (style) {
            if (!style) {
                return;
            }

            var me = this,
                styleConfig,
                i,
                tool,
                tools = me.toolsPanel.getTools();

            if (style.val === 'default') {
                style.val = null;
            }

            // Set the toolStyle to the config of each tool
            // and change the style immedately. 
            for (i = 0; i < tools.length; i += 1) {
                tool = tools[i];
                // special object for zoombar
                if (tool.id.indexOf('Portti2Zoombar') >= 0) {
                    styleConfig = style.zoombar || {};
                    styleConfig.val = style.val;
                } else if (tool.id.indexOf('SearchPlugin') >= 0) {
                    // same for search plugin
                    styleConfig = style.search || {};
                    styleConfig.val = style.val;
                } else {
                    // otherwise just use the style's id
                    styleConfig = style.val;
                }

                if (tool.config) {
                    tool.config.toolStyle = styleConfig;
                }
                if (tool._isPluginStarted && tool.plugin && tool.plugin.changeToolStyle) {
                    tool.plugin.changeToolStyle(styleConfig);
                    // tools in toolbar plugin needs to be configured
                    if (tool.id.indexOf('PublisherToolbarPlugin') >= 0) {
                        if (me.toolsPanel.toolbarConfig && me.toolsPanel.toolbarConfig.classes) {
                            me.toolsPanel.toolbarConfig.classes = tool.plugin.getToolConfs();
                        }
                    }
                }
            }

            // Change the style of the layer selection plugin
            me._setLayerSelectionStyle(style.val);
            // Recreate draggable if need be
            if (me.toolLayoutEditMode) {
                me._makeDraggable(jQuery('.mapplugin'));
            }
        },

        /**
         * @private @method _setLayerSelectionStyle
         *
         * @param {string} styleName Name of the style
         *
         */
        _setLayerSelectionStyle: function (styleName) {
            var mlp = this.maplayerPanel;
            mlp.pluginConfig.toolStyle = styleName;
            if (mlp.isEnabled() && mlp.plugin.changeToolStyle) {
                mlp.plugin.changeToolStyle(styleName);
            }
        },

        /**
         * @method changeColourScheme
         * Changes the colour scheme of the getinfo plugin and layer selection plugin.
         *
         * @param {Object} colourScheme
         *
         */
        changeColourScheme: function (colourScheme) {
            var infoPlugin = this._getGetInfoPlugin(),
                mlp = this.maplayerPanel;
            if (infoPlugin) {
                var conf = infoPlugin.getConfig();
                conf.colourScheme = colourScheme;
                infoPlugin.setConfig(conf);
            }

            mlp.pluginConfig.colourScheme = colourScheme;
            if (mlp.isEnabled() && mlp.plugin.changeColourScheme) {
                mlp.plugin.changeColourScheme(colourScheme);
            }
        },

        /**
         * @method changeFont
         * Changes the font of each tool (has to be done separately for each one)
         * if the plugin supports it.
         *
         * @param {string} font the id of the font
         *
         */
        changeFont: function (font) {
            if (!font) {
                return;
            }

            var me = this,
                i,
                tool,
                tools = me.toolsPanel.getTools();

            // Set the font to the config of each tool
            // and change the font immedately. 
            for (i = 0; i < tools.length; i += 1) {
                tool = tools[i];
                if (tool.config) {
                    tool.config.font = font;
                }
                if (tool._isPluginStarted && tool.plugin.changeFont) {
                    tool.plugin.changeFont(font);
                }
            }

            // Change the font of the layer selection plugin
            me._setLayerSelectionFont(font);

            // Change the font of the logo plugin
            if (me.logoPlugin && me.logoPlugin.changeFont) {
                me.logoPlugin.changeFont(font);
            }

            // Change the font of the info plugin
            var infoPlugin = me._getGetInfoPlugin();
            if (infoPlugin) {
                var conf = infoPlugin.getConfig();
                conf.font = font;
                infoPlugin.setConfig(conf);
            }
        },

        /**
         * @private @method _setLayerSelectionStyle
         *
         * @param {string} font the id of the font
         *
         */
        _setLayerSelectionFont: function (font) {
            var mlp = this.maplayerPanel;
            mlp.pluginConfig.font = font;
            if (mlp.isEnabled() && mlp.plugin.changeFont) {
                mlp.plugin.changeFont(font);
            }
        },

        /**
         * @private @method _getGetInfoPlugin
         *
         *
         * @return Infoplugin instance
         */
        _getGetInfoPlugin: function () {
            return this.toolsPanel.getToolById(
                'Oskari.mapframework.mapmodule.GetInfoPlugin'
            );
        },
        /**
         * @private @method _getPreferredPluginLocation
         *
         * @param {Object} plugin
         * @param {string} defaultLocation
         *
         * @return {string} Default location
         */
        _getPreferredPluginLocation: function (plugin, defaultLocation) {
            var me = this,
                location = defaultLocation,
                dropzoneSelector = 'div.mapplugins.' + location.split(' ').join('.');

            if (location === null || this._siblingsAllowed(plugin.getClazz(), null, jQuery(dropzoneSelector)) === 0) {
                // try to find a container that's allowed
                var allowedLocations = me.toolDropRules[plugin.getClazz()].allowedLocations;
                // TODO once grouped siblings is implemented:
                // if plugin has groupedSiblings, return a container with an allowedSibling if available
                // we invert the order because bottom containers are before the top ones in the DOM
                jQuery(jQuery('div.mapplugins').get().reverse()).each(function () {
                    var target = jQuery(this),
                        allowedLocation = me._locationAllowed(allowedLocations, target);
                    if (allowedLocation && me._siblingsAllowed(plugin.getClazz(), null, target) === 2) {
                        location = allowedLocation;
                        return false;
                    }
                });
            }
            return location;
        },

        /**
         * @private @method _getInitialPluginLocation
         *
         * @param {Object} data
         * @param {string} pluginName
         *
         * @return Initial plugin location
         */
        _getInitialPluginLocation: function (data, pluginName) {
            var plugins = this.data.state.mapfull.config.plugins,
                plugin,
                i;

            for (i = 0; i < plugins.length; i += 1) {
                plugin = plugins[i];
                if (plugin.id === pluginName && plugin.getConfig() && plugin.getConfig().location) {
                    return plugin.getConfig().location.classes;
                }
            }
            return null;
        },

        /**
         * Retrieves the layout config params from the different plugins
         * for the layout form component to use to prepopulate values.
         * Kind of hackish, but since they're not saved into any other place
         * than the plugins' conf in the database, we must do this.
         * Returns an object with 0..3 keys. Example:
         * {
         *     'font': <String>,
         *     'toolStyle': <String>,
         *     'colourScheme': {
         *         'val': <String>,
         *         'bgColour': <String>,
         *         'titleColour': <String>,
         *         'headerColour': <String>,
         *         'iconCls': <String>
         *     }
         * }
         *
         * @private @method _getInitialLayoutData
         *
         * @param  {Object} data
         *
         * @return {Object} returns the config for layout
         */
        _getInitialLayoutData: function (data) {
            if (!data) {
                return null;
            }

            var plugins = data.state.mapfull.config.plugins,
                pLen = plugins.length,
                layoutConf = {},
                i,
                plugin;

            for (i = 0; i < pLen; i += 1) {
                plugin = plugins[i];

                if (plugin.getConfig()) {
                    if (plugin.getConfig().font) {
                        layoutConf.font = plugin.getConfig().font;
                    }

                    if (plugin.getConfig().colourScheme) {
                        layoutConf.colourScheme = plugin.getConfig().colourScheme;
                    }

                    if (plugin.getConfig().toolStyle) {
                        if (typeof plugin.getConfig().toolStyle === 'string') {
                            layoutConf.toolStyle = plugin.getConfig().toolStyle;
                        } else {
                            layoutConf.toolStyle = plugin.getConfig().toolStyle.val;
                        }
                    }
                }
            }

            return layoutConf;
        },

        /**
         * @private @method _getPluginByClazz
         * Returns plugin object of given plugin class
         *
         * @param  {string} pluginClazz
         * Plugin class
         *
         * @return {Object}
         * Plugin object of given plugin class, null if not found
         */
        _getPluginByClazz: function (pluginClazz) {
            var me = this,
                tool,
                plugin = null;

            tool = me.toolsPanel.getToolById(pluginClazz);
            if (tool && tool.plugin) {
                plugin = tool.plugin;
            } else {
                if (pluginClazz === 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin') {
                    plugin = me.logoPlugin;
                } else if (pluginClazz === 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin') {
                    plugin = me.maplayerPanel.plugin;
                } else if (pluginClazz === 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin') {
                    plugin = me.toolsPanel.getFeatureDataPlugin();
                    if (plugin) {
                        plugin = plugin.plugin;
                    }
                }
            }
            return plugin;
        },
        /**
         * @private @method _getActivePlugins
         * Returns all active plugins in the whitelist
         *
         * @param  {string[]} whitelist
         * Array of plugin classes to examine
         *
         * @return {string[]}
         * Array of plugin classes
         */
        _getActivePlugins: function (whitelist) {
            var ret = [],
                clazz;

            jQuery('.mapplugins .mapplugin').each(function () {
                clazz = jQuery(this).attr('data-clazz');
                if (jQuery.inArray(clazz, whitelist) > -1) {
                    ret.push(clazz);
                }
            });
            return ret;
        },

        /**
         * @private @method _getDraggedPlugins
         * Returns all plugins that should be included in the drag, including
         * original dragged plugin.
         *
         * @param  {string} pluginClazz
         * Plugin class
         * @return {string[]}
         * Array of plugin classes
         */
        _getDraggedPlugins: function (pluginClazz) {
            var ret = [];

            if (this.toolDropRules[pluginClazz].groupedSiblings) {
                ret = this._getActivePlugins(this.toolDropRules[pluginClazz].allowedSiblings);
            }
            ret.push(pluginClazz);
            return ret;
        },

        /**
         * @private @method _getDropzonePlugins
         * Returns all active plugins in given dropzone
         *
         * @param  {jQuery} dropzone
         * jQuery object of the dropzone
         * @return {string[]}
         * Array of plugin classes
         */
        _getDropzonePlugins: function (dropzone) {
            var ret = [],
                clazz;

            dropzone.find('.mapplugin').each(function () {
                // ignore undefined...
                clazz = jQuery(this).attr('data-clazz');
                if (clazz) {
                    ret.push(clazz);
                }
            });
            return ret;
        },

        /**
         * @private @method _locationAllowed
         * Is the dropzone in the plugin's allowed locations
         *
         * @param  {string[]}   allowedLocations
         * Array of allowed locations for the plugin
         * @param  {jQuery}  dropzone
         * jQuery object of the dropzone
         *
         * @return {string}
         * Allowed location string if allowed, null if not.
         */
        _locationAllowed: function (allowedLocations, dropzone) {
            var isAllowedLocation,
                i;

            if (!allowedLocations || !dropzone) {
                return false;
            }
            for (i = 0; i < allowedLocations.length; i += 1) {
                isAllowedLocation = dropzone.is('.' + allowedLocations[i].split(' ').join('.'));
                if (isAllowedLocation) {
                    return allowedLocations[i];
                }
            }
            return null;
        },

        /**
         * @private @method _moveSiblings
         * Moves unallowed siblings to source so plugin can be moved to target
         *
         * @param  {string} pluginClazz
         * Plugin clazz
         * @param  {jQuery} source
         * jQuery object for source dropzone (optional)
         * @param  {jQuery} target
         * jQuery object for target dropzone
         *
         **/
        _moveSiblings: function (pluginClazz, source, target) {
            var me = this,
                sibling,
                siblings = this._getDropzonePlugins(target),
                i;

            for (i = 0; i < siblings.length; i += 1) {
                if (jQuery.inArray(siblings[i], me.toolDropRules[pluginClazz].allowedSiblings) < 0) {
                    // Unallowed sibling, move to source
                    sibling = me._getPluginByClazz(siblings[i]);
                    sibling.setLocation(source.attr('data-location'));
                }
            }
        },

        /**
         * @private @method _siblingsAllowed
         * Checks if plugins in dropzone are allowed siblings for given plugin
         *
         * @param  {string} pluginClazz
         * Plugin clazz
         * @param  {jQuery} source
         * jQuery object for source dropzone (optional)
         * @param  {jQuery} target
         * jQuery object for target dropzone
         * @param  {string} excludedSibling
         * Clazz for plugin that should be ignored in sibling check (optional)
         *
         * @return {Number}
         * 0 = no, 1 = siblings can be moved out of the way, 2 = yes
         */
        _siblingsAllowed: function (pluginClazz, source, target, excludedSibling) {
            var me = this,
                siblings = this._getDropzonePlugins(target),
                i,
                ret = 2;

            for (i = 0; i < siblings.length; i += 1) {
                if (!excludedSibling || siblings[i] !== excludedSibling) {
                    // sibling is not ignored, see if it's an allowed sibling
                    if (jQuery.inArray(siblings[i], me.toolDropRules[pluginClazz].allowedSiblings) < 0 && pluginClazz !== siblings[i]) {
                        // not an allowed sibling, see if we can move it out of the way (don't pass a source, it'd cause an infinite loop)
                        // only accept 2/yes as a result, moving source plugins out of the way would get too weird
                        if (source && me._locationAllowed(this.toolDropRules[siblings[i]].allowedLocations, source) && me._siblingsAllowed(siblings[i], null, source, pluginClazz) === 2) {
                            // sibling can be moved to source
                            ret = 1;
                        } else {
                            // sibling can't be moved to source
                            ret = 0;
                            break;
                        }
                    }
                }
            }
            return ret;
        },

        /**
         * @method _showDroppable       Shows dropzones where the given plugin can be dropped in green
         * @param  {string} pluginClazz Plugin class
         * @param  {Object} source      jQuery object for source dropzone
         * @private
         */
        _showDroppable: function (pluginClazz, source) {
            var me = this,
                allowedLocation,
                target;

            if (!pluginClazz) {
                return;
            }
            jQuery('div.mapplugins').each(function () {
                target = jQuery(this);
                allowedLocation = me._locationAllowed(me.toolDropRules[pluginClazz].allowedLocations, target);
                if (allowedLocation) {
                    allowedLocation = me._siblingsAllowed(pluginClazz, source, target);

                    // show allowed-if-we-move-some-siblings-out-of-the-way as allowed for now
                    if (allowedLocation) {
                        // paint it green, plugin can be dropped here
                        target.find('.mappluginsContent').addClass('allowed').droppable('enable');
                    } else {
                        // paint it red, plugins already in the dropzone aren't allowed siblings for this plugin
                        // we could also try to move them somewhere?
                        target.find('.mappluginsContent').addClass('disallowed').droppable('disable');
                    }
                } else {
                    // paint it red, this isn't an allowed dropzone for the plugin
                    target.find('.mappluginsContent').addClass('disallowed').droppable('disable');
                }
            });
        },

        /**
         * @private @method _hideDroppable
         * Hides dropzones
         *
         *
         */
        _hideDroppable: function () {
            jQuery(
                'div.mapplugins .mappluginsContent'
            ).removeClass('allowed').removeClass('disallowed');
        }
    });
