/**
 * @class Oskari.framework.bundle.admin-layerrights.Flyout
 *
 * Renders the layer rights management flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
 *        instance reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this.template = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.framework.bundle.admin-layerrights.Flyout';
    },

    /**
     * @method setEl
     * @param {Object} el
     *      reference to the container in browser
     * @param {Number} width
     *      container size(?) - not used
     * @param {Number} height
     *      container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if (!jQuery(this.container).hasClass('admin-layerrights')) {
            jQuery(this.container).addClass('admin-layerrights');
        }
    },

    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery(
            '<div class="admin-layerrights">\n' +
            '   <form method="post" id="admin-layerrights-form">' +
            '       <label><span></span>' +
            '          <select class="admin-layerrights-role"></select>\n' +
            '       </label>' + /*
            '       <label for="admin-layerrights-theme">Theme</label>' +
            '       <select id="admin-layerrights-theme"></select>\n' +
            '       <label for="admin-layerrights-dataprovidere">Data provider</label>' +
            '       <select id="admin-layerrights-dataprovider"></select>\n' +*/
            '       <table class="admin-layerrights-layers">' +
            '       </table>' +
            '       <button class="admin-layerrights-submit" type="submit"></button>' +
            '   </form>' +
            '</div>\n');
    },

    /**
     * @method stopPlugin
     *
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {
    },

    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('title');
    },

    /**
     * @method getDescription
     * @return {String} localized text for the description of the
     * flyout
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
    },

    /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
    getOptions : function() {

    },

    /**
     * @method setState
     * @param {Object} state
     */
    setState : function(state) {
        this.state = state;
    },

    /**
     * @method getState
     * @return {Object} state
     */
    getState : function() {
        if(!this.state) {
            return {};
        }
        return this.state;
    },

    /**
     * @method setContent
     * Creates the UI for a fresh start
     */
    setContent : function(content) {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var flyout = jQuery(this.container);
        flyout.empty();
        var container = this.template.clone();
        var saveButton = container.find('button.admin-layerrights-submit');
        saveButton.html(this.instance.getLocalization('save'));
        var roleSelectLabel = container.find('label > span');
        roleSelectLabel.html(this.instance.getLocalization('selectRole'));
        container.append(content);
        flyout.append(container);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
