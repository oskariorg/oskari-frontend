/**
 * @class Oskari.userinterface.extension.EnhancedFlyout
 *
 * Default Flyout implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.EnhancedFlyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale) {

    /* @property extension instance */
    this.instance = instance;

    /* @property locale locale for this */
    this.locale = locale;

    /* @property container the DIV element */
    this.container = null;

}, {
    /**
     * @method getName
     * @return {String} implementation name
     */
    getName : function() {
        return 'Oskari.userinterface.extension.DefaultFlyout';
    },

    /**
     * @method setEl
     * called by host to set DOM element for this Flyouts content
     */
    setEl : function(el) {
        this.container = jQuery(el);
    },

    /**
     * @method  getEl
     * @return {jQuery Object} wrapped DOM element for this Flyout's contents
     */
    getEl : function() {
        return this.container;
    },

    /**
     * @method startPlugin
     * called by host to start flyout operations
     */
    startPlugin : function() {
    },

    /**
     * @method stopPlugin
     * called by host to stop flyout operations
     */
    stopPlugin : function() {
    },

    /**
     * @method getTile
     * @return {String} called by host to get a localised flyout title
     */
    getTitle : function() {
        return this.locale.title;
    },
    /**
     * @method getDescriptions
     * @return {String} called by host to get a localised flyout description
     */
    getDescription : function() {
        return this.locale.description;
    },

    /**
     * @method setState
     * @param {JSON} sets state
     */
    setState : function(state) {
        this.state = state;
    },

    /**
     * @method getState
     * @return {JSON} returns state
     */
    getState : function() {
        return this.state;
    },

    /**
     * @method getLocalization
     * @return JSON localisation subset 'flyout'
     */
    getLocalization : function() {
        return this.locale ? this.locale : (this.instance ? this.instance.getLocalization()['flyout'] : undefined );
    },

    getSandbox : function() {
        return this.instance.getSandbox();
    },

    getExtension : function() {
        return this.instance;
    },

    /* o2 helpers for notifications and requetss */
    slicer : Array.prototype.slice,

	issue : function() {
    	var requestName = arguments[0];
    	var args = this.slicer.apply(arguments,[1]);
    	var builder = this.getSandbox().getRequestBuilder(requestName);
    	var request = builder.apply(builder,args);
        return this.getSandbox().request(this.getExtension(), request);
    },

    notify : function() {
        var eventName = arguments[0];
    	var args = this.slicer.apply(arguments,[1]);
    	var builder = this.getSandbox().getEventBuilder(eventName);
    	var evt = builder.apply(builder,args);
        return this.getSandbox().notifyAll(evt);
    }
    
    
   
}, {
    'protocol' : ['Oskari.userinterface.Flyout']
});
