/**
 * @class Oskari.mapframework.bundle.publisher2.PublisherBundleInstance
 *
 * Main component and starting point for the "map publisher" functionality. Publisher
 * is a wizardish tool to configure a subset of map functionality. It uses the map
 * plugin functionality to start and stop plugins when the map is running. Also it
 * changes plugin language and map size.
 *
 * See Oskari.mapframework.bundle.publisher2.PublisherBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.PublisherBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        // override defaults
        var conf = this.getConfiguration();
        conf.name = 'Publisher2';
        conf.flyoutClazz = 'Oskari.mapframework.bundle.publisher2.Flyout';
        this.defaultConf = conf;
        this.publisher = null;
        this.customTileRef = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Publisher2',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        init: function () {
            var tileElem = jQuery(this.getConfiguration().tileElement);
            if(tileElem.length && tileElem.length !== 0) {
                this.customTileRef = this.getConfiguration().tileElement;
                this.conf.tileClazz = null;
                this.customElementClickHandler(tileElem);
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method Publisher.MapPublishedEvent
             * @param {Oskari.mapframework.bundle.publisher.event.MapPublishedEvent} event
             */
            'Publisher.MapPublishedEvent': function (event) {
                var loc = this.getLocalization(),
                    dialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'
                    ),
                    okBtn = dialog.createCloseButton(loc.BasicView.buttons.ok),
                    url,
                    iframeCode,
                    textarea,
                    content,
                    width = event.getWidth(),
                    height = event.getHeight();

                okBtn.addClass('primary');
                url = event.getUrl();
                iframeCode = '<div class="codesnippet"><code>&lt;iframe src="' + url + '" style="border: none;';
                if (width !== null && width !== undefined) {
                    iframeCode += ' width: ' + width + ';';
                }

                if (height !== null && height !== undefined) {
                    iframeCode += ' height: ' + height + ';';
                }

                iframeCode += '"&gt;&lt;/iframe&gt;</code></div>';

                content = loc.published.desc + '<br/><br/>' + iframeCode;

                dialog.show(loc.published.title, content, [okBtn]);
                this.setPublishMode(false);
            }
        },
        /**
         * @method afterStart
         */
        afterStart: function () {
            var me = this;
            var sandbox = this.getSandbox();
            var loc = this.getLocalization();
            
            this.__service = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.PublisherService', sandbox);
            // create and register request handler
            var reqHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
                function(data) {
                    me.setPublishMode(true, data);
                });
            sandbox.requestHandler('Publisher.PublishMapEditorRequest', reqHandler);

            // Let's add publishable filter to layerlist if user is logged in
            if(Oskari.user().isLoggedIn()) {
                var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
                mapLayerService.registerLayerFilter('publishable', function(layer){
                    return (layer.getPermission('publish') === 'publication_permission_ok');
                });

                // Add layerlist filter button
                Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest', [
                        loc.layerFilter.buttons.publishable,
                        loc.layerFilter.tooltips.publishable,
                        'layer-publishable',
                        'layer-publishable-disabled',
                        'publishable'
                ]);
            }
            this._registerForGuidedTour();
        },
        /**
         * @return {Oskari.mapframework.bundle.publisher2.PublisherService} service for state holding
         */
        getService : function() {
            return this.__service;
        },
        /**
         * @return {String} reference to element-id to use instead of tile as bundle ui-element, returns null if isn't set in conf
         */
        getCustomTileRef: function () {
             return this.customTileRef;
        },
         /**
         * @method customElementClickHandler
         * @param {jQuery} tileElement
         */
        customElementClickHandler: function (tileElement) {
            var me = this;
            tileElement.on("click", function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest', [me, 'toggle']
                );
            });
        },
        /**
         * @method setPublishMode
         * Transform the map view to publisher mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {Object} data View data that is used to prepopulate publisher (optional)
         * @param {Layer[]} deniedLayers layers that the user can't publish (optional)
         */
        setPublishMode: function (blnEnabled, data, deniedLayers) {
            var me = this;
            var map = jQuery('#contentMap');
            data = data || this.getDefaultData();
            // trigger an event letting other bundles know we require the whole UI
            var eventBuilder = Oskari.eventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
            if ( this.getCustomTileRef() ) {
                 blnEnabled ? jQuery( this.getCustomTileRef() ).addClass('activePublish') : jQuery( this.getCustomTileRef() ).removeClass('activePublish');
            }
            if (blnEnabled) {
                var stateRB = Oskari.requestBuilder('StateHandler.SetStateRequest');
                this.getSandbox().request(this, stateRB(data.configuration));
                if(data.uuid) {
                    this._showEditNotification();
                }

                me.getService().setNonPublisherLayers(deniedLayers || this.getLayersWithoutPublishRights());
                me.getService().removeLayers();
                me.oskariLang = Oskari.getLang();

                map.addClass('mapPublishMode');
                map.addClass('published');
                // FIXME: not like this! see removing...
                me.sandbox.mapMode = 'mapPublishMode';

                // hide flyout?
                // TODO: move to default flyout/extension as "mode functionality"?
                jQuery(me.getFlyout().container).parent().parent().css('display', 'none');

                me.publisher = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
                    me,
                    me.getLocalization('BasicView'),
                    data
                );
                //call set enabled before rendering the panels (avoid duplicate "normal map plugins")
                me.publisher.setEnabled(true);
                me.publisher.render(map);
            } else {
                Oskari.setLang(me.oskariLang);

                //change the mapmodule toolstyle back to normal
                var mapModule = me.sandbox.findRegisteredModuleInstance("MainMapModule");
                // TODO: reset to what it was when publisher was started instead of removing it (mapmodule.getToolStyle())
                mapModule.changeToolStyle(null);

                if (me.publisher) {
                    // show flyout?
                    // TODO: move to default flyout/extension as "mode functionality"?
                    jQuery(me.getFlyout().container).parent().parent().css('display', '');
                    // make sure edit mode is disabled
                    if (me.publisher.toolLayoutEditMode) {
                        me.publisher._editToolLayoutOff();
                    }
                    me.publisher.setEnabled(false);
                    me.publisher.destroy();
                }
                // first return all needed plugins before adding the layers back
                map.removeClass('mapPublishMode');
                map.removeClass('published');
                // FIXME: not like this! see setter...
                if (me.sandbox.mapMode === 'mapPublishMode') {
                    delete me.sandbox.mapMode;
                }
                // return the layers that were removed for publishing.
                me.getService().addLayers();
                me.getFlyout().close();
            }
        },
        /**
         * Initial data for publisher to preselect certain tools by default and assume current map state as starting point
         * @return {Object}
         */
        getDefaultData: function() {
            var config = {
                mapfull: {
                    conf: {
                        plugins: [
                            {id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin'},
                            {id: 'Oskari.mapframework.mapmodule.ControlsPlugin'},
                            {id: 'Oskari.mapframework.mapmodule.GetInfoPlugin'}
                        ]
                    }
                },
                "featuredata2": {
                    conf: {}
                }
            };
            // setup current mapstate so layers are not removed
            var state = this.getSandbox().getCurrentState();
            // merge state to initial config
            return { configuration: jQuery.extend(true, config, state) };
        },
        /**
         * @method _showEditNotification
         * Shows notification that the user starts editing an existing published map
         * @private
         */
        _showEditNotification: function () {
            var loc = this.getLocalization('edit'),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.show(loc.popup.title, loc.popup.msg);
            dialog.fadeout();
        },
        /**
         * @method hasPublishRight
         * Checks if the layer can be published.
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         * layer
         *      layer to check
         * @return {Boolean} true if the layer can be published
         */
        hasPublishRight: function (layer) {
            // permission might be "no_publication_permission"
            // or nothing at all
            return (layer.getPermission('publish') === 'publication_permission_ok');
        },

        /**
         * @method getLayersWithoutPublishRights
         * Checks currently selected layers and returns a subset of the list
         * that has the layers that can't be published. If all selected
         * layers can be published, returns an empty list.
         * @return
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         * list of layers that can't be published.
         */
        getLayersWithoutPublishRights: function () {
            var deniedLayers = [],
                selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                i,
                layer;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (!this.hasPublishRight(layer)) {
                    deniedLayers.push(layer);
                }
            }
            return deniedLayers;
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 40,
            show: function(){
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'Publisher2']);
            },
            hide: function(){
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'Publisher2']);
            },
            getTitle: function () {
                return this.getLocalization().guidedTour.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.getLocalization().guidedTour.message);
                return content;
            },
            getLinks: function() {
                var me = this;
                var loc = this.getLocalization().guidedTour;
                var linkTemplate = jQuery('<a href="#"></a>');
                var openLink = linkTemplate.clone();
                openLink.append(loc.openLink);
                openLink.bind('click',
                    function () {
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'Publisher2']);
                        openLink.hide();
                        closeLink.show();
                    });
                var closeLink = linkTemplate.clone();
                closeLink.append(loc.closeLink);
                closeLink.bind('click',
                    function () {
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'Publisher2']);
                        openLink.show();
                        closeLink.hide();
                    });
                closeLink.show();
                openLink.hide();
                return [openLink, closeLink];
            }
        },

        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function() {
            var me = this;
            function sendRegister() {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if(requestBuilder){
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for(var prop in me.__guidedTourDelegateTemplate){
                        if(typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler(msg){
                if(msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if(tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
    }
);
