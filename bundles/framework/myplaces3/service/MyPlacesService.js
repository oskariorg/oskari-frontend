import { LAYER_METATYPE, LOCALE_KEY } from '../constants';
import { getCategoryId, getLayerId, layerToCategory } from './LayerHelper';
import { createPlace, createFeature } from './PlaceHelper';
import { Messaging } from 'oskari-ui/util';
/**
 * @clas
s Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox reference to Oskari sandbox
     *
     */

    function (sandbox) {
        this._placesList = {}; // {categoryId:[places]}
        this.sandbox = sandbox;
        this.log = Oskari.log(this.getQName());
        this.loc = Oskari.getMsg.bind(null, LOCALE_KEY);
        this.srsName = this.sandbox.getMap().getSrsName();
        this.mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        Oskari.makeObservable(this);
    }, {
        __qname: 'Oskari.mapframework.bundle.myplaces3.service.MyPlacesService',
        getQName: function () {
            return this.__qname;
        },

        __name: 'MyPlacesService',
        getName: function () {
            return this.__name;
        },
        /**
         * Initializes the service and loads categories
         * @method init
         */
        init: function () {
            this.loadLayers();
        },
        _refreshPlaces: function (categoryId) {
            this._flushPlaces(categoryId);
            this.loadPlaces(categoryId);
        },
        _flushPlaces: function (categoryId) {
            delete this._placesList[categoryId];
        },
        getPlacesCount: function () {
            let count = 0;
            Object.keys(this._placesList).forEach(key => {
                count += this._placesList[key].length;
            });
            return count;
        },
        getPlacesInCategory: function (categoryId) {
            return this._placesList[categoryId] || [];
        },
        placesLoaded: function (categoryId) {
            return !!this._placesList[categoryId];
        },
        findMyPlaceByLonLat: function (lonlat, zoom) {
            this.log.info('findMyPlaceByLonLat() is not implemented');
        },
        /**
         * @method findMyPlace
         * Tries to find place with given id
         * @param {Number} id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace}
         */
        findMyPlace: function (id) {
            let place = null;
            Object.keys(this._placesList).forEach(category => {
                if (place) {
                    return;
                }
                place = this._placesList[category].find(place => place.getId() === id);
            });
            return place;
        },
        /**
         * @method getPlaces
         *
         * loads places from backend to given service filters by layerId
         *
         */
        loadPlaces: function (categoryId) {
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: Oskari.urls.getRoute('MyPlacesFeatures'),
                data: {
                    layerId: categoryId,
                    crs: this.srsName
                },
                success: ({ features }) => {
                    this._placesList[categoryId] = features.map(feat => createPlace(feat, this.mapmodule));
                    this._notifyPlace();
                },
                error: () => {
                    this._notifyPlace();
                    this.log.error('Failed to load myplaces.');
                }
            });
        },
        /**
         * @method getCategories
         *
         * loads categories from backend to given service filters by
         * initialised user uuid
         */
        loadLayers: function () {
            jQuery.ajax({
                type: 'GET',
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: response => this._addLayersToService(response.layers),
                error: () => this.log.error('Failed to load myplaces categories.')
            });
        },
        _addLayerToService: function (layerJson, skipEvent) {
            // add maplayer to Oskari
            const service = this.mapLayerService;
            const layer = service.createMapLayer(layerJson);
            service.addLayer(layer, skipEvent);
            if (!skipEvent) {
                const id = getCategoryId(layer.getId());
                this._notifyCategory(id);
            }
            return layer;
        },
        // for initial load layers
        _addLayersToService: function (layers = []) {
            layers.forEach(layerJson => {
                this._addLayerToService(layerJson, true);
            });
            if (layers.length > 0) {
                const event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // null as id triggers mass update
                this.sandbox.notifyAll(event);
            }
            this._notifyCategory();
        },
        addLayerToMap: function (categoryId) {
            const layerId = getLayerId(categoryId);
            if (!this.sandbox.isLayerAlreadySelected(layerId)) {
                this.sandbox.postRequestByName('AddMapLayerRequest', [layerId, true]);
            }
        },
        _refreshLayerIfSelected: function (categoryId) {
            const layerId = getLayerId(categoryId);
            if (this.sandbox.isLayerAlreadySelected(layerId)) {
                // update layer on map
                this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layerId, true]);
                this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId]);
            }
        },
        _updateLayer: function (layerJson) {
            const { id, locale, options } = layerJson;
            const layer = this.mapLayerService.findMapLayer(id);
            if (!layer) {
                this.log.warn('tried to update layer which does not exist, id: ' + id);
                return;
            }
            layer.setLocale(locale);
            layer.setOptions(options);
            const evt = Oskari.eventBuilder('MapLayerEvent')(id, 'update');
            this.sandbox.notifyAll(evt);
            if (this.sandbox.isLayerAlreadySelected(id)) {
                // update layer on map
                this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
                this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [id]);
            }
            this._notifyCategory();
        },
        getAllCategories: function () {
            return this.mapLayerService.getAllLayersByMetaType(LAYER_METATYPE)
                .map(layer => layerToCategory(layer))
                .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
        },
        getCategoryForEdit: function (categoryId) {
            const layer = this.mapLayerService.findMapLayer(getLayerId(categoryId));
            if (!layer) {
                this.log.error('Could not find layer. Category id: ' + categoryId);
                return;
            }
            return {
                ...layerToCategory(layer),
                locale: layer.getLocale(),
                style: layer.getCurrentStyle().getFeatureStyle()
            };
        },
        /**
         * @method getPlacesInCategory
         * Returns all places in given category or empty array if none.
         * @param {Number} categoryId category id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace[]}
         */

        deleteCategoryWithPlaces: function (categoryId, moveToId) {
            const places = this.getPlacesInCategory(categoryId);
            if (places.length === 0) {
                // no places, safe to delete
                this.deleteCategory(categoryId);
                return;
            }

            const callback = success => {
                if (!success) {
                    this.log.error('Failed to move/delete places. Skipping delete category');
                    return;
                }
                this.deleteCategory(categoryId);
            };
            if (moveToId) {
                places.forEach(place => place.setCategoryId(moveToId));
                // TODO: old categoryId use refresh but here is remove needed, TEST is its ok to load empty places before category is removed
                this._commitMyPlaces(places, false, categoryId, callback);
            } else {
                this.deletePlaces(places, callback);
            }
        },

        deleteCategory: function (categoryId) {
            jQuery.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: Oskari.urls.getRoute('MyPlacesLayers') + '&id=' + categoryId,
                success: () => {
                    const layerId = getLayerId(categoryId);
                    this.mapLayerService.removeLayer(layerId);
                    this._notifyCategory();
                    Messaging.success(this.loc('notification.category.deleted'));
                },
                error: () => {
                    Messaging.error(this.loc('error.deleteCategory'));
                }
            });
        },
        /**
         * @method commitCategories
         *
         * handles insert & update (NO delete)
         */
        updateCategory: function (category) {
            const data = {
                id: category.categoryId,
                isDefault: category.isDefault,
                locale: JSON.stringify(category.locale),
                style: JSON.stringify(category.style)
            };
            jQuery.ajax({
                type: 'PUT',
                dataType: 'json',
                data,
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: ({ layer }) => {
                    this._updateLayer(layer);
                    Messaging.success(this.loc('notification.category.updated'));
                },
                error: () => {
                    Messaging.error(this.loc('error.saveCategory'));
                }
            });
        },
        saveCategory: function (category) {
            const data = {
                locale: JSON.stringify(category.locale),
                style: JSON.stringify(category.style)
            };
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data,
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: ({ layer }) => {
                    this._addLayerToService(layer);
                    Messaging.success(this.loc('notification.category.saved'));
                },
                error: () => {
                    Messaging.error(this.loc('error.saveCategory'));
                }
            });
        },

        _notifyCategory: function (newId) {
            this.trigger('category', newId);
            this.sandbox.notifyAll(Oskari.eventBuilder('MyPlaces.MyPlacesChangedEvent')());
        },

        deletePlaces: function (places, successCb) {
            const features = places.map(p => p.getId()).join();
            jQuery.ajax({
                type: 'DELETE',
                url: Oskari.urls.getRoute('MyPlacesFeatures', { features }),
                success: () => {
                    Messaging.success(this.loc('notification.place.deleted'));
                    this._handlePlacesChange(places);
                    if (typeof successCb === 'function') {
                        successCb(true);
                    }
                },
                error: () => {
                    Messaging.error(this.loc('error.deletePlace'));
                    if (typeof successCb === 'function') {
                        successCb(false);
                    }
                }
            });
        },
        /**
         * @method saveMyPlace
         * Saves given myplace to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to save
         */
        saveMyPlace: function (place, oldCategoryId) {
            const isAdd = !place.getId();
            const categoryId = place.getCategoryId();
            const cb = success => success && isAdd && this.addLayerToMap(categoryId);
            this._commitMyPlaces([place], isAdd, oldCategoryId, cb);
        },

        /**
         * @method commitPlaces
         *
         * handles insert & update (NO delete)
         */
        _commitMyPlaces: function (places, isAdd, oldCategoryId, successCb) {
            const features = places.map(place => createFeature(place));
            const crs = this.srsName;
            jQuery.ajax({
                type: isAdd ? 'POST' : 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    features: features,
                    srsName: crs
                }),
                url: Oskari.urls.getRoute('MyPlacesFeatures', { crs }),
                success: () => {
                    Messaging.success(this.loc('notification.place.saved'));
                    this._handlePlacesChange(places, oldCategoryId);
                    if (typeof successCb === 'function') {
                        successCb(true);
                    }
                },
                error: () => {
                    Messaging.error(this.loc('error.savePlace'));
                    if (typeof successCb === 'function') {
                        successCb(false);
                    }
                }
            });
        },
        _handlePlacesChange: function (places, oldCategoryId) {
            if (places.length === 0) {
                return;
            }
            const categoryId = places[0].getCategoryId();
            // refresh cached places
            this._refreshPlaces(categoryId);
            this._refreshLayerIfSelected(categoryId);
            // if places is moved refresh old category
            if (oldCategoryId) {
                this._refreshPlaces(oldCategoryId);
                this._refreshLayerIfSelected(oldCategoryId);
            }
            this._notifyPlace();
        },
        _notifyPlace: function () {
            this.trigger('place');
            this.sandbox.notifyAll(Oskari.eventBuilder('MyPlaces.MyPlacesChangedEvent')());
        },

        /**
         * @method publishCategory
         * Method marks the category published or unpublished
         * @param {Number} categoryId
         * @param {Boolean} makePublic true to publish, false to unpublish
         * @param {Function} callback function receives a boolean parameter with true on successful operation
         */
        publishCategory: function (categoryId, makePublic, callback) {
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    id: categoryId,
                    makePublic
                },
                url: Oskari.urls.getRoute('PublishMyPlaceLayer'),
                success: pResp => {
                    const layer = this.mapLayerService.findMapLayer(getLayerId(categoryId));
                    layer.addPermission('publish', !!makePublic);
                    const evt = Oskari.eventBuilder('MapLayerEvent')(layer.getId(), 'update');
                    this.sandbox.notifyAll(evt);
                    // Messaging.success
                },
                error: () => {
                    Messaging.error(this.loc('error.generic'));
                }
            });
        },
        getExportCategoryUrl: function (categoryId) {
            const params = {
                categoryId,
                srs: this.srsName
            };
            return Oskari.urls.getRoute('ExportMyPlacesLayerFeatures', params);
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
