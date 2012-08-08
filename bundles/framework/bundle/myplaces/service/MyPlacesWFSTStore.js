/**
 * @class Oskari.mapframework.service.MyPlacesWFSTStore
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
Oskari.clazz
		.define(
				'Oskari.mapframework.service.MyPlacesWFSTStore',
				function(url, uuid) {
					this.uuid = uuid;
					this.protocols = {};
					this.url = url;
				},
				{

					/**
					 * @method connect
					 * 
					 * 'connects' to store (does not but might)
					 */
					connect : function() {
						var url = this.url;
						this.protocols['categories'] = new OpenLayers.Protocol.WFS(
								{
									version : '1.1.0',
									srsName : 'EPSG:3067',
									featureType : 'categories',
									featureNS : 'http://www.paikkatietoikkuna.fi',
									url : url
								});
						this.protocols['my_places'] = new OpenLayers.Protocol.WFS(
								{
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
					getCategories : function(service, cb) {
						var uuid = this.uuid;
						var uuidFilter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : "uuid",
							value : uuid
						});
						var p = this.protocols['categories'];

						var me = this;
						
						p.read( {
							filter : uuidFilter,
							callback : function(response) {
								me._handleCategoriesResponse(response, service,
										cb);
							}
						})

					},

					/**
					 * @method _handleCategoriesResponse
					 * 
					 * processes ajax response from backend adds categories to
					 * given service
					 */
					_handleCategoriesResponse : function(response, service, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						// if nothing found, stop here and make the callback
						if (feats == null || feats.length == 0) {
							if (cb) {
								cb();
							}
							return;
						}
						
						// found categories, proceed normally 
						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							// convert string to boolean
							var blnDefault = false;
							if("true" === featAtts['default']) {
								blnDefault = true;
							}
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['category_name'],
								'isDefault' : blnDefault,
								'lineWidth' : featAtts['stroke_width'],
								'lineColor' : featAtts['stroke_color'],
								'fillColor' : featAtts['fill_color'],
								'dotColor' : featAtts['dot_color'],
								'dotSize' : featAtts['dot_size'],
								'uuid' : uuid
							};

							service._addCategory(
								Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory',m_atts));
						}

						if (cb) {
							cb();
						}

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
						for ( var l = 0; l < list.length; l++) {
							var m = list[l];
							var m_id = m.get('id');
							
							// geoserver needs a value so set false if no value specified
							var isDefault = m.get('isDefault');
							if(!isDefault) {
								isDefault = false;
							}

							/** s to e map! */
							var featAtts = {
								'category_name' : m.get('name'),
								'default' : isDefault,
								'stroke_width' : m.get('lineWidth'),
								'stroke_color' : m.get('lineColor'),
								'fill_color' : m.get('fillColor'),
								'dot_color' : m.get('dotColor'),
								'dot_size' : m.get('dotSize'),
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

								me._handleCommitCategoriesResponse(response,
										list, callback);
							}
						});

					},

					/**
					 * @method _handleCommitCategoriesResponse
					 * 
					 */
					_handleCommitCategoriesResponse : function(response, list,
							cb) {

						if (response.success()) {

							var features = response.reqFeatures;
							// deal with inserts, updates, and deletes
							var state, feature;
							var destroys = [];
							var insertIds = response.insertIds || [];
							
							for ( var i = 0, len = features.length; i < len; ++i) {
								feature = features[i];
								state = feature.state;
								if (state) {
									if (state == OpenLayers.State.INSERT) {
										feature.fid = insertIds[i];
										feature.attributes.id = feature.fid;
										var id = this._parseNumericId(feature.fid);
										list[i].set('id', id);
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
						for ( var l = 0; l < list.length; l++) {
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
								me._handleDeleteCategoriesResponse(response, list,
										callback);
							}
						});
					},
					
					/**
					 * @method handleDeleteCategoriesResponse
					 * 
					 */
					_handleDeleteCategoriesResponse: function(response,list,cb) {
						
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
					getMyPlaces : function(service, cb) {
						var uuid = this.uuid;

						var uuidFilter = new OpenLayers.Filter.Comparison( {
							type : OpenLayers.Filter.Comparison.EQUAL_TO,
							property : "uuid",
							value : uuid
						});

						var p = this.protocols['my_places'];

						var me = this;
						p.read( {
							filter : uuidFilter,
							callback : function(response) {
								me._handleMyPlacesResponse(response,
												service, cb);
							}
						})

					},
					
					/**
					 * @method handleMyPlacesResponse
					 * 
					 * processes ajax response from backend adds myplaces to
					 * given service
					 * 
					 */
					_handleMyPlacesResponse : function(response, service, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						if (feats == null)
							return;
						if (feats.length == 0)
							return;

						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['name'],
								'description' : featAtts['place_desc'],
								'categoryID' : featAtts['category_id'],
								'createDate' : featAtts['created'],
								'updateDate' : featAtts['updated'],
								'uuid' : uuid,
								'geometry' : f.geometry
							};

							service._addMyPlace(
								Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', m_atts));
						}

						if (cb) {
							cb();
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
						var geoserverId = p.featureType + '.' +id;

						var filter = new OpenLayers.Filter.Logical({
		                    type: OpenLayers.Filter.Logical.AND,
		                    filters: [
		                        new OpenLayers.Filter.Comparison({
									type : OpenLayers.Filter.Comparison.EQUAL_TO,
									property : "uuid",
									value : uuid
		                        }),
		                        new OpenLayers.Filter.FeatureId({
		                            fids: idList
		                        })
		                    ]
		                });
		                

						var me = this;
						p.read( {
							filter : filter,
							callback : function(response) {
								me._handleMyPlaceByIdResponse(response, cb);
							}
						})
		            },
		            /**
					 * @method handleMyPlaceByIdResponse
					 * @param response server response
					 * @param cb callback to call with the model list as param
					 * callback for loading places with an id list
		             */
					_handleMyPlaceByIdResponse : function(response, cb) {
						var uuid = this.uuid;
						var feats = response.features;
						if (feats == null || feats.length == 0) {
							return;
						}
						var modelList = [];

						for ( var n = 0; n < feats.length; n++) {
							var f = feats[n];
							var featAtts = f.attributes;
							
							var id = this._parseNumericId(f.fid);
							
							/** e to s map! */
							var m_atts = {
								'id' : id,
								'name' : featAtts['name'],
								'description' : featAtts['place_desc'],
								'categoryID' : featAtts['category_id'],
								'createDate' : featAtts['created'],
								'updateDate' : featAtts['updated'],
								'uuid' : uuid,
								'geometry' : f.geometry
							};

							modelList.push(Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlace', m_atts));
						}

						if (cb) {
							cb(modelList);
						}

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
						for ( var l = 0; l < list.length; l++) {
							var m = list[l];
							var m_id = m.get('id');
							var geom = m.get('geometry');
														
							/** s to e map! */
							var featAtts = {
								'name' : m.get('name'),
								'place_desc' : m.get('description'),
								'category_id' : m.get('categoryID'),
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
								me._handleCommitMyPlacesResponse(response, list,
										callback);
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
							
							for ( var i = 0, len = features.length; i < len; ++i) {
								feature = features[i];
								state = feature.state;
								if (state) {
									if (state == OpenLayers.State.INSERT) {
										feature.fid = insertIds[i];
										feature.attributes.id = feature.fid;
										var id = this._parseNumericId(feature.fid);
										list[i].set('id', id);
										formattedIdList.push(id);
									}
									else {
										formattedIdList.push(list[i].get('id'));
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
						for ( var l = 0; l < list.length; l++) {
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
								me._handleDeleteMyPlacesResponse(response, list,
										callback);
							}
						});
					},
					
					/**
					 * @method handleDeleteMyPlacesResponse
					 * 
					 * update state to local models
					 */
					_handleDeleteMyPlacesResponse: function(response,list,cb) {
						
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

				},
				{
					'protocol' : [ 'Oskari.mapframework.myplaces.service.Store' ]
				});
