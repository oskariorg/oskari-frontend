import ReactDOM from 'react-dom';
import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { MyPlacesLegacyLayerControls } from './MyPlacesLegacyLayerControls';
import { LOCALE_KEY } from './constants';
import { MyPlacesList } from './MyPlacesList';

/**
 * @class Oskari.mapframework.bundle.myplaces3.MyPlacesPersonalDataTab
 * Renders the "personal data" myplaces tab.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.MyPlacesPersonalDataTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance}
     * instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, LOCALE_KEY);
        this.tabsContainer = undefined;
        this.tabPanels = {};
        this.places = [];
    }, {
        /**
         * @method getName
         * @return {String} name of the component
         * (needed because we fake to be module for listening to
         * events (getName and onEvent methods are needed for this))
         */
        getName: function () {
            return 'MyPlaces3.MyPlaces';
        },
        getTitle: function () {
            return this.loc('tab.title');
        },
        getTabsContainer: function () {
            return this.tabsContainer;
        },
        getContent: function () {
            return this.tabsContainer.ui;
        },
        initContainer: function () {
            const button = Oskari.clazz.create('Oskari.userinterface.component.Button');
            button.setTitle(this.loc('tab.addCategoryFormButton'));
            button.setHandler(() => this.instance.getMyPlacesHandler().openLayerDialog());
            this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabDropdownContainer', this.loc('tab.nocategories'), button);
            this.tabsContainer.addTabChangeListener((prevTab, newTab) => newTab.handleSelection(true));
        },
        addTabContent: function (container) {
            var me = this;
            me.initTabContent();
            container.append(me.tabsContainer.ui);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MyPlaces.MyPlacesChangedEvent
             * Updates the category tabs and grids inside them with current data
             */
            'MyPlaces.MyPlacesChangedEvent': function () {
                const service = this.instance.getService();
                const categories = service.getAllCategories();
                categories.forEach(({ name: rawName, categoryId }) => {
                    const name = Oskari.util.sanitize(rawName);
                    var panel = this.tabPanels[categoryId];
                    if (!panel) {
                        panel = this._createLayerTab(categoryId, name);
                        this.tabsContainer.addPanel(panel);
                        this.tabPanels[categoryId] = panel;
                    } else {
                        // lets set a name for the panel
                        panel.setTitle(name);
                        // update panel graphics
                        this.tabsContainer.updatePanel(panel);
                    }
                    // update places
                    const places = this._populatePlaces(categoryId);
                    panel.getContainer().empty();

                    const modalWrapper = jQuery('<div class="myplaces-modal-wrapper"></div>');
                    panel.getContainer().append(modalWrapper);

                    const values = service.getCategoryForEdit(categoryId);
                    const container = jQuery(modalWrapper)[0];

                    ReactDOM.render(
                        <LocaleProvider value={{ bundleKey: LOCALE_KEY }}>
                            <MyPlacesList
                                data={places}
                                controller={{
                                    deletePlace: (data) => this.deletePlace(data),
                                    editPlace: (data) => this.editPlace(data),
                                    showPlace: (geometry, categoryId) => this.showPlace(geometry, categoryId)
                                }}
                            />
                            <MyPlacesLegacyLayerControls
                                layer={{ ...values, categoryId: categoryId }}
                                controller={{
                                    editCategory: () => this.instance.sandbox.postRequestByName('MyPlaces.EditCategoryRequest', [categoryId]),
                                    deleteCategory: (category) => this.confirmDeleteCategory(category),
                                    exportCategory: (categoryId) => { window.location.href = this.instance.getService().getExportCategoryUrl(categoryId); }
                                }}
                            />
                        </LocaleProvider>
                        ,
                        container
                    );
                });
                this._removeObsoleteCategories(categories);

                // Inform user of some features not being loaded due to
                // the max features restriction
                if (this.instance.conf && this.instance.conf.maxFeatures) {
                    if (this.instance.conf.maxFeatures < this.instance.getService().getPlacesCount()) {
                        this._informOfMaxFeatures(this.getContent());
                    }
                }
            }
        },
        /**
         * @method showPlace
         * Moves the map so the given geometry is visible on viewport. Adds the myplaces
         * layer to map if its not already selected.
         * @param {OpenLayers.Geometry} geometry place geometry to move map to
         * @param {Number} categoryId categoryId for the place so we can add it's layer to map
         */
        showPlace: function (geometry, categoryId) {
            var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
            var center = mapModule.getCentroidFromGeoJSON(geometry);
            var bounds = mapModule.getBoundsFromGeoJSON(geometry);
            var mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.lon, center.lat, bounds);
            this.instance.sandbox.request(this.instance, mapmoveRequest);
            // add the myplaces layer to map
            this.service.addLayerToMap(categoryId);
        },
        /**
         * @method editPlace
         * Requests for given place to be opened for editing
         * @param {Object} data grid data object for place
         */
        editPlace: function (data) {
            this.instance.sandbox.postRequestByName('MyPlaces.EditPlaceRequest', [data.id]);
        },
        /**
         * @method deletePlace
         * Confirms delete for given place and deletes it if confirmed. Also shows
         * notification about cancel, deleted or error on delete.
         * @param {Object} data grid data object for place
         */
        deletePlace: function (data) {
            this.instance.sandbox.postRequestByName('MyPlaces.DeletePlaceRequest', [data.id]);
        },
        confirmDeleteCategory: function (category) {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (!category) {
                dialog.show(null, this.loc('error.deleteCategory'), [dialog.createCloseButton()]);
                return;
            }
            dialog.makeModal();

            const { name, isDefault, categoryId } = category;
            if (isDefault) {
                // cannot delete default category
                dialog.show(null, this.loc('tab.deleteDefault'), [dialog.createCloseButton()]);
                return;
            }
            const service = this.instance.getService();
            const placesCount = service.getPlacesInCategory(categoryId).length;
            const onDelete = (moveToId) => service.deleteCategoryWithPlaces(categoryId, moveToId);

            let content = '';
            let buttons = [];
            if (placesCount > 0) {
                const defaultCategory = service.getAllCategories().find(c => c.isDefault);
                buttons.push(dialog.createCloseButton());

                const deleteBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                deleteBtn.setTitle(this.loc('buttons.deleteCategoryAndPlaces'));
                deleteBtn.setHandler(() => {
                    dialog.close();
                    // delete category and each place in it
                    onDelete();
                });
                buttons.push(deleteBtn);

                const moveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                moveBtn.setTitle(this.loc('buttons.movePlaces'));
                moveBtn.addClass('primary');
                moveBtn.setHandler(function () {
                    dialog.close();
                    // move the places in the category to default category
                    onDelete(defaultCategory.categoryId);
                });
                buttons.push(moveBtn);
                content = this.loc('tab.confirm.deleteConfirmMove', [name, placesCount, defaultCategory.name]);
            } else {
                buttons = dialog.createConfirmButtons(onDelete);
                content = this.loc('tab.confirm.deleteCategory', { name });
            }
            dialog.show(this.loc('notification.categoryDelete'), content, buttons);
        },
        /**
         * @method _createLayerTab
         * Populates given categorys grid
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory} category category to populate
         * @private
         */
        _createLayerTab: function (categoryId, name) {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            panel.setId(categoryId);
            panel.setTitle(name);
            var service = me.instance.getService();
            const selectionHandler = selected => {
                if (!selected) {
                    return;
                }
                if (!service.placesLoaded(categoryId)) {
                    service.loadPlaces(categoryId);
                }
            };
            panel.setSelectionHandler(selectionHandler);

            return panel;
        },
        /**
         * @method _populatePlaces
         * Populates given categorys grid
         * @param {Number} categoryId id for category to populate
         * @returns {Array} Array of places.
         */
        _populatePlaces: function (categoryId) {
            return this.instance.getService().getPlacesInCategory(categoryId);
        },
        /**
         * @method _removeObsoleteCategories
         * Removes tabs for categories that have been removed
         */
        _removeObsoleteCategories: function (categories) {
            const existingIds = categories.map(c => c.categoryId);
            const panelIds = Object.keys(this.tabPanels);
            if (existingIds.length === panelIds.length) {
                return;
            }
            // category has been removed -> clean up the UI
            panelIds.forEach(id => {
                if (existingIds.includes(parseInt(id))) {
                    return;
                }
                const panel = this.tabPanels[id];
                this.tabsContainer.removePanel(panel);
                delete panel.grid;
                delete this.tabPanels[id];
            });
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event an Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /**
         * @method bindEvents
         * Register tab as eventlistener
         */
        bindEvents: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            // faking to be module with getName/onEvent methods
            Object.keys(this.eventHandlers).forEach(function (eventName) {
                sandbox.registerForEventByName(me, eventName);
            });
        },
        /**
         * @method unbindEvents
         * Unregister tab as eventlistener
         */
        unbindEvents: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            // faking to be module with getName/onEvent methods
            Object.keys(this.eventHandlers).forEach(function (eventName) {
                sandbox.unregisterFromEventByName(me, eventName);
            });
        },

        _informOfMaxFeatures: function (container) {
            var alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
            alert.insertTo(container);
            alert.setContent(this.loc('tab.maxFeaturesExceeded'));
        },
        /**
         * Expand bounds, if bounds area is zero
         * @param gbounds Object geometry bounds
         * @returns {*}  expanded bounds or as is
         * @private
         * TODO: maybe config for expansion frame size
         * TODO: doesn't work correctly with degrees
         * if this is used for single point to avoid zooming too close, should use zoomLevel with mapmoverequest
         * or something like VectorLayerPlugin.ol.js -> getBufferedExtent(extent, percentage)
         */
        _fitBounds: function (gbounds) {
            if (gbounds.bottom === gbounds.top && gbounds.left === gbounds.right) {
                gbounds.bottom = gbounds.bottom - 100;
                gbounds.left = gbounds.left - 100;
                gbounds.top = gbounds.top + 100;
                gbounds.right = gbounds.right + 100;
            }

            return gbounds;
        }
    });
