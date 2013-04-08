/**
 * @class Oskari.mapframework.bundle.parcelselector.view.ParcelsTab
 *
 * Tab shows a view that asks for the parcel ID from the user.
 * When user selects the parcel, the feature can be requested for by pressing a button.
 * Then, an event is sent to inform other bundles about the request and the selector is closed.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab",

/**
 * @method create Called automatically on construction.
 * @static
 * @param instance {Oskari.mapframework.bundle.parcelselector.ParcelSelectorInstance} Instance of the bundle.
 * @param title {String} Title for the tab view.
 * @param selectedEventName {String} Name of the event that is sent when user requests the parcel.
 */
function(instance, title, selectedEventName) {
    this.instance = instance;
    this.title = title;
    this.selectedEventName = selectedEventName;
    this._createUI();
}, {
    /**
     * @method getTabPanel
     * @return {Oskari.userinterface.component.TabPanel} Tab panel contains the view.
     */
    getTabPanel : function() {
        return this.tabPanel;
    },
    /**
     * @method _createUI
     * @private
     * Creates the tab view that is shown for the user.
     * The view contains filter field for the fid and button to start the request for the feature.
     */
    _createUI : function() {
        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);
        this.tabPanel.getContainer().append(this._getFilterField().getField());
        this._getActionButton().insertTo(this.tabPanel.getContainer());
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
    _startAction : function() {
        var input = this._getFilterField().getValue().trim();
        if (!input) {
            // Show error message about illegal input.
            this.instance.showMessage(this.instance.getLocalization('title'), this.instance.getLocalization('errors').illegalInput);

        } else if (this.selectedEventName) {
            var selectedEvent = this.instance.sandbox.getEventBuilder(this.selectedEventName)(input);
            // Start the flow by sending the event.
            this.instance.sandbox.notifyAll(selectedEvent);
            // Close the flyout.
            this.instance.getSandbox().postRequestByName("userinterface.UpdateExtensionRequest", [this.instance, "close"]);
        }
    }
});
