/**
 * @class Oskari.framework.bundle.myviews.ModalDialog
 */
Oskari.clazz.define('Oskari.framework.bundle.myviews.ModalDialog',
                    function() {
}, {
    /**
     * @property __name
     */
    __name : 'Oskari.framework.bundle.myviews.ModalDialog',
    
    /**
     * @method getName
     * 
     * SimpleDiv
     */
    getName : function() {
        var me = this;
        return me.__name;
    },
    
    /**
     * @method startPlugin
     * 
     * SimpleDiv
     */
    startPlugin : function() { 
        var me = this;
    },
    
    /**
     * @method stopPlugin
     * 
     * SimpleDiv
     */
    stopPlugin : function() {
        var me = this;
        me.setParent(null);
        me.__elements['etrs89'] = null;
    },
    
    /**
     * @method draw
     */
    draw : function(element, config) {
        var ww = jQuery(window).width();
        var wh = jQuery(window).height();
        var w10th = Math.floor(ww / 10);
        var h10th = Math.floor(wh / 10);
        var w = w10th * 4;
        var h = h10th * 2; 
        var x = e.getMouseX() - (w10th * 2);
        var y = e.getMouseY() - h10th;

        var defaults = {
            appendTo: jQuery('#mapdiv'),
            focus: true,
            opacity: 50,
            overlayId: 'modaldialog-overlay',
            overlayCss: {},
            containerId: 'modaldialog-container',
            containerCss: {},
            dataId: 'modaldialog-data',
            dataCss: {},
            minWidth: w,
            minHeight: h,
            maxWidth: ww,
            maxHeight: wh,
            autoResize: false,
            autoPosition: true,
            zIndex: 64738,
            close: true,
            closeHTML: '<span>[X]</span>',
            closeClass: 'modaldialog-close',
            escClose: true,
            overlayClose: false,
            fixed: true,
            position: [ y, x ], // Also, top, left, right, bottom
            persist: false,
            modal: true,
            onOpen: null,
            onShow: null,
            onClose: null
        };                                        
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                if (!config.hasOwnProperty(key) || config[key] === null) {
                    config[key] = defaults[key];
                }
            }
        }
        if (config.left) {
            config.position = [ config.position[0], config.left ];
        }
        if (config.right) {
            config.position = [ config.position[0], ww - config.right ];
        }                
        if (config.top) {
            config.position = [ config.top, config.position[1] ];
        }
        if (config.bottom) {
            config.position = [ wh - config.bottom, config.position[1] ];
        }
    },
    /**
     * @method refresh
     */
    refresh : function(data) {
    }
}, {
    protocol : [ 'Oskari.userinterface.SimpleDiv' ]
});
