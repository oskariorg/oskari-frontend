import React from 'react';
import ReactDOM from 'react-dom';
import { ZoomSlider } from './ZoomSlider';

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
        this.inMobileMode = false;
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

        /**
         * @public  @method _refresh
         * Called after a configuration change.
         */
        refresh: function () {
            this.renderButton();
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
                    me.renderButton();
                }
            };
        },
        _setLayerToolsEditModeImpl: function () {},
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} styleId
         * @param {jQuery} div
         *
         */
        changeToolStyle: function () {
            this.renderButton();
        },
        renderButton: function () {
            const el = this.getElement();
            if (!el) return;

            ReactDOM.render(
                <ZoomSlider
                    changeZoom={(value) => this.getMapModule().setZoomLevel(value)}
                    zoom={this.getMapModule().getMapZoom()}
                    maxZoom={this.getMapModule().getMaxZoomLevel()}
                    isMobile={this.inMobileMode}
                />,
                el[0]
            );
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

            this.inMobileMode = mapInMobileMode;

            me._element = me._createControlElement();
            this.renderButton();
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
