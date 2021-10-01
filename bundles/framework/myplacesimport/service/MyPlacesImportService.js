/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService', function (instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
    this.urls = {};

    const srsName = this.sandbox.getMap().getSrsName();
    this.urls.create = Oskari.urls.getRoute('CreateUserLayer', { srs: srsName });
    this.urls.get = Oskari.urls.getRoute('GetUserLayers', { srs: srsName });
    this.urls.edit = Oskari.urls.getRoute('EditUserLayer');
    // negative value for group id means that admin isn't presented with tools for it
    this.groupId = -1 * Oskari.seq.nextVal('usergeneratedGroup');
}, {
    __name: 'MyPlacesImport.MyPlacesImportService',
    __qname: 'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
    getQName: function () {
        return this.__qname;
    },
    getName: function () {
        return this.__name;
    },
    /**
     * Initializes the service (does nothing atm).
     *
     * @method init
     */
    init: function () {},
    /**
     * Returns the url used to send the file data to.
     *
     * @method getFileImportUrl
     * @return {String}
     */
    getFileImportUrl: function () {
        return this.urls.create;
    },
    /**
     * Returns the url used to update layer.
     *
     * @method getEditLayerUrl
     * @return {String}
     */
    getEditLayerUrl: function () {
        return this.urls.edit;
    },

    /**
     * Retrieves the user layers (with the id param only the specified layer)
     * from the backend and adds them to the map layer service.
     *
     * @method getUserLayers
     * @param  {Function} successCb (optional)
     * @param  {Function} errorCb (optional)
     * @param  {String} id (optional)
     */
    getUserLayers: function (successCb, errorCb, id) {
        const me = this;
        let url = this.urls.get;

        if (id) {
            url = url + '&id=' + id;
        }

        jQuery.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response) {
                    me._addLayersToService(response.userlayers, successCb);
                }
            },
            error: function (jqXHR, textStatus) {
                if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
        });
    },

    /**
     * Update userlayer name, source and description
     *
     * @method updateLayer
     * @param {String} id
     * @param {Object} updatedLayer
     */
    updateLayer: function (id, updatedLayer) {
        const layer = this.instance.getMapLayerService().findMapLayer(id);
        layer.setName(updatedLayer.name);
        layer.setSource(updatedLayer.source);
        layer.setDescription(updatedLayer.description);
        layer.setOptions(updatedLayer.options);
        var evt = Oskari.eventBuilder('MapLayerEvent')(id, 'update');
        this.sandbox.notifyAll(evt);
        if (this.sandbox.isLayerAlreadySelected(id)) {
            // update layer on map
            this.instance.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
            this.instance.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layer.getId()]);
        }
    },
    /**
     * Adds the layers to the map layer service.
     *
     * @method _addLayersToService
     * @private
     * @param {JSON[]} layers
     * @param {Function} cb
     */
    _addLayersToService: function (layers = [], cb) {
        // initialize the group these layers will be in:
        const mapLayerService = this.instance.getMapLayerService();
        const mapLayerGroup = mapLayerService.getAllLayerGroups(this.groupId);
        if (!mapLayerGroup) {
            const loclayer = this.instance.getLocalization().layer;
            const group = {
                id: this.groupId,
                name: {
                    [Oskari.getLang()]: loclayer.inspire
                }
            };
            mapLayerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
        }

        layers.forEach((layerJson) => {
            this.addLayerToService(layerJson, true);
        });
        if (typeof cb === 'function') {
            cb();
        }
        if (layers.length > 0) {
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // null as id triggers mass update
            this.sandbox.notifyAll(event);
        }
    },
    /**
     * Adds one layer to the map layer service
     * and calls the cb with the added layer model if provided.
     *
     * @method addLayerToService
     * @param {JSON} layerJson
     * @param {Boolean} skip add maplayer even in map-layer-service
     * @param {Function} cb (optional)
     */
    addLayerToService: function (layerJson, skipEvent, cb) {
        const mapLayerService = this.instance.getMapLayerService();
        // Create the layer model
        const mapLayer = mapLayerService.createMapLayer(layerJson);
        // mark that this has been added by this bundle.
        // There might be other userlayer typed layers in maplayerservice from link parameters that might NOT be this users layers.
        // This is used to filter out other users shared layers when listing layers on the My Data functionality.
        mapLayer.markAsInternalDownloadSource();
        // Add organization and groups for users own datasets (otherwise left empty/data from baselayer)
        var loclayer = this.instance.getLocalization().layer;
        mapLayer.setOrganizationName(loclayer.organization);
        mapLayer.setGroups([{
            id: this.groupId,
            name: loclayer.inspire
        }]);
        // Add the layer to the map layer service
        mapLayerService.addLayer(mapLayer, skipEvent);
        if (typeof cb === 'function') {
            cb(mapLayer);
        }
        return mapLayer;
    }
}, {
    protocol: ['Oskari.mapframework.service.Service']
});
