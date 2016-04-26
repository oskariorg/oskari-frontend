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
        this._locale = locale;
        this._config = config || {};
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._instance = instance;
        this._messageDialog = null;
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        this._coordinateTransformationExtension =
                    Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension',
                    instance, config, locale, mapmodule, sandbox);
        this._viewChangerExtension =
                    Oskari.clazz.create('Oskari.mapframework.bundle.coordinatetool.plugin.ViewChangerExtension',
                    instance, config, locale, mapmodule, sandbox);
        this._defaultLocation = 'top right';
        this._index = 6;
        this._name = 'CoordinateToolPlugin';
        this._toolOpen = false;
        this._showMouseCoordinates = false;
        this._showReverseGeocode = this._config ? this._config.isReverseGeocode : false;
        this._popup = null;
        this._latInput = null;
        this._lonInput = null;
        this._reverseGeocodeLabel = null;
        this._dialog = null;
        this._projectionSelect = null;
        this._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this._reverseGeocodeNotImplementedError = false;
        this._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"></div>'),
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
                '   <div class="margintop"><input type="checkbox" id="mousecoordinates"></input><label class="mousecoordinates-label" for="mousecoordinates"></label></div>' +
                '   <div class="margintop">'+
                '      <div class="reversegeocode-label floatleft reverseGeocode-label"></div>'+
                '   </div>' +
                '</div>')
        };
        this.spinnerStopTimer = null;
        this.lastLonLat = null;
    }, {
        /**
         * Get popup-
         * @method @private _getPopup
         *
         * @return {Object} jQuery popup object
         */
        _getPopup: function(){
            var me = this,
                popup = me._popup;
            return popup;
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
                popupLocation;

            me._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
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
                        me._getTransformedCoordinatesFromServer(data, true);
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

            me._popup.makeDraggable();

            if(_.isArray(me._config.supportedProjections)) {
                me._getPreciseTransform = true;
                me._projectionSelect = me._coordinateTransformationExtension.initCoordinatesTransformChange(popupContent);
            } else if (typeof me._config.supportedProjections === 'object') {
               me._viewChangerExtension.initProjectionChange(me._popup);
            }
            if(!me._getPreciseTransform) {
              popupContent.find('.srs').html(crsText);
            }
            me._popup.addClass('coordinatetool__popup');
            me._popup.createCloseIcon();
            me._popup.onClose(function () {
                var el = me.getElement();
                el.removeClass('active');
                me._toolOpen = false;
            });
            me._popup.show(popupTitle, popupContent, [centerToCoordsBtn, addMarkerBtn]);
            me._popup.adaptToMapSize(me._sandbox, popupName);

            //check location of the tool and open popup according to it
            if (me._config.location && me._config.location.classes === "top left") {
                popupLocation = "right";
            } else {
                popupLocation = "left";
            }
            me._popup.moveTo(me.getElement(), popupLocation, true);
            me.refresh();

            if (this._showReverseGeocode){
                this._update3words();
            }
        },
        /**
         * Add marker according to the coordinates given in coordinate popup.
         * @method  @private _addMarker
         */
        _addMarker: function(data){
            var me = this,
                reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.AddMarkerRequest');

            if(reqBuilder) {
                var msg = me._latInput.val() + ', ' + me._lonInput.val();
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
                el.removeClass('active');
                me._toolOpen = false;
                me._popup.close(true);
            } else {
                el.addClass('active');
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
                successCb = function(newLonLat) {
                    if(showMarker) {
                        me._addMarker(newLonLat);
                    }

                    if(showMarker || centerMap) {
                        me._centerMapToSelectedCoordinates(newLonLat);
                    }

                    if(!centerMap) {
                        me._updateLonLat(newLonLat);
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
                //me._config.noUI = true;

            me._locale = Oskari.getLocalization('coordinatetool', Oskari.getLang() || Oskari.getDefaultLanguage()).display;

            el.attr('title', me._locale.tooltip.tool);

            // Bind event listeners
            // XY icon click
            el.unbind('click');
            el.bind('click', function(event){
                if (me._sandbox.mapMode !== "mapPublishMode") {
                    me._toggleToolState();
                    //event.stopPropagation();
                }
            });

            me._changeToolStyle(null, el);

            if(me._config.noUI) {
                return null;
            }

            return el;
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

                var lat = data.lonlat.lat.toFixed(roundToDecimals);
                var lon = data.lonlat.lon.toFixed(roundToDecimals);

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
         * Update 3words value to inputs
         * @method  @private _update3words
         * @param  {Object} data lon and lat object {lonlat: { lat: 0, lon: 0}}
         * @return {[type]}      [description]
         */
        _update3words: function(data){
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
                me._lastLonLat = data;
            }
            if(me._getPreciseTransform) {
                try {
                    data = me._coordinateTransformationExtension.transformCoordinates(data);
                } catch(error) {}
            }
            me._updateLonLat(data);

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me._changeToolStyle(conf.toolStyle, me.getElement());
            }
            return data;
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return jQuery('.mapplugin.coordinatetool');
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
                        me._lastLonLat = _.clone(data);
                        var dataServer = _.clone(data);
                        me.refresh(data);

                        if (event.isPaused() && me._getPreciseTransform){
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }

                        if (event.isPaused() && me._showReverseGeocode){
                            me._update3words(data);
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
                        me._update3words();
                    }
                },
                /**
                 * @method MapClickedEvent
                 * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
                 */
                MapClickedEvent: function (event) {
                    var me = this;
                        lonlat = event.getLonLat(),
                        data = {
                            'lonlat': {
                                'lat': parseFloat(lonlat.lat),
                                'lon': parseFloat(lonlat.lon)
                            }
                        },
                        dataServer = _.clone(data);
                    me._lastLonLat = _.clone(data);

                    if(!me._showMouseCoordinates) {
                        me.refresh(data);
                        if(me._getPreciseTransform) {
                            me._getTransformedCoordinatesFromServer(dataServer, false, true);
                        }
                    }
                    if (me._showReverseGeocode){
                        me._update3words(data);
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
        _changeToolStyle: function (style, div) {
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
            var me = this,
                lon = me._lonInput.val(),
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