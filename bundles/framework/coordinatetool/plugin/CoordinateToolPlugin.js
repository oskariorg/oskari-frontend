import React from 'react';
import ReactDOM from 'react-dom';
import { MapModuleButton } from '../../../mapping/mapmodule/MapModuleButton';
import { CoordinatePluginHandler } from './CoordinatePluginHandler';

/**
 * @class Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale || Oskari.getMsg.bind(null, 'coordinatetool');
        me._config = config || {};
        me._mapmodule = mapmodule || Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        me._sandbox = sandbox;
        me._instance = instance;
        me._messageDialog = null;
        me._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        me._coordinateTransformationExtension =
                    Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension',
                        instance, config, locale, mapmodule, sandbox);
        me._defaultLocation = 'top right';
        me._index = 60;
        me._name = 'CoordinateToolPlugin';
        me._toolOpen = false;
        me._showMouseCoordinates = false;
        me._showReverseGeocode = this._config ? this._config.isReverseGeocode : false;
        me._popup = null;
        me._latInput = null;
        me._lonInput = null;
        me._latLabel = null;
        me._lonLabel = null;
        me._centerToCoordsBtn = null;
        me._reverseGeocodeLabel = null;
        me._showReverseGeocodeCheckbox = false;
        me._dialog = null;
        me._projectionSelect = null;
        me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me._reverseGeocodeNotImplementedError = false;
        me._popupContent = null;
        me._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"></div>'),
            popupContent: jQuery(
                '<div>' +
                '   <div class="coordinatetool__popup__content"></div>' +
                '   <div class="srs"></div>' +
                '   <div class="lonlat-input-container">' +
                '       <div class="margintop">' +
                '           <div class="coordinate-label floatleft lat-label"></div>' +
                '           <div class="floatleft"><input type="text" class="lat-input"></input></div>' +
                '           <div class="clear"></div>' +
                '           <div class="coordinate-lat-container coordinate-container"></div>' +
                '       </div>' +
                '       <div class="margintop">' +
                '           <div class="coordinate-label floatleft lon-label"></div>' +
                '           <div class="floatleft"><input type="text" class="lon-input"></input></div>' +
                '           <div class="clear"></div>' +
                '           <div class="coordinate-lon-container coordinate-container"></div>' +
                '       </div>' +
                '       <div class="margintop mousecoordinates-div"><input type="checkbox" id="mousecoordinates"></input><label class="mousecoordinates-label" for="mousecoordinates"></label></div>' +
                '   </div>' +

                '   <div class="margintop reverseGeocodeContainer">' +
                '   </div>' +
                '   <div class="margintop coordinatedisplay-emergencycall" style="display:none;">' +
                '       <span class="coordinatedisplay-emergencycall-label"></span>' +
                '       <span class="coordinatedisplay-emergencycall degreesY"></span>&deg;' +
                '       <span class="coordinatedisplay-emergencycall minutesY"></span>\'' +
                '       <span class="coordinatedisplay-emergencycall-label-and"></span> ' +
                '       <span class="coordinatedisplay-emergencycall degreesX"></span>&deg;' +
                '       <span class="coordinatedisplay-emergencycall minutesX"></span>\' ' +
                '   </div>' +
                '</div>'),
            reverseGeocodeContainer: jQuery(
                '<div class="geocodeControl"> ' +
                  '<input id="reverseGeoCheckbox" class="reverseGeoCheckbox" type="checkbox" />' +
                  '<label class="reverseGeocodeInfoText" for="reverseGeoCheckbox"></label>' +
                  '<div class="reversegeocode-label reverseGeocode-label"></div>' +
                  '</div>'
            ),
            coordinateFormatDisplayY: jQuery(
                '<div class="coordinate-format-display-y">' +
                    '   <div class="coordinatedisplay-container">' +
                    '       <div class="margintop coordinatedisplay-degminy">' +
                    '           <span class="coordinatedisplay-degmin degreesY" style="text-align:center";></span>' +
                    '           <span class="coordinatedisplay-degmin minutesY" style="text-align:center";></span>' +
                    '           </br>  ' +
                    '       </div>' +
                    '       <div class="margintop coordinatedisplay-degy">' +
                    '           <span class="coordinatedisplay-deg degreesY" style="text-align:center";></span>' +
                    '           </br>  ' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
            ),
            coordinateFormatDisplayX: jQuery(
                '<div class="coordinate-format-display-x">' +
                    '   <div class="coordinatedisplay-container" >' +
                    '       <div class="margintop coordinatedisplay-degminx">' +
                    '           <span class="coordinatedisplay-degmin degreesX" style="text-align:center";></span>' +
                    '           <span class="coordinatedisplay-degmin minutesX" style="text-align:center";></span>' +
                    '           </br>  ' +
                    '       </div>' +
                    '       <div class="margintop coordinatedisplay-degx">' +
                    '           <span class="coordinatedisplay-deg degreesX" style="text-align:center";></span>' +
                    '           </br>  ' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
            )
        };
        me.spinnerStopTimer = null;
        // me.lastLonLat = null;
        me._decimalSeparator = Oskari.getDecimalSeparator();
        me._log = Oskari.log('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin');
        me.inMobileMode = false;
        me.handler = new CoordinatePluginHandler(me, me._mapmodule, me._config, me._instance);
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (this.inLayerToolsEditMode() && this.isOpen()) {
                this.handler.getController().showPopup();
            }
        },
        _showReverseGeocodeContainer: function (popupContent) {
            var me = this;

            var reverseArray = me._config.reverseGeocodingIds.split(',');
            var showReverseGeocodeCheckbox;

            if (reverseArray.length > 2) {
                showReverseGeocodeCheckbox = true;
            }
            if (showReverseGeocodeCheckbox) {
                var geocodeController = me._templates.reverseGeocodeContainer.clone();
                var geocodeContainer = popupContent.find('div.reverseGeocodeContainer');
                var reverseGeoCheckbox = geocodeController.find('input.reverseGeoCheckbox');
                var reverseGeocodeLabel = geocodeController.find('div.reverseGeocode-label');
                reverseGeocodeLabel.hide();
                geocodeController.find('label.reverseGeocodeInfoText').html(me._locale('display.reversegeocode.moreInfo'));
                reverseGeoCheckbox.on('change', function () {
                    if (this.checked) {
                        reverseGeocodeLabel.show();
                    } else {
                        reverseGeocodeLabel.hide();
                    }
                });
                geocodeContainer.append(geocodeController);
                me._reverseGeocodeLabel = reverseGeocodeLabel;
            } else {
                me._reverseGeocodeLabel = popupContent.find('div.reverseGeocodeContainer');
            }
        },
        _createControlElement: function () {
            var me = this,
                el = me._templates.coordinatetool.clone();

            if (me._config.noUI) {
                return null;
            }

            return el;
        },
        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
            if (this.handler) {
                this.handler.getController().popupCleanup();
            }
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.hasUI()) {
                return;
            }

            this.inMobileMode = mapInMobileMode;

            this.teardownUI();
            if (!this._config.noUI) {
                this._element = this._createControlElement();
                this.refresh();
                this.addToPluginContainer(this._element);
            }
        },

        hasUI: function () {
            return !this._config.noUI;
        },
        /**
         * Update reverse geocode value to inputs
         * @method  @private _updateReverseGeocode
         * @param  {Object} data lon and lat object {lonlat: { lat: 0, lon: 0}}
         */
        _updateReverseGeocode: function (data) {
            var me = this,
                locale = me._locale('display.reversegeocode'),
                service = me._instance.getService();

            if (me._toolOpen !== true || me._reverseGeocodeNotImplementedError === true) {
                return;
            }

            if (!data || !data.lonlat) {
                // update with map coordinates if coordinates not given
                data = me._getMapXY();
            }

            service.getReverseGeocode(
                // Success callback
                function (response) {
                    var hasResponse = !!((response && response.length > 0));

                    // type title is not found in locales
                    if (hasResponse && me._reverseGeocodeLabel && locale[response[0].channelId]) {
                        me._reverseGeocodeLabel.html('');
                        for (var i = 0; i < response.length; i++) {
                            var r = response[i];
                            var title = locale[r.channelId].label;
                            if (!title) {
                                title = r.type;
                            }
                            me._reverseGeocodeLabel.append('<div>' + title + '<u>' + r.name + '</u></div>');
                        }
                    }
                },
                // Error callback
                function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 501) {
                        me._reverseGeocodeNotImplementedError = true;
                    }
                    var messageJSON;
                    try {
                        messageJSON = jQuery.parseJSON(jqXHR.responseText);
                    } catch (err) {}
                    var message = me._instance.getName() + ': Cannot reverse geocode';
                    if (messageJSON && messageJSON.error) {
                        message = me._instance.getName() + ': ' + messageJSON.error;
                    }

                    Oskari.log('coordinatetool').warn(message);
                }, data.lonlat.lon, data.lonlat.lat);
        },
        /**
         * Updates the given coordinates to the UI
         * @method @public refresh
         *
         * @param {Object} data contains lat/lon information to show on UI
         */
        refresh: function (data) {
            const conf = this._config;
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                this.changeToolStyle(conf.toolStyle, this.getElement());
            } else {
                var toolStyle = this.getToolStyleFromMapModule();
                this.changeToolStyle(toolStyle, this.getElement());
            }

            return data;
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function () {
            return this._element;// jQuery('.mapplugin.coordinatetool');
        },
        /**
         * Create event handlers.
         * @method @private _createEventHandlers
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method RPCUIEvent
                 * will open/close coordinatetool's popup
                 */
                RPCUIEvent: function (event) {
                    var me = this;
                    if (event.getBundleId() === 'coordinatetool') {
                        me.handler.getController().showPopup();
                    }
                }
            };
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            const me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            const styleClass = style || 'rounded-dark';
            this.renderButton(styleClass, el);
        },

        renderButton: function (style, element) {
            let el = element;
            if (!element) {
                el = this.getElement();
            }
            if (!el) return;

            let styleName = style;
            if (!style) {
                styleName = this.getToolStyleFromMapModule();
            }

            const CoordinateIcon = () => (
                <div>XY</div>
            );

            ReactDOM.render(
                <MapModuleButton
                    className='t_coordinatetool'
                    title={this._locale('display.tooltip.tool')}
                    icon={<CoordinateIcon />}
                    styleName={styleName || 'rounded-dark'}
                    onClick={() => {
                        if (!this.inLayerToolsEditMode()) {
                            this.handler.getController().showPopup();
                        }
                    }}
                    iconActive={this.handler.getState().popupControls}
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
