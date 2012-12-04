/**
 * @class Oskari.mapframework.bundle.parcelselector.view.ParcelsTab
 * 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcelselector.view.ParcelsTab",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance, title) {
    this.instance = instance;
    this.title = title;
    this._createUI();
}, {
    getTitle : function() {
        return this.title;
    },
    getTabPanel : function() {
        return this.tabPanel;
    },
    getState : function() {
        var state = {
            tab : this.getTitle(),
            filter : this.filterField.getValue(),
        };
        return state;
    },
    setState : function(state) {
        if(!state) {
            return;
        }
        
        if(!state.filter) {
            this.filterField.setValue(state.filter);
            this.filterLayers(state.filter);
        }
    },
    _createUI : function() {
        
        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);
        
        this.tabPanel.getContainer().append(this.getFilterField().getField());
    },
    getFilterField : function() {
        if(this.filterField) {
            return this.filterField;
        }
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();
        this.filterField = field;
        return field;
    }

});
