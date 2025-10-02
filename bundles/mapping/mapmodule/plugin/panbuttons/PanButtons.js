import React from 'react';
import { PanButton } from './PanButton';
import { showResetPopup } from '../../MapResetPopup';
import { ThemeProvider } from 'oskari-ui/util/contexts';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a
 * state reset button.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons';
        this._defaultLocation = 'top right';
        this._index = 20;
        this._name = 'PanButtons';
        this._panPxs = 100;
        this.showArrows = !!this.getConfig().showArrows;
        this.resetPopup = null;
        this._reactRoot = null;
    }, {
        /**
         * @private @method _createControlElement
         * Draws the panbuttons on the screen.
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            const el = jQuery(
                '<div class="mapplugin panbuttonDiv panbuttons"></div>'
            );
            return el;
        },
        clearPopup: function () {
            if (this.resetPopup) {
                this.resetPopup.close();
            }
            this.resetPopup = null;
        },
        _resetClicked: function () {
            if (this.resetPopup) return;
            const cb = () => {
                if (this.getSandbox().hasHandler('StateHandler.SetStateRequest')) {
                    this.getSandbox().postRequestByName('StateHandler.SetStateRequest');
                } else {
                    this.getSandbox().resetState();
                }
            };
            this.resetPopup = showResetPopup(() => cb(), () => this.clearPopup());
        },
        _panClicked: function (x, y) {
            const pxX = this._panPxs * x;
            const pxY = this._panPxs * y;
            this.getMapModule().panMapByPixels(pxX, pxY, true);
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
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <PanButton
                        resetClicked={() => this._resetClicked()}
                        panClicked={(x, y) => this._panClicked(x, y)}
                        isMobile={Oskari.util.isMobile()}
                        showArrows={this.showArrows}
                    />
                </ThemeProvider>
            );
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

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            this.teardownUI();
            this._element = this._createControlElement();
            this.refresh();
            this.addToPluginContainer(this._element);
        },
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
        },
        /**
         * @method setShowArrows
         * @param {Boolean} showArrows
         */
        setShowArrows: function (showArrows) {
            this.setConfig({
                ...this.getConfig(),
                showArrows: !!showArrows
            });
            this.showArrows = !!showArrows;
            this.refresh();
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
