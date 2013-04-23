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
    this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
}, {
    _isTooManyLayers : function() {
        var layerCount = this.instance.getSandbox().findAllSelectedMapLayers().length;
        var isMaxLayersExceeded = layerCount > 7;
        return isMaxLayersExceeded;
    },
    _isManyLayers : function() {
        var layerCount = this.instance.getSandbox().findAllSelectedMapLayers().length;
        var isManyLayersExceeded = layerCount > 2;
        return isManyLayersExceeded;
    },
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
        /*content.find('div.content').before(txt);*/
        container.append(content);

        this.alert.insertTo(container);

        var isMaxLayersExceeded = this._isTooManyLayers();
        var isManyLayersExceeded = this._isManyLayers();

        if(isMaxLayersExceeded) {
            this.alert.setContent(this.loc.info.maxLayers, 'error');
        } else if(isManyLayersExceeded) {
            this.alert.setContent(this.loc.info.printoutProcessingTime, 'info');
        } else {
            this.alert.setContent(this.loc.text, 'default');
        }

        if(!isMaxLayersExceeded) {
            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setTitle(this.loc.buttons['continue']);
            continueButton.setHandler(function() {
                me.instance.setPublishMode(true);
            });
            this.buttons['continue'] = continueButton;
            continueButton.insertTo(content.find('div.buttons'));
        }

        var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        if(isMaxLayersExceeded) {
            cancelButton.addClass('primary');
        }
        cancelButton.setTitle(this.loc.buttons.cancel);
        cancelButton.setHandler(function() {
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
        });
        this.buttons['cancel'] = cancelButton;

        cancelButton.insertTo(content.find('div.buttons'));

    }
});
