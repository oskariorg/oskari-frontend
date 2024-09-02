import './EditPlaceRequest';
import './DeletePlaceRequest';
import './EditCategoryRequest';
import './DeleteCategoryRequest';
import './PublishCategoryRequest';
import { getCategoryId } from '../service/LayerHelper';
/**
 * @class Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler
 * Handles sequests for a saved "my place" or my places categorires to be opened for editing
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     * @param {Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance} instance
     *          reference to my places bundle instance
     */

    function (sandbox, instance) {
        this.sandbox = sandbox;
        this.instance = instance;
        this.log = Oskari.log('Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler');
    }, {
        /**
         * @method handleRequest
         * Shows/hides the maplayer specified in the request in OpenLayers implementation.
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.myplaces3.request.EditPlaceRequest/Oskari.mapframework.bundle.myplaces3.request.EditCategoryRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var sandbox = this.sandbox;
            if (request.getName() === 'MyPlaces.EditPlaceRequest') {
                this._handleEditPlace(sandbox, request);
            } else if (request.getName() === 'MyPlaces.DeletePlaceRequest') {
                this._handleDeletePlace(sandbox, request);
            } else if (request.getName() === 'MyPlaces.EditCategoryRequest') {
                this._handleEditCategory(sandbox, request);
            } else if (request.getName() === 'MyPlaces.DeleteCategoryRequest') {
                this._handleDeleteCategory(sandbox, request);
            } else if (request.getName() === 'MyPlaces.PublishCategoryRequest') {
                this._handlePublishCategory(sandbox, request);
            }
        },
        _handleEditPlace: function (sandbox, request) {
            const id = request.getId();
            this.log.debug('edit requested for place' + id);
            const handler = this.instance.getMyPlacesHandler();
            if (!handler) {
                return;
            }
            handler.editPlace(id);
        },
        _handleDeletePlace: function (sandbox, request) {
            const id = request.getId();
            this.log.debug('delete requested for place ' + id);
            const handler = this.instance.getMyPlacesHandler();
            if (!handler) {
                return;
            }
            handler.deletePlace(id);
        },
        _handleEditCategory: function (sandbox, request) {
            const id = getCategoryId(request.getId());
            this.log.debug('edit requested for category ' + id);
            const handler = this.instance.getMyPlacesHandler();
            if (!handler) {
                return;
            }
            handler.editCategory(id);
        },
        _handleDeleteCategory: function (sandbox, request) {
            const id = request.getId();
            this.log.warn(`Delete requested for category: ${id}. This handler doesn't ask for move places or confirm. Skipping!`);
        },
        _handlePublishCategory: function (sandbox, request) {
            const id = getCategoryId(request.getId());
            this.log.debug('(un/)publish requested for category ' + id);
            const service = this.instance.getService();
            if (!service) {
                return;
            }
            service.publishCategory(id, request.isPublic());
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
