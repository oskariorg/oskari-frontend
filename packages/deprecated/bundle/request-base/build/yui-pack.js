/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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
/**
 * @class Oskari.mapframework.request.action.ActionReadyRequest
 * This request marks some ongoing action ready. It can be used to notify e.g.
 * that WMS layer has been loaded
 */
Oskari.clazz.define('Oskari.mapframework.request.action.ActionReadyRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object}
 *            id string of task that has been previously started. See
 * Oskari.mapframework.request.action.ActionStartRequest
 * @param {Object}
 *            wfsPngAction is this action wfsPNG or not
 */
function(id, wfsPngAction) {
    this._creator = null;
    this._id = id;

    /* Is this action for a png tile request */
    this._wfsPngAction = wfsPngAction;

}, {
    /** @static @property __name request name */
    __name : "ActionReadyRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} unique id representing task. See
 	 * Oskari.mapframework.request.action.ActionStartRequest
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method isWfsPngAction
     * @return {Boolean}
     */
    isWfsPngAction : function() {
        return this._wfsPngAction;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//**
 * @class Oskari.mapframework.request.action.ActionStartRequest
 * This request tells that some kind of long running action was started. It can
 * be used to notify e.g. that loading of WMS layer has started
 *
 */
Oskari.clazz.define('Oskari.mapframework.request.action.ActionStartRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object}
 *            id unique string representing task
 * @param {Object}
 *            actionDescription what kind of action is started
 * @param {Object}
 *            wfsPngAction is this wfsPng retrieval or not
 */
function(id, actionDescription, wfsPngAction) {
    this._creator = null;
    this._id = id;

    this._actionName = actionDescription;

    /* Is this action for a wfs png tile? */
    this._wfsPngAction = wfsPngAction;
}, {
    /** @static @property __name request name */
    __name : "ActionStartRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} unique id representing task
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getActionDescription
     * @return {String} description text
     */
    getActionDescription : function() {
        return this._actionName;
    },
    /**
     * @method isWfsPngAction
     * @return {Boolean}
     */
    isWfsPngAction : function() {
        return this._wfsPngAction;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */