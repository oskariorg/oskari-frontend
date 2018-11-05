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
        this._drawing = false;
        this.CROPPING_LAYER_ID = 'download-basket-cropping-layer';
        this.DOWNLOAD_BASKET_DRAW_ID = 'download-basket-drawing';
    },{
        /**
         * Creates UI for cropping tab
         * @method createUI
         */
        createUI: function(){
             this.setContent(this.createUi());
        },
        /**
         * Init templates, creates ui for cropping items
         * @method _initTemplates
         * @private
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
                        me._toggleGFIAndWFSHighlight(true);
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
                            me._toggleGFIAndWFSHighlight(false);
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

        /**
         * Removes selected cropping layer
         * @method removeSelectedCroppingLayer
         * @public
         */
        removeSelectedCroppingLayer: function(){
            var me = this;
            if(me._croppingLayerId) {
                me._sandbox.postRequestByName('RemoveMapLayerRequest', [me._croppingLayerId]);
                me._croppingLayerId = null;
            }
        },

        /**
         * Toggle GFI and WFS hightlight requests
         * @method _toggleGFIAndWFSHighlight
         * @public
         * @param  {Boolean}          enabled has enabled?
         */
        _toggleGFIAndWFSHighlight: function(enabled){
            this._sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [enabled]);
            this._sandbox.postRequestByName('WfsLayerPlugin.ActivateHighlightRequest', [enabled]);
        },

        /**
         * Gets layers that has attribute cropping
         * @method getCroppingLayers
         * @public
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
                    return '';
                },
                getLayerUrl: function(){
                    return '';
                },
                getAttributes: function(){
                    return '';
                },
                getId: function(){
                    return '';
                }
            };

            croppingLayers.push(regular);

            return croppingLayers;
        },

        /**
         * Highlight selected cropping feature
         * @method croppingLayersHighlight
         * @public
         * @param  {Double}                x x-coordinate
         * @param  {Double}                y y-coordinate
         */
        croppingLayersHighlight: function (x, y) {
            var me = this;

            // Not get cropping features when drawing selected or not any cropping selected
            if (me._drawing || !me.container.find('.cropping-btn').hasClass('selected')) {
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
            var layerCroppingMode = jQuery('.cropping-btn.selected').data('croppingMode');
            var layerNameLang = jQuery('.cropping-btn.selected').val();

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
                data : {
                    layers : layerName,
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
                            feature.properties.layerId = layerId;
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

        /**
         * Opens popup
         * @method  _openPopup
         * @param   {String}   title   title
         * @param   {String}   message message
         * @private
         */
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
         * @method removeFeatures
         * @public
         */
        removeFeatures: function(property, value){
            var me = this;
            me._removeDrawings(property, value);
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
         * @method addToTempBasket
         * @public
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

        /**
         * Toggle basket help visibility
         * @method  _toggleBasketHelpVisibility
         * @param   {Boolean}                    visible is visible or not?
         * @private
         */
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
                    me._toggleGFIAndWFSHighlight(false);
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
                    me._toggleGFIAndWFSHighlight(false);
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

        /**
         * Remove drawings
         * @method  _removeDrawings
         * @param   {String}        property identifier property
         * @param   {String}        value    identifier value
         * @private
         */
        _removeDrawings: function(property, value) {
            var me = this;
            me._isRemove = true;
            me._sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.DOWNLOAD_BASKET_DRAW_ID, true]);
            me._sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [property, value, me.CROPPING_LAYER_ID]);

            if(me._drawing) {
                me._toggleDrawControl(me._drawing);
            }

        },

        /**
         * Toggle draw control
         * @method  _toggleDrawControl
         * @param   {Boolean}           enable is enabled or not?
         * @private
         */
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

        /**
         * Handle drawing events
         * @method handleDrawingEvent
         * @param  {Oskari.mapping.drawtools.event.DrawingEvent}           event drawing event
         */
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
         * Gets localization
         * @method _getLocalization
         * @private
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },

        /**
         * Gets error text
         * @method  _getErrorText
         * @param   {Object}      jqXHR       jqxhr
         * @param   {String}      textStatus  status text
         * @param   {Object}      errorThrown error
         * @return  {String}                  error text
         * @private
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
         * Creates the UI for a fresh start
         * @method createUi
         * @public
         */
        createUi: function () {
            var me = this;
            me._initTemplates();
            me.container = me._templates.main.clone(true);
            return me.container;
        },

        /**
         * Set basket
         * @method setBasket
         * @param  {Oskari.mapframework.bundle.downloadBasket.Basket}  basket basket
         */
        setBasket: function(basket){
            var me = this;
            me.basket = basket;
        },

        /**
         * Collects all needed information for basket object
         * @method addToBasket
         * @public
         */
        addToBasket: function(){
            var me = this;
            var selectedLayers = me._buildLayerList();

            // Finds layers that are active and loop cropping areas to them, collect are important values
            selectedLayers.forEach(function(layer) {

                // not allow load cropping layers
                if(layer.getAttributes().cropping !== 'true' && layer.getAttributes().cropping !== true) {

                    me._croppingFeatures.forEach(function(feature){

                    	var basketObject = {
                            layerNameLang: layer.getName(),
                            layerName: layer.getLayerName(),
                            layerId: layer.getId(),
                            feature: feature
                        };

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

       /**
        * Builds layerlist
        * @method  _buildLayerList
        * @return  {Array}   layer ids array
        * @private
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
