/**
 * @class Oskari.mapframework.core.RequestHandler
 * A protocol class for registered request handlers. You need to implement a
 * class
 * with this protocol and register it to sandbox for a custom request handler.
 * <pre>
 * var requestHandler = Oskari.clazz.create(
 * 			'Oskari.mapframework.bundle.your-bundle.request.YourRequestHandler').
 * sandbox.addRequestHandler('NameForYourRequest', requestHandler);
 * </pre>
 *
 * In the above sandbox is reference to Oskari.mapframework.sandbox.Sandbox.
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
function() {
}, {
    /**
     * @method handleRequest
     * @param {Oskari.mapframework.core.Core} core
     * 		reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapframework.request.Request} request
     * 		implementing class for the request protocol
     */
    handleRequest : function(core, request) {
        throw "Implement your own";
    }
});

/**
 * @class Oskari.mapframework.core.Core
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
Oskari.clazz.define('Oskari.mapframework.core.Core',
/* constructor */

function() {

    /* Currently selected layers, array of MapLayer objects */
    this._selectedLayers = new Array();

    /* Currently Highlighted maplayers */
    this._mapLayersHighlighted = new Array();

    /* map object */
    this._map

    /* Sandbox that handles communication */
    this._sandbox = Oskari.clazz.create('Oskari.mapframework.sandbox.Sandbox', this);
    Oskari.$("sandbox", this._sandbox);

    /* array of services available */
    this._services
    this._servicesByQName = {};

    /* Are we currently printing debug (as of 2012-09-24 debug by default false)*/
    this._debug = false;

    /* Wizard url */
    this._mapPublisherWizardUrl

    /* whether to sniff usage or not */
    this._doSniffing = false;

    /* Our asynchronous wfs request tiler */
    this._wfsRequestTiler

    /* is Ctrl key down */
    this._ctrlKeyDown = false;

    /* is Map moving by keyboard or mouse */
    //this._mapMoving = false;

    /* Map of currently ongoing actions */
    this._ongoingActions = {};

    /* Shortcut to language service */
    //this._languageService;

    /* Allow multiple highlight layers */
    this._allowMultipleHighlightLayers = false;

    /* How many wfs tiles application is currently loading */
    this._currentlyFetchingWfsTiles = 0;

    /*
     * If published map is started using id in url, it is stored
     * here. Later it is used in sniffer.
     */
    this._mapIdFromUrl

    this._availableRequestsByName = {};
    this._availableEventsByName = {};
},

