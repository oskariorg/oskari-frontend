/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelWfst
 *
 * Transforms OpenLayers geometry to WFS Transactions
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelWfst',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} instance
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

    var urlCommit = instance.conf.transitionUrl || instance.conf.queryUrl;
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
     *
     */
    loadParcel : function(fid, cb) {
        this._downloadFeature(fid, this.protocols['parcel'], cb);
    },
    /**
     *
     */
    loadRegisterUnit : function(fid, cb) {
        this._downloadFeature(fid, this.protocols['registerUnit'], cb);
    },

    /**
     *
     */
    saveParcel : function(feature, cb) {
        this._commitFeature(feature, this.protocols['parcelCommit'], cb);
    },
    /**
     *
     */
    saveRegisterUnit : function(feature, cb) {
        this._commitFeature(feature, this.protocols['registerUnitCommit'], cb);
    },

    /**
     *
     */
    _downloadFeature : function(fid, protocol, cb) {
        var filter = new OpenLayers.Filter.FeatureId({
            fids : [fid]
        });
        protocol.read({
            filter : filter,
            callback : function(response) {
                if (response && response.features && response.features.length > 0) {
                    console.log("RESPONSE succ");
                    cb(response.features[0]);

                } else {
                    console.log("RESPONSE ERRORI");
                    cb();
                }
            }
        });
    },

    /**
     *
     */
    _commitFeature : function(feature, protocol, cb) {
        var me = this;
        // Insert feature to the server if transaction URL differs from the query URL that has given the feature.
        // Otherwise, update data if the query server is same as the transaction server.
        var featureState = feature.state;
        if (this.instance.conf.transactionUrl && this.instance.conf.queryUrl != this.instance.conf.transactionUrl) {
            feature.toState(OpenLayers.State.INSERT);

        } else {
            // toState handles some workflow stuff and doesn't work here
            feat.state = OpenLayers.State.UPDATE;
        }
        // Commit feature to the server.
        p.commit([feature], {
            callback : function(response) {
                // Change feture state to its original value after operation
                // because state was set above for the commit.
                feature.state = featureState;
                me._handleCommitParcelResponse(response, list, callback);
            }
        });
    }
});
