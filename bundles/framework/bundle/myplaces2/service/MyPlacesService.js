/**
 * @class Oskari.mapframework.bundle.myplaces2.service.MyPlacesService
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService',

    /**
     * @method create called automatically on construction
     * @static
     * @param {String} url
     * @param {String} uuid current users uuid
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox reference to Oskari sandbox
     * @param {Object} defaults category default values
     * @param {Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance} pInstance
     *  instance to notify if problems with default category
     *
     */

    function (url, uuid, sandbox, defaults, pInstance, options) {

        // list of loaded categories & myplaces
        this._categoryList = [];
        this._placesList = [];
        this.wfstStore = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplaces2.service.MyPlacesWFSTStore',
            url, uuid, pInstance.featureNS, options);
        this._sandbox = sandbox;
        this.defaultCategory = null;
        this.defaults = defaults;
        this._instance = pInstance;
    }, {
        __qname: "Oskari.mapframework.bundle.myplaces2.service.MyPlacesService",
        getQName: function () {
            return this.__qname;
        },

        __name: "MyPlacesService",
        getName: function () {
            return this.__name;
        },
        /**
         * Initializes the service and loads places/categories
         * @method init
         * @param {Boolean} blnSkipLoad true to skip loading existing categories (f.ex. in published map)
         */
        init: function (blnSkipLoad) {
            // preload stuff
            var me = this;
            this.wfstStore.connect();
            if(blnSkipLoad === true) {
                return;
            }
            var loadedCategories = false;
            var loadedPlaces = false;

            // function to 
            var allLoaded = function () {
                // when both places and categories have been loaded, notify that the data has changed
                if (loadedPlaces && loadedCategories) {
                    me._notifyDataChanged();
                }
            };

            var initialLoadCallBackCategories = function (categories) {
                if (categories) {
                    var i;
                    for (i = 0; i < categories.length; ++i) {
                        me._addCategory(categories[i]);
                    }
                }

                var categoriesLoaded = function () {
                    loadedCategories = true;
                    allLoaded();
                };

                if (!me.getDefaultCategory()) {
                    // user doesn't have default category, propably a new user
                    // create a default category
                    me._createDefaultCategory(categoriesLoaded);
                } else {
                    categoriesLoaded();
                }
            };


            var initialLoadCallBackPlaces = function (places) {
                if (places) {
                    me._placesList = places;
                }

                loadedPlaces = true;
                allLoaded();
            };

            this.wfstStore.getCategories(initialLoadCallBackCategories);
            this.wfstStore.getMyPlaces(initialLoadCallBackPlaces);
        },
        /** 
         * @method _createDefaultCategory
         * @private
         * Creates a default category for the user
         * @param callback function
         */
        _createDefaultCategory: function (callback) {
            var me = this;
            var defaultCategory = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
            defaultCategory.setName(me.defaultCategoryName);
            if (!me.defaultCategoryName) {
                // should not happen
                defaultCategory.setName('My map layer');
            }
            defaultCategory.setName(this.defaults.name);
            defaultCategory.setDotShape(this.defaults.point.shape);
            defaultCategory.setDotColor(this.defaults.point.color);
            defaultCategory.setDotSize(this.defaults.point.size);
            defaultCategory.setLineStyle(this.defaults.line.style);
            defaultCategory.setLineCap(this.defaults.line.cap);
            defaultCategory.setLineCorner(this.defaults.line.corner);
            defaultCategory.setLineWidth(this.defaults.line.width);
            defaultCategory.setLineColor(this.defaults.line.color);
            defaultCategory.setAreaLineWidth(this.defaults.area.linewidth);
            defaultCategory.setAreaLineCorner(this.defaults.area.linecorner);
            defaultCategory.setAreaLineStyle(this.defaults.area.linestyle);
            defaultCategory.setAreaLineColor(this.defaults.area.linecolor);
            defaultCategory.setAreaFillColor(this.defaults.area.color);
            defaultCategory.setAreaFillStyle(this.defaults.area.fill);
            defaultCategory.setDefault(true);

            var defaultCategoryCreationCallback = function () {
                // called if new user -> just created a default category for user

                if (me.getAllCategories().length === 0) {
                    // something went wrong and we should propably just show error
                    // message instead of my places functionality
                    me._instance.forceDisable();

                } else {
                    callback();
                }
            };

            this.saveCategory(defaultCategory, defaultCategoryCreationCallback);
        },

        /**
         * @method _addCategory
         * @private
         * Adds the category to the selection
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory} categoryModel
         */
        _addCategory: function (categoryModel) {
            if (categoryModel.isDefault()) {
                this.defaultCategory = categoryModel;
            }
            this._categoryList.push(categoryModel);
        },

        /**
         * @method _movePlacesToCategory
         * @private
         * Moves places from one category to another and calls given callback when done.
         * @param {Number} oldCategoryId source category id
         * @param {Number} newCategoryId destination category id
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _movePlacesToCategory: function (oldCategoryId, newCategoryId, callback) {
            var me = this;
            var placesInDeleteCategory = me.getPlacesInCategory(oldCategoryId),
                i;
            if (placesInDeleteCategory.length === 0) {
                // no places to move -> callback right away
                callback(true);
                return;
            }
            for (i = 0; i < placesInDeleteCategory.length; i++) {
                placesInDeleteCategory[i].setCategoryID(newCategoryId);
            }
            var callBackWrapper = function (success, list) {
                // update models updateDate in store
                //var myplace = me.findMyPlace(list[0].get('id'));
                //myplace.set('updateDate', list[0].get('updateDate'));
                me._notifyDataChanged();
                callback(success);
            };
            // need to wrap callback and call changes notify if ever called directly
            this.wfstStore.commitMyPlaces(placesInDeleteCategory, callBackWrapper);
        },

        /**
         * @method _deletePlacesInCategory
         * @private
         * Deletes all places in given category
         * @param {Number} categoryId category id to delete from
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _deletePlacesInCategory: function (categoryId, callback) {
            var placesInDeleteCategory = this.getPlacesInCategory(categoryId);
            var idList = [],
                i;
            for (i = 0; i < placesInDeleteCategory.length; i++) {
                idList.push(placesInDeleteCategory[i].getId());
            }
            if (idList.length === 0) {
                // no places to delete -> callback right away
                callback(true);
                return;
            }
            var me = this;
            var callBackWrapper = function (success, list) {
                if (success) {
                    var i;
                    for (i = 0; i < placesInDeleteCategory.length; i++) {
                        me._removeMyPlace(list[i]);
                    }
                    me._notifyDataChanged();
                }
                callback(success);
            };
            this.wfstStore.deleteMyPlaces(idList, callBackWrapper);
        },
        /**
         * @method parseDate
         *
         * parses date for my places
         *
         * @param dateStr format 2011-11-02T15:27:48.981+02:00 (time part is
         * optional)
         * @return array with date part in first index, time (optional) in second,
         * empty array if param is undefined or less than 10 characters
         */
        parseDate: function (dateStr) {

            if (!dateStr && dateStr.length < 10) {
                return [];
            }
            var year = dateStr.substring(0, 4);
            var month = dateStr.substring(5, 7);
            var day = dateStr.substring(8, 10);
            var returnValue = [day + '.' + month + '.' + year];

            var time = '';
            // TODO: error handling
            if (dateStr.length === 29) {
                time = dateStr.substring(11);
                var splitted = time.split('+');
                time = splitted[0];
                // take out milliseconds
                time = time.split('.')[0];
                var timeComps = time.split(':');
                var hour = timeComps[0];
                var min = timeComps[1];
                var sec = timeComps[2];
                /*
             var timezone = splitted[1];
             timezone = timezone.split(':')[0];
             hour = parseInt(hour) + parseInt(timezone);
             */
                time = hour + ':' + min + ':' + sec;
                returnValue.push(time);
            }

            return returnValue;
        },

        /**
         * @method getPlacesInCategory
         * Returns all places in given category or empty array if none.
         * @param {Number} categoryId category id to delete from
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace[]}
         */
        getPlacesInCategory: function (categoryId) {
            var placesInCategory = [],
                i;
            for (i = 0; i < this._placesList.length; i++) {
                if (this._placesList[i].getCategoryID() === categoryId) {
                    placesInCategory.push(this._placesList[i]);
                }
            }
            return placesInCategory;
        },

        /**
         * @method deleteCategory
         * Deletes all places in given category or moves the places to default category. After that
         * deletes the category.
         * @param {Number} categoryId category id to delete
         * @param {Boolean} movePlacesToDefault true to move places, false to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        deleteCategory: function (categoryId, movePlacesToDefault, callback) {
            var me = this;

            // call actual category delete once category has been cleared of places
            // successfully
            var callBackWrapper = function (success) {
                if (success) {
                    me._deleteEmptyCategory(categoryId, callback);
                } else {
                    // only callback on fail here
                    callback(success);
                }
            };
            // move places handling
            if (movePlacesToDefault === true) {
                var defaultCategory = me.getDefaultCategory();
                me._movePlacesToCategory(categoryId, defaultCategory.getId(), callBackWrapper);
            } else {
                // delete places to clear category if places will not be moved
                me._deletePlacesInCategory(categoryId, callBackWrapper);
            }
        },

        /**
         * @method _deleteEmptyCategory
         * @private
         * Deletes given category. Assumes its empty.
         * @param {Number} categoryId category id to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _deleteEmptyCategory: function (categoryId, callback) {

            var me = this;
            var callBackWrapper = function (success, list) {
                if (success) {
                    me._removeCategory(list[0]);
                }
                callback(success);
                me._notifyDataChanged();
            };

            this.wfstStore.deleteCategories([categoryId], callBackWrapper);
        },

        /**
         * @method _removeCategory
         * @private
         * Removes given category from internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Number} categoryId category id to delete
         */
        _removeCategory: function (categoryId) {
            var i;
            for (i = 0; i < this._categoryList.length; i++) {
                if (this._categoryList[i].getId() === categoryId) {
                    this._categoryList.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * @method saveCategory
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory} categoryModel category to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), categoryModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveCategory: function (categoryModel, callback) {
            var me = this;
            var isNew = !(categoryModel.getId());

            var callBackWrapper = function (success, list) {
                if (isNew && success) {
                    me._addCategory(list[0]);
                } else {
                    // update models updateDate in store
                    var category = me.findCategory(list[0].getId());
                    if (category) {
                        // update values
                        category.setName(categoryModel.getName());
                        category.setDotSize(categoryModel.getDotSize());
                        category.setDotColor(categoryModel.getDotColor());
                        category.setDotShape(categoryModel.getDotShape());

                        category.setLineWidth(categoryModel.getLineWidth());
                        category.setLineColor(categoryModel.getLineColor());
                        category.setLineCap(categoryModel.getLineCap());
                        category.setLineCorner(categoryModel.getLineCorner());
                        category.setLineStyle(categoryModel.getLineStyle());

                        category.setAreaLineWidth(categoryModel.getAreaLineWidth());
                        category.setAreaLineCorner(categoryModel.getAreaLineCorner());
                        category.setAreaLineStyle(categoryModel.getAreaLineStyle());
                        category.setAreaLineColor(categoryModel.getAreaLineColor());
                        category.setAreaFillColor(categoryModel.getAreaFillColor());
                        category.setAreaFillStyle(categoryModel.getAreaFillStyle());
                        category.setDefault(categoryModel.isDefault());
                    } else {
                        // couldn't load it -> failed to save it
                        success = false;
                    }
                }
                me._notifyDataChanged();
                callback(success, list[0], isNew);
            };

            this.wfstStore.commitCategories([categoryModel], callBackWrapper);
        },

        /**
         * @method getAllCategories
         * Returns all categories ("maplayers" for my places) that is loaded in the system.
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]}
         */
        getAllCategories: function () {
            return this._categoryList;
        },

        /**
         * @method getDefaultCategory
         * Returns users default category or undefined
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory}
         */
        getDefaultCategory: function () {
            return this.defaultCategory;
        },

        /**
         * @method _addMyPlace
         * @private
         * Adds given place to internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlace} myplaceModel place to add
         */
        _addMyPlace: function (myplaceModel) {
            this._placesList.push(myplaceModel);
        },
        /**
         * @method _removeMyPlace
         * @private
         * Removes given place from internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Number} placeId id for place to remove
         */
        _removeMyPlace: function (placeId) {
            var index = this.findBy(this._placesList, 'id', placeId);
            if (index !== -1) {
                this._placesList.splice(index, 1);
            }
        },
        /**
         * @method _notifyDataChanged
         * @private
         * Notifies components that places/categories have changed with 'MyPlaces.MyPlacesChangedEvent'
         */
        _notifyDataChanged: function () {
            var event = this._sandbox.getEventBuilder('MyPlaces.MyPlacesChangedEvent')();
            this._sandbox.notifyAll(event);
        },

        /**
         * @method deleteMyPlace
         * Deletes place matching given id.
         * @param {Number} placeId id for place to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        deleteMyPlace: function (placeId, callback) {
            var me = this;
            var callBackWrapper = function (success, list) {
                if (success) {
                    me._removeMyPlace(list[0]);
                    me._notifyDataChanged();
                }
                callback(success, list[0]);
            };

            this.wfstStore.deleteMyPlaces([placeId], callBackWrapper);

        },

        /**
         * @method findMyPlaceByLonLat
         * Tries to find places in given coordinates
         *
         * @param {OpenLayers.LonLat} lonlat
         * @param {Number} zoom zoomlevel
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace[]}
         */
        findMyPlaceByLonLat: function (lonlat, zoom) {
            var places = [];
            var myPlacesList = this.getAllMyPlaces(),
                i,
                olGeometry,
                hoverOnPlace,
                tolerance;

            for (i = 0; i < myPlacesList.length; ++i) {
                olGeometry = myPlacesList[i].getGeometry();
                hoverOnPlace = false;
                // point geometry needs too exact hover to be usable without some
                // tolerance
                if ('OpenLayers.Geometry.Point' === olGeometry.CLASS_NAME) {
                    // TODO: figure out some Perfect(tm) math for scale
                    tolerance = 720 - (zoom * zoom * 5);
                    if (zoom > 10) {
                        tolerance = 5;
                    } else if (zoom > 8) {
                        tolerance = 20;
                    } else if (zoom > 5) {
                        tolerance = 50;
                    }
                    //console.log(tolerance);
                    hoverOnPlace = olGeometry.atPoint(lonlat, tolerance, tolerance);
                } else {
                    hoverOnPlace = olGeometry.atPoint(lonlat);
                }
                if (hoverOnPlace) {
                    places.push(myPlacesList[i]);
                }
            }
            return places;
        },
        /**
         * @method findMyPlace
         * Tries to find place with given id
         * @param {Number} id
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace}
         */
        findMyPlace: function (id) {
            var index = this.findBy(this._placesList, 'id', id);
            if (index !== -1) {
                return this._placesList[index];
            }
            return null;
        },
        /**
         * @method findCategory
         * Tries to find category with given id
         * @param {Number} id
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory}
         */
        findCategory: function (id) {
            var index = this.findBy(this._categoryList, 'id', id);
            if (index !== -1) {
                return this._categoryList[index];
            }
            return null;
        },

        /**
         * @method findBy
         * Tries to find object from the given list.
         * Abstraction method used by findCategory and findMyPlace.
         *
         * @param {Object} list list to loop through
         * @param {String} attrName attribute to compare against
         * @param {Object} attrValue value we want to find
         *
         * @return {Number} index on the list where the object was found or -1 if not found
         */
        findBy: function (list, attrName, attrValue) {
            var i;
            for (i = 0; i < list.length; i++) {
                // TODO: maybe some error checking?
                if (list[i][attrName] === attrValue) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * @method saveMyPlace
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace} myplaceModel place to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), myplaceModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveMyPlace: function (myplaceModel, callback) {
            var me = this;
            var isNew = !(myplaceModel.getId());

            var callBackWrapper = function (success, list) {
                if (isNew && success) {
                    me._addMyPlace(list[0]);
                } else {
                    if (list.length < 1) {
                        // couldn't parse myplaces featurecollection
                        success = false;
                    } else {
                        // update models updateDate in store
                        var myplace = me.findMyPlace(list[0].getId());
                        if (myplace) {
                            // update values
                            myplace.setName(myplaceModel.getName());
                            myplace.setDescription(myplaceModel.getDescription());
                            myplace.setAttention_text(myplaceModel.getAttention_text());
                            myplace.setLink(myplaceModel.getLink());
                            myplace.setCategoryID(myplaceModel.getCategoryID());
                            myplace.setGeometry(myplaceModel.getGeometry());
                            myplace.setUpdateDate(list[0].getUpdateDate());
                        } else {
                            // couldn't load it -> failed to save it
                            success = false;
                        }
                    }
                }
                me._notifyDataChanged();
                callback(success, list[0], isNew);
            };

            this.wfstStore.commitMyPlaces([myplaceModel], callBackWrapper);
        },

        /**
         * @method getAllMyPlaces
         * Returns all users my places
         * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace[]}
         */
        getAllMyPlaces: function () {
            return this._placesList;
        },


        /**
         * @method publishCategory
         * Method marks the category published or unpublished
         * @param {Number} categoryId
         * @param {Boolean} makePublic true to publish, false to unpublish
         * @param {Function} callback function receives a boolean parameter with true on successful operation
         */
        publishCategory: function (categoryId, makePublic, callback) {
            var category = this.findCategory(categoryId);
            if (!category) {
                // category not found
                callback(false);
            }
            var me = this;
            var ajaxUrl = this._sandbox.getAjaxUrl();
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data: {
                    id: category.getId(),
                    makePublic: makePublic
                },
                url: ajaxUrl + 'action_route=PublishMyPlaceLayer',
                success: function (pResp) {
                    if (pResp) {
                        category.setPublic(makePublic);
                        callback(true);
                        me._notifyDataChanged();
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
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });