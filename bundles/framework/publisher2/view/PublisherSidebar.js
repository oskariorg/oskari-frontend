import React from 'react';
import ReactDOM from 'react-dom';
import { mergeValues } from '../util/util';
import { Messaging, ThemeProvider } from 'oskari-ui/util';
import { Header } from 'oskari-ui';
import styled from 'styled-components';
import './PanelReactTools';

const StyledHeader = styled(Header)`
    padding: 15px 15px 10px 10px;
`;

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
        const me = this;
        me.data = data;
        me.panels = [];
        me.instance = instance;
        // basic_publisher needs an extra wrapper-div for styles to work properly
        me.template = jQuery(
            '<div><div class="basic_publisher">' +
            '  <div class="header">' +
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

            const header = content.find('div.header');
            const headerContainer = jQuery('<div />');
            header.append(headerContainer);
            ReactDOM.render(
                <ThemeProvider>
                    <StyledHeader
                        title={this.data.uuid ? this.loc.titleEdit : this.loc.title}
                        onClose={() => this.cancel()}
                    />
                </ThemeProvider>,
                headerContainer[0]
            );

            // -- create panels --
            const genericInfoPanel = this._createGeneralInfoPanel();
            genericInfoPanel.getPanel().addClass('t_generalInfo');
            this.panels.push(genericInfoPanel);
            accordion.addPanel(genericInfoPanel.getPanel());

            const publisherTools = this._createToolGroupings(accordion);

            const mapPreviewPanel = this._createMapPreviewPanel(publisherTools.tools);
            mapPreviewPanel.getPanel().addClass('t_size');
            this.panels.push(mapPreviewPanel);
            accordion.addPanel(mapPreviewPanel.getPanel());

            // Separate handling for RPC and layers group from other tools
            // layers panel is added before other tools
            // RPC panel is added after other tools
            const rpcTools = publisherTools.groups.rpc;
            const layerTools = publisherTools.groups.layers;
            // clear rpc/layers groups from others for looping/group so they are not listed twice
            delete publisherTools.groups.rpc;
            delete publisherTools.groups.layers;

            const mapLayersPanel = this._createMapLayersPanel(layerTools);
            mapLayersPanel.getPanel().addClass('t_layers');
            this.panels.push(mapLayersPanel);
            accordion.addPanel(mapLayersPanel.getPanel());
            // separate tools that support react from ones that don't
            const reactGroups = ['tools', 'data', 'statsgrid'];
            const reactGroupsTools = {};
            // create panel for each tool group
            Object.keys(publisherTools.groups).forEach(group => {
                const tools = publisherTools.groups[group];
                if (reactGroups.includes(group)) {
                    // panels with react groups handled after this
                    reactGroupsTools[group] = tools;
                    return;
                }
                const toolPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapTools',
                    group, tools, this.instance, this.loc
                );
                const hasToolsToShow = toolPanel.init(this.data);
                this.panels.push(toolPanel);
                if (hasToolsToShow) {
                    const panel = toolPanel.getPanel();
                    panel.addClass('t_tools');
                    panel.addClass('t_' + group);
                    accordion.addPanel(panel);
                }
            });
            Object.keys(reactGroupsTools).forEach(group => {
                const tools = reactGroupsTools[group];
                const toolPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelReactTools', tools, group);
                const hasToolsToShow = toolPanel.init(this.data);
                this.panels.push(toolPanel);
                if (hasToolsToShow) {
                    const panel = toolPanel.getPanel();
                    panel.addClass('t_tools');
                    panel.addClass('t_' + group);
                    accordion.addPanel(panel);
                }
            });

            // add RPC panel if there are tools for it
            if (rpcTools) {
                const rpcPanel = this._createRpcPanel(rpcTools);
                rpcPanel.getPanel().addClass('t_rpc');
                // add rpc panel after the other tools
                this.panels.push(rpcPanel);
                accordion.addPanel(rpcPanel.getPanel());
            }
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
            const me = this;
            const sandbox = this.instance.getSandbox();
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapPreview',
                sandbox, mapModule, me.loc, me.instance, publisherTools
            );

            // initialize form (restore data when editing)
            form.init(me.data);
            return form;
        },
        _createMapLayersPanel: function (tools) {
            const sandbox = this.instance.getSandbox();
            const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapLayers', tools, sandbox, mapModule, this.loc, this.instance);
            form.init(this.data);
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
            form.init(me.data);
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
            form.init(me.data);

            return form;
        },
        _createRpcPanel: function (tools) {
            const sandbox = this.instance.getSandbox();
            const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelRpc',
                tools, sandbox, this.loc, this.instance
            );
            form.init(this.data);
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
            const definedTools = [...Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool'),
                ...Oskari.clazz.protocol('Oskari.mapframework.publisher.LayerTool')
            ];

            const grouping = {};
            const allTools = [];
            // group tools per tool-group
            definedTools.forEach(toolname => {
                const tool = Oskari.clazz.create(toolname, sandbox, mapmodule, this.loc);
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
        * Gather selections.
        * @method gatherSelections
        * @private
        */
        gatherSelections: function () {
            const sandbox = this.instance.getSandbox();
            let errors = [];

            const mapFullState = sandbox.getStatefulComponents().mapfull.getState();
            let selections = {
                configuration: {
                    mapfull: {
                        state: mapFullState
                    }
                }
            };

            this.panels.forEach((panel) => {
                if (typeof panel.validate === 'function') {
                    errors = errors.concat(panel.validate());
                }
                selections = mergeValues(selections, panel.getValues());
            });

            if (errors.length > 0) {
                this._showValidationErrorMessage(errors);
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
                .filter(plugin => plugin.isShouldStopForPublisher && plugin.isShouldStopForPublisher())
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
        _showValidationErrorMessage: function (errors = []) {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = dialog.createCloseButton(this.loc.buttons.ok);
            const content = jQuery('<ul></ul>');
            errors.map(err => {
                const row = jQuery('<li></li>');
                row.append(err.error);
                return row;
            }).forEach(row => content.append(row));
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
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc.buttons.replace);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close();
                continueCallback();
            });
            const cancelBtn = dialog.createCloseButton(this.loc.buttons.cancel);
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
