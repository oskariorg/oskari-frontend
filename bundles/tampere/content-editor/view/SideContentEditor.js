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
        me.editMultipleFeaturesButton = null;
        me.editMultipleFeatures = false;
        me.templateFeatureMarkup = null;
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
         startNewDrawing: function (config) {
            this.sendDrawRequest(config);
        },
        /**
         * @method startNewDrawing
         * Sends a StartDrawRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @param config params for StartDrawRequest
         */
        sendDrawRequest: function (config) {
            var me = this,
                conf = jQuery.extend(true, {}, config);

            var startRequest = this.instance.sandbox.getRequestBuilder('DrawPlugin.StartDrawingRequest')(conf);
            this.instance.sandbox.request(this, startRequest);
        },
        /**
         * @method sendStopDrawRequest
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit) if propagateEvent != true
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        sendStopDrawRequest: function (isCancel) {
            var me = this;
            //var toolbarRequest = me.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            //me.sandbox.request(me, toolbarRequest);

            var request = this.instance.sandbox.getRequestBuilder('DrawPlugin.StopDrawingRequest')(isCancel);
            this.instance.sandbox.request(this, request);
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
         * Returns an OpenLayers feature or null.
         *
         *
         * @return {OpenLayers.Feature.Vector}
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
            var wkt = new OpenLayers.Format.WKT();
            for(var j = 0; j < geometries.length; j++) {
                if(geometries[j][0] === fid) {
                    var feature = wkt.read(geometries[j][1]);
                    var geometry = feature.geometry;
                    return {fid: fid, geometry: geometry};
                }
            }
            return null;
        },
        _addClickedFeature: function (clickedFeature) {
            var me = this;
            var wkt = new OpenLayers.Format.WKT();
            var feature = wkt.read(clickedFeature[1]);
            var geometry = feature.geometry;
            if (me.allClickedFeatures.length > 0) {
                var isNewFeature = true;
                for (var i = 0; i < me.allClickedFeatures.length; i++) {
                    if (me.allClickedFeatures[i].fid == clickedFeature[0]) {
                        isNewFeature = false;
                        me.allClickedFeatures[i].geometry = geometry;
                    }
                }

                if (isNewFeature == true)
                {
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

            me.setGeometryType(me.layerGeometries.geometry.id);
            me._addDrawTools();
        },
        _editMultipleFeatures: function (fid) {
            var me = this;
            var geometry = me._findGeometryByFid(fid);
            if (geometry != null) {
                me.layerGeometries = geometry;
            }
            me.setGeometryType(me.layerGeometries.geometry.id);
            jQuery.each(me.templateFeatureMarkup[0].rows || [], function(index, el) {
                var $el = jQuery(el);
                jQuery.each(el.cells ||[], function(i, cell) {
                    var $cell = jQuery(cell);
                    if(i > 0) {
                        var $input = $cell.find("input");
                        if($input.length > 0) {
                            $input.addClass('template-feature');
                            $input.val("");
                            $input.attr("data-default", "");
                            $input.off('blur.modifyMultipleFeatures');
                        } else {
                            $cell.text("");
                        }
                    } else if($cell.text() === "__fid") {
                        $el.hide();
                    }
                });
            });
            var saveMultipleFeaturesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveMultipleFeaturesButton.setTitle(me.loc.buttons.save);
            saveMultipleFeaturesButton.setHandler(function () {
                var $thisInput = jQuery(this);
                var yesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                yesButton.setTitle(me.loc.buttons.yes);
                yesButton.setHandler(function () {
                    var $templateInputs = jQuery("input.template-feature");
                    jQuery.each($templateInputs || [], function(key, value){
                        var $input = jQuery(value);
                        if($input.val()) {
                            var dataKey = $input.data("key");
                            var newValue = $input.val();
                            var elements = jQuery(".getinforesult_table td[data-key="+dataKey+"]");
                                jQuery.each(elements || [], function(k, v){
                                jQuery(v).text(newValue);
                            });
                        }
                    });
                    me.closeDialog();
                    me._saveFeature();
                });
                var noButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                noButton.setTitle(me.loc.buttons.no);
                noButton.setHandler(function () {
                    me.closeDialog();
                });
                me.showMessage(me.loc.modifyMultipleFeaturesConfirmation.title, me.loc.modifyMultipleFeaturesConfirmation.text, [yesButton, noButton]);
            });
            var cancelMultipleFeaturesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelMultipleFeaturesButton.setTitle(me.loc.buttons.cancel);
            cancelMultipleFeaturesButton.setHandler(function () {
                jQuery(".content-editor-multiple").html("");
                jQuery(".content-editor-multiple-buttons").html("");
            });
            var buttonsContainer = jQuery("<div/>").addClass("content-editor-multiple-buttons").addClass("content-editor-buttons");
            saveMultipleFeaturesButton.insertTo(buttonsContainer);
            cancelMultipleFeaturesButton.insertTo(buttonsContainer);
            jQuery(".properties-container").prepend(buttonsContainer);
            var editorContainer = jQuery("<div/>").addClass("content-editor-multiple");
            editorContainer.html(me.templateFeatureMarkup);
            jQuery(".properties-container").prepend(editorContainer);
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
            drawPlugin = Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', {id: 'ContentEditorDrawPlugin',multipart: true});
            mapModule.registerPlugin(drawPlugin);
            mapModule.startPlugin(drawPlugin);
            this.drawPlugin = drawPlugin;

            container.append(content);
            $(".icon-close").on('click', function(){
                me.sendStopDrawRequest(true);
                me.instance.setEditorMode(false);
            });

            content.find('div.header h3').append(me.loc.title);

            content.find('.content').append($("<div>" + me.loc.featureModifyInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.multipleFeatureModifyInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.toolInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.geometryModifyInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.geometryDeleteInfo + "</div>"));
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
            var addFeatureButtonContainer = $("<div />");
            //Modify multiple features.
            me.editMultipleFeaturesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.editMultipleFeaturesButton.setTitle(me.loc.buttons.editMultipleFeatures);
            me.editMultipleFeaturesButton.setEnabled(false);
            me.editMultipleFeaturesButton.insertTo(addFeatureButtonContainer);
            addFeatureButton.insertTo(addFeatureButtonContainer);
            content.find('.content').append(addFeatureButtonContainer);

            me._addDrawTools(content);

            content.find('.content').append($("<div />").addClass("properties-container"));

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
                url : ajaxUrl + 'action_route=GetWFSLayerGeometryType',
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
                url : ajaxUrl + 'action_route=GetWFSDescribeFeature&layer_id=' + me.layerId,
                success : function(response) {
                    me.fieldsTypes = response.propertyTypes;
                }
            });
        },
        _fillLayerGeometries: function(geometries)
        {
            if (this.layerGeometries != null && this.layerGeometries.geometry != null) {
                var layerGeometries = JSON.parse(new OpenLayers.Format.GeoJSON().write(this.layerGeometries.geometry));
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
        _fillMultipleLayerGeometries: function(geometries)
        {
            var me = this;
            jQuery.each(me.allClickedFeatures || [], function(key, value) {
                if (value.geometry != null) {
                    var layerGeometries = JSON.parse(new OpenLayers.Format.GeoJSON().write(value.geometry));
                    if (layerGeometries != null) {
                        if (layerGeometries.type == "Point") {
                            geometries.type = "point";
                            geometries.data.push({x: layerGeometries.coordinates[0], y: layerGeometries.coordinates[1]});
                        } else if (layerGeometries.type == "MultiPoint") {
                            geometries.type = "multipoint";
                            for (var i = 0; i < layerGeometries.coordinates.length; i++) {
                                geometries.data.push({x: layerGeometries.coordinates[i][0], y: layerGeometries.coordinates[i][1]});
                            }
                        } else if (layerGeometries.type == "MultiLineString") {
                            geometries.type = "multilinestring";
                            for (var i = 0; i < layerGeometries.coordinates.length; i++) {
                                var tmpLineString = [];
                                for (var j = 0; j < layerGeometries.coordinates[i].length; j++) {
                                    tmpLineString.push({x: layerGeometries.coordinates[i][j][0], y: layerGeometries.coordinates[i][j][1]});
                                }
                                geometries.data.push(tmpLineString);
                            }
                        } else if (layerGeometries.type == "MultiPolygon") {
                            geometries.type = "multipolygon";
                            for (var i = 0; i < layerGeometries.coordinates.length; i++) {
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
            });
        },
        /**
         * Performs a deep clone of an object recursively.
         * @todo This should be in tool functions or somewhere else?
         * @param  object clonee The object to be cloned
         * @return object Cloned object
         */
        _cloneObject: function(clonee) {
            var me = this;
            if (clonee === null || typeof clonee !== 'object') {
                return clonee;
            }
            var cloned = clonee.constructor();
            for (var key in clonee) {
                cloned[key] = me._cloneObject(clonee[key]);
            }
            return cloned;
        },
        sendRequest: function (requestData, deleteFeature) {
            var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
            overlay.overlay('body');
            overlay.followResizing(true);
            var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
            spinner.insertTo('body');
            spinner.start();
            var me = this,
                okButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                url = null,
                wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            okButton.setTitle(me.loc.buttons.ok);
            var multipleFeaturesData = [];
            if (me.operationMode === "create" && !me.editMultipleFeatures) {
                url = ajaxUrl + 'action_route=InsertFeature';
            } else if(!me.editMultipleFeatures) {
                url = ajaxUrl + 'action_route=SaveFeature';
            } else if(me.editMultipleFeatures) {
                var multipleGeometriesTemp = me._cloneObject(requestData.geometries);
                url = ajaxUrl + 'action_route=SaveMultipleFeatures';
                var elements = jQuery(".getinforesult_table").children("tbody");
                var index = 0;
                jQuery.each(elements || [], function(k1, v1) {
                    //Skip first element since we have that already in requestData.
                    if(index > 0) {
                        //Copy requestData object for each of the selected features.
                        var tempFeature = me._cloneObject(requestData);
                        var tempFeatureFields = [];
                        var tds = jQuery(v1).children("tr").children("td");
                        //Go through all the tds to assign tempFeature the correct values.
                        jQuery.each(tds || [], function(k2, v2) {
                            var td = jQuery(v2);
                            if(td.data().key) {
                                var featureKey = td.data().key;
                                if(featureKey === "__fid") {
                                    tempFeature.featureId = td.text();
                                } else {
                                    var tempObj = {};
                                    tempObj.key = featureKey;
                                    tempObj.value = td.text();
                                    tempFeatureFields.push(tempObj);
                                }
                            }
                        });
                        tempFeature.featureFields = tempFeatureFields;
                        //The actual geometry is indexed one behind in the selected geometries list.
                        tempFeature.geometries.data = [multipleGeometriesTemp.data[index-1]];
                        multipleFeaturesData.push(tempFeature);
                    }
                    ++index;
                });
            }
            var dialog = {};
            if (deleteFeature == true) {
                dialog.header = me.loc.geometryDelete.header;
                dialog.success = me.loc.geometryDelete.success;
                dialog.error = me.loc.geometryDelete.error;
            } else if(me.editMultipleFeatures) {
                dialog.header = me.loc.multipleFeaturesUpdate.header;
                dialog.success = me.loc.multipleFeaturesUpdate.success;
                dialog.error = me.loc.multipleFeaturesUpdate.error;
            } else {
                dialog.header = me.loc.featureUpdate.header;
                dialog.success = me.loc.featureUpdate.success;
                dialog.error = me.loc.featureUpdate.error;
            }
            jQuery.ajax({
                type : 'POST',
                dataType : 'json',
                beforeSend : function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data : {'featureData':(me.editMultipleFeatures) ? JSON.stringify(multipleFeaturesData) : JSON.stringify(requestData)},
                url : url,
                success : function(response) {
                    spinner.stop();
                    overlay.close();
                    me.editMultipleFeaturesButton.setEnabled(false);
                    me.editMultipleFeatures = false;
                    if (me.operationMode === "create" && !me.editMultipleFeatures) {
                        me.currentData.features[0][0] = response.fid;
                    }

                    me._clearFeaturesList();
                    var layer = me._getLayerById(me.layerId);
                    me._highlighGeometries([], layer, true);
                    wfsLayerPlugin.deleteTileCache(me.layerId, layer.getCurrentStyle().getName());
                    // wfsLayerPlugin.refreshLayer(me.layerId);
                    var evt = me.sandbox.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                    me.sandbox.notifyAll(evt);
                    me.sendStopDrawRequest(true);

                    okButton.setHandler(function () {
                        setTimeout(function() {
                            var visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                                request = visibilityRequestBuilder(me.layerId, true);
                            me.sandbox.request(me.instance.getName(), request);
                        }, 500);
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.success, [okButton]);
                    me.clickedGeometryNumber = null;
                },
                error: function (error) {
                    spinner.stop();
                    overlay.close();
                    me.editMultipleFeaturesButton.setEnabled(false);
                    me.editMultipleFeatures = false;
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.error, [okButton]);
                    me.sendStopDrawRequest(true);
                }
            });
            /**/
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
            if (!me.editMultipleFeatures && (me.operationMode == "edit" || deleteFeature == true)) {
                me._fillLayerGeometries(requestData.geometries);
            } else if(me.editMultipleFeatures) {
                me._fillMultipleLayerGeometries(requestData.geometries);
            }
            if (geometries != null)
            {
                if (geometries.id.indexOf("OpenLayers_Geometry_MultiPoint_") == 0) {
                    requestData.geometries.type = "multipoint";
                    for (var i = 0; i < geometries.components.length; i++) {
                        requestData.geometries.data.push({x: geometries.components[i].x, y: geometries.components[i].y});
                    }
                } else if (geometries.id.indexOf("OpenLayers_Geometry_MultiLineString_") == 0) {
                    requestData.geometries.type = "multilinestring";
                    for (var i = 0; i < geometries.components.length; i++) {
                        var tmpLineString = [];
                        for (var j = 0; j < geometries.components[i].components.length; j++) {
                            tmpLineString.push({x: geometries.components[i].components[j].x, y: geometries.components[i].components[j].y});
                        }
                        requestData.geometries.data.push(tmpLineString);
                    }
                } else if (geometries.id.indexOf("OpenLayers_Geometry_MultiPolygon_") == 0) {
                    requestData.geometries.type = "multipolygon";
                    for (var i = 0; i < geometries.components.length; i++) {
                        var tmpPolygon = [];
                        for (var j = 0; j < geometries.components[i].components.length; j++) {
                            var tmpLinearString = [];
                            for (var k = 0; k < geometries.components[i].components[j].components.length; k++) {
                                tmpLinearString.push({x: geometries.components[i].components[j].components[k].x, y: geometries.components[i].components[j].components[k].y});
                            }
                            tmpPolygon.push(tmpLinearString);
                        }
                        requestData.geometries.data.push(tmpPolygon);
                    }
                }
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

            var gfiActivationRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
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
            var gfiActivationRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
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
            var visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
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
            for (var i = 0; i < data.features.length; i++) {
                if ((editableFeatureFid === undefined || data.features[i][0] == editableFeatureFid) && (data.features[i] != ""))
                me.highlightFeaturesIds.push(data.features[i][0].split('.')[1]);
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

            $('.content-draw-tools').removeClass('hide');
            fragments = this._formatWFSFeaturesForInfoBox(data, editableFeatureFid);

            $(".properties-container").empty();
            if (fragments != null && fragments.length) {
                if(fragments.length > 1) {
                    me.editMultipleFeaturesButton.setEnabled(true);
                    me.editMultipleFeaturesButton.setHandler(function () {
                        me.editMultipleFeatures = true;
                        jQuery.each(fragments || [], function(key, value) {
                            if(key === 0) {
                                me._editMultipleFeatures(value.fid);
                            }
                        });
                    });
                } else {
                    me.editMultipleFeaturesButton.setEnabled(false);
                }

                contentData.html = this._renderFragments(fragments, editableFeatureFid);
                contentData.layerId = fragments[0].layerId;
                contentData.layerName = fragments[0].layerName;
                contentData.featureId = data.features[0][0];
                content.push(contentData);
                $(".properties-container").append(contentData.html);
                me._setDatepickerLanguage();
                $(".datepicker").datepicker({'dateFormat': "yy-mm-dd", 'changeMonth': true, 'changeYear': true, 'showButtonPanel': true}).attr('readonly', 'readonly');
            } else {
                me.editMultipleFeaturesButton.setEnabled(false);
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
                $.each(me.fieldsTypes, function(key, value) {
                   if(!value.startsWith("gml:")) { //skip geometry
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
                var retObj = {
                    markup: markup,
                    layerId: data.layerId,
                    layerName: layer.getLayerName(),
                    type: type,
                    fid: feat.__fid
                };
                me.templateFeatureMarkup = me._json2html(feat, false);
                return retObj;
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
                html = $(this.templates.getinfoResultTable),
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
                            valpres = $(this.templates.linkOutside);
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
                            valueDiv = $(this.templates.wrapper);
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

                    row = $(this.templates.tableRow);
                    // FIXME this is unnecessary, we can do this with a css selector.
                    if (!even) {
                        row.addClass('odd');
                    }

                    keyColumn = $(this.templates.tableCell);
                    keyColumn.append(key);
                    row.append(keyColumn);

                    valColumn = $(this.templates.tableCell);
                    if (key == "__fid" || readonly) {
                        valColumn.append(value);
                        valColumn.attr('data-key', key);
                    } else {
                        valInput = $(this.templates.tableInput);
                        valInput.attr('data-key', key);
                        valInput.attr('data-default', value);
                        switch (this.fieldsTypes[key])
                        {
                            case 'xsd:numeric':
                                valInput.prop('type', 'number');
                                valInput.on('blur', function (event) {
                                    if ($.isNumeric($(this).val()) == false) {
                                        $(this).addClass('field-invalid');

                                        var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                        okButton.setTitle(me.loc.buttons.ok);
                                        okButton.setHandler(function () {
                                            me.closeDialog();
                                        });
                                        me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                    }
                                });
                                valInput.on('keyup', function (event) {
                                    if ($.isNumeric($(this).val())) {
                                        $(this).removeClass('field-invalid');
                                    }
                                });
                                break;
                            case 'xsd:double':
                            case 'xsd:decimal':
                                valInput.prop('type', 'number').prop('step', 0.01);
                                valInput.on('blur', function (event) {
                                    if ($.isNumeric($(this).val()) == false) {
                                        $(this).addClass('field-invalid');

                                        var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                        okButton.setTitle(me.loc.buttons.ok);
                                        okButton.setHandler(function () {
                                            me.closeDialog();
                                        });
                                        me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                    }
                                });
                                valInput.on('keyup', function (event) {
                                    if ($.isNumeric($(this).val())) {
                                        $(this).removeClass('field-invalid');
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
                        //If multiple features are modified at the same time, add also blur for modifying those values.
                        if(me.editMultipleFeatures) {
                            valInput.on('blur.modifyMultipleFeatures', function(event){
                                var $thisInput = jQuery(this);
                                var yesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                yesButton.setTitle(me.loc.buttons.yes);
                                yesButton.setHandler(function () {
                                    var key = $thisInput.data("key");
                                    var newValue = $thisInput.val();
                                    var elements = jQuery(".getinforesult_table td[data-key="+key+"]");
                                    jQuery.each(elements || [], function(key, value){
                                        jQuery(value).text(newValue);
                                    });
                                    me.closeDialog();
                                });
                                var noButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                noButton.setTitle(me.loc.buttons.no);
                                noButton.setHandler(function () {
                                    $thisInput.val($thisInput.attr("data-default"));
                                    $thisInput.text($thisInput.attr("data-default"));
                                    me.closeDialog();
                                });
                                me.showMessage(me.loc.modifyMultipleFeaturesConfirmation.title, me.loc.modifyMultipleFeaturesConfirmation.text, [yesButton, noButton]);
                            });
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
            me.editMultipleFeaturesButton.setEnabled(false);
            me.editMultipleFeatures = false;
        },
        _storeFormData: function () {
            var me = this;
            $(".getinforesult_table tr input").each(function (index) {
                me.currentData.features[0][index+1] = $(this).val();
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
                    var contentWrapper = $(me.templates.wrapper),
                        headerWrapper = $(me.templates.header),
                        titleWrapper = $(me.templates.headerTitle),
                        actionButtonWrapper = $(me.templates.wrapper);

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
                        var drawToolsContainer = $("<div/>").addClass("content-draw-tools");
                        drawToolsContainer.append(me._addDrawTools());
                        contentWrapper.append(drawToolsContainer);

                        var buttonsContainer = $("<div/>").addClass("content-editor-buttons");
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
            }, $(me.templates.wrapper));
        },
        _getFeatureData: function () {
            var result = [];
            $('.edit-feature .getinforesult_table').first().find('tr').each(function () {
                var key = $(this).find('td').eq(0).html();
                var val = null;
                if ($(this).find('td').eq(1).find("input").length > 0) {
                    val = $(this).find('td').eq(1).find("input").val();
                } else {
                    val = $(this).find('td').eq(1).html();
                }

                result.push({ "key": key, "value": val });
            });

            return result;
        },
        _parseLayerGeometryResponse: function (response) {
            if (response == "gml:MultiPointPropertyType" || response.indexOf("OpenLayers_Geometry_MultiPoint_") > -1)
            {
                this.layerGeometryType = "MultiPoint";
            }
            else if (response.indexOf("OpenLayers_Geometry_Point_") > -1)
            {
                this.layerGeometryType = "Point";
            }
            else if (response == "gml:MultiLineStringPropertyType" || response.indexOf("OpenLayers_Geometry_MultiLineString_") > -1)
            {
                this.layerGeometryType = "MultiLineString";
            }
            else if (response == "gml:MultiPolygonPropertyType" || response == "gml:MultiSurfacePropertyType" || response.indexOf("OpenLayers_Geometry_MultiPolygon_") > -1)
            {
                this.layerGeometryType = "MultiPolygon";
            }
            else if (response.indexOf("OpenLayers_Geometry_Polygon_") > -1) {
                this.layerGeometryType = "Polygon";
            }
            else if (response == "gml:GeometryPropertyType")
            {
                this.layerGeometryType = "GeometryPropertyType";
            }
        },
        _addDrawTools: function () {
            var me = this;
            $(".content-draw-tools").empty();
            var pointButton = $("<div />").addClass('add-point tool').attr('title', me.loc.tools.point);
            if (me.layerGeometryType == "MultiPoint" || me.layerGeometryType == "Point" || me.layerGeometryType == "GeometryPropertyType") {
                pointButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing({
                            drawMode: 'point'
                        });
                });
            } else {
                pointButton.addClass("disabled");
            }

            var lineButton = $("<div />").addClass('add-line tool').attr('title', me.loc.tools.line);
            if (me.layerGeometryType == "MultiLineString" || me.layerGeometryType == "GeometryPropertyType") {
                lineButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing({
                            drawMode: 'line'
                        });
                });
            } else {
                lineButton.addClass("disabled");
            }

            var areaButton = $("<div />").addClass('add-area tool').attr('title', me.loc.tools.area);
            if (me.layerGeometryType == "MultiPolygon" || me.layerGeometryType == "Polygon" || me.layerGeometryType == "GeometryPropertyType") {
                areaButton.on('click', function() {
                        me.drawingActive = true;
                        me.startNewDrawing({
                            drawMode: 'area'
                        });
                });
            } else {
                areaButton.addClass("disabled");
            }

            var geomEditButton = $("<div />").addClass('selection-area tool').attr('title', me.loc.tools.geometryEdit);
            if (me.layerGeometryType != null) {

                geomEditButton.on('click', function() {
                    me.drawingActive = true;
                    me.drawToolType = "edit";
                    me.clickedGeometryNumber = null;
                    if (me.layerGeometries.geometry.id.indexOf("Multi") > -1) {
                        if (me.layerGeometries.geometry.components != undefined) {
                            for (var i = 0; i < me.layerGeometries.geometry.components.length; i++) {
                                if (me.layerGeometries.geometry.components[i].atPoint({lon:me.clickCoords.x,lat:me.clickCoords.y}, 2, 2))
                                {
                                    me.clickedGeometryNumber = i;
                                    break;
                                }
                            }
                        }
                    } else {
                        me.clickedGeometryNumber = null;
                    }

                    me.startNewDrawing({
                        drawMode: 'area'
                    });
                    me.sendStopDrawRequest(true);
                    me.startNewDrawing({
                        geometry: (me.clickedGeometryNumber != null ? me.layerGeometries.geometry.components[me.clickedGeometryNumber] : me.layerGeometries.geometry)
                    });
                });
            } else {
                geomEditButton.addClass("disabled");
            }

            var geomDeleteButton = $("<div />").addClass('selection-remove tool').attr('title', me.loc.tools.remove);

            if (me.operationMode === "create")  {
                geomDeleteButton.addClass("disabled");
            } else {
                geomDeleteButton.on('click', function() {
                    me.sendStopDrawRequest(true);
                    me.operationMode = "delete";
                });
            }

            var toolContainer = $("<div />").addClass('toolrow');
            toolContainer.append(pointButton);
            toolContainer.append(lineButton);
            toolContainer.append(areaButton);
            toolContainer.append(geomEditButton);
            toolContainer.append(geomDeleteButton);
            $('.content-draw-tools').append(toolContainer);
            return toolContainer;
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
                url : ajaxUrl + 'action_route=DeleteFeature',
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
                            var visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest');
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
                    var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')("contentEditor");
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
                    var request = me.sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')("contentEditor");
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
                var request = me.sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')("contentEditor", me.loc.deleteGeometryDialog.title, content, new OpenLayers.LonLat(featureGeometry.getCentroid().x, featureGeometry.getCentroid().y), options);
                me.sandbox.request(me.getName(), request);
                $("#delete-dialog").parent().parent().css('height', 'auto').css('padding-bottom', '30px');
            }
            me.operationMode = "edit";
        },
        _clearFeaturesList: function () {
            $(".properties-container").empty();
        },
        _formIsValid: function () {
            if ($(".properties-container input.field-invalid").length > 0) {
                return false;
            }
            return true;
        },
        _setDatepickerLanguage: function () {
            var storedLanguage = $.cookie('oskari.language');
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

            $.datepicker.regional['fi'] = {
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

            $.datepicker.setDefaults(
                  $.extend(
                    $.datepicker.regional[lang],
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
