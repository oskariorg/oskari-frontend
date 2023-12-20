import React from 'react';
import ReactDOM from 'react-dom';
import { SwipeIcon } from 'oskari-ui/components/icons';
import { MapModuleButton } from '../../mapmodule/MapModuleButton';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin
 *
 * Provides mapmodule button for the swipe tool
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginLayerSelectionPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (config) {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin';
        me._defaultLocation = 'top left';
        me._index = 70;
        me._name = 'LayerSwipePlugin';

        me.initialSetup = true;
        me.templates = {};
        me._active = this.getConfig()?.autoStart || false;
    }, {
        _toggleToolState: function (active) {
            this.getInstance()?.setActive(active);
            this._active = active;
            this.refresh();
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         */
        _initImpl: function () {
            var me = this;
            me._loc = Oskari.getLocalization('LayerSwipe', Oskari.getLang() || Oskari.getDefaultLanguage(), true);
            me.templates.main = jQuery(
                '<div class="mapplugin layerswipe"></div>');
        },
        resetUI: function () {},
        getInstance: function () {
            // we only need instance here since the flyout is operated by the instance
            // TODO: we should move the flyout related code to this plugin
            if (!this._instance) {
                if (!this.sandbox) {
                    // wacky stuff we do since sandbox might be provided
                    // by mapmodule or not depending if the plugin has been started etc
                    this.sandbox = this.getSandbox();
                }
                if (!this.sandbox) {
                    // just get a ref to sandbox since we really need it here to get the instance (see TODO above)
                    this.sandbox = Oskari.getSandbox();
                }
                this._instance = this.sandbox.findRegisteredModuleInstance('LayerSwipe');
            }
            return this._instance;
        },
        setAutoStart: function (value) {
            const old = this.getConfig();
            this.setConfig({
                ...old,
                autoStart: value
            });
        },
        setHideUI: function (value) {
            const old = this.getConfig();
            this.setConfig({
                ...old,
                hideUI: value
            });
        },
        /**
         * @private @method  _createControlElement
         * Creates the whole ui from scratch and writes the plugin in to the UI.
         * Tries to find the plugins placeholder with 'div.mapplugins.left' selector.
         * If it exists, checks if there are other bundles and writes itself as the first one.
         * If the placeholder doesn't exist the plugin is written to the mapmodules div element.
         */
        _createControlElement: function () {
            const el = this.templates.main.clone();
            return el;
        },

        teardownUI: function () {
            // remove old element
            this._toggleToolState(false);
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible() || !this.isEnabled()) {
                // no point in drawing the ui if we are not visible
                return;
            }

            this.teardownUI();
            this._element = this._createControlElement();
            this.refresh();
            this.addToPluginContainer(this._element);
        },

        refresh: function () {
            let el = this.getElement();
            if (!el) {
                return;
            }

            ReactDOM.render(
                <MapModuleButton
                    className='t_layerswipe'
                    icon={<SwipeIcon />}
                    visible={!this.getConfig()?.hideUI}
                    title={this._loc.toolLayerSwipe}
                    onClick={(e) => this._toggleToolState(!this._active)}
                    iconActive={this._active ? true : false}
                    position={this.getLocation()}
                />,
                el[0]
            );
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
