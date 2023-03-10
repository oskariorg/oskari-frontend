import { Messaging } from 'oskari-ui/util';

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
        // basic_publisher needs an extra wrapper-div for styles to work properly
        me.template = jQuery(
            '<div><div class="basic_publisher">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div></div>');

        me.templates = {
            publishedGridTemplate: '<div class="publishedgrid"></div>'
        };

        me.templateButtonsDiv = jQuery('<div class="buttons"></div>');
        me.normalMapPlugins = [];

        me.loc = localization;
        me.accordion = null;

        me.maplayerPanel = null;
        me.mainPanel = null;

        me.latestGFI = null;

        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            const content = this.template.clone();
            this.mainPanel = content;

            this.progressSpinner.insertTo(content);
            // prepend makes the sidebar go on the left side of the map
            // we could use getNavigationDimensions() and check placement from it to append OR prepend,
            // but it does work with the navigation even on the right hand side being hidden,
            //  a new panel appearing on the left hand side and the map moves accordingly
            container.prepend(content);
            const accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            this.accordion = accordion;

            // setup title based on new/edit
            const sidebarTitle = content.find('div.header h3');

            if (this.data.uuid) {
                sidebarTitle.text(this.loc.titleEdit);
            } else {
                sidebarTitle.text(this.loc.title);
            }
            // bind close from header (X)
            container
                .find('div.header div.icon-close')
                .on('click',() => this.cancel());

            // -- create panels --
            const genericInfoPanel = this._createGeneralInfoPanel();
            genericInfoPanel.getPanel().addClass('t_generalInfo');
            this.panels.push(genericInfoPanel);
            accordion.addPanel(genericInfoPanel.getPanel());

            var publisherTools = this._createToolGroupings(accordion);

            var mapPreviewPanel = this._createMapPreviewPanel(publisherTools.tools);
            mapPreviewPanel.getPanel().addClass('t_size');
            this.panels.push(mapPreviewPanel);
            accordion.addPanel(mapPreviewPanel.getPanel());

            const mapLayersPanel = this._createMapLayersPanel();
            mapLayersPanel.getPanel().addClass('t_layers');
            this.panels.push(mapLayersPanel);
            accordion.addPanel(mapLayersPanel.getPanel());

            // create panel for each tool group
            Object.keys(publisherTools.groups).forEach(group => {
                const tools = publisherTools.groups[group];
                if (group === 'rpc') {
                    const rpcPanel = this._createRpcPanel(tools);
                    rpcPanel.getPanel().addClass('t_rpc');
                    this.panels.push(rpcPanel);
                    accordion.addPanel(rpcPanel.getPanel());
                } else {
                    const toolPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapTools',
                        group, tools, this.instance, this.loc
                    );
                    toolPanel.init(this.data);
                    this.panels.push(toolPanel);
                    const panel = toolPanel.getPanel();
                    panel.addClass('t_tools');
                    panel.addClass('t_' + group);
                    accordion.addPanel(panel);
                }
            });
            const toolLayoutPanel = this._createToolLayoutPanel(publisherTools.tools);
            toolLayoutPanel.getPanel().addClass('t_toollayout');
            this.panels.push(toolLayoutPanel);
            accordion.addPanel(toolLayoutPanel.getPanel());

            const layoutPanel = this._createLayoutPanel();
            layoutPanel.getPanel().addClass('t_style');
            this.panels.push(layoutPanel);
            accordion.addPanel(layoutPanel.getPanel());

            // -- render to UI and setup buttons --
            const contentDiv = content.find('div.content');
            accordion.insertTo(contentDiv);
            contentDiv.append(this._getButtons());

            // disable keyboard map moving whenever a text-input is focused element
            const inputs = this.mainPanel.find('input[type=text]');
            const sandbox = this.instance.getSandbox();
            inputs.on('focus', () => sandbox.postRequestByName('DisableMapKeyboardMovementRequest'));
            inputs.on('blur', () => sandbox.postRequestByName('EnableMapKeyboardMovementRequest'));
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
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapPreview',
                    sandbox, mapModule, me.loc, me.instance, publisherTools
                );

            // initialize form (restore data when editing)
            form.init(me.data, function (value) {});

            return form;
        },
        _createMapLayersPanel: function () {
            const sandbox = this.instance.getSandbox();
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapLayers', sandbox, mapModule, this.loc, this.instance);
            form.init(this.data, (value) => {});
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
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelToolLayout',
                    tools, sandbox, mapModule, me.loc, me.instance
                );

            // initialize form (restore data when editing)
            form.init(me.data, function (value) {});

            return form;
        },
        /**
         * @private @method _createLayoutPanel
         * Creates the layout panel of publisher
         */
        _createLayoutPanel: function () {
            var me = this,
                sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelLayout',
                    sandbox, mapModule, me.loc, me.instance
                );

            // initialize form (restore data when editing)
            form.init(me.data, function (value) {});

            return form;
        },
        _createRpcPanel: function (tools) {
            const sandbox = this.instance.getSandbox();
            const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelRpc',
                tools, sandbox, this.loc, this.instance
            );
            form.init(this.data, (value) => {});
            return form;
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
            const sandbox = this.instance.getSandbox();
            const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            const definedTools = Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool');
            const grouping = {};
            const allTools = [];
            // group tools per tool-group
            definedTools.forEach(toolname => {
                const tool = Oskari.clazz.create(toolname, sandbox, mapmodule, this.loc);
                if (tool.isDisplayed(this.data) !== true) {
                    return;
                }
                var group = tool.getGroup();
                if (!grouping[group]) {
                    grouping[group] = [];
                }
                this._addToolConfig(tool);
                grouping[group].push(tool);
                allTools.push(tool);
            });
            return {
                groups: grouping,
                tools: allTools
            };
        },
        _addToolConfig: function (tool) {
            var conf = this.instance.conf || {};
            if (!conf.toolsConfig || !tool.bundleName) {
                return;
            }
            tool.toolConfig = conf.toolsConfig[tool.bundleName];
        },
        /**
        * Extends object recursive for keeping defaults array.
        * @method _extendRecursive
        * @private
        *
        * @param {Object} defaults the default extendable object
        * @param {Object} extend extend object
        *
        * @return {Object} extended object
        */
        _extendRecursive: function (defaults, extend) {
            var me = this;
            if (extend === null || extend === undefined || jQuery.isEmptyObject(extend)) {
                return defaults;
            } else if (jQuery.isEmptyObject(defaults)) {
                return jQuery.extend(true, defaults, extend);
            } else if (jQuery.isArray(defaults)) {
                if (jQuery.isArray(extend)) {
                    jQuery.each(extend, function (key, value) {
                        defaults.push(value);
                    });
                }
                return defaults;
            } else if (extend.constructor && extend.constructor === Object) {
                jQuery.each(extend, function (key, value) {
                    // not an array or an object -> just use the plain value
                    if (defaults[key] === null || defaults[key] === undefined || !(defaults[key] instanceof Array || defaults[key] instanceof Object)) {
                        defaults[key] = value;
                    } else {
                        defaults[key] = me._extendRecursive(defaults[key], value);
                    }
                });
                return defaults;
            }
        },
        /**
        * Gather selections.
        * @method gatherSelections
        * @private
        */
        gatherSelections: function () {
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

            jQuery.each(me.panels, function (index, panel) {
                if (panel.validate && typeof panel.validate === 'function') {
                    errors = errors.concat(panel.validate());
                }

                me._extendRecursive(selections, panel.getValues());
            });

            if (errors.length > 0) {
                me._showValidationErrorMessage(errors);
                return null;
            }
            return selections;
        },

        /**
         * @private @method _stopEditorPanels
         */
        _stopEditorPanels: function () {
            this.panels.forEach(function (panel) {
                if (typeof panel.stop === 'function') {
                    panel.stop();
                }
            });
        },
        /**
         * @method cancel
         * Closes publisher without saving
         */
        cancel: function () {
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
            const me = this;
            const buttonCont = me.templateButtonsDiv.clone();
            // cancel
            const cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
            cancelBtn.setHandler(function () {
                me.cancel();
            });
            cancelBtn.insertTo(buttonCont);
            // save
            const saveBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
            if (!me.data.uuid) {
                // only save when not editing
                saveBtn.setTitle(me.loc.buttons.save);
                saveBtn.setHandler(function () {
                    const selections = me.gatherSelections();
                    if (selections) {
                        me._stopEditorPanels();
                        me._publishMap(selections);
                    }
                });
                saveBtn.insertTo(buttonCont);
                return buttonCont;
            }
            // buttons when editing
            const save = function () {
                const selections = me.gatherSelections();
                if (selections) {
                    me._stopEditorPanels();
                    me._publishMap(selections);
                }
            };
            saveBtn.setTitle(me.loc.buttons.saveNew);
            saveBtn.setHandler(function () {
                // clear the id to save this as a new embedded map
                me.data.uuid = null;
                delete me.data.uuid;
                save();
            });
            saveBtn.insertTo(buttonCont);

            // replace
            const replaceBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            replaceBtn.setTitle(me.loc.buttons.replace);
            replaceBtn.addClass('primary');
            replaceBtn.setHandler(function () {
                me._showReplaceConfirm(save);
            });
            replaceBtn.insertTo(buttonCont);
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
                totalWidth = '100%',
                totalHeight = '100%',
                errorHandler = function () {
                    me.progressSpinner.stop();
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = dialog.createCloseButton(me.loc.buttons.ok);
                    dialog.show(me.loc.error.title, me.loc.error.saveFailed, [okBtn]);
                };
            if (selections.metadata.size) {
                totalWidth = selections.metadata.size.width + 'px';
                totalHeight = selections.metadata.size.height + 'px';
            }

            me.progressSpinner.start();

            // make the ajax call
            jQuery.ajax({
                url: Oskari.urls.getRoute('AppSetup'),
                type: 'POST',
                dataType: 'json',
                data: {
                    publishedFrom: Oskari.app.getUuid(),
                    uuid: (me.data && me.data.uuid) ? me.data.uuid : undefined,
                    pubdata: JSON.stringify(selections)
                },
                success: function (response) {
                    me.progressSpinner.stop();
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

                        me._stopEditorPanels();
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
                this._stopEditorPanels();
                this._disablePreview();
            }
            /*
            // FIXME: notify all visible tools the enabled status changes? WHY?
            var sb = this.instance.sandbox;
            var publisherTools = this._createToolGroupings();
            publisherTools.tools.forEach(function (tool) {
                var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(tool);
                sb.notifyAll(event);
            });
            */
        },

        /**
         * @private @method _enablePreview
         * Modifies the main map to show what the published map would look like
         *
         *
         */
        _enablePreview: function () {
            const sandbox = this.instance.sandbox;
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            Object.values(mapModule.getPluginInstances())
                .filter(plugin => plugin.hasUI && plugin.hasUI())
                .forEach(plugin => {
                    try {
                        plugin.stopPlugin(sandbox);
                        mapModule.unregisterPlugin(plugin);
                        this.normalMapPlugins.push(plugin);
                    } catch (err) {
                        Oskari.log('Publisher').error('Enable preview', err);
                        Messaging.error(this.loc.error.enablePreview);
                    }
                });
        },

        /**
         * @private @method _disablePreview
         * Returns the main map from preview to normal state
         *
         */
        _disablePreview: function () {
            const sandbox = this.instance.sandbox;
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
/*
            // FIXME: let tools stop the plugins they started on stop() instead!
            // Remove plugins added during publishing session
            Object.values(mapModule.getPluginInstances())
                .filter(plugin => plugin.hasUI && plugin.hasUI())
                .forEach(plugin => {
                    try {
                        plugin.stopPlugin(sandbox);
                        mapModule.unregisterPlugin(plugin);
                    } catch (err) {
                        Oskari.log('Publisher').error('Disable preview', err);
                        Messaging.error(this.loc.error.disablePreview);
                    }
                });
*/
            // resume normal plugins
            this.normalMapPlugins.forEach(plugin => {
                mapModule.registerPlugin(plugin);
                plugin.startPlugin(sandbox);
                if (plugin.refresh) {
                    plugin.refresh();
                }
            });
            // reset listing
            this.normalMapPlugins = [];
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
        }
    });
