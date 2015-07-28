/**
 * @class Oskari.mapframework.bundle.coordinatetool.plugin.CoordinatesPlugin
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinatesPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (config, locale) {
        this._locale = locale;
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinatesPlugin';
        this._defaultLocation = 'top right';
        this._index = 6;
        this._name = 'CoordinatesPlugin';
        this._toolOpen = false;
        this._templates = {
            coordinatetoolpopup: jQuery('<div class="coordinatetool-popup divmanazerpopup" style="width:280px;height:340px;display:none;z-index:15000;background-color: #ffffff;">'+
                '<div>'+
                '<div><h3 class="popupHeader"></h3></div>'+
                '<div class="icon-close icon-close:hover" style="position:absolute;top:8px;right:5px;"></div>'+
                '</div>'+
                '<div class="content" style="height:215px;"></div>'+
                '<div class="actions" style="float:right;">'+
                '<input class="oskari-button oskari-formcomponent primary primary" value="Hae" type="submit">'+
                '</div><div style="clear:both;"></div>'+
                '</div>')
        };
    }, {
        _openTool: function(){
            var me = this,
                placeHolder = me.getElement(),
                pos = placeHolder.offset(),
                eWidth = placeHolder.outerWidth(),
                eHeight = placeHolder.outerHeight(),
                popup = jQuery('.coordinatetool-popup'),
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
        _hidePopup: function(){
            var me = this,
                popup = jQuery('.coordinatetool-popup');
            popup.hide();
        },
        /**
         * @private @method _toggleToolState
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
                me._openTool()
            }
        },
        /**
         * @private @method _createControlElement
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         *
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this,
                loc = me._locale,
                crs = me.getMapModule().getProjection(),
                crsText = loc.crs[crs] || crs,
                el = jQuery('<div class="mapplugin coordinatetool"></div>'),
                popup = me._templates.coordinatetoolpopup.clone();

            // FIXME Get div from Oskari
            jQuery('#mapdiv').append(popup);


            el.unbind('click');
            el.bind('click', function(event){
                me._toggleToolState();
                event.stopPropagation();
            });

            popup.find('.icon-close').unbind('click');
            popup.find('.icon-close').bind('click', function(){
                me._toggleToolState();
            });

            popup.find('.popupHeader').html('Koordinaatit');
            var html = '<div style="font-style:italic;">Klikkaa sijaintia kartalla nähdäksesi koordinaatit tai syötä koordinaatit ja hae</div>';
            html += '<div style="color:#b3b3b3;font-size:12px;">ETRS-TM35FIN koordinaatit</div>';
            html += '<div style="margin-top:10px;"><div style="width:56px;float:left;padding-top:7px;">N / lat:</div><div style="float:left;"><input type="text"></input></div><div style="clear:both;"></div></div>';
            html += '<div style="margin-top:10px;"><div style="width:56px;float:left;padding-top:7px;">E / lon:</div><div style="float:left;"><input type="text"></input></div><div style="clear:both;"></div></div>';
            html += '<div style="margin-top:10px;"><input type="checkbox" id="mousecoordinates"></input><label for="mousecoordinates">Näytä hiiren koordinaatit</label></div>';
            popup.find('.content').html(html);


            // Store coordinate value elements so we can update them fast
    //        me._latEl = el.find('div > div:last-child')[0];
//            me._lonEl = el.find('div > div:last-child')[1];
            me._changeToolStyle(null, el);
            return el;
        },

        /**
         * @method _refresh
         * @param {Object} data contains lat/lon information to show on UI
         * Updates the given coordinates to the UI
         */
        refresh: function (data) {
            var me = this,
                conf = me.getConfig();
/*
            if (!data || !data.latlon) {
                // update with map coordinates if coordinates not given
                var map = me.getSandbox().getMap();
                data = {
                    'latlon': {
                        'lat': Math.floor(map.getY()),
                        'lon': Math.floor(map.getX())
                    }
                };
            }
            if (me._latEl && me._lonEl) {
                me._latEl.innerHTML = Math.floor(data.latlon.lat);
                me._lonEl.innerHTML = Math.floor(data.latlon.lon);
            }
*/
            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me._changeToolStyle(conf.toolStyle, me.getElement());
            }
        },

        /**
         * @method @public getElement
         * Get jQuery element.
         */
        getElement: function(){
            return jQuery('.mapplugin.coordinatetool');
        },
        /**
         * @method @private _createEventHandlers
         * Create event handlers.
         */
        _createEventHandlers: function () {
            return {
                /**
                 * @method MouseHoverEvent
                 * See PorttiMouse.notifyHover
                 */
                MouseHoverEvent: function (event) {
  /*
                    this.refresh({
                        'latlon': {
                            'lat': Math.floor(event.getLat()),
                            'lon': Math.floor(event.getLon())
                        }
                    });
*/
                },
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                AfterMapMoveEvent: function (event) {
  //                  this.refresh();
                },

                'Publisher2.ColourSchemeChangedEvent': function(evt){
                    this._changeToolStyle(evt.getColourScheme());
                    console.log(evt.getColourScheme());
                },
                'Publisher.ColourSchemeChangedEvent': function(evt){
                    this._changeToolStyle(evt.getColourScheme());
                    console.log(evt.getColourScheme());
                }
            };
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         *
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
