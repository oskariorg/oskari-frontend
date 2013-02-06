/**
 * @class Oskari.mapframework.bundle.publisher.view.StartView
 * 
 * Renders the "publisher" view for users that are logged in and can publish
 * maps. This is an initial screen where the user is told that the map will
 * move in to a publisher view. Also shows the user which layers the map will
 * have and if the user can't publish some layers.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.StartView',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
 * 		reference to component that created this view
 * @param {Object} localization
 *      localization data in JSON format
 */
function(instance, localization) {
    this.instance = instance;
    this.template = jQuery("<div class='startview'>" + "<div class='content'></div>" + 
                "<div class='tou'><a href='JavaScript:void(0;)'></a></div>" + 
                "<div class='buttons'></div>" + "</div>");
    this.templateLayerList = jQuery("<div class='layerlist'>" + "<h4></h4>" + "<ul></ul>" + "</div>");
    this.templateListItem = jQuery("<li></li>");
    this.templateError = jQuery('<div class="error"><ul></ul></div>');
    this.templateInfo = jQuery("<div class='icon-info'></div>");
    this.loc = localization;
    this.content = undefined;
    this.buttons = {};
    this.hasAcceptedTou = false;
}, {
    /**
     * @method render
     * Renders view to given DOM element
     * @param {jQuery} container reference to DOM element this
     * component will be rendered to
     */
    render : function(container) {
        var me = this;
        var content = this.template.clone();
        this.content = content;
        
        content.find('div.content').before(this.loc.text);
        container.append(content);
        
        var touContentLink = content.find('div.tou a');
        touContentLink.append(this.loc.touLink);
        touContentLink.bind('click', function() {
            me._showTermsOfUse();
            return false;
        });
        
        var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        continueButton.addClass('primary');
        continueButton.setHandler(function() {
            if(!me.hasAcceptedTou) {
                me._markTouAccepted();
            }
            var layers = me.instance.getLayersWithoutPublishRights();
            me.instance.setPublishMode(true, layers);
        });
        this.buttons['continue'] = continueButton;
        this._updateContinueButton();
        continueButton.insertTo(content.find('div.buttons'));

        var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelButton.setTitle(this.loc.buttons.cancel);
        cancelButton.setHandler(function() {
            me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
        });
        this.buttons['cancel'] = cancelButton;

        cancelButton.insertTo(content.find('div.buttons'));

        this._renderLayerLists();
        
        this._checkTouAccepted();
    },
    /**
     * @method _renderLayerLists
     * @private
     * Checks currently selected layers for publish permissions renders
     * a listing of layers the user can publish and which can't be
     * published.
     */
    _renderLayerLists : function() {
        // empty any current lists

        var container = this.content.find('div.content');
        container.find('div.error').remove();
        container.find('div.layerlist').remove();

        // resolve layers
        var layers = [];
        var deniedLayers = [];
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for (var i = 0; i < selectedLayers.length; ++i) {
            var layer = selectedLayers[i];
            if (!this.instance.hasPublishRight(layer)) {
                deniedLayers.push(layer);
            } else {
                layers.push(layer);
            }
        }
        // render list of layers with publication rights
        if (layers.length > 0) {
            var layersList = this._getRenderedLayerList(layers);
            var heading = layersList.find('h4');
            var txt = 'loc.layerlist_title';
            if (this.loc && this.loc.layerlist_title) {
                txt = this.loc.layerlist_title;
            }
            heading.append(txt);
            container.append(layersList);
            
            // enable/disable this.buttons['continue']
            this.buttons['continue'].setEnabled(true);

            // render list of layers that cannot be published
            if (deniedLayers.length > 0) {
                var deniedLayersList = this._getRenderedLayerList(deniedLayers);
                var heading = deniedLayersList.find('h4');
                heading.append(this.loc.layerlist_denied);
                // add tooltip
                var tooltip = this.templateInfo.clone();
                tooltip.attr('title', this.loc.denied_tooltip);
                heading.before(tooltip);
                container.append(deniedLayersList);
            }
        } else {
            // write a message that
            var errorsList = this.templateError.clone();
            var error = this.templateListItem.clone();
            error.append(this.loc.layerlist_empty);
            errorsList.find('ul').append(error);
            container.append(errorsList);

            // disable this.buttons['continue']
            this.buttons['continue'].setEnabled(false);
        }

    },
    /**
     * @method _getRenderedLayerList
     * Renders an UI listing for given set of layers.
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     * list
     *      list of layers to render
     * @return {jQuery} DOM element with layer listing
     */
    _getRenderedLayerList : function(list) {
        var layerList = this.templateLayerList.clone();
        var listElement = layerList.find('ul');
        for (var i = 0; i < list.length; ++i) {
            var layer = list[i];
            var item = this.templateListItem.clone();
            item.append(layer.getName());
            listElement.append(item);
        }
        return layerList;
    },
    /**
     * @method handleLayerSelectionChanged
     * Clears previous layer listing and renders a new one to the view.
     */
    handleLayerSelectionChanged : function() {
        this._renderLayerLists();
    },
    /**
     * @method _showTermsOfUse
     * Show Terms of Use to the user
     * @private
     */
    _showTermsOfUse : function() {
        var me = this;
        if(!this.termsOfUse) {
            // load the article first
            var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', me.instance.sandbox);
            helper.getHelpArticle('termsofuse, mappublication, ' + Oskari.getLang(), function(success, response) {
                if(success) {
                    me.termsOfUse = response;
                    // terms loaded, try again
                    me._showTermsOfUse();
                }
            });
            return;
        }
        
        var dlg = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var closeBtn = dlg.createCloseButton(this.loc.buttons.close);
        dlg.show(me.termsOfUse.title, me.termsOfUse.body, [closeBtn]);
    },
    /**
     * @method _checkTouAccepted
     * Checks if the user has accepted terms of use and sets hasAcceptedTou property
     * @private
     */
    _checkTouAccepted : function() {
        var me = this;
        jQuery.ajax({
            url : me.instance.sandbox.getAjaxUrl(),
            type : 'GET',
            data : {
                action_route : 'HasAcceptedPublishedTermsOfUse'
            },
            dataType : 'json',
            error : function() {
                this.success(false);
            },
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
                me.hasAcceptedTou = resp;
                me._updateContinueButton();
            }
        });
    },
    /**
     * @method _updateContinueButton
     * Updates the text on continue button depending if user has
     * accepted the Terms of Use or not
     * @private
     */
    _updateContinueButton : function() {
        
        if(this.hasAcceptedTou) {
            this.buttons['continue'].setTitle(this.loc.buttons['continue']);
        }
        else {
            this.buttons['continue'].setTitle(this.loc.buttons['continueAndAccept']);
        }
    },
    /**
     * @method markTouAccepted
     * Requests that the backend mark the current logged in user as having
     * accepted the Terms of Use
     * @private
     */
    _markTouAccepted : function() {
        var me = this;
        jQuery.ajax({
            url : me.instance.sandbox.getAjaxUrl(),
            type : 'GET',
            data : {
                action_route : 'AcceptPublishedTermsOfUse'
            },
            dataType : 'json',
            error : function() {
                this.success(false);
            },
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(resp) {
                me.hasAcceptedTou = resp;
                me._updateContinueButton();
            }
        });
    }
}); 