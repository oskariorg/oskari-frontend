/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        var me = this;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me.templates = {};
        me.element = null;
        me.__parent = null;
        me.conf = config;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'PanButtons',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference
         * to map module
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
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference
         * to map module
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
         * implements Module protocol init method - declares pan
         * buttons templates
         */
        init: function () {
            var me = this,
                ppid = (new Date()).getTime().toString();
            // templates
            this.templates.main = jQuery('<div class="mapplugin panbuttonDiv panbuttons">' +
                '<div>' +
                '  <img class="panbuttonDivImg" usemap="#panbuttons_' + ppid + '">' +
                '    <map name="panbuttons_' + ppid + '">' +
                // center
                '      <area shape="circle" ' + 'class="panbuttons_center" ' + 'coords="45,45,20" href="#">' +
                // left
                '      <area shape="polygon" ' + 'class="panbuttons_left" ' + 'coords="13,20,25,30,20,45,27,65,13,70,5,45" ' + 'href="#">' +
                // up
                '      <area shape="polygon" ' + 'class="panbuttons_up" ' + 'coords="30,8,45,4,60,8,60,23,45,20,30,23" ' + 'href="#">' +
                //right
                '      <area shape="polygon" ' + 'class="panbuttons_right" ' + 'coords="79,20,67,30,72,45,65,65,79,70,87,45" ' + 'href="#">' +
                // down
                '      <area shape="polygon" ' + 'class="panbuttons_down" ' + 'coords="30,82,45,86,60,82,60,68,45,70,30,68" ' + 'href="#">' +
                '    </map>' + '  </img>' + '</div>' + '</div>');
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
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI and displays it.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._sandbox.register(me);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.registerForEventByName(me, p);
                }
            }

            this._draw();
        },

        /**
         * @method stopPlugin
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this;
            if (me.element) {
                me.element.remove();
                delete me.element;
            }
            me._sandbox.unregister(this);
        },

        /**
         * Sets the location of the panbuttons.
         *
         * @method setLocation
         * @param {String} location The new location
         */
        setLocation: function (location) {
            var me = this;
            if (!me.conf) {
                me.conf = {};
            }
            me.conf.location = location;

            // reset plugin if active
            if (me.element) {
                me.stopPlugin();
                me.startPlugin();
            }
        },
        /**
         * @method _draw
         * @private
         *
         * Creates the UI and binds the button functionality to it.
         */
        _draw: function () {
            var me = this;
            if (!me.__parent) {
                me.__parent = this._map.div;
            }
            if (!me.element) {
                me.element = me.templates.main.clone();
            }

            var pb = me.element,
                containerClasses = 'top right',
                position = 0;

            if (me.conf && me.conf.location) {
                containerClasses = me.conf.location.classes || containerClasses;
                position = me.conf.location.position || position;
            }

            me.mapModule.setMapControlPlugin(pb, containerClasses, position);

            var pbimg = this.getMapModule().getImageUrl() + '/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/',
                panbuttonDivImg = pb.find('.panbuttonDivImg');
            // update path from config
            panbuttonDivImg.attr('src', pbimg + "empty.png");

            if (me.conf && me.conf.toolStyle) {
                me.changeToolStyle(me.conf.toolStyle, pb);
            }

            var center = pb.find('.panbuttons_center');

            center.bind('mouseover', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'root.png');
                panbuttonDivImg.addClass("root");
            });
            center.bind('mouseout', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'default.png');
                panbuttonDivImg.removeClass("root");
            });
            center.bind('click', function (event) {
                var rn = 'StateHandler.SetStateRequest',
                    mm = me.getMapModule(),
                    sb = mm.getSandbox(),
                    rb = sb.getRequestBuilder(rn);
                if (rb) {
                    sb.request(me, rb());
                } else {
                    sb.resetState();
                }
            });

            var left = pb.find('.panbuttons_left');
            left.bind('mouseover', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'left.png');
                panbuttonDivImg.addClass("left");
            });
            left.bind('mouseout', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'default.png');
                panbuttonDivImg.removeClass("left");
            });
            left.bind('click', function (event) {
                me.getMapModule().panMapByPixels(-100, 0, true);
            });

            var right = pb.find('.panbuttons_right');
            right.bind('mouseover', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'right.png');
                panbuttonDivImg.addClass("right");
            });
            right.bind('mouseout', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'default.png');
                panbuttonDivImg.removeClass("right");
            });
            right.bind('click', function (event) {
                me.getMapModule().panMapByPixels(100, 0, true);
            });

            var top = pb.find('.panbuttons_up');
            top.bind('mouseover', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'up.png');
                panbuttonDivImg.addClass("up");
            });
            top.bind('mouseout', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'default.png');
                panbuttonDivImg.removeClass("up");
            });
            top.bind('click', function (event) {
                me.getMapModule().panMapByPixels(0, -100, true);
            });

            var bottom = pb.find('.panbuttons_down');
            bottom.bind('mouseover', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'down.png');
                panbuttonDivImg.addClass("down");
            });
            bottom.bind('mouseout', function (event) {
                //panbuttonDivImg.attr('src', pbimg + 'default.png');
                panbuttonDivImg.removeClass("down");
            });
            bottom.bind('click', function (event) {
                me.getMapModule().panMapByPixels(0, 100, true);
            });
            pb.mousedown(function (event) {
                var radius = Math.round(0.5 * panbuttonDivImg[0].width),
                    pbOffset = panbuttonDivImg.offset(),
                    centerX = pbOffset.left + radius,
                    centerY = pbOffset.top + radius;
                if (Math.sqrt(Math.pow(centerX - event.pageX, 2) + Math.pow(centerY - event.pageY, 2)) < radius) {
                    event.stopPropagation();
                }
            });
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded* if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method start
         * Module protocol method - does nothing atm
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Module protocol method - does nothing atm
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        stop: function (sandbox) {},

        /**
         * Changes the tool style of the plugin
         *
         * @method changeToolStyle
         * @param {Object} styleName
         * @param {jQuery} div
         */
        changeToolStyle: function (styleName, div) {
            div = div || this.element;

            if (!div) {
                return;
            }

            var panButtons = div.find('img.panbuttonDivImg');
            if (styleName === null) {
                panButtons.removeAttr('style');
            } else {

                var resourcesPath = this.getMapModule().getImageUrl(),
                    imgUrl = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/',
                    bgImg = imgUrl + 'panbutton-sprites-' + styleName + '.png';

                panButtons.css({
                    'background-image': 'url("' + bgImg + '")'
                });
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });