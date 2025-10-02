import React from 'react';
import { ZoomOutOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PinchZoomReset
 *
 * Displays a button to reset pinch zoom on top of the map.
 *
 * This solves the situation where the user has pinch zoomed in so that no other elements besides the map itself are no longer accessible.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PinchZoomResetPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        const me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.PinchZoomResetPlugin';
        me._defaultLocation = 'top center';
        me._index = 1;
        me._name = 'PinchZoomResetPlugin';
        me._element = null;
        me.state = {};
        me._sandbox = null;
        this.setVisible(this.isZoomedIn());
        me._templates = {
            plugin: jQuery('<div class="mapplugin pinchzoomresetcontainer"></div>')
        };
        // store to keep reference to function to allow removing
        this.handler = () => this.reposition();
        this._reactRoot = null;
    },
    {
        /**
         * Check whether the visual viewports dimensions differ from those of the actual windows size = the page is pinched in.
         * @method isZoomedIn
         *
         * @return {Boolean} true if page is zoomed in
         */
        isZoomedIn: function () {
            return parseInt(window.innerWidth) !== parseInt(window.visualViewport.width) || parseInt(window.innerHeight) !== parseInt(window.visualViewport.height);
        },

        /**
         * Adjust the location of the button according to the changed visual viewports dimensions after resize or scroll
         * @method isZoomedIn
         *
         * @return {Boolean} true if page is zoomed in
         */
        reposition: function () {
            const jQueryElement = this.getElement();
            if (!jQueryElement) {
                return;
            }
            if (!this.isZoomedIn()) {
                this.setVisible(false);
                this.refresh();
                return;
            }

            if (!this.isVisible() && this.isZoomedIn()) {
                this.setVisible(true);
                this.refresh();
            }
            jQueryElement.css('position', 'fixed');
            jQueryElement.css('top', window.visualViewport.offsetTop + 'px');
            jQueryElement.css('left', window.visualViewport.width / 2 + window.visualViewport.offsetLeft + 'px');
            jQueryElement.css('transform', 'translate(-50%)');
        },
        /**
         * @method _createControlElement
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return this._templates.plugin.clone();
        },
        /**
         * @method _startPluginImpl
         */
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this._setEventListeners(true);
            this.refresh();
            if (this.isVisible()) {
                this.reposition();
            }
        },
        _setEventListeners: function (enabled) {
            if (enabled) {
                window.visualViewport.addEventListener('resize', this.handler);
                window.visualViewport.addEventListener('scroll', this.handler);
            } else {
                window.visualViewport.removeEventListener('resize', this.handler);
                window.visualViewport.removeEventListener('scroll', this.handler);
            }
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @public @method refresh
         */
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }

            this.getReactRoot(el[0]).render(
                <MapModuleButton
                    className='t_pinchzoom_reset'
                    visible={this.isVisible()}
                    icon={<ZoomOutOutlined />}
                    iconSize='22px'
                    onClick={() => {
                        this.resetPinchZoom();
                    }}
                    position={this.getLocation()}
                />
            );
        },
        /**
         * @method _stopPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.removeFromPluginContainer(this.getElement());
            this._setEventListeners(false);
        },
        isVisible: function () {
            return Oskari.util.isMobile() && this._isVisible;
        },
        setVisible: function (visible) {
            this._isVisible = visible;
        },
        resetPinchZoom: function () {
            const metaTag = document.getElementsByName('viewport')[0];
            const previousValue = metaTag.content;
            // reset value (assuming value 'width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1')
            metaTag.content = '';
            // set back to initial value. (if this wasn't reset first and there already was a value in meta this would do nothing)
            metaTag.content = previousValue;
            this.setVisible(false);
            this.refresh();
        }
    },
    {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
