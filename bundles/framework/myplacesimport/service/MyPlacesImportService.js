/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
/**
 * @method create called automatically on construction
 * @static
 */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.urls = {};

        var srsName = this.sandbox.getMap().getSrsName();
        this.urls.create = Oskari.urls.getRoute('CreateUserLayer') + '&srs=' + srsName + '&sourceEpsg=' + srsName;
        this.urls.get = Oskari.urls.getRoute('GetUserLayers') + '&srs=' + srsName;
        this.urls.edit = Oskari.urls.getRoute('EditUserLayer');
        this.urls.getStyle = Oskari.urls.getRoute('GetUserLayerStyle');
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
        init: function () {
        },
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
     * Returns the url used to get userlayer style.
     *
     * @method getUserLayerStyleUrl
     * @return {String}
     */
        getGetUserLayerStyleUrl: function () {
            return this.urls.getStyle;
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
            var me = this,
                url = this.urls.get;

            if (id) url += ('&id=' + id);

            jQuery.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    if (response) {
                        me._addLayersToService(response.userlayers, successCb);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (_.isFunction(errorCb) && jqXHR.status !== 0) {
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
            var mapLayerService = this.sandbox
                    .getService('Oskari.mapframework.service.MapLayerService'),
                layer = mapLayerService.findMapLayer(id),
                request = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest')(id, true),
                layerIsSelected = this.sandbox.isLayerAlreadySelected(id),
                evt = Oskari.eventBuilder('MapLayerEvent')(id, 'update');
            layer.setName(updatedLayer.name);
            layer.setSource(updatedLayer.source);
            layer.setDescription(updatedLayer.description);

            this.sandbox.notifyAll(evt);
            if (layerIsSelected) {
                this.instance.sandbox.request(this.instance, request);
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
        _addLayersToService: function (layers, cb) {
            var me = this;
            _.each(layers, function (layerJson) {
                me.addLayerToService(layerJson, true);
            });
            if (_.isFunction(cb)) cb();
            if (layers && layers.length > 0) {
                var event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // to-do: check if null is valid parameter here
                me.sandbox.notifyAll(event); // add user layers programmatically since normal link processing
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
            var mapLayerService = this.sandbox
                    .getService('Oskari.mapframework.service.MapLayerService'),
                // Create the layer model
                mapLayer = mapLayerService.createMapLayer(layerJson);
            // Add the layer to the map layer service
            mapLayerService.addLayer(mapLayer, skipEvent);
            if (_.isFunction(cb)) cb(mapLayer);

            return mapLayer;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
