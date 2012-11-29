/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelService', 

/**
 * @method create called automatically on construction
 * @static
 * @param {String} url
 * @param {String} uuid current users uuid
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox reference to Oskari sandbox
 * @param {String} categoryName default category name
 * 
 */
function(url, uuid, sandbox, defaultName) {

    // list of loaded categories & parcel
    this._categoryList = [];
    this._placesList = [];

    this.wfstStore = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelWFSTStore', url, uuid);
    this._sandbox = sandbox;
    this.defaultCategory = null;
    this.defaultCategoryName = defaultName;
}, {
    __qname : "Oskari.mapframework.bundle.parcel.service.ParcelService",
    getQName : function() {
        return this.__qname;
    },

    __name : "ParcelService",
    getName : function() {
        return this.__name;
    },
    /**
     * @method init
     * Initializes the service and loads 
     */
    init : function() {
        // preload stuff
        var me = this;
        this.wfstStore.connect();
        var loadedCategories = false;
        var loadedPlaces = false;
        var initialLoadCallBackCategories = function(categories) {
            if(categories) {
            	for(var i = 0; i < categories.length; ++i) {
            		me._addCategory(categories[i]);
            	}
                //me._categoryList = categories;
            }
            loadedCategories = true;
    
            if (me.getAllCategories().length === 0 && me.defaultCategoryName) {
                // user has no categories, propably a new user
                // create a default category
                me._createDefaultCategory();
            } else if (loadedPlaces) {
                me._notifyDataChanged();
            }
        };
    
        var initialLoadCallBackPlaces = function(places) {
            if(places) {
                me._placesList = places;
            }
            loadedPlaces = true;
            
            if (loadedCategories) {
                me._notifyDataChanged();
            }
        };
    
        this.wfstStore.getCategories(initialLoadCallBackCategories);
        this.wfstStore.getParcel(initialLoadCallBackPlaces);
    },
    /** Internal usage */
    _createDefaultCategory : function() {
    	var me = this;
        var defaultCategory = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.ParcelCategory');
        defaultCategory.setName(me.defaultCategoryName);
        defaultCategory.setLineWidth(2);
        defaultCategory.setLineColor('cc9900');
        defaultCategory.setAreaLineWidth(2);
        defaultCategory.setAreaLineColor('cc9900');
        defaultCategory.setAreaFillColor('ffdc00');
        defaultCategory.setDotColor('cc9900');
        defaultCategory.setDotSize(4);
        defaultCategory.setDefault(true);
        
        var defaultCategoryCreationCallback = function() {
            // called if new user -> just created a default category for user
    
            if (me.getAllCategories().length === 0) {
                // something went wrong and we should propably just show error
                // message instead of parcels functionality
                alert("error couldn't create default category");
                
                // FIXME: for debuggin: 
                /*
                alert('manually adding default category for now - This is debug version - remove from ParcelService.init()');
                
                var defaultCategory = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.ParcelCategory');
                defaultCategory.setName(me.defaultCategoryName);
                defaultCategory.setDefault(true);
                defaultCategory.setId('debug');
                me._addCategory(defaultCategory);
                me._notifyDataChanged();
                */
                // /FIXME: for debuggin ^ 
            } else {
                me._notifyDataChanged();
            }
        };
        
        this.saveCategory(defaultCategory, defaultCategoryCreationCallback);
    },

    /** Internal usage */
    _addCategory : function(categoryModel) {
        if(categoryModel.isDefault()) {
            this.defaultCategory = categoryModel;
        }
        this._categoryList.push(categoryModel);
    },

    /** Internal usage */
    _movePlacesToCategory : function(oldCategoryId, newCategoryId, callback) {
        var me = this;
        var placesInDeleteCategory = this.getPlacesInCategory(oldCategoryId);
        if (placesInDeleteCategory.length == 0) {
            // no places to move -> callback right away
            callback(true);
            return;
        }
        for (var i = 0; i < placesInDeleteCategory.length; i++) {
            placesInDeleteCategory[i].setCategoryID(newCategoryId);
        }
        var callBackWrapper = function(success, list) {
            // update models updateDate in store
            //var parcel = me.findParcel(list[0].get('id'));
            //parcel.set('updateDate', list[0].get('updateDate'));
            me._notifyDataChanged();
            callback(success);
        };
        // need to wrap callback and call changes notify if ever called directly
        this.wfstStore.commitParcel(placesInDeleteCategory, callBackWrapper);
    },

    /** Internal usage */
    _deletePlacesInCategory : function(categoryId, callback) {
        var placesInDeleteCategory = this.getPlacesInCategory(categoryId);
        var idList = [];
        for (var i = 0; i < placesInDeleteCategory.length; i++) {
            idList.push(placesInDeleteCategory[i].getId());
        }
        if (idList.length == 0) {
            // no places to delete -> callback right away
            callback(true);
            return;
        }
        var me = this;
        var callBackWrapper = function(success, list) {
            if (success) {
                for (var i = 0; i < placesInDeleteCategory.length; i++) {
                    me._removeParcel(list[i]);
                }
                me._notifyDataChanged();
            }
            callback(success);
        };
        this.wfstStore.deleteParcel(idList, callBackWrapper);
    },
    /**
     * @method parseDate
     *
     * parses date for parcels
     *
     * @param dateStr format 2011-11-02T15:27:48.981+02:00 (time part is
     * optional)
     * @return array with date part in first index, time (optional) in second,
     * empty array if param is undefined or less than 10 characters
     */
    parseDate : function(dateStr) {

        if (!dateStr && dateStr.length < 10) {
            return [];
        }
        var year = dateStr.substring(0, 4);
        var month = dateStr.substring(5, 7);
        var day = dateStr.substring(8, 10);
        var returnValue = [day + '.' + month + '.' + year];

        var time = '';
        // TODO: error handling
        if (dateStr.length == 29) {
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
            time = hour + ':' + min + ':' + sec
            returnValue.push(time);
        }

        return returnValue;
    },

    getPlacesInCategory : function(categoryId) {
        var placesInCategory = [];
        for (var i = 0; i < this._placesList.length; i++) {
            if (this._placesList[i].getCategoryID() == categoryId) {
                placesInCategory.push(this._placesList[i]);
            }
        }
        return placesInCategory;
    },

    deleteCategory : function(categoryId, movePlacesToDefault, callback) {
        var me = this;

        // call actual category delete once category has been cleared of places
        // successfully
        var callBackWrapper = function(success) {
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
        }
        // delete places to clear category if places will not be moved
        else {
            me._deletePlacesInCategory(categoryId, callBackWrapper);
        }
    },

    /** Internal handling only */
    _deleteEmptyCategory : function(categoryId, callback) {

        var me = this;
        var callBackWrapper = function(success, list) {
            if (success) {
                me._removeCategory(list[0]);
            }
            callback(success);
            me._notifyDataChanged();
        };

        this.wfstStore.deleteCategories([categoryId], callBackWrapper);
    },

    /** Internal list handling only */
    _removeCategory : function(categoryId) {
        for (var i = 0; i < this._categoryList.length; i++) {
            if (this._categoryList[i].getId() == categoryId) {
                this._categoryList.splice(i, 1);
                break;
            }
        }
    },

    saveCategory : function(categoryModel, callback) {
        var me = this;
        var isNew = !(categoryModel.getId());

        var callBackWrapper = function(success, list) {
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
                    
                    category.setLineWidth(categoryModel.getLineWidth());
                    category.setLineColor(categoryModel.getLineColor());
                    
                    category.setAreaLineWidth(categoryModel.getAreaLineWidth());
                    category.setAreaLineColor(categoryModel.getAreaLineColor());
                    category.setAreaFillColor(categoryModel.getAreaFillColor());
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

    getAllCategories : function() {
        return this._categoryList;
    },

    getDefaultCategory : function() {
        return this.defaultCategory;
    },

    /** Internal usage */
    _addParcel : function(parcelModel) {
        this._placesList.push(parcelModel);
    },
    /** Internal list handling only */
    _removeParcel : function(placeId) {
        var index = this.findBy(this._placesList, 'id', placeId);
        if (index !== -1) {
            this._placesList.splice(index, 1);
        }
    },
    /** Internal usage */
    _notifyDataChanged : function() {
        var event = this._sandbox.getEventBuilder('Parcel.ParcelChangedEvent')();
        this._sandbox.notifyAll(event);
    },

    deleteParcel : function(placeId, callback) {
        var me = this;
        var callBackWrapper = function(success, list) {
            if (success) {
                me._removeParcel(list[0]);
                me._notifyDataChanged();
            }
            callback(success, list[0]);
        };

        this.wfstStore.deleteParcel([placeId], callBackWrapper);

    },

    /**
     * Tries to find a place with given coordinates
     *
     * @param {OpenLayers.LonLat} lonlat
     * @param {Number} zoom zoomlevel
     */
    findParcelByLonLat : function(lonlat, zoom) {
        var places = [];
        var parcelList = this.getAllParcel();

        for (var i = 0; i < parcelList.length; ++i) {
            var olGeometry = parcelList[i].getGeometry();
            var hoverOnPlace = false;
            // point geometry needs too exact hover to be usable without some
            // tolerance
            if ('OpenLayers.Geometry.Point' === olGeometry.CLASS_NAME) {
                // TODO: figure out some Perfect(tm) math for scale
                var tolerance = 720 - (zoom * zoom * 5);
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
                places.push(parcelList[i]);
            }
        }
        return places;
    },
    /**
     * @method findParcel
     * Tries to find place with given id
     * @param {Number} id
     * @return {Oskari.mapframework.bundle.parcel.model.Parcel}
     */
    findParcel : function(id) {
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
     * @return {Oskari.mapframework.bundle.parcel.model.ParcelCategory}
     */
    findCategory : function(id) {
        var index = this.findBy(this._categoryList, 'id', id);
        if (index !== -1) {
            return this._categoryList[index];
        }
        return null;
    },

    /**
     * Tries to find object from the given list
     *
     *
     * @param list list to loop through
     * @param attrName attribute to compare against
     * @param attrValue value we want to find
     *
     * @return index on the list where the object was found or -1 if not found
     */
    findBy : function(list, attrName, attrValue) {
        for (var i = 0; i < list.length; i++) {
            // TODO: maybe some error checking?
            if (list[i][attrName] === attrValue) {
                return i;
            }
        }
        return -1;
    },
    saveParcel : function(parcelModel, callback) {
        var me = this;
        var isNew = !(parcelModel.getId());

        var callBackWrapper = function(success, list) {
            if (isNew && success) {
                me._addParcel(list[0]);
            } else {
                // update models updateDate in store
                var parcel = me.findParcel(list[0].getId());
                if (parcel) {
                    // update values
                    parcel.setName(parcelModel.getName());
                    parcel.setDescription(parcelModel.getDescription());
                    parcel.setCategoryID(parcelModel.getCategoryID());
                    parcel.setGeometry(parcelModel.getGeometry());
                    parcel.setUpdateDate(list[0].getUpdateDate());
                } else {
                    // couldn't load it -> failed to save it
                    success = false;
                }
            }
            me._notifyDataChanged();
            callback(success, list[0], isNew);
        };

        this.wfstStore.commitParcel([parcelModel], callBackWrapper);
    },

    /**
     * @method getAllParcel
     * Returns all users parcels
     * @return {Oskari.mapframework.bundle.parcel.model.Parcel[]}
     */
    getAllParcel : function() {
        return this._placesList;
    },

  
    /**
     * @method publishCategory
     * Method marks the category published or unpublished
     * @param {Number} categoryId
     * @param {Boolean} makePublic true to publish, false to unpublish
     * @param {Function} callback function receives a boolean parameter with true on successful operation
     */
    publishCategory : function(categoryId, makePublic, callback) {
        var category = this.findCategory(categoryId);
        if(!category) {
            // category not found
            callback(false);
        }
        var me = this;
        var ajaxUrl = this._sandbox.getAjaxUrl();
        jQuery.ajax({
            type : "GET",
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            data : {
                id : category.getId(),
                makePublic : makePublic
            },
            url : ajaxUrl + 'action_route=PublishParcelLayer',
            success : function(pResp) {
                if(pResp) {
                    category.setPublic(makePublic);
                    callback(true);
                    me._notifyDataChanged();
                }
                else {
                    callback(false);
                }
            },
            error : function(jqXHR, textStatus) {
                if (jqXHR.status != 0) {
                    callback(false);
                }
            }
        });
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});