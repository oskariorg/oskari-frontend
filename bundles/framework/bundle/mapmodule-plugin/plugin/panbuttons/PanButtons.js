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
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.__templates = {};
        this.__elements = {};
        this.__parent = null;
        this.conf = config;
        this.__prestart = null;
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
            this.__templates.pan = jQuery('<div class="mapplugin panbuttonDiv">' +
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
                p,
                zb = null;
            me._sandbox = sandbox;
            sandbox.register(me);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            if (me._map.div) {
                zb = jQuery(me._map.div).find('.pzbDiv');
            }
            if (me.conf && me.conf.location && me.conf.location.top && zb) {

                // TODO: Ugly, put zoombar and panbuttons in a div instead,
                // see maplayersplugin

                var mytop = me.conf.location.top;
                if (mytop === 'auto') {
                    mytop = 10;
                } else if (mytop.indexOf('px') >= 0) {
                    mytop = mytop.substring(0, mytop.indexOf('px'));
                }
                var mapheight = jQuery(me._map.div).height();
                // var mybtm = mapheight - ((mytop * 1) + 90);
                var mybtm = 'auto',
                    myheight = 90,
                    margin = 10,
                    zbheight = 185,
                    zbtop = zb.css('top'),
                    zbbtm = zb.css('bottom');
                if (!zbtop) {
                    zbtop = 'auto';
                }
                if (!zbbtm) {
                    zbbtm = 'auto';
                }

                if (!me.__prestart) {
                    me.__prestart = {
                        zbtop: zbtop,
                        zbbtm: zbbtm
                    };
                }
                mytop = 10;
                mybtm = 'auto';
                zbtop = 110;
                zbbtm = 'auto';

                if (zbtop !== 'auto') {
                    zbtop = zbtop + 'px';
                }
                if (zbbtm !== 'auto') {
                    zbbtm = zbbtm + 'px';
                }
                zb.css('top', zbtop);
                zb.css('bottom', zbbtm);
                if (mytop !== 'auto') {
                    mytop = mytop + 'px';
                }
                if (mybtm !== 'auto') {
                    mybtm = mybtm + 'px';
                }
                me.conf.location.top = mytop;
                me.conf.location.bottom = mybtm;
                window.setTimeout(function () {
                    var pb = me.__elements.panbuttons;
                    if (pb) {
                        pb.css('top', mytop);
                        pb.css('bottom', 'auto');
                    }
                }, 50);
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
            if (this.__elements.panbuttons) {
                this.__elements.panbuttons.remove();
                delete this.__elements.panbuttons;
            }
            if (this._map.div && this.__prestart) {
                var zb = jQuery(this._map.div).find('.pzbDiv');
                if (zb) {
                    zb.css('top', this.__prestart.zbtop);
                    zb.css('bottom', this.__prestart.zbbtm);
                }
            }
            sandbox.unregister(this);
        },

        setLocation: function (location, panbuttonContainer) {
            var container = panbuttonContainer || this.__elements.panbuttons;
            // override default location if configured
            if (location) {
                if (location.top) {
                    container.css('bottom', 'auto');
                    container.css(location.top);
                }
                if (location.left) {
                    container.css('right', 'auto');
                    container.css('left', location.left);
                }
                if (location.right) {
                    container.css('left', 'auto');
                    container.css('right', location.right);
                }
                if (location.bottom) {
                    container.css('top', 'auto');
                    container.css('bottom', location.bottom);
                }
                if (location.classes) {
                    container.removeClass('top left bottom right center').addClass(location.classes);
                }
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
            if (!me.__elements.panbuttons) {
                me.__elements.panbuttons = me.__templates.pan.clone();
            }

            var pb = me.__elements.panbuttons;

            jQuery(me.__parent).append(pb);

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
                var rn = 'StateHandler.SetStateRequest';
                var mm = me.getMapModule();
                var sb = mm.getSandbox();
                var rb = sb.getRequestBuilder(rn);
                if (rb) {
                    sb.request(me, rb());
                } else {
                    sb.resetState();
                }
            });

            if (me.conf && me.conf.location) {
                me.setLocation(me.conf.location, pb);
            }

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
            div = div || this.__elements.panbuttons;

            if (!styleName || !div) {
                return;
            }

            var resourcesPath = this.getMapModule().getImageUrl(),
                imgUrl = resourcesPath + '/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/',
                bgImg = imgUrl + 'panbutton-sprites-' + styleName + '.png',
                panButtons = div.find('img.panbuttonDivImg');

            panButtons.css({
                'background-image': 'url("' + bgImg + '")'
            });
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });