/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelService',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} instance
 */
function(instance) {
    this._instance = instance;
    this._wfst = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelWfst', instance);
}, {
    getQName : function() {
        return "Oskari.mapframework.bundle.parcel.service.ParcelService";
    },

    getName : function() {
        return "ParcelService";
    },

    /**
     * @method init
     * Initializes the service and loads
     */
    init : function() {
    },

    loadParcel : function(fid, cb) {
        this._wfst.loadParcel(fid, cb);
    },

    loadRegisterUnit : function(fid, cb) {
        this._wfst.loadRegisterUnit(fid, cb);
    },

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

    saveParcel : function(feature, placeName, placeDescription, cb) {
        if (feature) {
            this._wfst.saveParcel(feature, placeName, placeDescription, cb);
        }
    },

    saveRegisterUnit : function(feature, placeName, placeDescription, cb) {
        if (feature) {
            this._wfst.saveRegisterUnit(feature, placeName, placeDescription, cb);
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
