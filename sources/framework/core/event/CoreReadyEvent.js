Oskari.clazz.define(
    'Oskari.mapframework.event.CoreReadyEvent', 
    function(lonlat, mouseX, mouseY) {
}, {
    __name : "CoreReadyEvent",
    getName : function() {
        return this.__name;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
