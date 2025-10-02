import React from 'react';
import { ZoomSlider } from './ZoomSlider';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 * Zoombar implementation with jQuery UI and refined graphics. Location can be configured,
 * but defaults on top of the map with placement details on the css-file.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPorttiZoombar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        // hackhack for old configs so we don't have to remove
        // with-panbuttons from them
        this._config = config;
        if (config && config.location && config.location.classes) {
            config.location.classes = config.location.classes.replace(
                'with-panbuttons',
                ''
            );
            this._config = config;
        }
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar';
        this._defaultLocation = 'top right';
        this._index = 30;
        this._name = 'Portti2Zoombar';
        this._suppressEvents = false;
        this._reactRoot = null;
    }, {
        /**
         * @private @method _createControlElement
         * Draws the zoombar on the screen.
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return jQuery('<div class="oskariui mapplugin pzbDiv zoombar"></div>');
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },

        /**
         * @public  @method _refresh
         * Called after a configuration change.
         */
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            this.getReactRoot(el[0]).render(
                <ZoomSlider
                    changeZoom={(value) => this.getMapModule().setZoomLevel(value)}
                    zoom={this.getMapModule().getMapZoom()}
                    maxZoom={this.getMapModule().getMaxZoomLevel()}
                    isMobile={Oskari.util.isMobile()}
                />
            );
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            var me = this;
            return {
                AfterMapMoveEvent: function () {
                    me.refresh();
                }
            };
        },
        teardownUI: function () {
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
            this.refresh();
            this.addToPluginContainer(me._element);
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
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
