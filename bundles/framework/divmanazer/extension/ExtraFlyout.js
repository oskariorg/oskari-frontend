/**
 * @class Oskari.userinterface.extension.ExtraFlyout
 *
 * Extra Flyout implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.ExtraFlyout',
	/**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (title, options) {
    	// UI text for title
		this.title = title;
	    this._visible = false;
		this._popup = null;

        /* @property container the DIV element */
        this.container = null;
        this.options = options ||  {};

        this.__render();
        Oskari.makeObservable(this);
    },
    {
	    __templates : {
	    	popup: jQuery('<div class="oskari-flyout">' +
	    		'<div class="oskari-flyouttoolbar">' +
	    		'	<div class="oskari-flyoutheading"></div>' +
	    		'	<div class="oskari-flyout-title"><p></p></div>' +
	    		'	<div class="oskari-flyouttools">' +
	    		'		<div class="oskari-flyouttool-close icon-close icon-close:hover"></div>' +
	    		'	</div>' +
	    		'</div>' +
	    		'<div class="oskari-flyoutcontentcontainer"></div>' +
	    		'</div>')
	    },
	    isVisible : function() {
	    	return this._visible;
	    },
	    show: function(){
	    	var me = this;
	    	me._popup.show();
    		me._visible = true;
    		this.trigger('show');
	    },
	    hide: function(suppressEvent){
	    	var me = this;
	    	me._popup.hide();
    		me._visible = false;
    		suppressEvent = suppressEvent ? suppressEvent: false;

    		if(!suppressEvent) {
    			this.trigger('hide');
    		}
	    },
	    __render: function(){
	    	var me = this;
	        var popup = me._popup || me.__templates.popup.clone();

	        if(!me._popup) {
                if(!me.options.container) {
	        	  jQuery('body').append(popup);
                } else {
                    me.options.container.append(popup);
                }
	        	popup.find('.icon-close').bind('click', function(){
	        		me.hide();
	        	});
	        	me._popup = popup;
	        	me.hide(true);
	    	}

	    	if(me.options.visible === true) {
	    		me.show();
	    	}

	    	me.setTitle(me.title);
	    	me.addClass(me.options.cls);
			me.setSize(me.options.width, me.options.height);
	    },
	    setTitle: function(title) {
	    	var me = this;
	    	if(!this._popup) {
	    		return;
	    	}
	    	me._popup.find('.oskari-flyout-title p').html(title || '');
	    },
	    getTitle: function() {
	    	var me = this;
	    	return me._popup.find('.oskari-flyout-title p');
	    },
	    /**
	     * @method  @public setContent Set content
	     * @param {Object} content jQuery object
	     */
	    setContent: function(content) {
	    	var me = this;
	    	me._popup.find('.oskari-flyoutcontentcontainer').html(content);
	    },
	    addClass: function(cls) {
	    	if(!this._popup) {
	    		return;
	    	}
	    	this._popup.addClass(cls);
	    },
	    setSize : function(width, height) {
	    	if(!this._popup) {
	    		return;
	    	}
	    	if(width) {
	    		this._popup.css('width', width);
	    	}
	    	if(height) {
	    		this._popup.css('height', height);
	    	}

	    },
	    bringToTop : function() {
	    	if(!this._popup) {
	    		return;
	    	}
            this._popup.css('z-index', 20000);
	    },
	    move : function(left, top, keepOnScreen) {
	    	if(!this._popup) {
	    		return;
	    	}
	    	if(keepOnScreen) {
	    		var size = this.getSize();
	            if(left + size.width > jQuery(window).width()) {
	                left = jQuery(window).width() - size.width;
	            }
	            if(left < 0) {
	                left = 0;
	            }
	            if(top + size.height > jQuery(window).height()) {
	                top = jQuery(window).height() - size.height;
	            }
	            if(top < 0) {
	                top = 0;
	            }
	    	}
            this._popup.css({
                left: left,
                top: top
            });
	    },
	    getPosition : function() {
	    	if(!this._popup) {
	    		return;
	    	}
	    	return this._popup.position();
	    },
	    getSize : function() {
	    	if(!this._popup) {
	    		return;
	    	}
	    	return {
	    		width : this._popup.outerWidth(),
	    		height : this._popup.height()
	    	};
        },
        /**
         * @method makeDraggable
         * Makes dialog draggable with jQuery Event Drag plugin
         * @param options  optional options for draggable
         */
        makeDraggable: function (options) {
            var me = this,
                dragOptions = options ? options : {
                scroll: false,
                handle: '.oskari-flyouttoolbar'
            };
            me._popup.css('position', 'absolute');
            me._popup.draggable(dragOptions);
        }
});