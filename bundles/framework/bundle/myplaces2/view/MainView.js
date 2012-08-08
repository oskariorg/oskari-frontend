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
        
        // register plugin for map (hover tooltip for my places)
        // TODO: start when a myplaces layer is added and stop when last is removed?
        var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;
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
    
    _handleFinishedDrawingEvent : function(event) {
        var me = this;
        var sandbox = this.instance.sandbox;
        var loc = this.instance.getLocalization();
        var center = event.getDrawing().getCentroid();
        var lonlat = {
            lon : center.x,
            lat : center.y
        };
        this.form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.PlaceForm', this.instance);
        var categories = this.instance.getService().getAllCategories();
        
        var content = [{
            html : me.form.getForm(categories),
            actions : {}
        }];
        // cancel button
        content[0].actions[loc.buttons.cancel] = function() {
            me._cleanupPopup();
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
            //me.instance.buttons.sendStopDrawRequest(true);
        }; 
        // save button
        content[0].actions[loc.buttons.save] = function() {
            me._saveForm();
        }; 

        var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, loc.placeform.title, content, lonlat, true);
        sandbox.request(me.getName(), request);
    },
    _validateForm : function(values) {
        var blnOk = true;
        
        if(!values.place.name)
        {
             alert('paikan nimi puuttuu');
             return;
        }
        if(values.category && !values.category.name)
        {
             alert('uuden kategorian nimi puuttuu');
             return;
        }
        /*
         * TODO: validate 
            category.setDotSize(formValues.category.dot.size);
            category.setDotColor(formValues.category.dot.color);
            
            category.setLineWidth(formValues.category.line.size);
            category.setLineColor(formValues.category.line.color);
            
            category.setAreaLineWidth(formValues.category.area.size);
            category.setAreaLineColor(formValues.category.area.lineColor);
            category.setAreaFillColor(formValues.category.area.fillColor);
         */
        return blnOk;
    },
    /**
     * @method _saveForm
     * @private
     * Handles save button on my places form.
     * If a new category has been defined -> saves it and calls _savePlace() 
     * for saving the actual place data after making the new category available.
     */
    _saveForm : function() {
        // form not open, nothing to do
        if(!this.form) {
            return;
        }
        var me = this;
        var formValues = this.form.getValues();
        // validation
        if(!this._validateForm(formValues)) {
            return;
        }
        // validation passed -> go save stuff
        // DEBUG
            //alert('TBD: tallenna: ' + JSON.stringify(formValues));
            //return;
        // /DEBUG
        // new category given -> save it first 
        if(formValues.category) {
            var category = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory');
            category.setName(formValues.category.name);
            
            category.setDotSize(formValues.category.dot.size);
            category.setDotColor(formValues.category.dot.color);
            
            category.setLineWidth(formValues.category.line.size);
            category.setLineColor(formValues.category.line.color);
            
            category.setAreaLineWidth(formValues.category.area.size);
            category.setAreaLineColor(formValues.category.area.lineColor);
            category.setAreaFillColor(formValues.category.area.fillColor);
            
            var serviceCallback = function(blnSuccess, model, blnNew) {
                // blnNew should always be true since we are adding a category
                if(blnSuccess) {
                    // add category as a maplayer to oskari maplayer service
                    // NOTE! added as a map layer to maplayer service through categoryhandler getting an event
                    //me.instance.addLayerToService(model);
                    // save the actual place
                    formValues.place.category = model.getId();
                    me.__savePlace(formValues.place);
                }
                else {
                    alert('ERROR: category save failed! place not saved');
                }
            }
            this.instance.getService().saveCategory(category,serviceCallback);
        }
        // category selected from list -> save place
        else {
            this.__savePlace(formValues.place);
        }
    },
    /**
     * @method __savePlace
     * @private
     * @param {Object} values place properties
     * Handles save place after s
     */
    __savePlace : function(values) {
        // form not open, nothing to do
        if(!values) {
            alert('Error: Nothing to save in __savePlace!');
            return;
        }
        var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
        place.setName(values.name);
        place.setDescription(values.desc);
        place.setCategoryID(values.category);
        // fetch the latest geometry if edited after FinishedDrawingEvent
        place.setGeometry(this.drawPlugin.getDrawing());
        
        var me = this;
        var sandbox = this.instance.sandbox;
        var serviceCallback = function(blnSuccess, model, blnNew) {
            // blnNew should always be true since we are adding a place
            if(blnSuccess) {
                alert('place saved! see personal data/my places');
                me._cleanupPopup();
            }
            else {
                alert('ERROR: Failed! place not saved');
            }
        }
        this.instance.getService().saveMyPlace(place,serviceCallback);
    },
    /**
     * @method cancel
     * Cancels operations:
     * - close popup
     * - destroy form
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
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
