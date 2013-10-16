/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * Adds on-screen pan buttons on the map. In the middle of the pan buttons is a state reset button.
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginPanButtons
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.PanButtons',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__conf = config || {};

}, {
    /**
     * @static
     * @property __name
     */
    __name : 'PanButtons',

    createControlAdapter : function(el) {
        /*var elPanBtn = el.get()[0];
         var ctl = new ol.control.Control({
         element : elPanBtn
         });
         ctl.handleMapPostrender = function() {

         };
         return ctl;*/
    },

    createControlEl : function() {
        var me = this;
        var ppid = (new Date()).getTime() + "";
        var pb = jQuery('<div style="position:absolute" class="panbuttonDiv">' + '<div>' + '  <img class="panbuttonDivImg" usemap="#panbuttons_' + ppid + '">' + '    <map name="panbuttons_' + ppid + '">' +
        // center
        '      <area shape="circle" ' + 'class="panbuttons_center" ' + 'coords="45,45,20" href="#">' +
        // left
        '      <area shape="polygon" ' + 'class="panbuttons_left" ' + 'coords="13,20,25,30,20,45,27,65,13,70,5,45" ' + 'href="#">' +
        // up
        '      <area shape="polygon" ' + 'class="panbuttons_up" ' + 'coords="30,8,45,4,60,8,60,23,45,20,30,23" ' + 'href="#">' +
        //right
        '      <area shape="polygon" ' + 'class="panbuttons_right" ' + 'coords="79,20,67,30,72,45,65,65,79,70,87,45" ' + 'href="#">' +
        // down
        '      <area shape="polygon" ' + 'class="panbuttons_down" ' + 'coords="30,82,45,86,60,82,60,68,45,70,30,68" ' + 'href="#">' + '    </map>' + '  </img>' + '</div>' + '</div>');

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

        return pb;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
    "extend" : ["Oskari.mapping.mapmodule.plugin.MapPlugin"]
});
