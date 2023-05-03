import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
import { ThemeProvider } from 'oskari-ui/util';
import { FeatureDataButton } from './FeatureDataButton';
import { FeatureDataPluginHandler } from './FeatureDataPluginHandler';

/**
 * @class Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function () {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin';
        me._defaultLocation = 'top right';
        me._index = 100;
        me._name = 'FeaturedataPlugin';
        me._mapStatusChanged = true;
        me._flyoutOpen = undefined;
    }, {
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
        },
        /**
         * @method _createControlElement
         * @private
         * Creates container for UI for feature data plugin
         */
        _createControlElement: function () {
            return jQuery('<div class="mapplugin featuredataplugin"></div>');
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            this.refresh();
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
        /**
         * @method refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            if (!this.handler) {
                this.handler = new FeatureDataPluginHandler(this.getMapModule());
                this.handler.addStateListener(() => {
                    this.renderButton();
                });
            }
            this.renderButton();
            this.handler.getController().updateStateAfterMapEvent();
        },
        showLoadingIndicator: function (blnLoad) {
            this.renderButton(!!blnLoad);
        },
        renderButton: function (loading = false) {
            const el = this.getElement();
            if (!el) {
                return;
            }
            const { flyoutOpen, layers } = this.handler.getState();
            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <FeatureDataButton
                        visible={layers?.length > 0}
                        icon={<Message messageKey='title' bundleKey='FeatureData'/>}
                        onClick={() => this.handler.openFlyout()}
                        active={flyoutOpen}
                        loading={loading}
                        position={this.getLocation()}
                    />
                </ThemeProvider>,
                el[0]
            );
        },
        resetUI: function () {
            if (this.handler) {
                this.handler.closeFlyout();
            }
        },
        /**
         * @method _hasFeaturedataLayers
         * @private
         * Check whether there are layers with featuredata present -> determine the control element's visibility
         */
        _hasFeaturedataLayers: function () {
            // see if there's any wfs layers, show element if so
            return this.getSandbox()
                .findAllSelectedMapLayers()
                .filter(layer => layer.isVisibleOnMap())
                .some(layer => layer.hasFeatureData && layer.hasFeatureData());
        },
        _createEventHandlers: function () {
            return {
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                AfterMapMoveEvent: function () {
                    this.refresh();
                },
                /**
                 * @method AfterMapLayerAddEvent
                 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
                 *
                 * Calls flyouts layerAdded() method
                 */
                AfterMapLayerAddEvent: function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.refresh();
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.refresh();
                    }
                },
                MapLayerVisibilityChangedEvent: function () {
                    this.refresh();
                }
            };
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    });
