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
    function (instance, locale, options) {

        /* @property extension instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* @property container the DIV element */
        this.container = null;
        this.options = options ||  {};
        if(!this.options.width) {
        	this.options.width = '200px';
        }
        if(!this.options.height) {
        	this.options.height = '300px';
        }
        this.__render();
    },
    {
	    __visible: false,
		__popup: null,
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
	    show: function(){
	    	var me = this;
	    	me.__popup.show();
    		me.__visible = true;

    		if(typeof me.options.showCallback === 'function') {
	    		me.options.showCallback(me.__popup);
	    	}
	    },
	    hide: function(suppressEvent){
	    	var me = this;
	    	me.__popup.hide();
    		me.__visible = false;
    		suppressEvent = suppressEvent || false;

    		if(typeof me.options.closeCallback === 'function' && !suppressEvent) {
    			me.options.closeCallback(me.__popup);
    		}
	    },
	    __render: function(){
	    	var me = this;
	        var popup = me.__popup || me.__templates.popup.clone();

	        if(!me.__popup) {
	        	jQuery('body').append(popup);
	        	popup.find('.icon-close').bind('click', function(){
	        		me.hide();
	        	});
	        	me.__popup = popup;
	        	me.hide(true);
	    	}

	    	if(me.options.visible === true) {
	    		me.show();
	    	}

	    	if(me.locale.title) {
	    		me.__setTitle(me.locale.title);
	    	}

	    	if(me.options.cls) {
	    		me.addClass(me.options.cls);
	    	}

	    	if(me.options.width) {
	    		me.__popup.css('width', me.options.width);
	    	}
	    	if(me.options.height) {
	    		me.__popup.css('height', me.options.height);
	    	}
	    	if(typeof me.options.addEventHandlersFunc === 'function') {
	    		me.options.addEventHandlersFunc();
	    	}
	    },
	    __setTitle: function(title) {
	    	var me = this;
	    	me.__popup.find('.oskari-flyout-title p').html(title);
	    },
	    addClass: function(cls) {
	    	var me = this;
	    	if(me.__popup) {
	    		me.__popup.addClass(cls);
	    	}
	    }
});