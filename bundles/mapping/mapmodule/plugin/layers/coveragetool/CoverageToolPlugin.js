import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
import { COVERAGE_LAYER_ID, CoverageHelper } from './CoverageHelper';
import { ThemeProvider } from 'oskari-ui/util';
import { CoverageToolButton } from './CoverageToolButton';

const FEATURE_EVENT_ADD = 'add';
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
        renderButton: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <CoverageToolButton
                        visible={this.isVisible()}
                        icon={<Message bundleKey={LOCALIZATION_BUNDLE_ID} messageKey='layerCoverageTool.removeCoverageFromMap'/>}
                        onClick={() => {
                            this._coverageButtonClicked();
                        }}
                        active={this.isVisible()}
                        position={this.getLocation()}
                    />
                </ThemeProvider>,
                el[0]);
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
            this._layers = [];
            this._baseLayers = [];
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
                    if (!event) {
                        return;
                    }
                    const features = event?.getFeatures() || null;
                    const isCoverageLayer = features?.some(feature => feature.layerId === COVERAGE_LAYER_ID);
                    this.setVisible(isCoverageLayer && event.getOperation() === FEATURE_EVENT_ADD);
                    this.renderButton();
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
