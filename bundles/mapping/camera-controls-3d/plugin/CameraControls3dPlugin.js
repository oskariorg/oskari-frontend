import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleContext } from 'oskari-ui/util';
import { CameraControls3d } from '../view/CameraControls3d';

const className = 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin';

Oskari.clazz.define(className,
    function () {
        this._clazz = className;
        this._defaultLocation = 'top right';
        this._toolOpen = false;
        this._index = 80;
        this._log = Oskari.log(className);
        this.loc = Oskari.getMsg.bind(null, 'CameraControls3d');
        this._mountPoint = jQuery('<div class="mapplugin camera-controls-3d"><div></div></div>');
    }, {
        getName: function () {
            return className;
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
            if (this.getElement()) {
                this.teardownUI();
            }
            this._createUI(mapInMobileMode);
        },
        teardownUI: function (mapInMobileMode) {
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
                this._addToPluginContainer();
            }
            ReactDOM.render(
                <LocaleContext.Provider value={this.loc}>
                    <CameraControls3d mapInMobileMode={mapInMobileMode}/>
                </LocaleContext.Provider>, this._element.get(0));
        },
        _addToMobileToolBar () {
            const resetMapStateControl = jQuery('.toolbar_mobileToolbar').find('.mobile-reset-map-state');
            jQuery(this._element).insertAfter(resetMapStateControl);
        },
        _addToPluginContainer () {
            const panButtonsControl = jQuery('.mappluginsContent').find('.panbuttons');
            jQuery(this._element).insertAfter(panButtonsControl);
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
