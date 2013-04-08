/**
 * @class Oskari.userinterface.extension.DefaultView
 *
 * Default View implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.DefaultView',

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
        return 'Oskari.userinterface.extension.DefaultView';
    },
    
    /**
     * @method setEl
     * called by host to set DOM element for this Views content
     */
    setEl : function(el) {
        this.container = jQuery(el);
    },
    
    /**
     * @method  getEl
     * @return {jQuery Object} wrapped DOM element for this View's contents 
     */
    getEl : function() {
        return this.container;
    },
    
    /**
     * @method startPlugin
     * called by host to start view operations 
     */
    startPlugin : function() {
    },
    
    /**
     * @method stopPlugin
     * called by host to stop view operations
     */
    stopPlugin : function() {
    },
    
    /**
     * @method getTile
     * @return {String} called by host to get a localised view title
     */
    getTitle : function() {
        return this.locale.title;
    },
    /**
     * @method getDescriptions
     * @return {String} called by host to get a localised view description
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
     * @return JSON localisation subset 'view'
     */
    getLocalization: function() {
        return this.locale;
    } 
   
}, {
    'protocol' : ['Oskari.userinterface.View']
});
