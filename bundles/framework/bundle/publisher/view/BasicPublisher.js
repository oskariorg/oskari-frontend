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
        me.template = jQuery('<div class="basic_publisher">' +
            '<div class="header">' +
            '<div class="icon-close">' +
            '</div>' +
            '<h3></h3>' +
            '</div>' +
            '<div class="content">' +
            '</div>' +
            '</div>');

        me.templates = {
            "publishedGridTemplate": '<div class="publishedgrid"></div>'
        };

        me.templateButtonsDiv = jQuery('<div class="buttons"></div>');
        me.templateHelp = jQuery('<div class="help icon-info"></div>');
        me.templateTool = jQuery('<div class="tool ">' + '<input type="checkbox"/>' + '<span></span></div>');
        me.templateToolOptions = jQuery('<div class="tool-options"></div>');
        me.templateToolOption = jQuery('<div class="tool-option"><input type="checkbox" /><span></span></div>');
        me.templateLayout = jQuery('<div class="tool "><label><input type="radio" name="toolLayout" /><span></span></label></div>');
        me.templateData = jQuery('<div class="data ">' + '<input type="checkbox"/>' + '<label></label></div>');
        me.templateSizeOptionTool = jQuery('<div class="tool ">' + '<input type="radio" name="size" />' + '<span></span></div>');
        me.templateCustomSize = jQuery('<div class="customsize">' + '<input type="text" name="width" ' +
            'placeholder="' + localization.sizes.width + '"/> x ' +
            '<input type="text" name="height" placeholder="' + localization.sizes.height + '"/></div>');

        /**
         * @property tools
         */
        me.tools = [{
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin",
            "selected": false,
            "lefthanded": "bottom left",
            "righthanded": "bottom right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "bottom left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin",
            "selected": false,
            "lefthanded": "bottom right",
            "righthanded": "bottom left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "bottom right"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons",
            "selected": false,
            "lefthanded": "top left",
            "righthanded": "top right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar",
            "selected": true,
            "lefthanded": "top left",
            "righthanded": "top right",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top left"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin",
            "selected": false,
            "lefthanded": "top right",
            "righthanded": "top left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top right"
                }
            }
        }, {
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin",
            "selected": false,
            "lefthanded": "top right",
            "righthanded": "top left",
            "config": {
                "location": {
                    "top": "",
                    "right": "",
                    "bottom": "",
                    "left": "",
                    "classes": "top right"
                },
                "toolbarId" : "PublisherToolbar"
            }
        }, {
            "id": "Oskari.mapframework.mapmodule.ControlsPlugin",
            "selected": true
        }, {
            "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
            "selected": true,
            "config": {
                "ignoredLayerTypes" : ["WFS"],
                "infoBox": false
            }
        }];

        // map tool indices so we don't have to go through the list every time...
        me.toolIndices = {};
        var i;
        for (i = me.tools.length - 1; i > -1; i -= 1) {
            me.toolIndices[this.tools[i].id] = i;
        }

        me.toolDropRules = {
            "Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin": {
                "allowedLocations": ['bottom left', 'bottom right'],
                "allowedSiblings": ["Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin", "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"],
                "groupedSiblings": false
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin": {
                "allowedLocations": ['bottom left', 'bottom right'],
                "allowedSiblings": ["Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin", "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"],
                "groupedSiblings": false
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin" : {
                "alloweLocations": ['bottom left', 'bottom right'],
                "allowedSiblings": ["Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin", "Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin"],
                "groupedSiblings": false
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons": {
                "allowedLocations": ['top left', 'top right', 'bottom left', 'bottom right'],
                "allowedSiblings": ["Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"],
                "groupedSiblings": true
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar": {
                "allowedLocations": ['top left', 'top right', 'bottom left', 'bottom right'],
                "allowedSiblings": ["Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"],
                "groupedSiblings": true
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin": {
                "allowedLocations": ['top left', 'top center', 'top right'],
                "allowedSiblings": ['Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin'],
                "groupedSiblings": false
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin": {
                "allowedLocations": ['top left', 'top center', 'top right'],
                "allowedSiblings": ['Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'],
                "groupedSiblings": false
            },

            "Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin": {
                "allowedLocations": ['top left', 'top right'],
                "allowedSiblings": [],
                "groupedSiblings": false
            }
        };

        // TODO see if this and layerselection could be moved to tools...
        // just ignore them on ui creation or smthn
        me.logoPluginClasses = {
            "lefthanded": "bottom left",
            "righthanded": "bottom right",
            "classes": "bottom left"
        };

        // Not sure where this should be...
        me.layerSelectionClasses = {
            "lefthanded": "top right",
            "righthanded": "top left",
            "classes": "top right"
        };

        me.toolbarConfig = {};

        me.toolLayouts = ["lefthanded", "righthanded"];

        me.activeToolLayout = "lefthanded";

        me.sizeOptions = [{
            "id": "small",
            "width": 580,
            "height": 387
        }, {
            "id": "medium",
            "width": 700,
            "height": 525,
            "selected": true // default option
        }, {
            "id": "large",
            "width": 1240,
            "height": 700
        }, {
            "id": "custom",
            //width : 'max 4000',
            //height : 2000,
            "minWidth": 30,
            "minHeight": 20,
            "maxWidth": 4000,
            "maxHeight": 2000
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
                initWidth = me.data.state.mapfull.config.size.width,
                initHeight = me.data.state.mapfull.config.size.height,
                option;
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

            // setup initial plugins
            var plugins = me.data.state.mapfull.config.plugins,
                selectedPluginIDs = [],
                j,
                plugin;
            for (i = 0; i < plugins.length; i += 1) {
                selectedPluginIDs[plugins[i].id] = true;
                if (plugins[i].id === 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin') {
                    me.data.hasLayerSelectionPlugin = plugins[i].config;
                }
            }
            //me.data.hasLayerSelectionPlugin = false;
            for (i = 0; i < me.tools.length; i += 1) {
                option = me.tools[i];
                option.selected = !!selectedPluginIDs[option.id];
            }
        }

        me.loc = localization;
        me.accordion = null;

        me.maplayerPanel = null;
        me.mainPanel = null;
        me.normalMapPlugins = [];
        me.logoPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin', {
            "location": {
                "classes": me.logoPluginClasses.classes
            }
        });
        me.latestGFI = null;
        me.urlBase = instance.conf.urlPrefix + "/web/";
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
                    "domain": me.data.domain,
                    "name": me.data.name,
                    "lang": me.data.lang
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
                layer;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === "stats") {
                    showStats = true;
                }
            }
            if (showStats) {
                // Find the map module.
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                me.mapModule = mapModule;

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
            me.maplayerPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm', me.loc, me.instance, {
                "location": {
                    "classes": me.layerSelectionClasses.classes
                }
            });
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
            container.find('div.header div.icon-close').bind('click', function () {
                me.instance.setPublishMode(false);
            });
            contentDiv.append(me._getButtons());

            var inputs = me.mainPanel.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });

            // bind help tags
            var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', me.instance.sandbox);
            helper.processHelpLinks(me.loc.help, content, me.loc.error.title, me.loc.error.nohelp);

        },
        /**
         * @method _setSelectedSize
         * @private
         * Adjusts the map size according to publisher selection
         */
        _setSelectedSize: function () {
            var me = this,
                widthInput = this.mainPanel.find('div.customsize input[name=width]'),
                heightInput = this.mainPanel.find('div.customsize input[name=height]'),
                mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                i,
                option,
                mapElement;
            widthInput.removeClass('error');
            heightInput.removeClass('error');
            for (i = 0; i < me.sizeOptions.length; i += 1) {
                option = me.sizeOptions[i];
                if (option.selected) {
                    // reference to openlayers map.div
                    mapElement = jQuery(mapModule.getMap().div);
                    if (option.id === "custom") {
                        var width = widthInput.val();
                        if (this._validateNumberRange(width, option.minWidth, option.maxWidth)) {
                            mapElement.width(width);
                            me.adjustDataContainer();
                        } else {
                            widthInput.addClass('error');
                        }
                        var height = heightInput.val();
                        if (this._validateNumberRange(height, option.minHeight, option.maxHeight)) {
                            mapElement.height(height);
                        } else {
                            heightInput.addClass('error');
                        }
                        break;
                    } else {
                        mapElement.width(option.width);
                        mapElement.height(option.height);
                        me.adjustDataContainer();
                    }
                    break;
                }
            }
            // notify openlayers that size has changed
            mapModule.updateSize();
        },
        /**
         * @method _createSizePanel
         * @private
         * Creates the size selection panel for publisher
         * @return {jQuery} Returns the created panel
         */
        _createSizePanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.size.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = this.templateHelp.clone(); // tooltip
            tooltipCont.attr('title', this.loc.size.tooltip);
            contentPanel.append(tooltipCont);
            // content
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=size]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.sizeOptions.length; i += 1) {
                        me.sizeOptions[i].selected = false;
                    }
                    tool.selected = true;
                    me._setSelectedSize();
                };
            };
            var initCustomSize = false,
                i,
                option,
                toolContainer,
                label;
            for (i = 0; i < this.sizeOptions.length; i += 1) {
                option = this.sizeOptions[i];
                toolContainer = this.templateSizeOptionTool.clone();
                label = this.loc.sizes[option.id];
                if (option.width && option.height && "custom" !== option.id) {
                    label = me._getSizeLabel(label, option);
                }
                toolContainer.find('span').addClass('sizeoption_' + option.id).append(label);
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                    if ("custom" === option.id) {
                        initCustomSize = true;
                    }
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr('value', option.id);
                toolContainer.find('input').change(closureMagic(option));
            }
            var customSizes = this.templateCustomSize.clone(),
                inputs = customSizes.find('input');
            inputs.focus(function () {
                var radio = contentPanel.find('input[name=size][value=custom]');
                radio.attr('checked', 'checked');
                radio.trigger('change');
            });
            inputs.bind('keyup', function () {
                me._setSelectedSize();
            });
            if (initCustomSize) {
                var widthInput = customSizes.find('input[name=width]'),
                    heightInput = customSizes.find('input[name=height]');
                widthInput.val(option.width);
                heightInput.val(option.height);
            }
            contentPanel.append(customSizes);
            return panel;
        },
        /**
         * Gets the label text for a size option. It changes based on grid visibility.
         *
         * @method _getSizeLabel
         * @private
         */
        _getSizeLabel: function (label, option) {
            var gridWidth = (this.isDataVisible ? this._calculateGridWidth() : 0);
            return (label + ' (' + (option.width + gridWidth) + ' x ' + option.height + 'px)');
        },
        /**
         * Sets the size label in size accordion panel in UI.
         *
         * @method _setSizeLabels
         * @private
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
                if (option.width && option.height && "custom" !== option.id) {
                    label = this._getSizeLabel(label, option);
                }
                span.text(label);
            }
        },
        /**
         * @method _createToolsPanel
         * @private
         * Creates the tool selection panel for publisher
         * @return {jQuery} Returns the created panel
         */
        _createToolsPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.tools.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = this.templateHelp.clone(), // tooltip
                i,
                toolContainer,
                pluginKey,
                toolname;
            tooltipCont.attr('title', this.loc.tools.tooltip);
            contentPanel.append(tooltipCont);

            // content
            var closureMagic = function (tool) {
                return function () {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked');
                    tool.selected = isChecked;
                    me._activatePreviewPlugin(tool, isChecked);
                };
            };

            for (i = 0; i < this.tools.length; i += 1) {
                toolContainer = this.templateTool.clone();
                var tool = this.tools[i];
                pluginKey = tool.id;
                pluginKey = pluginKey.substring(pluginKey.lastIndexOf('.') + 1);
                toolname = this.loc.tools[pluginKey];
                toolContainer.find('span').append(toolname);
                if (tool.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                tool.publisherPluginContainer = toolContainer;
                contentPanel.append(toolContainer);
                toolContainer.find('input').change(closureMagic(tool));
            }

            return panel;
        },
        _changeToolLayout: function (layout) {
            // iterate plugins
            var me = this,
                tools = me.tools,
                i,
                tool;
            // store location so we have easy access to it on save
            me.activeToolLayout = layout;
            // set location for all tools
            for (i = tools.length - 1; i > -1; i -= 1) {
                tool = tools[i];
                if (tool[layout]) {
                    tool.config.location.classes = tool[layout];
                    if (tool.plugin) {
                        if (tool.plugin.setLocation) {
                            tool.plugin.setLocation(tool.config.location);
                        }
                    }
                }
            }
            // Set logoplugin and layerselection as well
            me.logoPluginClasses.classes = me.logoPluginClasses[layout];
            if (me.logoPlugin) {
                me.logoPlugin.setLocation(me.logoPluginClasses);
            }
            me.layerSelectionClasses.classes = me.layerSelectionClasses[layout];
            me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses);
        },
        _createToolLayoutPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(), // tooltip
                i,
                input,
                layoutContainer,
                changeListener = function () {
                    if (this.checked) {
                        me._changeToolLayout(this.value);
                    }
                };
            // FIXME localize
            panel.setTitle(this.loc.toollayout.label);

            // FIXME correct title
            tooltipCont.attr('title', this.loc.toollayout.tooltip);
            contentPanel.append(tooltipCont);


            // content
            for (i = 0; i < me.toolLayouts.length; i += 1) {
                layoutContainer = me.templateLayout.clone();
                input = layoutContainer.find("input");
                input.val(me.toolLayouts[i]).change(changeListener);
                // First choice is active unless we have an active layout
                if (me.activeToolLayout) {
                    if (me.toolLayouts[i] === me.activeToolLayout) {
                        input.attr('checked', 'checked');
                    }
                } else if (i === 0) {
                    input.attr('checked', 'checked');
                }
                layoutContainer.find("span").html(this.loc.toollayout[me.toolLayouts[i]] || me.toolLayouts[i]);
                contentPanel.append(layoutContainer);
            }
            return panel;

        },
        _createDataPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(me.loc.data.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(); // tooltip
            tooltipCont.attr('title', me.loc.data.tooltip);
            contentPanel.append(tooltipCont);

            var dataContainer = me.templateData.clone();
            dataContainer.find('input').attr('id', 'show-grid-checkbox').change(function () {
                var checkbox = jQuery(me),
                    isChecked = checkbox.is(':checked');
                me.isDataVisible = isChecked;
                me.adjustDataContainer();
                // Update the size labels
                me._setSizeLabels();
            });
            dataContainer.find('label').attr('for', 'show-grid-checkbox').append(me.loc.data.grid);

            if (me.grid.selected) {
                dataContainer.find('input').attr('checked', 'checked');
                me.isDataVisible = me.grid.selected;
                me.adjustDataContainer();
            }
            contentPanel.append(dataContainer);

            return panel;
        },
        adjustDataContainer: function () {
            if (!this.statsContainer) {
                return;
            }
            var me = this,
                content = jQuery('#contentMap'),
                contentWidth = content.width(),
                marginWidth = content.css('margin-left').split('px')[0],
                maxContentWidth = jQuery(window).width() - marginWidth - 40,
                mapWidth = jQuery('#mapdiv').width(),
                mapHeight = jQuery('#mapdiv').height();

            // how many columns * 80px
            var gridWidth = me._calculateGridWidth(), //maxContentWidth - mapWidth;
                gridHeight = mapHeight,
                elLeft = jQuery('.oskariui-left'),
                elCenter = jQuery('.oskariui-center');

            if (me.isDataVisible) {
                if (gridWidth > 400) {
                    gridWidth = 400;
                }
                elLeft.removeClass('oskari-closed');
                jQuery('#contentMap').width(gridWidth + mapWidth);

                gridWidth = gridWidth + 'px';
                gridHeight = gridHeight + 'px';
                mapWidth = mapWidth + 'px';
            } else {
                elLeft.addClass('oskari-closed');
                jQuery('#contentMap').width('');

                gridWidth = '0px';
                gridHeight = '0px';
                contentWidth = '100%';
            }
            elLeft.css({
                'width': gridWidth,
                'height': gridHeight,
                'float': 'left'
            }).addClass('published-grid-left');
            elCenter.css({
                'width': mapWidth,
                'float': 'left'
            }).addClass('published-grid-center');
            me.statsContainer.height(mapHeight);

            if (me.gridPlugin) {
                me.gridPlugin.setGridHeight();
            }
        },
        _calculateGridWidth: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                width,
                statsGrid = sandbox.getStatefulComponents().statsgrid; // get state of statsgrid
            if (statsGrid &&
                    statsGrid.state &&
                    statsGrid.state.indicators !== null && statsGrid.state.indicators !== undefined) {

                //indicators + municipality (name & code)
                var columns = statsGrid.state.indicators.length + 2;
                //slickgrid column width is 80 by default
                width = columns * 80;
            } else {
                width = 160;
            }
            // Width + scroll bar width.
            return (width + 20);
        },

        getDataContainer: function () {
            return jQuery('.oskariui-left');
        },
        addDataGrid: function (grid) {
            this.getDataContainer.html(grid);
        },

        /**
         * @method handleMapMoved
         * Does nothing currently.
         */
        handleMapMoved: function () {

            var mapVO = this.instance.sandbox.getMap(),
                lon = mapVO.getX(),
                lat = mapVO.getY(),
                zoom = mapVO.getZoom();
            //this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
        },
        /**
         * @method _activatePreviewPlugin
         * @private
         * Enables or disables a plugin on map
         * @param {Object} tool tool definition as in #tools property
         * @param {Boolean} enabled, true to enable plugin, false to disable
         */
        _activatePreviewPlugin: function (tool, enabled) {
            var me = this,
                sandbox = me.instance.getSandbox();
            if (!tool.plugin && enabled) {
                var mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
                tool.plugin = Oskari.clazz.create(tool.id, tool.config);
                mapModule.registerPlugin(tool.plugin);
            }
            if (!tool.plugin) {
                // plugin not created -> nothing to do
                return;
            }

            var _toggleToolOption = function (toolName, groupName, toolOption) {
                return function () {
                    var checkbox = jQuery(this),
                        isChecked = checkbox.is(':checked'),
                        reqBuilder;
                    tool.selected = isChecked;
                    //TODO send toolbar request!
                    var requester = tool.plugin;
                    if (isChecked) {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption));
                        if (!me.toolbarConfig[groupName]) {
                            me.toolbarConfig[groupName] = {};
                        }
                        me.toolbarConfig[groupName][toolName] = true;
                    } else {
                        reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                        sandbox.request(requester, reqBuilder(toolName, groupName, toolOption.toolbarid));
                        if (me.toolbarConfig[groupName]) {
                            delete me.toolbarConfig[groupName][toolName];
                        }
                    }
                };
            };

            var toolOptions,
                i,
                buttonGroup,
                toolName,
                toolButton,
                reqBuilder;

            if (enabled) {
                tool.plugin.startPlugin(this.instance.sandbox);
                tool._isPluginStarted = true;

                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {
                        'toolbarId' : 'PublisherToolbar',
                        'defaultToolbarContainer' : '.publishedToolbarContent',
                        'hasContentContainer': true,
                        'classes' : {}
                    };

                    tool.plugin.setToolbarContainer();
                    me.toolbarConfig.classes = tool.plugin.getToolConfs();
                }

                toolOptions = tool.plugin.getToolOptions ? tool.plugin.getToolOptions() : null;

                //atm. this is using toolsplugin's button structure
                var options;
                if (toolOptions) {

                    options = me.templateToolOptions.clone();
                    tool.publisherPluginContainer.append(options);
                    //loop through button groups and buttons
                    for (i in toolOptions) {
                        if (toolOptions.hasOwnProperty(i)) {
                            buttonGroup = toolOptions[i];
                            for (toolName in buttonGroup.buttons) {
                                if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                                    toolButton = buttonGroup.buttons[toolName];
                                    // create checkbox
                                    toolButton.selectTool = me.templateToolOption.clone();
                                    toolButton.selectTool.find('span').append(this.loc.toolbarToolNames[toolName]);
                                    if (toolButton.selected) {
                                        toolButton.selectTool.find('input').attr('checked', 'checked');
                                    }
                                    //toggle toolbar tool. i.e. send requests
                                    toolButton.selectTool.find('input').change(_toggleToolOption(toolName, buttonGroup.name, toolButton));
                                    options.append(toolButton.selectTool);
                                }
                            }
                        }
                    }
                }
            } else {
                // toolbar (bundle) needs to be notified
                if (tool.id.indexOf("PublisherToolbarPlugin") >= 0) {
                    me.toolbarConfig = {};
                }
                if (tool._isPluginStarted) {
                    //remove buttons
                    toolOptions = tool.plugin.getToolOptions ? tool.plugin.getToolOptions() : null;
                    if (toolOptions) {
                        //remove toolbar tools
                        for (i in toolOptions) {
                            if (toolOptions.hasOwnProperty(i)) {
                                buttonGroup = toolOptions[i];
                                for (toolName in buttonGroup.buttons) {
                                    if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                                        toolButton = buttonGroup.buttons[toolName];
                                        reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                                        sandbox.request(tool.plugin, reqBuilder(toolName, buttonGroup.name, toolButton.toolbarid));
                                    }
                                }
                            }
                        }
                        //remove eventlisteners
                        var optionContainer = tool.publisherPluginContainer.find('.tool-options'),
                            toolOptionCheckboxes = optionContainer.find('input').off("change", me._toggleToolOption);
                        //remove dom elements
                        toolOptionCheckboxes.remove();
                        optionContainer.remove();
                    }

                    tool._isPluginStarted = false;
                    tool.plugin.stopPlugin(this.instance.sandbox);
                }
            }
        },
        /**
         * @method _getButtons
         * @private
         * Sends addToolbarButton requests when tools are selected to PublisherToolsPlugin
         */
        /**
         * @method _getButtons
         * @private
         * Renders publisher buttons to DOM snippet and returns it.
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = me.templateButtonsDiv.clone(),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me.instance.setPublishMode(false);
            });
            cancelBtn.insertTo(buttonCont);


            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.addClass('primary');

            if (me.data) {
                var save = function () {
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
         * @method _showReplaceConfirm
         * @private
         * Shows a confirm dialog for replacing published map
         * @param {Function} continueCallback function to call if the user confirms
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
         * @method _showValidationErrorMessage
         * @private
         * Takes an error array as defined by Oskari.userinterface.component.FormInput validate() and
         * shows the errors on a  Oskari.userinterface.component.Popup
         * @param {Object[]} errors validation error objects to show
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
         * @method _gatherSelections
         * @private
         * Gathers publisher selections and returns them as JSON object
         * @return {Object}
         */
        _gatherSelections: function () {
            var me = this,
                container = me.mainPanel,
                sandbox = me.instance.getSandbox(),
                errors = me.locationForm.validate(),
                values = me.locationForm.getValues(),
                size = container.find('input[name=size]:checked').val(),
                gridWidth = me._calculateGridWidth(),
                selections = {
                    domain: values.domain,
                    name: values.name,
                    language: values.language,
                    plugins: []
                },
                i,
                j,
                tmpTool,
                option,
                classes;

            if (me.data && me.data.id) {
                selections.id = me.data.id;
            }
            // get layout
            selections.layout = me.activeToolLayout;
            // get toolbar config
            // inactive buttons don't have to be sent
            // if there's no active buttons, don't send toolbar config at all
            if (me.toolbarConfig) {
                var hasActiveTools = false;
                for (i in me.toolbarConfig) {
                    if (me.toolbarConfig.hasOwnProperty(i)) {
                        for (j in me.toolbarConfig[i]) {
                            if (me.toolbarConfig[i].hasOwnProperty(j) && me.toolbarConfig[i][j]) {
                                hasActiveTools = true;
                                break;
                            }
                        }
                        if (hasActiveTools) {
                            break;
                        }
                    }
                }
                if (hasActiveTools) {
                    selections.toolbar = me.toolbarConfig;
                }
            }

            for (i = 0; i < me.tools.length; i += 1) {
                if (me.tools[i].selected) {
                    tmpTool = {
                        id: me.tools[i].id
                    };
                    if (me.tools[i].config) {
                        tmpTool.config = me.tools[i].config;
                        if (tmpTool.config.location) {
                            if (tmpTool.config.location.classes) {
                                classes = tmpTool.config.location.classes;
                                tmpTool.config.location = {
                                    "classes": classes
                                };
                            } else {
                                tmpTool.config.location = {};
                            }
                        }
                        // Remove unneeded stuff from conf
                        for (j = 0; j < me.toolLayouts.length; j += 1) {
                            tmpTool.config[me.toolLayouts[j]] = null;
                            delete tmpTool.config[me.toolLayouts[j]];
                        }

                    }

                    selections.plugins.push(tmpTool);
                }
            }
            if (size === 'custom') {
                var width = container.find('div.customsize input[name=width]').val(),
                    height = container.find('div.customsize input[name=height]').val();
                if (me._validateSize(width, height)) {
                    selections.size = {
                        width: width,
                        height: height
                    };
                } else {
                    errors.push({
                        field: 'size',
                        error: this.loc.error.size
                    });
                }
            } else {

                for (i = 0; i < me.sizeOptions.length; i += 1) {
                    option = me.sizeOptions[i];
                    // FIXME use ===
                    if (option.id === size) {
                        selections.size = {
                            width: option.width,
                            height: option.height
                        };
                        break;
                    }
                }
            }

            // if maplayer plugin is enabled
            var layerValues = me.maplayerPanel.getValues();
            if (layerValues.layerSelection) {
                // Add tool location classes
                layerValues.layerSelection.location = {
                    "classes": me.layerSelectionClasses.classes
                };
                selections.plugins.push(layerValues.layerSelection);
                selections.defaultBase = layerValues.defaultBase;
                selections.baseLayers = layerValues.baseLayers;
            }
            // add logoplugin
            selections.plugins.push({
                "id": "Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin",
                "config": {
                    "location": {
                        "classes": me.logoPluginClasses.classes
                    }
                }
            });
            // if data grid is enabled
            if (me.isDataVisible) {
                // get state of statsgrid
                var statsGrid = me.sandbox.getStatefulComponents().statsgrid,
                    statsGridState = me._filterIndicators(_.clone(statsGrid.state, true));

                selections.gridState = statsGridState;
            }

            var mapFullState = sandbox.getStatefulComponents().mapfull.getState();
            selections.mapstate = mapFullState;


            // saves possible open gfi popups
            if (sandbox.getStatefulComponents().infobox) {
                selections.infobox = sandbox.getStatefulComponents().infobox.getState();
            }

            if (errors.length > 0) {
                // TODO: messages
                me._showValidationErrorMessage(errors);
                return;
            }
            return selections;

        },

        /**
         * @method _publishMap
         * @private
         * Sends the gathered map data to the server to save them/publish the map.
         * @param {Object} selections map data as returned by _gatherSelections()
         */
        _publishMap: function (selections) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                url = sandbox.getAjaxUrl();
            // Total width for map and grid. Used to calculate the iframe size.
            var totalWidth = (me.isDataVisible ?
                    (selections.size.width + me._calculateGridWidth()) : selections.size.width);
            var errorHandler = function () {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = dialog.createCloseButton(me.loc.buttons.ok);
                dialog.show(me.loc.error.title, me.loc.error.saveFailed, [okBtn]);
            };

            // make the ajax call
            jQuery.ajax({
                url: url + '&action_route=Publish',
                type: 'POST',
                dataType: "json",
                data: {
                    pubdata: JSON.stringify(selections)
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (response) {
                    if (response.id > 0) {
                        var event = sandbox.getEventBuilder('Publisher.MapPublishedEvent')(response.id,
                            totalWidth, selections.size.height, selections.language);
                        sandbox.notifyAll(event);
                    } else {
                        errorHandler();
                    }
                },
                error: errorHandler
            });
        },
        /**
         * @method _validateNumberRange
         * @private
         * @param {Object} value number to validate
         * @param {Number} min min value
         * @param {Number} max max value
         * Validates number range
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
         * @method _validateSize
         * @private
         * @param {Number} width value from width field
         * @param {Number} height value from height field
         * Validates size for custom size option
         */
        _validateSize: function (width, height) {
            var custom = null,
                i,
                option;
            for (i = 0; i < this.sizeOptions.length; i += 1) {
                option = this.sizeOptions[i];
                if (option.id === 'custom') {
                    custom = option;
                    break;
                }
            }
            var isOk = this._validateNumberRange(width, custom.minWidth, custom.maxWidth) && this._validateNumberRange(height, custom.minHeight, custom.maxHeight);
            return isOk;
        },
        /**
         * @method _enablePreview
         * @private
         * Modifies the main map to show what the published map would look like
         */
        _enablePreview: function () {
            var me = this,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                plugins = mapModule.getPluginInstances(),
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

            me._setSelectedSize();

            for (i = 0; i < this.tools.length; i += 1) {
                if (this.tools[i].selected) {
                    this._activatePreviewPlugin(this.tools[i], true);
                }
            }
            mapModule.registerPlugin(this.logoPlugin);
            this.logoPlugin.startPlugin(me.instance.sandbox);
        },
        /**
         * @method _disablePreview
         * @private
         * Returns the main map from preview to normal state
         */
        _disablePreview: function () {
            var me = this,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                plugins = mapModule.getPluginInstances(),
                plugin,
                i;
            // teardown preview plugins
            for (i = 0; i < me.tools.length; i += 1) {
                if (me.tools[i].plugin) {
                    me._activatePreviewPlugin(me.tools[i], false);
                    mapModule.unregisterPlugin(me.tools[i].plugin);
                    me.tools[i].plugin = undefined;
                    delete me.tools[i].plugin;
                }
            }
            me.maplayerPanel.stop();

            me.layoutPanel.stop();

            // return map size to normal
            var mapElement = jQuery(mapModule.getMap().div);
            // remove width definition to resume size correctly
            mapElement.width('');
            mapElement.height(jQuery(window).height());

            // notify openlayers that size has changed
            mapModule.updateSize();

            // stop our logoplugin
            mapModule.unregisterPlugin(me.logoPlugin);
            me.logoPlugin.stopPlugin(me.instance.sandbox);

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
         * @method setEnabled
         * "Activates" the published map preview when enabled
         * and returns to normal mode on disable
         * @param {Boolean} isEnabled true to enable preview, false to disable
         * preview
         */
        setEnabled: function (isEnabled) {
            if (isEnabled) {
                this._enablePreview();
            } else {
                this._disablePreview();
            }
        },
        /**
         * @method destroy
         * Destroyes/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
        },
        /**
         * @method setPluginLanguage
         * Changes system language with Oskari.setLang and stops/starts plugins to make
         * them rewrite their UI with the new language.
         * @param {String} lang language code
         */
        setPluginLanguage: function (lang) {
            Oskari.setLang(lang);
            var i,
                tool;
            for (i = 0; i < this.tools.length; i += 1) {
                tool = this.tools[i];
                if (tool._isPluginStarted) {
                    // stop and start if enabled to change language
                    this._activatePreviewPlugin(tool, false);
                    this._activatePreviewPlugin(tool, true);
                }
            }
            // stop and start if enabled to change language
            this._resetLayerSelectionPlugin();

            // stop and start if enabled to change language
            this.logoPlugin.stopPlugin(this.instance.sandbox);
            this.logoPlugin.startPlugin(this.instance.sandbox);
        },
        /**
         * @method _resetLayerSelectionPlugin
         * Changes system language with Oskari.setLang and stops/starts plugins to make
         * them rewrite their UI with the new language.
         * @param {String} lang language code
         * @private
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
            var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', me);
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
                var gridPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', gridConf, locale);
                me.mapModule.registerPlugin(gridPlugin);
                me.mapModule.startPlugin(gridPlugin);
                me.gridPlugin = gridPlugin;

                // Register classification plugin to the map.
                var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', conf, locale);
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
         * Filters out user's indicators which aren't allowed to be published.
         *
         * @method _filterIndicators
         * @param  {Object} statsGridState
         * @return {Object} filtered state
         */
        _filterIndicators: function (statsGridState) {
            statsGridState.indicators = _.filter(statsGridState.indicators, function (indicator) {
                return (
                    // sotka indicators
                    (!indicator.ownIndicator) ||
                    // own indicators
                    (indicator.ownIndicator && indicator['public'])
                );
            });
            return statsGridState;
        },

        /**
         * Changes the style of each tool, if the tool's plugin supports it.
         *
         * @method changeToolStyles
         * @param {Object} style
         */
        changeToolStyles: function (style) {
            if (!style) {
                return;
            }

            var styleConfig,
                i,
                tool,
                me = this;

            // Set the toolStyle to the config of each tool
            // and change the style immedately. 
            for (i = 0; i < this.tools.length; i += 1) {
                tool = this.tools[i];
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
                if (tool._isPluginStarted && tool.plugin.changeToolStyle) {
                    tool.plugin.changeToolStyle(styleConfig);
                }
                // tools in toolbar plugin needs to be configured
                if (tool.id.indexOf('PublisherToolbarPlugin') >= 0) {
                    if (me.toolbarConfig && me.toolbarConfig.classes) {
                        me.toolbarConfig.classes = tool.plugin.getToolConfs();
                    }
                }
            }

            // Change the style of the layer selection plugin
            this._setLayerSelectionStyle(style.val);
        },

        /**
         * @method _setLayerSelectionStyle
         */
        _setLayerSelectionStyle: function (styleName) {
            var mlp = this.maplayerPanel;
            mlp.pluginConfig.toolStyle = styleName;
            if (mlp.isEnabled() && mlp.plugin.changeToolStyle) {
                mlp.plugin.changeToolStyle(styleName);
            }
        },

        /**
         * Changes the colour scheme of the getinfo plugin and layer selection plugin.
         *
         * @method changeColourScheme
         * @param {Object} colourScheme
         */
        changeColourScheme: function (colourScheme) {
            var infoPlugin = this._getGetInfoPlugin(),
                mlp = this.maplayerPanel;
            if (infoPlugin) {
                infoPlugin.config = infoPlugin.config || {};
                infoPlugin.config.colourScheme = colourScheme;
            }

            mlp.pluginConfig.colourScheme = colourScheme;
            if (mlp.isEnabled() && mlp.plugin.changeColourScheme) {
                mlp.plugin.changeColourScheme(colourScheme);
            }
        },

        /**
         * Changes the font of each tool (has to be done separately for each one)
         * if the plugin supports it.
         *
         * @method changeFont
         * @param {String} font the id of the font
         */
        changeFont: function (font) {
            if (!font) {
                return;
            }
            var i,
                tool;

            // Set the font to the config of each tool
            // and change the font immedately. 
            for (i = 0; i < this.tools.length; i += 1) {
                tool = this.tools[i];
                if (tool.config) {
                    tool.config.font = font;
                }
                if (tool._isPluginStarted && tool.plugin.changeFont) {
                    tool.plugin.changeFont(font);
                }
            }

            // Change the font of the layer selection plugin
            this._setLayerSelectionFont(font);

            // Change the font of the logo plugin
            if (this.logoPlugin && this.logoPlugin.changeFont) {
                this.logoPlugin.changeFont(font);
            }

            // Change the font of the info plugin
            var infoPlugin = this._getGetInfoPlugin();
            if (infoPlugin) {
                infoPlugin.config = infoPlugin.config || {};
                infoPlugin.config.font = font;
            }
        },

        /**
         * @method _setLayerSelectionStyle
         */
        _setLayerSelectionFont: function (font) {
            var mlp = this.maplayerPanel;
            mlp.pluginConfig.font = font;
            if (mlp.isEnabled() && mlp.plugin.changeFont) {
                mlp.plugin.changeFont(font);
            }
        },

        /**
         * @method _getGetInfoPlugin
         */
        _getGetInfoPlugin: function () {
            var infoPlugin = null,
                i,
                tool;

            for (i = 0; i < this.tools.length; i += 1) {
                tool = this.tools[i];
                if (tool.id === 'Oskari.mapframework.mapmodule.GetInfoPlugin') {
                    infoPlugin = tool;
                    break;
                }
            }

            return infoPlugin;
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
         * @method _getInitialLayoutData
         * @param  {Object} data
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

                if (plugin.config) {
                    if (plugin.config.font) {
                        layoutConf.font = plugin.config.font;
                    }

                    if (plugin.config.colourScheme) {
                        layoutConf.colourScheme = plugin.config.colourScheme;
                    }

                    if (plugin.config.toolStyle) {
                        if (typeof plugin.config.toolStyle === 'string') {
                            layoutConf.toolStyle = plugin.config.toolStyle;
                        } else {
                            layoutConf.toolStyle = plugin.config.toolStyle.val;
                        }
                    }
                }
            }

            return layoutConf;
        },
        /**
         * @method _getActivePlugins Returns all active plugins in the whitelist
         * @param  {Array} whitelist Array of plugin classes to examine
         * @return {Array}           Array of plugin classes
         */
        _getActivePlugins: function (whitelist) {
            var ret = [],
                i;
            for (i = 0; i < this.tools.length; i++) {
                if (this.tools[i].plugin && this.tools[i].plugin.selected && jQuery.inArray(this.tools[i].plugin.id, whitelist)) {
                    ret.push(this.tools[i].id);
                }
            }
            return ret;
        },

        /**
         * @method _getDraggedPlugins Returns all plugins that should be included in the drag
         * @param  {String} plugin    Plugin class
         * @return {Array}            Array of plugin classes
         */
        _getDraggedPlugins: function (plugin) {
            var ret;
            if (this.toolDropRules[plugin].groupedSiblings) {
                ret = this._getActivePlugins(this.toolDropRules[plugin].allowedSiblings);
                ret.push(plugin);
            } else {
                ret = [plugin];
            }
            return ret;
        },

        /**
         * @method _getDropzonePlugins Returns all active plugins in given dropzone
         * @param  {Object} dropzone   jQuery object of the dropzone
         * @return {Array}             Array of plugin classes
         */
        _getDropzonePlugins: function (dropzone) {
            var ret = [],
                i;
            for (i = 0; i < this.tools.length; i++) {
                if (this._toolInDropZone(this.tools[i], dropzone)) {
                    ret.push(this.tools[i].id);
                }
            }
            // There's no such structure for LogoPlugin so we have to build it...
            var tmpTool = {
                "config": {
                    "location": {
                        "classes": this.logoPluginClasses.classes
                    }
                },
                "plugin": this.logoPlugin
            };
            // LogoPlugin
            if (this._toolInDropZone(tmpTool, dropzone)) {
                ret.push("Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin");
            }
            // LayerSelectionPlugin
            tmpTool.config.location.classes = this.layerSelectionClasses.classes;
            tmpTool.plugin = this.maplayerPanel.plugin;
            if (this._toolInDropZone(tmpTool, dropzone)) {
                ret.push("Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin");
            }
            return ret;
        },

        /**
         * @method _toolInDropZone    Determines if the tool is active and in the dropzone
         * @param  {Object}  tool     Tool instance, containing plugin and config
         * @param  {Object}  dropzone jQuery object of the dropzone
         * @return {Boolean}          True if tool is active and in the dropzone
         */
        _toolInDropZone: function (tool, dropzone) {
            var ret = false;
            // TODO check that selected tells us if the plugin is active...
            if (tool && tool.plugin && tool.plugin.selected) {
                //    check if in this dropzone (nasty class check)
                ret = dropzone.is("." + tool.config.location.classes.split(' ').join("."));
            }
            return ret;
        },

        /**
         * @method _locationAllowed           Is the dropzone in the plugin's allowed locations
         * @param  {Array}   allowedLocations Array of allowed locations for the plugin
         * @param  {Object}  dropzone         jQuery object of the dropzone
         * @return {Boolean}                  True if dropzone is allowed for plugin
         */
        _locationAllowed: function (allowedLocations, dropzone) {
            var isAllowedLocation,
                i,
                j;
            for (i = 0; i < allowedLocations.length; i++) {
                isAllowedLocation = dropzone.is("." + allowedLocations[i].split(' ').join("."));
                if (isAllowedLocation) {
                    break;
                }
            }
            return isAllowedLocation;
        },

        /**
         * @method _showDroppable  Shows dropzones where the given plugin can be dropped in green
         * @param  {String} plugin Plugin class
         */
        _showDroppable: function (plugin) {
            var me = this,
                allowedLocation,
                dropzone,
                siblings,
                i;
            jQuery('div.mapplugins').each(function () {
                dropzone = jQuery(this);
                allowedLocation = me._locationAllowed(me.toolDropRules[plugin].allowedLocations, dropzone);
                if (allowedLocation) {
                    // check if siblings are allowed
                    siblings = me._getDropzonePlugins(dropzone);
                    for (i = 0; i < siblings.length; i++) {
                        allowedLocation = jQuery.inArray(siblings[i], me.toolDropRules[plugin].allowedSiblings) > -1;
                        if (!allowedLocation) {
                            break;
                        }
                    }
                    // TODO apply class to actual dropzone element instead of the container root
                    if (allowedLocation) {
                        // TODO these should be removed at some stage...
                        // paint it green, plugin can be dropped here
                        dropzone.addClass("allowed");
                    } else {
                        // paint it red, plugins already in the dropzone aren't allowed siblings for this plugin
                        // we could also try to move them somewhere?
                        dropzone.addClass("disallowed");
                    }
                } else {
                    // paint it red, this isn't an allowed dropzone for the plugin
                    dropzone.addClass("disallowed");
                }
            });
        }
    });