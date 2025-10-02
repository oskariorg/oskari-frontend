import React from 'react';
import { AimOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.mappublished.MyLocationPlugin
 *
 * Tries to locate the user by using HTML5 GeoLocation services or tries a
 * fallback to http://dev.maxmind.com/geoip/javascript GeoIP if GeoLocation is
 * not available.
 * Centers the map on the users location if location is determined successfully.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin';
        me._defaultLocation = 'top right';
        me._index = 40;
        me._name = 'MyLocationPlugin';
        this.loc = Oskari.getMsg.bind(null, 'MapModule');
        me._dialog = null;
        me._defaultIconCls = null;

        me._templates = {
            plugin: jQuery('<div class="mapplugin mylocationplugin"></div>')
        };
        this._waiting = false; // used with single location request
        this._timeouts = 0; // timeouts for single location request
        this._tracking = false;
        this._trackingOptions = null;
        this._reactRoot = null;
    }, {
        /**
         * @private @method _createControlElement
         * Creates the DOM element that will be placed on the map
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            return this._templates.plugin.clone();
        },
        /**
         * @private @method _setWaiting
         *
         */
        _setWaiting: function (bln) {
            this._waiting = !!bln;
            this._timeouts = 0;
            var el = this.getElement();
            if (!el) {
                return;
            }
            if (bln) {
                el.addClass('disabled');
            } else {
                el.removeClass('disabled');
            }
        },
        _setTracking: function (bln) {
            this._tracking = bln;
        },
        _clearRequests: function () {
            this._setWaiting(false);
            this._setTracking(false);
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
                    visible={this.isEnabled()}
                    className='t_mylocation'
                    icon={<AimOutlined />}
                    title={this.loc('plugin.MyLocationPlugin.tooltip')}
                    onClick={() => this._setupRequest()}
                    position={this.getLocation()}
                />
            );
        },

        /**
         * @private @method _setupRequest
         * Tries to get the geolocation from browser and move the map to the
         * location
         *
         */
        _setupRequest: function () {
            const opts = this._trackingOptions;
            const sb = Oskari.getSandbox();
            if (opts) {
                if (this._tracking) {
                    sb.postRequestByName('StopUserLocationTrackingRequest');
                    this._setTracking(false);
                } else {
                    sb.postRequestByName('StartUserLocationTrackingRequest', [opts]);
                    this._setTracking(true);
                }
            } else if (!this._waiting) {
                this._requestLocation();
                this._setWaiting(true);
            }
        },
        _requestLocation: function (timeout, highAccuracy) {
            const conf = this.getConfig();
            const options = {
                timeout: timeout || 2000,
                enableHighAccuracy: highAccuracy !== false
                // addToMap: highAccuracy !== false // or always true
                // TODO how user can clear location from map??
            };
            if (conf.zoom !== undefined) {
                options.zoomLevel = conf.zoom;
            }
            Oskari.getSandbox().postRequestByName('MyLocationPlugin.GetUserLocationRequest', [true, options]);
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            this.refresh();
        },
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * @public @method isEnabled
         * Are the plugin's controls enabled
         * @param {Boolean} showOnlyMobile force show only mobile state
         *
         * @return {Boolean}
         * True if plugin's tools are enabled
         */
        isEnabled: function () {
            var { mobileOnly } = this.getConfig() || {};
            if (mobileOnly === true && !Oskari.util.isMobile(true)) {
                return false;
            }
            return true;
        },

        /**
         * Handle plugin start mode
         * @private @method _handleStartMode
         */
        _handleStartMode: function () {
            if (!this.isEnabled()) {
                return;
            }
            const conf = this.getConfig();
            const centerMap = conf.centerMapAutomatically === true;
            if (conf.mode === 'continuous') {
                const opts = {
                    addToMap: 'location'
                };
                if (centerMap) {
                    opts.centerMap = 'single';
                }
                this._trackingOptions = opts;
            }
            if (centerMap) {
                // single location request on startup, use 30s timeout (browser may ask permission)
                // don't set waiting -> doesn't show errors or chain requests with different accuracy & timeouts
                this._requestLocation(30000);
            }
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function () {
            this.teardownUI();
        },
        _startPluginImpl: function () {
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
            this._handleStartMode();
        },
        /**
         * Checks at if device is outside of map viewport when mode is tracking.
         * If it is then move map to show device location.
         * @param {Double} lon
         * @param {Double} lat
         */
        _checkIfOutsideViewport (lon, lat) {
            var sandbox = this.getSandbox();
            var bbox = sandbox.getMap().getBbox();
            if (lon < bbox.left || lon > bbox.right || lat > bbox.top || lat < bbox.bottom) {
                // outside view port, center map again
                sandbox.postRequestByName('MapMoveRequest', [lon, lat]);
            }
        },
        _handleError: function (error) {
            if (this._dialog) {
                this._dialog.close();
            }
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const title = this.loc('plugin.MyLocationPlugin.error.title');
            let msg;
            this._dialog = dialog;

            if (error === 'denied') {
                msg = this.loc('plugin.MyLocationPlugin.error.denied');
                dialog.show(title, msg, [dialog.createCloseButton()]);
                this._clearRequests();
                return;
            }
            // Location denied only has close button, other messages fades out
            dialog.fadeout();
            msg = this.loc('plugin.MyLocationPlugin.error.noLocation');
            if (error === 'unavailable') {
                dialog.show(title, msg);
                this._clearRequests();
                return;
            }
            // timeout handling for single request
            if (this._waiting && this._timeouts < 2) {
                this._timeouts++;
                if (this._timeouts === 1) {
                    msg = this.loc('plugin.MyLocationPlugin.error.timeout');
                    dialog.show('', this._loc.error.timeout);
                    // request high accuracy location with longer timeout
                    this._requestLocation(20000);
                } else if (this._timeouts === 2) {
                    // request low accuracy location
                    this._requestLocation(6000, false);
                }
                return;
            }
            // show no location error and stop requests
            dialog.show(title, msg);
            this._clearRequests();
        },

        _createEventHandlers: function () {
            return {
                UserLocationEvent: (event) => {
                    if (!this._tracking && !this._waiting) {
                        return;
                    }
                    const error = event.getError();
                    if (error) {
                        this._handleError(error);
                        return;
                    }
                    // success
                    if (this._tracking) {
                        this._checkIfOutsideViewport(event.getLon(), event.getLat());
                    } else {
                        this._setWaiting(false);
                    }
                }
            };
        }
    }, {
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
