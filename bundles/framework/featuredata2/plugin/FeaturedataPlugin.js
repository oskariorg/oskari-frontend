import React from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'oskari-ui';
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
    function () {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin';
        me._defaultLocation = 'top right';
        me._index = 100;
        me._name = 'FeaturedataPlugin';
        me._mapStatusChanged = true;
        me._flyoutOpen = undefined;
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
                this._instance = this.sandbox.findRegisteredModuleInstance('FeatureData2');
            }
            return this._instance;
        },
        _startPluginImpl: function () {
            this._element = this._createControlElement();
            this.addToPluginContainer(this.getElement());
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
            this.teardownUI();
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

        handleCloseFlyout: function () {
            if (!this._flyoutOpen) {
                return;
            }
            this._flyoutOpen = undefined;
            var flyout = this.getInstance().plugins['Oskari.userinterface.Flyout'];
            jQuery(flyout.container.parentElement.parentElement).removeClass('mobile');
            this.refresh();
        },
        /**
         * @method refresh
         * Updates the plugins interface (hides if no featuredata layer selected)
         */
        refresh: function () {
            this.setVisible(this._hasFeaturedataLayers());
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
                        icon={<Message messageKey='title' bundleKey='FeatureData2'/>}
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
        openFlyout: function () {
            const sandbox = this.getSandbox();
            if (!this._flyoutOpen) {
                if (this._mapStatusChanged) {
                    sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.getInstance(), 'detach']);
                    this._mapStatusChanged = false;
                } else {
                    sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.getInstance(), 'detach']);
                }
                this._flyoutOpen = true;
            } else {
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.getInstance(), 'close']);
                this._flyoutOpen = undefined;
            }
            this.refresh();
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
                AfterMapMoveEvent: function () {
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
                },
                MapLayerVisibilityChangedEvent: function () {
                    this.refresh();
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
