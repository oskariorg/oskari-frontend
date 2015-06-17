/**
 * @class Oskari.mapframework.bundle.publisher2.view.PublisherSidebar
 * Renders the publishers "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',

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
        me.panels = [];
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


        // TODO see if this and layerselection could be moved to tools...
        // just ignore them on ui creation or smthn
        me.logoPluginClasses = {
            lefthanded: 'bottom left',
            righthanded: 'bottom right',
            classes: 'bottom left'
        };

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
            var me = this,
                content = me.template.clone();

            me.mainPanel = content;

            container.append(content);
            var contentDiv = content.find('div.content'),
                accordion = Oskari.clazz.create(
                    'Oskari.userinterface.component.Accordion'
                );
            me.accordion = accordion;

            // setup title based on new/edit
            var sidebarTitle = content.find('div.header h3');
            if (me.data) {
                sidebarTitle.append(me.loc.titleEdit);
            } else {
                sidebarTitle.append(me.loc.title);
            }
            // bind close from header (X)
            container.find('div.header div.icon-close').bind(
                'click',
                function () {
                    me.instance.setPublishMode(false);
                }
            );

            // -- create panels --
            var genericInfoPanel = me._createGeneralInfoPanel();
            me.panels.push(genericInfoPanel);
            accordion.addPanel(genericInfoPanel.getPanel());

            var mapSizePanel = me._createMapSizePanel();
            me.panels.push(mapSizePanel);
            accordion.addPanel(mapSizePanel.getPanel());

            var toolPanels = me._createToolPanels(accordion);
            _.each(toolPanels, function(panel) {
                me.panels.push(panel);
                accordion.addPanel(panel.getPanel());
            });

            // -- render to UI and setup buttons --
            accordion.insertTo(contentDiv);
            contentDiv.append(me._getButtons());

            // disable keyboard map moving whenever a text-input is focused element
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
        * Initialize panels.
        * @method @public initPanels
        */
        initPanels: function(){
            var me = this;
            _.each(me.panels, function(panel) {
               if(panel.init) {
                    panel.init();
                }
            });
        },

        /**
        * Handles panels update map size changes
        * @method @private _handleMapSizeChange
        */
        _handleMapSizeChange: function(){
            var me = this;
            _.each(me.panels, function(panel) {
                if(typeof panel.updateMapSize === 'function') {
                    panel.updateMapSize();
                }
            });
        },
        /**
         * @private @method _createGeneralInfoPanel
         * Creates the Location panel of publisher
         */
        _createGeneralInfoPanel: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var form = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher2.view.PanelGeneralInfo',
                sandbox, me.loc
            );

            // initialize form (restore data when editing)
            form.init(me.data, function(value) {
                me.setPluginLanguage(value);
            });

            // open generic info by default
            form.getPanel().open();
            return form;
        },

        /**
         * @private @method _createMapSizePanel
         * Creates the Map Sizes panel of publisher
         */
        _createMapSizePanel: function () {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance("MainMapModule"),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapSize',
                    sandbox, mapModule, me.loc, me.instance
                );

            // initialize form (restore data when editing)
            form.init(me.data, function(value) {
                me.setMode(value);
            });

            return form;
        },

        /**
         * @method setMode
         * @param {String} mode the mode
         */
        setMode: function (mode) {
            var me = this;
            jQuery.each(me.panels, function(index, panel){
                if(typeof panel.setMode === 'function') {
                    panel.setMode(mode);
                }
            });
        },

        setPluginLanguage : function() {
            alert('TODO');
        },

        /**
        * Get panel/tool handlers
        * @method getHandlers
        * @public
        */
        getHandlers : function(){
            var me = this;
            return {
                'MapSizeChanged': function(){
                    me._handleMapSizeChange();
                }
            };
        },


        /**
         * @private @method _createToolPanels
         * Finds classes annotated as 'Oskari.mapframework.publisher.Tool'.
         * Determines tool groups from tools and creates tool panels for each group.
         *
         * @return {Oskari.mapframework.bundle.publisher2.view.PanelMapTools[]} list of panels
         */
        _createToolPanels: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var mapmodule = sandbox.findRegisteredModuleInstance("MainMapModule");
            var definedTools = Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool');
            var grouping = {};
            // group tools per tool-group
            _.each(definedTools, function(ignored, toolname) {
                // TODO: document localization requirements!
                var tool = Oskari.clazz.create(toolname, sandbox, mapmodule, me.loc, me.instance, me.getHandlers());
                if(tool.isDisplayed() === true) {
                    var group = tool.getGroup();
                    if(!grouping[group]) {
                        grouping[group] = [];
                    }
                    grouping[group].push(tool);
                }
            });
            // create panel for each tool group
            var panels = [];
            _.each(grouping, function(tools, group) {
                // TODO: document localization requirements!
                var panel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapTools',
                    group, tools, sandbox, me.loc, me.instance
                );
                panel.init(me.data);
                panels.push(panel);
            });
            return panels;
        },

        _gatherSelections: function(){
            var me = this,
                selections = [];
            jQuery.each(me.panels, function(index, panel){
                selections.push(panel.getValues());
            });

            //console.log(selections);

            throw 'Not implemented yet!';
        },

        /**
         * @private @method _editToolLayoutOff
         *
         *
         */
        _editToolLayoutOff: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            if (!me.toolLayoutEditMode) {
                return;
            }

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
        _publishMap : function(selections) {
            alert('TODO publish:\n' + JSON.stringify(selections));
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
                );

            _.each(mapModule.getPluginInstances(), function(plugin) {
                if (plugin.hasUI && plugin.hasUI()) {
                    plugin.stopPlugin(me.instance.sandbox);
                    mapModule.unregisterPlugin(plugin);
                    me.normalMapPlugins.push(plugin);
                }
            });

            mapModule.registerPlugin(me.logoPlugin);
            this.logoPlugin.startPlugin(me.instance.sandbox);
        },

        /**
         * @private @method _disablePreview
         * Returns the main map from preview to normal state
         *
         */
        _disablePreview: function () {
            var me = this,
                mapElement,
                mapModule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule'),
                plugin,
                i;

            // return map size to normal
            mapElement = jQuery(mapModule.getMap().div);
            // remove width definition to resume size correctly
            mapElement.width('');
            mapElement.height(jQuery(window).height());

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
        }
    });
