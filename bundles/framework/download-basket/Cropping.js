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
        this.basket = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket-cropping"></div>'),
            buttons: jQuery('<div class="oskari__download-basket-cropping-buttons"><p></p></div>'),
            helptemplate: jQuery('<div class="oskari__download-basket-help"><p></p></div>'),
            tempbasket: jQuery('<div class="oskari__download-basket-temp-basket"><p></p></div>')
        };

        this.croppingLayerId = null;
        this._features = {};
        this._croppingFeatures = [];
        this.CROPPING_LAYER_ID = 'download-basket-cropping-layer';
        this._drawing = false;
        this.DOWNLOAD_BASKET_DRAW_ID = 'download-basket-drawing';
    },{
        startCropping: function(){
             this.setContent(this.createUi());
        },
        /**
         * Creates ui for cropping items
         * @private @method _initTemplates
         */
        _initTemplates: function () {
            var me = this;

            // Loop cropping layers and create cropping buttons
            me.getCroppingLayers().forEach(function(croppingLayer) {
                //Initialize cropping btns
                var croppingBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                croppingBtn.addClass('cropping-btn');
                croppingBtn.setTitle(croppingLayer.getName());

                jQuery(croppingBtn.getElement()).data('layerId', croppingLayer.getId());
                jQuery(croppingBtn.getElement()).data('layerName', croppingLayer.getLayerName());
                jQuery(croppingBtn.getElement()).data('layerUrl', croppingLayer.getLayerUrl());
                var layerAttributes = croppingLayer.getAttributes();
                if(layerAttributes.unique !== null){
                    jQuery(croppingBtn.getElement()).data('uniqueKey',layerAttributes.unique);
                    jQuery(croppingBtn.getElement()).data('geometryColumn',layerAttributes.geometryColumn);
                    jQuery(croppingBtn.getElement()).data('geometry',layerAttributes.geometry);
                }

                if(croppingLayer.rect){
                    jQuery(croppingBtn.getElement()).data('croppingMode', 'rectangle');
                } else {
                    jQuery(croppingBtn.getElement()).data('croppingMode', 'polygon');
                }

                jQuery(croppingBtn.getElement()).on('click', function (event) {
                    var el = jQuery(this);
                    var selectedLayers = me._buildLayerList();

                    // User has not selected any layers
                    if(selectedLayers.length === 0){
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton('OK');
                        btn.addClass('primary');
                        dialog.show(me._getLocalization('no-layers-selected-title'), me._getLocalization('no-layers-selected-message'), [btn]);
                        return false;
                    }
                    // Cropping btn is allready selected
                    if(el.hasClass('selected')) {
                        me.activateNormalGFI(true);
                        me.activateNormalWFSReq(true);
                        jQuery('.cropping-btn').removeClass('selected');
                        me.removeSelectedCroppingLayer();
                        me.removeFeatures();
                        jQuery('.oskari__download-basket-temp-basket').hide();
                        me._toggleBasketHelpVisibility(false);
                        jQuery(this).removeClass('primary');
                        me._toggleDrawControl(false);
                    } else {
                        var toggleLayers = function() {
                            me.removeSelectedCroppingLayer();
                            if(croppingLayer.rect){
                                me._toggleDrawControl(true);
                                me.removeFeatures();
                                me._toggleBasketHelpVisibility(false);
                            } else {
                                me._toggleDrawControl(false);
                                me._sandbox.postRequestByName('AddMapLayerRequest', [croppingLayer.getId()]);
                                me._croppingLayerId = croppingLayer.getId();
                                me._toggleBasketHelpVisibility(true);
                            }
                        };



                        // User has some cropping going on
                        if(jQuery('.oskari__download-basket-temp-basket').is(':visible')){
                            me.confirmCroppingAreaChange(croppingLayer, el, croppingLayer.rect, toggleLayers);
                        } else {
                            jQuery('.oskari__download-basket-cropping-buttons input.cropping-btn').removeClass('primary');
                            jQuery(this).addClass('primary');

                            //Fresh user selection
                            me.activateNormalGFI(false);
                            me.activateNormalWFSReq(false);
                            jQuery('.cropping-btn').removeClass('selected');
                            el.addClass('selected');
                            toggleLayers();
                        }
                    }
                    event.preventDefault();
                });

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
            jQuery(moveToBasketBtn.getElement()).on('click', function() {
                me.addToBasket();
                jQuery('.oskari__download-basket-temp-basket').hide();
                me.removeFeatures();
            });
            moveToBasketBtn.insertTo(me._templates.tempbasket);
            me._templates.tempbasket.find('p').html(me._getLocalization('users-temp-basket'));

            var clearTempBasket = Oskari.clazz.create('Oskari.userinterface.component.Button');
            clearTempBasket.addClass('primary');
            clearTempBasket.setTitle(me._getLocalization('temp-basket-empty'));
            jQuery(clearTempBasket.getElement()).on('click',
                function (event) {
                    jQuery('.oskari__download-basket-temp-basket').hide();
                    me.removeFeatures();
                    event.preventDefault();
                }
            );
            clearTempBasket.insertTo(me._templates.tempbasket);

            me._templates.main.append(me._templates.tempbasket);
            me._templates.tempbasket.hide();
        },

        removeSelectedCroppingLayer: function(){
            var me = this;
            if(me._croppingLayerId) {
                me._sandbox.postRequestByName('RemoveMapLayerRequest', [me._croppingLayerId]);
                me._croppingLayerId = null;
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
         * Gets layers that has attribute cropping
         * @method  @public getCroppingLayers
         * @return {Array} Layers that has attribute cropping: true
         */
        getCroppingLayers: function(){
            var me = this;

            var mapService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var allLayers = mapService.getAllLayers();
            var croppingLayers = allLayers.filter(function(layer){
              var attributes = layer.getAttributes();
              return !!attributes.cropping;
            });

            // Rect cropping mode
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
                },
                getId: function(){
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
        croppingLayersHighlight: function (x, y) {
            var me = this;
            // Not get cropping features when drawing selected
            if (me._drawing) {
                return;
            }
            var mapVO = me._sandbox.getMap();
            var ajaxUrl = me._sandbox.getAjaxUrl();
            var map = me.mapModule.getMap();
            var layerUniqueKey = jQuery('.cropping-btn.selected').data('uniqueKey');
            var layerGeometryColumn = jQuery('.cropping-btn.selected').data('geometryColumn');
            var layerGeometry = jQuery('.cropping-btn.selected').data('geometry');
            var layerName = jQuery('.cropping-btn.selected').data('layerName');
            var layerId = jQuery('.cropping-btn.selected').data('layerId');
            var layerUrl = me.getUrlParams(jQuery('.cropping-btn.selected').data('layerUrl'),'id');
            var layerCroppingMode = jQuery('.cropping-btn.selected').data('croppingMode');
            var layerNameLang = jQuery('.cropping-btn.selected').val();

            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
                data : {
                    layers : layerName,
                    url : layerUrl,
                    x : x,
                    y : y,
                    id : layerId,
                    bbox : mapVO.getBboxAsString(),
                    width : mapVO.getWidth(),
                    height : mapVO.getHeight(),
                    srs : mapVO.getSrsName(),
                },
                success: function (geojson) {
                	var uniqueColumn = null;
                	var layer = me._sandbox.findMapLayerFromAllAvailable(layerId);
                	if(layer.getAttributes().unique) {
                		uniqueColumn = layer.getAttributes().unique;
                	}

                    // check features
                    var tempFeatures = [];
                    geojson.features.forEach(function(feature){
                        var uniqueValue = feature.id;
                        if(uniqueColumn && feature.properties[uniqueColumn]) {
                            uniqueValue = feature.properties[uniqueColumn];
                        }

                        if(me._features[uniqueValue]) {
                            me.removeFeatures('cropid', uniqueValue);
                            me._updateBasketText(me._croppingFeatures.length);
                        } else {
                            me._features[uniqueValue] = true;
                            feature.properties.cropid = uniqueValue;
                            feature.properties.layerName= layerName;
                            feature.properties.layerUrl = layerUrl;
                            feature.properties.uniqueKey = layerUniqueKey;
                            feature.properties.geometryColumn = layerGeometryColumn;
                            feature.properties.geometryName = layerGeometry;
                            feature.properties.croppingMode = layerCroppingMode;
                            feature.properties.layerNameLang = layerNameLang;
                            tempFeatures.push(feature);
                        }
                    });

                    if(tempFeatures.length > 0) {
                        geojson.features = tempFeatures;

                        var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
                        Oskari.getSandbox().postRequestByName(rn, [geojson, {
                            layerId: me.CROPPING_LAYER_ID
                        }]);
                        me.addToTempBasket(geojson.features);
                    }

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
         * Removes features from cropping layer
         * @method  @public removeFeatures
         */
        removeFeatures: function(property, value){
            var me = this;
            me._removeDrawings();
            if(property && value) {
                delete me._features[value];

                var tempCroppingFeatures = [];
                me._croppingFeatures.forEach(function(feature){
                    if(feature.properties[property] !== value) {
                        tempCroppingFeatures.push(feature);
                    }
                });
                me._croppingFeatures = tempCroppingFeatures;
            }
            else {
                me._features = {};
                me._croppingFeatures = [];
            }
        },

        /**
         * Updates basket text
         * @method  _updateBasketText
         * @param   {Integer}          selectedCount selected area count
         * @private
         */
        _updateBasketText: function(selectedCount) {
            var me = this;
            var el =  jQuery('.oskari__download-basket-temp-basket');
            var p = el.find('p');
            if(selectedCount > 0) {
                p.find('strong').text(selectedCount);
                el.show();
                me._toggleBasketHelpVisibility(false);
            } else {
                el.hide();
                me._toggleBasketHelpVisibility(true);
            }
        },

        /**
         * Updates temp basket
         * @method @public addToTempBasket
         * @param {Array} cropping features
         */
        addToTempBasket: function(croppingFeatures) {
            var me = this;
            var el =  jQuery('.oskari__download-basket-temp-basket');
            var p = el.find('p');

            croppingFeatures.forEach(function(feature){
                me._croppingFeatures.push(feature);
            });

            me._updateBasketText(me._croppingFeatures.length);
        },

        _toggleBasketHelpVisibility: function(visible) {
            var el = jQuery('.oskari__download-basket-help');
            if (visible) {
                el.show();
            } else {
                el.hide();
            }
        },

        /**
         * Confirma cropping area selection change
         * @public @method confirmCroppingAreaChange
         * @param  {String} value selected cropping layer values
         * @param  {Object} el    button element
         * @param  {Boolean} drawing  drawing selection
         * @param {Function} action action function
         */
        confirmCroppingAreaChange: function(value, el, drawing, action){
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            btn.addClass('primary');
            btn.setTitle(me._getLocalization('yes'));
            btn.setHandler(function() {
                me.addToBasket();
                jQuery('.cropping-btn').removeClass('selected');
                jQuery('.cropping-btn').removeClass('primary');
                el.addClass('selected');
                el.addClass('primary');
                jQuery('.oskari__download-basket-temp-basket').hide();
                me.removeFeatures();

                if(drawing) {
                    me._toggleDrawControl(true);
                    me._toggleBasketHelpVisibility(false);
                } else {
                    me._toggleDrawControl(false);
                    me.activateNormalGFI(false);
                    me.activateNormalWFSReq(false);
                    me._toggleBasketHelpVisibility(true);
                }
                dialog.close();

                if(typeof action === 'function') {
                    action();
                }
            });

            alertBtn.setTitle(me._getLocalization('no'));
            alertBtn.setHandler(function() {
                jQuery('.cropping-btn').removeClass('selected');
                jQuery('.cropping-btn').removeClass('primary');
                el.addClass('selected');
                el.addClass('primary');
                jQuery('.oskari__download-basket-temp-basket').hide();
                me.removeFeatures();

                if(drawing) {
                    me._toggleDrawControl(true);
                    me._toggleBasketHelpVisibility(false);
                } else {
                    me._toggleDrawControl(false);
                    me.activateNormalGFI(false);
                    me.activateNormalWFSReq(false);
                    me._toggleBasketHelpVisibility(true);
                }
                dialog.close();

                if(typeof action === 'function') {
                    action();
                }
            });

            dialog.show(me._getLocalization('want-to-move-basket'), me._getLocalization('notify-move-to-basket'), [alertBtn, btn]);
            dialog.makeModal();
        },

        _removeDrawings: function() {
            var me = this;
            me._isRemove = true;
            me._sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.DOWNLOAD_BASKET_DRAW_ID, true]);
            me._sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.CROPPING_LAYER_ID]);

            if(me._drawing) {
                me._toggleDrawControl(me._drawing);
            }

        },

        _toggleDrawControl: function (enable) {
            var me = this;
            me._drawing = enable;
            if(enable) {
                var data = [me.DOWNLOAD_BASKET_DRAW_ID, 'Box', { allowMultipleDrawing:true, modifyControl: true }];
                me._sandbox.postRequestByName('DrawTools.StartDrawingRequest', data);
            } else {
                me._sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.DOWNLOAD_BASKET_DRAW_ID, true]);
            }
        },

        handleDrawingEvent: function(event) {
            var me = this;
            if(event.getIsFinished() && !me._isRemove) {
                me._features = {};
                me._croppingFeatures = [];

                // Add cropping mode to feature attributes
                var features = event.getGeoJson().features;
                features.forEach(function(feature) {
                    feature.properties.croppingMode = 'rectangle';
                });
                me.addToTempBasket(event.getGeoJson().features);
            } else if(event.getIsFinished() && me._isRemove) {
                me._isRemove = false;
            }

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
        addToBasket: function(){
            var me = this;
            var selectedLayers = me._buildLayerList();

            // Finds layers that are active and loop cropping areas to them, collect are important values
            selectedLayers.forEach(function(layer) {

                // not allow load cropping layers
                if(layer.getAttributes().cropping !== 'true' && layer.getAttributes().cropping !== true) {

                    me._croppingFeatures.forEach(function(feature){

                    	var basketObject = {};
                        basketObject.layerNameLang = layer.getName();
                        basketObject.layerName = layer.getLayerName();
                        basketObject.layerUrl = me.getUrlParams(layer.getLayerUrl(),'id');
                        basketObject.feature = feature;

                        me.basket.addToBasket(basketObject);
                    });

                }
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
