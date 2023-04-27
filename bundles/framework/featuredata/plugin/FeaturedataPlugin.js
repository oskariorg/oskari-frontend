import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
import { ThemeProvider } from 'oskari-ui/util';
import { FeatureDataButton } from './FeatureDataButton';
import { showFlyout } from '../../../../src/react/components/window';
import { FeatureDataContainer } from '../view/FeatureDataContainer';
import { Table, getSorterFor } from '../../../../src/react/components/Table';

export const FEATUREDATA_DEFAULT_HIDDEN_FIELDS = ['__fid', '__centerX', '__centerY', 'geometry'];

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
        me._flyoutController = undefined;
        me._mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    }, {
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
                this._instance = this.sandbox.findRegisteredModuleInstance('FeatureData');
            }
            return this._instance;
        },
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
        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
            const instance = this.getInstance();
            instance.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [instance, 'close']);
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
            this.renderButton();
        },
        showLoadingIndicator: function (blnLoad) {
            this.renderButton(!!blnLoad);
        },
        renderButton: function (loading = false) {
            const el = this.getElement();
            if (!el) {
                return;
            }

            ReactDOM.render(
                <ThemeProvider value={this.getMapModule().getMapTheme()}>
                    <FeatureDataButton
                        visible={this._hasFeaturedataLayers()}
                        icon={<Message messageKey='title' bundleKey='FeatureData'/>}
                        onClick={() => this.openFlyout()}
                        active={this._flyoutOpen}
                        loading={loading}
                        position={this.getLocation()}
                    />
                </ThemeProvider>,
                el[0]
            );
        },
        resetUI: function () {
            if (this._flyoutOpen) {
                // actually closes flyout when it's open...
                this.openFlyout();
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
        _getFeatureDataLayers: function () {
            return this.getSandbox()
                .findAllSelectedMapLayers()
                .filter(layer => layer.isVisibleOnMap() && layer.hasFeatureData && layer.hasFeatureData());
        },
        _getFeaturesByLayerId: function (layerId) {
            const featuresMap = this._mapmodule.getVectorFeatures(null, { layers: [layerId] });
            return featuresMap && featuresMap[layerId] ? featuresMap[layerId].features : null;
        },
        _createTabContentFromFeatures: function (features) {
            if (!features || !features.length) {
                return null;
            }
            const columnSettings = this._createColumnSettingsFromFeatures(features);
            const featureTable = <Table
                columns={ columnSettings }
                size={ 'large '}
                dataSource={ features.map(feature => {
                    return {
                        key: feature.properties.__fid,
                        ...feature.properties
                    };
                })}
                pagination={{ position: ['none', 'none'] }}
            />;

            return featureTable;
        },
        _createColumnSettingsFromFeatures: function (features) {
            return Object.keys(features[0].properties)
                .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key))
                .map(key => {
                    return {
                        align: 'left',
                        title: key,
                        dataIndex: key,
                        sorter: getSorterFor(key)
                    };
                });
        },
        _createTabs: function () {
            const featureDataLayers = this._getFeatureDataLayers() || null;
            const layerId = featureDataLayers && featureDataLayers.length ? featureDataLayers[0].getId() : null;
            const features = layerId ? this._getFeaturesByLayerId(layerId) : null;
            const tabs = featureDataLayers.map(layer => {
                return {
                    key: layer.getId(),
                    label: layer.getName(),
                    children: null
                };
            });
            // set features for the first tab
            if (tabs && tabs.length) {
                tabs[0].children = this._createTabContentFromFeatures(features);
            }

            return tabs;
        },
        openFlyout: function () {
            if (this._flyoutController) {
                this._flyoutController.close();
                return;
            }
            const tabs = this._createTabs();
            const content = <FeatureDataContainer tabs = { tabs }/>;
            this._flyoutController = showFlyout('Feature data flyout', content, () => { this._flyoutController = null; }, {});

            this.refresh();
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
