/**
 * @class Oskari.mapframework.event.Event
 *
 * Superclass for all Oskari events.
 * Consider this as an abstract class and only use it by extending.
 *
 * Events are used to tell the rest of the application that something happened.
 * They can be sent and listened to freely. If you want to tell another part of
 * the application to do something, use an implementation of
 * Oskari.mapframework.request.Request instead.
 *
 * Code snippet example to creating and sending out an event:
 * <pre>
 * // get a builder method for the requested event type.
 * var eventBuilder = sandbox.getEventBuilder('FeaturesAvailableEvent');
 * // create the event with the builder method
 * var event = eventBuilder(...event init params...);
 * // send the request to the application
 * sandbox.notifyAll(event);
 * </pre>
 *
 * Code for listening to events in Oskari.mapframework.module.Module implementations:
 * <pre>
 *  // module init
 *  init: function(sandbox) {
 *       // register for listening events in module init
 *       for(var p in this.eventHandlers ) {
 *           sandbox.registerForEventByName(this, p);
 *       }
 *  },
 *  // declare eventhandlers for the module
 *  eventHandlers : {
 *       'FeaturesAvailableEvent' : function(event) {
 *           alert('I got a ' + event.getName());
 *      }
 *  },
 *  // interface method to handle any events if they have handlers in this module
 *  onEvent : function(event) {
 *       var handler = this.eventHandlers[event.getName()];
 *       if(!handler) {
 *           return;
 *       }
 *       return handler.apply(this, [event]);
 *  }
 * </pre>
 */
Oskari.clazz.define('Oskari.mapframework.event.Event',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */

    function () {
        /** @property{String} _name event name */
        this._name = null;
        /** @property{String} _creator name for the functionality/bundle/module triggering the
         * event */
        this._creator = null;
        throw 'mapframework.event.Event should not be used';
    }, {
        /**
         * @method getName
         * Interface method for all events, should return event name
         * @return {String} event name
         * @throws always override this
         */
        getName: function () {
            throw 'Running default implementation of Event.getName(). implement your own!';
        },
        /**
         * @method setCreator
         * @param {String} creator name for the functionality/bundle/module triggering
         * the event
         */
        setCreator: function (creator) {
            this._creator = creator;
        },
        /**
         * @method getCreator
         * @return {String} name for the functionality/bundle/module triggering the
         * event
         */
        getCreator: function () {
            return this._creator;
        }
    });