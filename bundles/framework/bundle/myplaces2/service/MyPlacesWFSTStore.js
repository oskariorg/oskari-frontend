/**
 * @class Oskari.mapframework.bundle.myplaces2.service.MyPlacesWFSTStore
 *
 * Transforms Ext Model & OpenLayers geometry to WFS Transactions
 *
 *
 * NEEDS: URL to WFS service UUID for storing to some speficic user
 *
 *
 * Sample Usage:
 *
 * service = Oskari.bundle_manager.instances[12].impl.myPlacesService; // TEMP
 *
 * storE =
 * Oskari.clazz.create('Oskari.mapframework.service.MyPlacesWFSTStore','http://tiuhti.nls.fi/geoserver/wfs','1234');
 * storE.connect(); storE.getCategories(service); storE.getMyPlaces(service);
 *
 *
 * @TODO DELETE
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.service.MyPlacesWFSTStore', 

/**
 * @method create called automatically on construction
 * @static
 * @param {String} url
 * @param {String} uuid current users uuid
 */
function(url, uuid) {
    this.uuid = uuid;
    this.protocols = {};
    this.url = url;
}, {

    /**
     * @method connect
     *
     * 'connects' to store (does not but might)
     */
    connect : function() {
        var url = this.url;
        this.protocols['categories'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            featureType : 'categories',
            featureNS : 'http://www.paikkatietoikkuna.fi',
            url : url
        });
        this.protocols['my_places'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'geometry',
            featureType : 'my_places',
            featureNS : 'http://www.paikkatietoikkuna.fi',
            url : url
        });
    },

    /**
     * @method getCategories
     *
     * loads categories from backend to given service filters by
     * initialised user uuid
     */
    getCategories : function(cb) {
        var uuid = this.uuid;
        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "uuid",
            value : uuid
        });
        var p = this.protocols['categories'];

        var me = this;

        p.read({
            filter : uuidFilter,
            callback : function(response) {
                me._handleCategoriesResponse(response, cb);
            }
        })

    },

    /**
     * @method _handleCategoriesResponse
     *
     * processes ajax response from backend adds categories to
     * given service
     */
    _handleCategoriesResponse : function(response, cb) {
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

        // found categories, proceed normally
        for (var n = 0; n < feats.length; n++) {
            var f = feats[n];
            var featAtts = f.attributes;

            var id = this._parseNumericId(f.fid);

            var category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
            category.setId(id);
            category.setDefault("true" === featAtts['default']);
            category.setName(featAtts['category_name']);
            category.setLineWidth(featAtts['stroke_style']);
            category.setLineWidth(featAtts['stroke_cap']);
            category.setLineWidth(featAtts['stroke_corner']);
            category.setLineWidth(featAtts['stroke_width']);
            category.setLineColor(this._formatColorFromServer(featAtts['stroke_color']));
            category.setAreaLineWidth(featAtts['border_width']);
            category.setAreaLineColor(this._formatColorFromServer(featAtts['border_color']));
            category.setAreaFillColor(this._formatColorFromServer(featAtts['fill_color']));
            category.setDotShape(featAtts['shape']);
            category.setDotColor(this._formatColorFromServer(featAtts['dot_color']));
            category.setDotSize(featAtts['dot_size']);
            category.setUUID(uuid);
            if(featAtts['publisher_name']) {
                category.setPublic(true);
            }
             

            list.push(category);
        }

        if (cb) {
            cb(list);
        }

    },
    /**
     * @method  _formatColorFromServer
     * @private
     * Removes prefix #-character if present
     */
    _formatColorFromServer : function(color) {
    	if(color.charAt(0) == '#') {
    		return color.substring(1);
    	}
    	return color;
  	},
    /**
     * @method  _prefixColorForServer
     * @private
     * Adds prefix #-character if not present
     */
    _prefixColorForServer : function(color) {
    	if(color.charAt(0) != '#') {
    		return '#' + color;
    	}
    	return color;
  	},

    /**
     * @method commitCategories
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitCategories : function(list, callback) {
        var uuid = this.uuid;
        var p = this.protocols['categories'];
        var me = this;

        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m = list[l];
            var m_id = m.getId();

            // TODO: also prefix colors with # so server doesn't need to (handle it on load also)?
            var featAtts = {
                'category_name' : m.getName(),
                'default' : m.isDefault(),
                'stroke_width' : m.getLineWidth(),
                'stroke_dasharray' : m.getLineStyle(),
                'stroke_linecap' : m.getLineCap(),
                'stroke_linejoin' : m.getLineCorner(),
                'stroke_color' : this._prefixColorForServer(m.getLineColor()),
                'border_width' : m.getAreaLineWidth(),
                'border_dasharray' : m.getAreaLineStyle(),
                'border_linecap' : m.getAreaLineCap(),
                'border_linejoin' : m.getAreaLineCorner(),
                'border_color' : this._prefixColorForServer(m.getAreaLineColor()),
                'fill_pattern' : m.getAreaFillStyle(),
                'fill_color' : this._prefixColorForServer(m.getAreaFillColor()),
                'dot_color' : this._prefixColorForServer(m.getDotColor()),
                'dot_size' : m.getDotSize(),
                'dot_shape' : m.getDotShape(),
                'uuid' : uuid
            };
            var feat = new OpenLayers.Feature.Vector(null, featAtts);

            // console.log('saving category - id: ' + m_id);
            if (!m_id) {
                feat.toState(OpenLayers.State.INSERT);
            } else {
                feat.fid = p.featureType + '.' + m_id;
                // toState handles some workflow stuff and doesn't work here
                feat.state = OpenLayers.State.UPDATE;
            }
            features.push(feat);
        }
        p.commit(features, {
            callback : function(response) {

                me._handleCommitCategoriesResponse(response, list, callback);
            }
        });

    },

    /**
     * @method _handleCommitCategoriesResponse
     *
     */
    _handleCommitCategoriesResponse : function(response, list, cb) {

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
     * @method deleteCategories
     *
     * delete a list of categories from backend
     */
    deleteCategories : function(list, callback) {
        var p = this.protocols['categories'];
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
                me._handleDeleteCategoriesResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleDeleteCategoriesResponse
     *
     */
    _handleDeleteCategoriesResponse : function(response, list, cb) {

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
     * @method getPlaces
     *
     * loads places from backend to given service filters by
     * initialised user uuid
     *
     */
    getMyPlaces : function(cb) {
        var uuid = this.uuid;

        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "uuid",
            value : uuid
        });

        var p = this.protocols['my_places'];

        var me = this;
        p.read({
            filter : uuidFilter,
            callback : function(response) {
                me._handleMyPlacesResponse(response, cb);
            }
        })

    },

    /**
     * @method _handleMyPlacesResponse
     * processes ajax response from backend
     * @param response server response
     * @param cb callback to call with the model list as param
     */
    _handleMyPlacesResponse : function(response, cb) {
        var uuid = this.uuid;
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
            var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
            place.setId(id);
            place.setName(featAtts['name']);
            place.setDescription(featAtts['place_desc']);
            place.setLink(featAtts['link']);
            place.setImageLink(featAtts['image_url']);
            place.setCategoryID(featAtts['category_id']);
            place.setCreateDate(featAtts['created']);
            place.setUpdateDate(featAtts['updated']);
            place.setGeometry(f.geometry);
            place.setUUID(uuid);

            list.push(place);
            //service._addMyPlace(place);
        }

        if (cb) {
            cb(list);
        }

    },

    /**
     * @method getMyPlacesByIdList
     * @param idList array of my place ids to be loaded
     * @param cb callback that will receive a list of loaded models as param
     *
     * load places with an id list
     */
    getMyPlacesByIdList : function(idList, cb) {
        var uuid = this.uuid;
        var p = this.protocols['my_places'];
        //var geoserverId = p.featureType + '.' + idList[0];

        var filter = new OpenLayers.Filter.Logical({
            type : OpenLayers.Filter.Logical.AND,
            filters : [new OpenLayers.Filter.Comparison({
                type : OpenLayers.Filter.Comparison.EQUAL_TO,
                property : "uuid",
                value : uuid
            }), new OpenLayers.Filter.FeatureId({
                fids : idList
            })]
        });

        var me = this;
        p.read({
            filter : filter,
            callback : function(response) {
                me._handleMyPlacesResponse(response, cb);
            }
        })
    },

    /**
     * @method commitPlaces
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitMyPlaces : function(list, callback) {
        var p = this.protocols['my_places'];
        var uuid = this.uuid;
        var features = [];
        for (var l = 0; l < list.length; l++) {
            var m = list[l];
            var m_id = m.getId();
            var geom = m.getGeometry();

            var featAtts = {
                'name' : m.getName(),
                'place_desc' : m.getDescription(),
                'link' : m.getLink(),
                'image_url': m.getImageLink(),
                'category_id' : m.getCategoryID(),
                'uuid' : uuid
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
                me._handleCommitMyPlacesResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleCommitMyPlacesResponse
     *
     * fix ids to model in this response handler
     */
    _handleCommitMyPlacesResponse : function(response, list, cb) {
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
            this.getMyPlacesByIdList(formattedIdList, modelUpdateCb);

        } else {

            cb(false, list);
        }
    },

    /*
     * @method deleteMyPlaces
     *
     * delete a list of my places from backend
     */
    deleteMyPlaces : function(list, callback) {
        var p = this.protocols['my_places'];
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

            // console.log('Deleting place - id: ' + m_id);

            feat.fid = p.featureType + '.' + m_id;

            feat.state = OpenLayers.State.DELETE;
            features.push(feat);
        }

        var me = this;
        p.commit(features, {
            callback : function(response) {
                me._handleDeleteMyPlacesResponse(response, list, callback);
            }
        });
    },

    /**
     * @method handleDeleteMyPlacesResponse
     *
     * update state to local models
     */
    _handleDeleteMyPlacesResponse : function(response, list, cb) {

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
