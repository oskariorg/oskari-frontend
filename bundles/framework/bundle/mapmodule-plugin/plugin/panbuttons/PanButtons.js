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
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__templates = {};
    this.__elements = {};
    this.__parent = null;
    this.__conf = config;
    this.__prestart = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'PanButtons',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method hasUI
     * This plugin has an UI so always returns true
     * @return {Boolean} true
     */
    hasUI : function() {
        return true;

    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference
     * to map module
     */
    setMapModule : function(mapModule) {
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
    init : function() {
        var me = this;
		var ppid = (new Date()).getTime()+"";
        // templates
        this.__templates['pan'] = jQuery('<div class="panbuttonDiv">' + 
            '<div>' + 
            '  <img class="panbuttonDivImg" usemap="#panbuttons_'+ppid+'">' + 
            '    <map name="panbuttons_'+ppid+'">' + 
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
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },

    /**
     * @method startPlugin
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox. Constructs the plugin UI and displays it.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);

        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        var zb = null;
        if (this._map.div) {
            zb = jQuery(this._map.div).find('.pzbDiv');
        }
        if (this.__conf && this.__conf.location && this.__conf.location.top && zb) {

            // TODO: Ugly, put zoombar and panbuttons in a div instead,
            // see maplayersplugin

            var me = this;
            var mytop = me.__conf.location.top;
            if (mytop == 'auto') {
                mytop = 10;
            } else if (mytop.indexOf('px') >= 0) {
                mytop = mytop.substring(0, mytop.indexOf('px'));
            }
            var mapheight = jQuery(me._map.div).height();
            // var mybtm = mapheight - ((mytop * 1) + 90);
            var mybtm = 'auto';
            var myheight = 90;
            var margin = 10;
            var zbheight = 185;

            var zbtop = zb.css('top');
            var zbbtm = zb.css('bottom');
            if (!zbtop) {
                zbtop = 'auto';
            }
            if (!zbbtm) {
                zbbtm = 'auto';
            }

            if (me.__prestart == null) {
                me.__prestart = {
                    zbtop : zbtop,
                    zbbtm : zbbtm
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
            me.__conf.location.top = mytop;
            me.__conf.location.bottom = mybtm;
            window.setTimeout(function() {
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
    stopPlugin : function(sandbox) {
        if (this.__elements['panbuttons']) {
            this.__elements['panbuttons'].remove();
            delete this.__elements['panbuttons'];
        }
        if (this._map.div && this.__prestart) {
            zb = jQuery(this._map.div).find('.pzbDiv');
            if (zb) {
                zb.css('top', this.__prestart.zbtop);
                zb.css('bottom', this.__prestart.zbbtm);
            }
        }
        sandbox.unregister(this);
    },

    /**
     * @method _draw
     * @private
     *
     * Creates the UI and binds the button functionality to it.
     */
    _draw : function() {
        var me = this;
        if (!me.__parent) {
            me.__parent = this._map.div;
        }
        if (!me.__elements['panbuttons']) {
            me.__elements['panbuttons'] = me.__templates['pan'].clone();
        }

        var pb = me.__elements['panbuttons'];

        // override default location if configured
        if (me.__conf && me.__conf.location) {
            if (me.__conf.location.top) {
                pb.css('bottom', 'auto');
                pb.css('top', me.__conf.location.top);
            }
            if (me.__conf.location.left) {
                pb.css('right', 'auto');
                pb.css('left', me.__conf.location.left);
            }
            if (me.__conf.location.right) {
                pb.css('left', 'auto');
                pb.css('right', me.__conf.location.right);
            }
            if (me.__conf.location.bottom) {
                pb.css('top', 'auto');
                pb.css('bottom', me.__conf.location.bottom);
            }
        }


        var pbimg = this.getMapModule().getImageUrl() + '/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/';
        var panbuttonDivImg = pb.find('.panbuttonDivImg');
        // update path from config
        panbuttonDivImg.attr('src', pbimg + "empty.png");
        
        var center = pb.find('.panbuttons_center');

        center.bind('mouseover', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'root.png');
			panbuttonDivImg.addClass("root");
        });
        center.bind('mouseout', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'default.png');
			panbuttonDivImg.removeClass("root");
        });
        center.bind('click', function(event) {
            var rn = 'StateHandler.SetStateRequest';
            var mm = me.getMapModule();
            var sb = mm.getSandbox();
            var rb = sb.getRequestBuilder(rn);
            if (rb) {
                sb.request(me, rb());
            }
        });

        var left = pb.find('.panbuttons_left');
        left.bind('mouseover', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'left.png');
			panbuttonDivImg.addClass("left");
        });
        left.bind('mouseout', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'default.png');
			panbuttonDivImg.removeClass("left");
        });
        left.bind('click', function(event) {
            me.getMapModule().panMapByPixels(-100, 0, true);
        });

        var right = pb.find('.panbuttons_right');
        right.bind('mouseover', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'right.png');
			panbuttonDivImg.addClass("right");
        });
        right.bind('mouseout', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'default.png');
			panbuttonDivImg.removeClass("right");
        });
        right.bind('click', function(event) {
            me.getMapModule().panMapByPixels(100, 0, true);
        });

        var top = pb.find('.panbuttons_up');
        top.bind('mouseover', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'up.png');
			panbuttonDivImg.addClass("up");
        });
        top.bind('mouseout', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'default.png');
			panbuttonDivImg.removeClass("up");
        });
        top.bind('click', function(event) {
            me.getMapModule().panMapByPixels(0, -100, true);
        });

        var bottom = pb.find('.panbuttons_down');
        bottom.bind('mouseover', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'down.png');
			panbuttonDivImg.addClass("down");
        });
        bottom.bind('mouseout', function(event) {
            //panbuttonDivImg.attr('src', pbimg + 'default.png');
			panbuttonDivImg.removeClass("down");
        });
        bottom.bind('click', function(event) {
            me.getMapModule().panMapByPixels(0, 100, true);
        });
        jQuery(me.__parent).append(pb);
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or
     * discarded* if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method start
     * Module protocol method - does nothing atm
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Module protocol method - does nothing atm
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stop : function(sandbox) {
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
