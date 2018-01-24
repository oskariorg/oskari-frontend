/**
 * @class Oskari.mapframework.bundle.myplaces3.CategoryHandler
 *
 * Handles category related functionality for my places (map layers etc)
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.CategoryHandler',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        // init layers from link (for printing) on initial load
        this.initialLoad = true;
        this.metaType = 'MYPLACES';
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.validateTool = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
    }, {
        __name: 'MyPlacesCategoryHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {},
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
            var me = this,
                sandbox = this.instance.sandbox,
                p;

            if (Oskari.user().isLoggedIn()) {
                sandbox.register(me);
                for (p in me.eventHandlers) {
                    if (me.eventHandlers.hasOwnProperty(p)) {
                        sandbox.registerForEventByName(me, p);
                    }
                }
            }
        },

        /**
         * @method stop
         * implements Module protocol stop method
         */
        stop: function () {},
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MyPlaces.MyPlacesChangedEvent
             * Checks if categories have been changed and updates corresponding maplayers accordingly
             * @param {Oskari.mapframework.myplaces.event.MyPlacesChangedEvent} event
             */
            'MyPlaces.MyPlacesChangedEvent': function () {
                this._handlePlacesChanged();
            }
        },
        /**
         * @method _handlePlacesChanged
         * Called when a place or category is added, updated or deleted (and on initial load)
         */
        _handlePlacesChanged: function () {
            var sandbox = this.instance.sandbox;
            // check map layers for categorychanges
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                categories = this.instance.getService().getAllCategories(),
                mapLayers = mapLayerService.getAllLayersByMetaType(this.metaType),
                i,
                layer,
                found,
                catIdx,
                cat;
            // check for removal
            for (i = 0; i < mapLayers.length; i += 1) {
                layer = mapLayers[i];
                found = false;
                for (catIdx = 0; catIdx < categories.length; catIdx += 1) {
                    cat = categories[catIdx];
                    if (this._getMapLayerId(cat.getId()) === layer.getId()) {
                        found = true;
                    }
                }
                // remove map layer if the category is no longer available
                if (!found) {
                    // remove maplayer from selected
                    // TODO: do we need to check if the layer is selected or just send this out every time?
                    sandbox.requestByName(this.getName(), 'RemoveMapLayerRequest', [layer.getId()]);
                    // remove maplayer from all layers
                    mapLayerService.removeLayer(layer.getId());
                }
            }

            // check for update or add
            for (catIdx = 0; catIdx < categories.length; catIdx += 1) {
                cat = categories[catIdx];
                found = false;
                for (i = 0; i < mapLayers.length; i += 1) {
                    if (this._getMapLayerId(cat.getId()) === mapLayers[i].getId()) {
                        // found matching maplayer
                        found = true;
                        // check name change
                        if (cat.getName() !== mapLayers[i].getName()) {
                            var layerConf = {
                                name: cat.getName()
                            };
                            // update maplayer name if category name has changed
                            mapLayerService.updateLayer(mapLayers[i].getId(), layerConf);
                        }
                    }
                }
                if (!found) {
                    // add maplayer
                    var json = this._getMapLayerJson(cat),
                        myplacesLayer = mapLayerService.createMapLayer(json);
                    mapLayerService.addLayer(myplacesLayer, this.initialLoad);
                }
            }

            if (this.initialLoad) {
                // notify components of added layer if not suppressed
                var event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // to-do: check if null is valid parameter here
                sandbox.notifyAll(event); // add the myplaces layers programmatically since normal link processing
                // cant do this (run before the bundle adds the layers)
                this._processStartupLinkLayers(sandbox);
                // done here because layers aren't added to the service before this
                this.initialLoad = false;
            }
        },
        /**
         * @method addLayerToMap
         * Adds the my places map layer to selected if it is not there already
         */
        addLayerToMap: function (categoryId) {
            var layerId = this._getMapLayerId(categoryId),
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                var request = this.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
                this.sandbox.request(this.getName(), request);
            }
        },
        /**
         * @method addLayerToService
         * Adds the my places map layer service
         */
        addLayerToService: function (category) {
            // add maplayer to Oskari
            var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                json = this._getMapLayerJson(category),
                myplacesLayer = mapLayerService.createMapLayer(json);
            mapLayerService.addLayer(myplacesLayer);
        },
        _getMapLayerId: function (categoryId) {
            if (!categoryId) {
                // default to default category id(?)
                var defCat = this.instance.getService().getDefaultCategory();
                if (defCat) {

                    categoryId = defCat.getId();
                } else {
                    categoryId = '-99';
                }
            }
            return this.instance.idPrefix + '_' + categoryId;
        },
        /**
         * @method _getMapLayerJson
         * Populates the category based data to the base maplayer json
         * @private
         * @return maplayer json for the category
         */
        _getMapLayerJson: function (categoryModel) {
            var baseJson = this._getMapLayerJsonBase();
            baseJson.wmsUrl = Oskari.urls.getRoute('MyPlacesTile') + '&myCat=' + categoryModel.getId() + '&';
            baseJson.name = categoryModel.getName();
            baseJson.id = this._getMapLayerId(categoryModel.getId());
            //  Permission is always ok for user's own data
                baseJson.permissions = {
                    'publish': 'publication_permission_ok'
                };
            return baseJson;
        },
        /**
         * @method _getMapLayerJsonBase
         * Returns a base model for maplayer json to create my places map layer
         * @private
         * @return {Object}
         */
        _getMapLayerJsonBase: function () {
            var json = {
                    wmsName: 'oskari:my_places_categories',
                    type: 'myplaces',
                    isQueryable: true,
                    opacity: 50,
                    metaType: this.metaType,
                    orgName: this.loc('category.organization'),
                    inspire: this.loc('category.inspire')
                };
            if (this.instance.conf &&
                this.instance.conf.layerDefaults &&
                typeof this.instance.conf.layerDefaults === 'object') {
                var defaults = this.instance.conf.layerDefaults,
                    key;
                for (key in defaults) {
                    if (defaults.hasOwnProperty(key)) {
                        json[key] = defaults[key];
                    }
                }
            }
            return json;
        },
        /**
         *
         */
        _processStartupLinkLayers: function (sandbox) {
            var mapLayers = Oskari.util.getRequestParam('mapLayers');

            if (!mapLayers) {
                // no linked layers
                return;
            }
            var layerStrings = mapLayers.split(','),
                keepLayersOrder = true,
                i,
                splitted,
                layerId,
                opacity,
                rb,
                r;

            for (i = 0; i < layerStrings.length; i += 1) {
                splitted = layerStrings[i].split('+');
                layerId = splitted[0];
                opacity = splitted[1];

                if (layerId !== null && layerId.indexOf(this.instance.idPrefix) !== -1) {
                    rb = null;
                    r = null;
                    rb = sandbox.getRequestBuilder('AddMapLayerRequest');
                    r = rb(layerId, keepLayersOrder);
                    sandbox.request(this.getName(), r);
                    rb = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
                    r = rb(layerId, opacity);
                    sandbox.request(this.getName(), r);
                }
            }
        },

        editCategory: function (category) {
            var me = this;

            this.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            var form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.view.CategoryForm', me.instance),
                values = {
                    name: category.getName(),
                    id: category.getId(),
                    _isDefault: category.isDefault(),
                    dot: {
                        size: category.getDotSize(),
                        color: category.getDotColor(),
                        shape: ((category.getDotShape() !== null && category.getDotShape() !== undefined) ? category.getDotShape() : 1)
                    },
                    line: {
                        cap: category.getLineCap(),
                        corner: category.getLineCorner(),
                        style: category.getLineStyle(),
                        width: category.getLineWidth(),
                        color: category.getLineColor()
                    },
                    area: {
                        lineWidth: category.getAreaLineWidth(),
                        lineCorner: category.getAreaLineCorner(),
                        lineStyle: category.getAreaLineStyle(),
                        lineColor: category.getAreaLineColor(),
                        fillColor: category.getAreaFillColor(),
                        fillStyle: category.getAreaFillStyle()
                    }
                };
            form.setValues(values);
            var content = form.getForm();
            content.find('input[data-name=categoryname]').val(category.name);

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                buttons = [],
                saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc('buttons.save'));
            saveBtn.addClass('primary');
            saveBtn.setHandler(function () {
                var values = form.getValues(),
                    errors = me.validateCategoryFormValues(values);
                if (errors.length !== 0) {
                    me.showValidationErrorMessage(errors);
                    return;
                }
                var category = me.getCategoryFromFormValues(values);
                me.saveCategory(category);

                dialog.close();
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc('buttons.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            buttons.push(cancelBtn);
            buttons.push(saveBtn);
            dialog.makeModal();
            dialog.show(me.loc('categoryform.edit.title'), content, buttons);
            dialog.moveTo('div.personaldata ul li select', 'right');
            //bind listeners etc. for category form
            form.start();

        },
        showValidationErrorMessage: function (errors) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('buttons.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            var content = jQuery('<ul></ul>'),
                i,
                row;
            for (i = 0; i < errors.length; i += 1) {
                row = jQuery('<li></li>');
                row.append(errors[i].error);
                content.append(row);
            }
            dialog.makeModal();
            dialog.show(this.loc('validation.title'), content, [okBtn]);

        },
        /**
         * @method _showMessage
         * Shows user a message with ok button
         * @private
         * @param {String} title popup title
         * @param {String} message popup message
         */
        _showMessage: function (title, message) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('buttons.ok'));
            okBtn.addClass('primary');

            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, message, [okBtn]);
        },

        /**
         * @method hasIllegalChars
         * Checks value for problematic characters
         * @return {Boolean} true if value has illegal characters
         */
        hasIllegalChars: function (value) {
            this.validateTool.setValue(value);
            return !this.validateTool.checkValue();
        },

        /**
         * @method _validateNumber
         * Checks value for number and number range
         * @return {Boolean} true if value is ok
         * @private
         */
        _validateNumber: function (value, min, max) {
            return this.validateTool.validateNumberRange(value, min, max);
        },
        /**
         * @method _isColor
         * Checks value for a hex color
         * @return {Boolean} true if ok, false -> not a color. null is valid color.
         * @private
         */
        _isColor: function (value) {
            if(value === null) {
                return true;
            }
            return this.validateTool.validateHexColor(value);
        },
        validateCategoryFormValues: function (values) {
            var errors = [];
            var me = this;
            if (!values) {
                return errors;
            }

            if (!values.name) {
                errors.push({
                    field: 'name',
                    error: me.loc('validation.categoryName')
                });
            } else if (Oskari.util.sanitize(values.name) !== values.name) {
                errors.push({
                    field: 'name',
                    error: me.loc('validation.categoryNameIllegal')
                });
            }

            if (!this._validateNumber(values.dot.shape, 0, 6)) {
                errors.push({
                    field: 'dotShape',
                    error: me.loc('validation.dotShape')
                });
            }
            if (!this._validateNumber(values.dot.size, 1, 5)) {
                errors.push({
                    field: 'dotSize',
                    error: me.loc('validation.dotSize')
                });
            }
            if (!this._isColor(values.dot.color)) {
                errors.push({
                    field: 'dotColor',
                    error: me.loc('validation.dotColor')
                });
            }
            if (!this._validateNumber(values.line.width, 1, 50)) {
                errors.push({
                    field: 'lineWidth',
                    error: me.loc('validation.lineSize')
                });
            }
            if (!this._isColor(values.line.color)) {
                errors.push({
                    field: 'lineColor',
                    error: me.loc('validation.lineColor')
                });
            }
            if (!this._validateNumber(values.area.lineWidth, 0, 50)) {
                errors.push({
                    field: 'areaLineWidth',
                    error: me.loc('validation.areaLineSize')
                });
            }
            if (!this._isColor(values.area.lineColor)) {
                errors.push({
                    field: 'areaLineColor',
                    error: me.loc('validation.areaLineColor')
                });
            }
            if (!this._isColor(values.area.fillColor)) {
                errors.push({
                    field: 'areaFillColor',
                    error: me.loc('validation.areaFillColor')
                });
            }
            return errors;
        },
        getCategoryFromFormValues: function (values) {
            var category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory');
            category.setName(Oskari.util.sanitize(values.name));
            category.setId(values.id);

            category.setDotSize(values.dot.size);
            category.setDotColor(values.dot.color);
            category.setDotShape(values.dot.shape);

            category.setLineWidth(values.line.width);
            category.setLineColor(values.line.color);
            category.setLineCap(values.line.cap);
            category.setLineCorner(values.line.corner);
            category.setLineStyle(values.line.style);

            category.setAreaLineWidth(values.area.lineWidth);
            category.setAreaLineColor(values.area.lineColor);
            category.setAreaLineCorner(values.area.lineCorner);
            category.setAreaLineStyle(values.area.lineStyle);
            category.setAreaFillColor(values.area.fillColor);
            category.setAreaFillStyle(values.area.fillStyle);

            category.setDefault(values._isDefault);
            return category;
        },
        saveCategory: function (category) {
            var me = this,
                serviceCallback = function (blnSuccess, model, blnNew) {
                    if (blnSuccess) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(me.loc('notification.categorySaved.title'), me.loc('notification.categorySaved.message'));
                        dialog.fadeout();
                        // refresh map layer on map -> send update request
                        var layerId = me._getMapLayerId(model.getId()),
                            request = me.instance.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true),
                            layerIsSelected = me.instance.sandbox.isLayerAlreadySelected(layerId);
                        if (layerIsSelected){
                            me.instance.sandbox.request(me, request);
                        }
                    } else {
                        // blnNew should always be true since we are adding a category
                        if (blnNew) {
                            me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.addCategory'));
                        } else {
                            me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.editCategory'), blnNew);
                        }
                    }
                };
            this.instance.getService().saveCategory(category, serviceCallback);
        },
        /**
         * @method confirmDeleteCategory
         * Shows a confirmation dialog with buttons to continue.
         * If category has places -> asks if they will be moved to default category or deleted
         * If category is empty -> only has delete and cancel
         * The message will also be different for both cases.
         */
        confirmDeleteCategory: function (category) {
            var me = this,
                service = this.instance.getService(),
                defaultCategory = service.getDefaultCategory(),
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                deleteBtn;

            dialog.makeModal();

            if (defaultCategory.getId() === category.getId()) {
                // cannot delete default category
                var okBtn = dialog.createCloseButton(me.loc('buttons.ok'));
                dialog.show(me.loc('notification.error.title'), me.loc('notification.error.deleteDefault'), [okBtn]);
                return;
            }
            var places = service.getPlacesInCategory(category.getId()),
                buttons = [],
                cancelBtn = dialog.createCloseButton(me.loc('buttons.cancel'));
            buttons.push(cancelBtn);

            var content = '';
            if (places.length > 0) {
                deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                deleteBtn.setTitle(me.loc('buttons.deleteCategoryAndPlaces'));
                deleteBtn.setHandler(function () {
                    dialog.close();
                    // delete category and each place in it
                    me._deleteCategory(category, false);
                });
                buttons.push(deleteBtn);

                var moveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                moveBtn.setTitle(me.loc('buttons.movePlaces'));
                moveBtn.addClass('primary');
                moveBtn.setHandler(function () {
                    dialog.close();
                    // move the places in the category to default category
                    me._deleteCategory(category, true);
                });
                buttons.push(moveBtn);
                var locParams = [category.getName(), places.length, defaultCategory.getName()];
                content = me.loc('notification.categoryDelete.deleteConfirmMove', locParams);
            } else {

                deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                deleteBtn.setTitle(me.loc('buttons.deleteCategory'));
                deleteBtn.addClass('primary');
                buttons.push(deleteBtn);
                deleteBtn.setHandler(function () {
                    dialog.close();
                    // delete category and each place in it (none since there aren't any places there')
                    me._deleteCategory(category, false);
                });

                content = me.loc('notification.categoryDelete.deleteConfirm', [category.getName()]);
            }

            dialog.show(me.loc('notification.categoryDelete.title'), content, buttons);
        },

        /**
         * @method _deleteCategory
         * Internal method start actual category delete after confirm
         * @private
         */
        _deleteCategory: function (category, movePlaces) {
            var me = this,
                catId = category.getId();
            // wrap callback to get it into the scope we want
            var callBackWrapper = function (success) {
                me._deleteCategoryCallback(success, movePlaces, catId);
            };
            var service = this.instance.getService();
            service.deleteCategory(catId, movePlaces, callBackWrapper);
        },
        /**
         * @method _deleteCategoryCallback
         * Internal method to handle server response for category delete
         * @private
         */
        _deleteCategoryCallback: function (success, movePlaces) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                service = this.instance.getService(),
                me = this;
            if (success) {
                if (movePlaces) {
                    // places moved to default category -> update it
                    var defCat = service.getDefaultCategory(),
                        layerId = this._getMapLayerId(defCat.getId()),
                        request = this.instance.sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')(layerId, true);
                    this.instance.sandbox.request(this, request);
                }
                // NOTE OK
                dialog.show(me.loc('notification.categoryDelete.title'), me.loc('notification.categoryDelete.deleted'));
                dialog.fadeout();
            } else {
                // error handling
                var okBtn = dialog.createCloseButton(me.loc('buttons.ok'));
                dialog.show(me.loc('notification.error.title'), me.loc('notification.error.deleteCategory'), [okBtn]);
            }
        },
        confirmPublishCategory: function (category, makePublic) {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                service = this.instance.getService(),
                buttons = [],
                msg,
                cancelBtn = dialog.createCloseButton(me.loc('buttons.cancel'));
            buttons.push(cancelBtn);

            var operationalBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            operationalBtn.addClass('primary');
            operationalBtn.setHandler(function () {
                service.publishCategory(category.getId(), makePublic, function (wasSuccess) {
                    me._handlePublishCategory(category, makePublic, wasSuccess);
                });
                dialog.close();
            });
            buttons.push(operationalBtn);
            var locParams = [category.getName()];

            if (makePublic) {
                operationalBtn.setTitle(me.loc('buttons.changeToPublic'));
                msg = me.loc('notification.categoryToPublic.message', locParams);
                dialog.show(me.loc('notification.categoryToPublic.title'), msg, buttons);
            } else {
                operationalBtn.setTitle(me.loc('buttons.changeToPrivate'));
                msg = me.loc('notification.categoryToPrivate.message', locParams);
                dialog.show(me.loc('notification.categoryToPrivate.title'), msg, buttons);
            }
        },

        _handlePublishCategory: function (category, makePublic, wasSuccess) {
            var me = this;
            if (!wasSuccess) {
                this._showMessage(me.loc('notification.error.title'), me.loc('notification.error.generic'));
                return;
            }
            var sandbox = this.instance.sandbox;
            // check map layers for categorychanges
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                layerId = this._getMapLayerId(category.getId()),
                mapLayer = mapLayerService.findMapLayer(layerId);
            if (!mapLayer) {
                // maplayer not found, this should not be possible
                this._showMessage(me.loc('notification.error.title'), me.loc('notification.error.generic'));
                return;
            }
            if (makePublic) {
                mapLayer.addPermission('publish', 'publication_permission_ok');
            } else {
                mapLayer.addPermission('publish', 'no_publication_permission');
            }
            // send an event to notify other bundles of updated permissions
            var evt = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
            sandbox.notifyAll(evt);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
