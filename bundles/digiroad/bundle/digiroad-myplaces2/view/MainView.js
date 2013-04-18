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
function(instance) {
    this.instance = instance;
    this.popupId = 'myplacesForm';
    this.form = undefined;
}, {
    __name : 'MyPlacesMainView',
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
        
        // register plugin for map (drawing for my places)
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        var restrictionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.TurningRestrictionsPlugin', this.instance.queryUrl);
        mapModule.registerPlugin(restrictionPlugin);
        mapModule.startPlugin(restrictionPlugin);
        this.restrictionPlugin = restrictionPlugin;
        
        // register plugin for map (hover tooltip for my places)
        // TODO: start when a myplaces layer is added and stop when last is removed?
        /*var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;
        */
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
         * User changed tool -> cancel myplaces actions
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'Toolbar.ToolSelectedEvent' : function(event) {
            // changed tool
            this._cleanupPopup();
        },
        /**
         * @method MyPlaces.FinishedDrawingEvent
         * @param {Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent} event
         */
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            this._handleFinishedDrawingEvent(event);
        }
    },
    /**
     * @method _handleFinishedDrawingEvent
     * Handles custom event when drawing is finished
     * @private
     * @param {Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent} event
     */
    _handleFinishedDrawingEvent : function(event) {
        var center = event.getDrawing().getCentroid();
        var drawMode = this._getDrawModeFromGeometry(event.getDrawing());
        console.log("_handleFinishedDrawingEvent: "+drawMode);
        var lonlat = {
            lon : center.x,
            lat : center.y
        };
        this.showPlaceForm(lonlat, null, drawMode);
    },
    /**
     * @method showPlaceForm
     * Displays a form popup on given location. Prepopulates the form if place is given
     * @param {OpenLayers.LonLat} location location to point with the popup
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlace} place prepoluate form with place data (optional)
     * @param {String} drawMode either 'line', 'area' or 'point'. Used to determine the right form to display.
     */
    showPlaceForm : function(location, place, drawMode) {
        var me = this;
        var sandbox = this.instance.sandbox;
        sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        var loc = this.instance.getLocalization();

        if(place && !drawMode) {
            drawMode = me._getDrawModeFromGeometry(place.getGeometry());
        }
        if(drawMode === "line") {
            this.form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.PlaceForm', this.instance);
        } else if(drawMode === "area" || drawMode === "point") {
            this.form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.FeedbackForm', this.instance);
        }
        if(place) {
            var param = {
                place: {
                    id: place.getId()
                }
            };
            if(drawMode === "line") {
                param.place.dyntype = place.getDynType();
                param.place.dynvalue = place.getDynValue();
            } else if(drawMode === "area" || drawMode === "point") {
                param.place.name = place.getName();
                param.place.description = place.getDescription();
            }
            this.form.setValues(param);
        }
        
        var content = [{
            html : me.form.getForm(),
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
            me._saveForm(drawMode);
        }; 

        var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, loc.placeform.title, content, location, true);
        sandbox.request(me.getName(), request);
    },
    /**
     * @method _validateForm
     * Validates form data, returns an object array if any errors. 
     * Error objects have field and error properties ({field : 'name', error: 'Name missing'}). 
     * @private
     * @param {Object} values form values as returned by Oskari.mapframework.bundle.myplaces2.view.PlaceForm.getValues()
     * @return {Object[]} 
     */
    _validateForm : function(values) {
        var errors = [];
        
        var loc = this.instance.getLocalization('validation');
        if(!values.place.dyntype)
        {
            errors.push({name : 'name' , error: loc.dynType});
        }
        if(!values.place.dynvalue)
        {
            errors.push({name : 'name' , error: loc.dynValue});
        }
        return errors;
    },
    /**
     * @method _validateFeedbackForm
     * Validates feedback form data, returns an object array if any errors. 
     * Error objects have field and error properties ({field : 'name', error: 'Name missing'}). 
     * @private
     * @param {Object} values form values as returned by Oskari.mapframework.bundle.myplaces2.view.PlaceForm.getValues()
     * @return {Object[]} 
     */
    _validateFeedbackForm : function(values) {
        var errors = [];
        
        var loc = this.instance.getLocalization('validation');
        if(!values.place.name)
        {
            errors.push({name : 'name' , error: loc.placeName});
        }
        if(!values.place.description)
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
     * Handles save button on my places form.
     * If a new category has been defined -> saves it and calls _savePlace() 
     * for saving the actual place data after making the new category available.
     */
    _saveForm : function(drawMode) {
        // form not open, nothing to do
        if(!this.form) {
            return;
        }
        var me = this;
        var formValues = this.form.getValues();

        // validation
        var errors = null;
        if(drawMode === "line") {
            errors = this._validateForm(formValues);
        } else if(drawMode === "area" || drawMode === "point") {
            errors = this._validateFeedbackForm(formValues);
        }
        if(errors.length != 0) {
            this._showValidationErrorMessage(errors);
            return;
        }
        
        this.__savePlace(formValues.place, drawMode);
    },
    /**
     * @method __savePlace
     * Handles save place after possible category save
     * @private
     * @param {Object} values place properties
     */
    __savePlace : function(values, drawMode) {
        var me = this;
        // form not open, nothing to do
        if(!values) {
            // should not happen
            var loc = me.instance.getLocalization('notification')['error'];
    		me.instance.showMessage(loc.title, loc.savePlace);
            return;
        }
        var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
        if(values.id) {
            place = this.instance.getService().findMyPlace(values.id);
        }
        place.setId(values.id);
        if(drawMode === "line") {
            place.setDynType(values.dyntype);
            place.setDynValue(values.dynvalue);
        } else if(drawMode === "area" || drawMode === "point") {
            place.setName(values.name);
            place.setDescription(values.description);
        }
        // fetch the latest geometry if edited after FinishedDrawingEvent
        place.setGeometry(this.drawPlugin.getDrawing());
        
        var sandbox = this.instance.sandbox;
        var serviceCallback = function(blnSuccess, model, blnNew) {
            if(blnSuccess) {
                // add map layer to map (we could check if its already there but core will handle that)
                var layerId = drawMode === "line" ? "uudet_kohteet" : "palautekuviot";
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
            }
            else {
                var loc = me.instance.getLocalization('notification')['error'];
        		me.instance.showMessage(loc.title, loc.savePlace);
            }
        };
        if(drawMode === "line") {
            this.instance.getService().saveMyPlace(place,serviceCallback);
        } else if(drawMode === "area" || drawMode === "point") {
            this.instance.getService().saveFeedback(place,serviceCallback);
        }
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
    },

    _getDrawModeFromGeometry : function(geometry) {
        var olClass = geometry.CLASS_NAME;
        if('OpenLayers.Geometry.Point' === olClass) {
            return 'point';
        } 
        else if('OpenLayers.Geometry.LineString' === olClass) {
            return 'line';
        }
        else if('OpenLayers.Geometry.Polygon' === olClass){
            return 'area';
        }
        return null;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
