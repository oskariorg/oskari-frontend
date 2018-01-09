/**
 * @class Oskari.mapframework.bundle.downloadBasket.Cropping
 *
 * Renders the "Download basket cropping".
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.downloadBasket.Cropping',
    function (localization, parent) {
        this.instance = parent;
        this._sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.setTitle(localization.title);
        this.mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
        this.state = {};
        this._map = null;
        this.croppingVectorLayer = null;
        this.reqularControl = null;
        this.basket = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket-cropping"></div>'),
            buttons: jQuery('<div class="oskari__download-basket-cropping-buttons"><p></p></div>'),
            helptemplate: jQuery('<div class="oskari__download-basket-help"><p></p></div>'),
            tempbasket: jQuery('<div class="oskari__download-basket-temp-basket"><p></p></div>')
        };

    },{
        startCropping: function(){
             this.setContent(this.createUi());
        },
        /**
         * @private @method _initTemplates, creates ui for cropping items
         *
         *
         */
        _initTemplates: function () {
            var me = this;
            var map = me.mapModule.getMap();

            //Loop cropping layers and create cropping btns
            jQuery.each(me.getCroppingLayers(), function( key, value ) {
                //Initialize cropping btns
                var croppingBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                croppingBtn.addClass('primary cropping-btn');
                croppingBtn.setTitle(value.getName());
                jQuery(croppingBtn.getElement()).data("layerName",value.getLayerName());
                jQuery(croppingBtn.getElement()).data("layerUrl",value.getLayerUrl());
                var layerAttributes = value.getAttributes();
                if(layerAttributes.unique !== null){
                    jQuery(croppingBtn.getElement()).data("uniqueKey",layerAttributes.unique);
                    jQuery(croppingBtn.getElement()).data("geometryColumn",layerAttributes.geometryColumn);
                    jQuery(croppingBtn.getElement()).data("geometry",layerAttributes.geometry);
                }

                if(value.rect){
                    jQuery(croppingBtn.getElement()).data("croppingMode","regtangle");
                }else{
                    jQuery(croppingBtn.getElement()).data("croppingMode","polygon");
                }

                jQuery(croppingBtn.getElement()).click(function (event) {
                    var el = jQuery(this);
                    var selectedLayers = me._buildLayerList();
                    //User has not selected any layers
                    if(selectedLayers.length === 0){
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton('OK');
                        btn.addClass('primary');
                        dialog.show(me._getLocalization('no-layers-selected-title'), me._getLocalization('no-layers-selected-message'), [btn]);
                        return false;
                    }
                    //Cropping btn is allready selected
                    if(el.hasClass('selected')){
                        me.activateNormalGFI(true);
                        me.activateNormalWFSReq(true);
                        jQuery('.cropping-btn').removeClass('selected');
                        me.disableAllCroppingLayers(map);
                        me.removeAllFeaturesFromCroppingLayer(map);
                        jQuery('.oskari__download-basket-temp-basket').hide();
                        jQuery('.oskari__download-basket-help').hide();
                        me.reqularControl.deactivate();
                    }else{
                        //User has some cropping going on
                        if(jQuery('.oskari__download-basket-temp-basket').is(':visible')){
                            me.confirmCroppingAreaChange(value, map, el, value.rect);
                        }else{
                            //Fresh user selection
                            me.activateNormalGFI(false);
                            me.activateNormalWFSReq(false);
                            jQuery('.cropping-btn').removeClass('selected');
                            el.addClass('selected');
                            jQuery('.oskari__download-basket-help').show();
                            if(value.rect){
                                me.reqularControl.activate();
                                me.removeAllFeaturesFromCroppingLayer(map);
                                me.disableAllCroppingLayers(map);
                            }else{
                                me.reqularControl.deactivate();
                                me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),map);
                                me.removeAllFeaturesFromCroppingLayer(map);
                            }
                        }
                    }
                    event.preventDefault();
                }
            );

                croppingBtn.insertTo(me._templates.buttons);
            });

            me._templates.buttons.find('p').text(me._getLocalization('choose-cropping-mode'));
            me._templates.main.append(me._templates.buttons);

            //Help text
            me._templates.main.append(me._templates.helptemplate);
            me._templates.helptemplate.find('p').text(me._getLocalization('choose-wanted-areas-from-map'));
            me._templates.helptemplate.hide();

            //Create Temp basket
            var moveToBasketBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            moveToBasketBtn.addClass('approve');
            moveToBasketBtn.setTitle(me._getLocalization('move-to-basket'));
            jQuery(moveToBasketBtn.getElement()).click(function() {
                me.addToBasket(map);
                jQuery('.oskari__download-basket-temp-basket').hide();
                me.removeAllFeaturesFromCroppingLayer(map);
            });
            moveToBasketBtn.insertTo(me._templates.tempbasket);
            me._templates.tempbasket.find('p').html(me._getLocalization('users-temp-basket'));

            var clearTempBasket = Oskari.clazz.create('Oskari.userinterface.component.Button');
            clearTempBasket.addClass('primary');
            clearTempBasket.setTitle(me._getLocalization('temp-basket-empty'));
            jQuery(clearTempBasket.getElement()).click(
                function (event) {
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeAllFeaturesFromCroppingLayer(map);
                    event.preventDefault();
                }
            );
            clearTempBasket.insertTo(me._templates.tempbasket);

            me._templates.main.append(me._templates.tempbasket);
            me._templates.tempbasket.hide();

            //Create vector layer for  user selections
            if(me.croppingVectorLayer === null){
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
         * [activateNormalWFSReq disables normal WFS click cause using mapclick in cropping]
         * @param  {[type]} state [true/false]
         * @return {[none]}
         */
        activateNormalWFSReq: function(state){
            var me = this,
            reqBuilder = me._sandbox.getRequestBuilder('WfsLayerPlugin.ActivateHighlightRequest');

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

            me.croppingVectorLayer = new OpenLayers.Layer.Vector("cropping-areas", {
            eventListeners : {
                "featuresadded" : function(layer) {
                    var layerCroppingMode = jQuery('.cropping-btn.selected').data('croppingMode');
                    var index = me.croppingVectorLayer.features.length-1;
                    me.croppingVectorLayer.features[index].attributes.croppingMode = layerCroppingMode;
                    me.addToTempBasket(me.croppingVectorLayer.features.length);
                    }
                }
            });

            _map.addLayers([me.croppingVectorLayer]);

            me.reqularControl = new OpenLayers.Control.DrawFeature(me.croppingVectorLayer,
                OpenLayers.Handler.RegularPolygon, {
                            handlerOptions: {
                                sides: 4,
                                irregular: true
                            }
            });

            _map.addControl(me.reqularControl);

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
              if(attributes.cropping){
                return n;
              }
            });

            //Rect cropping mode
            var regular = {
                name : me._getLocalization('rect-cropping'),
                rect : true,
                getName: function(){
                    return this.name;
                },
                getLayerName: function(){
                    return "";
                },
                getLayerUrl: function(){
                    return "";
                },
                getAttributes: function(){
                    return "";
                }
            };

            croppingLayers.push(regular);

            return croppingLayers;
        },
        /**
         * [getUrlParams find parameters by name]
         * @param  {[String]} uri       [uri for search]
         * @param  {[String]} paramName [parameters name]
         * @return {[String]}           [right parameter value]
         */
        getUrlParams: function(uri, paramName){
            var me = this;
            var queryString = {};
            uri.replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { queryString[$1] = $3; }
            );
            return  queryString[paramName];
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
            layerUniqueKey = jQuery('.cropping-btn.selected').data('uniqueKey'),
            layerGeometryColumn = jQuery('.cropping-btn.selected').data('geometryColumn'),
            layerGeometry = jQuery('.cropping-btn.selected').data('geometry'),
            layerName = jQuery('.cropping-btn.selected').data('layerName'),
            layerUrl = me.getUrlParams(jQuery('.cropping-btn.selected').data('layerUrl'),'id'),
            layerCroppingMode = jQuery('.cropping-btn.selected').data('croppingMode'),
            layerNameLang = jQuery('.cropping-btn.selected').val();

            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
                data : {
                    layers: layerName,
                    url: layerUrl,
                    x : x,
                    y : y,
                    bbox : mapVO.getBboxAsString(),
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
                            features[0].attributes.cropid = data.features[0].id;
                            features[0].attributes.layerName= layerName;
                            features[0].attributes.layerUrl = layerUrl;
                            features[0].attributes.uniqueKey = layerUniqueKey;
                            features[0].attributes.geometryColumn = layerGeometryColumn;
                            features[0].attributes.geometryName = layerGeometry;
                            features[0].attributes.croppingMode = layerCroppingMode;
                            features[0].attributes.layerNameLang = layerNameLang;

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

        _openPopup: function(title, message) {
            var me = this;
            if(me._popup) {
                me._popup.close(true);
            } else {
                me._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._popup.show(title,message);
            me._popup.fadeout();
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
                p.find('strong').text(croppingLength);
                el.show();
                jQuery('.oskari__download-basket-help').hide();
            }else{
                el.hide();
                jQuery('.oskari__download-basket-help').show();
            }
        },

        /**
         * [confirmCroppingAreaChange description]
         * @param  {[type]} value [Selected cropping layer values]
         * @param  {[type]} _map  [Openlayers map]
         * @param  {[type]} el    [Button element]
         * @param  {[type]} rect  [Is rectangle selection]
         * @return {[none]}
         */
        confirmCroppingAreaChange: function(value, _map, el, rect){
                var me = this;
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                btn.addClass('primary');
                btn.setTitle(me._getLocalization('yes'));
                btn.setHandler(function() {
                    me.addToBasket(_map);
                    jQuery('.cropping-btn').removeClass('selected');
                    el.addClass('selected');
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeAllFeaturesFromCroppingLayer(_map);
                    jQuery('.oskari__download-basket-help').show();
                    if(rect){
                        me.reqularControl.activate();
                    }else{
                        me.reqularControl.deactivate();
                        me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),_map);
                        me.activateNormalGFI(false);
                        me.activateNormalWFSReq(false);
                    }
                    dialog.close();
                });

                alertBtn.setTitle(me._getLocalization('no'));
                alertBtn.setHandler(function() {
                    jQuery('.cropping-btn').removeClass('selected');
                    el.addClass('selected');
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeAllFeaturesFromCroppingLayer(_map);
                    jQuery('.oskari__download-basket-help').show();
                    if(rect){
                        me.reqularControl.activate();
                    }else{
                        me.reqularControl.deactivate();
                        me.createCroppingWMSLayer(value.getLayerName(),value.getLayerUrl(),_map);
                        me.activateNormalGFI(false);
                        me.activateNormalWFSReq(false);
                    }
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

        /**
         * [_getErrorText text for ajax errors]
         * @param  {[jqXHR]}       [jqXHR]
         * @param  {[textStatus]}  [textStatus]
         * @param  {[errorThrown]} [errorThrown]
         * @return {[error]}       [error]
         */
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
        },

        setBasket: function(basket){
            var me = this;
            me.basket = basket;
        },

        /**
         * [addToBasket Collects all needed information for basket object]
         * @param {[type]} map [description]
         */
        addToBasket: function(map){
            var me = this;
            var selectedLayers = me._buildLayerList();
            var croppedAreaFeatures = me.croppingVectorLayer.features;
            var basketObject = {};

            //Finds layers that are active and loop cropping areas to them, collect are important values
            jQuery.each( selectedLayers, function( layer_key, layer_value ) {
                jQuery.each( croppedAreaFeatures, function( feature_key, feature_value ) {
                    basketObject.layerNameLang = layer_value.getName();
                    basketObject.layerName = layer_value.getLayerName();
                    basketObject.layerUrl = me.getUrlParams(layer_value.getLayerUrl(),'id');
                    basketObject.cropLayerName = feature_value.attributes.layerName;
                    basketObject.cropLayerNameLang = feature_value.attributes.layerNameLang;
                    basketObject.cropLayerUrl = feature_value.attributes.layerUrl;
                    basketObject.cropUniqueKey = feature_value.attributes.uniqueKey;
                    basketObject.cropGeometryColumn = feature_value.attributes.geometryColumn;
                    basketObject.cropGeometryName = feature_value.attributes.geometryName;
                    basketObject.cropUniqueKeyValue = feature_value.attributes[feature_value.attributes.uniqueKey];
                    basketObject.bbox = {
                        bottom: feature_value.geometry.bounds.bottom,
                        left: feature_value.geometry.bounds.left,
                        right: feature_value.geometry.bounds.right,
                        top: feature_value.geometry.bounds.top
                    };
                    basketObject.cropMode = feature_value.attributes.croppingMode;

                    me.basket.addToBasket(basketObject);
                });
            });
            me.instance.addBasketNotify();
        },
        /**
        * [_buildLayerList finds layer that user has chowsen to be cropped]
        * @return {[layer]} [array of layers]
        */
        _buildLayerList: function()  {
            var me = this;
            var selected = me._sandbox.findAllSelectedMapLayers();
            var layerIds = [];

            var mapScale = me._sandbox.getMap().getScale();

            for (var i = 0; i < selected.length; i++) {
                var layer = selected[i];
                var attributes = layer.getAttributes();

                if(!layer.isInScale(mapScale)) {
                    continue;
                }
                if(!layer.isVisible()) {
                    continue;
                }
                if(layer._type=='BASE_LAYER'){
                    continue;
                }

                if(layer._layerType=='WMTS'){
                    continue;
                }
                if(attributes.basemap){
                    continue;
                }
                if(attributes.raster){
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton('OK');
                    btn.addClass('primary');
                    dialog.show(me._getLocalization('basket-raster-problem-title'),
                        layer.getName()+' '+me._getLocalization('basket-raster-problem'), [btn]);
                    continue;
                }

                layerIds.push(layer);

            }
            return layerIds;
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
