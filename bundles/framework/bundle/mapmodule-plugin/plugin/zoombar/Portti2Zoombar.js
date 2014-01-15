/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 *
 * Zoombar implementation with jQuery UI and refined graphics. Location can be configured,
 * but defaults on top of the map with placement details on the css-file.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPorttiZoombar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.templates = {};
        this.element = null;
        this.__parent = null;
        this._slider = null;
        this._zoombar_messages = {};
        this._suppressEvents = false;
        this.conf = config;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Portti2Zoombar',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * Returns reference to map module
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this._map = mapModule.getMap();
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method init
         * implements Module protocol init method - declares popup templates
         */
        init: function () {
            var me = this;
            // templates
            this.templates.main = jQuery('<div class="oskariui mapplugin pzbDiv zoombar" data-clazz="Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar">' +
                '<div class="pzbDiv-plus"  title="Katu"></div>' +
                '<input type=\'hidden\' />' +
                '<div class="slider"></div>' +
                '<div class="pzbDiv-minus"  title="Koko Maa"></div>' +
                '</div>');
        },
        /**
         * @method register
         * mapmodule.Plugin protocol method - does nothing atm
         */
        register: function () {

        },
        /**
         * @method unregister
         * mapmodule.Plugin protocol method - does nothing atm
         */
        unregister: function () {},
        /**
         * @method startPlugin
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox
         */
        startPlugin: function (sandbox) {
            var p;
            this._sandbox = sandbox || this.getMapModule().getSandbox();
            this._sandbox.register(this);

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this._sandbox.registerForEventByName(this, p);
                }
            }
            this._draw();
            this._setZoombarValue(this._map.getZoom());
        },
        /**
         * @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            if (me.element) {
                me.element.remove();
                me._slider.remove();
                delete me.element;
            }

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);

            //this._map = null;
            me._sandbox = null;
        },
        /**
         * @method _draw
         * @private
         *
         * Draws the zoombar on the screen.
         */
        _draw: function () {
            var me = this;
            if (!me.__parent) {
                me.__parent = me._map.div;
            }
            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            var inputId = 'pzb-input-' + me.getName(),
                sliderId = 'pzb-slider-' + me.getName(),
                sliderEl = me.element.find('div.slider'),
                containerClasses = 'top right',
                position = 2;


            me.element.find('input').attr('id', inputId);
            sliderEl.attr('id', sliderId);

            me.element.mousedown(function (event) {
                if (!me.isInLayerToolsEditMode) {
                    event.stopPropagation();
                }
            });

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }

            // hackhack for old configs so we don't have to remove with-panbuttons from them
            me.getMapModule().setMapControlPlugin(me.element, containerClasses.replace('with-panbuttons', ''), position);

            sliderEl = me.element.find('div.slider');
            sliderEl.css("height", (me._map.getNumZoomLevels() * 11) + "px");
            me._slider = sliderEl.slider({
                orientation: "vertical",
                range: "min",
                min: 0,
                max: me._map.getNumZoomLevels() - 1,
                value: me._map.getZoom(),
                slide: function (event, ui) {
                    me.getMapModule().zoomTo(ui.value);
                }
            });


            var plus = me.element.find('.pzbDiv-plus');
            plus.bind('click', function (event) {
                if (!me.isInLayerToolsEditMode) {
                    if (me._slider.slider('value') < me._map.getNumZoomLevels()) {
                        me.getMapModule().zoomTo(me._slider.slider('value') + 1);
                    }
                }
            });
            var minus = me.element.find('.pzbDiv-minus');
            minus.bind('click', function (event) {
                if (!me.isInLayerToolsEditMode) {
                    if (me._slider.slider('value') > 0) {
                        me.getMapModule().zoomTo(me._slider.slider('value') - 1);
                    }
                }
            });

            // Change the style if in the conf
            if (me.conf && me.conf.toolStyle) {
                me.changeToolStyle(me.conf.toolStyle, me.element);
            }
            // in case we are already in edit mode when plugin is drawn
            me._setLayerToolsEditMode(me.getMapModule().isInLayerToolsEditMode());

        },
        /**
         * @method _setZoombarValue
         * Sets the zoombar slider value
         * @private
         * @param {Number} value new Zoombar value
         */
        _setZoombarValue: function (value) {
            var me = this;
            if (me._slider) {
                // disable events in "onChange"
                this._suppressEvents = true;
                /*me._slider.setValue(value);*/
                me._slider.slider('value', value);
                this._suppressEvents = false;
            }
        },

        /**
         * Sets the location of the zoombar.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location.classes = location;
            // reset plugin if active
            if (me.element) {
                //me.stopPlugin();
                //me.startPlugin();
                me.getMapModule().setMapControlPlugin(me.element, location, 2);
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapMoveEvent': function (event) {
                if (this._sandbox) {
                    var me = this;
                    me._setZoombarValue(event.getZoom());
                }
            },
            'LayerToolsEditModeEvent': function (event) {
                if (this._sandbox) {
                    this._setLayerToolsEditMode(event.isInMode());
                    if (this.isInLayerToolsEditMode == false) {
                        this.setLocation(this.element.parents('.mapplugins').attr('data-location'));
                    }
                }
            }
        },

        _setLayerToolsEditMode: function (isInEditMode) {
            this.isInLayerToolsEditMode = isInEditMode;
            if (this._slider != null && this.isInLayerToolsEditMode) {
                this._slider.slider("option", "disabled", true);
            } else if (this._slider != null) {
                this._slider.slider("option", "disabled", false);
            }
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method start
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Module protocol method - does nothing atm
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Module protocol method - does nothing atm
         */
        stop: function (sandbox) {},

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            div = div || this.element;

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

            // Used to get the cursor to the right position since
            // it's off by 2 pixels with the 'rounded' style.
            var isRounded = styleName.match(/^rounded/);

            var sliderHeight = this._map.getNumZoomLevels() * style.heightCenter;

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
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });