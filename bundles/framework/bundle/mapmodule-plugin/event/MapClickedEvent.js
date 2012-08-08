/**
 * @class Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent',
    function(lonlat, mouseX, mouseY) {
        this._lonlat = lonlat;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
}, {
    __name : "MapClickedEvent",
    getName : function() {
        return this.__name;
    },
    getLonLat : function() {
        return this._lonlat;
    },
    getMouseX : function() {
        return this._mouseX;
    },
    getMouseY : function() {
        return this._mouseY;
    }
}, {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
