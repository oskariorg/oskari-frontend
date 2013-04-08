/**
 * @class Oskari.mapframework.core.Core
 * 
 * This is the Oskari core. Bundles can register modules and services here for other bundles to reference.
 * Requests and events are forwarded through the core to handlers.
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
Oskari.clazz.define('Oskari.mapframework.core.Core',

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    // Currently selected layers, array of MapLayer objects
    this._selectedLayers = new Array();

    // Currently Highlighted maplayers
    this._mapLayersHighlighted = new Array();

    // map domain object
    this._map = null;

    // Sandbox that handles communication
    this._sandbox = Oskari.clazz.create('Oskari.mapframework.sandbox.Sandbox', this);
    
    // bw comp support - this should be removed 
    if( !Oskari.$("sandbox" ) ) {
    	Oskari.$("sandbox", this._sandbox);
    }

    // array of services available
    this._services = [];
    this._servicesByQName = {};

    // Are we currently printing debug (as of 2012-09-24 debug by default false)
    this._debug = false;

    // is Ctrl key down
    this._ctrlKeyDown = false;

    // Allow multiple highlight layers
    this._allowMultipleHighlightLayers = false;

    this._availableRequestsByName = {};
    this._availableEventsByName = {};
    
    /**
     * @property externalHandlerCls
     * External Request handlers that bundles have registered are stored here
     * NOTE: only one request handler can be registered/request
     * NOTE: was static but moved to instance to enable multi sandbox configurations
     */
    this.externalHandlerCls = {

    };
},
{

    /**
     * @method init
     * Inits Oskari core so bundles can reference components/services through sandbox
     *
     * @param {Oskari.mapframework.service.Service[]} services
     *            array of services that are available
     * @param {Oskari.mapframework.enhancement.Enhancement[]} enhancements
     *            array of enhancements that should be executed before starting map
     */
    init : function(services, enhancements) {
        this.printDebug("Initializing core...");

        var sandbox = this._sandbox;

        // Store variables for later use
        this._services = services;
        // Register services
        if (services) {
            for (var s = 0; s < services.length; s++) {
                this.registerService(services[s]);
            }
        }

        // build up domain
        this.printDebug("Sandbox ready, building up domain...");
        this._map = Oskari.clazz.create('Oskari.mapframework.domain.Map');

        // run all enhancements
        this.enhancements = enhancements;
        this._doEnhancements(this.enhancements);

        this.printDebug("Modules started. Core ready.");
    },

    /**
     * @method dispatch
     * Dispatches given event to sandbox
     *
     * @param {Oskari.mapframework.event.Event}
     *            event - event to dispatch
     */
    dispatch : function(event) {
        this._sandbox.notifyAll(event);
    },

    /**
     * @property defaultRequestHandlers
     * @static
     * Default Request handlers
     * Core still handles some Requests sent by bundles. 
     * TODO: Request handling should be moved to apropriate bundles.
     * NOTE: only one request handler can be registered/request
     */
    defaultRequestHandlers : {
        'AddMapLayerRequest' : function(request) {
            this._handleAddMapLayerRequest(request);
            return true;
        },
        'RemoveMapLayerRequest' : function(request) {
            this._handleRemoveMapLayerRequest(request);
            return true;
        },
        'ShowMapLayerInfoRequest' : function(request) {
            this._handleShowMapLayerInfoRequest(request);
            return true;
        },
        'RearrangeSelectedMapLayerRequest' : function(request) {
            this._handleRearrangeSelectedMapLayerRequest(request);
            return true;
        },
        'ChangeMapLayerOpacityRequest' : function(request) {
            this._handleChangeMapLayerOpacityRequest(request);
            return true;
        },
        'ChangeMapLayerStyleRequest' : function(request) {
            this._handleChangeMapLayerStyleRequest(request);
            return true;
        },
        'HighlightMapLayerRequest' : function(request) {
            this._handleHighlightMapLayerRequest(request);
            return true;
        },
        'HighlightWFSFeatureRequest' : function(request) {
            this.handleHighlightWFSFeatureRequest(request);
            return true;
        },
        'HideMapMarkerRequest' : function(request) {
            this._handleHideMapMarkerRequest(request);
            return true;
        },
        'DimMapLayerRequest' : function(request) {
            this._handleDimMapLayerRequest(request.getMapLayerId());
            return true;
        },
        'CtrlKeyDownRequest' : function(request) {
            this._handleCtrlKeyDownRequest();
            return true;
        },
        'CtrlKeyUpRequest' : function(request) {
            this._handleCtrlKeyUpRequest();
            return true;
        },
        '__default' : function(request) {

            this.printWarn("!!!");
            this.printWarn("  There is no handler for");
            this.printWarn("  '" + request.getName() + "'");
            return false;
        }
    },

    /**
     * @method processRequest
     * Forwards requests to corresponding request handlers. 
     * @param {Oskari.mapframework.request.Request} request to forward
     * @return {Boolean} Returns true, if request was handled, false otherwise
     */
    processRequest : function(request) {

        var requestName = request.getName();
        var handlerFunc = this.defaultRequestHandlers[requestName];
        if (handlerFunc) {
            rv = handlerFunc.apply(this, [request]);
        } else {
            var handlerClsInstance = this.externalHandlerCls[requestName];
            if (handlerClsInstance) {
                 // protocol: Oskari.mapframework.core.RequestHandler.handleRequest(core)
                rv = handlerClsInstance.handleRequest(this, request);
            } else {
                handlerFunc = this.defaultRequestHandlers['__default'];
                rv = handlerFunc.apply(this, [request]);
            }

        }
        delete request;

        return rv;
    },

    

    /**
     * @method addRequestHandler
     * Registers a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        this.externalHandlerCls[requestName] = handlerClsInstance;
    },

    /**
     * @method removeRequestHandler
     * Unregisters a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    removeRequestHandler : function(requestName, handlerInstance) {
        if (this.externalHandlerCls[requestName] === handlerInstance)
            this.externalHandlerCls[requestName] = null;
    },

    /**
     * @method _getQNameForRequest
     * Maps the request name to the corresponding request class name
     * @param {String} name - name of the request
     * @return {String} request class name matching the given request name
     * @private
     */
    _getQNameForRequest : function(name) {
        var qname = this._availableRequestsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating request metadata...");
            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.request.Request');
            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableRequestsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating request metadata...");
            qname = this._availableRequestsByName[name];
        }

        return qname;
    },

    /**
     * @method getRequestBuilder
     * Gets a builder method for the request by request name
     * @param {String} name - name of the request
     * @return {Function} builder method for given request name or undefined if not found
     */
    getRequestBuilder : function(requestName) {
        var qname = this._getQNameForRequest(requestName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method _getQNameForEvent
     * Maps the event name to the corresponding event class name
     * @param {String} name - name of the event
     * @return {String} event class name matching the given event name
     * @private
     */
    _getQNameForEvent : function(name) {
        var qname = this._availableEventsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating event metadata...");

            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.event.Event');

            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableEventsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating event metadata...");
            qname = this._availableEventsByName[name];
        }

        return qname;
    },

    /**
     * @method getEventBuilder
     * Gets a builder method for the event by event name
     * @param {String} eventName - name of the event
     * @return {Function} builder method for given event name or undefined if not found
     */
    getEventBuilder : function(eventName) {
        var qname = this._getQNameForEvent(eventName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method disableDebug
     * Disables debug logging
     */
    disableDebug : function() {
        this._debug = false;
    },
    
     /**
     * @method enableDebug
     * Enables debug logging
     */
    enableDebug : function() {
        this._debug = true;
    },

    /**
     * @method printDebug
     * Prints given text to browser console
     *
     * @param {String} text message
     */
    printDebug : function(text) {
        if (this._debug && window.console != null) {
            if (window.console.debug != null) {
                console.debug(text);
            } else if (window.console.log != null) {
                console.log(text);
            }
        }
    },

    /**
     * Prints given warn text to browser console
     *
     * @param {String} text
     */
    printWarn : function(text) {
        if (window.console != null) {
            console.warn(text);
        }
    },

    /**
     * @method registerService
     * Registers given service to Oskari so bundles can get reference to it from sandbox
     *
     * @param {Oskari.mapframework.service.Service}
     *            service service to register
     */
    registerService : function(service) {
        this._servicesByQName[service.getQName()] = service;
        //this.registerFrameworkComponentToRuntimeEnvironment(service, service.getName());
    },

    /**
     * @method getService
     * Returns a registered service with given name
     *
     * @param {String} name
     * @return {Oskari.mapframework.service.Service}
     *            service or undefined if not found
     */
    getService : function(type) {
        return this._servicesByQName[type];
    },

    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap : function() {
        return this._map;
    },

    /**
     * @method getSandbox
     * Returns reference to sandbox
     *
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this._sandbox;
    },

    /**
     * @method getRequestParameter
     * Returns a request parameter from query string
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     * @param {String} name - parameter name
     * @return {String} value for the parameter or null if not found
     */
    getRequestParameter : function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1];
        }
    },

    /**
     * @method getObjectName
     * Returns Oskari event/request name from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} name
     */
    getObjectName : function(obj) {
        return obj["__name"];
    },
    /**
     * @method getObjectCreator
     * Returns Oskari event/request creator from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} creator
     */
    getObjectCreator : function(obj) {
        return obj["_creator"];
    },
    /**
     * @method setObjectCreator
     * Sets a creator to Oskari event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @param {String} creator
     */
    setObjectCreator : function(obj, creator) {
        obj["_creator"] = creator;
    },
    /**
     * @method copyObjectCreatorToFrom
     * Copies creator from objFrom to objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
     */
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        objTo["_creator"] = objFrom["_creator"];
    }
});
