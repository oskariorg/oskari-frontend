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
        this._sandbox = sandbox;
        this.log = Oskari.log(this.getQName());
        this.srsName = sandbox.getMap().getSrsName();
        this.mapmodule = this._sandbox.findRegisteredModuleInstance('MainMapModule');
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
        init: function () {},

        getPlacesCount: function () {
            let count = 0;
            Object.keys(this._placesList).forEach(key => {
                count += this._placesList[key].length;
            });
            return count;
        },

        /**
         * @method _addMyPlace
         * @private
         * Adds given place to internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to add
         */
        _addMyPlace: function (myplaceModel) {
            var categoryId = myplaceModel.getCategoryId();
            if (!this._placesList[categoryId]) {
                this._placesList[categoryId] = [];
            }
            this._placesList[categoryId].push(myplaceModel);
        },
        /**
         * @method _removeMyPlace
         * @private
         * Removes given place from internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Number} placeId id for place to remove
         */
        _removeMyPlace: function (id) {
            var placesList = this._placesList;
            Object.keys(placesList).forEach(function (category) {
                var placesInCategory = placesList[category];
                var indexInCategory = placesInCategory.findIndex(function (place) {
                    return place.getId() === id;
                });
                if (indexInCategory !== -1) {
                    placesInCategory.splice(indexInCategory, 1);
                }
            });
        },
        _removePlacesFromCategory: function (categoryId) {
            delete this._placesList[categoryId];
        },
        _removePlaceFromCategory: function (id, categoryId) {
            this._placesList[categoryId] = this.getPlacesInCategory(categoryId)
                .filter(place => place.getId() !== id);
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
            var placesList = this._placesList;
            var place = null;
            Object.keys(placesList).forEach(function (category) {
                if (place) {
                    return;
                }
                var placesInCategory = placesList[category];
                place = placesInCategory.find(function (place) {
                    return place.getId() === id;
                });
            });
            return place;
        },
        /**
         * @method getCategories
         *
         * loads categories from backend to given service filters by
         * initialised user uuid
         */
        loadLayers: function (callback) {
            jQuery.ajax({
                type: 'GET',
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: response => {
                    if (response) {
                        callback(response.layers);
                    } else {
                        this.log.error('Failed to load myplaces categories.');
                    }
                },
                error: jqXHR => {
                    if (jqXHR.status !== 0) {
                        this.log.error('Failed to load myplaces categories.');
                    }
                }
            });
        },
        /**
         * @method movePlacesToCategory
         * @private
         * Moves places from one category to another and calls given callback when done.
         * @param {Number} oldCategoryId source category id
         * @param {Number} newCategoryId destination category id
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        movePlacesToCategory: function (oldCategoryId, newCategoryId, callback) {
            var me = this;
            var placesInDeleteCategory = me.getPlacesInCategory(oldCategoryId);
            if (placesInDeleteCategory.length === 0) {
                // no places to move -> callback right away
                callback(true);
                return;
            }
            for (var i = 0; i < placesInDeleteCategory.length; i++) {
                placesInDeleteCategory[i].setCategoryId(newCategoryId);
            }
            const removeCbWrapper = success => {
                if (success) {
                    // remove from internal store
                    this._removePlacesFromCategory(oldCategoryId);
                }
                callback(success);
            };
            this.commitMyPlaces(placesInDeleteCategory, removeCbWrapper, true);
        },

        /**
         * @method _deletePlacesInCategory
         * @private
         * Deletes all places in given category
         * @param {Number} categoryId category id to delete from
         */
        deletePlacesInCategory: function (categoryId, callback) {
            var placesInDeleteCategory = this.getPlacesInCategory(categoryId);
            var idList = placesInDeleteCategory.map(function (place) {
                return place.getId();
            });
            if (idList.length === 0) {
                if (callback) {
                    callback(true);
                }
                return;
            }
            this.deletePlaces(idList, success => {
                if (success) {
                    this._removePlacesFromCategory(categoryId);
                    this._notifyDataChanged();
                }
                if (callback) {
                    callback(success);
                }
            });
        },
        /*
         * @method deleteMyPlaces
         *
         * delete a list of my places from backend
         */
        deletePlaces: function (idList, callback) {
            jQuery.ajax({
                type: 'DELETE',
                url: Oskari.urls.getRoute('MyPlacesFeatures') + '&features=' + idList.join(),
                success: function (response) {
                    if (response) {
                        callback(true, idList);
                    } else {
                        callback(false, idList);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false, idList);
                    }
                }
            });
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
                success: response => {
                    if (response) {
                        this._handleLoadPlacesResponse(categoryId, response.features);
                    } else {
                        this.log.error('Failed to load myplaces.');
                    }
                },
                error: jqXHR => {
                    if (jqXHR.status !== 0) {
                        this.log.error('Failed to load myplaces.');
                    }
                }
            });
        },
        /**
         * @method getDrawModeFromGeometry
         * Returns a matching draw mode string-key for the geometry
         * @param {Object} GeoJSON geometry from my place model
         * @return {String} matching draw mode string-key for the geometry
         * @private
         */
        getDrawModeFromGeometry: function (geometry) {
            if (geometry === null) {
                return null;
            }
            var type = geometry.type;
            if (type === 'MultiPoint' || type === 'Point') {
                return 'point';
            } else if (type === 'MultiLineString' || type === 'LineString') {
                return 'line';
            } else if (type === 'MultiPolygon' || type === 'Polygon') {
                return 'area';
            }
            return null;
        },
        /**
         * @method _formatDate
         * Formats timestamp for UI
         * @return {String}
         */
        _formatDate: function (timestamp) {
            if (!timestamp) {
                return '';
            }
            const date = new Date(timestamp);
            if (isNaN(date.getMilliseconds())) {
                return '';
            }
            return date.toLocaleDateString();
        },
        /**
         * @method _handleCommitMyPlacesResponse
         * processes ajax response from backend
         * @param response server response
         */
        _handleLoadPlacesResponse: function (categoryId, features = []) {
            this._placesList[categoryId] = [];
            features.forEach(feat => {
                var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
                place.setId(feat.id);
                place.setUuid(feat.properties.uuid);
                this._setPlaceProperties(place, feat);
                this._addMyPlace(place);
            });
            this._notifyDataChanged();
        },
        /**
         * @method getPlacesInCategory
         * Returns all places in given category or empty array if none.
         * @param {Number} categoryId category id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace[]}
         */
        getPlacesInCategory: function (categoryId) {
            return this._placesList[categoryId] || [];
        },
        placesLoaded: function (categoryId) {
            return this._placesList.hasOwnProperty(categoryId);
        },
        /*
         * @method deleteCategories
         *
         * delete a list of categories from backend
         * @param {Array} categoryIds
         * @param {Function} callback
         */
        deleteCategory: function (categoryId, callback) {
            jQuery.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: Oskari.urls.getRoute('MyPlacesLayers') + '&layerIds=' + categoryId, // TODO backend shoud handle single layerId/categoryId
                success: function (response) {
                    callback(!!response);
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        },
        /**
         * @method commitCategories
         *
         * handles insert & update (NO delete)
         */
        commitCategory: function (data, callback) {
            jQuery.ajax({
                type: data.id ? 'PUT' : 'POST',
                dataType: 'json',
                data, // TODO sync data keys with backend
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: response => {
                    if (response) {
                        callback(response.layers[0]); // TODO backend shoud return response.layer
                        return;
                    }
                    callback(null);
                },
                error: () => callback(null)
            });
        },
        /**
         * @method _notifyDataChanged
         * @private
         * Notifies components that places/categories have changed with 'MyPlaces.MyPlacesChangedEvent'
         */
        _notifyDataChanged: function () {
            this._sandbox.notifyAll(Oskari.eventBuilder('MyPlaces.MyPlacesChangedEvent')());
        },
        /**
         * @method deleteMyPlace
         * Deletes place matching given id.
         * @param {Number} placeId id for place to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        deleteMyPlace: function (placeId, callback) {
            var me = this;
            this.deleteMyPlaces([placeId], function (success, list) {
                if (success) {
                    me._removeMyPlace(list[0]);
                    me._notifyDataChanged();
                }
                callback(success, list[0]);
            });
        },
        /**
         * @method saveMyPlace
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), myplaceModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveMyPlace: function (myplaceModel, callback) {
            const id = myplaceModel.getId();
            let oldCategoryId = null;
            const categoryId = myplaceModel.getCategoryId();
            if (id) {
                const oldPlace = this.findMyPlace(id);
                if (oldPlace.getCategoryId() !== categoryId) {
                    oldCategoryId = oldPlace.getCategoryId();
                }
            }
            const callbackWrapper = success => {
                if (success && oldCategoryId) {
                    this._removePlaceFromCategory(id, oldCategoryId);
                    this._addMyPlace(myplaceModel);
                }
                callback(success, categoryId, oldCategoryId);
            };
            this.commitMyPlaces([myplaceModel], callbackWrapper, !!id);
        },

        /**
         * @method commitPlaces
         *
         * handles insert & update (NO delete)
         */
        commitMyPlaces: function (list, callback, isUpdate) {
            var me = this;
            var features = [];
            list.forEach(function (feat) {
                // backend formatting
                var id = feat.getId();
                var geojson = {
                    'id': id,
                    'type': feat.getType(),
                    'geometry': feat.getGeometry(),
                    'category_id': feat.getCategoryId(),
                    'properties': {
                        'name': feat.getName(),
                        'place_desc': feat.getDescription(),
                        'attention_text': feat.getAttentionText(),
                        'link': feat.getLink(),
                        'image_url': feat.getImageLink()
                    }
                };
                features.push(geojson);
            });
            jQuery.ajax({
                type: isUpdate ? 'PUT' : 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    'features': features,
                    'srsName': this.srsName
                }),
                url: Oskari.urls.getRoute('MyPlacesFeatures') + '&crs=' + this.srsName,
                success: function (response) {
                    if (response) {
                        if (me.skipLoading === true) {
                            callback(true);
                            return;
                        }
                        const success = me._handleCommitMyPlacesResponse(response, isUpdate);
                        callback(success);
                    } else {
                        callback(false);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        },

        /**
         * @method _handleCommitMyPlacesResponse
         * processes ajax response from backend
         * @param response server response
         * @param cb callback to call with the model list as param
         */
        _handleCommitMyPlacesResponse: function (response, isUpdate) {
            var features = response.features || [];
            if (features.length === 0) {
                return false;
            }
            features.forEach(feature => {
                var id = feature.id;
                var place;
                if (isUpdate) {
                    place = this.findMyPlace(id);
                    if (!place) {
                        this.log.error('Cannot find place to update');
                        return false;
                    }
                } else {
                    place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
                    place.setId(id);
                    place.setUuid(feature.uuid);
                }
                this._setPlaceProperties(place, feature);
                if (!isUpdate) {
                    this._addMyPlace(place);
                }
            });
            return true;
        },
        _setPlaceProperties: function (place, feature) {
            const { properties, geometry } = feature;
            place.setName(Oskari.util.sanitize(properties.name));
            place.setDescription(Oskari.util.sanitize(properties.place_desc));
            place.setAttentionText(Oskari.util.sanitize(properties.attention_text));
            place.setLink(Oskari.util.sanitize(properties.link));
            place.setImageLink(Oskari.util.sanitize(properties.image_url));
            place.setCategoryId(properties.category_id);
            place.setCreateDate(this._formatDate(properties.created));
            place.setUpdateDate(this._formatDate(properties.updated));
            place.setGeometry(geometry);
            const drawMode = this.getDrawModeFromGeometry(geometry);
            const measurement = this.mapmodule.formatMeasurementResult(this.mapmodule.getMeasurementResult(geometry), drawMode);
            place.setMeasurement(measurement);
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
                    if (pResp) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                },
                error: jqXHR => {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
