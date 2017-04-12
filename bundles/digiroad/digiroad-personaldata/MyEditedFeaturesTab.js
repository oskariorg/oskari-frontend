/**
 * @class Oskari.digiroad.bundle.personaldata.MyEditedFeaturesTab
 * Renders the "personal data" myplaces tab.
 */
Oskari.clazz.define('Oskari.digiroad.bundle.personaldata.MyEditedFeaturesTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
 * instance
 *      reference to component that created the tile
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
    this.dataTypeLoc = Oskari.getLocalization("FeatureSelector")['gridheaders'];
    this.tabsContainer = undefined;
    this.tabPanels = {};

    this.linkTemplate = jQuery('<a href="JavaScript:void(0);"></a>');
    this.iconTemplate = jQuery('<div class="icon"></div>');
}, {
    /**
     * @method getName
     * @return {String} name of the component
     * (needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this))
     */
    getName : function() {
        return 'DigiroadPersonalData.MyEditedFeatures';
    },
    getTitle : function() {
        return this.loc.title;
    },
    addTabContent : function(container) {
        var me = this;

        this.tabsContainer =
            Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer',
            this.loc['nocategories']);
        this.tabsContainer.insertTo(container);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'MyPlaces.EditedFeaturesLoadedEvent': function(event) {
            var features = event.getFeatures();
            this.initialFeatureLoad(features);
        }
    },

    initialFeatureLoad: function(features) {
        var dataType,
            panel,
            f;

        // Remove all the panels if there are no features to show.
        // This is kind of a tweak to empty the panels after the user
        // deletes the last feature of a data type.
        if(!features.length) {
            for(pan in this.tabPanels) {
                this.tabsContainer.removePanel(this.tabPanels[pan])
            }
            return;
        }

        // Determining the dataTypes ('nopeusrajoitus' etc.) for each feature.
        // Also creating the tab panels and grids.
        for(var i = 0; i < features.length; ++i) {
            var f = features[i],
            dataType = f.attributes['TIETOLAJI'];

            panel = this.tabPanels[dataType];
            if(!panel) {
                panel = this._createDataTypeTab(dataType);
                this.tabsContainer.addPanel(panel);
                this.tabPanels[dataType] = panel;
            }
        }

        // Populate the data to each of the grids created in the loop above.
        for(var pName in this.tabPanels) {
            this._populateEditedFeatures(pName, features);
            panel = this.tabPanels[pName];
            panel.getContainer().empty();
            panel.grid.renderTo(panel.getContainer());
        }
    },

    /**
     * @method _showPlace
     * Moves the map so the given geometry is visible on viewport. Adds the myplaces
     * layer to map if its not already selected.
     * @param {OpenLayers.Geometry} geometry place geometry to move map to
     * @param {Number} categoryId categoryId for the place so we can add it's layer to map
     * @private
     */
    _showPlace : function(geometry) {
        // center map on selected place
        var center = geometry.getCentroid();
        var mapmoveRequest = this.instance.sandbox.getRequestBuilder('MapMoveRequest')(center.x, center.y, geometry.getBounds());
        this.instance.sandbox.request(this.instance, mapmoveRequest);

        // add the myplaces layer to map
        var layerId = "muokatut_kohteet";
        var layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
            var request = this.instance.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
            this.instance.sandbox.request(this.instance, request);
        }
    },

    /**
     * @method _deletePlace
     * Confirms delete for given place and deletes it if confirmed. Also shows
     * notification about cancel, deleted or error on delete.
     * @param {Object} data grid data object for place
     * @private
     */
    _deletePlace : function(data) {
        var me = this;
        var sandbox = this.instance.sandbox;
        var loc = this.loc.notification['delete'];
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(loc.btnDelete);
        okBtn.addClass('primary');

        okBtn.setHandler(function() {
            dialog.close();
            var service = sandbox.getService('Oskari.digiroad.bundle.myplaces2.service.MyPlacesService');
            var callback = function(isSuccess) {
                /* let's refresh map also if there */
                var layerId = "muokatut_kohteet";
                var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
                if(layer) {
                    var updateRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')
                    var updateRequest = updateRequestBuilder(layerId, true);
                    sandbox.request(me.instance, updateRequest);
                }

                if(isSuccess) {
                    dialog.show(loc.title, loc.success);
                }
                else {
                    dialog.show(loc.title, loc['error']);
                }
                dialog.fadeout();
            };
            var protocolType;
            if(data.layerType === "SEGMENTTI_MUUTOS") {
                protocolType = "edited_segments";
            } else if(data.layerType === "LIIKENNE_ELEMENTTI_MUUTOS") {
                protocolType = "edited_elements";
            }
            service.deleteEditedFeature(protocolType, data.id, callback);
        });
        var cancelBtn = dialog.createCloseButton(loc.btnCancel);
        var confirmMsg = loc.confirm;
        dialog.show(loc.title, confirmMsg, [cancelBtn, okBtn]);
        dialog.makeModal();
    },

    /**
     * @method _createDataTypeTab
     * Populates given data type's grid
     * @param {String} dataType e.g. "nopeusrajoitus"
     */
    _createDataTypeTab : function(dataType) {
        if(!dataType) {
            return;
        }
        var me = this;
        var columns = this.dataTypeLoc[dataType].columns;

        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        panel.setTitle(this.dataTypeLoc[dataType]['h2']);
        panel.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

        var specificVisibleFields = [];
        for(var i = 0; i < columns.length; ++i) {
            specificVisibleFields.push(columns[i].field);
        }
        var visibleFields = specificVisibleFields.concat(['createDate', 'delete']);
        panel.grid.setVisibleFields(visibleFields);

        // set up the link from name field
        var nameRenderer = function(name, data) {
            var link = me.linkTemplate.clone();
            var linkIcon = me.iconTemplate.clone();
            //var shape = me._getDrawModeFromGeometry(data.geometry);
            linkIcon.addClass('myplaces-line');
            //link.append(linkIcon);

            link.append(name);
            link.bind('click', function() {
                me._showPlace(data.geometry);
                return false;
            });
            return link;
        };
        panel.grid.setColumnValueRenderer(visibleFields[0], nameRenderer);

        var deleteRenderer = function(name, data) {
            var link = me.linkTemplate.clone();
            link.append(name);
            link.bind('click', function() {
                me._deletePlace(data);
                return false;
            });
            return link;
        };
        panel.grid.setColumnValueRenderer('delete', deleteRenderer);

        // setup localization
        for(var i=0; i < columns.length; ++i) {
            var key = columns[i].field;
            var value = columns[i].name;
            panel.grid.setColumnUIName(key, value);
        }
        panel.grid.setColumnUIName('createDate', this.loc.grid['createDate']);
        panel.grid.setColumnUIName('delete', this.loc.grid['delete']);
        return panel;
    },

    /**
     * @method _populatePlaces
     * Populates given categorys grid
     * @param {Number} categoryId id for category to populate
     */
    _populateEditedFeatures : function(dataType, features) {
        if(!features || !features.length) {
            return;
        }
        //var places = service.getAllMyPlaces();
        var panel = this.tabPanels[dataType];
        // update places
        var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        gridModel.setIdField('id');
        panel.grid.setDataModel(gridModel);

        for(var i = 0; i < features.length; ++i) {
            var f = features[i];
            if(f.attributes['TIETOLAJI'] !== dataType) {continue;}

            var data = this._getDataFieldsFor(f);
            gridModel.addData(data);
        }
    },
    /**
     * @method _formatDate
     * Formats timestamp for UI
     * @return {String}
     */
    _formatDate : function(service, date) {
        var time = service.parseDate(date);
        var value = '';
        if(time.length > 0) {
            value = time[0];
        }
        // skip time
        /*if(time.length > 1) {
            value = value  + ' ' + time[1];
        }*/
        return value;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {return;}

        return handler.apply(this, [event]);
    },

    /**
     * @method bindEvents
     * Register tab as eventlistener
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

    },
    /**
     * @method unbindEvents
     * Unregister tab as eventlistener
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.unregisterForEventByName(this, p);
        }
    },

    /**
     * @method _getDataFieldsFor
     * Creates a data object for the Oskari grid based on the feature's data type.
     * @param {Object} feature an OpenLayers feature object.
     * @return {Object} a Data object for the Oskari grid.
     */
    _getDataFieldsFor: function(feature) {
        var service = this.instance.sandbox.getService('Oskari.digiroad.bundle.myplaces2.service.MyPlacesService'),
            dataType = feature.attributes['TIETOLAJI'],
            data = {},
            specificDataFields = this.dataTypeLoc[dataType].columns;

        data['id']          = feature.attributes['ID'];
        data['layerType']   = feature.fid.split('.')[0]; // LIIKENNE_ELEMENTTI_MUUTOS or SEGMENTTI_MUUTOS
        data['geometry']    = feature.geometry;
        data['delete']      = this.loc['delete'];
        data['createDate']  = this._formatDate(service, feature.attributes['MUOKKAUS_PVM']);

        for(var i = 0; i < specificDataFields.length; ++i) {
            var field = specificDataFields[i].field,
                val = feature.attributes[field];
            data[field] = this._getNameFromValue(specificDataFields[i].id, val);
        }

        return data;
    },

    /**
     * @method _getNameFromValue
     * @param {String} id e.g. 'nopeusrajoitus'.
     * @param {Number} value an integer value of the data type.
     */
    _getNameFromValue: function(id, value) {
        var mappings = Oskari.getLocalization("FeatureSelector")['mappings'];
            return_value = null;

        if(mappings[id]) {
            return_value = mappings[id]['int'][value];
        }
        return return_value || value || "";
    }
});
