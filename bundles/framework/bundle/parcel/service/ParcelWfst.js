/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelWfst
 *
 *
 * Transforms OpenLayers geometry to WFS Transactions.
 * Also, provides functions to load feature data from the server.
 *
 * Notice, uses instance configuration information to get the query URL and WFST transaction URL,
 * and feature type strings for protocol feature types.
 *
 * Notice, if queryUrl and transaction Url differ, WFST uses INSERT, otherwise UPDATE.
 * Also, FID is parced to be only a number for WFST action.
 */
//TODO: refactor with Oskari.mapframework.bundle.parcel.service.PreParcelWFSTStore
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelWfst',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
 */
function(instance) {
    this.instance = instance;
    this.protocols = {};
    this.protocols['parcel'] = new OpenLayers.Protocol.WFS({
        version : '1.1.0',
        srsName : 'EPSG:3067',
        featureType : instance.conf.parcelFeatureType,
        featureNS : 'http://xml.nls.fi/ktjkiiwfs/2010/02',
        featurePrefix : 'ktjkiiwfs',
        readOptions: {meThis: this},
        parseResponse: function(request, options) {
            return options.meThis._parseResponse(request, options);
        },
        url : instance.conf.queryUrl
    });
    this.protocols['registerUnit'] = new OpenLayers.Protocol.WFS({
        version : '1.1.0',
        srsName : 'EPSG:3067',
        featureType : instance.conf.registerUnitFeatureType,
        featureNS : 'http://xml.nls.fi/ktjkiiwfs/2010/02',
        featurePrefix : 'ktjkiiwfs',
        url : instance.conf.queryUrl
    });

    var urlCommit = instance.conf.transactionUrl || instance.conf.queryUrl;
    this.protocols['parcelCommit'] = new OpenLayers.Protocol.WFS({
        version : '1.1.0',
        srsName : 'EPSG:3067',
        featureType : this.instance.conf.parcelFeatureType,
        featureNS : 'http://xml.nls.fi/ktjkiiwfs/2010/02',
        featurePrefix : 'ktjkiiwfs',
        url : urlCommit
    });
    this.protocols['registerUnitCommit'] = new OpenLayers.Protocol.WFS({
        version : '1.1.0',
        srsName : 'EPSG:3067',
        featureType : this.instance.conf.registerUnitFeatureType,
        featureNS : 'http://xml.nls.fi/ktjkiiwfs/2010/02',
        featurePrefix : 'ktjkiiwfs',
        url : urlCommit
    });
}, {

    /**
     * @method loadParcel
     * Loads feature from the server asynchronously and gets the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadParcel : function(fid, cb) {
        this._downloadFeature(fid, this.protocols['parcel'], cb);
    },
    /**
     * @method loadRegisterUnit
     * Loads feature from the server asynchronously and gets the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    loadRegisterUnit : function(fid, cb) {
        this._downloadFeature(fid, this.protocols['registerUnit'], cb);
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
        this._commitFeature(feature, placeName, placeDescription, this.protocols['parcelCommit'], cb);
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
     // no use ?   this._commitFeature(feature, placeName, placeDescription, this.protocols['registerUnitCommit'], cb);
    },

    /**
     * @method _downloadFeature
     * @private
     * Loads feature from the server asynchronously and gets the feature via callback.
     * @param {String} fid FID for the feature that should be loaded from the server.
     * @param {Function} cb Callback function. Requires the downloaded feature as a parameter or undefined if error occurred.
     */
    _downloadFeature : function(fid, protocol, cb) {
        var me = this;
        var lit;

        // Handle two fid formats: with "0" or "-" symbols
        if (fid.indexOf("-") === -1) {
            lit = fid;
        } else {
            var i, j;
            lit = "";
            var fields = fid.split("-");
            // Not valid?
            if (fields.length !== 4) return;
            for (i = 0; i < 2; i++) {
                for (j = 0; j < 3-fields[i].length; j++) {
                    lit = lit.concat("0");
                }
                for (j = 0; j < fields[i].length; j++) {
                    lit = lit.concat(fields[i].charAt(j));
                }
            }
            for (i = 2; i < 4; i++) {
                for (j = 0; j < 4-fields[i].length; j++) {
                    lit = lit.concat("0");
                }
                for (j = 0; j < fields[i].length; j++) {
                    lit = lit.concat(fields[i].charAt(j));
                }
            }
        }

        var filter = new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                        property: 'ktjkiiwfs:kiinteistotunnus',
                                        value: lit
                                   });
        var loc = this.instance.getLocalization('notification').placeLoading;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(loc.title, loc.message);
        protocol.read({
            filter : filter,
            callback : function(response) {
                dialog.close();
                if (response && response.features.polFeatures && response.features.polFeatures.length > 0) {
                    cb(response.features);

                } else {
                    var locError = me.instance.getLocalization('notification')['error'];
                    me.instance.showMessage(locError.title, locError.loadPlace);
                    cb();
                }
            }
        });
    },

    /**
     * @method _commitFeature
     * Saves feature to the server asynchronously and gives the success information via callback.
     * @param {OpenLayers.Feature.Vector} feature The feature whose data will be saved to the server by using WFST.
     * @param {String} placeName Name of the place.
     * @param {String} placeDescription Description of the place.
     * @param {OpenLayers.Protocol.WFS} protocol The protocol that is used for the WFST action.
     * @param {Fuction} cb Requires information about the success as boolean parameter.
     */
    _commitFeature : function(feature, placeName, placeDescription, protocol, cb) {
        var me = this;

        // Set the place and description for the feature if they are given.
        // If they are not given, then do not set them.
        if (feature.attributes) {
            if (placeName) {
                // Here we suppose that server uses "nimi" property for the place name.
                feature.attributes.nimi = placeName;
            }
            if (placeDescription || typeof placeDescription === "string") {
                // Set the place description also if an empty string is given.
                // Here we suppose that server uses "kuvaus" property for the place description.
                feature.attributes.kuvaus = placeDescription;
            }
        }

        // Insert feature to the server if transaction URL differs from the query URL that has given the feature.
        // Otherwise, update data if the query server is same as the transaction server.
        var featureState = feature.state;
        if (this.instance.conf.transactionUrl && this.instance.conf.queryUrl != this.instance.conf.transactionUrl) {
            feature.toState(OpenLayers.State.INSERT);

        } else {
            // toState may handle some workflow stuff and may not work here
            feature.toState(OpenLayers.State.UPDATE);
            // just to be sure
            feature.state = OpenLayers.State.UPDATE;
        }

        // Before commit, change the fid to be number.
        // Query server may give a prefix in fid but it is not wanted in commit.
        feature.fid = me._parseFidNumber(feature.fid);

        // Show dialog to inform about the asynchronous operation.
        var dialogAdding = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var loc = this.instance.getLocalization('notification').placeAdding;
        dialogAdding.show(loc.title, loc.message);
        // Commit feature to the server.
        protocol.commit([feature], {
            callback : function(response) {
                dialogAdding.close();
                // Change feature state to its original value after operation
                // because state was set above for the commit.
                feature.state = featureState;
                var success = response && !response.error;
                if (!success) {
                    var locError = me.instance.getLocalization('notification')['error'];
                    me.instance.showMessage(locError.title, locError.savePlace);
                }
                // Callback requires information about the success.
                cb(success);
            }
        });
    },

    /**
     * @method _parseFidNumber
     * @private
     * Removes the possible string prefix from the given fid.
     * @param {String} fid
     * @return {String} Parsed fid. Notice, this will return only positive numbers. "-" is also parsed away.
     */
    _parseFidNumber : function(fid) {
        var newFid = fid;
        if (newFid && ( typeof newFid) === "string" && newFid.length > 0 && !isNaN(newFid.substr(length - 1))) {
            // Get the number from the end of the string.
            // Possible string prefix is removed.
            newFid = parseInt(newFid.match(/(\d+)$/)[0], 10);
        }
        return newFid;
    },
        /**
         * Custom parser for Parcel WFS request
         *
         * @param request  OpenLayers.Protocool.WFS parseResponse param
         * @param options  OpenLayers.Protocool.WFS parseResponse param
         * @returns {{}}  Parcel polygons and polygon boundary points
         * @private
         */
        _parseResponse: function (request, options) {
            var me = this;
            var featureSet = {};
            var pointFeatures = [];
            var formatgml = new OpenLayers.Format.GML();
            var format = new OpenLayers.Format.XML();

            // Point features
            var document = format.read(request.responseText).documentElement;
            if (document) {
                var featureNodes = document.getElementsByTagName("ktjkiiwfs:rajamerkinTietoja");
                for (var i = 0; i < featureNodes.length; i++) {
                    var pf = formatgml.parseFeature(featureNodes[i]);
                    if (pf) {
                        pointFeatures.push(pf)
                    }
                }
            }

            // Polygon features
            var gmlOptionsm = {
                featureType: me.instance.conf.parcelFeatureType,
                featurePrefix: "ktjkiiwfs",
                featureNS: "http://xml.nls.fi/ktjkiiwfs/2010/02"
            };

            var gmlOptionsInm = OpenLayers.Util.extend(
                OpenLayers.Util.extend({}, gmlOptionsm)
            );
            var formatm = new OpenLayers.Format.GML.v3(gmlOptionsInm);
            var polFeatures = formatm.read(request.responseText);
            featureSet.polFeatures = polFeatures;
            featureSet.pointFeatures = pointFeatures;
            return featureSet;
        }
});
