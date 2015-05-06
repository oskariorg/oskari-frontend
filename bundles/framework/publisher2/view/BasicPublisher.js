/**
 * @class Oskari.mapframework.bundle.publisher2.view.BasicPublisher
 * Renders the publishers "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.BasicPublisher',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.publisher2.PublisherBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     *
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
                    'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
                    'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin': {
                // FIXME this should be moved to the left in righthanded layout
                allowedLocations: ['bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                    'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin': {
                allowedLocations: ['bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
                    'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin': {
                // Disabled for now, need to fix config reading first allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedLocations: ['top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
                    'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin': {
                allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
                    'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
                ],
                groupedSiblings: true
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin':
{               allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                    'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
                ],
                groupedSiblings: false
            },

            'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin': {
                allowedLocations: ['top left', 'top center', 'top right'],
                allowedSiblings: [
                    'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
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
                initWidth = me.data.state.mapfull.config.size.width;
                initHeight = me.data.state.mapfull.config.size.height;
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

        //dig up the config from the instance used by the full map if it is present
        var logoPluginConfig = {};
        var mainMapLogoPlugin = me.instance.getSandbox().findRegisteredModuleInstance("MainMapModuleLogoPlugin");
        if(mainMapLogoPlugin) {
            logoPluginConfig = _.cloneDeep(mainMapLogoPlugin.getConfig());
        }
        // override location
        logoPluginConfig.location = {
            classes: me.logoPluginClasses.classes
        };
        me.logoPlugin = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
            logoPluginConfig
        );
        me.latestGFI = null;
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            debugger;
            var me = this,
                content = me.template.clone();

            me.mainPanel = content;

            container.append(content);
            var contentDiv = content.find('div.content'),
                accordion = Oskari.clazz.create(
                    'Oskari.userinterface.component.Accordion'
                );
            me.accordion = accordion;

            var form = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher2.view.PublisherLocationForm',
                me.loc,
                me
            );
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

            // TODO we need to have a serious discussion with this one whenever layout is changed or
            // copy location from config...
            if (me.data && me.data.hasLayerSelectionPlugin && me.data.hasLayerSelectionPlugin.location) {
                me.layerSelectionClasses.classes = me.data.hasLayerSelectionPlugin.location.classes;
            }

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
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            cancelBtn.setHandler(function () {
                me._editToolLayoutOff();
                me.instance.setPublishMode(false);
            });
            cancelBtn.insertTo(buttonCont);

            var saveBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );

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

                var replaceBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );
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
        }
    });
