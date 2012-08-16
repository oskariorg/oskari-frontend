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
    this.template = jQuery('<div class="divmanazerpopup"><h3></h3><p></p></div>');
    this.dialog = null;
}, {
    /**
     * @method show
     * Shows an info popup
     * @param {String} title
     * @param {String} message
     */
    show : function(title, message) {
        this.dialog = this.template.clone();
        this.dialog.find('h3').append(title);
        this.dialog.find('p').append(message);
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
     * @param {Number} timeout milliseconds
     */
    close : function() {
        var me = this;
        me.dialog.animate({ opacity: 0 }, 500);
        setTimeout(function() { 
            me.dialog.remove();
        }, 500);
    }
});
