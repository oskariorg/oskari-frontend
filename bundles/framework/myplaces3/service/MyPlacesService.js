/**
 * @clas
s Oskari.mapframework.bundle.myplaces3.service.MyPlacesService
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox reference to Oskari sandbox
     *
     */

    function (sandbox) {

        // list of loaded categories & myplaces
        this._categoryList = [];
        this._placesList = {}; //{layerId:[places]}

        this._sandbox = sandbox;
        this.defaultCategory = null;
        // skipLoading is used for published maps (value by init-method param)
        // it means we shouldn't load any features on start and also when saving
        this.skipLoading = false;
        this.srsName = sandbox.getMap().getSrsName();
        this.loadedCategories = false; //TODO remove when places is loaded when category is selected
        this.loadedPlaces = false; //TODO remove when places is loaded when category is selected
    }, {
        __qname: "Oskari.mapframework.bundle.myplaces3.service.MyPlacesService",
        getQName: function () {
            return this.__qname;
        },

        __name: "MyPlacesService",
        getName: function () {
            return this.__name;
        },
        /**
         * Initializes the service and loads categories
         * @method init
         * @param {Boolean} blnSkipLoad true to skip loading existing categories (f.ex. in published map)
         */
        init: function (blnSkipLoad) {
            // preload stuff
            var me = this;
            if(blnSkipLoad === true) {
                this.skipLoading = blnSkipLoad;
                return;
            }
            this.getCategories();
            this.getMyPlacesByUser(); //TODO remove when places is loaded when category is selected
        },

        _allLoaded: function () { //TODO remove when places is loaded when category is selected
            // when both places and categories have been loaded, notify that the data has changed
            if (this.loadedPlaces && this.loadedCategories) {
                this._notifyDataChanged();
            }
        },

        /**
         * @method _addCategory
         * @private
         * Adds the category to the selection
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory} categoryModel
         */
        _addCategory: function (categoryModel) {
            if (categoryModel.isDefault()) {
                this.defaultCategory = categoryModel;
            }
            this._categoryList.push(categoryModel);
            //TODO uncomment when places is loaded by categories
            //this._addCategoryToPlaceList(categoryModel.getId());
        },

        _addCategoryToPlaceList: function (categoryId) {
            this._placesList[categoryId] = [];
        },

        /**
         * @method getAllCategories
         * Returns all categories ("maplayers" for my places) that is loaded in the system.
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory[]}
         */
        getAllCategories: function () {
            return this._categoryList;
        },
        /**
         * @method getAllMyPlaces
         * Returns all users my places
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace[]}
         */
        getAllMyPlaces: function () {
            return this._placesList;
        },

        /**
         * @method getDefaultCategory
         * Returns users default category or undefined
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory}
         */
        getDefaultCategory: function () {
            return this.defaultCategory;
        },

        /**
         * @method _addMyPlace
         * @private
         * Adds given place to internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to add
         */
        _addMyPlace: function (myplaceModel) {
            var categoryId = myplaceModel.getCategoryId();
            if (typeof this._placesList[categoryId] === "undefined"){
                this._addCategoryToPlaceList(categoryId);
            }
            this._placesList[categoryId].push(myplaceModel);
        },
        /**
         * @method _removeMyPlace
         * @private
         * Removes given place from internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Number} placeId id for place to remove
         */
        _removeMyPlace: function (id) {
            var placesList = this._placesList,
                placesInCategory;
            for (category in placesList){
                placesInCategory = placesList[category];
                for (var i = 0; i < placesInCategory.length; i++) {                    
                    if (placesInCategory[i].getId() === id){
                        placesInCategory.splice(i,1);
                        return;
                    }
                }
            }
        },
        findMyPlaceByLonLat: function (lonlat, zoom) {
            Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').info('findMyPlaceByLonLat() is not implemented');
        },
        /**
         * @method findMyPlace
         * Tries to find place with given id
         * @param {Number} id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace}
         */
        findMyPlace: function (id) {
            var placesList = this._placesList,
                placesInCategory;
            for (category in placesList){
                placesInCategory = placesList[category];
                for (var i = 0; i < placesInCategory.length; i++) {                    
                    if (placesInCategory[i].getId() === id)
                        return placesInCategory[i];
                }
            }
            return null;
        },
        /**
         * @method findCategory
         * Tries to find category with given id
         * @param {Number} id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory}
         */
        findCategory: function (id) {
            var categoryList = this._categoryList;
            for (var i = 0; i < categoryList.length; i++) {
                if (categoryList[i].getId() === id) {
                    return categoryList[i];
                }
            }
            return null;
        },

         /**
         * @method getCategories
         *
         * loads categories from backend to given service filters by
         * initialised user uuid
         */
        getCategories: function () {
            var me = this,
                ajaxUrl = me._sandbox.getAjaxUrl();
            jQuery.ajax({
                type: "GET",
                url: ajaxUrl + 'action_route=MyPlacesLayers',
                success: function (response) {
                    if (response) {
                        me._handleGetCategoriesResponse(response);
                        me.loadedCategories = true; //TODO remove when places is loaded by categories
                        me._allLoaded();//TODO chance to me._notifyDataChanged(); 
                    } else {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces categories.');
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces categories.');
                    }
                }
            });
        },

        /**
         * @method _handleGetCategoriesResponse
         *
         * processes ajax response from backend 
         */
        _handleGetCategoriesResponse: function (response) {
            var layers = response.features;           
            if (layers === null || layers === undefined || layers.length === 0) {
                return;
            }
            var properties,
                category;
            // found categories, proceed normally
            for (var i = 0; i < layers.length; i++) {
                properties = layers[i].properties;
                category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory');
                category.setId(layers[i].id);
                category.setName(Oskari.util.sanitize(properties.category_name));
                category.setDefault(true === properties.default);
                category.setLineWidth(properties.stroke_width);
                category.setLineStyle(properties.stroke_dasharray);
                category.setLineCap(properties.stroke_linecap);
                category.setLineCorner(properties.stroke_linejoin);
                category.setLineColor(this._formatColorFromServer(properties.stroke_color));
                category.setAreaLineWidth(properties.border_width);
                category.setAreaLineStyle(properties.border_dasharray);
                category.setAreaLineCorner(properties.border_linejoin);
                category.setAreaLineColor(this._formatColorFromServer(properties.border_color));
                category.setAreaFillColor(this._formatColorFromServer(properties.fill_color));
                category.setAreaFillStyle(properties.fill_pattern);
                category.setDotShape(properties.dot_shape);
                category.setDotColor(this._formatColorFromServer(properties.dot_color));
                category.setDotSize(properties.dot_size);
                category.setUuid(properties.uuid);
                if (properties.publisher_name) {
                    category.setPublic(true);
                }
                this._addCategory(category);
            }
        },

        /**
         * @method _movePlacesToCategory
         * @private
         * Moves places from one category to another and calls given callback when done.
         * @param {Number} oldCategoryId source category id
         * @param {Number} newCategoryId destination category id
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _movePlacesToCategory: function (oldCategoryId, newCategoryId, callback) {
            var me = this,
                placesInDeleteCategory = me.getPlacesInCategory(oldCategoryId);
            if (placesInDeleteCategory.length === 0) {
                // no places to move -> callback right away
                callback(true);
                return;
            }
            for (var i = 0; i < placesInDeleteCategory.length; i++) {
                placesInDeleteCategory[i].setCategoryId(newCategoryId);
            }
            this.commitMyPlaces(placesInDeleteCategory, callback, true); //true isMovePlaces
        },

        /**
         * @method _deletePlacesInCategory
         * @private
         * Deletes all places in given category
         * @param {Number} categoryId category id to delete from
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _deletePlacesInCategory: function (categoryId, callback) {
            var me = this,
                placesInDeleteCategory = me.getPlacesInCategory(categoryId),
                idList = [];
            for (var i = 0; i < placesInDeleteCategory.length; i++) {
                idList.push(placesInDeleteCategory[i].getId());
            }
            if (idList.length === 0) {
                // no places to delete -> callback right away
                callback(true);
                return;
            }
            var callBackWrapper = function (success, list) {
                if (success) {
                    var i;
                    for (i = 0; i < placesInDeleteCategory.length; i++) {
                        me._removeMyPlace(list[i]);
                    }
                    me._notifyDataChanged();
                }
                callback(success);
            };
            this.deleteMyPlaces(idList, callBackWrapper);
        },
        /*
         * @method deleteMyPlaces
         *
         * delete a list of my places from backend
         */
        deleteMyPlaces: function (idList, callback) {
            var me = this,
                ajaxUrl = me._sandbox.getAjaxUrl();
            jQuery.ajax({
                type: 'DELETE',
                url: ajaxUrl + 'action_route=MyPlacesFeatures&features=' + idList.join(),
                success: function (response) {
                    if(response){    
                        callback(true, idList);
                    } else {
                        callback(false, idList);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false, idList);
                    }
                }
            });
        },
        /**
         * @method parseDate
         *
         * parses date for my places
         *
         * @param dateStr format 2011-11-02T15:27:48.981+02:00 (time part is
         * optional)
         * @return array with date part in first index, time (optional) in second,
         * empty array if param is undefined or less than 10 characters
         */
        parseDate: function (dateStr) {
            if (!dateStr) {
                return [];
            }
            if (dateStr.length < 10) {
                return [];
            }
            var year = dateStr.substring(0, 4),
                month = dateStr.substring(5, 7),
                day = dateStr.substring(8, 10),
                returnValue = [day + '.' + month + '.' + year],
                time = '';
            // TODO: error handling
            if (dateStr.length === 29) {
                time = dateStr.substring(11);
                var splitted = time.split('+');
                time = splitted[0];
                // take out milliseconds
                time = time.split('.')[0];
                var timeComps = time.split(':'),
                    hour = timeComps[0],
                    min = timeComps[1],
                    sec = timeComps[2];
                /*
             var timezone = splitted[1];
             timezone = timezone.split(':')[0];
             hour = parseInt(hour) + parseInt(timezone);
             */
                time = hour + ':' + min + ':' + sec;
                returnValue.push(time);
            }

            return returnValue;
        },
        //TODO fix this and getplacesingategory when places is loaded when category is selected
        loadPlacesInCategory: function (categoryId) {
            var category = this.findCategory(categoryId);
            var callBackWrapper = function (){
                category.setPlacesLoaded(true);
                return this.getPlacesInCategory(categorId);
            }
            if (category.isPlacesLoaded()){
                return this.getPlacesInCategory(categorId);
            } else {
                this.getMyPlacesByLayerId(categoryId, callBackWrapper); 
            }
        },
        /**
         * @method getPlaces
         *
         * loads places from backend to given service filters by layerId      
         *
         */
        getMyPlacesByLayerId: function (categoryId, callback) {
            var me = this,
                ajaxUrl = me._sandbox.getAjaxUrl();
            if (!categoryId){
                callback();
            }
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                url: ajaxUrl + 'action_route=MyPlacesFeatures&layerId=' + categoryId + '&crs=' + this.srsName,
                success: function (response) {
                    if (response) {
                        me._handleMyPlacesResponse(response);                                 
                        me._notifyDataChanged();
                    } else {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces.');
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces.');
                    }
                }
            });
        },
        /**
         * @method getPlaces
         * loads places from backend to given service filters by user       
         * @param cb
         *
         */
        getMyPlacesByUser: function () {
            var me = this,
                ajaxUrl = me._sandbox.getAjaxUrl();
            jQuery.ajax({
                type: 'GET',
                url: ajaxUrl + 'action_route=MyPlacesFeatures&crs=' + this.srsName,
                success: function (response) {
                    if (response) {
                        me._handleMyPlacesResponse(response);
                        me.loadedPlaces = true;
                        me._allLoaded();
                    } else {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces.');
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Failed to load myplaces.');
                    }
                }
            });
        },
        /**
         * @method _handleCommitMyPlacesResponse
         * processes ajax response from backend
         * @param response server response
         */
        _handleMyPlacesResponse: function (response) {
            var features = response.features;
            if (features === null || features === undefined || features.length === 0 || jQuery.isEmptyObject(features)) {
                return;
            }
            var feat,
                place;
            for (var i = 0; i < features.length; i++) {
                feat = features[i];
                place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
                place.setId(feat.id);
                place.setName(Oskari.util.sanitize(feat.properties.name));
                place.setDescription(Oskari.util.sanitize(feat.properties.place_desc));
                place.setAttentionText(Oskari.util.sanitize(feat.properties.attention_text));
                place.setLink(Oskari.util.sanitize(feat.properties.link));
                place.setImageLink(Oskari.util.sanitize(feat.properties.image_url));
                place.setCategoryId(feat.properties.category_id);
                place.setCreateDate(feat.properties.created);
                place.setUpdateDate(feat.properties.updated);
                place.setGeometry(feat.geometry);
                place.setUuid(feat.properties.uuid);                
                this._addMyPlace(place);
            }
        },
        /**
         * @method getPlacesInCategory
         * Returns all places in given category or empty array if none.
         * @param {Number} categoryId category id
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace[]}
         */
        getPlacesInCategory: function (categoryId) {
            var placesInCategory = this._placesList[categoryId];
            if (placesInCategory && placesInCategory.length && placesInCategory.length !== 0){
                return placesInCategory;
            } else {
                return [];
            }
        },
        /**
         * @method deleteCategory
         * Deletes all places in given category or moves the places to default category. After that
         * deletes the category.
         * @param {Number} categoryId category id to delete
         * @param {Boolean} movePlacesToDefault true to move places, false to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        deleteCategory: function (categoryId, movePlacesToDefault, callback) {
            var me = this;

            // call actual category delete once category has been cleared of places
            // successfully
            var callBackWrapper = function (success) {
                if (success) {
                    me._deleteEmptyCategory(categoryId, callback);
                } else {
                    // only callback on fail here
                    callback(success);
                }
            };
            // move places handling
            if (movePlacesToDefault === true) {
                var defaultCategory = me.getDefaultCategory();
                me._movePlacesToCategory(categoryId, defaultCategory.getId(), callBackWrapper);
            } else {
                // delete places to clear category if places will not be moved
                me._deletePlacesInCategory(categoryId, callBackWrapper);
            }
        },
        /**
         * @method _deleteEmptyCategory
         * @private
         * Deletes given category. Assumes its empty.
         * @param {Number} categoryId category id to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        _deleteEmptyCategory: function (categoryId, callback) {
            var me = this;
            var callBackWrapper = function (success, list) {
                if (success) {
                    for(var i = 0 ; i < list.length; i++){
                        me._removeCategory(list[i]);
                    }                    
                }
                callback(success);
                me._notifyDataChanged();
            };
            this.deleteCategories([categoryId], callBackWrapper);
        },
        /*
         * @method deleteCategories
         *
         * delete a list of categories from backend
         * @param {Array} categoryIds
         * @param {Function} callback
         */
        deleteCategories: function (categoryIds, callback) {
            var me = this, 
                ajaxUrl = me._sandbox.getAjaxUrl();

            jQuery.ajax({
                type: "DELETE",
                dataType: 'json',
                url: ajaxUrl + 'action_route=MyPlacesLayers&layers=' + categoryIds.join(),
                success: function (response) {
                    if (response) {
                        callback(true, categoryIds);
                    } else {
                        callback(false, categoryIds);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false, categoryIds);
                    }
                }
            });
        },
        /**
         * @method _removeCategory
         * @private
         * Removes given category from internal data structure. Called when similar backend function
         * has returned successfully.
         * @param {Number} categoryId category id to delete
         */
        _removeCategory: function (categoryId) {
            for (var i = 0; i < this._categoryList.length; i++) {
                if (this._categoryList[i].getId() === categoryId) {
                    this._categoryList.splice(i, 1);
                    break;
                }
            }
        },
        /**
         * @method saveCategory
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory} categoryModel category to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), categoryModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveCategory: function (categoryModel, callback) {
            this.commitCategories([categoryModel], callback);
        },
        /**
         * @method commitCategories
         *
         * handles insert & update (NO delete)
         */
        commitCategories: function (list, callback) {
            var me = this,
                ajaxType,
                categories = [],
                categoryId,
                cat,
                ajaxUrl = me._sandbox.getAjaxUrl(),
                isNew;
            for (var i = 0; i < list.length; i++) {
                var category = {};
                cat = list[i];
                categoryId = cat.getId();

                category.properties = {
                    'category_name': cat.getName(),
                    'default': cat.isDefault(),
                    'stroke_width': cat.getLineWidth(),
                    'stroke_dasharray': cat.getLineStyle(),
                    'stroke_linecap': cat.getLineCap(),
                    'stroke_linejoin': cat.getLineCorner(),
                    'stroke_color': this._prefixColorForServer(cat.getLineColor()),
                    'border_width': cat.getAreaLineWidth(),
                    'border_dasharray': cat.getAreaLineStyle(),
                    'border_linejoin': cat.getAreaLineCorner(),
                    'border_color': typeof cat.getAreaLineColor() === 'string' ? this._prefixColorForServer(cat.getAreaLineColor()) : null,
                    'fill_color': typeof cat.getAreaFillColor() === 'string' ? this._prefixColorForServer(cat.getAreaFillColor()) : null,
                    'fill_pattern': cat.getAreaFillStyle(),
                    'dot_color': this._prefixColorForServer(cat.getDotColor()),
                    'dot_size': cat.getDotSize(),
                    'dot_shape': cat.getDotShape()
                };
                //UPDATE
                if (categoryId) {
                    category.id = categoryId;
                    isNew = false;
                    ajaxType = 'PUT';
                } else {
                    isNew = true;
                    ajaxType = 'POST';
                }
                categories.push(category);
            }
            jQuery.ajax({
                type: ajaxType,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({'features': categories}),
                url: ajaxUrl + 'action_route=MyPlacesLayers',
                success: function (response) {
                    if (response) {
                        me._handleCommitCategoriesResponse(response, callback, isNew);
                        me._notifyDataChanged();
                    } else {
                        callback(false, null, isNew);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false, null, isNew);
                    }
                }
            });
        },
        /**
         * @method _handleCommitCategoriesResponse
         *
         */
        _handleCommitCategoriesResponse: function (response, cb, isNew) {
            var categories = response.features,
                category,
                categoryModel,
                id,
                properties;
            
            if (categories === null || categories === undefined || categories.length === 0) {
                if (cb){
                    cb(false, null, isNew);
                }
            }
            for (var i = 0; i < categories.length; i++){
                category = categories[i];
                id = category.id;
                if (isNew){ //Insert
                    categoryModel = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory');
                    categoryModel.setId(id);
                } else { //Update
                    categoryModel = this.findCategory(id);
                    if (!categoryModel){
                        cb (false, null, isNew);
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Cannot find category to update');
                        return;
                    }
                }
                properties = category.properties;
                // set values
                categoryModel.setName(Oskari.util.sanitize(properties.category_name));
                categoryModel.setUuid(properties.uuid);
                categoryModel.setDefault(true === properties.default);
                if (properties.publisher_name) {
                    category.setPublic(true);
                }
                
                categoryModel.setDotSize(properties.dot_size);
                categoryModel.setDotColor(this._formatColorFromServer(properties.dot_color));
                categoryModel.setDotShape(properties.dot_shape);

                categoryModel.setLineWidth(properties.stroke_width);
                categoryModel.setLineColor(this._formatColorFromServer(properties.stroke_color));
                categoryModel.setLineCap(properties.stroke_linecap);
                categoryModel.setLineCorner(properties.stroke_linejoin);
                categoryModel.setLineStyle(properties.stroke_dasharray);

                categoryModel.setAreaLineWidth(properties.border_width);
                categoryModel.setAreaLineCorner(properties.border_linejoin);
                categoryModel.setAreaLineStyle(properties.border_dasharray);
                categoryModel.setAreaLineColor(this._formatColorFromServer(properties.border_color));
                categoryModel.setAreaFillColor(this._formatColorFromServer(properties.fill_color));
                categoryModel.setAreaFillStyle(properties.fill_pattern);
                if (isNew){
                    this._addCategory(categoryModel);  
                }
                //call callback for every category
                cb(true, categoryModel, isNew);
            }
        },
        /**
         * @method _notifyDataChanged
         * @private
         * Notifies components that places/categories have changed with 'MyPlaces.MyPlacesChangedEvent'
         */
        _notifyDataChanged: function () {
            var event = this._sandbox.getEventBuilder('MyPlaces.MyPlacesChangedEvent')();
            this._sandbox.notifyAll(event);
        },
        /**
         * @method deleteMyPlace
         * Deletes place matching given id.
         * @param {Number} placeId id for place to delete
         * @param {Function} callback function to call when done, receives boolean as argument(true == successful)
         */
        deleteMyPlace: function (placeId, callback) {
            var me = this;
            var callBackWrapper = function (success, list) {
                if (success) {
                    me._removeMyPlace(list[0]);
                    me._notifyDataChanged();
                }
                callback(success, list[0]);
            };
            this.deleteMyPlaces([placeId], callBackWrapper);

        },
        /**
         * @method saveMyPlace
         * Saves given category to backend and internal data structure. Adds it if new and updates if existing (has an id).
         * @return {Oskari.mapframework.bundle.myplaces3.model.MyPlace} myplaceModel place to save
         * @param {Function} callback function to call when done, receives boolean as
         *      first argument(true == successful), myplaceModel as second parameter and boolean as third parameter (true if the category was new)
         */
        saveMyPlace: function (myplaceModel, callback, isMovePlace) {
            this.commitMyPlaces([myplaceModel], callback, isMovePlace);
        },

        /**
         * @method commitPlaces
         *
         * handles insert & update (NO delete)
         */
        commitMyPlaces: function (list, callback, isMovePlaces) {
            var me = this,
                features = [],
                id,
                ajaxType,
                isNew,
                feat;
            for (i = 0; i < list.length; i++) {
                feat = list[i];
                id = feat.getId();
                //backend formatting
                geojson = {
                    'type': feat.getType(),
                    'geometry': feat.getGeometry(),
                    'category_id': feat.getCategoryId(),
                    'properties': {
                        'name': feat.getName(),
                        'place_desc': feat.getDescription(),
                        'attention_text': feat.getAttentionText(),
                        'link': feat.getLink(),
                        'image_url': feat.getImageLink()                   
                    }
                };
                //UPDATE
                if(id){
                    geojson.id = id;
                    isNew = false;
                    ajaxType ="PUT";
                } else {
                    isNew = true;
                    ajaxType = "POST";
                }
                features.push(geojson);
            }
            jQuery.ajax({
                type: ajaxType,
                dataType: 'json',
                contentType: 'application/json',
                data:JSON.stringify({'features': features, 'srsName': this.srsName}), 
                url: ajaxUrl + 'action_route=MyPlacesFeatures&crs=' + this.srsName,
                success: function (response) {
                    if (response) {
                        if (me.skipLoading === true){
                            callback(true);
                            return;
                        }
                        me._handleCommitMyPlacesResponse(response, callback, isNew, isMovePlaces);
                        me._notifyDataChanged();
                                               
                    } else {
                        callback(false, null);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false, null);
                    }
                }
            });
        },

        /**
         * @method _handleCommitMyPlacesResponse
         * processes ajax response from backend
         * @param response server response
         * @param cb callback to call with the model list as param
         */
        _handleCommitMyPlacesResponse: function (response, cb, isNew, isMovePlaces){
            var features = response.features;
            var category;
            if (features === null || features === undefined || features.length === 0 || jQuery.isEmptyObject(features)) {
                if (cb) {
                    cb(false, null); 
                }
                return;
            }
            var feature,
                id,
                place;
            for (var i = 0; i < features.length; i++) {
                    feature = features[i];
                    id = feature.id;
                if (isNew || isMovePlaces){
                    place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');            
                    place.setId(id);
                    place.setCreateDate(feature.properties.created);
                    place.setUuid(feature.uuid);                
                } else {
                    place = this.findMyPlace(id);
                    if (!place){
                        cb(false, null);
                        Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Cannot find place to update');
                    }                
                }
                place.setName(Oskari.util.sanitize(feature.properties.name));
                place.setDescription(Oskari.util.sanitize(feature.properties.place_desc));
                place.setAttentionText(Oskari.util.sanitize(feature.properties.attention_text));
                place.setLink(Oskari.util.sanitize(feature.properties.link));
                place.setImageLink(Oskari.util.sanitize(feature.properties.image_url));
                place.setCategoryId(feature.properties.category_id);
                place.setUpdateDate(feature.properties.updated);
                place.setGeometry(feature.geometry);
                if(isNew || isMovePlaces){
                    this._removeMyPlace(place.getId());
                    this._addMyPlace(place);
                }
            }
            if (cb){
                var category = features[0].properties.category_id; //all commited places is in same category
                cb(true, category);
            }
        },
        /**
         * @method publishCategory
         * Method marks the category published or unpublished
         * @param {Number} categoryId
         * @param {Boolean} makePublic true to publish, false to unpublish
         * @param {Function} callback function receives a boolean parameter with true on successful operation
         */
        publishCategory: function (categoryId, makePublic, callback) {
            var me = this,
                category = me.findCategory(categoryId);
            if (!category) {
                Oskari.log('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService').error('Cannot find place to update');
                callback(false);
            }
            var ajaxUrl = me._sandbox.getAjaxUrl();
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                data: {
                    id: category.getId(),
                    makePublic: makePublic
                },
                url: ajaxUrl + 'action_route=PublishMyPlaceLayer',
                success: function (pResp) {
                    if (pResp) {
                        category.setPublic(makePublic);
                        callback(true);
                        me._notifyDataChanged();
                    } else {
                        callback(false);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (jqXHR.status !== 0) {
                        callback(false);
                    }
                }
            });
        },
        /**
         * @method  _formatColorFromServer
         * @private
         * Removes prefix #-character if present
         */
        _formatColorFromServer: function (color) {
            if (typeof color === 'string'){
                if (color.length === 0){
                    return null;
                } else if (color.charAt(0) === '#'){
                    return color.substring(1);
                } else {
                    return color;
                }
            } else{
                return null;
            }
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
        }



    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });