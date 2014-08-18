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
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     */

    function (instance, localization) {
        var me = this;
        me.instance = instance;
        me.template = jQuery('<div class="startview">' + '<div class="content"></div>' +
            '<div class="tou"><a href="JavaScript:void(0;)""></a></div>' +
            '<div class="buttons"></div>' + '</div>');
        me.templateLayerList = jQuery('<div class="layerlist">' + '<h4></h4>' + '<ul></ul>' + '</div>');
        me.templateListItem = jQuery('<li></li>');
        me.templateError = jQuery('<div class="error"><ul></ul></div>');
        me.templateInfo = jQuery('<div class="icon-info"></div>');
        me.loc = localization;
        me.content = undefined;
        me.buttons = {};
        me.hasAcceptedTou = false;
    }, {
        /**
         * Renders view to given DOM element
         *
         * @method render
         * @param {jQuery} container reference to DOM element this
         * component will be rendered to
         */
        render: function (container) {
            var me = this,
                content = me.template.clone();
            me.content = content;

            content.find('div.content').before(me.loc.text);
            container.append(content);

            var touContentLink = content.find('div.tou a');
            touContentLink.append(me.loc.touLink);
            touContentLink.bind('click', function () {
                me._showTermsOfUse();
                return false;
            });

            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setHandler(function () {
                if (!me.hasAcceptedTou) {
                    me._markTouAccepted();
                }
                var layers = me.instance.getLayersWithoutPublishRights();
                me.instance.setPublishMode(true, layers);
            });
            me.buttons['continue'] = continueButton;
            me._updateContinueButton();
            continueButton.insertTo(content.find('div.buttons'));

            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
            });
            me.buttons.cancel = cancelButton;

            cancelButton.insertTo(content.find('div.buttons'));

            me._renderLayerLists();

            me._checkTouAccepted();
        },
        /**
         * Checks currently selected layers for publish permissions renders
         * a listing of layers the user can publish and which can't be
         * published.
         *
         * @method _renderLayerLists
         * @private
         */
        _renderLayerLists: function () {
            // empty any current lists
            var me = this,
                container = me.content.find('div.content'),
                layers = [], // resolve layers
                deniedLayers = [],
                selectedLayers = me.instance.sandbox.findAllSelectedMapLayers(),
                i,
                layer,
                layersList,
                heading,
                txt;
            container.find('div.error').remove();
            container.find('div.layerlist').remove();
            for (i = 0; i < selectedLayers.length; ++i) {
                layer = selectedLayers[i];
                if (!me.instance.hasPublishRight(layer) &&
                        layer.getId().toString().indexOf('myplaces_') < 0) {
                    deniedLayers.push(layer);
                } else {
                    layers.push(layer);
                }
            }
            // render list of layers with publication rights
            if (layers.length > 0) {
                layersList = me._getRenderedLayerList(layers);
                heading = layersList.find('h4');
                txt = 'loc.layerlist_title';
                if (me.loc && me.loc.layerlist_title) {
                    txt = me.loc.layerlist_title;
                }
                heading.append(txt);
                container.append(layersList);

                // enable/disable me.buttons['continue']
                me.buttons['continue'].setEnabled(true);

                // render list of layers that cannot be published
                if (deniedLayers.length > 0) {
                    var deniedLayersList = me._getRenderedLayerList(deniedLayers);
                    heading = deniedLayersList.find('h4');
                    heading.append(this.loc.layerlist_denied);
                    // add tooltip
                    var tooltip = me.templateInfo.clone();
                    tooltip.attr('title', me.loc.denied_tooltip);
                    heading.before(tooltip);
                    container.append(deniedLayersList);
                }
            } else {
                // write a message that
                var errorsList = me.templateError.clone(),
                    error = me.templateListItem.clone();
                error.append(me.loc.layerlist_empty);
                errorsList.find('ul').append(error);
                container.append(errorsList);

                // disable me.buttons['continue']
                me.buttons['continue'].setEnabled(false);
            }

        },
        /**
         * Renders an UI listing for given set of layers.
         *
         * @method _getRenderedLayerList
         * @private
         * @param
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         * list
         *      list of layers to render
         * @return {jQuery} DOM element with layer listing
         */
        _getRenderedLayerList: function (list) {
            var layerList = this.templateLayerList.clone(),
                listElement = layerList.find('ul'),
                i,
                layer,
                item;
            for (i = 0; i < list.length; ++i) {
                layer = list[i];
                item = this.templateListItem.clone();
                if (layer.getId().toString().indexOf('myplaces_') > -1) {
                    item.append(layer.getName() + ' (' + this.loc.myPlacesDisclaimer + ')');
                } else {
                    item.append(layer.getName());
                }
                listElement.append(item);
            }
            return layerList;
        },
        /**
         * Clears previous layer listing and renders a new one to the view.
         *
         * @method handleLayerSelectionChanged
         */
        handleLayerSelectionChanged: function () {
            this._renderLayerLists();
        },
        /**
         * Show Terms of Use to the user
         *
         * @method _showTermsOfUse
         * @private
         */
        _showTermsOfUse: function () {
            var me = this;

            if (me.dialog) {
                me.dialog.close(true);
                me.dialog = null;
                return;
            }

            if (!me.termsOfUse) {
                // load the article first
                var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', me.instance.sandbox);
                helper.getHelpArticle('termsofuse, mappublication, ' + Oskari.getLang(), function (success, response) {
                    if (success) {
                        me.termsOfUse = response;
                        // terms loaded, try again
                        me._showTermsOfUse();
                    }
                });
                return;
            }

            var dlg = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeBtn = dlg.createCloseButton(me.loc.buttons.close);

            closeBtn.setHandler(function() {
                dlg.close(true);
                me.dialog = null;
            });
            dlg.show(me.termsOfUse.title, me.termsOfUse.body, [closeBtn]);
            me.dialog = dlg;
        },
        /**
         * Checks if the user has accepted terms of use and sets hasAcceptedTou property
         *
         * @method _checkTouAccepted
         * @private
         */
        _checkTouAccepted: function () {
            var me = this;
            jQuery.ajax({
                url: me.instance.sandbox.getAjaxUrl(),
                type: 'GET',
                data: {
                    action_route: 'HasAcceptedPublishedTermsOfUse'
                },
                dataType: 'json',
                error: function () {
                    this.success(false);
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (resp) {
                    me.hasAcceptedTou = resp;
                    me._updateContinueButton();
                }
            });
        },
        /**
         * Updates the text on continue button depending if user has
         * accepted the Terms of Use or not
         *
         * @method _updateContinueButton
         * @private
         */
        _updateContinueButton: function () {
            this.buttons['continue'].setTitle(this.hasAcceptedTou ? this.loc.buttons['continue'] : this.loc.buttons.continueAndAccept);
        },
        /**
         * Requests that the backend mark the current logged in user as having
         * accepted the Terms of Use
         *
         * @method markTouAccepted
         * @private
         */
        _markTouAccepted: function () {
            var me = this;
            jQuery.ajax({
                url: me.instance.sandbox.getAjaxUrl(),
                type: 'GET',
                data: {
                    action_route: 'AcceptPublishedTermsOfUse'
                },
                dataType: 'json',
                error: function () {
                    this.success(false);
                },
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (resp) {
                    me.hasAcceptedTou = resp;
                    me._updateContinueButton();
                }
            });
        }
    });