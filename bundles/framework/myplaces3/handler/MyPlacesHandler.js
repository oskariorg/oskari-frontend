import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showLayerPopup } from '../MyPlacesLayerForm';
import { showPlacePopup } from '../view/PlaceForm.jsx';

class PlaceHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            places: [],
            categories: [],
            selectedCategoryId: null,
            loading: false
        });
        this.layerControls = null;
        this.placeControls = null;

        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.service = this.instance.getService();
        this.eventHandlers = this.bindEvents();
    };

    getName () {
        return 'MyPlacesHandler';
    }

    bindEvents () {
        this.service.on('place', () => this.populatePlaces());
        this.service.on('category', (addedId) => {
            this.refreshCategoryList(addedId);
            if (this.placeControls) {
                this.placeControls.update(addedId, this.state.categories);
            }
        });
        this.refreshCategoryList();
    }

    layerPopupCleanup () {
        if (this.layerControls) {
            this.layerControls.close();
        }
        this.layerControls = null;
    }

    placePopupCleanup (resetTool = true) {
        if (this.placeControls) {
            this.placeControls.close();
        }
        this.instance.getDrawHandler().stopDrawing();
        this.placeControls = null;
        if (resetTool) {
            // Select default tool
            this.instance.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', []);
        }
    }

    openLayerDialog (categoryId, locale, style) {
        if (this.layerControls) {
            // already opened, do nothing
            return;
        }
        // create popup
        const saveLayer = (locale, style) => {
            this.service.saveCategory({
                categoryId,
                locale,
                style
            });
            this.layerPopupCleanup();
        };
        this.layerControls = showLayerPopup(locale, style, saveLayer, () => this.layerPopupCleanup());
    }

    populatePlaces () {
        let places = [];
        if (this.state.selectedCategoryId) {
            places = this.service.getPlacesInCategory(this.state.selectedCategoryId);
        }
        this.updateState({
            places,
            loading: false
        });
    }

    refreshCategoryList (addedId) {
        this.updateState({
            loading: true
        });
        const categories = this.service.getAllCategories();
        // select added category if given, fallback to first
        let selectedCategoryId = addedId || this.state.selectedCategoryId;
        if (!selectedCategoryId && categories.length) {
            selectedCategoryId = categories[0].categoryId;
        }
        this.service.loadPlaces(selectedCategoryId);
        this.updateState({
            categories,
            selectedCategoryId
        });
    }

    selectCategory (id) {
        const newState = {
            selectedCategoryId: id
        };

        if (this.service.placesLoaded(id)) {
            newState.places = this.service.getPlacesInCategory(id);
        } else {
            newState.loading = true;
            this.service.loadPlaces(id);
        }
        this.updateState(newState);
    }

    /**
     * @method addAndFocus
     * Moves the map so the given geometry is visible on viewport. Adds the myplaces
     * layer to map if its not already selected.
     * @param {MyPlace} place place to move map to
     */
    addLayerAndFocus (place) {
        if (!place) {
            return;
        }
        const geometry = place.getGeometry();
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        const center = mapModule.getCentroidFromGeoJSON(geometry);
        const bounds = mapModule.getBoundsFromGeoJSON(geometry);
        const mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.lon, center.lat, bounds);
        this.sandbox.request(this.instance, mapmoveRequest);
        this.service.addLayerToMap(place.getCategoryId());
    }

    showPlace (id) {
        const place = this.service.findMyPlace(id);
        this.addLayerAndFocus(place);
    }

    addPlace (geojson) {
        if (!geojson) {
            // no features, user clicks save my new place without valid geometry drawn
            Messaging.error(this.loc('error.savePlace'));
            drawHandler.stopDrawing();
            return;
        }
        const place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
        // init category from selected
        place.setCategoryId(this.state.selectedCategoryId);
        this.openPlacePopup(place);
    }

    editPlace (id) {
        const place = this.service.findMyPlace(id);
        if (!place) {
            Messaging.error(this.loc('error.generic'));
            return;
        }
        // focus on map
        this.addLayerAndFocus(place);
        this.openPlacePopup(place);
    }

    openPlacePopup (place) {
        const id = place.getId();
        if (this.placeControls) {
            // already opened
            if (this.placeControls.id === id) {
                this.placeControls.bringToTop();
                return;
            }
            // remove previous popup and drawing
            this.placePopupCleanup();
        }

        if (id) {
            // start modify after possible placePopupCleanup
            this.instance.getDrawHandler().startModify(place.getGeometry());
        }

        const categoryId = place.getCategoryId();
        const { categories } = this.state;

        const controller = {
            onClose: () => this.placePopupCleanup(),
            handleCategoryId: (id) => this.placeControls && this.placeControls.update(id, categories),
            onSave: (values, newCatId) => {
                place.setProperties(values);
                place.setCategoryId(newCatId);
                this.instance.getDrawHandler().setPlaceGeometry(place);
                const oldCategoryId = categoryId && categoryId !== newCatId ? categoryId : null;
                this.service.saveMyPlace(place, oldCategoryId);
                this.placePopupCleanup();
            }
        };

        const values = {
            id,
            ...place.getProperties()
        };

        this.placeControls = showPlacePopup(values, categoryId, categories, controller);
    }

    isPlacePopupActive () {
        return !!this.placeControls;
    }

    /**
     * @method deletePlace
     * Confirms delete for given place and deletes it if confirmed. Also shows
     * notification about cancel, deleted or error on delete.
     * @param {Object} data grid data object for place
     */
    deletePlace (id) {
        const place = this.service.findMyPlace(id);
        this.service.deletePlaces([place]);
    }

    deleteCategory (categoryId, moveToId) {
        // Select category where places is moved, if not given refreshCategoryList will select
        this.updateState({
            loading: true,
            selectedCategoryId: moveToId
        });
        this.service.deleteCategoryWithPlaces(categoryId, moveToId);
    }

    editCategory (categoryId) {
        const { locale, style } = this.service.getCategoryForEdit(categoryId) || {};
        this.openLayerDialog(categoryId, locale, style);
    }

    exportCategory (categoryId) {
        window.location.href = this.service.getExportCategoryUrl(categoryId);
    }
}

const wrapped = controllerMixin(PlaceHandler, [
    'showPlace',
    'editPlace',
    'deletePlace',
    'deleteCategory',
    'editCategory',
    'exportCategory',
    'selectCategory',
    'openLayerDialog'
]);

export { wrapped as MyPlacesHandler };
