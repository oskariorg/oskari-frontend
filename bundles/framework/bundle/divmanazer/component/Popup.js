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
    this.dialog = null;
    this.overlay = null;
}, {
    /**
     * @method show
     * Shows an info popup
     * @param {String} title
     * @param {String} message
     * @param {Object} actions buttons with syntax {ButtonName: ButtonCallback}
     */
    show : function(title, message, actions) {
    	var me = this;
        this.dialog = this.template.clone();
        this.dialog.find('h3').append(title);
        this.dialog.find('div.content').append(message);
        if(actions) {
        	var actionDiv = this.dialog.find('div.actions');
		  	for(var key in actions){
	            var value = actions[key];
	            var actionLink = this.templateButton.clone();
	            var link = actionLink.find('a');
	            link.append(key);
	            link.bind('click', value);
	            actionDiv.append(actionLink);
        	}
        }
        else {
        	// if no actions, the user can click on popup to close it
        	this.dialog.bind('click', function() {
        		me.close(true);
        	});
        }
        jQuery('body').append(this.dialog);
        // setup location
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
    alignment : ['left', 'right', 'top', 'bottom'],
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
    makeModal : function() {
    	var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
    	overlay.overlay('body');
    	this.overlay = overlay;
    	overlay.followResizing(true);
    }
});
