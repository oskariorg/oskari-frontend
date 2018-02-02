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
        me.templateData = jQuery(
            '<div class="data ">' +
            '  <input class="show-grid" type="checkbox"/>' +
            '  <label class="show-grid-label"></label>' + '<br />' +
            '  <input class="allow-classification" type="checkbox"/>' +
            '  <label class="allow-classification-label"></label>' +
            '</div>');

        me.normalMapPlugins = [];
        //additional bundles (=not map plugins) that were stopped when entering publisher
        me.stoppedBundles = [];

        me.loc = localization;
        me.accordion = null;

        me.maplayerPanel = null;
        me.mainPanel = null;

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

            if (me.data.uuid) {
                sidebarTitle.append(me.loc.titleEdit);
            } else {
                sidebarTitle.append(me.loc.title);
            }
            // bind close from header (X)
            container.find('div.header div.icon-close').bind(
                'click',
                function () {
                    me.cancel();
                }
            );

            // -- create panels --
            var genericInfoPanel = me._createGeneralInfoPanel();
            me.panels.push(genericInfoPanel);
            accordion.addPanel(genericInfoPanel.getPanel());

            var publisherTools = me._createToolGroupings(accordion);

            var mapPreviewPanel = me._createMapPreviewPanel(publisherTools.tools);
            me.panels.push(mapPreviewPanel);
            accordion.addPanel(mapPreviewPanel.getPanel());

            var mapLayersPanel = me._createMapLayersPanel();
            me.panels.push(mapLayersPanel);
            accordion.addPanel(mapLayersPanel.getPanel());

            var sandbox = this.instance.getSandbox();
            // create panel for each tool group
            _.each(publisherTools.groups, function(tools, group) {
                var panel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapTools',
                    group, tools, sandbox, me.loc, me.instance
                );
                panel.init(me.data);
                me.panels.push(panel);
                accordion.addPanel(panel.getPanel());
            });

            var toolLayoutPanel = me._createToolLayoutPanel(publisherTools.tools);
            me.panels.push(toolLayoutPanel);
            accordion.addPanel(toolLayoutPanel.getPanel());

            var layoutPanel = me._createLayoutPanel();
            me.panels.push(layoutPanel);
            accordion.addPanel(layoutPanel.getPanel());

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
                    panel.init(me.data);
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
            form.init(me.data);

            // open generic info by default
            form.getPanel().open();
            return form;
        },

        /**
         * @private @method _createMapSizePanel
         * Creates the Map Sizes panel of publisher
         */
        _createMapPreviewPanel: function (publisherTools) {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance("MainMapModule"),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapPreview',
                    sandbox, mapModule, me.loc, me.instance, publisherTools
                );

            // initialize form (restore data when editing)
            form.init(me.data, function(value) {});

            return form;
        },

        /**
         * @private @method _createMapLayersPanel
         * Creates the Maplayers panel of publisher
         */
        _createMapLayersPanel: function () {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance("MainMapModule");
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapLayers',
                    sandbox, mapModule, me.loc, me.instance
                );


            // initialize form (restore data when editing)
            form.init(me.data, function(value) {});

            return form;
        },
        /**
         * @private @method _createToolLayoutPanel
         * Creates the tool layout panel of publisher
         * @param {Oskari.mapframework.publisher.tool.Tool[]} tools
         */
        _createToolLayoutPanel: function (tools) {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance("MainMapModule"),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelToolLayout',
                    tools, sandbox, mapModule, me.loc, me.instance
                );

            // initialize form (restore data when editing)
            form.init(me.data, function(value) {});

            return form;
        },
        /**
         * @private @method _createLayoutPanel
         * Creates the layout panel of publisher
         */
        _createLayoutPanel: function () {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance("MainMapModule"),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelLayout',
                    sandbox, mapModule, me.loc, me.instance
                );


            // initialize form (restore data when editing)
            form.init(me.data, function(value) {});

            return form;
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
         * @private @method _createToolGroupings
         * Finds classes annotated as 'Oskari.mapframework.publisher.Tool'.
         * Determines tool groups from tools and creates tool panels for each group. Returns an object containing a list of panels and their tools as well as a list of
         * all tools, even those that aren't displayed in the tools' panels.
         *
         * @return {Object} Containing {Oskari.mapframework.bundle.publisher2.view.PanelMapTools[]} list of panels
         * and {Oskari.mapframework.publisher.tool.Tool[]} tools not displayed in panel
         */
        _createToolGroupings: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var mapmodule = sandbox.findRegisteredModuleInstance("MainMapModule");
            var definedTools = Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool');
            var grouping = {};
            var allTools = [];
            // group tools per tool-group
            _.each(definedTools, function(ignored, toolname) {
                var tool = Oskari.clazz.create(toolname, sandbox, mapmodule, me.loc, me.instance, me.getHandlers());
                if(tool.isDisplayed(me.data) === true && tool.isShownInToolsPanel()) {
                    var group = tool.getGroup();
                    if(!grouping[group]) {
                        grouping[group] = [];
                    }
                    me._addToolConfig(tool);
                    grouping[group].push(tool);
                }

                if (tool.isDisplayed(me.data) === true) {
                    allTools.push(tool);
                }
            });
            return {
                groups : grouping,
                tools: allTools
            };
        },
        _addToolConfig: function(tool) {
            var conf = this.instance.conf || {};
            if (!conf.toolsConfig || !tool.bundleName) {
                return;
            }
            tool.toolConfig = conf.toolsConfig[tool.bundleName];
        },
        /**
        * Gather selections.
        * @method gatherSelections
        * @private
        */
        gatherSelections: function(){
            var me = this,
                sandbox = this.instance.getSandbox(),
                selections = {
                    configuration: {

                    }
                },
                errors = [];

            var mapFullState = sandbox.getStatefulComponents().mapfull.getState();
            selections.configuration.mapfull = {
                state: mapFullState
            };

            jQuery.each(me.panels, function(index, panel){
                if (panel.validate && typeof panel.validate === 'function') {
                    errors = errors.concat(panel.validate());
                }

                jQuery.extend(true, selections, panel.getValues());
            });

            if (errors.length > 0) {
                me._showValidationErrorMessage(errors);
                return null;
            }
            return selections;
        },

        /**
         * @private @method _editToolLayoutOff
         *
         *
         */
        _editToolLayoutOff: function () {
            var me = this,
                sandbox = Oskari.getSandbox('sandbox');

            me.panels.forEach(function(panel) {
               if(typeof panel.stop === 'function') {
                    panel.stop();
               }
            });

            jQuery('#editModeBtn').val(me.loc.toollayout.usereditmode);
            jQuery('.mapplugin').removeClass('toollayoutedit');

            var draggables = jQuery('.mapplugin.ui-draggable');
            draggables.css('position', '');
            draggables.draggable('destroy');
            jQuery('.mappluginsContent.ui-droppable').droppable('destroy');

            var event = Oskari.eventBuilder('LayerToolsEditModeEvent')(false);
            sandbox.notifyAll(event);
        },
        /**
         * @method cancel
         * Closes publisher without saving
         */
        cancel: function() {
            this._editToolLayoutOff();
            this.instance.setPublishMode(false);
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
                me.cancel();
            });
            cancelBtn.insertTo(buttonCont);

            var saveBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );

            if (me.data.uuid) {
                var save = function () {
                    var selections = me.gatherSelections();
                    if (selections) {
                        me._editToolLayoutOff();
                        me._publishMap(selections);
                    }
                };
                saveBtn.setTitle(me.loc.buttons.saveNew);
                saveBtn.setHandler(function () {
                    me.data.uuid = null;
                    delete me.data.uuid;
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
                    var selections = me.gatherSelections();
                    if (selections) {
                        me._editToolLayoutOff();
                        me._publishMap(selections);
                    }
                });
                saveBtn.insertTo(buttonCont);
            }

            return buttonCont;
        },
        /**
         * @private @method _publishMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} selections map data as returned by gatherSelections()
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
            if (selections.metadata.size) {
                totalWidth = selections.metadata.size.width + 'px';
                totalHeight = selections.metadata.size.height + 'px';
            }
            // make the ajax call
            jQuery.ajax({
                url: url + '&action_route=AppSetup',
                type: 'POST',
                dataType: 'json',
                data: {
                    publishedFrom: Oskari.app.getUuid(),
                    uuid: (me.data && me.data.uuid) ? me.data.uuid : undefined,
                    pubdata: JSON.stringify(selections)
                },
                success: function (response) {
                    if (response.id > 0) {
                        var event = Oskari.eventBuilder(
                            'Publisher.MapPublishedEvent'
                        )(
                            response.id,
                            totalWidth,
                            totalHeight,
                            response.lang,
                            sandbox.createURL(response.url)
                        );

                        me._editToolLayoutOff();
                        sandbox.notifyAll(event);
                    } else {
                        errorHandler();
                    }
                },
                error: errorHandler
            });
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
                this._editToolLayoutOff();
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

            //hide timeseries as well in case it was visible. (not yet supported in published maps)
            var timeSeriesBundle = me.instance.sandbox.findRegisteredModuleInstance('timeseries');
            if (timeSeriesBundle && timeSeriesBundle.started) {
                timeSeriesBundle.stop();
                me.stoppedBundles.push(timeSeriesBundle);
            }
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

            // resume normal plugins
            for (i = 0; i < me.normalMapPlugins.length; i += 1) {
                plugin = me.normalMapPlugins[i];
                mapModule.registerPlugin(plugin);
                plugin.startPlugin(me.instance.sandbox);
                if(plugin.refresh) {
                    plugin.refresh();
                }
            }

            //restart the stopped bundles that are not map plugins
            for (var j = 0; j < me.stoppedBundles.length; j++) {
                if (me.stoppedBundles[j].start && typeof me.stoppedBundles[j].start === 'function') {
                    me.stoppedBundles[j].start();
                }
            }
            // reset listing
            me.normalMapPlugins = [];
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
            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = dialog.createCloseButton(this.loc.buttons.ok),
                content = jQuery('<ul></ul>'),
                i,
                row;

            for (i = 0; i < errors.length; i += 1) {
                row = jQuery('<li></li>');
                row.append(errors[i].error);
                content.append(row);
            }
            dialog.makeModal();
            dialog.show(this.loc.error.title, content, [okBtn]);
        },
        /**
         * @private @method _showReplaceConfirm
         * Shows a confirm dialog for replacing published map
         *
         * @param {Function} continueCallback function to call if the user confirms
         *
         */
        _showReplaceConfirm: function (continueCallback) {
            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );
            okBtn.setTitle(this.loc.buttons.replace);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close();
                continueCallback();
            });
            var cancelBtn = dialog.createCloseButton(this.loc.buttons.cancel);
            dialog.show(
                this.loc.confirm.replace.title,
                this.loc.confirm.replace.msg,
                [cancelBtn, okBtn]
            );
        },
        /**
         * @method destroy
         * Destroys/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
            // Resets map position and size to cover the whole space. Maybe find another way to do this?
            jQuery('#contentMap').width('');
            jQuery('.oskariui-left')
                .css({
                    'width': '',
                    'height': '',
                    'float': ''
                })
                .empty();
            jQuery('.oskariui-center').css({
                'width': '100%',
                'float': ''
            });
        }
    });
