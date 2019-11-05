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
        me._active = false;
        me._timeouts = 0;
        me._dialog = null;
        me._mobileDefs = {
            buttons: {
                'mobile-my-location': {
                    iconCls: 'mobile-my-location',
                    tooltip: '',
                    sticky: false,
                    show: true,
                    callback: function (el) {
                        me._toggleMode();
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };

        me._templates = {
            plugin: jQuery('<div class="mapplugin mylocationplugin toolstyle-rounded-dark"><div class="icon"></div></div>')
        };

        me._currentMode = null;
    }, {
        /**
         * @private @method _createControlElement
         * Creates the DOM element that will be placed on the map
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            var me = this,
                el = me._templates.plugin.clone();
            me._loc = Oskari.getLocalization('MapModule', Oskari.getLang() || Oskari.getDefaultLanguage()).plugin.MyLocationPlugin;
            el.on('click', function () {
                me._toggleMode();
            });

            el.attr('title', me._loc.tooltip);

            return el;
        },

        /**
         * @private @method _setLayerToolsEditModeImpl
         *
         *
         */
        _setLayerToolsEditModeImpl: function () {
            var me = this;
            if (!me.getElement()) {
                return;
            }
            if (me.inLayerToolsEditMode()) {
                // disable icon
                me.getElement().off('click');
            } else {
                // enable icon
                me.getElement().on('click', function () {
                    me._setupLocation();
                });
            }
        },
        _setActive: function (bln) {
            this._active = !!bln;
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
        /**
         * @public @method refresh
         *
         *
         */
        refresh: function () {
            var me = this,
                conf = me.getConfig();

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                if (toolStyle !== null && toolStyle !== undefined) {
                    me.changeToolStyle(toolStyle, me.getElement());
                }
            }
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style || 'rounded-dark');

            me.changeCssClasses(styleClass, /^toolstyle-/, [el]);
        },

        /**
         * @private @method _setupLocation
         * Tries to get the geolocation from browser and move the map to the
         * location
         *
         */
        _setupLocation: function () {
            if (this._active) {
                return; // already requested and waiting response
            }
            this._setActive(true);
            this._requestLocation();
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
            if (!this.isVisible() || !this.isEnabled()) {
                // no point in drawing the ui if we are not visible or enabled
                return;
            }
            var me = this;
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                me._element = me._createControlElement();
                me.refresh();
                this.addToPluginContainer(me._element);
            }

            this._handleStartMode();
        },
        teardownUI: function () {
            this.removeFromPluginContainer(this.getElement());
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },

        /**
         * @public @method isEnabled
         * Are the plugin's controls enabled
         * @param {Boolean} showOnlyMobile force show only mobile state
         *
         * @return {Boolean}
         * True if plugin's tools are enabled
         */
        isEnabled: function (showOnlyMobile) {
            var conf = this.getConfig();
            var mobileOnly = showOnlyMobile || conf.mobileOnly;

            if (mobileOnly === true && !Oskari.util.isMobile(true)) {
                return false;
            }
            return this._enabled;
        },

        /**
         * Toggle mode continues/single or if not plugin is not configured continues mode then use only single mode.
         * @method @private _toggleMode
         */
        _toggleMode: function () {
            var conf = this.getConfig();

            // If plugin configured to use continuous mode and current mode is "continuous" then toggle mode to single
            // (not draw user location and accurary circle and center map to user location)
            if (conf.mode === 'continuous' && this._currentMode === 'continuous') {
                this._currentMode = 'single';
                this._stopTracking();
                this._setupLocation();
            }
            // else if plugin is configured continuous mode and current toggled mode is "single" then toggle mode to continuous.
            else if (conf.mode === 'continuous' && this._currentMode === 'single') {
                this._currentMode = 'continuous';
                this._startTracking();
            }
            // else if not plugin is not configured to continuous moden then use like "single"
            else {
                this._stopTracking();
                this._setupLocation();
            }
        },
        /**
         * Start tracking.
         * @method @private _startTracking
         */
        _startTracking: function () {
            var conf = this.getConfig();
            var sandbox = this.getSandbox();
            if (conf.centerMapAutomatically === true) {
                sandbox.postRequestByName('StartUserLocationTrackingRequest', [{ addToMap: 'location', centerMap: 'single' }]);
            } else {
                sandbox.postRequestByName('StartUserLocationTrackingRequest', [{ addToMap: 'location' }]);
            }
        },
        /**
         * Stop tracking.
         * @method @private _stopTracking
         */
        _stopTracking: function () {
            var sandbox = this.getSandbox();
            sandbox.postRequestByName('StopUserLocationTrackingRequest');
        },

        /**
         * Handle plugin start mode
         * @private @method _handleStartMode
         */
        _handleStartMode: function () {
            var me = this;
            var conf = this.getConfig();

            if (conf.mode === 'continuous') {
                me._currentMode = 'continuous';
                me._startTracking();
            } else if (conf.centerMapAutomatically === true) {
                me._currentMode = 'single';
                me._setupLocation();
            }
            return true;
        },
        /**
         * @method _stopPluginImpl BasicMapModulePlugin method override
         * @param {Oskari.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.teardownUI();
        },
        /**
         * Checks at if device is outside of map viewport when mode is tracking.
         * If it is then move map to show device location.
         * @param {Double} lon
         * @param {Double} lat
         */
        _checkIfOutsideViewport (lon, lat) {
            var sandbox = this.getSandbox();
            if (!this.isEnabled() || this._currentMode === 'single') {
                // skip checking
                return;
            }
            var bbox = sandbox.getMap().getBbox();
            if (lon < bbox.left || lon > bbox.right || lat > bbox.top || lat < bbox.bottom) {
                // outside view port, center map again
                sandbox.postRequestByName('MapMoveRequest', [lon, lat]);
            }
        },
        _createEventHandlers: function () {
            return {
                UserLocationEvent: (event) => {
                    this._checkIfOutsideViewport(event.getLon(), event.getLat());

                    if (!this._active) {
                        return;
                    }
                    var error = event.getError();
                    if (error) {
                        if (this._dialog) {
                            this._dialog.close();
                        }
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        if (error === 'denied') {
                            var btn = dialog.createCloseButton(this._loc.error.button);
                            dialog.show(this._loc.error.title, this._loc.error.denied, [btn]);
                            this._setActive(false);
                        } else if (error === 'unavailable') {
                            dialog.fadeout();
                            dialog.show(this._loc.error.title, this._loc.error.noLocation);
                            this._setActive(false);
                        // timeouts
                        } else {
                            this._timeouts++;
                            if (this._timeouts === 1) {
                                dialog.fadeout(5000);
                                dialog.show('', this._loc.error.timeout);
                                // request high accuracy location with longer timeout
                                this._requestLocation(20000);
                            } else if (this._timeouts === 2) {
                                // request low accuracy location
                                this._requestLocation(6000, false);
                            } else {
                                // show error and stop requesting location
                                dialog.fadeout();
                                dialog.show(this._loc.error.title, this._loc.error.noLocation);
                                this._setActive(false);
                            }
                        }
                        this._dialog = dialog;
                    } else {
                        // success
                        this._setActive(false);
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
