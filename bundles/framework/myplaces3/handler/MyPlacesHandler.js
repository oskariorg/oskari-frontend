import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showLayerPopup } from '../MyPlacesLayerForm';

class PlaceHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            places: [],
            categories: [],
            selectedCategory: null
        });
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.categoryHandler = this.instance.getCategoryHandler();
        this.eventHandlers = this.createEventHandlers();
        this.refreshCategoryList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyPlacesHandler';
    }

    openLayerDialog (categoryId, locale, style) {
        if (this.popupControls) {
            // already opened, do nothing
            return;
        }
        // create popup
        const saveLayer = (locale, style) => {
            this.categoryHandler.saveCategory({
                categoryId,
                locale,
                style
            });
            this.popupCleanup();
        };
        this.popupControls = showLayerPopup(locale, style, saveLayer, () => this.popupCleanup());
    }

    populatePlaces () {
        if (this.state.selectedCategory) {
            this.updateState({
                places: this.instance.getService().getPlacesInCategory(this.state.selectedCategory.categoryId)
            });
        }
    }

    refreshCategoryList () {
        const categories = this.categoryHandler.getAllCategories();
        this.updateState({
            categories: categories
        });
    }

    selectCategory (categoryId) {
        const category = this.state.categories.find(c => c.categoryId === categoryId);
        this.updateState({
            selectedCategory: category
        });
        this.instance.getService().loadPlaces(category.categoryId);
    }

    /**
     * @method showPlace
     * Moves the map so the given geometry is visible on viewport. Adds the myplaces
     * layer to map if its not already selected.
     * @param {OpenLayers.Geometry} geometry place geometry to move map to
     * @param {Number} categoryId categoryId for the place so we can add it's layer to map
     */
    showPlace (geometry, categoryId) {
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        const center = mapModule.getCentroidFromGeoJSON(geometry);
        const bounds = mapModule.getBoundsFromGeoJSON(geometry);
        const mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.lon, center.lat, bounds);
        this.sandbox.request(this.instance, mapmoveRequest);
        // add the myplaces layer to map
        this.instance.getCategoryHandler().addLayerToMap(categoryId);
    }

    /**
     * @method editPlace
     * Requests for given place to be opened for editing
     * @param {Object} data grid data object for place
     */
    editPlace (data) {
        // focus on map
        this.showPlace(data.geometry, data.categoryId);
        // request form
        const request = Oskari.requestBuilder('MyPlaces.EditPlaceRequest')(data.id);
        this.sandbox.request(this.instance, request);
    }

    /**
     * @method deletePlace
     * Confirms delete for given place and deletes it if confirmed. Also shows
     * notification about cancel, deleted or error on delete.
     * @param {Object} data grid data object for place
     */
    deletePlace (data) {
        const callback = (isSuccess) => {
            const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (isSuccess) {
                popup.show(this.loc('tab.notification.delete.title'), this.loc('tab.notification.delete.success'));
                popup.fadeout();
            } else {
                popup.show(this.loc('tab.notification.delete.title'), this.loc('tab.notification.delete.error'), [popup.createCloseButton()]);
            }
        };
        this.instance.getService().deleteMyPlace(data.id, callback);
    }

    deleteCategory (categoryId) {
        const deleteReqBuilder = Oskari.requestBuilder('MyPlaces.DeleteCategoryRequest');
        this.sandbox.request(this.instance, deleteReqBuilder(categoryId));
    }

    editCategory (categoryId) {
        const layer = this.categoryHandler.mapLayerService.findMapLayer(this.categoryHandler.getMapLayerId(categoryId));
        const locale = layer.getLocale();
        const style = layer.getCurrentStyle().getFeatureStyle();
        this.openLayerDialog(categoryId, locale, style);
    }

    exportCategory (categoryId) {
        window.location.href = this.instance.getService().getExportCategoryUrl(categoryId);
    }

    getGeometryIcon (geometry) {
        return this.instance.getService().getDrawModeFromGeometry(geometry);
    }

    createEventHandlers () {
        const handlers = {
            'MyPlaces.MyPlacesChangedEvent': event => {
                this.refreshCategoryList();
                this.populatePlaces();
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(PlaceHandler, [
    'showPlace',
    'editPlace',
    'deletePlace',
    'getGeometryIcon',
    'deleteCategory',
    'editCategory',
    'exportCategory',
    'selectCategory',
    'openLayerDialog'
]);

export { wrapped as MyPlacesHandler };
