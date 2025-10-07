import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { COVERAGE_LAYER_ID, CoverageHelper } from './CoverageHelper';
import { ThemeProvider } from 'oskari-ui/util';
import { MapModuleButton } from '../../../MapModuleButton';
import { createRoot } from 'react-dom/client';
const FEATURE_EVENT_ADD = 'add';
const FEATURE_EVENT_REMOVE = 'remove';
const LOCALIZATION_BUNDLE_ID = 'MapModule';

Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.CoverageToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (config) {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.CoverageToolPlugin';
        this._defaultLocation = 'top center';
        this._templates = {
            plugin: jQuery('<div class="mapplugin coveragetoolplugin"></div>')
        };
        this._visible = false;
        this.coverageHelper = new CoverageHelper();
        this._reactRoot = null;
    }, {
        /** @static @property __name module name */
        __name: 'CoverageToolPlugin',

        getName: function () {
            return this.__name;
        },
        /**
         * @private @method _createControlElement
         * Creates the DOM element that will be placed on the map
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return this._templates.plugin.clone();
        },
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.renderButton();
            this.addToPluginContainer(this.getElement());
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        renderButton: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            // clear all content from element so the tooltip gets cleared as well
            if (!this.isVisible()) {
                this.getReactRoot(el[0]).render(null);
                return;
            }

            this.getReactRoot(el[0]).render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <MapModuleButton
                        className='t_coveragetoolbutton'
                        visible={this.isVisible()}
                        icon={<DeleteOutlined />}
                        title={Oskari.getMsg(LOCALIZATION_BUNDLE_ID, 'layerCoverageTool.removeCoverageFromMap')}
                        onClick={() => this._coverageButtonClicked()}
                        iconActive={!!this.popupOpen}
                        position={this.getLocation()}
                    />
                </ThemeProvider>
            );
        },
        setVisible: function (visible) {
            this._visible = visible;
        },
        isVisible: function () {
            return this._visible;
        },
        _coverageButtonClicked () {
            this.coverageHelper.clearLayerCoverage();
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
        },
        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        createEventHandlers: function () {
            return {
                FeatureEvent: function (event) {
                    if (!event || !(event?.getOperation() === FEATURE_EVENT_ADD || event?.getOperation() === FEATURE_EVENT_REMOVE)) {
                        return;
                    }
                    const features = event?.getFeatures() || null;
                    const isCoverageLayer = features?.some(feature => feature.layerId === COVERAGE_LAYER_ID);
                    this.setVisible(isCoverageLayer && event.getOperation() === FEATURE_EVENT_ADD);
                    this.renderButton();
                },
                UIChangeEvent: function (event) {
                    this.coverageHelper.clearLayerCoverage(true);
                    this.stopPlugin(Oskari.getSandbox());
                }
            };
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
