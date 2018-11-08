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
        this.setTitle(localization.title);
        this.mapModule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
        this.state = {};
        this.basket = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket-cropping"></div>'),
            buttons: jQuery('<div class="oskari__download-basket-cropping-buttons"><p></p></div>'),
            help: jQuery('<div class="oskari__download-basket-help"><p></p></div>'),
            tempBasket: jQuery('<div class="oskari__download-basket-temp-basket"><p></p></div>')
        };

        this.croppingLayerId = null;
        this._features = {};
        this._croppingFeatures = [];
        this._drawing = false;
        this.CROPPING_LAYER_ID = 'download-basket-cropping-layer';
        this.DOWNLOAD_BASKET_DRAW_ID = 'download-basket-drawing';
    }, {
        /**
         * Creates Ui for cropping tab
         * @method createUi
         */
        createUi: function () {
            var me = this;

            var main = me._templates.main.clone();
            var buttons = me._templates.buttons.clone();

            // Loop cropping layers and create cropping buttons
            me.getCroppingLayers().forEach(function (croppingLayer) {
                // Initialize cropping btns
                var croppingBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                croppingBtn.addClass('cropping-btn');
                croppingBtn.setTitle(croppingLayer.getName());

                var croppingBtnEl = jQuery(croppingBtn.getElement());

                croppingBtnEl.data('layerId', croppingLayer.getId());
                croppingBtnEl.data('layerName', croppingLayer.getLayerName());

                var layerAttributes = croppingLayer.getAttributes();
                if (layerAttributes.unique !== null) {
                    croppingBtnEl.data('uniqueKey', layerAttributes.unique);
                    croppingBtnEl.data('geometryColumn', layerAttributes.geometryColumn);
                    croppingBtnEl.data('geometry', layerAttributes.geometry);
                }

                if (croppingLayer.rect) {
                    croppingBtnEl.data('croppingMode', 'rectangle');
                } else {
                    croppingBtnEl.data('croppingMode', 'polygon');
                }

                croppingBtn.setHandler(function () {
                    var selectedLayers = me._buildLayerList();

                    // User has not selected any layers
                    if (selectedLayers.length === 0) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                            btn = dialog.createCloseButton('OK');
                        btn.addClass('primary');
                        dialog.show(me._getLocalization('no-layers-selected-title'), me._getLocalization('no-layers-selected-message'), [btn]);
                        return false;
                    }
                    // Cropping btn is allready selected
                    if (croppingBtnEl.hasClass('selected')) {
                        me._toggleGFIAndWFSHighlight(true);
                        me.container.find('.cropping-btn').removeClass('selected');
                        me.removeSelectedCroppingLayer();
                        me.removeFeatures();
                        me._updateBasketText(0);
                        croppingBtnEl.removeClass('primary');
                        me._toggleDrawControl(false, false);
                    } else {
                        var toggleLayers = function () {
                            me.removeSelectedCroppingLayer();
                            if (croppingLayer.rect) {
                                me._toggleDrawControl(true);
                                me.removeFeatures();
                            } else {
                                me._toggleDrawControl(false);
                                me._sandbox.postRequestByName('AddMapLayerRequest', [croppingLayer.getId()]);
                                me._croppingLayerId = croppingLayer.getId();
                            }
                        };

                        // User has some cropping going on
                        if (me.container.find('.oskari__download-basket-temp-basket').is(':visible')) {
                            me.confirmCroppingAreaChange(croppingLayer, croppingBtnEl, croppingLayer.rect, toggleLayers);
                        } else {
                            me.container.find('.oskari__download-basket-cropping-buttons input.cropping-btn').removeClass('primary');
                            croppingBtnEl.addClass('primary');

                            // Fresh user selection
                            me._toggleGFIAndWFSHighlight(false);
                            me.container.find('.cropping-btn').removeClass('selected');
                            croppingBtnEl.addClass('selected');
                            toggleLayers();
                        }
                    }
                });

                croppingBtn.insertTo(buttons);
            });

            buttons.find('p').text(me._getLocalization('choose-cropping-mode'));
            main.append(buttons);

            // Help text
            var help = me._templates.help.clone();
            help.find('p').text(me._getLocalization('choose-wanted-areas-from-map'));
            help.hide();
            main.append(help);

            // Create Temp basket
            var tempBasket = me._templates.tempBasket.clone();
            var clearTempBasketBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            clearTempBasketBtn.addClass('approve');
            clearTempBasketBtn.setTitle(me._getLocalization('temp-basket-empty'));
            clearTempBasketBtn.setHandler(function () {
                me._updateBasketText(0);
                me.removeFeatures();
            });
            clearTempBasketBtn.insertTo(tempBasket);

            var moveToBasketBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            moveToBasketBtn.addClass('primary');
            moveToBasketBtn.setTitle(me._getLocalization('move-to-basket'));

            moveToBasketBtn.setHandler(function () {
                me.addToBasket();
                me._updateBasketText(0);
                me.removeFeatures();
            });
            moveToBasketBtn.insertTo(tempBasket);
            tempBasket.find('p').html(me._getLocalization('users-temp-basket'));
            tempBasket.hide();
            main.append(tempBasket);

            me.container = main;
            this.setContent(me.container);
        },

        /**
         * Removes selected cropping layer
         * @method removeSelectedCroppingLayer
         * @public
         */
        removeSelectedCroppingLayer: function () {
            var me = this;
            if (me._croppingLayerId) {
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
        _toggleGFIAndWFSHighlight: function (enabled) {
            this._sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [enabled]);
            this._sandbox.postRequestByName('WfsLayerPlugin.ActivateHighlightRequest', [enabled]);
        },

        /**
         * Gets layers that has attribute cropping
         * @method getCroppingLayers
         * @public
         * @return {Array} Layers that has attribute cropping: true
         */
        getCroppingLayers: function () {
            var me = this;

            var mapService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var allLayers = mapService.getAllLayers();

            var croppingLayers = allLayers.filter(function (layer) {
                var attributes = layer.getAttributes();
                return !!attributes.cropping;
            });

            // sort cropping layers
            croppingLayers.sort(function (a, b) {
                return Oskari.util.naturalSort(a.getName(), b.getName());
            });

            // regular draw cropping mode
            var regular = {
                name: me._getLocalization('rect-cropping'),
                rect: true,
                getName: function () {
                    return this.name;
                },
                getLayerName: function () {
                    return '';
                },
                getLayerUrl: function () {
                    return '';
                },
                getAttributes: function () {
                    return '';
                },
                getId: function () {
                    return '';
                }
            };

            // regular draw is always latest
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
            var layerUniqueKey = me.container.find('.cropping-btn.selected').data('uniqueKey');
            var layerGeometryColumn = me.container.find('.cropping-btn.selected').data('geometryColumn');
            var layerGeometry = me.container.find('.cropping-btn.selected').data('geometry');
            var layerName = me.container.find('.cropping-btn.selected').data('layerName');
            var layerId = me.container.find('.cropping-btn.selected').data('layerId');
            var layerCroppingMode = me.container.find('.cropping-btn.selected').data('croppingMode');
            var layerNameLang = me.container.find('.cropping-btn.selected').val();

            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
                data: {
                    layers: layerName,
                    x: x,
                    y: y,
                    id: layerId,
                    bbox: mapVO.getBboxAsString(),
                    width: mapVO.getWidth(),
                    height: mapVO.getHeight(),
                    srs: mapVO.getSrsName()
                },
                success: function (geojson) {
                	var uniqueColumn = null;
                	var layer = me._sandbox.findMapLayerFromAllAvailable(layerId);
                	if (layer.getAttributes().unique) {
                		uniqueColumn = layer.getAttributes().unique;
                	}

                    // check features
                    var tempFeatures = [];
                    geojson.features.forEach(function (feature) {
                        var uniqueValue = feature.id;
                        if (uniqueColumn && feature.properties[uniqueColumn]) {
                            uniqueValue = feature.properties[uniqueColumn];
                        }

                        if (me._features[uniqueValue]) {
                            me.removeFeatures('cropid', uniqueValue);
                            me._updateBasketText(me._croppingFeatures.length);
                        } else {
                            me._features[uniqueValue] = true;
                            feature.properties.cropid = uniqueValue;
                            feature.properties.layerName = layerName;
                            feature.properties.layerId = layerId;
                            feature.properties.uniqueKey = layerUniqueKey;
                            feature.properties.geometryColumn = layerGeometryColumn;
                            feature.properties.geometryName = layerGeometry;
                            feature.properties.croppingMode = layerCroppingMode;
                            feature.properties.layerNameLang = layerNameLang;
                            tempFeatures.push(feature);
                        }
                    });

                    if (tempFeatures.length > 0) {
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
        _openPopup: function (title, message) {
            var me = this;
            if (me._popup) {
                me._popup.close(true);
            } else {
                me._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._popup.show(title, message);
            me._popup.fadeout();
        },

        /**
         * Removes features from cropping layer
         * @method removeFeatures
         * @public
         */
        removeFeatures: function (property, value) {
            var me = this;
            me._removeDrawings(property, value);
            if (property && value) {
                delete me._features[value];

                var tempCroppingFeatures = [];
                me._croppingFeatures.forEach(function (feature) {
                    if (feature.properties[property] !== value) {
                        tempCroppingFeatures.push(feature);
                    }
                });
                me._croppingFeatures = tempCroppingFeatures;
            } else {
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
        _updateBasketText: function (selectedCount) {
            var me = this;
            var el = me.container.find('.oskari__download-basket-temp-basket');
            var p = el.find('p');
            if (selectedCount > 0) {
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
        addToTempBasket: function (croppingFeatures) {
            var me = this;

            croppingFeatures.forEach(function (feature) {
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
        _toggleBasketHelpVisibility: function (visible) {
            var el = this.container.find('.oskari__download-basket-help');
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
         * @param  {Object} croppingButton    button jQuery element
         * @param  {Boolean} drawing  drawing selection
         * @param {Function} action action function
         */
        confirmCroppingAreaChange: function (value, croppingButton, drawing, action) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                alertBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            btn.addClass('primary');
            btn.setTitle(me._getLocalization('yes'));
            btn.setHandler(function () {
                me.addToBasket();
                me.container.find('.cropping-btn').removeClass('selected');
                me.container.find('.cropping-btn').removeClass('primary');
                croppingButton.addClass('selected');
                croppingButton.addClass('primary');
                me._updateBasketText(0);
                me.removeFeatures();

                if (drawing) {
                    me._toggleDrawControl(true);
                } else {
                    me._toggleDrawControl(false);
                    me._toggleGFIAndWFSHighlight(false);
                }
                dialog.close();

                if (typeof action === 'function') {
                    action();
                }
            });

            alertBtn.setTitle(me._getLocalization('no'));
            alertBtn.setHandler(function () {
                me.container.find('.cropping-btn').removeClass('selected');
                me.container.find('.cropping-btn').removeClass('primary');
                croppingButton.addClass('selected');
                croppingButton.addClass('primary');
                me._updateBasketText(0);
                me.removeFeatures();

                if (drawing) {
                    me._toggleDrawControl(true);
                } else {
                    me._toggleDrawControl(false);
                    me._toggleGFIAndWFSHighlight(false);
                }
                dialog.close();

                if (typeof action === 'function') {
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
        _removeDrawings: function (property, value) {
            var me = this;
            me._isRemove = true;
            me._sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.DOWNLOAD_BASKET_DRAW_ID, true]);
            me._sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [property, value, me.CROPPING_LAYER_ID]);

            if (me._drawing) {
                me._toggleDrawControl(me._drawing);
            }
        },

        /**
         * Toggle draw control
         * @method  _toggleDrawControl
         * @param   {Boolean}           enable is enabled or not?
         * @param   {Boolean}           helpVisibility not change help visibility
         * @private
         */
        _toggleDrawControl: function (enable, helpVisibility) {
            var me = this;
            me._drawing = enable;
            var helpVisible = (typeof helpVisibility !== 'undefined') ? helpVisibility : !enable;
            if (enable) {
                var data = [me.DOWNLOAD_BASKET_DRAW_ID, 'Box', { allowMultipleDrawing: true, modifyControl: false }];
                me._sandbox.postRequestByName('DrawTools.StartDrawingRequest', data);
            } else {
                me._sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.DOWNLOAD_BASKET_DRAW_ID, true]);
            }
            me._toggleBasketHelpVisibility(helpVisible);
        },

        /**
         * Handle drawing events
         * @method handleDrawingEvent
         * @param  {Oskari.mapping.drawtools.event.DrawingEvent}           event drawing event
         */
        handleDrawingEvent: function (event) {
            var me = this;
            if (event.getIsFinished() && !me._isRemove) {
                me._features = {};
                me._croppingFeatures = [];

                // Add cropping mode to feature attributes
                var features = event.getGeoJson().features;
                features.forEach(function (feature) {
                    feature.properties.croppingMode = 'rectangle';
                });
                me.addToTempBasket(event.getGeoJson().features);
            } else if (event.getIsFinished() && me._isRemove) {
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
         * Set basket
         * @method setBasket
         * @param  {Oskari.mapframework.bundle.downloadBasket.Basket}  basket basket
         */
        setBasket: function (basket) {
            var me = this;
            me.basket = basket;
        },

        /**
         * Collects all needed information for basket object
         * @method addToBasket
         * @public
         */
        addToBasket: function () {
            var me = this;
            var selectedLayers = me._buildLayerList();

            // Finds layers that are active and loop cropping areas to them, collect are important values
            selectedLayers.forEach(function (layer) {
                // not allow load cropping layers
                if (layer.getAttributes().cropping !== 'true' && layer.getAttributes().cropping !== true) {
                    me._croppingFeatures.forEach(function (feature) {
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
        * Builds layerlist
        * @method  _buildLayerList
        * @return  {Array}   layer ids array
        * @private
        */
        _buildLayerList: function () {
            var me = this;
            var selected = me._sandbox.findAllSelectedMapLayers();
            var layerIds = [];

            var mapScale = me._sandbox.getMap().getScale();

            for (var i = 0; i < selected.length; i++) {
                var layer = selected[i];
                var attributes = layer.getAttributes();

                if (!layer.isInScale(mapScale)) {
                    continue;
                }
                if (!layer.isVisible()) {
                    continue;
                }
                if (layer._type == 'BASE_LAYER') {
                    continue;
                }

                if (layer._layerType == 'WMTS') {
                    continue;
                }
                if (attributes.basemap) {
                    continue;
                }
                if (attributes.raster) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton('OK');
                    btn.addClass('primary');
                    dialog.show(me._getLocalization('basket-raster-problem-title'),
                        layer.getName() + ' ' + me._getLocalization('basket-raster-problem'), [btn]);
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
