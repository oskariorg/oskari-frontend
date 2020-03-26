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
        this.handler = new CameraControls3dHandler(state => this._render(Oskari.util.isMobile(), state));
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
            return this._createUI(mapInMobileMode, forced);
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
        _createUI: function (mapInMobileMode, forced) {
            this._element = this._mountPoint.clone();
            if (mapInMobileMode) {
                if (this._addToMobileToolBar(forced)) {
                    return true;
                }
            } else {
                this.addToPluginContainer(this._element);
            }
            const cls = mapInMobileMode ? 'tool' : 'mapplugin';
            this._element.addClass(cls);
            this._render(mapInMobileMode);
        },
        _render (mapInMobileMode, state = this.handler.getState()) {
            if (!this.getElement()) {
                return;
            }
            const { activeMapMoveMethod } = state;
            const ui = (
                <LocaleProvider value={{ bundleKey: 'CameraControls3d' }}>
                    <CameraControls3d
                        mapInMobileMode={mapInMobileMode}
                        activeMapMoveMethod={activeMapMoveMethod}
                        controller={this.handler.getController()}/>
                </LocaleProvider>
            );
            ReactDOM.render(ui, this._element.get(0));
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
        },
        _addToMobileToolBar (forced) {
            // TODO: create mapmodule method and tools service for svg based mobile tools
            const el = this.getElement();
            const toolbar = jQuery('.toolbar_' + this.getMapModule().getMobileToolbar());
            const resetMapStateControl = toolbar.find('.mobile-reset-map-state');
            // if mapmove controls exists then add after them
            if (resetMapStateControl.length) {
                el.insertAfter(resetMapStateControl);
                return false;
            }
            // no mapmove controls, add first
            const toolrow = toolbar.find('.toolrow');
            if (toolrow.length) {
                toolrow.prepend(el);
                return false;
            }
            // there's no other tools added, add toolrow
            if (forced) {
                const row = jQuery('<div class="toolrow"></div>');
                row.append(el);
                toolbar.append(row);
                return false;
            }
            return true; // waiting for toolbar
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
