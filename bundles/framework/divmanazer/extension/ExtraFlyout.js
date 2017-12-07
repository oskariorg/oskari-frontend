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
        this._visible = true;
        this._popup = null;

        /* @property container the DIV element */
        this.container = null;
        this.options = options ||  {};

        this.__render();
        Oskari.makeObservable(this);
        this._baseZIndex = 20000;
    }, {
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
	    		'</div>'),
            sideTool: _.template(
                '<div class="sidetool">'  +
                '<div class="icon icon-arrow-white-right"></div>' +
                '<label class="verticalsidelabel">${ label }</label>'  +
                '</div>')
	    },
	    isVisible : function() {
	    	return this._visible;
	    },
	    show: function() {
	    	var me = this;
            if(me.isVisible()) {
                return;
            }
	    	me._popup.show();
            me.bringToTop();
    		me._visible = true;
    		this.trigger('show');
	    },
	    hide: function(suppressEvent) {
	    	var me = this;
            if(!me.isVisible()) {
                return;
            }
	    	me._popup.hide();
    		me._visible = false;
    		suppressEvent = suppressEvent ? suppressEvent: false;
            if(!suppressEvent) {
                this.trigger('hide');
            }
        },
        __render: function() {
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
                me.bringToTop();
                me._popup.bind('click', function(){
                    me.bringToTop();
                });
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
            this._popup.css('z-index',  this._baseZIndex + Oskari.seq.nextVal());
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
                'left': left,
                'top': top
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
            var me = this;
            options = options || {};
            me._popup.css('position', 'absolute');
            me._popup.draggable({
                scroll: !!options.scroll,
                handle: options.handle || '.oskari-flyouttoolbar',
                start: function() {
                    // bring this flyout to top when user starts dragging it
                    me.bringToTop();
                }
            });
        },
        getElement: function(){
            return this._popup;
        },

/************************************************************************************************
* Side tool functions
************************************************************************************************/
        _updateSideLabelPositions: function(){
            var me = this;
            var sidelabels = me._popup.find('.sidetool');
            var flyout = me._popup;
            var heights = flyout.find('.oskari-flyouttoolbar').outerHeight();
            jQuery.each(sidelabels.get(), function(index, sidelabel) {
                if(index === 0) {
                    jQuery(this).css('top', heights);
                    heights += jQuery(this).height() + 10;
                }
                else {
                    jQuery(this).css('top', heights + 'px');
                    heights += jQuery(this).height() + 10;
                }
            });
        },
        /**
         * @method  @public addSideTool Add side tool for flyout
         * @param {String}   label    sidetool label
         * @param {Function} callback sidetool callback
         */
        addSideTool: function(label, callback){
            var me = this;
            var sidelabel = jQuery(this.__templates.sideTool({label : label}));

            var textWidth = function (el)
            {
                // Only create the dummy element once
                var calc = jQuery('<span>').css('font', el.css('font')).css({'font-size': el.css('font-size'), display: 'none', 'white-space': 'nowrap' }).appendTo('body');
                var width = calc.html(el.html()).width();
                // Empty out the content until next time - not needed, but cleaner
                calc.remove();
                return width;
            };

            var textSize = textWidth(sidelabel.find('label'));

            var flyout = me._popup;
            var parent = flyout.parent();

            sidelabel.css('margin-left', '-16px');
            flyout.append(sidelabel);

            sidelabel.css('height', (textSize + sidelabel.find('.icon').height() + 10) + 'px');

            if(typeof callback === 'function') {
                sidelabel.on('click', function() {
                    var position = me._popup.position();
                    var bounds = {
                        left : position.left + sidelabel.position().left - 16,
                        top : position.top + sidelabel.position().top
                    };
                    bounds.right = bounds.left + sidelabel.outerWidth();
                    bounds.bottom = bounds.top + sidelabel.height();
                    callback(sidelabel, bounds);
                });
            }

            me._updateSideLabelPositions();

            if(!me._addedResizeListener){
                me._popup.bind('DOMSubtreeModified', function(){
                    clearTimeout(me._sidetoolTimer);
                    me._sidetoolTimer = setTimeout(function(){
                        me._updateSideLabelPositions();
                    }, 10);
                });
                me._addedResizeListener = true;
            }
        },
        /**
         * @method  @public removeSideTools Remove sidetools
         */
        removeSideTools: function() {
            var me = this;
            var sidelabels = me._popup.find('.sidetool');
            sidelabels.each(function(index, sidelabel) {
                jQuery(sidelabel).remove();
            });
        }
});