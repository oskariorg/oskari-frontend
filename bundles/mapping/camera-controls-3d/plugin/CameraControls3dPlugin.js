import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { CameraControls3d } from '../view/CameraControls3d';

const className = 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin';
const shortName = 'CameraControls3dPlugin';

Oskari.clazz.define(className,
    function () {
        this._clazz = className;
        this._defaultLocation = 'top right';
        this._toolOpen = false;
        this._index = 80;
        this._log = Oskari.log(shortName);
        this._mountPoint = jQuery('<div class="mapplugin camera-controls-3d"><div></div></div>');
        // plugin index 25. Insert after panbuttons.
        this._index = 25;
    }, {
        getName: function () {
            return shortName;
        },
        /**
         * @method resetState
         * Resets the state in the plugin
         */
        resetState: function () {
            this.redrawUI(Oskari.util.isMobile());
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin.
         * Not implemented.
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {},
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         */
        redrawUI: function (mapInMobileMode) {
            this.teardownUI();
            this._createUI(mapInMobileMode);
        },
        teardownUI: function () {
            if (!this.getElement()) {
                return;
            }
            ReactDOM.unmountComponentAtNode(this.getElement().get(0));
            this.getElement().detach();
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
        _createUI: function (mapInMobileMode) {
            this._element = this._mountPoint.clone();

            if (mapInMobileMode) {
                // In mobile mode set to same line as other controls
                this._element.css('display', 'inline-block');
                this._addToMobileToolBar();
            } else {
                this.addToPluginContainer(this._element);
            }
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'CameraControls3d' }}>
                    <CameraControls3d mapInMobileMode={mapInMobileMode}/>
                </LocaleProvider>, this._element.get(0));
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
        _addToMobileToolBar () {
            const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
            jQuery(this._element).insertAfter(resetMapStateControl);
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
