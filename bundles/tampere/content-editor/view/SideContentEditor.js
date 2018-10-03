import olFormatWKT from 'ol/format/WKT';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import * as olProj from 'ol/proj';

/**
 * @class Oskari.tampere.bundle.content-editor.view.SideContentEditor
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.view.SideContentEditor',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param {string} layerId
     */
    function (instance, localization, layerId) {
        var me = this;
        me.layerId = layerId;
        me.layerGeometries = null;
        me.layerGeometryType = null;
        me.sandbox = instance.sandbox;
        me.instance = instance;
        me.loc = localization;
        me.templates = {
                wrapper: '<div></div>',
                getinfoResultTable: '<table class="getinforesult_table"></table>',
                tableRow: '<tr></tr>',
                tableCell: '<td></td>',
                tableInput: '<input />',
                header: '<div class="getinforesult_header"><div class="icon-bubble-left"></div>',
                headerTitle: '<div class="getinforesult_header_title"></div>',
                linkOutside: '<a target="_blank"></a>',
                templateGuide: jQuery('<div><div class="guide"></div>' +
                    '<div class="buttons">' +
                    '<div class="cancel button"></div>' +
                    '<div class="finish button"></div>' +
                    '</div>' +
                    '</div>'),
                templateHelper: jQuery(
                    '<div class="drawHelper">' +
                    '<div class="infoText"></div>' +
                    '<div class="measurementResult"></div>' +
                    '</div>'
                ),
                deleteDialog: jQuery('<div id="delete-dialog">' +
                    '<div>' + me.loc.deleteGeometryDialog.text + '</div>' +
                '</div>')
        };
        me.template = jQuery(
            '<div class="content-editor">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div>');
        me.allVisibleLayers = [];
        me.allLayers = null;
        me.mainPanel = null;
        me.isLayerVisible = true;
        me.mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        me.selectedLayerId = null;
        me.drawPlugin = null;
        me.operationMode = null;
        me.drawToolType = null;
        me.clickCoords = null;
        me.drawingActive = false;
        me.currentEditFeatureFid = null;
        me.allClickedFeatures = [];
        me.fieldsTypes = [];
        me.featureDuringEdit = false;
        me.processGFIRequest = true;
        me.GFIFirstRequestProcessed = false;
        me.highlightFeaturesIds = [];
        me.defaultClickDistanceThreshold = 0.05;
    }, {
        __name: 'ContentEditor',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
    	showMessage: function(title, content, buttons, isModal) {
            this.closeDialog();
            this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this._dialog.show(title, content, buttons);
            if (isModal) {
                this._dialog.makeModal();
            }
        },
        /**
         * Closes the message dialog if one is open
         */
        closeDialog : function() {
            if(this._dialog) {
                this._dialog.close(true);
                this._dialog = null;
            }
        },
        startNewDrawing: function () {
            this.sendDrawRequest();
        },
        /**
         * @method startNewDrawing
         * Sends a StartDrawingRequest with given params. Changes the panel controls to match the application state (new/edit)
         */
        sendDrawRequest: function () {
            var me = this;
            var geometry = null;
            for(var i = 0; i < me.allClickedFeatures.length; ++i) {
                if(me.allClickedFeatures[i].fid === me.currentEditFeatureFid) {
                    geometry = me.allClickedFeatures[i].geometry;
                }
            }
            if(geometry != null) {
                var format = new olFormatGeoJSON();
                var geomAsGeoJSON = format.writeGeometry(geometry);
                if (me.getDrawToolsGeometryType().indexOf("Multi") > -1) {
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                        allowMultipleDrawing: 'multiGeom'
                        ,geojson: geomAsGeoJSON
                    }]);
                } else {
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                        allowMultipleDrawing: 'single'
                        ,geojson: geomAsGeoJSON
                    }]);
                }
            } else {
                me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                    allowMultipleDrawing: true
                }]);
            }
        },
        /**
         * Returns the correct draw tools geometry type ie. replaces multigeometries with single geometries.
         * @return {[type]} [description]
         */
        getDrawToolsGeometryType: function() {
            var me = this;
            return me.layerGeometryType.replace('Multi', '');
        },

        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        sendStopDrawRequest: function (isCancel) {
            var me = this;
            me.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.instance.getName(), true, true]);
        },
        setGeometryType: function (geometryType) {
            this._parseLayerGeometryResponse(geometryType);
        },
        ParseWFSFeatureGeometries: function(evt) {
            var processGeometry = false;
            for (var i = 0; i < this.allVisibleLayers.length; i++) {
                if (this.allVisibleLayers[i].getId() == evt.getMapLayer().getId()) {
                    processGeometry = true;
                    break;
                }
            }

            if (processGeometry) {
                var clickedGeometries = evt.getGeometries();
                if (clickedGeometries.length > 0) {
                    for (var i = 0; i < clickedGeometries.length; i++) {
                        this.parseFeatureFromClickedFeature(clickedGeometries[i]);
                    }
                }
            }
        },
        /**
         * @method parseFeatureFromClickedFeature
         */
        parseFeatureFromClickedFeature: function(clickedGeometry) {
            this._addClickedFeature(clickedGeometry);
        },
        _findGeometryByFid: function (fid) {
            for (var i = 0; i < this.allClickedFeatures.length; i++) {
                if (this.allClickedFeatures[i].fid == fid) {
                    return this.allClickedFeatures[i];
                }
            }
            //did not find from own clicked features, try searching wfs layer
            return this._findGeometryByFidFromLayer(fid);
        },
        _findGeometryByFidFromLayer: function (fid) {
            var layer = this.sandbox.findMapLayerFromSelectedMapLayers(this.selectedLayerId);
            var geometries = layer.getClickedGeometries();
            var wkt = new olFormatWKT();
            for(var j = 0; j < geometries.length; j++) {
                if(geometries[j][0] === fid) {
                    return {fid: fid, geometry: wkt.readGeometry(geometries[j][1])};
                }
            }
            return null;
        },
        _addClickedFeature: function (clickedFeature) {
            var me = this;
            var wkt = new olFormatWKT();
            var geometry = wkt.readGeometry(clickedFeature[1]);
            if (me.allClickedFeatures.length > 0) {
                var isNewFeature = true;
                for (var i = 0; i < me.allClickedFeatures.length; i++) {
                    if (me.allClickedFeatures[i].fid == clickedFeature[0]) {
                        isNewFeature = false;
                        me.allClickedFeatures[i].geometry = geometry;
                    }
                }
                if (isNewFeature == true) {
                    me.allClickedFeatures.push({fid: clickedFeature[0], geometry: geometry});
                }
            } else {
                me.allClickedFeatures.push({fid: clickedFeature[0], geometry: geometry});
            }
        },
        _addNewFeature: function () {
            var me = this;
            if (me.selectedLayerId) {
               me._highlighGeometries([], me._getLayerById(me.selectedLayerId), true);
            }
            me.getLayerGeometryType();
            me.sendStopDrawRequest(true);
            var layer = me._getLayerById(me.layerId);
            var fields = layer.getFields().slice();
            var featureData = [[]];
            for (var i = 0; i < fields.length; i++)
            {
                featureData[0].push("");
            }
            me._handleInfoResult({layerId:me.layerId, features: featureData }, "create");
        },
        _editFeature: function (fid) {
            var me = this;
            me._handleInfoResult(me.currentData,"edit", fid);

            var geometry = me._findGeometryByFid(fid);
            if (geometry != null) {
                me.layerGeometries = geometry;
            }
            me.setGeometryType(me.layerGeometries.geometry.getType());
            me._addDrawTools();
            me.currentEditFeatureFid = fid;
        },
        _showAddUnsavedInfoModal: function () {
            var me = this;
            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle(me.loc.buttons.save);
            saveButton.setPrimary(true);
            saveButton.setHandler(function () {
                me.closeDialog();
                me._saveFeature();
                me._addNewFeature();
            });
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.closeDialog();
                me._addNewFeature();
            });
            me.showMessage(me.loc.unsavedChanges.title, me.loc.unsavedChanges.text, [saveButton, cancelButton], true);
        },
        _showEditUnsavedInfoModal: function (fid) {
            var me = this;
            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle(me.loc.buttons.save);
            saveButton.setPrimary(true);
            saveButton.setHandler(function () {
                me.closeDialog();
                me._saveFeature();
                me._editFeature(fid);
            });
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.closeDialog();
                me._editFeature(fid);
            });
            me.showMessage(me.loc.unsavedChanges.title, me.loc.unsavedChanges.text, [saveButton, cancelButton], true);
        },
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = me.template.clone();
            me.allLayers = me.sandbox.findAllSelectedMapLayers();
            me.getLayerGeometryType();
            me.getFieldsTypes();
            me.mainPanel = content;
            var mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');

            container.append(content);
            container.find('.icon-close').on('click', function(){
                me.sendStopDrawRequest(true);
            	me.instance.setEditorMode(false);
            });

            content.find('div.header h3').append(me.loc.title);

            content.find('.content').append(jQuery("<div>" + me.loc.featureModifyInfo + "</div>"));
            content.find('.content').append(jQuery("<div>" + me.loc.toolInfo + "</div>"));
            content.find('.content').append(jQuery("<div>" + me.loc.geometryModifyInfo + "</div>"));
            content.find('.content').append(jQuery("<div>" + me.loc.geometryDeleteInfo + "</div>"));
            var addFeatureButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addFeatureButton.setTitle(me.loc.buttons.addFeature);
            addFeatureButton.setHandler(function () {
                if (me.featureDuringEdit) {
                    me.featureDuringEdit = false;
                    me._showAddUnsavedInfoModal();
                } else {
                    me._addNewFeature();
                }
            });
            var addFeatureButtonContainer = jQuery("<div />");

            addFeatureButton.insertTo(addFeatureButtonContainer);
            content.find('.content').append(addFeatureButtonContainer);
            me._addDrawTools(content);

            content.find('.content').append(jQuery("<div />").addClass("properties-container"));

            if (!me._checkLayerVisibility(me.layerId)) {
            	me.isLayerVisible = false;
            	me._setLayerVisibility(me.layerId, true);
            }
            me._hideLayers();
            me._disableGFI();
        },
        getLayerGeometryType: function () {
            var me = this;
            jQuery.ajax({
                type : 'GET',
                data : {'layer_id':me.layerId},
                dataType : 'text',
                url : Oskari.urls.getRoute('GetWFSLayerGeometryType'),
                success : function(response) {
                    me._parseLayerGeometryResponse(response);
                    me._addDrawTools();
                }
            });
        },
        getFieldsTypes: function () {
            var me = this;
            jQuery.ajax({
                type : 'GET',
                url : Oskari.urls.getRoute('GetWFSDescribeFeature') + '&layer_id=' + me.layerId,
                success : function(response) {
                    me.fieldsTypes = response.propertyTypes;
                }
            });
        },
        _fillLayerGeometries: function(geometries) {
            if (this.layerGeometries != null && this.layerGeometries.geometry != null) {
                var layerGeometries = JSON.parse(new olFormatGeoJSON().writeGeometry(this.layerGeometries.geometry));
                if (layerGeometries != null) {
                    if (layerGeometries.type == "Point") {
                        geometries.type = "point";
                        if (this.drawToolType != "edit" || i != this.clickedGeometryNumber) {
                            geometries.data.push({x: layerGeometries.coordinates[0], y: layerGeometries.coordinates[1]});
                        }
                    } else if (layerGeometries.type == "MultiPoint") {
                        geometries.type = "multipoint";
                        for (var i = 0; i < layerGeometries.coordinates.length; i++) {
                            if (this.drawToolType != "edit" || i != this.clickedGeometryNumber) {
                                geometries.data.push({x: layerGeometries.coordinates[i][0], y: layerGeometries.coordinates[i][1]});
                            }
                        }
                    } else if (layerGeometries.type == "MultiLineString") {
                        geometries.type = "multilinestring";
                        for (var i = 0; i < layerGeometries.coordinates.length; i++) {
                            if (this.drawToolType != "edit" || i != this.clickedGeometryNumber) {
                                var tmpLineString = [];
                                for (var j = 0; j < layerGeometries.coordinates[i].length; j++) {
                                    tmpLineString.push({x: layerGeometries.coordinates[i][j][0], y: layerGeometries.coordinates[i][j][1]});
                                }
                                geometries.data.push(tmpLineString);
                            }
                        }
                    } else if (layerGeometries.type == "MultiPolygon") {
                        geometries.type = "multipolygon";
                        for (var i = 0; i < layerGeometries.coordinates.length; i++) {
                            if (this.drawToolType != "edit" || i != this.clickedGeometryNumber) {
                                var tmpPolygon = [];
                                for (var j = 0; j < layerGeometries.coordinates[i].length; j++) {
                                    var tmpLineString = [];
                                    for (var k = 0; k < layerGeometries.coordinates[i][j].length; k++) {
                                        tmpLineString.push({x: layerGeometries.coordinates[i][j][k][0], y: layerGeometries.coordinates[i][j][k][1]});
                                    }
                                    tmpPolygon.push(tmpLineString);
                                }
                                geometries.data.push(tmpPolygon);
                            }
                        }
                    }
                }
            }
        },
        sendRequest: function (requestData, deleteFeature) {
            var me = this,
                okButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                url = null,
                wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            okButton.setTitle(me.loc.buttons.ok);
            if (me.operationMode === "create") {
                url =  Oskari.urls.getRoute('InsertFeature');
            } else {
                url =  Oskari.urls.getRoute('SaveFeature');
            }
            var dialog = {};
            if (deleteFeature == true) {
                dialog.header = me.loc.geometryDelete.header;
                dialog.success = me.loc.geometryDelete.success;
                dialog.error = me.loc.geometryDelete.error;
            } else {
                dialog.header = me.loc.featureUpdate.header;
                dialog.success = me.loc.featureUpdate.success;
                dialog.error = me.loc.featureUpdate.error;
            }
            jQuery.ajax({
                type : 'POST',
                data : {'featureData':JSON.stringify(requestData)},
                url : url,
                success : function(response) {
                    if (me.operationMode === "create") {
                        me.currentData.features[0][0] = response.fid;
                    }

                    me._clearFeaturesList();
                    var layer = me._getLayerById(me.layerId);
                    me._highlighGeometries([], layer, true);
                    wfsLayerPlugin.deleteTileCache(me.layerId, layer.getCurrentStyle().getName());
                    // wfsLayerPlugin.refreshLayer(me.layerId);
                    var evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                    me.sandbox.notifyAll(evt);
                    me.sendStopDrawRequest(true);

                    okButton.setHandler(function () {
                        setTimeout(function() {
                            var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                                request = visibilityRequestBuilder(me.layerId, true);
                            me.sandbox.request(me.instance.getName(), request);
                        }, 500);
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.success, [okButton]);
                    me.clickedGeometryNumber = null;
                },
                error: function (error) {
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.error, [okButton]);
                    me.sendStopDrawRequest(true);
                }
            });
        },
        /**
         * Clones the geometries drawn for the request formed for backend.
         * @param  {Object} requestData the request data for backend
         * @param  {Object} geometries the OL geometries drawn.
         */
        _cloneGeometries: function(requestData, geometries) {
            var me = this;
            if(geometries.type === 'FeatureCollection') {
                geometries.features.forEach(function(value){
                    if(value.geometry.type === 'MultiPoint') {
                        requestData.geometries.type = "multipoint";
                        for(var j = 0; j < value.geometry.coordinates.length; ++j) {
                            //Check that the edited feature does not get saved again.
                            if(j!=me.clickedGeometryNumber) {
                                requestData.geometries.data.push({x: value.geometry.coordinates[j][0], y: value.geometry.coordinates[j][1]});
                            }
                        }
                    } else if(value.geometry.type === 'LineString') {
                        requestData.geometries.type = "multilinestring";
                        var tmpLineString = [];
                        for (var j = 0; j < value.geometry.coordinates.length; ++j) {
                            tmpLineString.push({x: value.geometry.coordinates[j][0], y: value.geometry.coordinates[j][1]});
                        }
                        requestData.geometries.data.push(tmpLineString);
                    } else if(value.geometry.type === 'Polygon') {
                        requestData.geometries.type = "multipolygon";
                        var coordinatesMultiPolygon = value.geometry.coordinates;
                        var tmpPolygon = [];
                        for (var j = 0; j < coordinatesMultiPolygon.length; ++j) {
                            var coordinatesPolygon = coordinatesMultiPolygon[j];
                            var tmpLinearString = [];
                            for(var k = 0; k < coordinatesPolygon.length; ++k) {
                                tmpLinearString.push({x: coordinatesPolygon[k][0], y: coordinatesPolygon[k][1]});
                            }
                            tmpPolygon.push(tmpLinearString);
                        }
                        requestData.geometries.data.push(tmpPolygon);
                    }
                });
            }
        },
        prepareRequest: function (geometries, deleteFeature) {
            var me = this;
            var requestData = {};
            requestData.featureFields = [];
            if (deleteFeature != true) {
                var featureData = me._getFeatureData();
                featureData.splice(0, 1);
                requestData.featureFields = featureData;
            }

            requestData.featureId = (me.operationMode == "edit" && me._getFeatureData().length > 0 ? me._getFeatureData()[0].value : null);
            requestData.layerId = me.selectedLayerId;
            requestData.srsName = this.sandbox.getMap().getSrsName();
            requestData.geometries = {};
            requestData.geometries.data = [];
            if (me.operationMode == "edit" || deleteFeature == true) {
                me._fillLayerGeometries(requestData.geometries, geometries);
            }
            if (geometries != null) {
                me._cloneGeometries(requestData, geometries);
            }
            me.sendRequest(requestData, deleteFeature);
        },
        /**
         * @method destroy
         * Destroys/removes this view from the screen.
         *
         *
         */
        destroy: function () {
        	var me = this;
        	me._showLayers();

        	var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(true);
            me.sandbox.request(me.instance.getName(), request);

            if (!me.isLayerVisible) {
            	me._setLayerVisibility(me.layerId, false);
            }

            this.mainPanel.remove();
        },
        /**
         * @method _removeLayers
         * Removes temporarily layers from map that the user cant publish
         * @private
         */
        _hideLayers: function () {
            var me = this,
                sandbox = me.sandbox,
                i,
                layer;

            for (i = 0; i < me.allLayers.length; i++) {
            	if (me.allLayers[i].isVisible()) {
            		me.allVisibleLayers.push(me.allLayers[i]);
            	}
            }

            if (me.allVisibleLayers) {
                for (i = 0; i < me.allVisibleLayers.length; i += 1) {
                    layer = me.allVisibleLayers[i];
                    if (me.layerId != layer.getId() && layer.isLayerOfType("WFS")) {
                    	me._setLayerVisibility(layer.getId(), false);
                    }
                }
            }
        },
        _showLayers: function () {
        	var me = this;
        	for (var i = 0; i < me.allVisibleLayers.length; i++) {
        		me._setLayerVisibility(me.allVisibleLayers[i].getId(), true);
        	}
        },
        _disableGFI: function () {
        	var me = this;
        	var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(false);
            me.sandbox.request(me.instance.getName(), request);
        },
        _checkLayerVisibility: function (layerId) {
        	var me = this;
        	var layer = me._getLayerById(layerId);
        	if (layer.isVisible()) {
        		return true;
        	}
        	return false;
        },
        _setLayerVisibility: function (layerId, setVisible) {
        	var me = this;

        	var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
        	var request = visibilityRequestBuilder(layerId, setVisible);
            me.sandbox.request(me.instance.getName(), request);
        },
        _getLayerById: function (layerId) {
        	var me = this;
        	for (var i = 0; i < me.allLayers.length; i++) {
        		if (me.allLayers[i].getId() == layerId) {
        			return me.allLayers[i];
        		}
        	}
        },
        _handleInfoResult: function (data, mode, editableFeatureFid) {
            var me = this;

            if (me.operationMode === "delete") {
                me._handleDeleteGeometry();
                return;
            }

            if (mode === "create") {
                this.operationMode = "create";
            } else if (mode === "edit") {
                this.operationMode = "edit";
            } else {
                this.operationMode = null;
            }

            var layer = this._getLayerById(data.layerId);
            if (editableFeatureFid === undefined)
            {
                this.layerGeometryType = null;
                this._addDrawTools();
            }

            if (!me.processGFIRequest) {
                if (me.GFIFirstRequestProcessed == true) {
                    me._highlighGeometries(me.highlightFeaturesIds, layer, true);
                    me.getLayerGeometryType();
                    return;
                } else {
                    me.GFIFirstRequestProcessed = true;
                }
            }

            me.highlightFeaturesIds = [];
            if(data.features) {
                for (var i = 0; i < data.features.length; i++) {
                    if ((editableFeatureFid === undefined || data.features[i][0] == editableFeatureFid) && (data.features[i] != ""))
                    me.highlightFeaturesIds.push(data.features[i][0].split('.')[1]);
                }
            }

            this._highlighGeometries(me.highlightFeaturesIds, layer, true);

            var isVisibleLayer = false;
            for (var i = 0; i < this.allVisibleLayers.length; i++) {
                if (this.allVisibleLayers[i].getId() == data.layerId) {
                    isVisibleLayer = true;
                    break;
                }
            }

            if (!isVisibleLayer)
            {
                return;
            }

            this.selectedLayerId = data.layerId;
        	this.currentData = data;

            var content = [],
                contentData = {},
                fragments = [],
                colourScheme,
                font;

            me.mainPanel.find('.content-draw-tools').removeClass('hide');
            fragments = this._formatWFSFeaturesForInfoBox(data, editableFeatureFid);

            me.mainPanel.find(".properties-container").empty();
            if (fragments != null && fragments.length) {
                contentData.html = this._renderFragments(fragments, editableFeatureFid);
                contentData.layerId = fragments[0].layerId;
                contentData.layerName = fragments[0].layerName;
                contentData.featureId = data.features[0][0];
                content.push(contentData);
                me.mainPanel.find(".properties-container").append(contentData.html);
                me._setDatepickerLanguage();
                me.mainPanel.find(".datepicker").datepicker({'dateFormat': "yy-mm-dd", 'changeMonth': true, 'changeYear': true, 'showButtonPanel': true}).attr('readonly', 'readonly');
            }
        },
        /**
         * @method _formatWFSFeaturesForInfoBox
         */
        _formatWFSFeaturesForInfoBox: function (data, editableFeatureFid) {
            var me = this,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(data.layerId),
                fields = layer.getFields().slice(),
                hiddenFields = ['__centerX', '__centerY'],
                type = 'wfslayer',
                result,
                markup;

            if (data.features === 'empty' || layer === null || layer === undefined) {
                return;
            }

            if(fields.length === 0) { //layer view is empty, get fields from DescribeFeatureType
                fields = ["__fid"];
                jQuery.each(me.fieldsTypes, function(key, value) {
                   if(value.indexOf('gml:') !== 0) { //skip geometry
                       fields.push(key);
                   }
                });
                fields = fields.concat(['__centerX', '__centerY']);
            }

            // replace fields with locales
            fields = _.chain(fields)
                .zip(layer.getLocales().slice())
                .map(function (pair) {
                    // pair is an array [field, locale]
                    if (_.contains(hiddenFields, _.first(pair))) {
                        // just return the field name for now if it's hidden
                        return _.first(pair);
                    }
                    // return the localized name or field if former is undefined
                    return _.last(pair) || _.first(pair);
                })
                .value();

            result = _.map(data.features, function (feature) {
                var feat = _.chain(fields)
                    .zip(feature)
                    .filter(function (pair) {
                        return !_.contains(hiddenFields, _.first(pair));
                    })
                    .foldl(function (obj, pair) {
                        if (pair[0] !== undefined) {
                            obj[_.first(pair)] = _.last(pair);
                        }
                        return obj;
                    }, {})
                    .value();

                markup = me._json2html(feat, ((editableFeatureFid != undefined && feat.__fid === editableFeatureFid) || me.operationMode == "create" ? false : true));
                return {
                    markup: markup,
                    layerId: data.layerId,
                    layerName: layer.getLayerName(),
                    type: type,
                    fid: feat.__fid
                };
            });

            return result;
        },
        /**
         * @method _json2html
         * @private
         * Parses and formats a WFS layers JSON GFI response
         * @param {Object} node response data to format
         * @return {String} formatted HMTL
         */
        _json2html: function (node, readonly) {
            var me = this;
            if (typeof readonly === 'undefined')
            {
                readonly = false;
            }
            // FIXME this function is too complicated, chop it to pieces
            if (node === null || node === undefined) {
                return '';
            }
            var even = true,
                html = jQuery(this.templates.getinfoResultTable),
                row = null,
                keyColumn = null,
                valColumn = null,
                key,
                value,
                vType,
                valpres,
                valueDiv,
                innerTable,
                i;

            for (key in node) {
                if (node.hasOwnProperty(key)) {
                    value = node[key];


                    if (key === null || key === undefined) {
                        continue;
                    }
                    vType = (typeof value).toLowerCase();
                    valpres = '';
                    switch (vType) {
                    case 'string':
                        if (value.indexOf('http://') === 0) {
                            valpres = jQuery(this.templates.linkOutside);
                            valpres.attr('href', value);
                            valpres.append(value);
                        } else {
                            valpres = value;
                        }
                        break;
                    case 'undefined':
                        valpres = 'n/a';
                        break;
                    case 'boolean':
                        valpres = (value ? 'true' : 'false');
                        break;
                    case 'number':
                        valpres = '' + value;
                        break;
                    case 'function':
                        valpres = '?';
                        break;
                    case 'object':
                        // format array
                        if (jQuery.isArray(value)) {
                            valueDiv = jQuery(this.templates.wrapper);
                            for (i = 0; i < value.length; i += 1) {
                                innerTable = this._json2html(value[i]);
                                valueDiv.append(innerTable);
                            }
                            valpres = valueDiv;
                        } else {
                            valpres = this._json2html(value);
                        }
                        break;
                    default:
                        valpres = '';
                    }
                    even = !even;

                    row = jQuery(this.templates.tableRow);
                    // FIXME this is unnecessary, we can do this with a css selector.
                    if (!even) {
                        row.addClass('odd');
                    }

                    keyColumn = jQuery(this.templates.tableCell);
                    keyColumn.append(key);
                    row.append(keyColumn);

                    valColumn = jQuery(this.templates.tableCell);
					if (key == "__fid" || readonly) {
						valColumn.append(value);
					} else {
                        valInput = jQuery(this.templates.tableInput);
                        switch (this.fieldsTypes[key])
                        {
                            case 'xsd:numeric':
                                valInput.prop('type', 'number');
                                valInput.on('blur', function (event) {
                                    if (jQuery.isNumeric(jQuery(this).val()) == false) {
                                        jQuery(this).addClass('field-invalid');

                                        var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                        okButton.setTitle(me.loc.buttons.ok);
                                        okButton.setHandler(function () {
                                            me.closeDialog();
                                        });
                                        me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                    }
                                });
                                valInput.on('keyup', function (event) {
                                    if (jQuery.isNumeric(jQuery(this).val())) {
                                        jQuery(this).removeClass('field-invalid');
                                    }
                                });
                                break;
                            case 'xsd:double':
                            case 'xsd:decimal':
                                valInput.prop('type', 'number').prop('step', 0.01);
                                valInput.on('blur', function (event) {
                                    if (jQuery.isNumeric(jQuery(this).val()) == false) {
                                        jQuery(this).addClass('field-invalid');

                                        var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                        okButton.setTitle(me.loc.buttons.ok);
                                        okButton.setHandler(function () {
                                            me.closeDialog();
                                        });
                                        me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                    }
                                });
                                valInput.on('keyup', function (event) {
                                    if (jQuery.isNumeric(jQuery(this).val())) {
                                        jQuery(this).removeClass('field-invalid');
                                    }
                                });
                                break;
                            case 'xsd:date':
                                valInput.prop('type', 'text');
                                valInput.addClass('datepicker');
                                break;
                            case 'xsd:string':
                            default:
                                valInput.prop('type', 'text');
                                break;
                        }
                        valInput.val(value);
                        valInput.on('change', function () {
                            me.featureDuringEdit = true;
                        });
                        valColumn.append(valInput);
					}
					row.append(valColumn);
                    html.append(row);
                }
            }
            return html;
        },
        _saveFeature: function () {
            var me = this;
            if (me._formIsValid()) {
                if (me.drawingActive == true) {
                    me.drawingActive = false;
                    me.sendStopDrawRequest();
                } else {
                    me.prepareRequest(null);
                }
                me.featureDuringEdit = false;
                me._storeFormData();
            } else {
                var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okButton.setTitle(me.loc.buttons.ok);
                okButton.setHandler(function () {
                    me.closeDialog();
                });
                me.showMessage(me.loc.formValidationError.title, me.loc.formValidationError.text, [okButton], true);
            }
        },
        _cancelFeature: function () {
            var me = this;
            me.drawingActive = false;
            me.sendStopDrawRequest(true);
            me._clearFeaturesList();
            me.featureDuringEdit = false;
        },
        _storeFormData: function () {
            var me = this;
            me.mainPanel.find('.getinforesult_table tr input').each(function (index) {
                me.currentData.features[0][index+1] = jQuery(this).val();
            });
        },
        /**
         * Wraps the html feature fragments into a container.
         *
         * @method _renderFragments
         * @private
         * @param  {Object[]} fragments
         * @return {jQuery}
         */
        _renderFragments: function (fragments, editableFeatureFid) {
            var me = this;

            return _.foldl(fragments, function (wrapper, fragment) {
                var fragmentTitle = fragment.layerName,
                    fragmentMarkup = fragment.markup;

                if (fragment.isMyPlace) {
                    if (fragmentMarkup) {
                        wrapper.append(fragmentMarkup);
                    }
                } else {
                    var contentWrapper = jQuery(me.templates.wrapper),
                        headerWrapper = jQuery(me.templates.header),
                        titleWrapper = jQuery(me.templates.headerTitle),
                        actionButtonWrapper = jQuery(me.templates.wrapper);

                    titleWrapper.append(fragmentTitle);
                    titleWrapper.attr('title', fragmentTitle);

                    if (editableFeatureFid === fragment.fid || me.operationMode == "create") {
                        var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        saveButton.setPrimary(true);
                        saveButton.setTitle(me.loc.buttons.save);
                        saveButton.setHandler(function() {
                            me._saveFeature();
                            me._enableGFIRequestProcess();
                        });

                        var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        cancelButton.setTitle(me.loc.buttons.cancel);
                        cancelButton.setHandler(function() {
                            me._cancelFeature();
                            me._enableGFIRequestProcess();
                            me._highlighGeometries([], me._getLayerById(me.selectedLayerId), true);
                        });
                        var drawToolsContainer = jQuery("<div/>").addClass("content-draw-tools");
                        drawToolsContainer.append(me._addDrawTools());
                        contentWrapper.append(drawToolsContainer);

                        var buttonsContainer = jQuery("<div/>").addClass("content-editor-buttons");
                        saveButton.insertTo(buttonsContainer);
                        cancelButton.insertTo(buttonsContainer);

                        contentWrapper.append(buttonsContainer);
                    }
                    headerWrapper.append(titleWrapper);
                    contentWrapper.append(headerWrapper);
                    contentWrapper.addClass('getinforesult_container');

                    if (fragmentMarkup) {
                        contentWrapper.append(fragmentMarkup);
                    }

                    if (fragment.fid != editableFeatureFid && me.operationMode != "create") {
                        var deleteButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        deleteButton.setTitle(me.loc.buttons.deleteFeature);
                        deleteButton.setHandler(function () {
                            var deleteButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                            deleteButton.setTitle(me.loc.buttons.delete);
                            deleteButton.setPrimary(true);
                            deleteButton.setHandler(function () {
                                me.closeDialog();
                                me._deleteFeature(fragment.fid);
                            });
                            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                            cancelButton.setTitle(me.loc.buttons.cancel);
                            cancelButton.setHandler(function () {
                                me.closeDialog();
                                me._enableGFIRequestProcess();
                            });
                            me.showMessage(me.loc.deleteFeature.title, me.loc.deleteFeature.text, [deleteButton, cancelButton], true);
                        });

                        var editButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        editButton.setTitle(me.loc.buttons.editFeature);
                        editButton.setHandler(function () {
                            me.processGFIRequest = false;
                            if (me.featureDuringEdit) {
                                me.featureDuringEdit = false;
                                me._showEditUnsavedInfoModal(fragment.fid);
                            } else {
                                me._editFeature(fragment.fid);
                            }
                        });

                        editButton.insertTo(actionButtonWrapper);
                        deleteButton.insertTo(actionButtonWrapper);
                        actionButtonWrapper.addClass('content-editor-buttons');
                        contentWrapper.append(actionButtonWrapper);
                    }
                    else {
                        contentWrapper.addClass('edit-feature');
                    }

                    wrapper.append(contentWrapper);
                }

                delete fragment.isMyPlace;

                return wrapper;
            }, jQuery(me.templates.wrapper));
        },
        _getFeatureData: function () {
            var result = [];
            var me = this;
            me.mainPanel.find('.edit-feature .getinforesult_table').first().find('tr').each(function () {
                var key = jQuery(this).find('td').eq(0).html();
                var val = null;
                if (jQuery(this).find('td').eq(1).find("input").length > 0) {
                    val = jQuery(this).find('td').eq(1).find("input").val();
                } else {
                    val = jQuery(this).find('td').eq(1).html();
                }

                result.push({ "key": key, "value": val });
            });

            return result;
        },
        _parseLayerGeometryResponse: function (response) {
            if (response == "MultiPoint" || response == "gml:MultiPointPropertyType")
            {
                this.layerGeometryType = "MultiPoint";
            }
            else if (response == "Point" || response == "gml:PointPropertyType")
            {
                this.layerGeometryType = "Point";
            }
            else if (response == "MultiLineString" || response == "gml:MultiLineStringPropertyType")
            {
                this.layerGeometryType = "MultiLineString";
            }
            else if (response == "MultiPolygon" || response == "gml:MultiPolygonPropertyType" || response == "gml:MultiSurfacePropertyType")
            {
                this.layerGeometryType = "MultiPolygon";
            }
            else if (response == "Polygon" || response == "gml:PolygonPropertyType") {
                this.layerGeometryType = "Polygon";
            }
            else if (response == "gml:GeometryPropertyType")
            {
                this.layerGeometryType = "GeometryPropertyType";
            }
        },
        _addDrawTools: function () {
            var me = this;
            me.mainPanel.find('.content-draw-tools').empty();
            var pointButton = jQuery("<div />").addClass('add-point tool').attr('title', me.loc.tools.point);
            if (me.layerGeometryType == "MultiPoint" || me.layerGeometryType == "Point" || me.layerGeometryType == "GeometryPropertyType") {
                pointButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                pointButton.addClass("disabled");
            }

            var lineButton = jQuery("<div />").addClass('add-line tool').attr('title', me.loc.tools.line);
            if (me.layerGeometryType == "MultiLineString" || me.layerGeometryType == "GeometryPropertyType") {
                lineButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                lineButton.addClass("disabled");
            }

            var areaButton = jQuery("<div />").addClass('add-area tool').attr('title', me.loc.tools.area);
            if (me.layerGeometryType == "MultiPolygon" || me.layerGeometryType == "Polygon" || me.layerGeometryType == "GeometryPropertyType") {
                areaButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                areaButton.addClass("disabled");
            }

            var geomEditButton = jQuery("<div />").addClass('selection-area tool').attr('title', me.loc.tools.geometryEdit);
            if (me.layerGeometryType != null) {

                geomEditButton.on('click', function() {
                    me.drawingActive = true;
                    me.drawToolType = "edit";
                    me.clickedGeometryNumber = null;
                    var geometryType = me.layerGeometries.geometry.getType();
                    me._getClickedGeometryNumber(geometryType);
                    var geometry = (me.clickedGeometryNumber != null ? me.layerGeometries.geometry.getCoordinates()[me.clickedGeometryNumber] : me.layerGeometries.geometry);
                    me.startNewDrawing();
                });
            } else {
                geomEditButton.addClass("disabled");
            }

            var geomDeleteButton = jQuery("<div />").addClass('selection-remove tool').attr('title', me.loc.tools.remove);

            if (me.operationMode === "create")  {
                geomDeleteButton.addClass("disabled");
            } else {
                geomDeleteButton.on('click', function() {
                    me.sendStopDrawRequest(true);
                    me.operationMode = "delete";
                });
            }

            var toolContainer = jQuery("<div />").addClass('toolrow');
            toolContainer.append(pointButton);
            toolContainer.append(lineButton);
            toolContainer.append(areaButton);
            toolContainer.append(geomEditButton);
            toolContainer.append(geomDeleteButton);
            me.mainPanel.find('.content-draw-tools').append(toolContainer);
            return toolContainer;
        },
        /**
         * Returns the zoom based click tolerance threshold.
         * @return {Number} the tolerance in kilometers.
         */
        _getZoomBasedClickToleranceThreshold: function() {
            var me = this,
                zoom = me.sandbox.getMap().getZoom(),
                zoomBasedClickToleranceThreshold;
            switch(zoom) {
                case 1:
                    zoomBasedClickToleranceThreshold = 6.9;
                    break;
                case 2:
                    zoomBasedClickToleranceThreshold = 3.34;
                    break;
                case 3:
                    zoomBasedClickToleranceThreshold = 1.79;
                    break;
                case 4:
                    zoomBasedClickToleranceThreshold = 0.808;
                    break;
                case 5:
                    zoomBasedClickToleranceThreshold = 0.405;
                    break;
                case 6:
                    zoomBasedClickToleranceThreshold = 0.202;
                    break;
                case 7:
                    zoomBasedClickToleranceThreshold = 0.111;
                    break;
                case 8:
                    zoomBasedClickToleranceThreshold = 0.05;
                    break;
                case 9:
                    zoomBasedClickToleranceThreshold = 0.0247;
                    break;
                case 10:
                    zoomBasedClickToleranceThreshold = 0.01338;
                    break;
                case 11:
                    zoomBasedClickToleranceThreshold = 0.0061;
                    break;
                case 12:
                    zoomBasedClickToleranceThreshold = 0.00335;
                    break;
                case 13:
                    zoomBasedClickToleranceThreshold = 0.00152;
                    break;
                case 14:
                    zoomBasedClickToleranceThreshold = 0.000881;
                    break;
                case 15:
                    zoomBasedClickToleranceThreshold = 0.00038;
                    break;
                default:
                    zoomBasedClickToleranceThreshold = me.defaultClickDistanceThreshold;
            }
            return zoomBasedClickToleranceThreshold;
        },
        /**
         * Deduces the clicked geometry number from the layer given the geometry type and assign its index to a class variable clickedGeometryNumber.
         * @param  {String} geometryType the selected layer's geometry type
         */
        _getClickedGeometryNumber: function(geometryType) {
            var me = this;
            if (geometryType.indexOf("Multi") > -1) {
                if (me.layerGeometries.geometry.getCoordinates() != undefined) {
                    for (var i = 0; i < me.layerGeometries.geometry.getCoordinates().length; i++) {
                        if(geometryType === "MultiPoint") {
                            var closestPoint = me.layerGeometries.geometry.getClosestPoint([me.clickCoords.x, me.clickCoords.y]);
                            //Have to transform point and multipoint closest point for turf.
                            var closestPointCoordinatesWGS84 = olProj.transform(closestPoint, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                            var clickedPointCoordinatesWGS84 = olProj.transform([me.clickCoords.x,  me.clickCoords.y], me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                            var from = turf.point(closestPointCoordinatesWGS84);
                            var to = turf.point(clickedPointCoordinatesWGS84);
                            var distance = turf.distance(from, to);
                            if(distance <= me._getZoomBasedClickToleranceThreshold()) {
                                me.clickedGeometryNumber = i;
                                break;
                            }
                        } else if(geometryType === "MultiPolygon") {
                            if(me.layerGeometries.geometry.intersectsCoordinate([me.clickCoords.x, me.clickCoords.y])) {
                                me.clickedGeometryNumber = i;
                                break;
                            }
                        } else if(geometryType === "MultiLineString") {
                            var lineStrings = me.layerGeometries.geometry.getLineStrings();
                            //Have to transform point and linestring for turf.
                            var clickedPointCoordinatesWGS84 = olProj.transform([me.clickCoords.x,  me.clickCoords.y], me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                            var pt = turf.point(clickedPointCoordinatesWGS84);
                            for(var j = 0; j < lineStrings.length; ++j) {
                                var lineStringCoords = lineStrings[j].getCoordinates();
                                var lineStringTransformed = [];
                                for(var k = 0; k < lineStringCoords.length; ++k) {
                                    var lineStringPoint = lineStringCoords[k];
                                    var lineStringPointWGS84 = olProj.transform(lineStringPoint, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                                    lineStringTransformed.push(lineStringPointWGS84);
                                }
                                var line = turf.lineString(lineStringTransformed);
                                //Get default distance in kilometers
                                var distance = turf.pointToLineDistance(pt, line);
                                if(distance <= me._getZoomBasedClickToleranceThreshold()) {
                                    me.clickedGeometryNumber = i;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                me.clickedGeometryNumber = null;
            }
        },
        setClickCoords: function (coords) {
            this.clickCoords = coords;
            this._handleInfoResult({layerId:this.layerId, features: [] });
        },
        _highlighGeometries: function (featuresIds, layer, keepPrevious) {
            if (this.selectedLayerId == layer.getId())
            {
                var isCorrect = true;
                for (var i = 0; i < featuresIds.length; i++) {
                    if (featuresIds[i] === undefined) {
                        isCorrect = false;
                        break;
                    }
                }

                if (isCorrect) {
                    var eventBuilder = this.sandbox.getEventBuilder("WFSFeaturesSelectedEvent");
                    if(eventBuilder) {
                        var event = eventBuilder(featuresIds, layer, true);
                        this.sandbox.notifyAll(event);
                    }
                }
            }
        },
        _deleteFeature: function (fid) {
            var me = this;

            var requestData = {};
            requestData.layerId = me.selectedLayerId;
            requestData.featureId = fid;
            var wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okButton.setTitle(me.loc.buttons.ok);

            jQuery.ajax({
                type : 'POST',
                dataType : 'json',
                beforeSend : function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data : {'featureData':JSON.stringify(requestData)},
                url : Oskari.urls.getRoute('DeleteFeature'),
                success : function(response) {
                    me._clearFeaturesList();
                    // remove old tiles
                    var layer = me._getLayerById(me.selectedLayerId);
                    me._highlighGeometries([], me._getLayerById(me.selectedLayerId), true);
                    wfsLayerPlugin.deleteTileCache(me.selectedLayerId, layer.getCurrentStyle().getName());
                    //wfsLayerPlugin.refreshLayer(me.selectedLayerId);
                    var evt = me.sandbox.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                    me.sandbox.notifyAll(evt);
                    okButton.setHandler(function () {
                        setTimeout(function() {
                            var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest');
                            var request = visibilityRequestBuilder(me.selectedLayerId, true);
                            me.sandbox.request(me.instance.getName(), request);
                        }, 500);
                        me.closeDialog();
                    });
                    me.showMessage(me.loc.featureDelete.header, me.loc.featureDelete.success, [okButton]);
                },
                error: function (error) {
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(me.loc.featureDelete.header, me.loc.featureDelete.error, [okButton]);
                }
            });
        },
        _handleDeleteGeometry: function () {
            var me = this;
            var featureGeometryId = null;
            var coords = new OpenLayers.LonLat(me.clickCoords.x, me.clickCoords.y);
            for (var i = 0; i < me.layerGeometries.geometry.components.length; i++) {
                if (me.layerGeometries.geometry.components[i].atPoint(coords, 2, 2)) {
                    featureGeometryId = i;
                    break;
                }
            }

            if (featureGeometryId != null) {
                var featureGeometry = me.layerGeometries.geometry.components[i],
                    contentActions = [];

                var cancelAction = {};
                cancelAction['name'] = me.loc.buttons.cancel;
                cancelAction['type'] = 'button';
                cancelAction['group'] = 1;
                cancelAction['action'] = function () {
                    var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')("contentEditor");
                    me.sandbox.request(me, request);
                    me._highlighGeometries(me.highlightFeaturesIds, me._getLayerById(me.selectedLayerId), true);
                };
                contentActions.push(cancelAction);

                var deleteAction = {};
                deleteAction['name'] = me.loc.buttons.delete;
                deleteAction['type'] = 'button';
                deleteAction['group'] = 1;
                deleteAction['action'] = function () {
                    me.layerGeometries.geometry.components.splice(featureGeometryId, 1);
                    me.prepareRequest(null, true);
                    var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')("contentEditor");
                    me.sandbox.request(me, request);
                    me._enableGFIRequestProcess();
                };
                contentActions.push(deleteAction);

                var content = [{
                    html : me.templates.deleteDialog.clone(),
                    actions : contentActions
                }];

                var options = {
                    hidePrevious: true
                };
                var request = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest')("contentEditor", me.loc.deleteGeometryDialog.title, content, new OpenLayers.LonLat(featureGeometry.getCentroid().x, featureGeometry.getCentroid().y), options);
                me.sandbox.request(me.getName(), request);
                jQuery("#delete-dialog").parent().parent().css('height', 'auto').css('padding-bottom', '30px');
            }
            me.operationMode = "edit";
        },
        _clearFeaturesList: function () {
            var me = this;
            me.mainPanel.find('.properties-container').empty();
        },
        _formIsValid: function () {
            var me = this;
            if (me.mainPanel.find('.properties-container input.field-invalid').length > 0) {
                return false;
            }
            return true;
        },
        _setDatepickerLanguage: function () {
            var storedLanguage = jQuery.cookie('oskari.language');
            var lang = null;
            if (storedLanguage == null) {
                var supportedLanguages = Oskari.getSupportedLanguages();
                var lang = "en-GB";
                for (var i = 0; i < supportedLanguages.length; i++) {
                    if (supportedLanguages[i].indexOf("en") > -1) {
                        break;
                    }

                    if (supportedLanguages[i].indexOf("fi") > -1) {
                        lang = "fi";
                        break;
                    }
                }
            } else {
                lang = storedLanguage;
            }

            jQuery.datepicker.regional['fi'] = {
                closeText: 'Sulje',
                prevText: '&laquo;Edellinen',
                nextText: 'Seuraava&raquo;',
                currentText: 'T&auml;n&auml;&auml;n',
                monthNames: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kes&auml;kuu',
                'Hein&auml;kuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
                monthNamesShort: ['Tammi','Helmi','Maalis','Huhti','Touko','Kes&auml;',
                'Hein&auml;','Elo','Syys','Loka','Marras','Joulu'],
                dayNamesShort: ['Su','Ma','Ti','Ke','To','Pe','Su'],
                dayNames: ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai'],
                dayNamesMin: ['Su','Ma','Ti','Ke','To','Pe','La'],
                weekHeader: 'Vk',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''};

            jQuery.datepicker.setDefaults(
                  jQuery.extend(
                    jQuery.datepicker.regional[lang],
                    {'dateFormat':'yy-mm-dd'}
                  )
                );
        },
        _enableGFIRequestProcess: function () {
            var me = this;
            me.processGFIRequest = true;
            me.GFIFirstRequestProcessed = false;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
