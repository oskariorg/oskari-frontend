/**
 * @class Oskari.mapframework.core.RequestHandler
 * A protocol class for registered request handlers. You need to implement a
 * class with this protocol and register it to sandbox for a custom request handler.
 * <pre>
 * var requestHandler = Oskari.clazz.create(
 *          'Oskari.mapframework.bundle.your-bundle.request.YourRequestHandler').
 * sandbox.addRequestHandler('NameForYourRequest', requestHandler);
 * </pre>
 *
 * In the above sandbox is reference to Oskari.Sandbox.
 */
Oskari.clazz.define('Oskari.mapframework.core.RequestHandler',
    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is. Once the handler is reqistered
     * to sandbox for a given request, Oskari framework will call
     * the #handleRequest method when a Oskari.mapframework.module.Module
     * sends a matching request via sandbox.
     * (Module must also be registered to sandbox to be able to send requests).
     */

    function () {}, {
        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.request.Request} request
         *      implementing class for the request protocol
         */
        handleRequest: function (core, request) {
            throw "Implement your own";
        }
    });