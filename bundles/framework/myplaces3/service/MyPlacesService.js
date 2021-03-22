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
        _updatePlaces: function (categoryId) {
            this._removePlaces(categoryId);
            this.loadPlaces(categoryId);
        },
        _removePlaces: function (categoryId) {
            delete this._placesList[categoryId];
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
            var places = me.getPlacesInCategory(oldCategoryId);
            if (places.length === 0) {
                // no places to move -> callback right away
                callback(true);
                return;
            }
            const cbWrapper = success => {
                if (success) {
                    this._removePlaces(oldCategoryId);
                    this._updatePlaces(newCategoryId);
                }
                callback(success);
            };
            places.forEach(place => place.setCategoryId(newCategoryId));
            this.commitMyPlaces(places, cbWrapper, true);
        },

        /**
         * @method _deletePlacesInCategory
         * @private
         * Deletes all places in given category
         * @param {Number} categoryId category id to delete from
         */
        deletePlacesInCategory: function (categoryId, callback) {
            const idList = this.getPlacesInCategory(categoryId).map(place => place.getId());
            if (idList.length === 0) {
                // no places to delete -> callback right away
                this._removePlaces(categoryId);
                callback(true);
                return;
            }
            const cbWrapper = success => {
                if (success) {
                    this._removePlaces(categoryId);
                }
                callback(success);
            };
            this.deletePlaces(idList, cbWrapper);
        },
        /*
         * @method deletePlaces
         *
         * delete a list of my places from backend
         */
        deletePlaces: function (idList, callback) {
            jQuery.ajax({
                type: 'DELETE',
                url: Oskari.urls.getRoute('MyPlacesFeatures') + '&features=' + idList.join(),
                success: function (response) {
                    const success = response.deleted > 0;
                    callback(success);
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false);
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
                success: ({ features }) => {
                    if (features) {
                        this._handleLoadPlacesResponse(categoryId, features);
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
            this._placesList[categoryId] = features.map(feat => this._createPlace(feat));
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
            return !!this._placesList[categoryId];
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
                url: Oskari.urls.getRoute('MyPlacesLayers') + '&id=' + categoryId,
                success: function (response) {
                    callback(response.success);
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
                data,
                url: Oskari.urls.getRoute('MyPlacesLayers'),
                success: ({ layer }) => {
                    if (layer) {
                        callback(layer);
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
            const place = this.findMyPlace(placeId);
            if (!place) {
                this.log.error('Could not find requested place with id:', placeId);
                callback(false);
                return;
            }
            const cbWrapper = success => {
                if (success) {
                    this._updatePlaces(place.getCategoryId());
                }
                callback(success);
            };
            this.deletePlaces([placeId], cbWrapper);
        },
        /**
         * @method saveMyPlace
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), myplaceModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveMyPlace: function (place, callback) {
            const id = place.getId();
            let oldCategoryId = null;
            const categoryId = place.getCategoryId();
            if (id) {
                let oldPlace;
                Object.keys(this._placesList).forEach(cat => {
                    oldPlace = this._placesList[cat].find(place => {
                        return place.getId() === id;
                    });
                    if (oldPlace) {
                        const oldCat = parseInt(cat);
                        if (categoryId !== oldCat) {
                            oldCategoryId = oldCat;
                        }
                    }
                });
            }
            const callbackWrapper = success => {
                callback(success, categoryId, oldCategoryId);
                this._updatePlaces(categoryId);
                if (oldCategoryId) {
                    this._updatePlaces(oldCategoryId);
                }
            };
            this.commitMyPlaces([place], callbackWrapper, !!id);
        },

        /**
         * @method commitPlaces
         *
         * handles insert & update (NO delete)
         */
        commitMyPlaces: function (places, callback, isUpdate) {
            var features = places.map(place => this._createFeature(place));
            jQuery.ajax({
                type: isUpdate ? 'PUT' : 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    features: features,
                    srsName: this.srsName
                }),
                url: Oskari.urls.getRoute('MyPlacesFeatures') + '&crs=' + this.srsName,
                success: function (response) {
                    const success = response.totalFeatures > 0;
                    callback(success);
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        },
        /**
         * @method _createPlace
         * Creates MyPlace from GeoJSON feature
         * @param {Object} feature
         */
        _createPlace: function (feature) {
            const place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
            const { properties, geometry, id } = feature;
            place.setId(id);
            place.setUuid(properties.uuid);
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
            return place;
        },
        /**
         * @method _createFeature
         * Creates GeoJSON feature from MyPlace
         * @param {MyPlace} place
         */
        _createFeature: function (place) {
            return {
                id: place.getId(),
                type: place.getType(),
                geometry: place.getGeometry(),
                category_id: place.getCategoryId(),
                properties: {
                    name: place.getName(),
                    place_desc: place.getDescription(),
                    attention_text: place.getAttentionText(),
                    link: place.getLink(),
                    image_url: place.getImageLink()
                }
            };
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
                    callback(pResp);
                },
                error: jqXHR => {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        },
        getExportCategoryUrl: function (categoryId) {
            return Oskari.urls.getRoute('ExportMyPlacesLayerFeatures') + '&categoryId=' + categoryId + '&srs=' + this.srsName;
        },
        exportCategoryFeatures: function (categoryId) {
            const url = this.getExportCategoryUrl(categoryId);
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'filename.json'; // TODO categoryName_yyyy-MM-dd.json/geojson
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
