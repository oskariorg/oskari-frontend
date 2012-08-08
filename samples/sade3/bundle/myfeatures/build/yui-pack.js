/* This is a unpacked Oskari bundle (bundle script version Thu Feb 23 2012 11:08:28 GMT+0200 (Suomen normaaliaika)) */ 
Oskari.clazz.define(
        'Oskari.mapframework.service.MyFeaturesService', 
        
    /*
     * @constructor 
        ...
    */
    function(config) {

        /** config json */
        this._config = config;
        
        // list of categories & myplaces
        this._categoryList = new Array();
        this._placesList = new Array();

		this.wfstStore = Oskari.clazz.create(
			'Oskari.mapframework.service.MyFeaturesLocalStore',
			config.url, config.user);
		this.wfstStore.connect();

        this._sandbox = config.sandbox;
        
        this.defaults = config.defaults;
        
        // preload stuff
        var me = this;
        var defaultCategoryCreationCallback = function() {
        	// called if new user -> just created a default category for user
        	
        	if(me.getAllCategories().length === 0) {
        		// something went wrong and we should propably just show error message instead of my places functionality
        	}
        	else {
    			me._notifyDataChanged();
        	}
        };
        var loadedCategories = false;
        var loadedPlaces = false;
        var initialLoadCallBackCategories = function() {
    		loadedCategories = true;
        	
        	if(me.getAllCategories().length === 0 && config.defaults) {
        		// user has no categories, propably a new user
        		// create a default category
        		var defaultCategory = Ext.create('Oskari.mapframework.bundle.myplaces.model.MyPlacesCategory', {
					name: config.defaults.categoryName, 
 	                lineWidth: config.defaults.lineWidth,
	                lineColor: config.defaults.lineColor,
	                fillColor: config.defaults.fillColor,
	                dotColor: config.defaults.dotColor,
	                dotSize: config.defaults.dotSize,
					isDefault: true 
				});
				me.saveCategory(defaultCategory, defaultCategoryCreationCallback);
        	}
        	else if(loadedPlaces) {
        		me._notifyDataChanged();
        	}
        };
        
        var initialLoadCallBackPlaces = function() {
    		loadedPlaces = true;
        	if(loadedCategories) {
        		me._notifyDataChanged();
        	}
    		loadedPlaces = true;
        };
        
        this.wfstStore.getCategories(this,initialLoadCallBackCategories);
		this.wfstStore.getMyPlaces(this,initialLoadCallBackPlaces);
}, {
    __qname: "Oskari.mapframework.service.MyPlacesService",
    getQName: function() {
        return this.__qname;
    },

    __name : "MyPlacesService",
    getName : function() {
        return this.__name;
    },
    
    /** Internal usage */
    _addCategory : function(categoryModel) {
        this._categoryList.push(categoryModel);
    },
    
    /** Internal usage */
    _movePlacesToCategory : function(oldCategoryId, newCategoryId, callback) {
		var me = this;
    	var placesInDeleteCategory = this.getPlacesInCategory(oldCategoryId);
		if(placesInDeleteCategory.length == 0) {
			// no places to move -> callback right away
			callback(true);
			return;
		}
		for ( var i = 0; i < placesInDeleteCategory.length; i++) {
			placesInDeleteCategory[i].set('categoryID',newCategoryId);
		}
        var callBackWrapper = function(success, list) {
        	// update models updateDate in store
        	//var myplace = me.findMyPlace(list[0].get('id'));
        	//myplace.set('updateDate', list[0].get('updateDate'));
			me._notifyDataChanged();
            callback(success,list[0]);
        };
		// need to wrap callback and call changes notify if ever called directly
        this.wfstStore.commitMyPlaces(placesInDeleteCategory, callBackWrapper);
    },
    
    /** Internal usage */
    _deletePlacesInCategory : function(categoryId, callback) {
    	var placesInDeleteCategory = this.getPlacesInCategory(categoryId);
    	var idList = [];
		for ( var i = 0; i < placesInDeleteCategory.length; i++) {
			idList.push(placesInDeleteCategory[i].get('id'));
		}
		if(idList.length == 0) {
			// no places to delete -> callback right away
			callback(true);
			return;
		}
        var me = this;
        var callBackWrapper = function(success, list) {
            if(success) {
				for ( var i = 0; i < placesInDeleteCategory.length; i++) {
                	me._removeMyPlace(list[i]);
				}
				me._notifyDataChanged();
            }
            callback(success);
        };
        this.wfstStore.deleteMyPlaces(idList, callBackWrapper);
    },
/**
 * @method parseDate 
 * 
 * parses date for my places
 * 
 * @param dateStr format 2011-11-02T15:27:48.981+02:00 (time part is optional)
 * @return array with date part in first index, time (optional) in second, empty array if param is undefined or less than 10 characters
 */
    parseDate : function(dateStr) {
		
    	if(!dateStr && dateStr.length < 10) {
    		return [];
    	}
    	var year = dateStr.substring(0,4);
    	var month = dateStr.substring(5,7);
    	var day = dateStr.substring(8,10);
		var returnValue = [day + '.' + month + '.' + year];
		
		var time = '';
		// TODO: error handling
    	if(dateStr.length == 29) {
    		time = dateStr.substring(11);
    		var splitted = time.split('+');
    		time = splitted[0];
    		// take out milliseconds
    		time = time.split('.')[0];
    		var timeComps = time.split(':');
    		var hour = timeComps[0];
    		var min = timeComps[1];
    		var sec = timeComps[2];
    		/*
    		var timezone = splitted[1];
    		timezone = timezone.split(':')[0];
    		hour = parseInt(hour) + parseInt(timezone);
    		*/
    		time = hour + ':' + min + ':' + sec
    		returnValue.push(time);
    	}
		
		return returnValue;
    },
    
    getPlacesInCategory : function(categoryId) {
    	var placesInCategory = [];
		for ( var i = 0; i < this._placesList.length; i++) {
			if (this._placesList[i].get('categoryID') === categoryId) {
				placesInCategory.push(this._placesList[i]);
			}
		}
		return placesInCategory;
    },

    deleteCategory : function(categoryId, movePlacesToDefault,callback) {
        var me = this;
        
        // call actual category delete once category has been cleared of places successfully
        var callBackWrapper = function(success, list) {
            if(success) {
                me._deleteEmptyCategory(categoryId, callback);
            }
            else {
            	// only callback on fail here
            	callback(success);
            }
        };
        // move places handling
        if(movePlacesToDefault === true) {
        	var defaultCategory = me.getDefaultCategory();
        	me._movePlacesToCategory(categoryId, defaultCategory.get('id'), callBackWrapper);
        }
    	// delete places to clear category if places will not be moved
        else {
        	me._deletePlacesInCategory(categoryId, callBackWrapper);
        }
    },
    
    /** Internal handling only */
    _deleteEmptyCategory : function(categoryId,callback) {
    	
        var me = this; 
        var callBackWrapper = function(success, list) {
            if(success) {
                me._removeCategory(list[0]);
            }
            callback(success);
    		me._notifyDataChanged();
        };

        this.wfstStore.deleteCategories([categoryId], callBackWrapper);
    },
    
    /** Internal list handling only */
    _removeCategory : function(categoryId) {
        for(var i = 0; i < this._categoryList.length; i++) {
            if(this._categoryList[i].get('id') == categoryId){
                this._categoryList.splice(i,1);
                break;
            }
        }
    },
    
    saveCategory : function(categoryModel, callback) {
        var me = this;
        var isNew = !(categoryModel.get('id'));
        
        var callBackWrapper = function(success, list) {
            if(isNew && success) {
                me._addCategory(list[0]);
            }
            else {
            	// TODO: update model in store maybe?
            }
			me._notifyDataChanged();
            callback(success,list[0],isNew);
        };

        this.wfstStore.commitCategories([categoryModel], callBackWrapper);
    },

    getAllCategories : function() {
        return this._categoryList;
    },
    
    getDefaultCategory : function() {
    	
		var index = this.findBy(this._categoryList, 'isDefault', true);
		if(index !== -1) {
			return this._categoryList[index];
		}
		throw 'Should not happen';
    },

    /** Internal usage */
    _addMyPlace : function(myplaceModel) {
        this._placesList.push(myplaceModel);
    },
    /** Internal list handling only */
    _removeMyPlace : function(placeId) {
		var index = this.findBy(this._placesList, 'id', placeId);
		if(index !== -1) {
            this._placesList.splice(index,1);
		}
    },
    /** Internal usage */
    _notifyDataChanged : function() {
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlacesChangedEvent')();
        this._sandbox.notifyAll(event);
    },
    
    deleteMyPlace : function(placeId, callback) {
        var me = this;
        var callBackWrapper = function(success, list) {
            if(success) {
                me._removeMyPlace(list[0]);
				me._notifyDataChanged();
            }
            callback(success,list[0]);
        };

        this.wfstStore.deleteMyPlaces([placeId], callBackWrapper);
        
    },
    
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findMyPlaceByLonLat : function(lonlat, zoom) {
    	var places = [];
        var myPlacesList = this.getAllMyPlaces();
    	
        for(var i = 0; i < myPlacesList.length; ++i) {
        	var olGeometry = myPlacesList[i].get('geometry');
        	var hoverOnPlace = false;
    		// point geometry needs too exact hover to be usable without some tolerance
        	if('OpenLayers.Geometry.Point' === olGeometry.CLASS_NAME) {
				// TODO: figure out some Perfect(tm) math for scale
        		var tolerance = 720 - (zoom * zoom * 5);
        		if(zoom > 10) {
        			tolerance = 5;
        		}
        		else if(zoom > 8) {
        			tolerance = 20;
        		}
        		else if(zoom > 5) {
        			tolerance = 50;
        		}
        		//console.log(tolerance);
        		hoverOnPlace = olGeometry.atPoint(lonlat, tolerance, tolerance);
        	}
        	else {
        		hoverOnPlace = olGeometry.atPoint(lonlat);
        	}
        	if(hoverOnPlace) {
        		places.push(myPlacesList[i]);
        	}
        }
        return places;
	},
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findMyPlace : function(id) {
		var index = this.findBy(this._placesList, 'id', id);
		if(index !== -1) {
			return this._placesList[index];
		}
		return null;
	},
	/**
	 * Tries to find category with given id 
	 * 
	 * @param id
	 */
	findCategory : function(id) {
		var index = this.findBy(this._categoryList, 'id', id);
		if(index !== -1) {
			return this._categoryList[index];
		}
		return null;
	},
	
	/**
	 * Tries to find object from the given list
	 *  
	 * 
	 * @param list list to loop through
	 * @param attrName attribute to compare against
	 * @param attrValue value we want to find
	 * 
	 * @return index on the list where the object was found or -1 if not found
	 */
	findBy : function(list, attrName, attrValue) {
		for ( var i = 0; i < list.length; i++) {
			// TODO: maybe some error checking?
			if (list[i].get(attrName) === attrValue) {
				return i;
			}
		}
		return -1;
	},
    saveMyPlace : function(myplaceModel, callback) {
        var me = this;
        var isNew = !(myplaceModel.get('id'));
        
        var callBackWrapper = function(success, list) {
            if(isNew && success) {
            	me._addMyPlace(list[0]);
            }
            else {
            	// update models updateDate in store
            	var myplace = me.findMyPlace(list[0].get('id'));
            	if(myplace) {
            		myplace.set('updateDate', list[0].get('updateDate'));
            	}
            	else {
            		// couldn't load it -> failed to save it
            		success = false;
            	}
            } 
			me._notifyDataChanged();
            callback(success,list[0],isNew);
        };

        this.wfstStore.commitMyPlaces([myplaceModel], callBackWrapper);
    },
    
    getAllMyPlaces : function() {
        return this._placesList;
    }
},
{
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */
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
/**
 * @class Oskari.mapframework.ui.module.myplaces.MyPlacesModule
 * 
 * Represents the values of the map implementation (openlayers) Map module
 * updates this domain object before sending out MapMoveEvents
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.myplaces.MyFeaturesModule',

/**
 * @method constructor
 * @static
 * @param {Object}
 *            config JSON model with initial values
 */ 
function(config) {
	
	config = {
			"userKey" : "e88fa3a1-5881-46d5-9929-20024f27a6d7",
			"actionUrl" : "/myplaces",
			"wmsUrl" : "/myplaces/wms?CQL_FILTER=uuid='e88fa3a1-5881-46d5-9929-20024f27a6d7'"
		};
		
	
    this._sandbox = null;
    this.uiItems = {};
    this._config = config;
    this.myPlacesService = null;
    // used to disable handling hover and click events from map while editing
    this.disableMapEvents = false;
    // init layers from link (for printing) on initial load
    this.initialLoad = true;
    // actual id is set from layer json
    this.selectedMyPlace = null;
    this.localization = {};
    this.defaults = {};
    this.idPrefix = 'myplaces';
    this.defaults.dotColor = '993300';
    this.defaults.lineColor = '993300';
    this.defaults.fillColor = '993300';
    this.defaults.lineWidth = "1";
    this.defaults.dotSize = "4";
    this.defaults.categoryName = "Omat paikat"; // localization done in
												// this._populateLanguageSet()


}, {
    __name : "MyFeaturesModule",
    getName : function() {
        return this.__name;
    },
    /**
	 * @method setDisableMapEvents Click events for place selection cannot be
	 *         handled correctly while editing a geometry. We must disable
	 *         handling while editing using this method.
	 * @param boolean
	 *            true if clicks and hover is not handled
	 */
    setDisableMapEvents : function(blnParam) {
    	// safety check to keep it boolean
		this.disableMapEvents = (blnParam === true);
    },
    init : function(sb) {
        this._sandbox = sb;
        var sandbox = sb;
        var me = this;
        sandbox.printDebug("Initializing my places module...");
        
        this._populateLanguageSet(sandbox);

        var user = sandbox.getUser();
        if(user.isLoggedIn()) {
        	// override userkey
        	me._config.userKey = user.getUuid(); 
        	// update default category name to have the users name in it
        	this.defaults.categoryName = this.defaults.categoryName + ' - ' + user.getName();
        }

        // register plugin for map (drawing for my places)
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.DrawPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        // register plugin for map (hover tooltip for my places)
        var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.myplaces.mapmodule.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;

        // create MyPlacesService
        this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.service.MyFeaturesService', {
            sandbox : sandbox,
            user : me._config.userKey,
            url : me._config.actionUrl,
            defaults : me.defaults
        });
        
        // register for listening events
        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        // create UI
        // grid panel for listing places, added in start
        var gridPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesGridPanel', {
        	id: 'myplaces-gridpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                service : me.myPlacesService,
                localizationSet : me.localization
            }
        });
        this.uiItems.gridPanel = gridPanel;

		// accordion panel
        var mainPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesMainPanel', {
        	id: 'myplaces-mainpanel',
            oskariConfig : {
                module : me,
                sandbox : sandbox,
                localizationSet : me.localization
            }
        });
        this.uiItems.mainPanel = mainPanel;

        // my places dialog
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        
        return mainPanel;
    },
    /**
	 * @method _populateLanguageSet Internal method to se localization strings
	 */
    _populateLanguageSet : function(sandbox) {
        
		var lang =  sandbox.getLanguage();
		var locale = 
			Oskari.clazz.create('Oskari.mapframework.bundle.myplaces.ui.module.Locale',lang);
		
		/* HACK Title for this one */
		locale.loc['title'] = 'Omat kohteet';
		locale.loc.grid['title'] = 'Omat kohteet';
		
        this.localization = locale.getCurrentLocale();
		
		// special handling for defaults localization
		if('en' === lang) {
			this.defaults.categoryName = "My places";
		}
		else if('sv' === lang) {
			this.defaults.categoryName = "Mina platser";
		}
		
		if(!this.localization) {
			// default to fin if unknown localization
			this.localization = locale.getLocale('fi');
		}
    },
    
    /**
	 * @method saveMyPlaceGeometry Gets the geometry from drawplugin -> updates
	 *         geometry on currently selected place. Saves the currently
	 *         selected place. If no place is selected, does nothing.
	 */
    saveMyPlaceGeometry : function() {
        if(!this.selectedMyPlace) {
        	return;
        }
        var me = this;
            
    	// get current geometry from plugin and save
    	var getGeometryCallbackWrapper = function(pGeometry) {
        	me.uiItems.mainPanel.setLoading(me.localization.savemask);
        	me.selectedMyPlace.set('geometry', pGeometry);
        	
            var saveCallBackWrapper = function(success) {
                me._saveMyPlaceGeometryCallback(success);
            };
	        me.myPlacesService.saveMyPlace(me.selectedMyPlace, saveCallBackWrapper);
    		// me.myPlaceFinished(me.selectedMyPlace);
    	};
    	
        var request = this._sandbox.getRequestBuilder('MyPlaces.GetGeometryRequest')(getGeometryCallbackWrapper);
        this._sandbox.request(this.getName(), request);
        
    },
    /**
	 * @method _saveMyPlaceGeometryCallback Internal method to handle server
	 *         response from save geometry.
	 */
    _saveMyPlaceGeometryCallback : function(success) {
        var me = this;
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            // this.uiItems.gridPanel.placesChanged();
	        
	        var layerId = this.getMapLayerId();
	        // send update request
	        /*
			 * var request =
			 * this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId,
			 * true); this._sandbox.request(this.getName(), request);
			 */
	    	var me = this;
	        var newCategoryId = me.selectedMyPlace.get('categoryID');
			var newFeatures = [];			
			var newPlaces =  me.myPlacesService.getPlacesInCategory(newCategoryId);
			
			for( var n = 0 ; n < newPlaces.length ;n++) {
				 var myPlaceModel = newPlaces[n];
				 var featAtts = { 
		         };
		         var feat = new OpenLayers.Feature.Vector(null,
						featAtts);
		         feat.geometry = myPlaceModel.get('geometry');
		         newFeatures.push(feat);
			}
			
			
			var layerId = this.getMapLayerId(newCategoryId);
            var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
            var event = this._sandbox.getEventBuilder("FeaturesAvailableEvent")(layer,
					newFeatures,
					"application/nlsfi-x-openlayers-feature",
					"EPSG:3067", 
					"replace");
		
            this._sandbox.notifyAll(event);
            
	        
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
   
    /**
	 * @method myPlaceFinished Saves the place given as parameter
	 * @param myPlace
	 *            model to be saved
	 */
    myPlaceFinished : function(myPlaceModel, oldCategoryId) {
        var me = this;
        // saving
        if(myPlaceModel) {
            // add load mask
            if(this.wizardPanel) {
            	this.wizardPanel.setLoading(this.localization.savemask);
            }
			
            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success, pMyPlaceModel, isNew) {
                me._commitMyPlaceCallback(success, myPlaceModel, isNew, oldCategoryId);
            };
            this.myPlacesService.saveMyPlace(myPlaceModel, callBackWrapper);
        } else {
            // canceled
            this.cleanupAfterMyPlaceOperation();
        }
    },

    /**
	 * @method _commitMyPlaceCallback Internal method to handle server response
	 *         from save my place model. alerts on error and resets the
	 *         functionality to start state on success
	 */
    _commitMyPlaceCallback : function(success, myPlaceModel, isNew, oldCategoryId) {
        var me = this;
    	// remove load masks
    	if(this.wizardPanel) {
    		this.wizardPanel.setLoading(false);
    	}
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            // this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
	        
        	var newCategoryId = myPlaceModel.get('categoryID');
        	// change tab in grid
			this.uiItems.gridPanel.showCategory(newCategoryId);
	        // send update request for places category maplayer

			/*
			 * var request =
			 * this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(newCategoryId),
			 * true); this._sandbox.request(this.getName(), request);
			 * if(oldCategoryId !== newCategoryId) { // category changed ->
			 * update old layer also var request =
			 * this._sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(this.getMapLayerId(oldCategoryId),
			 * true); this._sandbox.request(this.getName(), request); }
			 * 
			 * var layerId = this.getMapLayerId(newCategoryId); var layer =
			 * this._sandbox.findMapLayerFromSelectedMapLayers(layerId); var
			 * feats = []; var featAtts = { }; var feat = new
			 * OpenLayers.Feature.Vector(null, featAtts); feat.geometry =
			 * myPlaceModel.get('geometry'); feats.push(feat);
			 * 
			 * var event =
			 * this._sandbox.getEventBuilder("FeaturesAvailableEvent")(layer,
			 * feats, "application/nlsfi-x-openlayers-feature", "EPSG:3067",
			 * "append");
			 * 
			 * this._sandbox.notifyAll(event);
			 */
			
			var me = this;
			var newFeatures = [];			
			var newPlaces =  me.myPlacesService.getPlacesInCategory(newCategoryId);
			
			for( var n = 0 ; n < newPlaces.length ;n++) {
				 var myPlaceModel = newPlaces[n];
				 var featAtts = { 
		         };
		         var feat = new OpenLayers.Feature.Vector(null,
						featAtts);
		         feat.geometry = myPlaceModel.get('geometry');
		         newFeatures.push(feat);
			}
			
			
			var layerId = this.getMapLayerId(newCategoryId);
            var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
            
            console.log("NEW",newCategoryId,layerId,layer,newFeatures,newPlaces);
            
            var event = this._sandbox.getEventBuilder("FeaturesAvailableEvent")(layer,
					newFeatures,
					"application/nlsfi-x-openlayers-feature",
					"EPSG:3067", 
					"replace");
		
            this._sandbox.notifyAll(event);
            
			if(oldCategoryId!= null  
					&& oldCategoryId != '' && oldCategoryId != newCategoryId) {
				var oldFeatures = [];			
				var oldPlaces =  me.myPlacesService.getPlacesInCategory(oldCategoryId);
			
				for( var n = 0 ; n < oldPlaces.length ;n++) {
					 var myPlaceModel = oldPlaces[n];
					 var featAtts = { 
			         };
			         var feat = new OpenLayers.Feature.Vector(null,
							featAtts);
			         feat.geometry = myPlaceModel.get('geometry');
			         oldFeatures.push(feat);
				}
				
				var layerId = this.getMapLayerId(oldCategoryId);
	            var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
				
	            console.log("OLD",oldCategoryId,layerId,layer,oldFeatures,oldPlaces);
				var event = this._sandbox.getEventBuilder("FeaturesAvailableEvent")(layer,
						oldFeatures,
						"application/nlsfi-x-openlayers-feature",
						"EPSG:3067", 
						"replace");
				this._sandbox.notifyAll(event);
			}
			
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorSave);
        	// console.dir(myPlaceModel);
        }
    },
    /**
	 * @method cleanupAfterMyPlaceOperation Clean up after save or cancel/resets
	 *         the functionality to start state
	 */
    cleanupAfterMyPlaceOperation : function() {
        // tell everything to reset selected place
        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
        this._sandbox.notifyAll(event);
        // tell plugin to disable draw
        this.uiItems.mainPanel.sendStopDrawRequest();
    	this.closeWizard();
    },
    /**
	 * @method startWizard Starts the my place dialog. Populates dialog if a
	 *         place is selected.
	 */
    startWizard : function() {
        var me = this;
        if(this.wizardPanel && this.wizardPanel.isVisible()) {
        	this.closeWizard();
        }
        // extjs seems to explode if we try to reuse the dialog so just create a
		// new one and be happy
        this.wizardPanel = Ext.create('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesWizard', {
            oskariConfig : {
                service : me.myPlacesService,
                sandbox : me._sandbox,
                localizationSet : me.localization,
                module : me
            }
        });
        var selCategory = this.uiItems.gridPanel.getSelectedCategory();
        if(selCategory) {
        	this.wizardPanel.setSelectedCategory(selCategory.get('id'))
        }
        this.wizardPanel.show();
        if(this.selectedMyPlace) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
    },
    /**
	 * @method closeWizard Closes the my place dialog.
	 */
    closeWizard : function() {
    	if(this.wizardPanel) {
	    	this.wizardPanel.hide();
	    	this.wizardPanel.removeAll(true);
	    	this.wizardPanel.destroy();
    		this.wizardPanel = null;
	    }
    },
    start : function(sandbox) {
        sandbox.printDebug("Starting " + this.getName());
        // add gridPanel to the south panel
        Oskari.$("UI.facade").addUIComponent(this.getName() + '_grid', this.uiItems.gridPanel, 'S');
        
    },
    stop : function(sandbox) {
        // remove gridPanel that was added on start
        Oskari.$("UI.facade").removeUIComponent(this.getName() + '_grid');
    },
    
    processStartupLinkLayers: function(sandbox) {
        var mapLayers = sandbox.getRequestParameter('mapLayers');
        
        if(mapLayers === null || mapLayers === "") {
        	// no linked layers
        	return;
        }
        var layerStrings = mapLayers.split(",");
        var keepLayersOrder = true;

        for(var i = 0; i < layerStrings.length; i++) {
            var splitted = layerStrings[i].split("+");
            var layerId = splitted[0];
            var opacity = splitted[1];
            // var style = splitted[2];
            if(layerId !== null && layerId.indexOf(this.idPrefix) !== -1) {
                var rb = null;
                var r = null;
                rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                r = rb(layerId, keepLayersOrder);
                sandbox.request(this.getName(), r);
                rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                r = rb(layerId, opacity);
                sandbox.request(this.getName(), r);
            } 
        }
    },
    
    /**
	 * @method getDrawModeFromGeometry Returns a matching drawmode string-key
	 *         for the geometry
	 * @param geometry
	 *            openlayers geometry from my place model
	 */
    getDrawModeFromGeometry : function(geometry) {
        var olClass = geometry.CLASS_NAME;
        if('OpenLayers.Geometry.Point' === olClass) {
        	return 'point';
        } 
        else if('OpenLayers.Geometry.LineString' === olClass) {
        	return 'line';
        }
        else if('OpenLayers.Geometry.Polygon' === olClass){
        	return 'area';
        }
        return null;
    },
	/**
	 * Formats given message with the given params array values FIXME:
	 * copypasted from language service
	 * 
	 * @param msg
	 *            message to be formatter
	 * @param params
	 *            array of params that has values for {arrayIndex} in param msg
	 */
    formatMessage : function(msg, params) {
        var formatted = msg;
        for(var index in params) {
            formatted = formatted.replace("{" + index + "}", params[index]);
        }
        return formatted;
    },
    /**
	 * @method deleteMyPlace Calls service to delete the currently selected my
	 *         place
	 */
    deleteMyPlace : function() {
        
        var me = this;
        if(this.selectedMyPlace) {
            // add load mask
            this.uiItems.mainPanel.setLoading(this.localization.deletemask);

            // wrap callback to get it into the scope we want
            var callBackWrapper = function(success) {
                me._deleteMyPlaceCallback(success);
            };
            this.myPlacesService.deleteMyPlace(this.selectedMyPlace.get('id'), callBackWrapper);
        }
    },
    /**
	 * @method _deleteMyPlaceCallback Internal method to handle server response
	 *         from delete my place model.
	 */
    _deleteMyPlaceCallback : function(success) {
        var me = this;
        var catID = this.selectedMyPlace.get('categoryID');
        var layerId = this.getMapLayerId();
    	// remove load mask
    	this.uiItems.mainPanel.setLoading(false);
        if(success) {
            // notify grid to update data
            // this.uiItems.gridPanel.placesChanged();
	        this.cleanupAfterMyPlaceOperation();
        }
        else {
        	// TODO: error handling
        	alert(this.localization.errorDelete);
        }
    
        // send update request
        var me = this;
        var newCategoryId = catID;
		var newFeatures = [];			
		var newPlaces =  me.myPlacesService.getPlacesInCategory(newCategoryId);
		
		for( var n = 0 ; n < newPlaces.length ;n++) {
			 var myPlaceModel = newPlaces[n];
			 var featAtts = { 
	         };
	         var feat = new OpenLayers.Feature.Vector(null,
					featAtts);
	         feat.geometry = myPlaceModel.get('geometry');
	         newFeatures.push(feat);
		}
		
		
		var layerId = this.getMapLayerId(newCategoryId);
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        var event = this._sandbox.getEventBuilder("FeaturesAvailableEvent")(layer,
				newFeatures,
				"application/nlsfi-x-openlayers-feature",
				"EPSG:3067", 
				"replace");
	
        this._sandbox.notifyAll(event);

    },
    /**
	 * @method handleFinishedDrawingEvent Handles FinishedDrawingEvent (sent
	 *         from drawplugin) Starts the wizard if the place is new
	 */
    handleFinishedDrawingEvent : function(event) {
    	// TODO: pref just check if a place is selected?
        if(!event.isModification()) {
            // new place, start wizard
            this.startWizard();
        }
    },
    /**
	 * @method getSelectedPlace
	 * @return the currently selected my place or null if no selected
	 */
    getSelectedPlace : function() {
    	return this.selectedMyPlace;
    },
    
    /**
	 * @method _handlePlacesChanged Called when a place or category is added,
	 *         updated or deleted (and on initial load)
	 */
    _handlePlacesChanged : function() {
    	
    	// notify grid that data is ready/changed
        // this.uiItems.gridPanel.placesChanged();
        if(this.wizardPanel) {
        	this.wizardPanel.refreshCategories();
        }
        
        
        // check map layers for categorychanges
        var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        
        var categories = this.myPlacesService.getAllCategories();
        
        var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        
        // check for removal
        for(var i = 0; i < mapLayers.length; ++i) {
        	var layer = mapLayers[i];
        	var found = false;
        	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
        		var cat = categories[catIdx];
	    		if(this.getMapLayerId(cat.get('id')) === layer.getId()) {
        			found = true;
        		}
        	}
        	// remove map layer if the category is no longer available
        	if(!found) {
        		// remove maplayer from selected
        		// TODO: do we need to check if the layer is selected or just
				// send this out every time?
                this._sandbox.requestByName(this.getName(), "RemoveMapLayerRequest", [layer.getId()]);
                // remove maplayer from all layers
	            mapLayerService.removeLayer(layer.getId());
	            
                // remove grid tab for category
                var catID = layer.getId().substring(this.idPrefix.length + 1);
                this.uiItems.gridPanel.removeCategory(catID);
        	}
        }
        
        
        
        
        // check for update or add
    	for(var catIdx = 0; catIdx < categories.length; ++catIdx) {
    		var cat = categories[catIdx];
        	var found = false;
        	for(var i = 0; i < mapLayers.length; ++i) {
	    		if(this.getMapLayerId(cat.get('id')) === mapLayers[i].getId()) {
	    			// found matching maplayer
        			found = true;
	    			// check name change
		    		if(cat.get('name') !== mapLayers[i].getName()) {
		    			var layerConf = {
		    				name: cat.get('name')
		    			};
		    			// update maplayer name if category name has changed
		    			mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
		    		}
	    		}
	    	}
        	if(!found) {
        		// add maplayer
        		/*
				 * var json = this.getMapLayerJson(cat); var myplacesLayer =
				 * mapLayerService.createMapLayer(json);
				 * mapLayerService.addLayer(myplacesLayer);
				 */
        		this.addVectorLayer(cat);
        	}
        	
        	
            this.uiItems.gridPanel.addOrUpdateCategory(cat);
    	}
        
    	if(this.initialLoad) {
	        // add the myplaces layers programmatically since enhancements
	        // cant do this (run before the bundle adds the layers)
	        this.processStartupLinkLayers(this._sandbox);
	        // done here because layers aren't added to the service before this
    		this.initialLoad = false;
        
			// preselect the first category
			this.uiItems.gridPanel.showCategory();
    	}
    },
    
    /**
	 * @method handleMyPlaceSelected Sets the currently selected place
	 * @param the
	 *            new selected place model
	 */
    handleMyPlaceSelected : function(pSelectedMyPlace) {
    	
        // keep a reference to the place so we know what to delete/edit
        this.selectedMyPlace = pSelectedMyPlace;

        if(this.wizardPanel && this.wizardPanel.isVisible()) {
	    	this.wizardPanel.setPlace(this.selectedMyPlace);
        }
	    this.uiItems.mainPanel.placeSelected(pSelectedMyPlace);
    },
    eventHandlers : {
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            this.handleFinishedDrawingEvent(event);
        },
        'MyPlaces.MyPlaceSelectedEvent' : function(event) {
            Oskari.$('UI.facade').expandPart('E');
        	this.uiItems.mainPanel.expand(true);
            this.handleMyPlaceSelected(event.getPlace());
            if(event.isDblClick()) {
            	this.startWizard();
            };
        },
        'MyPlaces.MyPlacesChangedEvent' : function(event) {
        	this._handlePlacesChanged();
        },
        'MyPlaces.MyPlaceHoverEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
            	this.uiItems.gridPanel.handleHover(event);
           	}
        },
		'AfterMapLayerRemoveEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
        		// check if there is any myplaces layers left
        		var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
        		var mapLayers = mapLayerService.getAllLayersByMetaType(this.idPrefix);
        		if(mapLayers.length === 0) {
	                // deactivate hover plugin
	                this.hoverPlugin.deactivate();
        		}
            }
		},
		'MapClickedEvent' : function(event) {
			// check if drawing before doing this
			if(this.disableMapEvents === false) { 
				this.uiItems.gridPanel.handleMapClick(event);
			}
		},
        'AfterMapLayerAddEvent' : function(event) {
        	var layer = event.getMapLayer(); 
        	// check that layer was a my places layer
            if(layer.getMetaType &&  layer.getMetaType() === this.idPrefix) {
            /*
			 * // find the main panel (accordion panel in this case) and expand
			 * Oskari.$('UI.facade').expandPart('E');
			 * this.uiItems.mainPanel.expand(true);
			 *  // do same for grid component
			 * Oskari.$('UI.facade').showUIComponent(this.getName() + '_grid');
			 *  // change tab to added category var catID =
			 * layer.getId().substring(this.idPrefix.length + 1);
			 * this.uiItems.gridPanel.showCategory(catID);
			 *  // TODO: hover should not trigger on layers that are not //
			 * selected // activate hover plugin this.hoverPlugin.activate();
			 */
            }
        },
    	/**
		 * @method eventHandlers.AfterAddExternalMapLayerEvent
		 * 
		 */
		"AfterAddExternalMapLayerEvent" : function(event) {
			/*
			 * if( event.getMapLayerId() == this.layerId ) this.layer =
			 * event.getLayer();
			 */
		},
		/**
		 * @method eventHandlers.AfterRemoveExternalMapLayerEvent
		 * 
		 */
		"AfterRemoveExternalMapLayerEvent" : function(event) {
			/*
			 * if( event.getMapLayerId() == this.layerId ) this.layer = null;
			 */
		}
    },

    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    
    /**
	 * @method addLayerToMap Adds the my places map layer to selected if it is
	 *         not there already
	 */
    addLayerToMap : function(categoryId) {
    	var layerId = this.getMapLayerId(categoryId);
        var layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
	        var request = this._sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
	        this._sandbox.request(this.getName(), request);
        }
    },
    getMapLayerId : function(categoryId) {
    	if(!categoryId) {
    		if(this.selectedMyPlace) {
    			// default to selected place id
    			categoryId = this.selectedMyPlace.get('categoryID');
    		}
    		else {
    			// default to default category id(?)
    			var defCat = this.myPlacesService.getDefaultCategory();
    			if(defCat) {
    				
    				categoryId = defCat.get('id');
    			}
    			else {
    				categoryId = '-99';
    			}
    		}
    	}
    	return this.idPrefix + '_' + categoryId;
    },
    /**
	 * @method getMapLayerJson Populates the category based data to the base
	 *         maplayer json
	 * @return maplayer json for the category
	 */
    getMapLayerJson : function(categoryModel) {
    	var baseJson = this._getMapLayerJsonBase();
    	baseJson.wmsUrl = this._config.wmsUrl + "+AND+category_id=" + categoryModel.get('id') + "&";
    	baseJson.name = categoryModel.get('name');
    	baseJson.id = this.getMapLayerId(categoryModel.get('id'));
    	
		

    	return baseJson;
    },
    
    /**
	 * @method _getMapLayerJsonBase Returns a base maplayer json for my places
	 *         map layer
	 */
    _getMapLayerJsonBase : function() {
		var json = {
			wmsName: 'ows:my_places_categories',
            descriptionLink:"",
            orgName: this.localization.title,
            type: "wmslayer",
            metaType: this.idPrefix,
            baseLayerId:-1,
            legendImage:"",
            gfi : 'disabled',
            formats: {
               value:"text/html"
            },
            isQueryable:false,
            minScale:12000000,
            opacity:75,
            inspire: this.localization.title,
            maxScale:1
		};
        return json;
    },
    
    /**
	 * @property styledLayerDescriptors
	 * 
	 * A set of SLD descriptors for this bundle
	 * 
	 */
	styledLayerDescriptors: {
		'default' : '<StyledLayerDescriptor version="1.0.0" '+
		'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" '+ 
	    '    xmlns="http://www.opengis.net/sld" '+
	    '    xmlns:ogc="http://www.opengis.net/ogc" '+ 
	    '    xmlns:xlink="http://www.w3.org/1999/xlink" '+ 
	    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> '+
	    '  <NamedLayer> '+
	    '    <Name>Simple point with stroke</Name> '+
	     '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> '+
	      '    <FeatureTypeStyle><Rule>'+
	      '<PointSymbolizer>'						+
	      ' <Graphic><Mark><WellKnownName>circle</WellKnownName><Fill>'+
	              '        <CssParameter name="fill">#00A000</CssParameter>'+
	             '       </Fill><Stroke>'+
	            '          <CssParameter name="stroke">#000000</CssParameter>'+
	           '           <CssParameter name="stroke-width">2</CssParameter>'+
	          '          </Stroke></Mark><Size>12</Size></Graphic>'+
	         '     </PointSymbolizer>'+
	         '<PolygonSymbolizer>'						+
		      	'<Fill>'+
		              '        <CssParameter name="fill">#f0c0d0</CssParameter>'+
		              '          <CssParameter name="opacity">70</CssParameter>'+
		             '       </Fill><Stroke>'+
		            '          <CssParameter name="stroke">#a00000</CssParameter>'+
		           '           <CssParameter name="stroke-width">2</CssParameter>'+
		          '          </Stroke>'+
		         '     </PolygonSymbolizer>'+
		         '<LineSymbolizer>'						+
		         	'<Stroke>'+
			            '          <CssParameter name="stroke">#a00000</CssParameter>'+
			           '           <CssParameter name="stroke-width">4</CssParameter>'+
			          '          </Stroke>'+
			         '     </LineSymbolizer>'+
	         '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>'+
	         '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>'+
	         '</Rule></FeatureTypeStyle>'+
	        '</UserStyle></NamedLayer></StyledLayerDescriptor>'
	},
	
	layerDefaults: {
		minScale: 800000,
		maxScale: 1
	},

	/**
	 * @method addVectorLayer
	 * 
	 * Adds a (OpenLayers) Vector Layer
	 * 
	 */
	addVectorLayer : function(categoryModel) {

		/*
		 * hack
		 */
		
		var defaultSLD = this.styledLayerDescriptors['default'];
		
		var spec = {
				"text" : "",
				"type" : "vectorlayer", 
				"styles" : {
					"title" : "Trains",
					"legend" : "",
					"name" : "1"
				},
		        "orgName": this.localization.title,
		        "metaType": this.idPrefix,
				"descriptionLink" : "http://www.google.fi/",
				"legendImage" : "",
				"info" : "",
				"isQueryable" : true,
				"formats" : {
					"value" : "text/html"
				},
				"minScale" : this.layerDefaults.minScale,
				"maxScale" : this.layerDefaults.maxScale,
				"style" : "",
				"dataUrl" : "",
				"wmsUrl" : "x",
				"opacity" : 100,
				"checked" : "false",
				"styledLayerDescriptor" : 
					defaultSLD
			};
		

		
		var baseJson = spec;
    	baseJson.wmsUrl = this._config.wmsUrl + "+AND+category_id=" + categoryModel.get('id') + "&";
    	baseJson.name = categoryModel.get('name');
    	baseJson.id = this.getMapLayerId(categoryModel.get('id'));

    	var mapLayerId = baseJson.id, keepLayersOrder = true, isBasemap = false;
    	
		var request = this._sandbox.getRequestBuilder(
		"AddExternalMapLayerRequest")( mapLayerId, spec );
		this._sandbox.request(this.getName(), request);
		
		
		/**
		 * Note: Added Layer Info is received via Event see below
		 * 
		 */
		var requestAddToMap = this._sandbox.getRequestBuilder(
				"AddMapLayerRequest")( mapLayerId,
				keepLayersOrder);

		this._sandbox.request(this.getName(), requestAddToMap);

	},


	/*
	 * @method removeVectorLayer
	 * 
	 * removes this bundle's vector layer
	 * 
	 */
	removeVectorLayer : function(mapLayerId) {

		/**
		 * remove map layer from map
		 */
		var requestRemovalFromMap = this._sandbox.getRequestBuilder(
				"RemoveMapLayerRequest")( mapLayerId);

		this._sandbox.request(this.getName(), requestRemovalFromMap);

		
		/**
		 * remove map layer spec
		 */
		var request = this._sandbox.getRequestBuilder(
		"RemoveExternalMapLayerRequest")( mapLayerId);

		this._sandbox.request(this.getName(), request);
		
		/*
		 * Note: AfterRemoveExternalMapLayerEvent resets this.layer
		 */

	}
	
    
}, {
	/**
	 * @property protocol
	 * @static
	 */
    'protocol' : ['Oskari.mapframework.module.Module']
});

