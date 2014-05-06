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

        // Start printing (shows 3 forms one by one)
        this._startPrint();
    },
        /**
         * Start print
         *
         */

        _startPrint: function () {
            var me = this;

            // Show info or not
            if (jQuery.cookie('parcelprint_info_seen') !== '1') {
                me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);

            } else {
                this.instance.setParcelPrintMode(true);
            }
        },


    /**
     * @method _validateForm
     * Validates form data, returns an object array if any errors.
     * Error objects have field and error properties ({field : 'name', error: 'Name missing'}).
     * @private
     * @param {Object} values form values as returned by Oskari.mapframework.bundle.parcel.view.ParcelForm1.getValues()
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
        if (!values.place.reporter) {
            errors.push({
                name : 'reporter',
                error : loc.reporter
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
        this.instance.getService().printPlace(this.drawPlugin.getDrawing(), this.drawPlugin.getFeatureType(), values, serviceCallback);
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
            var loc;
            if (blnSuccess) {
                loc = me.instance.getLocalization('notification')['success'];
                me._success2Url(values);
                me.instance.showMessage(loc.savePlace);
                me._cleanupPopup();
            } else {
                loc = me.instance.getLocalization('notification')['error'];
                // blnNew should always be true since we are adding a preparcel
                if (blnNew) {
                    me.instance.showMessage(loc.savePlace);
                } else {
                    me.instance.showMessage(loc.modifyPlace);
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
            var loc = me.instance.getLocalization('notification')['error'];
            if (blnSuccess) {
                me._cleanupPopup();
            } else {
                me.instance.showMessage(loc.loadPlace);
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
            var loc = me.instance.getLocalization('notification')['error'];
            if (blnSuccess) {
                me._cleanupPopup();
            } else {
                me.instance.showMessage(loc.loadPlace);
            }
        };
        this.instance.getService().loadPreParcelData(parcel_id, me.drawPlugin, serviceCallback);
    },
        /**
         * Decode the quality code to locale description
         * @param quality_code  (lahdeaineisto property in KTJ WFS schema)
         * @private
         */
        _decodeQuality : function(quality_code) {
            var codes = this.instance.getLocalization().qualitycodes;
            var quali = codes[quality_code];
            if(!quali) quali = codes['q0'];
            return quali;

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
    },
        _success2Url : function(values) {
            // form not open, nothing to do
            if (!values || !this.instance.conf.successUrl) {
                return;
            }
            var url = this.instance.conf.successUrl;
            if(url.indexOf('?') < 0) url = url + '?';
            else  url = url + '&';

            window.location.assign(this.instance.conf.successUrl + url+'parcel.area='+values.area);
        }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.mapframework.module.Module']
});
