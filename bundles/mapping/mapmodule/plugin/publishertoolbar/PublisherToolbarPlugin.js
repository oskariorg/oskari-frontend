import React from 'react';
import { MapModuleButton } from '../../MapModuleButton';
import { ToolbarButtonItem } from 'oskari-ui/components/buttons';
import { BackwardIcon, ForwardIcon, MeasureAreaIcon, MeasureLineIcon } from 'oskari-ui/components/icons';
import { MenuOutlined } from '@ant-design/icons';
import './request/ToolContainerRequest';
import './request/ToolContainerRequestHandler';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin
 * Provides publisher toolbar container
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (conf) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin';
        me._defaultLocation = 'top left';
        me._index = 2;
        me._name = 'PublisherToolbarPlugin';
        me._toolButtons = conf.buttons || [];
        me._reactRoot = null;
    }, {
        // templates for tools-mapplugin
        templates: {
            main: '<div class="mapplugin tools"></div>'
        },

        _createRequestHandlers: function () {
            return {
                'Toolbar.ToolContainerRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.toolbar.request.ToolContainerRequestHandler',
                    this
                )
            };
        },
        _handleMeasureTool: function (tool, requestName) {
            if (this._isPublisherActive()) {
                return;
            }
            const sb = this.getSandbox();
            if (this.activeTool === 'measurearea' || this.activeTool === 'measureline') {
                sb.postRequestByName('DrawTools.StopDrawingRequest', ['mapmeasure', true]);
            }
            if (this.activeTool === tool) {
                const toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')(null, 'PublisherToolbar-basictools');
                sb.request(this, toolbarRequest);
                this.activeTool = undefined;
                this.refresh();
                return;
            }
            const toolRequest = Oskari.requestBuilder('ToolSelectionRequest')(requestName);
            sb.request(this, toolRequest);
            this.activeTool = tool;
            this.refresh();
        },

        addToolButton: function (name) {
            if (this._toolButtons.indexOf(name) < 0) {
                this._toolButtons.push(name);
            }
            this.refresh();
        },
        removeToolButton: function (name) {
            const index = this._toolButtons.indexOf(name);
            if (index > -1) {
                this._toolButtons.splice(index, 1);
            }
            this.refresh();
        },

        /**
         * @private @method _createControlElement
         */
        _createControlElement: function () {
            return jQuery(this.templates.main);
        },

        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }

            var me = this;
            this.teardownUI();

            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
            this.refresh();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        refresh: function () {
            let el = this.getElement();
            if (!el) {
                return;
            }

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_publishertoolbar'
                    icon={<MenuOutlined />}
                    title={this._loc.title}
                    withToolbar
                    position={this.getLocation()}
                >
                    {this.renderToolbarItems()}
                </MapModuleButton>
            );
        },

        renderToolbarItems: function () {
            let buttons = [];

            this._toolButtons.forEach(button => {
                switch (button) {
                case 'history_back':
                    buttons.push(
                        <ToolbarButtonItem
                            key='tool-back'
                            icon={<BackwardIcon />}
                            title={this._loc.history.back}
                            onClick={() => {
                                if (!this._isPublisherActive()) {
                                    const reqBuilder = Oskari.requestBuilder(
                                        'ToolSelectionRequest'
                                    );
                                    this.getSandbox().request(
                                        this,
                                        reqBuilder('map_control_tool_prev')
                                    );
                                }
                            }}
                        />
                    );
                    break;
                case 'history_forward':
                    buttons.push(
                        <ToolbarButtonItem
                            key='tool-next'
                            icon={<ForwardIcon />}
                            title={this._loc.history.next}
                            onClick={() => {
                                if (!this._isPublisherActive()) {
                                    const reqBuilder = Oskari.requestBuilder(
                                        'ToolSelectionRequest'
                                    );
                                    this.getSandbox().request(
                                        this,
                                        reqBuilder('map_control_tool_next')
                                    );
                                }
                            }}
                        />
                    );
                    break;
                case 'measureline':
                    buttons.push(
                        <ToolbarButtonItem
                            key='tool-line'
                            icon={<MeasureLineIcon />}
                            title={this._loc.measure.line}
                            onClick={() => {
                                const rn = 'map_control_measure_tool';
                                const tool = 'measureline';
                                this._handleMeasureTool(tool, rn);
                            }}
                            iconActive={this.activeTool === 'measureline'}
                        />
                    );
                    break;
                case 'measurearea':
                    buttons.push(
                        <ToolbarButtonItem
                            key='tool-area'
                            icon={<MeasureAreaIcon />}
                            title={this._loc.measure.area}
                            onClick={() => {
                                const rn = 'map_control_measure_area_tool';
                                const tool = 'measurearea';
                                this._handleMeasureTool(tool, rn);
                            }}
                            iconActive={this.activeTool === 'measurearea'}
                        />
                    );
                    break;
                default:
                    break;
                }
            });
            return buttons;
        },

        _isPublisherActive: function () {
            var publisherService = this.getSandbox().getService('Oskari.mapframework.bundle.publisher2.PublisherService');
            return publisherService && publisherService.getIsActive();
        },

        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
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
