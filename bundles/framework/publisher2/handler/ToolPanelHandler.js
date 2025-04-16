import React from 'react';
import { PublisherToolsList } from '../view/form/PublisherToolsList';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (sandbox, tools) {
        super();
        this.allAvailableTools = Array.isArray(tools) ? tools.toSorted((a, b) => a.index - b.index) : [];
        this.setState({
            tools: []
        });
    }

    init (data) {
        const tools = [];
        this.allAvailableTools.forEach((tool) => {
            try {
                tool.init(data);
                if (tool.isDisplayed()) {
                    tools.push(tool);
                }
            } catch (err) {
                Oskari.log('ToolPanelHandler').error('Error initializing publisher tool:', tool);
            }
        });
        // Note that handler is for extra component. Every tool doesn't have extra + handler
        // Trigger re-render if handlers state changes
        tools.forEach(tool => tool.getComponent().handler?.addStateListener(() => this.notify()));
        this.updateState({ tools });
    }

    setPanelVisibility (visible) {
        // Remove tools from state to hide panel
        const tools = visible ? this.allAvailableTools.filter(tool => tool.isDisplayed()) : [];
        this.updateState({ tools });
    }

    getPanelContent () {
        const { tools } = this.getState();
        if (!tools.length) {
            // don't render empty panel (collapse without content/children is filtered)
            return null;
        }
        return <PublisherToolsList tools={tools} controller={this.getController()}/>;
    }

    setToolEnabled (tool, enabled) {
        tool.setEnabled(enabled);
        // trigger re-render
        this.notify();
    }

    stop () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                tool.stop();
            } catch (e) {
                Oskari.log('Publisher.ToolPanelHandler')
                    .error('Error stopping publisher tool:', tool.id);
            }
        });
    }
};

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as ToolPanelHandler };
