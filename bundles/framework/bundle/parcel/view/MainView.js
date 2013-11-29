/**
 * @class Oskari.mapframework.bundle.parcel.view.MainView
 *
 * Handles events related to the tool selections.
 * Also, starts the saving flow for the feature data when 'Parcel.SaveDrawingEvent' is received.
 * If saving flow is started, this view shows the save form before continuing to the WFST operation.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.view.MainView",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.popupId = 'parcelForm';
    this.form = undefined;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'ParcelMainView';
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.instance.sandbox;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;

        var sandbox = this.instance.sandbox;
        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }

        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

        // register plugin for map (drawing for parcels)
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.plugin.DrawPlugin', this.instance);
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
    },
    /**
     * @method update
     * implements Module protocol update method
     */
    stop : function() {
        var sandbox = this.instance.sandbox;
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
        sandbox.unregister(this);
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
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
    eventHandlers : {
        /**
         * @method Toolbar.ToolSelectedEvent
         * User changed tool -> cancel parcel actions
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'Toolbar.ToolSelectedEvent' : function(event) {
            // changed tool
            this._cleanupPopup();
        },
        /**
         * @method Parcel.SaveDrawingEvent
         * Shows the save form.
         * @param {Oskari.mapframework.bundle.parcel.event.SaveDrawingEvent} event
         */
        'Parcel.SaveDrawingEvent' : function(event) {
            this._handleFinishedDrawingEvent(event);
        }
    },
    /**
     * @method _handleFinishedDrawingEvent
     * @private
     * Shows the saving form.
     * @param {Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent} event
     */
    _handleFinishedDrawingEvent : function(event) {
        var center = event.getDrawing().geometry.getCentroid();
        var lonlat = {
            lon : center.x,
            lat : center.y
        };
        this.showPlaceForm(lonlat);
    },
    /**
     * @method showPlaceForm
     * Displays a form popup on given location. Prepopulates the form if place is given
     * @param {OpenLayers.LonLat} location location to point with the popup
     */
    showPlaceForm : function(location) {
        var me = this;
        var sandbox = this.instance.sandbox;
        sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        var loc = this.instance.getLocalization();
        this.form = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.view.PlaceForm', this.instance);

        // Get default value from the feature.
        var defaultValues = {
            place : {}
        };
        var feature = this.drawPlugin.getDrawing();
        if (feature) {
            defaultValues.place.area = this.drawPlugin.getParcelGeometry().getArea().toFixed(0);
            if (feature.attributes) {
                defaultValues.place.name = feature.attributes.name+'-M';
                defaultValues.place.parent_property_id = feature.attributes.name;
                defaultValues.place.parent_property_quality = feature.attributes.quality;
            }
        }
        // Set the default values for the form.
        this.form.setValues(defaultValues);

        var content = [{
            html : me.form.getForm(),
            useButtons : true,
            primaryButton : loc.buttons.save,
            actions : {}
        }];
        // cancel button
        content[0].actions[loc.buttons.cancel] = function() {
            me._cleanupPopup();
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
        };
        // print button
        content[0].actions[loc.buttons.print] = function() {
            me._printForm();
        };
        // save button
        content[0].actions[loc.buttons.save] = function() {
            me._saveForm();
        };

        var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, loc.placeform.title, content, location, true);
        sandbox.request(me.getName(), request);
    },
    /**
     * @method _validateForm
     * Validates form data, returns an object array if any errors.
     * Error objects have field and error properties ({field : 'name', error: 'Name missing'}).
     * @private
     * @param {Object} values form values as returned by Oskari.mapframework.bundle.parcel.view.PlaceForm.getValues()
     * @return {Object[]}
     */
    _validateForm : function(values) {
        var errors = [];
        var loc = this.instance.getLocalization('validation');
        if (!values.place.name) {
            errors.push({
                name : 'name',
                error : loc.placeName
            });
        }
        return errors;
    },
    /**
     * @method __showValidationErrorMessage
     * @private
     * @param {Object[]} errors Error objects have field and error properties ({field : 'name', error: 'Name missing'}).
     */
    _showValidationErrorMessage : function(errors) {
        var loc = this.instance.getLocalization();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = dialog.createCloseButton(loc.buttons.ok);
        var content = jQuery('<ul></ul>');
        for (var i = 0; i < errors.length; ++i) {
            var row = jQuery('<li></li>');
            row.append(errors[i]['error'])
            content.append(row);
        }
        dialog.show(loc.validation.title, content, [okBtn]);
    },
    /**
     * @method _saveForm
     * @private
     * Handles save button on parcels form.
     */
    _saveForm : function() {
        // form not open, nothing to do
        if (!this.form) {
            return;
        }
        var me = this;
        var formValues = this.form.getValues();
        // validation
        var errors = this._validateForm(formValues);
        if (errors.length != 0) {
            this._showValidationErrorMessage(errors);
            return;
        }
        // validation passed -> go save stuff
        this.__savePlace(formValues.place);
    },
    /**
     * @method _printForm
     * @private
     * Handles print button on parcels form.
     */
    _printForm : function() {
    // form not open, nothing to do
    if (!this.form) {
        return;
    }
    var me = this;
    var formValues = this.form.getValues();
    // validation
    var errors = this._validateForm(formValues);
    if (errors.length != 0) {
        this._showValidationErrorMessage(errors);
        return;
    }
    // validation passed -> go save stuff
    this.__printPlace(formValues.place);
},
    /**
     * @method __printPlace
     * Handles print place.
     * @private
     * @param {Object} values place properties
     */
    __printPlace : function(values) {
        var me = this;
        // form not open, nothing to do
        if (!values) {
            // should not happen
            var loc = me.instance.getLocalization('notification')['error'];
            me.instance.showMessage(loc.title, loc.savePlace);
            return;
        }

        // Callback handles the end of the asynchronous operation.
        var serviceCallback = function(blnSuccess) {
            if (blnSuccess) {
                me._cleanupPopup();
            }
        }
        var name = values ? values.name : undefined;
        var description = values ? values.desc : undefined;
        this.instance.getService().printPlace(this.drawPlugin.getDrawing(), this.drawPlugin.getFeatureType(), name, description, serviceCallback);
    },
    /**
     * @method __savePlace
     * Handles save place.
     * @private
     * @param {Object} values place properties
     */
    __savePlace : function(values) {
        var me = this;
        // form not open, nothing to do
        if (!values) {
            // should not happen
            var loc = me.instance.getLocalization('notification')['error'];
            me.instance.showMessage(loc.title, loc.savePlace);
            return;
        }
        // Callback handles the end of the asynchronous operation.
        var serviceCallback = function(blnSuccess, model, blnNew) {
            if (blnSuccess) {
                me._cleanupPopup();
            } else {
                // blnNew should always be true since we are adding a preparcel
                if (blnNew) {
                    me.instance.showMessage('Error in inserting preparcel');
                } else {
                    me.instance.showMessage('Error in modifying preparcel');
                }
            }
        }
        this.instance.getService().savePlace(me.drawPlugin, values, serviceCallback);
    },

    /**
     * @method _loadPreParcel
     * Handles preparcel loading.
     * @private
     */
    _loadPreParcel : function() {
        var me = this;
        // Callback handles the end of the asynchronous operation.
        var serviceCallback = function(blnSuccess, model) {
            if (blnSuccess) {
                me._cleanupPopup();
            } else {
                me.instance.showMessage('Error in loading preparcel');
            }
        };
        this.instance.getService().loadPreParcel(me.drawPlugin, serviceCallback);
    },

    /**
     * @method _loadPreParcelData
     * Handles geometry data of place loading.
     * @param {String} parcel_id parcel identification
     * @private
     */
    _loadPreParcelData : function(parcel_id) {
        var me = this;
        // Callback handles the end of the asynchronous operation.
        var serviceCallback = function(blnSuccess, model) {
            if (blnSuccess) {
                me._cleanupPopup();
            } else {
                me.instance.showMessage('Error in loading preparcel');
            }
        };
        this.instance.getService().loadPreParcelData(parcel_id, me.drawPlugin, serviceCallback);
    },

    /**
     * @method _cleanupPopup
     * Cancels operations:
     * - close popup
     * - destroy form
     * @private
     */
    _cleanupPopup : function() {
        // form not open, nothing to do
        if (!this.form) {
            return;
        }
        var sandbox = this.instance.sandbox;
        var request = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
        sandbox.request(this, request);
        this.form.destroy();
        this.form = undefined;
        sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
