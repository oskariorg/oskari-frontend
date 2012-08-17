/**
 * @class Oskari.userinterface.component.Popup
 * Provides a popup window to replace alert
 */
Oskari.clazz.define('Oskari.userinterface.component.Overlay',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.template = jQuery('<div class="oskarioverlay transparent"></div>');
    this._overlay = null;
    this._targetSelector = null;
    this._resizingWorkaround = null;
}, {
    /**
     * @method overlay
     * Overlays an element
     * @param {String} elementSelector, selector for element to overlay
     */
    overlay : function(elementSelector) {
    	var me = this;
        this._overlay = this.template.clone();
        this._targetSelector = elementSelector;
        if(!this._targetSelector) {
        	this._targetSelector = 'body';
        }
        var target = jQuery(this._targetSelector); 
        target.append(this._overlay);
        this._setupSizeAndLocation();
		this._overlay.bind('click', function(event) {
  			event.preventDefault();
		});
    },
    _setupSizeAndLocation : function() {
    	var me = this;
        var target = jQuery(this._targetSelector); 
        this._overlay.css( {
                'left': "0px",
                'top': "0px",
                'width' : target.width() + 'px',
                'height' : target.height() + 'px' 
        } );
    },
    resize : function() {
    	var tmp = jQuery(this._targetSelector);
    	this._overlay.height(tmp.height());
    	this._overlay.width(tmp.width());
    },
    followResizing : function(useWindow) {
    	var me = this;
    	var resizeFunc = function(){
			me.resize();
    	};
    	if(useWindow) {
    		jQuery(window).resize(function(){
				me.resize();
    		});
    	}
    	else {
    		this._resizingWorkaround = setTimeout(function(){
				me.resize();
				me.followResizing();
    		}, 500);
    	}
    },
    close : function() {
    	this._overlay.remove();
        var target = jQuery(this._targetSelector); 
        if(this._resizingWorkaround) {
        	clearTimeout(this._resizingWorkaround);
        }
    	//target.unbind('resize', this['resize']);
    },
    bindClickToClose : function() {
    	var me = this;
		this._overlay.bind('click', function() {
			me.close();
		});
    }
});
