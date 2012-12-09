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
    },

    loadParcel : function(fid, cb) {
        this._wfst.loadParcel(fid, cb);
    },

    loadRegisterUnit : function(fid, cb) {
        this._wfst.loadRegisterUnit(fid, cb);
    },

    saveParcel : function(feature, cb) {
        this._wfst.saveParcel(feature, cb);
    },

    saveRegisterUnit : function(feature, cb) {
        this._wfst.saveRegisterUnit(feature, cb);
    },
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
}); 