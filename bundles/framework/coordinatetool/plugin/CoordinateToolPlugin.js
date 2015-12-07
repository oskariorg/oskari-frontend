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
        this._config = config;
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._instance = instance;
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        this._defaultLocation = 'top right';
        this._index = 6;
        this._name = 'CoordinateToolPlugin';
        this._toolOpen = false;
        this._showMouseCoordinates = false;
        this._popup = null;
        this._latInput = null;
        this._lonInput = null;
        this._dialog = null;
        this._templates = {
            coordinatetool: jQuery('<div class="mapplugin coordinatetool"></div>'),
            popup: jQuery('<div class="coordinatetool__popup divmanazerpopup">'+
                '<div>'+
                '<div><h3 class="popupHeader"></h3></div>'+
                '<div class="coordinatetool__close icon-close icon-close:hover"></div>'+
                '</div>'+
                '<div class="content"></div>'+
                '<div class="actions">'+
                '<input class="oskari-button oskari-formcomponent primary primary" type="submit">'+
                '</div><div class="clear"></div>'+
                '</div>'),
            popupContent: jQuery('<div><div class="coordinatetool__popup__content"></div>' +
                '<div class="srs"></div>' +
                '<div class="margintop"><div class="coordinate-label floatleft lat-label"></div><div class="floatleft"><input type="text" class="lat-input"></input></div><div class="clear"></div></div>' +
                '<div class="margintop"><div class="coordinate-label floatleft lon-label"></div><div class="floatleft"><input type="text" class="lon-input"></input></div><div class="clear"></div></div>' +
                '<div class="margintop"><input type="checkbox" id="mousecoordinates"></input><label class="mousecoordinates-label" for="mousecoordinates"></label></div></div>')
        };
    }, {
        /**
         * Get popup-
         * @method @private _getPopup
         *
         * @return {Object} jQuery popup object
         */
        _getPopup: function(){
            var me = this,
                popup = me._popup || jQuery('.coordinatetool__popup');
            return popup;
        },

        /**
         * Show popup.
         * @method @private _showPopup
         */
        _showPopup: function(){
            var me = this,
                placeHolder = me.getElement(),
                pos = placeHolder.offset(),
                eWidth = placeHolder.outerWidth(),
                eHeight = placeHolder.outerHeight(),
                popup = me._getPopup(),
                mWidth = popup.outerWidth(),
                mHeight = popup.outerHeight(),
                right = (eWidth + 50) + 'px',
                top = ((pos.top + eHeight/2)- mHeight/2) + 'px';

            popup.css({
                position: 'absolute',
                right: right,
                top: top,
                left: 'auto'
            });
            popup.fadeIn();

        },

        /**
         * Hide popup.
         * @method  @private _hidePopup
         */
        _hidePopup: function(){
            var me = this,
                popup = me._getPopup();
            popup.hide();
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
                me._hidePopup();
            } else {
                el.addClass('active');
                me._toolOpen = true;
                me._showPopup();
            }
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
        _centerMapToSelectedCoordinates: function(){
            var me = this,
                lonVal = me._lonInput.val(),
                latVal = me._latInput.val(),
                loc = me._locale;
            if(this.getMapModule().isValidLonLat(lonVal,latVal)) {
                var moveReqBuilder = me._sandbox.getRequestBuilder('MapMoveRequest');
                var moveReq = moveReqBuilder(lonVal, latVal);
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
                loc = me._locale,
                crs = me.getMapModule().getProjection(),
                el = me._templates.coordinatetool.clone(),
                popup = me._templates.popup.clone(),
                popupContent = me._templates.popupContent.clone(),
                crs = me.getMapModule().getProjection(),
                crsDefaultText = loc.crs.default,
                crsText = loc.crs[crs] || crsDefaultText.replace('{crs}', crs);

            // Set locales
            popup.find('.oskari-button').val(loc.popup.searchButton);
            popup.find('.popupHeader').html(loc.popup.title);
            popupContent.find('.coordinatetool__popup__content').html(loc.popup.info);
            popupContent.find('.srs').html(crsText);
            popupContent.find('.lat-label').html(loc.compass.lat);
            popupContent.find('.lon-label').html(loc.compass.lon);
            popupContent.find('.mousecoordinates-label').html(loc.popup.showMouseCoordinates);
            popup.find('.icon-close').attr('title', loc.tooltip.close);
            el.attr('title', loc.tooltip.tool);

            // Bind event listeners
            // XY icon click
            el.unbind('click');
            el.bind('click', function(event){
                me._toggleToolState();
                event.stopPropagation();
            });

            // tool popup close icon click
            popup.find('.icon-close').unbind('click');
            popup.find('.icon-close').bind('click', function(){
                me._toggleToolState();
            });
            popup.find('.content').html(popupContent);

            // showmousecoordinates checkbox change
            popup.find('#mousecoordinates').unbind('change');
            popup.find('#mousecoordinates').bind('change', function(){
                me._showMouseCoordinates = jQuery(this).prop('checked');
                me._setDisabledInputs(me._showMouseCoordinates, false);
            });

            // search button click
            popup.find('.oskari-button').unbind('click');
            popup.find('.oskari-button').bind('click', function(){
                me._centerMapToSelectedCoordinates();
            });

            // Set element on variables for later use
            me._popup = popup;
            me._latInput = popupContent.find('.lat-input');
            me._lonInput = popupContent.find('.lon-input');


            jQuery(me.getMapModule().getMapEl()).append(popup);

            me._changeToolStyle(null, el);
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
                me._latInput.val(data.lonlat.lat.toFixed(roundToDecimals));
                me._lonInput.val(data.lonlat.lon.toFixed(roundToDecimals));
            }
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
                var map = me.getSandbox().getMap();
                data = {
                    'lonlat': {
                        'lat': parseFloat(map.getY()),
                        'lon': parseFloat(map.getX())
                    }
                };
                me._updateLonLat(data);
            } else {
                me._updateLonLat(data);
            }


            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me._changeToolStyle(conf.toolStyle, me.getElement());
            }
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return jQuery('.mapplugin.coordinatetool');
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
                    if(this._showMouseCoordinates) {
                        this.refresh({
                            'lonlat': {
                                'lat': parseFloat(event.getLat()),
                                'lon': parseFloat(event.getLon())
                            }
                        });
                    }

                },
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                AfterMapMoveEvent: function (event) {
                    if(!this._showMouseCoordinates) {
                        this.refresh();
                    }
                },
                /**
                 * @method MapClickedEvent
                 * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
                 */
                MapClickedEvent: function (event) {
                    if(!this._showMouseCoordinates) {
                        var lonlat = event.getLonLat();
                        this.refresh({
                            'lonlat': {
                                'lat': parseFloat(lonlat.lat),
                                'lon': parseFloat(lonlat.lon)
                            }
                        });
                    }
                },
                /**
                 * @method Publisher2.ColourSchemeChangedEvent
                 * @param  {Oskari.mapframework.bundle.publisher2.event.ColourSchemeChangedEvent} evt
                 */
                'Publisher2.ColourSchemeChangedEvent': function(evt){
                    this._changeToolStyle(evt.getColourScheme());
                },
                /**
                 * @method Publisher.ColourSchemeChangedEvent
                 * @param  {Oskari.mapframework.bundle.publisher.event.ColourSchemeChangedEvent} evt
                 */
                'Publisher.ColourSchemeChangedEvent': function(evt){
                    this._changeToolStyle(evt.getColourScheme());
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
