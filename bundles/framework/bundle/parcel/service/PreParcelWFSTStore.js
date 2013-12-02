/**
 * @class Oskari.mapframework.bundle.parcel.service.PreParcelWFSTStore
 *
 * Transforms Ext Model & OpenLayers geometry to WFS Transactions
 *
 *
 * NEEDS: URL to WFS service and KVP_UID for storing to some speficic kvp user
 *
 *
 * Sample Usage:
 *
 *
 *
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.PreParcelWFSTStore',

/**
 * @method create called automatically on construction
 * @static
 * @param {} parcel instance
 */
function(instance) {
    this.instance = instance;
    var conf = instance.conf ;
    this.featureNS = (conf ? conf.wfstFeatureNS : null) || 'http://www.oskari.org';
    var user = instance.getSandbox().getUser();
    //TODO: use KVP uuidia
    this.uuid = user.getUuid();

    this.protocols = {};
    this.url = conf.wfstUrl;
    this.featureNS =(conf ? conf.wfstFeatureNS : null) || 'http://www.oskari.org';
}, {

    /**
     * @method connect
     *
     * 'connects' to store (does not but might)
     */
    connect : function() {
        var url = this.url;
        this.protocols.preparcel = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            featureType : 'preparcel',
            featureNS : this.featureNS,
            url : url
        });
        this.protocols.preparcel_data = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'geometry',
            featureType : 'preparcel_data',
            featureNS : this.featureNS,
            url : url
        });
    },

    /**
     * @method getPreParcels
     *
     * loads preparcels from backend to given service filters by
     * initialised user uuid  ( kvp uuid)
     *
     * @param uid
     * @param cb
     * TODO: add kvp_uid filter
     */
    getPreParcels : function(uid, cb) {
        var kvp_uid = (typeof uid !== "undefined") ? uid : this.uuid;
        var kvp_uidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "kvp_uid",
            value : kvp_uid
        });
        var p = this.protocols.preparcel;

        var me = this;

        p.read({
            filter : kvp_uidFilter,
            callback : function(response) {
                me._handlePreParcelResponse(response, cb);
            }
        })

    },

    /**
     * @method _handlePreParcelResponse
     *
     * processes ajax response from backend adds preparcel to
     * given service
     */
    _handlePreParcelResponse: function (response, cb) {
        var uuid = this.uuid;
        var feats = response.features;
        // if nothing found, stop here and make the callback
        if (feats == null || feats.length == 0) {
            if (cb) {
                cb();
            }
            return;
        }
        var list = [];

        // found preparcel, proceed normally
        for (var n = 0; n < feats.length; n++) {
            var f = feats[n];
            var featAtts = f.attributes;

            var id = this._parseNumericId(f.fid);

            var preparcel = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcel');
            preparcel.setId(id);
            preparcel.setUuid(featAtts['uuid']);
            preparcel.setKvp_uid(featAtts['kvp_uid']);
            preparcel.setPreparcel_id(featAtts['preparcel_id']);
            preparcel.setTitle(featAtts['title']);
            preparcel.setSubtitle(featAtts['subtitle']);
            preparcel.setDescription(featAtts['description']);
            preparcel.setParent_property_id(featAtts['parent_property_id']);
            preparcel.setParent_property_quality(featAtts['parent_property_quality']);
            preparcel.setReporter(featAtts['reporter']);
            preparcel.setArea(featAtts['area']);
            preparcel.setArea_unit(featAtts['area_unit']);


            list.push(preparcel);
        }

        if (cb) {
            cb(list);
        }

    },
        /**
         * @method savePreParcel
         *
         * handles insert & update (NO delete here see next moethd)
         */
        savePreParcelSet: function (preparcel,ppdataList, callback) {
            this.commitPreParcel([preparcel], callback);
        },

    /**
     * @method commitPreParcel
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitPreParcel: function (list, callback) {
        var uuid = this.uuid;
        var kvp_uid = "12345"; //this.kvp_uid;
        var p = this.protocols.preparcel;
        var me = this;

        var features = [];
        for (var l = 0; l < list.length; l++) {
            var preparcel = list[l];
            var p_id = preparcel.getId();

            var featAtts = {
                    'uuid': uuid,
                    'kvp_uid':  kvp_uid,
                    'preparcel_id': preparcel.getPreparcel_id(),
                    'title': preparcel.getTitle(),
                    'subtitle': preparcel.getSubtitle(),
                    'description': preparcel.getDescription(),
                    'parent_property_id': preparcel.getParent_property_id(),
                    'parent_property_quality': preparcel.getParent_property_quality(),
                    'reporter': preparcel.getReporter(),
                    'area': preparcel.getArea(),
                    'area_unit': preparcel.getArea_unit()
                };

        var feat = new OpenLayers.Feature.Vector(null, featAtts);

        // console.log('saving preparcel - id: ' + m_id);
        if (!p_id) {
            feat.toState(OpenLayers.State.INSERT);
        } else {
            feat.fid = p.featureType + '.' + p_id;
            // toState handles some workflow stuff and doesn't work here
                feat.state = OpenLayers.State.UPDATE;
            }
            features.push(feat);
        }
        p.commit(features, {
            callback : function(response) {

                me._handleCommitPreParcelResponse(response, list, callback);
            }
        });

    },

    /**
     * @method _handleCommitPreParcelResponse
     *
     */
    _handleCommitPreParcelResponse : function(response, list, cb) {

        if (response.success()) {

            var features = response.reqFeatures;
            // deal with inserts, updates, and deletes
            var state, feature;
            var destroys = [];
            var insertIds = response.insertIds || [];

            for (var i = 0, len = features.length; i < len; ++i) {
                feature = features[i];
                state = feature.state;
                if (state) {
                    if (state == OpenLayers.State.INSERT) {
                        feature.fid = insertIds[i];
                        feature.attributes.id = feature.fid;
                        var id = this._parseNumericId(feature.fid);
                        list[i].setId(id);
                    }
                    feature.state = null;
                }
            }

            cb(true, list);

        } else {

            cb(false, list);
        }

    },

    /*
     * @method deletePreParcel
     *
     * delete a list of preparcel from backend
     */
    deletePreParcel : function(list, callback) {
        var p = this.protocols.preparcel;
        var uuid = this.uuid;
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m_id = list[l];

            if (!m_id) {
                continue;
            }

            var featAtts = {
                'uuid' : uuid
            };

            var feat = new OpenLayers.Feature.Vector(null, featAtts);

            feat.fid = p.featureType + '.' + m_id;

            feat.state = OpenLayers.State.DELETE;
            features.push(feat);
        }

        var me = this;
        p.commit(features, {
            callback : function(response) {
                me._handleDeletePreParcelResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleDeletePreParcelResponse
     *
     */
    _handleDeletePreParcelResponse : function(response, list, cb) {

        /**
         * Let's call service
         */
        if (response.success()) {
            cb(true, list);

        } else {
            cb(false, list);
        }

    },

    /**
     * @method _parseNumericId
     * @param geoserverFid id prefixed with featureType
     * @return id without featureType
     *
     */
    _parseNumericId : function(geoserverFid) {
        // TODO: maybe some error handling here?
        // feature id is '<featureType>.<id>'
        var id = geoserverFid.split('.')[1];
        return id;
    },

    /**
     * @method getPreParcelData
     *
     * loads preparcel geometries from backend to given service filters by
     * parcel_id (preparcel.id)
     *
     */
    getPreParcelData : function(preparcel_id, cb) {
        var parcelidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "preparcel_id",
            value : preparcel_id
        });

        var p = this.protocols.preparcel_data;

        var me = this;
        p.read({
            filter : parcelidFilter,
            callback : function(response) {
                me._handlePreParcelDataResponse(response, cb);
            }
        })

    },

    /**
     * @method _handlePreParcelDataResponse
     * processes ajax response from backend
     * @param response server response
     * @param cb callback to call with the model list as param
     */
    _handlePreParcelDataResponse : function(response, cb) {
        var uuid = this.uuid;
        var list = [];
        var feats = response.features;
        if (feats == null || feats.length == 0 || jQuery.isEmptyObject(feats)) {
	        if (cb) {
	            cb(list);
	        }
            return;
        }

        for (var n = 0; n < feats.length; n++) {
            var f = feats[n];
            var featAtts = f.attributes;

            var id = this._parseNumericId(f.fid);
            var ppdata = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.PreParcelData');
            ppdata.setId(id);
            ppdata.setPreparcel_id(featAtts['preparcel_id']);
            ppdata.setGeom_type(featAtts['geom_type']);
            ppdata.setCreated(featAtts['created']);
            ppdata.setGeometry(f.geometry);
            ppdata.setUpdated(featAtts['updated']);
            ppdata.setUuid(featAtts['uuid']);

            list.push(ppdata);
        }

        if (cb) {
            cb(list);
        }

    },

    /**
     * @method commitPreParcelData
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitPreParcelData : function(list, callback) {
        var p = this.protocols.preparcel_data;
        var uuid = this.uuid;
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m = list[l];
            var m_id = m.getId();
            var geom = m.getGeometry();

            var featAtts = {
                'geom_type': m.getGeom_type(),
                'preparcel_id' : m.getPreparcel_id(),
                'uuid' : m.getUuid()
            };

            var feat = new OpenLayers.Feature.Vector(geom, featAtts);

            // console.log('saving parcel - id: ' + m_id);
            if (!m_id) {
                feat.toState(OpenLayers.State.INSERT);
            } else {
                feat.fid = p.featureType + '.' + m_id;
                // toState handles some workflow stuff and doesn't work here
                feat.state = OpenLayers.State.UPDATE;
            }
            features.push(feat);
        }
        var me = this;
        p.commit(features, {
            callback : function(response) {
                me._handleCommitPreParcelDataResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleCommitPreParcelResponse
     *
     * NO we need this - only preparcel list is needed
     */
    _handleCommitPreParcelDataResponse : function(response, list, cb) {
        if (response.success()) {

            var features = response.reqFeatures;
            // deal with inserts, updates, and deletes
            var state, feature;
            var destroys = [];
            var insertIds = response.insertIds || [];
            var formattedIdList = [];

            for (var i = 0, len = features.length; i < len; ++i) {
                feature = features[i];
                state = feature.state;
                if (state) {
                    if (state == OpenLayers.State.INSERT) {
                        feature.fid = insertIds[i];
                        feature.attributes.id = feature.fid;
                        var id = this._parseNumericId(feature.fid);
                        //list[i].setId(id);
                        formattedIdList.push(id);
                    } else {
                        formattedIdList.push(list[i].getId());
                    }
                    feature.state = null;
                }
            }
            cb(true, list);
        } else {

            cb(false, list);
        }
    },

    /*
     * @method deletePreParcel
     *
     * delete a list of preparcel_data from backend
     */
    deletePreParcelData : function(list, callback) {
        var p = this.protocols.preparcel_data;
        var uuid = this.uuid;
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m_id = list[l];

            if (!m_id) {
                continue;
            }

            var featAtts = {
                'uuid' : uuid
            };

            var feat = new OpenLayers.Feature.Vector(null, featAtts);

            // console.log('Deleting preparcel_data - id: ' + m_id);

            feat.fid = p.featureType + '.' + m_id;

            feat.state = OpenLayers.State.DELETE;
            features.push(feat);
        }

        var me = this;
        p.commit(features, {
            callback : function(response) {
                me._handleDeletePreParcelDataResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleDeletePreParcelDataResponse
     *
     * update state to local models
     */
    _handleDeletePreParcelDataResponse : function(response, list, cb) {

        /**
         * Let's call service
         */
        if (response.success()) {
            cb(true, list);

        } else {
            cb(false, list);
        }

    },

    /*
     * @method disconnect
     *
     * 'disconnects' from store (does not but might)
     */
    disconnect : function() {

    }
});
