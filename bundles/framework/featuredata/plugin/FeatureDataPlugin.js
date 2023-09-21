import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
import { ThemeProvider } from 'oskari-ui/util';
import { FeatureDataPluginHandler } from './FeatureDataPluginHandler';
import { FEATUREDATA_WFS_STATUS } from '../view/FeatureDataContainer';
import { MapModuleTextButton } from '../../../mapping/mapmodule/MapModuleTextButton';

/**
 * @class Oskari.mapframework.bundle.featuredata.plugin.FeatureDataPlugin
 * Provides WFS grid link on top of map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.plugin.FeatureDataPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function () {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.featuredata.plugin.FeatureDataPlugin';
        me._defaultLocation = 'top right';
        me._index = 100;
        me._name = 'FeaturedataPlugin';
        me._mapStatusChanged = true;
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
            this.handler.updateStateAfterMapEvent();
        },
        renderButton: function (loading = false) {
            const el = this.getElement();
            if (!el) {
                return;
            }
            const { flyoutOpen, layers, loadingStatus } = this.handler.getState();

            let marginRight = '0';
            let marginLeft = '0';
            const position = this.getLocation();
            if (position.includes('right')) {
                marginRight = '10';
            } else if (position.includes('left')) {
                marginLeft = '10';
            }

            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <MapModuleTextButton
                        visible={layers?.length > 0}
                        text={<Message messageKey='title' bundleKey='FeatureData'/>}
                        onClick={() => this.handler.openFlyout()}
                        active={flyoutOpen}
                        loading={loadingStatus.loading}
                        position={this.getLocation()}
                        $marginRight={marginRight}
                        $marginLeft={marginLeft}
                        $marginTop={'10'}
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
                MapMoveStartEvent: function () {
                    // reset our own bookkeeping for layer statuses on each map move since we
                    // can't rely on OpenLayers telling us about each status change
                    this.handler.updateLoadingStatus({}, false);
                },
                AfterMapMoveEvent: function () {
                    this.handler.updateStateAfterMapEvent();
                },
                AfterMapLayerAddEvent: function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.handler.updateStateAfterMapEvent();
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    if (event.getMapLayer().hasFeatureData()) {
                        this.handler.updateStateAfterMapEvent();
                    }
                },
                MapLayerVisibilityChangedEvent: function () {
                    this.handler.updateStateAfterMapEvent();
                },
                WFSFeaturesSelectedEvent: function (event) {
                    this.handler.updateSelectedFeatures(event.getMapLayer().getId(), event.getWfsFeatureIds());
                },
                WFSStatusChangedEvent: function (event) {
                    if (event.getLayerId() === undefined) {
                        return;
                    }
                    const { loadingStatus } = this.handler.getState();
                    if (event.getStatus() === event.status.loading) {
                        loadingStatus['' + event.getLayerId()] = FEATUREDATA_WFS_STATUS.loading;
                        this.renderButton(true);
                    }

                    if (event.getStatus() === event.status.complete) {
                        delete loadingStatus['' + event.getLayerId()];
                    }

                    if (event.getStatus() === event.status.error) {
                        if (loadingStatus.hasOwnProperty('' + event.getLayerId())) {
                            loadingStatus['' + event.getLayerId()] = FEATUREDATA_WFS_STATUS.error;
                        }
                    }
                    const layersStillLoading = !!Object.keys(loadingStatus).find(key => loadingStatus[key] && loadingStatus[key] === FEATUREDATA_WFS_STATUS.loading);
                    loadingStatus.loading = layersStillLoading;
                    // wfs status changed -> also update features / columns etc.
                    this.handler.updateLoadingStatus(loadingStatus, true);
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
