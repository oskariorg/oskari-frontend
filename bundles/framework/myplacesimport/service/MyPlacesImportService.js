import { Messaging } from 'oskari-ui/util';
import { ERRORS } from '../constants';
/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService', function (instance) {
    this.instance = instance;
    this.srs = instance.getSandbox().getMap().getSrsName();
    // negative value for group id means that admin isn't presented with tools for it (-1 is reserved for default group)
    this.groupId = -10 * Oskari.getSeq('usergeneratedGroup').nextVal();
    this.log = Oskari.log('MyPlacesImportService');
    Oskari.makeObservable(this);
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
    getFileImportUrl: function (sourceSrs) {
        const params = {
            srs: this.srs
        };
        if (sourceSrs) {
            params.sourceEpsg = `EPSG:${sourceSrs}`;
        }
        return Oskari.urls.getRoute('CreateUserLayer', params);
    },

    submitUserLayer: function (values, successCb, errorCb) {
        const { sourceSrs, locale, style, file } = values;
        const formData = new FormData();
        formData.append('locale', JSON.stringify(locale));
        formData.append('style', JSON.stringify(style));
        formData.append('file', file);

        fetch(this.getFileImportUrl(sourceSrs), {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok && response.status !== 400) {
                // if bad request try to dig error code from json
                throw Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const { error, info } = json;
            if (error) {
                this.log.error(error);
                this._handleErrorResponse(info, errorCb);
                return;
            }
            this._showSuccess('flyout.success', { count: json.featuresCount });
            this._handleImportedLayer(json);
            successCb();
        }).catch(error => {
            this.log.error(error);
            this._showError('flyout.error.generic');
            errorCb();
        });
    },

    updateUserLayer: function (layerId, values, successCb, errorCb) {
        const id = this.getActualId(layerId);
        fetch(Oskari.urls.getRoute('EditUserLayer', { id, srs: this.srs }), {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            this.updateLayer(json);
            this._showSuccess('tab.notification.editedMsg');
            successCb();
        }).catch(error => {
            this.log.error(error);
            this._showError('tab.error.editMsg');
            errorCb();
        });
    },
    _handleErrorResponse: function (info, errorCb) {
        const { error, extensions = [], cause, parser } = info || {};
        let errorKey = error || ERRORS.GENERIC;
        // Parser error has cause which is used for localized message
        if (error === ERRORS.PARSER) {
            if (cause === ERRORS.NO_SRS) {
                errorKey = parser === 'shp' ? 'shpNoSrs' : 'noSrs';
            } else if (cause === ERRORS.FORMAT) {
                errorKey = cause;
            }
        }
        // pass args for localization even them aren't needed for requested errorKey
        const args = {
            maxSize: this.instance.handler.getMaxSize(),
            extensions: extensions.join(',')
        };
        this._showError(`flyout.error.${errorKey}`, args);
        // Only unknown srs is handled differently, use cause for callback
        errorCb(cause);
    },
    _showError: function (locKey, args) {
        const content = this.instance.loc(locKey, args);
        Messaging.error({ content, duration: 10 });
    },

    _showSuccess: function (locKey, args) {
        const content = this.instance.loc(locKey, args);
        Messaging.success({ content, duration: 10 });
    },
    _showWarning: function (warning = {}) {
        const { featuresSkipped } = warning;
        if (!featuresSkipped) {
            return;
        }
        const content = this.instance.loc('flyout.warning.features_skipped', { count: featuresSkipped });
        Messaging.warn({ content, duration: 10 });
    },
    /**
     * Retrieves the user layers
     * from the backend and adds them to the map layer service.
     *
     * @method getUserLayers
     */
    getUserLayers: function () {
        fetch(Oskari.urls.getRoute('GetUserLayers', { srs: this.srs }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            this._addLayersToService(json.userlayers);
        }).catch(error => {
            // this._showError('tab.error.load');
            this.log.error(error);
        });
    },
    getActualId: function (layerId) {
        const tokenIndex = layerId.lastIndexOf('_') + 1;
        return layerId.substring(tokenIndex);
    },
    /**
     * @method _deleteUserLayer
     * Request backend to delete user layer. On success removes the layer
     * from map and layerservice. On failure displays a notification.
     * @param layer layer userlayer data to be destroyed
     */
    deleteUserLayer: function (layerId) {
        const id = this.getActualId(layerId);
        fetch(Oskari.urls.getRoute('DeleteUserLayer', { id }), {
            method: 'POST'
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            this._showSuccess('tab.notification.deletedMsg');
            this._removeLayerFromService(layerId);
        }).catch(error => {
            this._showError('tab.error.deleteMsg');
            this.log.error(error);
        });
    },

    notifyUpdate: function () {
        this.trigger('update');
    },
    /**
     * Update userlayer name, source and description
     *
     * @method updateLayer
     * @param {String} id
     * @param {Object} updatedLayer
     */
    updateLayer: function (updatedLayer) {
        const { id, locale, options } = updatedLayer;
        const layer = this.instance.getMapLayerService().findMapLayer(id);
        if (!layer) {
            this.log.error('Could not find layer for update with id:' + id);
            return;
        }
        layer.setLocale(locale);
        layer.setOptions(options);
        layer.setStylesFromOptions(options);
        const sandbox = this.instance.getSandbox();
        const evt = Oskari.eventBuilder('MapLayerEvent')(id, 'update');
        sandbox.notifyAll(evt);
        this.notifyUpdate();
        if (sandbox.isLayerAlreadySelected(id)) {
            // update layer on map
            sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
            sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layer.getId()]);
        }
    },
    _handleImportedLayer: function (layerJson) {
        const cb = (mapLayer) => {
            const sandbox = this.instance.getSandbox();
            const layerId = mapLayer.getId();
            // Request the layer to be added to the map.
            sandbox.postRequestByName('AddMapLayerRequest', [layerId, {
                zoomContent: true
            }]);
            // Request to move and zoom map to layer's content
            // sandbox.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId, true]);
            this.notifyUpdate();
        };
        const { warning } = layerJson;
        if (warning) {
            this._showWarning(warning);
        }
        this.addLayerToService(layerJson, false, cb);
    },
    /**
     * Adds the layers to the map layer service.
     *
     * @method _addLayersToService
     * @private
     * @param {JSON[]} layers
     * @param {Function} cb
     */
    _addLayersToService: function (layers = []) {
        // initialize the group these layers will be in:
        const mapLayerService = this.instance.getMapLayerService();
        const mapLayerGroup = mapLayerService.findLayerGroupById(this.groupId);
        if (!mapLayerGroup) {
            const group = {
                id: this.groupId,
                name: this.instance.loc('layer.inspire')
            };
            mapLayerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
        }

        layers.forEach((layerJson) => {
            this.addLayerToService(layerJson, true);
        });
        if (layers.length > 0) {
            const event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // null as id triggers mass update
            this.instance.getSandbox().notifyAll(event);
            this.notifyUpdate();
        }
    },
    _removeLayerFromService: function (layerId) {
        this.instance.getMapLayerService().removeLayer(layerId);
        this.instance.getSandbox().postRequestByName('RemoveMapLayerRequest', [layerId]);
        this.notifyUpdate();
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
        mapLayer.setOrganizationName(this.instance.loc('layer.organization'));
        mapLayer.setGroups([{
            id: this.groupId,
            name: this.instance.loc('layer.inspire')
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
