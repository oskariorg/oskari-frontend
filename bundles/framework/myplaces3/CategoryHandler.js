import ReactDOM from 'react-dom';
import React from 'react';
import { Button } from 'oskari-ui';
// import { VectorStyleModal } from 'oskari-ui/components/VectorStyle';
import { MyPlacesStyleForm } from './MyPlacesStyleForm';

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
        this.sandbox = instance.sandbox;
        this.metaType = 'MYPLACES';
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.log = Oskari.log('Oskari.mapframework.bundle.myplaces3.CategoryHandler');
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
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
            var sandbox = this.sandbox;

            if (!Oskari.user().isLoggedIn()) {
                // guest users don't need this
                return;
            }
            sandbox.register(this);
            this.instance.getService().loadLayers(this.addLayersToService.bind(this));
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
        getAllCategories: function () {
            return this.mapLayerService.getAllLayersByMetaType(this.metaType)
                .map(layer => this._parseLayerToCategory(layer))
                .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
        },
        getDefaultCategory: function () {
            const layer = this.mapLayerService.getAllLayersByMetaType(this.metaType)
                .find(l => l.getOptions().isDefault === true);
            if (!layer) {
                this.log.error('Could not find default category');
                return;
            }
            return this._parseLayerToCategory(layer);
        },
        getCategory: function (categoryId) {
            const layer = this.mapLayerService.findMapLayer(this.getMapLayerId(categoryId));
            if (!layer) {
                this.log.error('Could not find layer. Category id: ' + categoryId);
                return;
            }
            return this._parseLayerToCategory(layer);
        },
        _parseLayerToCategory: function (layer) {
            const layerId = layer.getId();
            // has only one style default for now
            const { featureStyle } = layer.getCurrentStyleDef();
            return {
                categoryId: this.parseCategoryId(layerId),
                layerId,
                // TODO: check if we need to sanitize name here or somewhere down the line
                name: layer.getName(),
                isDefault: !!layer.getOptions().isDefault,
                style: featureStyle || {}
            };
        },
        parseCategoryId: function (layerId) {
            if (typeof layerId === 'string') {
                return Number.parseInt(layerId.substring(layerId.indexOf('_') + 1));
            }
            return layerId;
        },
        getMapLayerId: function (categoryId) {
            return this.instance.idPrefix + '_' + categoryId;
        },
        // Notify other components to update categories data
        _notifyUpdate: function () {
            this.sandbox.notifyAll(Oskari.eventBuilder('MyPlaces.MyPlacesChangedEvent')());
        },
        /**
         * @method addLayerToMap
         * Adds the my places map layer to selected if it is not there already
         */
        addLayerToMap: function (categoryId) {
            var layerId = this.getMapLayerId(categoryId);
            var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                var request = Oskari.requestBuilder('AddMapLayerRequest')(layerId, true);
                this.sandbox.request(this.getName(), request);
            }
        },
        // for initial load layers
        addLayersToService: function (layers = []) {
            layers.forEach(layerJson => {
                this.addLayerToService(layerJson, true);
            });
            if (layers.length > 0) {
                const event = Oskari.eventBuilder('MapLayerEvent')(null, 'add'); // null as id triggers mass update
                this.sandbox.notifyAll(event);
            }
            this._notifyUpdate();
        },
        /**
         * @method addLayerToService
         * Adds the my places map layer service
         */
        addLayerToService: function (layerJson, skipEvent) {
            // add maplayer to Oskari
            const service = this.mapLayerService;
            var layer = service.createMapLayer(layerJson);
            service.addLayer(layer, skipEvent);
            if (!skipEvent) {
                this._notifyUpdate();
            }
            return layer;
        },
        updateLayer: function (layerJson) {
            const { id, name, options } = layerJson;
            const layer = this.mapLayerService.findMapLayer(id);
            if (!layer) {
                this.log.warn('tried to update layer which does not exist, id: ' + id);
                return;
            }
            layer.setName(name);
            layer.setOptions(options);
            const evt = Oskari.eventBuilder('MapLayerEvent')(id, 'update');
            this.sandbox.notifyAll(evt);
            if (this.sandbox.isLayerAlreadySelected(id)) {
                // update layer on map
                this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
                this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [id]);
            }
            this._notifyUpdate();
        },
        refreshLayerIfSelected: function (categoryId) {
            const id = this.getMapLayerId(categoryId);
            if (this.sandbox.isLayerAlreadySelected(id)) {
                // update layer on map
                this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
                this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [id]);
            }
        },
        removeLayer: function (categoryId) {
            const layerId = this.getMapLayerId(categoryId);
            this.mapLayerService.removeLayer(layerId);
            this._notifyUpdate();
        },
        editCategory: function (categoryId) {
            var me = this;
            const values = this.getCategory(categoryId);
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (!values) {
                dialog.show(me.loc('notification.error.title'), me.loc('notification.error.generic'), [dialog.createCloseButton()]);
                return;
            }
            var form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.view.CategoryForm', me.instance);
            this.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            var buttons = [];
            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc('buttons.save'));
            saveBtn.addClass('primary');
            saveBtn.setHandler(function () {
                const formValues = form.getValues();
                if (formValues.errors) {
                    me.showValidationErrorMessage(formValues.errors);
                    return;
                }
                me.saveCategory({ ...values, ...formValues });
                dialog.close();
                me.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc('buttons.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
                me.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            buttons.push(cancelBtn);
            buttons.push(saveBtn);
            form.getForm(values);
            // dialog.show(me.loc('categoryform.edit.title'), form.getForm(values), buttons);
            // dialog.moveTo('div.personaldata ul li select', 'right');
            // bind listeners etc. for category form
            // form.start();
        },
        showValidationErrorMessage: function (errors) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('buttons.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            var content = jQuery('<ul></ul>');
            errors.forEach(function (err) {
                var row = jQuery('<li></li>');
                row.append(err.error);
                content.append(row);
            });
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
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.loc('buttons.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, message, [okBtn]);
        },
        saveCategory: function (category, callback) {
            const id = category.categoryId;
            const data = {
                id,
                name: category.name,
                isDefault: category.isDefault,
                style: JSON.stringify(category.style)
            };
            this.instance.getService().commitCategory(data, layerJson => {
                const isNew = !id;
                if (layerJson) {
                    if (isNew) {
                        this.addLayerToService(layerJson);
                    } else {
                        this.updateLayer(layerJson);
                    }
                    if (callback) {
                        callback(this.parseCategoryId(layerJson.id));
                        return;
                    }
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(this.loc('notification.categorySaved.title'), this.loc('notification.categorySaved.message'));
                    dialog.fadeout();
                    return;
                }
                if (isNew) {
                    this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.addCategory'));
                } else {
                    this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.editCategory'));
                }
                if (callback) {
                    callback(null);
                }
            });
        },
        /**
         * @method confirmDeleteCategory
         * Shows a confirmation dialog with buttons to continue.
         * If category has places -> asks if they will be moved to default category or deleted
         * If category is empty -> only has delete and cancel
         * The message will also be different for both cases.
         */
        confirmDeleteCategory: function (categoryId) {
            var me = this;
            var service = this.instance.getService();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var deleteBtn;
            const category = this.getCategory(categoryId);
            if (!category) {
                dialog.show(me.loc('notification.error.title'), me.loc('notification.error.deleteCategory'), [dialog.createCloseButton()]);
                return;
            }
            const { name, isDefault } = category;
            dialog.makeModal();
            if (isDefault) {
                // cannot delete default category
                var okBtn = dialog.createCloseButton(me.loc('buttons.ok'));
                dialog.show(me.loc('notification.error.title'), me.loc('notification.error.deleteDefault'), [okBtn]);
                return;
            }
            var placesCount = service.getPlacesInCategory(categoryId).length;
            var buttons = [dialog.createCloseButton(me.loc('buttons.cancel'))];

            var content = '';
            if (placesCount > 0) {
                const defaultCategory = this.getDefaultCategory();
                deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                deleteBtn.setTitle(me.loc('buttons.deleteCategoryAndPlaces'));
                deleteBtn.setHandler(function () {
                    dialog.close();
                    // delete category and each place in it
                    me._deleteCategory(categoryId);
                });
                buttons.push(deleteBtn);

                var moveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                moveBtn.setTitle(me.loc('buttons.movePlaces'));
                moveBtn.addClass('primary');
                moveBtn.setHandler(function () {
                    dialog.close();
                    // move the places in the category to default category
                    me._deleteCategory(categoryId, defaultCategory.categoryId);
                });
                buttons.push(moveBtn);
                var locParams = [name, placesCount, defaultCategory.name];
                content = me.loc('notification.categoryDelete.deleteConfirmMove', locParams);
            } else {
                deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                deleteBtn.setTitle(me.loc('buttons.deleteCategory'));
                deleteBtn.addClass('primary');
                buttons.push(deleteBtn);
                deleteBtn.setHandler(function () {
                    dialog.close();
                    // delete category and each place in it (none since there aren't any places there')
                    me._deleteCategory(categoryId);
                });

                content = me.loc('notification.categoryDelete.deleteConfirm', [name]);
            }

            dialog.show(me.loc('notification.categoryDelete.title'), content, buttons);
        },

        /**
         * @method _deleteCategory
         * Internal method start actual category delete after confirm
         * @private
         */
        _deleteCategory: function (categoryId, moveToId) {
            var service = this.instance.getService();
            const deleteCategoryCb = success => {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                if (success) {
                    this.removeLayer(categoryId);
                    dialog.show(this.loc('notification.categoryDelete.title'), this.loc('notification.categoryDelete.deleted'));
                    dialog.fadeout();
                } else {
                    const btn = dialog.createCloseButton();
                    dialog.show(this.loc('notification.error.title'), this.loc('notification.error.deleteCategory'), [btn]);
                }
            };
            const placesCb = success => {
                if (success) {
                    service.deleteCategory(categoryId, deleteCategoryCb);
                    return;
                }
                this.log.error('Failed to move/delete places. Skipping delete category');
                deleteCategoryCb(false);
            };
            if (moveToId) {
                service.movePlacesToCategory(categoryId, moveToId, placesCb);
            } else {
                service.deletePlacesInCategory(categoryId, placesCb);
            }
        },
        confirmPublishCategory: function (categoryId, makePublic) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var service = this.instance.getService();
            var buttons = [dialog.createCloseButton(this.loc('buttons.cancel'))];
            const mapLayer = this.mapLayerService.findMapLayer(this.getMapLayerId(categoryId));
            if (!mapLayer) {
                this.log.error('Requested (un)/publish layer which does not exist, category id: ' + categoryId);
                return;
            }
            var operationalBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            operationalBtn.addClass('primary');
            operationalBtn.setHandler(() => {
                service.publishCategory(categoryId, makePublic, (wasSuccess) => {
                    this._handlePublishCategory(mapLayer, makePublic, wasSuccess);
                });
                dialog.close();
            });
            buttons.push(operationalBtn);
            var locParams = [Oskari.util.sanitize(mapLayer.getName())];

            if (makePublic) {
                operationalBtn.setTitle(this.loc('buttons.changeToPublic'));
                dialog.show(this.loc('notification.categoryToPublic.title'),
                    this.loc('notification.categoryToPublic.message', locParams),
                    buttons);
            } else {
                operationalBtn.setTitle(this.loc('buttons.changeToPrivate'));
                dialog.show(this.loc('notification.categoryToPrivate.title'),
                    this.loc('notification.categoryToPrivate.message', locParams),
                    buttons);
            }
        },

        _handlePublishCategory: function (mapLayer, makePublic, wasSuccess) {
            if (!wasSuccess) {
                this._showMessage(this.loc('notification.error.title'), this.loc('notification.error.generic'));
                return;
            }
            mapLayer.addPermission('publish', !!makePublic);
            // send an event to notify other bundles of updated permissions
            var evt = Oskari.eventBuilder('MapLayerEvent')(mapLayer.getId(), 'update');
            this.sandbox.notifyAll(evt);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
