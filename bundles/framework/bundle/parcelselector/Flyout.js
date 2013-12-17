/**
 * @class Oskari.mapframework.bundle.parcelselector.Flyout
 *
 * Renders the "parcels" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcelselector.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance}
 *          instance reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.template = null;
    this.container = null;
    this.selectedEventName = "";
    // State is required for closing by command.
    this.state = null;
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.mapframework.bundle.parcelselector.Flyout';
    },
    /**
     * @method setEl
     * @param {Object} el
     * 		reference to the container in browser
     * @param {Number} width
     * 		container size(?) - not used
     * @param {Number} height
     * 		container size(?) - not used
     *
     * Interface method implementation
     */
    setEl : function(el, width, height) {
        this.container = el[0];
        if (!jQuery(this.container).hasClass('parcelselector')) {
            jQuery(this.container).addClass('parcelselector');
        }
    },
    /**
     * @method startPlugin
     *
     * Interface method implementation, assigns tab views that will be used to create the UI.
     */
    startPlugin : function() {
        var loc = this.instance.getLocalization('filter');
        this.template = jQuery('<div class="parcelSearchContainer">' +
        		'<div class="parcelSearchType">'+
                    '<input type="radio" name="parcelSearchType" class="parcelSearchType" id="ParcelSelectedEvent" checked="checked"/>'+
                    '<label for "rbtnParcel" class="parcelSearchType">'+loc.parcel+'</label>'+
                    '<input type="radio" name="parcelSearchType" class="parcelSearchType" id="RegisterUnitSelectedEvent"/>'+
                    '<label for "rbtnParcel" class="parcelSearchType">'+loc.registerUnit+'</label>'+
                '</div>'+
                '<div class="parcelSearchControls">'+
                    '<div class="parcelSearchField">'+
                    '</div>' +
                    '<div class="parcelSearchButton">'+
                    '</div>' +
                '</div>' +
            '</div>');
    },
    /**
     * @method stopPlugin
     *
     * Interface method implementation, does nothing atm
     */
    stopPlugin : function() {
    },
    /**
     * @method setState
     * Interface method implementation, does nothing atm
     * @param {String} state
     *      close/minimize/maximize etc
     */
    setState : function(state) {
        this.state = state;
    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the flyout
     */
    getTitle : function() {
        return this.instance.getLocalization('title');
    },
    /**
     * @method getInstance
     * @return {Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance}
     */
    getInstance : function() {
        return this.instance;
    },
    /**
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi : function() {
        var me = this,
            i,
            tab,
            sandbox = me.instance.getSandbox(),
            cel = jQuery(this.container); // clear container
        cel.empty();

        var parcelContainer = this.template.clone();
        var searchField = parcelContainer.find(".parcelSearchField");
        searchField.append(this._getFilterField().getField());
        var searchButton = parcelContainer.find(".parcelSearchButton");
        this._getActionButton().insertTo(searchButton);

        cel.append(parcelContainer);
        cel.parents("div.oskari-flyout").addClass("parcelselectorBase");;

    },

    /**
     * @method _getActionButton
     * @private
     * @return {Oskari.userinterface.component.Button} Button to start action that sends an event for other bundles.
     */
    _getActionButton : function() {
        if (this.actionButton) {
            return this.actionButton;
        }
        var me = this;
        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        // Make button visually primary button.
        btn.addClass('primary');
        btn.setTitle(this.instance.getLocalization('button'));
        btn.setHandler(function() {
            me._startAction.call(me)
        });
        this.actionButton = btn;
        return btn;
    },
    /**
     * @method _startAction
     * @private
     * Starts the action by sending the event if parcel fid is given correctly.
     * Closes the bundle view if event is sent.
     */
    _startAction : function(input) {
        var userInput = input || this._getFilterField().getValue().trim();
        var selectedEvent;
        this.selectedEventName = this._getSearchType();
        if (!userInput) {
            // Show error message about illegal input.
            this.instance.showMessage(this.instance.getLocalization('title'), this.instance.getLocalization('errors').illegalInput);

        } else if (this.selectedEventName) {
            selectedEvent = this.instance.sandbox.getEventBuilder(this.selectedEventName)(userInput);
            // Start the flow by sending the event.
            this.instance.sandbox.notifyAll(selectedEvent);
            // Close the flyout.
            this.instance.getSandbox().postRequestByName("userinterface.UpdateExtensionRequest", [this.instance, "close"]);
        }
    },
    /**
     * @method _getFilterField
     * @private
     * @return {Oskari.userinterface.component.FormInput} Input text edit box for the fid.
     */
    _getFilterField : function() {
        if (this.filterField) {
            return this.filterField;
        }
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.bindEnterKey(function() {
            me._startAction.call(me)
        });
        field.addClearButton();
        this.filterField = field;
        return field;
    },
    /**
     * @method _getSearchType
     * @private
     * @return {String} Selected search type.
     */
    _getSearchType : function() {
        var selectedVal = "";
        var selected = jQuery("input[type='radio'][name='parcelSearchType']:checked");
        if (selected.length > 0) {
            return "ParcelSelector."+selected.attr("id");
        }
        return "";
    }
},
    {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Flyout']
});
