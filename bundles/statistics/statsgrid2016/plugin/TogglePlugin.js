import React from 'react';
import ReactDOM from 'react-dom';
import { PluginHandler } from '../handler/PluginHandler';
import { ThematicControls } from './ThematicControls';
import { UnorderedListOutlined, TableOutlined, BarChartOutlined, ClockCircleOutlined } from '@ant-design/icons';

Oskari.clazz.define('Oskari.statistics.statsgrid.TogglePlugin', function (flyoutManager, location) {
    var me = this;
    this.flyoutManager = flyoutManager;
    this.element = null;
    this._clazz = 'Oskari.statistics.statsgrid.TogglePlugin';
    this._index = 4;
    this._defaultLocation = 'bottom right';
    this._config = {
        location: {
            classes: location || this._defaultLocation
        }
    };

    this.flyoutManager.on('show', function (tool) {
        me.toggleTool(tool, true);
    });
    this.flyoutManager.on('hide', function (tool) {
        me.toggleTool(tool, false);
    });
    this.handler = new PluginHandler(() => this.renderButtons());
}, {
    _setLayerToolsEditModeImpl: function () {},
    getElement: function () {
        return this.element;
    },
    hasUI: function () {
        return true;
    },
    changeToolStyle: function () {
        this.renderButtons();
    },
    toggleTool: function (tool, shown) {
        this.handler.getController().toggleTool(tool, shown);
    },
    addTool: function (toolId, clickCb) {
        const clickHandler = typeof clickCb === 'function' ? clickCb : () => this.flyoutManager.toggle(toolId);
        let tool = {
            name: toolId,
            clickHandler,
            active: false
        };

        switch (toolId) {
        case 'series':
            tool.icon = <ClockCircleOutlined />;
            break;
        case 'table':
            tool.icon = <TableOutlined />;
            break;
        case 'classification':
            tool.icon = <UnorderedListOutlined />;
            break;
        case 'diagram':
            tool.icon = <BarChartOutlined />;
            break;
        default:
            tool.icon = <TableOutlined />;
            break;
        }

        this.handler.getController().addTool(tool);

        if (!this.element) {
            this.redrawUI();
        }
    },
    renderButtons: function (element) {
        let el = element;
        if (!el) {
            el = this.getElement();
        }
        if (!el) return;

        ReactDOM.render(
            <ThematicControls
                tools={this.handler.getState().plugins}
            />,
            el[0]
        );
    },
    removeTool: function (toolId) {
        this.handler.getController().removeTool(toolId);
        this.flyoutManager.hide(toolId);
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        if (this.element) {
            return this.element;
        }
        var toggleButtons = jQuery('<div class="statsgrid-published-toggle-buttons mapplugin" />');

        this.element = toggleButtons;
        return this.element;
    },
    /**
     * Handle plugin UI and change it when desktop / mobile mode
     * @method  @public redrawUI
     */
    redrawUI: function () {
        this.element = this._createControlElement();
        this.addToPluginContainer(this.element);
    },
    teardownUI: function (stopping) {
        // detach old element from screen
        this.removeFromPluginContainer(this._element, !stopping);
        if (stopping) {
            this.element = null;
        }
    },
    stopPlugin: function () {
        this.teardownUI(true);
    }
}, {
    'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @static @property {string[]} protocol array of superclasses
     */
    'protocol': [
        'Oskari.mapframework.module.Module',
        'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
    ]
});
