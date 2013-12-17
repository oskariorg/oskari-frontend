/**
 * @class Oskari.mapframework.request.Request
 *
 * Superclass for all Oskari requests.
 * Consider this as an abstract class and only use it by extending.
 * 
 * Requests are used to tell another part of the application to do something.
 * They can only be sent from registered Oskari.mapframework.module.Module 
 * implementations (see Oskari.mapframework.sandbox.Sandbox.register()). 
 * If you want to tell the rest of the application that something happened, 
 * use an implementation of Oskari.mapframework.event.Event instead.
 * 
 * Code snippet example to creating and sending out a request:
 * <pre>
 * // get a builder method for the requested request type.
 * var requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
 * // create the request with the builder method
 * var request = requestBuilder(longitude, latitude);
 * // send the request to the application
 * sandbox.request('MyModule', request);
 * </pre>
 * 
 * In the above sandbox is reference to Oskari.mapframework.sandbox.Sandbox.
 * 
 * Requests are listened to with classes implementing the 
 * Oskari.mapframework.core.RequestHandler protocol. 
 * There can only be one RequestHandler for a given request. 
 * Also if the core is handling a request 
 * (Oskari.mapframework.core.Core.defaultRequestHandlers) the handler 
 * cannot be overridden at the moment.
 */
Oskari.clazz.define('Oskari.mapframework.request.Request',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    /** @property _creator name for the functionality/bundle/module sending the
     * request */
    this._creator = null;
    throw "mapframework.request.Request should not be used";
}, {
    /**
     * @method getName
     * Interface method for all request, should return request name
     * @return {String} request name
     * @throws always override this
     */
    getName : function() {
        throw "Running default implementation of Request.getName(). implement your own!";
    },
    /**
     * @method setCreator
     * @param {String} creator name for the functionality/bundle/module sending
     * the request
     */
    setCreator : function(creator) {
        this._creator = creator;
    },
    /**
     * @method getCreator
     * @return {String} name for the functionality/bundle/module sending the
     * request
     */
    getCreator : function() {
        return this._creator;
    }
});
