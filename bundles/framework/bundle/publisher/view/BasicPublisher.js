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
            publishedGridTemplate: '<div class="publishedgrid"></div>'
        };

        me.templateButtonsDiv = jQuery('<div class="buttons"></div>');
        me.templateHelp = jQuery('<div class="help icon-info"></div>');
        me.templateLayout = jQuery('<div class="tool "><label><input type="radio" name="toolLayout" /><span></span></label></div>');
        me.templateData = jQuery('<div class="data ">' +
            '<input class="show-grid" type="checkbox"/>' +
            '<label class="show-grid-label"></label>' + '<br />' +
            '<input class="allow-classification" type="checkbox"/>' +
            '<label class="allow-classification-label"></label>' +
            '</div>');
        me.templateSizeOptionTool = jQuery('<div class="tool ">' + '<label><input type="radio" name="size" />' + '<span></span></label></div>');
        me.templateCustomSize = jQuery('<div class="customsize">' + '<input type="text" name="width" ' +
            'placeholder="' + localization.sizes.width + '"/> x ' +
            '<input type="text" name="height" placeholder="' + localization.sizes.height + '"/></div>');

        me.normalMapPlugins = [];

        me.toolDropRules = {
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin'],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin': {
                // Disabled for now, need to fix config reading first allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedLocations: ['top right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.PanButtons', 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: ['Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: ['Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons'],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin'],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin', 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'],
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

        // FIXME why don't these sizes match with the ones shown in the labels?
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
        }, /*{
            id: 'fill',
            width: '100%',
            height: '100%'
        },*/
        {
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
                initWidth = me.data.state.mapfull.config.size.width,
                initHeight = me.data.state.mapfull.config.size.height,
                option,
                i;

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
                layer;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === 'stats') {
                    showStats = true;
                }
            }
            if (showStats) {
                me.showStats = true;
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
            // copy location from config...
            if (me.data && me.data.hasLayerSelectionPlugin && me.data.hasLayerSelectionPlugin.location) {
                me.layerSelectionClasses.classes = me.data.hasLayerSelectionPlugin.location.classes;
            }

            me.maplayerPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm', me.loc, me.instance, {
                location: {
                    classes: me.layerSelectionClasses.classes
                }
            }, me);
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
                widthInput = me.mainPanel.find('div.customsize input[name=width]'),
                heightInput = me.mainPanel.find('div.customsize input[name=height]'),
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
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
                    if (option.id === 'custom') {
                        var width = widthInput.val();
                        if (me._validateNumberRange(width, option.minWidth, option.maxWidth)) {
                            mapElement.width(width);
                            me.adjustDataContainer();
                        } else {
                            widthInput.addClass('error');
                        }
                        var height = heightInput.val();
                        if (me._validateNumberRange(height, option.minHeight, option.maxHeight)) {
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

                    // Hackhack to get the map to do a horizontal fill...
                    if (option.id === 'fill') {
                        me._mapHorizontalFill();
                    } else {
                        //jQuery('.oskariui-center').width('');
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
            panel.setTitle(me.loc.size.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me.templateHelp.clone(); // tooltip
            tooltipCont.attr('title', me.loc.size.tooltip);
            contentPanel.append(tooltipCont);
            // content
            var closureMagic = function (tool) {
                return function () {
                    var i;
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
            for (i = 0; i < me.sizeOptions.length; i += 1) {
                option = me.sizeOptions[i];
                toolContainer = me.templateSizeOptionTool.clone();
                label = me.loc.sizes[option.id];
                if (option.width && option.height && 'custom' !== option.id && 'fill' !== option.id) {
                    label = me._getSizeLabel(label, option);
                }
                toolContainer.find('span').addClass('sizeoption_' + option.id).append(label);
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                    if ('custom' === option.id) {
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
                if (option.width && option.height && 'custom' !== option.id && 'fill' !== option.id) {
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
                enabledPlugins = null;
            // setup initial plugins if available (move this... somewhere)
            if (me.data && me.data.state && me.data.state.mapfull && me.data.state.mapfull.config && me.data.state.mapfull.config.plugins) {
                var i,
                    plugins = me.data.state.mapfull.config.plugins;

                enabledPlugins = {};
                // set enabled plugins
                for (i = 0; i < plugins.length; i += 1) {
                    enabledPlugins[plugins[i].id] = true;
                    if (plugins[i].id === 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin') {
                        me.data.hasLayerSelectionPlugin = plugins[i].config;
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
         * @method _changeToolLayout
         * @private
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
         * @method _createToolLayoutPanel
         * @private
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
                        if (jQuery(editBtn.getButton()).val() === me.loc.toollayout.usereditmodeoff) {
                            // remove edit mode
                            me._editToolLayoutOff();
                        } else {
                            me._editToolLayoutOn();
                        }
                    });
                    editBtn.setEnabled(me.activeToolLayout === 'userlayout');
                    editBtn.getButton().attr('id', 'editModeBtn');
                    editBtn.insertTo(layoutContainer);
                }
            }

            return panel;
        },

        /**
         * @method _makeDraggable
         * @private
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
         * @method _togglePluginUIControls
         * @private
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
         * @method _editToolLayoutOn
         * @private
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
                        me._moveSiblings(pluginClazz, source, target) ;
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
         * @method _editToolLayoutOff
         * @private
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
                me.logoPluginClasses.classes = me.logoPlugin.element.parents('.mapplugins').attr('data-location');
                me.logoPlugin.element.css('position', '');
                //me.logoPlugin.setLocation(me.logoPluginClasses.classes);
            }
            if (me.maplayerPanel.plugin && me.maplayerPanel.plugin.element) {
                me.layerSelectionClasses.classes = me.maplayerPanel.plugin.element.parents('.mapplugins').attr('data-location');
                //me.maplayerPanel.plugin.setLocation(me.layerSelectionClasses.classes);
                me.maplayerPanel.plugin.element.css('position', '');
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
         * @method _createDataPanel
         * @private
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
            dataContainer.find('input.show-grid').attr('id', 'show-grid-checkbox').change(function (e) {
                var checkbox = jQuery(e.target),
                    isChecked = checkbox.is(':checked');
                me.isDataVisible = isChecked;
                me.adjustDataContainer();
                // Update the size labels
                me._setSizeLabels();
            });
            dataContainer.find('label.show-grid-label').attr('for', 'show-grid-checkbox').append(me.loc.data.grid);

            dataContainer.find('input.allow-classification').attr('id', 'allow-classification-checkbox').change(function (e) {
                var checkbox = jQuery(e.target),
                    isChecked = checkbox.is(':checked');
                me.classifyPlugin.showClassificationOptions(isChecked);
            });
            dataContainer.find('label.allow-classification-label').attr('for', 'allow-classification-checkbox').append(me.loc.data.allowClassification);

            if (me.grid.selected) {
                dataContainer.find('input#show-grid-checkbox').attr('checked', 'checked');
                me.isDataVisible = me.grid.selected;
                me.adjustDataContainer();
            }
            contentPanel.append(dataContainer);

            return panel;
        },

        /**
         * @method _mapHorizontalFill
         * Used to make the map element fill all available horizontal space
         */
        _mapHorizontalFill: function () {
            // FIXME this shouldn't be needed once we get the mode handling in place
            var content = jQuery('#contentMap'),
                contentWidth = content.width() + parseInt(content.css('margin-left').split('px')[0], 10),
                publisherWidth = jQuery('div.basic_publisher').width();

            jQuery('.oskariui-center').width(contentWidth - publisherWidth + 'px');
        },

        /**
         * @method adjustDataContainer
         */
        adjustDataContainer: function () {
            if (!this.statsContainer) {
                return;
            }
            var me = this,
                content = jQuery('#contentMap'),
                contentWidth = content.width(),
                marginWidth = content.css('margin-left').split('px')[0],
                mapDiv = me.mapModule.getMapEl(),
                mapWidth = mapDiv.width(),
                mapHeight = mapDiv.height();

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

            if (me.statsContainer) {
                me.statsContainer.height(mapHeight);
            }

            if (me.gridPlugin) {
                me.gridPlugin.setGridHeight();
            }
        },

        /**
         * @method _calculateGridWidth
         * @private
         */
        _calculateGridWidth: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                columns,
                width,
                statsGrid = sandbox.getStatefulComponents().statsgrid; // get state of statsgrid
            if (statsGrid &&
                    statsGrid.state &&
                    statsGrid.state.indicators !== null && statsGrid.state.indicators !== undefined) {

                //indicators + municipality (name & code)
                columns = statsGrid.state.indicators.length + 2;
                //slickgrid column width is 80 by default
                width = columns * 80;
            } else {
                width = 160;
            }
            // Width + scroll bar width.
            return (width + 20);
        },

        /**
         * @method getDataContainer
         * @return {jQuery} Data container
         */
        getDataContainer: function () {
            return jQuery('.oskariui-left');
        },

        /**
         * @method addDataGrid
         * @param {} grid
         */
        addDataGrid: function (grid) {
            this.getDataContainer.html(grid);
        },

        /**
         * @method handleMapMoved
         * Does nothing currently.
         */
        handleMapMoved: function () {
            /*var mapVO = this.instance.sandbox.getMap(),
                lon = mapVO.getX(),
                lat = mapVO.getY(),
                zoom = mapVO.getZoom();*/
            //this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
        },

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
                    classes: me.layerSelectionClasses.classes
                };
                selections.plugins.push(layerValues.layerSelection);
                selections.defaultBase = layerValues.defaultBase;
                selections.baseLayers = layerValues.baseLayers;
            }
            // add logoplugin
            var logoPlugin = {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                config: {
                    location: {
                        classes: me.logoPluginClasses.classes
                    }
                }
            };
            // setup logoplugin font
            var layoutOptions = me.layoutPanel.getValues();
            logoPlugin.config.font = layoutOptions.font;
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
            // Use original width if there's no data visible or if the original width is not a number.
            var totalWidth = (me.isDataVisible && !isNaN(selections.size.width) ? (selections.size.width + me._calculateGridWidth()) : selections.size.width),
                errorHandler = function () {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = dialog.createCloseButton(me.loc.buttons.ok);
                    dialog.show(me.loc.error.title, me.loc.error.saveFailed, [okBtn]);
                };

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
         * @method _enablePreview
         * @private
         * Modifies the main map to show what the published map would look like
         */
        _enablePreview: function () {
            var me = this,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
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

            me._setSelectedSize();

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
         * @method _disablePreview
         * @private
         * Returns the main map from preview to normal state
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

        /**
         * @method initGrid
         * @param {String} layer Layer id
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
                gridConf.state.allowClassification = false;

                var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', gridConf, locale);
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
         * @private
         * @param  {Object} statsGridState
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
         * Changes the style of each tool, if the tool's plugin supports it.
         *
         * @method changeToolStyles
         * @param {Object} style
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
         * @method _setLayerSelectionStyle
         * @private
         * @param {String} styleName Name of the style
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
                infoPlugin.config = infoPlugin.config || {};
                infoPlugin.config.font = font;
            }
        },

        /**
         * @method _setLayerSelectionStyle
         * @private
         * @param {String} font the id of the font
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
         * @private
         * @return Infoplugin instance
         */
        _getGetInfoPlugin: function () {
            return this.toolsPanel.getToolById('Oskari.mapframework.mapmodule.GetInfoPlugin');
        },
        /**
         * @method _getPreferredPluginLocation
         * @private
         * @param {Object} plugin
         * @param {String} defaultLocation
         * @return {String} Default location
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
         * @method _getInitialPluginLocation
         * @private
         * @param {} data
         * @param {String} pluginName
         * @return Initial plugin location
         */
        _getInitialPluginLocation: function (data, pluginName) {
            var plugins = this.data.state.mapfull.config.plugins,
                plugin,
                i;

            for (i = 0; i < plugins.length; i += 1) {
                plugin = plugins[i];
                if (plugin.id === pluginName && plugin.config && plugin.config.location) {
                    return plugin.config.location.classes;
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
         * @method _getInitialLayoutData
         * @private
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
         * @method _getPluginByClazz Returns plugin object of given plugin class
         * @private
         * @param  {String} pluginClazz      Plugin class
         * @return {Object}                  Plugin object of given plugin class, null if not found
         */
        _getPluginByClazz: function (pluginClazz) {
            var me = this,
                tool,
                plugin = null;

            tool = me.toolsPanel.getToolById(pluginClazz);
            if (tool &&  tool.plugin) {
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
         * @method _getActivePlugins Returns all active plugins in the whitelist
         * @private
         * @param  {Array} whitelist Array of plugin classes to examine
         * @return {Array}           Array of plugin classes
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
         * @method _getDraggedPlugins   Returns all plugins that should be included in the drag, including original dragged plugin
         * @private
         * @param  {String} pluginClazz Plugin class
         * @return {Array}              Array of plugin classes
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
         * @method _getDropzonePlugins Returns all active plugins in given dropzone
         * @private
         * @param  {Object} dropzone   jQuery object of the dropzone
         * @return {Array}             Array of plugin classes
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
         * @method _locationAllowed           Is the dropzone in the plugin's allowed locations
         * @private
         * @param  {Array}   allowedLocations Array of allowed locations for the plugin
         * @param  {Object}  dropzone         jQuery object of the dropzone
         * @return {String}                   Allowed location string if allowed, null if not.
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
         * @method _moveSiblings        Moves unallowed siblings to source so plugin can be moved to target
         * @private
         * @param  {String} pluginClazz Plugin clazz
         * @param  {Object} source      jQuery object for source dropzone (optional)
         * @param  {Object} target      jQuery object for target dropzone
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
         * @method _siblingsAllowed         Checks if plugins in dropzone are allowed siblings for given plugin
         * @private
         * @param  {String} pluginClazz     Plugin clazz
         * @param  {Object} source          jQuery object for source dropzone (optional)
         * @param  {Object} target          jQuery object for target dropzone
         * @param  {String} excludedSibling Plugin clazz for plugin that should be ignored in sibling check (optional)
         * @return {Number}                 0 = no, 1 = siblings can be moved out of the way, 2 = yes
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
                        if ( source && me._locationAllowed(this.toolDropRules[siblings[i]].allowedLocations, source) && me._siblingsAllowed(siblings[i], null, source, pluginClazz) === 2) {
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
         * @param  {String} pluginClazz Plugin class
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
         * @method _hideDroppable
         * @private
         * Hides dropzones
         */
        _hideDroppable: function () {
            jQuery('div.mapplugins .mappluginsContent').removeClass('allowed').removeClass('disallowed');
        }
    });