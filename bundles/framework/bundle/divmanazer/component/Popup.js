/**
 * @class Oskari.userinterface.component.Popup
 * Provides a popup window to replace alert
 */
Oskari.clazz.define('Oskari.userinterface.component.Popup',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.template = jQuery('<div class="divmanazerpopup"><h3></h3><div class="content"></div><div class="actions"></div></div>');
    this.templateButton = jQuery('<div class="button"><a href="JavaScript:void(0);"></a></div>');
    this.dialog = this.template.clone();
    this.overlay = null;
}, {
    /**
     * @method show
     * Shows an info popup
     * @param {String} title
     * @param {String} message
     * @param {Oskari.userinterface.component.Button[]} buttons buttons to show on dialog
     */
    show : function(title, message, buttons) {
    	var me = this;
        this.dialog.find('h3').html(title);
        this.dialog.find('div.content').html(message);
        if(buttons && buttons.length > 0) {
        	var actionDiv = this.dialog.find('div.actions');
        	// TODO: save button references and clean up previous buttons
        	actionDiv.empty();
        	for(var i = 0 ; i < buttons.length; ++i) {
        		buttons[i].insertTo(actionDiv);
        	}
        }
        else {
        	// if no actions, the user can click on popup to close it
        	this.dialog.bind('click', function() {
        		me.close(true);
        	});
        }
        jQuery('body').append(this.dialog);
        // center on screen
        this.dialog.css('margin-left', -(this.dialog.width()/2) + 'px');
        this.dialog.css('margin-top', -(this.dialog.height()/2) + 'px');
    },
    /**
     * @method fadeout
     * Removes the popup after given time has passed
     * @param {Number} timeout milliseconds
     */
    fadeout : function(timeout) {
        var me = this;
        var timer = 3000;
        if(timeout) {
            timer = timeout;
        }
        setTimeout(function() { 
            me.close();
        }, timer);
    },
    /**
     * @method addClass
     * Adds a class for formatting the popup
     * @param {String} pClass css class name
     */
    addClass : function(pClass) {
    	this.dialog.addClass(pClass);
    },
    /**
     * @method createCloseButton
     * Convenience method that creates a close button with 
     * given label that can be given to show() method
     * @param {String} label button label
     * @return {Oskari.userinterface.component.Button} button that closes the dialog
     */
    createCloseButton : function(label) {
    	var me = this;
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(label);
    	okBtn.setHandler(function() {
            me.close(true);
    	});
    	return okBtn;
    },
    /**
     * @method close
     * Removes the popup after given time has passed
     * @param {Boolean} noAnimation true to close immediately (optional, defaults to fade out animation)
     */
    close : function(noAnimation) {
        var me = this;
        if(this.overlay) {
        	this.overlay.close();
        }
        if(noAnimation) { 
            me.dialog.remove();
        }
        else {
	        me.dialog.animate({ opacity: 0 }, 500);
	        setTimeout(function() { 
	            me.dialog.remove();
	        }, 500);
        }
    },
    /**
     * @property alignment
     * Options for #moveTo() alignment parameter
     * @static
     */
    alignment : ['left', 'right', 'top', 'bottom'],
    /**
     * @method moveTo
     * Removes the popup after given time has passed
     * @param {jQuery} target - target element which the popup should point
     * @param {String} alignment - one of #alignment (optional, defaults to right)
     */
    moveTo :function(target, alignment) {
        var align = 'right';
        if(alignment && jQuery.inArray(alignment, this.alignment) != -1) {
        	align = alignment;
        }
        //get the position of the target element
        var tar = jQuery(target);
        var pos = tar.offset();
        var targetWidth = tar.outerWidth();
        var targetHeight = tar.outerHeight();
        var dialogWidth = this.dialog.outerWidth();
        var dialogHeight = this.dialog.outerHeight();
        var left = pos.left;
        var top = pos.top;
        if(align == 'right') {
        	left = (left + targetWidth) + 5;
        	top = top + (targetHeight/2) - (dialogHeight/2);
        } 
        else if(align == 'left') {
        	left = (left - dialogWidth) - 5;
        	top = top + (targetHeight/2) - (dialogHeight/2);
        }  
        else if(align == 'top') {
        	top = (top - dialogHeight) - 5;
    	 	left = left + (targetWidth/2) - (dialogWidth/2);
        }  
        else if(align == 'bottom') {
        	top = (top + targetHeight) + 5 ;
    	 	left = left + (targetWidth/2) - (dialogWidth/2);
        }  
        if(left < 0) {
        	left = 0;
        }
        if(top < 0) {
        	top = 0;
        }
        // TODO: check for right and bottom as well
        this.dialog.addClass('arrow');
        this.dialog.addClass(alignment);
        //move dialog to correct location
        this.dialog.css( {
                'left': left + "px",
                'top': top + "px",
                'margin-left' : 0,
                'margin-top' : 0
        } );
    },
    /**
     * @method resetPosition
     * Resets any previous locations and centers the popup on screen
     */
    resetPosition : function() {
        this.dialog.removeClass('arrow');
        for(var i = 0; i < this.alignment.length; ++i) {
            this.dialog.removeClass(this.alignment[i]);
        }
        this.dialog.removeAttr('style');
    },
    /**
     * @method makeModal
     * Creates an Oskari.userinterface.component.Overlay under 
     * the popup to block user input outside the popup
     */
    makeModal : function() {
    	var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
    	overlay.overlay('body');
    	this.overlay = overlay;
    	overlay.followResizing(true);
    },
    
     /** 
     * @method setContent
     * Sets dialog content element
     * @param {HTML/DOM/jQueryObject}
     */
    setContent: function(content) {
    	var contentEl = this.dialog.find('div.content');
    	contentEl.empty();
    	contentEl.append(content);
    },
    	
    /**
     * @method makeDraggable
     * Makes dialog draggable with jQuery Event Drag plugin
     */
    makeDraggable : function() {
        var me = this;
        /*me.dialog.addClass('draggable');
        me.dialog.bind('drag', function(event) {
    	   me.dialog.css({
    	       top: event.offsetY,
    	       left: event.offsetX
    	   })
    	 });*/
    	me.dialog.css("position","absolute");
		me.dialog.draggable({
				scroll: false
			});
    }
});
