import React from 'react';
import ReactDOM from 'react-dom';
import { Messaging } from 'oskari-ui/util';
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
class PublisherSidebar {
    constructor (instance, localization, data) {
        this.instance = instance;
        this.localization = localization;
        this.data = data;
        this.normalMapPlugins = [];
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.panels = [];
    }

    render (container) {
        const content = <>
            <StyledHeader
                title={this.data.uuid ? this.localization?.titleEdit : this.localization?.title}
                onClose={() => this.cancel()}
            />
            <div className="content"/>
        </>;

        ReactDOM.render(content, container[0]);

        const accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        const generalInfoPanel = this.createGeneralInfoPanel();
        generalInfoPanel.getPanel().addClass('t_generalInfo');
        this.panels.push(generalInfoPanel);
        accordion.addPanel(generalInfoPanel.getPanel());

        const publisherTools = this.createToolGroupings(accordion);

        const mapPreviewPanel = this.createMapPreviewPanel(publisherTools.tools);
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

        const mapLayersPanel = this.createMapLayersPanel(layerTools);
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
                group, tools, this.instance, this.localization
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
            const rpcPanel = this.createRpcPanel(rpcTools);
            rpcPanel.getPanel().addClass('t_rpc');
            // add rpc panel after the other tools
            this.panels.push(rpcPanel);
            accordion.addPanel(rpcPanel.getPanel());
        }
        const toolLayoutPanel = this.createToolLayoutPanel(publisherTools.tools);
        toolLayoutPanel.getPanel().addClass('t_toollayout');
        this.panels.push(toolLayoutPanel);
        accordion.addPanel(toolLayoutPanel.getPanel());

        const layoutPanel = this.createLayoutPanel();
        layoutPanel.getPanel().addClass('t_style');
        this.panels.push(layoutPanel);
        accordion.addPanel(layoutPanel.getPanel());

        // -- render to UI and setup buttons --
        const contentDiv = container.find('div.content');
        accordion.insertTo(contentDiv);
    }

    /**
     * @private @method _createToolGroupings
     * Finds classes annotated as 'Oskari.mapframework.publisher.Tool'.
     * Determines tool groups from tools and creates tool panels for each group. Returns an object containing a list of panels and their tools as well as a list of
     * all tools, even those that aren't displayed in the tools' panels.
     *
     * @return {Object} Containing {Oskari.mapframework.bundle.publisher2.view.PanelMapTools[]} list of panels
     * and {Oskari.mapframework.publisher.tool.Tool[]} tools not displayed in panel
     */
    createToolGroupings () {
        const sandbox = this.instance.getSandbox();
        const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const definedTools = [...Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool'),
            ...Oskari.clazz.protocol('Oskari.mapframework.publisher.LayerTool')
        ];

        const grouping = {};
        const allTools = [];
        // group tools per tool-group
        definedTools.forEach(toolname => {
            const tool = Oskari.clazz.create(toolname, sandbox, mapmodule, this.localization);
            const group = tool.getGroup();
            if (!grouping[group]) {
                grouping[group] = [];
            }
            this.addToolConfig(tool);
            grouping[group].push(tool);
            allTools.push(tool);
        });
        return {
            groups: grouping,
            tools: allTools
        };
    }

    /**
     * @private @method _createMapSizePanel
     * Creates the Map Sizes panel of publisher
     */
    createMapPreviewPanel (publisherTools) {
        const sandbox = this.instance.getSandbox();
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapPreview',
            sandbox, mapModule, this.localization, this.instance, publisherTools
        );

        // initialize form (restore data when editing)
        form.init(this.data);
        return form;
    }

    addToolConfig (tool) {
        const conf = this.instance.conf || {};
        if (!conf.toolsConfig || !tool.bundleName) {
            return;
        }
        tool.toolConfig = conf.toolsConfig[tool.bundleName];
    }

    createMapLayersPanel (tools) {
        const sandbox = this.instance.getSandbox();
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelMapLayers', tools, sandbox, mapModule, this.localization, this.instance);
        form.init(this.data);
        return form;
    }

    /**
     * @private @method _createToolLayoutPanel
     * Creates the tool layout panel of publisher
     * @param {Oskari.mapframework.publisher.tool.Tool[]} tools
     */
    createToolLayoutPanel (tools) {
        const sandbox = this.instance.getSandbox();
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelToolLayout',
            tools, sandbox, mapModule, this.localization, this.instance
        );

        // initialize form (restore data when editing)
        form.init(this.data);
        return form;
    }

    /**
     * @private @method _createLayoutPanel
     * Creates the layout panel of publisher
     */
    createLayoutPanel () {
        const sandbox = this.instance.getSandbox();
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelLayout',
            sandbox, mapModule, this.localization, this.instance
        );

        // initialize form (restore data when editing)
        form.init(this.data);

        return form;
    }

    createRpcPanel (tools) {
        const sandbox = this.instance.getSandbox();
        const form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.view.PanelRpc',
            tools, sandbox, this.localization, this.instance
        );
        form.init(this.data);
        return form;
    }

    /**
     * @method setEnabled
     * "Activates" the published map preview when enabled
     * and returns to normal mode on disable
     *
     * @param {Boolean} isEnabled true to enable preview, false to disable
     * preview
     *
     */
    setEnabled (isEnabled) {
        if (isEnabled) {
            this.enablePreview();
        } else {
            this.stopEditorPanels();
            this.disablePreview();
        }
    }

    /**
     * @private @method _enablePreview
     * Modifies the main map to show what the published map would look like
     *
     *
     */
    enablePreview () {
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
                    Messaging.error(this.localization?.error.enablePreview);
                }
            });
    }

    /**
     * @private @method _disablePreview
     * Returns the main map from preview to normal state
     *
     */
    disablePreview () {
        const sandbox = this.instance.sandbox;
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
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
    }

    /**
     * @private @method _stopEditorPanels
     */
    stopEditorPanels () {
        this.panels.forEach(function (panel) {
            if (typeof panel.stop === 'function') {
                panel.stop();
            }
        });
    }

    /**
     * @method cancel
     * Closes publisher without saving
     */
    cancel () {
        this.instance.setPublishMode(false);
    }

    /**
     * @private @method _createGeneralInfoPanel
     * Creates the Location panel of publisher
     */
    createGeneralInfoPanel (data) {
        const sandbox = this.instance.getSandbox();
        const form = Oskari.clazz.create(
            'Oskari.mapframework.bundle.publisher2.view.PanelGeneralInfo',
            sandbox, this.localization
        );

        // initialize form (restore data when editing)
        form.init(this.data);
        // open generic info by default
        form.getPanel().open();
        return form;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
    PublisherSidebar
);

export { PublisherSidebar };
