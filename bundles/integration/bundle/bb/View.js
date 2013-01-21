/**
 * @class Oskari.integration.bundle.bb.View
 * 
 */
Oskari.clazz.define('Oskari.integration.bundle.bb.View', function(locale,instance,conf) {
    this.locale = locale;
    this.view = null;
    this.instance = instance;
    this.conf = conf;
}, {
    /**
     * @method setEl
     * sets the (jQuery) element for this view
     */
    "setEl" : function(el) {
        this.container = el;
    },
    
    /**
     * @method getEl
     * gets the (jQuery) element for this view
     */
    "getEl" : function() {
        return this.container;
    },
    
    /**
     * @propertyc
     * requirements to be processed with require() 
     */
    "requirements" : [],
    
    /**
     * @method render
     * 
     * method that will receive in arguments any requiremends defined
     * in requirements property
     * 
     */
    "render" : function() {
        throw "Abstract";
    },
    
    /**
     * @method getLocalization
     *
     * returns localised Json object defined with 'view' key in locale/*.js
     */
    "getLocalization" : function() {
        return this.locale;
    },
    
    /**
     * @method getConfiguration
     * 
     * gets configuration for this bundle
     */
    "getConfiguration" : function() {
        return this.conf;  
    },
    
    /**
     * @method getSandbox
     * 
     * returns sandbox for binding to Oskari app functionality
     *  
     */
    "getSandbox" : function() {
        return this.instance.getSandbox();  
    },
    
    /**
     * @method getLang
     * helper to get current language from Oskari
     * 
     */
    "getLang" : function()  {
        return Oskari.getLang();
    },    
    /**
     * @method onEvent
     * 
     * Dispatches events to eventhandlers declared
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler)
            return;

        return handler.apply(this, [event]);

    },
    
    slicer : Array.prototype.slice,
    
    /**
     * @method request 
     *
     * helper function to wrap passing requests 
     */
    request: function() {
        return this.sandbox.requestByName(this.instance,arguments[0],this.slicer.apply(arguments,1));
    },
    
    /**
     * @method getName
     * returns identifier used to connect to sandbox (borrowed from instance)
     */
    getName : function() {
        return this.instance.getName();
    }

});
