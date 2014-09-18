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
     * @param {String} featureNS
     */

    function (url, uuid, featureNS, options) {
        this.uuid = uuid;
        this.protocols = {};
        this.url = url;
        this.featureNS = featureNS;
        this.options = options || {};
    }, {

        /**
         * @method connect
         *
         * 'connects' to store (does not but might)
         */
        connect: function () {
            var url = this.url;
            this.protocols.categories = new OpenLayers.Protocol.WFS({
                version: '1.1.0',
                srsName: Oskari.getSandbox().getMap().getSrsName(),
                featureType: 'categories',
                featureNS: this.featureNS,
                url: url
            });
            // myplaces uses version 1.0.0 since with 1.1.0 geoserver connects
            // multilines to one continuous line on save
            var myPlacesProps = {
                version: '1.0.0',
                srsName: Oskari.getSandbox().getMap().getSrsName(),
                geometryName: 'geometry',
                featureType: 'my_places',
                featureNS: this.featureNS,
                url: url
            };
            if (this.options.maxFeatures) {
                myPlacesProps.maxFeatures = this.options.maxFeatures;
            }
            this.protocols.my_places = new OpenLayers.Protocol.WFS(myPlacesProps);
        },

        /**
         * @method getCategories
         *
         * loads categories from backend to given service filters by
         * initialised user uuid
         */
        getCategories: function (cb) {
            var uuid = this.uuid;
            var uuidFilter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "uuid",
                value: uuid
            });
            var p = this.protocols.categories;

            var me = this;

            p.read({
                filter: uuidFilter,
                callback: function (response) {
                    me._handleCategoriesResponse(response, cb);
                }
            });

        },

        /**
         * @method _handleCategoriesResponse
         *
         * processes ajax response from backend adds categories to
         * given service
         */
        _handleCategoriesResponse: function (response, cb) {
            var uuid = this.uuid;
            var feats = response.features;
            // if nothing found, stop here and make the callback
            if (feats === null || feats === undefined || feats.length === 0) {
                if (cb) {
                    cb();
                }
                return;
            }
            var list = [],
                n,
                f,
                featAtts,
                id,
                category;

            // found categories, proceed normally
            for (n = 0; n < feats.length; n++) {
                f = feats[n];
                featAtts = f.attributes;

                id = this._parseNumericId(f.fid);

                category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
                category.setId(id);
                category.setName(featAtts.category_name);
                category.setDefault("true" === featAtts['default']);
                category.setLineWidth(featAtts.stroke_width);
                category.setLineStyle(featAtts.stroke_dasharray);
                category.setLineCap(featAtts.stroke_linecap);
                category.setLineCorner(featAtts.stroke_linejoin);
                category.setLineColor(this._formatColorFromServer(featAtts.stroke_color));
                category.setAreaLineWidth(featAtts.border_width);
                category.setAreaLineStyle(featAtts.border_dasharray);
                category.setAreaLineCorner(featAtts.border_linejoin);
                category.setAreaLineColor(this._formatColorFromServer(featAtts.border_color));
                category.setAreaFillColor(this._formatColorFromServer(featAtts.fill_color));
                category.setAreaFillStyle(featAtts.fill_pattern);
                category.setDotShape(featAtts.dot_shape);
                category.setDotColor(this._formatColorFromServer(featAtts.dot_color));
                category.setDotSize(featAtts.dot_size);
                category.setUUID(uuid);
                if (featAtts.publisher_name) {
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
        _formatColorFromServer: function (color) {
            if (color.charAt(0) === '#') {
                return color.substring(1);
            }
            return color;
        },
        /**
         * @method  _prefixColorForServer
         * @private
         * Adds prefix #-character if not present
         */
        _prefixColorForServer: function (color) {
            if (color.charAt(0) !== '#') {
                return '#' + color;
            }
            return color;
        },

        /**
         * @method commitCategories
         *
         * handles insert & update (NO delete here see next method)
         */
        commitCategories: function (list, callback) {
            var uuid = this.uuid;
            var p = this.protocols.categories;
            var me = this;

            var features = [],
                l,
                m,
                m_id,
                featAtts,
                feat;
            for (l = 0; l < list.length; l++) {
                m = list[l];
                m_id = m.getId();

                // TODO: also prefix colors with # so server doesn't need to (handle it on load also)?
                featAtts = {
                    'category_name': m.getName(),
                    'default': m.isDefault(),
                    'stroke_width': m.getLineWidth(),
                    'stroke_dasharray': m.getLineStyle(),
                    'stroke_linecap': m.getLineCap(),
                    'stroke_linejoin': m.getLineCorner(),
                    'stroke_color': this._prefixColorForServer(m.getLineColor()),
                    'border_width': m.getAreaLineWidth(),
                    'border_dasharray': m.getAreaLineStyle(),
                    'border_linejoin': m.getAreaLineCorner(),
                    'border_color': this._prefixColorForServer(m.getAreaLineColor()),
                    'fill_color': this._prefixColorForServer(m.getAreaFillColor()),
                    'fill_pattern': m.getAreaFillStyle(),
                    'dot_color': this._prefixColorForServer(m.getDotColor()),
                    'dot_size': m.getDotSize(),
                    'dot_shape': m.getDotShape(),
                    'uuid': uuid
                };
                feat = new OpenLayers.Feature.Vector(null, featAtts);

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
                callback: function (response) {

                    me._handleCommitCategoriesResponse(response, list, callback);
                }
            });

        },

        /**
         * @method _handleCommitCategoriesResponse
         *
         */
        _handleCommitCategoriesResponse: function (response, list, cb) {

            if (response.success()) {

                var features = response.reqFeatures;
                // deal with inserts, updates, and deletes
                var state, feature;
                var destroys = [];
                var insertIds = response.insertIds || [],
                    i,
                    id,
                    len;

                for (i = 0, len = features.length; i < len; ++i) {
                    feature = features[i];
                    state = feature.state;
                    if (state) {
                        if (state === OpenLayers.State.INSERT) {
                            feature.fid = insertIds[i];
                            feature.attributes.id = feature.fid;
                            id = this._parseNumericId(feature.fid);
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
        deleteCategories: function (list, callback) {
            var p = this.protocols.categories;
            var uuid = this.uuid;
            var features = [],
                l,
                m_id,
                featAtts,
                feat;
            for (l = 0; l < list.length; l++) {
                m_id = list[l];

                if (!m_id) {
                    continue;
                }

                featAtts = {
                    'uuid': uuid
                };

                feat = new OpenLayers.Feature.Vector(null, featAtts);

                feat.fid = p.featureType + '.' + m_id;

                feat.state = OpenLayers.State.DELETE;
                features.push(feat);
            }

            var me = this;
            p.commit(features, {
                callback: function (response) {
                    me._handleDeleteCategoriesResponse(response, list, callback);
                }
            });
        },

        /**
         * @method handleDeleteCategoriesResponse
         *
         */
        _handleDeleteCategoriesResponse: function (response, list, cb) {

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
        _parseNumericId: function (geoserverFid) {
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
        getMyPlaces: function (cb) {
            var uuid = this.uuid;

            var uuidFilter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "uuid",
                value: uuid
            });

            var p = this.protocols.my_places;

            var me = this;
            p.read({
                filter: uuidFilter,
                callback: function (response) {
                    me._handleMyPlacesResponse(response, cb);
                }
            });

        },

        /**
         * @method _handleMyPlacesResponse
         * processes ajax response from backend
         * @param response server response
         * @param cb callback to call with the model list as param
         */
        _handleMyPlacesResponse: function (response, cb) {
            var uuid = this.uuid;
            var list = [];
            var feats = response.features;
            if (feats === null || feats === undefined || feats.length === 0 || jQuery.isEmptyObject(feats)) {
                if (cb) {
                    cb(list);
                }
                return;
            }
            var n,
                f,
                featAtts,
                id,
                place;
            for (n = 0; n < feats.length; n++) {
                f = feats[n];
                featAtts = f.attributes;
                id = this._parseNumericId(f.fid);
                place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
                place.setId(id);
                place.setName(featAtts.name);
                place.setDescription(featAtts.place_desc);
                place.setAttention_text(featAtts.attention_text);
                place.setLink(featAtts.link);
                place.setImageLink(featAtts.image_url);
                place.setCategoryID(featAtts.category_id);
                place.setCreateDate(featAtts.created);
                place.setUpdateDate(featAtts.updated);
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
        getMyPlacesByIdList: function (idList, cb) {
            var uuid = this.uuid;
            var p = this.protocols.my_places;
            //var geoserverId = p.featureType + '.' + idList[0];

            var filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                    property: "uuid",
                    value: uuid
                }), new OpenLayers.Filter.FeatureId({
                    fids: idList
                })]
            });

            var me = this;
            p.read({
                filter: filter,
                callback: function (response) {
                    me._handleMyPlacesResponse(response, cb);
                }
            });
        },

        /**
         * @method commitPlaces
         *
         * handles insert & update (NO delete here see next method)
         */
        commitMyPlaces: function (list, callback, skipFeatureLoading) {
            var p = this.protocols.my_places;
            var uuid = this.uuid;
            var features = [],
                l,
                m,
                m_id,
                geom,
                featAtts,
                feat;
            for (l = 0; l < list.length; l++) {
                m = list[l];
                m_id = m.getId();
                geom = m.getGeometry();

                featAtts = {
                    'name': m.getName(),
                    'place_desc': m.getDescription(),
                    'attention_text': m.getAttention_text(),
                    'link': m.getLink(),
                    'image_url': m.getImageLink(),
                    'category_id': m.getCategoryID(),
                    'uuid': uuid
                };

                feat = new OpenLayers.Feature.Vector(geom, featAtts);

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
                callback: function (response) {
                    me._handleCommitMyPlacesResponse(response, list, callback, skipFeatureLoading);
                }
            });
        },

        /**
         * @method handleCommitMyPlacesResponse
         *
         * fix ids to model in this response handler
         */
        _handleCommitMyPlacesResponse: function (response, list, cb, skipFeatureLoading) {
            if (response.success()) {

                var features = response.reqFeatures;
                // deal with inserts, updates, and deletes
                var state, feature;
                var destroys = [];
                var insertIds = response.insertIds || [];
                var formattedIdList = [],
                    i,
                    id,
                    len;

                for (i = 0, len = features.length; i < len; ++i) {
                    feature = features[i];
                    state = feature.state;
                    if (state) {
                        if (state === OpenLayers.State.INSERT) {
                            feature.fid = insertIds[i];
                            feature.attributes.id = feature.fid;
                            id = this._parseNumericId(feature.fid);
                            list[i].setId(id);
                            formattedIdList.push(id);
                        } else {
                            formattedIdList.push(list[i].getId());
                        }
                        feature.state = null;
                    }
                }
                if(skipFeatureLoading === true) {
                    cb(true, list);
                } else {
                    // make another roundtrip to get the updated models from server
                    // to get the create/update date
                    var modelUpdateCb = function (pList) {
                        if (pList.length < 1) {
                            cb(false, pList);
                        } else {
                            cb(true, pList);
                        }
                    };
                    this.getMyPlacesByIdList(formattedIdList, modelUpdateCb);
                }

            } else {

                cb(false, list);
            }
        },

        /*
         * @method deleteMyPlaces
         *
         * delete a list of my places from backend
         */
        deleteMyPlaces: function (list, callback) {
            var p = this.protocols.my_places;
            var uuid = this.uuid;
            var features = [],
                l,
                m_id,
                featAtts,
                feat;
            for (l = 0; l < list.length; l++) {
                m_id = list[l];

                if (!m_id) {
                    continue;
                }

                featAtts = {
                    'uuid': uuid
                };

                feat = new OpenLayers.Feature.Vector(null, featAtts);

                // console.log('Deleting place - id: ' + m_id);

                feat.fid = p.featureType + '.' + m_id;

                feat.state = OpenLayers.State.DELETE;
                features.push(feat);
            }

            var me = this;
            p.commit(features, {
                callback: function (response) {
                    me._handleDeleteMyPlacesResponse(response, list, callback);
                }
            });
        },

        /**
         * @method handleDeleteMyPlacesResponse
         *
         * update state to local models
         */
        _handleDeleteMyPlacesResponse: function (response, list, cb) {

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
        disconnect: function () {

        }
    });