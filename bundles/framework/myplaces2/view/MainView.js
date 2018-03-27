/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.myplaces2.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.MainView",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, options) {
        this.instance = instance;
        this.options = options;
        this.popupId = 'myplacesForm';
        this.form = undefined;
        this.drawPluginId = this.instance.getName();
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces2');
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
        getPopupId: function (){
            return this.popupId;
        },

        getForm: function(){
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

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

            // register plugin for map (drawing for my places)
            var pluginConfig = {
                id: this.drawPluginId,
                multipart: true
            };
            var drawPlugin = Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', pluginConfig);
            mapModule.registerPlugin(drawPlugin);
            mapModule.startPlugin(drawPlugin);
            this.drawPlugin = drawPlugin;
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
                // changed tool
                this.cleanupPopup();
            },
            /**
             * @method DrawPlugin.FinishedDrawingEvent
             * @param {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.FinishedDrawingEvent} event
             */
            'DrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                this._handleFinishedDrawingEvent(event);
            },
            'DrawPlugin.ActiveDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                if (this.form) {
                    this.form.setMeasurementResult(event.getDrawing(), event.getDrawMode());
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
            var center = event.getDrawing().getCentroid(),
                lonlat = {
                    lon: center.x,
                    lat: center.y
                };
            this.showPlaceForm(lonlat);
        },
        /**
         * @method showPlaceForm
         * Displays a form popup on given location. Prepopulates the form if place is given
         * @param {OpenLayers.LonLat} location location to point with the popup
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlace} place prepoluate form with place data (optional)
         */
        showPlaceForm: function (location, place) {
            var me = this,
                layerId,
                sandbox = me.instance.sandbox;

            sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            this.form = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces2.view.PlaceForm',
                this.instance,
                this.options
            );

            var categories = this.instance.getService().getAllCategories();

            if (place) {
                var param = {
                    place: {
                        id: place.getId(),
                        name: place.getName(),
                        link: place.getLink(),
                        imageLink: place.getImageLink(),
                        desc: place.getDescription(),
                        attention_text: place.getAttention_text(),
                        category: place.getCategoryID()
                    }
                };
                this.form.setValues(param);
                layerId = me.instance.getCategoryHandler()._getMapLayerId(place.getCategoryID());
            }

            var drawing = this.drawPlugin.getDrawing();
            if (drawing) {
                if (drawing.CLASS_NAME === 'OpenLayers.Geometry.MultiLineString') {
                    this.form.setMeasurementResult(drawing, 'line');
                } else if (drawing.CLASS_NAME === 'OpenLayers.Geometry.MultiPolygon') {
                    this.form.setMeasurementResult(drawing, 'area');
                }
            }
            var formEl = me.form.getForm(categories),
                content = [{
                    html: formEl,
                    actions: {}
                }];

            if (layerId) {
                content[0].layerId = layerId;
            }

            var actions = [
                {
                    name: me.loc('buttons.cancel'),
                    type: "button",
                    group: 1,
                    action: function () {
                        me.cleanupPopup();
                    }
                }, {
                    name: me.loc('buttons.save'),
                    type: "button",
                    group: 1,
                    action: function () {
                        me._saveForm();
                    }
                }
            ];

            // cancel button
            content[0].actions = actions;

            var options = {
                hidePrevious: true
            };
            var request = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, me.loc('placeform.title'), content, location, options);
            sandbox.request(me.getName(), request);
            // A tad ugly, but for some reason this won't work if we find the input from formEl
            jQuery('input[name=placename]').focus();

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
        /**
         * @method _validateForm
         * Validates form data, returns an object array if any errors.
         * Error objects have field and error properties ({field : 'name', error: 'Name missing'}).
         * @private
         * @param {Object} values form values as returned by Oskari.mapframework.bundle.myplaces2.view.PlaceForm.getValues()
         * @return {Object[]}
         */
        _validateForm: function (values) {
            var me = this,
                errors = [],
                categoryHandler = this.instance.getCategoryHandler();
            if (categoryHandler && categoryHandler.validateCategoryFormValues) {
                errors = categoryHandler.validateCategoryFormValues(values.category);
            }

            if (!values.place.name) {
                errors.push({
                    name: 'name',
                    error: me.loc('validation.placeName')
                });
            } else if (Oskari.util.sanitize(values.place.name) !== values.place.name) {
                errors.push({
                    name: 'name',
                    error: me.loc('validation.placeNameIllegal')
                });
            }
            if (Oskari.util.sanitize(values.place.desc) !== values.place.desc) {
                errors.push({
                    name: 'desc',
                    error: me.loc('validation.descIllegal')
                });
            }
            return errors;
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
         * If a new category has been defined -> saves it and calls _savePlace()
         * for saving the actual place data after making the new category available.
         */
        _saveForm: function () {
            // form not open, nothing to do
            if (!this.form) {
                return;
            }
            var me = this,
                formValues = this.form.getValues();

            // Disable buttons to prevent duplicate jobs
            jQuery('div#myplacesForm_contentDiv').find('input[type="button"]').attr("disabled", "disabled");

            // validation
            var errors = this._validateForm(formValues);
            if (errors.length !== 0) {
                this._showValidationErrorMessage(errors);
                // Enable buttons again
                jQuery('div#myplacesForm_contentDiv').find('input[type="button"]').removeAttr('disabled');
                return;
            }
            // validation passed -> go save stuff
            // new category given -> save it first
            if (formValues.category) {
                var category = this.instance.getCategoryHandler().getCategoryFromFormValues(formValues.category);
                var serviceCallback = function (blnSuccess, model, blnNew) {
                    if (blnSuccess) {
                        // add category as a maplayer to oskari maplayer service
                        // NOTE! added as a map layer to maplayer service through categoryhandler getting an event
                        //me.instance.addLayerToService(model);
                        // save the actual place
                        formValues.place.category = model.getId();
                        me.__savePlace(formValues.place);
                    } else {
                        // blnNew should always be true since we are adding a category
                        if (blnNew) {
                            me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.addCategory'));
                        } else {
                            me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.editCategory'));
                        }
                    }
                };
                this.instance.getService().saveCategory(category, serviceCallback);
            } else {
                // category selected from list -> save place
                this.__savePlace(formValues.place);
            }
        },
        /**
         * @method __savePlace
         * Handles save place after possible category save
         * @private
         * @param {Object} values place properties
         */
        __savePlace: function (values) {
            var me = this;
            // form not open, nothing to do
            if (!values) {
                // should not happen
                me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.savePlace'));
                return;
            }
            var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace'),
                oldCategory = -1;
            if (values.id) {
                place = this.instance.getService().findMyPlace(values.id);
                oldCategory = place.getCategoryID();
            }
            place.setId(values.id);
            place.setName(Oskari.util.sanitize(values.name));
            place.setLink(values.link);
            place.setImageLink(values.imageLink);
            place.setDescription(Oskari.util.sanitize(values.desc));
            place.setAttention_text(Oskari.util.sanitize(values.attention_text));
            place.setCategoryID(values.category);
            // fetch the latest geometry if edited after FinishedDrawingEvent
            place.setGeometry(this.drawPlugin.getDrawing());

            var sandbox = this.instance.sandbox;
            var serviceCallback = function (blnSuccess, model, blnNew) {
                if (blnSuccess) {
                    // add map layer to map (we could check if its already there but core will handle that)
                    var layerId = me.instance.getCategoryHandler()._getMapLayerId(place.getCategoryID()),
                        requestBuilder = Oskari.requestBuilder('AddMapLayerRequest'),
                        updateRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                        updateRequest,
                        request = requestBuilder(layerId, true);
                    sandbox.request(me, request);

                    if (!blnNew) {
                        // refresh map layer on map -> send update request
                        updateRequest = updateRequestBuilder(layerId, true);
                        sandbox.request(me, updateRequest);
                        // refresh old layer as well if category changed
                        if (oldCategory !== place.getCategoryID()) {
                            layerId = me.instance.getCategoryHandler()._getMapLayerId(oldCategory);
                            request = requestBuilder(layerId, true);
                            sandbox.request(me, request);
                        }
                    } else {
                        updateRequest = updateRequestBuilder(layerId, true);
                        sandbox.request(me, updateRequest);
                    }
                    // Update myplaces extra layers
                    var eventBuilder = Oskari.eventBuilder('MapMyPlaces.MyPlacesVisualizationChangeEvent');
                    if (eventBuilder) {
                        var event = eventBuilder(layerId, true);
                        sandbox.notifyAll(event);
                    }

                    me.cleanupPopup();

                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(me.loc('notification.placeAdded.title'), me.loc('notification.placeAdded.message'));
                    dialog.fadeout();
                    // remove drawing handled in ButtonHandler InfoBox.InfoBoxEvent listener
                    //me.drawPlugin.stopDrawing();
                } else {
                    me.instance.showMessage(me.loc('notification.error.title'), me.loc('notification.error.savePlace'));
                }
            };
            this.instance.getService().saveMyPlace(place, serviceCallback);
        },
        /**
         * @method cleanupPopup
         * Cancels operations:
         * - close popup
         * - destroy form
         * @private
         */
        cleanupPopup: function () {
            var sandbox = this.instance.sandbox,
                hideRequest;

            if (sandbox.hasHandler('InfoBox.HideInfoBoxRequest')) {
                hideRequest = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
                sandbox.request(this, hideRequest);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
