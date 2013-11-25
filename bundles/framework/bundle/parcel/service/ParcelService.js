/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelService
 * 
 * Service object that handles transaction related function calls and delegates the
 * WFST actions to {Oskari.mapframework.bundle.parcel.service.ParcelWfst}.
 * Plot actions to {Oskari.mapframework.bundle.parcel.service.ParcelPlot}.
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
    this._wfst2 = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.PreParcelWFSTStore', instance);
    this._plot = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.service.ParcelPlot', instance);
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
        this._wfst2.connect();
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
     * @method printPlace
     * Plot preparcel features via plot server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} featureType Featuretype that is used for WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    printPlace : function(feature, featureType, placeName, placeDescription, cb) {
        if (feature && featureType) {
            if (featureType === this._instance.conf.parcelFeatureType) {
                this._plotParcel(feature, placeName, placeDescription, cb);

            } else if (featureType === this._instance.conf.registerUnitFeatureType) {
                this._plotParcel(feature, placeName, placeDescription, cb);

            } else {
                cb();
            }

        } else {
            cb();
        }
    },
    /**
     * @method _plotParcel
     * Plot preparcel features via plot server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    _plotParcel : function(feature, placeName, placeDescription, cb) {
        if (feature) {
        	this._plot.plotParcel(feature, placeName, placeDescription, cb);
        }
    },
        /**
         * @method savePlace
         * Saves preparcel features to the server asynchronously and gives the success information via callback.
         * @param {obj} drawplugin instance for wfst features
         * @param {obj/json} values feature attributes
         * @param {Fuction} cb Requires information about the success as boolean parameter.
         */
        savePlace : function(drawplugin, values, cb) {

                var me = this;
                var isNew = !(values.id);
                var feature = drawplugin.getDrawing();
                var callBackWrapper = function (success, list) {
                    if (isNew && success) {
                        me.savePlaceData(drawplugin, values, list, cb);
                    } else {
                        if (list.length < 1) {
                            // couldn't parse preparcel featurecollection
                            success = false;
                        }
                        else {
                            // update models updateDate in store

                        }
                    }

                    cb(success, list[0], isNew);
                };

            if (feature) {
                this._wfst2.commitPreParcel(this.getPreParcelFromFormValues(values), callBackWrapper);
            }


        },
        /**
         * @method savePlaceData
         * Saves preparcel data features to the server asynchronously and gives the success information via callback.
         * @param {obj} drawplugin instance for wfst features
         * @param {obj/json} values feature attributes
         * @param {Fuction} cb Requires information about the success as boolean parameter.
         */
        savePlaceData : function(drawplugin, values, list, cb) {

            var me = this;
            var isNew = !(values.id);
            var feature = drawplugin.getDrawing();
            if (feature) {
                this._wfst2.commitPreParcelData(this.getPreParcelData(list, drawplugin), cb);
            }


        },
        getPreParcelFromFormValues : function(values) {
            var mylist = [];
            var preparcel = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcel');
            //preparcel.setId(id); insert automatic when undefined
            preparcel.setKvp_uid('kvp_uuid'); // values.kvp_uuid
            preparcel.setPreparcel_id(values.name);
            preparcel.setTitle(values.title);
            preparcel.setSubtitle(values.subtitle);
            preparcel.setDescription(values.desc);
            preparcel.setParent_property_id(values.parent_property_id);
            preparcel.setParent_property_quality(values.parent_property_quality);
            preparcel.setReporter(values.reporter);
            preparcel.setArea(values.area); // values.area
            preparcel.setArea_unit('m2'); //values.area_unit
            mylist.push(preparcel);
            return mylist;
        },

        getPreParcelData : function(list, drawplugin) {
            var mylist = [];
            var ppoldata = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcelData');
            //ppdata.setId(id); insert automatic when undefined
            if(list)ppoldata.setPreparcel_id(list[0].id);
            ppoldata.setGeom_type('parcel');
            ppoldata.setGeometry(drawplugin.getParcelGeometry());
            mylist.push(ppoldata);
            var pboundary = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcelData');
            //pboundary.setId(id); insert automatic when undefined
            if(list)pboundary.setPreparcel_id(list[0].id);
            pboundary.setGeom_type('boundary');
            pboundary.setGeometry(drawplugin.getBoundaryGeometry());
            mylist.push(pboundary);

            return mylist;
        },
    /**
     * @method clearParcelMap
     * Remove openlayers graphics of parcel Map
     */
    clearParcelMap : function() {
            this._plot.clearParcelMap();
        
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
           // later maybe this._wfst.saveRegisterUnit(feature, placeName, placeDescription, cb);
        }
    }
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
});
