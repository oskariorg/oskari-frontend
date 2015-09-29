/**
 * @class Oskari.hsy.bundle.downloadBasket.Cropping
 *
 * Renders the "admin channels" flyout.
 *
 */
Oskari.clazz.define(
    'Oskari.hsy.bundle.downloadBasket.Cropping',
    function (localization, parent) {
        this.instance = parent;
        this._sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.setTitle(localization.title);
        this.mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
        this.state = {};
        this._map = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket-cropping"></div>'),
            buttons: jQuery('<div class="oskari__download-basket-cropping__buttons"></div>')
        };
        this.setContent(this.createUi());
    },{

        /**
         * @private @method _initTemplates, creates ui for cropping items
         *
         *
         */
        _initTemplates: function () {
            var me = this;
            var map = this.mapModule.getMap();
            
            console.dir(map);
            console.dir(me.getCroppingLayers());

            //Loop cropping layers and create cropping btns
            jQuery.each( me.getCroppingLayers(), function( key, value ) {

                var croppingBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                croppingBtn.addClass('primary');
                croppingBtn.setTitle(value.getName());
                jQuery(croppingBtn.getElement()).click(
                function (event) {
                    me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),map);
                    event.preventDefault();
                }
            );

                croppingBtn.insertTo(me._templates.buttons);
            });
            me.croppingLayersHighlight(map);
            me._templates.main.append(me._templates.buttons);
        },

        /**
         * [getCroppingLayers: Gets layers that has attribute rajaus: true]
         * @return {[array]} [Layers that has attribute rajaus: true]
         */
        getCroppingLayers: function(){
            var me = this;

            var mapService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var allLayers = mapService.getAllLayers();
            var croppingLayers = jQuery.grep(allLayers, function(n) {
              var attributes = n.getAttributes();
              if(attributes.rajaus){
                return n;
              }
            });
            
            return croppingLayers;
        },

        croppingLayersHighlight: function(map, layerUrl){

            var info = new OpenLayers.Control.WMSGetFeatureInfo({
                url: 'http://10.20.0.4:9902/geoserver/taustakartat_ja_aluejaot/wms',
                output: 'features',
                infoFormat: 'application/json',
                format: new OpenLayers.Format.GML,

                eventListeners: {
                    getfeatureinfo: function(event){
                        console.log(event);
                        console.log(event.features);
                        console.log(event.text);
                    }
                }
            });

            map.addControl(info);
            info.activate();
        },

        /**
         * [_disableAllCroppingLayers removes cropping layer]
         * @param  {[type]} map [object]
         * @return none
         */
        disableAllCroppingLayers: function(map){
            var me = this;
            
             var layer = map.getLayersByName("download-basket-cropping-layer");
             if(layer.length > 0){
                 map.removeLayer(layer[0]);
             }
        },

        /**
         * [createCroppingWMSLayer creates WMS layer by users click and shows it on map]
         * @param  {[string]} layerName [Layers name in geoserver]
         * @param  {[string]} layerUrl  [Layers url in geoserver]
         * @param  {[object]} map       [Openlayers map object]
         * @return none
         */
        createCroppingWMSLayer: function(layerName, layerUrl, map){
            var me = this;
            me.disableAllCroppingLayers(map);

            var layer = new OpenLayers.Layer.WMS("download-basket-cropping-layer",layerUrl,{
                layers: layerName,
                transparent: "true"
             },
             {
                isBaseLayer: false,
                visibility: true
            });

            map.addLayer(layer);
        },

        /**
         * [getWFSLayerColumns description]
         * @param  {[type]}
         * @return {[type]}
         */
/*        getWFSLayerColumns: function (layer_id, el) {
            var me = this;
            if(layer_id != "" && layer_id != null){
                var url = this.sandbox.getAjaxUrl() + 'action_route=GetWFSDescribeFeature&layer_id=' + layer_id;
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: url,
                    beforeSend: function (x) {
                        if (x && x.overrideMimeType) {
                            x.overrideMimeType('application/j-son;charset=UTF-8');
                        }
                    },
                    success: function (data) {
                        jQuery(el).find('select[name=choose-param-for-search]').empty();

                        if(data.propertyTypes == null){

                            me._openPopup(
                                me._getLocalization('columns_failed'),
                                me._getLocalization('no_columns_for_layer')
                            );
                            return false;
                        }

                        jQuery.each(data.propertyTypes, function(name, type){
                            jQuery(el).find('select[name=choose-param-for-search]').append(jQuery('<option>', {
                                type: type,
                                value: name,
                                text : name
                            }));
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                        me._openPopup(
                            me._getLocalization('columns_failed'),
                            error
                        );
                    }
                });
            }
        },*/

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },

        _getErrorText: function (jqXHR, textStatus, errorThrown) {
            var error = errorThrown.message || errorThrown;
            try {
                var err = JSON.parse(jqXHR.responseText).error;
                if (err !== null && err !== undefined) {
                    error = err;
                }
            } catch (e) {

            }
            return error;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this;

            me._initTemplates();
            me.container = me._templates.main.clone(true);

            return me.container;
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
