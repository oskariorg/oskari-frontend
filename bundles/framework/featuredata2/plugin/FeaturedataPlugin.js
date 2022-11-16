import React from 'react';
import ReactDOM from 'react-dom';
import { FeatureDataButton } from './FeatureDataButton';

/**
 * @class Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config) {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin';
        me._defaultLocation = 'top right';
        me._instance = config.instance;
        me._index = 100;
        me._name = 'FeaturedataPlugin';
        me._mapStatusChanged = true;
        me._flyoutOpen = undefined;
        me.inMobileMode = false;
    }, {
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                el = jQuery('<div class="mapplugin featuredataplugin">' +
                    '</div>');
            me._loc = Oskari.getLocalization('FeatureData2', Oskari.getLang() || Oskari.getDefaultLanguage(), true);

            return el;
        },
        /**
         * @method _hasFeaturedataLayers
         * @private
         * Check whether there are layers with featuredata present -> determine the control element's visibility
         */
        _hasFeaturedataLayers: function () {
            var me = this,
                sandbox = me.getMapModule().getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                i;
            // see if there's any wfs layers, show element if so
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData()) {
                    return true;
                }
            }
            return false;
        },
        _setLayerToolsEditModeImpl: function () {
            var me = this,
                el = me.getElement();
            if (!el) {
                return;
            }
            if (this.inLayerToolsEditMode()) {
                this.renderButton(null, el, true);
            } else {
                this.renderButton(null, el);
            }
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            var isMobile = mapInMobileMode || Oskari.util.isMobile();
            var me = this;

            this.teardownUI();

            this.inMobileMode = isMobile;

            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
            this.refresh();
        },

        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
            this._instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'close']);
        },

        /**
         * @method  @public mapStatusChanged map status changed
         * @param  {Boolean} changed is map status changed
         */
        mapStatusChanged: function (changed = true) {
            this._mapStatusChanged = changed;
        },

        getMapStatusChanged: function () {
            return this._mapStatusChanged;
        },

        handleCloseFlyout: function () {
            var me = this;

            if (!me._flyoutOpen) {
                return;
            }
            me._flyoutOpen = undefined;
            var flyout = me._instance.plugins['Oskari.userinterface.Flyout'];
            jQuery(flyout.container.parentElement.parentElement).removeClass('mobile');
            this.renderButton(null, null);
        },
        /**
         * @method refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            var me = this;
            var conf = me._config || {};

            me.setVisible(me._hasFeaturedataLayers());

            // Change the style if in the conf
            if (conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            this.renderButton(style, div);
        },
        renderButton: function (style, element, disabled = false, loading = false) {
            let el = element;
            if (!element) {
                el = this.getElement();
            }
            if (!el) return;

            let styleName = style;
            if (!style) {
                style = this.getToolStyleFromMapModule();
            }

            ReactDOM.render(
                <FeatureDataButton
                    icon={<span>{this._loc.title}</span>}
                    title={this._loc.title}
                    onClick={() => this.openFlyout()}
                    styleName={styleName}
                    disabled={disabled}
                    active={this._flyoutOpen}
                    loading={loading}
                    position={this.getLocation()}
                />,
                el[0]
            );
        },
        openFlyout: function () {
            if (!this.inLayerToolsEditMode()) {
                const sandbox = this.getSandbox();
                if (!this._flyoutOpen) {
                    if (this._mapStatusChanged) {
                        sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'detach']);
                        this._mapStatusChanged = false;
                    } else {
                        sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'detach']);
                    }
                    this._flyoutOpen = true;
                } else {
                    sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this._instance, 'close']);
                    this._flyoutOpen = undefined;
                }
            }
        },
        showLoadingIndicator: function (blnLoad) {
            if (blnLoad) {
                this.renderButton(null, null, false, true);
            } else {
                this.renderButton(null, null, false, false);
            }
        },
        showErrorIndicator: function (blnLoad) {
            if (!this.getElement()) {
                return;
            }
            if (blnLoad) {
                this.getElement().addClass('error');
            } else {
                this.getElement().removeClass('error');
            }
        },

        _createEventHandlers: function () {
            return {
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                AfterMapMoveEvent: function (event) {
                    this.refresh();
                }
            };
        },
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
