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
        me._geojson = null;
    }, {
        __name: 'ContentEditor',
        /**
         * @method @public getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },

        /**
         * Shows message
         * @method @public showMessage
         * @param  {String}    title   title string
         * @param  {Object}    content content
         * @param  {Array}    buttons buttons
         * @param  {Boolean}   isModal show message as model
         */
    	showMessage: function(title, content, buttons, isModal) {
            this.closeDialog();
            this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this._dialog.show(title, content, buttons);
            if (isModal) {
                this._dialog.makeModal();
            }
        },

        /**
         * Closes the message dialog if opened
         * @method @public closeDialog
         */
        closeDialog : function() {
            if(this._dialog) {
                this._dialog.close(true);
                this._dialog = null;
            }
        },

        /**
         * Starts drawing, sends a StartDrawingRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @method @public startNewDrawing
         */
        startNewDrawing: function () {
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
                if (me.layerGeometryType.indexOf('Multi') > -1) {
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                        allowMultipleDrawing: 'multiGeom',
                        geojson: geomAsGeoJSON
                    }]);
                } else {
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                        allowMultipleDrawing: 'single',
                        geojson: geomAsGeoJSON
                    }]);
                }
            } else {
                me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [me.instance.getName(), me.getDrawToolsGeometryType(), {
                    allowMultipleDrawing: true
                }]);
            }
        },

        /**
         * Gets drawtool geometry type
         * @method @public getDrawToolsGeometryType
         * @return {String}    drawtools geometry type
         */
        getDrawToolsGeometryType: function() {
            return this.layerGeometryType.replace('Multi', '');
        },

        /**
         * Sends a StopDrawingRequest.
         * @method @public sendStopDrawRequest
         */
        sendStopDrawRequest: function () {
            var me = this;
            me.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [me.instance.getName(), true, true]);
        },

        /**
         * Sets geometry type
         * @method @public setGeometryType
         * @param  {String}        geometryType geometry type
         */
        setGeometryType: function (geometryType) {
            this._parseLayerGeometryResponse(geometryType);
        },

        /**
         * Parse WFS feature geometries
         * @method @public parseWFSFeatureGeometries
         * @param  {Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureGeometriesEvent}                  evt event
         */
        parseWFSFeatureGeometries: function(evt) {
            var me = this;
            var layerIndex = this.allVisibleLayers.findIndex(function(layer){
                return layer.getId() == evt.getMapLayer().getId();
            });

            if(layerIndex === -1) {
                // Not handle event
                return;
            }
            evt.getGeometries().forEach(function(geometry){
                me._addClickedFeature(geometry);
            });
        },

        /**
         * Find geometry by fid
         * @method  _findGeometryByFid
         * @param   {String}           fid feature identifier
         * @return  {Object}               clicked feature object, like {id:0, geometry:geom}
         * @private
         */
        _findGeometryByFid: function (fid) {
            for (var i = 0; i < this.allClickedFeatures.length; i++) {
                if (this.allClickedFeatures[i].fid == fid) {
                    return this.allClickedFeatures[i];
                }
            }
            //did not find from own clicked features, try searching wfs layer
            return this._findGeometryByFidFromLayer(fid);
        },

        /**
         * Find geometry by id from selected wfs maplayer id
         * @method  _findGeometryByFidFromLayer
         * @param   {String}                    fid feature identifier
         * @return  {Object}               clicked feature object, like {id:0, geometry:geom}
         * @private
         */
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
        /**
         * Add clicked feature
         * @method  _addClickedFeature
         * @param   {Object}           clickedFeature clicked feature
         * @private
         */
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

        /**
         * Add new feature
         * @method  _addNewFeature
         * @private
         */
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
            fields.forEach(function(){
                featureData[0].push('');
            });

            me._handleInfoResult({layerId:me.layerId, features: featureData }, 'create');
        },
        /**
         * Edit feature
         * @method  _editFeature
         * @param   {String}     fid feature identifier
         * @private
         */
        _editFeature: function (fid) {
            var me = this;
            me._handleInfoResult(me.currentData, 'edit', fid);

            var geometry = me._findGeometryByFid(fid);
            if (geometry != null) {
                me.layerGeometries = geometry;
            }
            me.setGeometryType(me.layerGeometries.geometry.getType());
            me._addDrawTools();
            me.currentEditFeatureFid = fid;
        },

        /**
         * Shows new feature unsaved modal message
         * @method  _showAddUnsavedInfoModal
         * @private
         */
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

        /**
         * Shows edit feature unsaved modal message
         * @method  _showEditUnsavedInfoModal
         * @param   {String}                  fid feature identifier
         * @private
         */
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
         * Renders view to given DOM element
         * @method @public render
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

            container.append(content);
            container.find('.icon-close').on('click', function(){
                me.sendStopDrawRequest(true);
            	me.instance.setEditorMode(false);
            });

            content.find('div.header h3').append(me.loc.title);

            content.find('.content').append(jQuery('<div>' + me.loc.featureModifyInfo + '</div>'));
            content.find('.content').append(jQuery('<div>' + me.loc.toolInfo + '</div>'));
            content.find('.content').append(jQuery('<div>' + me.loc.geometryModifyInfo + '</div>'));
            content.find('.content').append(jQuery('<div>' + me.loc.geometryDeleteInfo + '</div>'));
            var addFeatureButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addFeatureButton.setTitle(me.loc.buttons.addFeature);
            addFeatureButton.setHandler(function () {
                if (me.featureDuringEdit) {
                    me.featureDuringEdit = false;
                    me._showAddUnsavedInfoModal();
                } else {
                    me.allClickedFeatures = [];
                    me._addNewFeature();
                }
            });
            var addFeatureButtonContainer = jQuery('<div />');

            addFeatureButton.insertTo(addFeatureButtonContainer);
            content.find('.content').append(addFeatureButtonContainer);
            me._addDrawTools(content);

            content.find('.content').append(jQuery('<div />').addClass('properties-container'));

            if (!me._checkLayerVisibility(me.layerId)) {
            	me.isLayerVisible = false;
            	me._changeLayerVisibility(me.layerId, true);
            }
            me._hideLayers();
            me._disableGFI();
        },

        /**
         * Gets layer geometry type and adds supported drawtools
         * @method @public getLayerGeometryType
         */
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

        /**
         * Gets layer fieldtypes
         * @method @public getFieldsTypes
         */
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

        /**
         * Get linestring
         * @method  _getLineString
         * @param   {Array}       coordinates coordinates array
         * @return  {Array}       linestring object array, example [{x:1,y:1},{x:2,y:2}]
         * @private
         */
        _getLineString: function(coordinates){
            var line = [];
            coordinates.forEach(function(coord){
                line.push({x: coord[0], y: coord[1]});
            });
            return line;
        },

        /**
         * Fills layer geometries
         * @method  _fillLayerGeometries
         * @param   {Object}             geometries geometries object
         * @private
         */
        _fillLayerGeometries: function(geometries) {
            var me = this;
            if (me.layerGeometries != null && me.layerGeometries.geometry != null) {
                var layerGeometries = JSON.parse(new olFormatGeoJSON().writeGeometry(me.layerGeometries.geometry));
                if(me._geojson && me._geojson.features[0] && me._geojson.features[0].geometry) {
                    layerGeometries = me._geojson.features[0].geometry;
                }

                if (layerGeometries != null) {
                    if (layerGeometries.type == 'MultiPoint') {
                        geometries.type = 'multipoint';
                        layerGeometries.coordinates.forEach(function(coordinates){
                            geometries.data.push({x: coordinates[0], y: coordinates[1]});
                        });
                    } else if (layerGeometries.type == 'MultiLineString') {
                        geometries.type = 'multilinestring';

                        layerGeometries.coordinates.forEach(function(coordinates){
                            geometries.data.push(me._getLineString(coordinates));
                        });
                    } else if (layerGeometries.type == 'MultiPolygon') {
                        geometries.type = 'multipolygon';

                        layerGeometries.coordinates.forEach(function(coordinates){
                            var tmpPolygon = [];

                            coordinates.forEach(function(lineCoordinates){
                                tmpPolygon.push(me._getLineString(lineCoordinates));
                            });

                            geometries.data.push(tmpPolygon);
                        });
                    }
                }
            }
        },

        /**
         * Sends save/insert/delete feature ajax request
         * @method @public sendRequest
         * @param  {Object}    requestData   request data
         * @param  {Boolean}    deleteFeature is delete feature
         */
        sendRequest: function (requestData, deleteFeature) {
            var me = this,
                okButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                url = null,
                wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            okButton.setTitle(me.loc.buttons.ok);
            if (me.operationMode === 'create') {
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
            me._geojson = null;
            jQuery.ajax({
                type : 'POST',
                data : {'featureData':JSON.stringify(requestData)},
                url : url,
                success : function(response) {
                    if (me.operationMode === 'create') {
                        me.currentData.features[0][0] = response.fid;
                    }

                    me._clearFeaturesList();
                    var layer = me._getLayerById(me.layerId);
                    me._highlighGeometries([], layer, true);
                    wfsLayerPlugin.deleteTileCache(me.layerId, layer.getCurrentStyle().getName());
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
         * @method  @private _cloneGeometries
         * @param  {Object} requestData the request data for backend
         * @param  {Object} geometries the OL geometries drawn.
         */
        _cloneGeometries: function(requestData, geometries) {
            var me = this;

            if(geometries.type === 'FeatureCollection') {
                geometries.features.forEach(function(feature){
                    if(feature.geometry.type.indexOf('Point') > -1) {
                        requestData.geometries.type = 'multipoint';
                        requestData.geometries.data.push({x:feature.geometry.coordinates[0], y:feature.geometry.coordinates[1]});
                    } else if(feature.geometry.type.indexOf('LineString') > -1) {
                        requestData.geometries.type = 'multilinestring';
                        requestData.geometries.data.push(me._getLineString(feature.geometry.coordinates));
                    } else if(feature.geometry.type.indexOf('Polygon') > -1) {
                        requestData.geometries.type = 'multipolygon';
                        var coordinatesMultiPolygon = feature.geometry.coordinates;
                        var tmpPolygon = [];
                        coordinatesMultiPolygon.forEach(function(coordinates){
                            tmpPolygon.push(me._getLineString(coordinates));
                        });
                        requestData.geometries.data.push(tmpPolygon);
                    }
                });
            }
        },
        /**
         * Sets current geojson (when drawtool finished)
         * @method setCurrentGeoJson
         * @param  {Object}          geojson
         */
        setCurrentGeoJson: function(geojson) {
            this._geojson = geojson;
        },
        /**
         * Prepare request
         * @method prepareRequest
         * @param  {Array}       geometries    geometries array
         * @param  {Boolean}     deleteFeature delete geometry ?
         */
        prepareRequest: function (geometries, deleteFeature) {
            var me = this;
            var requestData = {};
            requestData.featureFields = [];
            var featureData = me._getFeatureData();
            featureData.splice(0, 1);
            requestData.featureFields = featureData;

            requestData.featureId = (me._getFeatureData().length > 0 ? me._getFeatureData()[0].value : null);
            requestData.layerId = me.selectedLayerId;
            requestData.srsName = this.sandbox.getMap().getSrsName();
            requestData.geometries = {};
            requestData.geometries.data = [];
            if (me.operationMode == 'edit' || deleteFeature == true) {
                me._fillLayerGeometries(requestData.geometries);
            } else if (geometries != null) {
                me._cloneGeometries(requestData, geometries);
            }
            me.sendRequest(requestData, deleteFeature);
        },
        /**
         * Destroys/removes this view from the screen.
         * @method @public destroy
         */
        destroy: function () {
        	var me = this;
        	me._showLayers();

        	var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(true);
            me.sandbox.request(me.instance.getName(), request);

            if (!me.isLayerVisible) {
            	me._changeLayerVisibility(me.layerId, false);
            }

            this.mainPanel.remove();
        },
        /**
         * Removes temporarily layers from map that the user cant publish
         * @method _hideLayers
         * @private
         */
        _hideLayers: function () {
            var me = this,
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
                    if (me.layerId != layer.getId() && layer.isLayerOfType('WFS')) {
                    	me._changeLayerVisibility(layer.getId(), false);
                    }
                }
            }
        },

        /**
         * Change all visibled layers visible
         * @method  _showLayers
         * @private
         */
        _showLayers: function () {
        	var me = this;
            me.allVisibleLayers.forEach(function(layer){
                me._changeLayerVisibility(layer.getId(), true);
            });
        },

        /**
         * Disable GFI
         * @method  _disableGFI
         * @private
         */
        _disableGFI: function () {
        	var me = this;
        	var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(false);
            me.sandbox.request(me.instance.getName(), request);
        },

        /**
         * Checks at is layer visible
         * @method  _checkLayerVisibility
         * @param   {[type]}              layerId [description]
         * @return  {[type]}                      [description]
         * @private
         */
        _checkLayerVisibility: function (layerId) {
        	var me = this;
        	var layer = me._getLayerById(layerId);
        	if (layer.isVisible()) {
        		return true;
        	}
        	return false;
        },

        /**
         * Change layer visibility
         * @method  _changeLayerVisibility
         * @param   {String}            layerId    layer id
         * @param   {Boolean}           isVisible is visible
         * @private
         */
        _changeLayerVisibility: function (layerId, isVisible) {
        	var me = this;

        	var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
        	var request = visibilityRequestBuilder(layerId, isVisible);
            me.sandbox.request(me.instance.getName(), request);
        },

        /**
         * Get layers by id
         * @method  _getLayerById
         * @param   {String}      layerId layer id
         * @return  {Object}      layer object
         * @private
         */
        _getLayerById: function (layerId) {
        	var me = this;
        	for (var i = 0; i < me.allLayers.length; i++) {
        		if (me.allLayers[i].getId() == layerId) {
        			return me.allLayers[i];
        		}
        	}
        },

        /**
         * Handle info results
         * @method  _handleInfoResult
         * @param   {Object}          data               layer data
         * @param   {String}          mode               operation mode
         * @param   {String}          editableFeatureFid feature identifier
         * @private
         */
        _handleInfoResult: function (data, mode, editableFeatureFid) {
            var me = this;

            if (me.operationMode === 'delete') {
                me._handleDeleteGeometry();
                return;
            }

            if (mode === 'create') {
                this.operationMode = 'create';
            } else if (mode === 'edit') {
                this.operationMode = 'edit';
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
                    if ((editableFeatureFid === undefined || data.features[i][0] == editableFeatureFid) && (data.features[i] != ''))
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
                fragments = [];

            me.mainPanel.find('.content-draw-tools').removeClass('hide');
            fragments = this._formatWFSFeaturesForInfoBox(data, editableFeatureFid);

            me.mainPanel.find('.properties-container').empty();
            if (fragments != null && fragments.length) {
                contentData.html = this._renderFragments(fragments, editableFeatureFid);
                contentData.layerId = fragments[0].layerId;
                contentData.layerName = fragments[0].layerName;
                contentData.featureId = data.features[0][0];
                content.push(contentData);
                me.mainPanel.find('.properties-container').append(contentData.html);
                me._setDatepickerLanguage();
                me.mainPanel.find('.datepicker').datepicker({'dateFormat': 'yy-mm-dd', 'changeMonth': true, 'changeYear': true, 'showButtonPanel': true}).attr('readonly', 'readonly');
            }
        },

        /**
         * Formats WFS features  for infobox
         * @method  _formatWFSFeaturesForInfoBox
         * @param   {Object}                     data               data
         * @param   {String}                     editableFeatureFid editable feature identifier
         * @return  {Object}                     input object
         * @private
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
                fields = ['__fid'];
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

                markup = me._json2html(feat, ((editableFeatureFid != undefined && feat.__fid === editableFeatureFid) || me.operationMode == 'create' ? false : true));
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
         * Parses and formats a WFS layers JSON GFI response
         * @method _json2html
         * @private
         * @param {Object} node response data to format
         * @return {String} formatted HMTL
         */
        _json2html: function (node, readonly) {
            var me = this;
            if (typeof readonly === 'undefined')
            {
                readonly = false;
            }

            if (node === null || node === undefined) {
                return '';
            }
            var html = jQuery(this.templates.getinfoResultTable),
                row = null,
                keyColumn = null,
                valColumn = null,
                key,
                value;

            for (key in node) {
                if (node.hasOwnProperty(key)) {
                    value = node[key];

                    if (key === null || key === undefined) {
                        continue;
                    }
                    row = jQuery(this.templates.tableRow);

                    keyColumn = jQuery(this.templates.tableCell);
                    keyColumn.append(key);
                    row.append(keyColumn);

                    valColumn = jQuery(this.templates.tableCell);
					if (key == '__fid' || readonly) {
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
        /**
         * Handles save feature
         * @method  _saveFeature
         * @private
         */
        _saveFeature: function () {
            var me = this;
            if (me._formIsValid()) {
                if (me.drawingActive == true) {
                    me.drawingActive = false;
                    me.sendStopDrawRequest();
                }

                me.prepareRequest(me._geojson);
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
        /**
         * Handles cancel feature
         * @method  _cancelFeature
         * @private
         */
        _cancelFeature: function () {
            var me = this;
            me.drawingActive = false;
            me.sendStopDrawRequest(true);
            me._clearFeaturesList();
            me.featureDuringEdit = false;
        },
        /**
         * Stores filled form data
         * @method  _storeFormData
         * @private
         */
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

                    if (editableFeatureFid === fragment.fid || me.operationMode == 'create') {
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
                        var drawToolsContainer = jQuery('<div/>').addClass('content-draw-tools');
                        drawToolsContainer.append(me._addDrawTools());
                        contentWrapper.append(drawToolsContainer);

                        var buttonsContainer = jQuery('<div/>').addClass('content-editor-buttons');
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

                    if (fragment.fid != editableFeatureFid && me.operationMode != 'create') {
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

        /**
         * Gets feature data
         * @method  _getFeatureData
         * @return  {Array}        array of objects {key:key, value:val}
         * @private
         */
        _getFeatureData: function () {
            var result = [];
            var me = this;
            me.mainPanel.find('.edit-feature .getinforesult_table').first().find('tr').each(function () {
                var key = jQuery(this).find('td').eq(0).html();
                var val = null;
                if (jQuery(this).find('td').eq(1).find('input').length > 0) {
                    val = jQuery(this).find('td').eq(1).find('input').val();
                } else {
                    val = jQuery(this).find('td').eq(1).html();
                }

                result.push({key: key, value: val });
            });

            return result;
        },
        /**
         * Parse layer geometry response
         * @method  _parseLayerGeometryResponse
         * @param   {String}                    response geometry type
         * @private
         */
        _parseLayerGeometryResponse: function (response) {
            if (response == 'MultiPoint' || response == 'gml:MultiPointPropertyType')
            {
                this.layerGeometryType = 'MultiPoint';
            }
            else if (response == 'Point' || response == 'gml:PointPropertyType')
            {
                this.layerGeometryType = 'Point';
            }
            else if (response == 'MultiLineString' || response == 'gml:MultiLineStringPropertyType')
            {
                this.layerGeometryType = 'MultiLineString';
            }
            else if (response == 'MultiPolygon' || response == 'gml:MultiPolygonPropertyType' || response == 'gml:MultiSurfacePropertyType')
            {
                this.layerGeometryType = 'MultiPolygon';
            }
            else if (response == 'Polygon' || response == 'gml:PolygonPropertyType') {
                this.layerGeometryType = 'Polygon';
            }
            else if (response == 'gml:GeometryPropertyType')
            {
                this.layerGeometryType = 'GeometryPropertyType';
            }
        },
        /**
         * Adds drawtools
         * @method  _addDrawTools
         * @return {Object} tool jQuery container
         * @private
         */
        _addDrawTools: function () {
            var me = this;
            me.mainPanel.find('.content-draw-tools').empty();
            var pointButton = jQuery('<div />').addClass('add-point tool').attr('title', me.loc.tools.point);
            if (me.layerGeometryType == 'MultiPoint' || me.layerGeometryType == 'Point' || me.layerGeometryType == 'GeometryPropertyType') {
                pointButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                pointButton.addClass('disabled');
            }

            var lineButton = jQuery('<div />').addClass('add-line tool').attr('title', me.loc.tools.line);
            if (me.layerGeometryType == 'MultiLineString' || me.layerGeometryType == 'GeometryPropertyType') {
                lineButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                lineButton.addClass('disabled');
            }

            var areaButton = jQuery('<div />').addClass('add-area tool').attr('title', me.loc.tools.area);
            if (me.layerGeometryType == 'MultiPolygon' || me.layerGeometryType == 'Polygon' || me.layerGeometryType == 'GeometryPropertyType') {
                areaButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing();
                });
            } else {
                areaButton.addClass('disabled');
            }

            var geomEditButton = jQuery('<div />').addClass('selection-area tool').attr('title', me.loc.tools.geometryEdit);
            if (me.layerGeometryType != null) {

                geomEditButton.on('click', function() {
                    me.drawingActive = true;
                    me.drawToolType = 'edit';
                    me.startNewDrawing();
                });
            } else {
                geomEditButton.addClass('disabled');
            }

            var geomDeleteButton = jQuery('<div />').addClass('selection-remove tool').attr('title', me.loc.tools.remove);

            if (me.operationMode === 'create')  {
                geomDeleteButton.addClass('disabled');
            } else {
                geomDeleteButton.on('click', function() {
                    me.sendStopDrawRequest(true);
                    me.operationMode = 'delete';
                });
            }

            var toolContainer = jQuery('<div />').addClass('toolrow');
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
         * @method  @private _getZoomBasedClickToleranceThreshold
         * @return {Number} the tolerance
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
         * Sets clicked coodrinates
         * @method setClickCoords
         * @param  {Array}       coords coordiantes array
         */
        setClickCoords: function (coords) {
            this.clickCoords = coords;
            this._handleInfoResult({layerId:this.layerId, features: [] });
        },

        /**
         * [_highlighGeometries description]
         * @method  _highlighGeometries
         * @param   {Array}            featuresIds  feature id's
         * @param   {String}           layer
         * @param   {Boolean}          keepPrevious keep previous
         * @private
         */
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
                    var eventBuilder = Oskari.eventBuilder('WFSFeaturesSelectedEvent');
                    if(eventBuilder) {
                        var event = eventBuilder(featuresIds, layer, true);
                        this.sandbox.notifyAll(event);
                    }
                }
            }
        },

        /**
         * Delete feature
         * @method  _deleteFeature
         * @param   {String}       fid feuture identifier
         * @private
         */
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
                beforeSend : function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
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
                    var evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
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

        /**
         * Gets feature geometry index
         * @method  _getFeatureGeometryIndex
         * @param   {String}          geometryType geometry type, supported are: MultiPoint, MultiPolygon, MultiLineString
         * @return  {Integer}         geometry index
         * @private
         */
        _getFeatureGeometryIndex: function(geometryType) {
            var me = this;
            var clickedCoordsWGS84 = olProj.transform([me.clickCoords.x,  me.clickCoords.y], me.sandbox.getMap()._projectionCode, 'EPSG:4326');
            if(geometryType.indexOf('Multi') === -1) {
                // only supports MultiGeometries
                return -1;
            }

            var clickedTurfPoint = turf.point(clickedCoordsWGS84);

            // Get MultiPolygon geometry index
            if(geometryType === 'MultiPolygon') {
                return me.layerGeometries.geometry.getPolygons().findIndex(function(polygon){
                    return polygon.containsXY(me.clickCoords.x, me.clickCoords.y);
                });
            }

            // Get MultiPoint geometry index
            if(geometryType === 'MultiPoint') {
                return me.layerGeometries.geometry.getPoints().findIndex(function(point){
                    var coords = point.getCoordinates();
                    var coordWGS84 = olProj.transform(coords, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                    var from = turf.point(coordWGS84);
                    var distance = turf.distance(from, clickedTurfPoint);
                    return distance <= me._getZoomBasedClickToleranceThreshold();
                });
            }

            // Get MultiLineString geometry index
            if(geometryType === 'MultiLineString') {
                return me.layerGeometries.geometry.getLineStrings().findIndex(function(lineString){
                    var lineStringCoords = lineString.getCoordinates();
                    var lineStringTransformed = [];
                    for(var k = 0; k < lineStringCoords.length; ++k) {
                        var lineStringPoint = lineStringCoords[k];
                        var lineStringPointWGS84 = olProj.transform(lineStringPoint, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                        lineStringTransformed.push(lineStringPointWGS84);
                    }
                    var line = turf.lineString(lineStringTransformed);
                    //Get default distance
                    var distance = turf.pointToLineDistance(clickedTurfPoint, line);
                    return distance <= me._getZoomBasedClickToleranceThreshold();
                });
            }
        },

        /**
         * Handle delete geometry
         * @method  _handleDeleteGeometry
         * @private
         */
        _handleDeleteGeometry: function () {
            var me = this;

            var type = me.layerGeometries.geometry.getType();
            var featureGeometryIndex = me._getFeatureGeometryIndex(type);

            if (featureGeometryIndex !== -1) {
                var contentActions = [];

                // Cancel button
                var cancelButton = {
                    name: me.loc.buttons.cancel,
                    type: 'button',
                    group: 1,
                    action: function () {
                        var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')('contentEditor');
                        me.sandbox.request(me, request);
                        me._highlighGeometries(me.highlightFeaturesIds, me._getLayerById(me.selectedLayerId), true);
                    }
                };
                contentActions.push(cancelButton);

                // Delete button
                var deleteButton = {
                    name: me.loc.buttons.delete,
                    type: 'button',
                    group: 1,
                    action: function () {
                        var newCoords =  [];
                        me.layerGeometries.geometry.getCoordinates().forEach(function(coords, index) {
                            if(index!==featureGeometryIndex) {
                                newCoords.push(coords);
                            }
                        });

                        me.layerGeometries.geometry.setCoordinates(newCoords);
                        me.prepareRequest(null, true);
                        var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')('contentEditor');
                        me.sandbox.request(me, request);
                        me._enableGFIRequestProcess();
                    }
                };
                contentActions.push(deleteButton);

                var content = [{
                    html : me.templates.deleteDialog.clone(),
                    actions : contentActions
                }];

                var options = {
                    hidePrevious: true
                };
                var request = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest')('contentEditor', me.loc.deleteGeometryDialog.title, content, {lon:me.clickCoords.x, lat:me.clickCoords.y}, options);
                me.sandbox.request(me.getName(), request);
            }
            me.operationMode = 'edit';
        },

        /**
         * Clear features list
         * @method  _clearFeaturesList
         * @private
         */
        _clearFeaturesList: function () {
            var me = this;
            me.mainPanel.find('.properties-container').empty();
        },

        /**
         * Checks at form is valid
         * @method  _formIsValid
         * @return  {Boolean}     is valid?
         * @private
         */
        _formIsValid: function () {
            var me = this;
            if (me.mainPanel.find('.properties-container input.field-invalid').length > 0) {
                return false;
            }
            return true;
        },

        /**
         * Sets datepicker language
         * @method  _setDatepickerLanguage
         * @private
         */
        _setDatepickerLanguage: function () {
            var storedLanguage = jQuery.cookie('oskari.language');
            var lang = null;
            if (storedLanguage == null) {
                var supportedLanguages = Oskari.getSupportedLanguages();
                lang = 'en-GB';
                for (var i = 0; i < supportedLanguages.length; i++) {
                    if (supportedLanguages[i].indexOf('en') > -1) {
                        break;
                    }

                    if (supportedLanguages[i].indexOf('fi') > -1) {
                        lang = 'fi';
                        break;
                    }
                }
            } else {
                lang = storedLanguage;
            }

            jQuery.datepicker.setDefaults(
                  jQuery.extend(
                    jQuery.datepicker.regional[lang],
                    {'dateFormat':'yy-mm-dd'}
                  )
                );
        },

        /**
         * Enable GFI request process
         * @method  _enableGFIRequestProcess
         * @private
         */
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
