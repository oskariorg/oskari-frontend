import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { CameraControls3d, CameraControls3dHandler } from '../view';
import { createRoot } from 'react-dom/client';

const className = 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin';
const shortName = 'CameraControls3dPlugin';

Oskari.clazz.define(className,
    function (config) {
        this._config = config;
        this._clazz = className;
        this._defaultLocation = 'top right';
        this._toolOpen = false;
        this._index = 80;
        this._log = Oskari.log(shortName);
        this._template = jQuery('<div class="mapplugin camera-controls-3d"><div></div></div>');
        // plugin index 25. Insert after panbuttons.
        this._index = 25;
        this.handler = new CameraControls3dHandler(state => this._render(state));
        this._reactRoot = null;
    }, {
        getName: function () {
            return shortName;
        },
        /**
         * @method resetState
         * Resets the state in the plugin
         */
        resetState: function () {
            this.handler.resetToInitialState();
        },
        isRotating: function () {
            return this.handler.getActiveMapMoveMethod() === 'rotate';
        },
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
        },
        _createControlElement: function () {
            return this._template.clone();
        },
        teardownUI: function () {
            if (!this.getElement()) {
                return;
            }
            this.getReactRoot(this.getElement().get(0)).unmount();
            this.getElement().detach();
            this._element = undefined;
        },
        stopPlugin: function () {
            this.teardownUI();
        },
        refresh: function () {
            this._render();
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        _render (state = this.handler.getState()) {
            let el = this.getElement();
            if (!el) {
                return;
            }

            const { activeMapMoveMethod } = state;
            const ui = (
                <LocaleProvider value={{ bundleKey: 'CameraControls3d' }}>
                    <CameraControls3d
                        mapInMobileMode={Oskari.util.isMobile()}
                        activeMapMoveMethod={activeMapMoveMethod}
                        controller={this.handler.getController()}
                        location={this.getLocation()}
                    />
                </LocaleProvider>
            );
            this.getReactRoot(el[0]).render(ui);
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