/* Inheritance *//**
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.MyFeaturesBundleInstance",
				function(b) {
					this.name = 'myplaces';
					this.mediator = null;
					this.sandbox = null;

					this.impl = null;

					/**
					 * These should be SET BY Manifest end
					 */

					this.ui = null;
				},
				/*
				 * prototype
				 */
				{

					/**
					 * start bundle instance
					 * 
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						/**
						 * These should be SET BY Manifest begin
						 */
						this.libs = {
							ext : Oskari.$("Ext")
						};
						this.facade = Oskari.$('UI.facade');

						this.impl = Oskari.clazz
								.create(
										'Oskari.mapframework.ui.module.myplaces.MyFeaturesModule',
										this.conf);

						/**
						 * 
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this.impl,
								this.name, {}, this, 'E', {
									'fi' : {
										title : 'Omat kohteet'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : 'My Places'
									}

								});
						this.def = def;

						this.impl.start(this.facade.getSandbox());

						this.mediator.setState("started");
						return this;
					},

					/**
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * stop bundle instance
					 */
					"stop" : function() {

						this.impl.stop();

						this.facade.removeExtensionModule(this.impl, this.name,
								this.impl.eventHandlers, this, this.def);
						this.def = null;
						this.impl = null;

						this.mediator.setState("stopped");

						return this;
					},

					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.MyPlacesBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});
