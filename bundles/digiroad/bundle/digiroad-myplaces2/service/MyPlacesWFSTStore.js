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
        this.protocols['my_places'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'GEOMETRY',
            featureType : "SEGMENTIT_UUDET",
            featureNS: "http://digiroad.karttakeskus.fi/LiVi",
            featurePrefix: "LiVi",
            outputFormat: "json",
            url : url
        });
        this.protocols['edited_elements'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'GEOMETRY',
            featureType : "LIIKENNE_ELEMENTTI_MUUTOS",
            featureNS: "http://digiroad.karttakeskus.fi/LiVi",
            featurePrefix: "LiVi",
            outputFormat: "json",
            url : url
        });
        this.protocols['edited_segments'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'GEOMETRY',
            featureType : "SEGMENTTI_MUUTOS",
            featureNS: "http://digiroad.karttakeskus.fi/LiVi",
            featurePrefix: "LiVi",
            outputFormat: "json",
            url : url
        });
        this.protocols['feedback_area'] = new OpenLayers.Protocol.WFS({
            version : '1.1.0',
            srsName : 'EPSG:3067',
            geometryName : 'GEOMETRY',
            featureType : "PALAUTE",
            featureNS: "http://digiroad.karttakeskus.fi/LiVi",
            featurePrefix: "LiVi",
            outputFormat: "json",
            url : url
        });
        this.protocols['turning_restrictions'] = new OpenLayers.Protocol.WFS({
            version: '1.1.0',
            srsName: 'EPSG:3067',
            geometryName: 'GEOMETRY',
            featureType: "KAANTYMISMAARAYS_UUDET",
            featureNS: 'http://digiroad.karttakeskus.fi/LiVi',
            featurePrefix: 'LiVi',
            outputFormat: 'json',
            url: url
        });
    },

    
    /**
     * @method  _formatColorFromServer
     * @private
     * Removes prefix #-character if present
     */
    _formatColorFromServer : function(color) {
    	if(color && color.charAt(0) == '#') {
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
            property : "KAYTTAJA_ID",
            value : uuid.toString()
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
            place.setDynType(featAtts['DYN_TYYPPI']);
            place.setDynValue(featAtts['DYN_ARVO']);
            place.setCreateDate(featAtts['MUOKKAUS_PVM']);
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

        var filter = this._createUuidFidFilter(idList);

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
                'DYN_TYYPPI' : m.getDynType(),
                'DYN_ARVO' : m.getDynValue(),
                'KAYTTAJA_ID' : uuid
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
        var fid = p.featureType + '.' + list[0];
        var me = this;
        var filter = this._createUuidFidFilter([fid]);
        
        p.filterDelete(filter, {
        	callback: function(resp) {
        		me._handleDeleteMyPlacesResponse(resp, list, callback);
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
        if (response.error) {
            cb(false, list);

        } else {
            cb(true, list);
        }

    },

    /**
     * @method getEditedFeatures
     * Retrieves the edited elements and segments from the backend. This gets called when the
     * personaldata bundle loads the MyEditedFeaturesTab.
     * @param {Function} cb the callback function that is responsible for handling the returned features.
     */
    getEditedFeatures: function(cb) {
        var me = this,
            uuid = this.uuid,
            editedSegmentProtocol = this.protocols['edited_segments'],
            editedElementProtocol = this.protocols['edited_elements'],
            segmentsLoaded = null,
            elementsLoaded = null;

        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "KAYTTAJA_ID",
            value : uuid.toString()
        });

        editedSegmentProtocol.read({
            filter : uuidFilter,
            callback : function(response) {
                segmentsLoaded = response.features;
                if(elementsLoaded) {
                    me._handleGetEditedFeaturesResponse(segmentsLoaded, elementsLoaded, cb);
                }
            }
        });

        editedElementProtocol.read({
            filter : uuidFilter,
            callback : function(response) {
                elementsLoaded = response.features;
                if(segmentsLoaded) {
                    me._handleGetEditedFeaturesResponse(elementsLoaded, segmentsLoaded, cb);
                }
            }
        });        
    },

    /**
     * @method _handleGetEditedFeaturesResponse
     * Concatenates the returned elements and segments and calls the callback function
     * @param {Object[]} elements an array of OpenLayers features
     * @param {Object[]} segments an array of OpenLayers features
     * @param {Function} cb the callback function that is responsible for handling the returned features.
     */
    _handleGetEditedFeaturesResponse: function(elements, segments, cb) {
        var features = elements.concat(segments);
        cb(features);
    },

    /**
     * @method commitEditedSegments
     */
    commitEditedSegments : function(editedSegment, layerName, callback) {
        this.commitEditedFeatures('edited_segments', editedSegment, layerName, callback);
    },

    /**
     * @method commitEditedElements
     */
    commitEditedElements : function(editedElement, layerName, callback) {
        this.commitEditedFeatures('edited_elements', editedElement, layerName, callback);
    },

    /**
     * @method commitEditedFeatures
     * handles insert & update (NO delete here)
     * @param {String} layerType 'edited_elements' or 'edited_segments'
     * @param {Object} editedFeature an OpenLayers feature about to get committed to the backend.
     * @param {String} layerName e.g. 'nopeusrajoitus' or 'vaylatyyppi'
     * @param {Function} callback the callback function that gets called when the commit function has returned.
     */
    commitEditedFeatures : function(layerType, editedFeature, layerName, callback) {
        var p = this.protocols[layerType];
            uuid = this.uuid,
            features = [],
            geom = editedFeature.geometry,
            me = this;

        var featAtts = {};
        for(attr in editedFeature) {
            if(editedFeature.hasOwnProperty(attr)) {
                featAtts[attr] = editedFeature[attr];
            }
        }
        featAtts['KAYTTAJA_ID'] = uuid;
        featAtts['TIETOLAJI'] = layerName;
        delete featAtts['bbox'];
        delete featAtts['geometry'];

        var feat = new OpenLayers.Feature.Vector(geom, featAtts);
        feat.toState(OpenLayers.State.INSERT);

        features.push(feat);

        var me = this;
        p.commit(features, {
        	headers: {
        		"Content-Type": "application/xml; charset=utf-8"
        	},
            callback : function(response) {
                me._handleCommitEditedFeaturesResponse(response, p, uuid, callback);
            }
        });
    },

    /**
     * @method _handleCommitEditedFeaturesResponse
     * We need to retrieve the newly created edited feature (sic!)
     * so that we can get the attributes that the database autofills.
     * @param {Object} response The response from the commit call.
     * @param {Object} protocol an OpenLayers protocol.
     * @param {String} uuid the logged in user's id.
     * @param {Function} the original callback function that gets called eventually.
     */
    _handleCommitEditedFeaturesResponse: function(response, protocol, uuid, cb) {
        if(response.success()) {
            cb(true);
        } else {
            cb(false);
        }
    },
    
    /**
     * @method deleteEditedFeatures
     * Deletes a list of edited features from backend.
     * @param {String} protocolType either 'edited_elements' or 'edited_segments'
     * @param {Integer[]} featIds a list of feature ids we're about to delete
     * @param {Function} callback gets called after the commit
     */
    deleteEditedFeatures : function(protocolType, featIds, callback) {
        var p = this.protocols[protocolType];
        var uuid = this.uuid;
        var fid = p.featureType + '.' + featIds[0];
        var filter = this._createUuidFidFilter([fid]);
        
        p.filterDelete(filter, {
        	callback: function(resp) {
        		if(resp.error) {
        			callback(false);
        		} else {
        			callback(true);
        		}
        	}
        });
    },
    
    /**
     * @method getFeedbackFeatures
     * Retrieves the feedback polygons from the backend and sends them to the callback function.
     * @param {Function} callback
     */
    getFeedbackFeatures: function(cb) {
        var uuid = this.uuid;

        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "KAYTTAJA_ID",
            value : uuid.toString()
        });

        var p = this.protocols['feedback_area'];

        var me = this;
        p.read({
            filter : uuidFilter,
            callback : function(response) {
                if(response.success()) {
                    cb(response.features);
                } else {
                    cb();
                }
            }
        })
    },

    /**
     * @method commitFeedback
     *
     * handles insert & update (NO delete here see next moethd)
     */
    commitFeedback : function(model, callback) {
        var p = this.protocols['feedback_area'];
            uuid = this.uuid,
            features = [],
            geom = model.getGeometry(),
            me = this;

        var featAtts = {
            'KAYTTAJA_ID': uuid,
            'NIMI': model.getName(),
            'SELITE': model.getDescription()
        };

        var feat = new OpenLayers.Feature.Vector(geom, featAtts);
        feat.toState(OpenLayers.State.INSERT);

        features.push(feat);

        p.commit(features, {
        	headers: {
        		"Content-Type": "application/xml; charset=utf-8"
        	},
            callback : function(response) {
                me._handleCommitFeedbackResponse(response, callback);
            }
        });
    },
    
    /**
     * @method _handleCommitFeedbackResponse
     * Calls the callback function if the response was a succesful one.
     * @param {Object} response
     * @param {Function} callback
     */
    _handleCommitFeedbackResponse: function(response, callback) {
        if(response.success()) {
            callback(true);
        } else {
            callback(false);
        }
    },
    
    /**
     * @method deleteFeedback
     * Deletes a feedback feature from the backend.
     * @param {Integer} featureId the id of the feature that's about to get destroyed.
     * @param {Function} callback
     */
    deleteFeedback: function(featureId, callback) {
        var p = this.protocols['feedback_area'];
        var uuid = this.uuid;
        var fid = p.featureType + '.' + featureId;
        var filter = this._createUuidFidFilter([fid]);
        
        p.filterDelete(filter, {
            callback: function(resp) {
                if(resp.error) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    },
    
    /**
     * @method getNewRestrictions
     * @param {Function} cb
     */
    getNewRestrictions: function(cb) {
        var uuid = this.uuid;

        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "KAYTTAJA_ID",
            value : uuid.toString()
        });

        var p = this.protocols['turning_restrictions'];

        var me = this;
        p.read({
            filter : uuidFilter,
            callback : function(response) {
                if(response.success()) {
                    cb(response.features);
                } else {
                    cb();
                }
            }
        })
    },
    
    /**
     * @method commitNewRestriction
     * @param {Object} restriction an OpenLayers feature object
     * @param {Function} callback
     */
    commitNewRestriction: function(restriction, callback) {
        var p = this.protocols['turning_restrictions'];

        restriction.toState(OpenLayers.State.INSERT);

        p.commit([restriction], {
            callback: function(response) {
                if(response.success()) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        });
    },
    
    /**
     * @method _createUuidFidFilter
     * Creates an OpenLayers.Logical filter combining feature id and the user id.
     * @param {Integer[]} fids an array of feature ids.
     */
    _createUuidFidFilter: function(fids) {
        var uuidFilter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Comparison.EQUAL_TO,
            property : "KAYTTAJA_ID",
            value : this.uuid
        });
        var fidFilter = new OpenLayers.Filter.FeatureId({
            fids: fids
        });
        var filter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [uuidFilter, fidFilter]
        });
        return filter;
    },

    /*
     * @method disconnect
     *
     * 'disconnects' from store (does not but might)
     */
    disconnect : function() {

    }
});
