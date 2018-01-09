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
        me._locale = locale;
        me._config = config || {};
        me._mapmodule = mapmodule;
        me._sandbox = sandbox;
        me._instance = instance;
        me._messageDialog = null;
        me._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        me._coordinateTransformationExtension =
                    Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension',
                    instance, config, locale, mapmodule, sandbox);
        me._viewChangerExtension =
                    Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.ViewChangerExtension',
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
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"><div class="icon"></div></div>'),
            popupContent: jQuery(
                '<div>'+
                '   <div class="coordinatetool__popup__content"></div>'+
                '   <div class="srs"></div>'+
                '   <div class="lonlat-input-container">'+
                '       <div class="margintop">'+
                '           <div class="coordinate-label floatleft lat-label"></div>'+
                '           <div class="floatleft"><input type="text" class="lat-input"></input></div>'+
                '           <div class="clear"></div>'+
                '           <div class="coordinate-lat-container coordinate-container"></div>'+
                '       </div>'+
                '       <div class="margintop">'+
                '           <div class="coordinate-label floatleft lon-label"></div>'+
                '           <div class="floatleft"><input type="text" class="lon-input"></input></div>'+
                '           <div class="clear"></div>'+
                '           <div class="coordinate-lon-container coordinate-container"></div>'+
                '       </div>'+
                '       <div class="margintop mousecoordinates-div"><input type="checkbox" id="mousecoordinates"></input><label class="mousecoordinates-label" for="mousecoordinates"></label></div>' +
                '   </div>'+

                '   <div class="margintop reverseGeocodeContainer">'+
                '   </div>'+
                '   <div class="margintop coordinatedisplay-emergencycall" style="display:none;">'+
                '       <span class="coordinatedisplay-emergencycall-label"></span>'+
                '       <span class="coordinatedisplay-emergencycall degreesY"></span>&deg;'+
                '       <span class="coordinatedisplay-emergencycall minutesY"></span>\''+
                '       <span class="coordinatedisplay-emergencycall-label-and"></span> '+
                '       <span class="coordinatedisplay-emergencycall degreesX"></span>&deg;'+
                '       <span class="coordinatedisplay-emergencycall minutesX"></span>\' '+
                '   </div>'+
                '</div>'),
                reverseGeocodeContainer: jQuery(
                  '<div class="geocodeControl"> '+
                  '<input id="reverseGeoCheckbox" class="reverseGeoCheckbox" type="checkbox" />' +
                  '<label class="reverseGeocodeInfoText" for="reverseGeoCheckbox"></label>' +
                  '<div class="reversegeocode-label reverseGeocode-label"></div>'+
                  '</div>'
                ),
                coordinateFormatDisplayY: jQuery(
                    '<div class="coordinate-format-display-y">'+
                    '   <div class="coordinatedisplay-container">'+
                    '       <div class="margintop coordinatedisplay-degminy">'+
                    '           <span class="coordinatedisplay-degmin degreesY" style="text-align:center";></span>'+
                    '           <span class="coordinatedisplay-degmin minutesY" style="text-align:center";></span>'+
                    '           </br>  '+
                    '       </div>'+
                    '       <div class="margintop coordinatedisplay-degy">'+
                    '           <span class="coordinatedisplay-deg degreesY" style="text-align:center";></span>'+
                    '           </br>  '+
                    '       </div>'+
                    '   </div>'+
                    '</div>'
                ),
                coordinateFormatDisplayX: jQuery(
                    '<div class="coordinate-format-display-x">'+
                    '   <div class="coordinatedisplay-container" >'+
                    '       <div class="margintop coordinatedisplay-degminx">'+
                    '           <span class="coordinatedisplay-degmin degreesX" style="text-align:center";></span>'+
                    '           <span class="coordinatedisplay-degmin minutesX" style="text-align:center";></span>'+
                    '           </br>  '+
                    '       </div>'+
                    '       <div class="margintop coordinatedisplay-degx">'+
                    '           <span class="coordinatedisplay-deg degreesX" style="text-align:center";></span>' +
                    '           </br>  '+
                    '       </div>'+
                    '   </div>'+
                    '</div>'
                )
        };
        me.spinnerStopTimer = null;
        //me.lastLonLat = null;
        me._mobileDefs = {
            buttons:  {
                'mobile-coordinatetool': {
                    iconCls: 'mobile-xy',
                    tooltip: '',
                    show: true,
                    callback: function () {
                        me._toggleToolState();
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me._decimalSeparator = Oskari.getDecimalSeparator();
        me._log = Oskari.log('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin');
    }, {
        /**
         * Get popup-
         * @method @private _getPopup
         *
         * @return {Object} jQuery popup object
         */
        _getPopup: function(){
            return this._popup;
        },
        /**
         * @method  @private _validLonLatInputs validate inputs
         * @return {Boolean} is inputs valid true/false
         */
        _validLonLatInputs: function(){
            var me = this;
            if(me._lonInput && me._latInput) {
                var lon = me._lonInput.val(),
                    lat = me._latInput.val();

                if(lon !== '' && lat !== '') {
                    return true;
                }
            }
            return false;
        },
        /**
         * @method  @private _showCoordinatesNotValidMessage show coordinates are not vlaid message
         */
        _showCoordinatesNotValidMessage: function(){
            var me = this;
            var loc = me._locale;

            if(!me._dialog) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                me._dialog = dialog;
            }
            var btn = me._dialog.createCloseButton(loc.checkValuesDialog.button);
            btn.addClass('primary');
            me._dialog.show(loc.checkValuesDialog.title, loc.checkValuesDialog.message, [btn]);
        },
        /**
         * Show popup.
         * @method @private _showPopup
         */
        _showPopup: function() {
            var me = this,
                loc = me._locale,
                popupTitle = loc.popup.title,
                popupContent = me._templates.popupContent.clone(),
                crs = me.getMapModule().getProjection(),
                crsDefaultText = loc.crs.default,
                popupName = 'xytoolpopup',
                crsText = loc.crs[crs] || crsDefaultText.replace('{crs}', crs),
                popupLocation,
                isMobile = Oskari.util.isMobile(),
                mapmodule = me.getMapModule(),
                popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');

            me._popup = popupService.createPopup();
            var popupEl = me._popup.getJqueryContent().parent().parent();

            if(popupEl) {
                popupEl.mouseover(function(){
                    me._progressSpinner.stop();
                });
            }
            me._popupContent = popupContent;
            me._latInput = popupContent.find('.lat-input');
            me._lonInput = popupContent.find('.lon-input');

            /* Stop event propagations, so at arrows can be used editing fields */
            me._lonInput.keyup(function(event) {
                event.stopPropagation();
            });
            me._latInput.keyup(function(event) {
                event.stopPropagation();
            });

            me._latLabel = popupContent.find('.lat-label');
            me._lonLabel = popupContent.find('.lon-label');
            var showLatLon = me._labelMetricOrDegrees();

            popupContent.find('.coordinatetool__popup__content').html(loc.popup.info);
            popupContent.find('.mousecoordinates-label').html(loc.popup.showMouseCoordinates);

            var centerToCoordsBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            centerToCoordsBtn.setTitle(loc.popup.searchButton);
            centerToCoordsBtn.setHandler(function () {
                // Check valid
                if(me._validLonLatInputs()) {
                    var data = me._getInputsData();
                    if(!me._getPreciseTransform) {
                        me._centerMapToSelectedCoordinates(data);
                    } else {
                        if(me._projectionSelect.val() === me._mapmodule.getProjection()) {
                            me._centerMapToSelectedCoordinates(data);
                        } else {
                            me._getTransformedCoordinatesFromServer(data, false,  false, true);
                        }
                    }
                } else {
                    me._showCoordinatesNotValidMessage();
                }
            });
            var buttons = [centerToCoordsBtn];
            me._centerToCoordsBtn = centerToCoordsBtn;
            if(me._markersSupported()) {
                var addMarkerBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                addMarkerBtn.setTitle(loc.popup.addMarkerButton);
                buttons.push(addMarkerBtn);

                addMarkerBtn.setHandler(function() {
                    // Check valid
                    if(me._validLonLatInputs()) {
                        var data = me._getInputsData();

                        var lon = me._lonInput.val(),
                            lat = me._latInput.val();

                        var msg = null;
                        if(Oskari.util.coordinateIsDegrees([lon,lat]) && me._allowDegrees()) {
                            msg = {
                                lat: lat,
                                lon: lon
                            };
                        }

                        if(!me._getPreciseTransform) {
                            me._addMarker(data, msg);
                            me._centerMapToSelectedCoordinates(data);
                        } else {
                            if(me._projectionSelect.val() === me._mapmodule.getProjection()) {
                                me._addMarker(data, msg);
                                me._centerMapToSelectedCoordinates(data);
                            } else {
                                me._getTransformedCoordinatesFromServer(data, true, false, true, msg);
                            }
                        }
                    } else {
                         me._showCoordinatesNotValidMessage();
                    }

                });
            }

            // showmousecoordinates checkbox change
            popupContent.find('#mousecoordinates').unbind('change');
            popupContent.find('#mousecoordinates').bind('change', function(){
                me._showMouseCoordinates = jQuery(this).prop('checked');
                me._setDisabledInputs(me._showMouseCoordinates, false);
                me._progressSpinner.stop();
            });

            if(_.isArray(me._config.supportedProjections)) {
                me._getPreciseTransform = true;
                me._projectionSelect = me._coordinateTransformationExtension.initCoordinatesTransformChange(popupContent);
            } else if (typeof me._config.supportedProjections === 'object') {
                me._viewChangerExtension.initProjectionChange(me._popup);
            }

            if(!me._getPreciseTransform) {
                popupContent.find('.srs').html(crsText);
            }

            me._popup.createCloseIcon();
            me._popup.onClose(function () {
                var el = me.getElement();
                if(el) {
                    el.removeClass('active');
                }
                me._toolOpen = false;
                me._showMouseCoordinates = false;
                me._showReverseGeocodeCheckbox = false;
            });

            var themeColours = mapmodule.getThemeColours();
            var popupCloseIcon = null;

            if (isMobile) {
                var el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-coordinatetool');
                var topOffsetElement = jQuery('div.mobileToolbarDiv');
                me._popup.addClass('coordinatetool__popup');
                me._popup.addClass('mobile-popup');
                me._popup.setColourScheme({"bgColour": "#e6e6e6"});
                me._popup.createCloseIcon();

                //hide mouse coordinates
                popupContent.find('.mousecoordinates-div').hide();

                popupService.closeAllPopups(true);
                me._popup.onClose(function() {
                    me._resetMobileIcon(el, me._mobileDefs.buttons['mobile-coordinatetool'].iconCls);
                });

                me._popup.show(popupTitle, popupContent, buttons);
                // move popup if el and topOffsetElement
                if (el && el.length>0 && topOffsetElement && topOffsetElement.length>0) {
                    me._popup.moveTo(el, 'bottom', true, topOffsetElement);
                } else {
                    me._popup.moveTo(mapmodule.getMapEl(), 'center', true, null);
                }

                popupCloseIcon = (Oskari.util.isDarkColor(themeColours.activeColour)) ? 'icon-close-white' : undefined;
                me._popup.setColourScheme({
                    'bgColour': themeColours.activeColour,
                    'titleColour': themeColours.activeTextColour,
                    'iconCls': popupCloseIcon
                });
                me._popup.addClass('mobile-popup');
            } else {
                me._popup.makeDraggable();
                me._popup.addClass('coordinatetool__popup');
                //check location of the tool and open popup according to it
                if (me._config.location && me._config.location.classes === "top left") {
                    popupLocation = "right";
                } else {
                    popupLocation = "left";
                }

                //show mouse coordinates
                popupContent.find('div.mousecoordinates-div').show();

                me._popup.show(popupTitle, popupContent, buttons);
                me._popup.moveTo(me.getElement(), popupLocation, true);
                me._popup.adaptToMapSize(me._sandbox, popupName);
                popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
                me._popup.setColourScheme({
                    'bgColour': themeColours.backgroundColour,
                    'titleColour': themeColours.textColour,
                    'iconCls': popupCloseIcon
                });
            }

            me.refresh();

            if (this._showReverseGeocode){
                this._updateReverseGeocode();
                me._showReverseGeocodeContainer(popupContent);
            }

            if (!isMobile) {
                // bind change events to listen popup size changes
                popupEl.find('input[type=checkbox]').each(function(){
                    jQuery(this).bind('change', function(){
                        me._checkPopupPosition();
                    });
                });
                popupEl.find('select').each(function(){
                    jQuery(this).bind('change', function(){
                        me._checkPopupPosition();
                    });
                });
            }

            me.getEmergencyCallInfo();
        },
        /**
         * @method  @private _checkPopupPosition Check popup position
         */
        _checkPopupPosition: function(){
            var me = this;
            if(!me._popup) {
                return;
            }
            var popupEl = me._popup.getJqueryContent().parent().parent();

            // Change top/bottom position if popup is not fully visible
            if(popupEl) {
                var wHeight = jQuery(window).height();
                var pHeight = popupEl.height();
                var pPosition = popupEl.position();
                if((pPosition.top + pHeight) > wHeight && (wHeight - pHeight) > 0) {
                    popupEl.css('top', (wHeight - pHeight) + 'px');
                }
            }
        },
        _showReverseGeocodeContainer: function( popupContent ) {
          var me = this;

          var reverseArray = me._config.reverseGeocodingIds.split(',');
          var showReverseGeocodeCheckbox;

          if(reverseArray.length > 2) {
            showReverseGeocodeCheckbox = true;
          }
          if(showReverseGeocodeCheckbox) {
            var geocodeController = me._templates.reverseGeocodeContainer.clone();
            var geocodeContainer = popupContent.find('div.reverseGeocodeContainer');
            var reverseGeoCheckbox = geocodeController.find('input.reverseGeoCheckbox');
            var reverseGeocodeLabel = geocodeController.find('div.reverseGeocode-label');
            reverseGeocodeLabel.hide();
            geocodeController.find('label.reverseGeocodeInfoText').html(me._locale.reversegeocode.moreInfo);
            reverseGeoCheckbox.bind('change', function() {
                if (this.checked) {
                  reverseGeocodeLabel.show();
                }
                else {
                  reverseGeocodeLabel.hide();
                }
            });
            geocodeContainer.append(geocodeController);
            me._reverseGeocodeLabel = reverseGeocodeLabel;
          } else {
            me._reverseGeocodeLabel = popupContent.find('div.reverseGeocodeContainer');
          }
        },
        _markersSupported : function() {
            var builder = this._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
            return !!builder;
        },
        /**
         * Add marker according to the coordinates given in coordinate popup.
         * @method  @private _addMarker
         */
        _addMarker: function(data, messageData){
            var me = this,
                loc = me._locale,
                reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest'),
                inputData = me._getInputsData(),
                lat = parseFloat(inputData.lonlat.lat),
                lon = parseFloat(inputData.lonlat.lon),
                inputLonLatData = {
                    'lonlat': {
                        'lat':lat,
                        'lon':lon
                    }
                };

            // Check at data is given. If data is given then use for it.
            // If not then use input data's and try change data to map projection and use it to place marker
            try {
                data = data || me._coordinateTransformationExtension.transformCoordinates(inputLonLatData, me._previousProjection, me.getMapModule().getProjection());
            } catch(err) {
                // Cannot transform coordinates in _coordinateTransformationExtension.transformCoordinates -function
                me._showMessage(loc.cannotTransformCoordinates.title, loc.cannotTransformCoordinates.message);
                return;
            }

            // Check projection show format
            if(me._projectionSelect) {
                lat = lat.toFixed(me._getProjectionDecimals());
                lon = lon.toFixed(me._getProjectionDecimals());
            }
            if(reqBuilder) {
                var msgLon = (messageData && messageData.lon) ? messageData.lon : lon;
                var msgLat = (messageData && messageData.lat) ? messageData.lat : lat;
                var msg = msgLat + ', ' + msgLon;
                if(me._config.supportedProjections) {
                    msg += ' (' + jQuery("#projection option:selected" ).text() + ')';
                }

                var marker = {
                    x: data.lonlat.lon,
                    y: data.lonlat.lat,
                    msg: msg,
                    size: 5,
                    color: 'ee9900'
                };
                me._sandbox.request(this, reqBuilder(marker));
            }
        },
        /**
         * Toggle tool state.
         * @method @private _toggleToolState
         */
        _toggleToolState: function(){
            var me = this,
                el = me.getElement();

            if(me._toolOpen) {
                if(el) {
                    el.removeClass('active');
                }
                me._toolOpen = false;
                me._popup.close(true);
            } else {
                if(el) {
                    el.addClass('active');
                }
                me._toolOpen = true;
                me._previousProjection = null;
                me._showPopup();

                me._labelMetricOrDegrees(jQuery("#projection option:selected").val());
            }
        },

        /**
         * @method @private _showMessage show message
         * @param  {String} title   mesage title
         * @param  {String} message mesage
         */
        _showMessage: function(title, message) {
            var me = this;

            if(!me._messageDialog) {
                me._messageDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._messageDialog.show(title, message);
            me._messageDialog.fadeout();
        },

        /**
         * @method  @private _getTransformedCoordinatesFromServer get transformed coordinates from server
         * @param  {Object} data       data
         * @param  {Boolean} showMarker show marker
         */
        _getTransformedCoordinatesFromServer: function(data, showMarker, swapProjections, centerMap, markerMessageData){
            var me = this,
                loc = me._locale,
                fromProj = me._projectionSelect.val(),
                toProj = me._mapmodule.getProjection(),
                successCb = function(data) {
                    if(showMarker) {
                        me._addMarker(data, markerMessageData);
                    }

                    if(showMarker || centerMap) {
                        me._centerMapToSelectedCoordinates(data);
                    }

                    if(!centerMap) {
                        me._updateLonLat(data, true);
                    }
                    me._progressSpinner.stop();
                },
                errorCb = function() {
                    me._showMessage(loc.cannotTransformCoordinates.title, loc.cannotTransformCoordinates.message);
                    me._progressSpinner.stop();
                };

            me._checkSpinnerVisibility();

            if(swapProjections) {
                fromProj = me._mapmodule.getProjection();
                toProj = me._projectionSelect.val();
            }
            me._coordinateTransformationExtension.getTransformedCoordinatesFromServer(data, fromProj, toProj, successCb, errorCb);
        },


        /**
         * Seet inputs disabled
         * @method  @private _setDisabledInputs
         *
         * @param {Boolean} disabled  disabled or not
         * @param {Boolean} clearText clear input values
         */
        _setDisabledInputs: function(disabled, clearText){
            var me = this;
            me._latInput.prop('disabled', disabled);
            me._lonInput.prop('disabled', disabled);
            me._centerToCoordsBtn.setEnabled(!disabled);
            if(clearText){
                me._latInput.val('');
                me._lonInput.val('');
            }
        },
        /**
         * Center map to selected coordinates.
         * @method  @private _centerMapToSelectedCoordinates
         *
         * @return {[type]} [description]
         */
        _centerMapToSelectedCoordinates: function(data){
            var me = this;

            if(this.getMapModule().isValidLonLat(data.lonlat.lon, data.lonlat.lat)) {
                var moveReqBuilder = me._sandbox.getRequestBuilder('MapMoveRequest');
                var moveReq = moveReqBuilder(data.lonlat.lon, data.lonlat.lat);
                me._sandbox.request(this, moveReq);
            } else {
                me._showCoordinatesNotValidMessage();
            }
        },
        /**
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this,
                el = me._templates.coordinatetool.clone();

            me._locale = Oskari.getLocalization('coordinatetool', Oskari.getLang() || Oskari.getDefaultLanguage()).display;

            el.attr('title', me._locale.tooltip.tool);

            // Bind event listeners
            // XY icon click
            el.unbind('click');
            el.bind('click', function(event){
                if (me._sandbox.mapMode !== "mapPublishMode") {
                    me._toggleToolState();
                    event.stopPropagation();
                }
            });

            if(me._config.noUI) {
                return null;
            }

            return el;
        },
         /**
         * @method  @public isOpen
         * @return {Boolean} is popup open
         */
        isOpen: function(){
            return this._toolOpen;
        },
        teardownUI : function() {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
            if (this._popup) {
                this._popup.close(true);
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            if (!this.hasUI()) {
                return;
            }

            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();
            if (!toolbarNotReady && mapInMobileMode) {
                if (!me._config.noUI) {
                    this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                }
            } else {
                if (!me._config.noUI) {
                    me._element = me._createControlElement();
                    me.refresh();
                    this.addToPluginContainer(me._element);
                }
            }
        },

        hasUI: function() {
            return this._config.noUI ? false : true;
        },

        /**
         * Update lon and lat values to inputs
         * @method  @private _updateLonLat
         * @param  {Object} data lon and lat object {lonlat: { lat: 0, lon: 0}}
         * @return {[type]}      [description]
         */
        _updateLonLat: function(data){
            var me = this,
                conf = me._config;

            if (me._latInput && me._lonInput) {
                var isSupported = (conf && _.isArray(conf.supportedProjections)) ? true : false;
                var isDifferentProjection = (me._projectionSelect && me._projectionSelect.val() !== me.getMapModule().getProjection() &&
                    data.lonlat.lat !== 0 && data.lonlat.lon !==0) ? true : false;
                var lat = parseFloat(data.lonlat.lat);
                var lon = parseFloat(data.lonlat.lon);

                lat = lat + '';
                lon = lon + '';
                if(lat.indexOf('~') === 0) {
                    lat = lat.substring(1, lat.length);
                }
                lat = lat.replace(/,/g,'.');
                if(lon.indexOf('~') === 0) {
                    lon = lon.substring(1, lat.length);
                }
                lon = lon.replace(/,/g,'.');

                lat = lat + '';
                lon = lon + '';
                if(lat.indexOf('~') === 0) {
                    lat = lat.substring(1, lat.length);
                }
                lat = lat.replace(/,/g,'.');
                if(lon.indexOf('~') === 0) {
                    lon = lon.substring(1, lat.length);
                }
                lon = lon.replace(/,/g,'.');


                // Need to show degrees ?
                if(me._allowDegrees() && !isNaN(lat) && !isNaN(lon)) {
                    var degreePoint = Oskari.util.coordinateMetricToDegrees([lon,lat], me._getProjectionDecimals());
                    lon = degreePoint[0];
                    lat = degreePoint[1];
                }
                // Otherwise show meter units
                else if(!isNaN(lat) && !isNaN(lon)) {
                    lat = parseFloat(lat);
                    lon = parseFloat(lon);
                    lat = lat.toFixed(me._getProjectionDecimals());
                    lon = lon.toFixed(me._getProjectionDecimals());
                    lat = me.formatNumber(lat, me._decimalSeparator);
                    lon = me.formatNumber(lon, me._decimalSeparator);
                } else {
                    // clear degree values also
                    me._clearDegreeValues();
                    me._changeCoordinateContainerVisibility(!me._allowDegrees());
                    return;
                }

                 // Not from server
                if(isSupported && isDifferentProjection && !me._coordinateTransformationExtension._coordinatesFromServer) {
                    lat = '~' + lat;
                    lon = '~' + lon;
                }
                // From server, change flag to false
                else {
                    me._coordinateTransformationExtension._coordinatesFromServer = false;
                }

                me._latInput.val(lat);
                me._lonInput.val(lon);

                if (me._allowDegrees()) {
                  me._updateCoordinateDisplay(data);
                } else {
                    me._updateCoordinateDisplay(null);
                }
            }
        },
        _clearDegreeValues: function() {
            var me = this;
            var coordinateFormatDisplayX = me._popupContent.find('.coordinate-format-display-x');
            var coordinateFormatDisplayY = me._popupContent.find('.coordinate-format-display-y');
            if (coordinateFormatDisplayX.length > 0 && coordinateFormatDisplayY.length > 0) {
                coordinateFormatDisplayX.find('.degreesX').empty();
                coordinateFormatDisplayX.find('.minutesX').empty();
                coordinateFormatDisplayY.find('.degreesY').empty();
                coordinateFormatDisplayY.find('.minutesY').empty();
            }
        },
        _changeCoordinateContainerVisibility: function(visible){
            var me = this;

            var latContainer = me._popupContent.find('div.coordinate-lat-container');
            var lonContainer = me._popupContent.find('div.coordinate-lon-container');
            if(visible) {
                latContainer.show();
                lonContainer.show();
            } else {
                latContainer.hide();
                lonContainer.hide();
            }
        },
        _updateCoordinateDisplay: function(data){
            var me = this;

            var latContainer = me._popupContent.find('div.coordinate-lat-container');
            var lonContainer = me._popupContent.find('div.coordinate-lon-container');
            var coordinateFormatDisplayX = me._popupContent.find('.coordinate-format-display-x');
            var coordinateFormatDisplayY = me._popupContent.find('.coordinate-format-display-y');

            if (coordinateFormatDisplayX.length === 0 && coordinateFormatDisplayY.length === 0) {
                coordinateFormatDisplayY = me._templates.coordinateFormatDisplayY.clone();
                coordinateFormatDisplayX = me._templates.coordinateFormatDisplayX.clone();
                latContainer.append(coordinateFormatDisplayX);
                lonContainer.append(coordinateFormatDisplayY);
            }

            if (data) {
                var degmin = me._coordinateTransformationExtension._formatDegrees(data.lonlat.lon, data.lonlat.lat, "min");

                var coordinateDisplayDeg = coordinateFormatDisplayX.find('div.coordinatedisplay-degx');
                var coordinateDisplayDegmin = coordinateFormatDisplayX.find('div.coordinatedisplay-degminx');

                var coordinateDisplayDegY = coordinateFormatDisplayY.find('div.coordinatedisplay-degy');
                var coordinateDisplayDegminY = coordinateFormatDisplayY.find('div.coordinatedisplay-degminy');

                //X
                coordinateDisplayDeg.find('span.degreesX').html(
                    parseFloat(data.lonlat.lat).toFixed(9).replace('.', me._decimalSeparator) + '&deg;'
                );

                coordinateDisplayDegmin.find('span.degreesX').html(degmin.degreesY + '&deg;');
                coordinateDisplayDegmin.find('span.minutesX').html(degmin.minutesY + '\'');

                //Y
                coordinateDisplayDegY.find('span.degreesY').html(
                    parseFloat(data.lonlat.lon).toFixed(9).replace('.', me._decimalSeparator) +'&deg;'
                );

                coordinateDisplayDegminY.find('span.degreesY').html(degmin.degreesX + '&deg;');
                coordinateDisplayDegminY.find('span.minutesY').html(degmin.minutesX + '\'');

                me._changeCoordinateContainerVisibility(true);
            }
            else {
                me._changeCoordinateContainerVisibility(false);
                return;
            }
        },
        /**
         * Get the coordinates in degrees (do a backend transformation roundtrip if need be) and fill in the emergency call message
         */
        getEmergencyCallCoordinatesFromServer: function(data) {
            var me = this;

            //get the transform from current data
            var sourceProjection = me.getMapModule().getProjection();

            // If coordinates are not  EPSG:4326 then
            // need to get 'EPSG:4326' coordinates from service
            if (sourceProjection !== 'EPSG:4326'){
                me._coordinateTransformationExtension.getTransformedCoordinatesFromServer(data, sourceProjection, 'EPSG:4326',
                    function(responseDataTo4326) {
                        me._updateEmergencyCallMessage(responseDataTo4326);
                    },
                    function(error) {
                        me._coordinateTransformationExtension._showMessage(me._locale.cannotTransformCoordinates.title, me._locale.cannotTransformCoordinates.message);
                });
            }
            // Else if coordinates are from 'EPSG:4326' then use these
            else {
                me._updateEmergencyCallMessage(data);
            }
        },
        _updateEmergencyCallMessage: function(data) {
            var me = this,
                degmin = me._coordinateTransformationExtension._formatDegrees(data.lonlat.lon, data.lonlat.lat, "min"),
                coordinateDisplayEmergencyCall = me._popupContent.find('div.coordinatedisplay-emergencycall');

            var minutesX = ''  + parseFloat(degmin.minutesX.replace(me._decimalSeparator,'.')).toFixed(3);
            minutesX = minutesX.replace('.', me._decimalSeparator);

            var minutesY = ''  + parseFloat(degmin.minutesY.replace(me._decimalSeparator,'.')).toFixed(3);
            minutesY = minutesY.replace('.', me._decimalSeparator);

            coordinateDisplayEmergencyCall.find('span.coordinatedisplay-emergencycall-label').html(me._locale.coordinatesTransform.emergencyCallLabel);
            coordinateDisplayEmergencyCall.find('span.coordinatedisplay-emergencycall-label-and').html(me._locale.coordinatesTransform.emergencyCallLabelAnd);
            coordinateDisplayEmergencyCall.find('span.degreesX').html(me._locale.compass.i +' ' + degmin.degreesX);
            coordinateDisplayEmergencyCall.find('span.minutesX').html(minutesX);
            coordinateDisplayEmergencyCall.find('span.degreesY').html(me._locale.compass.p + ' ' + degmin.degreesY);
            coordinateDisplayEmergencyCall.find('span.minutesY').html(minutesY);
            coordinateDisplayEmergencyCall.show();
            me._checkPopupPosition();
        } ,
        /**
         * Update reverse geocode value to inputs
         * @method  @private _updateReverseGeocode
         * @param  {Object} data lon and lat object {lonlat: { lat: 0, lon: 0}}
         */
        _updateReverseGeocode: function(data){
            var me = this,
                locale = me._locale.reversegeocode,
                service = me._instance.getService(),
                popup = me._getPopup();

            if(me._toolOpen !== true || me._reverseGeocodeNotImplementedError === true) {
                return;
            }

            if (!data || !data.lonlat) {
                // update with map coordinates if coordinates not given
                data = me._getMapXY();
            }

            service.getReverseGeocode(
                // Success callback
                function (response) {
                    var hasResponse = (response && response.length > 0) ? true : false;

                    // type title is not found in locales
                    if (hasResponse && me._reverseGeocodeLabel && locale[response[0].channelId]){
                        me._reverseGeocodeLabel.html('');
                        for (var i = 0; i < response.length; i++) {
                            var r = response[i];
                            var title = locale[r.channelId].label;
                            if (!title) {
                                title = r.type;
                            }
                            me._reverseGeocodeLabel.append("<div>" + title + "<u>" + r.name + "</u></div>");
                        }
                    }
                },
                // Error callback
                function (jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status === 501) {
                        me._reverseGeocodeNotImplementedError = true;
                    }
                    var messageJSON;
                    try{
                        messageJSON = jQuery.parseJSON(jqXHR.responseText);
                    } catch(err){}
                    var message = me._instance.getName() + ': Cannot reverse geocode';
                    if(messageJSON && messageJSON.error) {
                        message = me._instance.getName() + ': ' + messageJSON.error;
                    }

                    Oskari.log("coordinatetool").warn(message);
                },data.lonlat.lon, data.lonlat.lat);

        },
        /**
         * Updates the given coordinates to the UI
         * @method @public refresh
         *
         * @param {Object} data contains lat/lon information to show on UI
         */
        refresh: function (data) {
            var me = this,
                conf = me._config;
            if (!data || !data.lonlat) {
                // update with map coordinates if coordinates not given
                data = me._getMapXY();
            }
            if(me._getPreciseTransform) {
                try {
                    var changeToProjection = jQuery("#projection option:selected").val();
                    var fromProjection =  me.getMapModule().getProjection();
                    if(me._projectionChanged) {
                        fromProjection = me._previousProjection;
                        me._projectionChanged = false;
                    }
                    data = me._coordinateTransformationExtension.transformCoordinates(data, fromProjection, changeToProjection);

                } catch(error) {
                    if(me._latInput && me._lonInput) {
                        me._latInput.val('');
                        me._lonInput.val('');
                        me._clearDegreeValues();
                        return;
                    }
                }
            }

            me._updateLonLat(data);
            me._labelMetricOrDegrees();

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }

            return data;
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return this._element;//jQuery('.mapplugin.coordinatetool');
        },

        getEmergencyCallInfo: function(data){
            var me = this,
                conf = me._config;

            data = data || me._getMapXY();

            // update emergency if configured
            if (conf.showEmergencyCallMessage) {
                // already in degrees, don't fetch again
                if (me._allowDegrees() && me.getMapModule().getProjection() === 'EPSG:4326') {
                    me._updateEmergencyCallMessage({
                        'lonlat': {
                            'lon': data.lonlat.lon,
                            'lat': data.lonlat.lat
                        }
                    });
                } else {
                    me.getEmergencyCallCoordinatesFromServer(data);
                }
            }
        },
        /**
         * Check at if spinner need to display.
         * @method @private _checkSpinnerVisibility
         */
        _checkSpinnerVisibility: function(){
            var me = this;
            if (me._getPreciseTransform && me._mapmodule.getProjection() !== me._projectionSelect.val()){
                me._progressSpinner.insertTo(me._popup.getJqueryContent());
                me._progressSpinner.start();

                // Timer for stopping spinner. Example if mouse moved out of map then spinner need stop.
                clearTimeout(me.spinnerStopTimer);
                me.spinnerStopTimer = setTimeout(function(){
                    me._progressSpinner.stop();
                }, 2000);
            }
        },
        /**
         * Create event handlers.
         * @method @private _createEventHandlers
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method MouseHoverEvent
                 * See PorttiMouse.notifyHover
                 */
                MouseHoverEvent: function (event) {
                    var me = this;
                    if(me._showMouseCoordinates) {
                        me._checkSpinnerVisibility();
                        var data = {
                            'lonlat': {
                                'lat': parseFloat(event.getLat()),
                                'lon': parseFloat(event.getLon())
                            }
                        };
                        var dataServer = _.clone(data);
                        if(me._projectionSelect) {
                            if(me._mapmodule.getProjection() === me._projectionSelect.val()) {
                               me.refresh(_.clone(data));
                            }
                        } else {
                            me.refresh(_.clone(data));
                        }


                        if (event.isPaused() && me._getPreciseTransform){
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }

                        if (event.isPaused() && me._showReverseGeocode){
                            me._updateReverseGeocode(_.clone(data));
                        }

                        if(event.isPaused()) {
                            me.getEmergencyCallInfo(_.clone(data));
                        }
                    }
                },
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                AfterMapMoveEvent: function (event) {
                    var me = this;
                    if(!me._showMouseCoordinates) {
                        me._checkSpinnerVisibility();

                        me.refresh();

                        if(me._getPreciseTransform){
                            me._getTransformedCoordinatesFromServer(null, false, true);
                        }
                    }
                    if (me._showReverseGeocode){
                        me._updateReverseGeocode();
                    }

                    me.getEmergencyCallInfo();
                },
                /**
                 * @method MapClickedEvent
                 * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
                 */
                MapClickedEvent: function (event) {
                    var me = this,
                        lonlat = event.getLonLat(),
                        data = {
                            'lonlat': {
                                'lat': parseFloat(lonlat.lat),
                                'lon': parseFloat(lonlat.lon)
                            }
                        },
                        dataServer = _.clone(data);
                    if(!me._showMouseCoordinates) {
                        //don't manipulate the original data- object, we need the coordinates in map projection for the reverse geocoding to work
                        me.refresh(_.clone(data));
                        if(me._getPreciseTransform) {
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }
                    }
                    if (me._showReverseGeocode){
                        me._updateReverseGeocode(_.clone(data));
                    }

                    me.getEmergencyCallInfo(_.clone(data));
                },
                /**
                 * @method RPCUIEvent
                 * will open/close coordinatetool's popup
                 */
                RPCUIEvent: function (event) {
                    var me = this;
                    if(event.getBundleId()==='coordinatetool') {
                         me._toggleToolState();
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
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for(var c=0;c<classList.length;c++){
                var className = classList[c];
                if(className.indexOf('toolstyle-') > -1){
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        _labelMetricOrDegrees: function(projection){
          var me = this;
          var loc = me._locale;
          var conf = me._config;
          projection = projection || me._previousProjection || me.getMapModule().getProjection;
          var showDegrees = (me._mapModule.getProjectionUnits() === 'degrees') ? true : false;

          if(!_.has(conf.projectionShowFormat, projection)){
            me._log.debug('Not specified projection format. Used defaults from map projection units.');
          } else {
            showDegrees = (conf.projectionShowFormat[projection].format ==='degrees') ? true : false;
          }
          if(me._latLabel !== null && me._lonLabel !== null){
            if(showDegrees){
              me._latLabel.html(loc.compass.lat + ':');
              me._lonLabel.html(loc.compass.lon + ':');
            } else {
              me._latLabel.html(loc.compass.n + ':');
              me._lonLabel.html(loc.compass.e + ':');
            }
          }
          return showDegrees;
        },
        /**
         * @method  @private _allowDegrees is degrees allowed to input fields
         * @param {String] checkedProjection projection to checked
         * @return {Boolean} is allowed
         */
        _allowDegrees: function(checkedProjection){
            var me = this;

            var selectedProjection = (me._projectionSelect && me._projectionSelect.val()) ? me._projectionSelect.val() : me.getMapModule().getProjection();
            var projection = checkedProjection || selectedProjection;
            var conf = me._config;

            var isProjectionShowConfig = (conf.projectionShowFormat && conf.projectionShowFormat[projection] && conf.projectionShowFormat[projection].format) ? true : false;
            var isDegrees = ((isProjectionShowConfig && conf.projectionShowFormat[projection].format === 'degrees') || me._mapmodule.getProjectionUnits() === 'degrees') ? true : false;

            var isAllProjectionConfig = (conf.projectionShowFormat && typeof conf.projectionShowFormat.format === 'string') ? true : false;
            if(!isProjectionShowConfig && isAllProjectionConfig) {
                isDegrees = (conf.projectionShowFormat.format === 'degrees') ? true : false;
            }
            return isDegrees;
        },
        /**
         * @method  @private _getProjectionDecimals Get projection decimals
         * @param {String] checkedProjection projection to checked
         * @return {Integer} decimals
         */
        _getProjectionDecimals: function(checkedProjection){
            var me = this;
            var conf = me._config;
            var selectedProjection = (me._projectionSelect && me._projectionSelect.val()) ? me._projectionSelect.val() : me.getMapModule().getProjection();
            var projection = checkedProjection || selectedProjection;
            var isProjectionShowConfig = (conf.projectionShowFormat && conf.projectionShowFormat[projection] && typeof conf.projectionShowFormat[projection].decimals === 'number') ? true : false;

            var decimals = (isProjectionShowConfig) ? conf.projectionShowFormat[projection].decimals : me._mapmodule.getProjectionDecimals(selectedProjection);

            var isAllProjectionConfig = (conf.projectionShowFormat && typeof conf.projectionShowFormat.decimals === 'number') ? true : false;

            if(!isProjectionShowConfig && isAllProjectionConfig) {
                decimals = conf.projectionShowFormat.decimals;
            }
            else if(!isProjectionShowConfig && conf.roundToDecimals) {
                decimals = conf.roundToDecimals;
                me.getSandbox().printWarn('Deprecated coordinatetool.conf.roundToDecimals - please use coordinatetool.conf.projectionShowFormat.decimals or ' +
                    'coordinatetool.conf.projectionShowFormat["projection"].decimals instead.');
            }
            return decimals;
        },
        _getInputsData: function() {
            var me = this;

            if(!me._lonInput || !me._latInput) {
                return;
            }
            var lon = me._lonInput.val(),
                lat = me._latInput.val(),
                dec = null;

            if(Oskari.util.coordinateIsDegrees([lon,lat]) && me._allowDegrees()) {
                dec = Oskari.util.coordinateDegreesToMetric([lon,lat], 20);
                lon = dec[0];
                lat = dec[1];
            }
            else if(Oskari.util.coordinateIsDegrees([lon,lat]) && me._previousProjection &&  me._allowDegrees(me._previousProjection) ) {
                dec = Oskari.util.coordinateDegreesToMetric([lon,lat], 20);
                lon = dec[0];
                lat = dec[1];
            }

            lon = me.formatNumber(lon, '.');
            lat = me.formatNumber(lat, '.');

            if(lon.indexOf('~') >= 0) {
                lon = lon.replace('~', '');
            }
            if(lat.indexOf('~') >= 0) {
                lat = lat.replace('~', '');
            }
            var data = {
                'lonlat': {
                    'lat': lat,
                    'lon': lon
                }
            };
            return data;
        },
        _getMapXY: function(){
            var me = this;
            var map = me._sandbox.getMap();
            data = {
                'lonlat': {
                    'lat': parseFloat(map.getY()),
                    'lon': parseFloat(map.getX())
                }
            };
            return data;
        },
        formatNumber: function(coordinate, decimalSeparator) {
            if(typeof coordinate !== 'string') {
                coordinate = coordinate + '';
            }
            coordinate = coordinate.replace('.', decimalSeparator);
            coordinate = coordinate.replace(',', decimalSeparator);
            return coordinate;
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
