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
    function () {
        this._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar';
        this._defaultLocation = 'top right';
        this._index = 2;
        this._name = 'Portti2Zoombar';
        this._slider = null;
        this._suppressEvents = false;
    }, {
        _initImpl: function () {
            // hackhack for old configs so we don't have to remove
            // with-panbuttons from them
            var conf = this.getConfig();
            if (conf && conf.location && conf.location.classes) {
                conf.location.classes =
                    conf.location.classes.replace('with-panbuttons', '');
                this._config = conf;
            }
        },

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
                map = me.getMap(),
                sliderEl = el.find('div.slider');

            sliderEl.attr('id', 'pzb-slider-' + me.getName());

            el.mousedown(function (event) {
                if (!me.inLayerToolsEditMode()) {
                    event.stopPropagation();
                }
            });

            sliderEl.css(
                'height',
                (map.getNumZoomLevels() * 11) + 'px'
            );
            me._slider = sliderEl.slider({
                orientation: 'vertical',
                range: 'min',
                min: 0,
                max: map.getNumZoomLevels() - 1,
                value: map.getZoom(),
                slide: function (event, ui) {
                    me.getMapModule().zoomTo(ui.value);
                }
            });

            el.find('.pzbDiv-plus').bind('click', function (event) {
                if (!me.inLayerToolsEditMode()) {
                    if (me._slider.slider('value') < map.getNumZoomLevels()) {
                        me.getMapModule().zoomTo(
                            me._slider.slider('value') + 1
                        );
                    }
                }
            });

            el.find('.pzbDiv-minus').bind('click', function (event) {
                if (!me.inLayerToolsEditMode()) {
                    if (me._slider.slider('value') > 0) {
                        me.getMapModule().zoomTo(
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
            }
            me._setZoombarValue(me.getMap().getZoom());
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
            if (me._slider) {
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

        _setLayerToolsEditModeImpl: function () {
            if (this._slider) {
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
         * @param {Object} style
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (style, div) {
            // FIXME move under _setStyle or smthn...
            div = div || this.getElement();

            if (!style || !div) {
                return;
            }

            var resourcesPath = this.getMapModule().getImageUrl(),
                imgUrl = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/portti2zoombar/images/',
                styleName = style.val,
                zoombarImg = imgUrl + 'zoombar-' + styleName + '.png',
                zoombarCursorImg = imgUrl + 'zoombar-cursor-' + styleName + '.png',
                zoombarMinusImg = imgUrl + 'zoombar_minus-' + styleName + '.png',
                zoombarPlusImg = imgUrl + 'zoombar_plus-' + styleName + '.png',
                bar = div.find('.ui-slider-vertical'),
                cursor = div.find('.ui-slider-handle'),
                plus = div.find('.pzbDiv-plus'),
                minus = div.find('.pzbDiv-minus'),
                slider = div.find('div.slider');

            // FIXME get rid of this, rounded style should be fixed instead
            // Used to get the cursor to the right position since
            // it's off by 2 pixels with the 'rounded' style.
            var isRounded = styleName && styleName.match(/^rounded/),
                sliderHeight = this.getMap().getNumZoomLevels() * style.heightCenter;

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
                plus.css({
                    'background-image': '',
                    'width': '',
                    'height': ''
                });
                minus.css({
                    'background-image': '',
                    'width': '',
                    'height': ''
                });
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
                plus.css({
                    'background-image': 'url("' + zoombarPlusImg + '")',
                    'width': style.widthPlus,
                    'height': style.heightPlus
                });
                minus.css({
                    'background-image': 'url("' + zoombarMinusImg + '")',
                    'width': style.widthMinus,
                    'height': style.heightMinus
                });
                slider.css({
                    'height': sliderHeight + 'px'
                });
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