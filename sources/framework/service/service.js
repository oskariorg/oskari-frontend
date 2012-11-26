/**
 * @class Oskari.mapframework.service.Service
 * Superclass for all Oskari services.
 * Consider this as an abstract class and only use it by extending.
 */
Oskari.clazz.define('Oskari.mapframework.service.Service', 
/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    throw "mapframework.service.Service should not be used";
}, {
    /**
     * @method getName
     * @return {String}
     */
    getName : function() {
        throw "Running default implementation of Service.getName(). implement your own!";
    }
});
