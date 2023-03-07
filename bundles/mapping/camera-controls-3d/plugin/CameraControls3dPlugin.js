import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { CameraControls3d, CameraControls3dHandler } from '../view';

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
        this._mountPoint = jQuery('<div class="camera-controls-3d"><div></div></div>');
        // plugin index 25. Insert after panbuttons.
        this._index = 25;
        this.inMobileMode = false;
        this.handler = new CameraControls3dHandler(state => this._render(state));
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
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         */
        redrawUI: function (mapInMobileMode, forced) {
            this.teardownUI();
            this.inMobileMode = mapInMobileMode;
            return this._createUI();
        },
        teardownUI: function () {
            if (!this.getElement()) {
                return;
            }
            ReactDOM.unmountComponentAtNode(this.getElement().get(0));
            this.getElement().detach();
            this._element = undefined;
        },
        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;
        },
        stopPlugin: function () {
            this.teardownUI();
        },
        /**
         * Changes the tool style of the plugin
         * @method changeToolStyle
         */
        changeToolStyle: function () {
            if (!this.getElement()) {
                return;
            }
            this._render();
            this._setLayerToolsEditMode(
                this.getMapModule().isInLayerToolsEditMode()
            );
        },
        _createUI: function () {
            this._element = this._mountPoint.clone();
            this.addToPluginContainer(this._element);
            this._element.addClass('mapplugin');
            this._render();
        },
        _render (state = this.handler.getState()) {
            let el = this.getElement();
            if (!el) return;

            const { activeMapMoveMethod } = state;
            const ui = (
                <LocaleProvider value={{ bundleKey: 'CameraControls3d' }}>
                    <CameraControls3d
                        mapInMobileMode={this.inMobileMode}
                        activeMapMoveMethod={activeMapMoveMethod}
                        controller={this.handler.getController()}
                        location={this.getLocation()}
                    />
                </LocaleProvider>
            );
            ReactDOM.render(ui, el[0]);
        },
        /**
         * @public @method getIndex
         * Returns the plugin's preferred position in the container
         *
         *
         * @return {Number} Plugin's preferred position in container
         */
        getIndex: function () {
            // i.e. position
            return this._index;
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
