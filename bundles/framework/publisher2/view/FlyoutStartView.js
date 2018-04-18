/**
 * @class Oskari.mapframework.bundle.publisher2.view.StartView
 *
 * Renders the "publisher" view for users that are logged in and can publish
 * maps. This is an initial screen where the user is told that the map will
 * move in to a publisher view. Also shows the user which layers the map will
 * have and if the user can't publish some layers.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.FlyoutStartView',

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
        me.service = instance.getService();
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
            var me = this;
            var content = me.template.clone();
            me.content = content;

            content.find('div.content').before(me.loc.text);
            container.append(content);

            var touContentLink = content.find('div.tou a');
            touContentLink.append(me.loc.touLink);
            var conf = me.instance.conf || {};
            var url = me.instance.sandbox.getLocalizedProperty(conf.termsOfUseUrl) || '';
            if (url.indexOf('http') === 0) {
                // starts with http - use as a link
                touContentLink.attr('target', '_blank');
                touContentLink.attr('href', url);
            } else {
                // otherwise use tags to get article content
                touContentLink.bind('click', function () {
                    me._showTermsOfUse();
                    return false;
                });
            }

            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setHandler(function () {
                if (!me.hasAcceptedTou) {
                    me._markTouAccepted();
                }

                var publishMapEditorRequestBuilder = me.instance.sandbox.getRequestBuilder(
                    'Publisher.PublishMapEditorRequest'
                );
                if (publishMapEditorRequestBuilder) {
                    var req = publishMapEditorRequestBuilder();
                    me.instance.sandbox.request(me.instance, req);
                }
            });
            me.buttons['continue'] = continueButton;
            me._updateContinueButton();
            continueButton.insertTo(content.find('div.buttons')[0]);

            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.instance.getFlyout().close();
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
            var me = this;
            var container = me.content.find('div.content');

            // cleanup
            container.find('div.error').remove();
            container.find('div.layerlist').remove();

            // split layers to publishable or not
            var layers = [];
            var deniedLayers = [];
            me.instance.sandbox.findAllSelectedMapLayers().forEach(function (layer) {
                if (!me.service.hasPublishRight(layer)) {
                    deniedLayers.push(layer);
                } else {
                    layers.push(layer);
                }
            });

            // check if we have any layers for publishing
            if (layers.length === 0) {
                // no layers available for publishing
                var errorsList = me.templateError.clone();
                var error = me.templateListItem.clone();
                error.append(me.loc.layerlist_empty);
                errorsList.find('ul').append(error);
                container.append(errorsList);

                // disable Continue button
                me.buttons['continue'].setEnabled(false);
                return;
            }

            // good for publishing
            // render list of layers with publication rights
            var layersListEl = me._getRenderedLayerList(layers);
            layersListEl.find('h4').append(me.loc.layerlist_title || 'loc.layerlist_title');
            container.append(layersListEl);

            // enable Continue button
            me.buttons['continue'].setEnabled(true);

            // render list of layers that cannot be published if there are any
            if (deniedLayers.length > 0) {
                var deniedLayersList = me._getRenderedLayerList(deniedLayers);
                var heading = deniedLayersList.find('h4');
                heading.append(this.loc.layerlist_denied);
                // add tooltip
                var tooltip = me.templateInfo.clone();
                tooltip.attr('title', me.loc.denied_tooltip);
                heading.before(tooltip);
                container.append(deniedLayersList);
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
            var layerList = this.templateLayerList.clone();
            var listElement = layerList.find('ul');
            var listItemTemplate = this.templateListItem;
            var usercontentDisclaimer = this.loc.myPlacesDisclaimer;

            (list || []).forEach(function (layer) {
                var item = listItemTemplate.clone();
                var txt = layer.getName();
                // TODO: this covers myplaces layers - what about userlayers?
                if (layer.isLayerOfType('MYPLACES')) {
                    txt = txt + ' (' + usercontentDisclaimer + ')';
                }
                item.append(txt);
                listElement.append(item);
            });
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

            var dlg = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var closeBtn = dlg.createCloseButton(me.loc.buttons.close);

            closeBtn.setHandler(function () {
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
                url: Oskari.urls.getRoute('HasAcceptedPublishedTermsOfUse'),
                type: 'GET',
                error: function () {
                    this.success(false);
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
                url: Oskari.urls.getRoute('AcceptPublishedTermsOfUse'),
                type: 'GET',
                error: function () {
                    this.success(false);
                },
                success: function (resp) {
                    me.hasAcceptedTou = resp;
                    me._updateContinueButton();
                }
            });
        }
    });
