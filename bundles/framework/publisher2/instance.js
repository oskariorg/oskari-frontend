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
                //url = this.sandbox.getLocalizedProperty(this.conf.publishedMapUrl) + event.getId();
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
            var sandbox = this.getSandbox();
            var loc = this.getLocalization();

            this.__service = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.PublisherService', sandbox);
            // create and register request handler
            var reqHandler = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler',
                    this);
            sandbox.addRequestHandler('Publisher.PublishMapEditorRequest', reqHandler);

            // Let's add publishable filter to layerlist if user is logged in
            if(sandbox.getUser().isLoggedIn()) {
                request = sandbox.getRequestBuilder('AddLayerListFilterRequest')(
                    loc.layerFilter.buttons.publishable,
                    loc.layerFilter.tooltips.publishable,
                    function(layer){
                        return (layer.getPermission('publish') === 'publication_permission_ok');
                    },
                    'layer-publishable',
                    'layer-publishable-disabled',
                    'publishable'
                );

                sandbox.request(this, request);
            }
        },
        /**
         * @return {Oskari.mapframework.bundle.publisher2.PublisherService} service for state holding
         */
        getService : function() {
            return this.__service;
        },

        /**
         * @method setPublishMode
         * Transform the map view to publisher mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {Layer[]} deniedLayers layers that the user can't publish
         * @param {Object} data View data that is used to prepopulate publisher (optional)
         */
        setPublishMode: function (blnEnabled, deniedLayers, data) {
            var me = this,
                map = jQuery('#contentMap');
            // trigger an event letting other bundles know we require the whole UI
            var eventBuilder = this.sandbox.getEventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));

            if (blnEnabled) {
                me.getService().setNonPublisherLayers(deniedLayers);
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


                //calling this results in calling each of the panels' init-method twice, because init is already called when the forms are created at publisherSideBar's render.
                //and that causes trouble.
//                me.publisher.initPanels();
            } else {
                me._destroyGrid();
                Oskari.setLang(me.oskariLang);

                //change the mapmodule toolstyle back to normal
                var mapModule = me.sandbox.findRegisteredModuleInstance("MainMapModule");
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

                var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
                if(stats && typeof stats.renderPublishedLegend === 'function') {
                    stats.renderPublishedLegend({showLegend:false});
                }
                if(stats && typeof stats.renderToggleButtons === 'function') {
                    stats.renderToggleButtons(true);
                }
            }
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
         * @method _destroyGrid
         * Destroys Grid
         * @private
         */
        _destroyGrid: function () {
            jQuery('#contentMap').width('');
            jQuery('.oskariui-left')
                .css({
                    'width': '',
                    'height': '',
                    'float': ''
                })
                .removeClass('published-grid-left')
                .empty();
            jQuery('.oskariui-center').css({
                'width': '100%',
                'float': ''
            }).removeClass('published-grid-center');
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
    }
);
