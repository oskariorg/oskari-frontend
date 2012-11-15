/**
 * @class Oskari.framework.event.ToolSelectedEvent
 * @deprecated Use Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent instead
 */
Oskari.clazz.define(
    'Oskari.mapframework.event.ToolSelectedEvent', 
    function(toolId) {        
        this._toolId = toolId;
        this._origin = null;
}, {
    __name : "ToolSelectedEvent",
    getName : function() {
        return this.__name;
    },
    getToolId : function() {
        return this._toolId;
    },
    setToolId : function(toolId) {
        this._toolId = toolId;
    },
    getOrigin : function() {
        return this._origin;
    },
    setOrigin : function(origin) {
        this._origin = origin;
    },
    getNamespace : function() {
        if (this._toolId.indexOf('.') == -1) {
            return '';
        }
        // This should basically be the this._name of the sender
        return this._toolId.substring(0, this._toolId.lastIndexOf('.'));
    },
    getToolName : function() {
        if (this._toolId.indexOf('.') == -1) {
            return this._toolId;
        }
        return this._toolId.substring(this._toolId.lastIndexOf('.'));
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
