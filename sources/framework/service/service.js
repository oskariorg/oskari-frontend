/**
 * Service superclass
 */
Oskari.clazz.define('Oskari.mapframework.service.Service', 

function() {
    throw "mapframework.service.Service should not be used";
}, {
    getName : function() {
        throw "Running default implementation of Service.getName(). implement your own!";
    }
});
