/**
 * @class Oskari.mapframework.bundle.parcel.ParcelBundleInstance
 * 
 * Registers and starts the 
 * Oskari.mapframework.bundle.parcel.plugin.CoordinatesPlugin plugin for main map.
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
    __name : 'ParcelMainView',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
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
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
        
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        
        // register plugin for map (drawing for parcels)
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.plugin.DrawPlugin');
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
        for(p in this.eventHandlers) {
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
        if(!handler) {
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
         * @method Parcel.FinishedDrawingEvent
         * @param {Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent} event
         */
        'Parcel.FinishedDrawingEvent' : function(event) {
            this._handleFinishedDrawingEvent(event);
        }
    },
    /**
     * @method _handleFinishedDrawingEvent
     * Handles custom event when drawing is finished
     * @private
     * @param {Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent} event
     */
    _handleFinishedDrawingEvent : function(event) {
        var center = event.getDrawing().getCentroid();
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
     * @param {Oskari.mapframework.bundle.parcel.model.Parcel} place prepoluate form with place data (optional)
     */
    showPlaceForm : function(location, place) {
        var me = this;
        var sandbox = this.instance.sandbox;
        sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        var loc = this.instance.getLocalization();
        this.form = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.view.PlaceForm', this.instance);
        if(place) {
            var param = {
                place : {
                    id: place.getId(),
                    name : place.getName(),
                    desc : place.getDescription()
                }
            };
            this.form.setValues(param);
        }
        
        var content = [{
            useButtons: true,
            primaryButton: loc.buttons.save,
            actions : {}
        }];
        // cancel button
        content[0].actions[loc.buttons.cancel] = function() {
            me._cleanupPopup();
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
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
        if(!values.place.name)
        {
            errors.push({name : 'name' , error: loc.placeName});
        }
        return errors;
    },
    _showValidationErrorMessage : function(errors) {
        var loc = this.instance.getLocalization();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = dialog.createCloseButton(loc.buttons.ok);
    	var content = jQuery('<ul></ul>');
    	for(var i = 0 ; i < errors.length; ++i) {
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
        if(!this.form) {
            return;
        }
        var me = this;
        var formValues = this.form.getValues();
        // validation
        var errors = this._validateForm(formValues);
        if(errors.length != 0) {
            this._showValidationErrorMessage(errors);
            return;
        }
        // validation passed -> go save stuff
        this.__savePlace(formValues.place);
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
        if(!values) {
            // should not happen
            var loc = me.instance.getLocalization('notification')['error'];
    		me.instance.showMessage(loc.title, loc.savePlace);
            return;
        }
        var place = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.model.Parcel');
        if(values.id) {
            place = this.instance.getService().findParcel(values.id);
        }
        place.setId(values.id);
        place.setName(values.name);
        place.setDescription(values.desc);
        // fetch the latest geometry if edited after FinishedDrawingEvent
        place.setGeometry(this.drawPlugin.getDrawing());
        
        var sandbox = this.instance.sandbox;
        var serviceCallback = function(blnSuccess, model, blnNew) {
            if(blnSuccess) {
                // add map layer to map (we could check if its already there but core will handle that)
				var requestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
                var updateRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')

                var request = requestBuilder(layerId, true);
                sandbox.request(me, request);

                if(!blnNew) {
                    // refresh map layer on map -> send update request
                    var updateRequest = updateRequestBuilder(layerId, true);
                    sandbox.request(me, updateRequest);
                } else {
                    var updateRequest = updateRequestBuilder(layerId, true);
                    sandbox.request(me, updateRequest);                	
                }
                
                me._cleanupPopup();

                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var loc = me.instance.getLocalization('notification').placeAdded;
                dialog.show(loc.title, loc.message);
                dialog.fadeout();
                // remove drawing
                me.drawPlugin.stopDrawing();
                me.drawPlugin.clearDrawing();
            }
            else {
                var loc = me.instance.getLocalization('notification')['error'];
        		me.instance.showMessage(loc.title, loc.savePlace);
            }
        }
        this.instance.getService().saveParcel(place,serviceCallback);
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
        if(!this.form) {
            return;
        }
        var sandbox = this.instance.sandbox;
        var request = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
        sandbox.request(this, request);
        this.form.destroy();
        this.form = undefined;
        sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
        this.instance.enableGfi(true);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
