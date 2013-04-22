/**
 * @class Oskari.digiroad.bundle.myplaces2.service.MyPlacesService
 * 
 */
Oskari.clazz.define('Oskari.digiroad.bundle.myplaces2.service.MyPlacesService', 

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

    this.wfstStore = Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.service.MyPlacesWFSTStore', url, uuid);
    this._sandbox = sandbox;
}, {
    __qname : "Oskari.digiroad.bundle.myplaces2.service.MyPlacesService",
    getQName : function() {
        return this.__qname;
    },

    __name : "DigiroadMyPlacesService",
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
        var loadedPlaces = false;
    
        var initialLoadCallBackPlaces = function(places) {
            if(places) {
                me._placesList = places;
            }
            loadedPlaces = true;
            me._notifyDataChanged();
        };

        var initialLoadCallBackEditedFeatures = function(features) {
            var event = me._sandbox.getEventBuilder('DigiroadMyPlaces.EditedFeaturesLoadedEvent')(features);
            me._sandbox.notifyAll(event);
        };
        
        var initialLoadCallBackFeedback = function(feedbackFeatures) {
            var event = me._sandbox.getEventBuilder('DigiroadMyPlaces.FeedbackLoadedEvent')(feedbackFeatures);
            me._sandbox.notifyAll(event);
        };
    
        this.wfstStore.getMyPlaces(initialLoadCallBackPlaces);
        this.wfstStore.getEditedFeatures(initialLoadCallBackEditedFeatures);
        this.wfstStore.getFeedbackFeatures(initialLoadCallBackFeedback);
        this.getAllNewRestrictions();
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
        var event = this._sandbox.getEventBuilder('DigiroadMyPlaces.MyPlacesChangedEvent')();
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
     * Tries to find a place with given coordinates
     *
     * @param {OpenLayers.LonLat} lonlat
     * @param {Number} zoom zoomlevel
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
     * @method findMyPlace
     * Tries to find place with given id
     * @param {Number} id
     * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace}
     */
    findMyPlace : function(id) {
        var index = this.findBy(this._placesList, 'id', id);
        if (index !== -1) {
            return this._placesList[index];
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
                    // update values
                    myplace.setDynType(myplaceModel.getDynType());
                    myplace.setDynValue(myplaceModel.getDynValue());
                    myplace.setCategoryID(myplaceModel.getCategoryID());
                    myplace.setGeometry(myplaceModel.getGeometry());
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
    
    /**
     * @method saveFeedback
     * Saves the user drawn feedback polygon to the backend.
     * @param {Object} feedbackModel the object containing features and geometry of the polygon.
     * @param {Function} callback the function that gets called afterwards.
     */
    saveFeedback: function(feedbackModel, callback) {
        var me = this;
        var callbackWrapper = function(success) {
            if(success) {
                me.getAllFeedback();
                callback(true);
            } else {
                callback(false);
            }
        }
        this.wfstStore.commitFeedback(feedbackModel, callbackWrapper);
    },

    /**
     * @method getAllFeedback
     * Retrieves the feedback features from the backend and sends an event about it.
     */
    getAllFeedback: function() {
        var me = this;
        var callback = function(feedback) {
            var event = me._sandbox.getEventBuilder('DigiroadMyPlaces.FeedbackLoadedEvent')(feedback);
            me._sandbox.notifyAll(event);
        };
        me.wfstStore.getFeedbackFeatures(callback);
    },

    /**
     * @method deleteFeedback
     * Deletes a feedback feature from the backend and reloads the remaining ones.
     * @param {Integer} featureId
     * @param {Function} callback
     */
    deleteFeedback: function(featureId, callback) {
        var me = this;
        var callbackWrapper = function(success) {
            if(success) {
                me.getAllFeedback();
                callback(true);
            } else {
                callback(false);
            }
        };
        this.wfstStore.deleteFeedback(featureId, callbackWrapper);
    },

    /**
     * @method getAllMyPlaces
     * Returns all users my places
     * @return {Oskari.mapframework.bundle.myplaces2.model.MyPlace[]}
     */
    getAllMyPlaces : function() {
        return this._placesList;
    },
    
    /**
     * @method getAllEditedFeatures
     * Retrieves all the edited features from the backend.
     * Sends an event notifying that the features are loaded.
     */
    getAllEditedFeatures: function() {
        var me = this;
        var callback = function(features) {
            var event = me._sandbox.getEventBuilder('DigiroadMyPlaces.EditedFeaturesLoadedEvent')(features);
            me._sandbox.notifyAll(event);
        };
        me.wfstStore.getEditedFeatures(callback);
    },

    /**
     * @method saveEditedFeature
     * @param {String} layerType 'element' or 'segment'
     * @param {String} layerName e.g. 'nopeusrajoitus
     * @param {Object} feature an OpenLayers feature object
     * @param {Function} callback eventually gets called
     */
    saveEditedFeature: function(layerType, layerName, feature, callback) {
    	var me = this;
    	var callbackWrapper = function(success) {
    		if(success) {
    			me.getAllEditedFeatures();
    			callback(true);
    		} else {
    			callback(false);
    		}
    	};
    	
        if(layerType === "element") {
            this.wfstStore.commitEditedElements(feature, layerName, callbackWrapper);
        } else if(layerType === "segment") {
            this.wfstStore.commitEditedSegments(feature, layerName, callbackWrapper);
        }
    },
    
    /**
     * @method deleteEditedFeature
     * @param {String} protocolType either 'edited_elements' or 'edited_segments'
     * @param {Integer} featureId the id of the feature that's about to get destroyed
     * @param {Function} callback the function that gets called when we're done
     */
    deleteEditedFeature: function(protocolType, featureId, callback) {
        var me = this;
        var callbackWrapper = function(success) {
            if(success) {
                me.getAllEditedFeatures();
                callback(true);
            } else {
                callback(false);
            }
        };
        if(protocolType) {
            this.wfstStore.deleteEditedFeatures(protocolType, [featureId], callbackWrapper);
        }
    },
    
    /**
     * @method getAllNewRestrictions
     * Retrieves all created turning restrictions from the backend
     * and sends an event with the returned features.
     */
    getAllNewRestrictions: function() {
        var me = this;
        var callback = function(features) {
            var event = me._sandbox.getEventBuilder('DigiroadMyPlaces.NewRestrictionsLoadedEvent')(features);
            me._sandbox.notifyAll(event);
        };
        me.wfstStore.getNewRestrictions(callback);
    },
    
    /**
     * @method saveNewRestriction
     * @param {Object} restriction an OpenLayers feature object
     * @param {Function} callback
     */
    saveNewRestriction: function(restriction, callback) {
        var me = this;
        var callbackWrapper = function(success) {
            if(success) {
            	me.getAllNewRestrictions();
                callback(true);
            } else {
                callback(false);
            }
        };
        this.wfstStore.commitNewRestriction(restriction, callbackWrapper);
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});