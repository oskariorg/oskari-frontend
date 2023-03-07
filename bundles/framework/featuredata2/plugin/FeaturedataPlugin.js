import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'oskari-ui/util';
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
            if (!this.getElement()) {
                return;
            }
            if (this.inLayerToolsEditMode()) {
                this.renderButton(true);
            } else {
                this.renderButton();
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
            this.renderButton();
        },
        /**
         * @method refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            this.setVisible(this._hasFeaturedataLayers());
            this.renderButton();
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         */
        changeToolStyle: function () {
            this.renderButton();
        },
        renderButton: function (disabled = false, loading = false) {
            const el = this.getElement();
            if (!el) return;

            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <FeatureDataButton
                        icon={<span>{this._loc.title}</span>}
                        onClick={() => this.openFlyout()}
                        disabled={disabled}
                        active={this._flyoutOpen}
                        loading={loading}
                        position={this.getLocation()}
                    />
                </ThemeProvider>,
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
            this.renderButton();
        },
        showLoadingIndicator: function (blnLoad) {
            if (blnLoad) {
                this.renderButton(false, true);
            } else {
                this.renderButton(false, false);
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
                },
                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Calls flyouts layerAdded() method
                 */
                'AfterMapLayerAddEvent': function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.refresh();
                    }
                },
                'AfterMapLayerRemoveEvent': function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.refresh();
                    }
                }
            };
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