/* prototype */
{

    /**
     * @method init
     * Inits core
     *
     * @param {Oskari.mapframework.service.Service[]}services
     *            array of services that are available
     * @param enhancements
     *            array of enhancements that should be done to
     *            map before starting
     */
    init : function(services, enhancements) {
        this.printDebug("Initializing core...");

        var sandbox = this._sandbox;

        /* Create holder for runtime components */
        Oskari.$().mapframework.runtime.components = new Array();


        /* Register all important objects */
        this.registerFrameworkComponentToRuntimeEnvironment(this, "core");
        this.registerFrameworkComponentToRuntimeEnvironment(this._sandbox, "sandbox");

        /* Store variables for later use */
        this._services = services;
        /* Register services */
        if (services) {
            for (var s = 0; s < services.length; s++) {
                this.registerService(services[s]);
            }
        }

        /* build up domain */
        this.printDebug("Sandbox ready, building up domain...");
        this._map = Oskari.clazz.create('Oskari.mapframework.domain.Map');

        this.printDebug("Domain ready, creating UI...");

        /* run all enhancements */
        this.enhancements = enhancements;
        var me = this;
        me.start();
        this.dispatch(this.getEventBuilder('CoreInitFinishedEvent')());
    },
    /**
     * @method registerAsStateful
     * Registers given bundle instance to sandbox as stateful
     *
     * @param {Oskari.mapframework.service.Service}
     *            service service to register
     */
    registerService : function(service) {
        this._servicesByQName[service.getQName()] = service;
        this.registerFrameworkComponentToRuntimeEnvironment(service, service.getName());
    },

    start : function() {

        var enhancements = this.enhancements;

        /* UI is now complete, start all modules */
        this.printDebug("UI ready, running enhancements...");
        this.doEnhancements(enhancements);

        this.printDebug("Enhancements ready, starting modules...");

        /* Check for network sniffing */
        if (this._doSniffing) {
            // Find map id from url and use that later for log requests
            this._mapIdFromUrl = this.getRequestParameter("id");

            this.printDebug("Application configured for sniffing. Starting sniffer.");
            var snifferService = this.getService('Oskari.mapframework.service.UsageSnifferService');
            if (snifferService) {
                snifferService.startSniffing();
            }

        }

        if (this._wfsRequestTiler != null) {
            this._wfsRequestTiler.init();
        }
        this.printDebug("Modules started. Core ready.");
        this.dispatch(this.getEventBuilder('CoreReadyEvent')());
    },

    /**
     * Dispatches given event to sandbox
     *
     * @param {Object}
     *            event
     */
    dispatch : function(event) {
        this._sandbox.notifyAll(event);
    },

    /**
     * @property defaultRequestHandlers
     * @static
     * Default Request handlers
     *
     * NOTE: duplicate keys in this props produce unexpected
     * results at least when using WebKit
     *
     */
    defaultRequestHandlers : {
        'AddMapLayerRequest' : function(request) {
            this.handleAddMapLayerRequest(request);
            return true;
        },
        'ManageFeaturesRequest' : function(request) {
            this.handleManageFeaturesRequest(request);
            return true;
        },
        'RemoveMapLayerRequest' : function(request) {
            this.handleRemoveMapLayerRequest(request);
            return true;
        },
        'SearchRequest' : function(request) {
            this.handleSearchRequest(request);
            return true;
        },
        'ShowMapLayerInfoRequest' : function(request) {
            this.handleShowMapLayerInfoRequest(request);
            return true;
        },
        'RearrangeSelectedMapLayerRequest' : function(request) {
            this.handleRearrangeSelectedMapLayerRequest(request);
            return true;
        },
        'DisableMapKeyboardMovementRequest' : function(request) {
            this.handleDisableMapKeyboardMovementRequest(request);
            return true;
        },
        'EnableMapKeyboardMovementRequest' : function(request) {
            this.handleEnableMapKeyboardMovementRequest(request);
            return true;
        },
        'ChangeMapLayerOpacityRequest' : function(request) {
            this.handleChangeMapLayerOpacityRequest(request);
            return true;
        },
        'ChangeMapLayerStyleRequest' : function(request) {
            this.handleChangeMapLayerStyleRequest(request);
            return true;
        },
        'DrawPolygonRequest' : function(request) {
            this.handleDrawPolygonRequest(request);
            return true;
        },
        'DrawSelectedPolygonRequest' : function(request) {
            this.handleDrawSelectedPolygonRequest(request);
            return true;
        },
        'SelectPolygonRequest' : function(request) {
            this.handleSelectPolygonRequest(request);
            return true;
        },
        'ErasePolygonRequest' : function(request) {
            this.handleErasePolygonRequest(request);
            return true;
        },
        'UpdateHiddenValueRequest' : function(request) {
            this.handleUpdateHiddenValueRequest(request);
            return true;
        },
        'DeactivateAllOpenlayersMapControlsButNotMeasureToolsRequest' : function(request) {
            this.handleDeactivateAllOpenlayersMapControlsButNotMeasureToolsRequest(request);
            return true;
        },
        'DeactivateAllOpenlayersMapControlsRequest' : function(request) {
            this.handleDeactivateAllOpenlayersMapControlsRequest(request);
            return true;
        },
        'HighlightMapLayerRequest' : function(request) {
            this.handleHighlightMapLayerRequest(request);
            return true;
        },
        'HighlightWFSFeatureRequest' : function(request) {
            this.handleHighlightWFSFeatureRequest(request);
            return true;
        },
        'RemovePolygonRequest' : function(request) {
            this.handleRemovePolygonRequest(request);
            return true;
        },
        'HideWizardRequest' : function(request) {
            this.handleHideWizardRequest(request);
            return true;
        },
        'ShowWizardRequest' : function(request) {
            this.handleShowWizardRequest(request);
            return true;
        },
        'ShowNetServiceCentreRequest' : function(request) {
            this.handleShowNetServiceCentreRequest(request);
            return true;
        },
        'HideNetServiceCentreRequest' : function(request) {
            this.handleHideNetServiceCentreRequest(request);
            return true;
        },
        'NetServiceCenterRequest' : function(request) {
            this.handleNetServiceCenterRequest(request);
            return true;
        },
        'HideMapMarkerRequest' : function(request) {
            this.handleHideMapMarkerRequest(request);
            return true;
        },
        'UpdateNetServiceCentreRequest' : function(request) {
            this.handleUpdateNetServiceCentreRequest(request);
            return true;
        },
        'ActionStartRequest' : function(request) {
            this.handleActionStartRequest(request);
            return true;
        },
        'ActionReadyRequest' : function(request) {
            this.handleActionReadyRequest(request);
            return true;
        },
        'DimMapLayerRequest' : function(request) {
            this.handleDimMapLayerRequest(request);
            return true;
        },
        'CtrlKeyDownRequest' : function(request) {
            this.handleCtrlKeyDownRequest(request);
            return true;
        },
        'CtrlKeyUpRequest' : function(request) {
            this.handleCtrlKeyUpRequest(request);
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
     * Handles all requests. Returns true, if request was
     * handled, false otherwise
     */
    processRequest : function(request) {

        var requestName = request.getName();
        var handlerFunc = this.defaultRequestHandlers[requestName];
        if (handlerFunc) {
            rv = handlerFunc.apply(this, [request]);
        } else {
            var handlerClsInstance = this.externalHandlerCls[requestName];
            if (handlerClsInstance) {

                /*
                 * protocol:
                 * Oskari.mapframework.core.RequestHandler
                 * .handleRequest(core)
                 */
                rv = handlerClsInstance.handleRequest(this, request);

            } else {
                handlerFunc = this.defaultRequestHandlers['__default'];
                rv = handlerFunc.apply(this, [request]);
            }

        }
        delete request;

        return rv;
    },

    /*
     * one handler / request ?
     */
    externalHandlerCls : {

    },

    /*
     * one handler / request ?
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        this.externalHandlerCls[requestName] = handlerClsInstance;
    },

    /*
     * one handler / request ?
     */
    removeRequestHandler : function(requestName, handlerInstance) {
        if (this.externalHandlerCls[requestName] === handlerInstance)
            this.externalHandlerCls[requestName] = null;
    },

    getQNameForRequest : function(name) {
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

        // this.printDebug("#!#!# ! map request to class " + name
        // + " -> " + qname);

        return qname;
    },

    /*
     * Var args
     */
    createRequest : function() {

        arguments[0] = this.getQNameForRequest(arguments[0]);

        var request = Oskari.clazz.createArrArgs(arguments);

        return request;
    },

    getRequestBuilder : function() {
        var qname = this.getQNameForRequest(arguments[0]);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    getQNameForEvent : function(name) {
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

        // this.printDebug("#!#!# ! map event to class " + name
        // + " -> " + qname);

        return qname;
    },

    /*
     * Var args
     */
    createEvent : function() {

        arguments[0] = this.getQNameForEvent(arguments[0]);

        var request = Oskari.clazz.createArrArgs(arguments);

        return request;
    },

    getEventBuilder : function() {
        var qname = this.getQNameForEvent(arguments[0]);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method disableDebug
     * Disables debugging
     */
    disableDebug : function() {
        this._debug = false;
    },
    
     /**
     * @method enableDebug
     * Disables debugging
     */
    enableDebug : function() {
        this._debug = true;
    },

    /**
     * @method enableMapMovementLogging
     * Enables map movement logging
     */
    enableMapMovementLogging : function() {
        this._doSniffing = true;
    },

    /**
     * @method printDebug
     * Prints given text to console
     *
     * @param {String}
     *            text message
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
     * Prints given warn text to console
     *
     * @param {Object}
     *            text
     */
    printWarn : function(text) {
        if (window.console != null) {
            console.warn(text);
        }
    },

    getService : function(type) {

        var svc = this._servicesByQName[type];
        if (svc)
            return svc;
        /*
         * for(var i=0; i<this._services.length; i++) { if
         * (this._services[i] instanceof type) { return
         * this._services[i]; } }
         */

        throw "Cannot find service with type '" + type + "'";
    },

    /**
     * Returns module with given name that is registered to
     * sandbox
     *
     * @param {Object}
     *            name
     */
    findRegisteredModule : function(name) {
        return this._sandbox.findRegisteredModule;
    },

    /**
     * Returns map object
     */
    getMap : function() {
        return this._map;
    },

    /**
     * Registers given component to runtime dom tree, so that it
     * can be accessed later
     *
     * @param {Object}
     *            component
     * @param {Object}
     *            name
     */
    registerFrameworkComponentToRuntimeEnvironment : function(component, name) {
        this.printDebug("registering framework component '" + name + "' to runtime");
        Oskari.$().mapframework.runtime.components[name] = component;

    },

    unregisterFrameworkComponentFromRuntimeEnvironment : function(component, name) {
        this.printDebug("unregistering framework component '" + name + "' from runtime");
        Oskari.$().mapframework.runtime.components[name] = null;

    },

    /**
     * Returns sandbox
     */
    getSandbox : function() {
        return this._sandbox;
    },

    /**
     * How many WFS tiles are currently being fetched
     */
    getCountOfWfsTilesBeingFetched : function() {
        return this._currentlyFetchingWfsTiles;
    },

    /**
     * Check if arrays items are the same
     *
     * @param {Object}
     *            checkedArray
     */
    checkArrayIfTheseAreSame : function(checkedArray) {
        if (checkedArray.length > 1) {
            var firstArrayItem = checkedArray[0];
            for (var i = 1; i < checkedArray.length; i++) {
                if (checkedArray[i] != firstArrayItem && checkedArray[i] != null) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },

    /**
     * Schedules a rearrange
     */
    scheduleMapLayerRearrangeAfterWfsMapTilesAreReady : function() {
        // TODO:requestiler changed to service
        // this._wfsRequestTiler.scheduleMapLayerRearrangeAfterWfsMapTilesAreReady();
    },

    /**
     * Get language for application
     */
    getLanguage : function() {
        return Oskari.getLang();
        //this._languageService.getLanguage();
    },

    /** *********************************************************
     * Get browser window size.
     */
    getBrowserWindowSize : function() {
        // var height = jQuery(window).height();
        if (jQuery.browser.opera && window.innerHeight != null) {
            var height = window.innerHeight;
        }
        var width = jQuery(window).width();

        var size = {};
        size.height = jQuery(window).height();
        // height;
        size.width = width;

        this.printDebug("Got browser window size is: width: " + size.width + " px, height:" + size.height + " px.");

        return size;
    },

    /**
     * Returns a request parameter
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
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
     * method previously known as jQuery
     */
    domSelector : function(arg) {
        return jQuery(arg);
    },

    /**
     * request / event helpers
     */
    getObjectName : function(obj) {
        return obj["__name"];
    },
    getObjectCreator : function(obj) {
        return obj["_creator"];
    },
    setObjectCreator : function(obj, creator) {
        obj["_creator"] = creator;
    },
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        objTo["_creator"] = objFrom["_creator"];
    }
});
