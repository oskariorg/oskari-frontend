/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelService', 

/**
 * @method create called automatically on construction
 * @static
 * @param {String} url
 * @param {String} transactionUrl
 * @param {String} uuid current users uuid
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox reference to Oskari sandbox
 * 
 */
function(url, transActionUrl, uuid, sandbox) {

    // list of loaded parcel
    this._placesList = [];

    this.wfstStore = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelWFSTStore', url, transActionUrl, uuid);
    this._sandbox = sandbox;
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

}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});