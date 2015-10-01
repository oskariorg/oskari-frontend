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
        //console.dir(this.instance.plugins['Oskari.userinterface.Flyout']);
        this._sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.setTitle(localization.title);
        this.mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
        this.state = {};
        this._map = null;
        this.croppingVectorLayer = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket-cropping"></div>'),
            buttons: jQuery('<div class="oskari__download-basket-cropping-buttons"><p></p></div>'),
            tempbasket: jQuery('<div class="oskari__download-basket-temp-basket"><p></p></div>')
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
            _map = me.mapModule.getMap();

            //Loop cropping layers and create cropping btns
            jQuery.each( me.getCroppingLayers(), function( key, value ) {

                var croppingBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                croppingBtn.addClass('primary cropping-btn');
                croppingBtn.setTitle(value.getName());
                jQuery(croppingBtn.getElement()).data("layerName",value.getLayerName());
                jQuery(croppingBtn.getElement()).data("layerUrl",value.getLayerUrl());
                jQuery(croppingBtn.getElement()).click(
                function (event) {
                    var el = jQuery(this);
                    if(el.hasClass('selected')){
                        me.activateNormalGFI(true);
                        jQuery('.cropping-btn').removeClass('selected');
                        me.disableAllCroppingLayers(_map);
                        me.removeAllFeaturesFromCroppingLayer(_map);
                        jQuery('.oskari__download-basket-temp-basket').hide();
                    }else{
                        if(jQuery('.oskari__download-basket-temp-basket').is(':visible')){
                            me.confirmCroppingAreaChange(value, _map, el);
                        }else{
                            me.activateNormalGFI(false);
                            jQuery('.cropping-btn').removeClass('selected');
                            el.addClass('selected');
                            me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),_map);
                            me.removeAllFeaturesFromCroppingLayer(_map);
                        }
                    }
                    event.preventDefault();
                }
            );

                croppingBtn.insertTo(me._templates.buttons);
            });
            
            me._templates.main.append(me._templates.buttons);
            me._templates.buttons.find('p').text(me._getLocalization('choose-cropping-mode'));

            //Create Temp basket
            var moveToBasketBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            moveToBasketBtn.addClass('primary');
            moveToBasketBtn.setTitle(me._getLocalization('move-to-basket'));
            jQuery(moveToBasketBtn.getElement()).click(
                function (event) {
                    event.preventDefault();
                }
            );
            moveToBasketBtn.insertTo(me._templates.tempbasket);
            me._templates.tempbasket.find('p').html(me._getLocalization('users-temp-basket'));
            me._templates.main.append(me._templates.tempbasket);
            me._templates.tempbasket.hide();
            
            //TODO
            if(_map.getLayersByName("cropping-areas").length === 0){
                me.createCroppingVectorLayer();
            }
        },

        /**
         * [disableNormalGFI disables normal GFI cause using mapclick in cropping]
         * @param  {[type]} state [true/false]
         * @return {[none]}
         */
        activateNormalGFI: function(state){
            var me = this,
            reqBuilder = me._sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            if (reqBuilder) {
                var request = reqBuilder(state); 
                me._sandbox.request(me.instance, request);
            }
        },

        /**
         * [isCroppingToolActive checks if some cropping btn is selected]
         * @return {Boolean} [true/false]
         */
        isCroppingToolActive: function(){
            return jQuery('.cropping-btn').hasClass("selected");
        },

        /**
         * [createCroppingVectorLayer creates cropping vector layer to map]
         * @return {[none]}
         */
        createCroppingVectorLayer: function(){
            var me = this,
            _map = me.mapModule.getMap();

            me.croppingVectorLayer = new OpenLayers.Layer.Vector("cropping-areas", {styleMap:
                new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
            });

            _map.addLayers([me.croppingVectorLayer]);
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

        /**
         * [croppingLayersHighlight Highlights clicked cropping area/areas]
         * @param  {[string]} x      [Clicked on map X]
         * @param  {[string]} y      [Clicked on map Y]
         * @return {[none]}
         */
        croppingLayersHighlight: function(x, y){
            var me = this,
            mapVO = me._sandbox.getMap(),
            ajaxUrl = me._sandbox.getAjaxUrl(),
            map = me.mapModule.getMap(),
            layerName = jQuery('.cropping-btn.selected').data('layerName'),
            layerUrl = jQuery('.cropping-btn.selected').data('layerUrl');

            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
                data : {
                    layers: layerName,
                    x : x,
                    y : y,
                    bbox : mapVO.getBbox().toBBOX(),
                    width : mapVO.getWidth(),
                    height : mapVO.getHeight(),
                    srs : mapVO.getSrsName()
                },
                success: function (data) {
                    var geojson_format = new OpenLayers.Format.GeoJSON();
                    var features = geojson_format.read(data.features[0]);
                    var founded = me.croppingVectorLayer.getFeaturesByAttribute("cropid",data.features[0].id);

                        if(founded !== null && founded.length>0){
                            me.croppingVectorLayer.removeFeatures(founded);
                        }else{
                            features[0].attributes['cropid'] = data.features[0].id;
                            me.croppingVectorLayer.addFeatures(features);
                            map.setLayerIndex(me.croppingVectorLayer, 1000000);
                        }
                        me.addToTempBasket(me.croppingVectorLayer.features.length);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                    me._openPopup(
                        me._getLocalization('error-in-getfeatureforcropping'),
                        error
                    );
                }
            });

        },

        /**
         * [removeAllFeaturesFromCroppingLayer removes all features from cropping layer]
         * @return {[none]}
         */
        removeAllFeaturesFromCroppingLayer: function(map){
            var me = this,
            layer = map.getLayersByName("cropping-areas")[0];
            if(layer !== null){
                layer.destroyFeatures();
            }
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
         * [addToTempBasket updates temp basket]
         * @param {[type]} croppingLength [How many areas user has selected]
         */
        addToTempBasket: function(croppingLength) {
            var me = this,
            el =  jQuery('.oskari__download-basket-temp-basket');
            p = el.find('p');

            if(croppingLength > 0){
                p.find('span').text(croppingLength);
                el.show();
            }else{
                el.hide();
            }
        },

        /**
         * [confirmCroppingAreaChange description]
         * @param  {[type]} value [Selected cropping layer values]
         * @param  {[type]} _map  [Openlayers map]
         * @param  {[type]} el    [Button element]
         * @return {[none]}
         */
        confirmCroppingAreaChange: function(value, _map, el){
                var me = this;
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                btn.addClass('primary');
                btn.setTitle(me._getLocalization('yes'));
                btn.setHandler(function() {
                    me.activateNormalGFI(false);
                    jQuery('.cropping-btn').removeClass('selected');
                    el.addClass('selected');
                    me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),_map);
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeAllFeaturesFromCroppingLayer(_map);
                    alert("JA LISÄÄ AINEISTOT LAUTAUS KORIIN!");
                    dialog.close();
                });

                alertBtn.setTitle(me._getLocalization('no'));
                alertBtn.setHandler(function() {
                    me.activateNormalGFI(false);
                    jQuery('.cropping-btn').removeClass('selected');
                    el.addClass('selected');
                    me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),_map);
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeAllFeaturesFromCroppingLayer(_map);
                    dialog.close();
                });

                dialog.show(me._getLocalization('want-to-move-basket'), me._getLocalization('notify-move-to-basket'), [alertBtn, btn]);
                dialog.makeModal();
        },

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
