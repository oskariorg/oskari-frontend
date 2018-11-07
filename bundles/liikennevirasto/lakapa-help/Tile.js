/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help.Tile
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance,locale) {

    this.instance = instance;
    this.locale = locale;
    this.container = null;
    this.template = null;
}, {
    getName : function() {
        return 'Oskari.liikennevirasto.bundle.lakapa.help.Tile';
    },
    setEl : function(el, width, height) {
        this.container = $(el);
    },
    startPlugin : function() {
        this.refresh();
    },
    stopPlugin : function() {
        this.container.empty();
    },
    getTitle : function() {
        return this.locale['title'];
    },
    getDescription : function() {
    },
    getOptions : function() {

    },
    setState : function(state) {
        this.state = state;
    },
    refresh : function() {
        var me = this;
        var instance = me.instance;
        var cel = this.container;
        var tpl = this.template;
        var sandbox = instance.getSandbox();

    }
}, {
    'protocol' : ['Oskari.userinterface.Tile']
});
