/**
 * @class Oskari.mapframework.service.MyPlacesWFSTStore
 * 
 * Transforms Ext Model & OpenLayers geometry to WFS Transactions
 * 
 * 
 * 
 * Sample Usage:
 * 
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.service.MyFeaturesLocalStore',
				function(url, uuid) {
					this.uuid = uuid;
					this.protocols = {};
					this.url = url;

					/*
					 * var defaultCategory = new OpenLayers.Feature.Vector(null, {
					 * 'id' : 'categories.1', 'default' : "true", 'name' : 'Omat
					 * paikat', 'lineWidth' : '1', 'lineColor' : '993300',
					 * 'fillColor' : '993300', 'dotColor' : '993300', 'dotSize' :
					 * '4', 'uuid' : uuid } ); defaultCategory.fid =
					 * defaultCategory.attributes.id;
					 */

					this.backend = {
						tables : {
							categories : [ /* defaultCategory */],
							myplaces : []
						},
						indices : {
							categories : {},
							myplaces : {}
						},
						sequences : {
							categories : 0,
							myplaces : 0
						}
					};

					/*
					 * this.backend.indices.categories[defaultCategory.fid] =
					 * defaultCategory;
					 */

				},
				{

					sucsFunc : function() {
						return true;
					},
					failFunc : function() {
						return false;
					},

					"_commit" : function(table, features) {

						var me = this;
						var idx = me.backend.indices[table];
						var tbl = me.backend.tables[table];

						var insertIds = [];
						for ( var n = 0; n < features.length; n++) {
							var feat = features[n];
							if (feat.state == OpenLayers.State.INSERT) {
								
								feat.fid = table + '.' + (++me.backend.sequences[table]);

								idx[feat.fid] = feat;
								insertIds.push(feat.fid);

								tbl.push(feat);
							} else if (feat.state == OpenLayers.State.UPDATE) {
								
								idx[feat.fid] = feat;
								
								for( var m = 0  ; m  < tbl.length;m++) {
									if( tbl[m].fid == feat.fid) {
										tbl[m] = feat;
									}
								}
							}
						}

						var response = {
							insertIds : insertIds,
							reqFeatures : features,
							success : me.sucsFunc
						};

						return response;
					},

					"_delete" : function(table, features) {

						var me = this;
						var idx = me.backend.indices[table];
						var tbl = me.backend.tables[table];
						
						for( var f = 0, len = features.length;f<len;f++) {
							var feat = f;
							delete idx[feat.fid];
						}
						
						
						var response = {
								success : me.sucsFunc
							};
						return response;
					},

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

						function sucsFunc() {
							return true;
						}

						var response = {
							features : me.backend.tables.categories,
							success : sucsFunc
						};

						me._handleCategoriesResponse(response, service, cb);
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
							if ("true" === featAtts['default']) {
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

							service
									._addCategory(Ext
											.create(
													'Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory',
													m_atts));
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

							// geoserver needs a value so set false if no
							// value specified
							var isDefault = m.get('isDefault');
							if (!isDefault) {
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
							var feat = new OpenLayers.Feature.Vector(null,
									featAtts);

							// console.log('saving category - id: ' + m_id);
							if (!m_id) {
								feat.toState(OpenLayers.State.INSERT);
							} else {
								feat.fid = p.featureType + '.' + m_id;
								// toState handles some workflow stuff and
								// doesn't work here
								feat.state = OpenLayers.State.UPDATE;
							}
							features.push(feat);
						}

						var response = me._commit('categories', features);

						me._handleCommitCategoriesResponse(response, list,
								callback);

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
										var id = this
												._parseNumericId(feature.fid);
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

							var feat = new OpenLayers.Feature.Vector(null,
									featAtts);

							feat.fid = p.featureType + '.' + m_id;

							feat.state = OpenLayers.State.DELETE;
							features.push(feat);
						}

						var me = this;

						/*
						 * todo fix delete
						 */

						var response = me._delete('categories', features);

						me._handleDeleteCategoriesResponse(response, list,
								callback);

					},

					/**
					 * @method handleDeleteCategoriesResponse
					 * 
					 */
					_handleDeleteCategoriesResponse : function(response, list,
							cb) {

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
					 * @param geoserverFid
					 *            id prefixed with featureType
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

						var me = this;
						/*
						 * var p = this.protocols['my_places'];
						 * 
						 * 
						 * p.read( { filter : uuidFilter, callback :
						 * function(response) {
						 * me._handleMyPlacesResponse(response, service, cb); } })
						 */

						function sucsFunc() {
							return true;
						}
						var response = {
							features : me.backend.tables.myplaces,
							success : sucsFunc
						}

						me._handleMyPlacesResponse(response, service, cb);

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

							service
									._addMyPlace(Ext
											.create(
													'Oskari.mapframework.bundle.myplaces.model.MyPlace',
													m_atts));
						}

						if (cb) {
							cb();
						}

					},

					/**
					 * @method getMyPlacesByIdList
					 * @param idList
					 *            array of my place ids to be loaded
					 * @param cb
					 *            callback that will receive a list of loaded
					 *            models as param
					 * 
					 * load places with an id list
					 */
					getMyPlacesByIdList : function(idList, cb) {
						var uuid = this.uuid;
						var p = this.protocols['my_places'];

						var filter = new OpenLayers.Filter.Logical( {
							type : OpenLayers.Filter.Logical.AND,
							filters : [ new OpenLayers.Filter.Comparison( {
								type : OpenLayers.Filter.Comparison.EQUAL_TO,
								property : "uuid",
								value : uuid
							}), new OpenLayers.Filter.FeatureId( {
								fids : idList
							}) ]
						});

						var me = this;

						var features = [];

						for ( var n = 0; n < idList.length; n++) {
							features
									.push(me.backend.indices.myplaces[idList[n]]);
						}

						me._handleMyPlaceByIdResponse( {
							features : features
						}, cb);

					},
					/**
					 * @method handleMyPlaceByIdResponse
					 * @param response
					 *            server response
					 * @param cb
					 *            callback to call with the model list as param
					 *            callback for loading places with an id list
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

							modelList
									.push(Ext
											.create(
													'Oskari.mapframework.bundle.myplaces.model.MyPlace',
													m_atts));
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

							var feat = new OpenLayers.Feature.Vector(geom,
									featAtts);

							// console.log('saving place - id: ' + m_id);
							if (!m_id) {
								feat.toState(OpenLayers.State.INSERT);
							} else {
								feat.fid = p.featureType + '.' + m_id;
								// toState handles some workflow stuff and
								// doesn't work here
								feat.state = OpenLayers.State.UPDATE;
							}
							features.push(feat);
						}
						var me = this;

						var response = me._commit('myplaces', features);
						me._handleCommitMyPlacesResponse(response, list,
								callback);

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
										var id = this
												._parseNumericId(feature.fid);
										list[i].set('id', id);
										formattedIdList.push(feature.fid);
									} else {
										formattedIdList.push(feature.fid);
									}
									feature.state = null;
								}
							}
							// make another roundtrip to get the updated
							// models from server
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

							var feat = new OpenLayers.Feature.Vector(null,
									featAtts);

							// console.log('Deleting place - id: ' + m_id);

							feat.fid = p.featureType + '.' + m_id;

							feat.state = OpenLayers.State.DELETE;
							features.push(feat);
						}

						var me = this;
						var response = me._delete('myplaces', features);

						me._handleDeleteMyPlacesResponse(response, list,
								callback);

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

				},
				{
					'protocol' : [ 'Oskari.mapframework.myplaces.service.Store' ]
				});
