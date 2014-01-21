/**
 * @class Oskari.integration.bundle.bb.Flyout
 *
 *
 *
 * PoC Flyout to show map share timeline kind of information
 *
 */
Oskari.clazz.define('Oskari.integration.bundle.bb.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale, ui) {

    this.instance = instance;

    /* @property locale locale for this */
    this.locale = locale;

    /* @property container the DIV element */
    this.container = null;
    this.ui = ui;
    this.state = null;
    this.hasUI = false;

}, {
    getName : function() {
        return 'Oskari.integration.bundle.bb.Flyout';
    },
    setEl : function(el, width, height) {
        this.container = jQuery(el);
    },
    getEl : function() {
        return this.container;
    },
    startPlugin : function() {
        var me = this;
        var locale = me.locale;
        var ui = me.ui;
        ui.setEl(me.container);
        me.container.append(this.locale.fetchingLayers);
    },
    stopPlugin : function() {
        this.container.empty();
        this.hasUI = false;
    },
    getTitle : function() {
        return this.locale.title;
    },
    getDescription : function() {
        return this.locale.description;
    },
    setState : function(state) {
        this.state = state;
    },
    getState : function() {
        return this.state;
    },

    lazyRender : function() {
        if(!this.hasUI){
            this.ui.render();
            this.hasUI = true;
        }
    },
    render : function() {
        this.ui.render();
    }
}, {
    'protocol' : ['Oskari.userinterface.Flyout']
});
