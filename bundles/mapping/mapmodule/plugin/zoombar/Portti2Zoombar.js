// FIXME remove this to right place
if(Oskari && Oskari.util){
    Oskari.util.getColorBrightness = function(color){
        var r,g,b,brightness;

        if (color.match(/^rgb/)) {
          color = color.match(/rgba?\(([^)]+)\)/)[1];
          color = color.split(/ *, */).map(Number);
          r = color[0];
          g = color[1];
          b = color[2];
        } else if ('#' == color[0] && 7 == color.length) {
          r = parseInt(color.slice(1, 3), 16);
          g = parseInt(color.slice(3, 5), 16);
          b = parseInt(color.slice(5, 7), 16);
        } else if ('#' == color[0] && 4 == color.length) {
          r = parseInt(color[1] + color[1], 16);
          g = parseInt(color[2] + color[2], 16);
          b = parseInt(color[3] + color[3], 16);
        }

        brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 125) {
          return 'dark';
        } else {
          return 'light';
        }
    };
    Oskari.util.isDarkColor = function(color){
        var me = this;
        return me.getColorBrightness(color) === 'dark';
    };
    Oskari.util.isLightColor = function(color){
        return me.getColorBrightness(color) === 'light';
    };
}

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 * Zoombar implementation with jQuery UI and refined graphics. Location can be configured,
 * but defaults on top of the map with placement details on the css-file.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPorttiZoombar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        var me = this;
        // hackhack for old configs so we don't have to remove
        // with-panbuttons from them
        this._config = config;
        if (config && config.location && config.location.classes) {
            config.location.classes = config.location.classes.replace(
                'with-panbuttons',
                ''
            );
            this._config = config;
        }
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar';
        this._defaultLocation = 'top right';
        this._index = 20;
        this._name = 'Portti2Zoombar';
        this._slider = null;
        this._suppressEvents = false;
        
        this.mobileDefs = {
            buttons:  {
                'mobile-zoom-in': {
                    iconCls: 'icon-maximize',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function () {
                        var mapModule = me.getMapModule();
                        var currentZoom = mapModule.getMapZoom();
                        var maxZoomLevel = mapModule.getMaxZoomLevel();
                        if(currentZoom<maxZoomLevel) {
                            me.getMapModule().setZoomLevel(currentZoom+1);
                        }                        
                    }
                },
                'mobile-zoom-out': {
                    iconCls: 'icon-minimize',
                    tooltip: '',
                    sticky: true,
                    show: true,
                    callback: function () {
                        var mapModule = me.getMapModule();
                        var currentZoom = mapModule.getMapZoom();
                        if(currentZoom>0) {
                            me.getMapModule().setZoomLevel(currentZoom-1);
                        }    
                    }
                }
            },
            buttonGroup: 'mobile-zoombar'
        };



        this._desktopStyles = {
            plus: {
                css: {}
            },
            minus: {
                css: {}
            }
        };

        this.toolStyles = {
            'default': {
                val: null
            },
            'rounded-dark': {
                val: 'rounded-dark',
                widthPlus: '22px',
                widthMinus: '22px',
                widthCenter: '22px',
                heightPlus: '38px',
                heightMinus: '39px',
                heightCenter: 12,
                heightCursor: '18px',
                widthCursor: '17px'
            },
            'rounded-light': {
                val: 'rounded-light',
                widthPlus: '22px',
                widthMinus: '22px',
                widthCenter: '22px',
                heightPlus: '38px',
                heightMinus: '39px',
                heightCenter: 12,
                heightCursor: '18px',
                widthCursor: '17px'
            },
            'sharp-dark': {
                val: 'sharp-dark',
                widthPlus: '23px',
                widthMinus: '23px',
                widthCenter: '23px',
                heightPlus: '17px',
                heightMinus: '18px',
                heightCenter: 16,
                heightCursor: '16px',
                widthCursor: '23px'
            },
            'sharp-light': {
                val: 'sharp-light',
                widthPlus: '23px',
                widthMinus: '23px',
                widthCenter: '23px',
                heightPlus: '17px',
                heightMinus: '18px',
                heightCenter: 16,
                heightCursor: '16px',
                widthCursor: '23px'
            },
            '3d-dark': {
                val: '3d-dark',
                widthPlus: '23px',
                widthMinus: '23px',
                widthCenter: '23px',
                heightPlus: '35px',
                heightMinus: '36px',
                heightCenter: 13,
                heightCursor: '13px',
                widthCursor: '23px'
            },
            '3d-light': {
                val: '3d-light',
                widthPlus: '23px',
                widthMinus: '23px',
                widthCenter: '23px',
                heightPlus: '35px',
                heightMinus: '36px',
                heightCenter: 13,
                heightCursor: '13px',
                widthCursor: '23px'
            }
        };
    }, {
        /**
         * @private @method _createControlElement
         * Draws the zoombar on the screen.
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            var me = this,
                el = jQuery(
                    '<div class="oskariui mapplugin pzbDiv zoombar">' +
                    '  <div class="pzbDiv-plus"></div>' +
                    '  <div class="slider"></div>' +
                    '  <div class="pzbDiv-minus"></div>' +
                    '</div>'
                ),
                mapModule = me.getMapModule(),
                sliderEl = el.find('div.slider');

            sliderEl.attr('id', 'pzb-slider-' + me.getName());

            el.mousedown(function (event) {
                if (!me.inLayerToolsEditMode()) {
                    event.stopPropagation();
                }
            });

            sliderEl.css(
                'height',
                (mapModule.getMaxZoomLevel() * 11) + 'px'
            );
            me._slider = sliderEl.slider({
                orientation: 'vertical',
                range: 'min',
                min: 0,
                max: mapModule.getMaxZoomLevel(),
                value: mapModule.getMapZoom(),
                slide: function (event, ui) {
                   me.getMapModule().setZoomLevel(ui.value);
                }
            });

            el.find('.pzbDiv-plus').bind('click', function (event) {
                if (!me.inLayerToolsEditMode()) {
                    if (me._uiMode === 'desktop' && me._slider.slider('value') < mapModule.getMaxZoomLevel()) {
                        me.getMapModule().setZoomLevel(
                            me._slider.slider('value') + 1
                        );
                    }
                }
            });

            el.find('.pzbDiv-minus').bind('click', function (event) {
                if (!me.inLayerToolsEditMode()) {
                    if (me._uiMode === 'desktop' && me._slider.slider('value') > 0) {
                        me.getMapModule().setZoomLevel(
                            me._slider.slider('value') - 1
                        );
                    }
                }
            });

            return el;
        },

        /**
         * @public  @method _refresh
         * Called after a configuration change.
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
                if (!toolStyle) {
                    toolStyle = "default";
                }
                if (toolStyle !== null && toolStyle !== undefined) {
                    me.changeToolStyle(me.toolStyles[toolStyle], me.getElement());
                }
            }
            me._setZoombarValue(me.getMapModule().getMapZoom());
        },

        /**
         * @private @method _setZoombarValue
         * Sets the zoombar slider value
         *
         * @param {Number} value new Zoombar value
         *
         */
        _setZoombarValue: function (value) {
            var me = this;
            if (me._uiMode === 'desktop' && me._slider) {
                // disable events in "onChange"
                me._suppressEvents = true;
                /*me._slider.setValue(value);*/
                me._slider.slider('value', value);
                me._suppressEvents = false;
            }
        },

        /**
         * @method _createEventHandlers
         * Create eventhandlers.
         *
         *
         * @return {Object.<string, Function>} EventHandlers
         */
        _createEventHandlers: function () {
            var me = this;
            return {
                AfterMapMoveEvent: function (event) {
                    me._setZoombarValue(event.getZoom());
                }
            };
        },

        /**
         * @method  @private _handleMapSizeChanges handle map size changes
         * @param  {Object} size {width:100, height:200}
         * @param {Object} el jQuery element
         */
        _handleMapSizeChanges: function(size, el){
            return;
            var me = this,
                div = el || this.getElement(),
                plus = div.find('.pzbDiv-plus'),
                minus = div.find('.pzbDiv-minus'),
                slider = div.find('div.slider');

            if(size.height < me._mobileDefs.height) {
                slider.hide();
                plus.css({
                    'background-image': 'url("' + this.getImagePath() + 'zoombar_plus_mobile.png")',
                    'width': 43,
                    'height': 43
                });

                minus.css({
                    'background-image': 'url("' + this.getImagePath() + 'zoombar_minus_mobile.png")',
                    'width': 43,
                    'height': 43
                });
                div.width(43);

            }
            else {
                slider.show();
                plus.css(me._desktopStyles.plus.css);
                minus.css(me._desktopStyles.minus.css);
                div.width(18);
            }

        },

        _setLayerToolsEditModeImpl: function () {
            if (this._uiMode === 'desktop' && this._slider) {
                this._slider.slider(
                    'option',
                    'disabled',
                    this.inLayerToolsEditMode()
                );
            }
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} styleId
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (style, div) {
            var me = this;
            // FIXME move under _setStyle or smthn...
            div = div || this.getElement();

            if (!div) {
                return;
            }
            if (!style) {
                style = this.toolStyles["default"];
            } else if (!style.hasOwnProperty("widthCenter")) {
                style = this.toolStyles[style] ? this.toolStyles[style] : this.toolStyles["default"];
            }

            var imgUrl = this.getImagePath(),
                styleName = style.val,
                zoombarImg = imgUrl + 'zoombar-' + styleName + '.png',
                zoombarCursorImg = imgUrl + 'zoombar-cursor-' + styleName + '.png',
                zoombarMinusImg = imgUrl + 'zoombar_minus-' + styleName + '.png',
                zoombarPlusImg = imgUrl + 'zoombar_plus-' + styleName + '.png',
                bar = div.find('.ui-slider-vertical'),
                cursor = div.find('.ui-slider-handle'),
                plus = div.find('.pzbDiv-plus'),
                minus = div.find('.pzbDiv-minus'),
                slider = div.find('div.slider'),
                mapModule = me.getMapModule();

            // FIXME get rid of this, rounded style should be fixed instead
            // Used to get the cursor to the right position since
            // it's off by 2 pixels with the 'rounded' style.
            var isRounded = styleName && styleName.match(/^rounded/),
                sliderHeight = this.getMapModule().getMaxZoomLevel() * style.heightCenter;

            if (style.val === null) {
                bar.css({
                    'background-image': '',
                    'width': '',
                    'margin-left': ''
                });
                cursor.css({
                    'background-image': '',
                    'width': '',
                    'height': '',
                    'margin-left': ''
                });

                me._desktopStyles = {
                    plus: {
                        css: {
                            'background-image': '',
                            'width': '',
                            'height': ''
                        }
                    },
                    minus: {
                        css: {
                            'background-image': '',
                            'width': '',
                            'height': ''
                        }
                    }
                };
                plus.css(me._desktopStyles.plus.css);
                minus.css(me._desktopStyles.minus.css);

                slider.css({
                    'height': sliderHeight + 'px'
                });
            } else {
                bar.css({
                    'background-image': 'url("' + zoombarImg + '")',
                    'width': style.widthCenter,
                    'margin-left': '0'
                });
                cursor.css({
                    'background-image': 'url("' + zoombarCursorImg + '")',
                    'width': style.widthCursor,
                    'height': style.heightCursor,
                    'margin-left': (isRounded ? '2px' : '0')
                });

                me._desktopStyles = {
                    plus: {
                        css: {
                            'background-image': 'url("' + zoombarPlusImg + '")',
                            'width': style.widthPlus,
                            'height': style.heightPlus
                        }
                    },
                    minus: {
                        css: {
                            'background-image': 'url("' + zoombarMinusImg + '")',
                            'width': style.widthMinus,
                            'height': style.heightMinus
                        }
                    }
                };

                plus.css(me._desktopStyles.plus.css);
                minus.css(me._desktopStyles.minus.css);
                slider.css({
                    'height': sliderHeight + 'px'
                });
            }

            me._handleMapSizeChanges(mapModule.getSize(), div);
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         */
        createPluginUI: function (mapInMobileMode) {
            var me = this,
                sandbox = me.getSandbox();
            

            //remove old element
            if (me._element) {
                me.getMapModule().removeMapControlPlugin(
                    me._element,
                    me.inLayerToolsEditMode(),
                    me._uiMode
                );
                me._element.remove();
                delete me._element;
                me._slider.remove();
                delete me._slider;
            }

            if (mapInMobileMode) {                
                var toolbar = me.getMapModule().getMobileToolbar();
                var reqBuilder = sandbox.getRequestBuilder(
                    'Toolbar.AddToolButtonRequest'
                );

                if (reqBuilder) {
                    for (var tool in me.mobileDefs.buttons) {
                        var buttonConf = me.mobileDefs.buttons[tool];
                        buttonConf.toolbarid = toolbar;
                        sandbox.request(me, reqBuilder(tool, me.mobileDefs.buttonGroup, buttonConf));
                    }
                }
                
                me._uiMode = 'mobile';
            } else {                                
                me._element = me._createControlElement();
                me.getMapModule().setMapControlPlugin(
                    me._element,
                    me.getLocation(),
                    me.getIndex()
                );
                me._uiMode = 'desktop';
            }
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