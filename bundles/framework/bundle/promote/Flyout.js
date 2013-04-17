/**
 * @class Oskari.mapframework.bundle.promote.Flyout
 *
 * Renders the "promote" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.promote.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.promote.PromoteBundleInstance}
 *        instance reference to component that created the tile
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.template = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.promote.Flyout';
    },

    /**
     * @method setEl
     * @param {Object} el
     * 		reference to the container in browser
     * @param {Number} width
     * 		container size(?) - not used
     * @param {Number} height
     * 		container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if (!jQuery(this.container).hasClass('promote')) {
            jQuery(this.container).addClass('promote');
        }
    },

    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    startPlugin : function() {
        this.template = jQuery('<div class="promoteContainer">' +
        		'<div class="promoteDescription"></div>'+ 
                '<div><a class="promoteSignup"></a></div>' +
                '<div><a class="promoteRegister"></a></div>' +
            '</div>');
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
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi : function() {
        var me = this;
        var sandbox = me.instance.getSandbox();

        var flyout = jQuery(this.container);
        flyout.empty();

        var templateContainer = this.template.clone();
        
        var templateDescription = templateContainer.find('div.promoteDescription');
        templateDescription.html(this.instance.getLocalization('desc'));

        // only fill in the values when configuration is given
        if (me.instance.conf) {
            var templateSignup = templateContainer.find('a.promoteSignup');
            templateSignup.attr("href", this.instance.getLocalization('signupUrl'));
            templateSignup.append(this.instance.getLocalization('signup'));


            var templateRegister = templateContainer.find('a.promoteRegister');
            templateRegister.attr("href", this.instance.getLocalization('registerUrl'));
            templateRegister.append(this.instance.getLocalization('register'));
        }

        flyout.append(templateContainer);

    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
