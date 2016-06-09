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
        me._centerToCoordsBtn = null;
        me._reverseGeocodeLabel = null;
        me._dialog = null;
        me._projectionSelect = null;
        me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me._reverseGeocodeNotImplementedError = false;
        me._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"><div class="icon"></div></div>'),
            popupContent: jQuery(
                '<div>'+
                '   <div class="coordinatetool__popup__content"></div>' +
                '   <div class="srs"></div>' +
                '   <div class="margintop">'+
                '       <div class="coordinate-label floatleft lat-label"></div>'+
                '       <div class="floatleft"><input type="text" class="lat-input"></input></div>'+
                '       <div class="clear"></div>'+
                '   </div>' +
                '   <div class="margintop">'+
                '       <div class="coordinate-label floatleft lon-label"></div>'+
                '       <div class="floatleft"><input type="text" class="lon-input"></input></div>'+
                '       <div class="clear"></div>'+
                '   </div>' +
                '   <div class="margintop "><input type="checkbox" id="mousecoordinates"></input><label class="mousecoordinates-label" for="mousecoordinates"></label></div>' +
                '   <div class="margintop">'+
                '      <div class="reversegeocode-label floatleft reverseGeocode-label"></div>'+
                '   </div>' +
                '</div>')
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
            me._latInput = popupContent.find('.lat-input');
            me._lonInput = popupContent.find('.lon-input');
            me._reverseGeocodeLabel = popupContent.find('.reverseGeocode-label');

            popupContent.find('.coordinatetool__popup__content').html(loc.popup.info);
            popupContent.find('.lat-label').html(loc.compass.lat);
            popupContent.find('.lon-label').html(loc.compass.lon);
            popupContent.find('.mousecoordinates-label').html(loc.popup.showMouseCoordinates);
            popupContent.find('.coordinatetool__popup__content').html(loc.popup.info);
            popupContent.find('.lat-label').html(loc.compass.lat);
            popupContent.find('.lon-label').html(loc.compass.lon);
            popupContent.find('.mousecoordinates-label').html(loc.popup.showMouseCoordinates);

            var centerToCoordsBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            centerToCoordsBtn.setTitle(loc.popup.searchButton);
            centerToCoordsBtn.setHandler(function () {
                data = me._getInputsData();
                if(!me._getPreciseTransform) {
                    me._centerMapToSelectedCoordinates(data);
                } else {
                    if(me._projectionSelect.val() === me._mapmodule.getProjection()) {
                        me._centerMapToSelectedCoordinates(data);
                    } else {
                        me._getTransformedCoordinatesFromServer(data, false,  false, true);
                    }
                }
            });
            me._centerToCoordsBtn = centerToCoordsBtn;

            var addMarkerBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addMarkerBtn.setTitle(loc.popup.addMarkerButton);

            addMarkerBtn.setHandler(function() {
                data = me._getInputsData();

                 if(!me._getPreciseTransform) {
                    me._addMarker(data);
                    me._centerMapToSelectedCoordinates(data);
                } else {
                    if(me._projectionSelect.val() === me._mapmodule.getProjection()) {
                        me._addMarker(data);
                        me._centerMapToSelectedCoordinates(data);
                    } else {
                        me._getTransformedCoordinatesFromServer(data, true, false, true);
                    }
                }

            });

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
            });

            var themeColours = mapmodule.getThemeColours();

            if (isMobile) {
                var el = jQuery(me.getMapModule().getMobileDiv()).find('#oskari_toolbar_mobile-toolbar_mobile-coordinatetool');
                var topOffsetElement = jQuery('div.mobileToolbarDiv');
                me._popup.addClass('coordinatetool__popup');
                me._popup.addClass('mobile-popup');
                me._popup.setColourScheme({"bgColour": "#e6e6e6"});
                me._popup.createCloseIcon();

                popupService.closeAllPopups(true);
                me._popup.onClose(function() {
                    me._resetMobileIcon(el, me._mobileDefs.buttons['mobile-coordinatetool'].iconCls);
                });

                me._popup.show(popupTitle, popupContent, [centerToCoordsBtn, addMarkerBtn]);
                // move popup if el and topOffsetElement
                if (el && el.length>0 && topOffsetElement && topOffsetElement.length>0) {
                    me._popup.moveTo(el, 'bottom', true, topOffsetElement);
                } else {
                    me._popup.moveTo(mapmodule.getMapEl(), 'center', true, null);
                }

                var popupCloseIcon = (Oskari.util.isDarkColor(themeColours.activeColour)) ? 'icon-close-white' : undefined;
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
                me._popup.show(popupTitle, popupContent, [centerToCoordsBtn, addMarkerBtn]);
                me._popup.moveTo(me.getElement(), popupLocation, true);
                me._popup.adaptToMapSize(me._sandbox, popupName);
                var popupCloseIcon = (mapmodule.getTheme() === 'dark') ? 'icon-close-white' : undefined;
                me._popup.setColourScheme({
                    'bgColour': themeColours.backgroundColour,
                    'titleColour': themeColours.textColour,
                    'iconCls': popupCloseIcon
                });
            }

            me.refresh();

            if (this._showReverseGeocode){
                this._updateReverseGeocode();
            }
        },
        /**
         * Add marker according to the coordinates given in coordinate popup.
         * @method  @private _addMarker
         */
        _addMarker: function(data){
            var me = this,
                reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest'),
                lat = parseFloat(me._latInput.val()),
                lon = parseFloat(me._lonInput.val());
            //display coordinates with desimals on marker label only if EPSG:4258 or LATLON:kkj projections choosen
            if(me._projectionSelect && me._projectionSelect.val() !== 'EPSG:4258' && me._projectionSelect.val() !== 'LATLON:kkj') {
                lat = lat.toFixed(0);
                lon = lon.toFixed(0);
            }
            if(reqBuilder) {
                var msg = lat + ', ' + lon;
                if(me._config.supportedProjections) {
                    msg += ' (' + jQuery("#projection option:selected" ).text() + ')';
                }
                var marker = {
                    x: data.lonlat.lon,
                    y: data.lonlat.lat,
                    msg: msg
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
                me._showPopup();
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
        _getTransformedCoordinatesFromServer: function(data, showMarker, swapProjections, centerMap){
            var me = this,
                loc = me._locale,
                fromProj = me._projectionSelect.val(),
                toProj = me._mapmodule.getProjection(),
                successCb = function(data) {
                    if(showMarker) {
                        me._addMarker(data);
                    }

                    if(showMarker || centerMap) {
                        me._centerMapToSelectedCoordinates(data);
                    }

                    if(!centerMap) {
                        me._updateLonLat(data);
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
            var me = this,
                loc = me._locale;

            if(this.getMapModule().isValidLonLat(data.lonlat.lon, data.lonlat.lat)) {
                var moveReqBuilder = me._sandbox.getRequestBuilder('MapMoveRequest');
                var moveReq = moveReqBuilder(data.lonlat.lon, data.lonlat.lat);
                me._sandbox.request(this, moveReq);
            } else {
                if(!me._dialog) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    me._dialog = dialog;
                }
                var btn = me._dialog.createCloseButton(loc.checkValuesDialog.button);
                btn.addClass('primary');
                me._dialog.show(loc.checkValuesDialog.title, loc.checkValuesDialog.message, [btn]);
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

        /**
         * Update lon and lat values to inputs
         * @method  @private _updateLonLat
         * @param  {Object} data lon and lat object {lonlat: { lat: 0, lon: 0}}
         * @return {[type]}      [description]
         */
        _updateLonLat: function(data){
            var me = this,
                conf = me._config,
                roundToDecimals = 0;

            if(conf && conf.roundToDecimals) {
                roundToDecimals = conf.roundToDecimals;
            }
            if (me._latInput && me._lonInput) {
                var isSupported = (conf && _.isArray(conf.supportedProjections)) ? true : false;
                var isDifferentProjection = (me._projectionSelect && me._projectionSelect.val() !== me.getMapModule().getProjection() && data.lonlat.lat!=0 && data.lonlat.lon!=0) ? true : false;

                var lat = parseFloat(data.lonlat.lat).toFixed(roundToDecimals);
                var lon = parseFloat(data.lonlat.lon).toFixed(roundToDecimals);

                // from server
                if(isSupported && isDifferentProjection && !me._coordinateTransformationExtension._coordinatesFromServer) {
                    lat = '~' + lat;
                    lon = '~' + lon;
                }
                // not from server
                else {
                    me._coordinateTransformationExtension._coordinatesFromServer = false;
                }
                me._latInput.val(lat);
                me._lonInput.val(lon);
            }
        },
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
                    var hasResponse = (response && response.length > 0 && response[0].name && response[0].channelId) ? true : false;

                    if (hasResponse && me._reverseGeocodeLabel && locale[response[0].channelId]){
                        me._reverseGeocodeLabel.html(locale[response[0].channelId].label + '<u>' + response[0].name + '</u>');
                    }
                },
                // Error callback
                function (jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status === 501) {
                        me._reverseGeocodeNotImplementedError = true;
                    }
                    var messageJSON = jQuery.parseJSON(jqXHR.responseText);
                    var message = me._instance.getName() + ': Cannot reverse geocode';
                    if(messageJSON && messageJSON.error) {
                        message = me._instance.getName() + ': ' + messageJSON.error;
                    }

                    me._sandbox.printWarn(message);
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
                    data = me._coordinateTransformationExtension.transformCoordinates(data, me._previousProjection, changeToProjection);
                } catch(error) {}
            }
            me._updateLonLat(data);

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
                               me.refresh(data);
                            }
                        } else {
                            me.refresh(data);
                        }


                        if (event.isPaused() && me._getPreciseTransform){
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }

                        if (event.isPaused() && me._showReverseGeocode){
                            me._updateReverseGeocode(data);
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

                        me.refresh(me._getInputsData());

                        if(me._getPreciseTransform){
                            me._getTransformedCoordinatesFromServer(null, false, true);
                        }
                    }
                    if (me._showReverseGeocode){
                        me._updateReverseGeocode();
                    }
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
                        me.refresh(data);
                        if(me._getPreciseTransform) {
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }
                    }
                    if (me._showReverseGeocode){
                        me._updateReverseGeocode(data);
                    }
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
        _getInputsData: function() {
            var me = this;
            if(!me._lonInput || !me._latInput) {
                return;
            }
            var lon = me._lonInput.val(),
                lat = me._latInput.val();
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