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
         * @method afterStart
         */
        afterStart: function () {
            var sandbox = this.getSandbox();

            this.__service = Oskari.clazz.create('Oskari.mapframework.bundle.publisher2.PublisherService', sandbox);
            // create and register request handler
            var reqHandler = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.publisher2.request.PublishMapEditorRequestHandler',
                    this);
            sandbox.addRequestHandler('Publisher2.PublishMapEditorRequest', reqHandler);
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
                map = jQuery('#contentMap'),
                selectedLayers,
                statsLayer,
                i,
                layer,
                request,
                requestBuilder;

            // check if statsgrid mode is on
            // -> disable statsgrid mode
            selectedLayers = me.sandbox.findAllSelectedMapLayers();
            statsLayer = null;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === 'stats') {
                    request = me.sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, layer);
                    me.sandbox.request(me.getName(), request);
                    statsLayer = layer;
                    break;
                }
            }

            if (blnEnabled) {
                me.disabledLayers = deniedLayers;
                me.oskariLang = Oskari.getLang();
                me.getService().removeLayers();

                map.addClass('mapPublishMode');
                map.addClass('published');
                me.sandbox.mapMode = 'mapPublishMode';

                // hide flyout?
                jQuery(me.getFlyout().container).parent().parent().css('display', 'none');

                me.publisher = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.publisher2.view.BasicPublisher',
                    me,
                    me.getLocalization('BasicView'),
                    data
                );
                me.publisher.render(map);
                me.publisher.setEnabled(true);
                if (statsLayer) {
                    me.publisher.initGrid(statsLayer);
                }

            } else {
                me._destroyGrid();
                Oskari.setLang(me.oskariLang);
                if (me.publisher) {
                    jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', '');
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
                if (me.sandbox._mapMode === 'mapPublishMode') {
                    delete me.sandbox._mapMode;
                }
                me.getService().addLayers();
                //postRequestByName brakes mode change functionality! me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
                request = me.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
                me.sandbox.request(me.getName(), request);
            }
            // publishing mode should be sent to mapfull to disable resizing
            requestBuilder = me.sandbox.getRequestBuilder('MapFull.MapResizeEnabledRequest');
            if (requestBuilder) {
                request = requestBuilder(!blnEnabled);
                me.sandbox.request(me, request);
            }
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
