/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelWFSTStore
 *
 * Transforms Ext Model & OpenLayers geometry to WFS Transactions
 *
 *
 * Sample Usage:
 *
 * service = Oskari.bundle_manager.instances[12].impl.parcelService; // TEMP
 *
 * storE =
 * Oskari.clazz.create('Oskari.mapframework.service.ParcelWFSTStore','http://tiuhti.nls.fi/geoserver/wfs','1234');
 * storE.connect(); storE.getParcel(service);
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelWFSTStore', 

/**
 * @method create called automatically on construction
 * @static
 * @param {String} url
 * @param {String} transactionUrl
 */
function(url, transactionUrl) {
    this.protocols = {};
    this.url = url;
    this.transactionUrl = transactionUrl;
}, {

    /**
     * @method connect
     *
     * 'connects' to store (does not but might)
     */
    connect : function() {
        var url = this.url;
        this.protocols['parcels'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'geometry',
            featureType : 'parcels',
            featureNS : 'http://xml.nls.fi/ktjkiiwfs/2010/02',
            featurePrefix : 'ktjkiiwfs',
            url : url
        });
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
     * @method _handleParcelResponse
     * processes ajax response from backend
     * @param response server response
     * @param cb callback to call with the model list as param
     */
    _handleParcelResponse : function(response, cb) {
        var feats = response.features;
        if (feats == null || feats.length == 0) {
	        if (cb) {
	            cb();
	        }
            return;
        }
            
        var list = [];
        for (var n = 0; n < feats.length; n++) {
            var f = feats[n];
            var featAtts = f.attributes;

            var id = this._parseNumericId(f.fid);
            var place = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.Parcel');
            place.setId(id);
            place.setName(featAtts['name']);
            place.setDescription(featAtts['place_desc']);
            place.setCreateDate(featAtts['created']);
            place.setUpdateDate(featAtts['updated']);
            place.setGeometry(f.geometry);

            list.push(place);
            //service._addParcel(place);
        }

        if (cb) {
            cb(list);
        }

    },

    /**
     * @method getParcelByIdList
     * @param idList array of parcel ids to be loaded
     * @param cb callback that will receive a list of loaded models as param
     *
     * load places with an id list
     */
    getParcelByIdList : function(idList, cb) {
        var p = this.protocols['parcels'];

        var filter = new OpenLayers.Filter.Logical({
            type : OpenLayers.Filter.Logical.AND,
            filters : [new OpenLayers.Filter.FeatureId({
                fids : idList
            })]
        });

        var me = this;
        p.read({
            filter : filter,
            callback : function(response) {
                me._handleParcelResponse(response, cb);
            }
        })
    },

    /**
     * @method commitPlaces
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitParcel : function(list, callback) {
        var p = this.protocols['parcels'];
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m = list[l];
            var m_id = m.getId();
            var geom = m.getGeometry();

            var featAtts = {
                'name' : m.getName(),
                'place_desc' : m.getDescription(),
            };

            var feat = new OpenLayers.Feature.Vector(geom, featAtts);

            // console.log('saving place - id: ' + m_id);
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
                me._handleCommitParcelResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleCommitParcelResponse
     *
     * fix ids to model in this response handler
     */
    _handleCommitParcelResponse : function(response, list, cb) {
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
                        list[i].setId(id);
                        formattedIdList.push(id);
                    } else {
                        formattedIdList.push(list[i].getId());
                    }
                    feature.state = null;
                }
            }
            // make another roundtrip to get the updated models from server
            // to get the create/update date
            var modelUpdateCb = function(pList) {
                cb(true, pList);
            };
            this.getParcelByIdList(formattedIdList, modelUpdateCb);

        } else {

            cb(false, list);
        }
    },

    /*
     * @method deleteParcel
     *
     * delete a list of parcels from backend
     */
    deleteParcel : function(list, callback) {
        var p = this.protocols['parcels'];
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m_id = list[l];

            if (!m_id) {
                continue;
            }

            var featAtts = {
            };

            var feat = new OpenLayers.Feature.Vector(null, featAtts);

            // console.log('Deleting place - id: ' + m_id);

            feat.fid = p.featureType + '.' + m_id;

            feat.state = OpenLayers.State.DELETE;
            features.push(feat);
        }

        var me = this;
        p.commit(features, {
            callback : function(response) {
                me._handleDeleteParcelResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleDeleteParcelResponse
     *
     * update state to local models
     */
    _handleDeleteParcelResponse : function(response, list, cb) {

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
