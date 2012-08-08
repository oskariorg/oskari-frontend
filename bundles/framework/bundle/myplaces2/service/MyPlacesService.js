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
 * @param {String} categoryName default category name
 * 
 */
function(url, uuid, sandbox, defaultName) {

    // list of loaded categories & myplaces
    this._categoryList = [];
    this._placesList = [];

    this.wfstStore = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.service.MyPlacesWFSTStore', url, uuid);
    this._sandbox = sandbox;
    this.defaultCategory = null;
    this.defaultCategoryName = defaultName;
}, {
    __qname : "Oskari.mapframework.bundle.myplaces2.service.MyPlacesService",
    getQName : function() {
        return this.__qname;
    },

    __name : "MyPlacesService",
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
        var defaultCategoryCreationCallback = function() {
            // called if new user -> just created a default category for user
    
            if (me.getAllCategories().length === 0) {
                // something went wrong and we should propably just show error
                // message instead of my places functionality
                alert("error couldn't create default category");
                
                // FIXME: for debuggin: 
                /*
                alert('manually adding default category for now - This is debug version - remove from MyPlacesService.init()');
                
                var defaultCategory = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
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
        var loadedCategories = false;
        var loadedPlaces = false;
        var initialLoadCallBackCategories = function(categories) {
            if(categories) {
                me._categoryList = categories;
            }
            loadedCategories = true;
    
            if (me.getAllCategories().length === 0 && me.defaultCategoryName) {
                // user has no categories, propably a new user
                // create a default category
                var defaultCategory = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
                defaultCategory.setName(me.defaultCategoryName);
                defaultCategory.setDefault(true);
                me.saveCategory(defaultCategory, defaultCategoryCreationCallback);
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
        this.wfstStore.getMyPlaces(initialLoadCallBackPlaces);
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
            //var myplace = me.findMyPlace(list[0].get('id'));
            //myplace.set('updateDate', list[0].get('updateDate'));
            me._notifyDataChanged();
            callback(success, list[0]);
        };
        // need to wrap callback and call changes notify if ever called directly
        this.wfstStore.commitMyPlaces(placesInDeleteCategory, callBackWrapper);
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
        var callBackWrapper = function(success, list) {
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
                // TODO: update model in store maybe?
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
    _addMyPlace : function(myplaceModel) {
        this._placesList.push(myplaceModel);
    },
    /** Internal list handling only */
    _removeMyPlace : function(placeId) {
        var index = this.findBy(this._placesList, 'id', placeId);
        if (index !== -1) {
            this._placesList.splice(index, 1);
        }
    },
    /** Internal usage */
    _notifyDataChanged : function() {
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlacesChangedEvent')();
        this._sandbox.notifyAll(event);
    },

    deleteMyPlace : function(placeId, callback) {
        var me = this;
        var callBackWrapper = function(success, list) {
            if (success) {
                me._removeMyPlace(list[0]);
                me._notifyDataChanged();
            }
            callback(success, list[0]);
        };

        this.wfstStore.deleteMyPlaces([placeId], callBackWrapper);

    },

    /**
     * Tries to find category with given coordinates
     *
     * @param id
     */
    findMyPlaceByLonLat : function(lonlat, zoom) {
        var places = [];
        var myPlacesList = this.getAllMyPlaces();

        for (var i = 0; i < myPlacesList.length; ++i) {
            var olGeometry = myPlacesList[i].getGeometry();
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
                places.push(myPlacesList[i]);
            }
        }
        return places;
    },
    /**
     * Tries to find category with given id
     *
     * @param id
     */
    findMyPlace : function(id) {
        var index = this.findBy(this._placesList, 'id', id);
        if (index !== -1) {
            return this._placesList[index];
        }
        return null;
    },
    /**
     * Tries to find category with given id
     *
     * @param id
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
    saveMyPlace : function(myplaceModel, callback) {
        var me = this;
        var isNew = !(myplaceModel.getId());

        var callBackWrapper = function(success, list) {
            if (isNew && success) {
                me._addMyPlace(list[0]);
            } else {
                // update models updateDate in store
                var myplace = me.findMyPlace(list[0].getId());
                if (myplace) {
                    myplace.setUpdateDate(list[0].getUpdateDate());
                } else {
                    // couldn't load it -> failed to save it
                    success = false;
                }
            }
            me._notifyDataChanged();
            callback(success, list[0], isNew);
        };

        this.wfstStore.commitMyPlaces([myplaceModel], callBackWrapper);
    },

    getAllMyPlaces : function() {
        return this._placesList;
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});