/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 * 
 * Service object that handles transaction related function calls and delegates the
 * WFST actions to {Oskari.mapframework.bundle.parcel.service.ParcelWfst}.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelService',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance The application instance.
 */
function(instance) {
    this._instance = instance;
    this._wfst = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelWfst', instance);
}, {
    /**
     * @return {String} Serive class name. 
     */
    getQName : function() {
        return "Oskari.mapframework.bundle.parcel.service.ParcelService";
    },

    /**
     * @return {String} Serive name. 
     */
    getName : function() {
        return "ParcelService";
    },

    /**
     * @method init
     * Initializes the service and loads
     */
    init : function() {
    },

    /**
     * @method loadParcel
     * Loads feature from the server asynchronously and gives the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadParcel : function(fid, cb) {
        this._wfst.loadParcel(fid, cb);
    },
    /**
     * @method loadRegisterUnit
     * Loads feature from the server asynchronously and gives the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadRegisterUnit : function(fid, cb) {
        this._wfst.loadRegisterUnit(fid, cb);
    },

    /**
     * @method savePlace 
     * Saves feature to the server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} featureType Featuretype that is used for WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    savePlace : function(feature, featureType, placeName, placeDescription, cb) {
        if (feature && featureType) {
            if (featureType === this._instance.conf.parcelFeatureType) {
                this.saveParcel(feature, placeName, placeDescription, cb);

            } else if (featureType === this._instance.conf.registerUnitFeatureType) {
                this.saveRegisterUnit(feature, placeName, placeDescription, cb);

            } else {
                cb();
            }

        } else {
            cb();
        }
    },
    /**
     * @method saveParcel
     * Saves feature to the server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    saveParcel : function(feature, placeName, placeDescription, cb) {
        if (feature) {
            this._wfst.saveParcel(feature, placeName, placeDescription, cb);
        }
    },

    /**
     * @method saveRegisterUnit
     * Saves feature to the server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    saveRegisterUnit : function(feature, placeName, placeDescription, cb) {
        if (feature) {
            this._wfst.saveRegisterUnit(feature, placeName, placeDescription, cb);
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
