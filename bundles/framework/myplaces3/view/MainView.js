/**
 * @class Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.myplaces3.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.view.MainView',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, options) {
        this.instance = instance;
        this.options = options;
        this.popupId = 'myplacesForm3';
        this.form = undefined;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
    }, {
        __name: 'MyPlacesMainView',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.instance.sandbox;
        },

        /**
         * @method getPopupId
         * @return {String} popupid
         */
        getPopupId: function () {
            return this.popupId;
        },

        getForm: function () {
            return this.form;
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
                sandbox = me.instance.sandbox,
                p;

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
        },
        /**
         * @method update
         * implements Module protocol update method
         */
        stop: function () {
            var sandbox = this.instance.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
            sandbox.unregister(this);
        },
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
             * @method Toolbar.ToolSelectedEvent
             * User changed tool -> cancel myplaces actions
             * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                if (!event.getSticky()) {
                    return;
                }
                // changed tool -> clean popup
                this.cleanupPopup();
            },

            'DrawingEvent': function (event) {
                if (event.getId() === this.instance.getName()) {
                    if (this.instance.isEditPlace()) {
                        if (event.getIsFinished()) {
                            this.drawing = event.getGeoJson();
                            this.drawingData = event.getData();
                        } else {
                            // update measurement result
                            this._updateMeasurementResult(event.getData());
                        }
                    } else if (this.instance.isFinishedDrawing()) {
                        this._handleFinishedDrawingEvent(event);
                    }
                }
            }
        },
        /**
         * @method _handleFinishedDrawingEvent
         * Handles custom event when drawing is finished
         * @private
         * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
         */
        _handleFinishedDrawingEvent: function (event) {
            this.drawing = event.getGeoJson();
            if (this.drawing.features && this.drawing.features.length === 0) {
                // no features, user clicks save my place without valid geometry
                this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.savePlace'));
                // should we start new drawing?? and inform user that line should have atleast 2 points and area 3 points
                return;
            }
            // TODO: closestPoint or centroid
            var location = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').getClosestPointFromGeoJSON(this.drawing);
            this.drawingData = event.getData();
            this.showPlaceForm(location);
        },
        _updateMeasurementResult: function (drawingData) {
            if (this.form && drawingData) {
                if (drawingData.shape === 'LineString') {
                    const measurementWithUnit = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(drawingData.length, 'line');
                    const measurementResult = this.loc('placeform.measurement.' + 'line') + ' ' + measurementWithUnit;
                    this.form.setMeasurementResult(measurementResult);
                } else if (drawingData.shape === 'Polygon') {
                    const measurementWithUnit = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule').formatMeasurementResult(drawingData.area, 'area');
                    const measurementResult = this.loc('placeform.measurement.' + 'area') + ' ' + measurementWithUnit;
                    this.form.setMeasurementResult(measurementResult);
                }
            }
        },
        /**
         * @method showPlaceForm
         * Displays a form popup on given location. Prepopulates the form if place is given
         * @param {OpenLayers.LonLat} location location to point with the popup
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} place prepoluate form with place data (optional)
         */
        showPlaceForm: function (location, place) {
            const me = this;
            const sandbox = this.instance.sandbox;
            const categoryHandler = this.instance.getCategoryHandler();
            const categories = categoryHandler.getAllCategories();

            sandbox.postRequestByName('DisableMapKeyboardMovementRequest');

            this.form = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces3.view.PlaceForm',
                this.options,
                categories,
                this.savePlace.bind(this)
            );

            this.form.setDrawing(this.drawing);

            if (place) {
                this.isEditPlace = true;
            // set measurement result from drawing
            } else {
                this._updateMeasurementResult(this.drawingData);
            }

            me.form.showForm(categories, place); // Get form

            // Here need add bindings
            me.form.bindEvents();
        },
        /**
         * Destroys the opened form popup(s) from the screen.
         *
         * @method deletePlaceForm
         */
        deletePlaceForm: function () {
            var sandbox = this.instance.sandbox,
                request;

            if (sandbox.hasHandler('InfoBox.HideInfoBoxRequest')) {
                request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
                sandbox.request(this.getName(), request);
            }
        },
        _showValidationErrorMessage: function (errors) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = dialog.createCloseButton(this.loc('buttons.ok')),
                content = jQuery('<ul></ul>'),
                i,
                row;
            for (i = 0; i < errors.length; ++i) {
                row = jQuery('<li></li>');
                row.append(errors[i].error);
                content.append(row);
            }
            dialog.makeModal();
            dialog.show(this.loc('validation.title'), content, [okBtn]);
        },
        /**
         * @method _saveForm
         * @private
         * Handles save button on my places form.
         * If a new category has been defined -> saves it and calls savePlace()
         * for saving the actual place data after making the new category available.
         */
        _saveForm: function () {
            // form not open, nothing to do
            if (!this.form) {
                return;
            }
            const { place, category, errors } = this.form.getValues();

            // Disable buttons to prevent duplicate jobs
            jQuery('div#myplacesForm_contentDiv').find('input[type="button"]').prop('disabled', true);

            if (errors) {
                this._showValidationErrorMessage(errors);
                // Enable buttons again
                jQuery('div#myplacesForm_contentDiv').find('input[type="button"]').prop('disabled', false);
                return;
            }
            // validation passed -> go save stuff
            // new category given -> save it first
            if (category) {
                var serviceCallback = categoryId => {
                    if (categoryId) {
                        // save the actual place
                        place.setCategoryId(categoryId);
                        this.savePlace(place);
                    } else {
                        this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.addCategory'));
                    }
                };
                this.instance.getCategoryHandler().saveCategory(category, serviceCallback);
            } else {
                // category selected from list -> save place
                this.savePlace(place);
            }
        },
        /**
         * @method savePlace
         * Handles save place after possible category save
         *
         * @param {Oskari.mapframework.bundle.myplaces3.model.MyPlace} place
         */
        savePlace: function (place) {
            const drawing = this.drawing;
            const isMovePlace = false;
            if (drawing) {
                place.setDrawToolsMultiGeometry(drawing);
            }
            var serviceCallback = (blnSuccess, categoryId, oldCategoryId) => {
                if (blnSuccess) {
                    const handler = this.instance.getCategoryHandler();
                    handler.refreshLayerIfSelected(categoryId);
                    handler.addLayerToMap(categoryId);
                    // refresh old layer as well if category changed
                    if (oldCategoryId) {
                        handler.refreshLayerIfSelected(oldCategoryId);
                    }
                    this.cleanupPopup();

                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(this.loc('notification.placeAdded.title'), this.loc('notification.placeAdded.message'));
                    dialog.fadeout();
                    // remove drawing handled in ButtonHandler InfoBox.InfoBoxEvent listener
                } else {
                    this.instance.showMessage(this.loc('notification.error.title'), this.loc('notification.error.savePlace'));
                }
            };

            this.instance.getService().saveMyPlace(place, serviceCallback, isMovePlace);
        },
        cleanupDrawingVariables: function () {
            this.drawing = null;
            this.drawingData = null;
        },
        /**
         * @method cleanupPopup
         * Cancels operations:
         * - close popup
         * - destroy form
         * @private
         */
        cleanupPopup: function () {
            const sandbox = this.instance.sandbox;
            let hideRequest;

            if (sandbox.hasHandler('InfoBox.HideInfoBoxRequest')) {
                hideRequest = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
                sandbox.request(this, hideRequest);
            }

            if (typeof this.form !== 'undefined') {
                this.form.destroy();
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
