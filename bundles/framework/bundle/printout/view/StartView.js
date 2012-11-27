/**
 * @class Oskari.mapframework.bundle.printout.view.StartView
 * Renders the "printout" view for users that are logged in and can publish
 * maps. This is an initial screen where the user is told that the map will move in to
 * a printout view. Also shows the user which layers the map will have and if the user can't
 * publish some layers.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.StartView',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
 * 		reference to component that created this view
 * @param {Object} localization
 *      localization data in JSON format
 */
function(instance, localization) {
    this.instance = instance;
    this.template = jQuery("<div class='startview'><div class='content'></div><div class='buttons'></div></div>");
    this.templateError = jQuery('<div class="error"><ul></ul></div>');
    this.templateInfo = jQuery("<div class='icon-info'></div>");
    this.loc = localization;
    this.content = undefined;
    this.buttons = {};
}, {
    /**
     * @method render
     * Renders view to given DOM element
     * @param {jQuery} container reference to DOM element this component will be
     * rendered to
     */
    render : function(container) {
        var me = this;
        var content = this.template.clone();
        this.content = content;
     
        var txt = this.loc.text;

        content.find('div.content').before(txt);
        container.append(content);

        var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        continueButton.addClass('primary');
        var txt = 'loc.buttons.continue';
        if (this.loc && this.loc.buttons && this.loc.buttons['continue']) {
            txt = this.loc.buttons['continue'];
        }
        continueButton.setTitle(txt);
        continueButton.setHandler(function() {
            me.instance.setPublishMode(true);
        });
        this.buttons['continue'] = continueButton;

        var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        txt = 'loc.buttons.cancel';
        if (this.loc && this.loc.buttons && this.loc.buttons.cancel) {
            txt = this.loc.buttons.cancel;
        }
        cancelButton.setTitle(txt);
        cancelButton.setHandler(function() {
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
        });
        this.buttons['cancel'] = cancelButton;

        cancelButton.insertTo(content.find('div.buttons'));
        continueButton.insertTo(content.find('div.buttons'));
        
    }
  
   
});